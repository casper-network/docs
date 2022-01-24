# Introduction

This tutorial takes you through the NFT implementation of the Casper Network. Before diving deep into the Casper NFT implementation, let's cover some knowledge on overall NFT design. The following sections illustrate the origin and the development of NFTs in the blockchain domain.

### ERC-721 Standard
ERC-721 is the standard defined to implement the [non-fungible tokens](/docs/glossary/N#non-fungible-token) inside Ethereum blockchain. This standard defines a minimum interface a smart contract should implement to manage, own and trade the unique tokens.  

## ERC-721 Implementation within Casper Network
While [ERC-721](https://eips.ethereum.org/EIPS/eip-721) is the original name for the standard given in Ethereum blockchain, CEP-47 is the customized standard for the Casper platform. CEP-47 standard supports the NFT behaviors inside the Casper network. Casper ecosystem needs an NFT standard to enable further development of the NFT-based products. Due to the unique features within the Casper VM, the standards originate from Ethereum ecosystem are not the best choice for the Casper platform. Hence, CEP-47 is built to support these deviations and it is mainly focused on a gas-efficient design to support those unique traits.

## CEP-47 Standard
CEP47 takes full advantage of the URef feature to optimize smart contracts interactions. It also uses the Groups feature to optimize gas costs. Since this is a different type of token there are special endpoint implementations to support that unique features. You can find the [main functions](./index#cep-47-function-types) when going through the [contract file](https://github.com/casper-ecosystem/casper-nft-cep47/blob/master/cep47/bin/cep47_token.rs) inside the [CEP-47 repository](https://github.com/casper-ecosystem/casper-nft-cep47).

### CEP-47 Function Types
CEP-47 standard contains endpoints to enable the NFT functionalities. The basic attributes of tokens are addressed by *name*, *symbol*, *total_supply*, and *balance_of* endpoints.The token ownership is managed by *owner_of*, *get_token_by_index* endpoints. Token metadata is handled  through *meta*, *token_meta*, *update_token_meta* endpoints. Main behaviors of NFTs are handled through *mint*, *mint_copies*, *burn*, *transfer*, *transfer_from*, *approve*, *get_approved* endpoints.


If you haven't read [Writing Rust Contracts on Casper](../../writing-contracts/rust.md), we recommend you start there to learn more about smart contracts.
