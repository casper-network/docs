# Overview of a Casper Network

## Introduction

Casper is a Proof-of-Stake blockchain platform with an account-based model that performs execution after consensus. A Casper network stores data on a structure known as [Global State](#global-state-head). Users interact with global state through session code sent in a [Deploy](#execution-semantics-deploys). Deploys contain [Wasm](https://webassembly.org/) to be executed by the network, thus allowing developers to use their preferred programming language rather than a proprietary language.

A deploy executes in the context of the user's [Account](#accounts-head) but can call stored Wasm that will execute in its own context. User-related information other than an account is stored in global state as an [Unforgeable Reference](#uref-head) or `URef`. After a node accepts a deploy as valid, it places the deploy in a proposed [Block](#block-structure-head) and gossips it among nodes until the network reaches consensus. At this point, the network executes the Wasm included within the deploy.

1. [Global State](#global-state-head)

2. [Execution Semantics](#execution-semantics-head)

3. [Accounts](#accounts-head)

4. [Unforgeable Reference (URef)](#uref-head)

5. [Block Structure](#block-structure-head)

6. [Tokens](#tokens-head)

## Global State {#global-state-head}

"Global state" is the storage layer for the Casper blockchain. All accounts, contracts, and any associated data are stored in global state. Global state follows the semantics of a key-value store (with additional permissions logic, as not all users can access all values in the same way).

:::note

Refer to [Keys and Permissions](../serialization-standard.md#serialization-standard-state-keys) for further information on keys.

:::

Changes to global state occur through executing deploys contained within finalized blocks. For validators to efficiently judge the correctness of these changes, they need information about the new state communicated succinctly. Further, the network must communicate portions of global state to users while allowing them to verify the correctness of the parts they receive. The key-value store is implemented as a [Merkle trie](#global-state-trie) for these reasons.

### Merkle Trie Structure {#global-state-trie}

![Global State](/image/design/global-state.png)

At a high level, a Merkle trie is a key-value store data structure that can be shared piecewise in a verifiable way (via a construction called a Merkle proof). Each node is labeled by the hash of its data. Leaf nodes are labeled with the hash of their data. Non-leaf nodes are labeled with the hash of the labels of their child nodes.

Casper's implementation of the trie has radix of 256, meaning each branch node can have up to 256 children. A path through the tree can be an array of bytes, and serialization directly links a key with a path through the tree as its associated value.

Formally, a trie node is one of the following:

-   a leaf, which includes a key and a value
-   a branch, which has up to 256 `blake2b256` hashes, pointing to up to 256 other nodes in the trie (recall each node is labeled by its hash)
-   an extension node, which includes a byte array (called the affix) and a `blake2b256` hash pointing to another node in the trie

The purpose of the extension node is to allow path compression. Consider an example where all keys use the same first four bytes for values in the trie. In this case, it would be inefficient to traverse through four branch nodes where there is only one choice; instead, the root node of the trie could be an extension node with an affix equal to those first four bytes and a pointer to the first non-trivial branch node.

The Rust implementation of Casper's trie can be found on GitHub:

-   [Definition of the trie data structure](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie/mod.rs#L475)
-   [Reading from the trie](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie_store/operations/mod.rs#L45)
-   [Writing to the trie](https://github.com/casper-network/casper-node/blob/dev/execution_engine/src/storage/trie_store/operations/mod.rs#L954)

:::note

Conceptually, each block has its trie because the state changes based on the deploys it contains. For this reason, Casper's implementation has a notion of a `TrieStore`, which allows us to look up the root node for each trie.

:::

## Execution Semantics {#execution-semantics-head}

A Casper network is a decentralized computation platform. This section describes aspects of the Casper computational model.

### Measuring Computational Work {#execution-semantics-gas}

Computation is done in a [WebAssembly (Wasm)](https://webassembly.org/) interpreter, allowing any programming language which compiles to Wasm to become a smart contract language for the Casper blockchain. Similar to Ethereum, Casper uses [`Gas`](../economics/gas-concepts.md) to measure computational work in a way that is consistent from node to node in a Casper network. Each Wasm opcode is assigned a `Gas` cost, and the amount of gas spent is tracked by the runtime with each opcode executed by the interpreter.

Costs for opcode instructions on the Casper Mainnet network can be found [here](https://github.com/casper-network/casper-node/blob/dev/resources/production/chainspec.toml#L115).

All executions are finite because each has a finite _gas limit_ that specifies the maximum amount of gas available to spend before the runtime terminates the computation. The payment executable session determines how to pay for the deploy. The gas limit is set by executing the payment code specified within the deploy.

Although the network measures costs in `Gas`, payment for computation occurs in [motes](#tokens-divisibility). Therefore, there is a conversion rate between `Gas` and motes.

:::note

Please note that Casper will not refund any amount of unused gas.

This decision is taken to incentivize the [Casper Runtime Economics](../economics/runtime.md#runtime-economics) by efficiently allocating the computational resources. The [consensus-before-execution model](../economics/runtime.md#consensus-before-execution-basics-of-payment) implements the mechanism to encourage the optimized gas consumption from users and to prevent the overuse of block space by poorly handled deploys.

:::

### Deploys {#execution-semantics-deploys}

A [Deploy](../serialization-standard.md#serialization-standard-deploy) is a data structure containing Wasm and the requester's signature(s). Additionally, the deploy header contains additional metadata about the deploy itself. A deploy’s structure is as follows:

<p align="center">
<img src={"/image/design/deploy-structure.png"} alt="Image showing the deploy data structure" width="500"/> 
</p>

-   Body: Containing payment code and session code (more details on these below)
-   Header: containing
    -   The [Public Key](../serialization-standard.md#publickey) of the account in whose context the deploy will run
    -   The timestamp of the deploy’s creation
    -   A time-to-live, after which the deploy expires and cannot be included in a block
    -   the `blake2b256` hash of the body
-   Deploy hash: the `blake2b` hash of the Header
-   Approvals: the set of signatures which have signed the deploy hash; these are used in the [account permissions model](#accounts-associated-keys-weights)

### Deploy Lifecycle {#execution-semantics-phases}

A deploy goes through the following phases on Casper:

1. Deploy Received
2. Deploy Gossiped
3. Block Proposed
4. Block Gossiped
5. Consensus Reached
6. Deploy Executed

#### Deploy Received
A client sending the deploy will send it to one or more nodes via their JSON RPC servers. The node will ensure that a given deploy matches configuration settings outlined in the network's chainspec. Deploy configuration for the Casper Mainnet can be found [here](https://github.com/casper-network/casper-node/blob/dev/resources/production/chainspec.toml#L79). Once accepted, the system returns the deploy hash to the client to indicate it has been enqueued for execution. The deploy could expire while waiting to be gossiped; whenever this happens, a `DeployExpired` event is emitted by the event stream servers of all nodes which have the expired deploy.

#### Deploy Gossiped
After a node accepts a new deploy, it will gossip to all other nodes. A validator node will put the deploy into the block proposer buffer. The validator leader will pick the deploy from the block proposer buffer to create a new proposed block for the chain. This mechanism is efficient and ensures all nodes in the network eventually hold the given deploy. Each node that accepts a gossiped deploy also emits a `DeployAccepted` event on its event stream server. The deploy may expire while waiting for a node to add it to the block. Whenever this happens, the node emits a `DeployExpired` event.

#### Block Proposed
The validator leader for this round will propose a block that includes as many deploys from the block proposer buffer as can fit in a block.

#### Block Gossiped
The proposed block propagates to all other nodes.

#### Consensus Reached
Once the other validators reach consensus that the proposed block is valid, all deploys in the block are executed, and this block becomes the final block added to the chain. Whenever reaching consensus, the event stream server emits a `BlockAdded`. `FinalitySignature` events emit shortly after that. Finality signatures for the new block arrive from the validators.

#### Deploy Executed 

A deploy executes in distinct phases to accommodate flexibly paying for computation. The phases of a deploy are *payment*, *session*, and *finalization*. Payment code executes during the payment phase. If it is successful, the session code executes during the session phase. And, independently of session code execution, the finalization phase does some bookkeeping around the payment. Once the deploy is executed, a `DeployProcessed` event is emitted by the event stream server.

In the event of execution failure, the sender will be charged the minimum penalty payment - 2.5 CSPR on the Casper Mainnet. This prevents malicious spamming of faulty deploys.

**Payment code**

_Payment code_ determines the payment amount for the computation requested and how much the sender is willing to pay. Payment code may include arbitrary logic, providing flexibility in paying for a deploy. For example, the simplest payment code could use the account's [main purse](#tokens-purses-and-accounts). In contrast, an enterprise application may require a multi-signature scheme that accesses a corporate purse. To ensure the payment code will pay for its own computation, only accounts with a balance in their main purse greater than or equal to `MAX_PAYMENT_COST` may execute deploys. Based on the current conversion rate between gas and motes, we restrict the gas limit of the payment code execution so that the process spends no more than `MAX_PAYMENT_COST` motes (a constant of the system.)
If the payment is absent or not enough, then payment execution is not successful. In this case, the effects of the payment code on global state are reverted, and the system covers the cost of the computation with motes taken from the offending account's main purse.

**Session code**

_Session code_ provides the main logic for the deploy. It only executes if the payment code is successful. The gas limit for this computation is determined based on the amount of payment given (after subtracting the cost of the payment code itself).

**Specifying payment code and session code**

The user-defined logic of a deploy can be specified in a number of ways:

-   a Wasm module in binary format representing valid session code, including logic to be executed in the context of an account or to store Wasm in the form of a contract to be executed later. (Note that the named keys from the context of the account the deploy is running in.)
-   a 32-byte identifier representing the [hash](../serialization-standard.md#serialization-standard-hash-key) where a contract is already stored in the global state
-   a name corresponding to a named key in the account, where a contract is stored under the key

Payment and session code can be independently specified, so different methods of specifying them may be used (e.g. payment could be specified by a hash key, while the session is explicitly provided as a Wasm module).

### The Casper Network Runtime {#execution-semantics-runtime}

A Wasm module is not natively able to create any effects outside of reading or writing from its own linear memory. Wasm modules must import functions from the host environment they are running in to enable other desired effects, such as reading or writing to global state.

![Casper Network Runtime](/image/design/casper-runtime.png)

All these features are accessible via functions in the [Casper External FFI](https://docs.rs/casper-contract/1.4.4/casper_contract/ext_ffi/index.html).

#### Generating `URef`s {#execution-semantics-urefs}

`URef`s are generated using a [cryptographically secure random number generator](https://rust-random.github.io/rand/rand_chacha/struct.ChaCha20Rng.html) using the [ChaCha algorithm](https://cr.yp.to/chacha.html). The random number generator is seeded by taking the `blake2b256` hash of the deploy hash concatenated with an index representing the current phase of execution (to prevent collisions between `URef`s generated in different phases of the same deploy).

![Generating URefs](/image/design/generating-urefs.png)

## Accounts {#accounts-head}

The Casper blockchain uses an on-chain account-based model, uniquely identified by an `AccountHash` derived from a specific `PublicKey`. The [global state trie store](#global-state-trie) requires all keys to be the same length, so the AccountHash is a 32-byte derivative used to abstract any of the supported public key variants.

The Casper platform supports two types of keys for creating accounts and signing transactions: 
- [ed25519](../accounts-and-keys.md#eddsa-keys) keys, which use the Edwards-curve Digital Signature Algorithm (EdDSA) and are 66 bytes long
- [secp256k1](../accounts-and-keys.md#ethereum-keys) keys, commonly known as Ethereum keys, which are 68 bytes long

By default, a transactional interaction with the blockchain takes the form of a Deploy cryptographically signed by the key-pair corresponding to the PublicKey used to create the account. All user activity on the Casper blockchain (i.e., "deploys") must originate from an account. Each account has its own context where it can locally store information (e.g., references to useful contracts, metrics, and aggregated data from other parts of the blockchain). Each account also has a "main purse" where it can hold Casper tokens (see [Tokens](#tokens-purses-and-accounts) for more information).

This chapter describes the permission model for accounts and their local storage capabilities and briefly mentions some runtime functions for interacting with accounts.

### Creating an account {#accounts-creating}

Account creation automatically happens upon transferring tokens to a yet unused `PublicKey`. On account creation, the balance of its main purse is equal to the number of tokens transferred during the creation process. Its action thresholds are equal to 1, and there is one associated key. The associated key is the `PublicKey` used to create the account. In this way, an account is essentially a context object encapsulating the main purse, used to pay for transactions. However, an account may have an additional purse beyond the main purse.


<p align="center">
<img src={"/image/design/account-structure.png"} alt="Image showing the account data structure" width="200"/> 
</p>

An `Account` contains the following data:

-   A `URef` representing the account's "main purse"
-   A collection of named keys (playing the same role as the named keys in a stored contract)
-   A collection of "associated keys" (see [below for more information](#accounts-associated-keys-weights))
-   "Action thresholds" (see [below for more information](#accounts-actions-thresholds))

### Permissions Model {#accounts-permissions}

#### Actions and Thresholds {#accounts-actions-thresholds}

An account can perform two types of actions: sending deploys and managing keys. A deploy is simply executing some code on the blockchain, while key management involves changing the associated keys (which will be described in more detail later). Key management cannot be performed independently, as all effects on the blockchain must come via a deploy; therefore, a key management action implies that a deploy action is also taking place. 

The `ActionThresholds` contained in the `Account` data structure set a `Weight`, which must be met to perform that action. The next section describes these weight thresholds. Since a key management action requires a deploy action, the key management threshold should always be greater than or equal to the deploy threshold.

#### Associated Keys and Weights {#accounts-associated-keys-weights}

Accounts on a Casper network can associate other key pairs through a multiple signature scheme for sending transactions. An account's _associated keys_ are the set of public keys allowed to provide signatures on deploys for that account. Each associated key has a weight; these weights combine to meet the action thresholds provided in the previous section. Each deploy must be signed by one or more keys associated with the account that deploy is for, and the sum of the weights of those keys must be greater than or equal to the deployment threshold weight for that account. We call the keys that have signed a deploy the "authorizing keys". Similarly, if a deploy contains key management actions (detailed below), the sum of the weights of the authorizing keys must be greater than or equal to the key management action threshold of the account.

:::note

Any key may help authorize any action; there are no "special keys". All keys contribute their weight in exactly the same way.

:::

#### Key Management Actions {#accounts-key-management}

A _key management action_ is a change to the account permissions, including:

-   Adding or removing an associated key
-   Changing the weight of an associated key
-   Changing the threshold of any action

Key management actions have validity rules preventing users from locking themselves out of their accounts. For example, one can set a threshold, at most, the sum of the weights of all associated keys.

#### Account security and recovery using key management {#accounts-recovery}

This permissions model's purpose is to keep accounts safe from lost or stolen keys while allowing the usage of modern mobile devices. For example, it may be convenient to sign deploys from a smartphone without worrying about the repercussions of losing the phone. The recommended setup is to have a low-weight key on the phone, enough for the deploy threshold but not enough for key management. If the phone is lost or stolen, a key management action using other associated keys from another device (e.g., a home computer) can be used to remove the lost associated key and add a key that resides on a replacement phone.

:::note

It is extremely important to ensure there will always be access to a sufficient number of keys to perform the key management action. Otherwise, future recovery will be impossible (Casper currently does not support "inactive recovery").

:::

### The Account Context {#accounts-context}

A deploy is a user request to perform some execution on the blockchain (see [Execution Semantics](#execution-semantics-head) for more information). It contains "payment code" and "session code", which are references to stored on-chain contracts or Wasm to be executed. For executable Wasm, its execution and the logic therein occur within the context of the account signing the deploy. This means that the executing Wasm has access to the named keys and main purse of the account's context.

:::note

In the case where there is a reference to stored on-chain Wasm (smart contracts), the execution of the on-chain Wasm will occur in its own separate runtime context. As a result, the stored Wasm will not have access to the named keys or main purse of the calling account.

:::

## Unforgeable Reference (URef) {#uref-head}

This key type is used for storing any value except `Account`. Additionally, `URef`s used in Wasm carry permission information to prevent unauthorized usage of the value stored under the key. The runtime tracks this permission information. This means that if malicious Wasm attempts to produce a `URef` with permissions that the Wasm does not have, the Wasm has attempted to "forge" the unforgeable reference, and the runtime will raise a forged `URef` error. Permissions for a `URef` can be given across contract calls, allowing data stored under a `URef` to be shared in a controlled way. The 32-byte identifier representing the key is generated randomly by the runtime (see [Execution Semantics](#execution-semantics-head) for more information). The serialization for `Access Rights` that define the permissions for `URefs` is detailed in the [CLValues](../serialization-standard.md) section.

### Permissions for `URef`s {#uref-permissions}

In the runtime, a `URef` carries its permissions called `AccessRights`. Additionally, the runtime tracks what `AccessRights` would be valid for each `URef` in each context. The system assumes that a sent `URef` is invalid, regardless of declared `AccessRights`, and will check it against the executing context to determine validity on each usage. Only the host logic can add a `URef`, in the following ways:

-   It can exist in a set of "known" `URef`s
-   It can be freshly created by the runtime via the `new_uref` function
-   For called contracts, the caller can pass it in via the arguments to `call_contract`
-   It can be returned to the caller from `call_contract` via the `ret` function

Note that only valid `URef`s may be added to the known `URef`s or cross-call boundaries; this means the system cannot be tricked into accepting a forged `URef` by getting it through a contract or stashing it in the known `URef`s.

The ability to pass `URef`s between contexts via `call_contract` / `ret`, allows them to share state among a fixed number of parties while keeping it private from all others.

### `URef`s and Purses

Purses represent a unique type of `URef` used for accounting measures within a Casper network. `URef`s exist as a top-level entity, meaning that individual accounts do not own ‘URef’s. As described above, accounts and contracts possess certain `Access Rights`, allowing them to interact with the given `URef`. While an account will possess an associated `URef` representing their main purse, this `URef` exists as a [`Unit`](../serialization-standard.md#clvalue-unit) and corresponds to a *balance* key within the Casper *mint*. The individual balance key within the Casper mint is the account's purse, with transfers authorized solely through the associated `URef` and the `Access Rights` granted to it.

Through this logic, the Casper mint holds all motes on the network and transfers between balance keys at the behest of accounts and contracts as required.

## Block Structure {#block-structure-head}

A _block_ is the primary data structure by which network nodes communicate information about the state of a Casper network. We briefly describe here the format of this data structure.

### Data Fields {#block-structure-data}

A block consists of the following:

-   A `block_hash`
-   A header
-   A body

Each of these fields is detailed in the subsequent sections.

#### `block_hash` {#block_hash}

The `block_hash` is the `blake2b256` hash of the block header.

#### Header {#header}

The [block header](../serialization-standard.md#serialization-standard-block) contains the following fields:

* `parent_hash`

  A list of `block_hash`es giving the parents of the block.

* `state_root_hash`

  The global state root hash produced by executing this block's body.


* `body_hash`

  The hash of the block body.


* `random_bit` 

  A boolean needed for initializing a future era.

* `accumulated_seed`

  A seed needed for initializing a future era.

* `era_end`

  Contains equivocation and reward information to be included in the terminal finalized block. It is an optional field.

* `timestamp`

  The timestamp from when the block was proposed.

* `era_id` 

  Era ID in which this block was created.

* `height`

  The height of this block, i.e., the number of ancestors.

* `protocol_version` 

  The version of the Casper network when this block was proposed. 

#### Body {#body}

The block body contains an **ordered** list of `DeployHashes` which refer to deploys, and an **ordered** list of `DeployHashes` for native transfers (which are specialized deploys that only transfer tokens between accounts). All deploys, including a specialization such as native transfer, can be broadly categorized as some unit of work that, when executed and committed, affect change to [Global State](#global-state-intro). A valid block may contain no deploys and / or native transfers.

The block body also contains the public key of the validator that proposed the block.

Refer to the [Serialization Standard](../serialization-standard.md) for additional information on how blocks and deploy are serialized.

## Tokens {#tokens-head}

Casper is a decentralized Proof-of-Stake blockchain platform that uses a consensus algorithm called [Highway](./highway.md). Having a unit of value is required to make this system work because users must pay for computation, and validators must have [stake](../economics/staking.md) to bond. In the blockchain space, this unit of value is a _token_.

This chapter describes tokens and how one can use them on the Casper platform.

### Token Generation and Distribution {#token-generation-and-distribution}

A blockchain system generally needs a supply of tokens available to pay for computation and reward validators for processing transactions on the network. The initial supply at the launch of Mainnet was 10 billion CSPR. The current supply is available [here](https://api.cspr.live/supply). In addition to the initial supply, the system will have a low rate of inflation, the results of which will be paid out to validators in the form of seigniorage.

The number of tokens used to calculate seigniorage is the initial supply of tokens at genesis.

<p align="center">
<img src={"/image/design/token-lifecycle.png"} alt="Image showing the token lifecycle" width="700"/> 
</p>

### Divisibility of Tokens {#tokens-divisibility}

Typically, a _token_ is divisible into some number of parts. We call the indivisible units which make up the CSPR token _motes_. Each CSPR is divisible into 10<sup>9</sup> motes. To avoid rounding errors, it is essential to always represent token balances in motes. In comparison, Ether is divisible into 10<sup>18</sup> parts called Wei.

The concept of `CSPR` is human-readable convenience and does not exist within the actual infrastructure of a Casper network. Instead, all transactions deal solely with _motes_.

### Purses and Accounts {#tokens-purses-and-accounts}

All [accounts](#accounts-head) on the Casper system have a purse associated with the Casper system mint, called the _main purse_. However, for security reasons, the `URef` of the main purse is only available to code running in the context of that account (i.e. only in payment or session code). Therefore, the mint's `transfer` method that accepts `URef`s is not the most convenient when transferring between account main purses. For this reason, Casper supplies a [transfer_to_account](https://docs.rs/casper-contract/latest/casper_contract/contract_api/system/fn.transfer_to_account.html) function, which takes the public key used to derive the identity key of the account. This function uses the mint transfer function with the current account's main purse as the `source` and the main purse of the account at the provided key as the `target`.

### The Casper Mint Contract {#mint-contract}

The Casper *mint* is a system contract that manages the balance of *motes* within a Casper network. These motes are used to pay for computation and bonding on the network. The mint system contract holds all motes on a Casper network but maintains an internal ledger of the balances for each Account's _main purse_. Each balance is associated with a `URef`, which is a key to instruct the mint to perform actions on that balance (e.g., transfer motes). Informally, these balances are referred to as _purses_ and conceptually represent a container for motes. The `URef` is how a purse is referenced externally, outside the mint.

The `AccessRights` of the URefs permissions model determines what actions can be performed when using a `URef` associated with a purse.

As all URef`s are unforgeable, the only way to interact with a purse is for a `URef` with appropriate `AccessRights` to be validly given to the current context.

The basic global state options map onto more standard monetary operations according to the table below:

| Global State | Action Monetary Action                           |
| ------------ | ------------------------------------------------ |
| Add          | Deposit (i.e. transfer to)                       |
| Write        | Withdraw (i.e. transfer from) Read Balance check |

## The mint Contract Interface {#tokens-mint-interface}

The mint system contract exposes the following methods:

-   `transfer(source: URef, target: URef, amount: Motes) -> TransferResult`
    -   `source` must have at least `Write` access rights, `target` must have at least `Add` access rights
    -   `TransferResult` may be a success acknowledgment or an error in the case of invalid `source` or `target` or insufficient balance in the `source` purse
-   `mint(amount: Motes) -> MintResult`
    -   `MintResult` either gives the created `URef` (with full access rights), which now has a balance equal to the given `amount`; or an error due to the minting of new motes not being allowed
    -   In the Casper mint, only the system account can call `mint`, and it has no private key to produce valid cryptographic signatures, which means only the software itself can execute contracts in the context of the system account
-   `create() -> URef`
    -   a convenience function for `mint(0)` which cannot fail because it is always allowed to create an empty purse
-   `balance(purse: URef) -> Option<Motes>`
    -   `purse` must have at least `Read` access rights
    -   `BalanceResult` either returns the number of motes held by the `purse`, or nothing if the `URef` is not valid
