# U

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Unbonding

Withdrawing money from the [auction](A.md#auction) contract with _withdraw bid_ and possibly ceasing to be a validator. The unbonding request is a transaction that informs the auction contract that the sender wants to decrease their deposit. In the next booking block, only the decreased deposit is considered when determining a future validator set. If it has been decreased to 0, the sender will not be included in the validator set anymore. However, the amount only gets transferred to the sender after the unbonding period. If during that period their node exhibits a fault, the unbonded amount can still be slashed.

## Users

Users execute session and contract code using the platform's computational resources.
