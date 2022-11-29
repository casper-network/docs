# Re-delegating with the Casper Client

This document details a workflow where an account holder on the Casper Network can re-delegate their tokens to a new validator on a Casper Network.

This workflow assumes:

1.  You meet the [prerequisites](setup.md)
2.  You are using the Casper command-line client
3.  You have the public keys of your previous validator and a new validator on a Casper Network
4.  You have the re-delegation contract or Wasm to execute on the network
5.  You have a valid `node-address`
6.  You have previously [deployed a smart contract](/dapp-dev-guide/building-dapps/sending-deploys.md) to a Casper Network
7.  You have previously [delegated](workflow/delegate) tokens to a validator on a Casper Network.

## Building The Re-delegation Wasm {#building-the-delegation-wasm}

Obtain the `redelegate.wasm` by cloning the [casper-node](https://github.com/casper-network/casper-node) repository.

To build contracts, [set up Rust](dapp-dev-guide/writing-contracts/getting-started.md), and install all dependencies. After this, you can build the contract using the following command:

```rust
make build-contract-rs
```

Alternately, use the following command if you are building using AssemblyScript:

```
make build-contract-as
```

Once you build the contracts, you can use `redelegate.wasm` to create a deploy that will initiate the re-delegation process. The Wasm can be found in:

    target/wasm32-unknown-unknown/release

## Acquiring a New Validator's Public Key {#acquiring-a-validators-public-key}

Information on acquiring a new validator's public key can be found in the [Delegating with the Command-line](workflow/delegate#acquiring-a-validators-public-key) document.

## Executing the Re-delegation Request {#executing-the-delegation-request}

We recommend first testing the following steps on our official Testnet before performing these steps in a live environment like the Casper Mainnet.

### Sending the Re-delegation Deploy {#sending-the-delegation-deploy}

Send a deploy containing the `redelegate.wasm` to the network to initiate the re-delegation process. Here is an example deployment of the re-delegation request:

```bash
casper-client put-deploy \
--node-address http://<peer-ip-address>:7777/rpc \
--chain-name casper \
--session-path <path-to-wasm>/redelegate.wasm \
--payment-amount 5000000000 \
--session-arg "validator:public_key='<hex-encoded-validator-public-key>'" \
--session-arg "amount:u512='<amount-to-re-delegate>'" \
--session-arg "delegator:public_key='<hex-encoded-public-key>'" \
--session arg "new_validator:public_key='<hex-encoded-public-key>'" \
--secret-key <delegator-secret-key>.pem
```

**Note** The delegator's public key and the secret key that signs the deploy must be part of the same key pair.

**Request fields:**

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default: <http://localhost:7777>\]

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for testnet is **casper-test**
    -   The _chain-name_ for mainnet is **casper**

-   `session-path` - The path to where the `redelegate.wasm` is located

-   `session-arg` - The arguments to the `redelegate` execution

    -   The argument `validator` is the public key of the original validator to which the tokens were delegated
    -   The argument `amount` is the number of tokens to be re-delegated
    -   The argument `delegator` is the public key of the account re-delegating tokens to a new validator
    -   The argument `new_validator` is the public key of the new validator to which the tokens are being re-delegated.

**Important response fields:**

-   `"result"."deploy_hash"` - the address of the executed re-delegation request.

Save the returned _deploy_hash_ from the output to query information about the re-delegation deploy later.

Refer to the [Deploy Status](querying.md#deploy-status) section to learn how to confirm that your deploy was executed successfully.

### Observing and Confirming the Re-delegation {#confirming-the-delegation}

Initial delegation occurs as soon as a Casper Network finalizes the associated deploy. In contrast, re-delegation requires that tokens wait through an unbonding delay before the new delegation.

Due to this delay, the new validator may become inactive before completing the re-delegation. If the new validator's staked amount is zero, the tokens to be redelegated are returned to the delegator.

A Casper Network maintains an auction where validators bid on slots to become part of the active validator set. Delegation rewards are only earned for a validator who has won the auction and is part of the active set.

Once the deploy has been executed, we can query the auction for information to confirm our re-delegation. We can use the Casper command-line client to create an RPC request with the following query:

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777/rpc
```

**Request fields**:

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default: <http://localhost:7777>\]

The `get-auction-info` call will return all the bids currently in the auction contract and the list of active validators for `4` future eras from the present era.

Below is a sample output:

```bash
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

If your public key and associated amount appear in the `bid` data structure, this means that the re-delegation request has been processed successfully. However, this does not mean the associated validator is part of the validator set, so you need to check the validator status.

### Checking Validator Status {#checking-validator-status}

The auction maintains a field called `era_validators`, which contains the validator information for 4 future eras from the current era. An entry for a specific era lists the `PublicKeys` of the active validators for that era along with their stake in the network.

If a validator is part of the set, its public key will be present in the `era_validators` field as part of the `Auction` data structure. We can use the Casper command-line client to create an RPC request to obtain auction information and assert that the selected validator is part of the active validator set.

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777/rpc
```

**Request fields**:

-   `node-address` - <HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default: <http://localhost:7777>\]

**Important Response fields**:

In the response, check the `"auction_state"."era_validators"` structure, which should contain the public key of the selected validator for the era in which the validator will be active.

Below is an example of the `era_validators` structure:

```bash
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

**Note**: Validators earn delegation rewards only when they are part of the active set. This information is time-sensitive; therefore, a validator selected today may not be part of the set tomorrow. Keep this in mind when creating a re-delegation request.
