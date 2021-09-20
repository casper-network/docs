# G

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Gas

Gas is the virtual currency for calculating the cost of transaction execution. The transaction cost is expressed as a given amount of gas consumed and can be seen intuitively as some cycles of the virtual processor that has to be used to run the computation defined as the transaction's code.

## Genesis

The state of the virtual machine at the beginning of the blockchain.

## Global state

When thinking of a [blockchain](B.md#blockchain) as a decentralized computer, the global state is its memory state.

When thinking of a [blockchain](B.md#blockchain) as a shared database, the global state is the snapshot of the database's data.

Technically, a [global state](G.md#global-state) is a (possibly extensive) collection of key-value pairs, where the keys are references (Refs), and the values are large binary objects (BLOBs).

For every [block](B.md#block) B in the [blockchain](B.md#blockchain), one can compute the [global state](G.md#global-state) achieved by executing all [transactions](T.md#transaction) in this block and its ancestors. The [root hash](R.md#root-hash) identifying this state is stored in every executed block.
