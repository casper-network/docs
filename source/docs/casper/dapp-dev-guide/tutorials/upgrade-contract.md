# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial examines how to upgrade an existing contract, a process similar to upgrading any other software. You can change an unlocked [contract package](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) by adding a new contract and updating the default contract version that the contract package should use. You will need to know the contract package hash and use the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) API. 

**Note:** you can also create a [locked contract package](#locked-contract-package) that cannot be versioned and is therefore not upgradable.

## Video Tutorial {#video-tutorial}

Here is a video walkthrough of this tutorial.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=Q4ZXNV8EVTk&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites {#prerequisites}
- The [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html) referencing the [ContractPackage](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) where an unlocked contract is stored in global state
- You should be familiar with [writing smart contracts](/writing-contracts), [on-chain contracts](/dapp-dev-guide/building-dapps/sending-deploys/), and [calling contracts](/dapp-dev-guide/writing-contracts/calling-contracts) on a Casper network
- You have installed [A Counter on the Testnet](/counter-testnet/) that you will upgrade as part of this tutorial

## Contract Versioning Flow {#contract-versioning-flow}

The following is an example workflow for creating a versioned contract package. Your workflow may differ if you have already created the contract package and have a handle on its hash. 

1. Create a contract in the most common way, using [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html)
2. Add a new version of the contract using [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html)
3. Build the new contract and generate the corresponding `.wasm` file
4. Install the contract on the network via a deploy
5. Verify that your new contract version works as desired

In this tutorial, you will use [the second version](https://github.com/casper-ecosystem/counter/blob/master/contract-v2/src/main.rs) of the counter contract to perform the upgrade.

### Step 1. Create a new unlocked contract

Create a new contract using the [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html) function and store the ContractHash returned under a key in global state for later access. Under the hood, the execution engine will create a contract package (a container for the contract) that can be versioned.

When creating the contract, you can specify the package name and access URef for further modifications. Without the access key URef, you cannot add new contract versions for security reasons. Optionally, you can also save the latest version of the contract package under a named key.

```rust
    // Create a new contract and specify a package name and access URef for further modifications
    let (stored_contract_hash, contract_version) = storage::new_contract(
        contract_entry_points,
        Some(contract_named_keys),
        Some("contract_package_name".to_string()),
        Some("contract_access_uref".to_string()),
    );

    // The hash of the installed contract will be reachable through a named key
    runtime::put_key(CONTRACT_KEY, stored_contract_hash.into());

    // The current version of the contract will be reachable through a named key
    let version_uref = storage::new_uref(contract_version);
    runtime::put_key(CONTRACT_VERSION_KEY, version_uref.into());
```

This [simple counter example](https://github.com/casper-ecosystem/counter/blob/57e3912735f93e1d0f667b936675964ecfdc6594/contract-v2/src/main.rs#L105) shows you a contract package that can be versioned.

:::note

- We are versioning the contract package, not the contract. The contract is always at a set version, and it is the package that specifies the contract version to be used
- The Wasm file name of the new contract could differ from the old contract; after sending the deploy to the network, the contract package hash connects the different contract versions

:::

### Step 2. Add a new contract to the package

There are many changes you could make to a Casper contract, including:
- Adding new entry points
- Modifying the behavior of an existing entry point in the contract
- Completely re-writing the contract

To add a new contract version in the package, invoke the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) function and pass in the [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html), [EntryPoints](https://docs.rs/casper-types/latest/casper_types/contracts/struct.EntryPoints.html), and [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html). In the counter example, you will find the `add_contract_version` call [here](https://github.com/casper-ecosystem/counter/blob/57e3912735f93e1d0f667b936675964ecfdc6594/contract-v2/src/main.rs#L164).

```rust
    let (contract_hash, contract_version) = 
    storage::add_contract_version(contract_package_hash, 
                                  entry_points, 
                                  named_keys);
```

Explanation of arguments:

  - `contract_package_hash` - This hash directs you to the contract package. See [Hash and Key Explanations](../understanding-hash-types.md#hash-and-key-explanations)
  - `entry_points` - Entry points of the contract, which can be modified or newly added
  - `named_keys` - Named key pairs of the contract

:::note

- The new contract version carries on named keys from the previous version. If you specify a new set of named keys, they will be combined with the old named keys in the new contract version. If the old and new contract versions use the same named keys, then the new values would be present in the new version of the contract
- You will need to manage contract versioning, considering clients that may use older versions. Here are a few options: 
   - Pin your client contract to the contract hash of a specific version
   - Use [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html) with a version number to pin your client contract to that version
   - Call a contract using [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html) and version "None", which uses the newest version of the contract

:::

### Step 3. Build the contract Wasm

Use these commands to prepare and build the newly added contract:

```bash
make prepare

make build-contract
```

### Step 4. Install the contract

[Install the contract](../building-dapps/sending-deploys.md#sending-the-deploy) on the network via a deploy and verify the deploy status. You can also [monitor the event stream](../building-dapps/sending-deploys.md#monitoring-the-event-stream-for-deploys) to see when your deploy is accepted.


To observe the upgrade workflow you can install [the counter contract-v2](https://github.com/casper-ecosystem/counter/blob/57e3912735f93e1d0f667b936675964ecfdc6594/contract-v2/src/main.rs). If you explore the code, you will observe the different versions of the contract.
- contract-v1 is the counter contract you can see in the [counter tutorial](/dapp-dev-guide/tutorials/counter-testnet).
- contract-v2 is the contract with the new entry point called `counter_decrement`.

:::note

Installing contract-v1 as shown in the [counter tutorial](/dapp-dev-guide/tutorials/counter-testnet) is a prerequisite before installing contract-v2.

:::

Next, install the second contract version on the chain. This version contains the `counter_decrement` entry-point.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./contract-v1/target/wasm32-unknown-unknown/release/counter-v2.wasm
```

### Step 5. Verify your changes 

Running the below commands will allow you to observe the new contract entry points.

Get the NEW state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Check the new contract entry points. You should see the _counter_decrement_ entry point now.

```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter"
```
Check the version and package details with the latest state root hash:

```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "version"
```
```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter_package_name"
```

Call the new entry point, _counter_decrement_, using the package name and check the results. 

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-package-name "counter_package_name" \
    --session-entry-point "counter_decrement"
```

:::note

There are two ways to call versioned contracts:

1. Calling Contracts by Package Hash​:
- Calling the contract by package hash requires the entry point we wish to access, the contract version number, and any runtime arguments. The call defaults to the highest enabled version if no version was specified. 
- You will find the package hash under the account’s named keys.
 
```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-package-hash  [PACKAGE_HASH]] \
    --session-entry-point "counter_decrement"
```

2. Calling Contracts by Package Name​: 
- Calling the contract by its contract package name requires the session-package-name and session-entry-point. 
- This will enable you to access the entry-point in global state by using the put-deploy command. The "contract_package_name" will be stored in a NamedKey in the account's context.

 
```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-package-name  "counter_package_name" \
    --session-entry-point "counter_decrement"
```

:::

After calling the entry-point, the count value should decrement by one. You can verify the decrement by querying the network again, but you will need a new state root hash.

Get the NEW state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Get the network state, specifically for the count variable this time:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter/count"
```

You can also write unit tests to verify the behavior of the new contract version with [call_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_contract.html) or [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html). When you add a new contract to the package (which increments the highest enabled version), you will obtain a new contract hash, the primary identifier of the contract. You can use the contract hash with call_contract. Alternatively, you can use call_versioned_contract and specify the contract_package_hash and the newly added version.

For the simple example counter above, here are the [corresponding tests](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/test/contract-context/src/main.rs). Notice how the tests store and verify the [contract's version](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/test/contract-context/src/main.rs#L172-L173).

:::note

You could store the latest version of the contract package under a NamedKey, as shown [here](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/client/counter-define/src/main.rs#L81). Then, you can query the NamedKey to check the latest version of the contract package.

<details>
<summary><b>Example test function</b></summary>

```rust
        // Query latest global state under the account and get the last contract version.
        fn get_version(&self) -> u32 {
            self.test_builder
                .query(
                    None,
                    Key::Account(self.account_address),
                    &[CONTRACT_VERSION_KEY.to_string()], // Defined as: const CONTRACT_VERSION_KEY: &str = "contract_version";
                )
                .expect("should be stored value.")
                .as_cl_value()
                .expect("should be cl value.")
                .clone()
                .into_t::<u32>()
                .expect("should be u32.")
        }
```

</details>

:::

## Disabling a Contract Version

You can disable the indicated contract version of the indicated contract package by using the [disable_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.disable_contract_version.html) function. Disabled contract versions can no longer be executed.

## Creating a Locked Contract Package {#locked-contract-package}

You can create a locked contract package with the [new_locked_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_locked_contract.html) function. This contract can never be upgraded.

```rust
let (stored_contract_hash, _) = storage::new_locked_contract(
    contract_entry_points, 
    Some(contract_named_keys), 
    Some("contract_package_name".to_string()),
    Some("contract_access_uref".to_string()),
);
```

Apply the contract entry points and named keys when you call the function. You can also specify a hash_name and uref_name that will be put in the context's named keys. You do not need to save the version number returned since the version of this contract package would always be equal to 1.

:::note

Creating a locked contract package is an irreversible decision. For a contract that can be upgraded, use new_contract as explained above.

:::