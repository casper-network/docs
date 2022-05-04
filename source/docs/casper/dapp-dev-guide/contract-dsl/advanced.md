# Advanced Optimization

During advanced development, you may wish to optimize the output of the DSL for the blockchain once the base logic of your smart contract is in place. This requires digging into the actual code that the DSL generates, and here is where the [cargo expand](https://github.com/dtolnay/cargo-expand) command becomes a useful tool.

## Expanding the Macros {#expanding-the-macros}

To see the code that the DSL generates, you can use the `cargo expand` command. To install it, you can simply type the following in your terminal:

```bash
cargo install cargo-expand
```

Once installed, you can go into your contract folder and type:

```bash
cargo expand
```

To pipe it into a file for viewing, you can use this command:

```bash
cargo expand | ./src/main-expanded.rs
```

Once you view the output, you should see that the expanded file is much larger and more complex than the contract we viewed a moment ago. The DSL does a fantastic job of abstracting all this boilerplate code away from the development process.

You usually do not need to generate the expanded code. When the Rust compiler encounters each of the macros, it expands the code in place. The resultant expanded code is then compiled to a Wasm binary, which can then be deployed to the blockchain.

Also, keep in mind that once you have expanded and changed the generated code, you should remove the macros from the project configuration before saving the changes and building it.

## Building and Testing the Hello World Contract {#building-and-testing-the-hello-world-contract}

By building and testing the [Hello World](https://github.com/casper-ecosystem/hello-world) contract, you can see how the DSL expands the macros.

The build process is identical to the one used in the [Getting Started](../getting-started.md) section, but here we do not have the _build.rs_ script that was used before. The following steps will help you manually build the contract.

First, we need to add the Wasm target:

```bash
rustup target add wasm32-unknown-unknown
```

Next, build the contract into a Wasm binary:

```bash
cargo build --release -p contract --target wasm32-unknown-unknown
```

Then we can copy the Wasm file into the `tests` folder and run the tests:

```bash
cp target/wasm32-unknown-unknown/release/contract.wasm tests/wasm
cargo test -p tests
```

If you successfully ran the two tests (`should_run` and `should_update`), the DSL properly expanded your macros, built the binary, executed the contract, and called the update function. You should see an output similar to this if it worked correctly:

```bash
Finished test [unoptimized + debuginfo] target(s) in 0.22s
  Running target/debug/deps/tests-3b26d2abc1c949c4

running 2 tests
test tests::should_run ... ok
test tests::should_update ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.71s
```

## Using the Makefile {#using-the-makefile}

If you examine the repository contents, you'll see that there is a Makefile. This is an alternative to using a build script, as we did in the [Getting Started guide](../getting-started.md). To duplicate the steps we took above, you would simply run the following two commands in your terminal:

```bash
make prepare
make test
```
