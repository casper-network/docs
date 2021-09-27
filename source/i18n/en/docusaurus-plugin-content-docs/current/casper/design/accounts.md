# Accounts {#accounts-head}

## Introduction {#accounts-intro}

An _account_ is a cryptographically secured gateway into the Casper system used by entities outside the blockchain (e.g., off-chain components of blockchain-based applications, individual users). All user activity on the Casper blockchain (i.e., "deploys") must originate from an account. Each account has its own context where it can locally store information (e.g., references to useful contracts, metrics, aggregated data from other parts of the blockchain). Each account also has a "main purse" where it can hold Casper tokens (see `Tokens <tokens-purses-and-accounts>`{.interpreted-text role="ref"} for more information).

In this chapter we describe the permission model for accounts, their local storage capabilities, and briefly mention some runtime functions for interacting with accounts.

## The `Account` data structure {#accounts-data-structure}

An `Account` contains the following data:

-   A collection of named keys (this plays the same role as the named keys in a `stored contract <global-state-contracts>`{.interpreted-text role="ref"})
-   A `URef` representing the account's "main purse"
-   A collections of "associated keys" (see below for more information)
-   "Action thresholds" (see below for more information)

## Permissions model {#accounts-permissions}

### Actions and thresholds {#accounts-actions-thresholds}

There are two types of actions an account can perform: a deployment, and key management. A deployment is simply executing some code on the blockchain, while key management involves changing the associated keys (which will be described in more detail later). Key management cannot be performed independently, as all effects to the blockchain must come via a deploy; therefore, a key management action implies that a deployment action is also taking place. The `ActionThresholds` contained in the `Account` data structure set a `Weight` which must be met in order to perform that action. How these weight thresholds can be met is described in the next section. Since a key management action requires a deploy action, the key management threshold should always be greater than or equal to the deploy threshold.

### Associated keys and weights {#accounts-associated-keys-weights}

As mentioned in the introduction, accounts are secured via cryptography. The _associated keys_ of an account are the set of public keys which are allowed to provide signatures on deploys for that account. Each associated key has a weight; these weights are used to meet the action thresholds provided in the previous section. Each deploy must be signed by one or more keys associated with the account that deploy is for, and the sum of the weights of those keys must be greater than or equal to the deployment threshold weight for that account. We call the keys that have signed a deploy the "authorizing keys". Similarly, if that deploy contains any key management actions (detailed below), then the sum of the weights of the authorizing keys must be greater than or equal to the key management action threshold of the account.

Note: that any key may be used to help authorize any action; there are no "special keys", all keys contribute their weight in exactly the same way.

### Key management actions {#accounts-key-management}

A _key management action_ is any change to any of the permissions parameters for the account. This includes the following:

-   adding or removing an associated key;
-   changing the weight of an associated key;
-   changing the threshold of any action.

Key management actions have validity rules which prevent a user from locking themselves out of their account. For example, it is not allowed to set a threshold larger than the sum of the weights of all associated keys.

### Account security and recovery using key management {#accounts-recovery}

The purpose of this permissions model is to enable keeping accounts safe from lost or stolen keys, while allowing usage of capabilities of modern mobile devices. For example, it may be convenient to sign deploys from a smart phone in day-to-day usage, and this can be done without worrying about the repercussions of losing the phone. The recommended setup would be to have a low-weight key on the phone, only just enough for the deploy threshold, but not enough for key management, then if the phone is lost or stolen, a key management action using other associated keys from another device (e.g., a home computer) can be used to remove the lost associated key and add a key which resides on a replacement phone.

Note: that it is extremely important to ensure there will always be access to a sufficient number of keys to perform the key management action, otherwise future recovery will be impossible (we currently do not support "inactive recovery").

## Creating an account {#accounts-creating}

Account creation happens automatically when there is a `token transfer <tokens-purses-and-accounts>`{.interpreted-text role="ref"} to a yet unused `identity key <global-state-account-key>`{.interpreted-text role="ref"}. When an account is first created, the balance of its main purse is equal to the number of tokens transferred, its action thresholds are equal to 1, and there is one associated key (equal to the public key used to derive the identity key) with weight 1.

## The account context {#accounts-context}

A deploy is a user request to perform some execution on the blockchain (see `Execution Semantics <execution-semantics-deploys>`{.interpreted-text role="ref"} for more information). It contains "payment code" and "session code" which are contracts that contain the logic to be executed. These contracts are executed in the context of the account of the deploy. This means these contracts use the named keys of the account and use the account's local storage (i.e., the "root" for the `local keys <global-state-local-key>`{.interpreted-text role="ref"} come from the account identity key).

Note: that other contracts called from the session code by `call_contract` are executed in their own context, not the account context. This means, an account (with logic contained in session code) can be used to locally store information relevant to the user owning the account.

## Functions for interacting with an account {#accounts-api-functions}

The [Casper Rust library](https://docs.rs/casper-contract/1.0.1/casper_contract/ext_ffi/index.html) contains several functions for working with the various account features:

-   `casper_add_associated_key`
-   `casper_remove_associated_key`
-   `casper_update_associated_key`
-   `casper_set_action_threshold`
-   `casper_get_balance`
-   `casper_load_named_keys`
-   `casper_get_named_arg`
