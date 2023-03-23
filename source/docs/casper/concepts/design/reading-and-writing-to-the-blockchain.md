# Reading and Writing Data to the Blockchain

Casper features several means of reading and writing data to global state, depending on user needs and complexity. Reading data from global state can be done by dApps off-chain or by smart contracts on-chain. Writing data requires on-chain interactions due to the nature of the system. Storage in global state can be accomplished using [Dictionaries](../dictionaries.md) or [`NamedKeys`](../../developers/json-rpc/types_chain.md#namedkey).

:::note

Due to the nature of Casper's serialization standard, `NamedKeys` should be used sparingly and only for small data sets. Developers should use dictionaries for larger mapped structures.

:::

## Using the Casper JSON-RPC

The [`query_global_state`](../../developers/json-rpc/json-rpc-informational.md#query-global-state) method available through the JSON-RPC allows users to read data from global state without performing on-chain actions. For more details, see the [Querying a Casper Network](../../resources/tutorials/beginner/querying-network.md) tutorial.

## Using the Casper Rust API

The Casper API includes the following functions for reading and writing to global state:

* [put_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.put_key.html) - Stores the given `Key` under the given `name` in the current context's named keys
* [get_key](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.get_key.html) - Returns the requested `NamedKey` from the current context
* [dictionary_put](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_put.html) - Writes the given value under the given `dictionary_item_key`
* [dictionary_get](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_get.html) - Retrieves the value stored under a `dictionary_item_key`

For more details, see the [Reading and Writing to Global State using Rust](../../resources/tutorials/advanced/storage-workflow.md) tutorial.