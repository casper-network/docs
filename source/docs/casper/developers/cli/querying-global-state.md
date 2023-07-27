---
title: Querying Global State
tags: ["smart contract developers","rust","put-deploy"]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Querying Global State

This page explains how to query global state after contract installation.

## Prerequisites

- You have [installed a contract](./installing-contracts.md) on a Casper network

## Getting the State Root Hash {#get-state-root-hash}

The first step in querying the global state is obtaining the state root hash. The state root hash acts as an identifier for the current state of the network (global state). It is like a Git commit ID for commit history, and it provides a snapshot of the blockchain state at a specific point in time.

:::note

After sending deploys to the network, it's necessary to fetch the new state root hash in order to see the changes reflected in the global state. Without doing this, you would be querying past versions of the state.

:::

To get the state root hash, use the `get-state-root-hash` command:

```bash
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

## Sending the Query {#query-global-state}

Next, query the state of a Casper network at a given time, specified by the `state-root-hash` described above. You can dive into the data stored in global state using the optional query path argument `-q`.

```bash
casper-client query-global-state \
  --node-address [NODE_SERVER_ADDRESS] \
  --state-root-hash [STATE_ROOT_HASH] \
  --key [HASH_STRING] \
  -q "[SESSION_NAME]/[SESSION_NAMED_KEY]"
```

The arguments used above are:
-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `state-root-hash` -  Hex-encoded hash of the state root
-   `key` - The identifier for the query. This must be one of the following: public key, account hash, contract package hash, transfer hash, or deploy hash
-   `q` - An optional query path argument that allows you to drill into the specifics of a query with respect to the key

### Query the account

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

:::tip

If you don't know your account hash, you can run this command:

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
```

:::

### Query the contract

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


### Query a value using its key and the contract hash

Next, you can query a named key associated with the contract using the `-q` option. This example comes from the [Counter Contract Tutorial](../../resources/beginner/counter/index.md), where a "count" variable is incremented and stored under a named key.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash [STATE_ROOT_HASH] \
  --key [CONTRACT_HASH] \
  -q "count"
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

### Query a value using the account hash and named keys

It is also possible to check the state of a specific contract variable in global state given the account hash under which the contract was installed. Here we query the named key "count", stored under another key identifying the contract and named "counter".

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
  --key account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d \
  -q "counter/count"
```

The response should be the same as in Example 3, above.

### Query contract package state

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

## Video Walkthrough

This video shows you what to expect when querying the network.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=9" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## What's Next? {#whats-next}

- Learn [different ways to call contracts](./calling-contracts.md) using the Casper command-line client
