import useBaseUrl from '@docusaurus/useBaseUrl';

# Development Prerequisites

This section explains how to fulfill the prerequisites needed to interact with a Casper Network.

This section covers:

1. Installing the official Casper command-line client
2. Setting up an account on a Casper Network
3. Acquiring the IP address of a peer on the official Testnet or Mainnet  

## Casper Command-line Client {#the-casper-command-line-client}

You can find the default Casper client on [crates.io](https://crates.io/crates/casper-client). This client communicates with the network to transmit your deployments.

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

[Instructions]( https://github.com/casper-network/casper-node/tree/master/client)

## Setting up an Account {#setting-up-an-account}

The [Account](/design/accounts.md) creation process consists of two steps:

1. Creating the account
2. Funding the account

## Creating an Account {#creating-an-account}

The Casper blockchain uses an on-chain account-based model, uniquely identified by an `AccountHash` derived from a specific `PublicKey`.

By default, a transactional interaction with the blockchain takes the form of a `Deploy` cryptographically signed by the key-pair corresponding to the `PublicKey` used to create the account.

Users can create an account through the Casper command-line client. Alternatively, some Casper networks such as the official Testnet and Mainnet provide a browser-based block explorer that allows account creation.

Using the Casper command-line client or a block explorer to create an account on the blockchain will also create a cryptographic key-pair. This process generates three files for each account:

* A PEM encoded secret key
* A PEM encoded public key
* A hexadecimal-encoded string representation of the public key

We recommend saving these files securely.

### Option 1: Key generation using the Casper client {#option-1-key-generation-using-the-casper-client}

This option describes how you can use the Casper command-line client to set up your accounts. For more information about cryptographic keys, see [Working with Cryptographic Keys](/dapp-dev-guide/keys.md).

Execute the following command to generate your keys:

```bash
casper-client keygen .
```

The above command will create three files in the current working directory:

1. `secret_key.pem` - PEM encoded secret key
2. `public_key.pem` - PEM encoded public key
3. `public_key_hex` - Hexadecimal-encoded string of the public key

**Note**: Save your keys to a safe place, preferably offline.

After generating keys for the account, you may add funds to finish the account creation process.

**Note**: Responses from the node contain `AccountHashes` instead of the direct hexadecimal-encoded public key. To view the account hash for a public key, use the account-address option of the client:

```bash
casper-client account-address --public-key <path-to-public_key.pem/public-key-hex>
```

### Option 2: Key generation using a Block Explorer {#option-2-key-generation-using-a-block-explorer}

This option is available on networks that have a block explorer.

For instance, on the official Testnet network, the [CSPR.live](https://testnet.cspr.live/) block explorer is available, and the following instructions assume you are using it.

Start by creating an account using the [Casper Signer](../workflow/signer-guide.md). The Signer will prompt you to download the secret key of your new account by clicking on the `Download` option. The Signer will download the secret key in a file ending in `secret_key.cer`. We recommend securely storing this file. Note that the account is not stored on chain.

<img src={useBaseUrl("/image/workflow/download-prompt.png")} alt="Signer Secret Key Download Prompt" width="200" />

The Signer does not allow you to download the corresponding public key and hexadecimal representation of the public key. But, you can view them if you click the account details.

<img src={useBaseUrl("/image/workflow/account-details.png")} alt="Signer Account Details" width="200" class="inline-img" />

For [ed25519](/dapp-dev-guide/keys.md#eddsa-keys) keys, you can generate the `public_key.pem` and `public_key_hex` using [these commands](https://github.com/casper-network/casper-node/wiki/ed25519-public-keys-from-secret_key.pem).

## Fund your Account {#fund-your-account}

After generating the cryptographic key-pair for the account, you must then fund the account to create it on chain.

In Testnet, you can fund the account by using the **Request tokens** button on the [Faucet Page](https://testnet.cspr.live/tools/faucet) to receive tokens.

In Mainnet, a pre-existing account will have to transfer CSPR tokens to finalize the process of setting up an account. The _Source_ account needs to transfer CSPR tokens to the hexadecimal-encoded public key of the _Target_ account. This transfer will automatically create the _Target_ account if it does not exist. Currently, this is the only way to create an account on Mainnet.

## Acquiring a Node Address from the Network {#acquire-node-address-from-network-peers}

Clients can interact with a node on the blockchain via requests sent to that node's JSON-RPC endpoint, `http://<node-ip-address>:7777` by default.

The node address is the IP of a peer node.

Both the official Testnet and Mainnet provide block explorers that list the IP addresses of nodes on their respective networks.

You can get the `node-ip-address` of a node on the network by visiting the following block explorers:

* [Peers](https://testnet.cspr.live/tools/peers) on Testnet
* [Peers](https://cspr.live/tools/peers) on Mainnet

You will see a list of peers, and you can select the IP of any peer on the list.

**Note**: If the selected peer is unresponsive, pick a different peer and try again.
