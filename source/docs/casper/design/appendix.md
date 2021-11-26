# Appendix {#appendix-head}

## A - Casper Rust Library {#appendix-a}

Casper provides low-level bindings for host-side ("external") functions for developers creating smart contracts in other programming languages. Developers can import these functions into a wasm module used as a contract on the Casper Network. Thus, the contract will have access to features specific to the Casper platform which are not supported by general wasm instructions (e.g., accessing the global state, creating new `URef`s). These are defined and automatically imported if the [Casper Rust library](https://crates.io/crates/casper-contract) is used to develop the contract. For an up-to-date description of exported functions, please visit the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/index.html) crate documentation.

## B - Serialization Format {#appendix-b}

The Casper serialization format is used to transfer data between wasm and the Casper host runtime. It is also used to persist global-state data in the Merkle trie. The definition of this format is described in the [global state](./global-state.md#global-state-head) section.

A Rust reference implementation for those implementing this specification in another programming language can be found here:

-   [bytesrepr](https://docs.rs/casper-types/latest/casper_types/bytesrepr/index.html)
-   [cl_value.rs](https://docs.rs/casper-types/latest/src/casper_types/cl_value.rs.html)
-   [account](https://docs.rs/casper-types/latest/casper_types/account/index.html)
-   [contract](https://docs.rs/casper-types/latest/casper_types/contracts/struct.Contract.html)
-   [uint.rs](https://docs.rs/casper-types/latest/src/casper_types/uint.rs.html)

Additionally, examples of all data types and their serializations are found in the [GitHub code base](https://github.com/casper-network/casper-node/blob/553b9f11eb3b1e8043acfe3fa04005d951047c4a/types/src/bytesrepr.rs#L26). These examples include a set of useful [serialization tests](https://github.com/casper-network/casper-node/blob/553b9f11eb3b1e8043acfe3fa04005d951047c4a/types/src/bytesrepr.rs#L1189).

## C - Parallel Execution {#appendix-c}

### Introduction {#introduction}

The state of the Casper Network is represented by the [global state](./global-state.md#global-state-head). The evolution of this state is captured by the blockchain itself, and eventually agreed upon by all nodes in the network via the consensus mechanism. In this section we are concerned with only a single step of that evolution. We think of such a step as performing some "computation" that changes the global state. A [deploy](./execution-semantics.md#execution-semantics-deploys) is a user request for computation, and contains two atomic units of computation: the payment code and the session code (the details of which are discussed elsewhere). For the purpose of this section, we think of each of these units as a (mathematical) function which takes the current global state as input, perhaps along with some other arguments, and produces a new global state as output. However, since the overall global state is ambient from the perspective of the session/payment code itself, the global state is not an explicit parameter in any user's source code, nor is there any explicit return value.

In this section we refine this idea of computation modeled as functions, and describe how it is used to enable parallel execution.

### Computation as functions on the global state {#computational-model-functions}

As discussed in the introduction, we think of computation on the Casper platform as being functions from the global state, ***G***, to itself. Naturally, we can compose two such functions, to obtain another function. This corresponds to sequential execution. For example, you can think of the sequence `payment_code -> session_code` as being the composition of two individual functions, capturing the effects of the payment and session codes, respectively. If there are smart contracts which are called during those execution phases, you could even break these down further into a sequence of those calls: `deployed_payment_wasm -> contract_a -> contract_b -> stored_session_code -> contract_c -> ...`. For notational purposes, we will call the set of functions `{𝑓 | 𝑓:𝐺→𝐺}=𝐸𝑛𝑑(𝐺)`, meaning "endomorphisms of ***G***".

While this simple model captures sequential execution, it does not model parallel execution. Parallel execution is important because it can enable the execution engine to run more than one deploy at the same time, possibly improving block processing times. Note: each deploy itself is still single-threaded; we will not support parallel execution within a single contract or deploy. This optimization is purely for the performance of the node implementation, not contract developers.

### Computation as functions from ***G*** to ***End(G)*** {#computation-as-functions-from-g-to-endg}

The problem with functions on the global state itself is they mutate the state, potentially causing problems if we wanted to apply two such functions at the same time. Therefore, we will instead think of computations as outputting a description of the changes to the global state that they would make if given the chance. Or phrased another way, the execution of a deploy will return a function that could be applied to the global state to obtain the post-state we would have obtained from running the computation while mutating the global state. The reason this helps is because we can apply multiple such functions to the same global state at the same time; they are pure functions that do not modify the global state. Thus we can execute multiple deploys in parallel and later combine their outputs (more on this later).

The way this is modeled in the Casper execution engine is via the [TrackingCopy](https://github.com/casper-network/casper-node/blob/master/execution_engine/src/core/tracking_copy/mod.rs). Executing deploys (and the contracts they call) read/write from the [TrackingCopy](https://github.com/casper-network/casper-node/blob/master/execution_engine/src/core/tracking_copy/mod.rs) instead of the global state directly. The [TrackingCopy](https://github.com/casper-network/casper-node/blob/master/execution_engine/src/core/tracking_copy/mod.rs) _tracks_ the operations and returns the `Transform`s which act on each key in the global state effected by the execution. Using the nomenclature from the theory, this collection of keys and transforms describes a function 𝑓 : 𝐺 → 𝐺 which is an endomorphism on ***G***, i.e. an element of ***End(G)***.

An important note about the returned `Transform`s is there is exactly one `Transform` per key that was used during the execution. Initially, this may be unintuitive because a contract can use the same key multiple times, however, because each deploy executes sequentially, we can use the composition property discussed in the previous section to combine multiple sequential operations into a single operation. Consider the following example.

```rust
// an implementation of the function featured in the Collatz conjecture
let n = read_local("n");
let f_n =
    if n % 2 == 0 { n / 2 }
    else { 3 * n + 1 };
write_local("n", f_n);
```

The above function reads a local variable, performs a computation which depends on the current value of that variable, then writes an updated value. Suppose we execute this function on a global state where the value of the local key is `7`. Then the sequence of transforms on the global state would be `Read -> Write(22)` since `n` would be odd and thus `f_n` would be computed using the `else` case. From the perspective of state changes, we only need to keep the `Write(22)` transform because final state is the same as if we had also included the `Read` transform. In fact, by the same reasoning, we know that we only need to keep the last `Write`, whatever it happens to be, since it will be the final value on the key after the computation finishes. Notice that the resulting global state function does not exactly reproduce the original contract execution steps; it is a _reduced trace_ where only the final effect on the global state is recorded [^1]. In particular, this means applying the results of these executions is very fast relative to the original execution (this will be important for how we use these traces in the next section). Also notice that the transforms which are produced depend on the initial state. This might be obvious since we are modeling computation as functions ***𝑓:𝐺→𝐸𝑛𝑑(𝐺)***, so this statement is simply that the function really depends on its input. However, this is again an important concept to keep in mind when working with this model of computation. Going back to our example, if the value of the local key was `16` then the transform produced would be `Write(8)`, entirely different from the case where the initial value was `7`.

### Constructing the post-state from parallel execution {#constructing-the-post-state-from-parallel-execution}

Following from the previous section, we know that deploys execute to produce a `Map<Key, Transform>` which gives a summary (i.e. "reduced trace") of the effects the deploy would have had on each key in the global state (keys not present in the map are not effected). In the reference implementation we call this the `exec` phase. Since creating these maps does not mutate the global state, we can run as many of these as we want in parallel. However, after they have been run we need to actually produce a post-state, the new global state after applying the effects of the deploys (this will then be used as the pre-states for deploys in the following batch of executions). In the reference implementation, we call applying the collection of transforms to obtain a post-state the `commit` phase.

Before we can construct the post-state, we must know that one is well-defined. When working with parallel execution with a shared resource, you may encounter "race conditions". This is a situation where the outcome of a parallel computation depends on the order or timing of events, in particular when this timing is not explicitly controlled. Or phrased another way, parallelism with a shared resource is a lie and one of the processes will use the resource first, followed by the other one. A classic blockchain example of a race condition is a double spend (which under an accounts model, as opposed to UTXO, is the same as an overdraft on the account); one payer attempts to pay two payees at the same time without enough tokens to actually pay both. One payee or the other is not getting their tokens, depending on the order the transactions are processed.

In our simple model of computation where deploys are functions on the global state, this would correspond to functions that do not _commute_, that is to say, the order in which we apply the functions to the global state matters: 𝑓∘𝑔≠𝑔∘𝑓 . Therefore, in order to prevent race conditions, we will only allow deploys to execute in parallel if they commute. Taking our more sophisticated model of computation, we have two deploys: 𝑓:𝐺→𝐸𝑛𝑑(𝐺) and 𝑔:𝐺→𝐸𝑛𝑑(𝐺), and we will only allow both be committed to the same pre-state ***G*** if 𝑓(𝐺)∘𝑔(𝐺)=𝑔(𝐺)∘𝑓(𝐺), i.e. the resulting maps of transforms commute.

We will discuss how to compute whether two maps of transforms commute in the next section. For now, we assume that run some set of deploys **d<sub>1</sub>, d<sub>2</sub>, d<sub>3</sub>, ...** in parallel against a fixed pre-state ***G*** to obtain a set of transform maps **T<sub>1</sub>, T<sub>2</sub>, T<sub>3</sub>, ...**, then select only the transforms that commute **T<sub>i</sub>, T<sub>j</sub>, T<sub>k</sub>, ...** to apply to ***G***, and thus obtain the post-state ***𝐺′***. The remaining deploys we can all run in parallel against ***𝐺′***, again choosing the commuting ones to commit, obtaining ***𝐺′′***, and so on. This final post-state is the same as if we had run all the deploys **d<sub>1</sub>, d<sub>2</sub>, d<sub>3</sub>, ...** in sequence against ***G***, but perhaps faster (depending on how many could commute[^2]) because we were able to run in parallel batches.

### Detecting when maps of transforms commute {#detecting-when-maps-of-transforms-commute}

Two transform maps `m_1: Map<Key, Transform>` and `m_2: Map<Key,Transform>` commute if for all keys `k` which are present in both maps, the transforms `t_1 = m_1[k]` and `t_2 = m_2[k]` commute. Notably, if there are no such keys then the maps trivially commute. Two transforms `t_1:Transform` and `t_2: Transform` commute if:

-   `t_1 == t_2 == Read`
-   `t_1` and `t_2` are both of the same `Add*` transform variant (note they do not need to contain the same values within that variant)

where `Add*` is a placeholder representing any of the typed native add operations (`AddInt32`, `AddInt64`, `AddInt128`, `AddInt256`, `AddInt512`, `AddKeys`). And they do not commute otherwise. A short summary is: reads commute, adds commute, writes conflict. Note that writes _always_ conflict, even if they are writing the same value. Consider the following example:

```rust
fn f() {
    let x = read_local("x");

    if x == 7 { write_local("x", 10); }
    else { write_local("x", 0); }
}

fn g() {
    let x = read_local("x");

    if x == 7 { write_local("x", 10); }
    else { write_local("x", 100); }
}
```

If the pre-state ***G*** has `local("x") == 7` then `f(G)` results in the transform `Write(10)`, and so does `g(G)`. However, if we compose `g(f(G))` then we obtain `Write(100)`, and if we compose `f(g(G))` then the result is `Write(0)` and hence the functions do not commute.

### Handling Errors {#handling-errors}

The reason we can say "adds commute" in our rules is because mathematically addition is commutative. However, this relies on the infinite nature of the number line and real computers are finite. For example, if we considered the addition of three 8-bit numbers: 250, 3, and 5, any two of them can be added and they commute, but attempting to add all three results in an overflow error. Thus the final result depends on the order of addition:

-   250 + 3 + 5 = 253 (last addition does not happen due to the error)
-   250 + 5 + 3 = 255
-   3 + 5 + 250 = 8

Presently we circumvent this error by actually using modular arithmetic (wrapped addition as it is often called in computer science). Addition in modular arithmetic is still a commutative operation, so our theory holds together. In our example above 250 + 5 + 3 is always equal to 3, no matter what. However in the context of financial applications wrapping back to zero is an unexpected behavior. For this reason we use 512-bit numbers in our mint contract to represent balances, and the total number of token units (motes) available is less than `U512::MAX`, so overflow is impossible.

That said, this is not the only error which may arise due to the finite nature of computers. For example, the `AddKeys` transform is about adding elements to a map, which is a commutative operation as well (so long as none of the keys already existed in the map, then it is more akin to a write operation). Yet, this operation can also fail due to the physical machine being out of memory, thus once again meaning the order of additions could effect the final state of the map.

In a more powerful theory of parallel execution we could consider operations which fail. In this case we could say that transforms `t_1` and `t_2` commute if they are of the same addition type and the outcome of applying both to the input global state, ***G*** is not an error. This is a more complex rule because it requires doing some amount of computation during commutativity checking, whereas the previous theory was simple comparison. Yet, this theory might be worth pursuing because it solves the two problems we have listed here (overflow and out-of-memory), along with other problems that we presently cannot handle at all. For example, `Minus` could be introduced as a transform, and underflows could be handled using this refined commutativity rule. This has practical application in our system because it would mean transfers from the same source could commute if enough funds are available, whereas presently they will always be conservatively labeled as not commuting.

[^1]: There is a special case of constructing reduced traces which is worth calling out explicitly. Suppose the initial value of a key in the global state is `X`, and after performing the execution, the transform for that key is `Write(X)`. Then it is valid to replace that transform with `Read`. This is because the computation acts like the identity function (i.e. the function which makes no changes) at this key, and therefore is equal to `Read`. Notably we cannot simply remove the transform from the map because the key was still used in some way during the computation. We must have a record of what keys were used to correctly detect when deploys commute (see the following sections for more details). Replacing a `Write` with a `Read` still has great benefits for parallel execution because reads do commute with one another, while writes do not. This optimization in the reduced traces is [applied in our reference implementation](https://github.com/casper-network/casper-node/blob/master/execution_engine/src/core/engine_state/execution_result.rs#L439). [^2]: Recall that committing transforms is a very fast operation relative to execution, so it causes little overhead. The main overhead would come from executing the same deploy against multiple different starting states because it failed to commute multiple times. This can be mitigated by favoring including more expensive deploys in each committed batch.
