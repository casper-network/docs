# Undelegating Tokens with the Casper Client

This document details a workflow where tokens delegated to a validator on a Casper network can be undelegated.

## Prerequisites

1. You meet all [prerequisites](../prerequisites.md), including having a valid `node-address` and the Casper command-line client
2. You have [delegated tokens](./delegate.md) to a validator on a Casper network and you have the validator's public key

## Sending the Undelegation Request {#sending-the-undelegation-deploy}

There are two ways to undelegate CSPR from a validator. The recommended and cheaper method is to call the `undelegate` entry point from the system auction contract. The second method involves building the `undelegate.wasm` from the `casper-node` repository and installing it on the network.

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

## Method 1: Undelegating with the System Auction Contract {#undelegating-system-auction}

This method calls the existing `undelegate` entry point from the system auction contract. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-hash <SESSION_HASH> \
--session-entry-point undelegate \
--session-arg "validator:public_key='<HEX_ENCODED_VALIDATOR_PULIC_KEY>'" \
--session-arg "amount:u512='<AMOUNT_TO_UNDELEGATE>'" \
--session-arg "delegator:public_key='<HEX_ENCODED_DELEGATOR_PULIC_KEY>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-hash` - Hex-encoded hash of the stored auction contract, which depends on the network you are using. For Casper's Mainnet and Testnet, the hashes are as follows:

- **Testnet**: `hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`
- **Mainnet**: `hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

6. `session-entry-point` - Name of the entry point that will be used when calling the contract

The `undelegate` entry point expects three arguments:

7. `validator`: The hexadecimal public key of the validator from whom the tokens will be undelegated
8. `amount`: The number of tokens to be undelegated
9. `delegator`: The hexadecimal public key of the account undelegating tokens from a validator. **This key must match the secret key that signs the delegation**

The command will return a deploy hash, which is needed to verify the deploy's processing results. Refer to the [Deploy Status](../../resources/tutorials/beginner/querying-network.md#deploy-status) section for more details.

:::note

Calling the `undelegate` entry point on the auction contract has a fixed cost of 2.5 CSPR. There is no minimum amount required for the undelegation call.

:::

**Example:**

This example shows an account delegating 100 CSPR:

```bash
casper-client put-deploy \
--node-address http://65.21.235.219:7777  \
--chain-name casper-test \
--secret-key ~/KEYS/Test_secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-e22d38bcf3454a93face78a353feaccbf1d637d1ef9ef2e061a655728ff59bbe \
--session-entry-point undelegate \
--session-arg "validator:public_key='01aa17f7b9889480b1bd34c3f94f263b229c7a9b01dd4dda19c2dd1d38d176c7a0'" \
--session-arg "amount:u512='100000000000'" \
--session-arg "delegator:public_key='01e3d3392c2e0b943abe709b25de5c353e5e1e9d95c7a76e3dd343d8aa1aa08d51'"
```

Next, [confirm the undelegation](#verifying-the-undelegation).

## Method 2: Undelegating with Compiled Wasm {#undelegating-compiled-wasm}

As part of this process, you need to [build the casper-node contracts](./delegate.md#building-the-delegation-wasm) that produce the undelegation Wasm.

Next, use the Casper CLI client to send a deploy containing the `undelegate.wasm` to the network to initiate the undelegation process.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-path <PATH_TO_WASM>/undelegate.wasm \
--session-arg "validator:public_key='<HEX_ENCODED_VALIDATOR_PULIC_KEY>'" \
--session-arg "amount:u512='<AMOUNT_TO_UNDELEGATE>'" \
--session-arg "delegator:public_key='<HEX_ENCODED_DELEGATOR_PULIC_KEY>'"
```


1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-path` - The path to where the `delegate.wasm` is located

The `undelegate` entry point expects three arguments:

6. `validator`: The hexadecimal public key of the validator from whom the tokens will be undelegated
7. `amount`: The number of tokens to be undelegated
8. `delegator`: The hexadecimal public key of the account undelegating tokens from a validator. **This key must match the secret key that signs the delegation**

The command will return a deploy hash, which is needed to verify the deploy's processing results. Refer to the [Deploy Status](../../resources/tutorials/beginner/querying-network.md#deploy-status) section for more details.

**Example:**

This example command uses the Casper Testnet to undelegate 100 CSPR:

```bash
casper-client put-deploy \
--node-address http://65.21.235.219:7777 \
--chain-name casper-test \
--secret-key ~/KEYS/secret_key.pem \
--payment-amount 20000000000 \
--session-path ~/undelegate.wasm \
--session-arg "validator:public_key='01aa17f7b9889480b1bd34c3f94f263b229c7a9b01dd4dda19c2dd1d38d176c7a0'" \
--session-arg "amount:u512='100000000000'" \
--session-arg "delegator:public_key='01e3d3392c2e0b943abe709b25de5c353e5e1e9d95c7a76e3dd343d8aa1aa08d51'"
```

Next, [confirm the undelegation](#verifying-the-undelegation).

## Verifying the Undelegation {#verifying-the-undelegation}

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
