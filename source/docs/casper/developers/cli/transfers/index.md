# Introduction

The following topics describe how to use the Casper command-line client to transfer tokens between purses on a Casper network. Depending on the account configuration, either a direct transfer or a multiple-signature (multi-sig) deploy transfer can be utilized.

**Transferring Tokens Using Direct Transfer**

Tokens can be transferred directly when the signing key has enough weight to approve the transaction. This is the most common scenario, applicable by default for accounts with a single primary key. To use a direct transfer, see [Transferring Tokens Using Direct Transfer](./direct-token-transfer.md).

**Transferring Tokens Using Multi-sig Deploy**

Multi-sig deploy transfers are typically used when the account initiating the transfer has multiple associated keys that need to sign the deploy. To set up the account's associated keys, see the [Two-Party Multi-Signature Deploys](../../../resources/tutorials/advanced/two-party-multi-sig.md) workflow. To use a multi-sig deploy transfer, see [Transferring Tokens Using a Multi-sig Account](./multisig-deploy-transfer.md).

**Verifying a Transfer Using the Command-line Client**

To verify the status of a transfer, see [Verifying a Transfer](./verify-transfer.md).
