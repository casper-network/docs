# Understanding Session Code
This section explains the concept of session code, why we need it and how to write it. Session code’s use case is when the situation calls for little or no state. Stateless means when the execution doesn't depend on a previous state, so the output of the execution is the same each time. Stateful is when the execution depends on a previous state, which makes the output differ each time.

In the following sections we will explore the concept of session code, the project structure that is required for the session code to be tested and executed correctly, and a simple example of a session code.

## What is Session code?
Session code is the simplest piece of logic you can execute on a Casper network. It requires only one entry point, which is the `call` function and it runs within the context of the account executing the session code. This means that the session code will run with the permissions of the account, such as having access to the main purse (the session code could transfer tokens out of the account's main purse). 
Session code can be written in any programming language that compiles to Wasm.

**Note**: Before you sign and execute the session code, ensure that you know exactly what the session code is doing. If you don't know exactly what it is meant for, then it could be doing something malicious.

## Project Structure
For this guide, we are creating the project structure manually, however, you can use `cargo casper` to setup this directory structure automatically.

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

In the above directory structure the `contract` folder contains the session code in the `main.rs` file and the needed dependencies in the `Cargo.toml` file. 
The `tests` folder contains the code required to test the session code on before it is deployed on the Casper network.

## Writing Session Code
The following steps illustrate the process of writing session code and the important components to include:

1. Create a new top level directory that will contain the session code and would also include another folder for tests, which will help us test the functionality of our session code. 

2. Inside the new folder run the following command to create a new binary package called contract:

    ```bash
    cargo new contract
    ```
    
    This folder will contain the logic that will be compiled to Wasm and will be executed on a node within the Casper network.

3. Within the contract package, you can find the `main.rs` file inside the `src` folder. You will write your session code in the `main.rs` file. 

4.  In the `cargo.toml` file include the following dependencies, for the purposes of this guide we are using only two, however, you can use more depending on the requirement of your session code:
    -   `casper-contract = "1.4.3"` - You need to import the casper-contract as it provide the SDK for the execution engine (EE). For more information on this crate, see the [documentation](https://docs.rs/casper-contract/latest/casper_contract/).
    -   `casper-types = "1.4.6"` - You need to import the casper-types crate as this crate includes the types that the node uses. This is necessary for the execution engine (EE) to understand and interpret the session code. For more information on this crate, see the [documentation](https://docs.rs/casper-types/latest/casper_types/).  

    You can find the latest versions of the dependencies at https://crates.io/.
    
5. Few things to note while writing session code:
    -   Include the following:
        -   `#![no_std]` - This indicates to not import the standard library.
        -   `#![no_main]` - This indicates that the main function is not required, since the session code has only one entry point as the `call` function.
    -   Import the casper contract API:
        `use casper_contract::contract_api::{runtime, storage};` this example uses only runtime and storage crates, however, you might need to import the crates relevant to your session code.

## Sample Session Code
This sample code demonstrates a simple session code passing arguments, processing the arguments, and storing the result. In general, that is what you will use session code for. In this example, we are adding two numbers and storing the result in a URef.

```rust
#![no_std]
#![no_main]

use casper_contract::contract_api::{runtime, storage};

const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";

#[no_mangle]
pub extern "C" fn call() {
    // Get the named arg number_1.
    let num1: u32 = runtime::get_named_arg(ARG_NUMBER_1);
    // Get the named_arg number_2.
    let num2: u32 = runtime::get_named_arg(ARG_NUMBER_2);
    let result = num1 + num2;
    // Write the answer under some URef
    let result_uref = storage::new_uref(result);
    // Put the URef in the current context's NamedKeys, which is the context
    // of the account calling this piece of session code.
    runtime::put_key("answer", result_uref.into())
}
```

### Understanding the sample code
Let's try to understand what each line of code in the above sample is trying to achieve.

```rust
#![no_std]
#![no_main]
```
This indicates to not import the standard library and that the main function is not required, since the session code has only one entry point as the `call` function.

```rust
use casper_contract::contract_api::{runtime, storage};
```
Imports the casper contract API. This example uses only runtime and storage crates, however, you might need to import the crates relevant to your session code.

```rust
const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";
```
It is a good habit to define constants, because if you use the same argument in multiple places and you want to change the argument, you can do that where you just defined the constant. This change will reflect everywhere the argument is used.

```rust
#[no_mangle]
```
When some Wasm is sent to be executed by the execution engine (EE) that lives within each node of the Casper network, `#[no_mangle]` ensures that the function name that follows it is retained as is in string form in the Wasm output. For session code, this retains the `call` string and marks the entry point for the execution engine.

```rust
pub extern "C" fn call()
```
This initiates the `call` function. When compiled, the resulting Wasm could then be linked to from a C library, and the function could be used as if it was from any other library.

```rust
let num1: u32 = runtime::get_named_arg(ARG_NUMBER_1);
let num2: u32 = runtime::get_named_arg(ARG_NUMBER_2);
let result = num1 + num2;
```
This piece of code tries to demonstrate how to get two numbers as arguments in `u32` format and then perform an simple operation with them, such as adding the two numbers. The `runtime::get_named_arg()` takes a string as an argument and returns the named argument to the host in the current runtime.

```rust
let result_uref = storage::new_uref(result);
```
Once you have the result, you might want to save it at a location that can be accessed later. This code puts the URef in the current context's NamedKeys, which is the context of the account calling this piece of session code.

```rust    
runtime::put_key("answer", result_uref.into())
```
The `put_key` function stores the URef of the result in the current context's NamedKeys, which is the context of the account calling this piece of session code. Once this session code tis executed, the account that called the session code will have a new named key `answer` added to the account.

## Compiling the Session Code
Before you deploy the session code on the Casper network, you need to compile it to Wasm. 

Use the following command to move to the *contract* directory:

```bash
cd contract
```
Inside the *contract* directory execute the following command to compile the session code.

```bash
cargo build --release --target wasm32-unknown-unknown
```
Once the session code is compiled you can deploy it on the Casper network.

## Deploying the Session Code
Before you deploy the session code to the Mainnet or Testnet, you can do a trial run on the a local network using NCTL. For more information on how to build an NCTL network, see [Local Network Testing](setup-nctl.md).

You can deploy the session code on the Testnet using the following command:

```bash
casper-client put-deploy \
    --node-address <HOST:PORT> \
    --chain-name casper-test \
    --secret-key <PATH> \
    --payment-amount <PAYMENT-AMOUNT> \
    --session-path <SESSION-PATH>
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777.
-   `secret-key` - The file name containing the secret key of the account paying for the deploy.
-   `chain-name` - The chain-name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*. 
-   `payment-amount` - The payment for the deploy in motes.  
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer.

## Comparing Session Code and Contract Code
The following points try to explain the difference between session code and contract code.
- When `put_key` is used to store a URef, it depends where the key is stored based on if the session code or the contract code is making the call. When the session code is executed the key is added to the named keys of the account that called the session code. Whereas, when contract code is executed the key is added to the named keys of the smart contract. 
- Smart contract is Wasm that is stored on the network. Whereas session code is simple code you can use to interact with the smart contract.
- Smart contract is stateful and session code is stateless.

