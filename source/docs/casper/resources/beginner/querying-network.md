---
title: Querying a Node
slug: /resources/tutorials/beginner/querying-network
---

# Querying a Casper Node

The Casper node supports queries for users and developers to obtain information stored on the blockchain.

This document assumes:

1.  You have met the [prerequisites](../../developers/prerequisites.md)
2.  You are familiar with the structure of the [Global State and the Blockchain Design](../../concepts/design/index.md) to query data from the network

When sending a query, it is important to note that the request will be routed to a single node in the network. You can request several types of data from a node:

-   Account details
-   Block information
-   Deploy information

## Obtaining the Global State Root Hash {#obtaining-the-global-state-root-hash}

Since the system state changes with each block created, obtaining the latest global state hash is essential before querying information from a node.

All queries made to global state require the `state-root-hash`, which you can obtain with this command:

```bash
casper-client get-state-root-hash \
     --id 1 \
     --node-address http://<node-ip-address>:7777
```

**Request fields:**

-   `id` - (STRING OR INTEGER) Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "jsonrpc": "2.0",
    "method": "chain_get_state_root_hash",
    "params": null,
    "id": 1
}
```

**JSON-RPC Response**:

```json
{
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "state_root_hash": "f97d8d36630a8f4acdb323223596f6fa01ee3b0d49ad70d84d715c156c5dbec6"
    },
    "id": 1
}
```

</details>

## Querying an Account {#querying-an-account}

[Accounts](../../concepts/design/casper-design.md#accounts-head) are stored in the global state and can be queried using the `query-global-state` command:

```bash
casper-client query-global-state \
  --id 4 \
  --node-address http://<node-ip-address>:7777 \
  --state-root-hash <state-root-hash> \
  --key <hex-encoded-source-account-public-key>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - Hex-encoded hash of the state root
-   `key` - The base key for the query. This must be a properly formatted public key, account hash, contract address hash, URef, transfer hash or deploy-info hash.

**Important response fields:**

-   `"result"."stored_value"."Account"."main_purse"` - the address of the main purse containing the sender's tokens. This purse is the source of the tokens transferred in this example

**Example Account Query with Verbose Output:**

```bash
casper-client query-global-state -v \
  --id 4 \
  --node-address https://rpc.testnet.casperlabs.io/ \
  --state-root-hash a306a9cf869e52fe9eacdc28aade94215112cc04b6737b3669c35568a47a7dc2 \
  --key 01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986
```

<details>
<summary>Explore the sample JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_global_state",
  "params": {
    "state_identifier": {
      "StateRootHash": "a306a9cf869e52fe9eacdc28aade94215112cc04b6737b3669c35568a47a7dc2"
    },
    "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
    "path": []
  },
  "id": 4
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "api_version": "1.5.2",
    "block_header": null,
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
        "named_keys": [
          {
            "name": "counter",
            "key": "hash-4bf23564c8849a0a3193781f0a9df7d27c4bce2cc585d6e9bb161a7a1ce5cd7e"
          },
          {
            "name": "counter_access_uref",
            "key": "uref-76b6c7e7a87b752d34a8c3ccdc070dbfd1940960016c537525b2ab9076b61a3e-007"
          },
          {
            "name": "counter_package_name",
            "key": "hash-e4b2060f098fa763f9a68c5c98a2d98a4fa80815ec0fd6b93ac9efbb0c18f19b"
          },
          {
            "name": "my-key-name",
            "key": "uref-09376d4202d32457ceefa4d9cdf1db6ab2324981ade06ba6f495cdf14124c3b9-007"
          },
          {
            "name": "version",
            "key": "uref-244a270207dd13ef5ff190f75d84efe4ab54bd5787be0bbb175c3fb154b7f5ed-007"
          }
        ],
        "main_purse": "uref-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c-007",
        "associated_keys": [
          {
            "account_hash": "account-hash-0ea7998b2822afe5b62b08a21d54c941ad791279b089f3f7ede0d72b477eca34",
            "weight": 1
          },
          {
            "account_hash": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
            "weight": 3
          },
          {
            "account_hash": "account-hash-77ea2e433c94c9cb8303942335da458672249d38c1fa5d1d7a7500b862ff52a4",
            "weight": 1
          },
          {
            "account_hash": "account-hash-d65d053f5017af101b752a9a12ba4c41fe3054b8632998a69193b891eab4caf5",
            "weight": 1
          },
          {
            "account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
            "weight": 1
          },
          {
            "account_hash": "account-hash-f1802d2dbd83e41f638eb9b046f762e481d56b27d4aa00817fec77fbb21f944a",
            "weight": 1
          }
        ],
        "action_thresholds": {
          "deployment": 2,
          "key_management": 3
        }
      }
    },
    "merkle_proof": "[32054 hex chars]"
  }
}
```

</details>

To query the account balance, use the `query-balance` command and the purse identifier, which can be a public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef can be used. The balance returned is in motes (the unit that makes up the Casper token). For full details, run the following help command:

```bash
casper-client query-balance --help
```

```bash
casper-client query-balance \
--id 6 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash <state-root-hash> \
--purse-identifier <account>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - Hex-encoded hash of the state root
-   `purse-identifier` - A public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef.

The `-v` option generates verbose output, printing the RPC request and response generated. Let's explore an example below.

**Example Balance Query with Verbose Output:**

```bash
casper-client query-balance -v \
  --id 6 \
  --node-address https://rpc.testnet.casperlabs.io/ \
  --state-root-hash a306a9cf869e52fe9eacdc28aade94215112cc04b6737b3669c35568a47a7dc2 \
  --purse-identifier 01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "query_balance",
  "params": {
    "state_identifier": {
      "StateRootHash": "a306a9cf869e52fe9eacdc28aade94215112cc04b6737b3669c35568a47a7dc2"
    },
    "purse_identifier": {
      "main_purse_under_public_key": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986"
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
    "api_version": "1.5.2",
    "balance": "164000000000"
  },
  "id": 6
}
```

</details>

## Querying Blocks {#querying-blocks}

It is possible to obtain detailed block information from the system. To do this, obtain the hash of the block of interest and send this query to a node in the network. Here is an example:

```bash
casper-client get-block \
      --id 3 \
      --node-address http://<node-ip-address>:7777 \
      --block-identifier <block-hash> \
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `block-identifier` - Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

**Important response fields:**

-   `"result"."block"."header"."state_root_hash"` - contains the `state-root-hash` for this block

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 3,
    "jsonrpc": "2.0",
    "method": "chain_get_block",
    "params": {
        "block_identifier": {
            "Hash": "7c7e9b0f087bba5ce6fc4bd067b57f69ea3c8109157a3ad7f6d98b8da77d97f9"
        }
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 3,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "block": {
            "body": {
                "deploy_hashes": [],
                "proposer": "012c6775c0e9e09f93b9450f1c5348c5f6b97895b0f52bb438f781f96ba2675a94",
                "transfer_hashes": ["ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713"]
            },
            "hash": "7c7e9b0f087bba5ce6fc4bd067b57f69ea3c8109157a3ad7f6d98b8da77d97f9",
            "header": {
                "accumulated_seed": "50b8ac019b7300cd1fdeec050310e61b900e9238aa879929745900a91bd0fc4f",
                "body_hash": "224076b19c04279ae9b97f620801d5ff40ba64f431fe0d5089ef7cb84fdff45a",
                "era_end": null,
                "era_id": 0,
                "height": 8,
                "parent_hash": "416f339c4c2ff299c64a4b3271c5ef2ac2297bb40a477ceacce1483451a4db16",
                "protocol_version": "1.0.0",
                "random_bit": true,
                "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3",
                "timestamp": "2021-04-20T18:04:42.368Z"
            },
            "proofs": [
                {
                    "public_key": "010f50b0116f213ef65b99d1bd54483f92bf6131de2f8aceb7e3f825a838292150",
                    "signature": "130 chars"
                },
                {
                    "public_key": "012c6775c0e9e09f93b9450f1c5348c5f6b97895b0f52bb438f781f96ba2675a94",
                    "signature": "130 chars"
                },
                {
                    "public_key": "018d5da83f22c9b65cdfdf9f9fdf9f7c98aa2b8c7bcf14bf855177bbb9c1ac7f0a",
                    "signature": "130 chars"
                },
                {
                    "public_key": "01b9088b92c8a8d592f6ec8c3e8153d7c55fc0c38b5999a214e37e73a2edd6fe0f",
                    "signature": "130 chars"
                },
                {
                    "public_key": "01b9e3484d96d5693e6c5fe789e7b28972aa392b054a76d175f079692967f604de",
                    "signature": "130 chars"
                }
            ]
        }
    }
}
```

</details>

## Querying Deploys {#querying-deploys}

Once you submit a deploy to the network, you can check its execution status using `get-deploy`. If the `execution_results` in the output are null, the transaction has not run yet. Note that transactions are finalized upon execution.

```bash
casper-client get-deploy \
      --id 2 \
      --node-address http://<node-ip-address>:7777 \
      <deploy-hash>
```

**Request fields:**

-   `id` - JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `deploy-hash` - Hex-encoded hash of the deploy
