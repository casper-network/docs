import useBaseUrl from '@docusaurus/useBaseUrl';

# Using Authorization Keys

This topic explains the usage of authorization keys when signing a deploy and how to access them from a smart contract. Try the [Working with Authorization Keys](TUTORIAL.md) tutorial for an example. <!-- TODO If moved to the docs, the link would be: /resources/tutorials/advanced/authorization-keys/ -->

## Account Associated Keys vs. Deploy Authorization Keys

Let's review the difference between associated keys (to an Account) and authorization keys (for a Deploy).

- Associated keys are public keys that are associated with a given account. To understand associated keys and how they are linked to an account, read about [associated keys and weights](https://docs.casperlabs.io/concepts/design/casper-design/#accounts-associated-keys-weights) and try the [Two-Party Multi-Signature](https://docs.casperlabs.io/resources/tutorials/advanced/two-party-multi-sig/) tutorial.
- Authorization keys are public keys used to sign a deploy and are listed in the Deploy's `approvals`. Authorization keys are a subset of the associated keys of the account under which the deploy is executed. 
- When a node receives a deploy, it checks that the deploy has the required authorization keys under `approvals` before including it in a block.
- Different deploys executing the same smart contract can have different authorization keys.

<!-- TODO Remove all instances of https://docs.casperlabs.io if this file is moved to the docs repository-->

![Image showing associated keys and authorization keys](./authorization-keys.png)

<!-- TODO Additional formatting if needed
<p align="center"><img src={"./authorization-keys.png"} alt="Image showing associated keys and authorization keys" width="400"/></p> -->

Here is a sample JSON representation of an Account's associated keys:

```
"associated_keys": [
{
    "account_hash": "account-hash-1ab…11",
    "weight": 1
},
{
    "account_hash": "account-hash-2cd…22",
    "weight": 1
},
{
    "account_hash": "account-hash-3de…33",
    "weight": 1
   },
{
    "account_hash": "account-hash-4fg…44",
      "weight": 1
}
 ], ...
```

Here is a sample JSON representation of a Deploy's authorization keys:

```
"approvals": [
    {
      "signer": " 2cd...22",
      "signature": "02df8c...f481"
    },
    {
      "signer": "4fg...44",
      "signature": "02ef21...756a"
    }
]
```

## Accessing Authorization Keys from a Smart Contract

Contract code can retrieve the set of authorization keys for a given deploy by calling the `runtime::list_authorization_keys` function, which returns the set of account hashes representing the keys used to sign the deploy. <!-- TODO add a link to docs.rs when it is available as part of 1.5.-->

## When to Use Authorization Keys

Authorization keys give developers more fine-grained control within their smart contracts. For example, developers can define a hierarchy within an account's associated keys. Then, they can use this hierarchy and the current execution's authorization keys to limit access for certain operations.

Try the [Working with Authorization Keys](https://docs.casperlabs.io/resources/tutorials/advanced/authorization-keys/) tutorial to view an example workflow.
