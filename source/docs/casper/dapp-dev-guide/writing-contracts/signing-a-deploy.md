# Signing a Deploy

When sending a [`Deploy`](/design/serialization-standard/#serialization-standard-deploy) to a Casper network, the sending user must sign the deploy using their account's cryptographic key-pair. This key-pair derives from a combination of the account's secret and public keys. The signing process verifies that the deploy originates from the claimed account, thereby ensuring any actions taken on the network are genuine.

A deploy's signature consists of three parts:

* The [`DeployHash`](/design/serialization-standard/#deploy-hash)

* The sending account's [secret key](/glossary/S/#secret-key)

* Th sending account's [public key](/design/serialization-standard/#publickey)

A sent deploy initially possesses an empty [`Approvals`](/design/serialization-standard/#approval) set. When the account signs the deploy, this constitutes the first `approval`.

As the `DeployHash` contains a hash of the deploy's body within, any variation to any aspect of the deploy or sending account's keys would render the `DeployHash` invalid.

## Public Key Cryptography

Casper networks are compatible with both `Ed25519` and `Secp256k1` public key cryptography. When a signature goes through the process of [serialization](/design/serialization-standard/), an Ed25519 key will come prefixed with a `1`, where an Secp256k1 features a prefixed `2`.