# Introduction

This document outlines the methods, endpoints, and types available to developers crafting an SDK for use with Casper networks. The separation of these methods pertains to their use and potential necessity for specific forms of SDK. While a full-featured SDK may feature all methods, there are use cases for SDKs that are purely transactional or informational.

For examples of completed SDKs, please refer to our [SDK Client Libraries](https://casper.network/docs/sdk) section.

|Page|Description|
|----|-----------|
|[Transactional JSON-RPC Method](../sdkspec/json-rpc-transactional.md)|Description of `account_put_deploy`, the only means by which users can send their compiled WASM (as part of a Deploy) to a node on a Casper network.|
|[Informational JSON-RPC Methods](../sdkspec/json-rpc-informational.md)|Descriptions of methods that return information from a network or node within a network.|
|[Proof-of-Stake](../sdkspec/json-rpc-pos.md)|Descriptions of methods that pertain to Proof-of-Stake functionality on a Casper network.|
|[Types](../sdkspec/types_chain.md)|Information on types used within JSON-RPC methods.|
|[CL Types](../sdkspec/types_cl.md)|Information specifically relating to CL Types.|