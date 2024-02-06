---
title: Getting Started with Rust
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Getting Started with Rust Casper Contracts

This guide covers additional prerequisites for writing your first Casper smart contract. You will also build a sample smart contract and run a few basic tests on it on your local machine.

Casper's blockchain is built upon the Rust programming language and compiles to WebAssembly. This guide will walk you through the steps to write your first contract, assuming you have already set up your development environment as described [here](../prerequisites.md).

## Creating a Project {#creating-a-project}

You can create a new sample project very easily with the `cargo casper` crate. For example, let's say that I want to create a project named **my-project** for this tutorial (you can choose a different name if you wish), then I can simply run the command:

```bash
cargo casper my-project
```

If you look inside the newly-created _my-project_ folder, you will find two crates: `contract` and `tests`. This is a complete basic smart contract that saves a value, passed as an argument, on the blockchain. The `tests` crate provides a runtime environment of the Casper virtual machine, and a basic smart contract test.

### Using the nightly toolchain

Navigate to the `my-project` folder and open the `rust-toolchain` file. You will notice that the file's contents specify a nightly version of Rust. Here is an example:

```bash
nightly-2022-08-03
```

Having the latest nightly toolchain to develop smart contracts in Rust would be best. Please refer to the [Rust Documentation on Channels](https://rust-lang.github.io/rustup/concepts/channels.html) and the [Rust Documentation on Toolchains](https://rust-lang.github.io/rustup/concepts/toolchains.html) for further information.

As shown in this example, we recommend setting up the `rust-toolchain` file in your project's top-level directory.

You can also install the nightly Rust toolchain with this command:

```bash
rustup toolchain install nightly
```

### Available Casper Rust crates

To support smart contract development with Rust, the following crates are published:

- [casper-contract](https://crates.io/crates/casper-contract) - a library supporting communication with the blockchain. This is the main library you will need to write smart contracts.
- [casper-engine-test-support](https://crates.io/crates/casper-engine-test-support) - a virtual machine against which you can test your smart contracts.
- [casper-types](https://crates.io/crates/casper-types) - a library with types we use across the Rust ecosystem.

A crate is a compilation unit that can be compiled into a binary or a library. 

:::note

For a comprehensive list of crates, visit the [Essential Casper Crates](../essential-crates.md) page.

:::

### Available API documentation

Each of the Casper crates comes with API documentation and examples for each function, located at [https://docs.rs](https://docs.rs/releases/search?query=casper). The latest contract API documentation can be found [here](https://docs.rs/casper-contract/latest/casper_contract/).

## Compiling to Wasm {#compiling-to-wasm}

The Casper blockchain uses WebAssembly (Wasm) in its runtime environment. Compilation targets for Wasm are available for Rust, giving developers access to all the Rust ecosystem tools when developing smart contracts.

* Note: Wasm allows for the use of other languages, including but not limited to: C/C++, C#, Go, Julia, Lobster and ZIG.

To compile the smart contract into Wasm, go into the _my-project_ folder, and run the following commands:

```bash
cd my-project
make prepare
make build-contract
```

You can find the compiled contract on this path: `my-project/contract/target/wasm32-unknown-unknown/release/contract.wasm`.

**Linting**

Casper contracts support Rust tooling such as `clippy` for linting contracts. Feel free to use them! You can also use the `make check-lint` command for linting your contract. Run this command inside the _my-project_ folder:

```bash
make check-lint
```

## Testing the Contract {#test-the-contract}

In addition to creating the contract, the Casper crate also automatically created sample tests in the _my-project/tests_ folder.

The Casper local environment provides a virtual machine against which you can run your contract for testing. When you run the test crate, it will automatically build the smart contract in release mode and then run a series of tests against it in the Casper runtime environment. The custom build script is named _build.rs_ if you are interested in looking more into it.

:::note

Since the test script automatically builds the contract, during development you only need to run the command `make test` without the need for `make build-contract`.

:::

A successful test run indicates that your smart contract environment is set up correctly.

```bash
make test
```

After the compilation finishes, the test should run and you should see output similar to this message in your terminal:

```bash
running 2 tests
test tests::should_error_on_missing_runtime_arg ... ok
test tests::should_store_hello_world ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.09s
```

As a brief example, open up _my-project/contract/src/main.rs_ in your editor, modify the _KEY_NAME_ value in the contract, and then rerun the `make test` command. You should observe that the smart contract recompiles and the test fails now.


## Video Walkthrough

The following video tutorial complements this guide.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed/aIhA5fPIHus" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Rust Resources {#rust-resources}

These Rust resources are excellent and we highly recommend them:

1.  [https://doc.rust-lang.org/book/foreword.html](https://doc.rust-lang.org/book/foreword.html)
2.  [rustwasm.github.io/docs/book](https://rustwasm.github.io/docs/book/)
3.  [doc.rust-lang.org/stable/rust-by-example](https://doc.rust-lang.org/stable/rust-by-example)
