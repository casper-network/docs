# Advanced Options

Once the base logic of the smart contract is in place, it's desirable to optimize the contract for the blockchain. This will require digging into the actual code that the DSL generates. This section will describe the steps to do this. Once the code has been expanded and then changed, make sure to remove the macros from the project configuration before saving the changes.

## Debugging Contracts {#debugging-contracts}

It is possible to debug Rust contracts inside any IDE that supports breakpoints and watches. Make sure that the IDE supports Rust development and tools.

### Expanding the Code {#expanding-the-code}

When the rust compiler encounters each of the macros, it 'expands' the code and adds additional lines of code for each of the macros. The resultant expanded code is then compiled to the wasm which can then be deployed to the blockchain.

The `cargo expand` tool will run the macros and append the boilerplate code to the contract without compiling the code.

Install the tooling with the following command:

```
cargo install cargo-expand
```

Run this command in the folder containing the smart contract code:

```
cargo expand
```

### Example Simple Counter Contract {#example-simple-counter-contract}

Running `cargo-expand` on the simple counter contract yeilds this output:

```rust
#![feature(prelude_import)]
#[prelude_import]
use std::prelude::v1::*;
#[macro_use]
extern crate std;
extern crate alloc;
use alloc::{collections::BTreeSet, string::String};
use contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casperlabs_contract_macro::{casperlabs_constructor, casperlabs_contract, casperlabs_method};
use std::convert::TryInto;
use types::{
    CLValue,
    bytesrepr::{FromBytes, ToBytes},
    contracts::{EntryPoint, EntryPointAccess, EntryPointType, EntryPoints},
    runtime_args, CLType, CLTyped, Group, Key, Parameter, RuntimeArgs, URef,
};
const KEY: &str = "special_value";
fn __deploy(initial_value: u64) {
    let (contract_package_hash, _) = storage::create_contract_package_at_hash();
    let _constructor_access_uref: URef = storage::create_contract_user_group(
        contract_package_hash,
        "constructor",
        1,
        BTreeSet::new(),
    )
    .unwrap_or_revert()
    .pop()
    .unwrap_or_revert();
    let constructor_group = Group::new("constructor");
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        String::from("init_counter"),
        <[_]>::into_vec(box [Parameter::new("initial_value", CLType::U64)]),
        CLType::Unit,
        EntryPointAccess::Groups(<[_]>::into_vec(box [constructor_group])),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        String::from("update_counter"),
        ::alloc::vec::Vec::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        String::from("get_counter_value"),
        ::alloc::vec::Vec::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    let (contract_hash, _) =
        storage::add_contract_version(contract_package_hash, entry_points, Default::default());
    runtime::put_key("tutorial", contract_hash.into());
    let contract_hash_pack = storage::new_uref(contract_hash);
    runtime::put_key("tutorial_hash", contract_hash_pack.into());
    runtime::call_contract::<()>(contract_hash, "init_counter", {
        let mut named_args = RuntimeArgs::new();
        named_args.insert("initial_value", initial_value);
        named_args
    });
}
#[no_mangle]
fn call() {
    let initial_value: u64 = runtime::get_named_arg("initial_value");
    __deploy(initial_value)
}
fn __init_counter(initial_value: u64) {
    let value_ref: URef = storage::new_uref(initial_value);
    let value_key: Key = value_ref.into();
    runtime::put_key(KEY, value_key);
}
#[no_mangle]
fn init_counter() {
    let initial_value: u64 = runtime::get_named_arg("initial_value");
    __init_counter(initial_value)
}
fn __update_counter() {
    let old_value: u64 = key(KEY).unwrap();
    let new_value = old_value + 1;
    set_key(KEY, new_value);
}
#[no_mangle]
fn update_counter() {
    __update_counter();
}
fn __get_counter_value() -> u64 {
    key(KEY).unwrap()
}
#[no_mangle]
fn get_counter_value() {
    let val: u64 = __get_counter_value();
    ret(val)
}
fn key<T: FromBytes + CLTyped>(name: &str) -> Option<T> {
    match runtime::get_key(name) {
        None => None,
        Some(maybe_key) => {
            let key = maybe_key.try_into().unwrap_or_revert();
            let value = storage::read(key).unwrap_or_revert().unwrap_or_revert();
            Some(value)
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
fn ret<T: CLTyped + ToBytes>(value: T) {
    runtime::ret(CLValue::from_t(value).unwrap_or_revert())
}
```
