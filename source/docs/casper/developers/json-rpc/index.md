# Introduction

This document outlines the JSON-RPC API endpoints and types definitions for developers crafting an SDK for use with Casper networks. This document outlines the JSON-RPC API endpoints and types definitions for developers crafting an SDK for use with Casper networks. Casper uses a custom JSON-RPC implementation known as `casper-json-rpc` that is compliant with the [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification).

## Creating a Casper SDK

The Casper Association provides a JavaScript SDK that is compliant with this SDK Standard. However, those that prefer other languages may build an SDK using their language of choice.

For examples of such SDKs, please refer to our [SDK Client Libraries](../dapps/sdk/index.md) section.

### Serialization

The Casper platform uses a custom serialization format. To this end, we've established a [serialization standard](../../concepts/serialization-standard.md) that describes the format, which SDK developers must implement in their language of choice.

-------

## SDK Standard Index

|Page|Description|
|----|-----------|
|[Guidance for JSON-RPC SDK Compliance](./guidance.md)|Guide on the requirements for a compliant Casper SDK.|
|[Required JSON-RPC Methods for Minimal Compliance](./minimal-compliance.md)|Methods required for a minimally compliant Casper SDK.|
|[Transactional JSON-RPC Method](./json-rpc-transactional.md)|Description of `account_put_deploy`, the only means by which users can send their compiled Wasm (as part of a Deploy) to a node on a Casper network. Also includes the `speculative_exec` method.|
|[Informational JSON-RPC Methods](./json-rpc-informational.md)|Descriptions of methods that return information from a network or node within a network.|
|[Proof-of-Stake JSON-RPC Methods](./json-rpc-pos.md)|Descriptions of methods that pertain to Proof-of-Stake functionality on a Casper network.|
|[Types](./types_chain.md)|Information on types used within JSON-RPC methods.|
|[CL Types](./types_cl.md)|Information specifically relating to CL Types.|
