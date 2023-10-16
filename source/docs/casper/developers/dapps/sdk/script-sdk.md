# JavaScript/TypeScript SDK

This page contains details related to a few JavaScript (JS) clients and the Casper JS SDK.

## Usage of JavaScript Clients {#usage-of-javascript-clients}

The Casper team has implemented specific JS clients to support interaction with the Casper contracts.

### Repository & Client Packages {#repository-7-client-packages}

We provide repositories to create clients for Casper contracts and usage examples of such clients dedicated to interacting with smart contracts on Casper:

- The [Casper CEP-78 (NFT) Client](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/client-js/README.md)
- The [Casper CEP-18 Client](https://github.com/casper-ecosystem/cep18/tree/master/client-js#readme)

These packages give you an easy way to install and interact with the corresponding Casper contract.

## Casper SDK for JavaScript {#casper-sdk-for-javascript}

The [TypeScript/JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk) allows developers to interact with a Casper network using TypeScript or JavaScript. This section covers different examples of using the Casper JS SDK.

## Installation {#installation}

To install this library using Node.js, run the following command:

```bash
npm install casper-js-sdk@next --save
```

## Tests {#tests}

You can find basic examples for how to use this library in the `test` directory. To run the tests, use this command:

```bash
npm run test
```

## Usage Examples {#usage-examples}

In this section, we outline a couple of essential tasks you can accomplish with the JavaScript SDK:

-   Generating account keys
-   Sending a transfer

### Generating Account Keys {#generating-account-keys}

This example shows you how to use the SDK to generate account keys to sign your deploy.

```javascript
const fs = require("fs");
const path = require("path");
const { Keys } = require("casper-js-sdk");

const createAccountKeys = () => {
    // Generating keys
    const edKeyPair = Keys.Ed25519.new();
    const { publicKey, privateKey } = edKeyPair;

    // Create a hexadecimal representation of the public key
    const accountAddress = publicKey.toHex();

    // Get the account hash (Uint8Array) from the public key
    const accountHash = publicKey.toAccountHash();

    // Store keys as PEM files
    const publicKeyInPem = edKeyPair.exportPublicKeyInPem();
    const privateKeyInPem = edKeyPair.exportPrivateKeyInPem();

    const folder = path.join("./", "casper_keys");

    if (!fs.existsSync(folder)) {
        const tempDir = fs.mkdirSync(folder);
    }

    fs.writeFileSync(folder + "/" + accountAddress + "_public.pem", publicKeyInPem);
    fs.writeFileSync(folder + "/" + accountAddress + "_private.pem", privateKeyInPem);

    return accountAddress;
};

const newAccountAddress = createAccountKeys();
```

After generating the keys with this code, you can add them to the [Casper Wallet Chrome extension](https://www.casperwallet.io/) and use them to sign your transactions.

### Sending a Transfer {#sending-a-transfer}

This code block shows you how to define and send a transfer on a Casper network. Replace the `sender-public-key` and `recipient-public-key` in the code below.

The `sendTransfer` function below will return a `transfer-hash` which you can check on https://testnet.cspr.live/.

```javascript
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const casperClientSDK = require("casper-js-sdk");

const { Keys, CasperClient, CLPublicKey, DeployUtil } = require("casper-js-sdk");

const RPC_API = "http://159.65.203.12:7777/rpc";
const STATUS_API = "http://159.65.203.12:8888";

const sendTransfer = async ({ from, to, amount }) => {
    const casperClient = new CasperClient(RPC_API);

    const folder = path.join("./", "casper_keys");

    // Read keys from the structure created in #Generating keys
    const signKeyPair = Keys.Ed25519.parseKeyFiles(folder + "/" + from + "_public.pem", folder + "/" + from + "_private.pem");

    // networkName can be taken from the status api
    const response = await axios.get(STATUS_API + "/status");

    let networkName = null;

    if (response.status == 200) {
        networkName = response.data.chainspec_name;
    }

    // For native-transfers the payment price is fixed
    const paymentAmount = 100000000;

    // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage
    const id = 187821;

    // gasPrice for native transfers can be set to 1
    const gasPrice = 1;

    // Time that the deploy will remain valid for, in milliseconds
    // The default value is 1800000 ms (30 minutes)
    const ttl = 1800000;

    let deployParams = new DeployUtil.DeployParams(signKeyPair.publicKey, networkName, gasPrice, ttl);

    // We create a hex representation of the public key with an added prefix
    const toPublicKey = CLPublicKey.fromHex(to);

    const session = DeployUtil.ExecutableDeployItem.newTransfer(amount, toPublicKey, null, id);

    const payment = DeployUtil.standardPayment(paymentAmount);
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair);

    // Here we are sending the signed deploy
    return await casperClient.putDeploy(signedDeploy);
};

sendTransfer({
    // Put here the public key of the sender's main purse. Note that it needs to have a balance greater than 2.5 CSPR
    from: "<sender-public-key>",

    // Put here the public key of the recipient's main purse. This account doesn't need to exist. If the key is correctly formatted, the network will create the account when the deploy is sent
    to: "<recipient-public-key>",

    // Minimal amount is 2.5 CSPR (1 CSPR = 1,000,000,000 motes)
    amount: 25000000000,
});
```

**Note**: At any moment, you can serialize the deploy from this example to JSON to accomplish whatever you want (store it, send it, etc.).

Here is the code you can use to serialize the deploy:

```javascript
const jsonFromDeploy = DeployUtil.deployToJson(signedDeploy);
```

Then, you can reconstruct the deploy object using this function:

```javascript
const deployFromJson = DeployUtil.deployFromJson(jsonFromDeploy);
```

