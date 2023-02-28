---
title: Introduction
slug: /writing-contracts
---

# Writing On-Chain Code

This section shows you how to write session code and smart contracts in Rust and WebAssembly (Wasm) for a Casper network. When referring to session code, these documents outline logic that executes in the context of an account. In contrast, smart contracts consist of logic installed on-chain, for use by multiple parties. There is a large overlap between the processes of writing session code versus contract code, with some semantic differences outlined in their respective documentation. The [Video Series for Writing On-Chain Code](https://www.youtube.com/playlist?list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj) accompanies the topics below.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=q5nW4MUT8q4&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=1" position="middle" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

| Title                                       | Description                     |
| ------------------------------------------- | ------------------------------- |
|[Getting Started with Rust](./getting-started.md)| An introduction to using Rust with the Casper Platform|
|[Best Practices for Casper Smart Contract Authors](./best-practices.md)| An outline of best practices when developing smart contracts on a Casper network|
|[Writing a Basic Smart Contract in Rust](./rust-contracts.md)   | An example of a smart contract built in Rust|
|[Unit Testing Smart Contracts](./testing-contracts.md)      | Steps to test contract code using the unit testing framework|
|[Writing Session Code](./session-code.md)      | An introduction to writing session code|
|[Unit Testing Session Code](./testing-session-code.md)      | Steps to test session code using the unit testing framework|
|[Installing Smart Contracts and Querying Global State](./installing-contracts.md)| A guide on installing smart contracts and querying global state        |
|[Calling Smart Contracts with the Rust Client](./calling-contracts.md)| Steps to call a smart contract with the Rust command-line client|
|[Upgrading and Maintaining Smart Contracts](./upgrading-contracts.md)| An introduction to versioning smart contracts|
|[Reading and Writing to Dictionaries](./dictionaries.md)]| Information on Dictionaries and how to read and write to them on the Casper Platform.|
|[Execution Error Codes](./execution-error-codes.md)|Possible error codes when writing smart contracts.|
|[Getting Started with AssemblyScript](./assembly-script.md) | An introduction to using AssemblyScript with the Casper Platform |

Additionally, the following tutorials outline some aspects of writing smart contracts on a Casper network.

| Title                                                       | Description                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
|[Getting Started Video](../tutorials/getting-started-tutorial.md) | Step-by-step video tutorial for setting up the Casper development environment |
|[NFTs on Casper with the CEP-78 NFT Standard](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/README.md) | Implementing the Casper CEP-78 NFT standard     |
|[A Counter on an NCTL Network](../tutorials/counter/index.md)             | An example contract that maintains a counter variable on a local Casper Network with NCTL     |
|[A Counter on the Testnet](../tutorials/counter-testnet/index.md)         | An example contract that maintains a counter variable on the Casper Testnet                   |
|[Fungible Tokens on Casper](https://github.com/casper-ecosystem/erc20/blob/master/docs/TUTORIAL.md)              | Implement the Casper Fungible Token standard                         |
|[Interacting with Runtime Return Values](../tutorials/return-values-tutorial.md)| Learning how to return a value using contract code         |
|[Safely Transfer Tokens to a Contract](../tutorials/transfer-token-to-contract.md) | How to handle tokens via a contract                     |
|[Smart Contract Upgrades](../tutorials/upgrade-contract.md)               | Learn how to upgrade smart contracts                             |
<!-- TODO refresh these tutorials and re-enable the links.
|[Key-Value Storage with Casper DSL](../tutorials/kv-storage-tutorial.md)  | Design a simple contract to store a value and use the Casper DSL |
|[Multi-Signatures and Key Recovery](../tutorials/multi-sig/index.md)      | Learn to sign transactions with multiple keys                    | -->

