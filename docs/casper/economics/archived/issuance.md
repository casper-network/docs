# Issuance

Issuance provides a base level of payments for validators, so that they are compensated for their work even if there is not a lot of demand for using the network. By issuing new CSPR for validators, we ensure that the network is secured by sufficient stake, even without the transaction fees.

CSPR is issued at a fixed rate and distributed to validators in proportion to their stake. This is analogous to block rewards in Proof of Work blockchains, except for a couple of differences:

-   The growth of CSPR supply is exponential instead of linear.
-   Issuance takes into account slashed CSPR.

If there were no slashing, we would have computed block rewards according to the following formula

```
supply(i) = initial_supply * (1 + issuance_rate)^(i / ticks_per_year)
```

where `i = 1, 2, ...` and so on is the era's index, `initial_supply` is the number of CSPR at the Mainnet launch, `issuance_rate` is the annual rate at which new CSPR is minted, and `ticks_per_year = 365*24*60*60*1000 = 31_536_000_000`.

However, we have to factor in slashed tokens too when we issue new CSPR. To this end, we keep track of minted and slashed CSPR at the end of each era:

```
supply(0) = initial_supply
supply(i+1) = supply(i) + rewards(i) - slashings(i)
```

where `rewards(i)` is the total CSPR minted per issuance during era `i`, and `slashings(i)` is the total CSPR slashed during era `i`. All of these quantities can be derived objectively from the history of the global state.

We introduce _round issuance rate_

```
round_issuance_rate = pow(1 + round_issuance_rate, 2^minimum_round_exponent / ticks_per_year) - 1
```

which is the yearly issuance rate adjusted to a single round, whose length is defined by the protocol parameter `minimum_round_exponent = 14`. This gives us a round length of roughly 16 seconds.

Finally, the base round reward is computed as

```
base_round_reward(i) = round_seigniorage_rate * supply(i)
```

This value gives us the maximum amount of CSPR that the validators can receive from a proposed block.

## Reward Distribution {#reward-distribution}

Validators are rewarded for proposing and finalizing blocks, according to their performance. The concept of weight is crucial for understanding reward distribution:

-   **Weight:** A validator's bonded stake, used in consensus.
-   **Assigned weight of a block/round:** The total stake of validators that are scheduled to participate on a block.
-   **Participated weight of a block/round:** The total stake of validators that actually end up participating. Here, _participating_ means sending messages to finalize a block before their respective rounds end.

To determine the validators' eligibility to receive rewards from a proposed block, we look at **on-time finalization (OTF)**. Validators should finalize blocks on time, by sending required messages before their respective rounds end.

### Participation Schedule {#participation-schedule}

The schedule with which validators send messages are determined by the validators' rounds, which are in turn determined by their round exponents. A validator with the round exponent `n` has to participate in rounds that repeat every `2^n` ticks.

Each validator is assessed according to their own round exponent. All assigned validators become eligible to receive rewards as long as the block gets finalized with messages that were sent within each validator's own round.

We dictate a minimum assigned weight for all rounds. Rounds that meet the requirement are said to be _feasible_, and the ones that do not are said to be _infeasible_. Blocks proposed in infeasible rounds do not receive any rewards.

### Reward Eligibility {#reward-eligibility}

Once a block has been proposed and enough time has passed, the history of messages can be examined to detect whether the block was indeed finalized on time, according to the conditions given above.

-   If the block is _not_ finalized on time, validators do not receive any rewards. The tokens allocated for the block are simply burned.
-   If the block is finalized on time, assigned validators share the reward pro rata, regardless of whether they have sent messages or not.
