# Prerequisites

This section explains how to fulfill the prerequisites needed to interact with a Casper Network.

This section covers:

1.  Installing the official Casper command-line client
2.  Setting up an account on a Casper Network
3.  Acquiring the IP address of a peer on the official Testnet or Mainnet

## The Casper command-line client {#the-casper-command-line-client}

You can find the client on [crates.io](https://crates.io/crates/casper-client).

Run the commands below to install the Casper client on most flavors of Linux and macOS. You will need the nightly version of the compiler.

```bash
rustup toolchain install nightly
cargo +nightly-2021-06-17 install casper-client --locked
```

Doing this, you'll see a warning, which you can ignore for now.

```bash
warning: package `aes-soft v0.5.0` in Cargo.lock is yanked in registry `crates.io`, consider running without --locked
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

1.  Cryptographic key generation for the account
2.  Funding the account

The Casper blockchain uses an on-chain account-based model, uniquely identified by an `AccountHash` derived from a specific `PublicKey`.

By default, a transactional interaction with the blockchain takes the form of a `Deploy` cryptographically signed by the key-pair corresponding to the `PublicKey` used to create the account.

Accounts can be created using the Casper command-line client. Alternatively, some Casper networks such as the official Testnet and Mainnet provide a browser-based block explorer that allows account creation.

A cryptographic key-pair will be created when using either the Casper command-line client or a block explorer to create an account on the blockchain. This process generates three files for each account:

1.  A PEM encoded secret key
2.  A PEM encoded public key
3.  A hexadecimal-encoded string representation of the public key

We recommend saving these files securely.

The command-line client provides a command that will give you the account hash for a given public key.

```bash
casper-client account-address --public-key <path-to-public-key-hex>/public_key_hex
```

### Option 1: Key generation using the Casper client {#option-1-key-generation-using-the-casper-client}

This option describes how you can use the Casper command-line client to set up your accounts.

Execute the following command to generate your keys:

```bash
casper-client keygen .
```

The above command will create three files in the current working directory:

1.  `secret_key.pem` - PEM encoded secret key
2.  `public_key.pem` - PEM encoded public key
3.  `public_key_hex` - Hexadecimal-encoded string of the public key

**Note**: SAVE your keys to a safe place, preferably offline.

Once the keys for the account have been generated, the accounts can be funded to finish the process of creating an account.

**Note**: Responses from the node contain `AccountHashes` instead of the direct hexadecimal-encoded public key. For traceability, it is important to generate the account hash and store this value locally. The account hash is a `Blake2B` hash of the public hexadecimal-encoded string.

### Option 2: Key generation using a Block Explorer {#option-2-key-generation-using-a-block-explorer}

This option is also available on networks that have a block explorer.

For instance, on the official Testnet network the [CSPR.live](https://testnet.cspr.live/) block explorer is available, and the following instructions assume you are using it.

Start by creating an account using the [Create Account](https://testnet.cspr.live/create-account) link. You will need to download the keys of your new account by clicking on the `Download Keys` button. Note that the account is not stored on chain.

You will be prompted to save the following three files for your new account. These are your keys, so we recommend securely storing them:

1.  `secret_key.pem` - PEM encoded secret key
2.  `public_key.pem` - PEM encoded public key
3.  `public_key_hex` - Hexadecimal-encoded string of the public key

### Fund your Account {#fund-your-account}

Once the cryptographic key-pair for the account has been generated, the account must be funded so it can be created on chain.

In Testnet, you can fund the account by using the _Request tokens_ button on the [Faucet Page](https://testnet.cspr.live/tools/faucet) to receive tokens.

In Mainnet, a pre-existing account will have to transfer CSPR tokens to finalize the process of setting up an account. The _Source_ account needs to transfer CSPR tokens to the hexadecimal-encoded public key of the _Target_ account. This transfer will automatically create the _Target_ account if it does not exist. Currently, this is the only way an account can be created on Mainnet.

## Acquire Node Address from network peers {#acquire-node-address-from-network-peers}

Clients can interact with a node on the blockchain via requests sent to that node's JSON-RPC endpoint, `http://<node-ip-address>:7777` by default.

The node address is the IP of a peer node.

Both the official testnet and Mainnet provide block explorers that provide a list of IP addresses of nodes on their respective networks.

You can get the `node-ip-address` of a node on the network by visiting the following block explorers:

-   [Peers](https://testnet.cspr.live/tools/peers) on Testnet
-   [Peers](https://cspr.live/tools/peers) on Mainnet

You will see a list of peers, and you can select the IP of any peer on the list.

**Note**: If the selected peer is unresponsive, pick a different peer and try again.
