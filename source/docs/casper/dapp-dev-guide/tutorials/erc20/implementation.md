# Contract Implementation

In [GitHub](https://github.com/casper-ecosystem/erc20), you will find a library and an example implementation of the ERC-20 token for the Casper Network. The ERC-20 standard is defined in an [Ethereum Improvement Proposal (EIP)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#).

## Installing Required Crates

Since this is a Rust implementation of the ERC-20 token for Casper, we will go over a few implementation details. Casper contracts require the following crates to be included:

-   [casper_contract](https://docs.rs/casper-contract/1.3.3/casper_contract/) - A Rust library for writing smart contracts on the Casper Network
-   [casper_types](https://docs.rs/casper-types/latest/casper_types/) - Types used to allow creation of Wasm contracts and tests for use on the Casper Network
-   [casper_erc20](https://docs.rs/casper-erc20/latest/casper_erc20/) - A library for developing ERC-20 tokens for the Casper Network

```rust
    use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};

    use casper_types::{CLValue, U256};

    use casper_erc20::{
        constants::{
            ADDRESS_RUNTIME_ARG_NAME, AMOUNT_RUNTIME_ARG_NAME, DECIMALS_RUNTIME_ARG_NAME,
            NAME_RUNTIME_ARG_NAME, OWNER_RUNTIME_ARG_NAME, RECIPIENT_RUNTIME_ARG_NAME,
            SPENDER_RUNTIME_ARG_NAME, SYMBOL_RUNTIME_ARG_NAME, TOTAL_SUPPLY_RUNTIME_ARG_NAME,
        },
        Address, ERC20,
    };
```

:::note

    In Rust, the keyword ``use`` is like an ``include`` statement in C/C++.

:::

## Initializing the Contract

When you deploy the [contract](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs), you need to initialize it with a `call()` function and define `name`, `symbol`, `decimals`, and `total_supply`, which are the starting token supply.

```rust
    #[no_mangle]
    fn call() {
        let name: String = runtime::get_named_arg(NAME_RUNTIME_ARG_NAME);
        let symbol: String = runtime::get_named_arg(SYMBOL_RUNTIME_ARG_NAME);
        let decimals = runtime::get_named_arg(DECIMALS_RUNTIME_ARG_NAME);
        let total_supply = runtime::get_named_arg(TOTAL_SUPPLY_RUNTIME_ARG_NAME);

        let _token = ERC20::install(name, symbol, decimals, total_supply).unwrap_or_revert();
    }
```

## Contract Methods

Review the contract in [Github](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs) to see the implementation of the contract methods. If you have any questions, review the [casper_erc20](https://docs.rs/casper-erc20/latest/casper_erc20/) library and the [EIP-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#) standard.

-   **allowance** - Returns the amount of owner’s tokens allowed to be spent by the spender
-   **approve** - Allows a spender to transfer up to an amount of the direct caller’s tokens
-   **balance_of** - Returns the token balance of the owner
-   **decimals** - Returns the decimals of the token
-   **name** - Returns the name of the token
-   **symbol** - Returns the symbol of the token
-   **total_supply** - Returns the total supply of the token
-   **transfer** - Transfers an amount of tokens from the direct caller to a recipient
-   **transfer_from** - Transfers an amount of tokens from the owner to a recipient, if the direct caller has been previously approved to spend the specified amount on behalf of the owner
