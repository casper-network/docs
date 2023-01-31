# What is a dApp?

A decentralized application (dApp) is an application with some data on a blockchain or similar peer-to-peer network.

The degree that a dApp interacts with the blockchain can vary greatly depending on the needs of the application. Some dApps may use the blockchain simply to store data, with most of the computation and interaction taking place off-chain. Others may depend on logic stored on the blockchain, with only the bare minimum user interface stored outside of the blockchain itself.

## How are Decentralized Applications Different?

A decentralized system consists of a group of interchangeable machines that can perform as a full system or `distributed database`. Additional machines strengthen the overall system by adding additional redundancy and computational power.

Any dApp will need access to a decentralized network, in one form or another. In a Casper network, this means connecting to a [node](https://cspr.live/tools/peers). The `decentralized` aspect creates a situation where each node is fundamentally interchangeable for this purpose. If the connected node fails, the dApp can switch to a different node and continue operating without losing data or functionality.

Routine operations in a decentralized network may result in nodes coming on or offline. This *node churn* can potentially result in downtime for a decentralized application if they rely on a single node. As such, it may be necessary to connect to multiple nodes simultaneously to ensure high uptime.

## Interacting with a Decentralized Network

For a dApp to integrate with a Casper network, it must be able to send [Deploys](/glossary/D/#deploy) via the JSON-RPC. Business logic specific to the dApp can then be executed on chain via the Deploy. [Sending a Deploy](/dapp-dev-guide/building-dapps/sending-deploys/) to a node, assuming that the Deploy is valid and accepted, will result in that node [gossiping](/design/p2p/#communications-gossiping) that Deploy to other nodes.

Deploys contain [Wasm](/glossary/W/#webassembly) to be executed by the node and included in global state. Therefore, developers may use any programming language that can compile to Wasm when building on a Casper network.

A Deploy contains [session code](/glossary/S/#session-code) to be executed in the context of the sending account. This session code may consist of Wasm to be executed once, or Wasm which will install contract code to be stored in global state. If the dApp requires the periodic execution of Wasm, it is more efficient from both a gas and execution perspective to install the Wasm as a contract to be called later.

Sending a Deploy is the only means by which a dApp can change global state. As gas costs operate on a per-byte basis, smart contracts will incur less gas costs over time when compared against executing the same session code repeatedly. A dApp may send a deploy simultaneously to each node it is connected to, but can only do so once per node, per deploy.

There is an inherent timing consideration when sending a Deploy, from the point where it is sent to when it is executed. The [Deploy Lifecycle](/design/casper-design/#execution-semantics-phases) results in a delay longer than would be expected from a centralized application. The Deploy must be sent, accepted, gossiped, included in a finalized block and executed. This process can take 2-3 minutes and up to 5 blocks, but may vary depending on network load. This delay should be taken into consideration when designing dApps for use with a Casper network, as the number of connected peers and the number of deploys currently being sent may cause it to increase.