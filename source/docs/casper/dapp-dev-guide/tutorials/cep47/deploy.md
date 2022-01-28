
# Contract Deployment
import useBaseUrl from '@docusaurus/useBaseUrl';

Now that you have implemented the smart contract for CEP-47, it's time to deploy it to the blockchain. Deploying the CEP-47 contract is similar to deploying the ERC-20 contract, while only the WASM files and arguments will differ. Refer to the [deploying contracts](/docs/dapp-dev-guide/deploying-contracts) section to learn more about overall contract deployment.
Let's dive into CEP-47 contract deployment process.

### Pre-requisites
Follow the guides in ERC-20 [contract deployment pre-requisites](/docs/dapp-dev-guide/tutorials/erc20/deploy#pre-requisites).
<!-- 
- Set up your machine as per the [prerequisites](/docs/workflow/setup)
- Ensure you have an [Account](https://casper.network/docs/workflow/setup#setting-up-an-account), the associated key pair,  and the required amount of tokens to perform the deploy
- Ensure your [account](https://testnet.cspr.live/tools/faucet) contains enough `CSPR Tokens` to perform the execution. 
  -CSPR Tokens are used to pay for the transactions on the Casper Network. Follow the [transfer tokens](https://casper.network/docs/workflow/token-transfer#2-the-faucet) guide to learn more about token transferring on the Casper Testnet
- Install [Casper client](/dapp-dev-guide/tutorials/counter/setup) to interact with the network -->
## Basic Flow
Here are the basic steps to deploy the CEP-47 contract on the Casper Network.
<img src={useBaseUrl("/image/tutorials/cep-47/CEP-47-deploy-flow.png")} alt="cep-47-deploy-flow" width="600"/>

## Cloning and Building the CEP-47 Contract
This step includes cloning and preparing the CEP-47 contract for the deployment. 

1. Clone the CEP-47 contract from the repository

```bash
git clone https://github.com/casper-ecosystem/casper-nft-cep47.git
```

2. Move to the newly created folder and compile the contract to create the target WASM file and build the WASM 

```bash
cd casper-nft-cep47
make prepare
make build-contract
```

3. Verify the compiled contract
```bash
make test
```

## Getting an IP Address from a Testnet Peer 
Use the [acquire node address](/docs/workflow/setup#acquire-node-address-from-network-peers) section to get a node-ip-address. We use [peers](https://testnet.cspr.live/tools/peers) on Testnet since we are deploying to the Testnet. Select a peer address from the list and do the address format as below,

:::note
Acquire a node address from the Testnet and use port '7777' instead of '35000' to send your deploy. If the selected peer is unresponsive, pick a different peer and try again
:::

A list of peers from Testnet :
<img src={useBaseUrl("/image/tutorials/erc-20/testnet-peers.png")} alt="erc20-deploy-flow" width="800"/>

## Viewing the Network Status
This query captures any information related to the state of the blockchain at the specific time denoted by the network's state root hash.  You need to have the state root hash and the account hash to run the query.

**Getting the state root hash**
This marks a snapshot of the network state at a moment in time.

```bash
casper-client get-state-root-hash --node-address http://<HOST:PORT>
```

- `<HOST:PORT>`: Use the [Node IP address](../erc721/deploy#getting-an-ip-address-from-a-testnet-peer) taken from a Testnet peer

**Getting the account hash**

Run the following command and supply the path to your *public key* in hexadecimal format to get the account hash.

```bash
casper-client account-address --public-key "[PATH_TO_YOUR_KEY]/public_key_hex"
```

**Querying the network state**

Use the command template below to query the network status with regard to your account.

```bash
casper-client query-state \
--node-address http://<HOST:PORT> \
--state-root-hash [STATE_ROOT_HASH] \
--key [ACCOUNT_HASH]
```

## Deploying the Contract
Now you can deploy the contract on the network and check how it behaves. Use the following command template to deploy the contract:

```bash
casper-client put-deploy \
    --node-address http://<HOST:PORT> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
```

- `NETWORK_NAME`: Use the relevant network name. Here we use '*casper-test*'
- `PATH_TO_YOUR_KEY`: Replace this with the actual path of your secret key 
- `PAYMENT_AMOUNT`: Gas amount in tokens needed for contract execution. If there are no adequate tokens, the deploy will not execute and return an error
- `WASM FILE PATH`: The session-path argument should point to the location of your compiled CEP-47 WASM file

:::note
- If you are performing the deploy on the Mainnet, we recommend trying several put deploys on the Testnet to understand the exact amount required for that deploy. Refer to the [note about gas price](/docs/dapp-dev-guide/deploying-contracts#a-note-about-gas-prices) to understand more about payment amounts and gas price adjustments

- **We currently do not refund any tokens as part of a deploy.**

  Eg:- If you spend 10 CSPR for the deployment and it only costs 1 CSPR, you will not receive the extra 9 CSPR. Refer to the [computational cost and gas amounts](https://casper.network/docs/design/execution-semantics#execution-semantics-gas) for further details
:::

Find the sample *put-deploy* command below:

```bash
casper-client put-deploy \
--node-address http://95.216.24.237:7777 \
--chain-name casper-test \
--secret-key "/home/ubuntu/secret_key.pem" \
--payment-amount 1000000 \
--session-path "<machine-path>/<cep47-wasm-file-path>"
```

## Querying the Network Status
You need to get the newest state root hash to view the network status because it has changed with the deploy. The account hash remains the same since you are using the same account. Follow the [view the network state](../cep47/deploy#viewing-the-network-status) to execute this step with the new state root hash.

## Verifying the Deploy
Now you can verify the applied deploy using the `get deploy` command. This will output the details of the applied deploy.

```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> [DEPLOY_HASH]
```

## Querying with Arguments
This step will narrow down the context and check the status of a specific entry point. You will use the details inside the [cep-47 contract](https://github.com/casper-ecosystem/casper-nft-cep47/blob/master/cep47/bin/cep47_token.rs) to derive arguments.

Use the command template below to query the network state with arguments:

```bash
casper-client query-state \
--node-address http://<HOST:PORT> \
--state-root-hash [STATE_ROOT_HASH] \
--key [ACCOUNT_HASH] \
-q "[CONTRACT_NAME/ARGUMENT]"
```

## Sample Deploy on Testnet
The following steps will guide you through the process with actual values and results.

### Cloning the CEP-47 Contract

```bash
git clone https://github.com/casper-ecosystem/casper-nft-cep47.git
```

### Getting an IP Address from a Testnet Peer
Use [peers](https://testnet.cspr.live/tools/peers) site to get the node ip address.
Eg:  http://95.216.24.237:7777

### Viewing the Network Status
Here is the command to query the state of the network:

```bash
casper-client query-state \
--key account-hash-<account-address> \
--node-address http://<HOST:PORT> \
--state-root-hash <hash>
```

**Result**:
This result contains the network state before the deploy. You can see the `named-key` field is empty since we haven't sent the deploy to the network yet.

<details>
<summary>Result from querying the network status</summary>

```bash

```
</details>

### Deploying the Contract
Deploy the contract with this command:

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://85.114.132.129:7777 \
--secret-key "<machine-path>/secret_key.pem" \
--payment-amount 2900000000 \
--session-path "/home/ubuntu/casper-nft-cep47/target/wasm32-unknown-unknown/release/cep47-token.wasm" \
--session-arg "name:string='cep47'" \
--session-arg "name:string='sym'"  
```

**Result**:
This command execution will output the `deploy_hash` of the applied deploy. We can use the deploy_hash to get the details of the deploy.

```bash
{
  {
  "id": 931694842944790108,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "deploy_hash": "b00E59f8aBA5c7aB9...."
  }
}
```

### Viewing the Deploy Details
You can view the details of the applied deploy using the command below:

```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> \
b00E59f8aBA5c7aB9.....
```

**Result**:
This contains the header, payment, and session details along with the execution results.
- If the execution result field appears as `"execution_results":[]`, it means that the deploy hasn't been executed yet. The time to load the execution result may vary depending on the network.

<details>
<summary>Result from querying the deploy</summary>

```bash

```
</details>

### Querying Contract Entry Points
We will query the argument 'name' in this example.

```bash
casper-client query-state --node-address http://95.216.24.237:7777 \
--state-root-hash <hash> \
--key account-hash-<hash> \
-q "<entry-point details>"
```

**Result:**
You can see that the name is `CasperTest` in this example.

```bash

```
