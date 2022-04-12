# Understanding Session Code
This section explains the concept of session code, why we need it and how can you write it. Session code is used when the use case to be solved requires very little state of no state at all. Stateless is when the execution doesn't depend on a previous state, so the output of the execution is the same each time. Stateful is when the execution depends on a previous state, which makes the output differ each time. 

## What is Session code?
Session code is the simplest piece of logic you can execute on the Casper network. It requires only one entry point, which is the `call` function and it runs within the context of the account executing the session code. The context of the account means that the session code will run with the permissions of the account, this means like having access to the main purse (the session code could transfer tokens out of the accounts main purse). 
Session code can be written in any programming language that compiles to Wasm.

**Note**: Before you sign and execute the session code, ensure that you know exactly what the session code is doing. Because if you don't know what it is exactly meant for, then it could be doing something malicious.

## Project Structure
For this guide, we are creating the project structure manually, however, you can use the  






## Writing Session Code
The following steps illustrate the process of writing session code and the important components to include within your session code:

1. Create a new top level directory that will contain the session code and would also include another folder for tests, which will help us test the functionality of our session code. 

2. Inside the new folder run the following command to create a new binary package called contract:

    ```bash
    cargo new contract
    ```
    
    This folder will contain the logic that will be compiled to Wasm and will be executed on a node within the Casper network.

3. Within the contract package, you can find the `main.rs` file inside the `src` folder. You will write your session code in the `main.rs` file. 

4.  In the `cargo.toml` file include the following dependencies:
    -   `casper-contract = "1.4.3"` - For more information on this crate, see [doc.rs](https://docs.rs/casper-contract/latest/casper_contract/)
    -   `casper-types = "1.4.6"` - For more information on this crate, see [doc.rs](https://docs.rs/casper-types/latest/casper_types/)
    
    You need to include the casper-types crate as this crate includes the types that the node uses and the execution engine (EE) understands.
    
    


    
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
    // Put the URef in the current context's NamedKeys, which is the context i
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
It is a good habit to define constants, because if you use the same argument in multiple places and you want to change the argument, you can do that where you just defined the constant. And this change will reflect everywhere the argument is used.

```rust
#[no_mangle]
```
When some Wasm is sent to be executed by the execution engine (EE) that lives within each node of the Casper network, `#[no_mangle]` ensures that the function name that follows it is retained as is in string form in the Wasm output. For session code, this retains the `call` string and marks the entry point for the execution engine.

```rust
pub extern "C" fn call()
```
Defines the `call` function.

```rust
let num1: u32 = runtime::get_named_arg(ARG_NUMBER_1);
let num2: u32 = runtime::get_named_arg(ARG_NUMBER_2);
let result = num1 + num2;
```
Get the input numbers in `u32` format and perform a 










## Testing the Session Code
Once you have written the session code, you can test it. Let's go through the steps required to test your session code.  

**Imported Crates**

You must import the following crates:

-   Execution engine - The execution engine is a virtual machine that we can export out. We import the execution engine because the execution engine will be used to test the Wasm on the node. So by doing this, we are ensuring that our test is robust.

-   Engine test support - The engine test support is a helper crate that provides an interface to interact with the execution engine.


```rust
#[cfg(test)]
mod tests {
    // We need this so that we can load
    // the session code Wasm that we are going to test.
    use std::path::PathBuf;

    use casper_engine_test_support::{
        DeployItemBuilder, ExecuteRequestBuilder, InMemoryWasmTestBuilder, DEFAULT_RUN_GENESIS_REQUEST, DEFAULT_ACCOUNT_ADDR, DEFAULT_PAYMENT, ARG_AMOUNT
    };
    use casper_execution_engine::core::engine_state::{
        run_genesis_request::RunGenesisRequest, GenesisAccount,
    };
    use casper_types::{
        account::AccountHash, runtime_args, Key, Motes, PublicKey, RuntimeArgs, SecretKey, U512,
    };

    // These constants are dictated by the arguments
    // specified by the session code. If your session
    // code takes in different arguments, you should
    // define them as constants here.
    const ARG_NUMBER_1: &str = "number_1";
    const ARG_NUMBER_2: &str = "number_2";
    // This constant defines which wasm file to load and
    // pass to the instance of the EE which we created for
    // testing. Depending on the name of the WASM file
    // you created, this value may change.
    const CONTRACT_WASM: &str = "contract.wasm";

    #[test]
    fn should_add_two_numbers() {
        // Initialize an instance of the Execution engine
        let mut builder = InMemoryWasmTestBuilder::default();
        // The test framework checks for compiled Wasm files in '<current working dir>/wasm'.  Paths
        // relative to the current working dir (e.g. 'wasm/contract.wasm') can also be used, as can
        // absolute paths.
        let session_code = PathBuf::from(CONTRACT_WASM);
        // Since our session code takes in two runtime arguments
        // we will first create them as part of the test
        // This allows to check and assert behavior of our
        // session code depending on the arguments we pass in.
        let runtime_args = runtime_args! {
            ARG_NUMBER_1 => 1,
            ARG_NUMBER_2 => 2
        };

        // Create a deploy item, which emulates the deploy
        // being sent to the network
        let deploy_item = DeployItemBuilder::new()
            // We are creating a deploy that uses the host side
            // functionality of standard payment
            // and passes in the required runtime argument
            // "amount" with some default value.
            .with_empty_payment_bytes(runtime_args! {
                ARG_AMOUNT => *DEFAULT_PAYMENT
            })
            // Load the session Wasm we are testing
            // and pass in the runtime arguments as part of this
            // test
            .with_session_code(CONTRACT_WASM, runtime_args)
            // This sets up the session code to be executed in the context
            // of the Default account.
            .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
            .with_address(*DEFAULT_ACCOUNT_ADDR)
            .build();
    }
}

fn main() {
    panic!("Execute \"cargo test\" to test the contract, not \"cargo run\".");
}
```


## Additions to Cargo.toml 



## Comparing Session Code and Smart Contract







