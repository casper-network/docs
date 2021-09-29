# D

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## dApp {#dapp}

A distributed application (dApp) is a set of [smart contracts](S.md#smart-contract).

## Delegation rate {#delegation-rate}

Node operators ([validators](V.md#validator)) define a commission that they take in exchange for providing staking services. This commission is represented as a percentage of the rewards that the node operator retains for their services.

## Delegator {#delegator}

Delegators are users who participate in the platform's security by delegating their tokens to validators (which adds to their weight) and collecting a part of the rewards proportional to their delegations, net of a cut ("delegation rate") that is collected by the validator.

## Deploy {#deploy}

Deploys are state-changing instructions issued by a smart contract. The instructions are encrypted and include transferring tokens from one wallet to another, rewarding node validation, or adding smart contracts on the blockchain.

All deploys on the Casper Network can be broadly categorized as some unit of work that, when executed and committed, affects change to the [global state](G.md#global-state).

Review the [deploy data structure](https://docs.casperlabs.io/en/latest/implementation/serialization-standard.html?highlight=deploy#deploy) and the [deploy implementation](https://github.com/casper-network/casper-node/blob/master/node/src/types/deploy.rs#L475) for more details.
