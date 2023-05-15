---
title: Understanding Hash Types
---

# Understanding Hash Types

For the sake of user convenience and compatibility, we expect the delivery of hashes and similar data in the form of a prefixed string when using the node. The following is a list of string representations used.

## Table of Associated Hash Types {#table-of-associated-hash-types}

|Type|Prefix|Example|
|---|---|---|
|PublicKey | | 018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c|
|AccountHash | account-hash- | account-hash-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|ContractHash | contract- | contract-0101010101010101010101010101010101010101010101010101010101010101|
|ContractPackageHash | contract-package- | contract-package-0101010101010101010101010101010101010101010101010101010101010101|
|Key::Account | account-hash-| account-hash-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|Key::Hash | hash- | hash-0101010101010101010101010101010101010101010101010101010101010101|
|Key::URef | uref- | uref-0101010101010101010101010101010101010101010101010101010101010101-001|
|Key::Transfer | transfer- | transfer-0101010101010101010101010101010101010101010101010101010101010101|
|Key::DeployInfo | deploy- | deploy-0101010101010101010101010101010101010101010101010101010101010101|
|Key::EraInfo | era- | era-1|
|Key::Balance | balance- | balance-0101010101010101010101010101010101010101010101010101010101010101|
|Key::Bid | bid- | bid-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|Key::Withdraw | withdraw- | withdraw-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|Key::Dictionary | dictionary- | dictionary-0101010101010101010101010101010101010101010101010101010101010101|
|Key::SystemContractRegistry | system-contract-registry- |system-contract-registry-00000000000000000000000000000000|
|Key::EraSummary | era-summary- |era-summary-00000000000000000000000000000000|

<!-- TODO Add Unbond and ChainspecRegistry after it is added to the live node branch
|Key::Unbond | unbond- | unbond-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|Key::ChainspecRegistry | chainspec-registry- | chainspec-registry-11111111111111111111111111111111|
-->

## Hash and Key Explanations {#hash-and-key-explanations}

`PublicKey` is a 32 byte asymmetric public key, preceded by a one-byte prefix that tells whether the key is `ed25519` or `secp256k1`.

`AccountHash` is a 32 byte hash of the `PublicKey` serving to identify user accounts.

`ContractHash` is the 32 byte hash of specific smart contract versions. You can use this to call specific contract versions.

`ContractPackageHash` is a 32 byte hash of the smart contract package. This hash directs you to the contract package. The function `call_versioned_contract` uses `ContractPackageHash` and allows you to call the latest version of the contract (by default). It also allows you to call any version stored previously to the package.

`Key` is a wrapper type that may contain one of several possible sets of data.
- `Key::Account` contains an AccountHash.
- `Key::Hash` contains a byte array with a length of 32, and as such can be used to pass any of the hashes. Please take note that the developer of the contract is responsible for implementation of any checks necessary on the receiving side.
- `Key::URef` contains an URef suffixed by access rights.
- `Key::Transfer` should contain the address hash for a transfer.
- `Key::DeployInfo` retains the address hash of deploy information.
- `Key::EraInfo` is the integer number of the associated era.
- `Key::Balance` is the balance of a purse.
- `Key::Bid` is used to keep track of bids for the auction contract. It is not generally used by users.
- `Key::Withdraw` is used to keep track of withdraws for the auction contract. It is not generally used by users and exists in a historical context.
- `Key::Dictionary` is the hash derived from a URef and a piece of arbitrary data and leads to a dictionary.
- `Key::SystemContractRegistry` is a unique `Key` under which a mapping of the names and ContractHashes for system contracts, including `Mint`, `Auction`, `HandlePayment` and `StandardPayment`, is stored.
- `Key::EraSummary` is a `Key` under which we store current era info.

<!-- TODO Add Unbond and ChainspecRegistry after it is added to the live node branch
- `Key::Unbond` is a variant of the key type that tracks unbonding purses.
- `Key::ChainspecRegistry` is a unique `Key` which contains a mapping of file names to the hash of the file itself. These files include *Chainspec.toml* and may also include *Accounts.toml* and *GlobalState.toml*.
-->