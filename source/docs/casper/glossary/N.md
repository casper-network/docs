# N

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## NamedKeys {#named-keys}

[NamedKeys](https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html)
are a collection of String-Key pairs used to easily identify some data on the network.

- The [String](https://doc.rust-lang.org/nightly/alloc/string/struct.String.html) is the name given to identify the data
- The [Key](https://docs.rs/casper-types/latest/casper_types/enum.Key.html) is the data to be referenced


## Node {#node}

A Casper node is a physical or virtual device that is participating in a Casper network. They store, validate, and preserve the blockchain data.

You will encounter different types of nodes on the network:

-   **Bonded node**: a node that has tokens staked as bond and is part of the validator set participating in consensus in that particular era.
-   **Unbonded node**: a type of node on the network that receives and processes blocks but does not create blocks and is not a validator. It is otherwise a fully functioning node, following the consensus protocol to know the current status of the blockchain (and therefore also the VM state). Such nodes are useful for querying the status of the blockchain (e.g., to learn information about transaction finalization).

## Node operator {#node-operator}

See [operator](O.md#operator).

## Non-Fungible Token (NFT) {#non-fungible-token}
Cryptographic assets on a blockchain with unique identification codes and metadata that distinguish them from each other. They cannot be traded or exchanged at equivalency. This differs from fungible tokens like cryptocurrencies, which are identical to each other and, therefore, can be used as a medium for commercial transactions.
