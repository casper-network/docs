import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# dApp Technology Stack

There are 3 layers to building a decentralized application that interacts with a Casper network: Front-end, backend, and on-chain logic. This document outlines lists the requirements for each.

## Front-End

The front-end, or *client-side* of a dApp consists of the interface that the user uses to interact with smart contracts on a Casper Network. This interface usually comes in the form of a website/webpage, mobile device application or computer program, but could also include APIs with endpoints that may be called or queried.

You will need to choose a Casper-compatible SDK for the language you are using to call and query smart contracts on a Casper network. Casper's SDKs have methods available for constructing Deploys and gathering global state data. While these interactions can be prepared on the front-end, they must be sent to the backend of your application before being sent off to a network, so as to fulfill [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requirements.

### Signing Transactions

The signing of transactions will, in many cases, need to be performed by the user on the front-end, for which you have a couple options:

1. The Casper Wallet

   Use the [Casper Wallet](https://www.casperwallet.io/develop) to sign deploys for a Casper using the Casper Signer browser extension. Deploy objects are first converted to JSON, then sent to the Signer to be signed, then must be sent to the backend and forwarded to a node.

   :::caution

   The Casper Signer has been deprecated and replaced with the [Casper Wallet](https://www.casperwallet.io). We are in the process of updating this page. Meanwhile, visit the guide on [Building with the Casper Wallet](https://www.casperwallet.io/develop).

   :::

2. Third-party signers

   Third-party signers may be used as well. A JSON representation of the unsigned transaction should be forwarded to the third-party signer and accept a callback containing the signed deploy object.

### Querying Global State

To execute a query of global state, such as retrieving smart contract data or getting current chain information, the preparation may be done on the front-end, but the query to a node must ultimately originate from your application's backend. This preparatory stage comes only in the form of defining a contract hash and the path which you'd like to query data. Alternately, for chain information, you must define the endpoint you'd like to query.

## Backend

The backend of a dApp consists of the server-side code that connects the blockchain to the front-end interface and deals with data-parsing and application-layer communication. A backend server is necessary for building dApps on Casper as Casper's nodes expect [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) from a specified origin on the HTTP requests they receive. Backend servers are helpful for other reasons too, such as queueing requests and analyzing the traffic moving between your dApp and the blockchain.

As the backend server of a dApp is the software communicating with Casper nodes (the blockchain), it needs to receive information such as which node and endpoint to connect to.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const client = new CasperClient("http://NODE_ADDRESS:7777/rpc");
```

</TabItem>

<TabItem value="py" label="Python">

```javascript
client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = 7777))
```

</TabItem>

</Tabs>

:::tip

You can find online peers for Mainnet at [cspr.live](https://cspr.live) or testnet at [testnet.cspr.live](https://testnet.cspr.live)

:::

There are two main types of blockchain interactions that will originate from the front-end: deploys and queries. In the case of a dApp, both of these will pass through the back-end.

Blockchain interaction for state queries is handled solely on the backend. On the front-end, a user simply chooses the path at which they want to query data. This path is sent to the backend where the server will perform the state query and send the result back to the front-end.

In the case of a user-signed transaction originating from the dApp's front-end, the backend will need to accept this transaction and forward it to a Casper network. This is often accomplished by opening a POST endpoint that accepts JSON formatted transactions and forwards them along.

## Blockchain

The last stop for a deploy or query is the blockchain itself. Like the majority of smart contract blockchains, Casper networks maintain a forever-growing, immutable ledger that can be read and written to. When building a dApp for a Casper network, user interactions in the form of queries and deploys originate from the front-end, are forwarded to the backend, and are then sent to a Casper node for interaction with the blockchain. You can communicate with Casper nodes using JSON RPC calls, and have a variety of open [transactional](../json-rpc/json-rpc-transactional.md), [informational](../json-rpc/json-rpc-informational.md), and [Proof-of-Stake](../json-rpc/json-rpc-pos.md) endpoints. By utilizing an SDK on the backend, you won't need to construct these JSON RPC calls yourself, they'll be done for you within the available methods.

More than likely, you will want your dApp to perform personalized functions, store custom data, and perhaps even store or transact upon tokens with monetary value. All of these behaviors can be implemented by writing custom smart contracts for your application. Smart contracts on a Casper network can perform any function that a classical computer can. Casper's smart contracts are executed as [WebAssembly](https://webassembly.org/) binaries, and can be written in any language that compiles to WebAssembly. Currently, most developers choose to write their smart contracts in [Rust](https://www.rust-lang.org/) for its reliability and ease-of-use. Additionally, Casper's smart contract documentation is written for Rust.

To learn how to write smart contracts for your dApp, read the [smart contract documentation](../writing-onchain-code/index.md).
