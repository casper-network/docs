# Getting Started

This guide covers the basic tools you will need to set up your first Casper smart contract. You will also be able to build a sample smart contract and run a few basic tests on it on your local machine.

Casper's blockchain is built upon the Rust programming language and compiles down to WebAssembly. The Rust contract SDK is the easiest way to get started with smart contract development. This guide will walk you through the steps to set up your development environment and build your first contract.

Refer to our [FAQ guide](../faq/faq-developer.md) if you have questions or need help.

## Video Tutorial {#video-tutorial}

For a video walkthrough of this guide, feel free to check out this quick-start video.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=XvV02iBoctc&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites {#prerequisites}

### Installing Rust {#installing-rust}

Install the [Rust programming language](https://www.rust-lang.org) if you don't already have it on your computer.

The [official Rust guide](https://www.rust-lang.org/tools/install) recommends installing Rust by using `curl`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

You can also use `brew` on MacOS or `apt` on Linux to install Rust.

Once you finish installing Rust, check your version:

```bash
rustup --version
```

Your terminal output should resemble something like the following (note: at the time of the writing of this tutorial, the latest version of Rust was 1.24.3 and may differ for you):

```bash
$ rustup --version
rustup 1.24.3 (ce5817a94 2021-05-31)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: The currently active `rustc` version is `rustc 1.59.0-nightly (0fb1c371d 2021-12-06)`
```

**Configure Nightly Rust**

After installing Rust, you need to install and set the Rust nightly toolchain as the default with these commands:

```bash
rustup install nightly
rustup default nightly
```

**Casper Rust Packages**

We publish three crates on [crates.io](https://crates.io/) to support smart contract development with Rust:

-   [Casper Contract](https://crates.io/crates/casper-contract) - a library supporting communication with the blockchain. This is the main library you will need to write smart contracts.
-   [Casper Test Support](https://crates.io/crates/casper-engine-test-support) - an in-memory virtual machine against which you can test your smart contracts.
-   [Casper Types](https://crates.io/crates/casper-types) - a library with types we use across the Rust ecosystem.

A crate is a compilation unit, which can be compiled into a binary or a library.

**API Documentation for Smart Contracts**

Each of the Casper crates comes with API documentation and examples for each function, located at [https://docs.rs](https://docs.rs/releases/search?query=casper). The contract API documentation is specific for a given version. For example, you can find documentation for version **0.7.6** at <https://docs.rs/casper-contract/0.7.6>.

### Installing Dependencies {#installing-dependencies}

**1. CMake**

CMake is a popular build tool that we will utilize, and you may very well have it already installed. If you do, make sure that you have the latest version. If you need to install or upgrade it, follow the steps located here: https://cmake.org/install/. Once installed, check your version as shown below.

```bash
$ cmake --version
cmake version 3.20.0

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```

## Development Environment Setup {#development-environment-setup}

### Installing the Casper Crates {#installing-the-casper-crates}

The best and fastest way to set up a Casper Rust Smart Contract project is to use `cargo-casper`. When you use this, it will set the project up with a simple contract, a runtime environment and a testing framework with a simple test. _Cargo_ is a build system and package manager for Rust (much like _pip_ if you are familiar with Python). It is possible to use this configuration in your CI/CD pipeline as well.

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

### Compiling to WASM {#compiling-to-wasm}

The Casper blockchain uses WebAssembly (WASM) in its runtime environment. Compilation targets for WASM are available for Rust, giving developers access to all the Rust ecosystem tools when developing smart contracts.

The project requires a specific nightly version of Rust and requires a WASM target to be added to that Rust version. You can see more information by running:

```bash
cargo casper --help
```

To build the project, go into the _my-project_ folder, install the Rust toolchain and specify the target build as WebAssembly (wasm32):

```bash
cd my-project
rustup install $(cat rust-toolchain)
rustup target add --toolchain $(cat rust-toolchain) wasm32-unknown-unknown
```

**Linting**

Casper contracts support Rust tooling such as `clippy` for linting contracts. Feel free to use them! You can also use the `make check-lint` command for linting your contract. Run this command inside the _my-project_ folder:

```bash
make check-lint
```

### Build the Contract {#build-the-contract}

The next step is to compile the smart contract into WASM. Inside the _my-project_ folder, run the following commands:

```bash
make prepare
make build-contract
```

Inside the _contract_ folder, you will now see a _target_ folder that contains the compiled smart contract named _contract.wasm_ at `my-project/contract/target/wasm32-unknown-unknown/release/contract.wasm`.

### Test the Contract {#test-the-contract}

In addition to creating the contract, the Casper crate also automatically created sample tests in the _my-project/tests_ folder.

The Casper local environment provides an in-memory virtual machine against which you can run your contract for testing. When you run the test crate, it will automatically build the smart contract in release mode and then run a series of tests against it in the Casper runtime environment. The custom build script is named _build.rs_ if you are interested in looking more into it.

:::note

Since the test script automatically builds the contract, during development you only need to run the command `make test` without the need for `cargo build`.

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


## Rust Resources {#rust-resources}

These Rust resources are excellent and we highly recommend them:

1.  <https://doc.rust-lang.org/book/foreword.html>
2.  <https://rustwasm.github.io/docs/book/>
3.  <https://doc.rust-lang.org/stable/rust-by-example>
