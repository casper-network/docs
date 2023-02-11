# Concepts

The Casper implementation of multiple signatures is unique and allows you to set up and customize access to your account and deployments.

Many companies handle large transactions and use smart contracts to manage tokens. However, these contracts need to be audited and secure and require a significant investment in setup and maintenance.

Casper enables you to sign anything with its multi-signature (multi-sig) implementation. For example, you do not need a multi-sig wallet to call a feature from a smart contract. Instead, you can use the multi-sig feature at the account level and sign your account with multiple keys.

Your [Account](/design/casper-design.md#accounts-head) is a cryptographically secured gateway into a Casper network, and you can set it up using the [Casper Permissions Model](/design/casper-design.md/#accounts-permissions).

The account contains associated keys and action thresholds:

-   The **associated keys** of an account are the set of public keys allowed to provide signatures on account actions.
-   An account can perform two types of actions: **deployment** and **key management**.
-   The **action thresholds** in the account data structure set a **weight**, which you must meet to perform an action.

For more information, please review the [Blockchain Design](/design/casper-design.md#accounts-head).
