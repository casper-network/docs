# Testing Smart Contracts

## Introduction

As part of the Casper local Rust contract development environment, we provide a [testing framework](https://docs.rs/casper-engine-test-support/latest/casper_engine_test_support/). This framework allows the testing of new contracts without running a full node. Instead, it creates an instance of the Casper execution engine, which allows for monitoring changes to global state using assertions and confirms the successful sending of a Deploy containing the smart contract.

The Casper test crate must be included within a [Rust workspace](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html) alongside the Wasm-producing crate to be tested. A workspace consists of a set of packages that share the same `Cargo.lock` file and output directory.

:::note

The Casper test support crate is only one option for testing your Deploys before sending them to global state. It provides a degree of assistance, but you can create your own testing framework if you prefer.

:::

## Creating the Test Structure {#creating-the-test-structure}

### Generating the Project with Cargo
 
When using the [`cargo-casper`](https://crates.io/crates/cargo-casper) crate, you can use the following command to generate a project containing both an example contract and a separate test crate:

```
cargo casper my_project
```

### Manually Creating the Test Folder

You can create a test crate manually with the following command:

```
cargo new tests
```

This command will create a Rust Cargo package, including the `/src/main.rs` and `Cargo.toml` files. As stated above, you should create the test crate within the same workspace as your Wasm-producing crates. For this example, we will use the counter contract outlined in the [Writing a Basic Smart Contract in Rust](/dapp-dev-guide/writing-contracts/rust-contracts.md) tutorial.

### Defining Dependencies in Cargo.toml

Prior to creating the code for your tests, you will want to outline the dependencies within the `Cargo.toml` file. For the counter tests, we have the following dependencies:

```rust
[dependencies]
casper-execution-engine = "2.0.0"
casper-engine-test-support = { version = "2.2.0", features = ["test-support"] }
casper-types = "1.5.0"
```

- `casper-execution-engine` - This crate imports the execution engine functionality, enabling Wasm execution within the test framework. Each node contains an instance of an execution engine, and the testing framework simulates this behavior.
- `casper-engine-test-support` - Helper crate that provides the interface to write tests and interact with an instance of the execution engine.
- `casper-types` - Types shared by many Casper crates for use on a Casper network. 

## Writing the Tests {#writing-the-tests}

Tests for this example contract reside in the [tests/src/integration-tests.rs](https://github.com/casper-ecosystem/counter/blob/master/tests/src/integration_tests.rs) file.

Notice that this file contains an empty `main` method to initialize the test program. Alternatively, we could use the `#![no_main]` annotation at the top of the file, as we did [here](https://github.com/casper-ecosystem/counter/blob/b37f1ff5f269648ed2bbc5e182128f17e65fe710/contract/src/main.rs#L1-L2).

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

Coding for your test crate should take place within the Rust file present in the `tests` directory. To begin, you must import external test support. This includes a variety of default values and helper methods that we will use throughout our test. Additionally, you will need to import any [CLTypes](/dapp-dev-guide/sdkspec/types_cl.md) that you've used within the contract code to be tested.

```rust
    // Outlining aspects of the Casper test support crate to include.
    use casper_engine_test_support::{
        ExecuteRequestBuilder, InMemoryWasmTestBuilder, DEFAULT_ACCOUNT_ADDR,
        DEFAULT_RUN_GENESIS_REQUEST,
    };
    // Custom Casper types that will be used within this test.
    use casper_types::{runtime_args, ContractHash, RuntimeArgs};
```

After importing the required crates, you will need to define any global variables or constants used within the test. 

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

The test function installs the contract and runs potential entry points to assert that the contract's behavior matches expectations. The test uses the `InMemoryWasmTestBuilder` to invoke an instance of the execution engine, effectively simulating the process of installing the contract on the chain.

As part of this process, we will also use the `DEFAULT_RUN_GENESIS_REQUEST` to install the system contracts necessary for our tests, including the `Mint`, `Auction` and `HandlePayment`contracts, as well as establishing a default address and funding the associated purse.

```rust
    #[test]
    /// Install version 1 of the counter contract and check its available entry points. ...
    fn install_version1_and_check_entry_points() {
        let mut builder = InMemoryWasmTestBuilder::default();
        builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();
        
        // See the repository for the full function.
    }
```

### Execution Request to Install the Contract

The function then uses the `ExecuteRequestBuilder` to install the contract to be tested. For this example, we use standard dependencies. Within the execution request, we specify using the `DEFAULT_ACCOUNT_ADDR` established by our genesis builder as the account sending the Deploy and the Wasm. This Deploy refers to the counter contract as specified in the constants above.

After we have built our `ExecuteRequestBuilder`, in this example titled 'contract_v1_installation_request', we will execute the request through `builder.exec` and proceed to add execution requests as necessary.

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

### Execution Request to Run Session Code

To unit test the installed contract, we will need an entity to call the contract. In this instance, we will use session code included within *counter-call.wasm*. Further, we will need the contract hash of the newly installed counter contract.

The following code retrieves the contract hash from within the named keys of the `DEFAULT_ACCOUNT_ADDR` that sent the Deploy containing the contract.

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

The session code will use the acquired contract hash to identify the correct contract when calling it. Once again, we will use the `ExecuteRequestBuilder`, this time to simulate the execution of session code calling the `counter-inc` entry point.

The session code identifies the account to use for sending the deploy (`DEFAULT_ACCOUNT_ADDR`), the deploy to be sent (`COUNTER_CALL_WASM`) and the runtime arguments required.

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

    builder
    .exec(session_code_request)
    .expect_success()
    .commit();
```

The entry point can also be called using the `contract_call_by_hash` function, and without using session code.

```rust
    // Call the increment entry point to increment the value stored under "count".
    let contract_increment_request = ExecuteRequestBuilder::contract_call_by_hash(
        *DEFAULT_ACCOUNT_ADDR,
        contract_v2_hash,
        ENTRY_POINT_COUNTER_INC,
        runtime_args! {},
    )
    .build();

    builder
        .exec(contract_increment_request)
        .expect_success()
        .commit();
```

### Testing Contracts that Call Contracts {#testing-contracts-that-call-contracts}

If your system involves multiple contracts, they will all need to be [installed](#building-an-execution-request-to-install-the-contract) within your test. The testing framework exists independently of any Casper Networks, so you will need to either write the code yourself or have access to the original installation code of a contract you wish to include. The exceptions to this are system contracts installed as part of the DEFAULT_RUN_GENESIS_REQUEST. These include `Mint`, `Auction`, `HandlePayment` and `StandardPayment`.

Each contract installation will require an additional Wasm file installed through a `Deploy` using `ExecuteRequestBuilder`. Depending on your requirements as a smart contract author, you may need the use of [return values](dapp-dev-guide/tutorials/return-values-tutorial) to interact with stacks of contracts. Interaction between contracts will still require the use of session code to initiate the process, as contracts will not execute actions autonomously.

The major difference between calling a contract from session code versus contract code is the ability to use non-standard dependencies for the `ExecuteRequestBuilder`. Where session code must designate a Wasm file within the standard dependencies, contract code can use one of the four available options for calling other contracts, namely:

- `contract_call_by_hash` Calling a contract by the its `ContractHash`
- `contract_call_by_name` Calling a contract referenced by a named key in the signer's Account context
- `versioned_contract_call_by_hash` Calling a specific version of a contract using its `ContractHash`
- `versioned_contract_call_by_name` Calling a specific version of a contract referenced by a named key in the signer's Account context

In all cases, the calling contract must also provide an entry point and any necessary runtime arguments.

### Evaluating and Comparing Results to Expected Values

After installing the contract and running session code to call it, we can test that the contract operated as intended. We use the `builder` method to retrieve the associated information from the `DEFAULT_ACCOUNT_ADDR`. We then pass this value through `into_t` to convert it to the value type required.

Once we have the two values, we can use `assert_eq!()` to compare them against the values we expect.

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

For many more examples, visit the [casper-node](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/test) GitHub repository.

## Video Walkthrough

The following brief video describes testing [sample contract code](https://github.com/casper-ecosystem/counter/).

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=7" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Further Testing {#further-testing}

Unit testing is only one way to test potential Deploys prior to sending them to a Casper network. After unit testing your contract, you may wish to perform [local network testing](/dapp-dev-guide/building-dapps/setup-nctl) using NCTL. This allows you to set up and control multiple local Casper nodes to perform [testing in a further simulated network environment](/dapp-dev-guide/building-dapps/nctl-test).

You may also wish to test your Deploys on the Casper [Testnet](https://testnet.cspr.live/).

## What's Next? {#whats-next}

- Understand [session code](/dapp-dev-guide/writing-contracts/contract-vs-session) and how it triggers a smart contract
- Learn to [install a contract and query global state](/dapp-dev-guide/writing-contracts/installing-contracts.md) with the Casper command-line client