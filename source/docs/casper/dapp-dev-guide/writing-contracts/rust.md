# Writing a Basic Smart Contract in Rust

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is a Smart Contract?

A smart contract is a self-contained program installed on a blockchain. In the context of a Casper Network, a smart contract consists of contract code installed on chain using a [deploy](../../../design/execution-semantics/#execution-semantics-deploys).

Before writing smart contracts on a Casper Network, developers should be familiar with the difference between contract code and session code. Session code executes entirely within the context of the initiating account, while contract code executes within the context of its own state. Any action undertaken by a contract must initiate through an outside call, usually via session code.

## Why Do You Want to Use a Smart Contract?

Smart contracts exist as stored on-chain logic, thereby allowing disparate users to call the included entry points. These contracts can, in turn, call one another to perform interconnected operations and create more complex programs. The decentralized nature of blockchain technology means that these smart contracts do not suffer from any single point of failure. Even if a Casper node leaves the network, other nodes will continue to allow the contract to operate as intended.

Further, the Casper platform allows for [upgradable contracts](/dapp-dev-guide/writing-contracts/upgrading-contracts/) and implementation through a variety of developer-friendly programming languages. 

## Smart Contracts on Casper

Casper smart contracts are programs that run on a Casper Network. They interact with accounts and other contracts through entry points and allow for various triggers, conditions and logic.

On the Casper platform, developers may write smart contracts in any language that compiles to Wasm binaries. In this tutorial, we will focus specifically on writing a smart contract in the Rust language. The Rust compiler will compile the contract code into Wasm binary. After that, we will send the Wasm binary to a node on a Casper Network using a `put_deploy`. Nodes within the network then [gossip deploys](../../../design/p2p/#communications-gossiping), include them within a block and finalize them. After finalizing, deploys within the block are executed by the network.

A ContractPackage is created through the `new_contract` or `new_locked_contract` methods. Through these methods, the Casper execution engine creates the new contract package automatically and assigns a [`ContractPackageHash`](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations). The new contract is added to this contract package with a [`ContractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) key. The execution engine stores the new contract within the contract package, alongside any previously installed versions of the contract, if applicable.

The `new_contract` and `new_locked_contract` methods are a convenience that automatically creates the package associated with a new contract. Developers choosing not to use these methods must first create a contract package to function as a container for their new contract.

The contract contains required metadata and it is primarily identified by its hash, known as the contract hash. The [`contractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) identifies a specific [version of a contract](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html) and the `contractPackageHash` serves as a more stable identifier for the most recent version.

## Difference Between Session Code and Smart Contract

| Session Code | Smart Contract |
| --- | --- |
| Session code always executes in the context of the account that signed the deploy that contains the session code. | A smart contract  which is stored on chain logic, executes within its own separate context. |
| When a `put_key` call is made within the body of the session code, the key is added to the account's named keys. | When a `put_key` call is made within the smart contract's context, the contract's record is modified to have a new named_key entry. |
| Session code has only one entry point `call`, which can be used to interact with the session code. | A smart contract can have multiple entry points that will help you interact with the contract code.|  
| Any action taken by the session code is initiated by the `call` entry point within the session code. | Any action undertaken by a contract must initiate through an outside call, usually via session code.|
| For more information on how to write session code, see [Writing Session Code](../writing-contracts/session-code.md) | For more information on writing contracts, see [Writing a Basic Smart Contract in Rust](#writing-a-basic-smart-contract)

## Writing a Basic Smart Contract

As stated, this tutorial covers the process of writing a smart contract in the Rust programming language. Casper provides a [contract API](https://docs.rs/casper-contract/latest/casper_contract/contract_api/index.html) within our [`casper_contract`](https://docs.rs/casper-contract/latest/casper_contract/index.html) crate.

This tutorial creates a simple smart contract that allows callers to donate funds to a purse owned by the contract, as well as track the total funds received and the number of individual contributions.

-------

### Step 1. Creating the Directory Structure

First, create the directory for the new contract. This folder should have two sub-directories named `contract` and `test`.

- `contract` -  This directory contains the code that becomes the Wasm, which is eventually sent to the network.    
- `test` -  This is an optional directory that will contain tests for unit testing and asserting that the behavior of the contract matches expectations. As users must pay for execution, these tests should be considered a best practice. However, they are not required.

Use the below command to create a new contract folder. This creates the `contract` folder with */src/main.rs* file and *cargo.toml* file

```bash

cargo new [CONTRACT_NAME]

```
--------


### Step 2. Configuring the Main.rs File

1) Remove the auto-generated main function and add file configurations. 

2) Adjust the file attributes to support the Wasm execution environment.

- `#![no_main]` - This attribute tells the program not to use the standard main function as its entry point.
- `#![no_std]` - This attribute tells the program not to import the standard libraries.

3) Import the required dependencies.

- `casper-contract - A library for developing Casper network smart contracts. This crate contains the API required to author smart contracts
- `casper_types` - These are the types shared by many Casper crates for use on a Casper Network.

Add these dependencies to the *Cargo.toml* file.

```typescript

[dependencies]
// A library for developing Casper network smart contracts.
casper-contract = "1.4.4"
// Types shared by many Casper crates for use on a Casper Network.
casper-types = "1.4.6"

```

Then, add your imports in the main.rs file along with other imports.

```rust

// This code imports necessary aspects of external crates that we will use in our contract code.

extern crate alloc;

// Importing Rust types.
use alloc::string::{String, ToString};
use alloc::vec;
// Importing aspects of the Casper platform.
use casper_contract::contract_api::storage::dictionary_get;
use casper_contract::contract_api::{runtime, storage, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
// Importing specific Casper types.
use casper_types::account::AccountHash;
use casper_types::contracts::NamedKeys;
use casper_types::{runtime_args, CLType, CLValue, EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Key, Parameter, ApiError, RuntimeArgs};

```

### Step 3. Defining the Global Constants

After importing the necessary dependencies, you should define the constants that you will use within the contract itself. This includes both entry points and values. The following example outlines the necessary constants for our example contract. 

```rust

// Creating constants for the various contract entry points.
const ENTRY_POINT_INIT: &str = "init";
const ENTRY_POINT_DONATE: &str = "donate";
const ENTRY_POINT_GET_DONATION_COUNT: &str = "get_donation_count";
const ENTRY_POINT_GET_FUNDS_RAISED: &str = "get_funds_raised";

// Creating constants for values within the contract.
const DONATING_ACCOUNT_KEY: &str = "donating_account_key";
const LEDGER: &str = "ledger";
const FUNDRAISING_PURSE: &str = "fundraising_purse";

```

### Step 4. Defining the Contract Entry Points

Entry points serve as a means to access contract code installed on global state. These entry points may be called by either session code or another smart contract. When writing the Wasm producing code for a smart contract, you must define entry points by using meaningful names that describe the actions that they perform.

A smart contract is Wasm binary produced from Wasm-producing logic. The Wasm-producing code has one or more entry points that can be called by external logic. When writing your own smart contract, you must have at least one entry point and you may have more than one entry point. Entry points are defined by their name and those names should be clear and self-describing. Each entry point is effectively equivalent to a static main entry point in a traditional program.

Entry points are not functions or methods, they have no arguments. They are a static entry point into the logic. Yet, parameters are available in the body of the logic. Parameters that were passed along with the Deploy are accessible by name to the smart contract logic. The smart contract may access any of these entry points, or none of them as required.

If your entry point has one or more parameters that will cause the logic to revert if they are not included, you should declare them within that entry point. Any other parameters that are conditionally looked for, but are not critical for execution, should not be included.

When defining entry points, begin with a `#[no_mangle]` line to ensure that the system does not change critical syntax within the method names. Each entry point should contain the contract code that drives the action you wish it to accomplish. Finally, include any storage or return values needed as applicable.

```rust

// This entry point initializes the donation system, setting up the fundraising purse
// and creating a dictionary to track the account hashes and the number of donations
// made.
#[no_mangle]
pub extern "C" fn init() {
    let fundraising_purse = system::create_purse();
    runtime::put_key(FUNDRAISING_PURSE, fundraising_purse.into());
    // Create a dictionary to track the mapping of account hashes to number of donations made.
    storage::new_dictionary(LEDGER).unwrap_or_revert();
}

// This is the donation entry point. When called, it records the caller's account
// hash and returns the donation purse, with add access, to the immediate caller.
#[no_mangle]
pub extern "C" fn donate() {
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);
    if let Key::Account(donating_account_hash) = donating_account_key {
        update_ledger_record(donating_account_hash.to_string())
    } else {
        runtime::revert(FundRaisingError::InvalidKeyVariant)
    }
    let donation_purse = *runtime::get_key(FUNDRAISING_PURSE)
        .unwrap_or_revert_with(FundRaisingError::MissingFundRaisingPurseURef)
        .as_uref()
        .unwrap_or_revert();
    // The return value is the donation_purse URef with `add` access only. As a result
    // the entity receiving this purse URef may only add to the purse, and cannot remove
    // funds.
    let value = CLValue::from_t(donation_purse.into_add()).unwrap_or_revert();
    runtime::ret(value)
}

// This entry point returns the amount of donations from the caller.
#[no_mangle]
pub extern "C" fn get_donation_count() {
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);
    if let Key::Account(donating_account_hash) = donating_account_key {
        let ledger_seed_uref = *runtime::get_key(LEDGER)
            .unwrap_or_revert_with(FundRaisingError::MissingLedgerSeedURef)
            .as_uref()
            .unwrap_or_revert();
        let donation_count = if let Some(donation_count) =
            storage::dictionary_get::<u64>(ledger_seed_uref, &donating_account_hash.to_string())
                .unwrap_or_revert()
        {
            donation_count
        } else {
            0u64
        };
        runtime::ret(CLValue::from_t(donation_count).unwrap_or_revert())
    } else {
        runtime::revert(FundRaisingError::InvalidKeyVariant)
    }
}

// This entry point returns the total funds raised.
#[no_mangle]
pub extern "C" fn get_funds_raised() {
    let donation_purse = *runtime::get_key(FUNDRAISING_PURSE)
        .unwrap_or_revert_with(FundRaisingError::MissingFundRaisingPurseURef)
        .as_uref()
        .unwrap_or_revert();
    let funds_raised = system::get_purse_balance(donation_purse)
        .unwrap_or_revert();
    runtime::ret(CLValue::from_t(funds_raised).unwrap_or_revert())
}

```

### Step 5. Defining the Call Function

The `call` function starts the code execution and is the function responsible for installing the contract. In this case, it also initializes the contract by creating a donation purse and ledger for record-keeping.

1) Define the runtime arguments.

At the time of contract installation, pass in parameters as runtime arguments. Use this pattern of variable definition to collect any sentinel values that dictate the behavior of the contract. If the entry point takes in arguments, you must declare those as part of the definition of the entry point.

In the donation contract example, the only variable parameter is the `DONATING_ACCOUNT_KEY`.

2) Insert the entry points into the `call` function.

The `call` function replaces a traditional `main` function and executes automatically when a caller interacts with the contract code. Within the `call` function, we define entry points that the caller can access using another instance of code. The calling code may be an instance of session or contract code. When writing code that will call an entry point, there must be a one-to-one mapping of the entry point name. Otherwise, the execution engine will return an error that the entry point does not exist.

```rust

//This is the full `call` function as defined within the donation contract.
#[no_mangle]
pub extern "C" fn call() {
    // This establishes the `init` entry point for initializing the contract's infrastructure.
    let init_entry_point = EntryPoint::new(
        ENTRY_POINT_INIT,
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    );

    // This establishes the `donate` entry point for callers looking to donate.
    let donate_entry_point = EntryPoint::new(
        ENTRY_POINT_DONATE,
        vec![Parameter::new(DONATING_ACCOUNT_KEY, CLType::Key)],
        CLType::URef,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    );

    // This establishes an entry point called `donation_count` that returns the amount of
    // donations from a specific account.
    let get_donation_count_entry_point = EntryPoint::new(
        ENTRY_POINT_GET_DONATION_COUNT,
        vec![Parameter::new(DONATING_ACCOUNT_KEY, CLType::Key)],
        CLType::U64,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    );

    // This establishes an entry point called `funds_raised` that returns the total amount
    // donated by all participants.
    let funds_raised_entry_point = EntryPoint::new(
        ENTRY_POINT_GET_FUNDS_RAISED,
        vec![],
        CLType::U512,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    );
}

```

The entry point should have the below arguments:

- `name` - Name of the entry point, which should be the same as the initial definition.

- `arguments` - A list of runtime arguments declared as part of the definition of the entry point.

- `return type` - CLType that is returned by the entry point. Use type *Unit* for empty return types.

- `access level` - Access permissions of the entry point.

- `entry point type` - This can be `contract` or `session` code.

3) Add the entry points.

This step adds the individual entry points using the `add_entry_point` method to one object and returns it to the `new_contract` method.

```rust

    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(init_entry_point);
    entry_points.add_entry_point(donate_entry_point);
    entry_points.add_entry_point(get_donation_count_entry_point);
    entry_points.add_entry_point(funds_raised_entry_point);

```

4) Create the contract.

Use the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) method to create the contract, with its [named keys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) and entry points. This method creates the contract object and saves the access URef and the contract package hash in the context of the caller. The execution engine automatically creates a contract package and assigns it a `contractPackageHash`. Then, it adds the contract to the package with a [`contractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html).

```rust

let (contract_hash, _contract_version) = storage::new_contract(
        entry_points,
        None,
        Some("fundraiser_package_hash".to_string()),
        Some("fundraiser_access_uref".to_string()),
    );

    runtime::put_key("fundraiser_contract_hash", contract_hash.into());
    // Call the init entry point to setup and create the fundraising purse
    // and the ledger to track donations made.
    runtime::call_contract::<()>(contract_hash, ENTRY_POINT_INIT, runtime_args! {})

```

Usually, these contracts are upgradable with the ability to add new [versions](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html). To add a new contract version, you will need the access URef to the contract package. This can be accomplished by passing the `Some("fundraiser_access_uref".to_string())` argument to the `new_method` contract. If you want to prevent any upgrades to a contract, use the `new_locked_contract` method to create the contract inside the call function.

#### Locked Contracts

Locked contracts cannot contain other [versions](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html) in the same contract package; thus, they cannot be upgraded. In this scenario, the Casper execution engine will create a contract package, add a contract to that package and prevent any further upgrades to the contract. Use locked contracts when you need to ensure high security and will not require updates to your contract. 

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

- `entry_points` - The set of entry points defined inside the smart contract.
- `named_keys` - Any [named-key](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) pairs for the contract.
- `hash_name` - Contract hash value. Puts [contractHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) in the current context's named keys under `hash_name`. 
- `uref_name` - Access URef value. Puts access_uref in the current context's named keys under `uref_name`.

**Note**: The current context is the context of the person who initiated the `call` function, usually an account.

5) Create the `NamedKeys`.

You can create [`NamedKeys`](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) as the last step to store any record or value as needed. Generally, `Contract_Hash` and `Contract_Version` are saved as `NamedKeys`, but you are not limited to these values.

## What's Next? {#whats-next}

- Learn to [test your contract](/dapp-dev-guide/writing-contracts/testing)
- Learn to [install a contract and query global state](/dapp-dev-guide/writing-contracts/installing-contracts.md) with the Casper command-line client
