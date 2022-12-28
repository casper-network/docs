---
tags: ["smart contract developers","rust","put-deploy"]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Calling Smart Contracts with the Rust Client

Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts with the [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and the `put-deploy` command. Each section below includes a short video demonstrating some example output.

The following examples use two contracts on [Testnet](https://testnet.cspr.live/):

- The [counter contract](https://github.com/casper-ecosystem/counter/blob/master/contract-v1/src/main.rs) described while [Writing a Basic Smart Contract in Rust](/dapp-dev-guide/writing-contracts/rust-contracts). You will need to [install this contract](/dapp-dev-guide/writing-contracts/installing-contracts) on Testnet
- The Auction contract found in [this contract package](https://testnet.cspr.live/contract-package/e375d42c29c0e4b2baefa63cf2d70af34439eda851e08129d8515515d63bd6a9), already installed on Testnet as a system contract. The examples will call its `delegate` entry point


## Prerequisites {#prerequisites}

- You know how to [send and verify deploys](/dapp-dev-guide/building-dapps/sending-deploys.md)
- You know how to [install contracts and query global state](installing-contracts.md) using the [default Casper client](/workflow/setup#the-casper-command-line-client)
- You have installed the [counter contract](https://github.com/casper-ecosystem/counter/blob/master/contract-v1/src/main.rs) on Testnet as described in the sections leading up to this one
- You have reviewed the [system Auction contract](https://testnet.cspr.live/contract-package/e375d42c29c0e4b2baefa63cf2d70af34439eda851e08129d8515515d63bd6a9) on Testnet

## Calling Contracts by Contract Hash {#calling-contracts-by-hash}

After [installing a contract](installing-contracts.md) in global state, you can use the contract's hash to call one of its entry points. The following usage of `put-deploy` allows you to call an entry point, and you will receive a deploy hash. You need this hash to verify that the deploy executed successfully.

```rust
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

**Example - Call the counter contract by hash:**

In this example from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md), a hash identifies a stored contract called "counter" with an entry-point called "counter-inc".

```rust
casper-client put-deploy \
    --node-address http://65.21.235.219:7777 \
    --chain-name casper-test \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount 100000000 \
    --session-hash hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e \
    --session-entry-point "counter-inc"
```

:::note

This `put-deploy` command is nearly identical to the command used to [install the contract](installing-contracts.md#installing-contract-code). Here, instead of `session-path` pointing to the Wasm binary, we have `session-hash` and `session-entry-point` identifying the on-chain contract and its associated function to execute. No Wasm file is needed in this example, since the contract is already on the blockchain and the entry point doesn’t return a value. If an entry point returns a value, use code to [interact with runtime return values](/dapp-dev-guide/tutorials/return-values-tutorial/).

:::

The sample response will contain a `deploy_hash`, which you need to use as described [here](installing-contracts.md#querying-global-state), to verify the changes in global state.

<details>
<summary><b>Sample put-deploy response</b></summary>

```rust
{
  "id": 1197172763279676268,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "deploy_hash": "24b58fbc0cbbfa3be978e7b78b9b37fc1d17c887b1abed2b2e2e704f7ee5427c"
  }
}
```
</details>
<br></br>

**Video - Call a contract by hash:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=11" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## Calling Contracts with Session Arguments {#calling-contracts-with-session-args}

You may need to pass in information using session arguments when calling contract entry points. The `put-deploy` allows you to do this with the `--session-arg` option:

```rust
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash [HEX_STRING] \
    --session-entry-point [ENTRY_POINT_FUNCTION] \
    --session-arg ["NAME:TYPE='VALUE'" OR "NAME:TYPE=null"]...
```

The arguments of interest are:
-   `session-hash` - Hex-encoded hash of the stored contract to be called as the session
-   `session-entry-point` - Name of the method that will be used when calling the session contract
-   `session-arg` - For simple CLTypes, a named and typed arg is passed to the Wasm code. To see an example for each type, run: 'casper-client put-deploy --show-arg-examples'

**Example - Use session arguments:**

This example demonstrates how to call a contract entry point "transfer" with two arguments; one argument specifies the recipient, and the other specifies the amount to be transferred.

```bash
casper-client put-deploy 
    --node-address http://3.143.158.19:7777 \
    --chain-name integration-test \
    --secret-key ~/casper/demo/user_b/secret_key.pem \
    --payment-amount "100000000" \
    --session-hash hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180 \
    --session-entry-point "transfer" \
    --session-arg "recipient:key='account-hash-89422a0f291a83496e644cf02d2e3f9d6cbc5f7c877b6ba9f4ddfab8a84c2670'" \
    --session-arg "amount:u256='20'" 
```

**Video - Call a contract with session arguments:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=14" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## Calling Contracts by Package Hash {#calling-contracts-by-package-hash}

You can also call an entry point in a contract that is part of a contract package (see [contract upgrades](upgrading-contracts.md)). Call `put-deploy` using the stored package hash, the entry point you wish to access, the contract version number, and any runtime arguments. The call defaults to the highest enabled version if no version was specified.

```rust
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

**Example - Call a contract using the package hash and version:**

In this example, we call a contract by its package hash and version number. The entry point invoked is "counter-inc", also from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md).

```rust
casper-client put-deploy \
    --node-address http://65.21.235.219:7777 \
    --chain-name casper-test \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount 100000000 \
    --session-package-hash hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e \
    --session-entry-point "counter-inc" \
    --session-version 1
```

To find the contract package hash, look at the named keys associated with your contract. Here is an example:

```json
{
    "key": "hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",
    "name": "counter_package_name"
}
```

**Video - Call a contract using the package hash:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=15" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Calling Contracts by Contract Name {#calling-contracts-by-name}

We can also reference a contract using a key as the contract name. When you write the contract, use the `put_key` function to add the ContractHash under the contract's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#). The key you specify will enable you to reference the contract when calling it using `put-deploy`.

```rust
runtime::put_key("counter", contract_hash.into());
```

This example code stores the ContractHash into a URef, which you can reference once you install the contract in global state. In this case, the ContractHash will be stored under the "counter" NamedKey.

Having a key enables you to call a contract's entry-point in global state by using the `put-deploy` command as illustrated here:

```rust
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

**Example - Call a contract using a named key:**

This example uses a counter contract stored in global state under the "counter" key defined in the code snippet above and an entry-point called "counter_inc" that increments the counter.

```rust
casper-client put-deploy \
    --node-address http://65.21.235.219:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 100000000 \
    --session-name "counter" \
    --session-entry-point "counter_inc"
```

The sample response will contain a `deploy_hash`, which you need to use as described [here](installing-contracts.md#querying-global-state), to verify the changes in global state.

**Video - Call a contract using a named key:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=12" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## Calling Contracts by Package Name {#calling-contracts-by-package-name}

To call an entry point in a contract by referencing the contract package name, you can use the `session-package-name`, `session-entry-point`, and `session-version` arguments. This will enable you to access the entry-point in global state by using the `put-deploy` command as illustrated here:

```rust
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

You should have previously created the contract by using [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html), and provided the contract package name as the `hash_name` argument of `new_contract`.

This example code stores the "contract_package_name" into a NamedKey, which you can reference once you install the contract in global state.

```rust
    
    let (stored_contract_hash, contract_version) =
        storage::new_contract(counter_entry_points, 
            Some(counter_named_keys), 
            Some("counter_package_name".to_string()),
            Some("counter_access_uref".to_string())
    );

```

**Example - Specify the package name and version number:**

This example calls the entry point "counter-inc" as part of the contract package name "counter_package_name", version 1, without any runtime arguments. 

```rust
casper-client put-deploy \
    --node-address http://65.21.235.219:7777 \
    --chain-name casper-test \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount 100000000 \
    --session-package-name "counter_package_name" \
    --session-entry-point "counter-inc" \
    --session-version 1
```      

**Example - Use the package name without specifying the version:**

This example demonstrates how to call a contract that is part of the `erc20_test_call` package using runtime arguments. The call defaults to the highest enabled version since no version was specified.

```rust
    casper-client put-deploy \
    --node-address http://3.143.158.19:7777 \
    --chain-name integration-test \
    --secret-key ~/casper/demo/user_a/secret_key.pem \
    --payment-amount 1000000000 \
    --session-package-name "erc20_test_call" \
    --session-entry-point "check_balance_of" \
    --session-arg "token_contract:account_hash='account-hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180'" \
    --session-arg "address:key='account-hash-303c0f8208220fe9a4de40e1ada1d35fdd6c678877908f01fddb2a56502d67fd'" 
```

**Video - Call a contract using the package name:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=16" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Calling a Contract using Wasm {#calling-a-contract-using-wasm}

Session code or contract code (compiled to Wasm) can act on a contract and change its state. In this case, you would use the `put-deploy` command as when [installing a contract](installing-contracts.md):

```rust
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-path [PATH]/[FILE_NAME].wasm
```

The argument of interest is:
-   `session-path` - The path to the compiled Wasm on your computer

**Example - Session code acting on a contract:**

The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) shows you how to change the state of a contract (counter-define.wasm) using session code (counter-call.wasm).

```rust

casper-client put-deploy \
    --node-address http://65.21.235.219:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 25000000000 \
    --session-path [PATH_TO_YOUR_COMPILED_WASM]/counter-call.wasm

```

**Video - Call a contract using Wasm:**

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=13" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>


## Calling Contracts that Return a Value

Visit the [Interacting with Runtime Return Values](/dapp-dev-guide/tutorials/return-values-tutorial/) tutorial to learn how to call a contract that returns a value using session code or contract code.

## What's Next? {#whats-next}

- Learn more about [Delegating with the Casper Client](/workflow/delegate)
- The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) takes you through a detailed walkthrough on how to query global state to verify a contract's state
- Also, look into the [Tutorials for Smart Contract Authors](/tutorials/)
- See the rest of the [Developer How To Guides](/workflow/#developer-guides)
