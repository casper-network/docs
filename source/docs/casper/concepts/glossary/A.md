# A

---

[A](./A.md) [B](./B.md) [C](./C.md) [D](./D.md) [E](./E.md) [F](./F.md) [G](./G.md) [H](./H.md) [I](./I.md) [J](./J.md) [K](./K.md) [L](./L.md) [M](./M.md) [N](./N.md) [O](./O.md) [P](./P.md) [Q](./Q.md) [R](./R.md) [S](./S.md) [T](./T.md) [U](./U.md) [V](./V.md) [W](./W.md) [X](./X.md) [Y](./Y.md) [Z](./Z.md)

---

## Account {#account}

An Account is a structure that represents a user on a Casper network. Information on creating an account can be found [here](../design/casper-design.md#accounts-head).

## Account Hash {#account-hash}

The account hash is a 32-byte hash of the public key representing the user account. Information on generating an account hash can be found [here](https://support.casperlabs.io/hc/en-gb/articles/13781616975131-How-do-I-generate-an-account-hash-).

## AssemblyScript {#assemblyscript}

AssemblyScript is a TypeScript-based programming language (JavaScript with static types) that is optimized for WebAssembly and compiled to WebAssembly using _asc_, the reference AssemblyScript compiler. It is developed by the AssemblyScript Project and the AssemblyScript community.

## Auction {#auction}

The auction determines the composition of the validator set for each era of the protocol. It is a "first-price" auction (where winning bids become stakes) with a fixed number of spots chosen to balance security with performance. Because rewards are proportional to the stake, it is expected that this competitive mechanism will provide a powerful impetus for staking as many tokens as possible.

## Auction contract {#auction-contract}

The auction contract acts as a front-end user interface to the auction by directly accepting bids from validators and delegators. It also contains the logic necessary for carrying out the auction.

## Auction delay {#auction-delay}

The number of full eras that pass between the [booking block](./B.md#booking-block) and the era whose validator set it defines. The auction delay is configurable and can be several eras long.
