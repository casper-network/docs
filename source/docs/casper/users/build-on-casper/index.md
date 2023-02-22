---
title: Introduction
slug: introduction
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Introduction

This guide intends to briefly show you the current features and advantages of building on the Casper Mainnet.

  - [Thriving Ecosystem](#thriving-ecosystem)
  - [Developer-Friendly Language](#developer-friendly-language)
  - [Powerful Accounts](#powerful-accounts)
  - [Contract Upgrades](#contract-upgrades)
  - [Development Tools](#development-tools)
  - [SDK Client Libraries](#sdk-client-libraries)
  - [Low Gas Fees](#low-gas-fees)

## Thriving Ecosystem {#thriving-ecosystem}
The Casper Ecosystem is growing every day through the addition of new dApps and tools. Here is a short list of tools you can use.

### Wallets
- [Ledger](https://support.ledger.com/hc/en-us/articles/4416379141009-Casper-CSPR-?docs=true)
- [Tor.us](https://casper.tor.us)
- [Casper Signer](https://chrome.google.com/webstore/search/casper?hl=en)

### Block Explorers
- [cspr.live](https://cspr.live)
- [Casper.info](https://casper-trench.vercel.app/)

### Developer Tools
- [casperholders.io](https://casperholders.io)
- [NOWNodes.io](https://nownodes.io/nodes/casper-cspr)

### Open Source Software
- [Ecosystem Open Source Software](./casper-open-source-software.md)


## Developer-Friendly Language {#developer-friendly-language}
Casper Network's development ecosystem supports WebAssembly by design, rather than requiring proprietary languages like Solidity. Casper contracts function just like regular software. This feature simplifies the development path for enterprises and development teams that want to build on the Casper Mainnet.

Rust is a beloved programming language for its safety and performance. We offer a Rust experience and a runtime environment for developing smart contracts . The Rust smart contracts are compiled to WebAssembly (Wasm), which is an [open standard](https://en.wikipedia.org/wiki/Open_standard) for performance and portability of modern web applications. 

:::note

Wasm can support any language compiled or interpreted on any operating system with the help of appropriate tools. Therefore, we can support more languages for smart contracts as compilation targets for WebAssembly become available.  

:::

## Powerful Accounts {#powerful-accounts}
Each Casper network offers powerful accounts that are more than just public keys. Accounts offer weights for separate key management and transaction signing rights, and the ability to run session code (Wasm) in an account's context. By running session code, it's possible to delegate transaction signing to multiple keys, revoke lost keys to recover accounts and store data within the account itself. It is also possible to securely share state between accounts and contracts (without expensive cryptographic checks). Refer to the [Casper Permissions Model](../../design/casper-design.md#accounts-permissions) for more details.

## Contract Upgrades {#contract-upgrades}
Casper smart contracts use a package management model, which allows the direct upgrading of on-chain smart contracts, eliminating the need for complex migration processes and making it easy for developers to add new features or fix bugs by adding a new version of the contract. When installing a contract, it's possible to designate a contract as 'not upgradeable', which is suitable for DeFi contracts.

## Development Tools {#development-tools}

### IDE Integration {#ide-integration}

The Casper development process strives to be familiar to all developers. You can run and build code locally within an IDE and use assertions and tests to verify the functionality of your application. You can set the contract's starting state and create and run tests on your development machine. Casper contracts function like regular software, so there is little you need to know about the blockchain to get started.


### CI/CD {#ci-cd}

Casper also provides the instrumentation and tooling that seamlessly integrates existing Continuous Integration/Continuous Deployment pipelines. Build servers can run the Casper Virtual Machine without the overhead of a full node, tracking the blockchain internal state and running assertions, thus enabling a solid development pipeline.

### Local Network Testing {#local-network-testing}
We also offer a tool to run a [local Casper Network](../building-dapps/setup-nctl.md). Even though you don't need a stand-alone node for smart contract development, you can configure your local network to test your deployments and estimate gas costs. A local network is helpful when integrating your dApp into a mobile or web interface.

### Public Mainnet and Testnet {#public-mainnet-and-testnet}
The Casper [Mainnet](https://cspr.live) is a public, open-source, community-driven ecosystem. You can also explore the [Testnet](https://testnet.cspr.live) to test drive your applications and estimate gas costs.

### AWS {#aws}
We also offer several tools to run AWS instances of Casper nodes.

## SDK Client Libraries {#sdk-client-libraries}
In addition to the default [command-line Rust client](../setup.md#the-casper-command-line-client), the Casper community is building [other clients](/sdk) in JavaScript, Java, Golang, Python, C#, and other languages. 

## Low Gas Fees {#low-gas-fees}
Casper seeks to eliminate volatility and improve developer and enterprise experiences by establishing transparent, consistent, and low gas prices. This feature seeks to promote active and diverse network behaviour and we are researching innovative pricing models that will favor dApp developers as the ecosystem grows.
