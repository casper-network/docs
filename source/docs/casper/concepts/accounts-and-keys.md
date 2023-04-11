---
title: Accounts and Keys
---

# Accounts and Cryptographic Keys

The Casper blockchain uses an on-chain [account-based model](./design/casper-design.md#accounts-head), uniquely identified by an `AccountHash` derived from a specific `PublicKey`. The `AccountHash` is a 32-byte hash derived from any of the supported `PublicKey` variants below to standardize keys that can vary in length.

By default, a transactional interaction with the blockchain takes the form of a `Deploy` cryptographically signed by the key-pair corresponding to the `PublicKey` used to create the account.

The Casper platform supports two types of keys for creating accounts and signing transactions: 
- [ed25519](#eddsa-keys) keys, which use the Edwards-curve Digital Signature Algorithm (EdDSA) and are 66 bytes long
- [secp256k1](#ethereum-keys) keys, commonly known as Ethereum keys, which are 68 bytes long

You can generate keys using both formats, and it is also possible to [work with existing Ethereum keys](#working-with-existing-ethereum-keys).

You can also [generate an account hash](#generating-an-account-hash) from a public key with the Casper command-line client.

## Creating Accounts and Keys {#creating-accounts-and-keys}

When you create an account on the Casper blockchain, a cryptographic key-pair will be created when using either the [Casper command-line client](#option-1-key-generation-using-the-casper-client) or a block explorer.

:::note

SAVE your keys to a safe place, preferably offline.

:::

### Generating Keys using the Casper Client {#option-1-key-generation-using-the-casper-client}

This option describes how you can use the Casper command-line client to set up an account using either key type.

#### EdDSA Keys {#eddsa-keys}

The command-line client generates EdDSA keys by default. Use the command below to create the account.

```bash
mkdir ed25519-keys
casper-client keygen ed25519-keys/
tree ed25519-keys/
```
Sample output of the `tree` command shows the contents of the *ed25519-keys* folder:

```bash
ed25519-keys/
├── public_key.pem
├── public_key_hex
└── secret_key.pem

0 directories, 3 files
```

Here are some details about the files generated:
1. `public_key.pem` is a *PEM*-encoded public key
2. `public_key_hex` is a hexadecimal-encoded string of the public key
3. `secret_key.pem` is the *PEM*-encoded secret key

The public-key-hex for `ed25519` keys starts with 01 and is 66 bytes long:

```bash
cat ed25519-keys/public_key_hex
011724c5c8e2404ca01c872e1bbd9202a0114e5d143760f685086a5cffe261dabd
```

#### Ethereum Keys {#ethereum-keys}

To create `secp256k1` keys with the Casper command-line client, commonly known as Ethereum keys, follow these steps:

```bash
mkdir secp256k1-keys
casper-client keygen -a secp256k1 secp256k1-keys/
tree secp256k1-keys/
```
Sample output of the `tree` command shows the contents of the *secp256k1-keys* folder:

```bash
secp256k1-keys/
├── public_key.pem
├── public_key_hex
└── secret_key.pem

0 directories, 3 files
```

The public-key-hex for `secp256k1` keys starts with 02 and is 68 bytes long:

```bash
cat secp256k1-keys/public_key_hex
020287e1a79d0d9f3196391808a8b3e5007895f43cde679e4c960e7e9b92841bb98d
```

## Funding your Account

Once you create your account, you can [fund the account's main purse](../developers/prerequisites.md#funding-an-account) to finish the process of setting it up. 

:::note

Until you fund your account's main purse, it does not exist on the blockchain.

:::

## Working with Existing Ethereum Keys {#working-with-existing-ethereum-keys}

You can also use existing Ethereum keys in Casper. Here is an example set of Ethereum keys and their corresponding address:

```
Address:0x7863B6F7232D99FF80B74E4C8BB3BEE3BDE0291F
Public key:0470fecd1f7ae5c1cd53a52c4ca88cd5b76c2926d7e1d831addaa2a64bea9cc3ede6a8e9981c609ee7ab7e3fa37ba914f2fc52f6eea9b746b6fe663afa96750d66
Private key:29773906aef3ee1f5868371fd7c50f9092205df26f60e660cafacbf2b95fe086
```

To use existing Ethereum keys, the Casper virtual machine (VM) needs to know that the key is a `secp256k1` type. To achieve this, we will prefix the public key hex with 02, as shown in the example below.

The Casper command-line client provides an example of how this works. 

**Example**:

The following transaction sends 10 CSPR.

```bash
casper-client transfer \
--transfer-id 1234567 \
--node-address http://localhost:7777 \
--chain-name casper \
--target-account 020470fecd1f7ae5c1cd53a52c4ca88cd5b76c2926d7e1d831addaa2a64bea9cc3ede6a8e9981c609ee7ab7e3fa37ba914f2fc52f6eea9b746b6fe663afa96750d66 \
--amount 10000000000 \
--secret-key <path-to-secret_key.pem> \
--payment-amount 100000000
```

The Casper command-line client requires the secret key in *PEM* format to send a Deploy from this account. If you want to use existing Ethereum keys with the command-line client, a conversion to *PEM* format is needed.

The following example is a JS script that generates a *PEM* file, using a [key encoder](https://github.com/stacks-network/key-encoder-js) and Node.js. To install these components, do the following:

```bash
sudo apt install nodejs
npm install key-encoder
```

Then create the JS script *convert-to-pem.js* using _vi_ or _nano_, and include this content:

```javascript
var KeyEncoder = require('key-encoder'),
keyEncoder = new KeyEncoder.default('secp256k1');
let priv_hex = "THE SECRET KEY TO ENCODE";
let priv_pem = keyEncoder.encodePrivate(priv_hex, "raw", "pem");
console.log(priv_pem);
```

Then run the script using Node.js and name the secret key.

```bash
node convert-to-pem.js > eth-secret.pem
```

To view the secret key, use `cat <filename>`:

```bash
cat eth-secret.pem
```

Below is the sample output showing the contents of the secret key.

```
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIBjXY+7xZagzTjL4p8bGWS8FPRcW13mgytdu5c3e556MoAcGBSuBBAAK
oUQDQgAEpV4dVaPeAEaH0VXrQtLzjpGt1pui1q08311em6wDCchGNjzsnOY7stGF
tlKF2V5RFQn4rzkwipSYnrqaPf1pTA==
-----END EC PRIVATE KEY-----
```

## Generating an Account Hash {#generating-an-account-hash}

To generate the account hash for a public key, use the *account-address* option of the Casper client. The argument for the *public-key* must be a properly formatted public key. The public key may also be read from a file, which should be one of the two files generated via the *keygen* command: *public_key_hex* or *public_key.pem*.

```bash
casper-client account-address --public-key <FORMATTED STRING or PATH>
```
