# Highway

## Motivation {#motivation}

For a practically useful decentralized consensus protocol, proofs of two theorems must be provided:

-   **safety:** a theorem saying that nodes cannot come up with conflicting decisions

\- **liveness:** a theorem saying that nodes will keep making decisions forever (so, that the blockchain will grow forever)

The First theorem is just another name for the machinery of finality detectors. And it is the easy one. The Second theorem tends to be substantially harder to prove and these difficulties are showing up in pretty much any blockchain design studied.

Despite the fact that the "naive" design of a blockchain described in the previous chapter can actually be implemented and its observed behavior is promising, so far we were not successful trying to prove the liveness theorem for it.

As part of this effort, we were actively looking for some hardening of assumptions that would lead to a provably live protocol while maintaining our key goals intact; i.e. to have a permissionless, fully decentralized, Casper-based blockchain that is compatible with broadcast-based message passing and a partially synchronous network.

**Highway** is one of such attempts we found particularly promising. This is a variant of Casper where the liveness theorem is achieved via constraining message production with a pseudorandomly generated sequence of leaders that, in effect leads to a predictable structure of the emerging blockdag.

## Innovations in a nutshell {#innovations-in-a-nutshell}

We generally see Highway as an evolution from Naive Casper Blockchain (later abbreviated as NCB), where key modifications are:

\- Organize blocks creation around a pseudorandomly generated sequence of leaders. Only a leader can produce a block. - Use variable length of rounds based on the $2^n$ round length idea so that the blockchain network can self-adjust to achieve optimal performance. - Replace continuous bonding/unbonding with an era-based solution. This is necessary to keep the solution secure (so that attackers cannot tamper with the leader sequence generator).

## New requirements {#new-requirements}

Interestingly, in comparison to NCB, we need only one new assumption, although a tough one - we need that validators have well synchronized real time clocks.

How to achieve such real-time clocks and how to secure the network against intended or unintended clock drift is, in general, beyond the scope of this specification. However, we give some hints on certain simple precautions to be taken.

## Why "Highway" {#why-highway}

To intuitively capture the key idea of the $2^n$ round length trick, we once imagined a highway, well - a mathematical highway with infinitely many lanes. Lanes are numbered with integers (all integers, also negative).

This highway is different because movement on it takes place in the form of hops, while the speed of all cars is constant. In any given lane $n$, a car has to make $2^n$ hops to cover a unit distance.

Therefore, if you switch to the lane on your left-hand side, you increase the frequency of your hopping by a factor of 2. If you switch to your right-hand side, you decrease the frequency by a factor of 2.

You meet cars from the lane on your left-hand side on every jump you make. For cars on your right-hand side, you meet only every second hop.

## Messages structure {#messages-structure}

While we generally keep messages structure established in NCB, we require the

: following additional fields:

for every message:

-   **round-id: Int** - keeps the round id that this message belongs to

\- **real-time-stamp: Int** - keeps the actual time of creating this message taken from the real-time clock of the sender (must be creation as opposed to sending because all fields are sealed with a digital signature)

for blocks only:

\- **magic-bit: Bit** - this is one bit field needed for leaders pseudorandom

: generator seed

for ballots only:

-   **message-type: Enum** - one of: LAMBDA_RESPONSE, OMEGA

Note: The semantics of these fields is explained later in this document.

## Liveness strategy {#liveness-strategy}

### Ticks {#ticks}

Validators see time in a discrete way, namely - as the number of ticks since some hardcoded point of real time. For simplicity, we assume that ticks are just milliseconds since "epoch" \-- the Unix time representation standard.

### Leaders {#leaders}

There is a **leader** assigned to every tick. A leader is always one from the

: currently staked validators.

The precise algorithm of calculating who is the leader of given tick is pretty convoluted and needs a machinery that we will establish step-by-step. For now, it is enough to say that a validator has a recipe to calculate the leader of every tick.

### Rounds {#rounds}

In a leader based system, rounds are inevitable, because a leader cannot lead

: forever. Hence, it is supposed to lead during a single round.

Picking a fixed round length obviously leads to scaling issues. On the other hand, adjusting round length on-the-fly is tricky.

In Highway, we approach the problem of automatic adjustment of round length in a unique and unusual way. Every validator selects a private value $n
\in Int$, which we call **round exponent**. Over time, a validator will be automatically adjusting this value to optimize its performance and the performance of the blockchain.

Given a round exponent $n$, the length of a round that a validator uses

: for its operation is $2^n$ ticks.

So, effectively, rounds live in sort of parallel worlds ("lanes of the highway"), where all validators with same round exponent $n$ have the same schedule of rounds. On the other hand, if we compare two validators, **Alice** and **Bob**, **Alice** using round exponent $n$, **Bob** using round exponent $m$, and assuming $n < m$, then:

-   **Alice** is $2^{m-n}$ faster than **Bob**
-   **Alice** participates in all rounds that **Bob** knows about

\- **Bob** participates only in some rounds that **Alice** knows about - once

: every $2^{m-n}$ **Alice**'s rounds

A round is identified by the tick at which it starts. Of course validators with different round exponents will differ in perspective on the length of this round.

**Example:** Alice has round exponent 5. Bob has round exponent 7. So, in Alice's world, rounds have length 32 ticks, while in Bob's world rounds have length 128 ticks. Timepoint 2019-09-13T13:13:13.088Z corresponds with tick 1568380393088 and is the beginning of a round for both Alice and Bob. But, in Alice's world, this round will only last for 32 milliseconds, while for Bob this round will last for 128 milliseconds.

### Validator operation {#validator-operation}

Contrary to NCB, the way ballots are used in Highway is more sophisticated.

In NCB a validator only produces ballots to continue participation in **b-game** after doing unbonding. In Highway, only the round leader is allowed to produce blocks. So if I am not the leader of current round, I am going to produce only ballots.

In details, local state and operation of a validator is similar to NCB. The only difference is that we impose very precise rules on when and how to create new messages.

#### Rule 1: ignore rounds you cannot see {#rule-1-ignore-rounds-you-cannot-see}

I operate as if the world is simple and everybody uses the same round exponent as I am using. Which means that I completely ignore the existence of rounds starting at ticks not divisible by $2^n$, where $n$ is my round exponent.

#### Rule 2: follow the leader sequence {#rule-2-follow-the-leader-sequence}

For every round I use the leader's pseudorandom sequence to figure out the id

: of a validator which is the leader of this round.

#### Rule 3: lambda message {#rule-3-lambda-message}

If I am the leader of current round, I produce new block $b$, using all

: tips of my local j-dag as justifications of $b$. Then I broadcast

$b$ to all validators.

We call this message **the lambda message**. There is only one lambda message

: in every round. Every block $b$ is a lambda message of some round, namely round $b.round\_id$.

#### Rule 4: lambda response message {#rule-4-lambda-response-message}

If I am not the leader of the current round, I set up a handler for receiving the lambda message from this round's leader. This handler waits for the lambda message but only up to the end of the current round. If the lambda message arrives before the end of the current round, I create a ballot taking as its justifications only the lambda message and my last message (if I have one).

#### Rule 5: omega message {#rule-5-omega-message}

Let $j$ be the id of current round. At tick $j + omega\_delay
\cdot 2^n$ I create a ballot $b$ using all tips of my local j-dag as justifications of $b$.

$omega\_delay \in(0,1)$ is a blockchain parameter - to be picked by simulation and then hardcoded.

## Adjusting round exponent {#adjusting-round-exponent}

We need to make it clear what the semantics is of adjusting the round exponent. First, we want to say that the mechanics of messages creation requires that a validator knows what exponent he was using at any tick. This can be formalized by saying that for any validator $v$ there is a function $n_v: Int \to Int$, assigning an exponent to be used by $v$ in any given tick.

When a validator wants to adjust its round exponent, this must be done at a tick that happens to be the boundary of both the old-length round and the new-length round. Mathematically this transforms into saying that $n_v
(i) = n_v(i-1)$ unless $i$ is a multiple of both $2^{n_v(i)}$ and $2^{n_v(i-1)}$.

Auto-adjusting of round lengths is based on an internal finalizer which every

: validator must maintain. This finalizer would run with the fault tolerance threshold $ftt$ set as blockchain-wide constant ($ftt=1\%$ sounds like a good candidate value here) and $acknowledgement\_level=1$.

Now, we finally can define the strategy of auto-adjusting round exponents.

We assume there are two blockchain-wide integer constants, both expressing the number of rounds:

\- **round-acceleration-period** - every that-many-rounds a validator decreases its round exponent by $1$ (unconditionally) - **round-slowdown-period** - if a validator observes that many consecutive rounds with the lambda message from the round leader not getting finalized, it increases its round exponent by 1

## Eras {#eras}

### The need for eras {#the-need-for-eras}

The idea of of eras is to keep the validator weights map constant for a longer period of time (e.g., a week). Otherwise, it is rather difficult to establish a pseudorandom leaders sequence all validators agree on. Eras also plays a crucial role in making the leader selection resistant to attack.

### Boundary of an era {#boundary-of-an-era}

**Era length** is just a parameter of the blockchain - expressed as a number of ticks. We expect a reasonable era length might be 604800000, which is one week.

A message $m$ belongs to an era deduced by knowing the era length and looking at $m.round\_id$.

### Critical blocks {#critical-blocks}

Round ids are really Unix timestamps, so main-tree can be now imagined with time-axis overlayed.

In every era, there are two ticks (with a distance fixed relative to the beginning of an era):

-   **booking-point**
-   **key-point**

These points are blockchain parameters and **key-point** must be strictly bigger than **booking-point**.

Let $era\_start: Int \to Int$ be a function that assigns to every tick the beginning of an era this tick belongs to. This function can easily be calculated as:

$$era\_start(t) = (t / era\_length) * era\_length$$

... where the division is integer division.

**Booking block** is any block $b$ such that both following conditions hold:

-   $b.round\_id \geqslant era\_start(b.round\_id) + booking\_point$
-   $b.main\_parent.round\_id < era\_start(b.round\_id) + booking\_point$

It can be explained as the idea that on any path of the main-tree, booking block is the first block to cross the time defined by **booking-point**, where we consider "time of a block" to be the tick of the beginning of its era.

By analogy, we are defining a **key block** concept.

### Leaders sequence {#leaders-sequence}

To have the sequence of leaders that all validators calculate in the same way, we only need:

1\. Canonical sorting of validators so that a weights map can be converted to an array of validators in the canonical way. 2. Agreement on pseudorandom number generator to be used by all validators. 3. Pseudorandom generator seed.

For (1) sorting by validator ids can be used. (2) can be hardcoded. So it is all about the way we pick the seed.

### The mechanics of an era {#the-mechanics-of-an-era}

#### The vision {#the-vision}

Eras constitute the platform on which two mechanisms work:

-   validators rotation (= bonding/unbonding)
-   leaders sequence

Within a single era:

-   the weights map is fixed
-   the leaders selection functions (assigning a leader to every tick) is fixed

An era starts at fixed point of real time (fixed tick). We generally expect that:

1\. The weights map to be used in this era is defined by a booking block from $era\_delay$ rounds ago. 2. The random seed to be used in this era is defined by a key block from $era\_delay$ rounds ago.

Both $era\_delay$ is a blockchain parameter. We expect that reasonable value for $era\_delay$ is 2.

#### Setting the weights map {#setting-the-weights-map}

Just take weights map as defined in the post-state of the corresponding booking block.

#### Setting the random seed for leaders sequence generator {#setting-the-random-seed-for-leaders-sequence-generator}

Take the hash of corresponding key-block, then add all magic bits from main-tree path-of-blocks between the booking block and the key block (both from the same era).

### Disparation of eras {#disparation-of-eras}

In an era we typically will observe many booking blocks and key blocks, just because the main-tree is typically not a chain. The expectation here is that the combination of $era\_delay$ and $key\_point$ together make enough time between the key block and the beginning of the era it defines, that the LFB chain of a reasonably strong finalizer will do the selection of only one "official" key block.

Let us do a simple calculations:

Assuming the era length is set to one week - starting Monday and ending Sunday - and the key point is set to Thursday noon. Also, assume that "era_delay" is 2. This means that key blocks created just after Thursday noon will control the era that will start 10.5 days later. This is plenty of time and by that time it is "almost sure" that the progressing LFB chain will pick the "right" key block to be used.

> In the extreme case, however, the finality of the key block might not be there at the moment of starting the era to be controlled by this block. This is an interesting situation that actually can be handled, although this is to happen in a "shocking" way. The way to go is to run in parallel all possible eras - accordingly to all key blocks that are "on the table". Of course, these parallel eras must be run as if they are completely independent blockchains (= separate P2p networks). Eventually, the progressing LFB chain will materialize only one reality, and so all the other virtual eras must disappear, so validators will just forget they ever existed. This is exactly like in quantum mechanics, where at some point only one version of reality is materializing.
