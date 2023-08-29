---
title: Delegating Tokens
---

# Delegating with the Casper Client

This document details a workflow where an account holder on a Casper network can delegate tokens to a validator.

## Prerequisites

1. You meet all prerequisites listed [here](../prerequisites.md), including having a valid `node-address` and the Casper command-line client
2. You have previously [installed a smart contract](../cli/sending-deploys.md) to a Casper network
3. [Acquiring a Validator's Public Key](#acquiring-a-validators-public-key)

### Acquiring a Validator's Public Key {#acquiring-a-validators-public-key}

This workflow will take you through the additional prerequisite to acquire a validator's public key before sending the [delegation request](./delegate.md#sending-the-delegation-request).

Any rewards earned are also redelegated by default to the validator from the initial delegation request. Therefore at the time of undelegation, you should consider undelegating the initial amount plus any additional rewards earned through the delegation process.

The active validator set constantly rotates; therefore, when delegating to a validator, remember that the validator you selected may have been rotated out of the set.

## Sending the Delegation Request {#sending-the-delegation-request}

There are two ways to delegate CSPR to a validator. The recommended and cheaper method is to call the `delegate` entry point from the system auction contract. The second method involves building the `delegate.wasm` from the `casper-node` repository and installing it on the network.

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

:::note

The minimum amount to delegate is 500 CSPR (500,000,000,000 motes).

:::

### Method 1: Delegating with the System Auction Contract {#delegating-system-auction}

This method calls the existing `delegate` entry point from the system auction contract. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-hash <SESSION_HASH> \
--session-entry-point delegate \
--session-arg "validator:public_key='<HEX_ENCODED_VALIDATOR_PULIC_KEY>'" \
--session-arg "amount:u512='<AMOUNT_TO_DELEGATE>'" \
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

The `delegate` entry point expects three arguments:

7. `validator`: The hexadecimal public key of the validator receiving the delegated tokens
8. `amount`: The number of tokens to be delegated
9. `delegator`: The hexadecimal public key of the account delegating tokens to a validator. **This key must match the secret key that signs the delegation**

The command will return a deploy hash, which is needed to verify the deploy's processing results. Refer to the [Deploy Status](../../resources/beginner/querying-network.md#deploy-status) section for more details.

:::note

Calling the `delegate` entry point on the auction contract has a fixed cost of 2.5 CSPR.

:::

**Example:**

This example shows an account delegating 500 CSPR:

```bash
casper-client put-deploy \
--node-address http://65.21.75.254:7777  \
--chain-name casper-test \
--secret-key ~/KEYS/secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point delegate \
--session-arg "validator:public_key='01aa17f7b9889480b1bd34c3f94f263b229c7a9b01dd4dda19c2dd1d38d176c7a0'" \
--session-arg "amount:u512='500000000000'" \
--session-arg "delegator:public_key='01e3d3392c2e0b943abe709b25de5c353e5e1e9d95c7a76e3dd343d8aa1aa08d51'"
```

Next, [confirm the delegation](#confirming-the-delegation).

### Method 2: Delegating with Compiled Wasm {#delegating-compiled-wasm}

Another way to send a delegation is to compile the `delegate.wasm` and send it to the network via a deploy. Here are the steps to compile the contract yourself.

#### Building the delegation Wasm {#building-the-delegation-wasm}

Obtain the `delegate.wasm` by cloning the [casper-node](https://github.com/casper-network/casper-node) repository.

```bash
git clone https://github.com/casper-network/casper-node
```

Prepare the Rust environment and then build the contracts using the [Makefile](https://github.com/casper-network/casper-node/blob/dev/Makefile) provided in the repository.

```bash
cd casper-node
make setup-rs
make build-contracts-rs
```

Once you build the contracts, you can use the `delegate.wasm` to create a deploy that will initiate the delegation process. The Wasm can be found in this directory: `target/wasm32-unknown-unknown/release/`.

```bash
ls target/wasm32-unknown-unknown/release/delegate.wasm
```

#### Sending the delegation request {#sending-the-delegation-wasm-request}

In this example, we use the Casper client to send a deploy containing the `delegate.wasm` to the network to initiate the delegation process.

```bash
casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-path <PATH_TO_WASM>/delegate.wasm \
--session-arg "validator:public_key='<HEX_ENCODED_VALIDATOR_PULIC_KEY>'" \
--session-arg "amount:u512='<AMOUNT_TO_DELEGATE>'" \
--session-arg "delegator:public_key='<HEX_ENCODED_DELEGATOR_PULIC_KEY>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-path` - The path to where the `delegate.wasm` is located

The `delegate` entry point expects three arguments:

6. `validator`: The hexadecimal public key of the validator receiving the delegated tokens
7. `amount`: The number of tokens to be delegated
8. `delegator`: The hexadecimal public key of the account delegating tokens to a validator. **This key must match the secret key that signs the delegation**

The command will return a deploy hash, which is needed to verify the deploy's processing results. Refer to the [Deploy Status](../../resources/beginner/querying-network.md#deploy-status) section for more details.

**Example:**

This example command uses the Casper Testnet to delegate 500 CSPR, and the payment amount is 6 CSPR. The payment amount varies based on each deploy and network [chainspec](../../concepts/glossary/C.md#chainspec). However, notice that this method is more expensive than the previous one that calls the delegate entry point.

```bash
casper-client put-deploy \
--node-address http://65.21.75.254:7777  \
--chain-name casper-test \
--secret-key ~/KEYS/secret_key.pem \
--payment-amount 20000000000 \
--session-path ~/delegate.wasm \
--session-arg "validator:public_key='01aa17f7b9889480b1bd34c3f94f263b229c7a9b01dd4dda19c2dd1d38d176c7a0'" \
--session-arg "amount:u512='500000000000'" \
--session-arg "delegator:public_key='01e3d3392c2e0b943abe709b25de5c353e5e1e9d95c7a76e3dd343d8aa1aa08d51'"
```

Next, [confirm the delegation](#confirming-the-delegation).


## Confirming the Delegation {#confirming-the-delegation}

A Casper network maintains an _auction_ where validators _bid_ on slots to become part of the active validator set. Delegation rewards are only earned for a validator who has won the auction and is part of the active set. Thus to ensure the delegated tokens can earn rewards, you must first check the foloowing:

1. Your delegation is part of the _bid_ to the _auction_
2. The validator is part of the _active_ validator set

Once the deploy has been processed, you can query the auction for information to confirm our delegation. Use the Casper command-line client to create an RPC request with the following query:

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777
```

**Request fields**:

-   `node-address` - An IP address of a node on the network

The `get-auction-info` call will return all the bids currently in the auction contract and the list of active validators for `4` future eras from the present era.

Below is a sample of the `bids` structure:

```json
"bids": [
{
  "bid": {
    "bonding_purse": "uref-a5ce7dbc5f7e02ef52048e64b2ff4693a472a1a56fe71e83b180cd33271b2ed9-007",
    "delegation_rate": 1,
    "delegators": [
      {
        "bonding_purse": "uref-ca9247ad56a4d5be70484303133e2d6db97f7d7385772155763749af98ace0b0-007",
        "delegatee": "0102db4e11bccb3f9d823c82b9389625d383867d00d09b343043cdbe5ca56dd1fd",
        "public_key": "010c7fef89bf1fc38363bd2ec20bbfb5e1152d6a9579c8847615c59c7e461ece89",
        "staked_amount": "1"
      },
      {
        "bonding_purse": "uref-38a2e9cad51b380e478c9a325578f4bbdaa0337b99b9ab9bf1dc2a114eb948b9-007",
        "delegatee": "0102db4e11bccb3f9d823c82b9389625d383867d00d09b343043cdbe5ca56dd1fd",
        "public_key": "016ebb38d613f2550e7c21ff9d99f6249b4ae5fb9e30938f6ece2d84a22a36b035",
        "staked_amount": "478473232415318176495746923"
      }
    ],
    "inactive": false,
    "staked_amount": "493754513995516852173468935"
  },
  "public_key": "0102db4e11bccb3f9d823c82b9389625d383867d00d09b343043cdbe5ca56dd1fd"
},
```

The delegation request has been processed successfully if your public key and associated amount appear in the `bid` data structure. However, this does not mean the associated validator is part of the validator set, so you must check the validator status recorded in the `era_validators` structure.

#### Checking Validator Status {#checking-validator-status}

The auction maintains a field called `era_validators`, which contains the validator information for 4 future eras from the current era. An entry for a specific era lists the `PublicKeys` of the active validators for that era, along with their stake in the network.

If a validator is part of the set, its public key will be in the `era_validators` field as part of the `Auction` data structure returned by `casper-client get-auction-info`.

In the response, check the `"auction_state"."era_validators"` structure, which should contain the public key of the selected validator for the era in which the validator will be active.

Below is an example of the `era_validators` structure:

```json
"block_height":105,
     "era_validators":[
        {
           "era_id":9,
           "validator_weights":[
              {
                 "public_key":"0102db4e11bccb3f9d823c82b9389625d383867d00d09b343043cdbe5ca56dd1fd",
                 "weight":"648151805935226166098427654"
              },
              {
                 "public_key":"01aa67009b37a23c7ad0ca632da5da239d5db46067d4b34125f61b04611f610baf",
                 "weight":"648151805938466925128109996"
              },
              {
                 "public_key":"01b7afa2beeddffd13458b763d7a00259f7dc0fa45498dfed05b4d7df4b7d65e2c",
                 "weight":"648151805935226166098427656"
              },
              {
                 "public_key":"01ca5463dac047cbd750d97ee42dd810cf1e081ece7d83ae4fc03b25a9ecad3b6a",
                 "weight":"648151805938466925128109998"
              },
              {
                 "public_key":"01f4a7644695aa129eba09fb3f11d0277b2bea1a3d5bc1933bcda93fdb4ad17e55",
                 "weight":"648151805938466925128110000"
              }
           ]
        },
```

In the above example, we see the public keys of the active validators in Era `9`.

**Note**: Validators earn delegation rewards only when they are part of the active set. This information is time-sensitive; therefore, a validator selected today may not be part of the set tomorrow. Keep this in mind when creating a delegation request.

If your account is on the official Testnet or Mainnet, you can use the block explorer to look up your account balance and see that the tokens have been delegated:

1.  [Testnet explorer](https://testnet.cspr.live/)
2.  [Mainnet explorer](https://cspr.live/)
