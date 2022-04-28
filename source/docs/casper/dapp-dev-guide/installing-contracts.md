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

To install a contract in global state, you need to send a deploy to the network with the contract Wasm. You can do so by using the `put-deploy` command. Remember to [verify the deploy](sending-deploys.md#sending-the-deploy).

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


## Querying Global State {#query-global-state} 

<!-- TODO Refresh this section -->

Given the hash of the contract, you can query the contract's internal state. We pass in the contract's hash and the global state hash. If we look at the ERC20 contract, we see a token name specified as `_name`. We can query for the value stored here.

```bash
casper-client query-global-state --node-address http://localhost:7777 -k hash-d527103687bfe3188caf02f1e487bfb8f60bfc01068921f7db24db72a313cedb -s 0c3aaf547a55dd500c6c9bbd42bae45e97218f70a45fee6bf8ab04a89ccb9adb -q _name | jq -r
```

And we should see something like this:

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

## What's Next?

- Learn [different ways to call contracts](calling-contracts.md) using the Casper command-line client
- The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) takes you through a detailed walkthrough on how to query global state to verify a contract's state
