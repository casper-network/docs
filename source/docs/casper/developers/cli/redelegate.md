# Redelegating Tokens with the Casper Client

This document details a workflow where tokens staked with a validator can be redelegated to another validator with a single call while the unbonding process runs in the background. Otherwise, delegators would have to complete two steps by sending an [unbonding request](./undelegate.md) first and then [delegate](./delegate.md) the tokens to the new validator.

## Prerequisites

1. You meet all [prerequisites](../prerequisites.md), including having a valid `node-address` and the Casper command-line client
2. You have [delegated tokens](./delegate.md) to a validator on a Casper network, and you have the validator's public key
3. You have the public key of the new validator to whom you wish to redelegate tokens. See [Acquiring a Validator's Public Key](./delegate.md#acquiring-a-validators-public-key) for more details

## Method 1: Redelegating with the System Auction Contract {#redelegating-system-auction}

This method calls the existing `redelegate` entry point from the system auction contract. Using this method, you do not need to build contracts, reducing cost and complexity.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH_TO_DELEGATOR_SECRET_KEY> \
--chain-name <CHAIN_NAME> \
--payment-amount 2500000000 \
--session-hash <SESSION_HASH> \
--session-entry-point redelegate \
--session-arg "delegator:public_key='<DELEGATOR_PUBLIC_KEY_HEX>'" \
--session-arg "validator:public_key='<CURRENT_VALIDATOR_PUBLIC_KEY_HEX>'" \
--session-arg "amount:u512='<DELEGATION_AMOUNT>'" \
--session-arg "new_validator:public_key='<NEW_VALIDATOR_PUBLIC_KEY_HEX>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR
5. `session-hash` - Hex-encoded hash of the stored auction contract, which depends on the network you are using. For Casper's Mainnet and Testnet, the hashes are as follows:

- **Testnet**: `hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`
- **Mainnet**: `hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

6. `session-entry-point` - Name of the entrypoint that will be used when calling the contract

The `redelegate` entry point expects four arguments:

7. `delegator:public_key`: The hexadecimal public key of the account submitting the redelegate request. This key must match the secret key that signs the deploy
8. `validator:public_key`: The hexadecimal public key of the validator from whom the tokens will be undelegated 
9. `amount`: The amount to be redelegated to the new validator
10. `new_validator:public_key`: The hexadecimal public key of the validator to whom the tokens will be delegated

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

Calling the `delegate` entry point on the auction contract has a fixed cost of 2.5 CSPR and there is a minimum delegation amount of 500 CSPR that also applies to redelegations.

:::

**Example:**

This example uses a private network running `casper-node` version 1.5. The payment amount specified is 2.5 CSPR. You must modify the payment and other values in the deploy based on the network's [chainspec.toml](../../concepts/glossary/C.md#chainspec).

```bash
casper-client put-deploy \
--node-address http://3.143.158.19:7777  \
--chain-name integration-test \
--secret-key ~/KEYS/integration/Test_secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-e22d38bcf3454a93face78a353feaccbf1d637d1ef9ef2e061a655728ff59bbe \
--session-entry-point redelegate \
--session-arg "validator:public_key='017fec504c642f2b321b8591f1c3008348c57a81acafceb5a392cf8416a5fb4a3c'" \
--session-arg "amount:u512='500000000000'" \
--session-arg "delegator:public_key='01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986'" \
--session-arg "new_validator:public_key='019e7b8bdec03ba83be4f5443d9f7f9111c77fec984ce9bb5bb7eb3da1e689c02d'"
```

Next, [verify the redelegation](#verifying-the-redelegation).

## Method 2: Redelegating with Compiled Wasm {#bonding-compiled-wasm}

Another way to send a redelegation is to compile the `redelegate.wasm` and send it to the network via a deploy. To compile the Wasm yourself, [build the casper-node contracts](./delegate.md#building-the-delegation-wasm) that will include the redelegation Wasm.

### Sending the redelegation request {#sending-the-redelegation-deploy}

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

This example uses the Casper client to send a deploy containing the `redelegate.wasm` to the network to initiate the redelegation process.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH_TO_DELEGATOR_SECRET_KEY> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT> \
--session-path <PATH_TO_WASM>/redelegate.wasm \
--session-arg "delegator:public_key='<DELEGATOR_PUBLIC_KEY_HEX>'" \
--session-arg "validator:public_key='<CURRENT_VALIDATOR_PUBLIC_KEY_HEX>'" \
--session-arg "amount:u512='<DELEGATION_AMOUNT>'" \
--session-arg "new_validator:public_key='<NEW_VALIDATOR_PUBLIC_KEY_HEX>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR
5. `session-path` - The path to the `redelegate.wasm` on your computer

The `redelegate.wasm` expects four arguments:

6. `delegator:public_key`: The hexadecimal public key of the account submitting the redelegate request. This key must match the secret key that signs the deploy
7. `validator:public_key`: The hexadecimal public key of the validator from whom the tokens will be undelegated 
8. `amount`: The amount to be redelegated to the new validator
9. `new_validator:public_key`: The hexadecimal public key of the validator to whom the tokens will be delegated

Save the returned _deploy_hash_ from the output to [query information](../../resources/beginner/querying-network.md#querying-deploys) about the redelegation Deploy.

:::note

Running the `redelegate.wasm` is a more expensive operation than calling the `redelegate` entrypoint from the system auction contract.

:::

**Example:**

This example uses a private network running `casper-node` version 1.5. The payment amount specified is 8 CSPR. You must modify the payment and other values in the deploy based on the network's [chainspec.toml](../../concepts/glossary/C.md#chainspec).

```bash
casper-client put-deploy \
--node-address http://3.143.158.19:7777  \
--chain-name integration-test \
--secret-key ~/KEYS/integration/Test_secret_key.pem \
--payment-amount 8000000000 \
--session-path ~/redelegate.wasm \
--session-arg "validator:public_key='017fec504c642f2b321b8591f1c3008348c57a81acafceb5a392cf8416a5fb4a3c'" \
--session-arg "amount:u512='500000000000'" \
--session-arg "delegator:public_key='01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986'" \
--session-arg "new_validator:public_key='019e7b8bdec03ba83be4f5443d9f7f9111c77fec984ce9bb5bb7eb3da1e689c02d'"
```

## Verifying the Redelegation {#verifying-the-redelegation}

The redelegation process includes an unbonding delay before the tokens are redelegated to a new validator. In contrast, initial delegation occurs when a Casper network finalizes the associated Deploy.

Due to this delay, the new validator may become inactive before the redelegation completes. If this happens, the tokens will be returned to the delegator.

Once the redelegation Deploy has been processed, you can query the auction to confirm the redelegation. This process is the same as [verifying a delegation request](./delegate.md#confirming-the-delegation) using the `casper-client get-auction-info` command.
