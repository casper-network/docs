# Overview of a Casper Network

## Introduction

1. [Global State](#global-state-head)

2. [Execution Semantics](#execution-semantics-head)

3. [Accounts](#accounts-head)

4. [Unforgeable Reference (URef)](#uref-head)

5. [Block Structure](#block-structure-head)

6. [Tokens](#tokens-head)

## Global State {#global-state-head}

"Global state" is the storage layer for the Casper blockchain. All accounts, contracts, and any associated data are stored in global state. Our global state follows the semantics of a key-value store (with additional permissions logic, as not all users can access all values in the same way).

:::note

Refer to [Keys and Permissions](./serialization-standard.md#serialization-standard-state-keys) for further information on keys.

:::

Changes to global state occur through the execution of deploys contained within finalized blocks. For validators to efficiently judge the correctness of these changes, information about the new state needs to be communicated succinctly. Further, we must communicate portions of global state to users, while allowing them to verify the correctness of the parts they receive. For these reasons, the key-value store is implemented as a [Merkle trie](#global-state-trie).

### Merkle Trie Structure {#global-state-trie}

At a high level, a Merkle trie is a key-value store data structure that can be shared piece-wise in a verifiable way (via a construction called a Merkle proof). Each node is labeled by the hash of its data. Leaf nodes are labeled with the hash of their data. Non-leaf nodes are labeled with the hash of the labels of their child nodes.

Our implementation of the trie has radix of 256, meaning each branch node can have up to 256 children. A path through the tree can be an array of bytes, and serialization directly links a key with a path through the tree as its associated value.

Formally, a trie node is one of the following:

-   a leaf, which includes a key and a value
-   a branch, which has up to 256 `blake2b256` hashes, pointing to up to 256 other nodes in the trie (recall each node is labeled by its hash)
-   an extension node, which includes a byte array (called the affix) and a `blake2b256` hash pointing to another node in the trie

The purpose of the extension node is to allow path compression. Consider an example where all keys use the same first four bytes for values in the trie. In this case, it would be inefficient to traverse through four branch nodes where there is only one choice; instead, the root node of the trie could be an extension node with affix equal to those first four bytes and pointer to the first non-trivial branch node.

The Rust implementation of our trie can be found on GitHub:

-   [Definition of the trie data structure](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie/mod.rs#L475)
-   [Reading from the trie](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie_store/operations/mod.rs#L45)
-   [Writing to the trie](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie_store/operations/mod.rs#L954)

:::note

Conceptually, each block has its trie because the state changes based on the deploys it contains. For this reason, our implementation has a notion of a `TrieStore`, which allows us to look up the root node for each trie.

:::

## Execution Semantics {#execution-semantics-head}

The Casper Network is a decentralized computation platform. In this chapter we describe aspects of the computational model we use.

### Measuring Computational Work {#execution-semantics-gas}

Computation is done in a [WebAssembly (Wasm)](https://webassembly.org/) interpreter, allowing any programming language which compiles to Wasm to become a smart contract language for the Casper blockchain. Similar to Ethereum, we use [`Gas`](/economics/gas-concepts/) to measure computational work in a way which is consistent from node to node in a Casper Network. Each Wasm opcode is assigned a `Gas` value, and the amount of gas spent is tracked by the runtime with each opcode executed by the interpreter.

Costs for opcode instructions on the Casper Mainnet network can be found [here](https://github.com/casper-network/casper-node/blob/dev/resources/production/chainspec.toml#L115).

All executions are finite because each has a finite _gas limit_ that specifies the maximum amount of gas that can be spent before the computation is terminated by the runtime. The payment executable session determines how to pay for the Deploy. The gas limit is set by executing the payment code specified within the Deploy. How this limit is determined is discussed in more detail below.

Although computation is measured in `Gas`, we still take payment for computation in [motes](#tokens-divisibility). Therefore, there is a conversion rate between `Gas` and motes. How this conversion rate is determined is discussed elsewhere.

:::note

Please note that Casper will not refund any amount of unused gas.

This decision is taken to incentivize the [Casper Runtime Economics](/economics/runtime.md#runtime-economics) by efficiently allocating the computational resources. The [consensus-before-execution model](/economics/runtime.md#consensus-before-execution-basics-of-payment) implements the mechanism to encourage the optimized gas consumption from the user-side and to prevent the overuse of block space by poorly handled deploys.

:::

### Deploys {#execution-semantics-deploys}

A [Deploy](/design/serialization-standard/#serialization-standard-deploy) is a data structure containing a smart contract and the requester's signature(s). Additionally, the deploy header contains additional metadata about the deploy itself. A deploy is structurally defined as follows:

-   Body: Containing payment code and session code (more details on these below)
-   Header: containing
    -   The [Public Key](/design/serialization-standard/#publickey) of the account the deploy will run in the context of
    -   The timestamp when the deploy was created
    -   A time to live, after which the deploy is expired and cannot be included in a block
    -   the `blake2b256` hash of the body
-   Deploy hash: the `blake2b` hash of the Header
-   Approvals: the set of signatures which have signed the deploy hash, these are used in the [account permissions model](./accounts.md#accounts-associated-keys-weights)

### Deploy Lifecycle {#execution-semantics-phases}

A deploy goes through the following phases on Casper:

1. Deploy Received
2. Deploy Gossiped
3. Block Proposed
4. Block Gossiped
5. Consensus Reached
6. Deploy Executed

#### Deploy Received
The client sending the deploy will send it to one or more nodes via their JSON RPC servers. The node will ensure that a given deploy matches configuration settings as set forth in the network's chainspec. Deploy configuration for the Casper Mainnet can be found [here](https://github.com/casper-network/casper-node/blob/dev/resources/production/chainspec.toml#L79). Once accepted, the deploy hash is returned to the client to indicate it has been enqueued for execution. The deploy could expire while waiting to be gossiped and whenever this happens a `DeployExpired` event is emitted by the event stream servers of all nodes which have expired the deploy.

#### Deploy Gossiped
After a node accepts a new deploy, it will gossip to all other nodes. A validator node will put the deploy into the block proposer buffer. The validator leader will pick the deploy from the block proposer buffer to create a new proposed block for the chain. This mechanism is efficient and ensures all nodes in the network eventually hold the given deploy. Each node which accepts a gossiped deploy also emits a `DeployAccepted` event on its event stream server. The deploy may expire while waiting to be added to the block and whenever this happens a `DeployExpired` event is emitted.

#### Block Proposed
The validator leader for this round will propose a block that includes as many deploys from the block proposer buffer as can fit in a block.

#### Block Gossiped
The proposed block is propagated to all other nodes.

#### Consensus Reached
Once the other validators reach consensus that the proposed block is valid, all deploys in the block are executed, and this block becomes the final block added to the chain. Whenever consensus is reached, a `BlockAdded` event is emitted by the event stream server. `FinalitySignature` events are emitted shortly thereafter as finality signatures for the new block arrive from the validators.

#### Deploy Executed 

A deploy is executed in distinct phases to accommodate flexibly paying for computation. The phases of a deploy are payment, session, and finalization. During the payment phase, the payment code is executed. If it is successful, the session code is executed during the session phase. And, independently of session code execution, the finalization phase does some bookkeeping around payment. Once the deploy is executed, a `DeployProcessed` event is emitted by the event stream server.

In the event of execution failure, the sender will be charged the minimum penalty payment - 2.5 CSPR on the Casper Mainnet. This prevents malicious spamming of faulty deploys.

**Payment code**

_Payment code_ determines the payment amount for the computation requested and how much you, as the sender, are willing to pay. Payment code is allowed to include arbitrary logic, providing flexibility in how a deploy can be paid for (e.g., the simplest payment code could use the account's [main purse](./tokens.md#tokens-purses-and-accounts), while an enterprise application may require deploys to pay via a multi-sig application accessing a corporate purse). We restrict the gas limit of the payment code execution, based on the current conversion rate between gas and motes, such that no more than `MAX_PAYMENT_COST` motes (a constant of the system) are spent. To ensure payment code will pay for its own computation, we only allow accounts with a balance in their main purse greater than or equal to `MAX_PAYMENT_COST`, to execute deploys.

If payment is not given or not enough is transferred, then payment execution is not considered successful. In this case the effects of the payment code on the global state are reverted and the cost of the computation is covered by motes taken from the offending account's main purse.

**Session code**

_Session code_ provides the main logic for the deploy. It is only executed if the payment code is successful. The gas limit for this computation is determined based on the amount of payment given (after subtracting the cost of the payment code itself).

**Specifying payment code and session code**

The user-defined logic of a deploy can be specified in a number of ways:

-   a Wasm module in binary format representing valid session code, including logic to be executed in the context of an account or to store Wasm in the form of a contract to be executed later. (Note: the named keys do not need to be specified because they come from the context of the account the deploy is running in)
-   a 32-byte identifier representing the [hash](./serialization-standard.md#serialization-standard-hash-key) where a contract is already stored in the global state
-   a name corresponding to a named key in the account, where a contract is stored under the key

Each of payment and session code are independently specified, so different methods of specifying them may be used (e.g. payment could be specified by a hash key, while session is explicitly provided as a Wasm module).

### The Casper Network Runtime {#execution-semantics-runtime}

A Wasm module is not natively able to create any effects outside of reading / writing from its own linear memory. To enable other effects (e.g. reading / writing to the Casper global state), Wasm modules must import functions from the host environment they are running in.

All these features are accessible via functions in the [Casper External FFI](https://docs.rs/casper-contract/1.4.4/casper_contract/ext_ffi/index.html).

#### Generating `URef`s {#execution-semantics-urefs}

`URef`s are generated using a [cryptographically secure random number generator](https://rust-random.github.io/rand/rand_chacha/struct.ChaCha20Rng.html) using the [ChaCha algorithm](https://cr.yp.to/chacha.html). The random number generator is seeded by taking the `blake2b256` hash of the deploy hash concatenated with an index representing the current phase of execution (to prevent collisions between `URef`s generated in different phases of the same deploy).

## Accounts {#accounts-head}

The Casper blockchain uses an on-chain account-based model, uniquely identified by an `AccountHash` derived from a specific `PublicKey`. By default, a transactional interaction with the blockchain takes the form of a Deploy cryptographically signed by the key-pair corresponding to the PublicKey used to create the account. All user activity on the Casper blockchain (i.e., "deploys") must originate from an account. Each account has its own context where it can locally store information (e.g., references to useful contracts, metrics, aggregated data from other parts of the blockchain). Each account also has a "main purse" where it can hold Casper tokens (see [Tokens](#tokens-purses-and-accounts) for more information).

In this chapter we describe the permission model for accounts, their local storage capabilities, and briefly mention some runtime functions for interacting with accounts.

### Creating an account {#accounts-creating}

Account creation happens automatically when there is a token transfer to a yet unused `PublicKey`. When an account is first created, the balance of its main purse is equal to the number of tokens transferred during the creation process. Its action thresholds are equal to 1 and there is one associated key. The associated key is the `PublicKey` used to create the account. In this way, an account is essentially a context object encapsulating the main purse, which is used to pay for transactions. However, an account may have additional purse beyond the main purse.

An `Account` contains the following data:

-   A `URef` representing the account's "main purse"
-   A collection of named keys (this plays the same role as the named keys in a stored contract.)
-   A collections of "associated keys" (see [below for more information](#accounts-associated-keys-weights))
-   "Action thresholds" (see [below for more information](#accounts-actions-thresholds))

### Permissions Model {#accounts-permissions}

#### Actions and Thresholds {#accounts-actions-thresholds}

There are two types of actions an account can perform: a deployment, and key management. A deployment is simply executing some code on the blockchain, while key management involves changing the associated keys (which will be described in more detail later). Key management cannot be performed independently, as all effects to the blockchain must come via a deploy; therefore, a key management action implies that a deployment action is also taking place. The `ActionThresholds` contained in the `Account` data structure set a `Weight` which must be met in order to perform that action. How these weight thresholds can be met is described in the next section. Since a key management action requires a deploy action, the key management threshold should always be greater than or equal to the deploy threshold.

#### Associated Keys and Weights {#accounts-associated-keys-weights}

Accounts on a Casper Network can associate other key pairs to allow or require a multiple signature scheme for sending transactions on a network. The _associated keys_ of an account are the set of public keys which are allowed to provide signatures on deploys for that account. Each associated key has a weight; these weights are used to meet the action thresholds provided in the previous section. Each deploy must be signed by one or more keys associated with the account that deploy is for, and the sum of the weights of those keys must be greater than or equal to the deployment threshold weight for that account. We call the keys that have signed a deploy the "authorizing keys". Similarly, if that deploy contains any key management actions (detailed below), then the sum of the weights of the authorizing keys must be greater than or equal to the key management action threshold of the account.

Note: that any key may be used to help authorize any action; there are no "special keys", all keys contribute their weight in exactly the same way.

#### Key Management Actions {#accounts-key-management}

A _key management action_ is any change to any of the permissions parameters for the account. This includes the following:

-   adding or removing an associated key;
-   changing the weight of an associated key;
-   changing the threshold of any action.

Key management actions have validity rules which prevent a user from locking themselves out of their account. For example, it is not allowed to set a threshold larger than the sum of the weights of all associated keys.

#### Account security and recovery using key management {#accounts-recovery}

The purpose of this permissions model is to enable keeping accounts safe from lost or stolen keys, while allowing usage of capabilities of modern mobile devices. For example, it may be convenient to sign deploys from a smart phone in day-to-day usage, and this can be done without worrying about the repercussions of losing the phone. The recommended setup would be to have a low-weight key on the phone, only just enough for the deploy threshold, but not enough for key management, then if the phone is lost or stolen, a key management action using other associated keys from another device (e.g., a home computer) can be used to remove the lost associated key and add a key which resides on a replacement phone.

:::note

that it is extremely important to ensure there will always be access to a sufficient number of keys to perform the key management action, otherwise future recovery will be impossible (we currently do not support "inactive recovery").

:::

### The Account Context {#accounts-context}

A deploy is a user request to perform some execution on the blockchain (see [Execution Semantics](./execution-semantics.md#execution-semantics-deploys-as-functions) for more information). It contains "payment code" and "session code" which are references to stored on-chain contracts or Wasm to be executed. In the case of executable Wasm, the execution of hte Wasm and the logic therein occurs within the context of the account signing the deploy. This means that the executing Wasm has access to the named keys and main purse of the account's context.

:::note

In the case where there is a reference to stored on-chain Wasm (smart contracts), the execution of the on-chain Wasm will occur in its own separate runtime context. As a result, the stored Wasm will not have access to the named keys or main purse of the calling account.

:::

## Unforgeable Reference (URef) {#uref-head}

This key type is used for storing any type of value except `Account`. Additionally, `URef`s used in Wasm carry permission information to prevent unauthorized usage of the value stored under the key. This permission information is tracked by the runtime, meaning that if malicious Wasm attempts to produce a `URef` with permissions that the Wasm does not have, we say the Wasm has attempted to "forge" the unforgeable reference, and the runtime will raise a forged `URef` error. Permissions for a `URef` can be given across contract calls, allowing data stored under a `URef` to be shared in a controlled way. The 32-byte identifier representing the key is generated randomly by the runtime (see [Execution Semantics](execution-semantics.md) for more information). The serialization for `Access Rights` that define the permissions for `URefs` is detailed in the [CLValues](serialization-standard.md) section.

### Permissions for `URef`s {#uref-permissions}

In the runtime, a `URef` carries its permissions called `AccessRights`. Additionally, the runtime tracks what `AccessRights` would be valid for each `URef` to have in each context. The system assumes that a sent `URef` is invalid, regardless of declared `AccessRights`, and will check it against the executing context to determine validity on each usage. A `URef` can only be added to a context by the host logic, in the following ways:

-   it can exist in a set of "known" `URef`s
-   it can be freshly created by the runtime via the `new_uref` function
-   for called contracts, it can be passed in by the caller via the arguments to `call_contract`
-   it can be returned to the caller from `call_contract` via the `ret` function

Note: that only valid `URef`s may be added to the known `URef`s or cross call boundaries; this means the system cannot be tricked into accepting a forged `URef` by getting it through a contract or stashing it in the known `URef`s.

The ability to pass `URef`s between contexts via `call_contract` / `ret`, allows them to be used to share state among a fixed number of parties while keeping it private from all others.

### `URef`s and Purses

Purses represent a unique type of `URef` used for accounting measures within a Casper Network. `URef`s exist as a top-level entity, meaning that individual accounts do not own ‘URef’s.  As described above, accounts and contracts possess certain `Access Rights`, allowing them to interact with the given `URef`. While an account will possess an associated `URef` representing their main purse, this `URef` exists as a [`Unit`](../serialization-standard#clvalue-unit) and corresponds to a balance key within the Casper Mint. The individual balance key within the Casper Mint is the account's purse, with transfers authorized solely through the associated `URef` and the `Access Rights` granted to it.

Through this logic, the Casper Mint holds all motes on the network, and transfers between balance keys at the behest of accounts and contracts as required.

## Block Structure {#block-structure-head}

A _block_ is the primary data structure by which network nodes communicate information about the state of a Casper Network. We briefly describe here the format of this data structure.

### Data Fields {#block-structure-data}

A block consists of the following:

-   a `block_hash`
-   a header
-   a body

Each of these fields is detailed in the subsequent sections.

#### `block_hash` {#block_hash}

The `block_hash` is the `blake2b256` hash of the block header.

#### Header {#header}

The [block header](/design/serialization-standard/#serialization-standard-block) contains the following fields:

-   `parent_hash`
    -   a list of `block_hash`es giving the parents of the block
-   justifications
    -   a list of `block_hash`es giving the justifications of the block (see consensus description in part A for more details)
-   a summary of the global state, including
    -   the [root hash of the global state trie](#global-state-trie) before executing the deploys in this block (`pre_state_hash`)
    -   the root hash of the global state trie after executing the deploys in this block (`post_state_hash`)
    -   the list of currently bonded validators, and their stakes
-   the `blake2b256` hash of the body of the block
-   the time the block was created
-   the protocol version the block was executed with
-   the number of deploys in the block
-   the human-readable name corresponding to this instance of a Casper Network (`chain_id`)
-   an indicator for whether this message is intended as a valid block or merely a _ballot_ (see consensus description in part A for more details)


#### Body {#body}

The block body contains an **ordered** list of `DeployHashes` which refer to deploys, and an **ordered** list of `DeployHashes` for native transfers (which are specialized deploys that only transfer token between accounts). All deploys, including a specialization such as native transfer, can be broadly categorized as some unit of work that, when executed and committed, affect change to global state [Global State](#global-state-intro). It should be noted that a valid block may contain no deploys and / or native transfers.

The block body also contains the public key of the validator that proposed the block.

Refer to the [Deploy Serialization Standard](serialization-standard.md) for additional information on deploys and how they are serialized. Refer to [Deploy Serialization Standard](serialization-standard.md) for how blocks are serialized.

## Tokens {#tokens-head}

The Casper Network is a decentralized blockchain platform based on a Proof-of-Stake consensus algorithm called [Highway](/design/highway/). Having a unit of value is required to make this system work because users must pay for computation, and validators must have [stake](../staking/index.md) to bond. In the blockchain space, this unit of value is a _token_.

This chapter describes how we define tokens and how one can use them on the Casper platform.

### Token Generation and Distribution {#token-generation-and-distribution}

A blockchain system generally needs to have a supply of tokens available to pay for computation and reward validators for processing transactions on the network. The initial supply at the launch of Mainnet was 10 billion CSPR. The current supply is available [here](https://api.cspr.live/supply). In addition to the initial supply, the system will have a low rate of inflation, the results of which will be paid out to validators in the form of seigniorage.

The number of tokens used as a basis for calculating seigniorage is the initial supply of tokens at genesis.

### Divisibility of Tokens {#tokens-divisibility}

Typically, a _token_ is divisible into some number of parts. We call the indivisible units which make up the CSPR token _motes_. Each CSPR is divisible into 10<sup>9</sup> motes. To avoid rounding errors, it is essential to always represent token balances in motes. In comparison, Ether is divisible into 10<sup>18</sup> parts called Wei.

The concept of `CSPR` is human-readable convenience and does not exist within the actual infrastructure of a Casper network. Rather, all transactions deal solely with _motes_.

### Purses and Accounts {#tokens-purses-and-accounts}

All [accounts](./accounts.md#accounts-head) on the Casper system have a purse associated with the Casper system mint, which we call the _main purse_. However, for security reasons, the `URef` of the main purse is only available to code running in the context of that account (i.e. only in payment or session code). Therefore, the mint's `transfer` method which accepts `URef`s is not the most convenient to use when transferring between account main purses. For this reason, Casper supplies a [transfer_to_account](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_to_account.html) function which takes the public key used to derive the identity key of the account. This function uses the mint transfer function with the current account's main purse as the `source` and the main purse of the account at the provided key as the `target`.
