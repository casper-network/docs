# Overview

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is a Smart Contract
A [Smart contract](https://en.wikipedia.org/wiki/Smart_contract) is an agreement between two parties. In the blockchain context, it acts as a self-executing computerized transaction protocol. A smart contract executes the terms of a contract which are written using programming languages. These are stored on the blockchain network and start executing run when predetermined conditions are met. The transactions that happen in a smart contract are processed by the blockchain. The code controls the execution, and transactions are trackable and irreversible within the blockchain network.

Before diving into writing smart contracts on the Casper blockchain, it is mandatory to understand the difference between the [smart contract](/docs/glossary/S/#smart-contract) and the [session code](/docs/glossary/S/#session-code). Both are used to trigger actions on the network through a deployment. Refer to the [smart contract vs session code](todo) guide for more information.

## Why Do You Want to Use a Smart Contract
You will need to write a smart contract on the below occasions,
- When you need to have a stateful transaction
- When your business use case increases in size and scope
- When you need to add versions or have upgradeability to the contract
- When you have complicated logic to execute
- When you need to maintain or fix bugs in functionalities
- When you need to avoid sending and executing large wasm files to the network

## How Smart Contract Works
Smart contracts are programs deployed and run on a blockchain system. Smart contracts can express triggers, conditions, and business logic to enable complex programmable transactions. Smart contracts can hold and transfer digital assets managed by the blockchain and can invoke other smart contracts stored on the blockchain. 

Casper smart contracts work as below,
1. You write a smart contract using Rust-like language adding all the required business logic to execute. 
2. Then the Casper execution engine will convert it to a [Wasm](/dapp-dev-guide/create-smart-contract/#what-is-a-wasm) binary.
3. After that, the compiled wasm is installed on the Casper node.
    - This will generate the contract id in the network as well as all the metadata related to the contract.
    - The smart contract is identified by a contract address.
4. Contract details are added to the Casper node
5. Finally, you can start the transactions with other nodes and smart contracts

<img src={useBaseUrl("/image/smart-contract/smart-contract-lc.png")} alt="smart-contract-life-ycle" width="500" align="center"/>

## Types of Smart Contracts

### Locked Contracts
These contracts cannot be further upgraded. There is only one version for these contracts. In this scenario, the Casper VM will create a contract package, add a contract to the package, and stays immutable for the lifetime of that contract package's existence. Use locked contracts when you need to  deal with very secure business scenarios, when there is complicated business logic when you have to use a lot of money, and when associated with high-profile individuals. You will override the `new_locked_contract` method to create this type of contract.

```rust
pub fn new_locked_contract(
    entry_points: EntryPoints,
    named_keys: Option<NamedKeys>,
    hash_name: Option<String>,
    uref_name: Option<String>,
) -> (ContractHash, ContractVersion) {
    create_contract(entry_points, named_keys, hash_name, uref_name, true)
}
```
This will create a locked contract stored under a Key::Hash, which can never be upgraded. This is an irreversible decision; for a contract that can be upgraded use `new_contract` instead.

- `entry_points`: The set of entry points defined inside the smart contract
- `named_keys`: Any named-key pairs for the contract
- `hash_name`: Contract hash value. Puts contract hash in current context's named keys under `hash_name`. 
- `uref_name`: Access URef value. Puts access_uref in current context's named keys under `uref_name`

:::note
Current context is the context of the person who initiated the `call` function. Usually, it will be an account.
:::
### Un-locked Contracts
Use this method when you don't want to lock the contract. You can keep upgrading the contract using versions in this scenario. You can upgrade the contracts when you want to add a new feature or upon any user feedback on contracts. Override `new_contract` method to create this type of contract.

```rust
pub fn new_contract(
    entry_points: EntryPoints,
    named_keys: Option<NamedKeys>,
    hash_name: Option<String>,
    uref_name: Option<String>,
) -> (ContractHash, ContractVersion) {
    create_contract(entry_points, named_keys, hash_name, uref_name, false)
}
```
- `entry_points`: The set of entry points defined inside the smart contract
- `named_keys`: Any named-key pairs for the contract
- `hash_name`: Contract hash value. Puts contract hash in current context's named keys under `hash_name`
- `uref_name`: Access URef value. Puts access_uref in current context's named keys under `uref_name`

Choose the smart contract type depending on your requirement.

## What is a Wasm 
[WebAssembly (Wasm)](https://casper.network/docs/glossary/W/#webassembly), is a platform-independent binary instruction format for a stack-based virtual machine. These binaries can easily be transmitted through the network and provide easy browser support.

All smart contracts on Casper must be compiled to Wasm codes. We've chosen wasm which defines an instruction set that we can easily interpret, and developers can rely on existing compiler infrastructure to target their applications into it regardless of language choice. The host (or "embedder" according to WASM spec) is responsible to provide a set of functions a developer can use to interact with the host. 

### Difference between Smart Contract and Wasm
You will write the code generally on a main.rs file and this file contains two parts.
1. The code to install or generate the actual smart contract
2. The code that defines the smart contract or the code that eventually becomes the contract

The installation code takes the smart contract code definition and generates the actual smart contract out of that. The `call` function initiates the contract installation. Then,  `new_contract` or `new_locked_contract` methods gather the data for the contract and send those for contract creation. The definition of a contract includes a set of entry points, their parameters, and named-key pairs.

## Where a Smart Contract Stored
A contract is stored inside a `ContractPackage`. It is a collection of contracts with different versions. ContractPackage is created through `new_contract` or `new_locked_contract` methods.  The Casper execution engine executes those methods and creates the contract package automatically and assigns a [`ContractPackageHash`](/docs/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) for each package. ContractPackageHash is a type that wraps a *HashAddr* which references a ContractPackage in the global state. creates the ContractPackageHash when creating a contract.

<img src={useBaseUrl("/image/smart-contract/contract-package.png")} alt="contract-in-contract-package" width="500" align="center"/>
