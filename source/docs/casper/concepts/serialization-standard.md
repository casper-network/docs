# Serialization Standard {#serialization-standard-head}

We provide a custom implementation to serialize data structures used by the Casper node to their byte representation. This document details how this custom serialization is implemented, allowing developers to build a library that implements the custom serialization.

In your smart contracts, you can implement serialization using `cltype-any`.

## Account {#serialization-standard-account}

An Account is a structure that represents a user on a Casper network. The account structure consists of the following fields:

-   [`account_hash`](#account-hash)

-   [`named_keys`](#namedkey)

-   `main_purse` The account's main purse `URef`. You may find information on `URef` serialization [here](#clvalue-uref).

-   [`associated_keys`](#associated-keys)

-   [`action_thresholds`](#action-thresholds)

## Account Hash {#account-hash}

A `blake2b` hash of the public key, representing the address of a user's account. The account hash serializes as a 32-byte buffer containing the bytes of the account hash.

## Account Identifier {#account-identifier}

Identifier for possible ways to retrieve an Account. It can consist of any of the following in most situations:

- [`PublicKey`](#publickey) The account's public key.

- [`AccountHash`](#account-hash) The `blake2b` hash of the account's public key.

## Action Thresholds {#action-thresholds}

The minimum weight thresholds that have to be met when executing an action of a certain type. It serializes as three consecutive [`u8` values](#clvalue-numeric) as follows.

-   `deployment` The minimum weight threshold required to perform deployment actions as a `u8` value.

-   `upgrade_management` The minimum weight threshold required to perform upgrade management actions as a `u8` value.

-   `key_management` The minimum weight threshold required to perform key management actions as a `u8` value.

## Activation Point {#activation-point}

The first era to which the associated protocol version applies. It serializes as a single [`u8`](#clvalue-numeric) tag indicating if the era in question is genesis. If it is the genesis era, the following bytes will be a `timestamp`. If not, the bytes represent an `era_id`.

-   `era_id` An [Era ID newtype](#eraid) identifying the era when the protocol version will activate.

-   `timestamp` A [timestamp](#timestamp) if the activation point is of the Genesis variant.

## AddressableEntity {#addressable-entity}

An Addressable Entity is a structure that represents an entity on a Casper network. The addressable entity consists of the following fields:

- [`package_hash`](#package-hash)

- [`byte_code_hash`](#byte-code-hash)

- [`entry_points`](#entrypoints)

- [`protocol_version`](#protocolversion)

- `main_purse` The entity's main purse `URef`. You may find information on `URef` serialization [here](#clvalue-uref).

- [`associated_keys`](#associatedkey)

- [`action_thresholds`](#action-thresholds)

- [`message_topics`](#message-topics)

- [`entity_kind`](#entity-kind)

## AddressableEntityHash

The hex-encoded address of an addressable entity, which serializes as the byte representation of itself.

## Approval {#approval}

A struct containing a signature and the public key of the signer.

-   `signature` The approval signature, which serializes as the byte representation of the [`Signature`](#signature). The first byte within the signature is 1 in the case of an `Ed25519` signature or 2 in the case of `Secp256k1`.

-   `signer` The public key of the approvals signer. It serializes to the byte representation of the [`PublicKey`](#clvalue-publickey). If the `PublicKey` is an `Ed25519` key, then the first byte within the serialized buffer is 1 followed by the bytes of the key itself; else, in the case of `Secp256k1`, the first byte is 2.

## AssociatedKey {#associatedkey}

A key granted limited permissions to an Account, for purposes such as multisig. It is serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of keys and weights held within. The remainder consists of a repeating pattern of serialized named keys and then weights of the length dictated by the first four bytes.

-   `account_hash` The [account hash](#account-hash) of the associated key.

-   `weight` The weight of an associated key. The weight serializes as a [`u8` value](#clvalue-numeric).

## AvailableBlockRange {#availableblockrange}

An unbroken, inclusive range of blocks. It serializes as two consecutive [`u64` values](#clvalue-numeric) containing the following two fields:

-   `low` The inclusive lower bound of the range.

-   `high` - The inclusive upper bound of the range.

## Bid {#bid}

An entry in the validator map. The structure consists of the following fields:

-   `validator_public_key` The validator's public key. It serializes as a [`PublicKey`](#clvalue-publickey).

-   `bonding_purse` The purse used for bonding. It serializes as a [`Uref`](#clvalue-uref).

-   `staked_amount` The amount of tokens staked by a validator (not including delegators). It serializes as a [`U512` value](#clvalue-numeric).

-   `delegation_rate` The delegation rate of the bid. It serializes as an `i32` signed 32-bit integer primitive.

-   `vesting_schedule` The vesting schedule for a genesis validator. `None` if it is a non-genesis validator. It serializes as an [`Option`](#clvalue-option).

-   `delegators` The validator's delegators, indexed by their public keys. They are serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of `PublicKey`s and delegators held within. The remainder consists of a repeating pattern of serialized `PublicKey`s and then delegators of the length dictated by the first four bytes.

-   `inactive` If the validator has been evicted. A [boolean](#clvalue-boolean) value that serializes as a single byte; `true` maps to `1`, while `false` maps to `0`.

## BidKind {#bid-kind}

Auction bid variants. It serializes as a single [`u8` value](#clvalue-numeric) indicating the type of bid kind as per the following table:

| BidKind   | u8 | Description |
| --------- | -- | ----------- |
| [Unified](#bid)   | 0  | Legacy data that contains all delegators for a given validator. |
| [Validator](#validatorbid) | 1  | A bid record containing only validator data. |
| [Delegator](#delegatorbid) | 2  | A bid record containing only delegator data. |

## Block {#serialization-standard-block}

A block is the core component of the Casper linear blockchain, used in two contexts:

1.  A data structure containing a collection of transactions. Blocks form the primary structure of the blockchain.
2.  A message that is exchanged between nodes containing the data structure as explained in (1).

Each block has a globally unique ID, achieved by hashing the contents of the block.

Each block points to its parent. An exception is the first block, which has no parent.

A block is structurally defined as follows:

-   `hash`: A hash over the header of the block.
-   `header`: The header of the block that contains information about the contents of the block with additional metadata.
-   `body`: The block's body contains the proposer of the block and hashes of deploys and transfers contained within it.

Further, a block may consist of one of the following types:

- `Version1` A legacy block created prior to the Condor upgrade.

- `Version2` A modern block.

### Block hash {#block-hash}

The block hash is a `Digest` over the contents of the block Header. The `BlockHash` serializes as the byte representation of the hash itself.

### Block Header {#block-header}

The header portion of a block, structurally, is defined as follows:

-   `parent_hash`: is the hash of the parent block. It serializes to the byte representation of the parent hash. The serialized buffer of the `parent_hash` is 32 bytes long.
-   `state_root_hash`: is the global state root hash produced by executing this block's body. It serializes to the byte representation of the `state root hash`. The serialized buffer of the `state_root_hash` is 32 bytes long.
-   `body_hash`: the hash of the block body. It serializes to the byte representation of the body hash. The serialized buffer of the `body_hash` is 32 bytes long.
-   `random_bit`: is a boolean needed for initializing a future era. It is serialized as a single byte; true maps to 1, while false maps to 0.
-   `accumulated_seed`: A seed needed for initializing a future era. It serializes to the byte representation of the parent Hash. The serialized buffer of the `accumulated_hash` is 32 bytes long.
-   `era_end`: contains equivocation and reward information to be included in the terminal finalized block. It is an optional field. Thus if the field is set as `None`, it serializes to _0_. The serialization of the other case is described in the EraEnd.
-   `timestamp`: The timestamp from when the block was proposed. It serializes as a single `u64` value. The serialization of a `u64` value is described in the CLValues section.
-   `era_id`: Era ID in which this block was created. It serializes as a single `u64` value.
-   `height`: The height of this block, i.e., the number of ancestors. It serializes as a single `u64` value.
-   `protocol_version`: The version of the Casper network when this block was proposed. It is 3-element tuple containing `u32` values. It serializes as a buffer containing the three `u32` serialized values. Refer to the CLValues section on how `u32` values are serialized.

Both `BlockHeaderV1` and `BlockHeaderV2` serialize in the same way.

### EraEndV1 {#eraendV1}

`EraEndV1` as represented within the block header, is a struct containing two fields.

-   `era_report`: The first field is termed as `EraReport` and contains information about equivocators and rewards for an era.
-   `next_era_validator_weights`: The second field is map for the validators and their weights for the era to follow.

`EraReport` itself contains two fields:

-   `equivocators`: A vector of `PublicKey`.
-   `rewards`: A Binary Tree Map of `PublicKey` and `u64`.

When serializing an EraReport, the buffer is first filled with the individual serialization of the PublicKey contained within the vector.

-   If the `PublicKey` is an `Ed25519` key, the first byte within the buffer is a `1` followed by the individual bytes of the serialized key.
-   If the `PublicKey` is an `Secp256k1` key, the first byte within the buffer is a `2` followed by the individual bytes of the serialized key.

When serializing the overarching struct of `EraEndV1`, we first allocate a buffer, which contains the serialized representation of the `EraReport` as described above, followed by the serialized BTreeMap.

Note that `EraEndV1` is an optional field. Thus the above scheme only applies if there is an `EraEndV1`; if there is no era end, the field simply serializes to _0_.

### EraEndV2 {#eraendV2}

`EraEndV1` as represented within the block header, is a struct containing four fields.

- `equivocators` A vector of `PublicKey` listing equivocators for the era.
- `inactive_validators` A list of inactive validators for the era.
- `next_era_validator_weights` A map of validators and their weights for the era to follow.
- `rewards` A Binary Tree Map of `PublicKey` and `u64`.

Note that `EraEndV2` is an optional field. Thus the above scheme only applies if there is an `EraEndV2`; if there is no era end, the field simply serializes to _0_.

### BlockBodyV1 {#blockbodyv1}

The body portion of a block, prior to the Condor upgrade, is structurally defined as:

-   `proposer`: The PublicKey which proposed this block.
-   `deploy_hashes`: Is a vector of hex-encoded hashes identifying Deploys included in this block.
-   `transfer_hashes`: Is a vector of hex-encoded hashes identifying Transfers included in this block.

When we serialize the `BlockBodyV1`, we create a buffer that contains the serialized representations of the individual fields present within the block.

-   `proposer`: serializes to the byte representation of the `PublicKey`. If the `PublicKey` is an `Ed25519` key, then the first byte within the serialized buffer is 1 followed by the bytes of the key itself; else, in the case of `Secp256k1`, the first byte is 2.
-   `deploy_hashes`: serializes to the byte representation of all the deploy_hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
-   `transfer_hashes`: serializes to the byte representation of all the deploy_hashes within the block header. Its length is `32 * n`, where n denotes the number of transfers present within the body.

### BlockBodyV2 {#blockbodyv2}

A modern block is structurally defined as:

- [`proposer`](#publickey) The public key of the proposing node.

- [`mint`](#transaction-hash) A vector of hashes of the mint transactions within the block.

- [`auction`](#transaction-hash) A vector of hashes of the auction transactions within the block.

- [`install_upgrade`](#transaction-hash) A vector of the hashes of the installer/upgrader transactions within the block.

- [`standard`](#transaction-hash) A vector of hashes of all other transactions within the block.

- [`rewarded_signatures`](#rewarded-signatures) A list of identifiers for finality signatures for a particular past block.

When we serialize the `BlockBodyV2`, we create a buffer that contains the serialized representations of the individual fields present within the block.

- `proposer`: serializes to the byte representation of the `PublicKey` of the proposer.
- `mint`: serializes as the byte representation of all the mint transaction hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
- `auction`: serializes as the byte representation of all the auction transaction hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
- `install_upgrade`: serializes as the byte representation of all the installer/upgrader transaction hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
- `standard`: serializes as the byte representation of all other transaction hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
- `rewarded_signatures` serializes as a vector of `SingleBlockRewardedSignatures` which describes signatures for a single ancestor block. The first entry represents the signatures for the parent block, the second for the parent of the parent, and so on.

## BlockIdentifier {#blockidentifier}

Identifier for possible ways to retrieve a Block. It can consist of any of the following in most situations:

-   [`hash`](#block-hash) Identify and retrieve a Block with its hash. The `BlockHash` serializes as the byte representation of the hash itself.

-   `height` Identify and retrieve the Block with its height. Height serializes as a single `u64` value.

-   `state_root_hash` Identify and retrieve the Block with its state root hash. It serializes to the byte representation of the `state root hash`. The serialized buffer of the `state_root_hash` is 32 bytes long.

## BlockSyncStatus {#blocksyncstatus}

The status of syncing an individual block. It serializes as the byte representation of the [block hash](#block-hash) of the block in question, followed by an [`option`](#option-clvalue-option) representing a [`u64`](#numeric-clvalue-numeric) of the block height and the remainder is the byte representation of the `acquisition_state` as a [string](#string-clvalue-string).

## BlockTime (#blocktime)

The block time serialized as a single `u64` value.

## ByteCode {#bytecode}

A container for a contract's Wasm bytes. It serializes as the single `u8` [BidKind](#bidkind), followed by a [`u32`](#numeric-clvalue-numeric) value describing the size of the remaining [Bytes](#bytes) and then the bytes as described.

## Bytes {#bytes}

Hex-encoded bytes serialized as a `u32` value describing the length of the bytes, followed by the bytes themselves.

## ByteCodeKind

The type of byte code, serialized as a single `u8` value. A `0` indicates empty byte code, while a `1` indicates a `V1CasperWasm` to be executed with the first version of the Casper execution engine.

## ChainspecRegistry {#chainspecregistry}

ChainspecRegistry is a unique key variant which contains a mapping of file names to the hash of the file itself. This map includes *Chainspec.toml* and may include *Accounts.toml* and *GlobalState.toml*. It is serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of names as strings and [digests](#digest) held within. The remainder consists of a repeating pattern of serialized strings and then digests of the length dictated by the first four bytes. Digests and their inclusion criteria are as follows:

-   `chainspec_raw_hash` will always be included.

-   `genesis_accounts_raw_hash` may be included in specific circumstances.

-   `global_state_raw_hash` may be included in specific circumstances.

## Contract {#contract}

 A contract struct containing the following fields:

 -  [`contract_package_hash`](#contractpackagehash)

 -  [`contract_wasm_hash`](#contractwasmhash)

 -  [`named_keys`](#namedkey)

 -  [`entry_points`](#entrypoint)

 -  [`protocol_version`](#protocolversion)

## ContractHash {#contracthash}

A `blake2b` hash of a contract. The contract hash serializes as a 32-byte buffer containing the bytes of the contract hash.

## ContractPackageHash {#contractpackagehash}

A `blake2b` hash of a contract package. The contract package hash serializes as a 32-byte buffer containing the bytes of the contract package hash.

## ContractPackageStatus {#contractpackagestatus}

The lock status of the contract package, serialized as a [`boolean`](#boolean-clvalue-boolean) where `true` indicates a locked contract and `false` indicates an unlocked contract package.

## ContractVersion {#contractversion}

The version of the contract.

-   [`contract_hash`](#contracthash) The contract hash of the contract.

-   `contract_version` The version of the contract within the protocol major version. It serializes as a [`u32` value](#clvalue-numeric).

-   `protocol_version_major` The major element of the protocol version this contract is compatible with. It serializes as a [`u32` value](#clvalue-numeric).

## ContractVersionKey {#contractversionkey}

The major element of `ProtocolVersion` combined with `Contract` Version serialized as two [`u32`](#numeric-clvalue-numeric) values.

## ContractWasmHash {#contractwasmhash}

A `blake2b` hash of a contract's Wasm. The contract's Wasm hash serializes as a 32-byte buffer containing the bytes of the contract's Wasm hash.

## Delegator {#delegator}

Represents a party delegating their stake to a validator (or "delegatee"). The structure consists of the following fields:

-   `delegator_public_key` The public key of the delegator, serialized as a [`PublicKey`](#clvalue-publickey).

-   `staked_amount` The amount staked by the delegator, serialized as a [`U512` value](#clvalue-numeric).

-   `bonding_purse` The bonding purse associated with the delegation. It serializes as a [`URef` value](#clvalue-uref).

-   `validator_public_key` The public key of the validator that the delegator will be delegating to, serialized as a [`PublicKey`](#clvalue-publickey).

-   `vesting_schedule` The vesting schedule for the provided delegator bid. `None` if it is a non-genesis validator. It serializes as an [`Option`](#clvalue-option).

## Deploy {#serialization-standard-deploy}

A deploy is a data structure containing a smart contract and the requester's signature(s). Additionally, the deploy header contains additional metadata about the deploy itself. A deploy is structurally defined as follows:

-   `hash`: The hash of the deploy header.
-   `header`: Contains metadata about the deploy. The structure of the header is detailed further in this document.
-   `payment`: The payment code for contained smart contract.
-   `session`: The stored contract itself.
-   `approvals`: A list of signatures.

### Deploy-Hash {#deploy-hash}

The deploy hash is a digest over the contents of the deploy header. The deploy hash serializes as the byte representation of the hash itself.

### Deploy-Header {#deploy-header}

-   `account`: A supported public key variant (currently either `Ed25519` or `Secp256k1`). An `Ed25519` key is serialized as a buffer of bytes, with the leading byte being `1` for `Ed25519`, with remainder of the buffer containing the byte representation of the signature. Correspondingly, a `Secp256k1` key is serialized as a buffer of bytes, with the leading byte being `2`.
-   `timestamp`: A timestamp is a struct that is a unary tuple containing a `u64` value. This value is a count of the milliseconds since the UNIX epoch. Thus the value `1603994401469` serializes as `0xbd3a847575010000`
-   `ttl`: The **Time to live** is defined as the amount of time for which deploy is considered valid. The `ttl` serializes in the same manner as the timestamp.
-   `gas_price`: The gas is `u64` value which is serialized as `u64` CLValue discussed below.
-   `body_hash`: Body hash is a hash over the contents of the deploy body, which includes the payment, session, and approval fields. Its serialization is the byte representation of the hash itself.
-   `dependencies`: Dependencies is a vector of deploy hashes referencing deploys that must execute before the current deploy can be executed. It serializes as a buffer containing the individual serialization of each DeployHash within the Vector.
-   `chain_name`: Chain name is a human-readable string describing the name of the chain as detailed in the chainspec. It is serialized as a String CLValue described below.

### Payment & Session {#payment--session}

Payment and Session are both defined as `ExecutableDeployItems`. More information on `ExecutableDeployItems` can be found [here](../developers/writing-onchain-code/calling-contracts.md)

-   Module Bytes are serialized such that the first byte within the serialized buffer is `0` with the rest of the buffer containing the bytes present.

    -   `ModuleBytes { module_bytes: "[72 bytes]", args: 434705a38470ec2b008bb693426f47f330802f3bd63588ee275e943407649d3bab1898897ab0400d7fa09fe02ab7b7e8ea443d28069ca557e206916515a7e21d15e5be5eb46235f5 }` will serialize to
    -   `0x0048000000420481b0d5a665c8a7678398103d4333c684461a71e9ee2a13f6e859fb6cd419ed5f8876fc6c3e12dce4385acc777edf42dcf8d8d844bf6a704e5b2446750559911a4a328d649ddd48000000434705a38470ec2b008bb693426f47f330802f3bd63588ee275e943407649d3bab1898897ab0400d7fa09fe02ab7b7e8ea443d28069ca557e206916515a7e21d15e5be5eb46235f5`

-   StoredContractByHash serializes such that the first byte within the serialized buffer is 1u8. This is followed by the byte representation of the remaining fields.

    -   `StoredContractByHash { hash: c4c411864f7b717c27839e56f6f1ebe5da3f35ec0043f437324325d65a22afa4, entry_point: "pclphXwfYmCmdITj8hnh", args: d8b59728274edd2334ea328b3292ed15eaf9134f9a00dce31a87d9050570fb0267a4002c85f3a8384d2502733b2e46f44981df85fed5e4854200bbca313e3bca8d888a84a76a1c5b1b3d236a12401a2999d3cad003c9b9d98c92ab1850 }`
    -   `0x01c4c411864f7b717c27839e56f6f1ebe5da3f35ec0043f437324325d65a22afa41400000070636c7068587766596d436d6449546a38686e685d000000d8b59728274edd2334ea328b3292ed15eaf9134f9a00dce31a87d9050570fb0267a4002c85f3a8384d2502733b2e46f44981df85fed5e4854200bbca313e3bca8d888a84a76a1c5b1b3d236a12401a2999d3cad003c9b9d98c92ab1850`

-   StoredContractByName serializes such that the first byte within the serialized buffer is 2u8. This is followed by the individual byte representation of the remaining fields.

    -   `StoredContractByName { name: "U5A74bSZH8abT8HqVaK9", entry_point: "gIetSxltnRDvMhWdxTqQ", args: 07beadc3da884faa17454a }`
    -   `0x0214000000553541373462535a483861625438487156614b39140000006749657453786c746e5244764d685764785471510b00000007beadc3da884faa17454a`

-   StoredVersionedContractByHash serializes such that the first byte within the serialized buffer is 3u8. However, the field version within the enum serializes as an [Option](#option-clvalue-option) CLValue.

    -   `StoredVersionedContractByHash { hash: b348fdd0d0b3f66468687df93141b5924f6bb957d5893c08b60d5a78d0b9a423, version: None, entry_point: "PsLz5c7JsqT8BK8ll0kF", args: 3d0d7f193f70740386cb78b383e2e30c4f976cf3fa834bafbda4ed9dbfeb52ce1777817e8ed8868cfac6462b7cd31028aa5a7a60066db35371a2f8 }`
    -   `0x03b348fdd0d0b3f66468687df93141b5924f6bb957d5893c08b60d5a78d0b9a423001400000050734c7a3563374a73715438424b386c6c306b463b0000003d0d7f193f70740386cb78b383e2e30c4f976cf3fa834bafbda4ed9dbfeb52ce1777817e8ed8868cfac6462b7cd31028aa5a7a60066db35371a2f8`

-   StoredVersionedContractByName serializes such that the first byte within the serialized buffer is 4u8. The name and entry_point are serialized as a [String](#string-clvalue-string) CLValue, with the version field serializing as an [Option](#option-clvalue-option).

    -   `StoredVersionedContractByName { name: "lWJWKdZUEudSakJzw1tn", version: Some(1632552656), entry_point: "S1cXRT3E1jyFlWBAIVQ8", args: 9975e6957ea6b07176c7d8471478fb28df9f02a61689ef58234b1a3cffaebf9f303e3ef60ae0d8 }`
    -   `0x04140000006c574a574b645a5545756453616b4a7a7731746e01d0c64e61140000005331635852543345316a79466c57424149565138270000009975e6957ea6b07176c7d8471478fb28df9f02a61689ef58234b1a3cffaebf9f303e3ef60ae0d8`

-   Transfer serializes such that the first byte within the serialized buffer contains is 5u8, with the remaining bytes of the buffer containing the bytes contained within the args field of Transfer.

### Approval {#approval}

Approval contains two fields:

-   `signer`: The public key of the approvals signer. It serializes to the byte representation of the `PublicKey`. If the `PublicKey` is an `Ed25519` key, then the first byte within the serialized buffer is 1 followed by the bytes of the key itself; else, in the case of `Secp256k1`, the first byte is 2.
-   `signature`: The approval signature, which serializes as the byte representation of the `Signature`. The first byte within the signature is 1 in the case of an `Ed25519` signature or 2 in the case of `Secp256k1`.

## DeployInfo {#deployinfo}

Information relating to a given deploy. The structure consists of the following fields:

-   `deploy_hash` The hash of the relevant deploy, serialized as a byte representation of the hash itself.

-   `transfers` Transfers performed by the deploy, serialized as a [`List`](#clvalue-list).

-   `from` The account identifier of the creator of the deploy, serialized as an [`account_hash`](#account-hash).

-   `source` The source purse used for payment of the deploy, serialized as a [`URef`](#clvalue-uref).

-   `gas` The gas cost of executing the deploy, serialized as a [`U512`](#clvalue-numeric).

## Digest {#digest}

A `blake2b` hash digest. The digest serializes as a byte representation of the hash itself.

## DisabledVersions {#disabledversions}

Disabled contract versions, containing the following:

-   `contract_version` The version of the contract within the protocol major version. It serializes as a [`u32` value](#clvalue-numeric).

-   `protocol_version_major` The major element of the protocol version this contract is compatible with. It serializes as a [`u32` value](#clvalue-numeric).

## Effects {#effects}

A log of all transforms produced during execution, serialized as a vector of [transforms](#transformv2).

## EntityVersionKey {#entityversionkey}

The major element of `ProtocolVersion` combined with `EntityVersion` serialized as two [`u32`](#numeric-clvalue-numeric) values.

## EntryPoint {#entrypoint}

A type of signature method. Order of arguments matters, since this can be referenced by index as well as name.

-   `name` The name of the entry point, serialized as a [`String`](#clvalue-string).

-   `args` Arguments for this method. They serialize as a list of the [`Parameter`](#parameter)s, where each parameter represents an argument passed to the entrypoint.

-   `ret` The return type of the method, serialized as a [`Unit`](#clvalue-unit).

-   `access` An enum describing the possible access control options for a contract entry point. It serializes as a 1 for public or a 1 followed by a [`List`](#clvalue-list) of authorized users.

-   `entry_point_type` Identifies the type of entry point. It serializes as a `0` for Session and a `1` for Contract.

## EntryPoints {#entrypoint}

Entry points for a given entity, serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of `String` to `EntryPoint`s held within. The remainder consists of a repeating pattern of serialized `String`s and then `EntryPoint`s of the length dictated by the first four bytes.

## EraID {#eraid}

An Era ID newtype. It serializes as a single [`u64` value](#clvalue-numeric).

## EraInfo {#erainfo}

Auction metadata, intended to be recorded each era. It serializes as a [`List`](#clvalue-list) of [seigniorage allocations](#seigniorageallocation).

## ExecutionEffect {#executioneffect}

The journal of execution transforms from a single deploy.

-   `operations` The resulting operations, serialized as a [`List`](#clvalue-list) of [operations](#operation).

-   `transforms` The actual [transformation](#transform) performed while executing a deploy.

## ExecutionResultV1 {#executionresultv1}

The result of a single deploy. It serializes as a `u8` tag indicating either `Failure` as a 0 or `Success` as a 1. This is followed by the appropriate structure below:

### `Failure`

The result of a failed execution.

-   `effect` The [effect](#executioneffect) of executing the deploy.

-   `transfers` A record of transfers performed while executing the deploy, serialized as a [`List`](#clvalue-list).

-   `cost` The cost of executing the deploy, serializes as a [`U512`](#clvalue-numeric) value.

-   `error_message` The error message associated with executing the deploy, serialized as a [`String`](#clvalue-string).

### `Success`

The result of a successful execution.

-   `effect` The [effect](#executioneffect) of executing the deploy.

-   `transfers` A record of transfers performed while executing the deploy, serialized as a [`List`](#clvalue-list).

-   `cost` The cost of executing the deploy, serializes as a [`U512`](#clvalue-numeric) value.

## ExecutionResultV2 {#executionresultv2}

The result of a single deploy. It serializes as a `u8` tag indicating either `Failure` as a 0 or `Success` as a 1. This is followed by the appropriate structure below:

### `Failure`

The result of a failed execution.

-   `effects` The [effect](effects) of executing the deploy.

-   `transfers` A record of transfers performed while executing the deploy, serialized as a [`List`](#clvalue-list).

-   `cost` The cost of executing the deploy, serializes as a [`U512`](#clvalue-numeric) value.

-   `error_message` The error message associated with executing the deploy, serialized as a [`String`](#clvalue-string).

### `Success`

The result of a successful execution.

-   `effects` The [effects](#effects) of executing the deploy.

-   `transfers` A record of transfers performed while executing the deploy, serialized as a [`List`](#clvalue-list).

-   `cost` The cost of executing the deploy, serializes as a [`U512`](#clvalue-numeric) value.

## Group {#group}

A (labeled) "user group". Each method of a versioned contract may be associated with one or more user groups which are allowed to call it. User groups are serialized as a [String](#clvalue-string).

## Groups {#groups}

They are serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of user groups and `BTreeSets` of [`URef`](#clvalue-uref)s held within. The remainder consists of a repeating pattern of serialized user groups and `BTreeSets` of the length dictated by the first four bytes.

## InitiatorAddr (#initiatoraddr)

The address of the initiator of a [`TransactionV1`](#transactionv1), which serializes as a `u8` of `0` followed by a [`PublicKey`](#publickey-publickey) or a `1` followed by an [`AccountHash`](#account-hash).

## Keys {#serialization-standard-state-keys}

A _key_ in [Global State](./design/casper-design.md#global-state-head) is one of the following data types:

-   32-byte account identifier (called an "account identity key")
-   32-byte immutable contract identifier (called a "hash key")
-   32-byte reference identifier (called an "unforgeable reference")
-   32-byte transfer identifier
-   32-byte deploy information identifier
-   32-byte purse balance identifier
-   32-byte Auction bid identifier
-   32-byte Auction withdrawal identifier
-   32-byte Dictionary identifier
-   32-byte System Contract Registry
-   32-byte Auction unbond identifier
-   32-byte Chainspec Registry

The one exception to note here is the identifier for [`EraInfo`](#erainfo), which actually serializes as a [`u64`](#clvalue-numeric) value with an additional byte for the tag.

### Account identity key {#global-state-account-key}

This key type is used specifically for accounts in the global state. All accounts in the system must be stored under an account identity key, and no other types. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./design/casper-design.md#accounts-associated-keys-weights) for more information).

### Hash key {#serialization-standard-hash-key}

This key type is used for storing contracts immutably. Once a contract is written under a hash key, that contract can never change. The 32-byte identifier representing this key is derived from the `blake2b256` hash of the deploy hash (see [block-structure-head](./design/casper-design.md#block-structure-head) for more information) concatenated with a 4-byte sequential ID. The ID begins at zero for each deploy and increments by one each time a contract is stored. The purpose of this ID is to allow each contract stored in the same deploy to have a unique key.

### Unforgeable Reference (`URef`) {#serialization-standard-uref}

`URef` broadly speaking can be used to store values and manage permissions to interact with the value stored under the `URef`. `URef` is a tuple which contains the address under which the values are stored and the Access rights to the `URef`. Refer to the [Unforgeable Reference](./design/casper-design.md#uref-head) section for details on how `URefs` are managed.

### Transfer Key {#serialization-standard-transfer-key}

This key type is used specifically for transfers in the global state. All transfers in the system must be stored under a transfer key and no other type. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the transfer address associated with the given transfer

### DeployInfo Key {#serialization-standard-deploy-info-key}

This key type is used specifically for storing information related to deploys in the global state. Information for a given deploy is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the deploy itself.

### EraInfo Key {#serialization-standard-era-info-key}

This key type is used specifically for storing information related to the `Auction` metadata for a particular era. The underlying data type stored under this is a vector of the allocation of seigniorage for that given era. The identifier for this key is a new type that wraps around the primitive `u64` data type and co-relates to the era number when the auction information was stored.

This key type is used specifically for storing information related to auction bids in the global state. Information for the bids is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./design/casper-design.md#accounts-associated-keys-weights) for more information).

This key type is used specifically for storing information related to auction withdraws in the global state. Information for the withdrawals is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./design/casper-design.md#accounts-associated-keys-weights) for more information).

### Serialization for `Key` {#serialization-standard-serialization-key}

Given the different variants for the over-arching `Key` data-type, each of the different variants is serialized differently. This section of this chapter details how the individual variants are serialized. The leading byte of the serialized buffer acts as a tag indicating the serialized variant.

| `Key`        | Serialization Tag |
| ------------ | ----------------- |
| `Account`    |  0               |
| `Hash`       |  1               |
| `URef`       |  2               |
| `Transfer`   |  3               |
| `DeployInfo` |  4               |
| `EraInfo`    |  5               |
| `Balance`    |  6               |
| `Bid`        |  7               |
| `Withdraw`   |  8               |
| `Dictionary` |  9               |
| `SystemContractRegistry`| 10    |
| `EraSummary` | 11               |
| `Unbond`     | 12               |
| `ChainspecRegistry` | 13        |
| `ChecksumRegistry` | 14         |
| `BidAddr`    | 15               |

| `Package`    | 16               |
| `AddressableEntity` | 17        |
| `ByteCode`   | 18               |
| `Message`    | 19               |

-   `Account` serializes as a 32 byte long buffer containing the byte representation of the underlying `AccountHash`
-   `Hash` serializes as a 32 byte long buffer containing the byte representation of the underlying `Hash` itself.
-   `URef` is a tuple that contains the address of the URef and the access rights to that `URef`. The serialized representation of the `URef` is 33 bytes long. The first 32 bytes are the byte representation of the `URef` address, and the last byte contains the bits corresponding to the access rights of the `URef`. Refer to the [CLValue](#serialization-standard-values) section of this chapter for details on how `AccessRights` are serialized.
-   `Transfer` serializes as a 32 byte long buffer containing the byte representation of the hash of the transfer.
-   `DeployInfo` serializes as 32 byte long buffer containing the byte representation of the Deploy hash. See the Deploy section above for how Deploy hashes are serialized.
-   `EraInfo` serializes a `u64` primitive type containing the little-endian byte representation of `u64`.
-   `Balance` serializes as 32 byte long buffer containing the byte representation of the URef address.
-   `Bid` and `Withdraw` both contain the `AccountHash` as their identifier; therefore, they serialize in the same manner as the `Account` variant.
-   `Dictionary` serializes as the 32 byte long buffer containing the byte representation of the seed URef hashed with the identifying name of the dictionary item.
-   `SystemContractRegistry` serializes as a 32 byte long buffer of zeros.
-   `EraSummary` serializes as a 32 byte long buffer of zeros.
-   `Unbond` contains the `AccountHash` as its identifier; therefore, it serialize in the same manner as the `Account` variant.
-   `ChainspecRegistry` serializes as a 32 byte long buffer of ones.
-   `ChecksumRegistry` serializes as a 32 byte long buffer of zeros.
-   `BidAddr` may be one of three types:
    -   `Unified` serializes as the tag `0` followed by a 32 byte long buffer containing the byte representation of a legacy bid.
    -   `Validator` serializes as the tag `1` followed by a 32 byte long buffer containing the byte representation of a validator's hash.
    -   `Delegator` serializes as the tag `2` followed by a 32 byte long buffer containing the byte representation of the associated validator's hash, appended with a 32 byte long buffer containing the byte representation of the given delegator's hash.

### Permissions {#serialization-standard-permissions}

There are three types of actions that can be done on a value: read, write, add. The reason for _add_ to be called out separately from _write_ is to allow for commutativity checking. The available actions depend on the key type and the context. Some key types only allow controlled access by smart contracts via the contract API, and other key types refer to values produced and used by the system itself and are not accessible to smart contracts at all but can be read via off-chain queries. This is summarized in the table below:

| Key      | Type Available Actions  |
| -------- | ----------------------- |
| Account  | Read + Add (via API)    |
| Hash     | Read                    |
| URef     | Read + Write and/or Add |
| Transfer | System                  |
| Deploy   | System                  |
| EraInfo  | System                  |
| Balance  | Read (via API)          |
| Bid      | System                  |
| Withdraw | System                  |
| Dictionary | Read (via API)        |
| SystemContractRegistry | Read (via API)|
| Unbond   | System                  |
| ChainspecRegistry | Read (via API) |

---

Refer to [URef permissions](./design/casper-design.md#uref-permissions) on how permissions are handled in the case of `URef`s.

## MessageTopics {#message-topics}

A topic for contract-level messages. It is serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of `topic_name` strings and [`topic_name_hash`](#topicnamehash) held within. The remainder consists of a repeating pattern of serialized `topic_name` and `topic_name_hash` of the length dictated by the first four bytes.

## MessageTopicSummary {#message-topic-summary}

A summary of a message topic that will be stored in global state. It serializes as a [`u32`](#numeric-clvalue-numeric) value for the `message_count` followed by the [`BlockTime`](#blocktime-blocktime)

## NamedArg {#namedarg}

Named arguments to a contract. It is serialized by the combination of a [`String`](#clvalue-string) followed by the associated [`CLValue`](#clvalue-clvalue).

## NamedKey {#namedkey}

A mapping of string identifiers to a Casper `Key` type. It is serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of named keys and values held within. The remainder consists of a repeating pattern of serialized named keys and then values of the length dictated by the first four bytes.

-   `name` The name of the entry. It serializes as a [`string`](#clvalue-string).

-   `key` The value of the entry, which is a Casper `Key` type.

The named keys portion of the account structure serializes as a mapping of a string to Casper `Key` values as described [here](#serialization-standard-serialization-key).

## Operation {#operation}

An operation performed while executing a deploy. It contains:

-   `key` The formatted string of the key, serialized as a [`String`](#clvalue-string).

-   `kind` OpKind, The type of operation performed. It serializes as a single byte based on the following table:

|OpKind|Serialization|
|------|-------------|
|Read  | 0           |
|Write | 1           |
|Add   | 2           |
|NoOp  | 3           |

## Package {#package}

A structure defining an entity, metadata and security container. The structure consists of the following fields:

- [`access_key`](#uref-clvalue-uref)

- `versions` An array of entity versions associated with given hashes.

- [`disabled_versions`](#entityversionkey-entityversionkey)

- [`groups`](#group-group)

- [`lock_status`](#contractpackagestatus-contractpackagestatus)

## PackageHash {#package-hash}

The hex-encoded address of a package associated with an [`AddressableEntity`](#addressableentity-addressable-entity), serialized as the byte representation of itself.

## PackageStatus {#package-status}

The lock status of the package, serialized as a [`boolean`](#boolean-clvalue-boolean) where `true` indicates a locked contract and `false` indicates an unlocked package.

## Parameter {#parameter}

Parameter to a method, structured as a name followed by a `CLType`. It is serialized as a [`String`](#clvalue-string) followed by a [`CLType`](#clvalue-cltype).

## PricingMode (#pricingmode)

The pricing mode of a transaction, with two possible variants. It serializes as a `u8` tag followed by additional data based on the following table:

| Tag | PricingMode| Description |
| --- | ---------- | ----------- |
| 0 | Classic | Original payment model, creator of a transaction specifies how much they will pay and at which gas price. |
| 1 | Fixed | The cost of the transaction is determined by the cost table, per the transaction kind. |

### Classic {#pricingmode-classic}

After the `0` tag, a `Classic` `PricingMode` serializes as the [`u64`](#numeric-clvalue-numeric) `payment_amount` followed by the `u64` value of the `gas_price`.

### Fixed {#pricingmode-fixed}

After the `1` tag, a `Fixed` `PricingMode` serializes as the [`u64`](#numeric-clvalue-numeric) `gas_price_tolerance`.

## ProtocolVersion {#protocolversion}

A newtype indicating the Casper Platform protocol version. It is serialized as three [`u32`](#clvalue-numeric) values indicating major, minor and patch versions in that order.

## PublicKey {#publickey}

Hex-encoded cryptographic public key, including the algorithm tag prefix. Serialization can be found under [`PublicKey`](#clvalue-publickey).

## RuntimeArgs {#runtimeargs}

Represents a collection of arguments passed to a smart contract. They serialize as a [`List`](#clvalue-list) comprised of [`Tuples`](#clvalue-tuple).

## SeigniorageAllocation {#seigniorageallocation}

Information about seigniorage allocation.

If the seigniorage allocation in question is for a validator, it serializes as the validator's [`PublicKey`](#clvalue-publickey) followed by the [`U512` amount](#clvalue-numeric).

If it is a delegator, it serializes as the delegator's [`PublicKey`](#clvalue-publickey), followed by the validator's [`PublicKey`](#clvalue-publickey) and finally the [`U512` amount](#clvalue-numeric).

## Signature {#signature}

The signature serializes the byte representation of the underlying cryptographic primitive signature. The first byte within the signature is 1 in the case of an `Ed25519` signature or 2 in the case of `Secp256k1`.

## SystemContractRegistry {#systemcontractregistry}

SystemContractRegistry is a unique `Key` under which a mapping of the names and `ContractHashes` for system contracts. This includes `Mint`, `Auction`, `HandlePayment` and `StandardPayment`. It is serialized as a `BTreeMap` where the first 4 bytes represent a `u32` value describing the number of names as strings and [ContractHashes](#contracthash) held within. The remainder consists of a repeating pattern of serialized strings and then ContractHashes of the length dictated by the first four bytes.

## SystemEntityType {#system-entity-type}

Entity types for system contracts, serialized as a single `u8` tag identifying the contract as per the following table:

| Tag | System Contract |
| --- | --------------- |
| 0 | `Mint` |
| 1 | `Auction` |
| 2 | `StandardPayment` |
| 3 | `HandlePayment` |

## TimeDiff {#timediff}

A human-readable duration between two timestamps. It serializes as a single [`u64`](#clvalue-numeric) value.

## Timestamp {#timestamp}

A timestamp formatted as per RFC 3339 and serialized as a single [`u64`](#clvalue-numeric) value.

## TopicNameHash {#topic-name-hash}

A `blake2b` hash of a topic name. The topic name hash serializes as a 32-byte buffer containing the bytes of the topic name hash.

## TransactionEntryPoint {#transactionentrypoint}

An entry point of a transaction, serialized as a [`u8`](#numeric-clvalue-numeric) value based on the type of entry point. The following table outlines the available types:

| Tag | Entry Point |
| --- | ----------- |
| 0 | Custom |
| 1 | Transfer |
| 2 | Add_Bid |
| 3 | Withdraw_Bid |
| 4 | Delegate |
| 5 | Undelegate |
| 6 | Redelegate |
| 7 | Activate_Bid |

## TransactionInvocationTarget {#transactioninvocationtarget}

The identifier of a `stored` transaction target, serialized as one of the following:

- `InvocableEntity` serializes as a `u8` tag of `0` followed by the hex-encoded entity address serialized as the byte representation of itself.

- `InvocableEntityAlias` serializes as a `u8` tag of `1` followed by the alias serialized as a [`string`](#string-clvalue-string).

- `Package` serializes as a `u8` tag of `2` followed by the [`package hash`](#packagehash-package-hash) and optionally the [`entity_version`](#entityversionkey-entityversionkey).

- `PackageAlias` serializes as a `u8` tag of `3` followed by the alias serialized as a [`string`](#string-clvalue-string) and optionally the [`entity_version`](#entityversionkey-entityversionkey).

## TransactionRuntime {#transactionruntime}

The runtime used to execute a transaction, serialized as a [`u8`](#numeric-clvalue-numeric) Currently, there is only the `VmCasperV1` available, which serializes as a `0`.

## TransactionSessionKind {#transactionsessionkind}

The session kind of a transaction, serialized as a `u8` tag as per the following table:

| Tag | Kind | Description |
| --- | ---- | ----------- |
| 0 | Standard | A standard (non-special-case) session. This kind of session is not allowed to install or upgrade a stored contract, but can call stored contracts. |
| 1 | Installer | A session which installs a stored contract |
| 2 | Upgrader | A session which upgrades a previously-installed stored contract. |
| 3 | Isolated | A session which doesn't call any stored contracts. | 

## TransactionScheduling {#transactionscheduling}

The scheduling mode of a transaction, serialized as a [`u8`](#numeric-clvalue-numeric) tag identifying the type:

- `Standard` serializes as a `0`.

- `FutureEra` serializes as a `1` followed by a future [`era_id`](#eraid-eraid)

- `FutureTimestamp` serializes as a `2` followed by a future [`timestamp`](#timestamp-timestamp)

## TransactionTarget {#transactiontarget}

The execution target of a transaction, serializing as a [`u8`](#numeric-clvalue-numeric) that identifies the type, followed by any additional data.

- `native` serializes as a `0`.

- `stored` serializes as a `1` followed by the [`id`](#transactioninvocationtarget) and [`runtime`](#transactionruntime).

- `session` serializes as a `2` followed by the [`kind`](#transactionsessionkind), [`module_bytes`](#payment--session) and [`runtime`](#transactionruntime).

## TransactionV1 {#transactionv1}

A unit of work sent by a client to the network, which when executed can cause global state to be altered. It is structurally defined as follows:

- [`TransactionV1Hash`](#transactionv1hash)

- [`TransactionV1Header`](#transactionv1header)

- [`TransactionV1Body`](#transactionv1body)

- `approvals` A list of signatures.

### TransactionV1Hash {#transactionv1hash}

The transaction hash is a digest over the contents of the transaction header. The transaction hash serializes as the byte representation of the hash itself.

### TransactionV1Header {#transactionv1header}

The header portion of a transaction, structurally, is defined as follows:

-   `chain_name`: Chain name is a human-readable string describing the name of the chain as detailed in the chainspec. It is serialized as a [String](#string-clvalue-string).
-   `timestamp`: A timestamp is a struct that is a unary tuple containing a `u64` value. This value is a count of the milliseconds since the UNIX epoch. Thus the value `1603994401469` serializes as `0xbd3a847575010000`
-   `ttl`: The **Time to live** is defined as the amount of time for which transaction is considered valid. The `ttl` serializes in the same manner as the timestamp.
-   `body_hash`: Body hash is a hash over the contents of the [transaction body](#transactionv1body). It serializes as the byte representation of the hash itself.
-   [`pricing_mode`](#pricingmode-pricingmode)
-   [`initator_addr`](#initiatoraddr-initiatoraddr)

### TransactionV1Body {#transactionv1body}

The body of a `TransactionV1`, consisting of the following:

- [`args`](#runtimeargs-runtimeargs)
- [`target`](#transactiontarget)
- [`entry_point`](#transactionentrypoint)
- [`scheduling`](#transactionscheduling)

## TransferAddr {#transferaddr}

Hex-encoded transfer address, which serializes as a byte representation of itself.

## TransformKindV1 {#transform}

The actual transformation performed while executing a deploy. It serializes as a single `u8` value indicating the type of transform performed as per the following table. The remaining bytes represent the information and serialization as listed.

| Transform Type       | Serialization | Description                                                                  |
|----------------------|---------------|------------------------------------------------------------------------------|
|Identity              | 0             | A transform having no effect.                                                |
|Write_CLValue         | 1             | Writes the given [`CLValue`](#clvalue-calvalue) to global state.             |
|Write_Account         | 2             | Write the given [`Account`](#account-hash) to global state.                  |
|Write_Contract_WASM   | 3             | Writes a smart [contract as Wasm](#contractwasmhash) to global state.        |
|Write_Contract        | 4             | Writes a smart [contract](#contracthash) to global state.                    | 
|Write_Contract_Package| 5             | Writes a smart [contract package](#contractpackagehash) to global state.     |
|Write_Deploy_Info     | 6             | Writes the given [`DeployInfo`](#deployinfo) to global state.                |
|Write_Transfer        | 7             | Writes the given [Transfer](#transferaddr) to global state.                  |
|Write_Era_Info        | 8             | Writes the given [`EraInfo`](#erainfo) to global state.                      |
|Write_Bid             | 9             | Writes the given [`Bid`](#bid) to global state.                              |
|Write_Withdraw        | 10            | Writes the given [Withdraw](#unbondingpurse) to global state.                |
|Add_INT32             | 11            | Adds the given [`i32`](#clvalue-numeric).                                    |
|Add_UINT64            | 12            | Adds the given [`u64`](#clvalue-numeric).                                    |
|Add_UINT128           | 13            | Adds the given [`U128`](#clvalue-numeric).                                   |
|Add_UINT256           | 14            | Adds the given [`U256`](#clvalue-numeric).                                   |
|Add_UINT512           | 15            | Adds the given [`U512`](#clvalue-numeric).                                   |
|Add_Keys              | 16            | Adds the given collection of [named keys](#namedkey).                        |
|Failure               | 17            | A failed transformation, containing an error message.                        |

## TransformKindV2 {#transformV2}

The actual transformation performed while executing a deploy. It serializes as a single `u8` value indicating the type of transform performed as per the following table. The remaining bytes represent the information and serialization as listed.

| Transform Type | Serialization | Description |
| -------------- | ------------- | ----------- |
| Identity       | 0             | A transform having no effect, created as a result of reading from the global state. |
| Write          | 1             | Writes a new value in the global state. |
| AddInt32       | 2             | Adds the given [`i32`](#clvalue-numeric). |
| AddUInt64      | 3             | Adds the given [`u64`](#clvalue-numeric). |
| AddUInt128     | 4             | Adds the given [`U128`](#clvalue-numeric). |
| AddUInt256     | 5             | Adds the given [`U256`](#clvalue-numeric). |
| AddUInt512     | 6             | Adds the given [`U512`](#clvalue-numeric). |
| AddKeys        | 7             | Adds the given collection of [named keys](#namedkey). |
| Failure        | 8             | A failed transformation, containing an error message. |
| Prune          | 9             | Removes the pathing to the global state entry of the specified key. The pruned element remains reachable from previously generated global state root hashes, but will not be included in the next generated global state root hash and subsequent states. |

## TransformEntry {#transformentry}

A transformation performed while executing a deploy.

## TransformV1 {#transformv1}

A legacy transform struct serialized as a [`String`](#string-clvalue-string) of the [key](#key-clvalue-key) followed by the [`transformkindv1`](#transformkindv1).

## Transformv2 {#transformv2}

A struct representing an executed transformation serialized as a [`String`](#string-clvalue-string) of the [key](#key-clvalue-key) followed by the [`transformkindv2`](#transformkindv2).

## UnbondingPurse {#unbondingpurse}

A purse used for unbonding. The structure consists of the following:

-   `bonding_purse` The bonding purse, serialized as a [`URef`](#clvalue-uref).

-   `validator_public_key` The public key of the validator, serialized as a [`PublicKey`](#clvalue-publickey).

-   `unbonder_public_key` The public key of the unbonder, serialized as a [`PublicKey`](#clvalue-publickey).

-   `era_of_creation` Era in which this unbonding request was created, as an [`EraId`](#eraid) newtype, which serializes as a [`u64`](#clvalue-numeric) value.

-   `amount` The unbonding amount, serialized as a [`U512`](#clvalue-numeric) value.

-   `new_validator` The validator public key to redelegate to, serialized as an [`Option`](#clvalue-option) containing the public key.

## ValidatorBid {#validatorbid}

An entry in the validator map. The structure consists of the following fields:

-   `validator_public_key` The public key of the validator that the delegator will be delegating to, serialized as a [`PublicKey`](#clvalue-publickey).

-   `bonding_purse` The bonding purse associated with the delegation. It serializes as a [`URef` value](#clvalue-uref).

-   `staked_amount` The amount staked by the delegator, serialized as a [`U512` value](#clvalue-numeric).

-   `delegation_rate` The delegation rate serialized as a [`u8` value](#numeric-clvalue-numeric).

-   `vesting_schedule` The vesting schedule for the provided delegator bid. `None` if it is a non-genesis validator. It serializes as an [`Option`](#clvalue-option).

-   `inactive` The validator's inactivity status, serialized as a [`boolean`](#boolean-clvalue-boolean).

## Values {#serialization-standard-values}

A value stored in the global state is a `StoredValue`. A `StoredValue` is one of three possible variants:

-   A `CLValue`
-   A contract
-   An account

We discuss `CLValue` and contract in more detail below. Details about accounts can be found in [accounts-head](./design/casper-design.md#accounts-head).

Each `StoredValue` is serialized when written to the global state. The serialization format consists of a single byte tag, indicating which variant of `StoredValue` it is, followed by the serialization of that variant. The tag for each variant is as follows:

-   `CLValue` is `0`
-   `Account` is `1`
-   `Contract` is `2`

The details of `CLType` serialization are in the following section. Using the serialization format for `CLValue` as a basis, we can succinctly write the serialization rules for contracts and accounts:

-   contracts serialize in the same way as data with `CLType` equal to `Tuple3(List(U8), Map(String, Key), Tuple3(U32, U32, U32))`;
-   accounts serialize in the same way as data with `CLType` equal to `Tuple5(ByteArray(U8, 32), Map(String, Key), URef, Map(ByteArray(U8, 32), U8), Tuple2(U8, U8))`.

Note: `Tuple5` is not a presently supported `CLType`. However, it is clear how to generalize the rules for `Tuple1`, `Tuple2`, `Tuple3` to any size tuple.

### `CLValue` {#clvalue}

`CLValue` is used to describe data that is used by smart contracts. This could be as a local state variable, input argument, or return value. A `CLValue` consists of two parts: a `CLType` describing the type of the value and an array of bytes representing the data in our serialization format.

`CLType` is described by the following recursive data type:

```rust
enum CLType {
   Bool, // boolean primitive
   I32, // signed 32-bit integer primitive
   I64, // signed 64-bit integer primitive
   U8, // unsigned 8-bit integer primitive
   U32, // unsigned 32-bit integer primitive
   U64, // unsigned 64-bit integer primitive
   U128, // unsigned 128-bit integer primitive
   U256, // unsigned 256-bit integer primitive
   U512, // unsigned 512-bit integer primitive
   Unit, // singleton value without additional semantics
   String, // e.g. "Hello, World!"
   URef, // unforgeable reference (see above)
   Key, // global state key (see above)
   PublicKey // A Casper system PublicKey type
   Option(CLType), // optional value of the given type
   List(CLType), // list of values of the given type (e.g. Vec in rust)
   ByteArray(CLType, u32), // same as `List` above, but number of elements
                           // is statically known (e.g. arrays in rust)
   Result(CLType, CLType), // co-product of the given types;
                           // one variant meaning success, the other failure
   Map(CLType, CLType), // key-value association where keys and values have the given types
   Tuple1(CLType), // single value of the given type
   Tuple2(CLType, CLType), // pair consisting of elements of the given types
   Tuple3(CLType, CLType, CLType), // triple consisting of elements of the given types
   Any // Indicates the type is not known
}
```

All data which can be assigned a (non-`Any`) `CLType` can be serialized according to the following rules (this defines the Casper serialization format):

#### Boolean {#clvalue-boolean}

Boolean values serialize as a single byte; `true` maps to `1`, while `false` maps to `0`.

#### Numeric {#clvalue-numeric}

Numeric values consisting of 64 bits or less serialize in the two's complement representation with little-endian byte order, and the appropriate number of bytes for the bit-width.

-   E.g. `7u8` serializes as `0x07`
-   E.g. `7u32` serializes as `0x07000000`
-   E.g. `1024u32` serializes as `0x00040000`

-   Wider numeric values (i.e. `U128`, `U256`, `U512`) serialize as one byte given the length of the next number (in bytes), followed by the two's complement representation with little-endian byte order. The number of bytes should be chosen as small as possible to represent the given number. This is done to reduce the serialization size when small numbers are represented within a wide data type.

-   E.g. `U512::from(7)` serializes as `0x0107`
-   E.g. `U512::from(1024)` serializes as `0x020004`
-   E.g. `U512::from("123456789101112131415")` serializes as `0x0957ff1ada959f4eb106`

#### Unit {#clvalue-unit} 

Unit serializes to an empty byte array.

#### String {#clvalue-string}

Strings serialize as a 32-bit integer representing the length in bytes (note: this might be different than the number of characters since special characters, such as emojis, take more than one byte), followed by the UTF-8 encoding of the characters in the string.

-   E.g. `"Hello, World!"` serializes as `0x0d00000048656c6c6f2c20576f726c6421`

#### Option {#clvalue-option}

Optional values serialize with a single byte tag, followed by the serialization of the value itself. The tag is equal to `0` if the value is missing, and `1` if it is present.

-   E.g. `None` serializes as `0x00`
-   E.g. `Some(10u32)` serializes as `0x010a000000`

#### List {#clvalue-list}

A list of values serializes as a 32-bit integer representing the number of elements in the list (note this differs from strings where it gives the number of _bytes_), followed by the concatenation of each serialized element.

-   E.g. `List()` serializes as `0x00000000`
-   E.g. `List(1u32, 2u32, 3u32)` serializes as `0x03000000010000000200000003000000`

#### ByteArray {#clvalue-ByteArray}

A fixed-length list of values serializes as the concatenation of the serialized elements. Unlike a variable-length list, the length is not included in the serialization because it is statically known by the type of the value.

-   E.g. `[1u32, 2u32, 3u32]` serializes as `0x010000000200000003000000`

#### Result {#clvalue-result}

A `Result` serializes as a single byte tag followed by the serialization of the contained value. The tag is equal to `1` for the success variant and `0` for the error variant.

    -   E.g. `Ok(314u64)` serializes as `0x013a01000000000000`
    -   E.g. `Err("Uh oh")` serializes as `0x00050000005568206f68`

#### Tuple {#clvalue-tuple}

Tuples serialize as the concatenation of their serialized elements. Similar to `ByteArray` the number of elements is not included in the serialization because it is statically known in the type.

    -   E.g. `(1u32, "Hello, World!", true)` serializes as `0x010000000d00000048656c6c6f2c20576f726c642101`

#### Map {#clvalue-map}

A `Map` serializes as a list of key-value tuples. There must be a well-defined ordering on the keys, and in the serialization, the pairs are listed in ascending order. This is done to ensure determinism in the serialization, as `Map` data structures can be unordered.

#### URef {#clvalue-uref}

`URef` values serialize as the concatenation of its address (which is a fixed-length list of `u8`) and a single byte tag representing the access rights. Access rights are converted as follows:

| Access Rights    | Serialization |
| ---------------- | ------------- |
| `NONE`           |  0           |
| `READ`           |  1           |
| `WRITE`          |  2           |
| `READ_WRITE`     |  3           |
| `ADD`            |  4           |
| `READ_ADD`       |  5           |
| `ADD_WRITE`      |  6           |
| `READ_ADD_WRITE` |  7           |

    -   E.g. `uref-974019c976b5f26412ce486158d2431967af35d91387dae8cbcd43c20fce6452-007` shows a `URef` with full `READ_ADD_WRITE` rights.
    
:::warning

When passing a URef to another entity on chain, you must ensure that the `AccessRights` are set correctly. If the URef represents a [purse](./glossary/P.md#purse-purse), `AccessRights` impact who can deposit and withdraw CSPR.

:::
    
If a passed URef contains `ADD` permissions, the entity receiving the URef will then be able to deposit CSPR into the associated purse. `WRITE` permissions allow for withdrawing CSPR. As of 1.4.5, passing a main purse URef as a runtime argument will cause the host to automatically remove `WRITE` permissions. In this event, `READ` and `ADD` permissions will remain. Regardless, all due diligence should be performed to avoid passing a URef with `WRITE` permissions unintentionally.

#### PublicKey {#clvalue-publickey}

`PublicKey` serializes as a single byte tag representing the algorithm followed by 32 bytes of the `PublicKey` itself:

-   If the `PublicKey` is a `System` key, the single tag byte is `0`. With this variant, the single byte of `0` is the entire key.
-   If the `PublicKey` is an `Ed25519` key, the single tag byte is `1` followed by the individual bytes of the serialized key.
-   If the `PublicKey` is a `Secp256k1` key, the single tag byte is a `2` followed by the individual bytes of the serialized key.

#### Key {#clvalue-key}

`Key` values serialize as a single byte tag representing the variant, followed by the serialization of the data that variant contains. For most variants, this is simply a fixed-length 32-byte array. The exception is `Key::URef`, which contains a `URef`; so its data serializes per the description above. The tags are as follows: `Key::Account` serializes as `0`, `Key::Hash` as `1`, `Key::URef` as `2`.

#### CLType {#clvalue-cltype}

`CLType` itself also has rules for serialization. A `CLType` serializes as a single-byte tag, followed by the concatenation of serialized inner types, if any (e.g., lists and tuples have inner types). `ByteArray` is a minor exception because it also includes the length in the type. However, the length is included in the serialization (as a 32-bit integer, per the serialization rules above), following the serialization of the inner type. The tags are as follows:

| `CLType`    | Serialization Tag |
| ----------- | ----------------- |
| `Bool`      |  0               |
| `I32`       |  1               |
| `I64`       |  2               |
| `U8`        |  3               |
| `U32`       |  4               |
| `U64`       |  5               |
| `U128`      |  6               |
| `U256`      |  7               |
| `U512`      |  8               |
| `Unit`      |  9               |
| `String`    |  10              |
| `Key`       |  11              |
| `URef`      |  12              |
| `Option`    |  13              |
| `List`      |  14              |
| `ByteArray` |  15              |
| `Result`    |  16              |
| `Map`       |  17              |
| `Tuple1`    |  18              |
| `Tuple2`    |  19              |
| `Tuple3`    |  20              |
| `Any`       |  21              |
| `PublicKey` |  22              |

#### CLValue {#clvalue-clvalue}

A complete `CLValue`, including both the data and the type, can also be serialized (to store it in the global state). This is done by concatenating: the serialization of the length (as a 32-bit integer) of the serialized data (in bytes), the serialized data itself, and the serialization of the type.

### Contracts {#global-state-contracts}

Contracts are a special value type because they contain the on-chain logic of the applications running on a Casper network. A _contract_ contains the following data:

-   a [wasm module](https://webassembly.github.io/spec/core/syntax/modules.html)
-   a collection of named keys
-   a protocol version

The wasm module must contain a function named `call`, which takes no arguments and returns no values. This is the main entry point into the contract. Moreover, the module may import any of the functions supported by the [Casper runtime](./design/casper-design.md#execution-semantics-runtime).

Note: though the `call` function signature has no arguments and no return value, within the `call` function body, the `get_named_arg` runtime function can be used to accept arguments (by ordinal), and the `ret` runtime function can be used to return a single `CLValue` to the caller.

The named keys are used to give human-readable names to keys in the global state, which are essential to the contract. For example, the hash key of another contract it frequently calls may be stored under a meaningful name. It is also used to store the `URef`s, which are known to the contract (see the section on Permissions for details).

Each contract specifies the Casper protocol version that was active when the contract was written to the global state.

## WithdrawPurse {#withdrawpurse}

A purse used for unbonding, replaced in 1.5 by [UnbondingPurse](#unbondingpurse). WithdrawPurses prior to 1.5 were known as UnbondingPurses and now consist of historical data.

-   `bonding_purse` The bonding purse, serialized as a [`URef`](#clvalue-uref).

-   `validator_public_key` The public key of the validator, serialized as a [`PublicKey`](#clvalue-publickey).

-   `unbonder_public_key` The public key of the unbonder, serialized as a [`PublicKey`](#clvalue-publickey).

-   `era_of_creation` Era in which this unbonding request was created, as an [`EraId`](#eraid) newtype, which serializes as a [`u64`](#clvalue-numeric) value.

-   `amount` The unbonding amount, serialized as a [`U512`](#clvalue-numeric) value.

