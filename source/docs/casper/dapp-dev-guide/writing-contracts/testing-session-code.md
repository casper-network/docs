# Testing Session Code

This section describes how to test session code using the Casper unit-testing framework. The [writing session code](/dapp-dev-guide/writing-contracts/session-code/) section is a prerequisite for this tutorial, which uses the example code described [here](/dapp-dev-guide/writing-contracts/session-code#session-code-example-1).

## Specifying Dependencies in Cargo.toml {#specifying-dependencies}

The [Cargo.toml](https://github.com/casper-ecosystem/two-party-multi-sig/blob/main/tests/Cargo.toml) sample file in the `tests` directory contains the test framework dependencies. Specify the dependencies for your tests similarly and update the crate versions. Dependencies may vary with each project. These are the basic dependencies the testing framework requires.

```bash
[dev-dependencies]
casper-engine-test-support = { version = "2.2.0", features = ["test-support"] }
casper-execution-engine = "2.0.0"
casper-types = "1.5.0"
```

- `casper-execution-engine` - This crate imports the execution engine functionality, enabling Wasm execution within the test framework. Each node contains an instance of an execution engine, and the testing framework simulates this behavior.
- `casper-engine-test-support` - Helper crate that provides the interface to write tests and interact with an instance of the execution engine.
- `casper-types` - Types shared by many Casper crates for use on a Casper network. 

## Writing Tests {#writing-tests}

Tests for this example session code reside in the [tests/src/integration-tests.rs](https://github.com/casper-ecosystem/two-party-multi-sig/blob/main/tests/src/integration_tests.rs) file.

Notice that this file contains an empty `main` method to initialize the test program. Alternatively, we could use the `#![no_main]` annotation at the top of the file, as we did [here](https://github.com/casper-ecosystem/two-party-multi-sig/blob/236bb18b9e98da7f9d8706f5e4825494845cfec2/contract/src/main.rs#L1-L2).

```rust
fn main() {
 panic!("Execute \"cargo test\" to test the contract, not \"cargo run\".");
}
```

The `#[cfg(test)]` attribute tells the Rust compiler to compile and run the tests only when invoking `cargo test`, not while debugging or releasing. All testing functions reside within the grouping mechanism `mod tests`.

```rust
#[cfg(test)]
mod tests {
    // The entire test program resides here
}
```

### Importing Required Packages

The subsequent code modules use these packages to prepare and run the session code. These packages were defined above in the `Config.toml` file.

```rust
    use casper_engine_test_support::{
        ExecuteRequestBuilder, InMemoryWasmTestBuilder, DEFAULT_ACCOUNT_ADDR,
        DEFAULT_RUN_GENESIS_REQUEST,
    };
    use casper_types::account::AccountHash;
    use casper_types::{runtime_args, RuntimeArgs};
```

### Defining The Constants 

The names of the runtime arguments are defined as constants. It is mandatory to use the exact names as in the original contract class to define these constants. These are dictated by the arguments specified by the session code. If your session code takes in different arguments, you should define them as constants at this point.
 
```rust
const ASSOCIATED_ACCOUNT_HASH: AccountHash = AccountHash::new([1u8; 32]); // hash of the associated account
const ASSOCIATED_ACCOUNT: &str = "deployment-account"; // the associated account argument
const CONTRACT_WASM: &str = "contract.wasm"; // file to pass to the instance of the EE
```

### Creating a Test Function

In this step, we create a program to test the contract. 

Each test function is annotated with the `#[test]` attribute. The bodies of test functions typically perform some setup, run the code, then verify the results using assertions.

```rust
#[test]
fn <unit-test-name>{
   // Test function implementation
}
```

This [unit test](https://github.com/casper-ecosystem/two-party-multi-sig/blob/236bb18b9e98da7f9d8706f5e4825494845cfec2/tests/src/integration_tests.rs#L15-L55) is a good example of testing session code. At a high level, the test follows this process:

- Initialize an instance of the execution engine and the `InMemoryWasmTestBuilder`.

```rust
    let mut builder = InMemoryWasmTestBuilder::default();
```

- Execute the genesis process.

```rust
    builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();
```

- Execute the test-specific logic. In this example, retrieve information about the account running the session code and its associated keys. For full details, visit [GitHub](https://github.com/casper-ecosystem/two-party-multi-sig/blob/236bb18b9e98da7f9d8706f5e4825494845cfec2/tests/src/integration_tests.rs#L15-L55).
- Retrieve runtime arguments, which should be the same as defined in the contract.
- Create the execution request that sets up the session code to be executed. In this example, the `CONTRACT_WASM` is the session code.

```rust
    let execute_request =
        ExecuteRequestBuilder::standard(*DEFAULT_ACCOUNT_ADDR, CONTRACT_WASM, runtime_args)
            .build();
```

- Invoke the execution engine to process the session code. 

```rust
    builder.exec(execute_request).expect_success().commit();
```

- Verify that the execution results match the expected output. This example checks the associated keys.

```rust
    assert!(associated_keys.contains_key(&ASSOCIATED_ACCOUNT_HASH));
```

### Running the Test

To run the tests, this example use a `Makefile`.

```bash
make test
```

Under the hood, the `Makefile` generates a `tests/wasm` folder, copies the Wasm to the folder, and runs the tests with `cargo test`. 

```bash
mkdir -p tests/wasm
cp contract/target/wasm32-unknown-unknown/release/contract.wasm tests/wasm
cd tests && cargo test
```

### Other Examples

In the [counter unit tests](https://github.com/casper-ecosystem/counter/blob/master/tests/src/integration_tests.rs), we use session code to call the contract. The code loads the account that pays for the session code, the session code Wasm, and the runtime arguments. Then, the code invokes the execution engine to process the session code.

```rust
    // Use session code to increment the counter
    let session_code_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        COUNTER_CALL_WASM,
        runtime_args! {
            CONTRACT_KEY => contract_hash
        },
    )
    .build();

    builder.exec(session_code_request).expect_success().commit();
```

The verification step looks like this:

```rust

    let incremented_count = builder
        .query(None, count_key, &[])
        .expect("should be stored value.")
        .as_cl_value()
        .expect("should be cl value.")
        .clone()
        .into_t::<i32>()
        .expect("should be i32.");

    assert_eq!(incremented_count, 1);
```

For many more examples, visit the [casper-node](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/test) GitHub repository.

## Video Walkthrough

The following brief video describes testing the [sample session code](https://github.com/casper-ecosystem/two-party-multi-sig/) for configuring an account. 

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=5" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## What's Next? {#whats-next}

- Learn to [install a contract and query global state](/dapp-dev-guide/writing-contracts/installing-contracts.md)