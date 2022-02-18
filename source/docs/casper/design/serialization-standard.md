# Serialization Standard {#serialization-standard-head}

We provide a custom implementation to serialize data structures used by the Casper node to their byte representation. This document details how this custom serialization is implemented, allowing developers to build a library that implements the custom serialization.

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

### Block hash {#block-hash}

The block hash is a `Digest` over the contents of the block Header. The `BlockHash` serializes as the byte representation of the hash itself.

### Block header {#block-header}

The header portion of a block, structurally, is defined as follows:

-   `parent_hash`: is the hash of the parent block. It serializes to the byte representation of the parent hash. The serialized buffer of the `parent_hash` is 32 bytes long.
-   `state_root_hash`: is the global state root hash produced by executing this block's body. It serializes to the byte representation of the `state root hash`. The serialized buffer of the `state_root_hash` is 32 bytes long.
-   `body_hash`: the hash of the block body. It serializes to the byte representation of the body hash. The serialized buffer of the `body_hash` is 32 bytes long.
-   `random_bit`: is a boolean needed for initializing a future era. It is serialized as a single byte; true maps to 1, while false maps to 0.
-   `accumulated_seed`: A seed needed for initializing a future era. It serializes to the byte representation of the parent Hash. The serialized buffer of the `accumulated_hash` is 32 bytes long.
-   `era_end`: contains equivocation and reward information to be included in the terminal finalized block. It is an optional field. Thus if the field is set as `None`, it serializes to _0_. The serialization of the other case is described in the EraEnd .
-   `timestamp`: The timestamp from when the block was proposed. It serializes as a single `u64` value. The serialization of a `u64` value is described in in the CLValues section.
-   `era_id`: Era ID in which this block was created. It serializes as a single `u64` value.
-   `height`: The height of this block, i.e., the number of ancestors. It serializes as a single `u64` value.
-   `protocol_version`: The version of the Casper network when this block was proposed. It is 3-element tuple containing `u32` values. It serializes as a buffer containing the three `u32` serialized values. Refer to the CLValues section on how `u32` values are serialized.

### EraEnd {#serialization-standard-era-end}

`EraEnd` as represented within the block header, is a struct containing two fields.

-   `era_report`: The first field is termed as `EraReport` and contains information about equivocators and rewards for an era.
-   `next_era_validator_weights`: The second field is map for the validators and their weights for the era to follow.

`EraReport` itself contains two fields:

-   `equivocators`: A vector of `PublicKey`.
-   `rewards`: A Binary Tree Map of `PublicKey` and `u64`.

When serializing an EraReport, the buffer is first filled with the individual serialization of the PublicKey contained within the vector.

-   If the `PublicKey` is an `Ed25519` key, the first byte within the buffer is a `1` followed by the individual bytes of the serialized key.
-   If the `PublicKey` is an `Secp256k1` key, the first byte within the buffer is a `2` followed by the individual bytes of the serialized key.

When serializing the overarching struct of `EraEnd`, we first allocate a buffer, which contains the serialized representation of the `EraReport` as described above, followed by the serialized BTreeMap.

Note that `EraEnd` is an optional field. Thus the above scheme only applies if there is an `EraEnd`; if there is no era end, the field simply serializes to _0_.

### Body {#body}

The body portion of the block is structurally defined as:

-   `proposer`: The PublicKey which proposed this block.
-   `deploy_hashes`: Is a vector of hex-encoded hashes identifying Deploys included in this block.
-   `transfer_hashes`: Is a vector of hex-encoded hashes identifying Transfers included in this block.

When we serialize the `BlockBody`, we create a buffer that contains the serialized representations of the individual fields present within the block.

-   `proposer`: serializes to the byte representation of the `PublicKey`. If the `PublicKey` is an `Ed25519` key, then the first byte within the serialized buffer is 1 followed by the bytes of the key itself; else, in the case of `Secp256k1`, the first byte is 2.
-   `deploy_hashes`: serializes to the byte representation of all the deploy_hashes within the block header. Its length is `32 * n`, where n denotes the number of deploy hashes present within the body.
-   `transfer_hashes`: serializes to the byte representation of all the deploy_hashes within the block header. Its length is `32 * n`, where n denotes the number of transfers present within the body.

## Deploy {#serialization-standard-deploy}

A deploy is a data structure containing a smart contract and the requester's signature(s). Additionally, the deploy header contains additional metadata about the deploy itself. A deploy is structurally defined as follows:

-   `hash`: The hash of the deploy header.
-   `header`: Contains metadata about the deploy. The structure of the header is detailed further in this document.
-   `payment`: The payment code for contained smart contract.
-   `session`: The stored contract itself.
-   `approvals`: A list of signatures:

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

Payment and Session are both defined as `ExecutableDeployItems`. `ExecutableDeployItems` is an enum described as follows:

```rust
pub enum ExecutableDeployItem {
    ModuleBytes {
        #[serde(with = "HexForm::<Vec<u8>>")]
        module_bytes: Vec<u8>,
        // assumes implicit `call` noarg entrypoint
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
    StoredContractByHash {
        #[serde(with = "HexForm::<[u8; KEY_HASH_LENGTH]>")]
        hash: ContractHash,
        entry_point: String,
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
    StoredContractByName {
        name: String,
        entry_point: String,
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
    StoredVersionedContractByHash {
        #[serde(with = "HexForm::<[u8; KEY_HASH_LENGTH]>")]
        hash: ContractPackageHash,
        version: Option<ContractVersion>, // defaults to highest enabled version
        entry_point: String,
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
    StoredVersionedContractByName {
        name: String,
        version: Option<ContractVersion>, // defaults to highest enabled version
        entry_point: String,
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
    Transfer {
        #[serde(with = "HexForm::<Vec<u8>>")]
        args: Vec<u8>,
    },
}
```

-   Module Bytes are serialized such that the first byte within the serialized buffer is `0` with the rest of the buffer containing the bytes present.

    -   `ModuleBytes { module_bytes: "[72 bytes]", args: 434705a38470ec2b008bb693426f47f330802f3bd63588ee275e943407649d3bab1898897ab0400d7fa09fe02ab7b7e8ea443d28069ca557e206916515a7e21d15e5be5eb46235f5 }` will serialize to
    -   `0x0048000000420481b0d5a665c8a7678398103d4333c684461a71e9ee2a13f6e859fb6cd419ed5f8876fc6c3e12dce4385acc777edf42dcf8d8d844bf6a704e5b2446750559911a4a328d649ddd48000000434705a38470ec2b008bb693426f47f330802f3bd63588ee275e943407649d3bab1898897ab0400d7fa09fe02ab7b7e8ea443d28069ca557e206916515a7e21d15e5be5eb46235f5`

-   StoredContractByHash serializes such that the first byte within the serialized buffer is 1u8. This is followed by the byte representation of the remaining fields.

    -   `StoredContractByHash { hash: c4c411864f7b717c27839e56f6f1ebe5da3f35ec0043f437324325d65a22afa4, entry_point: "pclphXwfYmCmdITj8hnh", args: d8b59728274edd2334ea328b3292ed15eaf9134f9a00dce31a87d9050570fb0267a4002c85f3a8384d2502733b2e46f44981df85fed5e4854200bbca313e3bca8d888a84a76a1c5b1b3d236a12401a2999d3cad003c9b9d98c92ab1850 }`
    -   `0x01c4c411864f7b717c27839e56f6f1ebe5da3f35ec0043f437324325d65a22afa41400000070636c7068587766596d436d6449546a38686e685d000000d8b59728274edd2334ea328b3292ed15eaf9134f9a00dce31a87d9050570fb0267a4002c85f3a8384d2502733b2e46f44981df85fed5e4854200bbca313e3bca8d888a84a76a1c5b1b3d236a12401a2999d3cad003c9b9d98c92ab1850`

-   StoredContractByName serializes such that the first byte within the serialized buffer is 2u8. This is followed by the individual byte representation of the remaining fields.

    -   `StoredContractByName { name: "U5A74bSZH8abT8HqVaK9", entry_point: "gIetSxltnRDvMhWdxTqQ", args: 07beadc3da884faa17454a }`
    -   `0x0214000000553541373462535a483861625438487156614b39140000006749657453786c746e5244764d685764785471510b00000007beadc3da884faa17454a`

-   StoredVersionedContractByHash serializes such that the first byte within the serialized buffer is 3u8. However, the field version within the enum serializes as an Option CLValue, i.e., if the value is None as shown in the example, it serializes to 0, else it serializes the inner u32 value, which is described below.

    -   `StoredVersionedContractByHash { hash: b348fdd0d0b3f66468687df93141b5924f6bb957d5893c08b60d5a78d0b9a423, version: None, entry_point: "PsLz5c7JsqT8BK8ll0kF", args: 3d0d7f193f70740386cb78b383e2e30c4f976cf3fa834bafbda4ed9dbfeb52ce1777817e8ed8868cfac6462b7cd31028aa5a7a60066db35371a2f8 }`
    -   `0x03b348fdd0d0b3f66468687df93141b5924f6bb957d5893c08b60d5a78d0b9a423001400000050734c7a3563374a73715438424b386c6c306b463b0000003d0d7f193f70740386cb78b383e2e30c4f976cf3fa834bafbda4ed9dbfeb52ce1777817e8ed8868cfac6462b7cd31028aa5a7a60066db35371a2f8`

-   StoredVersionedContractByName serializes such that the first byte within the serialized buffer is 4u8. The name and entry_point are serialized as a String CLValue, with the Option version field serializing to 0 if the value is None; else, it serializes the inner u32 value as described below.

    -   `StoredVersionedContractByName { name: "lWJWKdZUEudSakJzw1tn", version: Some(1632552656), entry_point: "S1cXRT3E1jyFlWBAIVQ8", args: 9975e6957ea6b07176c7d8471478fb28df9f02a61689ef58234b1a3cffaebf9f303e3ef60ae0d8 }`
    -   `0x04140000006c574a574b645a5545756453616b4a7a7731746e01d0c64e61140000005331635852543345316a79466c57424149565138270000009975e6957ea6b07176c7d8471478fb28df9f02a61689ef58234b1a3cffaebf9f303e3ef60ae0d8`

-   Transfer serializes such that the first byte within the serialized buffer contains is 5u8, with the remaining bytes of the buffer containing the bytes contained within the args field of Transfer.

### Approval {#approval}

Approval contains two fields:

-   `signer`: The public key of the approvals signer. It serializes to the byte representation of the `PublicKey`. If the `PublicKey` is an `Ed25519` key, then the first byte within the serialized buffer is 1 followed by the bytes of the key itself; else, in the case of `Secp256k1`, the first byte is 2.
-   `signature`: The approval signature, which serializes as the byte representation of the `Signature`. The fist byte within the signature is 1 in the case of an `Ed25519` signature or 2 in the case of `Secp256k1`.

### Deploy Serialization at High Level {#deploy-serialization-at-high-level}

Consider the following deploy:

```json
{
    "hash": "01da3c604f71e0e7df83ff1ab4ef15bb04de64ca02e3d2b78de6950e8b5ee187",
    "header": {
        "account": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
        "timestamp": "2020-11-17T00:39:24.072Z",
        "ttl": "1h",
        "gas_price": 1,
        "body_hash": "4811966d37fe5674a8af4001884ea0d9042d1c06668da0c963769c3a01ebd08f",
        "dependencies": ["0101010101010101010101010101010101010101010101010101010101010101"],
        "chain_name": "casper-example"
    },
    "payment": {
        "StoredContractByName": {
            "name": "casper-example",
            "entry_point": "example-entry-point",
            "args": [
                [
                    "quantity",
                    {
                        "cl_type": "I32",
                        "bytes": "e8030000",
                        "parsed": 1000
                    }
                ]
            ]
        }
    },
    "session": {
        "Transfer": {
            "args": [
                [
                    "amount",
                    {
                        "cl_type": "I32",
                        "bytes": "e8030000",
                        "parsed": 1000
                    }
                ]
            ]
        }
    },
    "approvals": [
        {
            "signer": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
            "signature": "012dbf03817a51794a8e19e0724884075e6d1fbec326b766ecfa6658b41f81290da85e23b24e88b1c8d9761185c961daee1adab0649912a6477bcd2e69bd91bd08"
        }
    ]
}
```

The above deploy will serialize to:

`01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900ca856a4d37501000080ee36000000000001000000000000004811966d37fe5674a8af4001884ea0d9042d1c06668da0c963769c3a01ebd08f0100000001010101010101010101010101010101010101010101010101010101010101010e0000006361737065722d6578616d706c6501da3c604f71e0e7df83ff1ab4ef15bb04de64ca02e3d2b78de6950e8b5ee187020e0000006361737065722d6578616d706c65130000006578616d706c652d656e7472792d706f696e7401000000080000007175616e7469747904000000e803000001050100000006000000616d6f756e7404000000e8030000010100000001d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c012dbf03817a51794a8e19e0724884075e6d1fbec326b766ecfa6658b41f81290da85e23b24e88b1c8d9761185c961daee1adab0649912a6477bcd2e69bd91bd08`

## Values {#serialization-standard-values}

A value stored in the global state is a `StoredValue`. A `StoredValue` is one of three possible variants:

-   A `CLValue`
-   A contract
-   An account

We discuss `CLValue` and contract in more detail below. Details about accounts can be found in [accounts-head](./accounts.md#accounts-head).

Each `StoredValue` is serialized when written to the global state. The serialization format consists of a single byte tag, indicating which variant of `StoredValue` it is, followed by the serialization of that variant. The tag for each variant is as follows:

-   `CLValue` is `0`
-   `Account` is `1`
-   `Contract` is `2`

The details of `CLType` serialization are in the following section. Using the serialization format for `CLValue` as a basis, we can succinctly write the serialization rules for contracts and accounts:

-   contracts serialize in the same way as data with `CLType` equal to `Tuple3(List(U8), Map(String, Key), Tuple3(U32, U32, U32))`;
-   accounts serialize in the same way as data with `CLType` equal to `Tuple5(FixedList(U8, 32), Map(String, Key), URef, Map(FixedList(U8, 32), U8), Tuple2(U8, U8))`.

Note: `Tuple5` is not a presently supported `CLType`. However, it is clear how to generalize the rules for `Tuple1`, `Tuple2`, `Tuple3` to any size tuple.

Note: links to further serialization examples and a reference implementation are found in [Appendix B](./appendix.md#appendix-b).

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
   PublicKey // A Casper system PublicKey type
   Key, // global state key (see above)
   Option(CLType), // optional value of the given type
   List(CLType), // list of values of the given type (e.g. Vec in rust)
   FixedList(CLType, u32), // same as `List` above, but number of elements
                           // is statically known (e.g. arrays in rust)
   Result(CLType, CLType), // co-product of the the given types;
                           // one variant meaning success, the other failure
   Map(CLType, CLType), // key-value association where keys and values have the given types
   Tuple1(CLType), // single value of the given type
   Tuple2(CLType, CLType), // pair consisting of elements of the given types
   Tuple3(CLType, CLType, CLType), // triple consisting of elements of the given types
   Any // Indicates the type is not known
}
```

All data which can be assigned a (non-`Any`) `CLType` can be serialized according to the following rules (this defines the Casper serialization format):

-   Boolean values serialize as a single byte; `true` maps to `1`, while `false` maps to `0`.

-   Numeric values consisting of 64 bits or less serialize in the two's complement representation with little-endian byte order, and the appropriate number of bytes for the bit-width.

    -   E.g. `7u8` serializes as `0x07`
    -   E.g. `7u32` serializes as `0x07000000`
    -   E.g. `1024u32` serializes as `0x00040000`

-   Wider numeric values (i.e. `U128`, `U256`, `U512`) serialize as one byte given the length of the next number (in bytes), followed by the two's complement representation with little-endian byte order. The number of bytes should be chosen as small as possible to represent the given number. This is done to reduce the serialization size when small numbers are represented within a wide data type.

    -   E.g. `U512::from(7)` serializes as `0x0107`
    -   E.g. `U512::from(1024)` serializes as `0x020004`
    -   E.g. `U512::from("123456789101112131415")` serializes as `0x0957ff1ada959f4eb106`

-   Unit serializes to an empty byte array.

-   Strings serialize as a 32-bit integer representing the length in bytes (note: this might be different than the number of characters since special characters, such as emojis, take more than one byte), followed by the UTF-8 encoding of the characters in the string.

    -   E.g. `"Hello, World!"` serializes as `0x0d00000048656c6c6f2c20576f726c6421`

-   Optional values serialize with a single byte tag, followed by the serialization of the value itself. The tag is equal to `0` if the value is missing, and `1` if it is present.

    -   E.g. `None` serializes as `0x00`
    -   E.g. `Some(10u32)` serializes as `0x010a000000`

-   A list of values serializes as a 32-bit integer representing the number of elements in the list (note this differs from strings where it gives the number of _bytes_), followed by the concatenation of each serialized element.

    -   E.g. `List()` serializes as `0x00000000`
    -   E.g. `List(1u32, 2u32, 3u32)` serializes as `0x03000000010000000200000003000000`

-   A fixed-length list of values serializes as the concatenation of the serialized elements. Unlike a variable-length list, the length is not included in the serialization because it is statically known by the type of the value.

    -   E.g. `[1u32, 2u32, 3u32]` serializes as `0x010000000200000003000000`

-   A `Result` serializes as a single byte tag followed by the serialization of the contained value. The tag is equal to `1` for the success variant and `0` for the error variant.

    -   E.g. `Ok(314u64)` serializes as `0x013a01000000000000`
    -   E.g. `Err("Uh oh")` serializes as `0x00050000005568206f68`

-   Tuples serialize as the concatenation of their serialized elements. Similar to `FixedList` the number of elements is not included in the serialization because it is statically known in the type.

    -   E.g. `(1u32, "Hello, World!", true)` serializes as `0x010000000d00000048656c6c6f2c20576f726c642101`

-   A `Map` serializes as a list of key-value tuples. There must be a well-defined ordering on the keys, and in the serialization, the pairs are listed in ascending order. This is done to ensure determinism in the serialization, as `Map` data structures can be unordered.

-   `URef` values serialize as the concatenation of its address (which is a fixed-length list of `u8`) and a single byte tag representing the access rights. Access rights are converted as follows:

| Access Rights    | Serialization |
| ---------------- | ------------- |
| `NONE`           | > 0           |
| `READ`           | > 1           |
| `WRITE`          | > 2           |
| `READ_WRITE`     | > 3           |
| `ADD`            | > 4           |
| `READ_ADD`       | > 5           |
| `ADD_WRITE`      | > 6           |
| `READ_ADD_WRITE` | > 7           |

-   `PublicKey` serializes as a single byte tag representing the algorithm followed by 32 bytes of the `PublicKey` itself:

    -   If the `PublicKey` is an `Ed25519` key, the single tag byte is `1` followed by the individual bytes of the serialized key.
    -   If the `PublicKey` is a `Secp256k1` key, the single tag byte is a `2` followed by the individual bytes of the serialized key.

-   `Key` values serialize as a single byte tag representing the variant, followed by the serialization of the data that variant contains. For most variants, this is simply a fixed-length 32-byte array. The exception is `Key::URef`, which contains a `URef`; so its data serializes per the description above. The tags are as follows: `Key::Account` serializes as `0`, `Key::Hash` as `1`, `Key::URef` as `2`.

`CLType` itself also has rules for serialization. A `CLType` serializes as a single-byte tag, followed by the concatenation of serialized inner types, if any (e.g., lists and tuples have inner types). `FixedList` is a minor exception because it also includes the length in the type. However, the length is included in the serialization (as a 32-bit integer, per the serialization rules above), following the serialization of the inner type. The tags are as follows:

| `CLType`    | Serialization Tag |
| ----------- | ----------------- |
| `Bool`      | > 0               |
| `I32`       | > 1               |
| `I64`       | > 2               |
| `U8`        | > 3               |
| `U32`       | > 4               |
| `U64`       | > 5               |
| `U128`      | > 6               |
| `U256`      | > 7               |
| `U512`      | > 8               |
| `Unit`      | > 9               |
| `String`    | > 10              |
| `URef`      | > 11              |
| `Key`       | > 12              |
| `Option`    | > 13              |
| `List`      | > 14              |
| `FixedList` | > 15              |
| `Result`    | > 16              |
| `Map`       | > 17              |
| `Tuple1`    | > 18              |
| `Tuple2`    | > 19              |
| `Tuple3`    | > 20              |
| `Any`       | > 21              |

A complete `CLValue`, including both the data and the type, can also be serialized (to store it in the global state). This is done by concatenating: the serialization of the length (as a 32-bit integer) of the serialized data (in bytes), the serialized data itself, and the serialization of the type.

### Contracts {#global-state-contracts}

Contracts are a special value type because they contain the on-chain logic of the applications running on the Casper network. A _contract_ contains the following data:

-   a [wasm module](https://webassembly.github.io/spec/core/syntax/modules.html)
-   a collection of named keys
-   a protocol version

The wasm module must contain a function named `call`, which takes no arguments and returns no values. This is the main entry point into the contract. Moreover, the module may import any of the functions supported by the Casper runtime; a list of all supported functions can be found in [Appendix A](./appendix.md#appendix-a).

Note: though the `call` function signature has no arguments and no return value, within the `call` function body, the `get_named_arg` runtime function can be used to accept arguments (by ordinal), and the `ret` runtime function can be used to return a single `CLValue` to the caller.

The named keys are used to give human-readable names to keys in the global state, which are essential to the contract. For example, the hash key of another contract it frequently calls may be stored under a meaningful name. It is also used to store the `URef`s, which are known to the contract (see the section on Permissions for details).

Each contract specifies the Casper protocol version that was active when the contract was written to the global state.

## Keys {#serialization-standard-state-keys}

In this chapter, we describe what constitutes a "key", the permissions model for the keys, and how they are serialized.

A _key_ in the [Global State](./global-state.md#global-state-intro) is one of the following data types:

-   32-byte account identifier (called an "account identity key")
-   32-byte immutable contract identifier (called a "hash key")
-   32-byte reference identifier (called an "unforgeable reference")
-   32-byte transfer identifier
-   32-byte deploy information identifier
-   32-byte purse balance identifier
-   32-byte Auction bid identifier
-   32-byte Auction withdrawal identifier
-   32-byte Dictionary item identifier

The one exception to note here is the identifier for `EraInfo`, which actually serializes as a `u64` value with an additional byte for the tag.

### Account identity key {#global-state-account-key}

This key type is used specifically for accounts in the global state. All accounts in the system must be stored under an account identity key, and no other types. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./accounts.md#accounts-associated-keys-weights) for more information).

### Hash key {#serialization-standard-hash-key}

This key type is used for storing contracts immutably. Once a contract is written under a hash key, that contract can never change. The 32-byte identifier representing this key is derived from the `blake2b256` hash of the deploy hash (see [block-structure-head](./block-structure.md#block-structure-head) for more information) concatenated with a 4-byte sequential ID. The ID begins at zero for each deploy and increments by one each time a contract is stored. The purpose of this ID is to allow each contract stored in the same deploy to have a unique key.

### Unforgeable Reference (`URef`) {#serialization-standard-uref}

`URef` broadly speaking can be used to store values and manage permissions to interact with the value stored under the `URef`. `URef` is a tuple which contains the address under which the values are stored and the Access rights to the `URef`. Refer to the [Unforgeable Reference](./uref.md#uref-head) section for details on how `URefs` are managed.

### Transfer Key {#serialization-standard-transfer-key}

This key type is used specifically for transfers in the global state. All transfers in the system must be stored under a transfer key and no other type. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the transfer address associated with the given transfer

### DeployInfo Key {#serialization-standard-deploy-info-key}

This key type is used specifically for storing information related to deploys in the global state. Information for a given deploy is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the deploy itself.

### EraInfo Key {#serialization-standard-era-info-key}

This key type is used specifically for storing information related to the `Auction` metadata for a particular era. The underlying data type stored under this is a vector of the allocation of seigniorage for that given era. The identifier for this key is a new type that wraps around the primitive `u64` data type and co-relates to the era number when the auction information was stored.

### Balance Key {#serialization-standard-balance-key}

This key type is used to store information related to the balance of a given purse. All purse balances are stored using this key.
The 32-byte identifier which represents this key is derived from the Address of the URef, which relates to the purse.

### Bid Key {#serialization-standard-bid-key}

This key type is used specifically for storing information related to auction bids in the global state. Information for the bids is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./accounts.md#accounts-associated-keys-weights) for more information).

### Wwithdraw Key {#serialization-standard-withdraw-key}

This key type is used specifically for storing information related to auction withdraws in the global state. Information for the withdrawals is stored under this key only. The 32-byte identifier which represents this key is derived from the `blake2b256` hash of the public key used to create the associated account (see [Accounts](./accounts.md#accounts-associated-keys-weights) for more information).

### Dictionary Key {#serialization-standard-dictionary-key}

This key type is used for storing dictionary items.

### Serialization for `Key` {#serialization-standard-serialization-key}

Given the different variants for the over-arching `Key` data-type, each of the different variants is serialized differently. This section of this chapter details how the individual variants are serialized. The leading byte of the serialized buffer acts as a tag indicating the serialized variant.

| `Key`          | Serialization Tag |
| -------------- | ----------------- |
| `Account`      | > 0               |
| `Hash`         | > 1               |
| `URef`         | > 2               |
| `Transfer`     | > 3               |
| `DeployInfo`   | > 4               |
| `EraInfo`      | > 5               |
| `Balance`      | > 6               |
| `Bid`          | > 7               |
| `Withdraw`     | > 8               |
| `Dictionary`   | > 9               |

-   `Account` serializes as a 32 byte long buffer containing the byte representation of the underlying `AccountHash`
-   `Hash` serializes as a 32 byte long buffer containing the byte representation of the underlying `Hash` itself.
-   `URef` is a tuple that contains the address of the URef and the access rights to that `URef`. The serialized representation of the `URef` is 33 bytes long. The first 32 bytes are the byte representation of the `URef` address, and the last byte contains the bits corresponding to the access rights of the `URef`. Refer to the [CLValue](#serialization-standard-values) section of this chapter for details on how `AccessRights` are serialized.
-   `Transfer` serializes as a 32 byte long buffer containing the byte representation of the hash of the transfer.
-   `DeployInfo` serializes as 32 byte long buffer containing the byte representation of the Deploy hash. See the Deploy section above for how Deploy hashes are serialized.
-   `EraInfo` serializes a `u64` primitive type containing the little-endian byte representation of `u64`.
-   `Balance` serializes as 32 byte long buffer containing the byte representation of the URef address.
-   `Bid` and `Withdraw` both contain the `AccountHash` as their identifier; therefore, they serialize in the same manner as the `Account` variant.
-   `Dictionary` serializes as 32 byte long buffer containing the byte representation of the `Dictionary` item address.

## Permissions {#serialization-standard-permissions}

There are three types of actions that can be done on a value: read, write, add. The reason for _add_ to be called out separately from _write_ is to allow for commutativity checking. The available actions depend on the key type and the context. Some key types only allow controlled access by smart contracts via the contract API, and other key types refer to values produced and used by the system itself and are not accessible to smart contracts at all but can be read via off-chain queries. This is summarized in the table below:

| Key        | Type Available Actions  |
| ---------- | ----------------------- |
| Account    | Read + Add (via API)    |
| Hash       | Read                    |
| URef       | Read + Write and/or Add |
| Transfer   | System                  |
| Deploy     | System                  |
| EraInfo    | System                  |
| Balance    | Read (via API)          |
| Bid        | System                  |
| Withdraw   | System                  |
| Dictionary | ???                     |

---

Refer to [URef permissions](uref.md) on how permissions are handled in the case of `URef`s.
