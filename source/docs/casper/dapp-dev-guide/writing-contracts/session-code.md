# Writing Session Code

This section explains how to write session code by exploring the required project structure and a simple example. To review the definition of session code and the differences between session code and contract code, see [Comparing Session Code and Contract Code](/dapp-dev-guide/writing-contracts/contract-vs-session.md).

## Project Structure {#project-structure}
In this guide, we create the project structure manually. However, the `cargo casper` command can set up the structure automatically, as shown [here](/dapp-dev-guide/writing-contracts/getting-started#creating-a-project).

```bash
project-directory/
└── code/
    ├── src/
        └── main.rs
    └── Cargo.toml
└── tests/
    ├── src/
        └── integration-tests.rs
    └── Cargo.toml
```

### Creating the project manually

1. Create a top-level project directory for the session code and its corresponding tests.

2. Inside the project directory, create a folder for the session code. In this example, we named the folder `code`. This folder contains the logic that will be compiled to Wasm and will be executed on a Casper node.

   - In the `code` folder, add a source folder called `src` and a `Cargo.toml` file, which specifies the required dependencies for the session code.
   - Add a Rust file with the session code in the `src` folder. In this example, the `main.rs` contains the session code.

3. Inside the project directory, create a folder for the corresponding tests, which help test the functionality of the session code. In this example, we named the folder `tests`.

   - In the `tests` folder, add a source folder called `src` and a `Cargo.toml` file, which specifies the required dependencies to run the tests.
   - In the `src` folder, add a Rust file with the tests that verify the session code. In this example, the `integration-tests.rs` file contains the tests.

### Creating the project automatically

1. Create a top-level project directory for the session code and its corresponding tests.

2. Inside the project directory, run the following command to create a new binary package called `code`. In the `code/src` folder, the auto-generated `main.rs` file would contain the session code. 

```bash
cargo new code
```

## Writing Session Code {#writing-session-code}

The following steps illustrate the process of writing session code and the essential components to include, whether the project was created manually or with `cargo`.

:::note

Session code can be written in any programming language that compiles to Wasm. However, the examples in this topic use Rust.

Before executing session code, ensure that you know exactly what the session code is doing. If you don't know what it is meant for, it could be doing something malicious.

:::

### Dependencies in Cargo.toml

The `Cargo.toml` file includes the dependencies and versions the session code requires. At a minimum, you need to import the latest versions of the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/) and [casper-types](https://docs.rs/casper-types/latest/casper_types/) crates. The following dependencies and version numbers are only examples and must be adjusted based on your requirements.

   - `casper-contract = "1.4.4"` - Provides the SDK for the execution engine (EE). The latest version of the crate is published [here](https://crates.io/crates/casper-contract).
   - `casper-types = "1.5.0"` - Includes types shared by many Casper crates for use on a Casper network. This crate is necessary for the EE to understand and interpret the session code. The latest version of the crate is published [here](https://crates.io/crates/casper-types).
    
### The Rust file with session code

At the top of the Rust file, include the following directives:
   - `#![no_std]` - Specifies not to import the standard library.
   - `#![no_main]` - Indicates the `main` function is not required since the session code has only one entry point as the `call` function.

Import the Casper contract API and the crates relevant to your code. In this example, we have the `account`, `runtime`, `storage`, and `system` crates:
        
```
use casper_contract::contract_api::{account, runtime, storage, system};
```

Next, write the code relevant to your use case. The sample code below serves as an example.

### Session code example

The following repository contains sample session code for configuring an account: https://github.com/casper-ecosystem/two-party-multi-sig/. The sample code adds an associated key to an account and updates the action thresholds. Remember that [accounts](/design/casper-design/#accounts-head) on a Casper network can add associated accounts and set up a multi-signature scheme for deploys. To follow along, clone the repository.

```bash
git clone https://github.com/casper-ecosystem/two-party-multi-sig/
```

Open the project and review its structure. Look at the dependencies listed in the `contract/Cargo.toml` file. 

Open the `contract/src/main.rs` file that contains the sample session code. Notice the directives at the top of the file and the imported crates. This example uses the `account` and `runtime` crates.

```rust
#![no_std]
#![no_main]

use casper_contract::contract_api::{account, runtime};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::account::{AccountHash, ActionType, Weight};
```

At the top of the file, we usually find the constants defined. 

```rust
const ASSOCIATED_ACCOUNT: &str = "deployment-account";
```

Next, we see the `call` function, the only entry point in this example session code. The `#[no_mangle]` flag ensures that the function name is retained as a string in the Wasm binary. For session code, this flag retains the `call` string and marks the entry point for the execution engine. Explore the call function details by opening the cloned project.

```rust
#[no_mangle]
pub extern "C" fn call() {
    // Open the repository for details.
}
```

When compiled, the `call` function could be used from another library. For example, a C library could link to the resulting Wasm.

## Compiling Session Code {#compiling-session-code}

Before running session code to interact with a contract or other entities on the network, you must compile it to Wasm. Run the following command in the directory hosting the `Cargo.toml` file and `src` folder. 

```bash
cargo build --release --target wasm32-unknown-unknown
```

## Executing Session Code {#executing-session-code}

Before running session code on a live Casper network, test it as described [here](/dapp-dev-guide/writing-contracts/testing-session-code). You can also set up a local network using [NCTL](/dapp-dev-guide/building-dapps/setup-nctl) for additional tests.

Session code can execute on a Casper network via a [Deploy](/glossary/D.md#deploy). All deploys can be broadly categorized as some unit of work that, when executed and committed, affects change to the network's global state.

The [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and its `put-deploy` command provide one way to execute session code.

```bash
casper-client put-deploy \
    --node-address <HOST:PORT> \
    --chain-name <NETWORK-NAME> \
    --secret-key <PATH> \
    --payment-amount <PAYMENT-AMOUNT> \
    --session-path <SESSION-PATH> \
    --session-arg <"NAME:TYPE='VALUE'" OR "NAME:TYPE=null">
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777.
-   `secret-key` - The file name containing the secret key of the account paying for the deploy.
-   `chain-name` - The network where the deploy should be sent. For Mainnet, use *casper*. For Testnet, use *casper-test*. 
-   `payment-amount` - Payment for the deploy in motes.  
-   `session-path` - Path to the contract Wasm, pointing to the compiled contract.
-   `session-arg` - A named and typed argument passed to the Wasm code.

Use the `--help` option to view an updated list of supported arguments.

```bash
casper-client put-deploy --help
```

## Video Walkthrough

The following brief video describes [sample session code](https://github.com/casper-ecosystem/two-party-multi-sig/) for configuring an account. 

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=4" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## What's Next? {#whats-next}

- Learn to [test session code](/dapp-dev-guide/writing-contracts/testing-session-code) using the Casper testing framework