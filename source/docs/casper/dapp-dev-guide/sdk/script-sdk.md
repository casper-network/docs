# TypeScript/JavaScript SDK

The [TypeScript/JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk) allows developers to interact with the Casper Network using TypeScript or JavaScript. This page covers different examples of using the SDK. You can also explore various open [projects](https://github.com/casper-network/casper-java-sdk/projects/1) or [issues](https://github.com/casper-network/casper-java-sdk/issues) in GitHub.

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

For a complete implementation example, read the [Multi-Signature Tutorial](https://docs.casperlabs.io/en/latest/dapp-dev-guide/tutorials/multi-sig/index.html), which uses the JavaScript SDK.

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

    // Get account-address from public key
    const accountAddress = publicKey.toHex();

    // Get account-hash (Uint8Array) from public key
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

After generating the keys with this code, you can add them to the [CasperLabs Signer Chrome extension](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce?hl=en-US) and use them to sign your transactions.

### Sending a Transfer {#sending-a-transfer}

This code block shows you how to define and send a transfer on the Casper Network. Replace the `account-address` in the code below with the sender's account address.

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
    const paymentAmount = 10000000000;

    // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage
    const id = 187821;

    // gasPrice for native transfers can be set to 1
    const gasPrice = 1;

    // Time that the deploy will remain valid for, in milliseconds
    // The default value is 1800000 ms (30 minutes)
    const ttl = 1800000;

    let deployParams = new DeployUtil.DeployParams(signKeyPair.publicKey, networkName, gasPrice, ttl);

    // We create a public key from account-address (it is the hex representation of the public-key with an added prefix)
    const toPublicKey = CLPublicKey.fromHex(to);

    const session = DeployUtil.ExecutableDeployItem.newTransfer(amount, toPublicKey, null, id);

    const payment = DeployUtil.standardPayment(paymentAmount);
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair);

    // Here we are sending the signed deploy
    return await casperClient.putDeploy(signedDeploy);
};

sendTransfer({
    // Put here the account-address of the sender's account. Note that it needs to have a balance greater than 2.5CSPR
    from: "<account-address>",

    // Put here the account-address of the receiving account. This account doesn't need to exist. If the key is correct, the network will create it when the deploy is sent
    to: "<account-address>",

    // Minimal amount is 2.5CSPR so 2.5 * 10000 (1CSPR = 10.000 motes)
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

## Additional Resources {#additional-resources}

If you are looking for additional examples, another great resource is the [BitGo JS implementation](https://github.com/BitGo/BitGoJS/tree/master/modules/account-lib/src/coin/cspr>).
