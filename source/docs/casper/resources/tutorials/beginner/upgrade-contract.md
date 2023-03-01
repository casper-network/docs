# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial examines how to upgrade an existing contract, a process similar to upgrading any other software. You can change an unlocked [contract package](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) by adding a new contract and updating the default contract version that the contract package should use. You will need to know the contract package hash and use the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) API. 

**Note:** you can also create a [locked contract package](#locked-contract-package) that cannot be versioned and is therefore not upgradable.

## Video Tutorial {#video-tutorial}

Here is a video walkthrough of this tutorial.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=Q4ZXNV8EVTk&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites {#prerequisites}
- The [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html) referencing the [ContractPackage](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) where an unlocked contract is stored in global state
- You should be familiar with [writing smart contracts](/writing-contracts), [on-chain contracts](../../../developers/dapps/sending-deploys.md), and [calling contracts](../../../developers/cli/calling-contracts.md) on a Casper network

## Contract Versioning Flow {#contract-versioning-flow}

Here is an example workflow for creating a versioned contract package. Your workflow may differ if you have already created the contract package and have a handle on its hash.

1. Create a contract in the most common way, using [new_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html)
2. Add a new version of the contract using [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html)
3. Build the new contract and generate the corresponding `.wasm` file
4. Install the contract on the network via a deploy
5. Verify that your new contract version works as desired


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

This [simple counter example](https://github.com/casper-ecosystem/counter/blob/67a7eb8b306e5dcc9da9ff596987b6c4f0a98fd6/contracts/counter-define/src/main.rs#L79-L83) shows you a contract package that can be versioned.

:::note

- We are versioning the contract package, not the contract. The contract is always at a set version, and it is the package that specifies the contract version to be used
- The Wasm file name of the new contract could differ from the old contract; after sending the deploy to the network, the contract package hash connects the different contract versions

:::

### Step 2. Add a new contract to the package

There are many changes you could make to a Casper contract, including:
- Adding new entry points
- Modifying the behavior of an existing entry point in the contract
- Completely re-writing the contract

To add a new contract version in the package, invoke the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) function and pass in the [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html), [EntryPoints](https://docs.rs/casper-types/latest/casper_types/contracts/struct.EntryPoints.html), and [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html). In the counter example, you will find the `add_contract_version` call [here](https://github.com/casper-network/casper-node/blob/18571e0c22d7918a953f497649b733151cfb3c3c/smart_contracts/contracts/client/counter-define/src/main.rs#L78-L79).

```rust
    let (contract_hash, contract_version) = 
    storage::add_contract_version(contract_package_hash, 
                                  entry_points, 
                                  named_keys);
```

Explanation of arguments:

  - `contract_package_hash` - This hash directs you to the contract package. See [Hash and Key Explanations](../../../concepts/understanding-hash-types.md#hash-and-key-explanations)
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

[Install the contract](../../../developers/dapps/sending-deploys.md#sending-the-deploy) on the network via a deploy and verify the deploy status. You can also [monitor the event stream](../../../developers/dapps/sending-deploys.md#monitoring-the-event-stream-for-deploys) to see when your deploy is accepted.

### Step 5. Verify your changes 

You can write unit tests to verify the behavior of the new contract version with [call_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_contract.html) or [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html). When you add a new contract to the package (which increments the highest enabled version), you will obtain a new contract hash, the primary identifier of the contract. You can use the contract hash with call_contract. Alternatively, you can use call_versioned_contract and specify the contract_package_hash and the newly added version.

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