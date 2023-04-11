import useBaseUrl from '@docusaurus/useBaseUrl';

# Getting Started with Rust

This guide covers the basic tools you will need to write your first Casper smart contract. You will also be able to build a sample smart contract and run a few basic tests on it on your local machine.

Casper's blockchain is built upon the Rust programming language and compiles down to WebAssembly. This guide will walk you through the steps to set up your development environment and write your first contract.

## Prerequisites {#prerequisites}

### Installing Rust {#installing-rust}

Install the [Rust programming language](https://www.rust-lang.org) if you don't already have it on your computer.

The [official Rust guide](https://www.rust-lang.org/tools/install) recommends installing Rust by using `curl`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

The installation script automatically adds Rust to your system PATH after your next login.
To start using Rust right away instead of restarting your terminal, run the following command in your shell to add Rust to your system PATH manually:

```bash
source $HOME/.cargo/env
```

You can also use `brew` on MacOS or `apt` on Linux to install Rust.

Once you finish installing Rust, check your version:

```bash
rustup --version
```

**Casper Rust Packages**

We publish three crates on [crates.io](https://crates.io/) to support smart contract development with Rust:

-   [Casper Contract](https://crates.io/crates/casper-contract) - a library supporting communication with the blockchain. This is the main library you will need to write smart contracts.
-   [Casper Test Support](https://crates.io/crates/casper-engine-test-support) - a virtual machine against which you can test your smart contracts.
-   [Casper Types](https://crates.io/crates/casper-types) - a library with types we use across the Rust ecosystem.

A crate is a compilation unit, which can be compiled into a binary or a library.

**API Documentation for Smart Contracts**

Each of the Casper crates comes with API documentation and examples for each function, located at [https://docs.rs](https://docs.rs/releases/search?query=casper). The contract API documentation is specific for a given version. For example, you can find documentation for version **0.7.6** at <https://docs.rs/casper-contract/0.7.6>.

### Installing Dependencies {#installing-dependencies}

**1. CMake**

CMake is a popular build tool that we will utilize, and you may very well have it already installed. If you do, make sure that you have the latest version. If you need to install or upgrade it, follow the steps located here: https://cmake.org/install/. Once installed, check your version as shown below.

```bash
cmake --version
```
Output:
```
cmake version 3.20.0 (or above)

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```

## Development Environment Setup {#development-environment-setup}

### Installing the Casper Crates {#installing-the-casper-crates}

The best and fastest way to set up a Casper Rust project is to use `cargo casper`. Using this will create a simple contract, a runtime environment, and a testing framework with a simple test. _Cargo_ is a build system and package manager for Rust (much like _pip_ if you are familiar with Python, or _npm_ and _yarn_ for those familiar with Javascript). It is also possible to use this configuration in your CI/CD pipeline.

```bash
cargo install cargo-casper
```

If you run into any issues with this command and you have not recently installed Rust from scratch, please make sure to update your Rust version with this command:

```bash
rustup update
```

### Creating a Project {#creating-a-project}

You can create a new sample project very easily with the Casper crate. For example, let's say that I want to create a project named **my-project** for this tutorial (you can choose a different name if you wish), then I can simply run the command:

```bash
cargo casper my-project
```

If you look inside the newly-created _my-project_ folder, you will find two crates: `contract` and `tests`. This is a complete basic smart contract that saves a value, passed as an argument, on the blockchain. The `tests` crate provides a runtime environment of the Casper virtual machine, and a basic smart contract test.

### Compiling to Wasm {#compiling-to-wasm}

The Casper blockchain uses WebAssembly (Wasm) in its runtime environment. Compilation targets for Wasm are available for Rust, giving developers access to all the Rust ecosystem tools when developing smart contracts.

* Note: Wasm allows for the use of other languages, including but not limited to: C/C++, C#, Go, Julia, Lobster and ZIG.

To compile the smart contract into Wasm, go into the _my-project_ folder, and run the following commands:

```bash
cd my-project
make prepare
make build-contract
```

You can find the compiled contract here:

`my-project/contract/target/wasm32-unknown-unknown/release/contract.wasm`

**Linting**

Casper contracts support Rust tooling such as `clippy` for linting contracts. Feel free to use them! You can also use the `make check-lint` command for linting your contract. Run this command inside the _my-project_ folder:

```bash
make check-lint
```

### Test the Contract {#test-the-contract}

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

### Installing the Casper Client

The [Casper command-line client](../prerequisites.md#the-casper-command-line-client) is a Rust CLI tool that can help you transmit deploys and install code on-chain. It's recommended to install the client as it's used to deploy contracts and session code in other on-chain tutorials.

### Setting up an IDE {#setting-ide}

There are many IDEs available for Rust development. The most popular IDEs for Rust are the following:

- Visual Studio Code
- CLion
- IntelliJ Idea
- Vim

You can use any IDE you wish. This documentation and examples use [Visual Studio Code (VSC)](https://code.visualstudio.com), a popular IDE with many extensions that might be helpful during development.
The easiest way of installing the VSC is to get it from the [official site](https://code.visualstudio.com):

<p align="center"><img src={useBaseUrl("/image/introduction/download-vscode.png")} alt="download-vscode" width="400"/></p>

We advise installing the following extensions to support the development process:

- Better TOML – support for formatting the TOML files
- CodeLLDB – the Debug Extension – without it, it is impossible to debug the RUST Code from the IDE
- crates – will help managing the crates
- Error Lens – enhances the experience during programming and highlights the syntax errors to be more prominent and easily identifiable
- rust-analyzer – official supported Rust Language extension

During the exercises and tutorials, ways to leverage the extensions will be briefly described.

### Creating an Account

To interact with a Casper network and install code on-chain, you will need to [create a Casper Account](../prerequisites.md#setting-up-an-account) with a public and secret key pair.

## Video Walkthrough

The following video tutorial complements this guide. You can also consult the [FAQ page](../../faq/faq-developer.md) for more details.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=TRmmiFBwPr0&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=2" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Rust Resources {#rust-resources}

These Rust resources are excellent and we highly recommend them:

1.  <https://doc.rust-lang.org/book/foreword.html>
2.  <https://rustwasm.github.io/docs/book/>
3.  <https://doc.rust-lang.org/stable/rust-by-example>
