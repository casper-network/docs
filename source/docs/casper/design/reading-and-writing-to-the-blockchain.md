# Reading and Writing Data to the Blockchain

Casper features several means of reading and writing data to global state, depending on user needs and complexity. Reading data from global state can be done off-chain or on-chain. Writing data requires on-chain interactions, due to the nature of the system.

Storage on global state can be accomplished with [`NamedKeys`](/dapp-dev-guide/sdkspec/types_chain/#namedkey), a form of [`URef`](/design/casper-design.md/#uref-head/) or through the [use of dictionaries](/dapp-dev-guide/writing-contracts/dictionaries.md).

Due to the nature of Casper's serialization standard, `NamedKeys` should be used sparingly for smaller subsets of data. Developers should use dictionaries for larger subsets of mapped structures.

## Casper JSON-RPC

The [`query_global_state`](/dapp-dev-guide/sdkspec/json-rpc-informational/#query-global-state) method available through the JSON-RPC allows users to read data from global state without performing on-chain actions.

## Casper API

The Casper API includes the following for reading and writing to global state:

* [`get_key`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.get_key.html)

    Returns the requested `NamedKey` from the current context.

* [`put_key`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.put_key.html)

    Stores the given `Key` under the given `name` in the current context's named keys.

* [`dictionary_get`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_get.html)

    Retrieves the value stored under a `dictionary_item_key`.

* [`dictionary_put`](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_put.html)

    Writes the given value under the given `dictionary_item_key`.
