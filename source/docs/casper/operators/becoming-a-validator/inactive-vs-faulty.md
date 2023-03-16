import useBaseUrl from '@docusaurus/useBaseUrl';

# Inactive vs. Faulty Validator Nodes

This page describes the differences between a validator node being considered inactive or faulty.

In the last block of each era _N_, the consensus algorithm checks whether there are _any_ messages from your validator node in that era that have been received by most of the other validators. Only if there is no such message does your node get marked as **inactive** in that block.

Similarly, the consensus algorithm checks whether any two messages from your validator node contradict each other. If that is the case, it gets marked as **faulty** in that block. Usually, that means:

* If you got marked as **inactive**, your node probably crashed or was offline for the duration of one whole era, i.e., at least from when the era began until the era's last block was proposed.
* If you got marked as **faulty**, you were probably running two nodes with the same validator key, or you restarted a node during the era and deleted its unit file.

The auction contract is run when the block gets executed, as always at the end of the era. But if you were faulty or inactive, you are now evicted and don't participate in the auction anymore. You also don't receive any rewards for era _N_. The auction determines the validator set for the era after the next (because `auction_delay` is set to `1` on mainnet), i.e., for era _N + 2_. That means you will still be a validator (with a weight proportional to your stake) in the next era, _N + 1_, but after that, you will not be a validator anymore, and your slot will be given to the next highest bidder.

And even in the next era, _N + 1_:
* If you are inactive, you won't be assigned leader slots or be allowed to propose any blocks. Your node will only vote on other proposers' blocks if it returns online and can still receive rewards. But, even if it comes back online in era _N + 1_, it will get evicted for being offline in era _N_.
* If you are faulty, all your messages will be ignored. You won't be able to propose blocks or vote for them and won't receive block rewards.

In both cases, you remain evicted until you reactivate your bid, as described [here](./recovering.md).