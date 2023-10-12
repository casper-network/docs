# Verifying a Transfer

## Prerequisites

Before verifying a transfer, make sure you have:

1. Initiated a [Direct Transfer](./direct-token-transfer.md) or [Multi-sig Deploy Transfer](./multisig-deploy-transfer.md)
2. The *deploy_hash* of the transfer you want to verify
3. The *public key* of the source and target accounts

## Query the State Root Hash

The state root hash is an identifier of the current network state. It gives a snapshot of the blockchain state at a moment in time. You can use the state root hash to query the network state after sending a deploy. 

```bash
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

**Example Query:**

```bash
casper-client get-state-root-hash --node-address https://rpc.testnet.casperlabs.io 
```

<details>
<summary>Sample output of the get-state-root-hash command</summary>

```json
{
  "jsonrpc": "2.0",
  "id": 6458079936180872466,
  "result": {
    "api_version": "1.5.3",
    "state_root_hash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
  }
}
```
</details>

:::note

After sending deploys to the network, you must get the new state root hash to see the changes reflected. Otherwise, you will be looking at events in the past.

:::

## Query the Transfer Details {#query-transfer-details}

A transfer is executed as part of a deploy. In a Casper network, deploys can contain multiple transfers. Execution of the deploy includes writing information about each individual transfer to global state. A unique hash known as the `transfer-address` identifies each transfer. The `transfer-address` consists of a formatted string with a `transfer-` prefix.

<p align="center">
<img src={"/image/transfers/transfer-hash-example.png"} alt="Image showing a transfer hash"/>
</p>

First, use the `get-deploy` command and the *deploy_hash* to identify the corresponding transfer:

```bash
casper-client get-deploy \
--node-address [NODE_SERVER_ADDRESS]  \
[DEPLOY_HASH]
```

**Important response fields:**

-   `"result"."execution_results"."result"."Success"."transfers"` - List of transfers contained in a successful deploy

After obtaining the transfer identifier, query the transfer details.

```bash
casper-client query-global-state \
--id [ID] \
--node-address [NODE_SERVER_ADDRESS]  \
--state-root-hash [STATE_ROOT_HASH] \
--key [TRANSFER_HASH]
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - The hex-encoded hash of the state root
-   `key` - The base key for the query. This must be a properly formatted transfer address with a `transfer-` prefix, i.e., `transfer-ab3e11fd612ccf9ddf5ddb3e5c0b3d3b5e5c0921fd1b45e8c657a63f01d6adcb`

The `-v` option generates verbose output, printing the RPC request and response generated. Let's explore an example below.

**Example Query:**

```bash
casper-client query-global-state -v \
--id 3 \
--node-address https://rpc.testnet.casperlabs.io/  \
--state-root-hash fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1 \
--key transfer-ab3e11fd612ccf9ddf5ddb3e5c0b3d3b5e5c0921fd1b45e8c657a63f01d6adcb
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_global_state",
  "params": {
    "state_identifier": {
      "StateRootHash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
    },
    "key": "transfer-ab3e11fd612ccf9ddf5ddb3e5c0b3d3b5e5c0921fd1b45e8c657a63f01d6adcb",
    "path": []
  },
  "id": 3
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "block_header": null,
    "stored_value": {
      "Transfer": {
        "deploy_hash": "4eedbb5cf4a571748cf7ae9c2f17777364a01f80f79f3633a0cec32b7e8cf2e3",
        "from": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
        "to": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
        "source": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
        "target": "uref-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c-004",
        "amount": "5000000000",
        "gas": "0",
        "id": 11102023
      }
    },
    "merkle_proof": "[42526 hex chars]"
  },
  "id": 3
}
```

</details>

The query responds with more information about the transfer: its deploy hash, the account which executed the transfer, the source and target purses, and the target account. You can verify that the transfer processed successfully using this additional information.

## Query the Account State {#query-account-state}

Next, query for information about the _Source_ account, using the `state-root-hash` of the block containing the transfer:

```bash
casper-client query-global-state \
--id [ID] \
--node-address [NODE_SERVER_ADDRESS] \
--state-root-hash [STATE_ROOT_HASH] \
--key [SOURCE_PUBLIC_KEY]
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - Hex-encoded hash of the network state
-   `key` - The base key for the query. This must be a properly formatted public key, account hash, contract address hash, URef, transfer hash, or deploy-info hash

**Important response fields:**

-   `"result"."stored_value"."Account"."main_purse"` - the address of the main purse containing the sender's tokens. In this example, this purse is the source of the tokens transferred

**Source Example Query:**

```bash
casper-client query-global-state -v \
--id 4 \
--node-address https://rpc.testnet.casperlabs.io/  \
--state-root-hash fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1 \
--key 0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_global_state",
  "params": {
    "state_identifier": {
      "StateRootHash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
    },
    "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
    "path": []
  },
  "id": 4
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "block_header": null,
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
        "named_keys": [...],
        "main_purse": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
        "associated_keys": [
          {
            "account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
            "weight": 1
          }
        ],
        "action_thresholds": {
          "deployment": 1,
          "key_management": 1
        }
      }
    },
    "merkle_proof": "[31406 hex chars]"
  },
  "id": 4
}
```

</details>

**Target Example Query:**

Repeat the same step to query information about the _Target_ account:

```bash
casper-client query-global-state -v \
--id 5 \
--node-address https://rpc.testnet.casperlabs.io/  \
--state-root-hash fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1 \
--key 01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_global_state",
  "params": {
    "state_identifier": {
      "StateRootHash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
    },
    "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
    "path": []
  },
  "id": 5
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "block_header": null,
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
        "named_keys": [...],
        "main_purse": "uref-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c-007",
        "associated_keys": [...],
        "action_thresholds": {
          "deployment": 2,
          "key_management": 3
        }
      }
    },
    "merkle_proof": "[32060 hex chars]"
  },
  "id": 5
}
```

</details>

## Query the Purse Balance {#get-purse-balance}

All accounts on a Casper network have a purse associated with the Casper system mint, which is the _main purse_. The balance associated with a given purse is recorded in global state, and the value can be queried using the `query-balance` command and the purse identifier, which can be a public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef can be used. For full details, run the following help command:

```bash
casper-client query-balance --help
```

Verify the source purse balance using the `query-balance` command:

```bash
casper-client query-balance \
--id 6 \
--node-address [NODE_SERVER_ADDRESS] \
--state-root-hash [STATE_ROOT_HAHS] \
--purse-identifier [SOURCE_PUBLIC_KEY_HEX] 
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - Hex-encoded hash of the state root
-   `purse-identifier` - A public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef

**Query Source Account Example:**

```bash
casper-client query-balance -v --id 6 \
--node-address https://rpc.testnet.casperlabs.io/ \
--state-root-hash fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1 \
--purse-identifier account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655
```

<details>
<summary>Explore the sample JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_balance",
  "params": {
    "state_identifier": {
      "StateRootHash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
    },
    "purse_identifier": {
      "main_purse_under_account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655"
    }
  },
  "id": 6
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "balance": "1109111876194"
  },
  "id": 6
}
```

</details>

Similarly, query the balance of the target purse.

```bash    
casper-client get-balance \
--id 7 \
--node-address [NODE_SERVER_ADDRESS] \
--state-root-hash [STATE_ROOT_HAHS] \
--purse-identifier [TARGET_PUBLIC_KEY_HEX] 
```

**Target Account Example:**

```bash
casper-client query-balance -v --id 7 \
--node-address https://rpc.testnet.casperlabs.io/ \
--state-root-hash fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1 \
--purse-identifier account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7
```

<details>
<summary>Explore the sample JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_balance",
  "params": {
    "state_identifier": {
      "StateRootHash": "fdb1474d441ec0fcbf2e088f1630dbf98d3bcf7f7a7fe298303797f35b8cb4e1"
    },
    "purse_identifier": {
      "main_purse_under_account_hash": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7"
    }
  },
  "id": 7
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "balance": "46200000000"
  },
  "id": 7
}
```

</details>
