## Getting Started with the DSL

Since the DSL uses macros, it works like templates in the smart contract, so it's necessary to tell the Rust compiler where the macros are located for each smart contract. The aim of this guide is to describe how to configure the smart contract to use the DSL.

About the DSL

The DSL is designed specifically for Rust Smart Contrats.

-   The `constructor_macro` creates the code that sets up the contract in the runtime and locates the contract in the runtime when execution begins (this is the deploy function that creates the entry point & stores the deploy hash stored under some function name in the runtime). Think of the function templated by the constructor macro as your `main` function, while the contract macro sets up the function definitions within the calls.
-   The `contract_macro` generates the code for the headers for each of the entry points that use it.
-   The `casperlabs_method` creates an entry point for any function in your contract.

Pre-Requisites - Set up the Rust SDK

Please use the Rust SDK to [create your smart contract project](https://docs.casperlabs.io/en/latest/dapp-dev-guide/setup-of-rust-contract-sdk.html) before setting up the DSL.

Getting the Macros

To import the macros, include a line in the `Cargo.toml` file in the `/contract` folder for your smart contract. The entry needs to appear in the\ `[dependencies]` section. This entry will import the macros into your project. There are a few sources for the macros.

From Crates.io

To use the crate available on [crates.io](https://crates.io/crates/casperlabs_contract_macro) include the following entry in the `Cargo.toml` file for the smart contract.

.. code-block::

contract_macro = { package = "casperlabs_contract_macro", version = "0.1.0" }

Local package

This example `Cargo.toml` entry uses a local path for the macros:

.. code-block::

contract_macro = { path = "../../casperlabs-node/smart_contracts/contract_macro" }

Using the DSL

To use the DSL, simply add the following line to the `use` section of the contract.

.. code-block:: rust

use contract_macro::{casperlabs_constructor, casperlabs_contract, casperlabs_method};

This line can go after the last `use` line in the blank contract created by `cargo-casperlabs`.

Remember, if you are using the crates.io package, you may have to use the package as `casperlabs_contract_macro`. This depends entirely on how you import the package in your `Cargo.toml` file

Example Counter Contract

```

The following contract creates a counter in storage. Each time the contract is invoked, the counter is incremented by 1.

.. code-block:: rust

   extern crate alloc;
   use alloc::{collections::BTreeSet, string::String};

   // import casperlabs contract api
   use contract::{
       contract_api::{runtime, storage},
       unwrap_or_revert::UnwrapOrRevert,
   };
   // import the contract macros
   use contract_macro::{casperlabs_constructor, casperlabs_contract, casperlabs_method};
   use std::convert::TryInto;

   // import casperlabs types
   use types::{
       bytesrepr::{FromBytes, ToBytes},
       contracts::{EntryPoint, EntryPointAccess, EntryPointType, EntryPoints},
       runtime_args, CLType, CLTyped, Group, Key, Parameter, RuntimeArgs, URef,
   };

   const KEY: &str = "special_value";

   // macro to set up the contract

   #[casperlabs_contract]
   mod tutorial {
       use super::*;

   // constructor macro that sets up the methods, values and keys required for the contract.

       #[casperlabs_constructor]
       fn init_counter(initial_value: u64) {
           let value_ref: URef = storage::new_uref(initial_value);
           let value_key: Key = value_ref.into();
           runtime::put_key(KEY, value_key);
       }

   // method macro that defines a new entry point for the contract.

       #[casperlabs_method]
       fn update_counter() {
           let old_value: u64 = key(KEY).unwrap();
           let new_value = old_value + 1;
           set_key(KEY, new_value);
       }

   // method macro that defines a new entry point for the contract.

       #[casperlabs_method]
       fn get_counter_value() -> u64 {
           key(KEY).unwrap()
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
   }

Testing the Example Contract:
```

If you set up your contract using `cargo-casperlabs` you can test your contract using the local runtime.

Set up the runtime following the steps in the testing section of this guide to set up the runtime context.

The following test will check whether or not the tutorial contract is working properly:

.. code-block:: rust

#[cfg(test)] mod tests { use test_support::{Code, SessionBuilder, TestContextBuilder}; use types::{account::AccountHash, runtime_args, RuntimeArgs, U512};

       const MY_ACCOUNT: AccountHash = AccountHash::new([7u8; 32]);
       const KEY: &str = "special_value";
       const CONTRACT: &str = "tutorial";

       #[test]
       fn should_initialize_to_zero() {
           let mut context = TestContextBuilder::new()
               .with_account(MY_ACCOUNT, U512::from(128_000_000))
               .build();
           let session_code = Code::from("contract.wasm");
           let session_args = runtime_args! {
               "initial_value" => 0u64
           };
           let session = SessionBuilder::new(session_code, session_args)
               .with_address(MY_ACCOUNT)
               .with_authorization_keys(&[MY_ACCOUNT])
               .with_block_time(0)
               .build();
           context.run(session);
           let check: u64 = match context.query(MY_ACCOUNT, &[CONTRACT, KEY]) {
               Err(_) => panic!("Error"),
               Ok(maybe_value) => maybe_value
                   .into_t()
                   .unwrap_or_else(|_| panic!("{} is not expected type.", KEY)),
           };
           assert_eq!(0, check);
       }

}
