# The DSL Macros

In this guide, we describe how to configure Rust smart contracts to use the Casper DSL, making it easier for developers to start writing their smart contracts.

The DSL consists of three macro directives dividing the boilerplate code between _headers_, _constructor_, and _method blocks_. The smart contract is being treated much like a class in OOP terms.

Here is a brief description of the three macros before we take a look at a sample contract utilizing them:

Macro Instruction Description

---

Contract `casperlabs_contract` This macro generates the code for the headers for each of the entry points that use it. It sits at the very top of the contract module and includes the necessary code for contract execution. Constructor `casperlabs_constructor` This macro creates the code that sets up the contract in the runtime and locates it when execution begins. Underneath the hood, this is the deploy function that creates the contract entry point and stores the deploy hash under a function name in the Casper runtime. You can think of the function decorated by the constructor macro as the main function of the contract. Method `casperlabs_method` This macro creates an entry point for any function in your contract that you wish to expose in the smart contract. Functions that are only used internally should not be decorated with this macro. Continuing the OOP metaphor, this directive would essentially be declaring a smart contract function as being public.

## Prerequisites {#prerequisites}

The DSL relies upon working in a Rust contract, which means you need to have your development environment up and running. In the [Getting Started section](../getting-started.md), we compiled and tested a sample contract to verify our setup was functional. If you have not completed that section, please complete it before continuing with this guide.

## \[Recommended\] Getting the Macros {#recommended-getting-the-macros}

If you are new to Casper development, we recommend following this guide using the sample [Hello World](https://github.com/casper-ecosystem/hello-world) contract. This smart contract Rust file has all the macros in place, and the configuration is already set up to import the macros for you.

## Importing the Macros {#importing-the-macros}

The sample contract already has this done for you, but you should know how to do it for future contracts. To import the macros, just include a line in the `Cargo.toml` file in the *contract* folder of your smart contract. The entry needs to appear in the *\[dependencies\]* section of the file. Then `cargo` will import the macros into your project when you build it.

For example, if you placed the macros inside your project in a folder named *contract_macro* next to the _contract_ folder, you would add this line to the dependencies section of the `Cargo.toml` file:

```bash
casperlabs-contract-macro = { path = "../contract_macro" }
```

## Using the DSL {#using-the-dsl}

To use the DSL, simply add the following line to the _use section_ of the contract (usually found at the top of the file in _main.rs_):

```bash
use casperlabs_contract_macro::{casperlabs_constructor, casperlabs_contract, casperlabs_method};
```

## Examining the Hello World Example {#examining-the-hello-world-example}

Clone the [Hello World](https://github.com/casper-ecosystem/hello-world) example contract and open the `main.rs` file. Examine the following section:

```bash
#[casperlabs_contract]
mod hello_world {

    #[casperlabs_constructor]
    fn init() {
        let value = String::from(ARG_MESSAGE);
        set_key(KEY, value);
    }

    #[casperlabs_method]
    fn update(value: String) {
        set_key(KEY, value)
    }

    fn set_key<T: ToBytes + CLTyped>(name: &str, value: T) {
        match runtime::get_key(name) {
            Some(key) => {
                let key_ref = key.try_into().unwrap_or_revert();
                storage::write(key_ref, value);
            }
            None => {
                let key = storage::new_uref(value).into();
                runtime::put_key(name, key)
            }
        }
    }
}
```

Notice that all three macros are being utilized and that the file is relatively compact. This is a very simple contract that initializes a key named *special_value* with the value *hello world* once the contract is compiled and executed thanks to the constructor macro. The function *update* is decorated with the `casperlabs_method` macro and will thus be accessible for updating the value. However, notice that *set_key* is not prefaced with the macro. Since this function is used internally, it does not need to have an entry point in the Casper runtime. \`\`
