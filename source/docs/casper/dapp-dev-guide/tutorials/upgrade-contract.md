# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial examines how to upgrade an existing contract, a process similar to upgrading any other software. You can change an unlocked [contract package](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) by adding a new contract and updating the default contract version that the contract package should use. You will need to know the contract package hash and use the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) API. 

**Note:** you can also create a [locked contract package](#locked-contract-package) that cannot be versioned and is therefore not upgradable.

## Prerequisites {#prerequisites}
- The [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html) referencing the [ContractPackage](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) where an unlocked contract is stored in global state
- You should be familiar with [writing smart contracts](/writing-contracts), [on-chain contracts](/dapp-dev-guide/on-chain-contracts/), and [calling contracts](/dapp-dev-guide/calling-contracts) on the Casper Network


## Contract Versioning Flow {#contract-versioning-flow}

Here is an example workflow for creating a versioned contract package. Your workflow may differ if you have already created the contract package and have a handle on its hash.

1. Create a contract package that can be versioned
2. Add a new version of the contract using [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html)
3. Build the new contract and generate the corresponding `.wasm` file
4. Install the contract on the network via a deploy
5. Verify that your new contract version works as desired


### Step 1. Create a versioned contract package

Create a new contract package using the [create_contract_package_at_hash](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.create_contract_package_at_hash.html#) function to store the new (versioned) contract under a key in global state.

You need the access key URef returned from `create_contract_package_at_hash` in your context, giving you access to your named keys. Without the access key URef, you cannot add new contract versions for security reasons.

```rust
    // Create a contract package for this contract
    // Save its package hash and access URef for further modifications
    let (contract_package_hash, access_uref): (ContractPackageHash, URef) =
        storage::create_contract_package_at_hash();
    runtime::put_key(HASH_KEY_NAME, contract_package_hash.into());
    runtime::put_key(ACCESS_KEY_NAME, access_uref.into());
```

The [simple counter example](https://github.com/casper-network/casper-node/blob/118a80650da8219aba6eb76d9b4611b7a88d9827/smart_contracts/contracts/client/counter-define/src/main.rs#L65-L68) shows you the essential structure of a contract package that can be versioned. Notice that in the `call` function, the contract is stored under a ContractPackageHash.

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

  - `contract_package_hash` - This hash directs you to the contract package. See [Hash and Key Explanations](/dapp-dev-guide/understanding-hash-types#hash-and-key-explanations)
  - `entry_points` - Entry points of the contract, which can be modified or newly added
  - `named_keys` - Named key pairs of the contract

:::note

- The new contract version carries on named keys from the previous version. If you specify a new set of named keys, they will be combined with the old named keys in the new contract version. If the old and new contract versions use the same named keys, then the new values would be present in the new version of the contract
- You will need to manage contract versioning, considering clients that may use older versions. Here are a few options: 
   - Pin your client contract to the contract hash of a specific version
   - Use [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html) with a version number to pin your client contract to that version
   - Call a contract using [call_versioned_contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.call_versioned_contract.html) and version "None", which uses the newest version of the contract
   <!-- Add a link to Calling Contracts here, when that page is refreshed. -->
:::


### Step 3. Build the contract Wasm

Use these commands to prepare and build the newly added contract:

```bash
make prepare

make build-contract
```

### Step 4. Install the contract

[Install the contract](/dapp-dev-guide/on-chain-contracts/#sending-the-deploy) on the network via a deploy and verify the deploy status. You can also [monitor the event stream](/dapp-dev-guide/on-chain-contracts/#monitoring-the-event-stream-for-deploys) to see when your deploy is accepted.

### Step 5. Verify your changes 

You can write unit tests to verify the behavior of the new contract version. For the simple example counter above, here are the [corresponding tests](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/test/contract-context/src/main.rs). Notice how the tests store and verify the [contract's version](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/test/contract-context/src/main.rs#L172-L173).

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

## Creating a Locked Contract Package {#locked-contract-package}

You can create a [locked contract package](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_locked_contract.html) and forbid further upgrades by discarding the access key URef returned by the `create_contract_package_at_hash` function:

```rust
    // Create a locked contract package that prevents further upgrades 
    let (contract_package_hash, _): (ContractPackageHash, URef) =
    storage::create_contract_package_at_hash();
```
