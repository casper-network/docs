# Understanding dApp

A decentralized application (dApp) is an application or program that runs on a blockchain or peer-to-peer (P2P) network of computers instead of a single computer. DApps are not controlled by a single authority. 

A frontend of a dApp is similar to conventional applications, whereas the backend code runs on a decentralized (P2P) network. It is different than a traditional backend database in the way it interacts with a blockchain. It is decentralized, which means it connects to multiple nodes, it picks a peer and if that peer fails, it will pick another peer on the blockchain for processing the deploys. 

Any time you integrate two systems, there are hurdles to overcome when syncing, such as buffering when sending data to the network. Buffer can be characterized as memory shared by all things working on a machine, sub-compartmentalized into subprocesses and working with one or more of them. Similar to a box containing boxes, either virtual or physical. These processes can be inter-processed, which means sharing data between two different processes or intra-processed, which means sharing data within components of a single process. When a dApp tries to communicate with the blockchain, if the contract code being sent passes certain criteria set on the blockchain, it is executed.

## Centralized vs Decentralized Applications

The main difference between centralized and decentralized applications and the risk factors to consider:

1.	Centralized application – This is where the application resides on one central location (machine or server).
2.	Semi-Decentralized application – This is where the application is split into logical groups and stored in different layers with some degree of integration. The risk of failure is limited to single points due to specialized machines within the system.
3.	Decentralized application – This is where each component of the application performs in parallel and is fungible. One part of the application is a distributed database, which is made up of the global state and everything else. The risk of failure in this type of setup dials down to network consistency and partition tolerance. 

## Gossiping

Gossiping is a process of distributing a value across the entire network without directly sending it to each node. The process of gossiping is listed below:
1.	Once a deploy is sent to a node, if the node accepts it, it is sent to other nodes.
2.	Gossiping delays must be shared around the network to one or more validating nodes. If selected as the proposer of a new block, it will include the deploy in the new block.
3.	If sufficient validators agree to the block, it is added to the global state.
4.	There is a delay from sending deploys to it's inclusion in a block.
    -	The delay is between the next block and three-four blocks after (approximately 2-3 minutes) up to five blocks.
    -	Deploys are processed FIFO from the perspective of the proposer.
5.	You may send your deploy to multiple nodes on the network – but only once per node.


## Blockchain Centric Versus Other DApps

-	Blockchain Centric
    -   Blockchain centric dApps reside entirely on the blockchain
    -	There are mostly a series of smart contracts and some logic that lives off chain to bind them together
    -	For more information on writing smart contracts, see [Writing a Basic Smart Contract in Rust](../../dapp-dev-guide/writing-contracts/rust.md)
-	Other dApps
    -	These dApps mostly work outside the blockchain, but use the blockchain as a database
    -	The on chain work is written in Wasm and included in a deploy that is cryptographically signed and sent to a node/nodes on the chain
    -	If accepted, there is a time-to-inclusion that may be longer than you are used to


