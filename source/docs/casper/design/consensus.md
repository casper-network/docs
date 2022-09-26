# Casper Highway Protocol

Distributed networks need a mechanism to reach an agreement on the present state of the network. In Blockchain, these agreements are achieved through [consensus](/glossary/C/#consensus) protocols. These protocols determine the validity of transactions, address conflicts, and finalize the blocks to be added to the network. The ultimate motive of consensus is to reach an irreversible state of the network. Many blockchain platforms share similar components and characteristics to implement the consensus mechanism whereas the underlying algorithms and decision strategies are unique to each platform.

A consensus protocol consists of a set of message types, communication and processing rules, and a criterion for detecting that agreement has been reached. We call nodes that actively participate in the protocol *validator nodes*.

Byzantine fault tolerant (BFT) protocols function even if some nodes (including possibly validator nodes) are faulty in any way, e.g. if they crash or are taken over by an adversary. Nodes that are not faulty are called *honest*.

In general, a consensus mechanism addresses the following two main *characteristics*:

- *Safety*: All honest nodes eventually agree on the value, i.e. no two honest nodes will report two different blocks at the same height of the blockchain.
- *Liveness*: The system keeps running and new blocks continue to be added to the chain indefinitely.

Casper Highway addresses all the above characteristics along with a set of other [improved implementations](/design/consensus/#key-improvements) to serve the practical use cases with wide scalability and efficiency. Highway is operational in the Casper production environment since March 2021 with publicly traded CSPR tokens and has passed the necessary security audits.

You can study deep on the consensus-related algorithms and mathematical theorems in the [Casper Highway Whitepaper](https://arxiv.org/pdf/2101.02159.pdf). 

## What is Highway?

Highway is the CasperLabs invented [Proof-of-Stake](/glossary/P/#proof-of-stake) (PoS) model consensus protocol that is based on the [CBC (Correctness-by-Construction) Casper](https://docs.casperlabs.io/glossary/C/#cbc) approach. This protocol fulfills the key gaps in CBC Casper by practically implementing the finality, flexibility, and liveness features of the network. Casper Highway is designed based on partially synchronized [Byzantine Fault](/glossary/B/#byzantine-fault) Tolerant protocol which asserts that communication between nodes becomes eventually synchronous and that no more than a given fraction of nodes (presumably 1/3rd) are dishonest and may arbitrarily violate the protocol.

Casper Highway emphasizes three key improvements over CBC Casper:

- [***Finality***](./#finality) - Guarantee that the committed transactions remain unchanged in the network.
- [***Flexibility***](./#flexibility) - Ability to configure nodes on different levels allowing more flexibility on the consensus mechanism.
- [***Liveness***](./#liveness) - Ability to keep running the network through conflicting situations without abruptly shutting down.

Casper Highway provides provably implemented solutions to achieve the above features with the accompanied PoS protocol, partially synchronized BFT model, and combined finality approaches. 

## Why Highway?

Highway addresses several pain points that most blockchain platforms encounter when reaching consensus. [Hyperledger Fabric](https://www.ibm.com/topics/hyperledger) is a survivor of node crashes, but, it won't outlive an adversary attack. As an upgrade, [Proof-of-Work](/glossary/P/#proof-of-work) and [Proof-of-Stake](/glossary/P/#proof-of-stake) protocols implement the [Byzantine Fault Tolerant](/glossary/B/#byzantine-fault) (BFT) protocol to reach consensus that tolerates crashes and attacks. However, a PoW protocol is significantly resource-intensive with less consistent and lengthier computations. Despite PoS conquering these limitations with faster transfers and network consistency, it is unable to address the limitations on the liveness, safety, and flexibility of the network nodes. 

Thus, CasperLabs has innovated the Highway protocol as the next-generation improved Proof-of-Stake algorithm to overcome the limitations of primary CBC Casper and classic Byzantine fault tolerance protocols. Highway's key improvements tractable finality, liveness proof, and flexibility offer the following main benefits over other protocols.

- Reduced impact of execution on throughput because blocks are only executed after consensus has been reached.
- Enhance efficiency through maximized throughput with faster block times.
- Loosely coupled and independent consensus mechanism which increases the network efficiency compared to other PoS-based protocols.
- Reduced computations when compared to PoW and classic PoS protocols.
- Added hand-shakes to ensure higher certainty of finality.
- High toleration on an optimal number of faults in the network with an assumption that only a certain percentage of nodes are byzantine. 

## How does Highway works?

Highway operates on a time-slot basis. There is one Highway instance available for a defined period, which is called an [era](/glossary/E/#era). In Casper, anyone running a node is an [operator](/glossary/O/#operator). An operator whose [bid](/economics/consensus/#bids) has won a validator slot in the [auction](/glossary/A/#auction) for a specific era is a [validator](/glossary/V/#validator) in that era. Node validators are the main characters who perform the consensus mechanism. The Casper platform appoints a lead validator and a fixed set of other validators to run the consensus protocol.  

The lead validator proposes the block to be added to the network. All validators then repeatedly send messages acknowledging the block, as well as the other validators' messages. These messages implicitly signal a preference for that block, according to the GHOST rule. Once a sufficiently interconnected pattern of messages has been produced, it becomes impossible for the GHOST rule to switch away from that block. Such a pattern is called a [Summit](./#summit-the-highway-protocols-way-to-finality). The selected block is then considered finalized and appended to the chain. Usually, in Casper Mainnet, an era spans two hours.

When an era completes, the last block of the previous era is taken as the initial state of the next era and a new Highway instance is initialized potentially with a different set of validators. The validator set is selected using a [bidding](/economics/consensus/#bids) mechanism. Refer to the [consensus economics](/economics/consensus/) section to learn about the factors related to the auction process, bidding, delegation, and incentive details.

## Key Improvements
Casper Highway protocol implements three critical properties over CBC Casper. These are `Finality`, `Flexibility`, and `Liveness`. CasperLabs has proposed specific implementations to achieve these key features.

### Finality
Finality is the guarantee that a well-established block will not be altered, reversed, or cancelled after being added to the blockchain network. Finality seals the transaction completeness. Since a block contains all the transactions, the sender is assured that the transaction cannot be arbitrarily changed or reversed. While there are several [types of finality](https://medium.com/mechanism-labs/finality-in-blockchain-consensus-d1f83c120a9a) when finalizing a block, Casper Highway achieves finality using a combination of deterministic and economical approaches.


`Deterministic finality` occurs when a transaction is immediately considered to be final at the first block depth. This is based on the [practical Byzantine Fault Tolerant](https://www.geeksforgeeks.org/practical-byzantine-fault-tolerancepbft/#:~:text=Practical%20Byzantine%20Fault%20Tolerance%20is,optimized%20for%20low%20overhead%20time.) (pBFT) protocol which appoints a lead validator and a committee of other validators to execute the consensus and append the finalized block to the network. This is beneficial due to enhanced security, faster block times, and increased certainty of finality. Hence, the platform can cater to specific use cases and behaviors.  

`Economic finality` imposes economic cost on malicious actions of dishonest validators so it becomes monetarily costly for a block to be reverted. For example, if a validator double-signs on two different blocks, their entire financial [stake](/glossary/S/#staker) is [slashed](/glossary/S/#slashing). This approach allows not only rewards nodes for participation but also penalizes the misbehavior of dishonest nodes. This pressure limits the dishonest behavior of nodes.

#### Reaching finality in Casper Highway
There are two factors when reaching the finality:
1. A sufficient portion of validators agrees on the proposed block. 
2. Every validator should be mutually acknowledged by other validators.

Generally, consensus is reached when all the validators are in agreement. However, in Casper we don't need all validators to be in agreement - a majority is enough. Generally, 2/3 portion of the validators should be honest to accept a final network state. In Casper, the underlying mechanism to reach this finality is called [`Summit`](./#summit-the-highway-protocols-way-to-finality). `Summit` makes our highway protocol unique in several aspects compared to the equivalent [`Clique`](https://en.wikipedia.org/wiki/Clique_(graph_theory)) based mechanism in CBC Casper.  

#### Summit: The Highway Protocol’s way to Finality

Summit is considered the key mechanism of the Casper Highway protocol. It is implemented using the [three-way handshake](https://www.techopedia.com/definition/10339/three-way-handshake) (exchange of messages) as in TCP/IP mechanisms. Summit ensures that not only is a message sent from one party, but also that message is well-received and acknowledged by the other party. To achieve a summit in a particular [era](/glossary/E/#era), each message sent by a selected validator(s) is not required to reach every other validator. That is, not every validator is required to get every message from other validators, just enough is required as specified by the threshold. 

Summit is beneficial over clique due to several reasons. It is efficient since it takes [Polynomial](https://en.wikipedia.org/wiki/Polynomial)-time to detect the finality. Consequently, the summit is supposed to happen earlier than the clique, with lesser required acknowledgments among validators. When more validators participate in the consensus, new layers are added to the summit ensuring higher certainty as well as higher fault tolerance. In this case, nearly all validators will have to collude to reverse the finality, resulting in heavy financial penalties for malicious actions. Additional hand-shakes make the finality more certain in addition to the already existing 66% of the weight.

All the above factors in Summit ensure that the network will continue to operate satisfactorily in the presence of faults, ensuring high performance and stability to reach finality quickly. 

### Flexibility
Casper Highway protocol enables flexible node configuration. Highway does not require all nodes to agree upon a common threshold; instead validator nodes are allowed to configure different thresholds, or even several different confidence thresholds to convince themselves that a given block is 'finalized'. Despite these differences in configurations, all the nodes run a single version of the protocol and perform the same actions, only the finality decisions they make depend on the chosen parameters. As a result, nodes with lower security thresholds might reach finality much faster than nodes with higher thresholds. However, as long as both these types of nodes’ assumptions are satisfied they finalize the same blocks and stay in the agreement.

This flexibility in setting up thresholds allows validators to play slightly different roles in the ecosystem – for example, some validators may deal mainly with finalizing relatively small transactions. The nodes that deal with small or unimportant transactions may elect for lower thresholds of finality, while the nodes dealing with larger transactions may elect for higher thresholds. 

Overall, this flexibility feature eliminates the need to make an additional consensus on this particular hyperparameter and results in a more expressive blockchain network.

### Liveness

In blockchain-based distributed systems, liveness is the guarantee that the network will not halt or fall under infinite loops and eventually every node can complete the consensus successfully. Liveness acts as a reassurance that all network validators will reach a consensus regarding the proposed block and produce effective blocks continuously. Casper Highway added the provable improvement to this liveness where it is a limitation on CBC Casper.

Casper Highway protocol achieves this by adding a schedule for sending messages among nodes. It subdivides time into rounds of a specific length and allows nodes to perform at their optimal speed. After the lead validator proposes a new block, other validators assess the validity and select the block based on the summit passing several rounds to reach an agreement. Even though 100% of nodes don't receive and send messages, consensus will finalize the proposed block. Since everyone is agreed on one block, it is guaranteed to append to the network ensuring the selected blocks will not be abandoned or orphaned in the middle of the process. This is due to the compromised liveness proof in the Highway protocol. This approach assures a minimal impact on throughput as the execution engine runs in parallel increasing the network efficiency.