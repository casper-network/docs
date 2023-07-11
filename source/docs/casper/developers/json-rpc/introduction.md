---
title: Introduction
---

# Interacting with the Casper JSON-RPC API

Users looking to interact with the JSON-RPC API of a Casper network have several options, depending on their needs and the level of interaction required.

## Using a Casper SDK

The [Casper Association](https://casper.network/en-us/) provides a [JavaScript SDK](../../developers/dapps/sdk/script-sdk.md) for use with Casper networks. A list of additional SDKs maintained by third parties can be found [here](../../developers/dapps/sdk/index.md).

These SDKs offer a means to build decentralized applications by interacting with the JSON-RPC API through your programming language of choice.

## Creating a Casper SDK

The [Casper SDK Standard](../json-rpc/minimal-compliance.md) outlines the JSON-RPC API endpoints and types definitions for developers crafting an SDK for Casper networks. Guidance for Casper SDK developers can be found [here](./guidance.md).

Developers preferring SDKs in languages other than those available in the [SDK Client Libraries](../../developers/dapps/sdk/index.md) may build their own compliant SDK. Most programming languages that compile to [WebAssembly (Wasm)](../../concepts/glossary/W.md#webassembly) are compatible with Casper.

### Serialization

The Casper platform uses a custom serialization format. To this end, we've established a [Serialization Standard](../../concepts/serialization-standard.md), which SDK developers must follow when building a Casper SDK.

## Interacting Directly with the JSON-RPC

Advanced users wishing to interact directly with the JSON-RPC API can utilize tools like [Postman](https://www.postman.com/).

The Casper JSON-RPC API is fully compatible with the [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification).

Casper nodes provide the RPC schema on port `8888`, followed by `rpc-schema`:  

```sh
<HOST:8888>/rpc-schema 
```

To see an example, navigate to a node's RPC schema using a browser.

The Casper client subcommand `list-rpcs` provides all currently supported RPCs. Here is an example of running the Casper client to list RPCs:

```sh
casper-client list-rpcs --node-address <HOST:PORT>
```