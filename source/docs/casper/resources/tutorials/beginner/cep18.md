---
title: ERC-20 Standard and CEP-18 Implementation and Usage
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Tutorial: ERC-20 Standard and CEP-18 Implementation and Usage

|                    |                    |
| ------------------ | ------------------------------- |
| Level: | `Beginner` |
| Time to complete: | `30 Minutes`|

Make sure you have installed the software/packages needed for this tutorial.

This tutorial assumes that you have worked through the following examples. If you have not already done so, then we recommend that you do so now:
- [Getting Started with Rust](../../../developers/writing-onchain-code/getting-started.md)
- [Writing a Basic Smart Contract in Rust](../../../developers/writing-onchain-code/simple-contract.md)

## Outline of the Tutorial {#outline}

This tutorial explains the purpose of the ERC-20 standard and the Casper CEP-18 Fungible Token implementation, which serves the same purpose for Casper blockchains. It explains the implications of not adhering to the standard and why it is important to base dApps on one common standard implementation supported by the underlying blockchain protocol.

## ERC-20 Standard {#erc20-standard}

The ERC-20 (Ethereum Request for Comment 20) standard is a technical specification used for creating and implementing tokens on the Ethereum blockchain. 

It outlines a set of rules and interfaces that tokens must adhere to in order to be compatible with the broader Ethereum ecosystem. ERC-20 tokens have become the most widely adopted and recognized token standard on Ethereum network and other Blockchain protocols like NEAR or Solana.
Some key points of the ERC-20 standard include:

- A set of functions and events that a token contract must implement to enable basic functionalities such as transferring tokens between addresses, checking token balances, and approving third-party spending of tokens. These functions include transfer(), balanceOf(), approve(), transferFrom(), and others. The tokens are not sent between wallet addresses. Instead, the token contract creates an owner list to track how many tokens are owned by which owner address.

- Optional metadata functions like `name()`, `symbol()`, and `decimals()`, which provide additional information about the token. These functions allow for the retrieval of token name, ticker symbol, and decimal places for proper display and identification purposes.

- A common set of rules for token developers to follow concerning security and consistency. This helps prevent potential vulnerabilities and ensures that tokens behave predictably across different platforms and wallets.
By adhering to the ERC-20 standard, token developers can leverage the existing infrastructure, wallets, and exchanges that support ERC-20 tokens.

Each blockchain protocol should have one official supported implementation of the ERC-20 Standard as to allow the interoperability of the assets between the protocols.

## Interaction of ERC-20 Based Tokens with the Uniswap Standard {#erc20-uniswap}

By conforming to the ERC-20 specification it is possible to leverage the functionality of decentralized exchange (DEX) implementations like Uniswap V2.

Uniswap V2 uses ERC-20 tokens in the following scenarios:

-	Listing Tokens – Any ERC-20 token can be listed on Uniswap V2 if it complies with the ERC-20 standard.
-	Liquidity Pools – any two pairs of ERC-20 tokens can be used to create a liquidity pool.
-	Uniswap V2 uses the ERC-20 standard `transfer()` function to allow an exchange of tokens within the liquidity pools.

## ERC-20 Implementations on Casper and Implications for Decentralized Exchanges {#erc20-implications}

There exist at least two different implementations of the ERC-20 Standard on Casper networks.

- [Rengo-Labs implementation](https://github.com/Rengo-Labs/casper-erc20).
- [Friendly Market implementation](https://github.com/FriendlyMarket/casper-erc20).

While both implement the ERC-20 specification using a common set of rules devised from the original ERC-20 Ethereum standard, using different implementations of the standard can introduce complexities and potential risks.

The following considerations should be applied when trying to create an ERC-20 Token:

-	Interoperability – Different implementations of the ERC-20 standard can hinder seamless integration between tokens, dApps or wallets.

-	Project Security Audits – Well-established standards usually undergo a thorough security audit. This ensures a higher level of security and reduces the risk of vulnerabilities.

-	Ecosystem – The longer a blockchain network exists, the more widespread a standard implementation like ERC-20 becomes. Using a different implementation may limit availability of supported projects and require additional effort for integration.

The CEP-18 Casper Fungible Token Standard establishes a single implementation of the ERC-20 Standard for Casper networks to avoid disparities and incompatibilities.

## CEP-18 Standard {#cep18-standard}

The CEP-18 Token Standard is a Casper network compliant implementation of ERC-20 that provides the following contract methods to interact with the token contract:

 - `allowance` - Returns the amount of owner’s tokens allowed to be spent by the spender
 - `approve` - Allows a spender to transfer up to an amount of the direct caller’s tokens
 - `balance_of` - Returns the token balance of the owner
 - `decimals` - Returns the decimal places applied to the balance of the token
 - `name` - Returns the name of the token
 - symbol - Returns the symbol of the token
 - total_supply - Returns the total supply of the token
 - transfer - Transfers an amount of tokens from the direct caller to a recipient
 - transfer_from - Transfers an amount of tokens from the owner to a recipient, if the direct caller has been previously approved to spend the specified amount on behalf of the owner

To understand how the methods work in detail, it is advisable to check the reference implementation on the [GitHub](https://github.com/casper-ecosystem/cep18). 

## Creating a CEP-18 Token on the test-net {#cep18-testnet}

### Clone and Compile the CEP-18 contract {#cep18-contract-clone}

Since we already understand how the CEP-18 standard is constructed, we will be installing our own token contract in the Global State.

If you are unsure how to interact with Casper Contracts please refer to the following tutorial: [Writing a Basic Smart Contract in Rust](../../../developers/writing-onchain-code/simple-contract.md).

We will clone the token repository and prepare the token contract for the deployment.

1.	Clone the Fungible Token contract from the repository.

```bash
	git clone https://github.com/casper-ecosystem/cep18.git
```

2.	Make any necessary changes to the code for your customization requirements.

3.	Compile the contract to create the target .wasm file and build the Wasm.

```bash
    cd cep18
    make prepare
    make build-contract
```

:::tip

If the `build-contract` finishes with an error `wasm-strip: command not found`, make sure you install an additional package: 

```bash
    brew install wabt
```

:::

4.	Build and verify the compiled contract.

```bash
	make test
```

### Install the CEP-18 Contract {#cep18-contract-install}

As it is important to understand the potential costs of your Deploy, you should send several on Testnet to familiarize yourself before sending a Deploy to Mainnet.

Use the following template to install the contract on the Testnet:

```bash

casper-client put-deploy \
    --node-address http://<HOST:PORT> \
    --chain-name [NETWORK_NAME]] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount [AMOUNT] \
    --session-path [WASM_FILE_PATH]/[File_Name].wasm
    --session-arg <"NAME:TYPE='VALUE'" OR "NAME:TYPE=null">

```

Check if the request to the Testnet can be made and get a snapshot of the network with the state root hash:

```bash

casper-client get-state-root-hash --node-address http://78.46.32.13:7777  

```

You should obtain a response similar to:

```bash
{
  "id": 3323991011802671610,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.15",
    "state_root_hash": "9b43fd7388559c078f363403972cb079d69786259bf6c5cd9cd7adcc14029d74"
  }
}
```

An exemplary deploy to the Casper Testnet is as follows:

```bash

casper-client put-deploy \
--node-address http://78.46.32.13:7777 \
--chain-name casper-test \
--secret-key "./keys/secret_key.pem" \
--payment-amount 150000000000 \
--session-path "./target/wasm32-unknown-unknown/release/cep18.wasm" \
--session-arg "name:string='CHF Coin'" \
--session-arg "symbol:string='CHFC'" \
--session-arg "decimals:u8='10'" \
--session-arg "total_supply:u256='1000'"

```

:::info

Always be mindful of the `--secret-key` and `--session-path` arguments.
Path provided to the arguments should always be with regard to the current folder, where the command is executed.

The `keys` folder is not a part of the CEP18 folder structure. Optionally you should provide a folder where your keys are stored.

:::

The response from the `put-deploy` command should look like this:

```bash

{
  "id": 5066914343373494745,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.15",
    "deploy_hash": "19853d1569fec2b0fa36e81f2f24bea77ccf039a399071cb7d4b377202a073d6"
  }
}

```

Using the `deploy_hash` the state of the deploy can be checked:

```bash

casper-client get-deploy \
    --node-address http://78.46.32.13:7777 19853d1569fec2b0fa36e81f2f24bea77ccf039a399071cb7d4b377202a073d6

```

In the execution results we can see, that the deploy was successful:

```bash

... 
 "execution_results": [
      {
        "block_hash": "426a8823c1018e75f8c3823d580116269fd272f20e60561dff0565375a95316d",
        "result": {
          "Success": {
            "cost": "140416131900",
            "effect": {
              "operations": [],
...

```

Be always mindful of the payment amount during the deploy process. If the amount is too small, then the deploy will fail with `Out of gas error`.

### Query the Entry Points in the CEP-18 contract {#cep18-contract-clone}

Get the state root hash from the network:

```bash
casper-client get-state-root-hash --node-address http://78.46.32.13:7777
```

Your response should look similar to:

```bash
{
  "id": 2950480729544096556,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.15",
    "state_root_hash": "7706d906fce25dcdadb2a9453f5243a6c72c4444e6c826cf2941157333a48705"
  }
}
```

With the state root hash and the account hash which performed the deploy, you can query the contract arguments.

```bash
casper-client query-global-state --node-address http://78.46.32.13:7777 \
--state-root-hash 7706d906fce25dcdadb2a9453f5243a6c72c4444e6c826cf2941157333a48705 \
--key account-hash-ee57bb3b39eb66b74a1dcf12f3f0e7d8e906e34b11f85dc05497bf33fbf3a1f9 \
-q "cep18_contract_hash_CHF Coin/name"
```

The above command will query the contract for the name. The template for the query is `contract_name/named_key`.

You will obtain the following response:

```bash
{
  "id": -7058786841478812744,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.15",
    "block_header": null,
    "merkle_proof": "[94526 hex chars]",
    "stored_value": {
      "CLValue": {
        "bytes": "0800000043484620436f696e",
        "cl_type": "String",
        "parsed": "CHF Coin"
      }
    }
  }
}
```

Try to query the contract for other Named Keys and check how the contract behaves.

## Summary {#summary}

In this tutorial, we:
- Explained the ERC20 standard and what the implications are for not using the standard implementations.
- Developed a CEP-18 Rust contract on a Casper network and defined the proper arguments for the deploy.
- Installed the contract on the Testnet
- Called an entry point on the contract to get the value of the Named Key `name`.