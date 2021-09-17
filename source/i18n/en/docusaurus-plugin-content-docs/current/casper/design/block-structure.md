# Block Structure {#block-structure-head}

## Introduction {#block-structure-intro}

A _block_ is the primary data structure by which network nodes communicate information about the state of the Casper Network. We briefly describe here the format of this data structure.

## Data fields {#block-structure-data}

A block consists of the following:

-   a `block_hash`
-   a header
-   a body

Each of these fields is detailed in the subsequent sections.

### `block_hash`

The `block_hash` is the `blake2b256` hash of the header.

### Header

The block header contains the following fields:

-   `parent_hashes`
    -   a list of `block_hash`es giving the parents of the block
-   justifications
    -   a list of `block_hash`es giving the justifications of the block (see consensus description in part A for more details)
-   a summary of the global state, including
    -   the `root hash of the global state trie <global-state-trie>`{.interpreted-text role="ref"} before executing the deploys in this block (`pre_state_hash`)
    -   the root hash of the global state trie after executing the deploys in this block (`post_state_hash`)
    -   the list of currently bonded validators, and their stakes
-   the `blake2b256` hash of the body of the block
-   the time the block was created
-   the protocol version the block was executed with
-   the number of deploys in the block
-   the human-readable name corresponding to this instance of the Casper Network (`chain_id`)
-   an indicator for whether this message is intended as a valid block or merely a _ballot_ (see consensus description in part A for more details)

### Body

The block body contains an **ordered** list of `DeployHashes` which refer to deploys, and an **ordered** list of `DeployHashes` for native transfers (which are specialized deploys that only transfer token between accounts). All deploys, including a specialization such as native transfer, can be broadly categorized as some unit of work that, when executed and committed, affect change to global state `Global State<global-state-intro>`{.interpreted-text role="ref"}. It should be noted that a valid block may contain no deploys and / or native transfers.

The block body also contains the public key of the validator that proposed the block.

Refer to the [Deploy Serialization Standard](serialization-standard.md) for additional information on deploys and how they are serialized. Refer to [Deploy Serialization Standard](serialization-standard.md) for how blocks are serialized.
