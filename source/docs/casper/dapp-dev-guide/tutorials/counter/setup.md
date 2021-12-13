# Casper Client Setup

## Prerequisites {#prerequisites}

1.  You have completed the [Getting Started tutorial](../../getting-started.md) to set up your development environment, including tools like _cmake_ (version 3.1.4+), _cargo_, and _Rust_.
2.  You have completed the [NCTL tutorial](../../setup-nctl.md), which introduces you to the CLI tool to set up and control local Casper networks for development.

## Installing the Casper Client {#installing-the-casper-client}

Once you have a working Rust development environment and NCTL installed, you will need to install the [casper-client crate](https://crates.io/crates/casper-client). This crate is a collection of CLI commands that simplify issuing instructions to the blockchain and query state information.

**Installation instructions**

```bash
cargo install casper-client
```

Once you have the _casper-client_ installed, we can proceed to walk through setting up NCTL, cloning the contract, and deploying it to the chain.

Before we go through the tutorial, we will give a high-level overview of this tutorial's walkthrough and briefly summarize the relevant commands (and respective arguments).
