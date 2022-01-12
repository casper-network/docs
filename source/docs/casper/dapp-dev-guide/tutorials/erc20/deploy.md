
# Deploy the Contract
import useBaseUrl from '@docusaurus/useBaseUrl';

Now that you have implemented the smart contract for ERC-20, it's time to deploy it to the blockchain. Deploying the ERC-20 contract is similar to deploying other smart contracts, while only the WASM files and parameters will differ. Refer [Deploying Contracts](/docs/dapp-dev-guide/deploying-contracts#advanced-deployments) section to learn more about overall contract deployment.

Let's dive into the deployment process.

### Pre-requisites

- Set up your machine as per the [prerequisites](/docs/workflow/setup)
- You need to have a pre-created [Account](https://casper.network/docs/workflow/setup#setting-up-an-account) with the required amount of tokens to perform the deploy
  - You will receive the `Public Key` and `Private Key` along with the Casper signer account which are mandatory items for the future deploys
- Your [faucet account](https://testnet.cspr.live/tools/faucet) should contain enough tokens to perform the execution. Follow [transfer tokens](https://casper.network/docs/workflow/token-transfer#2-the-faucet) guide to learn more about token transferring on Casper Testnet
- Account should contain enough `CSPR tokens` to proceed with the deploy. These will use to pay for the transactions on the Casper Network (involving ERC-20 tokens).
- Installed [Casper client](/dapp-dev-guide/tutorials/counter/setup) to interact with the network

## Basic Flow
Here are the basic steps to deploy the ERC-20 contract on the Casper Network.

<img src={useBaseUrl("/image/tutorials/erc-20/erc20-deploy-flow.png")} alt="erc20-deploy-flow" width="600"/>

## Clone the ERC-20 Contract
This step includes cloning and preparing the ERC-20 contract for the deployment.
1. Clone the ERC-20 contract from the repository
```bash
git clone https://github.com/casper-ecosystem/erc20.git
```
2. Move to the newly created folder and compile the contract to create the target WASM file 
```bash
cd erc20
make prepare
```

3. Build and verify the compiled contract
```bash
make test
```

## Get an IP Address from a Testnet Peer 
Use the [acquire node address](/docs/workflow/setup#acquire-node-address-from-network-peers) section to get a node-ip-address. We use [peers](https://testnet.cspr.live/tools/peers) on testnet since we are deploying to the testnet. Select a peer address from the list and do the address format as below,
:::note
Acquire a node address from the Testnet and use port '7777' instead of '35000' to send your deploy. If the selected peer is unresponsive, pick a different peer and try again
:::

Testnet peers page sample:

<img src={useBaseUrl("/image/tutorials/erc-20/testnet-peers.png")} alt="erc20-deploy-flow" width="800"/>


## View the Network Status
This query capture any information related to the state of the blockchain at the specific time denoted by state root hash.  You need to have the state root hash and the account hash to run the query.

**Getting State Root Hash**

This marks a snapshot of the network state at a moment in time.
```bash
casper-client get-state-root-hash --node-address http://<HOST:PORT>
```
- `<HOST:PORT>`: Use the [Node IP address](../erc20/deploy#get-an-ip-address-from-a-testnet-peer) taken from a Testnet peer.

**Getting Account Hash**

To get the account hash, run the following command and supply the path to your Public Key in Hex format.
```bash
casper-client account-address --public-key "[PATH_TO_YOUR_KEY]/public_key_hex"
```
**Querying the Network State**

Use the command template below to query the network status with regards to your account.
```bash
casper-client query-state \
--node-address http://<HOST:PORT> \
--state-root-hash [STATE_ROOT_HASH] \
--key [ACCOUNT_HASH]
```

## Deploy the Contract
Now you can deploy the contract on the network and check how it behaves. Use the following command template to deploy the contract:
```bash
casper-client put-deploy \
    --node-address http://<HOST:PORT> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
```
- `NETWORK_NAME`: Use the relevant network name. Here we use 'casper-test'
- `PATH_TO_YOUR_KEY`: Replace this with the actual path of your secret key 
- `PAYMENT_AMOUNT`: Gas amount in tokens needed for contract execution. If there are no adequate tokens, the deploy will not execute and return an error
- `WASM FILE PATH`: The session-path argument should point to the location of your compiled ERC-20 WASM file

:::note
- If you are performing the deploy in the Mainnet, we recommend trying several put deploys on the Testnet to understand the exact amount required for that deploy. Refer to the [note about gas price](/docs/dapp-dev-guide/deploying-contracts#a-note-about-gas-prices) to understand more about payment amounts and gas price adjustments. 

- Also, we currently do not refund any tokens as part of a deploy. 

  Eg:- If you spend 10 CSPR for the deployment and it only cost 1 CSPR, you will not receive the extra 9 CSPR. Refer [computational cost and gas amounts](https://casper.network/docs/design/execution-semantics#execution-semantics-gas) for further details.
:::

Find the sample command below:

```bash
casper-client put-deploy \
--node-address http://95.216.24.237:7777 \
--chain-name casper-test \
--secret-key "/home/ubuntu/secret_key.pem" \
--payment-amount 1000000 \
--session-path "/home/ubuntu/erc20/target/wasm32-unknown-unknown/release/erc20_test.wasm"
```

## Querying the Network Status
You need to get the newest state root hash to view the network status because it has changed with the deploy. The account hash remains the same since you are using the same account. Follow [View network state](../erc20/deploy#view-the-network-status) to execute this step with the new state root hash.


## Verifying the Deploy
Now you can verify the applied deploy using the `get deploy` command. This will output the details of the applied deploy.
```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> [DEPLOY_HASH]
```

## Querying with Arguments
This step will narrow down the context and check the status of a specific entry point. You will use the details inside [erc20 contract](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs) to derive arguments.
:::

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

### Cloning the ERC-20 Contract

```bash
git clone https://github.com/casper-ecosystem/erc20.git
```
### Getting an IP Address from a Testnet Peer

Use [peers](https://testnet.cspr.live/tools/peers) site to get the node ip address.
Eg:  http://95.216.24.237:7777

### Viewing the Network Status

Here is the command:
```bash
casper-client query-state \
--key account-hash-<account-address> \
--node-address http://<HOST:PORT> \
--state-root-hash E5B679BD1562fE6257257F5f969A79482E8DCEBBD501501BfA6d5844b61cBE3f
```

Result:

This result contains the network state before the deploy. You can see the `named-key` field is empty since we haven't done any deploy on the network yet.

<details>
<summary>The result from the querying network status</summary>

```bash
{
  "id": 401803927542812599,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "merkle_proof": "[25564 hex chars]",
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-<account-address> ",
        "action_thresholds": {
          "deployment": 1,
          "key_management": 1
        },
        "associated_keys": [
          {
            "account_hash": "account-hash-<account-address> ",
            "weight": 1
          }
        ],
        "main_purse": "uref-C051e7EC16e08Def8b556F9CD0E18FE701C89dC0cED3DAd7b65107285da198DD-007",
        "named_keys": []
      }
    }
  }
}
```

</details>



### Deploying the Contract

Deploy the contract with this command:
```bash
casper-client put-deploy \
--node-address http://<HOST:PORT>  \
--chain-name casper-test \
--secret-key "/home/ubuntu/secret_key.pem" \
--payment-amount 1000000 \
--session-path "/home/ubuntu/erc20/target/wasm32-unknown-unknown/release/erc20_test.wasm"
```

Result:

This command execution will output the `deploy_hash` of the applied deploy. We can use the deploy_hash to get the details of the deploy.
```bash
{
  "id": 931694842944790108,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "deploy_hash": "b00E59f8aBA5c7aB9bfA496ae4Aec7Ec8A9F0227179F5F09AcA594335F62dc1f"
  }
}
```

### Viewing the Deploy Details

You can view the details of the applied deploy using the command below:
```bash
casper-client get-deploy \
--node-address http://<HOST:PORT> \
b00E59f8aBA5c7aB9bfA496ae4Aec7Ec8A9F0227179F5F09AcA594335F62dc1f
```

Result:

This contains the header, payment and session details along with the execution results.

- If the execution result field appears as `"execution_results":[]`, it means that the deploy hasn't executed yet. The time to load the execution result may vary depending on the network.

<details>
<summary>Result from querying get deploy</summary>

```bash
{
  "id": 8893083480582974265,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "deploy": {
      "approvals": [
        {
          "signature": "[130 hex chars]",
          "signer": "017B8CE645c7285689F79281C5AB60348d14D3a9d1A419f3441A993402dd81dbE2"
        }
      ],
      "hash": "b00E59f8aBA5c7aB9bfA496ae4Aec7Ec8A9F0227179F5F09AcA594335F62dc1f",
      "header": {
        "account": "017B8CE645c7285689F79281C5AB60348d14D3a9d1A419f3441A993402dd81dbE2",
        "body_hash": "7B5c246dbC76D5F9D8Af4CB49F1c69AFa6bE9dAB2f8d624153c2e682dB469DbD",
        "chain_name": "casper-test",
        "dependencies": [],
        "gas_price": 1,
        "timestamp": "2022-01-04T10:47:55.437Z",
        "ttl": "30m"
      },
      "payment": {
        "ModuleBytes": {
          "args": [
            [
              "amount",
              {
                "bytes": "03a08601",
                "cl_type": "U512",
                "parsed": "100000"
              }
            ]
          ],
          "module_bytes": ""
        }
      },
      "session": {
        "ModuleBytes": {
          "args": [],
          "module_bytes": "[417800 hex chars]"
        }
      }
    },
    "execution_results": [
      {
        "block_hash": "8634d9d1BD69Fc5D108aA365fAFdceeFD89a7Defeb4e7E47F170E76FC0a2069F",
        "result": {
          "Failure": {
            "cost": "100000",
            "effect": {
              "operations": [],
              "transforms": [
                {
                  "key": "hash-8cf5E4aCF51f54Eb59291599187838Dc3BC234089c46fc6cA8AD17e762aE4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dBE2395b9D9503FBEE82162F1714eBFF6b639f96d2084d26D944C354eC4c5",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3Fe81B7b862E50C77EF9A958a05BfA98444F26f96f23d37A13c96244cFB7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dC3A5c44A20b9FD260a412437933835B52Fc683d8AE36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-C051e7EC16e08Def8b556F9CD0E18FE701C89dC0cED3DAd7b65107285da198DD",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324F865243B7c02C0417AB6eaC361c5c56602FD42ced834a1Ba201B6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-C051e7EC16e08Def8b556F9CD0E18FE701C89dC0cED3DAd7b65107285da198DD",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "056089a3d4e8",
                      "cl_type": "U512",
                      "parsed": "999999900000"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324F865243B7c02C0417AB6eaC361c5c56602FD42ced834a1Ba201B6",
                  "transform": {
                    "AddUInt512": "100000"
                  }
                },
                {
                  "key": "balance-98d945f5324F865243B7c02C0417AB6eaC361c5c56602FD42ced834a1Ba201B6",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5E4aCF51f54Eb59291599187838Dc3BC234089c46fc6cA8AD17e762aE4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3Fe81B7b862E50C77EF9A958a05BfA98444F26f96f23d37A13c96244cFB7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dC3A5c44A20b9FD260a412437933835B52Fc683d8AE36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324F865243B7c02C0417AB6eaC361c5c56602FD42ced834a1Ba201B6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-62f7Fe1ceCB1a4C600fFA791479ce52Fb8cBDA408815F4Dd1B1E0D82e704579a",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324F865243B7c02C0417AB6eaC361c5c56602FD42ced834a1Ba201B6",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "00",
                      "cl_type": "U512",
                      "parsed": "0"
                    }
                  }
                },
                {
                  "key": "balance-62f7Fe1ceCB1a4C600fFA791479ce52Fb8cBDA408815F4Dd1B1E0D82e704579a",
                  "transform": {
                    "AddUInt512": "100000"
                  }
                }
              ]
            },
            "error_message": "Out of gas error",
            "transfers": []
          }
        }
      }
    ]
  }
}
```

</details>

### Querying with Arguments

We will query the argument 'name' in this example.

```bash
casper-client query-state --node-address http://95.216.24.237:7777 \
--state-root-hash D00dF8c35B0E9995c2911803F37A212d82c960D9bC5bA3C4F99a661e18D09411 \
--key account-hash-7f4bf39A311a7538d8C91BB86C71DF774023e16bc4a70ab7e4e8AE77DbF2Ef53 \
-q "test_contract/name"
```

Result:

You can see the symbol value as `CasperTest` in this sample.
```bash
{
 "id": -3650676146668320186,
 "jsonrpc": "2.0",
 "result": {
  "api_version": "1.4.3",
  "block_header": null,
  "merkle_proof": "[80252 hex chars]",
  "stored_value": {
   "CLValue": {
    "bytes": "0A00000043617370657254657374",
    "cl_type": "String",
    "parsed": "CasperTest"
   }
  }
 }
}

```