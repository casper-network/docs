# Signing a Deploy

When creating a [`Deploy`](/design/serialization-standard/#serialization-standard-deploy) to be executed on a Casper network, the account owner, or more accurately, enough authorized signers must sign the deploy using their account's cryptographic key-pair. This key-pair is a combination of the account's secret and public keys. The signatures attached to the Deploy allow the network to verify that it should be executed.

When a signature is attached to a deploy, it is paired with the public key of the signer, and referred to as an [`Approval`](/design/serialization-standard/#approval).  Every valid deploy has at least one approval.

The signature creation process begins with the hashing of the payment and session of the deploy to create the `BodyHash`. The `BodyHash` becomes a component of the [`DeployHeader`](/design/serialization-standard/#deploy-header) as outlined in the serialization standard. From there, the `DeployHeader` can be hashed to create the [`DeployHash`](/design/serialization-standard/#deploy-hash). As outlined above, the `DeployHash` is then combined with the account's key-pair to create the deploy's signature.

As the `DeployHash` contains a hash of the deploy's body within, any variation to any aspect of the deploy or sending account's keys would render the `DeployHash` invalid.

## Public Key Cryptography

Casper networks are compatible with both `Ed25519` and `secp256k1` public key cryptography. When [serialized](/design/serialization-standard/), public keys and signatures are prefixed with a single byte, used as a tag to denote the applicable algorithm. Ed25519 public keys and signatures are prefixed with `1`, whereas secp256k1 are prefixed with `2`.

The signing process differs slightly between the two algorithms, as shown in the expandable code samples below. Ed25519 uses an exapnded version of the secret key alongside the public key to create the signature. In contrast, secp256k1 uses the secret key directly.

<details>
<summary><b>Ed25519 Code Example</b></summary>

```
(SecretKey::Ed25519(secret_key), PublicKey::Ed25519(public_key)) => {
    let expanded_secret_key = ExpandedSecretKey::from(secret_key);
    let signature = expanded_secret_key.sign(message.as_ref(), public_key);
    Signature::Ed25519(signature)
}
```
</details>

<details>
<summary><b>secp256k1 Code Example</b></summary>

```
(SecretKey::Secp256k1(secret_key), PublicKey::Secp256k1(_public_key)) => {
    let signer = secret_key;
    let signature: Secp256k1Signature = signer
        .try_sign(message.as_ref())
        .expect("should create signature");
    Signature::Secp256k1(signature)
}
```
</details>
