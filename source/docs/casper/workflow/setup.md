# Prerequisites

This section explains how to fulfill the prerequisites needed to interact with a Casper Network.

This section covers:

1.  Installing the official Casper command-line client
2.  Setting up an account on a Casper Network
3.  Acquiring the IP address of a peer on the official Testnet or Mainnet

## Casper Command-line Client {#the-casper-command-line-client}

You can find the client on [crates.io](https://crates.io/crates/casper-client).

Run the commands below to install the Casper client on most flavors of Linux and macOS.

```bash
cargo install casper-client
```

The Casper client can print out _help_ information, which provides an up-to-date list of supported commands.

```bash
casper-client --help
```

**Important**: For each command, you can use _help_ to get the up-to-date arguments and descriptions:

```bash
casper-client <command> --help
```

## Setting up an Account {#setting-up-an-account}

The process of creating an [Account](../design/accounts.md) can be divided into two steps:

1.  Creating the account
2.  Funding the account

### Creating an Account {#creating-an-account}

The [Accounts and Cryptographic Keys](../dapp-dev-guide/keys.md) guide will walk you through account creation.

### Funding an Account {#funding-an-account}

After account creation, you need to fund the account so that you can perform deploys.

In Testnet, you can fund the account by using the **Request tokens** button on the [Faucet Page](https://testnet.cspr.live/tools/faucet) to receive tokens.

In Mainnet, a pre-existing account will have to transfer CSPR tokens to finalize the process of setting up an account. The _Source_ account needs to transfer CSPR tokens to the hexadecimal-encoded public key of the _Target_ account. This transfer will automatically create the _Target_ account if it does not exist. Currently, this is the only way an account can be created on Mainnet.

## Acquiring a Node Address from the Network {#acquire-node-address-from-network-peers}

Clients can interact with a node on the blockchain via requests sent to that node's JSON-RPC endpoint, `http://<node-ip-address>:7777` by default.

The node address is the IP of a peer node.

Both the official testnet and Mainnet provide block explorers that provide a list of IP addresses of nodes on their respective networks.

You can get the `node-ip-address` of a node on the network by visiting the following block explorers:

-   [Peers](https://testnet.cspr.live/tools/peers) on Testnet
-   [Peers](https://cspr.live/tools/peers) on Mainnet

You will see a list of peers, and you can select the IP of any peer on the list.

**Note**: If the selected peer is unresponsive, pick a different peer and try again.
