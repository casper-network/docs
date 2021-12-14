
# Checksum Hex Encoding

## Introduction

A checksum hex encoding is a format that includes an embedded checksum to avoid copy errors when entering account addresses. While the checksum hex format protects account addresses, it also protects all hex-encoded values. For more details, look at the specification defined in [CEP-57](https://github.com/casper-network/ceps/blob/master/text/0057-checksummed-addresses.md).

Checksum hex-encoded keys are safer to use than lowercase hex-encoded keys because they enforce the validity of the key. They make it easier to ensure that the system cannot process transactions with invalid or nonexistent keys. For example, suppose you accidentally change a character in a checksum hex-encoded key. In that case, it will make the key impossible to decode so that the system would not send tokens to invalid addresses. However, if someone accidentally changes a character in a regular hex-encoded key, the system would accept it, potentially stranding tokens in an inaccessible account.


The following [keys](../design/serialization-standard#serialization-standard-serialization-key) are checksum-hex encoded:

- Account
- Hash
- URef
- Transfer
- DeployInfo
- Balance
- Bid
- Withdraw
- Dictionary
- SystemContractRegistry

## Implementation

At a high level, the implementation in [GitHub](https://github.com/casper-network/casper-node/blob/dev/types/src/checksummed_hex.rs) follows the steps below. The implementation was
declared in [CEP-57](https://github.com/casper-network/ceps/blob/master/text/0057-checksummed-addresses.md) and released in version `1.4.2`.

1. Take a blake2b hash of the input bytes.
2. Convert the hash bytes into a cyclical stream of bits.
3. Convert the input bytes into an array of nibbles.
4. For each nibble, if the nibble is greater than `10`, meaning it's an alphabetical character `a` through `f`, check the next bit in the stream of hash bits.
5. If the bit is `1`, capitalize the character.

## How `Ed25519` and `Secp256K1` keys are encoded

For `Ed25519` and `Secp256K1` public keys, the public key bytes are hex-encoded with an embedded
checksum, then the hex-encoded public key tag is concatenated to the beginning of the encoded
public key.

**Example**:

For the Ed25519 public key `01ccDBB42854759141910c134D67cfAf0E78a93AdD396d43045fAa3A567DcABd84`, the encoded public key `ccDBB42854759141910c134D67cfAf0E78a93AdD396d43045fAa3A567DcABd84` is concatenated with the key tag for ed25519 public keys `01`.

You can find the implementation on [GitHub](https://github.com/casper-network/casper-node/blob/dev/types/src/checksummed_hex.rs).


## Backward Compatibility

Version `1.4.2` is backward-compatible with lower-hex encoded keys, so if you use a public key encoded in lowercase hex, the network will still be able to decode the public key and use it in a transaction.