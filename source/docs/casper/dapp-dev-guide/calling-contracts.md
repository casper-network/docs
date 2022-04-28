import useBaseUrl from '@docusaurus/useBaseUrl';

# Calling Contracts with the Rust Client

Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts with the [Casper command-line client](/workflow/setup/#the-casper-command-line-client) and the `put-deploy` command.

**IMPORTANT**: You will receive a deploy hash when calling the `put-deploy` command. You need this hash to verify that the deploy executed successfully.

## Prerequisites {#prerequisites}

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

In this example from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md), a hash identifies a stored contract called "counter" with an entry-point named "counter-inc".

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-hash hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e \
    --session-entry-point "counter-inc"
```

:::note

Notice that this `put-deploy` command is nearly identical to the command used to install the contract. But, instead of `session-path` pointing to the WASM binary, we have `session-hash` and `session-entry-point` identifying the on-chain contract and its associated function to execute. No Wasm file is needed since the contract is already on the blockchain.

:::

The sample response will contain a `deploy_hash`, which you need to use as described [here](installing-contracts.md#querying-global-state), to verify the changes in global state.

<details>
<summary><b>Sample response</b></summary>

```bash
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

## Calling Contracts with Session Arguments {#calling-contracts-with-session-args}

You may need to pass in information using session arguments when calling contract entry points. The `put-deploy` allows you to do this with the `--session-arg` option:

```bash
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
-   `session-arg` - For simple CLTypes, a named and typed arg is passed to the Wasm code. To see an example for each type, run the casper-client with '--show-arg-examples'

**Example:**

This example comes from the [ERC-20 Sample Guide](https://docs.casperlabs.io/workflow/erc-20-sample-guide/transfers/#invoking-balance_of-entry-point) and demonstrates how to call a contract entry point "transfer" with two arguments; one argument specifies the recipient, and the other specifies the amount to be transferred.

```bash
casper-client put-deploy 
    --node-address http://3.143.158.19:7777 \
    --chain-name integration-test \
    --secret-key ~/casper/demo/user_b/secret_key.pem \
    --payment-amount "10000000000" \
    --session-hash hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180 \
    --session-entry-point "transfer" \
    --session-arg "recipient:key='account-hash-89422a0f291a83496e644cf02d2e3f9d6cbc5f7c877b6ba9f4ddfab8a84c2670'" \
    --session-arg "amount:u256='20'" 
```

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

In this example, call a contract identified by a stored contract package hash and a version number. The entry point invoked is "counter-inc", also from the [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md).

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-hash hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e \
    --session-entry-point "counter-inc" \
    --session-version 1
```

To find the contract package hash, look at the named keys associated with your contract. Here is an example:

```bash
{
    "key": "hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",
    "name": "counter_package_name"
}
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

The sample response will contain a `deploy_hash`, which you need to use as described [here](installing-contracts.md#querying-global-state), to verify the changes in global state.

## Calling Versioned Contracts by Name {#calling-versioned-contracts-by-name}

You can access an entry point in a specific contract version by referencing the contract name, entry point, and version number. When creating the contract using [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html), provide the `hash_name`, which puts the [ContractHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractHash.html) in the context's [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#).

```rust
    
    let (stored_contract_hash, contract_version) =
        storage::new_contract(counter_entry_points, 
            Some(counter_named_keys), 
            Some("counter_package_name".to_string()),
            Some("counter_access_uref".to_string())
    );

    // The current version of the contract will be reachable through named keys
    // The constant is defined previously as: const CONTRACT_VERSION_KEY: &str = "version";
    let version_uref = storage::new_uref(contract_version);
    runtime::put_key(CONTRACT_VERSION_KEY, version_uref.into());

```

This example code stores the "contract_name" into a NamedKey, which you can reference once you install the contract in global state. In this case, the ContractHash will be stored under the "contract_name" NamedKey.

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

**Example 1:**

This example comes from the [ERC-20 Sample Guide](https://docs.casperlabs.io/workflow/erc-20-sample-guide/transfers/#invoking-balance_of-entry-point) and demonstrates how to call a contract named key and use runtime arguments. The call defaults to the highest enabled version since no version is specified.

```bash
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

**Example 2:**

This example uses the contract name "counter", version 1, the entry point "counter-inc", without any runtime arguments. 

```bash
casper-client put-deploy \
    --node-address [NODE_SERVER_ADDRESS] \
    --chain-name [CHAIN_NAME] \
    --secret-key [KEY_PATH]/secret_key.pem \
    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \
    --session-package-name "counter_package_name" \
    --session-entry-point "counter-inc" \
    --session-version 1
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

<!-- TODO - add this section when the link is ready.
## Calling Contracts that Return a Value

Visit the [Interacting with Runtime Return Values]() tutorial to learn to call a contract that returns a value.
-->

## What's Next? {#whats-next}

- [The ERC-20 Sample Guide](https://docs.casperlabs.io/workflow/erc-20-sample-guide/) has many useful examples
- The [Counter Contract Tutorial](/dapp-dev-guide/tutorials/counter/index.md) takes you through a detailed walkthrough on how to query global state to verify a contract's state
- Also, look into the [Tutorials for Smart Contract Authors](/tutorials/)
- See the rest of the [Developer How To Guides](/workflow/#developer-guides)
