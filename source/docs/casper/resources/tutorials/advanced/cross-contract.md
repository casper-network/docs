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

Having this in mind we will be building two contracts which reference each other in some shape or form. We will look at how the keys are deployed in the contracts context and how we can pass the contract hash into a deployed contract so another contract can be called.

## Creating the Project {#create-project}

In the appropriate folder, create the project for the contract using the following command:

```bash
cargo casper cross-contract
```

This will create the following structure under your desired smart contract folder:

```bash
project-directory/
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

// the elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// casper crates
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

// the elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// casper crates
use casper_types::{Key, CLType, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};


#[no_mangle]
pub extern "C" fn call() {

    // get the value of a passed parameter with the key "message"
    let value: String = runtime::get_named_arg("message");

    // the value will be wraped in a URef
    let value_ref = storage::new_uref(value);

    // creating the new set of named keys
    // the keys are a Map of Key/Value 
    let mut named_keys: BTreeMap<String, Key> = BTreeMap::new();

    // insert the new value into the named keys
    named_keys.insert(String::from("message"),value_ref.into()); // use into to wrap the value to the key
    // create a new vector 
    let mut vec = Vec::new();
    vec.push(Parameter::new("message", CLType::String));

    // create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // add the entry point to the entry points object
    entry_points.add_entry_point(EntryPoint::new(
        "update_msg",                   // the name of the entry point
        vec,                            // the arguments which can be passed into the entry point
        CLType::Unit,                   // return type of the entry point
        EntryPointAccess::Public,       // acces permissions - public can be accessed always
        EntryPointType::Contract        // in most cases it will be contract
    ));

    // the contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
        entry_points,                                       // entry points
        Some(named_keys),                                   // named keys 
        Some("Hello_world_package_name".to_string()),       // package name
        Some("Hello_world_access_uref".to_string())         // access uref
    );

    // to access from the account - named keys of the account
    runtime::put_key("hello_world_contract", stored_contract_hash.into());

}
```

:::tip

`runtime` and `storage` appear frequently in our code. If these terms are unfamiliar to you, you should familiarize yourself with the [Contract API Modules]( https://docs.rs/casper-contract/latest/casper_contract/contract_api/index.html).

:::

Each entry point defined within `call` must have a corresponding function with the same name defined in the contract. This means that if you change the key of an entry point, make sure to update the corresponding function name to avoid runtime errors, and vice versa. The compiler will not catch this error for you, so it is important to check this yourself.

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

// the elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use alloc::collections::BTreeMap;
use crate::alloc::string::ToString;


// casper crates
use casper_types::{Key, CLType, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};

#[no_mangle]
pub extern "C" fn update_msg() {

    let value: String = runtime::get_named_arg("message");
    // get the uref of the message stored in the global state
    let uref = runtime::get_key("message").unwrap_or_revert().into_uref().unwrap_or_revert();
    // write the message to the global state
    storage::write(uref, String::from(value));
}


#[no_mangle]
pub extern "C" fn call() {
    // get the value of a passed parameter with the key "message"
    let value: String = runtime::get_named_arg("message");
    // the value will be wraped in a URef
    let value_ref = storage::new_uref(value);
    // creating the new set of named keys
    // the keys are a Map of Key/Value 
    let mut named_keys: BTreeMap<String, Key> = BTreeMap::new();
    // insert the new value into the named keys
    named_keys.insert(String::from("message"),value_ref.into()); // use into to wrap the value to the key
    // create a new vector 
    let mut vec = Vec::new();
    vec.push(Parameter::new("message", CLType::String));
    // create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // add the entry point to the entry points object
    entry_points.add_entry_point(EntryPoint::new(
        "update_msg",
        vec,
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract
    ));

    // the contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
        entry_points,                                       // entry points
        Some(named_keys),                                   // named keys 
        Some("Hello_world_package_name".to_string()),       // package name
        Some("Hello_world_access_uref".to_string())         // access uref
    );

    // to access from the account - named keys of the account
    runtime::put_key("hello_world_contract", stored_contract_hash.into());
}
```

:::info

There is a distinction between storing data in a contract’s `NamedKeys` and using a dictionary. Dictionaries can be used to store dApp-centric data, but they are not a SQL database and should only be used for data that needs to be stored in global state. Objects referenced in a contract should only be used as links within a bigger application.

:::

## Deploying the Contract {#deploying-contract}

There are many tools available to send a deploy to a Casper network. The simplest method is to use the CLI with the [put_deploy](../../../developers/cli/installing-contracts.md#installing-contract-code).
If you are only developing smart contracts on the blockchain and not dealing with a full-stack application, this may be the primary way that you interact with a Casper network.

Be sure to go through the prerequisites from the [installing contracts](../../../developers/cli/installing-contracts.md) and make sure that after doing this you have:
1. Valid private key for your account.
2. Funded account with 2.000 CSPR on the Testnet, which you can use for testing.

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

When working with lengthy command strings, it may help to maintain a .txt file where you can edit the parameters of the commands before sending them to the CLI. This will save you time and frustration when working with multiple contracts and commands.

:::

Since we are using a standard contract structure, the command called from the `cross-contract` folder should be the following:

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

To verify that the contract was successfully deployed, call `get-deploy`, providing as parameter the `deploy-hash` received from the `put-deploy` above.

```bash
casper-client get-deploy \
    --node-address http://136.243.187.84:7777 af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832
```

This should return json output containing information such as header data, approvers and payments. Take time to familiarize yourself with the structure of the output. 

Since `af42bc6dbc58f677d138eb968d897f965f1ed118a40980bc16efbcc2a0c71832` is the deploy hash we can find this contract using the block explorer. When viewing through the explorer the status of the Deploy should be marked as `Success`.

In your account on `cspr.live`, in the tab `Named Keys`, all contracts which were deployed using the private key connected with this account will be linked. By clicking the contract hash, you can see all of the entry points of the contract, as well as the named keys (parameters) with which the contract has been deployed. Remember to keep these named keys organised, so you don't lose overview during bigger implementations.

We can see a Tab `Deploys` in the contract as well. This is empty for now. If we had a cross-contract call and an entry point to a different contract would have been called, this would be visible here. For now just make sure to note the hash of the contract, which is `hash-b7a06298cc71d4cac05929cc0713dfd5a541c68b71cb500cd04547b5cd0385ea` in this case.

## Create another contract for the cross-contract call {#cross-contract}

Let us write another contract, which we will also deploy on the Casper Network. This smart contract will contain a `call_contract_2` endpoint and after its invocation the previous contracts endpoint `update_msg` will be called.

In this tutorial we will be passing the contract hash as an argument into the caller method and use this to perform the calls to the destination contract.

Prepare the `call` contract method as described below:

```bash

#[no_mangle]
pub extern "C" fn call() {
    
    // create a new vector - this will be the signature of the entrypoint
    let mut vec = Vec::new();
    vec.push(Parameter::new("new_message", CLType::String));
    vec.push(Parameter::new("hello_world_contract", CLType::Key));

    // In the named keys of the contract, add a key for the count.
    let mut named_keys = NamedKeys::new();

    // create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // add the entry point to the entry points object
    entry_points.add_entry_point(EntryPoint::new(
       "call_contract_2",
       vec,
       CLType::Unit,
       EntryPointAccess::Public,
       EntryPointType::Contract
    ));

    // the contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
       entry_points,                                        // entry points
       Some(named_keys),                                    // named keys 
       Some("contract2_package_name".to_string()),          // package name
       Some("contract2_access_uref".to_string())            // access uref
    );

    // to access from the account - named keys of the account
    runtime::put_key("cross_contract_2", stored_contract_hash.into());
}

```

This would be the easiest implementation of the call function. There is only one entry point which accepts the key `contract2` of type `String` and the key `hello_world_contract` of the type `Key`. There aren't any named keys which will be saved in the contracts context. The contract is then stored in the global state and placed as a named key in the accounts context.

Now that we have defined the `call_contract_2` endpoint, we must implement the corresponding function. This endpoint will take the second contract hash as an argument and call the endpoint `update_msg` passing as parameter a message which will then be stored in the second contract's context. 

```bash
#[no_mangle]
pub extern "C" fn call_contract_2() {

    // get the contract hash from the named arguments passed to the call
    let contract_hash: ContractHash = runtime::get_named_arg::<Key>(CONTRACT_HASH)
    .into_hash()
    .map(|hash| ContractHash::new(hash))
    .unwrap();

    // get the value of the message from the second parameter  
    let new_value: String = runtime::get_named_arg("new_message");

    // Call the update_msg endpoint on the other contract with the parameter values
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

// the elementary types 
use alloc::string::String;
use alloc::vec::Vec;
use crate::alloc::string::ToString;
use crate::runtime_args::RuntimeArgs;

// casper crates
use casper_types::{
    api_error::ApiError,
    contracts::NamedKeys, runtime_args, CLType, Key, ContractHash, Parameter, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess};

use casper_contract::{
    unwrap_or_revert::UnwrapOrRevert,
    contract_api::{runtime, storage},
};

// the contract key in the account named keys
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
    
    // create a new vector - this will be the signature of the entrypoint
    let mut vec = Vec::new();
    vec.push(Parameter::new("new_message", CLType::String));
    vec.push(Parameter::new("hello_world_contract", CLType::Key));

    // In the named keys of the contract, add a key for the count.
    let named_keys = NamedKeys::new();

    // create an Entry Point Object
    let mut entry_points = EntryPoints::new();

    // add the entry point to the entry points object
    entry_points.add_entry_point(EntryPoint::new(
       "call_contract_2",
       vec,
       CLType::Unit,
       EntryPointAccess::Public,
       EntryPointType::Contract
    ));

    // the contract is stored in the global state
    let (stored_contract_hash, _contract_version) = storage::new_contract(
       entry_points,                                        // entry points
       Some(named_keys),                                    // named keys 
       Some("contract2_package_name".to_string()),          // package name
       Some("contract2_access_uref".to_string())            // access uref
    );

    // to access from the account - named keys of the account
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

After the deploy we can check if it was successful and inspect the parameters of the deployed entry points.

The output of the deployment is:

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

Observing the deploy, we can see that it has been successful:

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/Deploy.png")} width="600" alt="Deploy" />

If we check the account's named keys, we can see all of the account's deployed contracts:

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/NamedKeys.png")} width="600" alt="NamedKeys" />

As we have now managed to deploy two contracts, we can call the endpoint of this contract, passing appropriate arguments to the function. 

The Uref of the message variable is stored under the Named Keys in the contract. 
Checking the state of the message in the first contract, we observe the following:

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/HelloWorldBCC.png")} width="600" alt="HelloWorld" />

This is a simple `hello world` string. After invoking the endpoint using the command below this value should change.

:::info

`--session-hash` - is the contract hash, which is returned from the put-deploy. 

`--session-arg` "hello world_contract:Key= ..."  the hash of the contract which we want to call from within the contract identified by the session-hash.

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

The contract hash has to be of type `ContractHash` in the contract itself, we can pass the hash as a `Key` argument and change it to `ContractHash` in the smart contract.

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

After the deploy finishes successfuly, you should see a similar outcome to the following:

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/FunctionCall2.png")} width="600" alt="FunctionCall2" />

We would expect that the value of the message reference in the other contract would have changed, which we can check:

<img class="align-center" src={useBaseUrl("/image/tutorials/cross-contract/NewHelloWorld.png")} width="600" alt="NewHelloWorld" />

With this we have succesfully built a cross contract communication between two contracts.

## Summary {#summary}

In this tutorial, we:
- Discussed why cross-contract communication is sometimes necessary
- Developed two Rust contracts on the Casper Network where one smart contract is calling an entry point of the second smart contract
- Called an entry point on one contract from the other contract, passing a value as argument to this entry point.
