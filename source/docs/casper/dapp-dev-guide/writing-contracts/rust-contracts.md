# Writing a Basic Smart Contract in Rust

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is a Smart Contract?

A smart contract is a self-contained program installed on a blockchain. In the context of a Casper network, a smart contract consists of contract code installed on-chain using a [Deploy](/design/casper-design.md/#execution-semantics-deploys). Casper smart contracts are programs that run on a Casper network. They interact with accounts and other contracts through entry points, allowing for various triggers, conditions, and logic.

Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. These contracts can, in turn, call one another to perform interconnected operations and create more complex programs. The decentralized nature of blockchain technology means that these smart contracts do not suffer from any single point of failure. Even if a Casper node leaves the network, other nodes will continue to allow the contract to operate as intended.

Further, the Casper platform allows for [upgradable contracts](/dapp-dev-guide/writing-contracts/upgrading-contracts/) and implementation through various developer-friendly programming languages. 

## Key Features of Casper Contracts

On the Casper platform, developers may write smart contracts in any language that compiles to Wasm binaries. This tutorial focuses specifically on writing a smart contract in the Rust language. The Rust compiler compiles the contract code into Wasm binary. After that, the Wasm binary can be [sent to a node](/dapp-dev-guide/writing-contracts/installing-contracts/) on a Casper network using a Deploy. Nodes within the network then [gossip deploys](/design/p2p/#communications-gossiping), include them within a block, and finalize them. After finalizing, the network executes the deploys within the block.

A [ContractPackage](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackage.html) is created through the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) or [new_locked_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_locked_contract.html) methods. Through these methods, the Casper execution engine creates the new contract package automatically and assigns a [`ContractPackageHash`](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations). The new contract is added to this contract package with a [`ContractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) key. The execution engine stores the new contract within the contract package alongside any previously installed contract versions, if applicable.

The `new_contract` and `new_locked_contract` methods are a convenience that automatically creates the package associated with a new contract. Developers choosing not to use these methods must first create a contract package to function as a container for their new contract.

The contract contains required metadata, and it is primarily identified by its `ContractHash`. While the contract hash identifies a specific [ContractVersion](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html), the `ContractPackageHash` serves as an identifier for the most recent contract version in the contract package.

## Creating the Directory Structure {#directory-structure}

To begin creating a smart contract, you will need to set up the project structure, either manually or automatically, as shown below.

```bash
project-directory/
└── contract/
    ├── src/
        └── main.rs
    └── Cargo.toml
└── tests/
    ├── src/
        └── integration-tests.rs
    └── Cargo.toml
```

### Creating the Project Manually

1. Create a top-level project directory for the contract code and its corresponding tests.

2. Create a folder for the contract code inside the project directory. This folder contains the logic that will be compiled into Wasm and executed on a Casper node. In this example, we named the folder `contract`. You can use a different folder name if you wish.

   - In the `contract` folder, add a source folder called `src` and a `Cargo.toml` file, specifying the contract code's required dependencies.
   - Add a Rust file with the contract code in the `src` folder. In this example, the `main.rs` contains the contract code.

3. Inside the project directory, create a folder for the corresponding tests, which help test the functionality of the contract code. In this example, we named the folder `tests`.

   - In the `tests` folder, add a source folder called `src` and a `Cargo.toml` file, which specifies the required dependencies to run the tests.
   - In the `src` folder, add a Rust file with the tests that verify the contract code. In this example, the `integration-tests.rs` file contains the tests.

### Creating the Project Automatically

The `cargo casper` command can automatically set up the project structure, as shown [here](/dapp-dev-guide/writing-contracts/getting-started#creating-a-project). 

Alternatively, follow the steps below to customize the project a little. 

1. Create a top-level project directory for the contract code and its corresponding tests.

2. Inside the project directory, run the following command to create a new binary package called `contract`. Use a different name instead of `contract` if you wish. In the `contract/src` folder, the auto-generated `main.rs` file would contain the contract code. 

```bash
cargo new contract
```

3. Inside the project directory, run the command to auto-generate the folder structure for the tests. Use a different name instead of `tests` if you wish.

```bash
cargo new tests
```

The command above creates the `tests` folder with the `/src/main.rs` file and the `Cargo.toml` file.

- `main.rs` - This file contains the unit test code required to test the contract. If you wish, you can rename the file to `integration-tests.rs` as shown in the example structure above.
- `Cargo.toml` - This is the file with project configurations.

## Writing a Basic Smart Contract

This section covers the process of writing a smart contract in Rust, using example code from the [counter contract](https://github.com/casper-ecosystem/counter/). This simple contract allows callers to increment and retrieve an integer. Casper provides a [contract API](https://docs.rs/casper-contract/latest/casper_contract/contract_api/index.html) within the [`casper_contract`](https://docs.rs/casper-contract/latest/casper_contract/index.html) crate.

### Configuring the `main.rs` File

1) Remove the auto-generated main function and add file configurations. 

2) Adjust the file attributes to support the Wasm execution environment.

- `#![no_main]` - This attribute tells the program not to use the standard main function as its entry point.
- `#![no_std]` - This attribute tells the program not to import the standard libraries.

3) Import the required dependencies.

- `casper-contract - A library for developing Casper network smart contracts. This crate contains the API required to author smart contracts
- `casper_types` - These are the types shared by many Casper crates for use on a Casper Network.

Add these dependencies to the *Cargo.toml* file. Check the latest version of [casper-contract](https://crates.io/crates/casper-contract) and [casper-types](https://crates.io/crates/casper-types).

```typescript
[dependencies]
// A library for developing Casper network smart contracts.
casper-contract = "1.4.4"
// Types shared by many Casper crates for use on a Casper Network.
casper-types = "1.5.0"
```

Then, add your imports to the `main.rs` file. The example code for the counter contract uses the following crates.

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

### Defining the Global Constants

After importing the necessary dependencies, you should define the constants used within the contract, including entry points and values. The following example outlines the necessary constants for our example contract. 

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

### Defining the Contract Entry Points

Entry points provide access to contract code installed on global state. Either session code or another smart contract may call these entry points. When writing the Wasm-producing code for a smart contract, you must define entry points by using meaningful names that describe their actions.

The Wasm-producing code has one or more entry points that can be called by external logic. When writing your smart contract, you must have at least one entry point, and you may have more than one entry point. Entry points are defined by their name, and those names should be clear and self-describing. Each entry point is effectively equivalent to a static main entry point in a traditional program.

Entry points are not functions or methods, and they have no arguments. They are static entry points into the contract's logic. Yet, the contract logic can access parameters by name, passed along with the Deploy. Note that another smart contract may access any of these entry points.

If your entry point has one or more mandatory parameters that will cause the logic to revert if they are not included, you should declare them within that entry point. Optional and non-critical parameters should be excluded.

When defining entry points, begin with a `#[no_mangle]` line to ensure that the system does not change critical syntax within the method names. Each entry point should contain the contract code that drives the action you wish it to accomplish. Finally, include any storage or return values needed, as applicable.

The following entry point is an example from the counter contract. To see all the available entry points, review the contract in [GitHub](https://github.com/casper-ecosystem/counter/).

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

### Defining the Call Function

The `call` function starts the code execution and is responsible for installing the contract. In some cases, it also initializes the contract by creating other required constructs, such as a Dictionary for record-keeping or a purse.

1) Define the runtime arguments.

At the time of contract installation, pass in parameters as runtime arguments. Use this pattern of variable definition to collect any sentinel values that dictate the behavior of the contract. If the entry point takes in arguments, you must declare those as part of the definition of the entry point.

In the counter contract, we do not have variable parameters. However, you can look at the [CEP-78 contract](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/contract/src/main.rs) for a more complex reference contract.

2) Add the entry points into the `call` function.

The `call` function replaces a traditional `main` function and executes automatically when a caller interacts with the contract code. Within the `call` function, we define entry points that the caller can access using another instance of code. The calling code may be an instance of session or contract code. When writing code that will call an entry point, there must be a one-to-one mapping of the entry point name. Otherwise, the execution engine will return an error that the entry point does not exist.

Each entry point should have these arguments:

- `name` - Name of the entry point, which should be the same as the initial definition.
- `arguments` - A list of runtime arguments declared as part of the definition of the entry point.
- `return type` - CLType that is returned by the entry point. Use type *Unit* for empty return types.
- `access level` - Access permissions of the entry point.
- `entry point type` - This can be `contract` or `session` code.

Review the full [call function](https://github.com/casper-ecosystem/counter/blob/b37f1ff5f269648ed2bbc5e182128f17e65fe710/contract/src/main.rs#L52) defined within the counter contract.

This step adds the individual entry points to an object using the `add_entry_point` method. This object will later be passed to the `new_contract` method.

```rust
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

3) Create the `NamedKeys`.

[NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html)
are a collection of String-Key pairs used to easily identify some network data.

- The [String](https://doc.rust-lang.org/nightly/alloc/string/struct.String.html) is the name given to identify the data
- The [Key](https://docs.rs/casper-types/latest/casper_types/enum.Key.html) is the data to be referenced

You can create [`NamedKeys`](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) to store any record or value as needed. Generally, `Contract_Hash` and `Contract_Version` are saved as `NamedKeys`, but you are not limited to these values. You can reference other accounts, smart contracts, URefs, transfers, deploy information, purse balances etc. The entire list of possible Key variants can be found [here](https://docs.rs/casper-types/latest/casper_types/enum.Key.html).


4) Create the contract.

Use the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) method to create the contract, with its [named keys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html) and entry points. This method creates the contract object and saves the access URef and the contract package hash in the caller's context. The execution engine automatically creates a contract package and assigns it a `contractPackageHash`. Then, it adds the contract to the package with a [`contractHash`](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html).

```rust
    // Create a new contract package that can be upgraded.
    let (stored_contract_hash, contract_version) = storage::new_contract(
        counter_entry_points,
        Some(counter_named_keys),
        Some(CONTRACT_PACKAGE_NAME.to_string()),
        Some(CONTRACT_ACCESS_UREF.to_string()),
    );

    // Store the contract version in the context's named keys.
    let version_uref = storage::new_uref(contract_version);
    runtime::put_key(CONTRACT_VERSION_KEY, version_uref.into());

    // Create a named key for the contract hash.
    runtime::put_key(CONTRACT_KEY, stored_contract_hash.into());
```

Usually, these contracts are upgradeable with the ability to add new [versions](https://docs.rs/casper-types/latest/casper_types/contracts/type.ContractVersion.html). To add a new contract version, you will need the access URef to the contract package. This can be accomplished by passing the `Some(CONTRACT_ACCESS_UREF.to_string())` argument to the `new_contract` method. To prevent any upgrades to a contract, use the `new_locked_contract` method instead, and create a locked contract.

## Locked Contracts

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

The counter contract in our example would be locked if we created it this way:

```rust
let (stored_contract_hash, _) =
        storage::new_locked_contract(counter_entry_points, Some(counter_named_keys), None, None); 
```

## Contracts and Session Code

Developers should also be familiar with the difference between contract code and session code. Session code executes entirely within the context of the initiating account, while contract code executes within its context. Any action undertaken by a contract must initiate through an outside call, usually via session code.

## What's Next? {#whats-next}

- Learn to [test your contract](/dapp-dev-guide/writing-contracts/testing-contracts)
- Understand [session code](/dapp-dev-guide/writing-contracts/contract-vs-session) and how it triggers a smart contract
- Learn to [install a contract and query global state](/dapp-dev-guide/writing-contracts/installing-contracts.md) with the Casper command-line client
