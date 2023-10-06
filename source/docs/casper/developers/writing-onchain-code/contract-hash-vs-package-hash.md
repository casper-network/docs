
---
title: Contract Hash vs. Package Hash
---

# Calling Contracts by Contract Hash vs. Package Hash

This page describes the advantages and disadvantages of using `contract_hash` vs. `contract_package_hash` when calling a contract.

When should a contract store or call a contract hash rather than a contract package hash? There are cases to use either `contract_package_hash` or `contract_hash` or both. There's no right or wrong option; like with most things, it depends on what you are trying to do.

A given contract might:
- Not need either hash for its use case
- Want to identify specific versions of contracts within the same package and thus use a `contract_hash`
- Not need specific contract versions and allow or block all versions in the same package, thus using the `contract_package_hash`
- Need specific contract versions within the same package, and thus use both `contract_hash` and `contract_package_hash`

A given contract, i.e., CEP-18, which wants to allow or block or track calls from other contracts, should then decide:
- will I allow, block, or track contract callers loosely at the package level?
- will I allow, block, or track contract callers specifically at the contract level?

Or a more fine-grained variation would be:
- will I allow or block at the package level but track by both package and contract hash?
- will I allow other combinations of these basic concepts?

Such a contract is responsible for documenting its choices and what it requires of its callers. It is essential to keep in mind the difference between the behavior of the host, which in this case is the Casper network execution engine (the host), as exposed by the [Casper External FFI](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/), versus use cases and interactions between two or more ecosystem entities such as accounts and contracts.

The execution engine doesn't know how a contract such as CEP-18 is trying to manage its internal data or its exposed functionality. The contract is responsible for creating and managing a sub-ledger of resource management, access control, etc.

## The Casper Call Stack

When identifying who called a contract or initiated a call chain, the execution engine offers the FFI method [casper_load_call_stack](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/fn.casper_load_call_stack.html), which provides a stack of one or more entries of this kind:

```rust
/// Represents the origin of a sub-call.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum CallStackElement {
    /// Session
    Session {
        /// The account hash of the caller
        account_hash: AccountHash,
    },
    /// Effectively an EntryPointType::Session - stored access to a session.
    StoredSession {
        /// The account hash of the caller
        account_hash: AccountHash,
        /// The contract package hash
        contract_package_hash: ContractPackageHash,
        /// The contract hash
        contract_hash: ContractHash,
    },
    /// contract
    StoredContract {
        /// The contract package hash
        contract_package_hash: ContractPackageHash,
        /// The contract hash
        contract_hash: ContractHash,
    },
}
```

You can find the source code [here](https://github.com/casper-network/casper-node/blob/release-1.5.1/types/src/system/call_stack_element.rs).

After retrieving the required information, the contract must manage its internal logic and data storage, actions that are entirely opaque to the execution engine (the host).

Learn more about [Call Stacks](../../concepts/callstack.md) and how Casper manages the calling of a contract. 

## Recommendations

Consider the following questions when designing the contract and choosing whether to store and use the contract hash or contract package hash. This section summarizes each case's recommendations, advantages, and disadvantages.

Will you allow only accounts to use the contract? If so, what kind of accounts are you considering?
- Any accounts?
- Specific accounts?
- Exactly one specific account?

Will you allow only contracts to use it? If so, what kind of contracts?
- Any version of any contract?
- Specific contract versions?
- Specific versions of specific packages?
- Any versions of specific packages?

Will you allow both accounts and contracts to use it? If so, will these accounts and contracts be:
-  Any accounts and contracts?
-  Specific accounts and specific contract versions?
-  Specific accounts and specific versions of specific packages?
-  Specific accounts and any versions of specific packages? 

## Further Reading

| Topic | Description |
| ----- | ----------- |
| [Cross Contract Communication](./cross-contract.md) | Variations of cross-contract communication for more complex scenarios |
| [Interacting with Runtime Return Values](./return-values-tutorial.md) | Contract code returning a value to the immediate caller via `runtime::ret()` |