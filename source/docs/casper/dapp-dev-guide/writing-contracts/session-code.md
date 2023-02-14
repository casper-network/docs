# Writing Session Code

This section explains how to write session code. To review the definition of session code and the differences between session code and contract code, see [Comparing Session Code and Contract Code](/dapp-dev-guide/writing-contracts/contract-vs-session.md). Session code can be written in any programming language that compiles to Wasm. However, the examples in this topic use Rust.

## Creating the Directory Structure {#directory-structure}

For writing session code, we use the same project structure used for writing contracts, described [here](/dapp-dev-guide/writing-contracts/rust-contracts.md#directory-structure).

## Example 1: Writing Session Code {#writing-session-code}

The following steps illustrate the process of writing session code using an example repository containing sample session code for configuring an account: https://github.com/casper-ecosystem/two-party-multi-sig/. The sample code adds an associated key to the account and updates the action thresholds. Remember that an [Account](/design/casper-design/#accounts-head) on a Casper network can add associated accounts and set up a multi-signature scheme for deploys. To follow along, clone the repository.

```bash
git clone https://github.com/casper-ecosystem/two-party-multi-sig/
```

:::note

Before executing session code, ensure that you know exactly what the session code is doing. If you don't know what it is meant for, it could be doing something malicious.

:::

### Dependencies in `Cargo.toml`

The `Cargo.toml` file includes the dependencies and versions the session code requires. At a minimum, you need to import the latest versions of the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/) and [casper-types](https://docs.rs/casper-types/latest/casper_types/) crates. The following dependencies and version numbers are only examples and must be adjusted based on your requirements.

   - `casper-contract = "1.4.4"` - Provides the SDK for the execution engine (EE). The latest version of the crate is published [here](https://crates.io/crates/casper-contract).
   - `casper-types = "1.5.0"` - Includes types shared by many Casper crates for use on a Casper network. This crate is necessary for the EE to understand and interpret the session code. The latest version of the crate is published [here](https://crates.io/crates/casper-types).
    
### Updating the `main.rs` File

Open the `contract/src/main.rs` file that contains the sample session code. Notice these directives at the top of the file:

- `#![no_std]` - Specifies not to import the standard library.
- `#![no_main]` - Indicates the `main` function is not required since the session code has only one entry point as the `call` function.

Next, review the imported crates and other required libraries.

```rust
#![no_std]
#![no_main]

use casper_contract::contract_api::{account, runtime};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::account::{AccountHash, ActionType, Weight};
```

After the imported libraries, we usually find the constants. 

```rust
const ASSOCIATED_ACCOUNT: &str = "deployment-account";
```

Next, we see the `call` function, the only entry point in this example session code. The `#[no_mangle]` flag ensures that the function name is retained as a string in the Wasm binary. For session code, this flag retains the `call` string and marks the entry point for the execution engine. Explore the call function details by opening the cloned project.

```rust
#[no_mangle]
pub extern "C" fn call() {
    // Open the repository for details
}
```

When compiled, the `call` function could be used from another library. For example, a C library could link to the resulting Wasm.

## Example 2: Calling a Contract with Session Code {#calling-contracts-with-session-code}

Another example of session code is the [counter-call/src/main.rs](https://github.com/casper-ecosystem/counter/blob/master/counter-call/src/main.rs) file, in the [counter](https://github.com/casper-ecosystem/counter) repository. This example shows how we commonly use session code to invoke logic stored within a smart contract. To follow along, clone the repository.

```bash
git clone https://github.com/casper-ecosystem/counter/
```

Observe how the project is set up and review the dependencies in the `counter/counter-call/Cargo.toml` file. Then, open the `counter/counter-call/src/main.rs` file containing the session code. Notice the directives at the top of the file, the required dependencies, and the declared constants.

The `call` function interacts with the contract's `counter_inc` and `counter_get` entry points. This is how the session's `call` entry point triggers the logic stored inside the counter contract.

```rust
    // Call the counter to get the current value.
    let current_counter_value: u32 =
        runtime::call_contract(contract_hash, COUNTER_GET, RuntimeArgs::new());

    // Call the counter to increment the value.
    let _: () = runtime::call_contract(contract_hash, COUNTER_INC, RuntimeArgs::new());
```

## Example 3: Transfers using Session Code {#transfers-using-session-code}

In this example, we use session code to perform a transfer using the [transfer_from_purse_to_purse](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_from_purse_to_purse.html) system function. The entire session code is available in [GitHub](https://github.com/casper-network/casper-node/blob/67c9c9bb84fdfc3f2d12103e25f0058104342bc0/smart_contracts/contracts/bench/transfer-to-purse/src/main.rs#L14), but this is the `call` function:

```rust
#[no_mangle]
pub extern "C" fn call() {
    let target_purse: URef = runtime::get_named_arg(ARG_TARGET_PURSE);
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);

    let source_purse = account::get_main_purse();

    system::transfer_from_purse_to_purse(source_purse, target_purse, amount, None)
        .unwrap_or_revert();
}
```

Another system function is [transfer_to_public_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_to_public_key.html). The full session code example is on [GitHub](https://github.com/casper-network/casper-node/blob/67c9c9bb84fdfc3f2d12103e25f0058104342bc0/smart_contracts/contracts/client/transfer-to-public-key/src/main.rs#L16).

```rust
#[no_mangle]
pub extern "C" fn call() {
    let account_hash: PublicKey = runtime::get_named_arg(ARG_TARGET);
    let transfer_amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    system::transfer_to_public_key(account_hash, transfer_amount, None).unwrap_or_revert();
}
```

Other transfer functions are available here:

- [transfer_to_account](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_to_account.html)
- [transfer_from_purse_to_account](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_from_purse_to_account.html)
- [transfer_from_purse_to_public_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_from_purse_to_public_key.html)


## Compiling Session Code {#compiling-session-code}

Before running session code to interact with a contract or other entities on the network, you must compile it to Wasm. Run the following command in the directory hosting the `Cargo.toml` file and `src` folder. 

```bash
cargo build --release --target wasm32-unknown-unknown
```

For the examples above, you may use the Makefiles provided:

```bash
make build-contract
```

## Executing Session Code {#executing-session-code}

Before running session code on a live Casper network, test it as described [here](/dapp-dev-guide/writing-contracts/testing-session-code). You can also set up a local network using [NCTL](/dapp-dev-guide/building-dapps/setup-nctl) for additional tests.

Session code can execute on a Casper network via a [Deploy](/glossary/D.md#deploy). All deploys can be broadly categorized as some unit of work that, when executed and committed, affects change to the network's global state.

The [Casper command-line client](/dapp-dev-guide/setup/#the-casper-command-line-client) and its `put-deploy` command provide one way to execute session code.

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

## Video Walkthrough {#video-walkthrough}

The following brief video describes [sample session code](https://github.com/casper-ecosystem/two-party-multi-sig/) for configuring an account. 

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=4" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## What's Next? {#whats-next}

- Learn to [test session code](/dapp-dev-guide/writing-contracts/testing-session-code) using the Casper testing framework.