# The Highway Consensus Protocol

## What is Consensus?

Consensus is the backbone of any distributed network. The decentralized nature of a blockchain requires a method through which disparate entities can come to an agreement on one immutable truth. This involves determining validity of transactions, resolving address conflicts, and finalizing blocks to be added to the network. A consensus protocol is a set of mechanisms and rules within the distributed network with which all actors must comply.
These rules outline the type of messages sent over the network, when they are sent and how to process them. Within the context of a blockchain, the consensus protocol decides which blocks are added to the chain, and the order by which they are added. This determines the state of the distributed ledger and ensures that all nodes agree on that state.
The consensus mechanism will determine how a blockchain addresses the following two main characteristics:

*   **Safety** - All honest nodes eventually agree on the final value. The system is setup in a way where no two honest nodes will report two different blocks at the same height of the blockchain.

*   **Liveness** - The system continues running and adds new block to the chain indefinitely.

Casper networks use a consensus protocol known as *Highway*.

## What is Highway?

Highway is a specialized version of the [Proof-of-Stake](/glossary/P/#proof-of-stake) model that builds on the Correctness-by-Construction, or [CBC Casper](/glossary/C/#cbc) consensus protocol. The protocol uses a decentralized network of [nodes](/glossary/N/#node), either bonded or unbonded. Nodes that actively participate in the process of consensus are known as [Validator Nodes](/glossary/V/#validator).

Highway is based on a partially synchronized Byzantine Fault Tolerant protocol which asserts that communication between nodes becomes eventually synchronous. Traditional consensus protocols operate on a binary block finality system. Highway instead presumes that a given fraction of nodes must be dishonest to result in block reversion.

The system will continue to function, so long as the amount of faulty or dishonest nodes does not exceed one-third of the total number of nodes in the network. Nodes that are not faulty are *honest* nodes. Further, the tolerance of a given node is configurable by the node's operator, allowing some nodes to reach finality faster, while others may require a higher level of confidence. This adds flexibility to the system when compared against prior implementations.

Highway assumes that even blocks that intend to act dishonestly will avoid deviating from the protocol for prolonged periods of time and actively work to finalize blocks. In most cases, the system can assume that basically all nodes will actively collaborate to achieve consensus. Therefore, stronger-than-average finality guarantees occur during periods where these nodes are acting honestly. A block's fault tolerance increases beyond one-third as the protocol continues. If all validators are honest, it approaches 100%.

## Endorsements

Endorsements are a type of message within the Highway protocol, attesting that a validator has not witnessed an equivocation from another node. When a node witnesses an equivocation, it enters *cautious mode* and broadcasts endorsements for all units that have not equivocated.

Within the endorsement schema that Highway uses, a node caught equivocating is added to the equivocator list. Within several rounds, no honest validators will still cite units from the dishonest. Therefore, any new honest units created after this point will not naively cite units from the equivocating dishonest node.

## Dynamic Round Length

Within the Highway protocol, the length of a round is determined dynamically to ensure a suitable amount of time for nodes to gossip all messages through several round trips with honest validators. This ensures that the system maintains liveness by ensuring that all messages are properly gossiped, while also maintaining a timely addition of blocks to the chain.

## Eras

The concept of *eras* allows Highway to reduce the overall operational storage requirements of participating nodes. A new instance of Highway runs every 1,000 blocks, which allows for two benefits:

* **Data Reduction** - Older "metadata" used in finalizing certain blocks is no longer useful and can be removed without compromising the immutability of the data stored on the blockchain.

* **Banning Equivocators** - Dishonest nodes caught equivocating in a previous era are banned from participating in new eras. This allows honest nodes to begin a new era in the *relaxed mode*, no longer needing to send endorsements due to past equivocations.

In any given era, node operators will bid to become validators that will participate in the consensus mechanism for the next era. Each time slot within the era will also determine a lead validator. The lead validator proposes new blocks to be added to the chain, which are then gossiped among the network's nodes. These messages show an implicit preference for the lead validator's block due to the GHOST (Greedy Heaviest Observed Sub-Tree) rule. Once this process reaches critical mass, with a sufficient interconnected pattern of messages, it becomes impossible to switch to another block. The selected block is then considered finalized and added to the chain.

The final block of an era is a *switch block* and forms the initial state of the next era. A new Highway instance begins with the new era, using information contained within the *switch block* and a new potential set of validators. More details on the auction process to determine an era's validators can be found within the [Consensus Economics](/economics/consensus/) page.

## Finality

Finality occurs when the network can be sure that a block will not be altered, reversed, or cancelled after addition to the chain. This occurs via consensus, and as all transactions happen within a block, it allows for confirmation that a transaction cannot be changed. Highway uses two distinct types of finality:

* **Deterministic Finality** - This type of finality occurs when a transaction finalizes immediately upon addition to a block. This type of finality is beneficial, as it results in faster block times and increased certainty of finality.

* **Economic Finality** - This type of finality imposes economic costs on malicious actions taken by validators. Validators that are equivocators risk their entire stake being [slashed](/staking/#slashing/). Therefore, honest nodes receive rewards for their participation, while equivocating nodes risk considerable loss for acting maliciously.

Highway's criterion for detecting finality is the presence of a pattern of messages called a `Summit`. It is an improvement over previous CBC Casper finality criteria which were more difficult to attain, and computationally more expensive to detect.
