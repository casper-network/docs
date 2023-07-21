---
title: Storage Workflow
---


# Reading and Writing to Global State using Rust

The following examples outline methods to read and write data to global state on a Casper network using the Rust programming language.

Essentially, there are three means of storage within the Casper ecosystem. These consist of `runtime::put_key`, `storage::write`(alongside `storage::new_uref` as explained below) and `storage::dictionary_put`. These stored values can be read using `runtime::get_key`, `storage::read` and `storage::dictionary_get`, respectively. Each method stores data in a specific way, and it's important to understand the differences.

## Description of Functions

### `runtime::put_key` / `runtime::get_key`

Both the [`put_key`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.put_key.html) and [`get_key`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.get_key.html) functions refer to Casper `Key` types as outlined in both the [Understanding Hash Types](../../concepts/serialization-standard.md#serialization-standard-state-keys) and [Serialization Standard](../../concepts/serialization-standard.md#serialization-standard-state-keys). These keys are stored within a URef as a `Key` type.

### `storage::write` / `storage::read`

[`storage::write`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.write.html) writes a given value to a previously established URef (created using [`storage::new_uref`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_uref.html)). Unlike `put_key`, this value is not one of the `Key` types listed above, but rather any of the potential [`CLType`](https://docs.casperlabs.io/developers/json-rpc/types_cl/#cltype)s as outlined. [`storage::read`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.read.html) provides a method to retrieve these values from the associated URef.

### `storage:dictionary_put` / `storage::dictionary_get`

For most data storage needs on a Casper network, dictionaries are more efficient and provide lower gas costs than `NamedKeys`. Each dictionary item exists independently, sharing a single dictionary seed URef for reference purposes.

More information on dictionaries can be found on the [Reading and Writing to Dictionaries](../../concepts/dictionaries.md) page.

## Example Code

### Example of `put_key` and `storage::write`

This sample code creates a new contract and stores the contract hash in global state using the `runtime::put_key` function.

Once the stored value has been initialized, the `storage::write` function overwrites the existing value with `true`. The URef is then stored in the current context as a `NamedKey` titled `MY_STORED_VALUE_UREF`.

```rust

    // Store contract hash under a Named key CONTRACT_HASH
    runtime::put_key(CONTRACT_HASH, contract_hash.into());

    // Store !MY_STORED_VALUE (false) as init value/type into a new URef
    let my_value_uref = storage::new_uref(!MY_STORED_VALUE);

    // Store MY_STORED_VALUE (true) under the URef value
    storage::write(my_value_uref, MY_STORED_VALUE);

    // Store the Uref under a Named key MY_STORED_VALUE_UREF
    let my_value_key: Key = my_value_uref.into();
    runtime::put_key(MY_STORED_VALUE_UREF, my_value_key);
}

```

### Example of `get_key` and `storage::read`

This example compliments the code sample above by retrieving the `CONTRACT_HASH` using the `get_key` function, before comparing a provided runtime argument `ARG_MY_STORED_VALUE` against the previously stored `MY_STORED_VALUE_UREF` using `storage::read`.

```rust

    let my_stored_value_uref: URef = runtime::get_key(MY_STORED_VALUE_UREF)
        .unwrap_or_revert()
        .into_uref()
        .map(|uref| URef::new(uref.addr(), AccessRights::default()))
        .unwrap_or_revert()
        .into_read();

    let my_actual_stored_value: bool = storage::read(my_stored_value_uref).unwrap().unwrap();

    // Compare my stored value with runtime arg
    let my_expected_stored_value: bool = runtime::get_named_arg(ARG_MY_STORED_VALUE);
    if my_actual_stored_value != my_expected_stored_value {
        // We revert if my stored value is not what is expected from caller argument
        runtime::revert(UserError::StoredValueError);
    }

    runtime::print(&my_actual_stored_value.to_string());
}

```

### Example of `dictionary_put` and `dictionary_get`

Examples of dictionary usage for storage can be found in the *Writing Entries into a Dictionary* section of [Reading and Writing to Dictionaries](../../concepts/dictionaries.md#writing-entries-into-a-dictionary).

## Additional Functions for Named Keys

The following functions might also be of interest for working with named keys:

* [list_named_keys](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.list_named_keys.html) - Returns the named keys of the current context
* [has_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.has_key.html) - Returns true if the key exists in the current context’s named keys
* [remove_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.remove_key.html) - Removes the requested `NamedKey` from the current context