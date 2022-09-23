# Calling Contracts

Calling a contract on a Casper network requires the use of a deploy. When using the Casper Rust client or JavaScript SDK, the intermediary client crafts the deploy for you, using the arguments that you provide. However, this is not required and you are free to craft your own deploys using other systems. This document outlines the various methods through which you can call a contract using an `ExecutableDeployItem` on the Casper platform.

## Using Executable Deploy Items

### ModuleBytes

`ModuleBytes` is a deploy variant that allows you to pass raw Wasm to a network. This is the only method through which you can install a contract or store Wasm on chain. 

However, you can also use `ModuleBytes` to deploy session code that calls a contract. The session code must be crafted as raw Wasm to pass through as the `bytes` argument.

Further information on the structure of `ModuleBytes` can be found in [here](/dapp-dev-guide/sdkspec/types_chain/#modulebytes).

### StoredContractByHash

`StoredContractByHash` is a deploy variant that calls a contract by specifying the contract hash and an entry point within the contract. It also accepts any runtime arguments necessary for the entry point in question.

Calling a contract through the Rust client or JavaScript SDK crafts a deploy using the `StoredContractByHash` variant alongside the entry point and provided runtime arguments. While there is no Wasm associated with this variant, it is still a deploy sent to a node that invokes an installed contract.

The only difference between a `ModuleBytes` and a `StoredContractByHash` deploy, when they arrive on chain, is the series of validity checks that occur within the deploy acceptor.

Further information on the structure of `StoredContractByHash` can be found [here](/dapp-dev-guide/sdkspec/types_chain/#storedcontractbyhash).

### StoredContractByName

`StoredContractByName` is similar to `StoredContractByHash`, with the main difference being the reference used to call the contract. Where `StoredContractByHash` requires the contract hash, `StoredContractByName` uses a string stored as a [`NamedKey`](dapp-dev-guide/sdkspec/types_chain/#namedkey) in the caller's account.

This allows the caller to more easily reference a contract stored on chain for later use, but requires pre-planning to store the name within their account's `NamedKeys`.

### StoredVersionedContractByHash

`StoredVersionedContractByHash` is a deploy variant that calls a contract based on the contract package hash, rather than the contract hash directly. This variant allows the caller to specify a version within the contract package, but if a specific version is not supplied it will use the most recent version of the contract within the package.

This makes `StoredVersionedContractByHash` more stable in relation to `StoredContractByHash`, as any caller will be directed to the most recent version of the internal contract without needing to specify the specific hash of that contract. Callers that regularly interact with a contract that they know will be upgraded can use this variant to ensure they are always using the most up to date version.

DApp developers that use contracts developed by other parties can use `StoredVersionedContractByHash` to avoid interruptions from contract version changes.

Further information on the structure of `StoredVersionedContractByHash` can be found [here](/dapp-dev-guide/sdkspec/types_chain/#storedversioncontractbyhash).

### StoredVersionedContractByName

`StoredVersionedContractByName` combines the functionality of `StoredContractByName` and `StoredVersionedContractByHash`. It allows a developer to store a a reference string as a `NamedKey` within their account context that references a contract by its contract package hash.

Further information on the structure of `StoredVersionedContractByName` can be found [here](/dapp-dev-guide/sdkspec/types_chain/#storedversioncontractbyname).

### Transfer

Native `Transfer`s are a Wasmless transfer on a Casper network. This is how most transfers take place, albeit through a system like the Rust client that crafts the associated deploy and sends it to the network.

Further information on the structure of a native `Transfer` can be found [here](/dapp-dev-guide/sdkspec/types_chain/#transfer).