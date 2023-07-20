# Signing Deploys

When creating a [`Deploy`](../../concepts/serialization-standard.md#serialization-standard-deploy) to be executed on a Casper network, the account owner, or more accurately, enough authorized signers must sign the deploy using their account's cryptographic key-pair. This key-pair is a combination of the account's secret and public keys. The signatures attached to the Deploy allow the network to verify that it should be executed.

When a signature is attached to a deploy, it is paired with the public key of the signer, and referred to as an [`Approval`](../../concepts/serialization-standard.md#approval).  Every valid deploy has at least one approval.

The signature creation process begins with the hashing of the payment and session of the deploy to create the `BodyHash`. The `BodyHash` becomes a component of the [`DeployHeader`](../../concepts/serialization-standard.md#deploy-header) as outlined in the serialization standard. From there, the `DeployHeader` can be hashed to create the [`DeployHash`](../../concepts/serialization-standard.md#deploy-hash). As outlined above, the `DeployHash` is then combined with the account's key-pair to create the deploy's signature.

As the `DeployHash` contains a hash of the deploy's body within, any variation to any aspect of the deploy or sending account's keys would render the `DeployHash` invalid.

## Public Key Cryptography

Casper networks are compatible with both `Ed25519` and `Secp256k1` public key cryptography. When [serialized](../../concepts/serialization-standard.md), public keys and signatures are prefixed with a single byte, used as a tag to denote the applicable algorithm. Ed25519 public keys and signatures are prefixed with `1`, whereas Secp256k1 are prefixed with `2`.

Casper uses `blake2b` hashing within our [serialization](../../concepts/serialization-standard.md). However, these hashed values will be hashed once again when they are signed over. The type of hashing depends on the associated keypair algorithm as follows:

* Ed25519 signs over a SHA-512 digest.

* Secp256k1 signs over a SHA-256 digest.