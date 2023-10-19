---
title: Factory Contracts
---

# Writing Factory Contracts

This guide presents a contract factory for simple counter contracts. The goal is to showcase the factory pattern and the Casper APIs that support this pattern. The example contract factory is a modified counter contract found [here](https://github.com/mpapierski/casper-node/blob/gh-2064-factory-pattern/smart_contracts/contracts/test/counter-factory/src/main.rs).
<!-- TODO before publishing the docs: point to the new link once the casper-node repository is updated. Or, move this counter factory example to https://github.com/casper-ecosystem/tutorials-example-wasm.-->

The factory pattern is a widely recognized software design concept used in various programming contexts. DApp developers often use the factory pattern to create smart contracts from a given factory contract. The factory pattern ensures that the contracts produced maintain a specified behavior according to a template by providing specific entry points and accepting certain arguments at runtime. Simply put, the factory contract produces other smart contracts.

Factory contracts are created using the entry point type called `EntryPointType::Install`, which marks an entry point as a factory method responsible for creating and installing contracts on the chain. The `EntryPointAccess::Template` is also needed to mark an entry point as existing in the bytecode but not callable, thus referencing Wasm exports from within entry points marked with `EntryPointType::Install`. The [CEP-86](https://github.com/casper-network/ceps/pull/86/files) proposal provides additional background and details.

:::note

Factory contracts pose a known drawback. All the smart contracts created with the factory pattern share the same bytecode installed on the chain. Thus, developers cannot modify the Wasm and thus create new, modified contracts with the factory contract. Also, developers must specify all the possible entry points in the factory contract and tag them with the `EntryPointAccess::Template` marker.

:::

