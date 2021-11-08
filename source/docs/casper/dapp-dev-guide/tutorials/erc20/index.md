---
title: Introduction
slug: /erc20
---

# ERC-20 Tutorial

This tutorial introduces an implementation of the ERC-20 standard for the Casper blockchain. The code for this tutorial is available in [GitHub](https://github.com/casper-ecosystem/erc20).

The [Ethereum Request for Comment (ERC-20)](https://eips.ethereum.org/EIPS/eip-20#specification) standard is an integral part of the Ethereum ecosystem. This standard is well established for building new tokens based on smart contracts. These ERC-20 tokens are blockchain-based assets that have value and can be transferred or recorded.

The ERC-20 standard defines a set of rules that dictate the total supply of tokens, how the tokens are transferred, how transactions are approved, and how token data is accessed.

The following functions implement the rules defined by ERC-20: `totalSupply`, `transfer`, `transferFrom`, `approve`, `balanceOf`, and `allowance`. As part of this tutorial, we will review the [contract](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs) and the [casper_erc20](https://docs.rs/casper-erc20/latest/casper_erc20/) library.

If you haven't read [Writing Rust Contracts on Casper](https://docs.casperlabs.io/en/latest/dapp-dev-guide/writing-contracts/writing-rust-contracts.html), we recommend you start there.
