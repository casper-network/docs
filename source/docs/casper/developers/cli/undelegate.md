# Undelegating Tokens with the Casper Client

This document details a workflow where tokens delegated to a validator on a Casper network can be undelegated.

## Prerequisites

1. You meet all [prerequisites](../prerequisites.md), including having a valid `node-address` and the Casper command-line client
2. You have [delegated tokens](./delegate.md) to a validator on a Casper network and you have the validator's public key
3. As part of the delegation process, you have [built the casper-node contracts](./delegate.md#building-the-delegation-wasm) that produced the undelegation Wasm to execute on the network

## Sending the Undelegation Request {#sending-the-undelegation-deploy}

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

In this example, we use the Casper client to send a deploy containing the `undelegate.wasm` to the network to initiate the undelegation process.

```rust
casper-client put-deploy \
--node-address http://<peer-ip-addres>:7777 \
--chain-name casper-test \
--session-path <path-to-wasm>/undelegate.wasm \
--payment-amount <payment-in-motes> \
--session-arg "validator:public_key='<hex-encoded-validator-public-key>'" \
--session-arg "amount:u512='<amount-to-delegate>'"
--session-arg "delegator:public_key='<hex-encoded-public-key>'" \
--secret-key <delegator-secret-key>.pem
```

**Note** The delegator's public key and the secret key that signs the deploy must be part of the same account key pair.

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned

-   `node-address` - An IP address of a node on the network

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for Testnet is **casper-test**
    -   The _chain-name_ for Mainnet is **casper**

-   `session-path` - The path to where the `undelegate.wasm` is located

-   `session-arg` - The arguments to the `undelegate` request

    -   The argument `validator` is the public key of the validator from whom the tokens will be undelegated
    -   The argument `amount` is the number of tokens to be undelegated
    -   The argument `delegator` is the public key of the account undelegating tokens from a validator

## Verifying the Undelegation {#asserting-the-undelegation}

To verify that the undelegation succeeded, you can use the Casper command-line client to generate an RPC request to query the auction state. The subsequent RPC response will confirm that the undelegation request was successfully processed.

Here is how you can check the status of the auction to confirm that your bid was withdrawn:

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777
```

**Request fields**:

-   `node-address` - An IP address of a node on the network

If the public key and the amount are absent from the `bids` structure, we can safely conclude that we have indeed undelegated from the validator.

If your account is on the official Testnet or Mainnet, you can use the block explorer to look up your account balance and see that the tokens have been added to your balance:

1.  [Testnet explorer](https://testnet.cspr.live/)
2.  [Mainnet explorer](https://cspr.live/)

**Important Note**: After undelegating tokens from a validator, you must wait for the unbonding period to lapse before redelegating tokens to either the same validator or a different validator.
