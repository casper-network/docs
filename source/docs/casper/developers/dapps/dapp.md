---
title: What is a dApp?
---

# What is a dApp?

A decentralized application (dApp) is an application with some data on a blockchain or similar peer-to-peer network.

The degree that a dApp interacts with the blockchain can vary greatly depending on the needs of the application. Some dApps may use the blockchain simply to store data, with most of the logic taking place off-chain. Others may depend on logic stored on the blockchain, with only the bare minimum user interface stored outside of the blockchain itself.

## How are Decentralized Applications Different?

A decentralized system consists of a group of interchangeable machines that can perform as a full system or `distributed database`. Additional machines strengthen the overall system by adding redundancy and computational power.

Any dApp will need access to a decentralized network, in one form or another. In a Casper network, this means connecting to a [node](https://cspr.live/tools/peers). The `decentralized` aspect creates a situation where each node is fundamentally interchangeable for this purpose. If the connected node fails, the dApp can switch to a different node and continue operating without losing data or functionality.

Routine operations in a decentralized network may result in nodes coming on or offline. This *node churn* can result in downtime for a decentralized application if it relies on a single node. It is necessary to connect to multiple nodes simultaneously to ensure high uptime, especially if you are not operating your own node.

## Interacting with a Decentralized Network

For a dApp to integrate with a Casper network, it must be able to send [Deploys](../../concepts/glossary/D.md#deploy) via the JSON-RPC. Business logic specific to the dApp can then be executed on chain via the Deploy. [Sending a Deploy](../../developers/dapps/sending-deploys.md) to a node will result in that node [gossiping](../../concepts/design/p2p.md#communications-gossiping) that Deploy to other nodes, assuming that the Deploy is valid and accepted. The Deploy will then be enqueued for execution.

A Deploy contains [session code](../../concepts/glossary/S.md#session-code) in the form of [Wasm](../../concepts/glossary/W.md#webassembly) to be executed in the context of the sending account. Therefore, developers may use any programming language that can compile to Wasm when building a dApp for a Casper network. This session code may consist of Wasm to be executed once, or Wasm which will install contract code to be stored in global state. If the dApp requires periodic execution of the same Wasm, it is more efficient from both a gas and execution perspective to install the Wasm as a contract to be called later.

Sending a Deploy is the only means by which a dApp can change global state. As gas costs operate on a per-byte basis, smart contracts will incur less gas costs over time when compared against executing the same session code repeatedly. A dApp may send a Deploy simultaneously to each node it is connected to, but can only do so once per node, per Deploy.

All associated changes to global state occur after successful execution of the Deploy. In the case of a failed execution, the stack is unwound and any changes to global state as part of executing the Deploy are reverted. However, as there is a penalty payment that must be incurred, there is a change in global state through reducing the balance of the sending account. To send a Deploy, an account must hold a minimum balance greater than the network's penalty payment. This penalty payment can vary from network to network. On the public Casper Mainnet, the penalty payment is set to 2.5 CSPR.

Unlike other blockchain networks, a Casper network performs execution after consensus. This means observing the execution of the Deploy is sufficient proof of finality for most cases. For a stronger finality requirement, you can observe the finality signatures for the block that includes the given Deploy.

There is an inherent timing consideration when sending a Deploy, from the point where it is sent to when it is executed. The [Deploy Lifecycle](../../concepts/design/casper-design.md#execution-semantics-phases) results in a delay longer than would be expected from a centralized application. The Deploy must be sent, accepted, gossiped, included in a finalized block and executed. This process varies from network to network. This delay should be taken into consideration when designing dApps for use with a Casper network, as the number of connected peers and the number of Deploys currently being sent may cause it to increase.