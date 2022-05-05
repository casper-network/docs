
# Listing Authorization Keys
This topic explains the difference between associated keys and authorization keys and the benefits of the list authorization keys feature.

## Associated Keys and Authorization Keys
Lets understand the relation between associated keys and authorization keys. To understand more about associated keys and how they are linked to an account, see [Multisig Tutorial](tutorials/multi-sig/example.md).

- Associated keys are public keys which are associated with a given account.
- Authorization keys are public keys which are used to sign a given deploy and are used by the node to check that the deploy has permission to be executed.
- Different executions of the same smart contract can have different authorization keys.
- Authorization keys are always a subset of the associated keys of the account under which the deploy is executed.

<<<<<<< Updated upstream
## Benefits of Load Authorization Keys Feature
A smart contract can retrieve the set of authorization keys for the given execution by calling the `runtime::list_authorization_keys` function.  This returns the set of account hashes representing all the keys used to sign the deploy under which the contract is executing.

This gives developers more fine-grained control within their smart contracts.  For example, developers can define a hierarchy within an account's associated keys, and use that along with the current execution's authorization keys to limit access for certain operations to specific keys.
=======
## Benefits of List Authorization Keys Feature
The list authorization keys feature helps identify the keys that were used to sign a deploy. Let's try to understand why this feature is important for smart contract developers.

- The list authorization keys feature helps smart contract developers access the authorization keys of the current execution. Before the introduction of the list authorization keys feature, a smart contract couldn't find out which authorization keys were used for a given execution. Different executions of the same smart contract can have different authorization keys. Using the list_authorization_keys API, any smart contract developer can find out the keys used to sign a deploy.
- The list_authorization_keys API when called from by a smart contract, provides the set of account hashes representing all the keys used to sign the deploy under which the contract is executing. This gives developers more fine-grained control within their smart contracts.  
- Developers can use the authorization keys to set restrictions on which keys are allowed to approve the deploy and which aren't.
- Developers can also define the hierarchy and limit access for certain operations to specific keys. 
>>>>>>> Stashed changes

