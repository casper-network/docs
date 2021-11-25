# Verifying a Transfer

## Prerequisite

You need to endure the following prerequisites are met, before verifying a transfer:

1.  Set up your machine as per the [prerequisites](setup.md)
2.  Use the Casper [command-line client](/workflow/setup#the-casper-command-line-client)
3.  Initiate a transfer using [Direct Transfer](transfer-workflow.md) or [Multi-sig Deploy Transfer](deploy-transfer.md)
4.  Get the `PublicKey` hex for the source and target accounts

### State Root Hash {#state-root-hash}

State information like the balance of an account on a Casper blockchain is stored in the [Global State](../design/global-state.md).

We will use the `get-block` command and the `block_hash` to query and retrieve the block that contains our deploy. We will use the `state_root_hash` from the response to look up various values, like the source and destination account and their balances.

```bash
casper-client get-block \
      --id 3 \
      --node-address http://<node-ip-address>:7777 \
      --block-identifier <block-hash> \
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
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

## Query the Source Account {#query-the-source-account}

Next, we will query for information about the _Source_ account, using the `state-root-hash` of the block containing our transfer and the public key of the _Target_ account.

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

## Query the Target Account {#query-the-target-account}

We will repeat the previous step to query information about the _Target_ account.

```bash
casper-client query-state \
      --id 5 \
      --state-root-hash <state-root-hash> \
      --key <hex-encoded-target-account-public-key>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `state-root-hash` - Hex-encoded hash of the state root
-   `key` - The base key for the query. This must be a properly formatted public key, account hash, contract address hash, URef, transfer hash, or deploy-info hash.

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

## Get Source Account Balance {#get-source-account-balance}

All accounts on a Casper system have a purse associated with the Casper system mint, which we call the _main purse_. The balance associated with a given purse is recorded in the global state, and the value can be queried using the `URef` associated with the purse.

Now that we have the source purse address, we can get its balance using the `get-balance` command:

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

## Get Target Account Balance {#get-target-account-balance}

Similarly, now that we have the address of the target purse, we can get its balance.

    casper-client get-balance \
          --id 7 \
          --node-address http://<node-ip-address>:7777 \
          --state-root-hash <state-root-hash> \
          --purse-uref <target-account-purse-uref>

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
    "id": 7,
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
    "id": 7,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "balance_value": "5000000000",
        "merkle_proof": "2502 chars"
    }
}
```

</details>

## Query Transfer Details {#query-transfer-details}

Deploys in a Casper Network can contain multiple transfers. When such a deploy is executed, the information about each individual transfer is written to the global state. Each transfer can be uniquely identified by a hash known as the `transfer-address`, a formatted string with a `transfer-` prefix.

We will use the `transfer-` to query more details about the transfer.

```bash
casper-client query-state \
      --id 8 \
      --node-address http://<node-ip-address>:7777 \
      --state-root-hash <state-root-hash> \
      --key transfer-
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `node-address` - Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]
-   `state-root-hash` - Hex-encoded hash of the state root
-   `key` - The base key for the query. This must be a properly formatted transfer address; "transfer-"

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

The query responds with more information about the transfer we conducted: its deploy hash, the account which executed the transfer, the source, and target purses, and the target account. Using this additional information, we can verify that our transfer was executed successfully.
