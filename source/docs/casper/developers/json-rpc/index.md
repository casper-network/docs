---
title: Overview
---

# Interacting with the Casper JSON-RPC API

If you are on this page, you are an advanced user wishing to interact directly with a Casper node's JSON-RPC API. You may use [Postman](https://www.postman.com/) or write code to interact with the Casper JSON-RPC API, which is fully compatible with the [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification).

Casper nodes provide the RPC schema on port `8888`, followed by `rpc-schema`:  

```sh
<HOST:8888>/rpc-schema 
```

To see an example, navigate to a node's RPC schema using a browser.

The Casper client subcommand `list-rpcs` provides all currently supported RPCs. Here is an example of running the Casper client to list RPCs:

```sh
casper-client list-rpcs --node-address <HOST:PORT>
```

## Table of Contents

|Page                                                                       |Description                                                               |
|---------------------------------------------------------------------------|--------------------------------------------------------------------------|
|[Guidance for JSON-RPC SDK Compliance](./guidance.md)                      |Requirements for a compliant Casper SDK                                   |
|[Required JSON-RPC Methods for Minimal Compliance](./minimal-compliance.md)|Methods required for a minimally compliant Casper SDK                     |
|[Transactional JSON-RPC Method](./json-rpc-transactional.md)               |Methods allowing interaction with a Casper network                        |
|[Informational JSON-RPC Methods](./json-rpc-informational.md)              |Methods returning information about the network from a Casper node        |
|[Proof-of-Stake JSON-RPC Methods](./json-rpc-pos.md)                       |Methods pertaining to Proof-of-Stake functionality on a Casper network    |
|[Types](./types_chain.md)                                                  |Information on types used within JSON-RPC methods                         |
|[CL Types](./types_cl.md)                                                  |Information related to CL Types                                           |
