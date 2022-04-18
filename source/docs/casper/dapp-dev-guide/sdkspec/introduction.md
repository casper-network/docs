# Introduction

This document outlines the methods, endpoints, and types available to developers crafting an SDK for use with Casper networks. The separation of these methods pertains to their use and potential necessity for specific forms of SDK. While a full-featured SDK may feature all methods, there are use cases for SDKs that are purely transactional or informational.

## Creating a Casper SDK

The Casper platform offers a robust working environment that leverages WebAssembly to allow for the creation of SDKs in most popular programming languages. We maintain a Rust SDK as a first-party entity, alongside this SDK Standard that allows for third-party support of alternate languages. Any additional SDKs developed for the Casper platform will be required to comply with the SDK Standard and maintain consistency with the underlying terminology and structure. 

For examples of completed SDKs, please refer to our [SDK Client Libraries](../../../sdk/) section.

### Querying the Network

Before transacting with a Casper Network, SDK authors should focus on querying the network and retrieving [pertinent information](../sdkspec/json-rpc-informational.md). These methods allow users to retrieve information stored in [global state](../../../glossary/G#global-state). Transacting, in the form of sending Deploys, requires knowledge of the current global state and the ability to monitor the status of Deploys after they are sent. Therefore, prioritization of querying the Network creates the necessary framework for further development.

### Serialization

The Casper platform uses WebAssembly (WASM) to allow for a wide variety of compatible programming languages. It accomplishes this through the use of binary-code format, requiring serialization of values prior to sending, and subsequent deserialization of information as it returns. To this end, we've established a [serialization standard](../../../design/serialization-standard/) that allows SDK developers a quick reference for the various types and their associated serialization.

&Mention custom serialization format&

### Deploys on a Casper Network

[Deploys](../../../design/execution-semantics#deploys) are the fundamental unit of work that can manipulate global state. They are a transactional means of interacting with the Casper platform and perform a variety of tasks to that end, including both session and contract code. All transactions occur through a deploy, and use the JSON RPC method `account_put_deploy`.

### Cryptography

Casper incorporates a variety of cryptographic aspects within our ecosystem, including:

* Both `ed25519` and `secp256K1` as options for encrypted public keys and signature matching.

* `blake2b` for hashing.

-------


## SDK Standard Index

|Page|Description|
|----|-----------|
|[Transactional JSON-RPC Method](../sdkspec/json-rpc-transactional.md)|Description of `account_put_deploy`, the only means by which users can send their compiled WASM (as part of a Deploy) to a node on a Casper network.|
|[Informational JSON-RPC Methods](../sdkspec/json-rpc-informational.md)|Descriptions of methods that return information from a network or node within a network.|
|[Proof-of-Stake JSON-RPC Methods](../sdkspec/json-rpc-pos.md)|Descriptions of methods that pertain to Proof-of-Stake functionality on a Casper network.|
|[Guidance for Minimum SDK Compliance](../sdkspec/guidance.md)|Guide on the requirements for a minimally compliant Casper SDK.|
|[Required Methods for Minimal Compliance](../sdkspec/json-rpc-minimal.md)|Methods required for a minimally compliant Casper SDK.|
|[Types](../sdkspec/types_chain.md)|Information on types used within JSON-RPC methods.|
|[CL Types](../sdkspec/types_cl.md)|Information specifically relating to CL Types.|