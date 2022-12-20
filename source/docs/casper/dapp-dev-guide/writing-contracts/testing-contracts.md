# Testing Smart Contracts

## Introduction

As part of the Casper development environment, we provide a [testing framework](https://docs.rs/casper-engine-test-support/latest/casper_engine_test_support/) to test new contracts without running a full node. The framework creates an instance of the Casper execution engine, which can confirm successful deploys and monitor changes to global state using assertions. The Casper test crate must be included within the Rust workspace alongside the Wasm-producing crate to be validated.

:::note

The Casper test support crate is one of many options for testing contracts before sending them to a Casper network. If you prefer, you can create your own testing framework.

:::


### Defining Dependencies in `Cargo.toml`

This guide uses the project structure, and example contract outlined [here](/dapp-dev-guide/writing-contracts/rust-contracts.md#directory-structure) for creating tests.

To begin, outline the required test dependencies in the `/tests/Cargo.toml` file. Specify the dependencies for your tests similarly and update the crate versions. Dependencies may vary with each project. For the counter tests, we have the following dependencies:

```rust
[dependencies]
casper-execution-engine = "2.0.0"
casper-engine-test-support = { version = "2.2.0", features = ["test-support"] }
casper-types = "1.5.0"
```

- `casper-execution-engine` - This crate imports the execution engine functionality, enabling Wasm execution within the test framework. Each node contains an instance of an execution engine, and the testing framework simulates this behavior.
- `casper-engine-test-support` - A helper crate that provides the interface to write tests and interact with an instance of the execution engine.
- `casper-types` - Types shared by many Casper crates for use on a Casper network. 

## Writing the Tests {#writing-the-tests}

The tests for the contract usually reside in the `tests` directory. Tests for the counter contract reside in the [tests/src/integration-tests.rs](https://github.com/casper-ecosystem/counter/blob/master/tests/src/integration_tests.rs) file. Notice that this file contains an empty `main` method to initialize the test program. Alternatively, we could use the `#![no_main]` annotation at the top of the file, as we did [here](https://github.com/casper-ecosystem/counter/blob/b37f1ff5f269648ed2bbc5e182128f17e65fe710/contract/src/main.rs#L1-L2).

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

Import external test support, which includes a variety of default values and helper methods to be used throughout the test. Additionally, you will need to import any [CLTypes](/dapp-dev-guide/sdkspec/types_cl.md) used within the contract code to be tested.

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
    const COUNTER_DEFINE_WASM: &str = "counter-define.wasm"; // The main example contract
    const COUNTER_CALL_WASM: &str = "counter-call.wasm"; // The session code that calls the contract

    const CONTRACT_KEY: &str = "counter"; // Named key referencing this contract
    const COUNT_KEY: &str = "count"; // Named key referencing the count value
    const CONTRACT_VERSION_KEY: &str = "version"; // Automatically incremented version in a contract package
```

### Creating a Test Function

Each test function installs the contract and calls entry points to assert that the contract's behavior matches expectations. The test uses the `InMemoryWasmTestBuilder` to invoke an instance of the execution engine, effectively simulating the process of installing the contract on the chain.

As part of this process, we use the `DEFAULT_RUN_GENESIS_REQUEST` to install the system contracts necessary for the tests, including the `Mint`, `Auction`, and `HandlePayment`contracts, as well as establishing a default address and funding the associated purse.

```rust
    #[test]
    /// Install version 1 of the counter contract and check its available entry points. ...
    fn should_be_able_to_install_and_increment() {
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
    let contract_installation_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        COUNTER_DEFINE_WASM,
        runtime_args! {},
    )
    .build();

    builder
        .exec(contract_installation_request)
        .expect_success()
        .commit();
```

#### Calling the Contract by Hash

To test the installed contract, we need an entity to call its entry points using the `contract_call_by_hash` function.

```rust
    // Call the increment entry point to increment the value stored under "count".
    let contract_increment_request = ExecuteRequestBuilder::contract_call_by_hash(
        *DEFAULT_ACCOUNT_ADDR,
        contract_hash,
        ENTRY_POINT_COUNTER_INC,
        runtime_args! {},
    )
    .build();

    builder
        .exec(contract_increment_request)
        .expect_success()
        .commit();
```

#### Calling the Contract using Session Code 

In the counter example, we use the session code included in the [counter-call.wasm](https://github.com/casper-ecosystem/counter/blob/master/counter-call/src/main.rs) file. For more details on what session code is and how it differs from contract code, see the [next section](/dapp-dev-guide/writing-contracts/contract-vs-session).

Session code needs the contract hash to invoke the contract. The following code retrieves the contract hash from the named keys of the `DEFAULT_ACCOUNT_ADDR` that sent the installation Deploy.

```rust
    // Check the contract hash.
    let contract_hash = builder
        .get_expected_account(*DEFAULT_ACCOUNT_ADDR)
        .named_keys()
        .get(CONTRACT_KEY)
        .expect("must have contract hash key as part of contract creation")
        .into_hash()
        .map(ContractHash::new)
        .expect("must get contract hash");
```

The following session code uses the contract hash to identify the contract, the account for sending the deploy (`DEFAULT_ACCOUNT_ADDR`), the deploy to be sent (`COUNTER_CALL_WASM`), and the runtime arguments required. Once again, the `ExecuteRequestBuilder` simulates the execution of session code and calls the `counter-inc` entry point.

```rust
    // Use session code to increment the counter.
    let session_code_request = ExecuteRequestBuilder::standard(
        *DEFAULT_ACCOUNT_ADDR,
        COUNTER_CALL_WASM,
        runtime_args! {
            CONTRACT_KEY => contract_hash
        },
    )
    .build();

    builder
    .exec(session_code_request)
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

Each contract installation will require an additional Wasm file installed through a `Deploy` using `ExecuteRequestBuilder`. Depending on your requirements as a smart contract author, you may need to use [return values](dapp-dev-guide/tutorials/return-values-tutorial) to interact with stacks of contracts. Interaction between contracts will require session code to initiate the process, as contracts will not execute actions autonomously.

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
mkdir -p tests/wasm
cp contract/target/wasm32-unknown-unknown/release/counter-define.wasm tests/wasm
cp counter-call/target/wasm32-unknown-unknown/release/counter-call.wasm tests/wasm
cd tests && cargo test
```

## Video Walkthrough

The following brief video describes testing [sample contract code](https://github.com/casper-ecosystem/counter/).

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=7" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Further Testing {#further-testing}

Unit testing is only one way to test contracts before installing them on a Casper network. After unit testing a contract, you may perform [local network testing](/dapp-dev-guide/building-dapps/setup-nctl) using NCTL. This allows you to set up and control multiple local Casper nodes to perform [testing in an other simulated network environment](/dapp-dev-guide/building-dapps/nctl-test).

You may also wish to test your contracts on the Casper [Testnet](https://testnet.cspr.live/).

## What's Next? {#whats-next}

- Understand [session code](/dapp-dev-guide/writing-contracts/contract-vs-session) and how it triggers a smart contract.
- Learn to [install a contract and query global state](/dapp-dev-guide/writing-contracts/installing-contracts.md) with the Casper command-line client.