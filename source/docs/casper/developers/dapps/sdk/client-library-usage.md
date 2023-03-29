import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Client Library Usage

## Installing SDK Client Libraries

<Tabs>

<TabItem value="js" label="JavaScript">

Use `npm` or `yarn` to install the [casper-js-sdk](https://www.npmjs.com/package/casper-js-sdk) package:

```bash
npm install casper-js-sdk
```
```bash
yarn install casper-js-sdk
```

</TabItem>

<TabItem value="python" label="Python">

Use [`pip`](https://pypi.org/project/pip/) to install the [pycspr](https://pypi.org/project/pycspr/) package:

```bash
pip install pycspr
```

</TabItem>

</Tabs>

---

## Creating Accounts

You may use the SDKs to interact with accounts on a Casper network. Accounts can use either an Ed25519 or Secp256k1 digital signature scheme. See the [Accounts and Cryptographic Keys](../../../concepts/accounts-and-keys.md) page for more details.

### Creating new account keys

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { Keys } = require("casper-js-sdk");
const keypair = Keys.ED25519.new();
const { publicKey, privateKey } = keypair;
```

Replace `ED25519` with `SECP256K1` if you wish.

</TabItem>

<TabItem value="python" label="Python">

```python
from pycspr.crypto import KeyAlgorithm, get_key_pair
keypair = get_key_pair(KeyAlgorithm.ED25519)
```

Replace `ED25519` with `SECP256K1` if you wish.

</TabItem>

</Tabs>

### Exporting the public key and account hash

The `keypair` variable contains the private and public key pair for the account. You can use, read, or export the public key. You may also want access to the account hash, often used within smart contracts on a Casper network. The following methods show how to extract the public key and account hash.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
// Create a hexadecimal representation of the public key and account hash.
const publicKeyHex = publicKey.toHex();
const accountHashBytes = publicKey.toAccountHash();
const accountHashHex = Buffer.from(accountHashBytes).toString('hex');
```

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr.crypto

publicKeyBytes = keypair.account_key
publicKeyHex = pycspr.crypto.cl_checksum.encode(publicKeyBytes)
accountHashBytes = pycspr.crypto.cl_operations.get_account_hash(publicKeyBytes)
accountHashHex = pycspr.crypto.cl_checksum.encode(accountHashBytes)
```

</TabItem>

</Tabs>

### Uploading the secret key from a file

To use a specific account, you should not include the private key in the source code; instead, upload the account's secret key from a local file. Update the path to the file in the example below.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { Keys } = require("casper-js-sdk");
const keypair = Keys.ED25519.loadKeyPairFromPrivateFile("./secret_key.pem");
```

Replace `ED25519` with `SECP256K1` if you wish.

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr
keypair = pycspr.parse_private_key(
    "./secret_key.pem",
    pycspr.crypto.KeyAlgorithm.ED25519
)
```

Replace `ED25519` with `SECP256K1` if you wish.

</TabItem>

</Tabs>

---

## Transferring CSPR

Using the `keypair` created above in [Accounts](#accounts), you can sign a deploy that transfers CSPR.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, DeployUtil } = require("casper-js-sdk");

const casperClient = new CasperClient("http://NODE_ADDRESS:7777");
const receipientPublicKeyHex = "01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c"

let deployParams = new DeployUtil.DeployParams(
  keypair.publicKey,
  "casper" // or "casper-test" for Testnet
);

const session = DeployUtil.ExecutableDeployItem.newTransferWithOptionalTransferId(
  amount,
  recipientPublicKeyHex
);

const payment = DeployUtil.standardPayment(100000000); // Gas payment in motes
const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
const signedDeploy = DeployUtil.signDeploy(deploy, keypair);

console.log(await casperClient.putDeploy(signedDeploy));
```

*Note: You can find active online peers for Mainnet on [cspr.live](https://cspr.live/tools/peers) and for Testnet on [testnet.cspr.live](https://testnet.cspr.live/tools/peers).*

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr

client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = 7777))
recipientPublicKeyHex = "01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c"
recipientPublicKeyBytes = pycspr.crypto.cl_checksum.decode(recipientPublicKeyHex)

deployParams = pycspr.create_deploy_parameters(
    account = keypair,
    chain_name = "casper" # or "casper-test" for Testnet
)

deploy = pycspr.create_transfer(
    params = deployParams,
    amount = int(2.5e9), # Minimum transfer, 2.5 CSPR
    target = recipientPublicKeyBytes
)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

*Note: You can find active online peers for Mainnet on [cspr.live](https://cspr.live/tools/peers) and for Testnet on [testnet.cspr.live](https://testnet.cspr.live/tools/peers).*

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.

---

## Installing Contracts

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder }

const casperClient = new CasperClient("http://NODE_ADDRESS:7777")
const contract = new Contracts.Contract(client)

const contractWasm = new Uint8Array(fs.readFileSync("/path/to/contract.wasm").buffer)

const runtimeArguments = RuntimeArgs.fromMap({
  "argument": CLValueBuilder.string("Hello world!")
})

const deploy = contract.install(
  contractWasm,
  runtimeArguments,
  "10000000000", // Gas payment (10 CSPR)
  keypair.publicKey,
  "casper", // or "casper-test" for Testnet
  [keypair]
)

console.log(await casperClient.putDeploy(deploy))
```

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr
from pycspr.types import ModuleBytes, CL_String

client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = 7777))

deployParams = pycspr.create_deploy_parameters(
    account = keypair,
    chain_name = "casper" # or "casper-test" for Testnet
)
payment = pycspr.create_standard_payment(10000000000) # 10 CSPR
session = ModuleBytes(
    module_bytes = pycspr.read_wasm("/path/to/contract.wasm"),
    args = {
        "message": CL_String("Hello world!"),
    }
)

deploy = pycspr.create_deploy(deployParams, payment, session)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.
