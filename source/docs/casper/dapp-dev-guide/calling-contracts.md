import useBaseUrl from '@docusaurus/useBaseUrl';

# Calling Contracts with the Rust Client

Smart contracts exist to install programs to global state, thereby allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts with the [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and the `put-deploy` command.

**IMPORTANT**: You will receive a deploy hash when you call the `put-deploy` command. You need this hash to verify that the deploy executed successfully.

## Prerequisites

- You know how to [send and verify deploys](sending-deploys.md)
- You know how to [install contracts and query global state](installing-contracts.md) using the [default Casper client](/workflow/setup#the-casper-command-line-client)

## Calling Contracts by Hash {#calling-contracts-by-hash}

After installing a contract in global state, you can use the contract's hash to call one of its entry points. The following usage of `put-deploy` allows you to call entry points defined in a smart contract.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash [HEX_STRING] \
    --session-entry-point [ENTRY_POINT_FUNCTION]
```

The arguments used above are:
-   `node-address` - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777
-   `chain-name` - The chain name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
-   `secret-key` - The file name containing the secret key of the account paying for the deploy
-   `payment-amount` - The payment for the deploy in motes
-   `session-hash` - Hex-encoded hash of the stored contract to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract

**Example:**

In this example, a hash identifies a stored contract with an entry-point named "init".

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash hash-abcdefghijklmnopqrstuvwxyz111111111111111222222222222223333333ab \
    --session-entry-point "init"
```

:::note

Notice that this `put-deploy` command is nearly identical to the command used to install the contract. But, instead of `session-path` pointing to the WASM binary, we have `session-name` and `session-entry-point` identifying the on-chain contract and its associated function to execute. No Wasm file is needed since the contract is already on the blockchain.

:::

## Calling Versioned Contracts by Hash {#calling-versioned-contracts-by-hash}

You can also call an entry point in a contract that is part of a contract package (see [contract upgrades](upgrading-contracts.md)). Call `put-deploy` using the stored package hash, the entry point you wish to access, the contract version number, and any runtime arguments. The call defaults to the highest enabled version if no version is specified.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-hash [HEX_STRING] \
    --session-entry-point [ENTRY_POINT_FUNCTION] \
    --session-version [INTEGER]
```

The arguments of interest are:
-   `session-package-hash` - Hex-encoded hash of the stored package to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract
-   `session-version` - Version of the called session contract. The latest will be used by default

**Example:**

In this example, a hash identifies a stored contract package and the version number identifying the contract. The entry point invoked is "init".

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-hash hash-abcdefghijklmnopqrstuvwxyz99999999999999988888888888888aaaaaaabb \
    --session-entry-point "init" \
    --session-version 3
```

## Calling Contracts by Name {#calling-contracts-by-name}

We can also reference a contract using a key (or a contract name). The key you specify in the contract code will enable you to reference the contract. When you write the contract, use the `put_key` function to add the ContractHash under the contract's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#).

```rust
runtime::put_key("counter", contract_hash.into());
```

This example code stores the ContractHash into a URef, which you can reference once you install the contract in global state. In this case, the ContractHash will be stored under the "counter" NamedKey.

Having a key enables you to call a contract's entry-point in global state by using the `put-deploy` command as illustrated here:

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-name [NAMED_KEY_FOR_SMART_CONTRACT] \
    --session-entry-point [ENTRY_POINT_FUNCTION]
```

The arguments of interest are:
-   `session-name` - Name of the stored contract (associated with the executing account) to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract

**Example:**

This example uses a counter contract stored in global state under the "counter" key defined above, and an entry-point called "counter_inc" increments the counter.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name [CHAIN_NAME] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 100000000 \
    --session-name "counter" \
    --session-entry-point "counter_inc"
```

## Calling Versioned Contracts by Name {#calling-versioned-contracts-by-name}

You can also access an entry point in a specific version of a contract by name (see [contract upgrades](upgrading-contracts.md)). When creating the contract, use the `put_key` function to add the ContractPackageHash under the contract package's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#).

<!-- TODO ADD CODE -->

This example code stores the ContractPackageHash into a URef, which you can reference once you install the contract and contract package in global state. In this case, the ContractPackageHash will be stored under the "counterPackage" NamedKey.

The package key and version number enable you to access a contract's entry-point in global state by using the `put-deploy` command as illustrated here:

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-name [NAMED_KEY_FOR_PACKAGE] \
    --session-entry-point [ENTRY_POINT_FUNCTION] \
    --session-version [INTEGER]
```

The arguments of interest are:
-   `session-package-name` - Name of the stored package to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract
-   `session-version` - Version of the called session contract. The latest will be used by default

**Example:**

In this example, call `put-deploy` using the package name "counterPackage", version number 3, the entry point "init", and any runtime arguments. The call defaults to the highest enabled version if no version is specified.

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-name "counterPackage" \
    --session-entry-point "init" \
    --session-version 3
```                               

## Calling a Contract from Another Contract {#calling-a-contract-from-another}

The Wasm that you install in global state can act on another Wasm and change another contract's state. In this case, you would use the same `put-deploy` command as when [installing a contract in query global state](installing-contracts.md).

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [CONTRACT_PATH]/[CONTRACT_NAME].wasm
```

The argument of interest is:
-   `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer

**Example:**

The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) shows you how to change the state of a contract (counter-define.wasm) using another contract (counter-call.wasm).

```bash

casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name [CHAIN_NAME] \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 25000000000 \
    --session-path [PATH_TO_YOUR_COMPILED_WASM]/counter-call.wasm

```

## Calling Contracts with Session Arguments

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [CONTRACT_PATH]/[CONTRACT_NAME].wasm
    --session-arg ["NAME:TYPE='VALUE'" OR "NAME:TYPE=null"]...
```

The arguments of interest are:
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

<!-- TODO - add this section when the link is ready.
## Calling Contracts that Return a Value

Visit the [Interacting with Runtime Return Values]() tutorial to learn to call a contract that returns a value.
-->

## What's Next?

- [Tutorials for Smart Contract Authors](/tutorials/)
- [Developer How To Guides](/workflow/#developer-guides) 