# Abstract Casper Consensus

## Stating the problem

We are considering a collection of processes - **validators** - communicating over a message-passing network. Every validator has a **weight** \-- a non-zero integer value representing the "voting power".

The goal validators collectively pursue is to pick a single value from a finite set $Con$ we call the set of **consensus values**. Once the agreement is achieved, the problem is considered solved (i.e. validators terminate their operation). We require that $Con$ is totally ordered.

The resulting solution of this problem is not a blockchain yet. It is however a core building block of our blockchain design. The way abstract consensus is used for building a blockchain is explained in subsequent chapters.

Caution: we use **ACC** as the shortcut for **Abstract Casper Consensus**.

## Network model

We assume a fully asynchronous network model with delivery guarantee and a single primitive: _broadcast(m)_. Precisely speaking:

1.  Communication between validators is based on the "broadcast" primitive: at any time, a validator can broadcast a message $m$.
2.  Once broadcast, the message $m$ will be eventually delivered to every other validator in the network. The delivery will happen exactly once but with arbitrary delay.

Given the assumptions above, it follows that the order of delivery generally is not going to be preserved. In other words when a validator $A$ broadcast sequence of messages $(m_1, m_2, ... m_k)$ then another validator $B$ will receive all the messages in the sequence, but with delivery chronology following arbitrary permutation $p:(1,..,k) \rightarrow (1,..,k)$, i.e. $(m_{p(1)}, m_{p(2)}, ... m_{p(k)})$.

## Messages

All the messages broadcast by validators have the same structure. Every message $m$:

-   has unique identifier - $m.id$

-   includes the identifier of the validator who created $m.creator$

-   references messages the creator confirms as seen at the moment of creating $m$ - we call this list "justifications" - $m.justifications$

-   has a vote:

    -   this means pointing to a some consensus value, or
    -   picking no consensus value (i.e. this is "empty vote")

-   is cryptographically signed by the creator

The consensus value included in the message is however optional - it is OK to broadcast an "empty vote" message. The semantics of such empty vote is "I support my previous vote, unchanged". If the previous vote is empty, it counts as "vote for nothing".

This is the pseudo-code definition of a message structure (taken from the reference implementation, which is presented in detail later in this chapter):

```scala
//Definition of messages exchanged by validators.
case class Message(
                    id: MessageId,
                    creator: ValidatorId,
                    previous: Option[MessageId],
                    justifications: Seq[MessageId],
                    vote: Option[Con],
                    dagLevel: Int
)
```

## J-dag

We use the term **snapshot** for a set of messages $M$ that is closed under taking justifications, i.e. such that:

$$\forall{m \in M}, m.justifications \subset M$$

Let us consider arbitrary snapshot $M$. We will define the following acyclic directed graph $jDag(M)$:

-   vertices = all elements of $M$;
-   edges = all pairs $m_1 \rightarrow m_2$ such that $m_2 \in m_1.justifications$.

Why we claim this graph is acyclic ? Well, because a cycle in this graph would mean that either time-traveling is possible or a validator managed to guess an id of some message before that message was actually created. Time-traveling we preclude on the basis of physics, while guessing of future message id must be made close-to-impossible via smart implementation of message identifiers (using message hash should be good enough).

We require that every validator maintains a representation of $jDag(M)$ reflecting the most up to date knowledge on the ongoing consensus establishing process. Observe that $jDag(M)$ may be equivalently seen as a POSET because of the well-known equivalence between transitively closed DAGs and POSETs. In the remainder of this chapter we blur the difference between $jDag(M)$ seen as a DAG and its transitive closure seen as a POSET. We will use the relation symbols $<$ and $\leqslant$ for the implied partial order of $jDag(M)$, where for two messages $a$ and $b$ a justification $a \to b$ implies $b < a$.

When $m \in M$, we define:

-   $jPast(m)$ as $\{x \in M: x < m \}$.
-   $jPastCone(m)$ as $\{x \in M: x \leqslant m \}$.

Of course both $jPast(m)$ and $jPastCone(m)$ are snapshots.

In the context of any snapshot $M$ we introduce the following concepts:

**transitive justification of message m**

: is any message $x$ such that $x < m$; we also say that "$m$ has seen $x$"

**swimlane of validator v**

: or just $swimlane(v,M)$ is $\{m \in M: m.creator = v\}$; a swimlane usually is not a snapshot, nevertheless it inherits the ordering from $jDag(M)$, so it can be seen as a DAG and a POSET

**tip**

: is a maximal element in $jDag(M)$; of course $jDag(M)$ can contain more than one maximal element

**validator v is honest in M**

: means $swimlane(v,M)$ is empty or it is a nonempty chain; in POSET language in translates to $swimlane(v,M)$ being a (possibly empty) linear order

**validator v is an equivocator in M**

: if $v$ is not honest in $M$

**equivocation by v**

: is a proof that a validator $v$ is not honest; in other words it is a pair of messages $a,b \in M$, both created by $v$, such that $\neg (a < b)$ and $\neg (b < a)$

**latest message of a validator v in M**

: is any tip in $swimlane(v,M)$; if $v$ is honest in $M$ then it has at most one latest message in $M$

**honest validators in M**

: $\{v \in \textit{Validators}: \textit{v is honest in M}\}$

**panorama of M**

: is a partial function $\textit{panorama(M)}: \textit{Validators} \rightarrow M$, defined for every validator which is honest in M and swimlane(v,M) is nonempty, $panorama(M)(v) = \textit{tip of the swimlane of v}$

These concepts are illustrated below. Messages are represented with circles. Justifications are represented with arrows. Colors inside a circle represents consensus values.

![](/image/theory/acc-concepts.png){.align-center width="100.0%"}

![](/image/theory/acc-jpastcone.png){.align-center width="100.0%"}

## Estimator

Upon creation of a new message $m$, a validator must decide which consensus value $m$ will vote for. We limit the freedom here by enforcing that the selected consensus value is constrained by the function called **estimator**:

$$\textit{estimator}: Snapshots \to Con \cup \{ None \}$$

For any message $m$ we say **estimated vote for m** for $\textit{estimator}(jPast(m))$.

We enforce the votes by the following rule:

-   if estimated vote for $m$ is not None then must vote for the estimated vote
-   otherwise, $m$ is allowed to vote for any value in $Con$

Let us consider any snapshot $M$. The way $estimator(M)$ is calculated goes as follows:

> 1.  Take the collection $H$ of all honest validators in $M$.
> 2.  Restrict $H$ to collection of validators that created at least one message with non-empty vote - $H'$
> 3.  If $H'$ is empty - return $None$, otherwise - continue calculation.
> 4.  For every validator in $H'$ - find its latest message with non-empty vote.
> 5.  Sum latest messages by weight; this will end up with a mapping $\textit{totalVotes}: Con \to Int$, for every consensus value $c$ it returns the sum of weights of validators voting for $c$.
> 6.  Find all points $c \in Con$ such that $\textit{totalVotes}$ has maximum value at $c$.
> 7.  From elements found in the previous step pick maximum element $cmax \in Con$. This is where we use the fact that $Con$ is finite and totally ordered.
> 8.  The result of the estimator is $cmax$.

## Validity conditions

On reception of a message, every validator must check certain conditions. Messages not compliant with these conditions are considered invalid and hence ignored.

Formal validation is:

-   message must be correctly structured, following the transport (= binary) representation
-   checking of the cryptographic signature of message creator

Semantic validation is:

-   consensus value $m.vote$ must be compliant with applying the estimator to $jPast(m)$
-   justifications $m.justifications$ must reference messages belonging to distinct swimlanes, i.e. if $j_1$, $j_2$ are two justifications in $m$, then $creator(j_1) \ne creator(j_2)$

We explain the concept of "estimator" later in this chapter.

## Operation of a validator

A validator continuously runs two activities:

-   **listening loop** - handling messages arriving from the network
-   **publishing loop** - creating and broadcasting new messages

**Listening loop**

When a message $m$ arrived:

> 1.  Formal validation of $m$ is performed.
>
> 2.  If $textit{m.justifications}$ are already present in the local representation of j-dag then:
>
>     -   semantic validation of $m$ is performed
>     -   $m$ is added to the j-dag
>
>     otherwise:
>
>     -   $m$ is added to the messages buffer, where it waits until all justifications it references are present in the j-dag

On every message added to the local j-dag:

> 1.  Messages buffer is checked for messages that have now all justifications present in the j-dag and so can be removed from the buffer.
> 2.  Finality detector analyzes local j-dag to check if the consensus has already been reached.

**Publishing loop**

We do not determine when exactly a validator decides to create and broadcast a new message. This is pluggable part of ACC. As soon as a validator, following its publishing strategy, decides to publish a message, it builds a new message with:

-   justifications set to tips of all swimlanes, according to local j-dag; in case of equivocators, i.e. when the corresponding swimlane has more than one tip - validator picks just one tip (any)
-   consensus value determined by estimator, as applied to the justifications

## The concept of finality

### When the consensus is reached

A validator $v$ constantly analyzes its local j-dag to observe a value $c \in Con$ becoming "locked" in the following sense:

-   from now on, the estimator applied to local j-dag tips will always return $c$
-   the same phenomenon is guaranteed to happen also for other validators (eventually)

If such locking happens, we say that **consensus value c is now finalized**, i.e. the consensus was reached with value $c \in Con$ being the winner.

### Malicious validators

In general - malicious validators can stop consensus from happening. We need to adjust the concept of finalization so to account for this problem.

There are 4 ways a validator can expose malicious behaviour:

1.  Be silent (= stop producing messages)
2.  Produce malformed messages.
3.  Violate the condition that a message must vote on a value derived from justifications via the estimator.
4.  Equivocate.

Case (3) can really be considered a sub-case of (2), and (2) can be evaded by assuming that validators reject malformed messages on reception. So, the only real problems come from (1) and (4):

-   Problem (1) is something we are not addressing within ACC.
-   Problem (4) is something we control explicitly in the finality calculation.

### Closer look at equivocations

Equivocations do break consensus. Intuition for this is clear - if everybody cheats by concurrently voting for different values, validators will never come up with a decision the value is finally agreed upon.

It may be not immediately obvious how equivocations are possible in the context of the rule that the estimator function determines the consensus value to vote for. It is worth noticing that:

1.  The essence of an equivocation is not about voting for different consensus values; it is about behaving in a "schizophrenic" way by pretending that "I have not seen my previous message".
2.  A Validator does not have to reveal all messages actually received. "Revealing" happens at the creation of a new message - by listing justifications of this message. The protocol does not prevent a validator from hiding knowledge, i.e. listing as justifications "old" messages.
3.  Technically, to create an equivocation is very easy - all one have to do is to create a branch own the swimlane. Such a branch is created every time when for a message $m$ its transitive justifications $jPastCone(m)$ do not include previous message by $m.creator$.

### Finality criteria

Let $\mathcal{M}$ be the set of all possible formally correct messages. Let $\textit{Snapshots}(\mathcal{M})$ be the set of all justifications-closed subsets of $\mathcal{M}$.

Because of equivocations, finality really means "consensus value $c$ being locked as long as the fraction of honest nodes is sufficiently high". We express the "sufficiently high" part by introducing the concept of **faults tolerance threshold**, or **FTT** in short. This leads us to the improved definition of finality:

A value $c \in Con$ is finalized in a snapshot $S \in \textit{Snapshots}(\mathcal{M})$ with fault tolerance $t$ if:

1.  $\textit{Estimator}(S) = c$
2.  For every snapshot $S \in \mathit{Snapshots}(\mathcal{M})$ such that $S \subset R$ one of the following is true:

-   $Estimator(R) = c$
-   total weights of equivocators visible in $R$ is bigger than $t$

**Finality criterion** is any function $fc: \mathit{Snapshots}(\mathcal{M}) \times Int \to C \cup {EMPTY}$ such that if $fc(S,t) = c$ then $c$ is finalized in $S$ with fault tolerance $t$.

Intuitively, finality is something that is easy to define mathematically but potentially hard to discover by an efficient calculation. Therefore in general we discuss various finality criteria, which are approximations of finality. Finality criteria may differ by sensitivity (= how they are not overlooking existing finality) and computational efficacy.

## Calculating finality

### Introduction

We describe here the criterion of finality codenamed "Summit theory ver 2". This criterion has two parameters:

-   **ftt: Int** - "absolute" fault tolerance threshold (expressed as total weight)
-   **ack_level: Int** - acknowledgement level; an integer value bigger than zero

The criterion is centered about the concept of "summit". Summits are subgraphs of j-dag fulfilling certain properties. We will use the term **k-summit** for a summit formed with acknowledgement level k.

Once a k-level summit is found, the consensus is achieved.

### Visual notation

To investigate the summit theory we developed a simulator and a visual notation. Pictures in this chapter are produced with this simulator.

This is an example of 1-summit:

![](/image/theory/summit-1.png){.align-center width="100.0%"}

The graph corresponds to local j-dag of validator 0 and is visually aligned by daglevel (so time goes from left to right).

Rectangles on the left represent validators. Swimlane of a validator is aligned horizontally, so for example swimlane of validator 3 contains messages 4, 14, 20 and 24. Message 28 is marked with a dashed border - this means this message was created somewhere in the network but at the moment of taking the snapshot of local state of validator 0 was not yet delivered to validator 0.

Validator colors are also meaningful:

-   white - this validator is not part of the summit
-   green - this validator is part of the summit
-   red - this is an equivocator

The color inside of each message represents the consensus value this message is voting for.

The color outside represents the information related to summit structure (explained later in this chapter).

### Step 1: Calculate quorum size

Quorum size is an integer value calculated as:

$$\textit{quorum} = ceiling\left(\frac{1}{2}\left(\frac{ftt}{1-2^{-k}}+w\right)\right)$$

... where:

-   $ftt$ - absolute fault tolerance threshold
-   $w$ - sum of weights of validators
-   $k$ - desired acknowledgement level of a summit we are trying to find
-   $ceiling$ - rounding towards positive infinity

The formula can be rephrased to use relative ftt instead of absolute ftt:

$$\textit{quorum} = ceiling\left(\frac{w}{2}\left(\frac{rftt}{1-2^{-k}}+1\right)\right)$$

... where:

-   $rftt$ - relative fault tolerance threshold (fractional value between 0 and 1); represents the maximal accepted total weight of malicious validators - as fraction of $w$

### Step 2: Find consensus candidate value

The first step in finding a summit is to apply the estimator to the whole j-dag. This way the consensus value that gets most votes (by weight) is found, where the total ordering on $Con$ is used as a tie-breaker.

Say the value returned by the estimator is $c$. When the total weight of votes for $c$ is less than quorum size, we do not have a summit yet, so this terminates the summit search .

### Step 3: Find 0-level messages

**0-level messages for an honest validator v** is a subset of $swimlane(v)$ formed by taking all messages voting for $c$ which have no later message by $v$ voting for consensus value other than $c$. Please notice that empty votes are considered a continuation of last non-empty vote.

**0-level messages** is a sum of zero level messages for all hones validators.

Let us look again at the example summit:

![](/image/theory/summit-1.png){.align-center width="100.0%"}

All latest messages vote for consensus value "white", so it is clear that white is the value picked by the estimator.

In the swimlane of validator 2, messages 3 and 9 vote for white, but are not 0-level, because 2 changed mind later. Also messages 11 and 15 are not 0-level, because they vote for orange. Only messages 19 and 26 are 0-level.

In the swimlane of validator 1, all messages are 0-level: 2, 13, 22, 23.

In the swimlane of validator 0 no message is 0-level, because validator 0 is an equivocator. This becomes clear when we highlight the j-past-cone of message 25:

![](/image/theory/summit-1-jpastcone.png){.align-center width="100.0%"}

Message 18 is not included in j-past-cone of message 25. Hence - messages 18 and 25 form an equivocation.

### J-dag trimmer

We will be working in the context of local j-dag of a fixed validator $v_0 \in V$. Let $M$ be the set of all messages in the local j-dag of $v_0$.

Definition: Let $S \subset V$ be some subset of the validators set. By **j-dag trimmer** we mean any function $p:S \to M$ such that $\forall{v \in S}, p(v).\textit{creator} = v$

If you think of swimlanes as being "fibers" or "hair" then having a trimmer means:

-   selecting a subset of swimlanes
-   picking a "cutting point" for every selected swimlane

When having a trimmer, we will be interested in the all the messages "cut" by the trimmer:

Definition: For a j-dag trimmer $p$ we introduce the set of messages **p-messages**:

$$\{m \in M: m.creator \in dom(p) \land p(m.creator) \leqslant m\}$$

Observe that a function assigning to any honest validator its oldest 0-level message is a jdag trimmer. We will call it **the base trimmer** or just **base**.

![](/image/theory/base-trimmer-explained.png){.align-center width="100.0%"}

### Committee

Definition: Let $p$ be some j-dag trimmer.

-   By $weight(S)$ we mean the sum of weights of validators in $S$.
-   **Support of message m in context p** is a subset $R \subset S$ obtained by taking all validators $v \in S$ such that $\textit{panorama}_m(v) \in \textit{p-messages}$.
-   **1-level message in context p** is a p-message $m$ such that the weight of support of $m$ in context $p$ is at least $\textit{quorum}$.

Definition: **Committee in context p** is a j-dag trimmer $comm:S \to M$ such that:

-   $S \subset dom(p)$
-   every value $comm(v)$ is a 1-level message in context $p|_S$ (i.e. we restrict here $p$ to subdomain $S$
-   $\textit{weight}(S) \geqslant \textit{quorum}$

**Example:**

In the example below, all validators have equal weight 1, and $ftt=1$. We have the following 1-level committee here:

$$\{v_1 \to m_{23}, v_2 \to m_{19}, v_3 \to m_{24}, v_4 \to m_{21} \}$$

![](/image/theory/summit-1.png){.align-center width="100.0%"}

### Step 4: Find k-level summit

Definition: **k-level summit** is a sequence $(\textit{comm}_1, \textit{comm}_2, ..., \textit{comm}_k)$ such that:

-   $\textit{comm}_1$ is a committee in context of the base trimmer
-   $\textit{comm}_i$ is a committee in context $\textit{comm}_{i-1}$ for $i=2, ..., k$

In particular - a committee in context of the base trimmer is 1-level summit.

**Example:**

Below is an example of 4-level summit for 8 validators (all having equal weights 1) with $ftt=2$.

![](/image/theory/summit-2.png){.align-center width="100.0%"}

Similarly to summits, messages also have "acknowledgement levels". We will say **K-level message** for a message with acknowledgement level K. Acknowledgement level for a message is optional. We will use the term **plain-message** to reference messages that do not have acknowledgement level.

The border of a message signals the following information:

-   black border: plain message
-   red border: 0-level message
-   yellow border: $\textit{comm}_1-\textit{messages}$ that are not $\textit{comm}_1 \textit{values}$
-   green border: $\textit{comm}_2-\textit{messages}$ that are not $\textit{comm}_2 \textit{values}$
-   lime border: $\textit{comm}_3-\textit{messages}$ that are not $\textit{comm}_3 \textit{values}$
-   blue border: $\textit{comm}_4-\textit{messages}$ that are not $\textit{comm}_4 \textit{values}$
-   dashed border: this message has not arrived yet to validator 0; it is not part of j-dag as seen by validator 0

Looking at border colors, it is easy to find subsequent committees.

-   $\textit{comm}_1$ is formed by leftmost yellow messages
-   $\textit{comm}_2$ is formed by leftmost green messages
-   $\textit{comm}_3$ is formed by leftmost lime messages
-   $\textit{comm}_4$ is formed by leftmost blue messages

Leftmost red border messages form the base-trimmer.

Caution: search for "leftmost messages" separately for every swimlane.

## Reference implementation

In this section we sketch a "reference" implementation of Abstract Casper Consensus. We use Scala syntax for the code, but we limit ourselves to elementary language features (so it is readable for any developer familiar with contemporary programming languages).

Scala primer for non-scala developers:

```scala
//value declaration (= constant)
val localValidatorId: ValidatorId

//variable declaration (a value can be assigned to a variable many times)
val localValidatorId: ValidatorId

//method declaration
def containsPair(a: A, b: B): Boolean

//special type Unit contains only one value, so it is used to signal that a function returns nothing
//of interest
def addPair(a: A, b: B): Unit

//class declaration
class Person {
  var name: String
  var dateOfBirth: Date
}

//class with immutable values
case class Person(
    name: String,
    dateOfBirth: Date
)

//standalone object
object PersonsManager {
  val ageOfAdult: Int = 18
  def findPersonById(id: Int): Option[Person]
  def currentNumberOfPersons: Int
}

//interface declaration
trait Sizeable {
  def size: Int
  def isEmpty: Boolean
}

//this is a tuple
(1,"foo",true)

//this is convenience notation for 2-tuples; equivalent to (1, "foo")
1 -> "foo"

//a loop iterating over a collection of messages
for (m <- messages)
  println(message.id)

//nested imperative loop
for {
  v <- validators
  m <- messages(v)
} {
  println(m.id)
}

//for comprehension
for (i <- 0 until n;
    j <- 0 until n if i + j == v)
yield
 (i, j)

//a type of functions from ValidatorId to Message
type Foo = ValidatorId => Message

//a variable using functional type
var panorama: ValidatorId => Message

//cartesian product of types; means Int x String
type Prod = (Int,String)

//a function instance
val add: (Int,Int) => Int = ((x,y) => x+y)

//optional values
val a: Option[Int] = None
val b: Option[String] = Some("foo")

//pattern matching
x match {
  case None => println("1")
  case Some(p) => println(p)
}

//transforming a sequence by applying given function to every element
val coll: Seq[Int] = Seq(1,2,3,4,5)
val mapped1 = coll.map(n => n*n)
val mapped2 = coll map (n => n*n) //equivalent, but without a dot

//transforming a map by applying given function to every element
val coll: Map[Int,String] = Map(1->"this", 2->"is", 3->"example")
val mapped: Map[Int,Int] = coll map {case (k,v) => (k*k, v.length)}
```

### Common abstractions

We use the following type aliases:

```scala
type ValidatorId = Long
type MessageId = Hash
type Con = Int
type BinaryMessage = Array[Byte]
type Weight = Long
```

We are using the following abstraction of mutable 2-argument relation:

```scala
//Contract for a mutable 2-argument relation (= subset of the cartesian product AxB)
//We use this structure to represent messages buffer.
trait Relation[A,B] {
  def addPair(a: A, b: B): Unit
  def removePair(a: A, b: B): Unit
  def removeSource(a: A): Unit
  def removeTarget(b: B): Unit
  def containsPair(a: A, b: B): Boolean
  def findTargetsFor(source: A): Iterable[B]
  def findSourcesFor(target: B): Iterable[A]
  def hasSource(a: A): Boolean
  def hasTarget(b: B): Boolean
  def sources: Iterable[A]
  def targets: Iterable[B]
  def size: Int
  def isEmpty: Boolean
}
```

\... and directed acyclic graph:

```scala
//Abstraction of directed acyclic graph.
//We use this to represent the j-dag.
trait Dag[Vertex] {

  /**
   * Returns targets reachable (in one step) from given vertex by going along the arrows.
   * @param v vertex
   * @return collection of vertices
   */
  def targets(v: Vertex): Iterable[Vertex]

  /**
   * Returns sources reachable (in one step) from given vertex by going against the arrows.
   * @param v vertex
   * @return collection of vertices
   */
  def sources(v: Vertex): Iterable[Vertex]

  /**
   * Returns true if given vertex is a member of this DAG.
   * @param v vertex
   * @return true if this DAG contains vertex
   */
  def contains(v: Vertex): Boolean

  /**
   * List of nodes which are only sources, but not targets,
   * i.e. nodes with only outgoing arrows and no incoming arrows.
   * @return list of nodes which are only sources.
   */
  def tips: Iterable[Vertex]

  /**
   * Add a new node to the DAG.
   * Sources and targets of this node must be inferred (so we assume that this information is somehow encoded
   * inside the vertex itself).
   * @param v new vertex to be added; targets of v must be already present in the DAG
   * @return true if the vertex was actually added, false if the vertex was already present in the DAG
   */
  def insert(v: Vertex): Boolean

  /**
   * Traverses the DAG (breadth-first-search) along the arrows.
   * @param v vertex from which we start the traversal
   * @return iterator of vertices, sorted by dagLevel (descending)
   */
  def toposortTraverseFrom(v: Vertex): Iterator[Vertex]

  /**
   * Traverses the DAG (breadth-first-search) along the arrows.
   * @param coll collection of vertices from which we start the traversal
   * @return iterator of vertices, sorted by dagLevel (descending)
   */
  def toposortTraverseFrom(coll: Iterable[Vertex]): Iterator[Vertex]

}
```

We say nothing about hashing in use, we just assume that hashes can be seen as binary arrays:

```scala
trait Hash extends Ordered[Hash] {
  def bytes: Array[Byte]
}
```

### Messages

Message structure:

```scala
case class Message(
  id: MessageId,
  creator: ValidatorId,
  previous: Option[MessageId],
  justifications: Seq[MessageId],
  vote: Option[Con],
  dagLevel: Int
)
```

-   `id: MessageId` unique identifier - hash of other fields
-   `creator: Int` id of the validator that created this message
-   `previous: Option[MessageId]` distinguished justification that points to previous message published by creator
-   `justifications: Seq[MessageId]` collection of messages that the creator acknowledges as seen at the moment of creation of this message; this collection may possibly be empty; only message identifiers are kept here
-   `vote: Option[Con]` consensus value this message is voting for; the value is optional, because we allow empty votes
-   `daglevel: Int` height of this message in justifications DAG

Serialization of messages joins the logical layer and transport layer:

```scala
trait MessagesSerializer {

  //conversion binary message --> message
  //validates:
  //  (1) binary format of the message
  //  (2) message's hash
  //  (3) message's signature
  def decodeBinaryMessage(bm: BinaryMessage): (Message, EnvelopeValidationResult)

  //conversion message --> binary message
  def convertToBinaryRepresentationWithSignature(m: Message): BinaryMessage

}
```

### Network abstraction

Broadcasting messages:

```scala
trait GossipService {
  def broadcast(message: BinaryMessage)
}
```

Receiving messages:

```scala
trait GossipHandler {
  def handleMessageReceivedFromNetwork(message: BinaryMessage): HandlerResult
}
```

### Panoramas

We use panoramas to encode the "perspective on the j-dag as seen from given message".

```scala
//Represents a result of j-dag processing that is an intermediate result needed as an input to the estimator.
//We calculate the panorama associated with every message - this ends up being a data structure
//that is "parallel" to the local j-dag
case class Panorama(
                     honestSwimlanesTips: Map[ValidatorId,Message],
                     equivocators: Set[ValidatorId]
                   ) {

  def honestValidatorsWithNonEmptySwimlane: Iterable[ValidatorId] = honestSwimlanesTips.keys
}

object Panorama {
  val empty: Panorama = Panorama(honestSwimlanesTips = Map.empty, equivocators = Set.empty)

  def atomic(msg: Message): Panorama = Panorama(
    honestSwimlanesTips = Map(msg.creator -> msg),
    equivocators = Set.empty[ValidatorId]
  )
}
```

### Validator

The abstraction of the estimator:

```scala
trait Estimator {

  //calculates correct consensus value to be voted for, given the j-dag snapshot (represented as a panorama)
  def deriveConsensusValueFrom(panorama: Panorama): Option[Con]

  //convert panorama to votes
  //this involves traversing down every corresponding swimlane so to find latest non-empty vote
  def extractVotesFrom(panorama: Panorama): Map[ValidatorId, Con]

}
```

\... and finality detector (implementing the "summit theory" finality criterion):

```scala
trait FinalityDetector {
  def onLocalJDagUpdated(latestPanorama: Panorama): Option[Summit]
}
```

The implementation of a validator is complex so we split it into sections.

```scala
//A participant of Abstract Casper Consensus protocol
abstract class Validator extends GossipHandler {
}
```

**Validator configuration**

```scala
val localValidatorId: ValidatorId
val weightsOfValidators: Map[ValidatorId, Weight] //this map must be the same in every validator instance
val gossipService: GossipService
val serializer: MessagesSerializer
val preferredConsensusValue: Con
val relativeFTT: Double
val ackLevel: Int
```

-   `weightsOfValidators: Map[ValidatorId, Int]` - weights of validators
-   `finalizer: Finalizer` - finality detector
-   `gossipService: GossipService` - communication layer API used to broadcast messages

**Protocol state**

```scala
val messagesBuffer: Relation[Message, MessageId]
val jdagGraph: Dag[Message]
val messageIdToMessage: mutable.Map[MessageId, Message]
var globalPanorama: Panorama = Panorama.empty
val message2panorama: mutable.Map[Message,Panorama]
val estimator: Estimator = new ReferenceEstimator(messageIdToMessage, weightsOfValidators)
var myLastMessagePublished: Option[Message] = None
val finalityDetector: FinalityDetector = new ReferenceFinalityDetector(
  relativeFTT,
  ackLevel,
  weightsOfValidators,
  jdagGraph,
  messageIdToMessage,
  message2panorama,
  estimator)
```

-   `messagesBuffer: Relation[Message,MessageId]` - a buffer of messages received, but not incorporated into `jdag` yet; a pair $(m,j)$ in this relation represents buffered message $m$ waiting for not-yet-received message with id $j$
-   `jdagGraph` - representation of $jDag(M)$, where $M$ is the set of all messages known, such that their dependencies are fulfilled; in other words, before a message $m$ can be added to `jdag`, all justifications of $m$ must be already present in `jdag`
-   `jdagIdToMessage: mutable.Map[MessageId, Message]` - indexing of messages by id

**Handling of incoming messages**

```scala
def handleMessageReceivedFromNetwork(bm: BinaryMessage): HandlerResult = {
  val (message, validationResult) = serializer.decodeBinaryMessage(bm)
  if (validationResult == EnvelopeValidationResult.Error)
    return HandlerResult.InvalidMessage

  if (message.justifications.forall(id => messageIdToMessage.contains(id)))
    runBufferPruningCascadeFor(message)
  else {
    val missingDependencies = message.justifications.filter(j => ! messageIdToMessage.contains(j))
    for (j <- missingDependencies)
      messagesBuffer.addPair(message,j)
  }

  return HandlerResult.Accepted
}

def runBufferPruningCascadeFor(message: Message): Unit = {
  val queue = new mutable.Queue[Message]()
  queue enqueue message

  while (queue.nonEmpty) {
    val nextMsg = queue.dequeue()
    if (! messageIdToMessage.contains(nextMsg.id)) {
      if (isValid(nextMsg)) {
        addToLocalJdag(nextMsg)
        val waitingForThisOne = messagesBuffer.findSourcesFor(nextMsg.id)
        messagesBuffer.removeTarget(nextMsg.id)
        val unblockedMessages = waitingForThisOne.filterNot(b => messagesBuffer.hasSource(b))
        queue enqueueAll unblockedMessages
      } else {
        gotInvalidMessage(nextMsg)
        //nextMsg was already removed from messages buffer
        //any messages recursively depending on it will stay in the buffer
        //some form of "garbage collecting" too old messages that wait in the buffer for ages
        //is reasonable, but doing this properly is beyond the scope of the reference implementation
      }
    }
  }
}
```

**Publishing of new messages**

```scala
def publishNewMessage(): Unit = {
  val msg = createNewMessage()
  addToLocalJdag(msg)
  val bm = serializer.convertToBinaryRepresentationWithSignature(msg)
  gossipService.broadcast(bm)
  myLastMessagePublished = Some(msg)
}

def createNewMessage(): Message = {
  val creator: ValidatorId = localValidatorId
  val justifications: Seq[MessageId] = globalPanorama.honestSwimlanesTips.values.map(msg => msg.id).toSeq
  val dagLevel: Int =
    if (justifications.isEmpty)
      0
    else
      (justifications map (j => messageIdToMessage(j).dagLevel)).max + 1
  val consensusValue: Option[Con] =
    if (shouldCurrentVoteBeEmpty())
      None
    else
      estimator.deriveConsensusValueFrom(globalPanorama) match {
        case Some(c) => Some(c)
        case None => Some(preferredConsensusValue)
      }

  val msgWithBlankId = Message (
    id = placeholderHash,
    creator,
    previous = myLastMessagePublished map (m => m.id),
    justifications,
    consensusValue,
    dagLevel
  )

  return Message(
    id = generateMessageIdFor(msgWithBlankId),
    msgWithBlankId.creator,
    msgWithBlankId.previous,
    msgWithBlankId.justifications,
    msgWithBlankId.vote,
    msgWithBlankId.dagLevel
  )
}
```

**Abstract methods** - i.e. extension points (things outside of this protocol spec)

```scala
//decides whether current vote should be empty (as opposed to voting for whatever estimator tells)
def shouldCurrentVoteBeEmpty(): Boolean

//"empty" hash value needed for message hash calculation
def placeholderHash: Hash

//hashing of messages
def generateMessageIdFor(message: Message): Hash

//do whatever is needed after consensus (= summit) has been discovered
def consensusHasBeenReached(summit: Summit): Unit

//we received an invalid message; a policy for handling such situations can be plugged-in here
def gotInvalidMessage(message: Message): Unit
```

**Validation of incoming messages**

```scala
def isValid(message: Message): Boolean =
  validityConditionDaglevel(message) &&
  validityConditionDirectJustifications(message) &&
  validityConditionPrevious(message) &&
  validityConditionConsensusValue(message)

//daglevel must be correct
def validityConditionDaglevel(message: Message): Boolean = {
  val correctDaglevel: Int = (message.justifications map (j => messageIdToMessage(j).dagLevel)).max + 1
  return message.dagLevel == correctDaglevel
}

//direct justifications must not reference the same swimlane twice
//(while message.previous is considered one of justifications)
def validityConditionDirectJustifications(message: Message): Boolean = {
  val swimlanesUsed = message.justifications.map(j => messageIdToMessage(j).creator).toSet
  message.previous match {
    case None => //ok
    case Some(p) =>
      if (swimlanesUsed.contains(messageIdToMessage(p).creator))
        return false
  }

  return swimlanesUsed.size == message.justifications.size
}

//msg.previous must point to highest element of msg.creator swimlane earlier than msg itself
def validityConditionPrevious(message: Message): Boolean = {
  val effectiveJustifications: Seq[MessageId] =
    message.previous match {
      case None => message.justifications
      case Some(p) => message.justifications :+ p
    }
  val effectiveJustificationsAsMessages: Seq[Message] =
    effectiveJustifications map (id => messageIdToMessage(id))
  val toposortIteratorOfJPastCone = jdagGraph.toposortTraverseFrom(effectiveJustificationsAsMessages)

  return message.previous match {
    case None =>
      toposortIteratorOfJPastCone.find(m => m.creator == message.creator) match {
        case Some(x) => false
        case None => true
      }
    case Some(p) =>
      val declaredPreviousMessage: Message = messageIdToMessage(p)
      val actualPreviousMessage: Message = toposortIteratorOfJPastCone
        .filter(m => m.creator == message.creator).next()
      declaredPreviousMessage == actualPreviousMessage
  }
}

def validityConditionConsensusValue(message: Message): Boolean =
  message.vote match {
    case None => true
    case Some(consensusValueInMessage) =>
      estimator.deriveConsensusValueFrom(panoramaOf(message)) match {
        case Some(requiredConsensusValue) => consensusValueInMessage == requiredConsensusValue
        case None => true //estimator gave no constraint, so the creator of this message was allowed
                          //to pick any consensus value
      }
  }
```

**Updating of local j-dag**

```scala
def addToLocalJdag(msg: Message): Unit = {
  globalPanorama = mergePanoramas(globalPanorama, panoramaOf(msg))
  jdagGraph insert msg
  messageIdToMessage += msg.id -> msg

  finalityDetector.onLocalJDagUpdated(globalPanorama) match {
    case Some(summit) => consensusHasBeenReached(summit)
    case None => //no consensus yet, do nothing
  }
}
```

**Calculating panoramas**

```scala
/**
 * Calculates panorama of given msg.
 */
def panoramaOf(msg: Message): Panorama =
  message2panorama.get(msg) match {
    case Some(p) => p
    case None =>
      val result =
        msg.justifications.foldLeft(Panorama.empty){case (acc,j) =>
          val justificationMessage = messageIdToMessage(j)
          val tmp = mergePanoramas(panoramaOf(justificationMessage), Panorama.atomic(justificationMessage))
          mergePanoramas(acc, tmp)}
      message2panorama += (msg -> result)
      result
  }

//sums j-dags defined by two panoramas and represents the result as a panorama
//caution: this implementation relies on daglevels being correct
//so validation of daglevel must have happened before
def mergePanoramas(p1: Panorama, p2: Panorama): Panorama = {
  val mergedTips = new mutable.HashMap[ValidatorId,Message]
  val mergedEquivocators = new mutable.HashSet[ValidatorId]()
  mergedEquivocators ++= p1.equivocators
  mergedEquivocators ++= p2.equivocators

  for (validatorId <- p1.honestValidatorsWithNonEmptySwimlane ++ p2.honestValidatorsWithNonEmptySwimlane) {
    if (! mergedEquivocators.contains(validatorId)) {
      val msg1opt: Option[Message] = p1.honestSwimlanesTips.get(validatorId)
      val msg2opt: Option[Message] = p2.honestSwimlanesTips.get(validatorId)

      (msg1opt,msg2opt) match {
        case (None, None) => //do nothing
        case (None, Some(m)) => mergedTips += (validatorId -> m)
        case (Some(m), None) => mergedTips += (validatorId -> m)
        case (Some(m1), Some(m2)) =>
          if (m1 == m2)
            mergedTips += (validatorId -> m1)
          else if (m1.dagLevel == m2.dagLevel)
            mergedEquivocators += validatorId
          else {
            val higher: Message = if (m1.dagLevel > m2.dagLevel) m1 else m2
            val lower: Message = if (m1.dagLevel < m2.dagLevel) m1 else m2
            if (isEquivocation(higher, lower))
              mergedEquivocators += validatorId
            else
              mergedTips += (validatorId -> higher)
          }
      }
    }
  }

  return Panorama(mergedTips.toMap, mergedEquivocators.toSet)
}

//tests if given messages pair from the same swimlane is an equivocation
//caution: we assume that msg.previous and msg.daglevel are correct (= were validated before)
def isEquivocation(higher: Message, lower: Message): Boolean = {
  require(lower.creator == higher.creator)

  if (higher == lower)
    false
  else if (higher.dagLevel <= lower.dagLevel)
    true
  else if (higher.previous.isEmpty)
    true
  else
    isEquivocation(messageIdToMessage(higher.previous.get), lower)
}
```

### Estimator

```scala
//Reference implementation of the estimator described in theory chapter.
class ReferenceEstimator(
                          id2msg: MessageId => Message,
                          weight: ValidatorId => Weight
                        ) extends Estimator {

  def deriveConsensusValueFrom(panorama: Panorama): Option[Con] = {
    //panorama may be empty, which means "no votes yet"
    if (panorama.honestSwimlanesTips.isEmpty)
      return None

    val effectiveVotes: Map[ValidatorId, Con] = extractVotesFrom(panorama)
    //this may happen if all effective votes were empty (i.e. consensus value = None)
    if (effectiveVotes.isEmpty)
      return None

    //summing votes
    val accumulator = new mutable.HashMap[Con, Weight]
    for ((validator, c) <- effectiveVotes) {
      val oldValue: Weight = accumulator.getOrElse(c, 0L)
      val newValue: Weight = oldValue + weight(validator)
      accumulator += (c -> newValue)
    }

    //if weights are the same, we pick the bigger consensus value
    //tuples (w,c) are ordered lexicographically, so first weight of votes decides
    //if weights are the same, we pick the bigger consensus value
    //total ordering of consensus values is implicitly assumed here
    val (winnerConsensusValue, winnerTotalWeight) = accumulator maxBy { case (c, w) => (w, c) }
    return Some(winnerConsensusValue)
  }

  def extractVotesFrom(panorama: Panorama): Map[ValidatorId, Con] =
    panorama.honestSwimlanesTips
      .map { case (vid, msg) => (vid, effectiveVote(msg)) }
      .collect { case (vid, Some(vote)) => (vid, vote) }

  //finds latest non-empty vote as seen from given message by traversing "previous" chain
  @tailrec
  private def effectiveVote(message: Message): Option[Con] =
    message.vote match {
      case Some(c) => Some(c)
      case None =>
        message.previous match {
          case Some(m) => effectiveVote(id2msg(m))
          case None => None
        }
    }

}
```

### Finality detector

Representation of a j-dag trimmer:

```scala
/**
 * Represents a j-dag trimmer.
 */
case class Trimmer(entries: Map[ValidatorId,Message]) {
  def validators: Iterable[ValidatorId] = entries.keys
  def validatorsSet: Set[ValidatorId] = validators.toSet
}
```

Representation of a summit:

```scala
case class Summit(
                   relativeFtt: Double,
                   level: Int,
                   committees: Array[Trimmer]
                 )
```

Implementation of the "summit theory" finality criterion:

```scala
//Implementation of finality criterion based on summits theory.
class ReferenceFinalityDetector(
                                 relativeFTT: Double,
                                 ackLevel: Int,
                                 weightsOfValidators: Map[ValidatorId, Weight],
                                 jDag: Dag[Message],
                                 messageIdToMessage: MessageId => Message,
                                 message2panorama: Message => Panorama,
                                 estimator: Estimator
                               ) extends FinalityDetector {

  val totalWeight: Weight = weightsOfValidators.values.sum
  val absoluteFTT: Weight = math.ceil(relativeFTT * totalWeight).toLong
  val quorum: Weight = {
    val q: Double = (absoluteFTT.toDouble / (1 - math.pow(2, - ackLevel)) + totalWeight.toDouble) / 2
    math.ceil(q).toLong
  }

  override def onLocalJDagUpdated(latestPanorama: Panorama): Option[Summit] = {
    estimator.deriveConsensusValueFrom(latestPanorama) match {
      case None =>
        return None
      case Some(winnerConsensusValue) =>
        val validatorsVotingForThisValue: Iterable[ValidatorId] = estimator.extractVotesFrom(latestPanorama)
            .filter {case (validatorId,vote) => vote == winnerConsensusValue}
            .keys
        val baseTrimmer: Trimmer =
          findBaseTrimmer(winnerConsensusValue,validatorsVotingForThisValue, latestPanorama)

        if (sumOfWeights(baseTrimmer.validators) < quorum)
          return None
        else {
          val committeesFound: Array[Trimmer] = new Array[Trimmer](ackLevel + 1)
          committeesFound(0) = baseTrimmer
          for (k <- 1 to ackLevel) {
            val levelKCommittee: Option[Trimmer] =
              findCommittee(committeesFound(k-1), committeesFound(k-1).validatorsSet)
            if (levelKCommittee.isEmpty)
              return None
            else
              committeesFound(k) = levelKCommittee.get
          }

          return Some(Summit(relativeFTT, ackLevel, committeesFound))
        }
    }
  }

  private def findBaseTrimmer(
                                   consensusValue: Con,
                                   validatorsSubset: Iterable[ValidatorId],
                                   latestPanorama: Panorama): Trimmer = {
    val pairs: Iterable[(ValidatorId, Message)] =
      for {
        validator <- validatorsSubset
        swimlaneTip: Message = latestPanorama.honestSwimlanesTips(validator)
        oldestZeroLevelMessageOption: Option[Message] = swimlaneIterator(swimlaneTip)
          .filter(m => m.vote.isDefined)
          .takeWhile(m => m.vote.get == consensusValue)
          .toSeq
          .lastOption
        msg <- oldestZeroLevelMessageOption

    }
      yield (validator, msg)

    return Trimmer(pairs.toMap)
  }

  @tailrec
  private def findCommittee(
                             context: Trimmer,
                             candidatesConsidered: Set[ValidatorId]): Option[Trimmer] = {
    //pruning of candidates collection
    //we filter out validators that do not have a 1-level message in provided context
    val approximationOfResult: Map[ValidatorId, Message] =
      candidatesConsidered
        .map(validator => (validator, findLevel1Msg(validator, context, candidatesConsidered)))
        .collect {case (validator, Some(msg)) => (validator, msg)}
        .toMap

    val candidatesAfterPruning: Set[ValidatorId] = approximationOfResult.keys.toSet

    return if (sumOfWeights(candidatesAfterPruning) < quorum)
      None
    else
      if (candidatesAfterPruning forall (v => candidatesConsidered.contains(v)))
        Some(Trimmer(approximationOfResult))
      else
        findCommittee(context, candidatesAfterPruning)
  }

  private def swimlaneIterator(message: Message): Iterator[Message] =
    new Iterator[Message] {
      var nextElement: Option[Message] = Some(message)

      override def hasNext: Boolean = nextElement.isDefined

      override def next(): Message = {
        val result = nextElement.get
        nextElement = nextElement.get.previous map (m => messageIdToMessage(m))
        return result
      }
    }

  /**
   * In the swimlane of given validator we attempt finding lowest (= oldest) message that has support
   * at least q in given context.
   */
  private def findLevel1Msg(
                             validator: ValidatorId,
                             context: Trimmer,
                             candidatesConsidered: Set[ValidatorId]
                              ): Option[Message] =
    findNextLevelMsgRecursive(
      validator,
      context,
      candidatesConsidered,
      context.entries(validator))

  @tailrec
  private def findNextLevelMsgRecursive(
                                         validator: ValidatorId,
                                         context: Trimmer,
                                         candidatesConsidered: Set[ValidatorId],
                                         message: Message): Option[Message] = {

    val relevantSubPanorama: Map[ValidatorId, Message] =
      message2panorama(message).honestSwimlanesTips filter
        {case (v,msg) =>
          candidatesConsidered.contains(v) && msg.dagLevel >= context.entries(v).dagLevel
        }

    return if (sumOfWeights(relevantSubPanorama.keys) >= quorum)
      Some(message)
    else {
      val nextMessageInThisSwimlane: Option[Message] =
        jDag.sources(message).find(m => m.creator == validator)
      nextMessageInThisSwimlane match {
        case Some(m) => findNextLevelMsgRecursive(validator, context, candidatesConsidered, m)
        case None => None
      }
    }
  }

  private def sumOfWeights(validators: Iterable[ValidatorId]): Weight =
    validators.map(v => weightsOfValidators(v)).sum

}
```
