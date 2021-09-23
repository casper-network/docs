# S

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Secret key {#secret-key}

A cryptographic and confidential key that signs transactions to ensure their correct execution (carrying out only the user's intended operations).

## Seigniorage {#seigniorage}

The reward mechanism by which validators are rewarded for participating in consensus. New tokens are minted and given to validators.

## Session code {#session-code}

The _session code_ is a field contained in a deployment directive. The _session code_ contains the code the user wishes to execute against the blockchain. When the session code executes, it performs a transaction.

## Slashing {#slashing}

In Proof-of-Stake, the deposit acts as collateral. The validator guarantees that it correctly follows the protocol. If the validator node violates the protocol, the deposited amount gets _slashed_, i.e., a part of it is removed.

## Smart contract {#smart-contract}

A WebAssembly (WASM) program that the network stores as a value in the global state. The execution of a smart contract causes changes to the global state. A smart contract can be invoked by a transaction or by another smart contract. Smart contracts can declare input data as the arguments of a function. When invoking a smart contract, one must provide the input values.

## Staker {#staker}

A person that deposits tokens in the [proof-of-stake](P.md#proof-of-stake) contract. A staker is either a [validator](V.md#validator) or a [delegator](D.md#delegator). Stakers take on the slashing risk in exchange for rewards. Stakers will deposit their [tokens](T.md#token) by sending a bonding request in the form of a transaction (deployment) to the system. If a validator is [slashed](#slashing), the staker will lose their tokens.

## Staking {#staking}

A feature of Proof-of-Stake protocols that allows token holders to actively participate in the protocol, thus securing the network. The [Staking Guide](https://docs.casperlabs.io/en/latest/staking/index.md) highlights the steps required to stake the CSPR token on the Casper network.
