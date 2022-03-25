# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';


This tutorial guides you on how to upgrade your existing contract. Upgrading a smart contract is same as upgrading any other software; that it needs to add a new version including the required changes to the contract. Changes of the contract could be adding, editing, or deleting functionalities within your existing smart contract. The steps to upgrade a contract is illustrated in the below steps.

## Pre-requisites
- - You should have a previously created smart contract, which should not be locked. A locked contract is not upgradable and has only one enabled version.
- You should be familiar with [writing smart contracts](/docs/writing-contracts), [deploying contracts](/docs/dapp-dev-guide/deploying-contracts), and [calling contracts](/docs/dapp-dev-guide/calling-contracts) on the Casper Network.


#### Contract Versioning Flow

These are the steps to add a new version to your contract.

<img src={useBaseUrl("/image/contract-upgrade-flow.png")} alt="contract-upgrade-flow" width="500"/>

### Step 1. Creating a new contract file 
a) Create a new smart contract file that contains the base contract.

b) Then, add the required modification to the contract. This can be adding a new entry point or modifying the behavior of an existing entry point in the contract.

### Step 2. Implementing the generic method

You need to implement the [`add_contract_version`](https://github.com/casper-network/casper-node/blob/9aa22ac6c998c9d2d5288721974266b0fb44fb36/smart_contracts/contract/src/contract_api/storage.rs#L277-L313) generic method with your contract details. This method is executed automatically when creating a brand new contract and it is considered the very first version of the contract. For future contract modifications, again this method is implemented inside the new contract version file to enable the versioning.


a) Import required packages to implement the method.

b) Include the three arguments; contract_package_hash, entry_points, and named_keys inside the method call.
  - `contract_package_hash` - This represents a collection of contract hashes. A [`ContractPackageHash`](/docs/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) is a type that wraps a *HashAddr* which references a ContractPackage in the global state. The Casper execution engine creates the ContractPackageHash when creating a contract.
  - `entry_points` - Entry points of the contract, which can be modified or newly added
  - `named_keys` - Named key pairs of the contract
  
  <img src={useBaseUrl("/image/contract-representation.png")} alt="contract-representation" width="500"/>


### Step 3. Compiling and building the contract
Use these commands to prepare, compile and build the new contract.

```bash
make prepare

make build-contract
```

### Step 4. Deploying the contract 

Use the below command to deploy your contract to the selected network. Make sure you add your specific arguments to the command. Refer to the [deploying contracts](/docs/dapp-dev-guide/deploying-contracts/) guide to learn more about contract deployment.

```bash
casper-client put-deploy \
    --node-address http://<NODE_ADDRESS> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
```

1. `NODE_ADDRESS`: An IP address of a node on the network
2. `NETWORK_NAME`: The chain-name to the network where you wish to send the deploy (this example uses the Testnet)
3. `PATH_TO_YOUR_KEY`: Path to your saved keys' location
4. `AMOUNT`: Token amount used for the deployment
5. `WASM_FILE_PATH`: Path to your contract Wasm 

### Step 5. Verifying the deploy changes 
Verify the changes by retrieving the deploy object and querying the network status.

Get the details of the installed deploy .

```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> [DEPLOY_HASH]
```

- To see the status of the contract version, query the `version` endpoint.

```bash
casper-client query-global-state --node-address [NODE_ADDRESS] \
--state-root-hash [LATEST_STATE_ROOT_HASH or BLOCK_HASH] \
--key [YOUR_ACCOUNT_HASH] \
-q "version"
```

1. `NODE_ADDRESS`: An IP address of a node on the network
2. `LATEST_STATE_ROOT`: Hash indicates the current status of the network
3. `YOUR_ACCOUNT_HASH`: Provided account hash
