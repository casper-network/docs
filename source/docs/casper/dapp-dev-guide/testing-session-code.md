# Unit Testing Session Code


This section describes how to test a session code based on the unit testing mechanism. It's recommended to follow the [understanding session code](/dapp-dev-guide/writing-contracts/rust/#what-is-a-smart-contract) section before starting this tutorial. Here, we will cover how to test a successful session code execution and how to verify the success of the test program by asserting the return value.

The session code executes in the context of the account which sent the deploy. In this scenario, since the session code is executing in the corresponding account's contexts, it has the same access permissions as the corresponding account. 

In this tutorial, we use the example from the [sample contract](#sample-contract-used-to-build-the-session-code) section to build the test program.


## Steps to Create and Run the Unit Test

### Step 1. Creating the test crate
Use the below command to create the test crate. It will auto-generate the folder structure for the test project.

```bash
cargo new tests
```
This creates the `tests` folder with the `/src/main.rs` file and the `cargo.toml` file.

- `tests` - This is the name you provide for the folder.
- `main.rs` - This is the file that contains the unit test code required to test the contract. You can rename the file if required.
- `Cargo.toml` - This is the file with project configurations


### Step 2. Adding the project dependencies
Include the below dependencies inside the `Cargo.toml` file.

```bash
[dev-dependencies]
casper-execution-engine = "1.5.0"
casper-engine-test-support = {version = "2.1.0", features = ["test-support"]}
casper-types = "1.5.0"
```
Importing the dependencies may vary with your project requirements. These are the basic dependencies required by this project.

- `casper-execution-engine` - This imports the functionalities of the execution engine which enables the wasm execution. Each node contains an instance of an execution engine within it.
- `casper-engine-test-support` - This is a helper crate that provides the interface to interact with the execution engine to execute the Wasm.
- `casper-types` - These are types used in the program.

### Step 3. Configuring the main.rs file

You can include the `#![no_main]` annotation or include an empty main method to initialze the test program.

```rust
fn main() {
 panic!("Execute \"cargo test\" to test the contract, not \"cargo run\".");
}
```

Adjust the file attributes to support the execution environment. The `#[cfg(test)]` attribute tells the Rust compiler to compile and run the test code only when invoking `cargo test`, not when debugging or releasing. All your individual testing functions go within `mod tests` which indicates the grouping mechanism.

```rust
#[cfg(test)]
mod tests {
    The whole test program resides here...
}
```

### Step 4. Importing the required packages
The subsequent code modules use these packages to prepare and send the session code to the network.

```rust
use std::path::PathBuf;
use casper_engine_test_support::{DeployItemBuilder, 
ExecuteRequestBuilder, InMemoryWasmTestBuilder, 
DEFAULT_RUN_GENESIS_REQUEST, DEFAULT_ACCOUNT_ADDR,
DEFAULT_PAYMENT, ARG_AMOUNT};
use casper_execution_engine::core::engine_state::{
        run_genesis_request::RunGenesisRequest, GenesisAccount,
    };
use casper_types::{
        account::AccountHash, runtime_args, Key, Motes, 
        PublicKey, RuntimeArgs, SecretKey, U512,
    };
```
- `PathBuf` - This package supports loading the session code wasm.
- `casper_engine_test_support` - This package provides the interfaces to perform the tests using its' builder classes.
- `casper_execution_engine` - This package imports the required classes from the execution engine including the genesis node and related functionalities.
- `casper_types` - These packages enable the general type imports to the test program.

### Step 5. Defining the constants 
Runtime arguments are defined as constants. It is mandatory to use the exact names as in the original contract class to define these constants. These are dictated by the arguments specified by the session code. If your session code takes in different arguments, you should define them as constants at this point.
 
```rust
const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";
// This constant defines which wasm file to load and pass to the instance of the EE
const CONTRACT_WASM: &str = "contract.wasm";
```

### Step 6. Creating the test function
In this step, you will build the program to test the contract. 

Start with annotating the function with `#[test]` attribute. This indicates the function as a test function and performs the execution accordingly. The bodies of test functions typically perform some setup, run the code we want to test, then assert whether the results are what we expect.

```rust
#[test]
mod <your-unit-test-name>{
   The testing logic goes here...
}
```

The overall test program structure should be as below:
```rust
#[cfg(test)]
mod tests {
 
    #[test]
        mod <your-unit-test-name>{
            Individual test function implementation...
    } 
}
```

Following is a code sample of a basic unit test for adding two numbers. `should_add_two_numbers` is the name given to this specific unit test.

```rust
fn should_add_two_numbers() {

// Initialize an instance of the execution engine and assign it to the builder variable
let mut builder = InMemoryWasmTestBuilder::default();

// Set up genesis node
builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();

// Retrieve the contract wasm from the specified location and assign to the session code variable
let session_code = PathBuf::from(CONTRACT_WASM);
    
// Retrieve runtime arguments. These should be same as defined in the contract
// This allows use to check and assert behavior of the session code
let runtime_args = runtime_args! {
    ARG_NUMBER_1 => 1,
    ARG_NUMBER_2 => 2
};

// Create a deploy item, which emulates the deploy being sent to the network
// Use the host side functionality of standard payment and passes in the required runtime argument "amount" with some default value
// Load the session wasm and pass in the runtime arguments
// Sets up the session code to be executed in the default account using auth keys and default account address
let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {
                ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_session_code(CONTRACT_WASM, runtime_args.clone())
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .build();

// Create the execution request that will eventually be executed by the EE.
let execute_request = ExecuteRequestBuilder::from_deploy_item(
            deploy_item
    ).build();

// Invoke the EE to execute the session code that we are testing
builder.exec(execute_request).expect_success()
            .commit();

// Verify the results of the execution match our expectations from the contract using the test results
let result_key = *builder
            .get_account(*DEFAULT_ACCOUNT_ADDR)
            .expect("the default account must be present")
            .named_keys()
            .get("answer")
            .expect("must have key as part of session code execution");
let value: u32 = builder.query(None, result_key, &vec![])
            .expect("must have the stored value")
            .as_cl_value()
            .expect("must have some CLValue")
            .to_owned()
            .into_t()
            .expect("must convert the CLValue into a u64");
assert_eq!(3, value);
    }
}
```

The above code snippet starts by initializing the test builder and the genesis request. Then, the contract wasm is loaded to the session code object.  After that, the deploy object is created using the details like payment method, contract wasm, and account address. Then, the deploy object is passed to the created execute request. Finally, the execution engine is invoked to process the execute request. Refer to [creating a test function](/dapp-dev-guide/testing/#deploy-the-smart-contract) for more details about each function. 

### Step 7. Specifying the binary fields
This step configures the contract file and wasm file path in the Cargo.toml file. This states that the test program uses the contract specified in the given path to execute the logic. Here, the file name 'main' is equivalent to your contract file name.

```bash
[[bin]]
name = "contract"
path = "source/main.rs"
```

### Step 8. Verifying the test results
In the above section, the session code is sent to the network. Now it's time to verify the results of that deployment. Once the session code has been executed successfully, we must verify that the results of the execution match our expectations. 

The below code snippet retrieves the value of interest which is named as `answer`. It is stored under the URef which is a part of the account's name keys. Then, the formatted value is asserted against our expected value to verify the success of the test program.

```rust
let result_key = *builder
            .get_account(*DEFAULT_ACCOUNT_ADDR)
            .expect("the default account must be present")
            .named_keys()
            .get("answer")
            .expect("must have key as part of session code execution");
```

The next part reads the `result_key` by calling the query method and assign the result of it to the variable `value`. The `result_key` needs to trnsform in order to match with the data type we are trying to assert with.

```rust
let value: u32 = builder.query(None, result_key, &vec![])
            .expect("must have the stored value")
            .as_cl_value()
            .expect("must have some CLValue")
            .to_owned()
            .into_t()
            .expect("must convert the CLValue into a u64");
```
Finally, assert that the query's result matches the expected value; here, the expected value is 3.

```rust         
assert_eq!(3, value);
```
-   `query()` : Queries the state for a given value
-   `expect()` : Validates the query which contains the output message. This will unwrap the value; the test will panic and crash if the value can't be unwrapped. The string value inside the argument will output as the reason to crash
-   `as_cl_value()` : Returns a wrapped [CLValue](design/serialization-standard#serialization-standard-values) if this is a CLValue variant 
-   `Into_t()` : Converts the CLValue back to the original type (i.e., a String type in this sample). Note that the `expected_value` is a `String` type lifted to the `Value` type. It is also possible to map `returned_value` to the `String` type


### Step 9. Running the test
Use the below command to run the test.

```bash
make test
```
This command should be configured inside the project's `Makefile`. It generates the `tests/wasm` folder and runs the tests. 

Below is a section of the make file that contains a set of configurations.

```bash
prepare:
	rustup target add wasm32-unknown-unknown

build-contract:
	cargo build --release -p contract --target wasm32-unknown-unknown
    wasm-strip contract/target/wasm32-unknown-unknown/release/contract.wasm 2>/dev/null | true

test: build-contract 
    mkdir -p tests/wasm
    cp contract/target/wasm32-unknown-unknown/release/contract.wasm/wasm
    cd tests && cargo test
```

:::note
Use the command `cargo install cargo casper`, if you want to set up the whole directory structure in one command. Refer to [installing casper crates](/dapp-dev-guide/getting-started/#installing-the-casper-crates) section for more details.
:::

## Complete Code Samples
Expand the below sections to view the complete code samples of the original contract and the session code unit test.

#### Sample contract used to build the session code
<details>
<summary>Contract code sample used in the session code testing</summary>

```rust
#![no_std]
#![no_main]
use casper_contract::contract_api::{runtime, storage};
const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";
#[no_mangle]
pub extern "C" fn call() {
    // Get the named arg number_1
    let num1: u32 = runtime::get_named_arg(ARG_NUMBER_1);
    // Get the named_arg number_2
    let num2: u32 = runtime::get_named_arg(ARG_NUMBER_2);
    let result = num1 + num2;
    // Write the answer under some URef
    let result_uref = storage::new_uref(result);
    // Put the URef in the current context, which is the context of the account calling this piece of session code.
    runtime::put_key("answer", result_uref.into())
}
```

</details>


#### Sample test code
<details>
<summary>Unit test code sample to test the session code</summary>

```rust
#[cfg(test)]
mod tests {

use std::path::PathBuf;
use casper_engine_test_support::{DeployItemBuilder, ExecuteRequestBuilder, InMemoryWasmTestBuilder, DEFAULT_RUN_GENESIS_REQUEST, DEFAULT_ACCOUNT_ADDR, DEFAULT_PAYMENT, ARG_AMOUNT};
use casper_execution_engine::core::engine_state::{
        run_genesis_request::RunGenesisRequest, GenesisAccount,
    };
use casper_types::{
        account::AccountHash, runtime_args, Key, Motes, PublicKey, RuntimeArgs, SecretKey, U512,
    };

const ARG_NUMBER_1: &str = "number_1";
const ARG_NUMBER_2: &str = "number_2";
const CONTRACT_WASM: &str = "contract.wasm";

#[test]
    fn should_add_two_numbers() {
    
    let mut builder = InMemoryWasmTestBuilder::default();

    builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();
     
    let session_code = PathBuf::from(CONTRACT_WASM);
     
    let runtime_args = runtime_args! {
        ARG_NUMBER_1 => 1,
        ARG_NUMBER_2 => 2
    };
     
    let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {
    ARG_AMOUNT => *DEFAULT_PAYMENT
    }) 
    .with_session_code(CONTRACT_WASM, runtime_args.clone())
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .build();

    let execute_request = ExecuteRequestBuilder::from_deploy_item(
        deploy_item
        ).build();

    let _example_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        CONTRACT_WASM,
        runtime_args
        ).build(); 
        .
        builder.exec(execute_request).expect_success()
            .commit();
            
    let result_key = *builder
        .get_account(*DEFAULT_ACCOUNT_ADDR)
        .expect("the default account must be present")
        .named_keys()
        .get("answer")
        .expect("must have key as part of session code execution");
    let value: u32 = builder.query(None, result_key, &vec![])
        .expect("must have the stored value")
        .as_cl_value()
        .expect("must have some CLValue")
        .to_owned()
        .into_t()
        .expect("must convert the CLValue into a u64"); 
assert_eq!(3, value);
    }
}

 fn main() {
    panic!("Execute \"cargo test\" to test the contract, not \"cargo run\".");
 }  
}
```
</details>

