# Create Casper Smart Contract

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is a Smart Contract
A smart contract is a self-executing computerized transaction protocol that is stored on the blockchain network and starts executing when predetermined conditions are met. 

Before diving into writing smart contracts on the Casper blockchain, it is mandatory to understand the difference between the [smart contract](./glossary/S/#smart-contract) and the [session code](./glossary/S/#session-code). Both are used to trigger actions on the network through a deployment. Refer to the smart contract vs session code guide for more information.

## Why Do You Want to Use a Smart Contract
Session code is useful when handling stateless, small scale and simple use cases. However, as your business logic increases in scope and complexity, a smart contract is the best approach. Smart contracts allow you to increase the scale while maintaining the state of more complex functionalities efficiently.

It also has added benefits like adding versions to contracts, the ability to send large wasm deploys to the network in a cost-effective way.

## How Casper Smart Contract Works
Casper smart contracts are programs that run on the Casper Network. These can express triggers, conditions, and business logic to enable complex programmable transactions. 

Casper smart contracts can be written in any language that compiles to wasm binaries. In this section of the tutorial, you will be focusing specifically on writing a smart contract in the Rust language. The rust compiler compiles the contract code to the wasm binary. After that, the wasm binary is sent to the network as part of the installation on the Casper Network through a node. Then, the node executes the wasm, adds it to the [global state](./glossary/G/#global-state), and [gossips](./design/p2p/#communications-gossiping) that deployed to other nodes. Finally, all the nodes in the network will repeat the process.


The Casper execution engine creates the new contract package automatically and assigns a [`ContractPackageHash`](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) for each package. The new contract is added to this contract package with a `contractHash` key. The contract is stored inside a `ContractPackage` which is a collection of contracts with different versions. ContractPackage is created through `new_contract` or `new_locked_contract` methods which are executed at the wasm installation step. 

The contract contains the required metadata and is primarily identified by its hash known as the contract hash.

<img src={useBaseUrl("/image/smart-contract/contract-package.png")} alt="contract-in-contract-package" width="500" align="center"/>

## How to Write a Basic Smart Contract

### Step 1. Creating the directory structure
First, create the directory for the new contract. This folder should have two sub-directories named `contract` and `test`. 

- `Contract` directory -  This contains the code that becomes the wasm which is eventually sent to the network    
- `test` directory -  This contains all the tests that you will send to the network

Use the below command to create a new contract folder. This creates the `contract` folder with */src/main.rs* file and *cargo.toml* file
```bash
cargo new [CONTRACT_NAME]
```
 
### Step 2. Configuring the main.rs file
a) Remove the auto-generated main function and add file configurations. 

b) Adjust the file attributes to support the wasm execution environment

- `#![no_main]` - This attribute indicates that the program won't use the standard main function as its entry point.
- `#![no_std]` - This attribute indicates that the program won't import standard libraries

c) Import the required dependencies
   - `contract_api` - This is a command-line tool for creating a Wasm smart contract and tests for use on the Casper network
   - `typescript` - These are the types shared by many Casper crates for use on the Casper network.

Add these dependencies to the *Cargo.toml* file
```typescript
[dependencies]
casper-contract = "1.4.3"
casper-types = "1.4.6"
```
Then, add the import line in the main.rs file along with other imports
```rust
use casper_contract::contract_api::{runtime, storage};
```

### Step 3. Define the global constants
Define these gloabl constants to use in the funtions. Use the below format to define the constants.

```typescript
const TOGGLE_ENTRY_POINT: &str = "toggle";
const ADDER_ENTRY_POINT: &str = "adder";
const TOGGLE_UREF: &str = "toggle";
const RESULT_UREF: &str = "result";
const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";
```

### Step 4. Defining the contract entry points
These are the functions that serve the contract's objectives. You can add meaningful names for these functions depending on the business logic it performs. You can start defining the entry point by adding `#[no_mangle]` to preserve method names. Then, define the variables for the entry points. Next, add the business logic you want to achieve using those variables, and finally, add code to save the state of results and any named-keys

This sample entry point takes two arguments: *number_1* and *number_2*, adds those as the *result* and writes the result of calling this entry point under the URef. You can see type convertions to String and URef and error handling are done within the same code.

```typescript
#[no_mangle]
pub extern "C" fn adder() {
let number_1: u64 = runtime::get_named_arg(ARG_NUMBER_1);
let number_2: u64 = runtime::get_named_arg(ARG_NUMBER_2);
let result = number_1 + number_2;
    let result_uref =  runtime::get_key("result")
        .unwrap_or_revert_with(ToggleError::ResultURefAbsent)
        .into_uref()
        .unwrap_or_revert();
    storage::write(result_uref, result);
}
```

:::note
Use  the `#[no_mangle]` flag to tell the compiler not to change or mangle the name of this function. 
:::

### Step 5. Adding the call function
This is the function that starts the code execution and will be the function responsible for installing the contract. If you have some setup or initialization required for our contract we can do it in this function.

#### a) Defining the runtime arguments
These parameters will be passed in as runtime arguments at the time of installation. Use this pattern of variable definition to collect any type of sentinel values that dictate the behavior of the contract. If the entry point takes in arguments then you must declare those as part of the definition of the entry point.

```typescript
let adder_parameter_1 = Parameter::new(ARG_NUMBER_1, CLType::U64);
let adder_parameter_2 = Parameter::new(ARG_NUMBER_2, CLType::U64);
```

#### b) Inserting the entry points to the call function
This step incorporates the previously created entry points to the call function binding the logic of the entry points to the contract. There must be a one-to-one mapping of entry definition to the entry points specified at this point. If the entry point is not inserted at this point, the execution engine will throw an error saying the entry point doesn't exist. All the entry points defined for this contract should be summoned inside the `call` function.

```typescript
let entry_points = {
let mut entry_points = EntryPoints::new();
let toggle_entry_point = EntryPoint::new(
            TOGGLE_ENTRY_POINT,
            vec![],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract
        );
```
The entry point should have the below arguments:
- `name` - Name of the entry point, this should be the same as the initial definition.
- `arguments` - A list of runtime arguments declared as part of the definition of the entry point.
- `return type` - CLType that is returned by the entry point. Use type *Unit* for empty return types.
- `access level` - Accessibility of the entry point.
- `entry point type` - This can be Contract or Session Code.


#### c) Adding the entry points  
This step adds the individual entry points using `add_entry_point` method to one object and returns it to the `new_contract` method.

```typescript
entry_points.add_entry_point(toggle_entry_point);
entry_points.add_entry_point(adder_entry_point);
entry_points
```
#### d) Creating the contract
Use the `new_contract` method to create the contract, with its named keys and its entry points. This creates the contract object and will save the access_uref and the contract package hash in the current context. The context in this specific use case is the context of the account calling the "call" function. The contract package will be created automatically with the contractPackageHash and the contract is added to the package later with the contractHash.

```typescript
let (toggle_contract, toggle_contract_version) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some("toggle_contract_package".to_string()),
        Some("toggle_contract_package_access_uref".to_string())
);
```
This section explains the creation of a basic smart contract. Usually, these contracts are upgradable with the ability to add new versions. if you want to prevent any upgrades to a contract use the `new_locked_contract` method to create the contract inside the call function.

#### Locked Contracts
Locked contracts cannot contain other versions in the same contract package, thus, they cannot be upgraded. In this scenario, the Casper execution engine will create a contract package, add a contract to that package and avoid any further upgrades to the contract. Use locked contracts when you need to  deal with very secure business scenarios and there is complicated business logic. 

```typescript
pub fn new_locked_contract(
    entry_points: EntryPoints,
    named_keys: Option<NamedKeys>,
    hash_name: Option<String>,
    uref_name: Option<String>,
) -> (ContractHash, ContractVersion) {
    create_contract(entry_points, named_keys, hash_name, uref_name, true)
}
```
- `entry_points`: The set of entry points defined inside the smart contract.
- `named_keys`: Any named-key pairs for the contract.
- `hash_name`: Contract hash value. Puts contract hash in current context's named keys under `hash_name`. 
- `uref_name`: Access URef value. Puts access_uref in current context's named keys under `uref_name`.

:::note
The current context is the context of the person who initiated the `call` function. Usually, it will be an account.
:::

#### e) Creating the named-keys
You can create named-keys as the last step to keep any record. Usually, `contract-hash` and `contract-version` is saved as the named-keys

```typescript
    runtime::put_key("toggle_contract_hash", toggle_contract.into());
    runtime::put_key("toggle_contract_version", storage::new_uref(toggle_contract_version).into());
```

This concludes the creation of a basic smart contract. You can refer to the below sample code of a contract file. 

<details>
<summary>Sample code - full version</summary>

```typescript
#![no_std]
#![no_main]
extern crate alloc;
use alloc::string::ToString;
use alloc::vec;
use alloc::vec::{vec, Vec};
use casper_contract::contract_api::{runtime, storage};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::contracts::NamedKeys;
use casper_types::{CLType, CLValue, EntryPoint, EntryPointAccess, EntryPoints, EntryPointType, Parameter};
const TOGGLE_ENTRY_POINT: &str = "toggle";
const ADDER_ENTRY_POINT: &str = "adder";
const TOGGLE_UREF: &str = "toggle";
const RESULT_UREF: &str = "result";
const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";

#[repr(u8)]
pub enum ToggleError {
    ToggleURefAbsent = 1,
    MissingToggleValue = 2,
    ToggleIsFalse = 3,
    ResultURefAbsent = 4,
}

#[no_mangle]
pub extern "C" fn toggle() {
    let toggle_uref = runtime::get_key(TOGGLE_UREF)
        .unwrap_or_revert_with(ToggleError::ToggleURefAbsent)
        .into_uref()
        .unwrap_or_revert();
let toggle: bool = storage::read(toggle_uref)
        .unwrap_or_revert()
        .unwrap_or_revert_with(ToggleError::MissingToggleValue);
let new_toggle_value = !toggle;
storage::write(toggle_uref, new_toggle_value);
}

#[no_mangle]
pub extern "C" fn adder() {
let toggle_uref = runtime::get_key(TOGGLE_UREF)
        .unwrap_or_revert_with(ToggleError::ToggleURefAbsent)
        .into_uref()
        .unwrap_or_revert();
let toggle: bool = storage::read(toggle_uref)
        .unwrap_or_revert()
        .unwrap_or_revert_with(ToggleError::MissingToggleValue);
    if !toggle {
        runtime::revert(ToggleError::ToggleIsFalse)
    }
let number_1: u64 = runtime::get_named_arg(ARG_NUMBER_1);
    let number_2: u64 = runtime::get_named_arg(ARG_NUMBER_2);
let result = number_1 + number_2;
    let result_uref =  runtime::get_key("result")
        .unwrap_or_revert_with(ToggleError::ResultURefAbsent)
        .into_uref()
        .unwrap_or_revert();
    storage::write(result_uref, result);
}

#[no_mangle]
pub extern "C" fn call() {
let toggle_uref = storage::new_uref(true);
let result_uref = storage::new_uref(0u64);
let mut named_keys = NamedKeys::new();
    named_keys.insert(TOGGLE_UREF.to_string(), toggle_uref.into());
    named_keys.insert(RESULT_UREF.to_string(), result_uref.into());
let entry_points = {
        let mut entry_points = EntryPoints::new();
let toggle_entry_point = EntryPoint::new(
            TOGGLE_ENTRY_POINT,
            vec![],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract
        );
let adder_parameter_1 = Parameter::new(ARG_NUMBER_1, CLType::U64);
let adder_parameter_2 = Parameter::new(ARG_NUMBER_2, CLType::U64);
let adder_entry_point = EntryPoint::new(
            ADDER_ENTRY_POINT,
            vec![adder_parameter_1, adder_parameter_2],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract
        );
entry_points.add_entry_point(toggle_entry_point);
        entry_points.add_entry_point(adder_entry_point);
entry_points
    };

let (toggle_contract, toggle_contract_version) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some("toggle_contract_package".to_string()),
        Some("toggle_contract_package_access_uref".to_string())
    );

    runtime::put_key("toggle_contract_hash", toggle_contract.into());
    runtime::put_key("toggle_contract_version", storage::new_uref(toggle_contract_version).into());
}
```
</details>


