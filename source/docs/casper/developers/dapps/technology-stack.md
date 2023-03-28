import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# dApp Technology Stack

There are 3 layers to building a decentralized application that interacts with the Casper Network: Front-end, backend, and blockchain. This document outlines lists the requirements for each.

## Front-End

The front-end, or *client-side* of a dApp consists of the interface that the user uses to interact with smart contracts on a Casper Network. This interface usually comes in the form of a website/webpage, mobile device application or computer program, but could also include APIs with endpoints that may be called or queried.

You will need to choose a Casper-compatible SDK for the language you are using to call and query smart contracts on the Network. Casper's SDKs have methods available for constructing deployments and gathering state data. While these interactions can be prepared on the front-end, they must be sent to the backend of your application before being sent off to the Network, so as to fulfill [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requirements.

### Signing Transactions

The signing of transactions will in many cases need to be performed by the user on the front-end, for which you may implement one or more of a few different options:

1. The Casper Signer

   The Casper JS SDK has a class `Signer` that, when implemented, allows a user to sign transactions using the Casper Signer browser extension. Deploy objects are first converted to JSON, then sent to the Signer to be signed, then must be sent to the backend for deployment to a node.

2. Third-party signers

   Third-party signers may be used as well. A JSON representation of the unsigned transaction should be forwarded to the third-party signer and accept a callback containing the signed deploy object.

3. Pasted private key (not recommended)

   It is also possible to allow a user to paste/type in their private key to be used to sign the transaction. This is not recommended for security reasons.

### Querying the Blockchain State

To execute a blockchain state query, like retreiving smart contract data or getting current chain information, the preparation may be done on the front-end, but the query to a node must ultimately originate from your application's backend. This preparatory stage comes only in the form of defining a contract hash and the path which you'd like to query data, or for chain information, the endpoint you'd like to query.

## Backend

The backend of a dApp consists of the server-side code that connects the blockchain to the front-end interface, and deals with data-parsing and app-layer communication. A backend server is necessary for building dApps on Casper as Casper's nodes expect [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) from a specified origin on HTTP requests they receive. Backend servers are helpful for other reasons too, such as queueing requests and analyzing the traffic moving between your dApp and the blockchain.

As the backend (server) of a dApp is the software communicating with Casper nodes, and therefore the blockchain, it is what needs to be given information such as which node to connect to, and which endpoints to communicate with.

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

*Note: You can find online peers for mainnet at [cspr.live](https://cspr.live) or testnet at [testnet.cspr.live](https://testnet.cspr.live)*

There are two main types of queries that will be sent from the backend to the blockchain, transactions and queries. In the case of a dApp, these will both originate from the front-end.

Blockchain interaction for state queries is handled solely on the backend, where on the front-end, a user simply chooses the path at which they want to query data. This path is sent to the backend where the server will perform the state query and send the result back to the front-end.

In the case of a user-signed transaction originating from the dApp's front-end, the backend will need to accept this transaction and forward it to the Casper Network. This is often accomplished by opening a POST endpoint that accepts JSON formatted transactions and forwards them along.

## Blockchain

The last stop for a transaction or query is the blockchain itself. Like the majority of smart contract blockchains, the Casper Network maintains a forever-growing, immutable ledger that can be read and written to. When building a dApp for the Casper Network, user interactions in the form of queries and transactions originate from the front-end, are forwarded to the backend, and are then sent to a Casper node for interaction with the blockchain. Casper nodes can be communicated with via JSON RPC calls, and have a variety of open [transactional](../json-rpc/json-rpc-transactional.md), [informational](../json-rpc/json-rpc-informational.md), and [Proof-of-Stake](../json-rpc/json-rpc-pos.md) endpoints. By utilizing an SDK on the backend, you won't need to construct these JSON RPC calls yourself, they'll be done for you within the available methods.

More than likely, you will want your dApp to perform personalized functions, store custom data, and perhaps even store or transact upon tokens with monetary value. All of these behaviors can be implemented by writing custom smart contracts for your application. Smart contracts on the Casper Network can perform any function that a classical computer can. Casper's smart contracts are executed as [WebAssembly](https://webassembly.org/) binaries, and can be written in any language that compiles to WebAssembly. Currently, most developers choose to write their smart contracts in [Rust](https://www.rust-lang.org/) for its reliability and ease-of-use. Additionally, Casper's smart contract documentation is written for Rust.

To learn how to write smart contracts for your dApp, read the [smart contract documentation](about:blank).
