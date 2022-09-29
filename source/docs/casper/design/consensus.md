# Casper Highway Protocol

Distributed networks need a mechanism to reach an agreement on the present state of the network. In Blockchain, these agreements are achieved through [consensus](/glossary/C/#consensus) protocols. These protocols determine the validity of transactions, address conflicts, and finalize the blocks to be added to the network. The ultimate motive of consensus is to reach an irreversible state of the network. Many blockchain platforms share similar components and characteristics to implement the consensus mechanism whereas the underlying algorithms and decision strategies are unique to each platform.

A consensus protocol consists of a set of message types, communication and processing rules, and a criterion for detecting that agreement has been reached. We call [nodes](/glossary/N/#node) that actively participate in the protocol *validator nodes*.

In general, a consensus mechanism addresses the following two main *characteristics*:

- ***Safety***: All honest nodes eventually agree on the value, i.e. no two honest nodes will report two different blocks at the same height of the blockchain.
- ***Liveness***: The system keeps running and new blocks continue to be added to the chain indefinitely. 

Casper Highway improves the *Liveness* characteristic to serve the practical use cases with wide scalability and efficiency. Highway is operational in the Casper production environment since March 2021 with publicly traded CSPR tokens and has passed the necessary security audits.


Refer to the [Casper Highway Whitepaper](https://arxiv.org/pdf/2101.02159.pdf) to learn more about consensus-related algorithms and mathematical theorems.

## What is Highway?

Highway is the CasperLabs invented [Proof-of-Stake](/glossary/P/#proof-of-stake) (PoS) modeled consensus protocol that is based on the [CBC (Correctness-by-Construction) Casper](/glossary/C/#cbc) approach. This protocol fulfills the key gaps in CBC Casper by practically implementing the finality, flexibility, and liveness features of the network. Casper Highway is designed based on partially synchronized [Byzantine Fault](/glossary/B/#byzantine-fault) Tolerant protocol which asserts that communication between nodes becomes eventually synchronous and that no more than a given fraction of nodes (presumably 1/3rd) are dishonest and may arbitrarily violate the protocol. This states that the protocol will function even if some nodes (including possibly validator nodes) are faulty in any way. Nodes that are not faulty are called *honest* nodes.

## Why Highway?

Highway addresses several pain points that most blockchain platforms encounter when reaching consensus. [Proof-of-Work](/glossary/P/#proof-of-work) and [Proof-of-Stake](/glossary/P/#proof-of-stake) protocols implement the [Byzantine Fault Tolerant](/glossary/B/#byzantine-fault) (BFT) protocol to reach consensus that tolerates crashes and attacks. However, a PoW protocol is significantly resource-intensive with less consistent and lengthier computations. Despite PoS conquering these limitations with faster transfers and network consistency, it is unable to address the limitations on the liveness, safety, and flexibility of the network nodes. 

Thus, CasperLabs has innovated the Highway protocol as the next-generation improved Proof-of-Stake algorithm to overcome the limitations of primary CBC Casper and classic Byzantine fault tolerance protocols. Highway's key improvements tractable finality, liveness proof, and flexibility offer the following main benefits over other protocols.

- Reduced impact of execution on throughput because blocks are only executed after consensus has been reached.
- A block's fault tolerance increases beyond 1/3 as the protocol continues. If all validators are honest, it approaches 100%.

## How does Highway work?

There is one Highway instance executing for a defined period, which is called an [era](/glossary/E/#era). In Casper, anyone running a node is an [operator](/glossary/O/#operator). An operator becomes a [validator](/glossary/V/#validator) after winning the [bid](/economics/consensus/#bids). Node validators are the main characters who perform the consensus mechanism. The Casper platform appoints a lead validator and a fixed set of other validators to run the consensus protocol. The auction determines which nodes participate as validators in the Highway protocol in each era. Usually, in Casper Mainnet, an era spans two hours.

The lead validator proposes the block to be added to the network. All validators then repeatedly send messages acknowledging the block, as well as the other validators' messages. These messages implicitly signal a preference for that block, according to the GHOST (Greedy Heaviest Observed Sub-Tree) rule. Once a sufficiently interconnected pattern of messages has been produced, it becomes impossible for the GHOST rule to switch away from that block. Such a pattern is called a Summit. The selected block is then considered finalized and appended to the chain. 

When an era completes, the last block of the previous era is taken as the initial state of the next era and a new Highway instance is initialized potentially with a different set of validators. The validator set is selected using a [bidding](/economics/consensus/#bids) mechanism. Refer to the [consensus economics](/economics/consensus/) section to learn about the factors related to the auction process, bidding, delegation, and incentive details.

Check [Casper Highway Whitepaper](https://arxiv.org/pdf/2101.02159.pdf)'s section 3.2 to learn more about the GHOST rule.

## Finality Improvement
Finality is the guarantee that a well-established block will not be altered, reversed, or canceled after being added to the blockchain network. Finality seals the transaction completeness. Since a block contains all the transactions, the sender is assured that the transaction cannot be arbitrarily changed or reversed. While there are several [types of finality](https://medium.com/mechanism-labs/finality-in-blockchain-consensus-d1f83c120a9a) when finalizing a block, Casper Highway achieves finality using a combination of deterministic and economical approaches.

`Deterministic finality` occurs when a transaction is immediately considered to be final at the first block depth. This is based on the [practical Byzantine Fault Tolerant](https://www.geeksforgeeks.org/practical-byzantine-fault-tolerancepbft/#:~:text=Practical%20Byzantine%20Fault%20Tolerance%20is,optimized%20for%20low%20overhead%20time.) (pBFT) protocol which appoints a lead validator and a committee of other validators to execute the consensus and append the finalized block to the network. This is beneficial due to enhanced security, faster block times, and increased certainty of finality. Hence, the platform can cater to specific use cases and behaviors.  

`Economic finality` imposes economic costs on malicious actions of dishonest validators so it becomes monetarily costly for a block to be reverted. For example, if a validator double-signs on two different blocks, their entire financial [stake](/glossary/S/#staker) is [slashed](/glossary/S/#slashing). This approach not only rewards nodes for participation but also penalizes the misbehavior of dishonest nodes. This pressure limits the dishonest behavior of nodes.

#### Reaching finality in Casper Highway
There are two factors when reaching the finality:
1. A sufficient portion of validators agrees on the proposed block. 
2. Every validator should be mutually acknowledged by other validators.

Highway's criterion for detecting finality is the presence of a pattern of messages called a `Summit`. It is an improvement over previous CBC Casper finality criteria which were more difficult to attain, and computationally more expensive to detect. Also, it is beneficial over clique due to  [Polynomial](https://en.wikipedia.org/wiki/Polynomial)-time to detect, higher certainty owing to additional hand-shakes, and higher fault tolerance. In this approach, nearly all validators will have to collude to reverse the finality, resulting in heavy financial penalties for malicious actions.





