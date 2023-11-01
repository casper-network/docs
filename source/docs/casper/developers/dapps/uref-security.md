---
title: URef Access Rights
---

# URef Access Rights and Security Considerations

## Understanding Access Rights

An [Unforgeable Reference](/design/casper-design/#uref-head) or **URef** is a key type used for storage on a Casper network. They can store any value other than `Account` and exist as a top-level entity. As such, no individual account may *own* a URef, they can only hold the necessary `AccessRights` to interact with a given URef.

[`AccessRights`](/concepts/serialization-standard/#clvalue-uref) determine how an entity on a Casper network may interact with a URef. They appear as a single byte suffix after the concatenation of te URef's address. As an example, the following is an example of a URef with no associated access rights:

```bash
uref-974019c976b5f26412ce486158d2431967af35d91387dae8cbcd43c20fce6452-000
```

And this is the same URef with `READ` and `ADD` access rights.

```bash
uref-974019c976b5f26412ce486158d2431967af35d91387dae8cbcd43c20fce6452-005
```

The following table outlines all possible `AccessRights` settings:

| Access Rights    | Serialization |
| ---------------- | ------------- |
| `NONE`           |  0            |
| `READ`           |  1            |
| `WRITE`          |  2            |
| `READ_WRITE`     |  3            |
| `ADD`            |  4            |
| `READ_ADD`       |  5            |
| `ADD_WRITE`      |  6            |
| `READ_ADD_WRITE` |  7            |

:::warning

Any access rights granted alongside a passed URef are ***irrevocable***.

:::


## AccessRights and Purses

A `Purse` is a unique type of `URef` representing a token balance. Each `Account` will have an associated URef that represents its main purse. Accounts and contracts may have additional purses.

For URefs that represent a purse, access rights determine the ability to read or change the associated balance of tokens. The following table outlines what each operation allows in the context of a purse:

| Global State | Action Monetary Action                           |
| ------------ | ------------------------------------------------ |
| Add          | Deposit (i.e. transfer to)                       |
| Write        | Withdraw (i.e. transfer from)                    |
| Read         | Balance check                                    |

## Security Considerations for dApp Developers

When developing a [dApp](/developers/dapps/dapp/) that interacts with tokens in any way, it will be necessary to work with various URef `AccessRights` for associated purse URefs.

[This tutorial outlines our recommendations when transferring tokens to a contract.](/resources/tutorials/advanced/transfer-token-to-contract/)

When passing a URef to another entity in any way, ensure that you are only passing the URef with the appropriate `AccessRights`. The following example code shows the syntax for creating a URef with any given access rights combination. In this example, only the `new_uref` should be passed to another entity.

```js
// This example will create a version of the original URef with access rights stripped entirely.
let new_uref = uref.with_access_rights(AccessRights::NONE);
// This example will create a version of the original URef with only READ access rights.
let new_uref = uref.with_access_rights(AccessRights::READ);
// This example will create a version of the original URef with only WRITE access rights.
let new_uref = uref.with_access_rights(AccessRights::WRITE);
// This example will create a version of the original URef with both READ and WRITE access rights.
let new_uref = uref.with_access_rights(AccessRights::READ_WRITE);
// This example will create a version of the original URef with only ADD access rights.
let new_uref = uref.with_access_rights(AccessRights::ADD);
// This example will create a version of the original URef with both READ and ADD access rights.
let new_uref = uref.with_access_rights(AccessRights::READ_ADD);
// This example will create a version of the original URef with both ADD and WRITE access rights.
let new_uref = uref.with_access_rights(AccessRights::ADD_WRITE);
// This example will create a version of the original URef with full access rights.
let new_uref = uref.with_access_rights(AccessRights::READ_ADD_WRITE);
```