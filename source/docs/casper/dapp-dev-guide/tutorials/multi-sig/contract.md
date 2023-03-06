# Contract Example

This section covers an example smart contract used for key management.

## Implementing the Smart Contract {#implementing-the-smart-contract}

First, download [the example contract and client](https://github.com/casper-ecosystem/keys-manager) for key management.

```bash
git clone https://github.com/casper-ecosystem/keys-manager
```

This smart contract can help you manage your account. You can add keys and remove keys from your account, define weights for each key, and set thresholds for key management and network deployments.

You could also refer to this smart contract as the _account code_. 

:::note

Once you deploy this smart contract, you cannot change it. As a result, you can rely on its behavior and state as if it were a binding agreement.

:::

The account code execution starts in `main.rs`, where the `call` function calls the `execute` function. This code is similar to a script that executes and implements your account behavior. Remember that when you send a contract (Wasm file) to the network, the contract execution engine will invoke the `call` function. 

The following functions defined in `main.rs` will help you manage your keys. 

| Function                      | Description                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------|
| set_key_weight                | Sets the weight for a specific key                                                                     |
| set_deployment_threshold      | Sets the threshold for deployments, given the permission level and associated weight                   |
| set_key_management_threshold  | Sets the threshold for key management, given the permission level and associated weight                |
| set_all                       | Sets all the three parameters: weight for a specific key, and thresholds for deployments and key management |

Possible errors that can arise are defined in `errors.rs`. 

In the next section, you will prepare and build the smart contract for deployment.

## Building the Smart Contract {#building-the-smart-contract}

Before building the smart contract for this tutorial, you need to [install Rust](../../../developers/writing-onchain-code/getting-started.md) and [set up the development environment](../../../developers/writing-onchain-code/getting-started.md#development-environment-setup).

Navigate to the `keys-manager` folder and compile the smart contract to generate the corresponding Wasm file.

```bash
cd keys-manager
make prepare
make build-contract
```

If the commands are successful, you will find a `keys-manager.wasm` file in the `/keys-manager/contract/target/wasm32-unknown-unknown/release/keys-manager.wasm` directory.

Next, we will review the sample client that invokes this contract to set up the account and perform key management.
