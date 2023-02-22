# Calling Contracts

Calling a contract on a Casper network requires the use of a deploy. When using the Casper Rust client, JavaScript SDK, or any other client, the intermediary client crafts the deploy for you, using the arguments you provide. This document outlines the various deploy variants through which you can execute Wasm or invoke the execution of on-chain Wasm.

## Using Deploy Variants

### ModuleBytes

`ModuleBytes` is a deploy variant that allows you to pass opaque Wasm bytes to a network. This variant is used to install a contract on the chain or execute Wasm.

However, you can also use `ModuleBytes` to deploy session code that calls a contract.

Further information on the structure of `ModuleBytes` can be found in [here](../sdkspec/types_chain.md#modulebytes).

### StoredContractByHash

`StoredContractByHash` is a deploy variant that invokes on-chain Wasm by specifying the contract hash and an entry point within the contract. When you don't need to send additional Wasm, you can use this deploy variant to invoke on-chain Wasm. It accepts any runtime arguments necessary for the entry point in question.

While there is no Wasm associated with this variant, it is still a deploy sent to a node that invokes an installed contract.

Further information on the structure of `StoredContractByHash` can be found [here](../sdkspec/types_chain.md#storedcontractbyhash).

### StoredContractByName

`StoredContractByName` is similar to `StoredContractByHash`, with the main difference being the reference used to invoke on-chain Wasm. Where `StoredContractByHash` requires the contract hash, `StoredContractByName` uses a string stored as a [`NamedKey`](../sdkspec/types_chain.md#namedkey) in the caller's account.

This allows the caller to more easily reference a contract stored on-chain for later use but requires pre-planning to store the name within their account's `NamedKeys`.

### StoredVersionedContractByHash

`StoredVersionedContractByHash` is a deploy variant that invokes on-chain Wasm based on the contract package hash rather than the contract hash directly. This variant allows the caller to specify a version within the contract package, but if a specific version is not supplied, it will use the most recent version of the contract within the package.

This makes `StoredVersionedContractByHash` more stable than `StoredContractByHash`, as any caller will be directed to the most recent version of the internal contract without needing to specify the hash of that specific contract. Callers that regularly interact with a contract that they know will be upgraded can use this variant to ensure they are always using the most up-to-date version.

DApp developers that use contracts developed by other parties can use `StoredVersionedContractByHash` to avoid interruptions from contract version changes.

Further information on the structure of `StoredVersionedContractByHash` can be found [here](../sdkspec/types_chain.md#storedversioncontractbyhash).

### StoredVersionedContractByName

`StoredVersionedContractByName` combines the functionality of `StoredContractByName` and `StoredVersionedContractByHash`. It allows a developer to store a reference string as a `NamedKey` within their account context that references a contract by its contract package hash.

Further information on the structure of `StoredVersionedContractByName` can be found [here](../sdkspec/types_chain.md#storedversioncontractbyname).

### Transfer

Native `Transfer`s are Wasmless transfers on a Casper network. This is how most transfers take place, albeit through a system like the Rust client that crafts the associated deploy and sends it to the network.

Further information on the structure of a native `Transfer` can be found [here](../sdkspec/types_chain.md#transfer).
