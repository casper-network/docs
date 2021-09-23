# Working with Cryptographic Keys

The Casper platform supports two types of signatures for creating accounts and signing transactions: `secp256k1` and `ed25519`. You can generate keys using the Casper client in both formats. It is also possible to work with existing Ethereum keys.

## Key Generation {#key-generation}

### Ethereum Keys {#ethereum-keys}

To create `secp256k1` keys, commonly known as Ethereum keys, follow these steps:

```bash
$ mkdir secp256k1-keys

$ casper-client keygen -a secp256k1 secp256k1-keys/
Keys successfully created in directory: /secp256k1-keys

$ tree secp256k1-keys/
secp256k1-keys/
├── public_key.pem
├── public_key_hex
└── secret_key.pem
```

Looking at the public-key-hex file, we see that `secp256k1` public hex keys start with _02_ in Casper:

```bash
$ cat secp256k1-keys/public_key_hex
020287e1a79d0d9f3196391808a8b3e5007895f43cde679e4c960e7e9b92841bb98d
```

### EdDSA Keys {#eddsa-keys}

It is also possible to create `ed25519` keys, which use the Edwards-curve Digital Signature Algorithm (EdDSA). To generate EdDSA keys, follow these steps:

```bash
$ mkdir ed25519-keys

$ casper-client keygen ed25519-keys/
Keys successfully created in the directory: /ed25519-keys

$ tree ed25519-keys/
ed25519-keys/
├── public_key.pem
├── public_key_hex
└── secret_key.pem
```

Looking at the public-key-hex file, we see that keys of this type are pre-pended with \`01\`:

```bash
$ cat ed25519-keys/public_key_hex
011724c5c8e2404ca01c872e1bbd9202a0114e5d143760f685086a5cffe261dabd
```

## Working with Existing Ethereum Keys {#working-with-existing-ethereum-keys}

It is also possible to use existing Ethereum keys in Casper. Here is an example set of Ethereum keys and their corresponding address:

```
Address:0x7863B6F7232D99FF80B74E4C8BB3BEE3BDE0291F
Public key:0470fecd1f7ae5c1cd53a52c4ca88cd5b76c2926d7e1d831addaa2a64bea9cc3ede6a8e9981c609ee7ab7e3fa37ba914f2fc52f6eea9b746b6fe663afa96750d66
Private key:29773906aef3ee1f5868371fd7c50f9092205df26f60e660cafacbf2b95fe086
```

To use existing Ethereum keys, the Casper VM needs to know that the key is a `secp256k1` type.

The Rust _casper-client_ provides an example of how this works. Pre-pending the public key with a _02_ indicates the key is a `secp256k1` key.

**Example**:

The following transaction sends 100 CSPR.

```bash
casper-client transfer --node-address http://localhost:7777 --chain-name casper -t 020470fecd1f7ae5c1cd53a52c4ca88cd5b76c2926d7e1d831addaa2a64bea9cc3ede6a8e9981c609ee7ab7e3fa37ba914f2fc52f6eea9b746b6fe663afa96750d66 -a 10000000000 -k /home/mykeys/secret_key.pem -p 10000
```

The Rust _casper-client_ requires the secret key to be in _PEM_ format to send a transaction from this account. If you want to use existing Ethereum keys with the Rust client, a conversion to _PEM_ format is needed.

The following example is a JS script that generates a _PEM_ file, using [key encoder](https://github.com/blockstack/key-encoder-js) and node.js. To install these components, do the following:

```bash
$ sudo apt install nodejs
$ npm install key-encoder
```

Then create the JS script `convert-to-pem.js` using _vi_ or _nano_ and include this content:

```bash
var KeyEncoder = require('key-encoder'),
keyEncoder = new KeyEncoder.default('secp256k1');
let priv_hex = "THE SECRET KEY TO ENCODE";
let priv_pem = keyEncoder.encodePrivate(priv_hex, "raw", "pem");
console.log(priv_pem);
```

Then run the script using node.js. Name the secret key something different.

```bash
$ node convert-to-pem.js > eth-secret.pem
```

To view the secret key, use \`cat\`:

```bash
$ cat eth-secret.pem
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIBjXY+7xZagzTjL4p8bGWS8FPRcW13mgytdu5c3e556MoAcGBSuBBAAK
oUQDQgAEpV4dVaPeAEaH0VXrQtLzjpGt1pui1q08311em6wDCchGNjzsnOY7stGF
tlKF2V5RFQn4rzkwipSYnrqaPf1pTA==
-----END EC PRIVATE KEY-----
```
