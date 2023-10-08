---
title: Contract Hash vs. Package Hash
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Using the Contract Hash vs. the Package Hash

This page describes the circumstances of using the [contract hash](https://docs.rs/casper-types/3.0.0/casper_types/contracts/struct.ContractHash.html) vs. the [contract package hash](https://docs.rs/casper-types/3.0.0/casper_types/contracts/struct.ContractPackageHash.html) when calling a contract or allowing, blocking, or tracking calls from other contracts. As noted in [Upgrading and Maintaining Smart Contracts](./upgrading-contracts.md#the-contract-package), the contract package contains various contract versions. The contract hash is a BLAKE2b hash of a contract, and the contract package hash (package hash for short) is the BLAKE2b hash of a contract package.

<p align="center"><img src={useBaseUrl("/image/package-representation-extended.png")} alt="package-representation" width="400"/></p>

Depending on what a contract needs to accomplish, it may save and manage the contract hash, package hash, or both. Like with most things, this behavior depends on what the contract needs to do. A given contract might:

- Want to identify specific versions of contracts within the same package and thus use a contract hash
- Not need specific contract versions and allow or block all versions in the same package, thus using the contract package hash
- Need specific contract versions within the same package, and thus use both contract hash and contract package hash
- Not need either hash for this use case

A given contract, i.e., CEP-18, which wants to allow or block or track calls from other contracts, should then decide:

- Will the contract allow, block, or track contract callers loosely at the package level?
- Will the contract allow, block, or track contract callers specifically at the contract level?

Or a more fine-grained variation would be:

- Will the contract allow or block callers at the package level but track by both package and contract hash?
- Will the contract allow other combinations of these basic concepts?

Each contract is responsible for documenting its choices and what it requires of its callers. It is essential to keep in mind the difference between the behavior of the Casper execution engine (the host), as exposed by the [Casper External FFI](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/), versus use cases and interactions between two or more ecosystem entities such as accounts and contracts.

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

After retrieving the required information, the contract must manage its internal logic and data storage, actions entirely opaque to the execution engine.

Learn more about [Call Stacks](../../concepts/callstack.md) and how Casper manages the calling of a contract.

## Recommendations

Consider the following questions when designing the contract and choosing whether to use the contract hash or package hash.

1. Will you allow only accounts to use the contract? If so, what kind of accounts are you considering?

    |Answer|Recommendation|
    |----|-----------|
    | Specific accounts | Use the account hashes to identify and track specific accounts |
    | Exactly one specific account | Use the account hash of a specific account |
    | Any accounts | No need to track by account hash |

2. Will you allow only contracts to use it? If so, what kind of contracts?

    |Answer|Recommendation|
    |----|-----------|
    | Specific contract versions| Use the contract hash of each contract version | 
    | Specific versions of specific packages| Use the contract hash and the package hash to identify each version | 
    | Any versions of specific packages| Use the package hash to identify each contract package | 
    | Any version of any contract| No need to track by contract hash or package hash | 

3. Will you allow both accounts and contracts to use it? If so, will these accounts and contracts be:

    |Answer|Recommendation|
    |----|-----------|
    |  Specific accounts and specific contract versions | Use the account hash for each account and the contract hash for each contract version |
    |  Specific accounts and specific versions of specific packages | Use the account hash for each account and the contract hash and the package hash to identify each version |
    |  Specific accounts and any versions of specific packages | Use the account hash of each account and the package hash of each contract package |
    |  Any accounts and contracts | No need to track by account hash or contract hash |

## What's Next?

- [Best Practices for Casper Smart Contract Authors](./best-practices.md) - An outline of best practices when developing smart contracts on a Casper network
- [Cross-Contract Communication](../../resources/advanced/cross-contract.md) - Variations of cross-contract communication for more complex scenarios
- [Interacting with Runtime Return Values](../../resources/advanced/return-values-tutorial.md) - Contract code returning a value to the immediate caller via `runtime::ret()`
