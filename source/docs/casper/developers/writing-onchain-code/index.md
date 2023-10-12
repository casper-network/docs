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
|[Getting Started with AssemblyScript](./assembly-script.md) | An introduction to using AssemblyScript with the Casper Platform |
|[Writing a Basic Smart Contract in Rust](./simple-contract.md)   | An example of a smart contract built in Rust|
|[Unit Testing Smart Contracts](./testing-contracts.md)      | Steps to test contract code using the unit testing framework|
|[Upgrading and Maintaining Smart Contracts](./upgrading-contracts.md)| An introduction to versioning smart contracts|
|[Calling Contracts](./calling-contracts.md) |   |
|[Smart Contracts and Session Code](./contract-vs-session.md)       | Understand what session code is and when you would use it over contract code |
|[Writing Session Code](./writing-session-code.md)      | An introduction to writing session code|
|[Unit Testing Session Code](./testing-session-code.md)      | Steps to test session code using the unit testing framework|
|[Using Contract Hash vs. Package Hash](./contract-hash-vs-package-hash.md)| Advantages and disadvantages of using `contract_hash` vs. `contract_package_hash` when calling a contract|
|[Best Practices for Casper Smart Contract Authors](./best-practices.md)| An outline of best practices when developing smart contracts on a Casper network|

## Interacting with Contracts on the Blockchain

Additionally, the section on [Interacting with the Blockchain](../cli/index.md) covers installing and calling contracts using the Casper command-line client written in Rust.

| Title                                                       | Description                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
|[Installing Smart Contracts and Querying Global State](../cli/installing-contracts.md)| A guide on installing smart contracts and querying global state        |
|[Calling Smart Contracts with the Rust Client](../cli/calling-contracts.md)| Steps to call a smart contract with the Rust command-line client|
|[Reading and Writing to Dictionaries](../../concepts/dictionaries.md)| Information on Dictionaries and how to read and write to them on the Casper Platform.|
|[Execution Error Codes](../cli/execution-error-codes.md)|Possible error codes when writing smart contracts.|

## Tutorials

The following tutorials outline some aspects of writing smart contracts on a Casper network.

| Title                                                       | Description                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
|[Getting Started Video](../../resources/beginner/getting-started-tutorial.md) | Step-by-step video tutorial for setting up the Casper development environment |
|[A Counter on the Testnet](../../resources/beginner/counter-testnet/index.md)         | An example contract that maintains a counter variable on the Casper Testnet                   |
|[Smart Contract Upgrades](../../resources/beginner/upgrade-contract.md)               | Learn how to upgrade smart contracts                             |
|[NFTs on Casper with the CEP-78 NFT Standard](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/README.md) | Implementing the Casper CEP-78 NFT standard     |
|[Fungible Tokens on Casper](https://github.com/casper-ecosystem/cep18/blob/master/docs/full-tutorial.md)              | Implement the Casper Fungible Token standard                         |
|[Interacting with Runtime Return Values](../../resources/advanced/return-values-tutorial.md)| Learning how to return a value using contract code         |
|[Working with Authorization Keys](../../resources/advanced/list-auth-keys-tutorial.md)| Retrieving and using the authorization keys associated with a deploy         |
|[Safely Transfer Tokens to a Contract](../../resources/advanced/transfer-token-to-contract.md) | How to handle tokens via a contract                     |

