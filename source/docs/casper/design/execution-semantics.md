# Execution Semantics {#execution-semantics-head}

## Introduction {#execution-semantics-intro}

The Casper Network is a decentralized computation platform. In this chapter we describe aspects of the computational model we use.

## Measuring computational work {#execution-semantics-gas}

Computation is all done in a [WebAssembly (wasm)](https://webassembly.org/) interpreter, allowing any programming language which compiles to wasm to become a smart contract language for the Casper blockchain. Similar to Ethereum, we use `Gas` to measure computational work in a way which is consistent from node to node in the Casper Network. Each wasm instruction is [assigned](https://github.com/casper-network/casper-node/blob/cb1d20ad1ea6e245cd8237f9406885a1e785c669/execution_engine/src/shared/wasm_config.rs#L15) a `Gas` value, and the amount of gas spent is tracked by the runtime with each instruction executed by the interpreter. All executions are finite because each has a finite _gas limit_ that specifies the maximum amount of gas that can be spent before the computation is terminated by the runtime. How this limit is determined is discussed in more detail below.

Although computation is measured in `Gas`, we still take payment for computation in `motes <tokens-divisibility>`{.interpreted-text role="ref"}. Therefore, there is a conversion rate between `Gas` and motes. How this conversion rate is determined is discussed elsewhere.

:::note

Please note that Casper will not refund any amount of unused gas.

This decision is taken to incentivizing the [Casper Runtime Economics](../economics/runtime.md#runtime-economics) by efficiently allocating the computational resources. The [consensus-before-execution model](../economics/runtime.md#consensus-before-execution-basics-of-payment) implements the mechanism to encourage the optimized gas consumption from the user-side and to prevent the overuse of block space by poorly handled deploys.

:::

## Deploys {#execution-semantics-deploys}

A _deploy_ represents a request from a user to perform computation on our platform. It has the following information:

-   Body: containing payment code and session code (more details on these below)
-   Header: containing
    -   the `identity key <global-state-account-key>`{.interpreted-text role="ref"} of the account the deploy will run in
    -   the timestamp when the deploy was created
    -   a time to live, after which the deploy is expired and cannot be included in a block
    -   the `blake2b256` hash of the body
-   Deploy hash: the `blake2b256` hash of the Header
-   Approvals: the set of signatures which have signed the deploy hash, these are used in the `account permissions model <accounts-associated-keys-weights>`{.interpreted-text role="ref"}

Each deploy is an atomic piece of computation in the sense that, whatever effects a deploy would have on the global state must be entirely included in a block or the entire deploy must not be included in a block.

### Phases of deploy execution {#execution-semantics-phases}

A deploy is executed in distinct _phases_ in order to accommodate paying for computation in a flexible way. The phases of a deploy are payment, session, and finalization. During the payment phase, the payment code is executed. If it is successful, then the sessions code is executed during the session phase. And, finally (independent of whether session code was executed), the finalization phase is executed, which does some bookkeeping around payment.

According to new amendments, the finalization phase does not refund the user any unspent `Gas` originally purchased (after converting back to motes). Please refer to the `gas refunding <execution-semantics-gas-refunding>`{.interpreted-text role="ref"} section for more details. The finalization phase does not include any user-defined logic, it is merely upkeep for the system.

### Payment code {#execution-semantics-payment}

_Payment code_ provides the logic used to pay for the computation the deploy will do. Payment code is allowed to include arbitrary logic, providing maximal flexibility in how a deploy can be paid for (e.g., the simplest payment code could use the account's `main purse <tokens-purses-and-accounts>`{.interpreted-text role="ref"}, while an enterprise application may require deploys to pay via a multi-sig application accessing a corporate purse). We restrict the gas limit of the payment code execution, based on the current conversion rate between gas and motes, such that no more than `MAX_PAYMENT_COST` motes (a constant of the system) are spent. To ensure payment code will pay for its own computation, we only allow accounts with a balance in their main purse greater than or equal to `MAX_PAYMENT_COST`, to execute deploys.

Payment code ultimately provides its payment by performing a `token transfer <tokens-mint-interface>`{.interpreted-text role="ref"} into the [Handle Payment contract's payment purse](https://github.com/casper-network/casper-node/blob/cb1d20ad1ea6e245cd8237f9406885a1e785c669/types/src/system/handle_payment/mod.rs#L65). If payment is not given or not enough is transferred, then payment execution is not considered successful. In this case the effects of the payment code on the global state are reverted and the cost of the computation is covered by motes taken from the offending account's main purse.

### Session code {#execution-semantics-session}

_Session code_ provides the main logic for the deploy. It is only executed if the payment code is successful. The gas limit for this computation is determined based on the amount of payment given (after subtracting the cost of the payment code itself).

### Specifying payment code and session code {#execution-semantics-specifying-code}

The user-defined logic of a deploy can be specified in a number of ways:

-   a wasm module in binary format representing a valid `contract <global-state-contracts>`{.interpreted-text role="ref"} (Note: the named keys do not need to be specified because they come from the account the deploy is running in)
-   a 32-byte identifier representing the `hash <global-state-hash-key>`{.interpreted-text role="ref"} or `URef <global-state-uref>`{.interpreted-text role="ref"} where a contract is already stored in the global state
-   a name corresponding to a named key in the account, where a contract is stored under the key

Each of payment and session code are independently specified, so different methods of specifying them may be used (e.g. payment could be specified by a hash key, while session is explicitly provided as a wasm module).

## Deploys as functions on the global state {#execution-semantics-deploys-as-functions}

To enable concurrent modification of `global state <global-state-head>`{.interpreted-text role="ref"} (either by parallel deploys in the same block or parallel blocks on different forks of the chain), we view each deploy as a function taking our global state as input and producing a new global state as output. It is safe to execute two such functions concurrently if they do not interfere with each other, which formally can be defined to mean the functions _commute_ (i.e., if they were executed sequentially, it does not matter in what order they are executed, the final result is the same for a given input). Whether two deploys commute is determined based on the effects they have on the global state, i.e. which operation (read, write, add) it does on each key in the key-value store. How this is done is described in `Appendix C <appendix-c>`{.interpreted-text role="ref"}.

## The Casper Network runtime {#execution-semantics-runtime}

A wasm module is not natively able to create any effects outside of reading / writing from its own linear memory. To enable other effects (e.g. reading / writing to the Casper global state), wasm modules must import functions from the host environment they are running in. In the case of contracts on the Casper blockchain, this host is the Casper runtime.

Here, we briefly describe the functionalities provided by imported functions. All these features are conveniently accessible via functions in the [Casper Rust library](https://crates.io/crates/casper-contract). For a more detailed description of the functions available for contracts to import, see `Appendix A <appendix-a>`{.interpreted-text role="ref"}.

-   Reading / writing from global state
    -   `read`, `write`, `add` functions allow working with exiting `URefs <uref-head>`{.interpreted-text role="ref"}
    -   `new_uref` allows creating a new `URef` initialized with a given value (see section below about how `URef`s are generated)
    -   `store_function` allows writing a contract under a `hash key <global-state-hash-key>`{.interpreted-text role="ref"}
    -   `get_uref`, `list_known_urefs`, `add_uref`, `remove_uref` allow working with the `named keys <global-state-contracts>`{.interpreted-text role="ref"} of the current context (account or contract)
-   Account functionality
    -   `add_associated_key`, `remove_associated_key`, `update_associated_key`, `set_action_threshold` support the various `key management actions <accounts-key-management>`{.interpreted-text role="ref"}
    -   `main_purse` returns the `main purse <tokens-purses-and-accounts>`{.interpreted-text role="ref"} of the account
-   Runtime flow and properties
    -   `call_contract` allows executing a contract stored under a key (hash or `URef`), including passing arguments and getting a return value
    -   `ret` is used by contracts to return a value to their caller (i.e. enables return values from `call_contract`)
    -   `get_named_arg` allows getting arguments passed to the contract (either to session code as part of the deploy, or arguments to `call_contract`)
    -   `revert` exits the entire executing deploy, reverting any effects it caused, and returns a status code that is captured in the block
    -   `get_caller` returns the public key of the account for the current deploy (can be used for control flow based on specific users of the blockchain)
    -   `get_phase` returns the current `phase <execution-semantics-phases>`{.interpreted-text role="ref"} of the deploy execution
    -   `get_blocktime` gets the timestamp of the block this deploy will be included in
-   `Mint <tokens-mints-and-purses>`{.interpreted-text role="ref"} functionality
    -   `create_purse` creates a new empty purse, returning the `URef` to the purse
    -   `get_balance` reads the balance of a purse
    -   `transfer_to_account` transfers from the present account's main purse to the main purse of a specified account (creating the account if it does not exist)
    -   `transfer_from_purse_to_account` transfer from a specified purse to the main purse of a specified account (creating the account if it does not exist)
    -   `transfer_from_purse_to_purse` alias for the `mint’s transfer function <tokens-mint-interface>`{.interpreted-text role="ref"}

### Generating `URef`s {#execution-semantics-urefs}

`URef`s are generated using a [cryptographically secure random number generator](https://rust-random.github.io/rand/rand_chacha/struct.ChaCha20Rng.html) using the [ChaCha algorithm](https://cr.yp.to/chacha.html). The random number generator is seeded by taking the `blake2b256` hash of the deploy hash concatenated with an index representing the current phase of execution (to prevent collisions between `URef`s generated in different phases of the same deploy).
