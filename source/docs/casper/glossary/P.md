# P

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Partial synchrony {#partial-synchrony}

Partial synchrony is used to define the fault tolerance of a consensus protocol, which is a time-bound mechanism to note suspicions or problems (failure, crashes, etc.). When a protocol is provably live under partial synchrony, it means that the nodes will make a decision within a fixed time period. Once the decision is made and a block is committed, it cannot be reverted. Also, see [CBC](C.md#cbc).

## Participate in consensus {#participate-in-consensus}

The process of following the [consensus](C.md#consensus) algorithm. The primary participants are [validators](V.md#validator), bonded with their stake and part of the validator set for that particular era. [Delegators](D.md#delegator) participate indirectly by delegating their tokens to one or more of these validators and contributing by increasing the total stake that ensures the security of the network.

## Payment code {#payment-code}

The _payment code_ is the [Wasm](W.md#webassembly) program that pays the transaction execution fee.

## Peer node {#peer-node}

A node on a peer-to-peer (P2P) network.

## Permissionless

A permissionless blockchain network has its consensus and transaction validation process open and available for anyone to participate. Being permissionless is an essential characteristic of most public blockchains, enabling decentralization, transparency, and value exchange between participants.

## Primary token {#primary-token}

See [CSPR](C.md#cspr).

## Private key {#private-key}

See [secret key](S.md#secret-key).

## Proof-of-Stake {#proof-of-stake}

Proof-of-Stake (PoS) is a mechanism by which a cryptocurrency blockchain network achieves permissionless-ness. The voting power in consensus is proportional to the number of staked tokens (digital currency specific to this system). The validator vouches with their tokens for the correct operation of their node. A popular choice in such systems is to periodically (once per era, in our case) delegate a fixed size committee of participants, which then is responsible for running the consensus on which blocks to add to the blockchain.

## Proof-of-Work {#proof-of-work}

A mechanism used in Bitcoin and Etherium for incentivizing participation and securing the system. In these protocols, a participant's voting power is proportional to the amount of computational power possessed.

## Proof-of-Stake contract {#proof-of-stake-contract}

The Proof-of-Stake (PoS) contract holds on to transaction fees for the time while the state transition is happening (contracts are being executed). The PoS contract remits the transaction fees to the block proposer.

## Proposer {#proposer}
The proposer is a selected validator by a Casper Network to propose the next block. A validator becomes a proposer by proposing a block to be added to the chain and receiving the appropriate reward. The proposing process assures that new blocks will be added to the blockchain.

## Proto block {#proto-block}

The block proposed by the leader, which the consensus processes (in [highway](H.md#highway)). Only after consensus is complete, the proto block is executed, and the global state is updated.

A leader is selected from the validator set of that era for each round. The chance of getting selected as a leader is in proportion to the stake one has in that era.

