# The Highway Consensus Protocol

## What is Consensus?

Consensus is the backbone of any distributed network. The decentralized nature of a blockchain requires a method through which disparate entities can come to an agreement on one immutable truth. This involves determining validity of transactions, resolving conflicts, and finalizing blocks to be added to the chain by the network. A consensus protocol is a set of mechanisms and rules within the distributed network with which all actors must comply.

These rules outline the type of messages sent over the network, when they are sent and how to process them. Within the context of a blockchain, the consensus protocol decides which blocks are added to the chain by the network, and the order by which they are added. This determines the state of the distributed ledger and ensures that all nodes agree on that state.

The consensus mechanism will determine how a blockchain meets the following requirements:

*   **Safety** - All honest nodes eventually agree on the final value. The system is setup in a way where no two honest nodes will report two different blocks at the same height of the blockchain.

*   **Liveness** - The system continues running and adds new blocks to the chain indefinitely.

Casper networks use a consensus protocol known as *Highway*.

## How does the Casper Network use Highway?

The Casper Network is a [Proof-of-Stake](/glossary/P/#proof-of-stake) network, in which the on-chain auction contract determines validators that participate in Highway. The protocol uses a decentralized network of [nodes](/glossary/N/#node), either bonded or unbonded. Nodes that actively participate in the process of consensus must stake CSPR tokens and are known as [Validator Nodes](/glossary/V/#validator). The top 100 bidders are selected through the auction contract every era, to act as validators in the era after the next (Current Era + 2). Nodes with a greater stake in the success of the network have a greater weight in reaching consensus. Highway does not necessitate a Proof-of-Stake method of choosing validators and could theoretically be used alongside a private network with a different model.

These validators run a Byzantine Fault Tolerant protocol, currently Highway, which requires a partially synchronous network. The system will continue to function, so long as the amount of faulty or dishonest nodes does not exceed one-third of the total number of nodes in the network. Nodes that are not faulty are *honest* nodes. In most cases, the system can assume that more than two-thirds of all nodes will actively collaborate to achieve consensus. Therefore, stronger-than-average finality guarantees occur during periods where all nodes are acting honestly. A block's fault tolerance increases beyond one-third as the protocol continues. If all validators are honest, it approaches 100%.

## Dynamic Round Length

Within the Highway protocol, the length of a round is determined dynamically to ensure a suitable amount of time for nodes to gossip all messages through several round trips with honest validators. This ensures that the system maintains liveness by ensuring that all messages are properly gossiped, while also maintaining a timely addition of blocks to the chain.

## Eras

The concept of *eras* allows Highway to reduce the overall operational storage requirements of participating nodes while also rotating validators. A new instance of Highway runs every two hours or approximately 220 blocks, depending on current network metrics. This allows for two benefits:

* **Data Reduction** - Older "metadata" used in finalizing certain blocks is no longer useful and can be removed without compromising the immutability of the data stored on the blockchain.

* **Banning Equivocators** - Dishonest nodes caught equivocating in a previous era are banned from participating in new eras. This allows honest nodes to begin a new era in the *relaxed mode*, no longer needing to send endorsements due to past equivocations.

* **Rotating Validators** - Bonded nodes bid on validator spots each era, with the top 100 highest bidders becoming validators for the era after next (`N`+2).

In any given era, node operators will bid to become validators that will participate in the consensus mechanism for the era after next (`N`+2). Each time slot within the era will also determine a lead validator. The lead validator proposes new blocks to be added to the chain, which are then gossiped among the network's nodes. These messages show an implicit preference for the lead validator's block due to the GHOST (Greedy Heaviest Observed Sub-Tree) rule. Once this process reaches critical mass, with a sufficient interconnected pattern of messages, it becomes impossible to switch to another block. The selected block is then considered finalized and added to the chain.

The final block of an era is a *switch block* and forms the initial state of the next era. A new Highway instance begins with the new era, using information contained within the *switch block* and a new potential set of validators. More details on the auction process to determine an era's validators can be found within the [Consensus Economics](/economics/consensus/) page.

## Finality

Finality occurs when the network can be sure that a block will not be altered, reversed, or cancelled after addition to the chain. This occurs via consensus, and as all transactions happen within a block, it allows for confirmation that a transaction cannot be changed. After finality, it would require greater than 1/3 of all validators to double-sign in order to cause disparity between nodes. In this event, the network would shut down and require a manual restart.

On a Casper network, a transaction finalizes alongside the finalizing of the block in which it is included. Validators that equivocate risk eviction, in which the network removes them from the validator set. Therefore, honest nodes receive rewards for their participation, while equivocating nodes risk loss of revenue for acting maliciously.

Highway's criterion for detecting finality is the presence of a pattern of messages called a `Summit`. It is an improvement over previous CBC Casper finality criteria which were more difficult to attain, and computationally more expensive to detect.
