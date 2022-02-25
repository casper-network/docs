
# Contract Deployment
import useBaseUrl from '@docusaurus/useBaseUrl';

Now that you have implemented the smart contract for CEP-47, it's time to deploy it to the blockchain. The deployment process for CEP-47 contract will be a bit different from ERC-20 contract. You will use a JavaScript client with in-built TypeScript (TS) classes to execute the CEP-47 contract deployment. The JS client also resides in a separate repository. You need to clone that repository to your machine and proceed with the steps to accomplish the deployment.

Let's dive into CEP-47 contract deployment process.

### Pre-requisites
- Set up your machine as per the [prerequisites](/docs/workflow/setup)
- Ensure you have an [Account](/docs/workflow/setup#setting-up-an-account), the associated key pair, and the required amount of tokens to perform the deploy
- Ensure your [account](https://testnet.cspr.live/tools/faucet) contains enough `CSPR Tokens` to perform the execution. 
- CSPR Tokens are used to pay for the transactions on the Casper Network. Follow the [transfer tokens](/docs/workflow/token-transfer#2-the-faucet) guide to learn more about token transferring on the Casper Testnet

## Basic Flows of the Deployment
Here are the basic steps to deploy the CEP-47 contract on the Casper Network.
<img src={useBaseUrl("/image/tutorials/cep-47/CEP-47-deploy-flow.png")} alt="cep-47-deploy-flow" width="800"/>


### Casper Repositories in Use

You will be using two Casper repositories for this deployment process.
-  [CEP-47 Contract Implementation](https://github.com/casper-ecosystem/casper-nft-cep47): This repository contains the implementation of the NFT aka CEP-47 smart contract according to Casper context, required utility Classes, and corresponding test suit to work with the CEP-47 token.
    - You will be using the `cep47-token.wasm` file from this repository for the deployment. This is the compiled implementation of the CEP-47 contract.
-  [Casper JavaScript Client](https://github.com/casper-network/casper-contracts-js-clients): This repository contains the files which execute the Javascript handle for the CEP-47 contract and other supporting classes to run the client. This contains the JavaScript handle for ERC-20 contract as well. 
    - You will be executing the `install.ts` file and `usage.ts` from this repository for the deployment

### Steps to Perform the Deployment

1. [Preparing the CEP-47 smart contract](./deploy#preparing-the-cep-47-smart-contract)
2. [Getting and preparing node addresses for the deployment](./deploy#getting-and-preparing-node-addresses-for-the-deployment)
3. [Preparing JS Client repository](./deploy#preparing-js-client-repository)
4. [Deploying the contract](./deploy#deploying-the-smart-contract-to-the-network)
5. [Deploying the entry points of the contract](../cep47/events)

## Preparing the CEP-47 Smart Contract
Refer to the [contract preparation](../cep47/prepare) step to prepare the CEP-47 contract for deployment. This step will make the build environment, create the target location and compile the contract to a .wasm file.

- Output from this will be a `WASM file` (Eg:- cep47-token.wasm) which is later used by the JS compiler for the contract deployment

## Getting and Preparing Node Addresses for the Deployment
Follow [getting an ip-address from a testnet peer](../erc20/deploy#getting-an-ip-address-from-a-testnet-peer) guide to get a node address for the deployment. Then you have to do some formatting to the address to include in the .env file.

#### NODE_ADDRESS: 
- IP Address of the node
-  Use port '7777' instead of '35000' or any other and add "/rpc" to the end of the address 
    - (Eg:- 195.201.174.222:7777**/rpc**)
     
#### EVENT_STREAM_ADDRESS: 
- Address of the event stream
- To get this, replace 7777/rpc with --> '9999/events/main' phrase 
    - (Eg: 195.201.174.222:**9999/events/main**)

## Preparing JS Client Repository
This JavaScript client helps to install the smart contract on the Casper network and proceed with related actions with CEP-47 token contract. We are using the JavaScript client classes to invoke the NFT installation on the network using pre-defined set of environment variables.

This step includes several sub-steps to achieve the execution.

1. [Clone the JS client repository](./deploy#cloning-the-js-client-repository)
2. [Add the environment variables for the execution](./deploy#adding-the-environment-variables)
3. [Arrange the JS packages and resolve their dependencies using NodeJS](./deploy#arrange-the-js-packages-and-resolve-dependencies)
4. [Build the JS client code](./deploy#building-the-js-client-code)


### Cloning the JS Client Repository
Clone the [casper-contracts-js-clients](https://github.com/casper-network/casper-contracts-js-clients) repository using the below command.

```
git clone https://github.com/casper-network/casper-contracts-js-clients.git
```

### Adding the Environment Variables 
Environment file (.env) contains the individual user environment variables required to execute in a given application's environment. You can customize your environment variables by modifying your .env file. Here, NodeJS automatically loads environment variables into process.env to make them available to the application. 

**Steps to add env variables**

Follow these steps to set up your environment variables to enable the CEP-47 smart contract deployment. 

1. Navigate to the cloned root folder (casper-contracts-js-clients)
2. Create a new environment file named `.env.cep47` 
    - Sample .env file `.env.cep47.example` is already in the root folder 
3. Copy the content(a list of variables with values)) of sample .env file to the new file 
4. Replace the below parameters with your local usage settings
  - ***WASM_PATH***: Directory path for the generated .wasm file
  - ***CHAIN_NAME***: Network name that you are going to deploy the contract
  - ***NODE_ADDRESS***: [Address](./deploy#node_address) of the node 
  - ***EVENT_STREAM_ADDRESS***: [Address](./deploy#event_stream_address) of the event stream
  - ***MASTER_KEY_PAIR_PATH***: Path to the generated key pair
  - ***USER_KEY_PAIR_PATH***: Path to the generated key pair of the other party (In this case, it will be the same as your MASTER_KEY_PAIR_PATH )

:::note
It is mandatory to update the above list of parameters to align with your working environment.


*Note that you can directly include the environment values to the method by modifying [install()](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/install.ts#L52-L63) method in the install.ts file. On this tutorial we will use variables from .env.cep47 file for more clarity.*

:::

### Arrange the JS packages and Resolve Dependencies
Run the npm package management command. This will manage and organize the packages and arrange the dependencies for the node.
```
npm install
```

### Building the JS Client Code 
Use the below command to build the JS client code and create the /dist directories with compiled files.
```
npm run dist
```
After performing all the above steps you can start the deploy contract process and run the usage scenarios.

## Deploying the Smart Contract to the Network
Run the below command to install your smart contract. This will use the selected node address on the Casper Testnet network. Command will execute the `./e2e/cep47/install.ts` file and you can check the outcome from the console.

```
npm run e2e:cep47:install
```
If the execution proceeds without error, you should see a similar console output as below,

<details>
<summary>Console output for contract installation </summary>

```bash
... Contract installation deployHash: 0dcef7e7bddbc5a666aff1afbc03cf4797e3736c71fe05aee9944a26c4eeefab
... Contract installed successfully.
... Account Info:
{
  "_accountHash": "account-hash-179cd876d5c74317cce9c48d718a040e6e909063d7d786de0c5c6421a09fa803",
  "namedKeys": [
    {
      "name": "bdk_nft_contract_contract_hash",
      "key": "hash-a47d35d835a5fa8a1bcd55a4426dc14e21da9b876c1617742f18813737a4ece0"
    },
    {
      "name": "bdk_nft_contract_contract_hash_wrapped",
      "key": "uref-ff9b562d357d9a258acb2b3798f82c6ec5db49a8852e2e96b0ed4b1faf873206-007"
    },
    {
      "name": "contract_package_hash",
      "key": "hash-2468facdc9a6f324f8442584fd46d911e3ac9b434dfa79435567bf71f9b8bd23"
    }
  ],
  "mainPurse": "uref-a33e25cb1e6baa38e8306dba0492183c65cb41db3dbe8f69546868a4c0cfd0d9-007",
  "associatedKeys": [
    {
      "accountHash": "account-hash-179cd876d5c74317cce9c48d718a040e6e909063d7d786de0c5c6421a09fa803",
      "weight": 1
    }
  ],
  "actionThresholds": {
    "deployment": 1,
    "keyManagement": 1
  }
}
... Contract Hash: hash-a47d35d835a5fa8a1bcd55a4426dc14e21da9b876c1617742f18813737a4ece0

```

</details>


### Contract Installation Details
This section clarifies how the contract deployment happens through the installation.js file.

First of all, the system takes the binary of the .wasm file and stores it in the *getBinary* constant.
```javascript
export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};
```

Then, creates the token metadata fetch from the .env.cep47 file

```javascript
const TOKEN_META = new Map(parseTokenMeta(process.env.TOKEN_META!));
```
It also fetch the keys for signing from the .env.cep47 file.

```javascript
const KEYS = Keys.Ed25519.parseKeyFiles(
  `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);
```

Then, it fetches the node address and chain name of the network that you have planned to do the deploy.

```javascript
const test = async () => {
  const cep47 = new CEP47Client(
    NODE_ADDRESS!,
    CHAIN_NAME!
  ); 
```

Run the installation, call *cep47.install()* function. This function will take WASM file path, token meta details, payment amount, public keys, and keys for multiple signing as parameters. The result will be stored in *installDeployHash* field.

```javascript
const installDeployHash = await cep47.install(
    getBinary(WASM_PATH!),
    {
      name: TOKEN_NAME!,
      contractName: CONTRACT_NAME!,
      symbol: TOKEN_SYMBOL!,
      meta: TOKEN_META
    },
    INSTALL_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS],
  );
```

Then the generated installation deploy hash is sent to the node address that you specified in the .env file. At this point, you can see the "... Contract installation deployHash: " message on the console output.

```javascript
const hash = await installDeployHash.send(NODE_ADDRESS!);
```

After that, check if the deploy is successful and retrieve account information using the node address and public key. Next, you can see the "Contract installed successfully.." message on the console.

```javascript
await getDeploy(NODE_ADDRESS!, hash)
let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);
```

Finally, the contract hash is derived from account information and you can check the installed contract hash on the console.
```javascript
 const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );
```
