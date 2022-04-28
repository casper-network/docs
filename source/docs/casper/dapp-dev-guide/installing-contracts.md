import useBaseUrl from '@docusaurus/useBaseUrl';

# Installing Contracts and Querying Global State

This tutorial is a continuation of the [Smart Contracts on Casper](/dapp-dev-guide/writing-contracts/rust) guide, and covers the installation of Casper contracts using the [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and the `put-deploy` command. <!-- TODO add latest links when the content is live -->

## Prerequisites

- You know how to [send and verify deploys](sending-deploys.md)
   - Your environment meets these [prerequisites](/workflow/setup/) and you have a client to interact with the network, such as the [default Casper client](/workflow/setup#the-casper-command-line-client)
   - You have a [Casper account](/workflow/setup/#setting-up-an-account) with a public and secret key pair to initiate the deploy
   - You have enough CSPR tokens in your account to pay for deploys. If you plan to use the Casper Testnet, learn about the [faucet](/workflow/token-transfer#2-the-faucet) to fund your testing account
- You understand how to write basic contract code and session code <!-- TODO add links when the content is live -->
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

The state root hash is an identifier of the current network state, or global state. It is much like a Git commit ID for commit history. It gives a snapshot of the blockchain state at a moment in time. We use it to query global state after sending deploys to the network.

```bash
casper-client get-state-root-hash --node-address [NODE_SERVER_ADDRESS]
```

**Example:**

```bash
casper-client get-state-root-hash --node-address http://localhost:11101
```

### Query global state {#query-global-state}

Next, query the state of a Casper network at a given moment in time, which is specified by the `state-root-hash` described above. You can dive into the data stored in global state using the query path argument `q`.

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
-   `key` - The identifier for the query. It must be the account public key, account hash, contract address hash, transfer hash, or deploy hash
-   `q` - An optional query path argument that allows you to drill into the specifics of a query with respect to the key

**Example 1:**

Given the hash of a contract, query the contract's internal state. Pass in the contract's hash and the global state root hash.

```bash
casper-client query-global-state \
  --node-address http://localhost:11101 \
  --state-root-hash [STATE_ROOT_HASH] \
  --key [CONTRACT_HASH] -q "counter"
```

<details>
<summary><b>Sample response</b></summary>

```bash
{
  "api_version": "1.0.0",
  "stored_value": {
    "CLValue": {
      "bytes": "0b000000e280984d65646861e28099",
      "cl_type": "String"
    }
  }
}
```
</details>
<br></br>

**Example 2:**

It is also possible check the state of a specific variable in global state.

```bash
casper-client query-global-state \ 
    --node-address http://localhost:11101 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [CONTRACT_HASH] -q "counter/count"
```

<details>
<summary><b>Sample response</b></summary>

```bash
{
  "api_version": "1.0.0",
  "stored_value": {
    "CLValue": {
      "bytes": "0b000000e280984d65646861e28099",
      "cl_type": "String"
    }
  }
}
```
</details>
<br></br>

## What's Next? {#whats-next}

- The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) takes you through a detailed walkthrough on how to query global state to verify a contract's state
- Learn [different ways to call contracts](calling-contracts.md) using the Casper command-line client