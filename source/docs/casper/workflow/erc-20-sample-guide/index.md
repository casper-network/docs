---
title: Introduction
slug: /workflow/erc-20-sample-guide
---

# Using the ERC-20 Contract

This guide introduces you to using an ERC-20 contract on the [Casper Network](https://cspr.live/).

The [Ethereum Request for Comment (ERC-20)](https://eips.ethereum.org/EIPS/eip-20#specification) standard defines a set of rules that dictate the total supply of tokens, how the tokens are transferred, how transactions are approved, and how token data is accessed. These ERC-20 tokens are blockchain-based assets that have value and can be transferred or recorded.

We will employ the following test accounts to demonstrate the use of an ERC-20 contract and transfer tokens between user accounts:

-   [User A](https://integration.cspr.live/account/01f2dfc09a94ef7bce440f93a1bb6f17fdac0c913549927d452e7e91a376e9d20d)
-   [User B](https://integration.cspr.live/account/015d4e20b5f7f687be80aed6e20960898b02c7549cc49ddf583224ecd894eca375)
-   [User C](https://integration.cspr.live/account/0101fe69ae2012358e5ce8e8b39661d45d225251c4f19ebb7fc74b057637e65aa4)
-   [User D](https://integration.cspr.live/account/0171bd7bac58780ce950007de575a472bcb30457e7b68427a6ed466568d71db1d6)

To execute transactions on the Casper Network (involving ERC-20 tokens), you will need some CSPR tokens to pay for the transactions.

To understand the implementation of a Casper ERC-20 contract, see the [ERC-20 Tutorial](/erc20).

## Prerequisites

Before you dive into the details of this guide, ensure you meet these requirements:

-   Set up your machine as per the [prerequisites](/workflow/setup)
-   Use the Casper command-line client
-   Get a valid `node-address`
-   Know how to deploy a [smart contract](/dapp-dev-guide/deploying-contracts) to a Casper network
-   Get some CSPR tokens to pay for transactions
