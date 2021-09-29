# B

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Block {#block}

Used in two contexts:

1.  A data structure containing a collection of transactions. Blocks form the primary structure of the blockchain.
2.  A message that is exchanged between nodes containing the data structure as explained in (1).

Each block has a globally unique ID, achieved by hashing the contents of the block.

Each block points to its parent. An exception is the first block, which has no parent.

## Block creation {#block-creation}

Block creation means computing the deployment results and collecting the results that belong together into a block. We follow a process called _execution after consensus_.

The [block proposal](B.md#block-proposal) happens first, and the proposed [proto block](P.md#proto-block) contains a set of deploys that have not been executed yet.

Only after consensus on a _proto block_ has been reached, the deploys are executed. The resulting new global state [root hash](R.md#root-hash) is put into an actual block, together with the executed deploys.

Note that only validators can create valid blocks.

## Block finality {#block-finality}

A block is "finalized" if the validators agree on adding it to the blockchain.

There are different levels of _finality_ in the [Highway](H.md#highway) protocol. A finalized block has a fault-tolerance _F_, expressed as a fraction of the total stake. For an observer to see a conflicting block as finalized, several validators whose total stake exceeds _F_ would have to collude and show different information in a way that would ultimately be detected and punished (see [slashing](S.md#slashing)).

## Block gossiping {#block-gossiping}

Block gossiping occurs when a message containing a block is sent to one or more nodes on the network. In other words, block gossiping is sending a block validated by the current node but created by another node. The terms _block gossiping_ and [block passing](#block-passing) are interchangeable.

## Block passing {#block-passing}

See [block gossiping](#block-gossiping).

## Block processing {#block-processing}

Block processing consists of running the deploys in a block received from another node to determine updates to the global state. Note that this is an essential part of [validating blocks](#block-validation).

## Block proposal {#block-proposal}

Sending a (newly) created block to the other nodes on the network for potential inclusion in the blockchain. Note that this term applies to NEW blocks only.

## Block validation {#block-validation}

The process of determining the validity of a block obtained from another node on the network.

## Blockchain {#blockchain}

Blockchain is a P2P network where the collection of nodes ([validators](V.md#validator)) concurrently updates a decentralized, shared database. They do this collectively, building an ever-growing chain of [transactions](T.md#transaction). For performance reasons, transactions are bundled in [blocks](#block). According to a particular cooperation protocol (consensus protocol), the collection of [nodes](N.md#node) connected via a P2P network cooperate to maintain this shared database as a single source of truth. The database's current state is called the [global state](G.md#global-state) and has a sizeable map-like collection.

## Block store {#block-store}

The layer of the node software responsible for storing blocks. This layer is persisted and can be used to allow a node to recover its state after a crash.

## Bond {#bond}

The amount of money (in crypto-currency) that is allocated by a node in order to participate in [consensus](C.md#consensus) (and to be a [validator](V.md#validator)).

## Bonding {#bonding}

Depositing money in the [auction contract](A.md#auction-contract) and try to become a [staker](S.md#staker). The bonding request is a transaction that transfers tokens to the auction contract. In the next [booking block](#booking-block), a new set of validators is determined, with weights according to their deposits. This new set becomes active in the era(s) using that booking block.

## Booking block {#booking-block}

The booking block for an era is the block that determines the era's validator set. In it, the [auction contract](A.md#auction-contract) selects the highest bidders to be the future era's validators. There is a configurable delay, the _auction_delay_, which is the number of eras between the booking block and the era to which it applies. The booking block is always a switch block, so the booking block for era _N + auction_delay + 1_ is the last block of era _N_.
