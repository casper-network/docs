# Writing a Basic Smart Contract in Rust

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is a Smart Contract?

A smart contract is a self-contained program installed on a blockchain. In the context of a Casper network, a smart contract consists of contract code installed on-chain using a [Deploy](../../concepts/design/casper-design.md#execution-semantics-deploys). Casper smart contracts are programs that run on a Casper network. They interact with accounts and other contracts through entry points, allowing for various triggers, conditions, and logic.

Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. These contracts can, in turn, call one another to perform interconnected operations and create more complex programs. The decentralized nature of blockchain technology means that these smart contracts do not suffer from any single point of failure. Even if a Casper node leaves the network, other nodes will continue to allow the contract to operate as intended.

## Key Features of Casper Contracts

On the Casper platform, developers may write smart contracts in any language that compiles to Wasm binaries. This tutorial focuses specifically on writing a smart contract in the Rust language. The Rust compiler compiles the contract code into Wasm. After that, the Wasm binary can be [sent to a node](../cli/installing-contracts.md) on a Casper network using a Deploy. Nodes within the network then [gossip deploys](../../concepts/design/p2p.md#communications-gossiping), include them within a block, and finalize them. After finalizing, the network executes the deploys within the block.

Further, the Casper platform allows for [upgradable contracts](./upgrading-contracts.md). A [ContractPackage](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackage.html) is created through the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) or [new_locked_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_locked_contract.html) methods. Through these methods, the Casper execution engine creates the new contract package automatically and assigns a [`ContractPackageHash`](../../concepts/understanding-hash-types.md#hash-and-key-explanations). The new contract is added to this package with a [`ContractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) key. The execution engine stores the new contract within the contract package alongside any previously installed contract versions, if applicable.

The `new_contract` and `new_locked_contract` methods are a convenience that automatically creates the package associated with a new contract. Developers choosing not to use these methods must first create a contract package to function as a container for their new contract.

The contract contains required metadata, and it is primarily identified by its `ContractHash`. While the contract hash identifies a specific [ContractVersion](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html), the `ContractPackageHash` serves as an identifier for the most recent contract version in the contract package.

## Creating the Directory Structure {#directory-structure}

To begin creating a smart contract, you need to set up the project structure, either manually or automatically, as shown below.

```bash
project-directory/

└── contract/
    ├── src/
        └── main.rs
    └── Cargo.toml

└── Makefile
└── rust-toolchain

└── tests/
    ├── src/
        └── integration-tests.rs
    └── Cargo.toml
```

The project structure will be different while designing the full stack architecture. This will be expanded upon while describing the dApps.

### Automatically using cargo-casper {#automatic-project-setup}
The `cargo casper` [command](./getting-started.md#creating-a-project) can automatically set up the project structure, as shown above. This is the recommended way of setting up a new casper project. The `cargo casper` command will generate an example contract in the contract directory, as well as an example tests crate with logic defined in integration-tests.rs. The Makefile includes commands to prepare and build the contract and the rust-toolchain file specifies the target build version of rust.
### Semi-automatically using "vanilla" cargo {#semi-automatic-project-setup}
:::tip

As a beginner it is not advised to start with the semi-automatic project structure.
Structure created automatically with `cargo casper` contains everything that is needed to start coding.

:::

1. Create a top-level project directory for the contract code and its corresponding tests.

2. Inside the project directory, run the following command to create a new binary package called `contract`. Use a different name instead of `contract` if you wish.

    ```bash
    cargo new contract
    ```

    The command creates a `contract` folder with a `/src/main.rs` file and a `Cargo.toml` file:

    - `main.rs` - This file would contain the contract code.
    - `Cargo.toml` - This file would contain crate dependencies and other configurations.

    The following sections explain how to update these files using example code.

3. Inside the project directory, run the command to auto-generate the folder structure for the tests. Use a different name instead of `tests` if you wish.

    ```bash
    cargo new tests
    ```

    The command creates a `tests` folder with a `/src/main.rs` file and a `Cargo.toml` file:

    - `main.rs` - This file would store the unit test code required to test the contract. If you wish, you can rename the file to `integration-tests.rs` as shown in the example structure.
    - `Cargo.toml` - This is the file with test configurations.

    The [Testing Smart Contracts](./testing-contracts.md) guide explains how to update the tests using example code.

4. Other than cargo-casper, "vanilla" cargo does not create a Makefile and rust-toolchain configuration file for us. Therefore we need to manually add these to the root of our project tree.

Makefile:
```bash
prepare:
        rustup target add wasm32-unknown-unknown

build-contract:
        cd contract && cargo build --release --target wasm32-unknown-unknown
        wasm-strip contract/target/wasm32-unknown-unknown/release/contract.wasm 2>/dev/null | true

test: build-contract
        mkdir -p tests/wasm
        cp contract/target/wasm32-unknown-unknown/release/contract.wasm tests/wasm
        cd tests && cargo test

clippy:
        cd contract && cargo clippy --all-targets -- -D warnings
        cd tests && cargo clippy --all-targets -- -D warnings

check-lint: clippy
        cd contract && cargo fmt -- --check
        cd tests && cargo fmt -- --check

lint: clippy
        cd contract && cargo fmt
        cd tests && cargo fmt
```
rust-toolchain file:
```bash
nightly-2022-08-03
```
### Manually {#manual-project-setup}
:::tip

As a beginner it is not advised to start with the manual project structure.
Structure created automatically with `cargo casper` contains everything that is needed to start coding.

:::

1. Create a top-level project directory to store the contract code and its corresponding tests.

2. Create a folder for the contract code inside the project directory. This folder contains the logic that will be compiled into Wasm and executed on a Casper node. In this example, we named the folder `contract`. You can use a different folder name if you wish.

   - In the `contract` folder, add a source folder called `src` and a `Cargo.toml` file, which specifies the contract's dependencies.
   - Add a Rust file with the contract code in the `src` folder. In this example, we have the `main.rs` file.

3. Navigating back to the project directory, create a folder for the tests, which help verify the contract's functionality. In this example, we named the folder `tests`.

   - In the `tests` folder, add a source folder called `src` and a `Cargo.toml` file, which specifies the required dependencies to run the tests.
   - In the `src` folder, add a Rust file with the tests that verify the contract's behavior. In this example, we have the `integration-tests.rs` file.
4. Manually create Makefile and rust-toolchain as per [Semi-automatic setup (4.)](#semi-automatic-project-setup)
### Dependencies

The `Cargo.toml` file includes the dependencies and versions the contract requires. At a minimum, you need to import the latest versions of the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/) and [casper-types](https://docs.rs/casper-types/latest/casper_types/) crates. The following dependencies and version numbers are only examples and must be adjusted based on your requirements.


If you followed the [automatic setup](#automatic-project-setup), the dependencies should already be defined in `Cargo.toml`. For the [semi-automatic setup](#semi-automatic-project-setup) and [manual setup](#manual-project-setup) however, you'll need to manually add the dependencies to your crate's `Cargo.toml` file:

```toml
[dependencies]
# A library for developing Casper network smart contracts.
casper-contract = "1.4.4"
# Types shared by many Casper crates for use on a Casper network.
casper-types = "1.5.0"
```

- `casper-contract = "1.4.4"` - Provides the SDK for the execution engine (EE). The latest version of the crate is published [here](https://crates.io/crates/casper-contract).
- `casper-types = "1.5.0"` - Includes types shared by many Casper crates for use on a Casper network. This crate is necessary for the EE to understand and interpret the session code. The latest version of the crate is published [here](https://crates.io/crates/casper-types).



## Writing a Basic Smart Contract
At this point you either have the default example contract defined in `contract/main.rs` ([automatic](#automatic-project-setup) setup using cargo-casper), an empty `contract/main.rs` file ([manual](#manual-project-setup) project setup), or a rust "hello world" program defined in your `contract/main.rs` ([semi-automatic](#semi-automatic-project-setup) setup using "vanilla cargo"). In the following, you will write a new contract step-by-step. Therefore it is recommended to clear the content of contract/main.rs ( if any ).

This section covers the process of writing a smart contract in Rust, using example code from the [counter contract](https://github.com/casper-ecosystem/counter/). This simple contract allows callers to increment and retrieve an integer. Casper provides a [contract API](https://docs.rs/casper-contract/latest/casper_contract/contract_api/index.html) within the [`casper_contract`](https://docs.rs/casper-contract/latest/casper_contract/index.html) crate.

:::info

Important syntax elements used frequently in Rust:

- [Match](https://doc.rust-lang.org/rust-by-example/flow_control/match.html)<br />
- [Array](https://doc.rust-lang.org/rust-by-example/primitives/array.html)<br />
- [Loop](https://doc.rust-lang.org/rust-by-example/flow_control/loop.html)<br />
- [Vectors](https://doc.rust-lang.org/rust-by-example/std/vec.html)<br />
- [Functions](https://doc.rust-lang.org/rust-by-example/fn.html)<br />

To be able to comfortably write code in Rust it is crucial to understand these topics before going further into the examples.

:::

### Updating the `main.rs` File

To begin writing contract code, add the following file attributes to support the Wasm execution environment. If you still have an auto-generated `main.rs` file, remove the auto-generated main function.

```rust
#![no_std]
#![no_main]
```

- `#![no_main]` - This attribute tells the program not to use the standard main function as its entry point.
- `#![no_std]` - This attribute tells the program not to import the standard libraries.

#### Defining Required Dependencies

Add the required imports and dependencies. The example code for the counter contract declares the following dependencies.

```rust
// This code imports necessary aspects of external crates that we will use in our contract code.
extern crate alloc;

// Importing Rust types.
use alloc::{
    string::{String, ToString},
    vec::Vec,
};
// Importing aspects of the Casper platform.
use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
// Importing specific Casper types.
use casper_types::{
    api_error::ApiError,
    contracts::{EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, NamedKeys},
    CLType, CLValue, URef,
};
```

#### Defining the Global Constants

After importing the necessary dependencies, you should define the constants used within the contract, including entry points and values. The following example outlines the necessary constants for the counter contract.

```rust
// Creating constants for values within the contract package.
const CONTRACT_PACKAGE_NAME: &str = "counter_package_name";
const CONTRACT_ACCESS_UREF: &str = "counter_access_uref";

// Creating constants for the various contract entry points.
const ENTRY_POINT_COUNTER_INC: &str = "counter_inc";
const ENTRY_POINT_COUNTER_GET: &str = "counter_get";

// Creating constants for values within the contract.
const CONTRACT_VERSION_KEY: &str = "version";
const CONTRACT_KEY: &str = "counter";
const COUNT_KEY: &str = "count";
```

#### Defining the Contract Entry Points

Entry points provide access to contract code installed in global state. Either [session code](../../concepts/session-code.md) or another smart contract may call these entry points. A contract must have at least one entry point and may have more than one entry point. Entry points are defined by their name, and those names should be clear and self-describing. Each entry point is equivalent to a static main entry point in a traditional program.

Entry points are not functions or methods, and they have no arguments. They are static entry points into the contract's logic. Yet, the contract logic can access parameters by name, passed along with the Deploy. Note that another smart contract may access any of these entry points.

If an entry point has one or more mandatory parameters that will cause the logic to revert if they are not included, declare them within that entry point. Optional and non-critical parameters should be excluded.

When defining entry points, begin with a `#[no_mangle]` line to ensure that the system does not change critical syntax within the method names. Each entry point should contain the contract code that drives the action you wish it to accomplish. Finally, include any storage or return values needed, as applicable.

The following entry point is an example from the counter contract. To see all the available entry points, review the contract in [GitHub](https://github.com/casper-ecosystem/counter/blob/master/contract-v1/src/main.rs).

```rust
#[no_mangle]
pub extern "C" fn counter_inc() {
    let uref: URef = runtime::get_key(COUNT_KEY)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::add(uref, 1); // Increment the count by 1.
}
```

#### Defining the `call` Function

The `call` function starts the code execution and is responsible for installing the contract on-chain. In some cases, it also initializes some constructs, such as a Dictionary for record-keeping or a purse. The following steps describe how to structure the `call` function. Review the [call function](https://github.com/casper-ecosystem/counter/blob/8a622cd92d768893b9ef9fc2b150c674415be87e/contract-v1/src/main.rs#L55) in the counter contract.

1) Define the runtime arguments.

At the time of contract installation, pass in parameters as runtime arguments. Use this pattern of variable definition to collect any sentinel values that dictate the behavior of the contract. If the entry point takes in arguments, you must declare those as part of the entry point's definition.

Look at the [CEP-78 contract](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/contract/src/main.rs) to see examples of entry points taking in arguments. The counter contract does not use variable parameters since it is too simple.

2) Add the entry points into the `call` function.

The `call` function replaces a traditional `main` function and executes automatically when a caller interacts with the contract. Within the `call` function, we define entry points that the caller can access using session code or another contract. When writing code that calls an entry point, there must be a one-to-one mapping of the entry point name. Otherwise, the execution engine will return an error that the entry point does not exist.

Each entry point should have these arguments:

- `name` - The name of the entry point, which should be the same as the initial definition.
- `arguments` - A list of runtime arguments declared as part of the definition of the entry point.
- `return type` - The CLType that is returned by the entry point. Use the type *Unit* for empty return types.
- `access level` - Access permissions of the entry point.
- `entry point type` - This can be `contract` or `session` code.

This step adds the individual entry points to a `counter_entry_points` object using the `add_entry_point` method. This object will later be passed to the `new_contract` method.

```rust
#[no_mangle]
pub extern "C" fn call() {
    // Initialize the count to 0 locally
    let count_start = storage::new_uref(0_i32);
    // Create the entry points for this contract
    let mut counter_entry_points = EntryPoints::new();

    counter_entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_COUNTER_GET,
        Vec::new(),
        CLType::I32,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    counter_entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_COUNTER_INC,
        Vec::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
```
In the following, we will add more content to this call function.

3) Create the contract's named keys.

[NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) are a collection of String-Key pairs used to easily identify some network data.

- The [String](https://doc.rust-lang.org/nightly/alloc/string/struct.String.html) is the name given to identify the data
- The [Key](https://docs.rs/casper-types/latest/casper_types/enum.Key.html) is the data to be referenced

You can create named keys to store any record or value as needed, such as other accounts, smart contracts, URefs, transfers, deploy information, purse balances, etc. The entire list of possible Key variants can be found [here](https://docs.rs/casper-types/latest/casper_types/enum.Key.html).

For the counter, we store the integer that we increment into a named key.

```rust
    // In the named keys of the counter contract, add a key for the count.
    let mut counter_named_keys = NamedKeys::new();
    let key_name = String::from(COUNT_KEY);
    counter_named_keys.insert(key_name, count_start.into());
```

4) Create the contract.

Use the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) method to create the contract, with its named keys and entry points. This method creates the contract object and saves the access URef and the contract package hash in the caller's context. The execution engine automatically creates a contract package and assigns it a `contractPackageHash`. Then, it adds the contract to the package with a [`contractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html).

```rust
    // Create a new contract package that can be upgraded.
    let (stored_contract_hash, contract_version) = storage::new_contract(
        counter_entry_points,
        Some(counter_named_keys),
        Some(CONTRACT_PACKAGE_NAME.to_string()),
        Some(CONTRACT_ACCESS_UREF.to_string()),
    );
```

Usually, these contracts are upgradeable with the ability to add new [versions](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html). To add a new contract version, you will need the access URef to the contract package. This can be accomplished by passing the `Some(CONTRACT_ACCESS_UREF.to_string())` argument to the `new_contract` method. To prevent any upgrades to a contract, use the `new_locked_contract` method described [below](#locked-contracts).

5) Create additional named keys.

Generally, the `Contract_Hash` and `Contract_Version` are saved as `NamedKeys` in the account's context for later use.

```rust
    // Store the contract version in the context's named keys.
    let version_uref = storage::new_uref(contract_version);
    runtime::put_key(CONTRACT_VERSION_KEY, version_uref.into());

    // Create a named key for the contract hash.
    runtime::put_key(CONTRACT_KEY, stored_contract_hash.into());
```

The complete call function should look like this:

```rust
#[no_mangle]
pub extern "C" fn call() {
    // Initialize the count to 0 locally
    let count_start = storage::new_uref(0_i32);

    // In the named keys of the contract, add a key for the count
    let mut counter_named_keys = NamedKeys::new();
    let key_name = String::from(COUNT_KEY);
    counter_named_keys.insert(key_name, count_start.into());

    // Create entry points for this contract
    let mut counter_entry_points = EntryPoints::new();

    counter_entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_COUNTER_GET,
        Vec::new(),
        CLType::I32,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    counter_entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_COUNTER_INC,
        Vec::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    // Create a new contract package that can be upgraded
    let (stored_contract_hash, contract_version) = storage::new_contract(
        counter_entry_points,
        Some(counter_named_keys),
        Some(CONTRACT_PACKAGE_NAME.to_string()),
        Some(CONTRACT_ACCESS_UREF.to_string()),
    );

    /* To create a locked contract instead, use new_locked_contract and throw away the contract version returned
    let (stored_contract_hash, _) =
        storage::new_locked_contract(counter_entry_points, Some(counter_named_keys), None, None); */

    // Store the contract version in the context's named keys
    let version_uref = storage::new_uref(contract_version);
    runtime::put_key(CONTRACT_VERSION_KEY, version_uref.into());

    // Create a named key for the contract hash
    runtime::put_key(CONTRACT_KEY, stored_contract_hash.into());
}
```

## Locked Contracts {#locked-contracts}

Locked contracts cannot contain other contract [versions](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html) in the same contract package; thus, they cannot be upgraded. In this scenario, the Casper execution engine will create a contract package, add a contract to that package and prevent any further upgrades to the contract. Use locked contracts when you need to ensure high security and will not require updates to the contract.

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

The counter contract in our example would be locked if we created it this way:

```rust
let (stored_contract_hash, _) =
        storage::new_locked_contract(counter_entry_points, Some(counter_named_keys), None, None);
```

## Compiling Contract Code {#compiling-contract-code}

To compile the smart contract, run the following command in the directory hosting the `Cargo.toml` file and `src` folder.

```bash
rustup target add wasm32-unknown-unknown
cargo build --release --target wasm32-unknown-unknown
```

For the counter example, you may use the Makefile provided:

```bash
make prepare
make build-contract
```

## Executing Contract Code {#executing-contract-code}

Contract execution must be initiated through an outside call, usually via [session code](../../concepts/session-code.md) or another smart contract. Developers should also be familiar with the difference between contract code and session code, explained in the next section.

## Video Walkthrough {#video-walkthrough}

The following brief video accompanies this guide.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=6" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## What's Next? {#whats-next}

- Learn to [test your contract](./testing-contracts.md).
- Understand [session code](../../concepts/session-code.md) and how it triggers a smart contract.
- Learn to [install a contract and query global state](../cli/installing-contracts.md) with the Casper command-line client.
