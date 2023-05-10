---
tags: ["smart contract developers","rust","put-deploy"]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Installing Smart Contracts and Querying Global State

This document details the process of installing [Casper smart contracts](../writing-onchain-code/simple-contract.md) using the [Casper command-line client](../prerequisites.md#the-casper-command-line-client) and the `put-deploy` command. It further explains how to query the global state after contract deployment.

## Prerequisites

- You know how to [send and verify deploys](../dapps/sending-deploys.md)
   - You have installed the [Casper CLI client](../prerequisites.md#installing-the-casper-client-install-casper-clie) to interact with the network
   - You have a [Casper Account](../prerequisites.md#setting-up-an-account) with a public and secret key pair to initiate the deploy
   - You have enough CSPR tokens in your account's main purse to pay for deploys. If you plan to use the Casper Testnet, learn about the [faucet](../../users/testnet-faucet.md) to fund your testing account's main purse
- You understand how to [write basic contract code](../writing-onchain-code/index.md) and session code
- You have a contract Wasm to send to a Casper network


## Installing a Contract in Global State {#installing-contract-code}

To install a contract in [global state](../../concepts/glossary/G.md#global-state), you need to send a deploy to the network with the contract Wasm. You can do so by using the `put-deploy` command. Remember to [verify the deploy](../dapps/sending-deploys.md#sending-the-deploy) after sending it to the network.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [CONTRACT_PATH]/[CONTRACT_NAME].wasm
```

The arguments used above are:
-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer

Once you call this command, it will return a deploy hash. You can use this hash to verify that the deploy successfully took place.

**Example - Install the contract:**

Here we send a `counter-v1.wasm` to a local NCTL network.

```bash
casper-client put-deploy \
    --node-address http://localhost:11101 \
    --chain-name casper-net-1 \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./counter/target/wasm32-unknown-unknown/release/counter-v1.wasm
```

To verify the deploy, call `get-deploy` and provide the deploy hash you received from `put-deploy`.

```bash
casper-client get-deploy \
    --node-address http://localhost:11101 [DEPLOY_HASH]
```

**Video - Contract Installation Walkthrough**

This video demonstrates the commands described above for installing a contract on-chain.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=8" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Querying Global State {#querying-global-state}

Here we look at how to query global state to see details about a successfully installed contract.

### Get the state root hash {#get-state-root-hash}

First, you need to get the state root hash. After sending deploys to the network, you must get the new state root hash to see the new changes reflected. Otherwise, you would be looking at past events.

The state root hash identifies the current network state (global state). It is much like a Git commit ID for commit history. It gives a snapshot of the blockchain state at a moment in time. We use it to query global state after sending deploys to the network.

```bash
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

Here is an example with the node address filled in:

```bash
casper-client get-state-root-hash --node-address http://localhost:11101
```

### Query global state {#query-global-state}

Next, query the state of a Casper network at a given time, specified by the `state-root-hash` described above. You can dive into the data stored in global state using the query path argument `q`.

```bash
casper-client query-global-state \
    --node-address [NODE_SERVER_ADDRESS] \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [HASH_STRING] \
    -q "[SESSION_NAME]/[SESSION_NAMED_KEY]" (OPTIONAL)
```

The arguments used above are:
-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `state-root-hash` -  Hex-encoded hash of the state root
-   `key` - The identifier for the query. It must be the account public key, account hash, contract package hash, transfer hash, or deploy hash
-   `q` - An optional query path argument that allows you to drill into the specifics of a query with respect to the key

**Example - Query the account:**

To find your account details, query global state using your account hash.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
  --key account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d
```

Here is how your account state would look. Notice that the sample response contains several named keys, including "counter", "counter_package_name", and "version". You can use these values to query the contract state further, as shown in the next example.

<details>
<summary><b>Sample account state</b></summary>

```bash
{
  "id": -6831525034388467034,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "block_header": null,
    "merkle_proof": "[27614 hex chars]",
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d",
        "action_thresholds": {
          "deployment": 1,
          "key_management": 1
        },
        "associated_keys": [
          {
            "account_hash": "account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d",
            "weight": 1
          }
        ],
        "main_purse": "uref-d92e420120199f90005802bf3036362f368ab69bebf17e7e53856d6ac82e117f-007",
        "named_keys": [
          {
            "key": "hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e",
            "name": "counter"
          },
          {
            "key": "uref-41c3f4ae3c1ce2446f6fd880a96e698ae5abc715151e45e357d88bb739489c03-007",
            "name": "counter_access_uref"
          },
          {
            "key": "hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",
            "name": "counter_package_name"
          },
          {
            "key": "uref-917762490591a1404cba59ed8dcf0bcfa7f644ef6c6be9bf5ea7b1641617cad0-007",
            "name": "version"
          }
        ]
      }
    }
  }
}
```
</details>
<br></br>

:::note

If you don't know your account hash, you can run this command:

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
```

:::

**Example - Query the contract:**

This example shows how to query global state given a contract hash. We use the contract hash from the sample response above.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101  \
  --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
  --key hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e
```

Here is how the sample contract would look and would contain details such as the `contract_package_hash`, the contract `entry_points`, and the `named_keys` for the contract.

<details>
<summary><b>Sample contract state</b></summary>

```bash
{
  "id": -4657473054587773855,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "block_header": null,
    "merkle_proof": "[21330 hex chars]",
    "stored_value": {
      "Contract": {
        "contract_package_hash": "contract-package-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",
        "contract_wasm_hash": "contract-wasm-576b1718711d524a79ab2f05ce801006a3fd32eb48b9f7dac69a9fa966d634e3",
        "entry_points": [
          {
            "access": "Public",
            "args": [],
            "entry_point_type": "Contract",
            "name": "counter_get",
            "ret": "I32"
          },
          {
            "access": "Public",
            "args": [],
            "entry_point_type": "Contract",
            "name": "counter_inc",
            "ret": "Unit"
          }
        ],
        "named_keys": [
          {
            "key": "uref-d40613e50c7b405b02795e3fe3252554bef49b4b522e31a55f39b87c442f922a-007",
            "name": "count"
          }
        ],
        "protocol_version": "1.4.5"
      }
    }
  }
}

```
</details>
<br></br>


**Example - Query a value using its key and the contract hash:**

Next, you can query a named key associated with the contract using the `-q` option. This example comes from the [Counter Contract Tutorial](../../resources/tutorials/beginner/counter/index.md), where a "count" variable is incremented and stored under a named key.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash [STATE_ROOT_HASH] \
  --key [CONTRACT_HASH] -q "count"
```

<details>
<summary><b>Sample stored value</b></summary>

```bash
{
  "id": -2540117660598287261,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "block_header": null,
    "merkle_proof": "[56562 hex chars]",
    "stored_value": {
      "CLValue": {
        "bytes": "00000000",
        "cl_type": "I32",
        "parsed": 0
      }
    }
  }
}
```
</details>
<br></br>

**Example - Query a value using the account hash and named keys:**

It is also possible to check the state of a specific contract variable in global state given the account hash under which the contract was installed. Here we query the named key "count", stored under another key identifying the contract and named "counter".

```bash
casper-client query-global-state \
    --node-address http://localhost:11101 \
    --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
    --key account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d \
    -q "counter/count"
```

The response should be the same as in Example 3, above.

**Example - Query contract package state:**

You can query information about a contract package, such as the latest contract hash and contract version, given its contract package hash.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --key hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e \
  --state-root-hash 763e737cf55a298d54bcdfb4ee55526538a1a086128914b9cc25ccbdebbbb966
```

Here is how the contract package details would look. The response would contain the `contract_hash`, which you would need to [call a contract by hash](./calling-contracts.md#calling-contracts-by-hash) in the next section. You would also see the `access_key` for the `ContractPackage` and the current `contract_version`.

<details>
<summary><b>Sample contract package state</b></summary>

```bash
{
  "id": -6225901853092301031,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "block_header": null,
    "merkle_proof": "[20964 hex chars]",
    "stored_value": {
      "ContractPackage": {
        "access_key": "uref-41c3f4ae3c1ce2446f6fd880a96e698ae5abc715151e45e357d88bb739489c03-007",
        "disabled_versions": [],
        "groups": [],
        "versions": [
          {
            "contract_hash": "contract-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e",
            "contract_version": 1,
            "protocol_version_major": 1
          }
        ]
      }
    }
  }
}
```
</details>
<br></br>

**Video - Querying Walkthrough**

This video shows you what to expect when querying the network.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=9" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## What's Next? {#whats-next}

- Learn [different ways to call contracts](./calling-contracts.md) using the Casper command-line client
