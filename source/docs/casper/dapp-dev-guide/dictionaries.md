# Understanding Dictionaries

In a Caper network, you can now store sets of data under [`Keys`](../../dapp-dev-guide/understanding-hash-types#hash-and-key-explanations). Previously, URefs were the exclusive means by which users could store data in global state. To maintain persistent access to these URefs, they would have to be stored within an `Account` or `Contract` context. In the case of Contracts, sustained and continuous use of URefs would result in the expansion of the associated `NamedKeys` structures.

Individual value changes to data stored within the NamedKeys would require deserializing the entire NamedKeys data structure, increasing gas costs over time and thus having a negative impact. Additionally, users storing large subsets of mapped data structures would face the same deep copy problem where minor or single updates required the complete deserialization of the map structure, also leading to increased gas costs.

As a solution to this problem, the Casper platform provides the `Dictionary` feature, which allows users a more efficient and scalable means to aggregate data over time.

## Seed URefs

Items within a dictionary exist as individual records stored underneath their unique [dictionary address](../../dapp-dev-guide/understanding-hash-types#hash-and-key-explanations), or seed URef, in global state. In other words, items associated with a specific dictionary share the same seed [`URef`](../../design/uref) but are otherwise independent of each other. Dictionary items are not stored beneath this URef, it is only used to create the dictionary key.

As each dictionary item exists as a stand-alone entity on global state, regularly used dictionary keys may be used directly without referencing their seed URef.

## Creating Dictionaries

Dictionaries are ideal for storing larger volumes of data that `NamedKeys` would be less suitable for.  

Creating a new dictionary is fairly simple and done within the context of a `Deploy` sent to a Casper network. The associated code is included within the [`casper_contract`](https://docs.rs/casper-contract/latest/casper_contract/) crate. Creating a dictionary also stores the associated seed URef within the named keys of the current context.

:::note

Developers should consider context when creating dictionaries. While you can create a dictionary in the context of an Account and then pass associated access rights to a Contract, it can create potential security issues. If the Contract is intended for third-party use, the initiating Account that has access rights to the dictionary may be viewed as undesirable. You may send an additional `Deploy` removing those access rights, but it is better to simply create the dictionary within the context of the Contract.

:::

The following code snippet shows the most basic example of creating a dictionary. 

```rust

casper_contract::contract_api::storage::new_dictionary(dict_name)

```

The following example includes the creation of a dictionary known as `LEDGER` within a contract's function. In this instance, the dictionary will be used to track donations made to a fundraising purse also created by the `init` function.

```rust

#[no_mangle]
pub extern "C" fn init() {
    let fundraising_purse = system::create_purse();
    runtime::put_key(FUNDRAISING_PURSE, fundraising_purse.into());
    // Create a dictionary track the mapping of account hashes to number of donations made.
    storage::new_dictionary(LEDGER).unwrap_or_revert();
}

```

## Writing Entries into a Dictionary

After the creation of a dictionary, you may then add entries through the use of the following code:

```rust

storage::dictionary_put(dictionary_uref, key, value);

```

The `dictionary_uref` refers to the seed URef established during the creation process, the `key` is the unique identifier for this dictionary item and the `value` is the data to be stored within the dictionary item.

As stated above, these dictionary items do not require the seed URef to reference and exist as individual keys on global state. If you know the dictionary key's address, you do not need to go through the process of identifying the seed URef first.

The following function serves to add an entry to the dictionary. If the item already exists, it will update the value stored within the item key. In this case, it is storing the number of donations made.


```rust

fn update_ledger_record(dictionary_item_key: String) {
    // Acquiring the LEDGER seed URef to properly assign the dictionary item.
    let ledger_seed_uref = *runtime::get_key(LEDGER)
        .unwrap_or_revert_with(FundRaisingError::MissingLedgerSeedURef)
        .as_uref()
        .unwrap_or_revert();

    // This identifies an item within the dictionary and either creates or updates the associated value.
    match storage::dictionary_get::<u64>(ledger_seed_uref, &dictionary_item_key).unwrap_or_revert()
    {
        None => storage::dictionary_put(ledger_seed_uref, &dictionary_item_key, 1u64),
        Some(current_number_of_donations) => storage::dictionary_put(
            ledger_seed_uref,
            &dictionary_item_key,
            current_number_of_donations + 1u64,
        ),
    }
}

```

## Accessing a Dictionary Item

The Casper platform allows for four means of looking up a dictionary item. These means are explained within the [`DictionaryIdentifier`](../../dapp-dev-guide/sdkspec/types_chain/#dictionaryidentifier) JSON-RPC type. In brief, they consist of:

* `AccountNamedKey` Lookup via an Account's named keys.

* `ContractNamedKey` Lookup via a Contract's named keys.

* `URef` Lookup via the dictionary's seed URef.

* `Dictionary` Lookup via the unique dictionary item key.
