---
title: Factory Contracts
---

# Writing Contracts using the Factory Pattern

This guide presents a [factory pattern](https://github.com/casper-network/ceps/pull/86/files) for simple counter contracts to showcase the Casper APIs that support this pattern. The example contract in this guide is a modified counter contract found [here](https://github.com/mpapierski/casper-node/blob/gh-2064-factory-pattern/smart_contracts/contracts/test/counter-factory/src/main.rs).
<!-- TODO before publishing the docs: point to the new link once the casper-node repository is updated. Or, move this counter factory example to https://github.com/casper-ecosystem/tutorials-example-wasm.-->

The factory pattern is a widely recognized software design concept used in various programming contexts. DApp developers may use factory implementations to create smart contracts from a given source (or factory), such as a factory method or entry point. A factory pattern ensures that the contracts produced maintain a specified behavior, such as specific entry points and arguments. In general, factories produce other smart contracts according to a template.

Casper factories are created using the entry point type called `EntryPointType::Install`, which marks an entry point as a factory method responsible for creating and installing contracts on the chain. This installer entry point will derive the Wasm installed on the chain and create a new contract with the same Wasm, just different sets of entry points as required. In other words, these installer entry points marked with `EntryPointType::Install` are the contract factories. When referring to the factory contract on this page, we mean the contract containing the factory entry points.

The `EntryPointAccess::Template` marks an entry point that exists in the bytecode but is not callable. Thus, regular entry points can be referenced from within installer entry points marked with `EntryPointType::Install`. In object-oriented terms, entry points marked with `EntryPointAccess::Template` act as virtual abstract methods and cannot be called from session code. The Wasm for template entry points is declared at the factory level in the installer logic.

:::note

This factory pattern poses a known drawback when using Wasm. All the smart contracts created with the factory pattern share the same Wasm installed on the chain. Thus, developers cannot modify the Wasm once installed and create modified contracts using the factory pattern. Developers must specify all the possible entry points in the parent contract and tag them with the `EntryPointAccess::Template` marker.

:::

<!-- TODO Diagram#1 create a diagram with the dev team and insert it here. -->

## The Counter Factory Example

This section dives into a [simple counter that uses factory methods](https://github.com/mpapierski/casper-node/blob/gh-2064-factory-pattern/smart_contracts/contracts/test/counter-factory/src/main.rs) to describe how to implement the factory pattern on a Casper network. The [Counter on the Testnet Tutorial](../../resources/beginner/counter-testnet/walkthrough.md) demonstrates the non-factory version of the counter contract.

<!-- TODO before publishing the docs: point to the new link once the casper-node repository is updated. 
Or, move this counter factory example to https://github.com/casper-ecosystem/tutorials-example-wasm. If using this, add a step to "clone the repository". -->

Let's start by exploring the [session code](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L115), where the contract entry points are defined.

Two installer entry points are marked with `EntryPointType::Install`, meaning these entry points will produce new counter contracts once this Wasm is installed in global state. They are also marked with `EntryPointAccess::Public` so that they can be called from the session code.

```rust
let entry_point: EntryPoint = EntryPoint::new(
    CONTRACT_FACTORY_ENTRY_POINT.to_string(),
    Parameters::new(),
    CLType::Unit,
    EntryPointAccess::Public,
    EntryPointType::Install,
);
entry_points.add_entry_point(entry_point);
let entry_point: EntryPoint = EntryPoint::new(
    CONTRACT_FACTORY_DEFAULT_ENTRY_POINT.to_string(),
    Parameters::new(),
    CLType::Unit,
    EntryPointAccess::Public,
    EntryPointType::Install,
);
```

These two installers show how to declare multiple factory entry points and use them to initialize the Wasm they produce with different values. On [line 61](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L61C19-L61C35), the `contract_factory` entry point creates a counter contract with a given name and initial value.

```rust
#[no_mangle]
pub extern "C" fn contract_factory() {
    let name: String = runtime::get_named_arg(ARG_NAME);
    let initial_value: U512 = runtime::get_named_arg(ARG_INITIAL_VALUE);
    installer(name, initial_value);
}
```

On [line 68](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L68), the `contract_factory_default` entry point creates a counter contract with a given name and a zero initial value.

```rust
#[no_mangle]
pub extern "C" fn contract_factory_default() {
    let name: String = runtime::get_named_arg(ARG_NAME);
    installer(name, U512::zero());
}
```

:::note

The factory pattern can produce contracts with different entry points. Suppose the session code defines entry points A, B, C, and D as templates. One installer factory entry point could use entry points A and B to create a contract, and the other installer entry point might use entry points C and D. Such support at the API level enables the implementation of more complex use cases.

:::

The [installer function](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L73) creates a new counter contract by specifying its named keys and entry points. The named keys include the counter's initial value, and the entry points define the counter's `decrement` and `increment` functionality. These entry points are defined just like in any other smart contract, with `EntryPointAccess::Public` and `EntryPointType::Contract`, and they are callable for all the counters created. To learn how to call the `increment` and `decrement` functions, see the [Counter on the Testnet Tutorial](../../resources/beginner/counter-testnet/walkthrough.md), which is the non-factory version of the counter contract.

<details>
<summary>Sample installer code for a counter factory</summary>

```rust
fn installer(name: String, initial_value: U512) {
    let named_keys = {
        let new_uref = storage::new_uref(initial_value);
        let mut named_keys = NamedKeys::new();
        named_keys.insert(CURRENT_VALUE_KEY.to_string(), new_uref.into());
        named_keys
    };

    let entry_points = {
        let mut entry_points = EntryPoints::new();
        let entry_point: EntryPoint = EntryPoint::new(
            INCREASE_ENTRY_POINT.to_string(),
            Parameters::new(),
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );
        entry_points.add_entry_point(entry_point);
        let entry_point: EntryPoint = EntryPoint::new(
            DECREASE_ENTRY_POINT.to_string(),
            Parameters::new(),
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );
        entry_points.add_entry_point(entry_point);

        entry_points
    };

    let (contract_hash, contract_version) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some(PACKAGE_HASH_KEY_NAME.to_string()),
        Some(ACCESS_KEY_NAME.to_string()),
    );

    runtime::put_key(CONTRACT_VERSION, storage::new_uref(contract_version).into());
    runtime::put_key(&name, contract_hash.into());
}
```

</details>

It is important to note that the installer logic [saves the newly created contract version and contract hash](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L110-L111) under the factory contract's named keys. The installer logic runs within the factory contract context, not as part of the session code running within the account context. For more details, see the [comparison between session and contract context](../writing-onchain-code/contract-vs-session.md#comparing-session-and-contract).

```rust
runtime::put_key(CONTRACT_VERSION, storage::new_uref(contract_version).into());
runtime::put_key(&name, contract_hash.into());
```

For example, if you install the factory counter contract, you will see only one named key for this contract in your account, with the two installer entry points `contract_factory` and `contract_factory_default`. See [lines 155-163](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L155C1-L163).

If you call the installer three times to create 3 different counters, you will see 3 named keys for each counter in the factory contract's named keys. The counter contracts produced will have the `increment` and `decrement` entry points.

<!-- TODO Diagram#2 create a diagram with the dev team and insert it here. Or take screenshots from cspr.live depicting this setup. -->

As explained above, developers must define all the possible non-installer entry points in the factory contract and tag them with the `EntryPointAccess::Template` and `EntryPointType::Contract` markers. See [lines 135-139](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/smart_contracts/contracts/test/counter-factory/src/main.rs#L135C9-L149C11):

```rust
let entry_point: EntryPoint = EntryPoint::new(
    INCREASE_ENTRY_POINT.to_string(),
    Parameters::new(),
    CLType::Unit,
    EntryPointAccess::Template,
    EntryPointType::Contract,
);
entry_points.add_entry_point(entry_point);
let entry_point: EntryPoint = EntryPoint::new(
    DECREASE_ENTRY_POINT.to_string(),
    Parameters::new(),
    CLType::Unit,
    EntryPointAccess::Template,
    EntryPointType::Contract,
);
```

:::warning

Suppose developers forget to declare an entry point in the outermost session logic (the `call` function) and mark it with `EntryPointAccess::Template`; that Wasm export will be removed when the factory contract is installed in global state. Creating the entry point in the installer logic is not sufficient.

:::

### Unit tests

Developers can test contracts that follow the factory pattern using the Casper testing framework described under [Unit Testing Smart Contracts](./testing-contracts.md). The testing process is the same, but this section highlights a particular test called [should_install_and_use_factory_pattern](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L116C4-L116C42) found in the [unit test suite](https://github.com/mpapierski/casper-node/blob/gh-2064-factory-pattern/execution_engine_testing/tests/src/test/counter_factory.rs) of the counter factory. As the name suggests, the test installs a contract that uses the factory pattern and checks its behavior.

On [line 120](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L120), the test starts building a request to call the `contract_factory` entry point with counter name `new-counter-1` and value 1. On [line 134](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L134), the test calls another factory entry point called `contract_factory_default` with counter name `new-counter-2`. The default counter value is 0. 

Once the requests are processed, the test checks the contract hashes of the contracts created:

- The factory contract on [line 146](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L146)
- The first counter on [line 157](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L157)
- The second counter on [line 168](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L168)

The test proceeds to get the contract Wasm for each counter produced and test the Wasm exports, which are the `increment` and `decrement` entry points in each counter contract.

The `setup` function on [line 209](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L209) is a helper function for installing the factory contract on the chain and getting the contract factory hash.

The other tests in this file are also interesting:

- [should_not_call_undefined_entrypoints_on_factory](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L25) - This test verifies that entry points marked as a template cannot be called directly from the factory contract
- [contract_factory_wasm_should_have_expected_exports](https://github.com/mpapierski/casper-node/blob/a4d7d5a4f67e7860b2e8c57d74c864860b4e74c8/execution_engine_testing/tests/src/test/counter_factory.rs#L87C4-L87C54) - This test checks the entry points declared in the contract factory

<!-- TODO these tests have an #ignore tag. We should probably move them to the example repository.-->

## What's Next? {#whats-next}

- [Best Practices for Casper Smart Contract Authors](./best-practices.md) - An outline of best practices when developing smart contracts on a Casper network
