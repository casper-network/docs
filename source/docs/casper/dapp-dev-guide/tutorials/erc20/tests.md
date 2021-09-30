# Testing the Contract

The testing framework in this tutorial uses the [Casper engine test support](https://crates.io/crates/casper-engine-test-support) crate for testing the contract implementation against the Casper execution environment.

We will review the following three `GitHub <https://github.com/casper-ecosystem/erc20>`\_ files, which create the testing framework:

-   `tests/src/erc20.rs` - sets up the testing context and creates helper functions used by unit tests
-   `tests/src/tests.rs` - contains the unit tests
-   `tests/src/lib.rs` - links the above files together and is required by the Rust toolchain

The following is an example of a complete test:

```rust
#[test]
fn test_erc20_transfer() {
    let amount = 10.into();
    let mut t = Token::deployed();
    t.transfer(t.bob, amount, Sender(t.ali));
    assert_eq!(t.balance_of(t.ali), token_cfg::total_supply() - amount);
    assert_eq!(t.balance_of(t.bob), amount);
}
```

[//]: # "Removed links for `tests crate <https://github.com/casper-ecosystem/erc20/tree/master/tests>` and `contract crate <https://github.com/casper-ecosystem/erc20/tree/master/contract>` as the links are broken"

The tests crate has a `build.rs` file, which is effectively a custom build script executed every time before running the tests. The `build.rs` file compiles the contract crate in _release_ mode and copies the `contract.wasm` file to the `tests/wasm` directory. In practice, that means you only need to run a single command during development, which is **make test**.

## Configuring the Test Package {#configuring-the-test-package}

First, we define a `tests` package in the `tests/Cargo.toml` file.

```toml
[package]
name = "tests"
version = "0.2.0"
authors = ["Your Name here <your email here>"]
edition = "2018"

[dependencies]
casper-contract = "1.1.1"
casper-types = "1.1.1"
casper-engine-test-support = "1.1.1"

[features]
default = ["casper-contract/std", "casper-types/std", "casper-contract/test-support"]
```

## Describing the Logic for Testing {#describing-the-logic-for-testing}

To test the smart contract, we need to specify the starting state of the blockchain, deploy the compiled contract to this starting state, and create additional deploys for each of the methods in the contract.

The `tests/src/erc20.rs` file contains methods that can simulate a real-world deployment (storing the contract in the blockchain) and transactions to invoke the methods in the contract.

### Setting up the testing context {#setting-up-the-testing-context}

Let's start by defining the required constants (i.e., method names, key names, and account addresses). The following code initializes the [global state](https://docs.casperlabs.io/en/latest/glossary/G.html#global-state) with all the data and methods that a smart contract needs to run correctly.

```rust
// File tests/src/erc20.rs

 pub mod token_cfg {
     use super::*;
     pub const NAME: &str = "ERC20";
     pub const SYMBOL: &str = "ERC";
     pub const DECIMALS: u8 = 18;
     pub fn total_supply() -> U256 {
         1_000.into()
     }
 }

 pub struct Sender(pub AccountHash);

 pub struct Token {
     context: TestContext,
     pub ali: AccountHash,
     pub bob: AccountHash,
     pub joe: AccountHash,
 }
```

### Deploying the contract {#deploying-the-contract}

The next step is to define the `ERC20Contract` struct that has its own VM instance and implements the ERC-20 methods. This struct holds a `TestContext` of its own. The _contract_hash_ and the _session_code_ won't change after the contract is deployed, so it is good to keep them handy.

This code snippet builds the context and includes the compiled `contract.wasm` binary being tested. This function creates a new instance of the `ERC20Contract` with the accounts `ali`, `bob` and `joe` having a positive initial balance. The contract is deployed using the `ali` account.

```rust
// File tests/src/erc20.rs

// the contract struct
pub struct Token {
    context: TestContext,
    pub ali: AccountHash,
    pub bob: AccountHash,
    pub joe: AccountHash,
}

impl Token {
    pub fn deployed() -> Token {
        let ali = PublicKey::ed25519_from_bytes([3u8; 32]).unwrap();
        let bob = PublicKey::ed25519_from_bytes([6u8; 32]).unwrap();
        let joe = PublicKey::ed25519_from_bytes([9u8; 32]).unwrap();

        // Builds test context with Alice & Bob's accounts
        let mut context = TestContextBuilder::new()
            .with_public_key(ali, U512::from(500_000_000_000_000_000u64))
            .with_public_key(bob, U512::from(500_000_000_000_000_000u64))
            .build();


        // Adds compiled contract to the context with arguments specified above.
        // For this example it is 'ERC20' & 'ERC'
        let session_code = Code::from("contract.wasm");
        let session_args = runtime_args! {
            "tokenName" => token_cfg::NAME,
            "tokenSymbol" => token_cfg::SYMBOL,
            "tokenTotalSupply" => token_cfg::total_supply()
        };

        // Builds the session with the code and arguments
        let session = SessionBuilder::new(session_code, session_args)
            .with_address(ali.to_account_hash())
            .with_authorization_keys(&[ali.to_account_hash()])
            .build();

        //Runs the code
        context.run(session);
        Token {
            context,
            ali: ali.to_account_hash(),
            bob: bob.to_account_hash(),
            joe: joe.to_account_hash(),
        }
    }
```

### Querying the network {#querying-the-network}

The previous step has simulated a real deploy on the network. The next code snippet describes how to query the network to find the _contract hash_.

Contracts are deployed under the context of an account. Since we created the deploy under the context of `self.ali`, this is what we will query here. The `query_contract` function uses `query` to lookup named keys. It will be used to implement the `balance_of`, `total_supply` and `allowance` checks.

```rust
fn contract_hash(&self) -> Hash {
    self.context
        .query(self.ali, &[format!("{}_hash", token_cfg::NAME)])
        .unwrap_or_else(|_| panic!("{} contract not found", token_cfg::NAME))
        .into_t()
        .unwrap_or_else(|_| panic!("{} has wrong type", token_cfg::NAME))
}

// This function is a generic helper function that queries for a named key defined in the contract.
fn query_contract<T: CLTyped + FromBytes>(&self, name: &str) -> Option<T> {
    match self
        .context
        .query(self.ali, &[token_cfg::NAME.to_string(), name.to_string()])
    {
        Err(_) => None,
        Ok(maybe_value) => {
            let value = maybe_value
                .into_t()
                .unwrap_or_else(|_| panic!("{} is not expected type.", name));
            Some(value)
        }
    }
}

// Here, we call the helper function to query on named keys defined in the contract.

// Returns the name of the token
pub fn name(&self) -> String {
    self.query_contract("name").unwrap()
}

// Returns the token symbol
pub fn symbol(&self) -> String {
    self.query_contract("symbol").unwrap()
}

// Returns the number of decimal places for the token
pub fn decimals(&self) -> u8 {
    self.query_contract("decimals").unwrap()
}
```

### Invoking contract methods {#invoking-contract-methods}

The following code snippet describes a generic way to call a specific entry point in the contract.

```rust
fn call(&mut self, sender: Sender, method: &str, args: RuntimeArgs) {
    let Sender(address) = sender;
    let code = Code::Hash(self.contract_hash(), method.to_string());
    let session = SessionBuilder::new(code, args)
        .with_address(address)
        .with_authorization_keys(&[address])
        .build();
    self.context.run(session);
}
```

**Invoking the contract methods**

Here is how to invoke each of the methods in the contract:

```rust
pub fn balance_of(&self, account: AccountHash) -> U256 {
    let key = format!("balances_{}", account);
    self.query_contract(&key).unwrap_or_default()
}

pub fn allowance(&self, owner: AccountHash, spender: AccountHash) -> U256 {
    let key = format!("allowances_{}_{}", owner, spender);
    self.query_contract(&key).unwrap_or_default()
}

pub fn transfer(&mut self, recipient: AccountHash, amount: U256, sender: Sender) {
    self.call(
        sender,
        "transfer",
        runtime_args! {
            "recipient" => recipient,
            "amount" => amount
        },
    );
}

pub fn approve(&mut self, spender: AccountHash, amount: U256, sender: Sender) {
    self.call(
        sender,
        "approve",
        runtime_args! {
            "spender" => spender,
            "amount" => amount
        },
    );
}

pub fn transfer_from(
    &mut self,
    owner: AccountHash,
    recipient: AccountHash,
    amount: U256,
    sender: Sender,
) {
    self.call(
        sender,
        "transfer_from",
        runtime_args! {
            "owner" => owner,
            "recipient" => recipient,
            "amount" => amount
        },
    );
}
```

## Creating Unit Tests {#creating-unit-tests}

Now that we have a testing context, we can use it to create unit tests in the file called `tests/src/tests.rs`. The unit tests verify the contract code by invoking the functions defined in `tests/src/erc20.rs`.

```rust
// File tests/src/tests.rs

use crate::erc20::{token_cfg, Sender, Token};

#[test]
fn test_erc20_deploy() {
    let t = Token::deployed();
    assert_eq!(t.name(), token_cfg::NAME);
    assert_eq!(t.symbol(), token_cfg::SYMBOL);
    assert_eq!(t.decimals(), token_cfg::DECIMALS);
    assert_eq!(t.balance_of(t.ali), token_cfg::total_supply());
    assert_eq!(t.balance_of(t.bob), 0.into());
    assert_eq!(t.allowance(t.ali, t.ali), 0.into());
    assert_eq!(t.allowance(t.ali, t.bob), 0.into());
    assert_eq!(t.allowance(t.bob, t.ali), 0.into());
    assert_eq!(t.allowance(t.bob, t.bob), 0.into());
}

#[test]
fn test_erc20_transfer() {
    let amount = 10.into();
    let mut t = Token::deployed();
    t.transfer(t.bob, amount, Sender(t.ali));
    assert_eq!(t.balance_of(t.ali), token_cfg::total_supply() - amount);
    assert_eq!(t.balance_of(t.bob), amount);
}

#[test]
#[should_panic]
fn test_erc20_transfer_too_much() {
    let amount = 1.into();
    let mut t = Token::deployed();
    t.transfer(t.ali, amount, Sender(t.bob));
}

#[test]
fn test_erc20_approve() {
    let amount = 10.into();
    let mut t = Token::deployed();
    t.approve(t.bob, amount, Sender(t.ali));
    assert_eq!(t.balance_of(t.ali), token_cfg::total_supply());
    assert_eq!(t.balance_of(t.bob), 0.into());
    assert_eq!(t.allowance(t.ali, t.bob), amount);
    assert_eq!(t.allowance(t.bob, t.ali), 0.into());
}

#[test]
fn test_erc20_transfer_from() {
    let allowance = 10.into();
    let amount = 3.into();
    let mut t = Token::deployed();
    t.approve(t.bob, allowance, Sender(t.ali));
    t.transfer_from(t.ali, t.joe, amount, Sender(t.bob));
    assert_eq!(t.balance_of(t.ali), token_cfg::total_supply() - amount);
    assert_eq!(t.balance_of(t.bob), 0.into());
    assert_eq!(t.balance_of(t.joe), amount);
    assert_eq!(t.allowance(t.ali, t.bob), allowance - amount);
}

#[test]
#[should_panic]
fn test_erc20_transfer_from_too_much() {
    let amount = token_cfg::total_supply().checked_add(1.into()).unwrap();
    let mut t = Token::deployed();
    t.transfer_from(t.ali, t.joe, amount, Sender(t.bob));
}
```

## Running the Tests {#running-the-tests}

Next, we configure the `lib.rs` file to run everything via the _make test_ command. Within the `tests/src/lib.rs` file, we added the following lines:

```rust
#[cfg(test)]
pub mod tests;

#[cfg(test)]
pub mod erc20;
```

Next, let's run the tests:

```bash
$ make test
```

This example uses `bash`. If you are using a Rust IDE, you need to configure it to run the tests.
