# E

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Ecosystem {#ecosystem}

The ecosystem layer in Casper encompasses dApp design and operation.

## Entry point {#entry-point}

See [EntryPoint](/dapp-dev-guide/sdkspec/types_chain/#entrypoint) and [Defining the Contract Entry Points](/dapp-dev-guide/writing-contracts/rust/#step-4-defining-the-contract-entry-points).

## Era {#era}

A period of time during which the validator set does not change.

In the Casper Network, validators cannot join and leave at any point in time, but only at era boundaries. An era's validators are determined using an [auction](A.md#auction). At the beginning of the era, the validators create a new instance of the Highway protocol and run this consensus protocol until they finalize the era's last block (see [booking block](B.md#booking-block)).

## Eviction {#eviction}

Validators that fail to participate in [era](E.md#era) will have their bid deactivated by the protocol, suspending their participation until they signal readiness to resume participation by invoking a method in the [auction contract](A.md#auction-contract).

## External client {#external-client}

Any hardware/software connecting to a Node for the purpose of sending deploys or querying the state of the blockchain.
