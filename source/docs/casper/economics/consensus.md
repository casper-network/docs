# Consensus Economics

Highway consensus is a continuous, trust-less process where a fixed set of validators engage in scheduled communication to advance the linear chain of finalized blocks, representing the history of changes to the global state of the blockchain. The fixed set of validators may change at each era boundary. The economics of this layer revolve around validator selection and incentivization of participation according to the schedule.

## Entry {#entry}

After genesis, the system selects a set of validators using a stake auction process. The auction takes place in the last block of an era, also called a switch block. An auction contract governs the validator selection process, and a _chainspec_ configuration file specifies a few key parameters:

-   The `auction_delay` specifies the amount of time that needs to pass before the system enables a new set of validators. For example, the _auction_delay_ is 1 for Mainnet. Therefore, after a delay of 1 era, the winning validators become the validating set for the new era.
-   The `validator_slots` parameter specifies how many validators can win an auction. The auction selects a fixed number of validators based on their highest bids.

### Bids {#bids}

Each bid is a collection of tokens from a prospective or current validator and its delegators, considered in the auction as a single total. Bids and delegations can increase freely, but withdrawals are subject to an unbonding period governed by the `unbonding_delay` chainspec parameter. Tokens that are in the unbonding period are not part of the sum total considered in the auction. Consequently, the exact amount of the bid, which translates into protocol weight for winning validators, can vary within an era. The bids are visible in the switch block that determines the winners.

Each bid contains a delegation rate and activity status. The delegation rate can change at any time. Both of these properties are described further in this document.

### Delegation {#delegation}

Delegation allows third parties to participate in consensus by adding weight to their preferred validators. Rewards received by validators are distributed in proportion to tokens bid and delegated. The current or prospective validator responsible for the bid receives a portion of the delegator rewards set by the delegation rate.

Currently, delegation is unrestricted. Please visit [Delegation details](/economics/delegation) page to check more about delegation cost and related details.

## Incentives {#incentives}

Correct operation of the Highway protocol requires the economics of the platform to discourage equivocation for safety and incentivize participation for liveness. Participation consists of on-time block proposals and timely responses to block proposals.

Safety may be incentivized through slashing for equivocation. This feature is currently disabled but may be reactivated in the future.

The network incentivizes participation by scaling rewards for on-time proposals and responses, taking into account the speed of finalizing blocks. All rewards are added directly to the corresponding bids and delegations.

### Participation {#participation}

Issuance of new tokens and their distribution to validators incentivizes work even under low transaction load.

CSPR is issued at a fixed rate and distributed to validators (and, indirectly, delegators) in proportion to their stake. This is analogous to block rewards in Proof-of-Work blockchains, outlining the following:

-   The growth of CSPR supply is exponential
-   Issuance takes into account slashed CSPR

With slashing disabled, we can compute block rewards starting with the formula below, where we have these parameters:

-   `i` - the era's index as a positive integer \[0, 1, 2, \..., n\]
-   `initial_supply` - the number of CSPR at genesis
-   `issuance_rate` - the annual rate at which new CSPR tokens are minted
-   `ticks_per_year` - the number of milliseconds in a year equal to 31,536,000,000

```
supply(i) = initial_supply * (1 + issuance_rate)^(tick_at_era_start(i) / ticks_per_year)
```

We introduce the _round issuance rate_ (corresponding to the chainspec parameter `round_seigniorage_rate`) with this formula:

```
round_issuance_rate = (1 + issuance_rate)^(2^minimum_round_exponent / ticks_per_year) - 1
```

The _round issuance rate_ is the annual issuance rate adjusted to a single round of length determined by the chainspec parameter `minimum_round_exponent`. For illustration, an exponent of 14 corresponds to a round length of roughly 16 seconds.

Finally, the base round reward is computed as:

```
base_round_reward(i) = round_issuance_rate * supply(i)
```

This value gives us the maximum amount of CSPR that the validators can collectively receive from a proposed block.

#### Distribution {#distribution}

Validators receive tokens for proposing and finalizing blocks according to their performance. The concept of weight is crucial for understanding this distribution scheme:

-   **Weight:** A validator's bonded stake, used in consensus
-   **Assigned weight of a block/round:** The total stake of validators scheduled to participate in a block
-   **Participated weight of a block/round:** The total stake of validators that end up participating or sending messages to finalize a block before the end of their respective round

To determine eligibility, we look at **on-time finalization (OTF)**. Validators should finalize blocks on time by sending required messages before the end of their respective round.

Switch blocks are not visible to the issuance calculation (as this calculation is performed in the switch block itself for each era), and, consequently, no tokens are issued for switch blocks.

##### Participation schedule {#participation-schedule}

The participation schedule is segmented into rounds, which are allocated dynamically according to the validators' exponents and a deterministic (randomized at era start) assignment of validators to milliseconds of an era. Thus, a validator with the round exponent `n` must participate in rounds that repeat every `2^n` ticks.

Each validator is assessed according to its round exponent. All assigned validators become eligible to receive tokens as long as the block gets finalized with messages sent within each validator's round.

##### Eligibility {#eligibility}

Once a block has been proposed and enough time has passed, the history of protocol messages can be examined to detect whether the block was finalized on time, according to the conditions given above. If the block was _not_ finalized on time, validators receive a fraction of the expected tokens, governed by the `reduced_reward_multiplier` chainspec parameter. If the block was finalized on time, assigned validators share the reward proportionally to their stake, regardless of whether they have sent messages or not.

### Inactivity {#inactivity}

Validators who send no messages during an entire era are marked as inactive and cease participating in the auction until they send a special deploy that reactivates their bid.

### Slashing {#slashing}

Please review our [Equivocator Policy](https://github.com/casper-network/ceps/blob/master/text/0038-equivocator-policy.md). We are currently conducting research into the utility of slashing as an incentive mechanism.

## Founding validators {#founding-validators}

Founding validators are subject to token lock-up, which prevents them from withdrawing any tokens from their bids for 90 days, then releases their genesis bid tokens in weekly steps, linearly, over an additional 90 days.
