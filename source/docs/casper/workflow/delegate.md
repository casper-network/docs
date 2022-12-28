# Delegating with the Casper Client

This document details a workflow where an account holder on a Casper network can delegate tokens to a validator.

## Prerequisites

1. You meet all prerequisites listed [here](setup.md), including having a valid `node-address` and the Casper command-line client
2. You have previously [deployed a smart contract](/dapp-dev-guide/building-dapps/sending-deploys.md) to a Casper network

The workflow will take you through two additional prerequisites before sending the [delegation request](/workflow/delegate/#executing-the-delegation-request):

3. Building the delegation contract or Wasm to execute on the network
4. Getting the public key of a validator on the network

### Building The Delegation Wasm {#building-the-delegation-wasm}

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

### Acquiring a Validator's Public Key {#acquiring-a-validators-public-key}

The official Casper Testnet and Mainnet provide a browser-based block explorer to look up the list of validators:

1.  [Validators on Mainnet](https://cspr.live/validators)
2.  [Validators on Testnet](https://testnet.cspr.live/validators)

You will see a list of validators present on the network and their total stake (including tokens from other delegators).

You can click on any validator listed to see more information about the validator, including the validator's personal stake.

As a prospective delegator, selecting a trustworthy validator with a favorable rate is essential. Each validator shows the delegation rate (commission), which represents the percentage of **your** reward share that the validator will retain. Thus, a 10% rate implies that the validator will retain 10% of your reward share. Please do your due diligence before staking your tokens with a validator.

Note the `PublicKey` of the validator you have selected to delegate your tokens.

Suppose you observe your delegation request in the bid structure but do not see the associated validator key in the `era_validators` structure. In that case, the validator you selected is not part of the current validator set. In this event, your tokens will only be earning rewards if you un-delegate, wait through the unbonding period, and re-delegate to another validator.

Additionally, any rewards earned are re-delegated by default to the validator from the initial delegation request. Therefore at the time of un-delegation, you should consider un-delegating the initial amount plus any additional rewards earned through the delegation process.

The active validator set constantly rotates; therefore, when delegating to a validator, remember that the validator you selected may have been rotated out of the set.

## Sending the Delegation Request {#sending-the-delegation-request}

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

In this example, we use the Casper client to send a deploy containing the `delegate.wasm` to the network to initiate the delegation process.

```rust
casper-client put-deploy \
--node-address http://<peer-ip-address>:7777/rpc \
--chain-name casper \
--session-path <path-to-wasm>/delegate.wasm \
--payment-amount 5000000000 \
--session-arg "validator:public_key='<hex-encoded-validator-public-key>'" \
--session-arg "amount:u512='<amount-to-delegate>'" \
--session-arg "delegator:public_key='<hex-encoded-public-key>'" \
--secret-key <delegator-secret-key>.pem
```

**Note** The delegator's public key and the secret key that signs the deploy must be part of the same key pair.

**Request fields:**

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

-   `secret-key` - Path to the secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for testnet is **casper-test**
    -   The _chain-name_ for mainnet is **casper**

-   `session-path` - The path to where the `delegate.wasm` is located

-   `session-arg` - The arguments to the `delegate` execution

    -   The argument `validator` is the public key of the validator to whom the tokens will be delegated
    -   The argument `amount` is the number of tokens to be delegated
    -   The argument `delegator` is the public key of the account delegating tokens to a validator

**Important response fields:**

-   `"result"."deploy_hash"` - the address of the executed delegation request.

Save the returned _deploy_hash_ from the output to query information about the delegation deploy later.

Refer to the [Deploy Status](querying.md#deploy-status) section to learn how to confirm that your deploy was executed successfully.

### Confirming the Delegation {#confirming-the-delegation}

A Casper network maintains an _auction_ where validators _bid_ on slots to become part of the active validator set. Delegation rewards are only earned for a validator who has won the auction and is part of the active set. Thus to ensure the delegated tokens can earn rewards, we must first check that:

1.  Our delegation is part of the _bid_ to the _auction_
2.  The validator is part of the _active_ validator set

Once the deploy has been executed, we can query the auction for information to confirm our delegation. We can use the Casper command-line client to create an RPC request with the following query:

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777/rpc
```

**Request fields**:

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

The `get-auction-info` call will return all the bids currently in the auction contract and the list of active validators for `4` future eras from the present era.

Below is a sample output:

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

The delegation request has been processed successfully if your public key and associated amount appear in the `bid` data structure. However, this does not mean the associated validator is part of the validator set, so you must check the validator status.

### Checking Validator Status {#checking-validator-status}

The auction maintains a field called `era_validators`, which contains the validator information for 4 future eras from the current era. An entry for a specific era lists the `PublicKeys` of the active validators for that era, along with their stake in the network.

If a validator is part of the set, its public key will be in the `era_validators` field as part of the `Auction` data structure. We can use the Casper command-line client to create an RPC request to obtain auction information and assert that the selected validator is part of the active validator set.

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777/rpc
```

**Request fields**:

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

**Important Response fields**:

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
