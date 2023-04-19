---
title: Cross-Contract Communication
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Tutorial: Cross-Contract Communication

|                    |                    |
| ------------------ | ------------------------------- |
| Level: | `Advanced` |
| Time to complete: | `45 - 60 Minutes`|

Make sure you have installed the software/packages needed for this tutorial.

This tutorial assumes that you have worked through the following examples. If you have not already done so, then we recommend that you do so now:
- [Getting Started with Rust](../../../developers/writing-onchain-code/getting-started.md)
- [Writing a Basic Smart Contract in Rust](../../../developers/writing-onchain-code/simple-contract.md)

## Outline of the Tutorial {#outline}

This tutorial covers some variations of cross-contract communication. Most complex scenarios use cross-contract communication, so it is crucial to understand how this works. It is best explained using the uniswap v2 protocol.

Uniswap v2 protocol consists of multiple smart contracts which govern a unified blockchain application and each contract serves a different purpose.
The contracts are as follows:
- Factory
- Pair
- Pair (ERC20)
- Library
- Router01
- Router02

The Factory contract is generally used to create a token pair. It throws an event that a pair has been created and allows the user to read the pair created. The most important to notice is that the generation of a token pair actually creates a contract of type Pair under a new address hash.
The Pair smart contract is used to perform operations like mint or burn on a created pair of tokens.

Having this in mind we will be building two contracts which reference each other in some shape or form. We will look at how the keys are deployed in the contract's context and how we can pass the contract hash into a deployed contract so another contract can be called.

## Creating the Project {#create-project}

In the appropriate folder, create the project for the contract using the following command:

```bash
cargo casper cross-contract
```

This will create the following structure under your desired smart contract folder:

```bash
cross-contract/
└── contract/
    ├── .cargo/
        └── config.toml
    ├── src/
        └── main.rs
    └── Cargo.toml
└── tests/
    ├── src/
        └── integration-tests.rs
    └── Cargo.toml
└── .travis.yml
└── Makefile
└── rust-toolchain
```

After creating the project directory structure, use the following commands to go into the project folder and compile the files:

```bash
cd cross-contract
make prepare
make build-contract
```

This will also create a target folder under the contract folder where the .wasm of the contract can be found.
Additionally you can check if the tests can be performed using the following command:

```bash
make test
```

This should produce the following outcome:

```bash
running 2 tests
test tests::should_error_on_missing_runtime_arg ... ok
test tests::should_store_hello_world ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.09s
```

:::tip

If this is not the case and you see the following error:

```bash
warning: `tests` (bin "integration-tests" test) generated 2 warnings
error: could not compile `tests` due to 3 previous errors; 2 warnings emitted
make: *** [test] Error 101
```

Then it is useful to check if the dependencies in `Cargo.toml` are still up to date.

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/CargoToml.png")} width="600" alt="CargoToml" />

If you see the red cross, it means the version is not up to date and has to be updated.

:::

## Changing the Standard Contract {#changing-contract}

The standard Casper contract from `cargo-casper` contains some methods that we will reuse. However, we will be getting rid of most auto-generated code. 

We will be changing the `main.rs` file. Your code should look exactly as below:

```bash
#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we are in a
// `no_std` environment.
extern crate alloc;

// The elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// Casper crates
use casper_types::{Key, CLType, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};


#[no_mangle]
pub extern "C" fn call() {

}
```
This will serve as a base for introducing the elements needed for cross-contract communication.

In a contract, you should first define the `call` entry point. It should be understood as a `constructor` for the contract. Everything included in the `call` entry point will be visible as metadata on a Casper network, in the contract's context. 
You should already be familiar with the `call` entry point from the [Writing a Basic Smart Contract in Rust](../../../developers/writing-onchain-code/simple-contract.md) document. If this is not the case, be sure to familiarize yourself with it now.

The contract code, with changes to the `call` entry point, should look as shown below: 

```bash
#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we are in a
// `no_std` environment.
extern crate alloc;

// The elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// Casper crates
use casper_types::{Key, CLType, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};


#[no_mangle]
pub extern "C" fn call() {

    // Get the value of the runtime argument named "message"
    let value: String = runtime::get_named_arg("message");

    // The value will be written under a URef
    let value_ref = storage::new_uref(value);

    // Creating the new set of named keys
    // The keys are a Map of String/casper_types::Key
    let mut named_keys: BTreeMap<String, Key> = BTreeMap::new();

    // Insert the new value into the named keys
    named_keys.insert(String::from("message"),value_ref.into()); // use into to wrap the Uref into a casper_types::Key
    // Create a new vector 
    let mut params = Vec::new();
    vec.push(Parameter::new("message", CLType::String));

    // Create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // Describing the metadata for the entry point
    entry_points.add_entry_point(EntryPoint::new(
        "update_msg",                   // the name of the entry point
        vec,                            // the arguments which can be passed into the entry point
        CLType::Unit,                   // return type of the entry point
        EntryPointAccess::Public,       // access permissions - public can be accessed always
        EntryPointType::Contract        // in most cases it will be contract
    ));

    // The contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
        entry_points,                                       // entry points
        Some(named_keys),                                   // named keys 
        Some("Hello_world_package_name".to_string()),       // package name
        Some("Hello_world_access_uref".to_string())         // access uref
    );

    // To access the contract hash from the accounts named keys
    runtime::put_key("hello_world_contract", stored_contract_hash.into());

}
```

:::tip

`runtime` and `storage` appear frequently in our code. If these terms are unfamiliar to you, you should familiarize yourself with the [Contract API Modules]( https://docs.rs/casper-contract/latest/casper_contract/contract_api/index.html).

:::

The metadata for each of the contract's entry points is defined in the `call` entry point. When installing the contract, the system will look for the name of the entry point as specified by the metadata for that entry point. Therefore, each of the entry points defined in the code must share the same name as the `String` value passed when defining the metadata for the entry point.

The #[no_mangle] flag ensures that the compiler does not modify the name of the entry point. The compiler will not enforce the condition that the name of the entry point is the same value present in its metadata definition, therefore the developer must be careful when defining their entry points.

In our case, we will define the entry point `update_msg` in the contract code just before `call`. 

Your complete contract should match the following:

```bash
#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we are in a
// `no_std` environment.
extern crate alloc;

// The elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// Casper crates
use casper_types::{Key, CLType, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};

#[no_mangle]
pub extern "C" fn update_msg() {

    let value: String = runtime::get_named_arg("message");
    // Get the uref of the message stored in global state
    let uref = runtime::get_key("message").unwrap_or_revert().into_uref().unwrap_or_revert();
    // Write the message to global state
    storage::write(uref, String::from(value));
}


#[no_mangle]
pub extern "C" fn call() {
    // Get the value of a passed parameter with the key "message"
    let value: String = runtime::get_named_arg("message");
    // The value will be wraped in a URef
    let value_ref = storage::new_uref(value);
    // Creating the new set of named keys
    // The keys are a Map of Key/Value 
    let mut named_keys: BTreeMap<String, Key> = BTreeMap::new();
    // Insert the new value into the named keys
    named_keys.insert(String::from("message"),value_ref.into()); // use into to wrap the value to the key
    // Create a new vector 
    let mut vec = Vec::new();
    vec.push(Parameter::new("message", CLType::String));
    // Create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // Define the metadata for the entry point `update_msg`
    entry_points.add_entry_point(EntryPoint::new(
        "update_msg",
        vec,
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract
    ));

    // The contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
        entry_points,                                       // entry points metadata
        Some(named_keys),                                   // named keys 
        Some("Hello_world_package_name".to_string()),       // package name
        Some("Hello_world_access_uref".to_string())         // access uref
    );

    // To access from the account - named keys of the account
    runtime::put_key("hello_world_contract", stored_contract_hash.into());
}
```

:::info

There is a distinction between storing data in a contract’s `NamedKeys` and using a dictionary. [Dictionaries](../../../concepts/dictionaries.md) can be used to store dApp-centric data, but they are not a SQL database and should only be used for data that needs to be stored in global state. Objects referenced in a contract should only be used as links within a bigger application.

:::

## Deploying the Contract {#deploying-contract}

There are many tools available to send a deploy to a Casper network. The simplest method is to use the Rust CLI with the subcommand [put_deploy](../../../developers/cli/installing-contracts.md#installing-contract-code).

Be sure to go through the prerequisites from the [Installing Smart Contracts and Querying Global State](../../../developers/cli/installing-contracts.md) documentation.

Make sure that after doing this you have:
1. A valid private key for your account.
2. Funded your account with 2000 CSPR on the Testnet, which you can use for testing your smart contract.

Create the `keys` folder in the main folder of your project and make sure that the private key which you put into the folder is called `secret_key.pem`.

Compile the contract in the contract directory so you obtain the contracts `.wasm`: 

```bash
cd cross-contract
make prepare
make build-contract
```

This should produce the following outcome:

```bash
cd contract && cargo build --release --target wasm32-unknown-unknown
    Finished release [optimized] target(s) in 0.13s
wasm-strip contract/target/wasm32-unknown-unknown/release/contract.wasm 2>/dev/null | true
```

With this step everything is in place to deploy the contract. 

:::tip

When working with lengthy command strings, it may help to maintain a .txt file where you can edit the runtime arguments of the commands before sending them to the CLI. This will save you time and frustration when working with multiple contracts and commands.

:::

Since we are using a default contract structure, the command called from the `cross-contract` folder should be the following:

```bash
casper-client put-deploy \
    --node-address http://136.243.187.84:7777 \
    --chain-name casper-test \
    --secret-key ./keys/secret_key.pem \
    --payment-amount 20000000000 \
    --session-path ./contract/target/wasm32-unknown-unknown/release/contract.wasm \
    --session-arg "message:string='hello world'"
```

The output of this command is:

```bash
{
  "id": -9119604526598719721,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy_hash": "af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832"
  }
}
```

To verify that the contract was successfully deployed, use the `get-deploy` subcommand, providing as a parameter the `deploy_hash` received from the `put-deploy` above.

```bash
casper-client get-deploy \
    --node-address http://136.243.187.84:7777 af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832
```

This should return a JSON output containing information such as header data, approvers and payments. You can also receive this information by using the `verbose` flag with the `put-deploy` subcommand. Take time to familiarize yourself with the structure of the output. 

We can use the supplied deploy hash, `af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832` to find this contract using a block explorer. When viewed through the explorer, the status of the Deploy should be marked as `Success`.

From your `cspr.live` account, you will find a tab called `NamedKeys`. This tab includes a list of all contracts deployed using the private key connected to your account.

By clicking the contract hash, you can see all entry points included in the contract, as well as the `NamedKeys` under which your contract’s name is stored. You should keep these named keys organized to avoid losing track while creating larger implementations.

An additional tab, `Deploys`, that is currently empty. If our contract included a cross-contract call that called an entry point from another contract, it would appear here. For now, we can note the hash of the contract, which is `hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea`.

## Create Another Contract for the Cross-Contract Call {#cross-contract}

This section describes the process of writing an additional contract, which will use an entry point titled `call_contract_2` to invoke the `update_msg` entry point on the previous contract.

In this tutorial we will be passing the contract hash, as an argument, into the `call` entry point and use this to perform the calls to the destination contract.

Prepare the `call` entry point as described below:

```bash

#[no_mangle]
pub extern "C" fn call() {
    
    // Create the list of required runtime arguments for the given entry point.
    let mut vec = Vec::new();
    vec.push(Parameter::new("new_message", CLType::String));
    vec.push(Parameter::new("hello_world_contract", CLType::Key));

    // In the named keys of the contract, add a key for the count.
    let mut named_keys = NamedKeys::new();

    // Create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // Add the entry point metadata definition.
    entry_points.add_entry_point(EntryPoint::new(
       "call_contract_2",
       vec,
       CLType::Unit,
       EntryPointAccess::Public,
       EntryPointType::Contract
    ));

    // The contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
       entry_points,                                        // entry points
       Some(named_keys),                                    // named keys 
       Some("contract2_package_name".to_string()),          // package name
       Some("contract2_access_uref".to_string())            // access uref
    );

    // To access from the account - named keys of the account
    runtime::put_key("cross_contract_2", stored_contract_hash.into());
}

```

This would be the easiest implementation of the `call` entry point. There is only one entry point which accepts the key `contract2` of type `String` and the key `hello_world_contract` of the type `Key`. There aren't any named keys which will be saved in the contract's context. The contract is then stored in global state and placed as an entry within the account's named keys.

Now that we have defined the metadata for the `call_contract_2` entry point, we must now define the entry point itself. This entry point will take the second contract hash as an argument and call the entry point `update_msg`. It will then pass a message to the second contract as a parameter, which will be stored in that contract’s context.

```bash
#[no_mangle]
pub extern "C" fn call_contract_2() {

    // Get the contract hash from the named arguments passed to the `call_contract_2` entry point.
    let contract_hash: ContractHash = runtime::get_named_arg::<Key>(CONTRACT_HASH)
    .into_hash()
    .map(|hash| ContractHash::new(hash))
    .unwrap();

    // Get the value of the message from the second parameter  
    let new_value: String = runtime::get_named_arg("new_message");

    // Call the update_msg entry point on the other contract with the parameter values
    let _: () = runtime::call_contract(
        contract_hash, 
        "update_msg", 
        runtime_args! {
            "message" => new_value,
        },
    );

}
```

Your complete contract implementation should look as follows:

```bash

#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// We need to explicitly import the std alloc crate and `alloc::string::String` as we are in a
// `no_std` environment.
extern crate alloc;

// The elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use crate::alloc::string::ToString;
use crate::runtime_args::RuntimeArgs;

// Casper crates
use casper_types::{
    api_error::ApiError,
    contracts::NamedKeys, runtime_args, CLType, Key, ContractHash, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    unwrap_or_revert::UnwrapOrRevert,
    contract_api::{runtime, storage},
};

// The contract key in the account named keys
const CONTRACT_HASH: &str = "hello_world_contract";

#[no_mangle]
pub extern "C" fn call_contract_2() {

    let contract_hash: ContractHash = runtime::get_named_arg::<Key>(CONTRACT_HASH)
    .into_hash()
    .map(|hash| ContractHash::new(hash))
    .unwrap();

    let new_value: String = runtime::get_named_arg("new_message");

    let _: () = runtime::call_contract(
        contract_hash, 
        "update_msg", 
        runtime_args! {
            // key    => value
            "message" => new_value,
        },
     );

}

#[no_mangle]
pub extern "C" fn call() {
    
    // Create a new vector - this will be the signature of the entrypoint
    let mut vec = Vec::new();
    vec.push(Parameter::new("new_message", CLType::String));
    vec.push(Parameter::new("hello_world_contract", CLType::Key));

    // In the named keys of the contract, add a key for the count.
    let named_keys = NamedKeys::new();

    // Create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // Add the entry point to the entry points object
    entry_points.add_entry_point(EntryPoint::new(
       "call_contract_2",
       vec,
       CLType::Unit,
       EntryPointAccess::Public,
       EntryPointType::Contract
    ));

    // The contract is stored in global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
       entry_points,                                        // entry points
       Some(named_keys),                                    // named keys 
       Some("contract2_package_name".to_string()),          // package name
       Some("contract2_access_uref".to_string())            // access uref
    );

    // To access from the account - named keys of the account
    runtime::put_key("cross_contract_2", stored_contract_hash.into());

}
```

After you run `make build-contract` in your second contract's directory, you should obtain the outcome:

```bash
cd contract && cargo build --release --target wasm32-unknown-unknown
   Compiling contract v0.1.0 (/Users/karolmarter/Desktop/Rust_Projects/cross-contract-2/contract)
    Finished release [optimized] target(s) in 0.69s
wasm-strip contract/target/wasm32-unknown-unknown/release/contract.wasm 2>/dev/null | true
```

Create the `keys` subfolder and copy the keys from the `keys` subfolder in the first contract into this subfolder.
The call from the terminal will look as follows:

```bash
casper-client put-deploy \
    --node-address http://136.243.187.84:7777 \
    --chain-name casper-test \
    --secret-key ./keys/secret_key.pem \
    --payment-amount 20000000000 \
    --session-path ./contract/target/wasm32-unknown-unknown/release/contract.wasm
```

:::tip

You may have noticed that the contract.wasm is always output to the same filename for each new `cargo casper` project. You can change this by editing the `Makefile` in the main directory. You can then observe the result by recompiling your contract with these commands;

```bash
make prepare
make build-contract
```
:::

After the deploy we can check if it was successful and inspect the runtime arguments of the deployed entry points.

The result of invoking the `put-deploy` subcommand is:

```bash
{
  "id": -7557689417621513622,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy_hash": "faeb7e4f010c20c88d2dd126da545933c26fd8ce370282b8cd49f7f6fe7304b9"
  }
}
```

:::tip

If the contract name doesn't change during concurrent deploys, the urefs/hashes will be overwritten in the account's named keys.

:::

Observing the deploy, we can see that it succeeded:

```bash
casper-client get-deploy \
    --node-address http://136.243.187.84:7777 af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832
```

In the `execution_results` JSON element we should see "Success".

```bash

    "execution_results": [
      {
        "block_hash": "bc3040214e46fe0eaa9d98150a8a67a1033b931619dbc3e5f1a841d3a2d6f869",
        "result": {
          "Success": {
            "cost": "16580565260",
            "effect": { ...
                
                }
            }
        }
    }
    ]

```

Get the state root hash of the current network state:

```bash
casper-client get-state-root-hash --node-address http://136.243.187.84:7777
```

The result of invoking the`get-state-root-hash` command is:

```bash
{
  "id": -3631326529646611302,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "state_root_hash": "2f3e100324deb999107229dbec5c4b724653174328c99ea0836931248c3cc9cb"
  }
}
```

Query the state of Casper network using the account hash:

```bash
  casper-client query-global-state \
  --node-address http://136.243.187.84:7777 \
  --state-root-hash 2f3e100324deb999107229dbec5c4b724653174328c99ea0836931248c3cc9cb \
  --key account-hash-ee57bb3b39eb66b74a1dcf12f3f0e7d8e906e34b11f85dc05497bf33fbf3a1f9
```

If we check the account's named keys, we can see all of the account's deployed contracts:

<details>
<summary><b>Account's named keys</b></summary>

```bash
{
  "id": -6842818667609668962,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "block_header": null,
    "merkle_proof": "[30424 hex chars]",
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-ee57bb3b39eb66b74a1dcf12f3f0e7d8e906e34b11f85dc05497bf33fbf3a1f9",
        "action_thresholds": {
          "deployment": 1,
          "key_management": 1
        },
        "associated_keys": [
          {
            "account_hash": "account-hash-ee57bb3b39eb66b74a1dcf12f3f0e7d8e906e34b11f85dc05497bf33fbf3a1f9",
            "weight": 1
          }
        ],
        "main_purse": "uref-453534c5c380862c2d814b5879f08fe6b5a3d4f031eaf20e08cf091d274035a5-007",
        "named_keys": [
          {
            "key": "uref-94c54f24273f1fb874eff33f3d4211a254622edfd1b980d5e758bd719b46fd0d-007",
            "name": "Hello_world_access_uref"
          },
          {
            "key": "hash-7a581d353665b74779dc8d446d33a5086bb367a29a558490d1e524f9c12002d3",
            "name": "Hello_world_package_name"
          },
          {
            "key": "uref-ae2f94bf959ec06a80b2035f31d7e4c65c01bf24bbbf794a473bc743c4b2f655-007",
            "name": "contract2_access_uref"
          },
          {
            "key": "hash-a7810282c275d525f083a756aba6912513a4a494ae317503cf6018c0fbaf9c4d",
            "name": "contract2_package_name"
          },
          {
            "key": "hash-32ad0e54e874f68706708ebfd2c5aba7803eb64ccff71a50d3c4d4f29db15c92",
            "name": "cross_contract_2"
          },
          {
            "key": "hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea",
            "name": "hello_world_contract"
          }
        ]
      }
    }
  }
}
```

</details>
<br></br>

As we have now managed to deploy two contracts, we can call the entry point of this contract, passing appropriate arguments to the function. 

The Uref of the message variable is stored under the Named Keys in the contract. 

```bash
casper-client query-global-state \
  --node-address http://136.243.187.84:7777 \
  --state-root-hash 2f3e100324deb999107229dbec5c4b724653174328c99ea0836931248c3cc9cb \
  --key hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea
```

```bash
{
  "id": 2434670480361972874,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "block_header": null,
    "merkle_proof": "[25224 hex chars]",
    "stored_value": {
      "Contract": {
        "contract_package_hash": "contract-package-wasm7a581d353665b74779dc8d446d33a5086bb367a29a558490d1e524f9c12002d3",
        "contract_wasm_hash": "contract-wasm-c0384d4041950780bd3b167b4516a306e308e2d4729d08f6d2b10dfa1dbdaad6",
        "entry_points": [
          {
            "access": "Public",
            "args": [
              {
                "cl_type": "String",
                "name": "message"
              }
            ],
            "entry_point_type": "Contract",
            "name": "update_msg",
            "ret": "Unit"
          }
        ],
        "named_keys": [
          {
            "key": "uref-aa758090d9bc1364754180f9f6bfc8821275038fd5d794a5dfb60bd2838a8670-007",
            "name": "message"
          }
        ],
        "protocol_version": "1.4.13"
      }
    }
  }
}
```

Checking the state of the message in the first contract, we observe the following:

```bash
casper-client query-global-state \
  --node-address http://136.243.187.84:7777 \
  --state-root-hash 2f3e100324deb999107229dbec5c4b724653174328c99ea0836931248c3cc9cb \
  --key hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea -q "message"
```

This is a simple `hello world` string. After invoking the entry point using the command below this value should change.

:::info

`--session-hash` - is the contract hash, which is returned from the put-deploy. 

`--session-arg` "hello world_contract:Key= ..." - the hash of the contract which we want to call from within the contract identified by the session-hash.

:::

```bash
casper-client put-deploy \
    --node-address http://136.243.187.84:7777 \
    --chain-name casper-test \
    --secret-key ./keys/secret_key.pem \
    --payment-amount 20000000000 \
    --session-hash hash-32ad0e54e874f68706708ebfd2c5aba7803eb64ccff71a50d3c4d4f29db15c92 \
    --session-entry-point "call_contract_2" \
    --session-arg "new_message:string='Hello new message!'" \
    --session-arg "hello_world_contract:Key='hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea'"
```

:::tip

The contract hash has to be of type `ContractHash` in the contract itself. We can pass the hash as a `Key` argument and change it to `ContractHash` in the smart contract.

:::

The output of the above command is:

```bash
{
  "id": -6419793201665396463,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy_hash": "15e11340d92fc9e64deb38bd942f4efb69caad0851eec24fd577070309d18537"
  }
}
```

Check the deploy with:

```bash
casper-client get-deploy \
    --node-address http://136.243.187.84:7777 15e11340d92fc9e64deb38bd942f4efb69caad0851eec24fd577070309d18537
```

After the deploy finishes successfully, you should see a similar outcome to the following:

<details>
<summary><b>Deploy details</b></summary>

```bash
{
  "id": 3968762702269106998,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy": {
      "approvals": [
        {
          "signature": "01319eee9bcfde6963e5b47164dd2c8044f0c20dd59f0c2993db55bec6bd3802fec2c9c6cae6ca8993c8aee0440be43f6c38bdc4bbdce501837ff5ca66fbd7c902",
          "signer": "010e732fe2fbbcf62f2e46500d4cd8ff58a3bfd8dcb44c8b6f9a87dc5d573556af"
        }
      ],
      "hash": "15e11340d92fc9e64deb38bd942f4efb69caad0851eec24fd577070309d18537",
      "header": {
        "account": "010e732fe2fbbcf62f2e46500d4cd8ff58a3bfd8dcb44c8b6f9a87dc5d573556af",
        "body_hash": "26282fa50b8e7c240025d683f197661ca846f2c1a3521a5dd604e6066d89d6d7",
        "chain_name": "casper-test",
        "dependencies": [],
        "gas_price": 1,
        "timestamp": "2023-03-09T14:39:24.974Z",
        "ttl": "30m"
      },
      "payment": {
        "ModuleBytes": {
          "args": [
            [
              "amount",
              {
                "bytes": "0500c817a804",
                "cl_type": "U512",
                "parsed": "20000000000"
              }
            ]
          ],
          "module_bytes": ""
        }
      },
      "session": {
        "StoredContractByHash": {
          "args": [
            [
              "new_message",
              {
                "bytes": "1200000048656c6c6f206e6577206d65737361676521",
                "cl_type": "String",
                "parsed": "Hello new message!"
              }
            ],
            [
              "hello_world_contract",
              {
                "bytes": "01b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea",
                "cl_type": "Key",
                "parsed": {
                  "Hash": "hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea"
                }
              }
            ]
          ],
          "entry_point": "call_contract_2",
          "hash": "32ad0e54e874f68706708ebfd2c5aba7803eb64ccff71a50d3c4d4f29db15c92"
        }
      }
    },
    "execution_results": [
      {
        "block_hash": "9c81259ac5ef7b953656a9327a479ae771a15c5ef131c91216e9e697dfdb09eb",
        "result": {
          "Success": {
            "cost": "462273650",
            "effect": {
              "operations": [],
              "transforms": [
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-453534c5c380862c2d814b5879f08fe6b5a3d4f031eaf20e08cf091d274035a5",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-453534c5c380862c2d814b5879f08fe6b5a3d4f031eaf20e08cf091d274035a5",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0600876bf27301",
                      "cl_type": "U512",
                      "parsed": "1597500000000"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "20000000000"
                  }
                },
                {
                  "key": "hash-32ad0e54e874f68706708ebfd2c5aba7803eb64ccff71a50d3c4d4f29db15c92",
                  "transform": "Identity"
                },
                {
                  "key": "hash-a7810282c275d525f083a756aba6912513a4a494ae317503cf6018c0fbaf9c4d",
                  "transform": "Identity"
                },
                {
                  "key": "hash-b48ccc725ba948405d01205e64acff09ac24c899aed8d649f7bc1572216266c2",
                  "transform": "Identity"
                },
                {
                  "key": "hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea",
                  "transform": "Identity"
                },
                {
                  "key": "hash-7a581d353665b74779dc8d446d33a5086bb367a29a558490d1e524f9c12002d3",
                  "transform": "Identity"
                },
                {
                  "key": "hash-c0384d4041950780bd3b167b4516a306e308e2d4729d08f6d2b10dfa1dbdaad6",
                  "transform": "Identity"
                },
                {
                  "key": "uref-aa758090d9bc1364754180f9f6bfc8821275038fd5d794a5dfb60bd2838a8670-000",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "1200000048656c6c6f206e6577206d65737361676521",
                      "cl_type": "String",
                      "parsed": "Hello new message!"
                    }
                  }
                },
                {
                  "key": "deploy-15e11340d92fc9e64deb38bd942f4efb69caad0851eec24fd577070309d18537",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "15e11340d92fc9e64deb38bd942f4efb69caad0851eec24fd577070309d18537",
                      "from": "account-hash-ee57bb3b39eb66b74a1dcf12f3f0e7d8e906e34b11f85dc05497bf33fbf3a1f9",
                      "gas": "462273650",
                      "source": "uref-453534c5c380862c2d814b5879f08fe6b5a3d4f031eaf20e08cf091d274035a5-007",
                      "transfers": []
                    }
                  }
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "00",
                      "cl_type": "U512",
                      "parsed": "0"
                    }
                  }
                },
                {
                  "key": "balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1",
                  "transform": {
                    "AddUInt512": "20000000000"
                  }
                }
              ]
            },
            "transfers": []
          }
        }
      }
    ]
  }
}
```

</details>
<br></br>

We would expect that the value of the message reference in the other contract would have changed, which we can check:

```bash
casper-client query-global-state \
  --node-address http://136.243.187.84:7777 \
  --state-root-hash 2f3e100324deb999107229dbec5c4b724653174328c99ea0836931248c3cc9cb \
  --key hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea -q "message"
```

The output of the above command is:

```bash
{
  "id": -5477027327608594231,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "block_header": null,
    "merkle_proof": "[61444 hex chars]",
    "stored_value": {
      "CLValue": {
        "bytes": "1200000048656c6c6f206e6577206d65737361676521",
        "cl_type": "String",
        "parsed": "Hello new message!"
      }
    }
  }
}
```

With this we have succeeded in cross-contract communication between two contracts.

## Summary {#summary}

In this tutorial, we:
- Developed two Rust contracts on a Casper network, where one smart contract is calling an entry point of the second smart contract
- Called an entry point on one contract from the other contract, passing a value as an argument to this entry point.
