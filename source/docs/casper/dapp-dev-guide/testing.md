# Testing Contracts

## Introduction

As part of the Casper local Rust contract development environment, we provide a [testing framework](https://docs.rs/casper-engine-test-support/latest/casper_engine_test_support/). This framework allows testing of new contracts without running a full node. Instead, it creates a simulated instance of the Casper execution engine, which allows for monitoring of changes to global state using assertions and confirms the successful sending of a Deploy containing the smart contract.

Our provided test support crate is only one option for testing your Deploys prior to sending them to global state. It provides a degree of assistance, but you are free to create your own testing framework if you prefer.

--------

## Testing Procedure

Testing within the Casper ecosystem involves the following steps:

1) [Writing a Wasm producing crate](../writing-contracts/rust.md)
2) [Create a test crate](#creating-a-test-fixture)
3) [Local Network Testing](../setup-nctl.md)
4) [Sending the Deploy to Testnet](../sending-deploys.md)
5) Sending the tested Deploy to a Casper Network

## Initial Setup

The Casper test crate must be included within a [Rust workspace](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html) alongside the Wasm producing crate to be tested. A workspace consists of a set of packages that share the same `Cargo.lock` file and output directory.

--------

## Creating a Test Crate

You can create a test crate with the following command:

```

cargo new tests

```

This will create a Rust Cargo package, including the */src/main.rs* and *Cargo.toml* files. As stated above, you should create the test crate within the same workspace as your Wasm producing crates.  For this example, we will be using the donation contract outlined in our [Writing a Basic Smart Contract in Rust](../writing-contracts/rust.md) tutorial.

As such, you should see the following directories within the workspace:

* `contract`
* `donate`
* `donation_count`
* `funds_raised`
* `tests`

### Defining Dependencies

Prior to creating the code for your test, you will want to outline the dependencies within *Cargo.toml*

```rust

[package]
name = "tests"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
casper-engine-test-support = { version = "2.0.3", features = ["test-support"] }
casper-execution-engine = "1.4.3"
casper-types = "1.4.5"

```

### Import Builders and Constants

Coding for your test crate should take place within the `tests` directory, using the *main.rs* file. To begin, you must import external test support. This includes a variety of default values and helper methods that we will use throughout our test. Additionally, you will need to import any [CLTypes](../sdkspec/types_cl.md) that you've used within the contract code to be tested.

```rust

#[cfg(test)]
mod tests {
    // Outlining aspects of the Casper test support crate to include.
    use casper_engine_test_support::{DEFAULT_ACCOUNT_ADDR, DEFAULT_ACCOUNT_PUBLIC_KEY, DEFAULT_RUN_GENESIS_REQUEST, ExecuteRequestBuilder, InMemoryWasmTestBuilder};
    // Custom Casper types that will be used within this test.
    use casper_types::{RuntimeArgs, runtime_args, ContractHash, SecretKey, PublicKey, U512, Key};

```

After importing from external crates, you will need to define any global variables or constants used within the test. 

```rust

    // Calling the contract deploy.
    const CONTRACT: &str = "contract.wasm";
    // Calling the session code for a `donate` call.
    const DONATION: &str = "donate.wasm";
    // Calling the session code for a `donation_count` call.
    const DONATION_COUNT: &str = "donation_count.wasm";
    // Calling the session code for a `funds_raised` call.
    const FUNDS_RAISED: &str = "funds_raised.wasm";

    // Establishing constants for use during the test.
    const FUNDRAISER_CONTRACT_HASH: &str = "fundraiser_contract_hash";
    const ENTRY_POINT_DONATE: &str = "donate";
    const DONATING_ACCOUNT_KEY: &str = "donating_account_key";
    const DONATION_AMOUNT: &str = "donation_amount";

```

--------

## Creating a Test Function

The test function serves to install the contract and run potential entry points to assert that 
the contract's behavior matches expectations. To accomplish this, the test will use `InMemoryWasmTestBuilder` to invoke an instance of the execution engine, effectively simulating the process of installing the contract on chain.

As part of this process, we will also use the `DEFAULT_RUN_GENESIS_REQUEST` to install system contracts necessary for our tests. This includes the `Mint`, `Auction` and `HandlePayment`contracts, as well as establishing a default address and funding the associated purse.

```rust

#[test]
    // Creating a test function that will install the contract and then run potential entry points.
    fn should_be_able_to_install_and_donate() {
        // Invoke an instance of the execution engine, including helper methods and assistance.
        let mut builder = InMemoryWasmTestBuilder::default();
        // Runs genesis to establish genesis accounts and write balances, as well as installing necessary
        // system contracts - Mint, Auction and HandlePayment.
        builder.run_genesis(&*DEFAULT_RUN_GENESIS_REQUEST).commit();

```

### Building an Execution Request to Install the Contract

The function then uses `ExecuteRequestBuilder` to install the contract to be tested. For this example, we use standard dependencies. Within the execution request, we specify the use of the `DEFAULT_ACCOUNT_ADDR` established by our genesis builder as the account sending the Deploy, and the `contract` that specifices *contract.wasm*. This Deploy refers to our donation contract as specified in the constants above.

After we have built our `ExecuteRequestBuilder`, in this example titled 'contract_creation_request', we will execute the request through `builder.exec` and proceed to adding any addition execution requests as necessary.

```rust

        // Installing the contract through an execution request with standard dependencies.
        let contract_creation_request = ExecuteRequestBuilder::standard(
            // Use the default account hash included in genesis. Additional accounts can be created for
            // testing purposes by funding them from this account.
            *DEFAULT_ACCOUNT_ADDR,
                // Telling the execution request builder to load up an instance of a deploy with the
                // module_bytes associated with the contract.wasm.
                CONTRACT,
            // Any runtime arguments associated with the creation request, none for this example.
            runtime_args! {}
        ).build();

        // Execute this request.
        builder.exec(contract_creation_request)
            // Expects the deploy to succeed or crashes the test.
            .expect_success()
            // Process the execution result of the previous execute request.
            .commit();

```

### Building an Execution Request to Run Session Code

To unit test the installed contract, we will need an entity to call the contract. In this instance, we will use session code included within *donate.wasm*. Further, we will need the contract hash of the newly installed donation contract.

The following code retrieves the contract hash from within the named keys of the `DEFAULT_ACCOUNT_ADDR` that sent the Deploy containing the contract.

```rust

        // Extracts the contract hash from the named keys of the account in question, the default genesis address.
        let contract_hash = builder
            .get_expected_account(*DEFAULT_ACCOUNT_ADDR)
            .named_keys()
            .get("fundraiser_contract_hash")
            .expect("must have contract hash key as part of contract creation")
            .into_hash()
            .map(|hash| ContractHash::new(hash))
            .expect("must get contract hash");

```

The session code will use the acquired contract hash to identify the correct contract when calling it. Once again, we will use the `ExecuteRequestBuilder`, this time to simulate the execution of session code calling the `Donation` entry point.

Our session code identifies the account to use for sending the deploy (`DEFAULT_ACCOUNT_ADDR`), the deploy to be sent (`DONATION`) and the runtime arguments required. Namely, the contract will require the contract has, the donating account key and the donation amount. In this instance, the session code will be donating 100,000 motes.

The `builder` request follows these details to execute the session code.

```rust

        // Creating an execution request for the session code that calls the `donation` contract.
        let session_code_request = ExecuteRequestBuilder::standard(
            // Again, using the default account hash included with genesis.
            *DEFAULT_ACCOUNT_ADDR,
            // Telling the execution request builder to load up an instance of a deploy built from donate.wasm.
            DONATION,
            // Including the necessary runtime arguments.
            runtime_args! {
                // The fundraiser contract hash as established above, allowing the session code to call the fundraiser contract.
                FUNDRAISER_CONTRACT_HASH => contract_hash,
                // The donating account key, established as they key of the default test support genesis account address.
                DONATING_ACCOUNT_KEY => Key::Account(*DEFAULT_ACCOUNT_ADDR),
                // The amount to be donated.
                DONATION_AMOUNT => U512::from(100_000u64)
            }
        ).build();

        // Execute this request.
        builder
            .exec(session_code_request)
            .expect_success()
            .commit();

```

### Additional ExecutionRequestBuilder Examples

The above example only describe the session code to call *donate.wasm*, and the contract installed includes several other entry points. You can find the code for other entry points below.

<details>

<summary><b>Additional Code Examples</b></summary>

```rust

        // Creating an execution request for the session code that calls the `donation_count` contract.
        let donation_count_request =  ExecuteRequestBuilder::standard(
            *DEFAULT_ACCOUNT_ADDR,
            DONATION_COUNT,
            runtime_args! {
                FUNDRAISER_CONTRACT_HASH => contract_hash,
                DONATING_ACCOUNT_KEY => Key::Account(*DEFAULT_ACCOUNT_ADDR),
            }
        ).build();

        // Execute this request.
        builder
            .exec(donation_count_request)
            .expect_success()
            .commit();

        // Creating an execution request for the session code that calls the `funds_raised_ contract.
        let funds_raised_request =  ExecuteRequestBuilder::standard(
            *DEFAULT_ACCOUNT_ADDR,
            FUNDS_RAISED,
            runtime_args! {
                FUNDRAISER_CONTRACT_HASH => contract_hash
            }
        ).build();

        // Execute this request.
        builder
            .exec(funds_raised_request)
            .expect_success()
            .commit();

```

</details>

### Evaluating and Comparing Results to Expected Values

After installing the contract and running session code to call the contract and donate to the returned purse, we can test that the contract operated as intended. We will compare two values within the context of this test: the number of times that the account donated, and the total funds raised.

As we ran *donate.wasm* once, the donation count should be 1. During that donation, the `DEFAULT_ACCOUNT_ADDR` donated 100,000 motes, which we will also verify. However, the first step is retrieving the stored value for each and converting it to a `u64` and `U512` value, respectively.

To do this, we use the `builder` method to retrieve the associated information from the `DEFAULT_ACCOUNT_ADDR`. We then pass this value through `into_t` to convert it to the value type requried.

Once we have the two values, we can then use `assert_eq!()` to compare them against the values we expect.

```rust

        // Retrieving the donation count and then converting it to a u64 value.
        let actual_donation_count = builder
            .query(None, Key::Account(*DEFAULT_ACCOUNT_ADDR), &vec!["donation_count".to_string()])
            .expect("must get stored value"
            ).as_cl_value()
            .expect("must get cl_value")
            .to_owned()
            .into_t::<u64>()
            .unwrap();

        // Comparing the retrieved donation count against the expected value.
        assert_eq!(actual_donation_count, 1u64);

        // Retrieving the funds raised amount and then converting it to a U512 value.
        let actual_funds_raised = builder
            .query(None, Key::Account(*DEFAULT_ACCOUNT_ADDR), &vec!["funds_raised".to_string()])
            .expect("must get stored value"
            ).as_cl_value()
            .expect("must get cl_value")
            .to_owned()
            .into_t::<U512>()
            .unwrap();

        // Comparing the retrieved donation count against the expected value.
        assert_eq!(U512::from(100_000u64), actual_funds_raised);

```

--------

## Next Steps and Further Testing

Unit testing is only one way to test potential Deploys prior to sending them to a Casper network. After unit testing your contract, you may wish to perform [local network testing](../../dapp-dev-guide/setup-nctl) using NCTL. This allows you to set up and control multiple local Casper nodes to perform testing in further simulated network environment.

You may also wish to test your Deploys on the Casper [Testnet](https://testnet.cspr.live/).