import useBaseUrl from '@docusaurus/useBaseUrl';

# Testing Smart Contracts

## Introduction

As part of the Casper development environment, we provide a [testing framework](https://docs.rs/casper-engine-test-support/latest/casper_engine_test_support/) to test new contracts without running a full node. The framework creates an instance of the Casper execution engine, which can confirm successful deploys and monitor changes to global state using assertions. The Casper test crate must be included within the Rust workspace alongside the Wasm-producing crate to be validated.

:::note

The Casper test support crate is one of many options for testing contracts before sending them to a Casper network.

Independent of the framework, knowing how to set up the debugger and log the messages from the test execution will ensure that the contract is fully functional before being deployed on a Casper network.

:::


### Defining Dependencies in `Cargo.toml`

This guide uses the project structure, and example contract outlined [here](./simple-contract.md#directory-structure) for creating tests.

To begin, outline the required test dependencies in the `/tests/Cargo.toml` file. Specify the dependencies for your tests similarly and update the crate versions. Dependencies may vary with each project. For the counter tests, we have the following dependencies:

```rust
[dependencies]
casper-execution-engine = "2.0.1"
casper-engine-test-support = { version = "2.2.0", features = ["test-support"] }
casper-types = "1.5.0"
```

- `casper-execution-engine` - This crate imports the execution engine functionality, enabling Wasm execution within the test framework. Each node contains an instance of an execution engine, and the testing framework simulates this behavior.
- `casper-engine-test-support` - A helper crate that provides the interface to write tests and interact with an instance of the execution engine.
- `casper-types` - Types shared by many Casper crates for use on a Casper network.

## Setting up the Debugger and types of debugging

There are many ways to ensure the code is written correctly and will not cause problems after being deployed on the blockchain. While a good understanding of the Casper testing framework is crucial for proper smart contract development, it is also necessary to know how to leverage other tools to confirm that the logic in the smart contract is functioning correctly. Since debugging in Rust is not enabled out of the box, you must do some additional setup to debug code in Rust.

### Debugging code using breakpoints in VS Code

1. Set up the CodeLLDB extension, a native debugger supporting C++, Rust, and other compiled languages. This way, you can debug your code by adding breakpoints.
2. Select the main project folder. Type the `make test` command in the VS Code terminal to create the target folder with Wasm files.
3. Select the tests.rs file. Using the toolbar, create a new configuration for Rust by navigating to `Run -> Start Debugging`.
4. You will be able to set breakpoints now.
5. There are two possibilities to run unit tests:
- Either from the main project folder using the command `make test`
- Or from the `tests` subfolder using the command `cargo test`

Both variants will yield the same result which will run the tests and show if all were completed successfully.

<p align="center"><img src={useBaseUrl("/image/testing-contracts/running-tests.png")} alt="running-tests" width="600"/></p>

If you are completely sure that the code written in the unit tests is correct, then there is no further need to go deeper than that. It is advisable however to know what to do if you want to know how the code exactly works.
The debug configuration needs to be set up in the following way, so it allows for the debugging of the tests.

```bash
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug",
            "program":  "${workspaceRoot}/default-project/tests/target/debug/deps/integration_tests-2771dd9bbf2fac3c",
            "args": [],
            "cwd": "${workspaceRoot}",
            "sourceLanguages": [
                "rust"
            ]
        }
    ]
}
```

The most important is the program path which needs to be set exactly to the unit tests path seen during the “make test” or “cargo test” unit tests run.
In this case this would be `integration_tests-2771dd9bbf2fac3c`.

6.	Set the breakpoints in the unit tests file.

<p align="center"><img src={useBaseUrl("/image/testing-contracts/set-breakpoint.png")} alt="set-breakpoint" width="600"/></p>

7.	Select the test.rs file and run the program in debug mode (F5).

<p align="center"><img src={useBaseUrl("/image/testing-contracts/caught-breakpoint.png")} alt="caught-breakpoint" width="600"/></p>

This will allow you to see the parameters of the debugged unit tests.

### Debugging with macros

The second most popular type of debugging is using the `println!` macro in the code so the parameters can be printed out while running `cargo test`.

<p align="center"><img src={useBaseUrl("/image/testing-contracts/println-macro.png")} alt="println-macro" width="600"/></p>

It is important to note that running `cargo test` without any parameters will not log the `println!` in the terminal.
For this to take effect the command

```bash
cargo test -- --nocapture
```

must be used.
This will produce the following outcome:

<p align="center"><img src={useBaseUrl("/image/testing-contracts/println-tests.png")} alt="println-tests" width="600"/></p>

It might be confusing that although the macro is put in the first test function, it appears on top of the test stack. This is due to Rust running the tests in parallel.
Those tests should target the function in question to make sure everything is clear during analysis.

## Writing the Tests {#writing-the-tests}

The tests for the contract usually reside in the `tests` directory. Tests for the counter contract reside in the [tests/src/integration-tests.rs](https://github.com/casper-ecosystem/counter/blob/master/tests/src/integration_tests.rs) file. Notice that this file contains an empty `main` method to initialize the test program. Alternatively, we could use the `#![no_main]` annotation at the top of the file, as we did [here](https://github.com/casper-ecosystem/counter/blob/8a622cd92d768893b9ef9fc2b150c674415be87e/contract-v1/src/main.rs#L1-L2).

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

### Importing Builders and Constants

Import external test support, which includes a variety of default values and helper methods to be used throughout the test. Additionally, you will need to import any [CLTypes](../json-rpc/types_cl.md) used within the contract code to be tested.

```rust
    // Outlining aspects of the Casper test support crate to include.
    use casper_engine_test_support::{
        ExecuteRequestBuilder, InMemoryWasmTestBuilder, DEFAULT_ACCOUNT_ADDR,
        DEFAULT_RUN_GENESIS_REQUEST,
    };
    // Custom Casper types that will be used within this test.
    use casper_types::{runtime_args, ContractHash, RuntimeArgs};
```

Next, you need to define any global variables or constants for the test.

```rust
    const COUNTER_V1_WASM: &str = "counter-v1.wasm"; // The first version of the contract
    const COUNTER_V2_WASM: &str = "counter-v2.wasm"; // The second version of the contract
    const COUNTER_CALL_WASM: &str = "counter-call.wasm"; // Session code that calls the contract

    const CONTRACT_KEY: &str = "counter"; // Named key referencing this contract
    const COUNT_KEY: &str = "count"; // Named key referencing the value to increment/decrement
    const CONTRACT_VERSION_KEY: &str = "version"; // Key maintaining the version of a contract package

    const ENTRY_POINT_COUNTER_DECREMENT: &str = "counter_decrement"; // Entry point to decrement the count value
    const ENTRY_POINT_COUNTER_INC: &str = "counter_inc"; // Entry point to increment the count value
```

### Creating a Test Function

Each test function installs the contract and calls entry points to assert that the contract's behavior matches expectations. The test uses the `InMemoryWasmTestBuilder` to invoke an instance of the execution engine, effectively simulating the process of installing the contract on the chain.

As part of this process, we use the `DEFAULT_RUN_GENESIS_REQUEST` to install the system contracts necessary for the tests, including the `Mint`, `Auction`, and `HandlePayment`contracts, as well as establishing a default account and funding the associated purse.

```rust
    #[test]
    /// Install version 1 of the counter contract and check its available entry points. ...
    fn install_version1_and_check_entry_points() {
        let mut builder = InMemoryWasmTestBuilder::default();
        builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();

        // See the repository for the full function.
    }
```

#### Installing the Contract

Test functions use the `ExecuteRequestBuilder` to install a contract to be tested. In the counter tests, we use standard dependencies and the counter contract. Within the execution request, we specify the `DEFAULT_ACCOUNT_ADDR` established by our genesis builder as the account sending the Deploy.

After building the `ExecuteRequestBuilder` (in this example, `contract_installation_request`), we process the request through `builder.exec` and then add and process other requests as necessary.

```rust
    // Install the contract.
    let contract_v1_installation_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        COUNTER_V1_WASM,
        runtime_args! {},
    )
    .build();

    builder
        .exec(contract_v1_installation_request)
        .expect_success()
        .commit();
```

#### Calling the Contract by Hash

To verify the installed contract, we need its contract hash. The test will then call its entry points using the `contract_call_by_hash` function. The following code retrieves the contract hash from the named keys of the `DEFAULT_ACCOUNT_ADDR` that sent the installation Deploy.

```rust
    // Check the contract hash.
    let contract_v1_hash = builder
        .get_expected_account(*DEFAULT_ACCOUNT_ADDR)
        .named_keys()
        .get(CONTRACT_KEY)
        .expect("must have contract hash key as part of contract creation")
        .into_hash()
        .map(ContractHash::new)
        .expect("must get contract hash");
```

Next, we test an entry point that should not exist in the first version of the contract.

```rust
    // Call the decrement entry point, which should not be in version 1 before the upgrade.
    let contract_decrement_request = ExecuteRequestBuilder::contract_call_by_hash(
        *DEFAULT_ACCOUNT_ADDR,
        contract_v1_hash,
        ENTRY_POINT_COUNTER_DECREMENT,
        runtime_args! {},
    )
    .build();

    // Try executing the decrement entry point and expect an error.
    builder
        .exec(contract_decrement_request)
        .expect_failure()
        .commit();
```

#### Calling the Contract using Session Code

In the counter example, we use the session code included in the [counter-call.wasm](https://github.com/casper-ecosystem/counter/blob/master/counter-call/src/main.rs) file. For more details on what session code is and how it differs from contract code, see the [next section](../../concepts/session-code.md).

The following session code uses the contract hash to identify the contract, the account for sending the deploy (`DEFAULT_ACCOUNT_ADDR`), the deploy to be sent (`COUNTER_CALL_WASM`), and the runtime arguments required. Once again, the `ExecuteRequestBuilder` simulates the execution of session code and calls the `counter-inc` entry point.

```rust
    // Use session code to increment the counter.
    let session_code_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        COUNTER_CALL_WASM,
        runtime_args! {
            CONTRACT_KEY => contract_v1_hash
        },
    )
    .build();

    builder.exec(session_code_request)
        .expect_success()
        .commit();
```

#### Evaluating and Comparing Results

After calling the contract, we should verify the results received to ensure the contract operated as intended. The `builder` method retrieves the required information and converts it to the value type required. Then, `assert_eq!()` compares the result against the expected value.

```rust
    // Verify the value of count is now 1.
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

For more test examples, visit the [casper-node](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/test) GitHub repository.

## Testing Contracts that Call Contracts {#testing-contracts-that-call-contracts}

If the code to be tested involves multiple contracts, they must be installed within the test. The exceptions are system contracts installed as part of the `DEFAULT_RUN_GENESIS_REQUEST`. The testing framework exists independently of any Casper network, so you will need access to the original contract installation code or the Wasm you wish to include.

Each contract installation will require an additional Wasm file installed through a `Deploy` using `ExecuteRequestBuilder`. Depending on your requirements as a smart contract author, you may need to use [return values](../../resources/tutorials/advanced/return-values-tutorial.md) to interact with stacks of contracts. Interaction between contracts will require session code to initiate the process, as contracts will not execute actions autonomously.

The major difference between calling a contract from session code versus contract code is the ability to use non-standard dependencies for the `ExecuteRequestBuilder`. Where session code must designate a Wasm file within the standard dependencies, contract code can use one of the four available options for calling other contracts, namely:

- `contract_call_by_hash` - Calling a contract by its `ContractHash`.
- `contract_call_by_name` - Calling a contract referenced by a named key in the signer's Account context.
- `versioned_contract_call_by_hash` - Calling a specific contract version using its `ContractHash`.
- `versioned_contract_call_by_name` - Calling a specific version of a contract referenced by a named key in the signer's Account context.

The calling contract must also provide an entry point and any necessary runtime arguments in all cases.

## Running the Tests

To run the tests, the counter example uses a `Makefile`.

```bash
make test
```

Under the hood, the `Makefile` generates a `tests/wasm` folder, copies the Wasm files to the folder, and runs the tests using `cargo test`.

```bash
test: build-contract
	mkdir -p tests/wasm
	cp contract-v1/target/wasm32-unknown-unknown/release/counter-v1.wasm tests/wasm
	cp contract-v2/target/wasm32-unknown-unknown/release/counter-v2.wasm tests/wasm
	cp counter-call/target/wasm32-unknown-unknown/release/counter-call.wasm tests/wasm
	cd tests && cargo test
```

## Video Walkthrough

The following brief video describes testing [sample contract code](https://github.com/casper-ecosystem/counter/).

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=7" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Further Testing {#further-testing}

Unit testing is only one way to test contracts before installing them on a Casper network. After unit testing a contract, you may perform [local network testing](../../dapp-dev-guide/building-dapps/setup-nctl.md) using NCTL. This allows you to set up and control multiple local Casper nodes to perform [testing in an other simulated network environment](../../dapp-dev-guide/building-dapps/nctl-test.md).

You may also wish to test your contracts on the Casper [Testnet](https://testnet.cspr.live/).

## What's Next? {#whats-next}

- Understand [session code](../../concepts/session-code.md) and how it triggers a smart contract.
- Learn to [install a contract and query global state](../cli/installing-contracts.md) with the Casper command-line client.
