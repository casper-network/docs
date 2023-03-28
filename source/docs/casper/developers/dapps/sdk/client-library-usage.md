import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Client Library Usage

## Installation

<Tabs>

<TabItem value="js" label="JavaScript">

Use `npm` or `yarn` to install [casper-js-sdk](https://www.npmjs.com/package/casper-js-sdk) package:

```bash
npm install casper-js-sdk
```
```bash
yarn install casper-js-sdk
```

</TabItem>

<TabItem value="python" label="Python">

Use [`pip`](https://pypi.org/project/pip/) to install [pycspr](https://pypi.org/project/pycspr/) package:

```bash
pip install pycspr
```

</TabItem>

</Tabs>

---

## Accounts

You may use the SDKs to interact with accounts on the Casper Network. Accounts can be of either ed25519 or secp256k1 cryptography.

### Create new keypair

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { Keys } = require("casper-js-sdk");
const keypair = Keys.ALGO.new();
const { publicKey, privateKey } = keypair;
```

Replace `ALGO` with your key algorithm: `Ed25519` or `Secp256K1`.

</TabItem>

<TabItem value="python" label="Python">

```python
from pycspr.crypto import KeyAlgorithm, get_key_pair
keypair = get_key_pair(KeyAlgorithm.ALGO)
```

Replace `ALGO` with your key algorithm: `ED25519` or `SECP256K1`.

</TabItem>

</Tabs>

### Exporting Keys

In your `keypair` variable is a private key and a public key. There are many reasons you may want to use, read, or export your public key. You may also want access to the account hash as it is often used within smart contracts on the Casper Network. The following methods show you how to dissect your keypair.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
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

### Load from private key

When you want to use a specific account, you should not include your private key within your source code, but instead load in your keypair from a local file.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { Keys } = require("casper-js-sdk");
const keypair = Keys.ALGO.loadKeyPairFromPrivateFile("./secret_key.pem");
```

Replace `ALGO` with your key algorithm: `Ed25519` or `Secp256K1`.

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr
keypair = pycspr.parse_private_key(
    "./secret_key.pem",
    pycspr.crypto.KeyAlgorithm.ALGO
)
```

Replace `ALGO` with your key algorithm: `ED25519` or `SECP256K1`.

</TabItem>

</Tabs>

---

## Transferring CSPR

Using the `keypair` created above in [Accounts](#accounts), you can sign a CSPR transferral deploy.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, DeployUtil } = require("casper-js-sdk");

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc");
const receipientPublicKeyHex = "01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c"

const amount = 25e8 // Minimum transfer, 2.5 CSPR
let deployParams = new DeployUtil.DeployParams(
  keypair.publicKey,
  "casper" // or "casper-test" for testnet
);

const session = DeployUtil.ExecutableDeployItem.newTransferWithOptionalTransferId(
  amount,
  recipientPublicKeyHex
);

const payment = DeployUtil.standardPayment(1e8); // Gas payment in motes, 0.1 CSPR
const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
const signedDeploy = DeployUtil.signDeploy(deploy, keypair);

console.log(await casperClient.putDeploy(signedDeploy));
```

*Note: You can find active online peers to communicate with from the `CasperClient` object at [cspr.live](https://cspr.live/tools/peers) for mainnet and for testnet: [testnet.cspr.live](https://testnet.cspr.live/tools/peers).*

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr

client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = 7777))
recipientPublicKeyHex = "01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c"
recipientPublicKeyBytes = pycspr.crypto.cl_checksum.decode(recipientPublicKeyHex)

deployParams = pycspr.create_deploy_parameters(
    account = keypair,
    chain_name = "casper" # or "casper-test" for testnet
)

deploy = pycspr.create_transfer(
    params = deployParams,
    amount = int(25e8), # Minimum transfer, 2.5 CSPR
    target = recipientPublicKeyBytes
)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

*Note: You can find active online peers to communicate with from the `NodeConnection` object at [cspr.live](https://cspr.live/tools/peers) for mainnet and for testnet: [testnet.cspr.live](https://testnet.cspr.live/tools/peers).*

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.

---

## Installing Contracts

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder } = require("casper-js-sdk")
const fs = require("fs")

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc")
const contract = new Contracts.Contract(casperClient)

const contractWasm = new Uint8Array(fs.readFileSync("/path/to/contract.wasm").buffer)

const runtimeArguments = RuntimeArgs.fromMap({
  "argument": CLValueBuilder.string("Hello world!")
})

const deploy = contract.install(
	contractWasm,
	runtimeArguments,
	"10000000000", // Gas payment (10 CSPR)
	keypair.publicKey,
	"casper", // or "casper-test" for testnet
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
    chain_name = "casper" # or "casper-test" for testnet
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

## Staking

Token staking is vital to the Casper Network, enabling its delegated Proof-of-Stake consensus mechanism to operate effectively. With the help of any of the Casper SDKs, you can stake tokens by delegating them to validators.

The delegation functionality exists as a piece of session code obtainable from the [casper-node](https://github.com/casper-network/casper-node) repository. To delegate tokens, first clone the repository:

```bash
git clone https://github.com/casper-network/casper-node.git
cd casper-node/
```

Then compile the [delegate contract](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/client/delegate/src/main.rs):

```bash
make setup-rs
make build-contract-rs/delegate
```

Now, assuming that you cloned `casper-node` from your project's root directory, `cd` back into it:

```bash
cd ../
```

Now in your dApp's backend (or standalone script), load the *delegate.wasm* file into memory and deploy it with the arguments "amount", "delegator", and "validator" included.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey } = require("casper-js-sdk")
const fs = require("fs")

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc")
const contract = new Contracts.Contract(casperClient)

const contractWasm = new Uint8Array(fs.readFileSync("./casper-node/target/wasm32-unknown-unknown/release/delegate.wasm").buffer)

const runtimeArguments = RuntimeArgs.fromMap({
  "amount": CLValueBuilder.u512(5e11), // 500 CSPR, minimum delegation amount
	"delegator": keypair.publicKey,
  "validator": CLPublicKey.fromHex("01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c")
})

const deploy = contract.install(
	contractWasm,
	runtimeArguments,
	"5000000000", // Gas payment (5 CSPR)
	keypair.publicKey,
	"casper", // or "casper-test" for testnet
	[keypair]
)

console.log(await casperClient.putDeploy(deploy))
```

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr

validator_public_key = pycspr.factory.accounts.create_public_key_from_account_key(
	bytes.fromhex("01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c")
)

deploy_params = pycspr.create_deploy_parameters(
	account = keypair, # Only the public key is used, see `create_deploy_parameters`
	chain_name = "casper" # or "casper-test" for testnet
)

deploy = pycspr.create_validator_delegation(
	params = deploy_params,
	amount = int(5e11), # 500 CSPR, minimum delegation amount
	public_key_of_delegator = keypair,
	public_key_of_validator = validator_public_key,
	path_to_wasm = "./casper-node/target/wasm32-unknown-unknown/release/delegate.wasm"
)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.