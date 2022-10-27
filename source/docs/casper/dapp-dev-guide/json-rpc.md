# Interacting with the Casper JSON-RPC API

Users looking to interact with the JSON-RPC API of a Casper network have several options, depending on their needs and the level of interaction required.

## Using a Casper SDK

The [Casper Association](https://casper.network/en-us/) provides a [JavaScript SDK](/dapp-dev-guide/building-dapps/sdk/script-sdk/) for use with Casper networks. A list of additional SDKs maintained by third parties can be found [here](dapp-dev-guide/building-dapps/sdk/).

These SDKs offer a means to build decentralized applications by interacting with the JSON-RPC API through your programming language of choice.

## Building a Casper SDK

Most programming languages that compile to [WebAssembly (Wasm)](/glossary/W/#webassembly) are compatible with Casper. If there is not currently an SDK for your preferred programming language, you are free to build your own [Casper SDK Standard](/dapp-dev-guide/sdkspec/introduction/) compliant SDK.

The standard outlines necessary available endpoints and their included types, both for fully-featured SDKs and those of a more narrow scope. Guidance for Casper SDK developers can be found [here](/dapp-dev-guide/sdkspec/guidance/).

## Interacting Directly with the JSON-RPC

For advanced users that wish to interact directly with the JSON-RPC API, they are free to do so using various tools like [Postman](https://www.postman.com/).

The Casper JSON-RPC API is fully compatible with the [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification).
