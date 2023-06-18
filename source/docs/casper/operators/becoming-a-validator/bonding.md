# Bonding as a Validator

It is recommended that a bonding request be sent once the node has completed the synchronization process. In a Casper network, bonding takes place through the auction contract via the `add_bid.wasm` contract. The auction runs for a future era, every era. The `chainspec.toml` specifies the number of slots available, and the auction will take the top N slots and create the validator set for the future era. 

In the Testnet, era durations are approximately two hours. The entire process takes approximately 3 eras. Therefore, **the time for bid submission to inclusion in the validator set is a minimum of six hours**. Bonding requests (bids) are transactions like any other. Because they are generic transactions, they are more resistant to censorship.

## Method 1: Bonding with the System Auction Contract {#bonding-system-auction}

This method submits a bid using the system auction contract. Call the existing `add_bid` entry point from the system auction contract. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
sudo -u casper casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-hash <SESSION_HASH> \
--session-entry-point add_bid \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<BID_AMOUNT>'" \
--session-arg="delegation_rate:u8='<PERCENT_TO_KEEP_FROM_DELEGATORS>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-hash` - Hex-encoded hash of the stored auction contract, which depends on the network you are using. For Casper's Mainnet and Testnet, the hashes are as follows:

- **Testnet**: `hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`
- **Mainnet**: `hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

6. `session-entry-point` - Name of the entrypoint that will be used when calling the contract

The `add_bid` entry point expects three arguments:

7. `public key`: The hexadecimal public key of the account's purse submitting the bid. This key must match the secret key that signs the bid
8. `amount`: The bidding amount
9. `delegation_rate`: Percentage of the rewards that the node operator retains for their services

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

Calling the `add_bid` entry point on the auction contract has a fixed cost of 2.5 CSPR.

:::

**Example:**

This example command uses the Casper Testnet to bid 10,000 CSPR for a validating slot:

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777 \
--chain-name casper-test \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point add_bid \
--session-arg "public_key:public_key='01c297d2931fec7e22b2fb1ae3ca5afdfacc2c82ba501e8ed158eecef82b4dcdee'" \
--session-arg "amount:U512='$[10000 * 1000000000]'" \
--session-arg="delegation_rate:u8='10'"
```

Next, [check the status of the auction](#check-the-status-of-the-bid-in-the-auction) to see if you have won a validator slot.

## Method 2: Bonding with Compiled Wasm {#bonding-compiled-wasm}

Another way to send a bonding transaction is to compile the `add_bid.wasm` and send it to the network via a deploy. Here are the steps to compile the contract yourself:

1. Clone the [`casper-node` repository](https://github.com/casper-network/casper-node)
2. Install these prerequisites, which are also listed [here](https://github.com/casper-network/casper-node#pre-requisites-for-building).

- [Rust](../../developers/writing-onchain-code/getting-started.md#installing-rust)
- [CMake](https://cgold.readthedocs.io/en/latest/first-step/installation.html)
- `pkg-config` - On Ubuntu, use `sudo apt-get install pkg-config`
- `openssl` - On Ubuntu, use `sudo apt-get install openssl`
- `libssl-dev` - On Ubuntu, use `sudo apt-get install libssl-dev`

3. Install the [Rust casper-client](../../developers/prerequisites.md#the-casper-command-line-client) and fund the [keys](../setup/basic-node-configuration.md#create-fund-keys) you will use for bonding 
4. [Build the contracts](#build-contracts)
5. [Send the bonding request](#example-bonding-transaction)
6. [Check the status of the auction](#check-the-status-of-the-bid-in-the-auction) to see if you have won a validator slot

### Building the contracts {#build-contracts}

Using this method, you must build the contract that submits the bid. Build the following client contracts in release mode:

```bash
cd casper-node
make setup-rs
make build-client-contracts
```

These commands build all the necessary contracts, including `add_bid.wasm` for placing a bid. 

### Submitting the bonding request {#example-bonding-request}

The following deploy is a template for sending a bonding request:

```bash
sudo -u casper casper-client put-deploy \
--node-address http://<HOST:PORT> \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT> \
--session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/add_bid.wasm \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<BID-AMOUNT>'" \
--session-arg="delegation_rate:u8='<PERCENT_TO_KEEP_FROM_DELEGATORS>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes
5. `session-path` - The path to the compiled Wasm on your computer

The `add_bid.wasm` expects three arguments:

7. `public key`: The hexadecimal public key of the account's purse submitting the bid. This key must match the secret key that signs the bid
8. `amount`: The bidding amount
9. `delegation_rate`: Percentage of the rewards that the node operator retains for their services

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

This method is more expensive than calling the `add_bid` entrypoint in the system auction contract, which has a fixed cost of 2.5 CSPR.

:::

**Example:**

Here is an example request to bond using the `add_bid.wasm`. The payment amount specified is 3 CSPR. You must modify the payment and other values in the deploy based on the network's [chainspec.toml](../../concepts/glossary/C.md#chainspec).

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.235.219:7777 \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--payment-amount 3000000000 \
--session-path ~/casper-node/target/wasm32-unknown-unknown/release/add_bid.wasm \
--session-arg "public_key:public_key='01c297d2931fec7e22b2fb1ae3ca5afdfacc2c82ba501e8ed158eecef82b4dcdee'" \
--session-arg "amount:U512='$[10000 * 1000000000]'" \
--session-arg="delegation_rate:u8='10'"
```

## Checking the Bid Status {#check-the-status-of-the-bid-in-the-auction}

Since the bid was submitted using a deploy like any other, perform `get-deploy` using the `casper-client`, to see the execution status.

```bash
casper-client get-deploy --node-address http://<HOST:PORT> <DEPLOY_HASH>
```

If the bid wins the auction, the public key and associated bonded amount will appear in the auction contract as part of the validator set for a future era. To determine if the bid was accepted, query the auction contract:

```bash
casper-client get-auction-info --node-address http://<HOST:PORT>
```

<details>
<summary><b>Example auction info response</b></summary>

```bash
{
"jsonrpc": "2.0",
"result": {
 "bids": [
   {
     "bid": {
       "bonding_purse": "uref-488a0bbc3c3729f5696965da7a3aeee83805392944e36157909da273255fdb85-007",
       "delegation_rate": 0,
       "delegators": [],
       "release_era": null,
       "reward": "93328432442428418861229954179737",
       "staked_amount": "10000000000000000"
     },
     "public_key": "013f774a58f4d40bd9b6cce7e306e53646913860ef2a111d00f0fe7794010c4012"
   },
   {
     "bid": {
       "bonding_purse": "uref-14e128b099b0c3680100520226e6999b322989586cc22db0630db5ec1329f0a7-007",
       "delegation_rate": 10,
       "delegators": [],
       "release_era": null,
       "reward": "0",
       "staked_amount": "9000000000000000"
     },
     "public_key": "01405133e73ef2946fe3a2d76a4c75d305a04ad6b969f3c4a8a0d27235eb260f87"
   },
   {
     "bid": {
       "bonding_purse": "uref-6c0bf8cee1c0749dd9766376910867a84b2e826eaf6c118fcb0224c7d8d229dd-007",
       "delegation_rate": 10,
       "delegators": [],
       "release_era": null,
       "reward": "266185120443441810685787",
       "staked_amount": "100000000"
     },
     "public_key": "01524a5f3567d7b5ea17ca518c9d0320fb4a75a28a5eab58d06c755c388f20a19f"
   },
   {
     "bid": {
       "bonding_purse": "uref-3880b3daf95f962f57e6a4b1589564abf7deef58a1fb0753d1108316bba7b3d7-007",
       "delegation_rate": 10,
       "delegators": [],
       "release_era": null,
       "reward": "0",
       "staked_amount": "9000000000000000"
     },
     "public_key": "01a6901408eda702a653805f50060bfe00d5e962747ee7133df64bd7bab50b4643"
   },
   {
     "bid": {
       "bonding_purse": "uref-5a777c9cd53456b49eecf25dcc13e12ddff4106175a69f8e24a7c9a4c135df0d-007",
       "delegation_rate": 0,
       "delegators": [],
       "release_era": null,
       "reward": "93328432442428418861229954179737",
       "staked_amount": "10000000000000000"
     },
     "public_key": "01d62fc9b894218bfbe8eebcc4a28a1fc4cb3a5c6120bb0027207ba8214439929e"
   }
 ],
 "block_height": 318,
 "era_validators": [
   {
     "era_id": 20,
     "validator_weights": [
       {
         "public_key": "013f774a58f4d40bd9b6cce7e306e53646913860ef2a111d00f0fe7794010c4012",
         "weight": "10000000000000000"
       },
       {
         "public_key": "01405133e73ef2946fe3a2d76a4c75d305a04ad6b969f3c4a8a0d27235eb260f87",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01524a5f3567d7b5ea17ca518c9d0320fb4a75a28a5eab58d06c755c388f20a19f",
         "weight": "100000000"
       },
       {
         "public_key": "01a6901408eda702a653805f50060bfe00d5e962747ee7133df64bd7bab50b4643",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01d62fc9b894218bfbe8eebcc4a28a1fc4cb3a5c6120bb0027207ba8214439929e",
         "weight": "10000000000000000"
       }
     ]
   },
   {
     "era_id": 21,
     "validator_weights": [
       {
         "public_key": "013f774a58f4d40bd9b6cce7e306e53646913860ef2a111d00f0fe7794010c4012",
         "weight": "10000000000000000"
       },
       {
         "public_key": "01405133e73ef2946fe3a2d76a4c75d305a04ad6b969f3c4a8a0d27235eb260f87",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01524a5f3567d7b5ea17ca518c9d0320fb4a75a28a5eab58d06c755c388f20a19f",
         "weight": "100000000"
       },
       {
         "public_key": "01a6901408eda702a653805f50060bfe00d5e962747ee7133df64bd7bab50b4643",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01d62fc9b894218bfbe8eebcc4a28a1fc4cb3a5c6120bb0027207ba8214439929e",
         "weight": "10000000000000000"
       }
     ]
   },
   {
     "era_id": 22,
     "validator_weights": [
       {
         "public_key": "013f774a58f4d40bd9b6cce7e306e53646913860ef2a111d00f0fe7794010c4012",
         "weight": "10000000000000000"
       },
       {
         "public_key": "01405133e73ef2946fe3a2d76a4c75d305a04ad6b969f3c4a8a0d27235eb260f87",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01524a5f3567d7b5ea17ca518c9d0320fb4a75a28a5eab58d06c755c388f20a19f",
         "weight": "100000000"
       },
       {
         "public_key": "01a6901408eda702a653805f50060bfe00d5e962747ee7133df64bd7bab50b4643",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01d62fc9b894218bfbe8eebcc4a28a1fc4cb3a5c6120bb0027207ba8214439929e",
         "weight": "10000000000000000"
       }
     ]
   },
   {
     "era_id": 23,
     "validator_weights": [
       {
         "public_key": "013f774a58f4d40bd9b6cce7e306e53646913860ef2a111d00f0fe7794010c4012",
         "weight": "10000000000000000"
       },
       {
         "public_key": "01405133e73ef2946fe3a2d76a4c75d305a04ad6b969f3c4a8a0d27235eb260f87",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01524a5f3567d7b5ea17ca518c9d0320fb4a75a28a5eab58d06c755c388f20a19f",
         "weight": "100000000"
       },
       {
         "public_key": "01a6901408eda702a653805f50060bfe00d5e962747ee7133df64bd7bab50b4643",
         "weight": "9000000000000000"
       },
       {
         "public_key": "01d62fc9b894218bfbe8eebcc4a28a1fc4cb3a5c6120bb0027207ba8214439929e",
         "weight": "10000000000000000"
       }
     ]
   }
 ],
 "state_root_hash": "c16ba80ea200d786008f8100ea79f9cfeb8d7d5ee8b133eda5a50dcf1c7131e8"
},
"id": -3624528661787095850
}
```

</details>
<br></br>

Note the `era_id` and the `validator_weights` in the response above. The current era is the one with the lowest ID in the `era_validators` array. For a given `era_id`, a set of validators is defined. If the public key associated with a bid appears in the `validator_weights` structure for an era, then the account is bonded in that era.

## A Losing Bid {#losing-bid}

If a bid doesn't win a slot in the auction, it is too low. The resolution is to increase the bid amount. It is possible to submit additional bids, to increase the odds of winning a slot. It is also possible to encourage token holders to delegate stake to you for bonding.

## Avoiding Ejection {#avoiding-ejection}

To stay bonded and avoid ejection, each validator must keep their node running and in sync with the rest of the network. To recover from ejection, you will find more details [here](./recovering.md).

## Withdrawing a Bid {#withdrawing-a-bid}

Follow the steps in [Unbonding](./unbonding.md) to withdraw a bid.
