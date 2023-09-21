# Verifying a Transfer

## Prerequisites

Before verifying a transfer, make sure you have:

1. Initiated a [Direct Transfer](./direct-token-transfer.md) or [Multi-sig Deploy Transfer](./multisig-deploy-transfer.md)
2. The *deploy_hash* of the transfer you want to verify
3. The *public key* hex for the source and target accounts

## Query Transfer Details {#query-transfer-details}

A transfer is a part of a deploy - in a Casper network, deploys can contain multiple transfers. Execution of the deploy includes writing information about each individual transfer to global state. A unique hash known as the `transfer-address` identifies each transfer. The `transfer-address` consists of a formatted string with a `transfer-` prefix.

First, we will use the *deploy_hash* to identify the corresponding transfer:

```bash
casper-client get-deploy \
--node-address http://<node-ip-address>:7777 \
[DEPLOY_HASH]
```

**Important response fields:**

-   `"result"."execution_results"."result"."Success"."transfers"` - List of transfers contained in a successful deploy.

After we have obtained the `transfer-<hex>` identifier, we can query transfer details.

```bash
casper-client query-global-state \
--id 8 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash <state-root-hash> \
--key transfer-<hex>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned.
-   `node-address` - An IP address of a node on the network.
-   `state-root-hash` - The hex-encoded hash of the state root.
-   `key` - The base key for the query. This must be a properly formatted transfer address.

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 8,
    "jsonrpc": "2.0",
    "method": "state_get_item",
    "params": {
        "key": "transfer-8d81f4a1411d9481aed9c68cd700c39d870757b0236987bb6b7c2a7d72049c0e",
        "path": [],
        "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 8,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "merkle_proof": "924 chars",
        "stored_value": {
            "Transfer": {
                "amount": "2500000000",
                "deploy_hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
                "from": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
                "gas": "0",
                "id": null,
                "source": "uref-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527-007",
                "target": "uref-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e-004",
                "to": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668"
            }
        }
    }
}
```

</details>

The query responds with more information about the transfer we conducted: its deploy hash, the account which executed the transfer, the source and target purses, and the target account. We can verify that our transfer processed successfully using this additional information.

## The State Root Hash

The state root hash is an identifier of the current network state. It gives a snapshot of the blockchain state at a moment in time. You can use the state root hash to query the network state after deployments. 

```
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

<details>
<summary>Sample output of the get-state-root-hash command</summary>

```json
{
  "id": -550641580167406055,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
  }
}
```
</details>

:::note

After any deploys to the network, you must get the new state root hash to see the new changes reflected. Otherwise, you will be looking at events in the past.

:::

## Query Account State {#query-account-state}

Here, we will query for information about the _Source_ account, using the `state-root-hash` of the block containing the transfer:

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
-   `state-root-hash` - Hex-encoded hash of the network state
-   `key` - The base key for the query. This must be a properly formatted public key, account hash, contract address hash, URef, transfer hash, or deploy-info hash.

**Important response fields:**

-   `"result"."stored_value"."Account"."main_purse"` - the address of the main purse containing the sender's tokens. In this example, this purse is the source of the tokens transferred

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 4,
    "jsonrpc": "2.0",
    "method": "state_get_item",
    "params": {
        "key": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
        "path": [],
        "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 4,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "merkle_proof": "2228 chars",
        "stored_value": {
            "Account": {
                "account_hash": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
                "action_thresholds": {
                    "deployment": 1,
                    "key_management": 1
                },
                "associated_keys": [
                    {
                        "account_hash": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
                        "weight": 1
                    }
                ],
                "main_purse": "uref-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527-007",
                "named_keys": []
            }
        }
    }
}
```

</details>

We can repeat the same step to query information about the _Target_ account:

```bash
casper-client query-global-state \
--id 5 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash <state-root-hash> \
--key <hex-encoded-target-account-public-key>
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 5,
    "jsonrpc": "2.0",
    "method": "state_get_item",
    "params": {
        "key": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
        "path": [],
        "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 5,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "merkle_proof": "2228 chars",
        "stored_value": {
            "Account": {
                "account_hash": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                "action_thresholds": {
                    "deployment": 1,
                    "key_management": 1
                },
                "associated_keys": [
                    {
                        "account_hash": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                        "weight": 1
                    }
                ],
                "main_purse": "uref-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e-007",
                "named_keys": []
            }
        }
    }
}
```

</details>

## Query Purse Balance {#get-purse-balance}

All accounts on a Casper network have a purse associated with the Casper system mint, which we call the _main purse_. The balance associated with a given purse is recorded in global state, and the value can be queried using the `query-balance` command and the purse identifier, which can be a public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef can be used. For full details, run the following help command:

```bash
casper-client query-balance --help
```

Now that we have the source purse address, we can verify its balance using the `get-balance` command:

```bash
casper-client query-balance \
--id 6 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash <state-root-hash> \
--purse-identifier <source-account>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - An IP address of a node on the network
-   `state-root-hash` - Hex-encoded hash of the state root
-   `purse-identifier` - A public key or account hash, implying the main purse of the given account should be used. Alternatively, the purse's URef.

The `-v` option generates verbose output, printing the RPC request and response generated. Let's explore an example below.

**Query Source Account Example:**

```bash
casper-client query-balance -v --id 6 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3 \
--purse-identifier account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5
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
      "StateRootHash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    },
    "purse_identifier": {
       "main_purse_under_account_hash": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5"
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

Similarly, we have the public key of the target purse, so we can get its balance.

```bash    
casper-client get-balance \
--id 7 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash <state-root-hash> \
--purse-identifier <target-account>
```

**Target Account Example:**

```bash
casper-client query-balance -v --id 7 \
--node-address http://<node-ip-address>:7777 \
--state-root-hash cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3 \
--purse-identifier account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668
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
      "StateRootHash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    },
    "purse_identifier": {
        "main_purse_under_account_hash": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668"
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
    "api_version": "1.5.2",
    "balance": "5000000000"
  },
  "id": 7
}
```

</details>
