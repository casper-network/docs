# V

---

[A](A.md) [B](B.md) [C](C.md) [D](D.md) [E](E.md) [F](F.md) [G](G.md) [H](H.md) [I](I.md) [J](J.md) [K](K.md) [L](L.md) [M](M.md) [N](N.md) [O](O.md) [P](P.md) [Q](Q.md) [R](R.md) [S](S.md) [T](T.md) [U](U.md) [V](V.md) [W](W.md) [X](X.md) [Y](Y.md) [Z](Z.md)

---

## Validator {#validator}

Validators are responsible for maintaining platform security by building an ever-growing chain of finalized blocks, backing this chain's security with their stakes. Their importance (often referred to as "weight") both to protocol operation and security is, in fact, equal to their stake, which includes both their own and delegated tokens.

The responsibilities of a validator include:

-   [block creation](B.md#block-creation) and [block proposal](B.md#block-proposal)
-   [block validation](B.md#block-validation)
-   [block gossiping](B.md#block-gossiping)

Validators are bonded because they are responsible for progressing the system's state as clients use it (e.g., sending deploys). Validators and [stakers](S.md#staker) can lose their bond (be slashed) for not following the protocol correctly. Validators are also paid for by creating blocks (also by validating blocks -- though this is only indirectly; validators cannot be paid for if they do not validate by design), giving them more incentive to serve the network correctly.
