# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';


This tutorial examines how to upgrade an existing contract, which is similar to upgrading any other software. You can change an unlocked Casper contract by adding, editing, or deleting functionality. Once you have the new contract, you can add it to an existing contract package by knowing the contract package hash and using the `add_contract_version` API. Note that a locked contract cannot be versioned and is therefore not upgradable.


## Pre-requisites
- You need the contract package hash identifying the contract package where you want to add a new version of the contract
- You should be familiar with [writing smart contracts](./writing-contracts), [on-chain contracts](/dapp-dev-guide/on-chain-contracts/), and [calling contracts](/dapp-dev-guide/calling-contracts) on the Casper Network


#### Contract Versioning Flow

These are the steps to add a new version to your contract.

<img src={useBaseUrl("/image/contract-upgrade-flow.png")} alt="contract-upgrade-flow" width="500"/>

### Step 1. Creating a new contract file 
a) Create a new smart contract file that contains the base contract. The name of the new contract file could be different since after being compiled to wasms; the contract versions are identified by contractHash and connected by the contract package.

b) Then, add the required modification to the contract. This can be adding a new entry point or modifying the behavior of an existing entry point in the contract.

### Step 2. Add handle to the contract package hash
Implement the `call` method with a handle to the base contract's contractPackageHash. This connects the new version and old version to the contract package. 

   E.g.
```rust
let (contract_package_hash, _): (ContractPackageHash, URef) = storage::create_contract_package_at_hash();
```

### Step 3. Call add_contract_version function

Call [`add_contract_version`](https://github.com/casper-network/casper-node/blob/18571e0c22d7918a953f497649b733151cfb3c3c/smart_contracts/contracts/client/counter-define/src/main.rs#L78-L79) function passing in the new entrypoints. This function will add a contract version to the package marking "upgrading" a contract.

a) Import required packages to implement the method.
```rust
extern crate alloc;

use alloc::string::String;

use casper_contract::{
    contract_api::{runtime, storage, system},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    contracts::NamedKeys, CLType, CLValue, ContractPackageHash, EntryPoint, EntryPointAccess,
    EntryPointType, EntryPoints, Parameter, URef,
};
```

b) Include the three arguments; contract_package_hash, entry_points, and named_keys inside the method call.
  - `contract_package_hash` - This represents a collection of contract hashes. A [`ContractPackageHash`](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) is a type that wraps a *HashAddr* which references a ContractPackage in the global state. The Casper execution engine creates the ContractPackageHash when creating a contract.
  - `entry_points` - Entry points of the contract, which can be modified or newly added
  - `named_keys` - Named key pairs of the contract

The contract package hash is like a container, with different versions of the contract, similar to an npm package or a Rust crate. It has several versions of software (v1, v2, v3) with functionality that can differ in certain versions. The contract package is created automatically when you install the contract on the blockchain. 

<img src={useBaseUrl("/image/contract-representation.png")} alt="contract-representation" width="500"/>

### Step 4. Compiling and building the contract
Use these commands to prepare, compile and build the new contract.

```bash
make prepare

make build-contract
```

### Step 5. Deploying the contract 

Use the below command to deploy your contract to the selected network. Make sure you add your specific arguments to the command. 

```bash
casper-client put-deploy \
    --node-address http://<NODE_ADDRESS> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
```

1. `NODE_ADDRESS`: An IP address of a node on the network
2. `NETWORK_NAME`: The chain-name to the network where you wish to send the deploy (this example uses the Testnet)
3. `PATH_TO_YOUR_KEY`: Path to your saved keys' location
4. `AMOUNT`: Token amount used for the deployment
5. `WASM_FILE_PATH`: Path to your contract Wasm 

### Step 6. Verifying the deploy changes 

#### Testing the upgrade contract 
You can write unit tests to verify the accuracy of the new contract version. Refer to the code in this [file](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/test/contract-context/src/main.rs) to get an idea about creating the unit test. This file contains the code for building the test contract with the required constants and entry points. It creates the named-keys fields and adds the call to `add_contract_version` method with arguments inside the [install_version](https://github.com/casper-network/casper-node/blob/18571e0c22d7918a953f497649b733151cfb3c3c/smart_contracts/contracts/test/contract-context/src/main.rs#L152-L163). Finally, it executes the `call` method to generate and verify the new contract.

#### Verify the deploy by querying the network
Verify the changes by retrieving the deploy object and querying the network status. Follow the [deploy verification](/dapp-dev-guide/on-chain-contracts/#monitoring-the-event-stream-for-deploys) step to learn more about monitoring the event stream of deploys.

Get the details of the installed deploy .

```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> [DEPLOY_HASH]
```

- To see the status of the contract version, query the `version` endpoint.

```bash
casper-client query-global-state --node-address [NODE_ADDRESS] \
--state-root-hash [LATEST_STATE_ROOT_HASH or BLOCK_HASH] \
--key [YOUR_ACCOUNT_HASH] \
-q "version"
```

1. `NODE_ADDRESS`: An IP address of a node on the network
2. `LATEST_STATE_ROOT`: Hash indicates the current status of the network
3. `YOUR_ACCOUNT_HASH`: Provided account hash


