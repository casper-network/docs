
# Listing Authorization Keys
This topic explains the difference between associated keys and authorization keys, and how to access authorization keys from a smart contract.

## Associated Keys and Authorization Keys
Lets understand the relation between associated keys and authorization keys. To understand more about associated keys and how they are linked to an account, see [Multisig Tutorial](tutorials/multi-sig/example.md).

- Associated keys are public keys which are associated with a given account.
- Authorization keys are public keys which are used to sign a given deploy and are used by the node to check that the deploy has permission to be executed.
- Different executions of the same smart contract can have different authorization keys.
- Authorization keys are always a subset of the associated keys of the account under which the deploy is executed.

## Accessing of Authorization Keys from a Smart Contract
A smart contract can retrieve the set of authorization keys for the given execution by calling the `runtime::list_authorization_keys` function. This returns the set of account hashes representing all the keys used to sign the deploy under which the contract is executing.

This gives developers more fine-grained control within their smart contracts. For example, developers can define a hierarchy within an account's associated keys, and use that along with the current execution's authorization keys to limit access for certain operations to specific keys.

