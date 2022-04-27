import useBaseUrl from '@docusaurus/useBaseUrl';

# Calling Contracts with the Rust Client

Smart contracts exist to install programs to [global state](../../..///glossary/g#global-state), thereby allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts via the `put-deploy` command of the [Casper command-line client](/workflow/setup/#the-casper-command-line-client).

**IMPORTANT**: You will receive a deploy hash every time you call the `put-deploy` command below. You need this hash to verify that the deploy executed successfully.

## Prerequisites

- You know how to [send and verify deploys](/dapp-dev-guide/sending-deploys.md#sending-the-deploy)
- You know how to [install contracts and query global state](#installing-contracts) using the [default Casper client](/workflow/setup#the-casper-command-line-client)

## Calling Contracts by Hash {#calling-contracts-by-hash}

After installing a contract, you can use the contract's hash to call one of its entry points. Note that an entry point is required when calling a contract by its hash.

This usage of `put-deploy` allows you to call entry points (functions) defined in a smart contract.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash [HEX_STRING] \
    --session-entry-point [ENTRY_POINT_FUNCTION]
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-hash` - Hex-encoded hash of the stored contract to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract

**Example:**

A hash string can identify the stored contract in this example, and there is an entry-point named "init" defined within it.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash hash-abcdefghijklmnopqrstuvwxyz111111111111111222222222222223333333ab \
    --session-entry-point "init"
```

## Calling Versioned Contracts by Hash {#calling-versioned-contracts-by-hash}

<!-- TODO Add content. Add a link in upgrading-contracts to this page. -->

When you want to call a specific version of a contract with a specific entry point (that may not exist in another version), you can call `put-deploy` using the ContractPackageHash, entry point, and RuntimeArgs. 

If no value is specified, the call defaults to the highest enabled version, a more common use case described above.

## Calling Contracts by Name {#calling-contracts-by-name}

We reference a contract using a key (or a contract name) in many cases. The key you specify will enable you to reference the contract later by name. When you write the contract, use the `put_key` function to add the ContractHash under the contract's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#).

```rust
runtime::put_key("fundraiser_contract_hash", contract_hash.into());
```

This code stores the ContractHash into a URef, which will reference the contract once installed in global state. In this case, the ContractHash will be stored under the `fundraiser_contract_hash` NamedKey.

Having this key (contract name) enables you to call a contract's entry-point in global state by using the `put-deploy` command as illustrated here:

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-name [NAMED_KEY_FOR_SMART_CONTRACT] \
    --session-entry-point [ENTRY_POINT_FUNCTION]
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-name` - Name of the stored contract (associated with the executing account) to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract

**Example:**

This example uses a contract stored in global state under the "counter" key and an entry-point called "counter_inc".

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name [CHAIN_NAME] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 100000000 \
    --session-name "counter" \
    --session-entry-point "counter_inc"
```

:::note

Notice that this command is nearly identical to the command used to install the contract. But, instead of `session-path` pointing to the WASM binary, we have `session-name` and `session-entry-point` identifying the on-chain contract and its associated function to execute. No Wasm file is needed since the contract is already on the blockchain. We also reduced the payment amount to 0.1 CSPR (100000000 motes) for this entry-point.

:::

<!-- TODO add more details here -->


## Calling Versioned Contracts by Name {#calling-versioned-contracts-by-name}

<!-- TODO -->

When you want to call a specific version of a contract by name, with a specific entry point that may not exist in another version, you can call `put-deploy` using the ContractPackageHash, entry point, and RuntimeArgs. 

If no value is specified, the call defaults to the highest enabled version, a more common use case described above.

## Calling Contracts that Return a Value

<!-- TODO - add this explanation when the link is ready.

Visit the [Interacting with Runtime Return Values]() tutorial to learn how to call a contract that returns a value.

-->

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [CONTRACT_PATH]/[CONTRACT_NAME].wasm
    --session-arg ["NAME:TYPE='VALUE'" OR "NAME:TYPE=null"]...
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer
-   `session-arg` - For simple CLTypes, a named and typed arg is passed to the Wasm code. To see an example for each type, run the casper-client with '--show-arg-examples'

**Example:**

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name [CHAIN_NAME] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 100000000 \
    --session-path ~/donate.wasm \
    --session-arg "donate_purse:UREf=uref-111111111111111111112222222222222233333333333344444444444444c003-007"
```                                        

## Calling a Contract from Another Contract {#calling-a-contract-from-another}

The Wasm that you install in global state can act on another Wasm and change another contract's state. In this case, you would use the same `put-deploy` command as you did when [installing a contract in query global state](#installing-contracts).

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [CONTRACT_PATH]/[CONTRACT_NAME].wasm
```

-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer

**Example:**

The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/) shows you how to change the state of a contract (counter-define.wasm) using another contract (counter-call.wasm).

```bash

casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name [CHAIN_NAME] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 25000000000 \
    --session-path [PATH_TO_YOUR_COMPILED_WASM]/counter-call.wasm

```

## What's Next?

- [Tutorials for Smart Contract Authors](/tutorials/)
- [Developer How To Guides](/workflow/#developer-guides) 