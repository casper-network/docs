import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Client Library Usage

## Installing the SDKs

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

<TabItem value="rust" label="Rust">

Include the casper-client dependency to your `Cargo.toml`:

```
[dependencies]
casper-client="1.5.1"
```

and add it to your `main.rs`:

```rust
extern crate casper_client;
```

Use types and methods from casper_client:

```rust
use casper_client::transfer;
use casper_client::put_deploy;
//...
```

as casper_client functions are asynchronous, a tokyo runtime is necessary for testing:

```
[dependencies]
tokio = { version = "^1.27.0", features = ["full"] }
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
const keypair = Keys.Ed25519.new();
const { publicKey, privateKey } = keypair;
```

Replace `Ed25519` with `Secp256K1` if you wish.

</TabItem>

<TabItem value="python" label="Python">

```python
from pycspr.crypto import KeyAlgorithm, get_key_pair
keypair = get_key_pair(KeyAlgorithm.ED25519)
```

Replace `ED25519` with `SECP256K1` if you wish.

</TabItem>

<TabItem value="rust" label="Rust">

Create a keypair and write the files to a specified `PATH`:
```rust
    casper_client::keygen::generate_files("PATH", "ED25519", false).unwrap();
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
const accountHashHex = publicKey.toAccountHashStr();
```

Note that `accountHashHex` will be prefixed with the text "account-hash-".

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
const keypair = Keys.Ed25519.loadKeyPairFromPrivateFile("./secret_key.pem");
```

Replace `Ed25519` with `Secp256K1` if you wish.

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

<TabItem value="rust" label="Rust">

In Rust, we don't explicitly import the private key as an object, but instead supply its path as an argument when calling functions:

```rust
let deploy_params: casper_client::DeployStrParams = casper_client::DeployStrParams{
    secret_key:"./secret_key.pem",
    timestamp:"",
    ...
};
```

</TabItem>

</Tabs>

---

## Transferring CSPR

Using the `keypair` created [above](#creating-accounts), you can sign a deploy that transfers CSPR.

Replace the `NODE_ADDRESS` and corresponding RPC port with an active node on the network. You can find active online peers for Mainnet on [cspr.live](https://cspr.live/tools/peers) and for Testnet on [testnet.cspr.live](https://testnet.cspr.live/tools/peers). The RPC port is usually `7777`, but it depends on the network's configuration settings.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, DeployUtil } = require("casper-js-sdk");

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc");
const receipientPublicKeyHex = "01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c"

const amount = 2.5e9 // Minimum transfer: 2.5 CSPR
let deployParams = new DeployUtil.DeployParams(
  keypair.publicKey,
  "casper" // or "casper-test" for Testnet
);

const session = DeployUtil.ExecutableDeployItem.newTransferWithOptionalTransferId(
  amount,
  recipientPublicKeyHex
);

const payment = DeployUtil.standardPayment(0.1e9); // Gas payment in motes: 0.1 CSPR
const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
const signedDeploy = DeployUtil.signDeploy(deploy, keypair);

console.log(await casperClient.putDeploy(signedDeploy));
```

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
    amount = int(2.5e9), # Minimum transfer: 2.5 CSPR
    target = recipientPublicKeyBytes
)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

</TabItem>

<TabItem value="rust" label="Rust">

```rust
extern crate casper_client;
async fn send_transfer(){
    let maybe_rpc_id: &str = "";
    let node_address: &str = "http://135.181.216.142:7777";
    let verbosity_level: u64 = 1;
    let amount: &str = "2500000000";
    let target_account: &str = recipient;
    let transfer_id: &str = "1";
    let deploy_params: casper_client::DeployStrParams = casper_client::DeployStrParams{
        secret_key:"./sk_testnet.pem",
        timestamp:"",
        ttl:"50s",
        gas_price:"1000000000",
        chain_name:"casper", // or "casper-test" for testnet
        dependencies: Vec::new(),
        session_account: "01daad67ebbcb725e02a1955a6617512b311435a21ca6d523085aa015d2d1b473a"

    };
    let recipient: &str = "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca";
    let payment_params: casper_client::PaymentStrParams = casper_client::PaymentStrParams::with_amount(amount);
    let result = casper_client::transfer(maybe_rpc_id, node_address, verbosity_level, amount, target_account, transfer_id, deploy_params, payment_params).await.unwrap();
    println!("Deploy response: {:?}", result);
}

#[tokio::main]
async fn main(){
    send_transfer().await;
}
```

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.

---

## Installing Contracts

To install a contract on the network, you need to sign and send a deploy containing the compiled Wasm.

Replace the `NODE_ADDRESS` and corresponding RPC port with an active node on the network. You can find active online peers for Mainnet on [cspr.live](https://cspr.live/tools/peers) and for Testnet on [testnet.cspr.live](https://testnet.cspr.live/tools/peers). The RPC port is usually `7777`, but it depends on the network's configuration settings.

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

<TabItem value="rust" label="Rust">

```rust
extern crate casper_client;
async fn put_deploy(){
    let maybe_rpc: &str = "";
    let verbosity: u64 = 1;
    let node_address: &str = "http://135.181.216.142:7777";
    let deploy_params: casper_client::DeployStrParams = casper_client::DeployStrParams{
        secret_key:"./sk_testnet.pem",
        timestamp:"",
        ttl:"50s",
        gas_price:"1000000000",
        chain_name:"casper", // or "casper-test"
        dependencies: Vec::new(),
        session_account: "01daad67ebbcb725e02a1955a6617512b311435a21ca6d523085aa015d2d1b473a"

    };
    // Without session args:
    // let session_args: Vec<&str> = Vec::new();
    // With session args:
    let mut session_args: Vec<&str> = Vec::new();
    session_args.push("argument:String='hello world'");
    let session_params: casper_client::SessionStrParams = casper_client::SessionStrParams::with_path("./contract.wasm", session_args, "");
    let payment_params: casper_client::PaymentStrParams = casper_client::PaymentStrParams::with_amount("10000000000");
    let result = casper_client::put_deploy(maybe_rpc_id, node_address, verbosity_level, deploy_params, session_params, payment_params).await.unwrap();
    println!("Deploy response: {:?}", result);
}

#[tokio::main]
async fn main(){
    send_transfer().await;
}
```

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.

## Staking

Token staking is a fundamental aspect of the Casper Network, whereby users lock up tokens as collateral in exchange for the ability to participate in the blockchain's consensus mechanism and earn rewards. This delegated Proof-of-Stake consensus mechanism is crucial for the network's effective operation. With the aid of any of the Casper SDKs, you can delegate your tokens to validators and participate in staking on the network.

The delegation functionality is available as a smart contract, which can be found in the [casper-node](https://github.com/casper-network/casper-node) repository. To delegate tokens, first clone the repository:

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
const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey } = require("casper-js-sdk");
const fs = require("fs");

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc")
const contract = new Contracts.Contract(casperClient)

const contractWasm = new Uint8Array(fs.readFileSync("./casper-node/target/wasm32-unknown-unknown/release/delegate.wasm").buffer);

const runtimeArguments = RuntimeArgs.fromMap({
    "amount": CLValueBuilder.u512(500e9), // Minimum delegation amount: 500 CSPR
    "delegator": keypair.publicKey,
    "validator": CLPublicKey.fromHex("01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c")
});

const deploy = contract.install(
    contractWasm,
    runtimeArguments,
    "5000000000", // Gas payment (5 CSPR)
    keypair.publicKey,
    "casper", // or "casper-test" for testnet
    [keypair]
);

(async () => {
    console.log(await casperClient.putDeploy(deploy));
})();    
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
    amount = int(500e9), # Minimum delegation amount: 500 CSPR
    public_key_of_delegator = keypair,
    public_key_of_validator = validator_public_key,
    path_to_wasm = "./casper-node/target/wasm32-unknown-unknown/release/delegate.wasm"
)

deploy.approve(keypair)
client.send_deploy(deploy)
print(deploy.hash.hex())
```

</TabItem>

<TabItem value="rust" label="Rust">

```rust
extern crate casper_client;
async fn put_deploy(){
    let maybe_rpc: &str = "";
    let verbosity: u64 = 1;
    let node_address: &str = "http://135.181.216.142:7777";
    let deploy_params: casper_client::DeployStrParams = casper_client::DeployStrParams{
        secret_key:"./sk_testnet.pem",
        timestamp:"",
        ttl:"50s",
        gas_price:"1000000000",
        chain_name:"casper", // or "casper-test" for testnet
        dependencies: Vec::new(),
        session_account: "01daad67ebbcb725e02a1955a6617512b311435a21ca6d523085aa015d2d1b473a"

    };
    let mut session_args: Vec<&str> = Vec::new();
    session_args.push("amount:U512='500000000000'");
    
    session_args.push("delegator:public_key='01daad67ebbcb725e02a1955a6617512b311435a21ca6d523085aa015d2d1b473a'");
    session_args.push("validator:public_key='validator_public_key'");
  
    let session_params: casper_client::SessionStrParams = casper_client::SessionStrParams::with_path("./delegate.wasm", session_args, "");
    let payment_params: casper_client::PaymentStrParams = casper_client::PaymentStrParams::with_amount("5000000000");
    let result = casper_client::put_deploy(maybe_rpc, node_address, verbosity, deploy_params, session_params, payment_params).await.unwrap();
    println!("Deploy result: {:?}", result);
}

#[tokio::main]
async fn main(){
    put_deploy().await;
}
```

</TabItem>

</Tabs>

Once submitted, the above snippet will print the deploy hash in the console.

---

## Calling Contracts

Smart contracts on a Casper network are invoked by calling entry points. See below how to use Casper's SDKs to interact with these entry points and update the global state from a dApp:

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc");
const contract = new Contracts.Contract(casperClient);
contract.setContractHash(
	"hash-a3cac24aec9de1bbdb87083587b14d8aeffba5dfed27686512b7bb5dee60445d"
);
const runtimeArguments = RuntimeArgs.fromMap({
  "message": CLValueBuilder.string("Hello world!")
})
const deploy = contract.callEntrypoint(
  "update_msg",
  runtimeArguments,
  keypair.publicKey,
  "casper", // or "casper-test" for Testnet
  "1000000000", // 1 CSPR (10^9 Motes)
  [keypair]
);
(async () => {
  console.log(await casperClient.putDeploy(deploy))
})();
```

</TabItem>

<TabItem value="python" label="Python">

```python
import pycspr
client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = 7777))
deployParams = pycspr.create_deploy_parameters(
    account = keypair,
    chain_name = "casper-test"
)
payment = pycspr.create_standard_payment(10_000_000_000)
session = pycspr.types.StoredContractByHash(
    entry_point = "update_msg",
    hash = bytes.fromhex("a3cac24aec9de1bbdb87083587b14d8aeffba5dfed27686512b7bb5dee60445d"),
    args = {
        "message": pycspr.types.CL_String("Hello world!"),
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

---

## Staking

Token staking is a fundamental aspect of a Casper network, whereby users lock up tokens as collateral in exchange for the ability to participate in the blockchain's consensus mechanism and earn rewards. This delegated Proof-of-Stake consensus mechanism is crucial for the network's effective operation. With the aid of any of the Casper SDKs, you can delegate your tokens to validators and participate in staking on the network.

The delegation functionality is available as a smart contract, which can be found in the [casper-node](https://github.com/casper-network/casper-node) repository. To delegate tokens, first clone the repository:

```bash
git clone https://github.com/casper-network/casper-node.git
cd casper-node/
```

Then compile the [delegate contract](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/client/delegate/src/main.rs):

```bash
make setup-rs
make build-contract-rs/delegate
```

Now, navigate back to your project's root directory. In your dApp's backend (or standalone script), load the *delegate.wasm* file into memory and deploy it with the arguments "amount", "delegator", and "validator" included.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey } = require("casper-js-sdk");
const fs = require("fs");

const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc")
const contract = new Contracts.Contract(casperClient)

const contractWasm = new Uint8Array(fs.readFileSync("./casper-node/target/wasm32-unknown-unknown/release/delegate.wasm").buffer);

const runtimeArguments = RuntimeArgs.fromMap({
    "amount": CLValueBuilder.u512(500e9), // Minimum delegation amount: 500 CSPR
    "delegator": keypair.publicKey,
    "validator": CLPublicKey.fromHex("01e8c84f4fbb58d37991ef373c08043a45c44cd7f499453fa2bd3e141cc0113b3c")
});

const deploy = contract.install(
    contractWasm,
    runtimeArguments,
    "5000000000", // Gas payment (5 CSPR)
    keypair.publicKey,
    "casper", // or "casper-test" for testnet
    [keypair]
);

(async () => {
    console.log(await casperClient.putDeploy(deploy));
})();    
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
    amount = int(500e9), # Minimum delegation amount: 500 CSPR
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
