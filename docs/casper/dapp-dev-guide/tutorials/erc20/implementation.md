# ERC-20 Implementation

The ERC-20 standard is defined in [an Ethereum Improvement Proposal (EIP)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md). Read it carefully, as it defines the methods we have implemented:

-   [allowance](#the-total-supply-balance-of-and-allowance-functions)
-   [approve](#the-approve-and-transfer-from-functions)
-   [balance_of](#the-total-supply-balance-of-and-allowance-functions)
-   [decimals](#the-name-symbol-and-decimals-functions)
-   [name](#the-name-symbol-and-decimals-functions)
-   [symbol](#the-name-symbol-and-decimals-functions)
-   [total_supply](#the-total-supply-balance-of-and-allowance-functions)
-   [transfer](#the-transfer-function)
-   [transfer_from](#the-approve-and-transfer-from-functions)

## Cloning the Example Contract {#cloning-the-example-contract}

An example ERC-20 for Casper is located in [GitHub](https://github.com/casper-ecosystem/erc20).

## Installing the Required Crates {#installing-the-required-crates}

This is a Rust contract. In Rust, the keyword `use` is like an `include` statement in C/C++. Casper contracts require a few crates to be included. They are:

-   contract: The Casper contract API for runtime and storage
-   types: The Casper contract type system

```rust
use alloc::{
    collections::{BTreeMap, BTreeSet},
    string::String,
};
use core::convert::TryInto;

use contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use types::{
    account::AccountHash,
    bytesrepr::{FromBytes, ToBytes},
    contracts::{EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, NamedKeys},
    runtime_args, CLType, CLTyped, CLValue, Group, Parameter, RuntimeArgs, URef, U256,
};
```

## Initializing the Contract {#initializing-the-contract}

When the contract is deployed, it must be initialized with some values; this is done with the help of the `call()` function. The contract is initialized with a name, symbol, decimals, starting balances, and the starting token supply.

```rust
#[no_mangle]
pub extern "C" fn call() {
    let tokenName: String = runtime::get_named_arg("tokenName");
    let tokenSymbol: String = runtime::get_named_arg("tokenSymbol");
    let tokenTotalSupply: U256 = runtime::get_named_arg("tokenTotalSupply");

    ...

    let mut named_keys = NamedKeys::new();
    named_keys.insert("name".to_string(), storage::new_uref(tokenName).into());
    named_keys.insert("symbol".to_string(), storage::new_uref(tokenSymbol).into());
    named_keys.insert("decimals".to_string(), storage::new_uref(18u8).into());
    named_keys.insert(
        "total_supply".to_string(),
        storage::new_uref(tokenTotalSupply).into(),
    );
    named_keys.insert(
        balance_key(&runtime::get_caller()),
        storage::new_uref(tokenTotalSupply).into(),
    );

    let (contract_hash, _) =
        storage::new_locked_contract(entry_points, Some(named_keys), None, None);
    runtime::put_key("ERC20", contract_hash.into());
    runtime::put_key("ERC20_hash", storage::new_uref(contract_hash).into());
}
```

## The `name`, `symbol`, and `decimals` functions {#the-name-symbol-and-decimals-functions}

We then also add a few helper functions to set and retrieve values from the contract. Notice that these helper functions reference each of the `set_key` definitions when the contract is deployed; a generic `get_key` function to retrieve values is also used.

```rust
#[no_mangle]
pub extern "C" fn name() {
    let val: String = get_key("name");
    ret(val)
}

#[no_mangle]
pub extern "C" fn symbol() {
    let val: String = get_key("symbol");
    ret(val)
}

#[no_mangle]
pub extern "C" fn decimals() {
    let val: u8 = get_key("decimals");
    ret(val)
}
```

## The `total_supply`, `balance_of`, and `allowance` functions {#the-total_supply-balance_of-and-allowance-functions}

Let's explore the implementation of some key ERC-20 methods: `balance_of`, `total_supply`, and `allowance`.

The `allowance` method enables owners to specify an amount that a spender account can spend.

```rust
#[no_mangle]
pub extern "C" fn total_supply() {
    let val: U256 = get_key("total_supply");
    ret(val)
}

#[no_mangle]
pub extern "C" fn balance_of() {
    let account: AccountHash = runtime::get_named_arg("account");
    let val: U256 = get_key(&balance_key(&account));
    ret(val)
}

#[no_mangle]
pub extern "C" fn allowance() {
    let owner: AccountHash = runtime::get_named_arg("owner");
    let spender: AccountHash = runtime::get_named_arg("spender");
    let val: U256 = get_key(&allowance_key(&owner, &spender));
    ret(val)
}
```

## The `transfer` function {#the-transfer-function}

Here is the `transfer` method, which makes it possible to transfer tokens from the `sender` address to the `recipient` address. If the `sender` address has enough balance, then tokens should be transferred to the `recipient` address.

```rust
#[no_mangle]
 pub extern "C" fn transfer() {
     let recipient: AccountHash = runtime::get_named_arg("recipient");
     let amount: U256 = runtime::get_named_arg("amount");
     _transfer(runtime::get_caller(), recipient, amount);
 }

fn _transfer(sender: AccountHash, recipient: AccountHash, amount: U256) {
     let sender_key = balance_key(&sender);
     let recipient_key = balance_key(&recipient);
     let new_sender_balance: U256 = (get_key::<U256>(&sender_key) - amount);
     set_key(&sender_key, new_sender_balance);
     let new_recipient_balance: U256 = (get_key::<U256>(&recipient_key) + amount);
     set_key(&recipient_key, new_recipient_balance);
 }
```

## The `approve` and `transfer_from` functions {#the-approve-and-transfer_from-functions}

Here are the functions `approve` and `transfer_from`. `approve` is used to allow another address to spend tokens on one's behalf. This is used when multiple keys are authorized to perform deployments from an account.

```rust
#[no_mangle]
 pub extern "C" fn approve() {
     let spender: AccountHash = runtime::get_named_arg("spender");
     let amount: U256 = runtime::get_named_arg("amount");
     _approve(runtime::get_caller(), spender, amount);
 }

fn _approve(owner: AccountHash, spender: AccountHash, amount: U256) {
     set_key(&allowance_key(&owner, &spender), amount);
 }
```

`transfer_from` allows spending an approved amount of tokens.

```rust
#[no_mangle]
 pub extern "C" fn transfer_from() {
     let owner: AccountHash = runtime::get_named_arg("owner");
     let recipient: AccountHash = runtime::get_named_arg("recipient");
     let amount: U256 = runtime::get_named_arg("amount");
     _transfer_from(owner, recipient, amount);
 }

 fn _transfer_from(owner: AccountHash, recipient: AccountHash, amount: U256) {
     let key = allowance_key(&owner, &runtime::get_caller());
     _transfer(owner, recipient, amount);
     _approve(
         owner,
         runtime::get_caller(),
         (get_key::<U256>(&key) - amount),
     );
 }
```

## The `get_key` and `set_key` functions {#the-get_key-and-set_key-functions}

The `get_key` and `set_key` functions are generic Casper storage write and read methods. Implement these one time for the contract and then call them as needed.

```rust
fn get_key<T: FromBytes + CLTyped + Default>(name: &str) -> T {
    match runtime::get_key(name) {
        None => Default::default(),
        Some(value) => {
            let key = value.try_into().unwrap_or_revert();
            storage::read(key).unwrap_or_revert().unwrap_or_revert()
        }
    }
}

fn set_key<T: ToBytes + CLTyped>(name: &str, value: T) {
    match runtime::get_key(name) {
        Some(key) => {
            let key_ref = key.try_into().unwrap_or_revert();
            storage::write(key_ref, value);
        }
        None => {
            let key = storage::new_uref(value).into();
            runtime::put_key(name, key);
        }
    }
}
```

## Other Helper Functions {#other-helper-functions}

The `balance_key` and `allowance_key` functions format the balances and account information from their internal representation into strings.

```rust
fn balance_key(account: &AccountHash) -> String {
    format!("balances_{}", account)
}

fn allowance_key(owner: &AccountHash, sender: &AccountHash) -> String {
    format!("allowances_{}_{}", owner, sender)
}
```
