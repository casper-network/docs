import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Development Prerequisites

This page covers the necessary software for your Casper development environment. To develop comfortably, you should use `Linux Ubuntu 20.04` or `macOS`. Developing on Windows is not advised.

:::caution

Casper does not officially support `macOS`. If you encounter any problems, reach out to the community on [Telegram](https://t.me/casperblockchain) or [Discord](https://discord.com/invite/Q38s3Vh).

:::

## Preparing your Development Environment

<Tabs>
<TabItem value="Linux" label="Linux">

### Installing `curl` {#install-curl}

```bash
sudo apt install curl
```

### Installing essential Linux packages {#install-essential}

```bash
sudo apt install build-essential
```

### Installing packages required for Casper tools {#install-adds}

```bash
sudo apt-get install pkg-config
sudo apt-get install openssl
sudo apt-get install libssl-dev
```

### Installing `cargo` on Linux {#install-linux-cargo}

```bash
sudo apt install cargo
```

</TabItem>
<TabItem value="macOS" label="macOS">

### Installing Xcode developer tools for macOS {#install-xcode}

```bash
xcode-select --install
```

Verify the installation:

```bash
xcode-select -p
```

### Installing `brew` {#install-brew}

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Installing packages required for Casper tools {#install-adds-macos}

```bash
brew install pkg-config
brew install openssl
```

</TabItem>
</Tabs>

## Installing Rust {#install-rust}

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After your next login, the installation script automatically adds Rust to your system PATH. To start using Rust immediately, run the following command in your shell instead of restarting your terminal. The command will add Rust to your system PATH.

```bash
source $HOME/.cargo/env
```

Verify the installation:

```bash
rustup --version
```

## Installing `cargo-casper` {#install-cargo-casper}

```bash
cargo install cargo-casper
```

Verify the installation:

```bash
cargo-casper --version
```

## Installing the Casper client {#install-casper-client}

The default Casper client is on [crates.io](https://crates.io/crates/casper-client). This client can transmit your deploys to a Casper network.

```bash
cargo install casper-client
```

Verify the installation:

```bash
casper-client --version
```

The Casper client can print out help information, which provides an up-to-date list of supported commands. To do so, use the following command:

```bash
casper-client --help
```

You can use `help` for each command to get the most up-to-date arguments and descriptions.

```bash
casper-client <command> --help
```

### Accessing the Casper client source code {#building-client-from-source}

You can access the Casper client source code [here](https://github.com/casper-ecosystem/casper-client-rs). The `lib` directory contains the source for the client library, which may be called directly rather than through the CLI binary. The CLI app `casper-client` uses this library to implement its functionality.

If you wish to compile it, you will need to first install the nightly Rust compiler with this command:

```bash
rustup toolchain install nightly
```

Then, compile the source code:

```bash
cargo build --release
```

You will find the `casper-client` executable in the `target/release` directory.

## Installing `cmake` {#install-cmake}

If you plan to compile contracts from the source code, including those provided in the [casper-node](https://github.com/casper-network/casper-node) repository, install `cmake` with the commands below.

<Tabs>
<TabItem value="Linux" label="Linux">

```bash
sudo apt-get -y install cmake
```

</TabItem>
<TabItem value="macOS" label="macOS">

```bash
brew install cmake
```
</TabItem>
</Tabs>

Verify the installation with

```bash
cmake --version
```

## Installing an IDE

We advise using an integrated development environment such as Visual Studio Code (VSC) for development. Follow these [instructions](./writing-onchain-code/getting-started.md#setting-ide) to set up VSC and install plugins that would be helpful during development.

## Setting up a Casper Account {#setting-up-an-account}

The [Account](../concepts/design/casper-design.md#accounts-head) creation process consists of two steps:

1. Creating an Account
2. Funding the Account

The following video complements the instructions below, showing you the expected output.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sA1HTPjV_bc&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=3" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

### Creating an account {#creating-an-account}

The Casper blockchain uses an on-chain account-based model, uniquely identified by an `AccountHash` derived from a specific `PublicKey`.

By default, a transactional interaction with the blockchain takes the form of a `Deploy` cryptographically signed by the key-pair corresponding to the `PublicKey` used to create the account.

Users can create accounts using the [Casper command-line client](../concepts/accounts-and-keys.md#option-1-generating-keys-using-the-casper-client-option-1-key-generation-using-the-casper-client). 

Alternatively, some Casper networks, such as the official Testnet and Mainnet, provide a browser-based block explorer that allows account creation as outlined [here](../concepts/accounts-and-keys.md#option-2-generating-keys-using-a-block-explorer-option-2-key-generation-using-a-block-explorer). 

Use either method to generate an account and its corresponding cryptographic key-pair.

### Generating the account hash

As a developer, you will often use an account hash, which is a 32-byte hash of the public key. This is because responses from the node contain `AccountHashes` instead of the direct hexadecimal-encoded public key. To view the account hash for a public key, use the `account-address` option of the Casper CLI client:

```bash
casper-client account-address --public-key <path-to-public_key.pem/public-key-hex>
```

## Funding an Account {#fund-your-account}

After generating the cryptographic key-pair for an Account, you must fund the account's main purse to create it on-chain.

On Testnet, you can fund an account by requesting test tokens according to [this guide](../users/testnet-faucet.md). You can request test tokens **only once** for each account.

On Mainnet, a pre-existing account must transfer CSPR tokens to the newly created account's main purse to finalize the setup. The source account needs to transfer CSPR tokens to the hexadecimal-encoded public key of the target account. This transfer will automatically create the target account if it does not exist. Currently, this is the only way to create an account on Mainnet.

## Acquiring a Node Address from the Network {#acquire-node-address-from-network-peers}

Clients can interact with a node on the blockchain via requests sent to that node's JSON-RPC endpoint, `http://<node-ip-address>:7777` by default.

The node address is the IP of a peer node.

Both the official Testnet and Mainnet provide block explorers that list the IP addresses of nodes on their respective networks.

You can get the `node-ip-address` of a node on the network by visiting the following block explorers:

* [Peers](https://testnet.cspr.live/tools/peers) on Testnet
* [Peers](https://cspr.live/tools/peers) on Mainnet

You will see a list of peers, and you can select the IP of any peer on the list.

**Note**: If the selected peer is unresponsive, pick a different peer and try again.
