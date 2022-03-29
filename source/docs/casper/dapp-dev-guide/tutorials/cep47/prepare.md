# Preparation

First clone the contract from GitHub:

```bash
git clone https://github.com/casper-ecosystem/casper-nft-cep47.git
```

Then, move to cloned folder and prepare your environment with the following command:

```bash
cd casper-nft-cep47
make prepare
```

If your environment is set up correctly, you will see this output:

```bash
rustup target add wasm32-unknown-unknown
info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
```

If you do not see this message, check the [getting started guide](../../getting-started.md).

Next, compile your contract and run the contract unit tests.

```bash
make build-contract
make test
```
