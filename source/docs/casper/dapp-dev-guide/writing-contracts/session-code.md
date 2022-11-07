# Writing Session Code
This section explains the concept of session code, why we need it, and how to write it. The best use of session code is when the situation calls for a [stateless](../../glossary/S.md/#stateless) execution. You can use session code when the logic requires very little or no internal data to be tracked. Session code is required when interacting and accepting values being returned across the Wasm boundary.

:::note

Session code can be written in any programming language that compiles to WebAssembly (Wasm). However, the examples in this topic use Rust.

:::

In the following sections we will explore the concept of session code, the project structure that is required for the session code to be tested and executed correctly, and a simple session code example.  

## What is Session Code?
Session code is the simplest piece of logic you can execute on a Casper Network. It requires only one entry point, which is the `call` function and it runs within the context of the account executing the session code. This means that the session code will run with the permissions of the account, such as having access to the main purse (the session code could transfer tokens out of the account's main purse). 

**Note**: Before you sign and execute the session code, ensure that you know exactly what the session code is doing. If you don't know exactly what it is meant for, then it could be doing something malicious.

### Comparing Session Code and Contract Code
The following points try to explain the difference between session code and contract code:

- Session code and contract code run in two different type of contexts. Session code always executes in the context of the account that signed the deploy that contains the session code. This means that when a `put_key` call is made within the body of the session code, the key is added to the account's named keys. 
- Conversely, contract code executes in its own context. Which means that when `put_key` call is made within the contract's execution, the key is inserted into the contract's context. So, the key will appear in the contract's named keys.
- Session code has only one entry point, that is the `call` function, which you can use to interact with the session code. 
- A contract can have multiple entry points that will help you interact with the contract code. 

## Project Structure
For this guide, we are creating the project structure manually, however, you can use `cargo casper` to set up this directory structure automatically.

Top-Level Directory
|_ contract
    |_ src
        |_ main.rs
    |_ gitignore
    |_ Cargo.lock
    |_ Cargo.toml
|_ tests
    |_ src
        |_ main.rs
    |_ gitignore
    |_ Cargo.lock
    |_ Cargo.toml

In the above directory structure, the `contract` folder contains the session code in the `main.rs` file and the needed dependencies in the `Cargo.toml` file. 
The `tests` folder contains the code required to test the session code before it is deployed on a Casper Network.

## Writing Session Code
The following steps illustrate the process of writing session code and the important components to include:

1. Create a new top-level directory containing the session code and would also include another folder for tests, which will help us test the functionality of our session code. 

2. Inside the new folder run the following command to create a new binary package called *contract*:

    ```bash
    cargo new contract
    ```
    
    This folder will contain the logic that will be compiled to Wasm and will be executed on a node within a Casper Network.

3. Within the contract package, you can find the `main.rs` file inside the `src` folder. You will write your session code in the `main.rs` file. 

4.  In the `cargo.toml` file include the following dependencies:

    :::note

    For the purposes of this guide, we are using only two dependencies; however, you can use more depending on the requirement of your session code.

    :::

    -   `casper-contract = "1.4.4"` - You need to import the [casper-contract](https://crates.io/crates/casper-contract) as it provides the SDK for the execution engine (EE). You can read more about it [here](https://docs.rs/casper-contract/latest/casper_contract/).
    -   `casper-types = "1.5.0"` - You need to import the [casper-types](https://crates.io/crates/casper-types) crate as this crate includes the types that the node uses. This is necessary for the execution engine (EE) to understand and interpret the session code.  You can read more about it [here](https://docs.rs/casper-types/latest/casper_types/).

    You can find the latest versions of the dependencies at https://crates.io/.
    
5. A few things to note while writing session code:
    -   Include the following:
        -   `#![no_std]` - This indicates not to import the standard library.
        -   `#![no_main]` - This indicates that the `main` function is not required, since the session code has only one entry point as the `call` function.
    -   Import the casper contract API:
        `use casper_contract::contract_api::{account, runtime, storage, system};` this example uses account, runtime, storage, and system crates. However, you might need to import the crates relevant to your session code.

## Sample Session Code
This sample code demonstrates a simple session code passing arguments, processing the arguments, and storing the result. In general, you will use session code for such operations. In this example, we call a contract that gets returns a value and we store the result in a URef, within the account's named keys.

```rust
#![no_std]
#![no_main]

use casper_contract::contract_api::{account, runtime, storage, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{runtime_args, ContractHash, Key, PublicKey, RuntimeArgs, URef, U512};

const FUNDRAISER_CONTRACT_HASH: &str = "fundraiser_contract_hash";
const ENTRY_POINT_GET_DONATION_COUNT: &str = "get_donation_count";
const DONATING_ACCOUNT_KEY: &str = "donating_account_key";

#[no_mangle]
pub extern "C" fn call() {
    let fundraiser_contract_hash: ContractHash = runtime::get_named_arg(FUNDRAISER_CONTRACT_HASH);
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);

    let donation_count: u64 = runtime::call_contract(
        fundraiser_contract_hash,
        ENTRY_POINT_GET_DONATION_COUNT,
        runtime_args! {
            DONATING_ACCOUNT_KEY => donating_account_key
        },
    );

    let donation_count_uref = storage::new_uref(donation_count);
    runtime::put_key("donation_count", donation_count_uref.into())
}
```

### Understanding the sample code
Let's try to understand what each line of code in the above sample is trying to achieve.

```rust
#![no_std]
#![no_main]
```
This indicates not to import the standard library and that the main function is not required, since the session code has only one entry point as the `call` function.

```rust
use casper_contract::contract_api::{account, runtime, storage, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{runtime_args, ContractHash, Key, PublicKey, RuntimeArgs, URef, U512};
```
Imports the casper contract API. This example uses account, runtime, storage, and system crates. However, you might need to import the crates relevant to your session code.

```rust
const FUNDRAISER_CONTRACT_HASH: &str = "fundraiser_contract_hash";
const ENTRY_POINT_GET_DONATION_COUNT: &str = "get_donation_count";
const DONATING_ACCOUNT_KEY: &str = "donating_account_key";
```
It is a good habit to define constants, because if you use the same argument in multiple places and you want to change the argument, you can do that where you just defined the constant. This change will reflect everywhere the argument is used.

```rust
#[no_mangle]
```
When the EE (that lives on each node of a Casper network), receives Wasm to execute, the `#[no_mangle]` flag ensures that the function name following it is retained as a string in the Wasm binary. For session code, this retains the `call` string and marks the entry point for the execution engine.

```rust
pub extern "C" fn call()
```
This initiates the `call` function, which when compiled could be used from another library. For example, a C library could link to the resulting Wasm.

```rust
let fundraiser_contract_hash: ContractHash = runtime::get_named_arg(FUNDRAISER_CONTRACT_HASH);
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);

    let donation_count: u64 = runtime::call_contract(
        fundraiser_contract_hash,
        ENTRY_POINT_GET_DONATION_COUNT,
        runtime_args! {
            DONATING_ACCOUNT_KEY => donating_account_key
        },
    );
```
This code demonstrates how to get the contract hash and donating account key as arguments. It then performs a simple operation with them, such as getting the final donation count. The `runtime::get_named_arg()` takes a string as an argument and returns the named argument to the host in the current runtime.

```rust
let donation_count_uref = storage::new_uref(donation_count);
```
Once you have the result, you might want to save it at a location that can be accessed later. This code puts the URef in the current context's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html), which is the context of the account calling this piece of session code.

```rust    
runtime::put_key("donation_count", donation_count_uref.into())
```
The `put_key` function stores the URef of the result in the current context's NamedKeys, which is the context of the account calling this piece of session code. Once this session code is executed, the account that called the session code will have a new named key `donation_count` added to the account.

## Compiling the Session Code
Before you deploy the session code on a Casper Network, you need to compile it to Wasm. 

Use the following command to move to the *contract* directory:

```bash
cd contract
```
Inside the *contract* directory execute the following command to compile the session code.

```bash
cargo build --release --target wasm32-unknown-unknown
```
Once the session code is compiled you can deploy it on a Casper Network.

## Installing Session Code
Before you install the session code on the Mainnet or Testnet, you can do a trial run on the a local network using [NCTL](/dapp-dev-guide/building-dapps/setup-nctl).

You can install the session code on the Testnet using the following command:

```bash
casper-client put-deploy \
    --node-address <HOST:PORT> \
    --chain-name casper-test \
    --secret-key <PATH> \
    --payment-amount <PAYMENT-AMOUNT> \
    --session-path <SESSION-PATH> \
    --session-arg <"NAME:TYPE='VALUE'" OR "NAME:TYPE=null">
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777.
-   `secret-key` - The file name containing the secret key of the account paying for the deploy.
-   `chain-name` - The chain-name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*. 
-   `payment-amount` - The payment for the deploy in motes.  
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer.
-   `session-arg` - A named and typed argument, which is passed to the Wasm code.

You can use this command `casper-client put-deploy --help` to view help information, which provides an updated list of supported arguments.

## Video Walkthrough

The following brief video describes [sample session code](https://github.com/casper-ecosystem/two-party-multi-sig/) for configuring an account. 

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=4" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## What's Next? {#whats-next}

- Learn to [test your session code](/dapp-dev-guide/writing-contracts/testing-session-code)