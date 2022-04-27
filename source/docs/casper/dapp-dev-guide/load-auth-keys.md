
# Accessing Authorization Keys
The load authorization keys feature helps smart contract developers access the authorization keys of the current execution. Before the introduction of the load authorization keys feature, a smart contract couldn't find out which authorization keys were used for a given execution. Different executions of the same smart contract can have different authorization keys. Using the list_authorization_keys API, any smart contract developer can find out the keys used to sign a deploy. 

## Associated Keys and Authorization Keys
Lets understand the relation between associated keys and authorization keys. To understand more about associated keys and how they are linked to an account, see [Multisig Tutorial](tutorials/multi-sig/example.md).

- Associated keys are public keys which are associated with a given account.
- Authorization keys are public keys which are used to sign a given deploy and are used by execution engine (EE) to check that the deploy has permission to be executed.
- Authorization keys are always a subset of the associated keys of the account under which the deploy is executed. For example, if an account has two associated keys, anyone or both of the keys can be used to sign a deploy. The key that signs the deploy becomes the authorization key for that execution.

## Benefits of Load Authorization Keys Feature
The load authorization keys feature helps identify the keys that were used to sign a deploy. Let's try to understand why this feature is important for smart contract developers.

- The list_authorization_keys API when called from by a smart contract, provides the set of account hashes representing all the keys used to sign the deploy under which the contract is executing. This gives developers more fine-grained control within their smart contracts.  
- Developers can use the authorization keys to set restrictions on which keys are allowed to approve the deploy and which aren't.
- Developers can also define the hierarchy and limit access for certain operations to specific keys. 

