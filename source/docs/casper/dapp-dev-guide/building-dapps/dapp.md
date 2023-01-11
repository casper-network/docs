# What is a dApp?

A decentralized application (dApp) is an internet connected application with some data on a blockchain or similar peer-to-peer network.

The degree that a dApp interacts with the blockchain can vary greatly depending on the needs of the application. Some dApps may use the blockchain simply to store data, with most of the computation and interaction taking place off-chain. Others may depend on logic stored on the blockchain, with only the bare minimum user interface stored outside of the blockchain itself.

## Centralized Versus Decentralized

A centralized system is one in which a single entity controls all aspects of the system. In some way, shape or form there is a single point of failure. Users are required to access this central entity to gain access to any involved application. The smallest subset of a centralized system would be a single machine running a single application. If the machine fails, the application will no longer function.

A semi-decentralized system may delegate different sub-systems to a group of machines or layer of applications that specialize in specific tasks. However, these specialized machines still represent a potential single point of failure, where a component of the system may cease to function and result in the inability to use the overall system.

In contrast, a decentralized system consists of a group of [fungible](/glossary/F/#fungible) machines that can each perform as a full system or `distributed database`. Additional machines strengthen the overall system by adding additional redundancy and computational power.

## Interacting with a Decentralized Network

Any dApp will need access to a decentralized network, in one form or another. In a Casper network, this means connecting to an [active node](https://cspr.live/tools/peers). The `decentralized` aspect creates a situation where each node is fundamentally interchangeable for this purpose. If the connected node fails, the dApp can switch to a different node and continue operating without losing data or functionality.

[Sending a Deploy](/dapp-dev-guide/building-dapps/sending-deploys/) to a node, assuming that the Deploy is valid and accepted, will result in that node [gossiping](/design/p2p/#communications-gossiping) that Deploy to other nodes. For greater robustness (at a proportionally greater gas cost), a dApp can send a Deploy to multiple nodes simultaneously to ensure inclusion in a [Block](/glossary/B/#block).

:::note

While a Deploy may be sent to multiple nodes simultaneously, it can only be sent to each node once.

:::

The [Deploy Lifecycle](/design/casper-design/#execution-semantics-phases) results in a delay longer than would be expected from a centralized application. The Deploy must be sent, accepted, gossiped, included in a block and executed. This process can take 2-3 minutes and up to 5 blocks. This delay should be taken into consideration when designing dApps for use with a Casper network.

Deploys contain [Wasm](/glossary/W/#webassembly) to be executed by the node and included in global state. Therefore, developers may use any programming language that can compile to Wasm when building on a Casper network.