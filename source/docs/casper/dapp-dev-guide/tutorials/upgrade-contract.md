# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';


This section guides you on how to upgrade an existing smart contract. 

## Pre-requisites
- You should have a previously created smart contract
    - This should not be defined as a locked contract. A locked contract is not upgradable and has only one enabled version.
- You should be familiar with [writing smart contracts](/docs/writing-contracts), [deploying contracts](/docs/dapp-dev-guide/deploying-contracts), and [calling contracts](/docs/dapp-dev-guide/calling-contracts) in Casper Network.


#### Contract Versioning Flow

These are the steps to add a new version to your contract.

<img src={useBaseUrl("/image/addContractVersion.png")} alt="add-contract-version" width="600"/>

### Step 1. Creating a new contract file 
a) Create a new smart contract file that contains the base contract

b) Then, add the required modification to the contract. This can be adding a new entry point or modifying the behavior of an existing entry point of the contract

### Step 2. Implementing the generic method

You need to implement the [`add_contract_version`](https://github.com/casper-network/casper-node/blob/9aa22ac6c998c9d2d5288721974266b0fb44fb36/smart_contracts/contract/src/contract_api/storage.rs#L277-L313) generic method with your contract details. This method is executed automatically when creating a brand new contract and it is considered the very first version of the contract. For future contract modifications, again this method is implemented inside the new contract version file to enable the versioning.


a) Import required packages to implement the method

b) Include the three arguments; contract_package_hash, entry_points, and named_keys inside the method call
  - `contract_package_hash` - This represents a collection of contract hashes
    - [`ContractPackageHash`](/docs/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations) is a new type that wraps a *HashAddr* which references a ContractPackage in the global state. Generating this ContractPackageHash should be one of the initial tasks Casper engine performs when creating a contract
  <img src={useBaseUrl("/image/contract-representation.png")} alt="contract-representation" width="500"/>
  - `entry_points` - Newly added entry points and modified entry points of the contract
  - `named_keys` - Named key pairs of the contract


### Step 3. Compiling and building the contract
Use these commands to prepare, compile and build the new contract.

```bash
make prepare

make build-contract
```

### Step 4. Deploying the contract 

Use the below command to deploy your contract to the selected network. Make sure you add your local arguments to the command. Refer the [deploying contracts](/docs/dapp-dev-guide/deploying-contracts/) guide to learn more about contract deployment.

```bash
casper-client put-deploy \
    --node-address http://<HOST:PORT> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
```

- [NETWORK_NAME} = Selected network name
- [PATH_TO_YOUR_KEY] = Path to your saved keys' location
- [WASM_FILE_PATH]/[File_Name] - Path to your contract Wasm 

### Step 5. Verifying the deploy changes 
Verify the changes by retrieving the deploy object and querying the network status.

- Get the details of the installed deploy 

```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> [DEPLOY_HASH]
```

- If you want to see the status of the contract version, query for the specific endpoint - version

```bash
casper-client query-global-state --node-address [NODE_ADDRESS] \
--state-root-hash [LATEST_STATE_ROOT_HASH or BLOCK_HASH] \
--key [YOUR_ACCOUNT_HASH] \
-q "version"
```
