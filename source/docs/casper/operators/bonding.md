# Bonding

It is recommended that a bonding request be sent once the node has completed the synchronization process. Bonding in Casper takes place through the auction contract via the `add_bid.wasm` contract. The auction runs for a future era, every era. The `chainspec.toml` specifies the number of slots available, and the auction will take the top N slots and create the validator set for the future era. In the testnet, era durations are approximately two hours. The entire process takes approximately 3 eras. Therefore, the time for bid submission to inclusion in the validator set is a minimum of six hours. Bonding requests (bids) are transactions like any other. Because they are generic transactions, they are more resistant to censorship.

## Security and Bonding {#security-and-bonding}

The most secure way to send a bonding transaction is to compile the contract and send the request to the network. Because the transaction authorizes the token to be locked into the auction contract, it's really important to compile the contract yourself. Here are the steps to take:

1. Fork and clone the [`casper-node` repository](https://github.com/casper-network/casper-node)
2. Make sure that [all prerequisites](https://github.com/casper-network/casper-node#pre-requisites-for-building) are installed
3. [Build the contracts](#build-contracts)
4. Ensure that the keys you will use for bonding [are available and have been funded](../setup/#create-fund-keys)
5. Create the bonding transaction and deploy it, see [Example Bonding Transaction](#example-bonding-transaction)
6. Query the system to verify that your bid was accepted, see [Check the Status of the Transaction](#check-the-status-of-the-transaction)
7. Check the status of the auction to see if you have won a slot, see [Check the Status of the bid in the Auction](#check-the-status-of-the-bid-in-the-auction)

## Build the Contracts {#build-contracts}

Because bonding transactions are generic transactions, it is necessary to build the contract that submits a bid. Clone the casper-node repository and build the contracts. To build contracts, set up Rust and install all dependencies. For detailed instructions, see [Installing Rust](/dapp-dev-guide/getting-started/#installing-rust).

Build the contracts in release mode.

```bash
make setup-rs
make build-client-contracts
```
These commands build all the necessary contracts, of which `add-bid.wasm` is the contract for placing a bid. 

## Example Bonding Transaction {#example-bonding-transaction}

The following example deploys a bonding request on the network:

```bash
sudo -u casper casper-client put-deploy \
--chain-name <CHAIN_NAME> \
--node-address http://<HOST:PORT> \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/add_bid.wasm \
--payment-amount 3000000000 \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<BID-AMOUNT>'" \
--session-arg="delegation_rate:u8='<PERCENT_TO_KEEP_FROM_DELEGATORS>'"
```

Note the following in the above command: 
- The chain name for Mainnet is `casper` and for Testnet is `casper-test`
- The default port for node address is 7777
- The session arguments need to be encased in double-quotes, with the parameter values in single quotes
- The payment amount is specified in motes, where 1 CSPR is 1,000,000,000 motes

### Contract Arguments {#contract-arguments}

The add_bid contract accepts 3 arguments:

- `public_key`: The hexadecimal public key of the account to bond. This must be the one paired with the secret key used in the `--secret-key` argument
- `amount`: This is the amount being bid. If the bid wins, this will be the validator's initial bonded amount
- `delegation_rate`: The percentage of rewards that the validator retains from delegators that delegate their tokens to the node

## Check the Status of the Transaction {#check-the-status-of-the-transaction}

Since this is a deployment like any other, it's possible to perform `get-deploy` using the client, which will return the execution status.

```bash
casper-client get-deploy --node-address http://<HOST:PORT> <DEPLOY_HASH>
```

## Check the Status of the bid in the Auction {#check-the-status-of-the-bid-in-the-auction}

If the bid wins the auction, the public key and associated bonded amount will appear in the auction contract as part of the validator set for a future era. To determine if the bid was accepted, query the auction contract:

```bash
casper-client get-auction-info --node-address http://<HOST:PORT>
```

The request returns a response that looks like this:

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

Note the `era_id` and the `validator_weights` sections of the response. The current era is the one with the lowest ID in the `era_validators` array. For a given `era_id`, a set of validators is defined. If the public key associated with a bid appears in the `validator_weights` structure for an era, then the account is bonded in that era.

## If the Bid doesn't win {#if-the-bid-doesnt-win}

If your bid doesn't win a slot in the auction, it is because your bid is too low. The resolution for this problem is to increase your bid amount. It is possible to submit additional bids, to increase the odds of winning a slot. It is also possible to encourage token holders to delegate stake to you for bonding.

## Withdrawing a Bid {#withdrawing-a-bid}

Follow the steps in [Unbonding](unbonding.md) to withdraw a bid.
