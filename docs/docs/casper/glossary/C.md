# C

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Cargo

Cargo is Rust's build system and package manager. This tool manages Rust projects, such as building code and downloading dependencies.

## Casper network

The Casper network is a Proof-of-Stake blockchain that allows validators to stake the Casper native token CSPR on the network. Validators receive CSPR as an incentive for continuing to maintain and secure the network. CSPR rewards are distributed as blocks are validated into existence and organized into eras.

## CBC

Correct by construction. CBC Casper is a family of consensus algorithms developed by Vlad Zamfir.

## Chainspec

A collection of configuration settings describing the state of the system at genesis and upgrades to basic system functionality (including system contracts and gas costs) occurring after [genesis](G.md#genesis).

## Consensus

An algorithm used to mandate agreement on the [blockchain](B.md#blockchain) between all nodes. The blockchain, although being built in a decentralized way, eventually converges so that all nodes eventually agree on whether a given block is part of the chain or not.

Casper uses the [Highway](https://docs.casperlabs.io/en/latest/theory/highway.md) algorithm in the _CBC Casper_ family of consensus algorithms. The algorithm for securing an agreement is what is known as _consensus_. The consensus layer contains the algorithm, but the algorithm should not be confused with the consensus layer.

## Contract runtime

Enables developers to use a seamless workflow for authoring and testing their [smart contracts](S.md#smart-contract). This environment can also be used for continuous integration, enabling Rust smart contracts to be managed using development best practices.

## Crate

A compilation unit in Rust. A crate can be compiled into a binary or into a library. By default, _rustc_, the compiler for the Rust programming language, will produce a binary from a crate.

## CSPR

CSPR is the Casper token pre-defined on the Casper network and used to pay for transaction execution and for [staking](S.md#staking) (securing the network). The total number of CSPR tokens is 10 billion.
