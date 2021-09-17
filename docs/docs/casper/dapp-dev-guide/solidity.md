# Transpiling Solidity to Rust

**Introducing Caspiler - Transpile Solidity to Rust and access the cool features of Casper!**

## Smart Contracts on Casper

The Casper Virtual Machine runs smart contracts that compile to Webassembly. There are two ecosystems that provide compilation targets for webassembly: Rust and AssemblyScript. CasperLabs provides smart contract libraries to support development for both of these languages. The core development of the Casper Protocol is taking place in Rust, and as a result, there are many Rust tools that make rapid Smart Contracts development possible. It is widely recognized that most smart contracts in use today have been authored in Solidity for the EVM (Ethereum Virtual Machhine).

## Solidity

Without any doubt, the existence and simplicity of Solidity is one of the key factors behind the growth of Ethereum. There is a large group of developers for whom Solidity is still the best tool for expressing their Smart Contract ideas. At CasperLabs we feel a strong connection with the Ethereum community, so we decided to include support for Solidity via a transpiler.

## Transpiler

Transpiling is a well known process of turning code written in one high-level language into another high-level language. At the moment the most popular example is the TypeScript to JavaScript transpiler.

We have concluded that Solidity support is much easier and efficient to achieve by transpiling Solidity to Rust, rather than by compiling Solidity to WASM bytecode for the following reasons:

-   Solidity features are easy to express in Rust, which is a much richer language.
-   The shape of CasperLabs DSL is similar to Solidity.
-   The CasperLabs Rust toolchain is something we want to leverage, rather than coding it from scratch.
-   The Casper execution model is different than Ethereum's, therefore it's easier to translate it on the language level, than on the bytecode level.

## Solidity to Rust Migration

Having transpiler gives Smart Contract developers a powerful tool for the migration of the existing Solidity source code to Rust if they wish to use it.

## Simple Example

Let's see how the Solidity code is being transpiled to the CasperLabs Rust DSL. There is almost one to one translation of the core components: `contract`, `constructor` and `method`.

### Solidity

```Solidity
contract Storage {
     string value;

     constructor(string initValue) {
         value = initValue;
     }

     function getValue() public view returns (string) {
         return value;
     }

     function setValue(string newValue) public {
         value = newValue;
     }
}
```

### CasperLabs Rust DSL

```Rust
#[casper_contract]
mod Storage {

    #[casperlabs_constructor]
    fn constructor(initValue: String) {
        let value: String = initValue;
        set_key("value", value);
    }

    #[casperlabs_method]
    fn getValue() {
        ret(get_key::("value"));
    }

    #[casperlabs_method]
    fn setValue(newValue: String) {
        let value: String = newValue;
        set_key("value", value);
    }
}
```

## ERC20

It is possible to transpile a complex Smart Contracts like ERC20 Token. Full example with tests can be found in this [GitHub repository](https://github.com/casper-ecosystem/erc20).

### Deploying to Testnet.

Take a look at the deployment instructions in the dApp developer guide for details.
