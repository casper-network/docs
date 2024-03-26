---
title: Ownership Lookup
slug: /resources/tokens/cep78/reverse-lookup
---


# Owner Reverse Lookup Functionality

In version 1.0 of the CEP-78 Enhanced NFT Standard contract, tracking minted tokens consisted of a single, unbounded list that would grow in size with each additional token. As a result, gas costs would increase over time as the list must be overwritten with each new minting. The related tutorial can be found [here](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/docs/tutorials/token-ownership-tutorial.md).

In an effort to stabilize the gas costs of larger NFT collections, version 1.1 of CEP-78 includes the use of a pre-allocated page system to track ownership of NFTs within the contract.

This system stabilizes the cost for interacting with the contract, but not the mint price itself. The size of metadata for a collection, and any differences in that metadata, will still result in some fluctuation in the price for the NFT itself. However, the cost of engaging the system itself will remain stable. Users can expect to pay a higher upfront price for page allocation, but will not need to pay this cost again for any NFTs minted within that given page.

## The CEP-78 Page System

Ownership of NFTs within a CEP-78 contract is now tracked with a series of `pages`, with each page tracking a range of 1,000 tokens each. When installing an instance of the CEP-78 contract, the user determines the total token supply. This, in turn, determines the maximum number of pages, i.e., for a 10,000 token collection, each account could have up to 10 pages numbering from 0-9 tracking ownership of NFTs.

A `page_table` tracks which pages within a range have been allocated and set for a certain user. The size of the page table directly correlates to the total token supply, i.e. for a CEP-78 instance tracking 10,000 tokens, the page table would be 10 bits wide. For a total of 20,000 it would be 20 bits wide. The cost of the initial page table allocation depends on the overall total size of a collection, with larger collections possessing correspondingly greater gas costs. To make initial minting costs more stable across contracts, the process of allocating a page table has been shifted to the `register_owner` entrypoint.

After registering as an owner, the contract creates an entry within the `page_table` dictionary for the minting account or contract. This dictionary entry consists of a series of `boolean` values amounting to the total number of pages in the collection. In our 10,000 token example, this would be 10 bits set to false.

Upon minting the token, the user will pay for a page allocation. This adds them to the `page` dictionary, in which each entry corresponds to a specific account or contract that owns tokens within that page. That account or contract's entry in the `page` dictionary will consist of 1,000 `page_address` bits set to `False` upon allocation, and the minting of any given token in that page will set the `page_address` bit to `True`.

In addition, that account or contract's `page_table` will be updated by marking the corresponding page number's bit as `True`.

As an example, consider a new user minting their first NFT with a given CEP-78 contract set to a maximum number of 10,000 tokens. They are minting the 2,350th token within that collection. The following sequence of events would occur:

1. The contract registers their account as an owner.

2. The contract creates a `page_table` dictionary for that account, with 10 boolean values. As the numbering system begins with `0`, the third boolean value corresponding with page `2` is set to `True`.

3. The account pays for allocation of page 2, creating an entry in the `Page 2` dictionary for that account. Within that entry, there are 1,000 boolean values set to false. Minting the 2,350th token in the collection sets the corresponding `page_address` boolean for 350 as `True`.

4. Any further tokens minted by this account prior to the 3,000th token being minted will not have to pay for additional page allocations. If the account mints a token at or beyond 3,000, they must pay for the corresponding page allocation. For example, if they decided to mint the 5,125th token in the collection, they would need to pay for `page 5` to be allocated to them. They would then be added to the `page 5` dictionary with the `page_address` boolean for 125 set as `True`.

This system binds the data writing costs to a maximum size of any given page dictionary.

## Updated Receipts

If the contract enables `OwnerReverseLookupMode`, calling the `updated_receipts` entrypoint will return a list of receipt names alongside the dictionary for the relevant pages.

Updated receipts come in the format of `"{<collection name>}\_m{modulo}\_p{<page number>}"`. Once again using the 2,350th token as an example, the receipt would read:

```
cep78_collection_m_350_p_2
```

You can determine the token number by multiplying the `page_number` by the `page_size`(1,000) and adding the `modulo`.

If the `NFTIdentifierMode` is set to `Ordinal`, this number corresponds directly to the token ID.

If it is set to `Hash`, you will need to reference the `HASH_BY_INDEX` dictionary to determine the mapping of token numbers to token hashes.