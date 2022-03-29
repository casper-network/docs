# Appendix {#appendix-head}

## A - Casper Rust Library {#appendix-a}

Casper provides low-level bindings for host-side ("external") functions for developers creating smart contracts in other programming languages. Developers can import these functions into a wasm module used as a contract on the Casper Network. Thus, the contract will have access to features specific to the Casper platform which are not supported by general wasm instructions (e.g., accessing the global state, creating new `URef`s). These are defined and automatically imported if the [Casper Rust library](https://crates.io/crates/casper-contract) is used to develop the contract. For an up-to-date description of exported functions, please visit the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/index.html) crate documentation.

## B - Serialization Format {#appendix-b}

The Casper serialization format is used to transfer data between wasm and the Casper host runtime. It is also used to persist global-state data in the Merkle trie. The definition of this format is described in the [global state](./global-state.md#global-state-head) section.

A Rust reference implementation for those implementing this specification in another programming language can be found here:

-   [bytesrepr](https://docs.rs/casper-types/latest/casper_types/bytesrepr/index.html)
-   [cl_value.rs](https://docs.rs/casper-types/latest/src/casper_types/cl_value.rs.html)
-   [account](https://docs.rs/casper-types/latest/casper_types/account/index.html)
-   [contract](https://docs.rs/casper-types/latest/casper_types/contracts/struct.Contract.html)
-   [uint.rs](https://docs.rs/casper-types/latest/src/casper_types/uint.rs.html)

Additionally, examples of all data types and their serializations are found in the [GitHub code base](https://github.com/casper-network/casper-node/blob/553b9f11eb3b1e8043acfe3fa04005d951047c4a/types/src/bytesrepr.rs#L26). These examples include a set of useful [serialization tests](https://github.com/casper-network/casper-node/blob/553b9f11eb3b1e8043acfe3fa04005d951047c4a/types/src/bytesrepr.rs#L1189).