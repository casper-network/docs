import useBaseUrl from '@docusaurus/useBaseUrl';

# Installing Contracts and Querying Global State

This tutorial is a continuation of the [Smart Contracts on Casper](/dapp-dev-guide/writing-contracts/rust) guide, and covers the installation of Casper contracts using the [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and the `put-deploy` command. <!-- TODO add latest links when the content is live -->

## Prerequisites

- You know how to [send and verify deploys](sending-deploys.md)
   - Your environment meets these [prerequisites](/workflow/setup/) and you have a client to interact with the network, such as the [default Casper client](/workflow/setup#the-casper-command-line-client)
   - You have a [Casper account](/workflow/setup/#setting-up-an-account) with a public and secret key pair to initiate the deploy
   - You have enough CSPR tokens in your account to pay for deploys. If you plan to use the Casper Testnet, learn about the [faucet](/workflow/token-transfer#2-the-faucet) to fund your testing account
- You understand how to [write basic contract code](/dapp-dev-guide/writing-contracts/index.md) and session code
- You have a contract Wasm to send to a Casper network

## Installing a Contract in Global State {#installing-contract-code}

To install a contract in [global state](/glossary/G.md#global-state), you need to send a deploy to the network with the contract Wasm. You can do so by using the `put-deploy` command. Remember to [verify the deploy](sending-deploys.md#sending-the-deploy).

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

**Example:**

Here is an example from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/walkthrough/#deploy-the-counter).

```bash
casper-client put-deploy \
    --node-address http://localhost:11101 \
    --chain-name casper-net-1 \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./counter/target/wasm32-unknown-unknown/release/counter-define.wasm
```

Verify the deploy using the deploy hash you received from `put-deploy`.

```bash
casper-client get-deploy \
    --node-address http://localhost:11101 [DEPLOY_HASH]
```

## Querying Global State {#querying-global-state} 

Here we look at how to query the global state to see when the network has successfully installed the contract.

### Get the state root hash {#get-state-root-hash}

First, you will need to get the state root hash. After sending deploys to the network, you must get the new state root hash to see the new changes reflected. Otherwise, you would be looking at past events.

The state root hash identifies the current network state (global state). It is much like a Git commit ID for commit history. It gives a snapshot of the blockchain state at a moment in time. We use it to query global state after sending deploys to the network.

```bash
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

**Example:**

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
-   `state-root-hash` - 
-   `key` - The identifier for the query. It must be the account public key, account hash, contract package hash, transfer hash, or deploy hash
-   `q` - An optional query path argument that allows you to drill into the specifics of a query with respect to the key

**Example 1:**

To find details about the installed contract, query global state using your account hash. You can run the `account-address` command first if you need your account hash. This example comes from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md), where we install a "counter" contract on the chain.

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
```

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
  --key account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d
```

Notice that the sample response contains several named keys, including "counter", "counter_package_name", and "version". You can use these values to query the contract state further, as shown in the next example.

<details>
<summary><b>Sample response</b></summary>

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

**Example 2:**

This example shows you how to query global state given a contract hash. We will use the contract hash from the sample response in Example 1 above.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101  \
  --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
  --key hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e
```

The sample response contains useful details such as the `contract_package_hash`, the contract `entry_points`, and the `named_keys` for the contract.

<details>
<summary><b>Sample response</b></summary>

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
        "contract_package_hash": "contract-package-wasm76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",
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


**Example 3:**

Next, you can query a named key associated with the contract using the `-q` option. This example comes from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md), where a "count" variable is incremented and stored under a named key for the "counter" contract.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash [STATE_ROOT_HASH] \
  --key [CONTRACT_HASH] -q "count"
```

<details>
<summary><b>Sample response</b></summary>

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

**Example 4:**

It is also possible to check the state of a specific contract variable in global state given the account hash under which the contract was installed.

```bash
casper-client query-global-state \ 
    --node-address http://localhost:11101 \
    --state-root-hash fa968344a2000282686303f1664c474465f9a028f32ec4f51791d9fa64c0bcd7 \
    --key account-hash-1d17e3fdad268f866a73558d1ae45e1eea3924c247871cb63f67ebf1a116e66d \
    -q "counter/count"
```

The response should be the same as in Example 3, above.

**Example 5:**

Query the contract package hash to get the contract hash and contract version.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \ 
  --key hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e \
  --state-root-hash 763e737cf55a298d54bcdfb4ee55526538a1a086128914b9cc25ccbdebbbb966
```

The response will contain the `contract_hash`, which you will need to [call a contract by hash](calling-contracts.md#calling-contracts-by-hash) in the next section. You will also see the `access_key` for the `ContractPackage` and the current `contract_version`.

<details>
<summary><b>Sample response</b></summary>

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

## What's Next? {#whats-next}

- Learn [different ways to call contracts](calling-contracts.md) using the Casper command-line client
- The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) takes you through a detailed walkthrough on how to query global state to verify a contract's state