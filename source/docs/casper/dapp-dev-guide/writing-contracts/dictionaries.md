# Reading and Writing to Dictionaries

In a Casper network, you can now store sets of data under [`Keys`](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations). Previously, URefs were the exclusive means by which users could store data in global state. To maintain persistent access to these URefs, they would have to be stored within an `Account` or `Contract` context. In the case of Contracts, sustained and continuous use of URefs would result in the expansion of the associated `NamedKeys` structures.

Individual value changes to data stored within the NamedKeys would require deserializing the entire NamedKeys data structure, increasing gas costs over time and thus having a negative impact. Additionally, users storing large subsets of mapped data structures would face the same deep copy problem where minor or single updates required the complete deserialization of the map structure, also leading to increased gas costs.

As a solution to this problem, the Casper platform provides the `Dictionary` feature, which allows users a more efficient and scalable means to aggregate data over time.

In almost all cases, dictionaries are the better form of data storage. They allow greater flexibility in altering stored data at a lower cost. `NamedKeys` should be used mostly for access rights purposes.

## Seed URefs

Items within a dictionary exist as individual records stored underneath their unique [dictionary address](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) in global state. In other words, items associated with a specific dictionary share the same seed [`URef`](/design/casper-design.md/#uref-head) but are otherwise independent of each other. Dictionary items are not stored beneath this URef, it is only used to create the dictionary key.

As each dictionary item exists as a stand-alone entity in global state, regularly used dictionary keys may be used directly without referencing their seed URef.

## Understanding Dictionaries

Dictionaries are ideal for storing larger volumes of data for which `NamedKeys` would be less suitable.  

Creating a new dictionary is fairly simple and done within the context of a `Deploy` sent to a Casper network. The associated code is included within the [`casper_contract`](https://docs.rs/casper-contract/latest/casper_contract/) crate. Creating a dictionary also stores the associated seed URef within the named keys of the current context.

Developers should always consider context when creating dictionaries. We recommend creating a dictionary within the context of a Contract.

While you can create a dictionary in the context of an Account and then pass associated access rights to a Contract, this approach can create potential security issues. If a third party uses the Contract, the initiating Account with access rights to the dictionary may be undesirable. To rectify this, you may send an additional `Deploy` removing those access rights, but it is better to create the dictionary within the context of the Contract.

:::note

Creating dictionaries in the context of an Account represents a potential security risk. We suggest that you do not create dictionaries in your Account's context.

:::

Dictionaries allow a contract to store additional data without drastically expanding the size of the `NamedKeys` within their context. If a contract's `NamedKeys` expand too far, they may run into system limitations that would unintentionally disable the contract's functionality.

A dictionary item key can be no longer than 64 bytes in length. 

## Practical Dictionary Examples

The [Casper CEP-78 Enhanced NFT Standard](https://github.com/casper-ecosystem/cep-78-enhanced-nft) includes several practical applications of dictionaries.

Simple examples for dictionary use within CEP-78 include the [`BURNT_TOKEN`](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/contract/src/main.rs#L669) dictionary, which keeps a running list of all tokens within the collection that have been burnt.

More advanced dictionary functionality can be found in the [CEP-78 Page System](https://github.com/casper-ecosystem/cep-78-enhanced-nft#the-cep-78-page-system), which uses a series of dictionaries to keep track of token ownership. These dictionaries form the basis of the reverse lookup mode, which allows users to easily view a list of owned tokens by account or contract.

## Creating Dictionaries in a Contract's Context

The following code snippet shows the most basic example of creating a dictionary. 

```rust

casper_contract::contract_api::storage::new_dictionary(dict_name)

```

The following example includes the creation of a dictionary `"ledger"` within a contract's context. In this instance, the dictionary will be used to track donations made to a fundraising purse also created by the `init` entry point. In any case where you want to use a dictionary within your contract, it should be set up within the initializing entry point.

```rust

#[no_mangle]
pub extern "C" fn init() {
    let fundraising_purse = system::create_purse();
    runtime::put_key("fundraising_purse", fundraising_purse.into());
    // Create a dictionary to track the mapping of account hashes to number of donations made.
    storage::new_dictionary("ledger").unwrap_or_revert();
}

```

## Writing Entries into a Dictionary

After the creation of a dictionary, you may then add entries through the use of the following code:

```rust

storage::dictionary_put(dictionary_uref, &dictionary_item_key, value);

```

The `dictionary_uref` refers to the seed URef established during the dictionary creation process. The `key` is the unique identifier for this dictionary item, and the `value` is the data to be stored within the dictionary.

As stated above, these dictionary items do not require the seed URef, and they exist as individual keys in global state. If you know an individual key's address, you do not need to go through the process of identifying the seed URef first.

The following function serves to add an entry to the dictionary. If the item already exists, the entry point will update the value stored and referenced by that key. In this case, the code is storing the number of donations made. Any Rust structure may be stored under a dictionary item, but when updating a value within a larger structure (i.e., a list), the entire structure will be overwritten as part of the update. Updating a larger structure will incur the full cost of writing the structure to a dictionary item.

The first section acquiring the `LEDGER` seed URef to assign the new dictionary item to the proper dictionary.

```rust

fn update_ledger_record(dictionary_item_key: String) {
    // Acquiring the LEDGER seed URef to properly assign the dictionary item.
    let ledger_seed_uref = *runtime::get_key("ledger")
        .unwrap_or_revert_with(FundRaisingError::MissingLedgerSeedURef)
        .as_uref()
        .unwrap_or_revert();

```

The second section uses [`dictionary_get`](https://docs.rs/casper-contract/1.4.4/casper_contract/contract_api/storage/fn.dictionary_get.html) to read an entry within the `LEDGER` dictionary. If the entry does not exist on global state, it will create the entry. If it already exists, the entry is updated with the current value using a [`dictionary_put`](https://docs.rs/casper-contract/1.4.4/casper_contract/contract_api/storage/fn.dictionary_put.html) operation. As stated above, regardless of the size of the change within the entry, the entire dictionary entry will need to be overwritten and will incur the associated cost.

```rust

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

## Reading Items from a Dictionary using the JSON-RPC

The Casper platform provides several means of looking up a dictionary item. These means are explained within the [`DictionaryIdentifier`](/dapp-dev-guide/sdkspec/types_chain/#dictionaryidentifier) JSON-RPC type. The following explains how to query the dictionary items using the [Casper client](https://crates.io/crates/casper-client).

### `ContractNamedKey` lookup via a Contract's named keys.

Reading a dictionary item using the Contract's `NamedKeys` requires the following parameters:

* `Node Address` - The IP and port of a node on a Casper network. In the example below, the node address is pointing to a local NCTL network.

* `State Root Hash` - The current state root hash of the Casper network hosting the dictionary item you are attempting to read.

* `Contract Hash` - The hash of the contract that references the dictionary in its `NamedKeys`.

* `Dictionary Name` - The name of the dictionary as a `String` stored in the Contract's `NamedKeys`.

* `Dictionary Item Key` - The specific dictionary item key to be read, as a `String`.

```

casper-client get-dictionary-item \
    --node-address http://localhost:11101 \
    --state-root-hash 50c34ccbe1315d58ce22bf7518071164d16acd20a1becb0b423293418297416d \
    --contract-hash hash-09c8fa7c1441ae7c1cbe27ae3a722fd4ffc5290315f8546454454c1b9f85c842 \
    --dictionary-name <String> \
    --dictionary-item-key <String>

```

### `URef` lookup via the dictionary's seed URef.

Reading a dictionary item using the dictionary's seed URef requires the `Node Address`, `State Root Hash` and `Dictionary Item Key` as above. However, it does not require the `Contract Hash` or `Dictionary Name`. Instead, it requires:

* `Seed URef` - The [Seed URef](#seed-urefs) of the dictionary to reference.

```

casper-client get-dictionary-item \
    --node-address http://localhost:11101 \
    --state-root-hash 50c34ccbe1315d58ce22bf7518071164d16acd20a1becb0b423293418297416d \
    --dictionary-item-key <String> \
    --seed-uref uref-90b4a8d936b881d3b45b73a102adb2b652181d75c76b7547ae9d1bb213f8db6b-007

```

### `Dictionary` lookup via the unique dictionary item key.

In the event that you know the `dictionary address` of the dictionary item key you need to read, you can read it directly using the following Casper client command.

```

casper-client get-dictionary-item \
    --node-address http://localhost:11101 \
    --state-root-hash 50c34ccbe1315d58ce22bf7518071164d16acd20a1becb0b423293418297416d \
    --dictionary-address dictionary-<string>

```