# Contract Implementation

import useBaseUrl from '@docusaurus/useBaseUrl';

In [GitHub](https://github.com/casper-ecosystem/erc20), you will find a library and an example implementation of the ERC-20 token for the Casper Network. The ERC-20 standard is defined in an [Ethereum Improvement Proposal (EIP)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#).

The generic contract implementation is on the [example contract file](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs) . The next sections explain the main functionalities of the ERC20 contract in that file. 
Those are,
1.  [Installing Required Crates](/dapp-dev-guide/tutorials/erc20/implementation#installing-required-crates)
2.  [Initializing the Contract](/dapp-dev-guide/tutorials/erc20/implementation#initializing-the-contract)
3.  [Implementing Contract Methods](/dapp-dev-guide/tutorials/erc20/implementation#contract-methods)


:::note
 Please note that in order to execute the complete contract you need to copy the full contract file with all the necessary imports, declarations, and functions.
:::


## Installing Required Crates

Since this is a Rust implementation of the ERC-20 token for Casper, we will go over a few implementation details. Casper contracts require the following crates to be included:

-   [casper_contract](https://docs.rs/casper-contract/1.3.3/casper_contract/) - A Rust library for writing smart contracts on the Casper Network
-   [casper_types](https://docs.rs/casper-types/latest/casper_types/) - Types used to allow creation of Wasm contracts and tests for use on the Casper Network
-   [casper_erc20](https://docs.rs/casper-erc20/latest/casper_erc20/) - A library for developing ERC-20 tokens for the Casper Network

Here is the code snippet which imports those crates,

<img src={useBaseUrl("/image/tutorials/erc-20/erc20-implementation-install-crates.png")} alt="import-crates" width="800"/>

:::note

In Rust, the keyword `use` is like an include statement in C/C++.

:::

## Initializing the Contract
Initializing the contract happens through the `call()` function inside the [contract file](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs). When you deploy the contract, you need to initialize it with a `call()` function and define `name`, `symbol`, `decimals`, and `total_supply`, which require to start the token supply.

The code snippet for initializing the contract should look like this:

<img src={useBaseUrl("/image/tutorials/erc-20/erc20-call.png")} alt="call-function" width="800"/> 


## Contract Methods

This section briefly explains the contract methods used in our ERC20 contract.

To see the full implementation of the below contract methods, refer to the [contract file](https://github.com/casper-ecosystem/erc20/blob/master/example/erc20-token/src/main.rs) in Github. If you have any questions, review the [casper_erc20](https://docs.rs/casper-erc20/latest/casper_erc20/) library and the [EIP-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#) standard.

Contract methods are:

-   [**allowance**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L71-L77) - Returns the amount of owner’s tokens allowed to be spent by the spender
-   [**approve**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L63-L69) - Allows a spender to transfer up to an amount of the direct caller’s tokens
-   [**balance_of**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L46-L51) - Returns the token balance of the owner
-   [**decimals**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L34-L38) - Returns the decimals of the token
-   [**name**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L22-L26)- Returns the name of the token
-   [**symbol**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L28-L32) - Returns the symbol of the token
-   [**total_supply**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L40-L44) - Returns the total supply of the token
-   [**transfer**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L53-L61) - Transfers an amount of tokens from the direct caller to a recipient
-   [**transfer_from**](https://github.com/casper-ecosystem/erc20/blob/70003da1bc2aa544bb3687ba79bb5fd4bd5b5525/example/erc20-token/src/main.rs#L79-L87) - Transfers an amount of tokens from the owner to a recipient, if the direct caller has been previously approved to spend the specified amount on behalf of the owner
