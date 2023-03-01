# Casper Node Networking Protocol

## Casper Node Networking Protocol (Mainnet Protocol Version 1.5.0)

This is a description of the `casper-node`'s networking protocol. This document follows the conventions laid out in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

## Connection Level

Any `casper-node` taking part in the Casper network SHOULD open connections to every other casper-node it is aware of and has not blocked. These connections are established using TLS, presenting a client certificate.

### Reciprocity, retries and data direction

A connection that was initiated by a node is considered an _outgoing_ connection by the node itself, but an _incoming_ connection by all other peers.

A node that created an outgoing connection SHOULD terminate the connection if it does not detect an incoming connection from the connected-to node within a short amount of time.

A node that receives an incoming connection MUST eventually establish an outgoing connection to the node.

A node SHOULD retry any failed outgoing connection periodically with exponential backoff. A node MUST NOT attempt to reconnect more than once per second.

Nodes MUST NOT send data through incoming connections, other than handshakes. Nodes MUST NOT accept any data coming through outgoing connections, other than handshakes.

### TLS parameters

Any node creating a connection to a node MUST present a client certificate with the following properties:

* Signature algorithm: `ECDSA_WITH_SHA512`
* Subject name: Same as issuer name (self-signed certificate!)
* Serial number: 1
* Expiration ("not before"): Must be earlier than current time.
* Expiration ("not after"): Must be later than current time.
* Signature: Must be using `SECP521R1` with `SHA512` and valid.

The SHA512 fingerprint of the _public key_ is considered the **NodeID** of the node.

Any node MUST immediately terminate a connection if it does not match the given parameters. The same certificate MUST be used as a server certificate for other clients connecting to this node.

An incoming connection with a valid TLS certificate SHOULD be accepted. As all certificates are self-signed, no further checking is done.

### Discovery

A node address is defined as an IPv4 address and a port. A node's address is the publicly reachable IP address and port that it is listening on for node-to-node-communication.

Every node SHOULD have one or more so-called _known node addresses_ of other nodes configured.

On start-up, a node SHOULD attempt to connect to all known nodes. A node SHOULD never forget a known node address.

Every node MUST periodically gossip its own node address to the network (see gossiping below).

A node _learns_ new node addresses through receiving a gossiped node address, or being told of an address through the handshake.

Upon learning of a previously unknown node address, a node SHOULD attempt to connect to it.

After failing to connect to a node address, a node MAY forget it after a certain amount of retries, this process is called _forgetting_ a node. An address that has been forgotten will be considered new the next time it is learned.

A node MUST NOT forget the known addresses it was configured with initially.

## Framing

To send a message to a peer across an established TLS connection, a node MUST send a message length header consisting of a 32 byte big endian integer with the message length first.

A node receiving a message length header that exceeds the maximum message size specified in the chainspec MUST immediately terminate the connection.

## Encoding

The node uses three encoding schemes: Handshakes (see below) are encoded using [MessagePack](https://msgpack.org), while regular messages are encoded using [bincode](https://docs.rs/bincode). Many (but not all) data objects use [`bytesrepr`](https://docs.rs/casper-types/1.5.0/casper_types/bytesrepr/index.html) for serialization.

The node uses the [`rmp-serde`](https://docs.rs/rmp-serde/0.14.4/rmp_serde/index.html) crate, version `0.14.4`, which is kept fixed to ensure handshake compatibility with protocol version 1.0 of the node.

All nodes MUST use the following settings for `bincode` encoding of network messages:

* Byte limit: Unlimited
* Endianness: Little Endian
* Integer Encoding: Varint
* Trailing Bytes: Not allowed

Any other use of `bincode` encoding (e.g. for GetRequest payloads, see below) MUST use the following `bincode` encoding settings:

* Byte limit: Unlimited
* Endianness: Little Endian
* Integer Encoding: Fixint
* Trailing Bytes: Allowed

Unless noted otherwise, any structure encoded as MessagePack or bincode is serialized using the standard  [`serde`](https://serde.rs)-derived encoding. For `bytesrepr` serialization refer to the specific implementations in the `bytesrepr` crate.

Any data types given from here on out are described using simplified [Rust](https://rust-lang.org/) structure definitions.

## The `Message` Type

The following data types make up the networking protocol:

```rust
enum Message {
    Handshake {
        network_name: String,
        public_addr: SocketAddr,
        // default: 1.0
        protocol_version: ProtocolVersion,
        // default: `None`
        consensus_certificate: Option<ConsensusCertificate>,
        // default: false
        is_syncing: bool,
        // default: `None`
        chainspec_hash: Option<Digest>,
    },
    Payload(Payload),
}

struct ConsensusCertificate {
    public_key: PublicKey,
    signature: Signature,
}

struct Digest([u8; 32]);
```

For [`String`](https://doc.rust-lang.org/std/string/struct.String.html), [`SocketAddr`](https://doc.rust-lang.org/std/net/enum.SocketAddr.html), [`ProtocolVersion`](https://docs.rs/casper-types/1.5.0/casper_types/struct.ProtocolVersion.html), [`Option`](https://doc.rust-lang.org/std/option/enum.Option.html), [`PublicKey`](https://docs.rs/casper-types/1.5.0/casper_types/crypto/enum.PublicKey.html), [`Signature`](https://docs.rs/casper-types/1.5.0/casper_types/crypto/enum.Signature.html) see the respective docs and details below.

## Handshake Behavior

A node establishing a new connection MUST immediately send a handshake through said connection to the peer, regardless of whether an incoming or outgoing connection was established (this is an exception to the restriction of only sending data through outgoing connections).

A handshake MUST be encoded using the `Message::Handshake` structure. A node running version 1.5 SHOULD NOT omit any of the fields for which default values are available (`protocol_version`, `consensus_certificate`, `is_syncing`, `chainspec_hash`). A node MUST accept any handshake that omits one or more of these fields and fill them with defaults.

After receiving a handshake, a node MUST compare the `network_name`, `protocol_version` and `chainspec_hash` fields against its own configuration: If any of these do not match, it MUST disconnect from the node and SHOULD block it.

A node MUST mark any peer that connects to it (thus is an incoming connection from the perspective of the node) with a value of `is_syncing` set to `true` as "syncing" and MUST NOT allow any of its own messages that are marked unsafe-for-syncing to be sent to that node, by silently dropping them instead.

A node MAY compare peers that provide a `consensus_certificate` to the currently active set of validators and mark it as an active validator to give it preferential treatment when outgoing bandwidth is limited.

Upon handshake completion, the node SHOULD learn the provided `public_addr`. 

## Blocking Nodes

If a node blocks a peer, it MUST sever all incoming and outgoing connections to said node. It MUST take note of the NodeId of the node, marking it as blocked and MUST not allow any new connection to proceed past the handshake.

A node MUST NOT block peers based on IP address or port. Nodes MUST NOT block peers for more than an hour.

After a block on a node is expired, the node SHOULD _forget_ the nodes IP address, allowing a later _learning_ of said address again.

## The `Payload` Type

The `Payload` (found in the node sources as `Message` in `payload.rs`) contains variants for all node-to-node communicating subsystems of a running node, which are described below. Note that some of the variants have been renamed for clarity in this specification. Since field names are not used in `bincode` encoding, this should have no effect on implementations.

```rust
enum Payload {
    Consensus(ConsensusMessage),
    DeployGossiper(DeployGossiperMessage),
    AddressGossiper(AddressGossiperMessage),
    GetRequest {
        tag: Tag,
        serialized_id: Vec<u8>,
    },
    GetResponse {
        tag: Tag,
        serialized_item: Vec<[u8]>,
    },
    FinalitySignature(FinalitySignature),
}

enum DeployGossiperMessage {
    Gossip(DeployHash),
    GossipResponse {
        item_id: DeployHash,
        is_already_held: bool,
    },
}

enum AddressGossiperMessage {
    Gossip(GossippedAddress),
    GossipResponse {
        item_id: GossippedAddress,
        is_already_held: bool,
    },
}

struct DeployHash(Digest);
struct GossipedAddress(SocketAddr);
```

### Consensus

A consensus message is sent exclusively between instances of the consensus component, from one peer to another. A precise description of the Highway consensus protocol is out of scope of this document, see the `consensus::Message` type or an appropriate description of the underlying protocol for details.

### Gossiping

Gossiping messages are sent by a node to a subset of its peers to announce the availability of new data items. Peers MUST be distinguished by NodeID, not by listening address.

A node must support a gossiper for deploys and one for `GossippedAddress`, which is an alias for the regular Rust standard library's `SocketAddr`.

A node SHOULD begin a gossiping process for all deploys previously unknown to it. A node MUST periodically send an `AddressGossiperMessage::Gossip` message to a random subset selected in a similar manner as the one for deploy gossip to make its own address known, see the gossiping process section below for details.

### Unsafe-for-Syncing

A node that is syncing MUST indicate this by setting `is_syncing` to `true`.

A node MAY implement a scheme for request throttling/backpressure for GetRequests (see below) of `TrieNode`s that can cause issues with peers that are also sending GetRequests.

A node that succeeds in a handshake with a peer that has set `is_syncing` MUST make note of this flag. If the node itself is implementing the feature described above, it MUST NOT make any GetRequests directed at this peer for `TrieNode`s.

## Gossiping

Gossiping is distributing items across the network by sending it to a subset of known peers that do not have the item already, and having them repeat this process until a certain degree of saturation is observed.

Any item has an associated ID type which denotes what is used to uniquely identify it when gossiping. If an item is small enough, the ID may just be the item itself.

Gossiper messages have the following structure:

```rust
enum GossiperMessage {
    Gossip(Id),
    GossipResponse {
        item_id: Id,
        is_already_held: bool,
    },
}
```

To gossip, a node MAY send a `GossiperMessage::Gossip` message to a random subset of configurable size of peers to announce that it has received and validated a new item. Any peer receiving such a message SHOULD answer with a `GossiperMessage:GossipResponse`, citing the given id and using `is_already_held` to indicate whether it already possessed the given item.

The node SHOULD attempt to continue to find peers with a negative response, up to a configurable limit of attempts and/or success rate, or until running out of valid peers.

The node that initiated the gossip MUST keep track of which peer replied with a positive (`is_already_held`  being `true`) response and MUST NOT send another `Gossip` message for same ID to any of these peers during this gossip process. However, it MAY restart gossiping the same item at a later time, considering these peers again.

If a node receives a negative `GossiperMessage::GossipResponse` (i.e. `is_already_held`  being `false`), and the item's ID is not the item itself, it MUST handle that repsponse as if the peer had sent a `GetRequest` for the item (see GetRequests section below).

## GetRequests

The "GetRequests" mechanism allows retrieving various items through primary or derived keys from peers.

A peer MAY send a `GetRequest` (see `Payload::GetRequest`) with a `Tag` and `serialized_id` payload. Both `serialized_id` and `serialized_item` MUST be encoded using `bincode` (see "Encoding" section for details).

```rust
pub enum Tag {
    Deploy,
    FinalizedApprovals,
    Block,
    GossipedAddress,
    BlockAndMetadataByHeight,
    BlockHeaderByHash,
    BlockHeaderAndFinalitySignaturesByHeight,
    TrieOrChunk,
    BlockAndDeploysByHash,
    BlockHeaderBatch,
    FinalitySignaturesByHash,
}
```

The tag dictates which item is being retrieved, and which key (ID type) is being used.

A node that receives a `GetRequest` from a peer SHOULD return a `GetResponse` (see `Payload::GetResponse`). The `GetResponse` MUST use the same `Tag`.

```rust
pub enum FetchedOrNotFound<T, Id> {
    Fetched(T),
    NotFound(Id),
}
```

If the item was found, `serialized_item` MUST contain a serialized `FetchedOrNotFound::Fetched` instance, with the inner value `T` being the item.

If the item was not found, `serialized_item` MUST contain a `FetchedOrNotFound::NotFound` instance, with the inner value `Id` being the ID found in the originating `GetRequest`.

A node MUST not send any items to a peer that it itself has not verified.

The following table shows which tag corresponds to which ID and item type. Type definitions for `DeployHash` and `GossippedAddress` can be found earlier in this document, other types are described following this section.  Further details of many of these types can be found in the [Serialization Standard](serialization-standard.md), but be aware that those docs describe serializing using bytesrepr rather than bincode.

| Tag                                      | ID type               | Payload (item) type        |
| ---------------------------------------- | --------------------- | -------------------------- |
| Deploy                                   | `DeployHash`          | `Deploy`                   |
| FinalizedApprovals                       | `DeployHash`          | `FinalizedApprovalsWithId` |
| Block                                    | `BlockHash`           | `Block`                    |
| GossipedAddress                          | `GossipedAddress`     | `GossipedAddress`          | 
| BlockAndMetadataByHeight                 | `u64`                 | `BlockWithMetadata`        |
| BlockHeaderByHash                        | `BlockHash`           | `BlockHeader`              |
| BlockHeaderAndFinalitySignaturesByHeight | `u64`                 | `BlockHeaderWithMetadata`  |
| TrieOrChunk                              | `TrieOrChunkId`       | `TrieOrChunk`              |
| BlockAndDeploysByHash                    | `BlockHash`           | `BlockAndDeploys`          |
| BlockHeaderBatch                         | `BlockHeadersBatchId` | `BlockHeadersBatch`        |
| FinalitySignaturesByHash                 | `BlockHash`           | `BlockSignatures`          |

```rust
pub struct Deploy {
    hash: DeployHash,
    header: DeployHeader,
    payment: ExecutableDeployItem,
    session: ExecutableDeployItem,
    approvals: BTreeSet<Approval>,
}

struct DeployHeader {
    account: PublicKey,
    timestamp: u64,
    ttl: u64,
    gas_price: u64,
    body_hash: Digest,
    dependencies: Vec<DeployHash>,
    chain_name: String,
}

enum PublicKey {
    System,
    Ed25519(Vec<u8>),
    Secp256k1(Vec<u8>),
}

enum ExecutableDeployItem {
    ModuleBytes {
        module_bytes: Vec<u8>,
        args: RuntimeArgs,
    },
    StoredContractByHash {
        hash: [u8; 32],
        entry_point: String,
        args: RuntimeArgs,
    },
    StoredContractByName {
        name: String,
        entry_point: String,
        args: RuntimeArgs,
    },
    StoredVersionedContractByHash {
        hash: [u8; 32],
        version: Option<u32>,
        entry_point: String,
        args: RuntimeArgs,
    },
    StoredVersionedContractByName {
        name: String,
        version: Option<u32>,
        entry_point: String,
        args: RuntimeArgs,
    },
    Transfer { args: RuntimeArgs },
}

struct RuntimeArgs(Vec<NamedArg>);

struct NamedArg(String, CLValue);

struct CLValue(CLType, Vec<u8>);

enum CLType {
    Bool,
    I32,
    I64,
    U8,
    U32,
    U64,
    U128,
    U256,
    U512,
    Unit,
    String,
    Key,
    URef,
    PublicKey,
    Option(Box<CLType>),
    List(Box<CLType>),
    ByteArray(u32),
    Result { ok: Box<CLType>, err: Box<CLType> },
    Map { key: Box<CLType>, value: Box<CLType> },
    Tuple1([Box<CLType>; 1]),
    Tuple2([Box<CLType>; 2]),
    Tuple3([Box<CLType>; 3]),
    Any,
}

struct Approval {
    signer: PublicKey,
    signature: Signature,
}

enum Signature {
    System,
    Ed25519(Vec<u8>),
    Secp256k1(Vec<u8>),
}

struct FinalizedApprovalsWithId {
    id: DeployHash,
    approvals: FinalizedApprovals,
}

struct FinalizedApprovals(BTreeSet<Approval>);

struct Block {
    hash: BlockHash,
    header: BlockHeader,
    body: BlockBody,
}

struct BlockHash(Digest);

struct BlockHeader {
    parent_hash: BlockHash,
    state_root_hash: Digest,
    body_hash: Digest,
    random_bit: bool,
    accumulated_seed: Digest,
    era_end: Option<EraEnd>,
    timestamp: u64,
    era_id: u64,
    height: u64,
    protocol_version: ProtocolVersion,
}

struct EraEnd {
    era_report: EraReport,
    next_era_validator_weights: BTreeMap<PublicKey, U512>,
}

struct EraReport<VID> {
    equivocators: Vec<PublicKey>,
    rewards: BTreeMap<PublicKey, u64>,
    inactive_validators: Vec<PublicKey>,
}

struct ProtocolVersion {
    major: u32,
    minor: u32,
    patch: u32,
}

struct BlockBody {
    proposer: PublicKey,
    deploy_hashes: Vec<DeployHash>,
    transfer_hashes: Vec<DeployHash>,
}
```

Custom variable length encoding is used when serializing `U512`, `U256` and `U128` types.  They are encoded in a way equivalent to encoding the following pseudo struct:

```rust
struct Bigint {
    serialized_length: u8,
    little_endian_unpadded_bytes: [u8, serialized_length - 1],
}
```

In other words, the following steps are taken:
* convert the bigint to an array of bytes in little-endian form
* strip the contiguous range of irrelevant padding `0` bytes from the right hand end, if any
* prefix this remaining array with a byte holding the number of remaining bytes + 1, to indicate the length of the final byte array including the length byte itself

For a description explaining the use of `TrieOrChunk` and related types, see the "Trie chunking" section.  The relevant types are:

```rust
struct TrieOrChunkId(u64, Digest);

enum TrieOrChunk {
    Trie(Bytes),
    ChunkWithProof(ChunkWithProof),
}

struct ChunkWithProof {
    proof: IndexedMerkleProof,
    chunk: Bytes,
}

struct IndexedMerkleProof {
    index: u64,
    count: u64,
    merkle_proof: Vec<Digest>,
}
```

`BlockHeadersBatchId` is used to request multiple `BlockHeader`s with a single request.

```rust
struct BlockHeadersBatchId {
    highest: u64,
    lowest: u64,
}

struct BlockWithMetadata {
    block: Block,
    finality_signatures: BlockSignatures,
}

struct BlockHeaderWithMetadata {
    block_header: BlockHeader,
    block_signatures: BlockSignatures,
}

struct BlockSignatures {
    block_hash: BlockHash,
    era_id: u64,
    proofs: BTreeMap<PublicKey, Signature>,
}

struct BlockAndDeploys {
    block: Block,
    deploys: Vec<Deploy>,
}

struct BlockHeadersBatch(Vec<BlockHeader>);
```

## Finality Signatures

The `Payload::FinalitySignature` variant is used when broadcasting finality signatures.

A node that is an active validator MUST create and broadcast, i.e. send to all connected peers, a finality signature for every valid block it receives or creates.

## Trie Chunking

Large trie nodes are split when transferred across the network, according to `CHUNK_SIZE_BYTES`, which is set to 8388608 bytes (8 megabytes). Any trie node that is less than 8388608 in size will be represented by a `TrieOrChunk::Trie` instance.

Should a trie node be larger than this, a Merkle tree is constructed with `CHUNK_SIZE_BYTES` sized chunks and is identified by the root hash of the resulting tree instead.

Peers MUST only request chunks. The `TrieOrChunkId` type allows for requesting the n-th chunk of a given trie node. See the [casper-hashing](https://docs.rs/casper-hashing) crate for details.

A node receiving a `TrieOrChunk` item from a peer MUST validate it by checking the given Merkle proof against the item hash (which is the tree's root hash), before accepting it.
