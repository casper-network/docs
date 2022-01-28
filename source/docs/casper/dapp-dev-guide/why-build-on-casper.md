# Why Build on Casper

This guide intends to briefly show you the current features and advantages of building on the Casper Network.

- [Developer-Friendly Language](#developer-friendly-language)
- [Advanced Account Management](#advanced-account-management)
- [Contract Upgrades](#contract-upgrades)
- [Development Tools](#development-tools)
   - [IDE Integration](#ide-integration)
   - [CI/CD](#ci-cd)
   - [Local Network Testing](#local-network-testing)
   - [AWS](#aws)
- [SDK Client Libraries](#sdk-client-libraries)
- [Low Gas Fees](#low-gas-fees)

## Developer-Friendly Language {#developer-friendly-language}
Casper Network's development ecosystem is designed to support WebAssembly, rather than being written in proprietary languages like Solidity. This feature simplifies the development path for enterprises and development teams that want to build on the Casper Network.

Rust is a beloved programming language for its safety and performance. We offer a Rust experience and a runtime environment for developing smart contracts . The Rust smart contracts are compiled to WebAssembly (WASM), which is an [open standard](https://en.wikipedia.org/wiki/Open_standard) for performance and portability of modern web applications. 

:::note

WASM can support any language compiled or interpreted on any operating system with the help of appropriate tools. Therefore, we can support more languages for smart contracts as compilation targets for WebAssembly become available.  

:::

## Advanced Account Management {#advanced-account-management}
The Casper Network offers advanced account management with weighted keys for separating permissions and account actions, supporting delegation, weighted multi-signatures, and more. Other essential features include an account permissions model that allows the recovery of lost keys and a permissions model to securely share state between accounts and contracts (without expensive cryptographic checks). Refer to the [Casper Permissions Model](https://casper.network/docs/design/accounts#accounts-permissions) for more details.

## Contract Upgrades {#contract-upgrades}
Casper allows the direct upgrading of on-chain smart contracts, eliminating the need for complex migration processes and making it easy for developers to correct smart contract vulnerabilities. Contracts can be upgradable or immutable,  and organizations can version their contracts, deprecate old versions, and set permissions around who can perform contract upgrades. 

## Development Tools {#development-tools}

### IDE Integration {#ide-integration}

The Casper development process is designed to be familiar to all developers. You can run and build code locally within an IDE and use assertions and tests to verify the functionality of your application. You can set the contract's starting state and create and run tests on your development machine. 


### CI/CD {#ci-cd}

Casper also provides the instrumentation and tooling that seamlessly integrates existing Continuous Integration/Continuous Deployment pipelines. Build servers can run the Casper Virtual Machine without the overhead of a full node, tracking the blockchain internal state and running assertions, thus enabling a solid development pipeline.

### Local Network Testing {#local-network-testing}
We also offer a tool to run a [local Casper Network](https://casper.network/docs/dapp-dev-guide/setup-nctl). Even though you don't need a stand-alone node for smart contract development, you can configure your local network to test your deployments and estimate gas costs. A local network is helpful when integrating your dApp into a mobile or web interface.

### Public Mainnet and Testnet {#public-mainnet-and-testnet}
The Casper [Mainnet](https://cspr.live) is a public, open-source, community-driven ecosystem. You can also explore the [Testnet](https://testnet.cspr.live) to test drive your applications and estimate gas costs.

### AWS {#aws}
We also offer several tools to run AWS instances of Casper nodes.

## SDK Client Libraries {#sdk-client-libraries}
In addition to the default [command-line Rust client](https://casper.network/docs/workflow/setup#the-casper-command-line-client), the Casper community is building [other clients](https://casper.network/docs/sdk) in JavaScript, Java, Golang, Python, C#, and other languages. 

## Low Gas Fees {#low-gas-fees}
Casper seeks to eliminate volatility and improve developer and enterprise experiences by establishing transparent, consistent, and low gas prices. This feature seeks to promote active and diverse network behaviour and we are researching innovative pricing models that will favor dApp developers as the ecosystem grows.
