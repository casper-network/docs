# C

---

[A](./A.md) [B](./B.md) [C](./C.md) [D](./D.md) [E](./E.md) [F](./F.md) [G](./G.md) [H](./H.md) [I](./I.md) [J](./J.md) [K](./K.md) [L](./L.md) [M](./M.md) [N](./N.md) [O](./O.md) [P](./P.md) [Q](./Q.md) [R](./R.md) [S](./S.md) [T](./T.md) [U](./U.md) [V](./V.md) [W](./W.md) [X](./X.md) [Y](./Y.md) [Z](./Z.md)

---

## Cargo {#cargo}

Cargo is Rust's build system and package manager. This tool manages Rust projects, such as building code and downloading dependencies.

## Casper network {#casper-network}

Casper is a Proof-of-Stake blockchain platform with an account-based model that performs execution after consensus. More information on the design of a Casper network can be found [here](../design/casper-design.md).

## CBC {#cbc}

Correct-by-construction (CBC) protocols are consensus protocols meeting the following properties:

-   All the nodes share the same proof of asynchronous liveness, which means that the protocol will continue to produce blocks at some interval.
-   The consensus has mathematically provable safety, which means that once a block is committed, it cannot be reverted.

## Chainspec {#chainspec}

A collection of configuration settings describing the state of the system at genesis and upgrades to basic system functionality (including system contracts and gas costs) occurring after [genesis](./G.md#genesis). Here is an example [chainspec](https://github.com/casper-network/casper-node/blob/release-1.5.2/resources/production/chainspec.toml), which will change with newer releases.

## Consensus {#consensus}

An algorithm used to mandate agreement on the [blockchain](./B.md#blockchain) between all nodes. The blockchain, although being built in a decentralized way, eventually converges so that all nodes eventually agree on whether a given block is part of the chain or not.

Casper uses the Highway algorithm in the _CBC Casper_ family of consensus algorithms. The algorithm for securing an agreement is what is known as _consensus_. The consensus layer contains the algorithm, but the algorithm should not be confused with the consensus layer.

## Contract runtime {#contract-runtime}

Enables developers to use a seamless workflow for authoring and testing their [smart contracts](./S.md#smart-contract). This environment can also be used for continuous integration, enabling Rust smart contracts to be managed using development best practices.

## Correct by construction {#correct-by-construction}

See [CBC](./C.md#cbc).

## Crate {#crate}

A compilation unit in Rust. A crate can be compiled into a binary or into a library. By default, _rustc_, the compiler for the Rust programming language, will produce a binary from a crate.

## CSPR {#cspr}

CSPR is the Casper token pre-defined on the Casper Mainnet and used to pay for transaction execution and for [staking](./S.md#staking) (securing the network).
