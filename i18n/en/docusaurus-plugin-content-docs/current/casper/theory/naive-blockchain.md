# Naive Casper Blockchain

## Introduction

Blockchain is a P2P network where the collection of nodes (**validators**) concurrently update a decentralized, shared database. They do this by collectively building an ever-growing chain of **transactions**. For performance reasons transactions are bundled in **blocks**.

For the "outside world", the blockchain looks like a computer. This blockchain computer has a memory (= shared database) and can execute programs (= transactions). Execution of a program changes the state of the memory. Anybody can send a program to the computer and the computer will do a best effort attempt to execute this program.

We say that a blockchain computer is **decentralized**, i.e. there is no single point of failure in the infrastructure. A significant portion of the network of validators could be suddenly destroyed and nevertheless the blockchain will continue to work. Also, the system is resistant to malicious validators (as long as the total weight of malicious validators is below 50% of the total weight of all validators).

The core of blockchain mechanics is the continuous work of validators struggling to agree on a consistent history of programs executed on the blockchain computer. We describe this central idea as "achieving **consensus** on the chain of blocks". Because every block contains a chain of transactions, this "consistent history" results in being a sequence of transactions.

Note that in this spec we use the terms **shared database** and **blockchain computer memory** interchangeably.

## Computing model

### Memory and programs

We need to define the "computational semantics" of a blockchain computer; what programs are and how they execute. However, because the consensus protocol we introduce is compatible with a wide range of computing models, it is convenient to approach this abstractly. Therefore, we represent the "computational semantics" of a blockchain computer as a triple $\langle GS, Zero, P\rangle$ where:

-   $GS$ is a set of states of the shared database (think that each point $gs \in GS$ represents a "snapshot" of the shared database) we call "global states"
-   $Zero \in GS$ is the initial state of the database
-   $P \subset Partial(GS \rightarrow GS)$ is a non-empty set of partial functions from $GS$ to $GS$, closed under composition; elements of $P$ we call **transactions** (we think of them as "executable programs")

Given a state $gs \in GS$ and a transaction $p \in P$, we can calculate the value $p(gs)$ only in the case when $p$ is defined at $gs$. We refer to this as **the execution of p**.

When $p$ is not defined at point $gs$, we say that **execution of p on state gs failed**. This is how we represent errors in program execution.

### Executing sequences of transactions

We want to generalize this notion to sequences of transactions in such a way that the information on execution errors is retained.

Having a sequence of transactions $p_1, p_2, ...., p_n\in P$ we'll keep the information on execution success/error as a function $status: [1,2,...,n] \rightarrow \{false, true\}$.

For any $p \in P$ let $\triangle p: GS \rightarrow GS$ be a total function that extends $p$ by applying identity whenever $p$ is not defined, hence formally as:

$$
\begin{aligned}
\triangle p(x)=\begin{cases}
p(x), & x \in dom(p)\\
x, & otherwise
\end{cases}
\end{aligned}
$$

**Status(i)** represents the overall result (success vs failure) of the execution of **i-th** transaction in the sequence.

Let:

-   $TSeq$ be the set of finite sequences of transactions: $TSeq = P^{Int}$
-   $StatusTraces$ be the set of finite sequences of Booleans

We define the execution of a sequence of transactions as:

$$
\begin{aligned}
exec: GS \times TSeq \rightarrow GS \times StatusTraces \\
exec(gs, [p1, p2, ...., pn]) = (resultGS, trace)
\end{aligned}
$$

... where:

-   $resultGS = \Delta pn \circ \Delta pn-1 \circ ... \circ \Delta p1 (gs)$
-   $trace(i) = \begin{cases} false, & execution \space of \space p_i \space failed \\ true, & otherwise \end{cases}$

Intuitively, **exec** takes a pair - the initial global state and a sequence of transactions to execute. The result is also a pair - the resulting global state reached by sequentially applying all transactions and a trace of this execution saying which transactions failed along the way.

### Executing sequences of blocks

A block contains sequences of transactions. Given some initial global state $gs \in GS$, whenever we say "execute a block" we mean executing the sequence of transactions it contains starting from $gs$. We usually call $gs$ the **pre-state** of the block, and we say **post-state** to denote the resulting global state returned by $exec(gs, sequence)$.

Given any sequence of blocks we may also **execute the sequence of blocks** because it is effectively a sequence of sequences of transactions, so it may be flattened to a single sequence of transactions.

Given any set of blocks $B$, we sometimes consider different linear orders of such set. Given a linear order $R$ on set $B$, we are speaking about **executing the set of blocks B along linear order R**, with the obvious semantics of taking all the blocks, arranging them in a sequence following the order $R$, and then executing the resulting sequence of transactions.

## Blockchain participants

We envision the infrastructure of blockchain participants as a collection of actors (processes) communicating over a network, and where each process plays one of the following roles:

-   **validators (aka "ring 0")** - form a P2P network that attempts to reach consensus on the ever-growing history of executed transactions; they do this by creating and validating blocks
-   **finalizers (aka "ring 1")** - they observe validators and try to deduce the subset of history that is considered as "confirmed" (the "confirmed" predicate is parameterized so to reflect the expected trust level)
-   **clients (aka "ring 2" or "dapps")** - use the blockchain computer - they send programs to be executed and react to execution results; a client connects to a validator (one or many) to send transactions while it also connects to a finalizer (one or many) to observe execution results

## Stake management

### Introduction

In proof-of-stake blockchains, **stake** is a representation of the voting power a validator has. We leave the question of exact representation of stakes open. We only summarize here the minimal assumptions we need for the mechanics of the blockchain to work.

### Encoding of stakes

The main assumption is that a global state encodes (among other things) the "weights map" - a mapping of validators to their voting power. So, mathematically we expect the existence of a function that assigns to every global state a function mapping validators to their weights:

$$
\begin{aligned}
weights\_map: GS \rightarrow Int^{ValidatorId} \\
weights\_map(gs): ValidatorId \rightarrow Int
\end{aligned}
$$

Intuitively, the stake of a validator will be (usually) defined by the amount of internal blockchain "money" allocated to the corresponding account.

### Bonding and unbonding

Blockchain users can increase/decrease the stake of a given validator. This is to happen via executing (special) transactions.

Minimal stake **MIN_STAKE** is a parameter of the blockchain.

### Unbonding stages

Unbonding is always a total unbonding \-- a validator transitioning to stake=0. There is no partial unbonding.

Unbonding must be go in stages, leading to the following states of a validator:

-   STAKED
-   VOTING_ONLY
-   UNBONDING_ESCROW
-   ZEROED

While in STAKED, a validator can produce only blocks.

While in VOTING_ONLY, a validator can produce only ballots.

While in UNBONDING_ESCROW and ZEROED, a validator is not supposed to produce messages.

The how of transitioning between states is beyond the scope of this specification (it can be based on wall clock, p-time, j-daglevel, block generation and other approaches).

### Slashing

Slashing is forced unbonding where the money used for the stake is burned. The intention is to penalizing equivocators.

## Blockdag

### Visual introduction

The consensus protocol is based on a data structure we call a **blockdag**, represented as a graph it looks like the following:

![](/image/theory/blockdag-with-ballots-and-equivocations.png){.align-center width="60.0%"}

The meaning of symbols:

![](/image/theory/blockdag-with-ballots-legend.png){.align-center width="60.0%"}

The 3 types of vertices in the graph are as follows:

-   **normal blocks** - contain transactions to be executed against the blockchain computer
-   **ballots** - do not contain transactions, but participate in the consensus
-   **genesis** - a special block that stands as a root node of the structure

Additionally we say:

-   **block** - when we mean "normal block or genesis"
-   **message** - when we mean "normal block or ballot"
-   **vertex** - when we mean "normal block or ballot or genesis"

We visually mark the creator of a message by placing it in a relevant swimlane. Genesis is outside swimlanes because genesis is given at blockchain initialization (= it does not have a creator).

Every normal block points to its **main parent** block (we visualize this with red arrows). Hence, blocks form a tree we call the **main tree**.

Additionally, any normal block may point to an arbitrary number of blocks as **secondary parents**. We visualize them with blue arrows. Blocks + red arrows + blue arrows together form a directed acyclic graph we call **the p-dag**.

Any ballot points to exactly one block. We call this block "the target block of a ballot".

Additionally, any message may point to an arbitrary number of vertices as **additional justifications**. We visualize them with **dashed arrows**.

All arrows together with all vertices form a directed acyclic graph we call the **j-dag**.

### DAG vs POSET language

DAG is a common abbreviation for "directed acyclic graph".

POSET is a common abbreviation for "partially ordered set".

When a DAG has at most one edge between any pair of vertices, we say this DAG is "simple".

Any POSET can be seen as a simple DAG when you define an edge **a rightarrow b** to be present whenever **a \< b**.

Any simple DAG leads to a POSET by taking its transitive closure and saying that **a \< b** iff there is an edge **a rightarrow b**. By symmetry, taking **a \< b** iff there is an edge **b rightarrow a** is also a POSET (just based on inverted order). Going in the other direction - from POSET to a DAG - is analogous.

In practice, POSET is "like a simple DAG" where we do not distinguish between DAGs with the same transitive closure. In particular, for visualization purposes it is convenient to draw a POSET as a transitive reduction of a corresponding DAG.

When talking about **j-dag** and **p-dag**, we blur the difference between DAG language and POSET language, because essentially one language is convertible to another.

### Understanding the layers of the blockdag

Here we explain only the intuition behind the blockdag. These ideas are formalized later in this document.

**J-dag** is all about attesting what I have seen so far. When I am a validator creating a new message (= block or ballot), I have to attest what is my current protocol state \-- i.e., what my current blockdag looks like. I do this by including on the justifications list (which is part of the new message) pointers to all **j-dag** tips present in my blockdag. Please note that we continue to use the terminology established for j-dag from previous chapters (_See_ the topic on J-dag).

**Main-tree** encodes the multi-variant progress of a transaction's history. When a validator creating a block B picks block A as the main parent of B, it means "I want transactions included in B to extend the history of the blockchain that ended at block A with all transactions in A already executed". This tree is analogous to a similar tree of blocks that forms in a previous generation of blockchains, like Bitcoin or Ethereum.

**P-dag** and the concept of secondary parents, corresponds to "merging of histories" \-- a subtle optimization on the way we process transactions. In blockchains such as Ethereum, effectively only a single path of the main-tree ends up as "transactions that have been actually executed" while all the rest of the main-tree ends up being wasted, or - as we say - "orphaned". In fact, the amount of wasted work can be reduced by "merging". While creating a new block, a validator performs careful analysis of all branches of the main-tree and attempts to merge as many of them possible without introducing a concurrency conflict.

### Core mechanics of the blockchain

The blockdag emerges as a combination of these central ideas:

-   Independently proposing updates of the shared database inevitably leads to a tree of transactions (blocks) because the proposing validator must choose which version of history it is about to extend. This is how the **main-tree** pops up.
-   All that remains is to add the mechanics for validators to collectively agree on which branch of the main-tree is the "official" one.
-   We solve this problem by recursively applying the Abstract Casper Consensus (a.k.a. ACC).
-   The Secondary parents idea is a further refinement of the solution by merging as many non-agreed paths of a main-tree as possible without introducing inconsistencies.

The single most crucial trick here is the recursive application of the Abstract Casper Consensus \-- to first try to understand this trick before diving into detailed specs of how validators and finalizers operate.

Let **b** be any block. So, **b** is a vertex in the main-tree. We will consider a projection of validators P2P protocol to a particular Abstract Casper Consensus model instance we will be calling **b-game**.

---

Abstract Casper Consensus How this concept maps to b-game concept

---

validators validators with non-zero weight in post-state of **b**

validator weights **weights-map(globals-states-db(b.po st-state-hash))**

message message (= block or ballot)

j-dag j-dag

consensus value direct child of **b** in the **main-tree**

message **m** is voting for for a block **m**: **m** is a consensus value **c** descendant of **c** along the **main-tree**, for a ballot **m**: **m.target-block** is a descendant of **c** along the **main-tree** when above conditions are not met, we consider **m** as voting for nothing (empty vote)

---

The contents of the table above may be explained as follows:

1.  Hypothetically assuming that validators already achieved consensus on the block **b** as being the part of an "official" chain of blocks, they will have to decide which direct child of **b** (in main-tree) will be the next "official" chain.
2.  So the focus now is on the block **b** and on its direct main-tree children.
3.  We setup the Abstract Casper Consensus instance "relative to block **b**" where consensus values are direct children of **b**.
4.  Any block **x** can be seen as a vote for some child of **b** only if **x** is a descendant of **b** in the main-tree. So if **x** is not a descendant of **b**, we consider **x** as carrying an empty vote.

**Note:** when defining the players of **b-game**, we exclude all equivocators, as seen in the current protocol state. This means that b-game is not "absolute", it is rather depending on the current perspective on the blockchain that given validator has. Also, the collection of equivocators grows over time, which means that over time we may need to recalculate b-game, excluding more validators. This aspect plays a crucial role in how **finalizers** work - (_see below_ the topic **Operation of a finalizer**).

Not all **b-games** tend to be equally important. What happens is presented with the following pattern:

1.  The **Genesis** block is given. So, **Genesis-game** is the first game.
2.  As the blockdag grows, the **Genesis-game** is progressing towards finality.
3.  Finality of the **Genesis-game** means picking some direct child of **Genesis**. Let us name this child **LFB1**
4.  Then, the **LFB1-game** becomes the "important" game that everybody looks at.
5.  As the blockdag grows, the **LFB1-game** is progressing towards finality.
6.  Finality of the **LFB1-game** means picking some direct child of **LFB1**. Let us name this child **LFB2**
7.  This pattern goes on forever.

"LFB" stands for "last finalized block". For symmetry, we set **LFB0** = **Genesis**.

### Why do we need ballots ?

The security of proof-of-stake blockchain is based on the stake in two ways:

-   Large investment (=money) is needed to revert/overtake the history of transactions using honest means.
-   Malicious behavior (= hacking) implies that the stake will get slashed.

Therefore, we would like only bonded validators to be able to participate in blockchain evolution. The problem here is that - when a validator unbonds, some of the **b-games** he was a player of might not be completed (= finalized) yet. We would like to allow the validator to still participate in these games while not allowing him to join new games. This is where ballots come into play. Ballots make it possible for a validator that is no longer bonded to continue the consensus game.

## Merging of histories

### Topological sortings of p-past-cone

This is a previous example of a blockdag, reduced to **p-dag** only:

![](/image/theory/p-dag.png){.align-center width="60.0%"}

We define **p-past-cone(b)** as the set of all blocks $x$ such that $x \leqslant b$ (in the POSET corresponding to p-dag, $x \leqslant y \iff y \rightarrow x$).

**Example:** Let's look at the block $3$. Its p-past-cone is $\{Genesis, 1, 2, 3\}$. Let's look at the block $9$. Its p-past-cone is $\{Genesis, 1,2,3,4,5,9\}$.

Of course, any **p-past-cone(b)** inherits the order from the whole **p-dag**, so it can be seen as a POSET as well.

For $\langle A,R\rangle$ any POSET, topological sorting of $\langle A,R\rangle$ is any linear order $\langle A,T\rangle$ such that $identity:
\langle A,R\rangle \rightarrow \langle A,T\rangle$ is monotonic. In other words, topological sorting is converting a POSET into a total order in a way that preserves the original order. For a given POSET, this can usually be done in many ways.

**Example:** Let's take the $p\_past\_cone(3)$ from our example. As a POSET it looks like this:

![](/image/theory/p-past-cone-for-block-3.png){.align-center width="40.0%"}

It can be topo-sorted in two ways only:

![](/image/theory/p-past-cone-of-block-3-topo-sorts.png){.align-center width="50.0%"}

Example: Let's take the p-past-cone(9) from our example. As a POSET it looks like this:

![](/image/theory/p-past-cone-for-block-9.png){.align-center width="50.0%"}

It can be topo-sorted in many ways. One such topo-sort is shown below:

![](/image/theory/p-past-cone-for-block-9-toposort.png){.align-center width="20.0%"}

### The context of merging problem

Let's assume that current p-dag as seen by a validator **v** looks like this:

![](/image/theory/situation-before-merging.png){.align-center width="60.0%"}

To add a new block $x$, validator $V$ needs to decide which blocks to take as parents of $x$. In other words, decide which variants of a transactions history block $x$ will continue. Merging is all about defining what it means that **x** continues more than one version of the history:

![](/image/theory/merging-problem-illustrated.png){.align-center width="60.0%"}

We have blocks 8, 9 and 10 as current tips of p-dag, so they are candidates for becoming parents of the new block. But usually, we won't be able to take all such tips as parents because the versions of the transactions history they represent are in conflict.

### Formal definition of merging

We say that a set of blocks $B = \{b_1, b_2, ..., b_n\}$ is **mergeable** (= **not in conflict**) when the following holds:

1.  take the sum $S$ of $p\_past\_cone(b_i)$ for $i=1,..., n$ - this is a sub-POSET of p-dag
2.  given any topo-sort $T$ of $S$
3.  the execution of transactions in $B$ along $T$ give:
    1.  the same final global state (regardless of the selection of **T)**
4.  the same subset of transactions that failed (regardless of the selection of **T**)

## Operation of a validator

The spec is written from the perspective of a validator. We say it as **local validator** in order to reference the validator which is running the algorithm. Let **vid** be the id of the local validator.

### Validators P2P protocol - messages

Validators exchange messages which can be of 2 types:

-   **blocks**
-   **ballots**

A **block** contains the following data:

-   **block id**
-   **creator id** (= id of validator that created this block)
-   **main parent** (id of another block)
-   **secondary parents** (collection of block ids, may be empty)
-   **justifications** (collection of message ids that the creator confirms as seen at the moment of creation of this block; excluding main parent and secondary parents; may be empty)
-   **transactions list** (nonempty)
-   **pre-state-hash** - hash of global state that represents state after executing all parents of this block
-   **post-state hash** - hash of global state achieved after executing transactions in this block (and all previous blocks, as implied by p-dag)

For a block $b$ we define the collection $b.all\_justifications$ as main parent + secondary parents + justifications. This collection is always non-empty because **main parent** is a mandatory field.

A **ballot** contains the following data:

-   **block id**
-   **creator id** (= id of validator that created this ballot)
-   **target block** (id of a block)
-   **justifications** (collection of message ids that the creator confirms as seen at the moment of creation of this ballot, excluding the target block; may be empty)

For a ballot **b** we define the collection $b.all\_justifications$ as target block + additional justifications. This collection is always non-empty because target block is a mandatory field.

From the definitions above it follows that for every message $m$ there is a **j-dag** path from $m$ to $Genesis$.

### Validators P2P protocol - behavior

We use the same assumptions on a message-passing network as were stated in the Abstract Casper Consensus model. So, validators only exchange information by broadcasting messages where the broadcasting implementation provides an exactly-once delivery guarantee, but the delays and shuffling of messages are arbitrary.

During its lifetime, a validator maintains the following data structures:

-   **deploys-buffer** - a buffer of transactions sent by clients, to be executed on the blockchain computer
-   **blockdag** - keeping all blocks and ballots either produced by or received from other validators
-   **messages-buffer** - a buffer of messages received, but not yet incorporated into the **blockdag**
-   **latest-honest-messages** - a mapping from validator id to message id, pointing every validator known in the **blockdag**, excluding **equivocators**, to the corresponding swimlane tip
-   **equivocators** - a collection of validators for which current blockdag contains an equivocation
-   **reference-finalizer** - an instance of finalizer used internally (_see_ **Operation of a finalizer** later in this spec for more information about what finalizers are)
-   **global-states-db** - mapping of global state hash to global state

A message $m$ can be added to the $blockdag$ only if all justifications of $m$ are already present in the blockdag. So if a validator receives a message before receiving some of its justifications, the received message must wait in the $messages\_buffer$.

A validator is concurrently executing two infinite loops of processing:

**Listening loop:**

Listen to messages incoming from other validators. Whenever a message $m$ (block or ballot) arrives, follow this handling scenario:

1.  Validate the formal structure of $m$. In case of any error - drop $m$ (invalid message) and exit.
2.  Check if all justifications of $m$ are already included in $blockdag$.
    1.  if yes: continue
3.  otherwise: append $m$ to the $messages\_buffer$, then exit
4.  Perform processing specific to type of $m$ (block or ballot) - see below.
5.  If $equivocators$ does not contain $m.creator$:
    1.  Check if $m$ introduces new equivocation - this is the case when $latest\_honest\_messages(m.creator)$ is not member of $j\_past\_cone(m)$
6.  If yes then add $m.creator$ to $equivocators$
7.  If $equivocators$ does not contain $m.creator$, update $latest\_honest\_messages$ map by setting $latest\_honest\_messages(m.creator) = m$
8.  Check if there is any message $x$ in $messages\_buffer$ that can now leave the buffer and be included in the $blockdag$ because of $x.all\_justifications$ are now present in the $blockdag$. For first such $x$ found, apply steps (3) - (4) - (5) .
9.  ("Buffer pruning cascade") Repeat step (6) as many times as there are blocks that can be released from the buffer.

Processing specific to type of $m$ goes as follows:

If $m$ is a block:

1.  Validate whether $m$ parents (main parent and secondary parents) were selected correctly:
    1.  run the fork-choice for the protocol state derived from justifications of $m$
2.  compare calculated parents with actual parent of $m$:
    -   if they are the same: append $m$ to $blockdag$.
    -   otherwise - drop the block (invalid block) and exit
3.  Check if parents of $m$ are not conflicting. If they are conflicting, then drop the block (invalid block) and exit.
4.  Calculate pre-state for $m$ by executing the transactions in the merged history that is determined by all parents of $m$. Check if calculated hash of pre-state is equal to pre-state-hash stored in $m$. If not, then drop $m$ (invalid block) and exit.
5.  Calculate post-state for $m$ by sequentially applying all transactions in $m$ on top of global state calculated in step (3). Check if calculated hash of post-state is equal to post-state-hash stored in $m$. If not, then drop $m$ (invalid block) and exit.
6.  Store post-state calculated in step (4) in $global\_states\_db$.

If $m$ is a ballot:

1.  Validate whether $m.target\_block$ was selected correctly:
    1.  run the fork-choice for the protocol state derived from justifications of $m$
    2.  compare calculated main parent candidate with actual $m.target\_block$:
        -   if they are the same: append $m$ to $blockdag$.
        -   otherwise - drop the block (invalid block) and exit

**Publishing loop:**

1.  Sleep unless the next time for proposing a block arrives (typically this may be a periodic activity based on wall clock).
2.  Run fork-choice against the current blockdag (see next section). The result is:
    1.  Main parent - $mp$.
    2.  Collection of secondary parents - $sp$ - sorted by preference.
3.  Pick the maximal non-conflicting subset $mncsp \subset sp$, respecting the selection of $mp$ and the ordering of $sp$.
4.  Calculate merged global state $merged\_gs$ derived from $\{mp\} \cup mncsp$.
5.  Check the weight of local validator in merged global state: $weights\_map(merged\_gs)(vid)$
    1.  If weight is non-zero and $deploys-buffer$ is nonempty, we will be creating and publishing a new block.
6.  otherwise - check the status of local validator:
    1.  VOTING_ONLY => create and publish a new ballot
    2.  otherwise => exit

Case 1: new block

1.  Take desired subset of transactions $trans$ from $deploys-buffer$ (this part of behavior is subject to a separate spec; on this level of abstraction we accept any strategy of picking transactions from the buffer).
2.  Apply $trans$ sequentially on top of $merged\_gs$. Let $post\_gs$ be the resulting global state.
3.  Create new block:
    -   block id = hash of the binary representation of this block
    -   creator id = $vid$
    -   main parent = $mp$
    -   secondary parents = $mncsp$
    -   justifications = $latest\_honest\_messages$ after removing main parent, secondary parents, and redundant messages (see explanation below)
    -   transactions list = $trans$
    -   pre-state-hash = $hash(merged\_gs)$
    -   post-state hash = $hash(post\_gs)$
4.  Store $post\_gs$ in $global\_states\_db$
5.  Broadcast new block across validators P2P network.

Case 2: new ballot

1.  Create new ballot:
    -   block id = hash of the binary representation of this block
    -   creator id = $vid$
    -   target block = $mp$
    -   justifications = $latest\_honest\_messages$ after removing: target block and redundant messages (see explanation below)
2.  Broadcast new ballot across validators P2P network.
3.  Note: we generally want to keep the collection $m.justifications$ as short as possible. For this, we never include there main parent, secondary parents, and target block. Also, we want the collection of justifications included in the message to be transitively reduced (= included justifications form an antichain).

### Relative votes

We will need the concept of "last message created by validator **v** that was a non-empty vote in **b-game**". Given any block $b$ and any validator $V$ let us take look at the swimlane of $V$. If $v$ is honest, then this swimlane is a chain. Any message $m$ counts as a non-empty vote in **b-game** only if:

-   $m$ is a block and the ancestor of $m$ (in main-tree) is $b$
-   $m$ is a ballot and the ancestor of $m.target\_block$ (in main-tree) is $b$

We start from the latest (= top-most on the diagram) message in the $swimlane(v)$ and we traverse the swimlane down, stopping as soon as we find a message that counts as a non-empty vote in **b-game**.

**Example:** Below is the original example of the blockdag, but with all messages that are non-empty votes in 3-game highlighted with green:

![](/image/theory/fork-choice-paradox.png){.align-center width="60.0%"}

**Example:**

Let us again look at the example of a blockdag:

![](/image/theory/blockdag-with-ballots-and-equivocations.png){.align-center width="60.0%"}

Let's apply this definition using validator 3 as the example and find the last votes of validator 3 in various games.

Block b Last non-empty vote of validator 3 in b-game

---

Genesis 14 1 9 2 14 3 9 4 (none) 5 14 6 (none)

### Fork choice

The goal of fork-choice is to take the decision on top of the version of the shared database history we want to build in the next step. This decision can be seen as an iterative application of the reference estimator from the "Abstract Casper Consensus". As a result we want to get a list of blocks (ordered by preference) which will serve as parent candidates for the new block.

The algorithm goes as follows:

1.  Decide which protocol state $ps$ to use:

    1.  When using fork choice for creation of new block this is the point where the validator can decide on the subset of his local knowledge to reveal to outside world. Ideally, the validator reveals all local knowledge, so it takes as protocol state the whole local blockdag.

2.  When using fork choice for validation of received message $m$, the protocol state to take is $j\_past\_cone(m)$.

3.  Take $HV$ - all honest validators (all creators of messages in $ps$ minus those seen equivocating with messages in $ps$).

4.  Find latest message $lm(v)$ created by each validator $v \in HV$, ignoring validators that produced no message.

5.  For all validators that have $lm(v)$ defined take:

    $$
    \begin{aligned}
    tipBlock(v)=\begin{cases} lm(v), & lm(v) \space is \space a \space block \\lm(v).target\_block, & otherwise \end{cases}
    \end{aligned}
    $$

    5.  Take $lca\_block$ = latest common ancestor along main-tree of all $tipBlock(v)$
    6.  Initialize resulting collection of blocks as one-element list $Result = [lca\_block]$
    7.  For each block $b$ in $Result$ replace $b$ with its direct children in main-tree: $c_1, c_2, ..., c_n$, where the list of children is ordered following this recipe:
        1.  For each honest validator $v$ find $lmb(v)$ - the last message by $v$ voting in **b-game.**
    8.  Find a child $c_i$ that $lmb(v)$ is voting for - by traversing down the main-tree. 3. Using $validator\_weights(b)$ count the votes.
    9.  Order the sequence $c_i$ by calculated votes, using $ci.id$ (= block hash) as tie-breaker.

6.  Repeat step 7 as long as it is changing **Result**.

7.  The **Result** is the list of blocks we want. The first block on the list is the main parent candidate, remaining blocks are secondary parents candidates.

## Operation of a finalizer

### The objective

Finalizer observes the growing blockchain. The objective is to recognize the subset of transactions history that:

-   is already agreed (as a result of on-going consensus)
-   cannot be reverted (unless the equivocators collection exceeds - by total weight - predefined threshold)

### Parameters

In general - different finalizers will be based on different finality criteria. For the current design we assume that the criterion described in the previous chapter is in use.

Hence, the finalizer is parameterized by:

-   the type of finality detector to be used
-   **K** - acknowledgement level
    -   **WP** (weight percentage) - expressed as a number between 0 and 1

### State

The assumption is that a finalizer can traverse the blockdag, reading contents of blocks. Also, for any block b it should be able to read post-state of b, and in particular get the weights-map from this post-state.

The internal state of the "reference" implementation of a finalizer would be:

-   **equivocators: Set\[ValidatorId\]**

-   **current-game-id: Int**

    -   current finality detector instance - the one observing **LFB(current-game-id)-game**

-   **LFB: Seq\[Block\]** for **i=0 ... current-game-id**

    -   **initial-players: Seq\[Set\[ValidatorId\]\]**

-   **excluded-players: Seq\[Set\[ValidatorId\]\]**

    -   **FTT: Seq\[Int\]**

    Initial state (on the beginning of the blockchain, the only block is Genesis):

    -   **equivocators** = empty set
    -   **current-game-id** = 0
    -   current finality detector instance = new instance (according to configured type of finality detector to be used)
    -   **LFB** = empty sequence
    -   **initial-players** = one element sequence, with the single element being the set of ids of validators bonded at Genesis

-   **excluded-players** = one element sequence, with the single element being the empty set

    -   **FTT(0) = ceiling(WP \* total-weight(post-state of Genesis))**

### Behaviour - the general plan

> The operation of a finalizer can be decomposed as the following, partially independent activities:
>
> 1.  Maintaining equivocators collection corresponding to current protocol state.
> 2.  Building the **LFB** chain
> 3.  Propagating **LFB** chain finality via secondary parents (indirect finalization).
> 4.  Monitoring old games in **LFB** chain for the possibility of equivocation catastrophe.
> 5.  Reacting to equivocation catastrophe (by recalculating the **LFB** chain).
> 6.  Publishing the stream of finalized blocks (over some streaming API) - this includes possibly also maintaining the collection of subscribers.

### LFB chain

**LFB(i)** is supposed to be the "i-th last finalized block". **LFB** chain is achieved in the following way:

1.  Take **LFB(0) = Genesis**
2.  Let's assume that LFB(m) is the last-so-far element of the chain. So in other words, it is the last finalized block.
    1.  For deciding which main-tree child of LFB(m) should be taken as LFB(m+1) we need to start a new empty instance of finality detector.
        1.  **initial-players(m)** = validators staked at post-state of **m**, excluding current contents of **equivocators**
3.  **excluded-players(m)** = empty set
4.  Finality detector observes the LFB(m)-game, with:
    1.  game-level acknowledgement level **K** same as defined by parameters of this finalizer 2. **FTT(m) = ceiling(WP \* total-weight(post-state of m))**, where \*_ceiling(\_)_\* is integer rounding towards positive infinity. 3. Once **LFB(m)**-game reaches finality, the next element of **LFB** chain is established.

### Indirect finalization

> Once **LFB(m)** is established, we consider the whole **p-past-cone(LFB(m))** as finalized.

### Equivocation catastrophe

For any **LFB(m)**, the **LFB(m)-game** may "crash" by total weight of equivocators exceeding **FTT(m)**. Such situation we call **the equivocation catastrophe**.

Discovery of equivocation catastrophe works as follows. \-- Whenever a new message **m** is added to a local blockdag, the following handling is done by the finalizer:

1.  If **m.creator** is already included in **equivocators** collection - do nothing.
2.  Otherwise - check if m is not introducing a new equivocation. If yes - add **m.creator** to equivocators and:
    1.  for every i such that m in initial-players(i):
        1.  add m to **excluded-players(i)**
    2.  using weights map from **LFB(i)** post-state, check if total weight of **excluded-players(i)** exceeds **FTT(i)**
    3.  if for some **LFB(i)** exceeding **FTT(i)** case happened - take the smallest such **i** - we will call the block **LFB(i)** **the catastrophic point**

Once an equivocation catastrophe is discovered, the following handling must be applied:

1.  Starting from the catastrophic point, re-calculate the **LFB chain** (initializing initial players accordingly to current contents of **equivocators**).
2.  Find the first **i** such that the new LFB-chain differs from old LFB chain at index **i**. Usually such **i** will be bigger than the catastrophic point.
3.  Publish a rollback event at the level of external API.
4.  Publish re-calculated LFB stream, starting from first difference.

### External API of a finalizer

The API should be stream-based. The decision on the actual streaming technology to use is beyond the scope of this specification.

We only assume that:

-   external software components may subscribe to the API (to be notified

-   subscribed observers may unsubscribe

    : - what a subscribed observer receives is a sequence of events

**Events:**

---

Event type Contents Semantics

---

NEXT_LFB event idLFB(i).idisequence of published as soon as indirectly finalized blocks **LFB(i)** is finalized

CATASTROPHY event idsequence id of catastrophy signal that equivocation point catastrophe happened

---

**Example:**

Event Current snapshot of LFB chain

---

NEXT_LFB(1, 231, 0, \<\>) \(231\) NEXT_LFB(2, 420, 1, \<\>) (231, 420) NEXT_LFB(3, 801, 2, \<524,525>) (231, 420, 801) CATASTROPHY(4, 2) \(231\) NEXT_LFB(5, 421, 1, \<105, 116, 228>) (231, 421) NEXT_LFB(6, 480, 2, \<\>) (231, 421, 480)
