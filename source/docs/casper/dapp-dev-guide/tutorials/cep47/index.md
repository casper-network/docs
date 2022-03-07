# The NFT Standard on Casper (CEP-47)

This tutorial takes you through the standard of implementing [non-fungible tokens](/docs/glossary/N#non-fungible-token) on the Casper Network. Before diving into the Casper NFT implementation, let's cover some knowledge on overall NFT design. The following sections illustrate the origin and the development of NFTs in the blockchain domain.

### The NFT Standard on Ethereum
[ERC-721](https://eips.ethereum.org/EIPS/eip-721) is the standard defined to implement NFTs on the Ethereum blockchain. This standard defines a minimum interface a smart contract should implement to manage, own, and trade unique tokens. 

## The NFT Standard on Casper
[CEP-47](https://github.com/casper-ecosystem/casper-nft-cep47) is the NFT standard for the Casper blockchain, supporting the unique traits of the Casper Virtual Machine and its gas-efficient design. 

The Casper NFT standard takes full advantage of [unforgeable references](/docs/design/uref) to store values and manage permissions to them. It also takes advantage of other access control features (such as [groups](/docs/glossary/G#groups)). We recommend exploring the [main functions](../cep47/#cep-47-function-types) of the [contract](https://github.com/casper-ecosystem/casper-nft-cep47/blob/master/cep47/bin/cep47_token.rs) to understand the standard further.

### CEP-47 Functions
The CEP-47 standard contains the following functions to enable NFTs.  

- [*name*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L44-L47) - Returns the name of the NFT contract
- [*symbol*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L50-L53) - Returns the symbol of the NFT contract
- [*meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L56-L59) - Returns the metadata of the NFT contract
- [*total_supply*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L62-L65)- Returns the amount of issued NFTs
- [*balance_of*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L68-L72) - Returns the amount of NFT tokens the `owner` holds
- [*get_token_by_index*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L75-L80) - Retrieves the NFT token at a specific index
- [*owner_of*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L83-L87) - Retrieves the owner of a given token
- [*token_meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L90-L94) - Retrieves the metadata for a given token
- [*update_token_meta*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L97-L103) -  A function to update the metadata of a token
- [*mint*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L106-L113) - Creates a list of tokens for a specific recipient, given the token IDs and their metadata, paired in order
- [*mint_copies*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L116-L124) - For a given address, this function creates several tokens with specific IDs but with the same metadata
- [*burn*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L127-L133) - Destroys the given tokens in the account given
- [*transfer*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L136-L142) - Transfers tokens to another account
- [*transfer_from*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L145-L152) - Transfer tokens from a given account to another account
- [*approve*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L155-L161) - Gives another account the right to transfer tokens from this account
- [*get_approved*](https://github.com/casper-ecosystem/casper-nft-cep47/blob/09b40b0caf4cfc6f73d1e5f7d5b9c868228f7621/cep47/bin/cep47_token.rs#L164-L169) - Retrieves information about the rights to transfer tokens from another account

:::note
These functions can only be called from inside contracts, as they return data.
- *name*, *symbol*, *meta*, and *total_supply*: Return details regarding the whole contract
- *balance_of* and *get_token_by_index*:Rretrieve details of tokens related to a specific account
- *owner_of* and *token_meta*:Rretrieve the details of a specific token
:::

