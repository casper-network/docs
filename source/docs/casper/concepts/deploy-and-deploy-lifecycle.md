---
title: Deploy & Deploy Lifecycle
slug: /deploy-and-deploy-lifecycle
---

# Deploys and the Deploy Lifecycle

## Deploys {#execution-semantics-deploys}

A [Deploy](./serialization-standard.md#serialization-standard-deploy) is a data structure containing Wasm and the requester's signature(s). Additionally, the deploy header contains additional metadata about the deploy itself. A deploy’s structure is as follows:

<p align="center">
<img src={"/image/design/deploy-structure.png"} alt="Image showing the deploy data structure" width="500"/>
</p>

- Body: Containing payment code and session code (more details on these below)
- Header: containing
    - The [Public Key](./serialization-standard.md#publickey) of the account in whose context the deploy will run
    - The timestamp of the deploy’s creation
    - A time-to-live, after which the deploy expires and cannot be included in a block
    - the `blake2b256` hash of the body
- Deploy hash: the `blake2b` hash of the Header
- Approvals: the set of signatures which have signed the deploy hash; these are used in the [account permissions model](./design/casper-design.md#accounts-associated-keys-weights)

## The Deploy Lifecycle {#execution-semantics-phases}

A deploy goes through the following phases on Casper:

1. Deploy Received
2. Deploy Gossiped
3. Block Proposed
4. Block Gossiped
5. Consensus Reached
6. Deploy Executed

### Deploy Received

A client sending the deploy will send it to one or more nodes via their JSON RPC servers. The node will ensure that a given deploy matches configuration settings outlined in the network's chainspec. Deploy configuration for the Casper Mainnet can be found [here](https://github.com/casper-network/casper-node/blob/dev/resources/production/chainspec.toml#L79). Once accepted, the system returns the deploy hash to the client to indicate it has been enqueued for execution. The deploy could expire while waiting to be gossiped; whenever this happens, a `DeployExpired` event is emitted by the event stream servers of all nodes which have the expired deploy.

### Deploy Gossiped

After a node accepts a new deploy, it will gossip to all other nodes. A validator node will put the deploy into the block proposer buffer. The validator leader will pick the deploy from the block proposer buffer to create a new proposed block for the chain. This mechanism is efficient and ensures all nodes in the network eventually hold the given deploy. Each node that accepts a gossiped deploy also emits a `DeployAccepted` event on its event stream server. The deploy may expire while waiting for a node to add it to the block. Whenever this happens, the node emits a `DeployExpired` event.

### Block Proposed

The validator leader for this round will propose a block that includes as many deploys from the block proposer buffer as can fit in a block.

### Block Gossiped

The proposed block propagates to all other nodes.

### Consensus Reached

Once the other validators reach consensus that the proposed block is valid, all deploys in the block are executed, and this block becomes the final block added to the chain. Whenever reaching consensus, the event stream server emits a `BlockAdded`. `FinalitySignature` events emit shortly after that. Finality signatures for the new block arrive from the validators.

### Deploy Executed

A deploy executes in distinct phases to accommodate flexibly paying for computation. The phases of a deploy are *payment*, *session*, and *finalization*. Payment code executes during the payment phase. If it is successful, the session code executes during the session phase. And, independently of session code execution, the finalization phase does some bookkeeping around the payment. Once the deploy is executed, a `DeployProcessed` event is emitted by the event stream server.

In the event of execution failure, the sender will be charged the minimum penalty payment - 2.5 CSPR on the Casper Mainnet. This prevents malicious spamming of faulty deploys.

**Payment code**

_Payment code_ determines the payment amount for the computation requested and how much the sender is willing to pay. Payment code may include arbitrary logic, providing flexibility in paying for a deploy. For example, the simplest payment code could use the account's [main purse](./design/casper-design.md#tokens-purses-and-accounts). In contrast, an enterprise application may require a multi-signature scheme that accesses a corporate purse. To ensure the payment code will pay for its own computation, only accounts with a balance in their main purse greater than or equal to `MAX_PAYMENT_COST` may execute deploys. Based on the current conversion rate between gas and motes, we restrict the gas limit of the payment code execution so that the process spends no more than `MAX_PAYMENT_COST` motes (a constant of the system.)
If the payment is absent or not enough, then payment execution is not successful. In this case, the effects of the payment code on global state are reverted, and the system covers the cost of the computation with motes taken from the offending account's main purse.

**Session code**

_Session code_ provides the main logic for the deploy. It only executes if the payment code is successful. The gas limit for this computation is determined based on the amount of payment given (after subtracting the cost of the payment code itself).

**Specifying payment code and session code**

The user-defined logic of a deploy can be specified in a number of ways:

- a Wasm module in binary format representing valid session code, including logic to be executed in the context of an account or to store Wasm in the form of a contract to be executed later. (Note that the named keys from the context of the account the deploy is running in.)
- a 32-byte identifier representing the [hash](./serialization-standard.md#serialization-standard-hash-key) where a contract is already stored in the global state
- a name corresponding to a named key in the account, where a contract is stored under the key

Payment and session code can be independently specified, so different methods of specifying them may be used (e.g. payment could be specified by a hash key, while the session is explicitly provided as a Wasm module).
