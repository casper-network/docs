# Understanding Hash Types

For the sake of user convenience and compatibility, we expect the delivery of hashes and similar data in the form of a prefixed string when using the node. The following is a list of string representations used.

## Table of Associated Hash Types {#table-of-associated-hash-types}

|Type|Prefix|Example|
|---|---|---|
|PublicKey | | 018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c|
|AccountHash | account-hash- | account-hash-ef4687f74d465826239bab05c4e1bdd2223dd8c201b96f361f775125e624ef70|
|ContractHash | contract- | contract-0101010101010101010101010101010101010101010101010101010101010101|
|ContractPackageHash | contract-package-wasm | contract-package-wasm0101010101010101010101010101010101010101010101010101010101010101|
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

## Hash and Key Explanations {#hash-and-key-explanations}

`PublicKey` is a 32 byte asymmetric public key, preceded by a one-byte prefix that tells whether the key is `ed25519` or `secp256k1`.

`AccountHash` is a 32 byte hash of the `PublicKey`. It serves as the address for user accounts.

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
- `Key::Withdraw` is used to keep track of withdraws for the auction contract. It is not generally used by users.
- `Key::Dictionary` is the hash derived from a URef and a piece of arbitrary data and leads to a dictionary.