# S

---

[A](./A.md) [B](./B.md) [C](./C.md) [D](./D.md) [E](./E.md) [F](./F.md) [G](./G.md) [H](./H.md) [I](./I.md) [J](./J.md) [K](./K.md) [L](./L.md) [M](./M.md) [N](./N.md) [O](./O.md) [P](./P.md) [Q](./Q.md) [R](./R.md) [S](./S.md) [T](./T.md) [U](./U.md) [V](./V.md) [W](./W.md) [X](./X.md) [Y](./Y.md) [Z](./Z.md)

---

## Safe {#safe}

When a protocol is provably safe, it means that all the participating nodes will make the same decision and continue to produce blocks at some interval. Also, see [CBC](./C.md#cbc).

## Secret key {#secret-key}

A cryptographic and confidential key that signs transactions to ensure their correct execution (carrying out only the user's intended operations).

## Seigniorage {#seigniorage}

The reward mechanism by which validators are rewarded for participating in consensus. New tokens are minted and given to validators.

## Session code {#session-code}

_Session code_ is Wasm executed in the context of an account through sending a [Deploy](./D.md#deploy). The _session code_ contains code the user wishes to execute against the blockchain. When the session code executes, it performs changes to global state.

## Slashing {#slashing}

In Proof-of-Stake, the deposit acts as collateral. The validator guarantees that it correctly follows the protocol. If the validator node violates the protocol, the deposited amount gets _slashed_, i.e., a part of it is removed.

## Smart contract {#smart-contract}

Smart contracts are self-executing computer programs that perform specific actions based on pre-programmed terms stored on the blockchain. Once the pre-programmed terms are met, the smart contract executes the action and eliminates the need for a centralized third party.

On a Casper network, a smart contract is a WebAssembly (Wasm) program that the network stores as a value in the [global state](./G.md#global-state). The execution of a smart contract causes changes to the global state.

A smart contract can be invoked by a transaction or by another smart contract. Smart contracts can declare input data as the arguments of a function. When invoking a smart contract, one must provide the input values.

## Smart-contract platform {#smart-contract-platform}

A smart contract platform provides the required blockchain environment for the creation, deployment, and execution of smart contracts.

## Staker {#staker}

A person that deposits tokens in the [proof-of-stake](./P.md#proof-of-stake) contract. A staker is either a [validator](./V.md#validator) or a [delegator](./D.md#delegator). Stakers take on the slashing risk in exchange for rewards. Stakers will deposit their [tokens](./T.md#token) by sending a bonding request in the form of a transaction (deployment) to the system. If a validator is [slashed](#slashing), the staker will lose their tokens.

## Staking {#staking}

A feature of Proof-of-Stake protocols that allows token holders to actively participate in the protocol, thus securing the network. The [Staking Guide](../economics/staking/staking.md) highlights the steps required to stake CSPR tokens on the Casper Mainnet.

## State root hash {#state-root-hash}

The state root hash is an identifier of the network's [global state](./G.md#global-state) at a moment in time. The state root hash changes with each block executed, containing deploys. Normally, empty blocks do not modify global state. But, if the empty block is the last one in an era, it will also change the state root hash due to changes introduced by the auction contract calculating the validators for future eras.

## Stateful {#stateful}

Stateful execution depends on a previous state, which makes the output differ each time. Such executions are performed with the context of previous executions and the current execution may be affected by what happened during previous executions.

## Stateless {#stateless}

Stateless means that the execution doesn't depend on a previous state, so the output of the execution is the same each time. It does not save or reference information about previous executions. Each execution is from scratch as if for the first time.

## Switch Block {#switch-block}

A `Switch Block` is the final block in an era, which contains the `era_summary`. See also [booking block](./B.md#booking-block).
