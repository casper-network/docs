import useBaseUrl from '@docusaurus/useBaseUrl';

# Development Prerequisites

This section explains how to fulfill the prerequisites needed to interact with a Casper network.

This section covers:

1. Setting up a Rust development environment
2. Installing the official Casper command-line client
3. Setting up an Account on a Casper network
4. Acquiring the IP address of a peer on the official Testnet or Mainnet  

## Installing Rust {#installing-rust}

On the Casper platform, developers may write smart contracts in any language that compiles to Wasm. These How To guides focus on code examples that use Rust and a Rust client to interact with a Casper network. While following these guides, we recommend setting up Rust and installing all dependencies. For step-by-step instructions, visit [Getting Started with Rust](./writing-onchain-code/getting-started.md).

## Casper Command-line Client {#the-casper-command-line-client}

You can find the default Casper client on [crates.io](https://crates.io/crates/casper-client). This client communicates with the network to transmit your deploys.

Run the commands below to install the Casper client on most flavors of Linux and macOS. You should have [Rust](https://www.rust-lang.org/tools/install) installed, otherwise check the [alternative installation methods](#alternative-installation) below.

```bash
cargo install casper-client
```

The Casper client can print out _help_ information, which provides an up-to-date list of supported commands. To do so, use the following command:

```bash
casper-client --help
```

**Important**: For each command, you can use _help_ to get the most up-to-date arguments and descriptions.

```bash
casper-client <command> --help
```

### Alternative Installation Methods {#alternative-installation}

#### Debian / Ubuntu 

Navigate to <https://repo.casperlabs.io/> and follow the instructions compatible with your distribution.

#### Red Hat / CentOS 

Head to [GitHub](https://github.com/casper-ecosystem/casper-client-rs/releases) and download the `.rpm` file for the latest client release.

Run the following command by replacing the file's name with the one you downloaded.

```bash
sudo yum install casper-client-x-x-x*.rpm
```

In RHEL 5 and previous versions, you need to use the following command:

```bash
sudo yum localinstall casper-client-x-x-x*.rpm
```

On Fedora, RedHat 8, and other more recent RPM-based distributions, you can also use `dnf` to install packages:

```bash
sudo dnf install casper-client-x-x-x*.rpm
```


## Building the Client from Source {#building-the-client-from-source}

[Instructions](https://github.com/casper-network/casper-node/tree/master/client)

## Setting up an Account {#setting-up-an-account}

The [Account](../concepts/design/casper-design.md#accounts-head) creation process consists of two steps:

1. Creating the Account
2. Funding the Account

The following video complements the instructions below, showing you the expected output.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sA1HTPjV_bc&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=3" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Creating an Account {#creating-an-account}

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

## Funding Accounts {#fund-your-account}

After generating the cryptographic key-pair for an Account, you must fund the account's main purse to create it on-chain.

On Testnet, you can fund an account by requesting test tokens according to [this guide](../users/testnet-faucet.md). You can request test tokens **only once** for each account.

On Mainnet, a pre-existing account will have to transfer CSPR tokens to the newly created account's main purse to finalize the setup. The source account needs to transfer CSPR tokens to the hexadecimal-encoded public key of the target account. This transfer will automatically create the target account if it does not exist. Currently, this is the only way to create an account on Mainnet.

## Acquiring a Node Address from the Network {#acquire-node-address-from-network-peers}

Clients can interact with a node on the blockchain via requests sent to that node's JSON-RPC endpoint, `http://<node-ip-address>:7777` by default.

The node address is the IP of a peer node.

Both the official Testnet and Mainnet provide block explorers that list the IP addresses of nodes on their respective networks.

You can get the `node-ip-address` of a node on the network by visiting the following block explorers:

* [Peers](https://testnet.cspr.live/tools/peers) on Testnet
* [Peers](https://cspr.live/tools/peers) on Mainnet

You will see a list of peers, and you can select the IP of any peer on the list.

**Note**: If the selected peer is unresponsive, pick a different peer and try again.
