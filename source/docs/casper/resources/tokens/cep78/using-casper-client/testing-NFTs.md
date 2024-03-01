---
title: Testing NFTs
---

# Testing NFT Contracts

## Prerequisites

- Install the contract using the [Quickstart](./quickstart-guide.md) or the [Full Installation](./full-installation-tutorial.md) tutorials

## Framework Description

The testing framework in this tutorial uses the [Casper engine test support](https://crates.io/crates/casper-engine-test-support) crate for testing the contract implementation against the Casper execution environment.

The [tests](https://github.com/casper-ecosystem/cep-78-enhanced-nft/tree/dev/tests/src) source folder contains over 150 tests covering a variety of scenarios, including contract installation, minting and burning tokens, sending transfers, upgrading the contract, and listening to events.

For more details about the test framework and how each test is set up, visit the [Testing Smart Contracts](../../../../developers/writing-onchain-code/testing-contracts/) documentation page.

## Running the Tests

To build and run the tests, issue the following command in the project folder:

```bash
make test
```

The project contains a [Makefile](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/Makefile), which is a custom build script that compiles the contract before running tests in _release_ mode. Then, the script copies the `contract.wasm` file to the corresponding version folder in a `tests/wasm` directory. In practice, you only need to run the `make test` command during development without building the contract separately.

This example uses `bash`. If you use a Rust IDE, you must configure it to run the tests.