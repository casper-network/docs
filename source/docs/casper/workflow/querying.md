# Querying the Network

The Casper node supports queries for users and developers to obtain information stored on the blockchain.

This document assumes:

1.  You have met the [prerequisites](setup.md)
2.  You are familiar with the structure of the [Global State and the Blockchain Design](https://docs.casperlabs.io/en/latest/design/index.md) to query data from the network

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
     --node-address http://<node-ip-address>:7777/rpc
```

**Request fields:**

-   `id` - (STRING OR INTEGER) Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - (HOST:PORT) Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

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

[Accounts](https://docs.casperlabs.io/en/latest/implementation/accounts.md) are stored in the global state and can be queried using the `query-state` command:

```bash
casper-client query-state \
  --id 4 \
  --node-address http://<node-ip-address>:7777 \
  --state-root-hash <state-root-hash> \
  --key <hex-encoded-source-account-public-key>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
-   `state-root-hash` - Hex-encoded hash of the state root
-   `key` - The base key for the query. This must be a properly formatted public key, account hash, contract address hash, URef, transfer hash or deploy-info hash.

**Important response fields:**

-   `"result"."stored_value"."Account"."main_purse"` - the address of the main purse containing the sender's tokens. This purse is the source of the tokens transferred in this example

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

You can use the URef of the `main_purse` to query the account balance. The balance returned is in motes (the unit that makes up the Casper token).

```bash
casper-client get-balance \
      --id 6 \
      --node-address http://<node-ip-address>:7777 \
      --state-root-hash <state-root-hash> \
      --purse-uref <source-account-purse-uref>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
-   `state-root-hash` - Hex-encoded hash of the state root
-   `purse-uref` - The URef under which the purse is stored. This must be a properly formatted URef "uref-\-"

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 6,
    "jsonrpc": "2.0",
    "method": "state_get_balance",
    "params": {
        "purse_uref": "uref-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e-007",
        "state_root_hash": "cfdbf775b6671de3787cfb1f62f0c5319605a7c1711d6ece4660b37e57e81aa3"
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 6,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "balance_value": "5000000000",
        "merkle_proof": "2502 chars"
    }
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
-   `node-address` \ Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
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
-   `node-address` -Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
-   `deploy-hash` - Hex-encoded hash of the deploy
