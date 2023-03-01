# Redelegating Tokens with the Casper Client

This document details a workflow where tokens delegated to a validator can be redelegated to another validator without sending an [unbonding request](./undelegate.md) first. The unbonding process will happen in the background.

## Prerequisites

1. You meet all [prerequisites](../prerequisites.md), including having a valid `node-address` and the Casper command-line client
2. You have [delegated tokens](./delegate.md) to a validator on a Casper network, and you have the validator's public key
3. As part of the delegation process, you have [built the casper-node contracts](./delegate.md#building-the-delegation-wasm) that produced the redelegation Wasm to execute on the network
4. You have the public key of the new validator to whom you wish to redelegate tokens. See [Acquiring a Validator's Public Key](./delegate.md#acquiring-a-validators-public-key) for more details

## Sending the Redelegation Request {#sending-the-redelegation-deploy}

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

In this example, we use the Casper client to send a deploy containing the `redelegate.wasm` to the network to initiate the redelegation process.

```rust
casper-client put-deploy \
--node-address http://<peer-ip-addres>:7777 \
--chain-name casper-test \
--session-path <path-to-wasm>/redelegate.wasm \
--payment-amount 20000000000 \
--session-arg "validator:public_key='<hex-encoded-validator-public-key>'" \
--session-arg "amount:u512='<amount-to-delegate>'" \
--session-arg "delegator:public_key='<hex-encoded-public-key>'" \
--session-arg "new_validator:public_key='<hex-encoded-public-key>'" \
--secret-key <delegator-secret-key>.pem
```

**Note** The delegator's public key and the secret key that signs the deploy must be part of the same account key pair.

**Request fields:**

-   `node-address` - An IP address of a node on the network

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for Testnet is **casper-test**
    -   The _chain-name_ for Mainnet is **casper**

-   `session-path` - The path to where the `redelegate.wasm` is located

-   `session-arg` - The arguments to the `redelegate` request

    -   The argument `validator` is the public key of the validator from whom the tokens will be redelegated
    -   The argument `amount` is the number of tokens to be redelegated
    -   The argument `delegator` is the public key of the account redelegating tokens from a validator

**Important response fields:**

-   `"result"."deploy_hash"` - The hash of the redelegation Deploy

Save the returned _deploy_hash_ from the output to [query information](../../resources/tutorials/beginner/querying-network.md#querying-deploys) about the redelegation Deploy.

## Verifying the Redelegation {#asserting-the-redelegation}

The redelegation process includes an unbonding delay before the tokens are redelegated to a new validator. In contrast, initial delegation occurs as soon as a Casper network finalizes the associated Deploy.

Due to this delay, the new validator may become inactive before the redelegation completes. If this happens, the tokens will be returned to the delegator.

Once the redelegation Deploy has been processed, you can query the auction to confirm the redelegation. This process is the same as [verifying a delegation request](./delegate.md#confirming-the-delegation) using the `casper-client get-auction-info` command.
