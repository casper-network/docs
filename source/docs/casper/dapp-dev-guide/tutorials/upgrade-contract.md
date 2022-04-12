# Upgrading a Contract

import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial examines how to upgrade an existing contract, similar to upgrading any other software. You can change an unlocked Casper contract by adding, editing, or deleting functionality. Once you have the new contract, you can add it to an existing contract package by knowing the contract package hash and using the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) API. Note that a [locked contract](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_locked_contract.html) cannot be versioned and is therefore not upgradable.

## Pre-requisites
- The [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html) referencing the [ContractPackage](https://docs.rs/casper-types/latest/casper_types/struct.ContractPackage.html) where an unlocked contract is stored in global state
- You should be familiar with [writing smart contracts](/writing-contracts), [on-chain contracts](/dapp-dev-guide/on-chain-contracts/), and [calling contracts](/dapp-dev-guide/calling-contracts) on the Casper Network


## Contract Versioning Flow

Here is an example workflow for creating a versioned contract. Your workflow may differ if you have already created a versioned contract and have a handle on the hash where it is stored in global state.

1. Create a contract that can be versioned
2. Add a new version of the contract using [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html)
3. Build the contract and generate the corresponding `.wasm` file
4. Install the contract on the network via a deploy
5. Verify that your new contract version works as desired


### Step 1. Create a versioned contract

When you create the contract, use the [create_contract_package_at_hash](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.create_contract_package_at_hash.html#) function to store the new (versioned) contract under a key in global state.

```rust
    // Create a contract package for this contract and save its hash value
    let (contract_package_hash, _): (ContractPackageHash, URef) =
    storage::create_contract_package_at_hash();
```

This [simple example](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/client/counter-define/src/main.rs) shows you the essential structure of a contract that can be versioned. Notice that in the `call` function, the contract is [stored under a ContractPackageHash](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/client/counter-define/src/main.rs#L65-L68).


### Step 2. Add a new contract version

There are many changes you could make to a Casper contract, including:
- Adding new entry points
- Modifying the behavior of an existing entry point in the contract
- Completely re-writing the contract

To add a new contract version, invoke the [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) function and pass in the [ContractPackageHash](https://docs.rs/casper-types/latest/casper_types/contracts/struct.ContractPackageHash.html), [EntryPoints](https://docs.rs/casper-types/latest/casper_types/contracts/struct.EntryPoints.html), and [NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html). In the counter example, you will find the `add_contract_version` call [here](https://github.com/casper-network/casper-node/blob/18571e0c22d7918a953f497649b733151cfb3c3c/smart_contracts/contracts/client/counter-define/src/main.rs#L78-L79).

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

A few notes to consider:

- The contract file name could differ from the base contract since the contract package hash connects the contract's versions after compiling to Wasm
- You need to decide how to manage contract versioning with clients using older versions

:::


### Step 3. Build the contract Wasm

Use these commands to prepare and build the new contract:

```bash
make prepare

make build-contract
```

### Step 4. Install the contract

[Install the contract](/dapp-dev-guide/on-chain-contracts/#sending-the-deploy) on the network via a deploy and verify the deploy status. You can also [monitor the event stream](/dapp-dev-guide/on-chain-contracts/#monitoring-the-event-stream-for-deploys) to see when your deploy is accepted.

### Step 5. Verify your changes 

You can write unit tests to verify the behavior of the new contract version. For the simple example counter above, here are the [corresponding tests](https://github.com/casper-network/casper-node/blob/dev/smart_contracts/contracts/test/contract-context/src/main.rs). Notice how the tests store and verify the [contract's version](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/test/contract-context/src/main.rs#L172-L173).

:::note

You could store the latest version of the contract package under a NamedKey, as shown [here](https://github.com/casper-network/casper-node/blob/8356f393d361832b18fee7227b5dcd65e29db768/smart_contracts/contracts/client/counter-define/src/main.rs#L81). Then, you can query the NamedKey to check the latest version of the contract.

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

