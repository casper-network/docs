# Implementation
import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial introduces the implementation of the ERC-721 standard for the Casper blockchain. CEP-47 is the Casper implementation for the NFTs. Know more about ERC_721 and CEP-47 in our [CEP-47 Introduction](/docs/dapp-dev-guide/tutorials/cep47/index) section. You can refer [Github CEP-47 repository](https://github.com/casper-ecosystem/casper-nft-cep47) which contains the code for this tutorial for further studies.

The reference contract implementation of CEP-47 is on the example [CEP-47 contract file](https://github.com/casper-ecosystem/casper-nft-cep47/blob/master/cep47/bin/cep47_token.rs). The next sections explain the main functionalities of the CEP-47 contract in that file. Those are,

1. [Installing Required Crates](./implementation#installing-required-crates)
2. [Constructing the CEP-47 contract](./implementation#constructing-the-contract)
3. [Implementing Contract Endpoints](./implementation#implementing-contract-endpoints)

:::note
 To successfully execute this reference contract you need to copy the full [contract file](https://github.com/casper-ecosystem/casper-nft-cep47/blob/master/cep47/bin/cep47_token.rs) with all the necessary imports, declarations, and functions. All those parts are required to compile the contract. To execute the contract you need to deploy the .wasm file on the network.
:::

## Installing Required Crates
CEP-47 contract requires to install following crates to function pro
- [casper_contract](https://docs.rs/casper-contract/1.3.3/casper_contract/) - A Rust library for writing smart contracts on the Casper Network
-   [casper_types](https://docs.rs/casper-types/latest/casper_types/) - Types used to allow the creation of Wasm contracts and tests for use on the Casper Network
-   cep47- A library for developing CEP-47 tokens for the Casper Network

<img src={useBaseUrl("/image/tutorials/cep-47/crate_imports.png")} alt="import-crates" width="800"/>

## Constructing the Contract    
CEP-47 constructor uses three arguments to initialize the contract. Those are name, symbol, and meta.
- *name* - Name of the NFT contract
- *symbol* - Symbol of the NFT Contract
- *meta* - Metadata about the NFT

<img src={useBaseUrl("/image/tutorials/cep-47/cep47_constructor.png")} alt="cep47-constructor" width="600"/>

## Implementing Contract Endpoints
Metadata endpoints will be used by other smart contracts

- [*name*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L44-L47) - Returns the name of the NFT contract
- [*symbol*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L50-L53) - Returns the symbol of the NFT contract
- [*meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L56-L59) - Returns the metadata of NFT
- [*total_supply*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L62-L65)- Returns the amount of issued NFTs
- [*balance_of*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L68-L72) - Returns an amount of NFT instances the `owner` owns
- [*get_token_by_index*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L75-L80) - Getter for token index. Tokens are stored by tokenId and by an index
- [*owner_of*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L83-L87) - Getter for the owner of a given token
- [*token_meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L90-L94) - Getter for the metadata for a given token
- [*update_token_meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L97-L103) -  A function to update the metadata of a token
- [*mint*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L106-L113) - Creates a list of tokens with the given ids and the given metas for one given recipient. tokenIds and metas are paired in order
- [*mint_copies*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L116-L124) - Creates for an address, several tokens with the given tokenIds but with the same meta
- [*burn*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L127-L133) - Destroys the given tokens for a given account
- [*transfer*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L136-L142) - Transfers tokens to another account
- [*transfer_from*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L145-L152) - Transfer tokens from a given account to another account
- [*approve*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L155-L161) - Give an account 'approved rights' to transfer tokens that you hold
- [*get_approved*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L164-L169) - Getter function to see if the owner has given you approved rights to the required tokens 

