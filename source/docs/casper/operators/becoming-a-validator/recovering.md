import useBaseUrl from '@docusaurus/useBaseUrl';

# Recovering from Validator Eviction

This topic discusses the steps a validator needs to take if it is evicted from the validator set:

1. Detecting the eviction
2. Correcting any underlying node issues
3. Re-building the contracts for bonding
4. Activating the bid
5. Checking the bid

The [Inactive vs. Faulty Validator Nodes](./inactive-vs-faulty.md) topic explains why a node would be evicted.

## Detecting the Eviction

The validator selection occurs at the end of an Era. Due to the bonding delay, this determines the Validators for the Era after the Era is about to start. When a validating node does not participate in consensus for some time, it will be marked invalid and evicted at the end of the next Era.

For example, if we are in Era 100 and your node is invalid, your node will be marked for eviction to be removed at the start of Era 102. This is due to the bonding delay of 1 Era.

### Detection using CSPR.live

If you were a previous validator and still exist on the [Validators Auction](https://cspr.live/validators-auction) tab but not in [Validators](https://cspr.live/validators), you may have been evicted or outbid. 

### Detection using the Casper Client

All auction information is returned with the `casper-client get-auction-info` command. It would help if you filtered this down to your public key. 

You can replace the <public_key> with your public key manually and run this command:

```bash
casper-client get-auction-info | jq '.result.auction_state.bids[] | select( .public_key == "<public_key>")'
```

Or, if you set up the node as described in this documentation, you can run another command that will automatically put in your public key:

```bash
casper-client get-auction-info | jq --arg pk "$(cat /etc/casper/validator_keys/public_key_hex)" '.result.auction_state.bids[] | select( (.public_key | ascii_downcase) == ($pk | ascii_downcase) )'
```

You know you were evicted if the `get-auction-info` command returned your bid showing an **inactive** field. See the [Inactive vs. Faulty Validator Nodes](./inactive-vs-faulty.md) page for more information.

If you receive a `parse error: Invalid numeric literal at`, this usually means that your RPC port is not up yet. Get your node in sync, and the RPC will come up. This should be working before you try to recover. Try running the following command to check the status of your RPC port:

```bash
casper-client get-auction-info
```

## Correcting any Underlying Node Issues

Before fixing the eviction, you need to correct the problem that caused your node to be evicted. Stage missed upgrades, correct any node issues, and get your node in sync.

To check if your node is in sync, compare the current block height at [https://cspr.live/](https://cspr.live/) with the height from your node with:

```bash
curl -s localhost:8888/status | jq .last_added_block_info
```

If you cannot figure out the issue, ask for help in the *node-tech-support* channel on [Discord](https://discord.com/invite/Q38s3Vh).


## Activating the Bid

Once your node is in sync and ready to validate again, you must activate your invalid bid. There are two ways to reactivate your bid. The recommended and cheaper method is to call the `activate_bid` entry point from the system auction contract. The second method involves building the `activate_bid.wasm` contract as explained in [Building the Required Contracts](../setup/joining.md#step-3-build-contracts).

We recommend testing the following steps on the official Testnet before performing them in a live environment like the Casper Mainnet.

### Method 1: Activating the Bid with the System Auction Contract {#activating-system-auction}

This method calls the existing `activate_bid` entry point from the system auction contract. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
sudo -u casper casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-hash <SESSION_HASH> \
--session-entry-point activate_bid \
--session-arg "validator_public_key:public_key='$(cat /etc/casper/validator_keys/public_key_hex)'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. You must check the network's chainspec. For example, this entry point call needs 10,000 motes for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-hash` - Hex-encoded hash of the stored auction contract, which depends on the network you are using. For Casper's Mainnet and Testnet, the hashes are:

- **Testnet**: `hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`
- **Mainnet**: `hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

6. `session-entry-point` - Name of the entry point that will be used when calling the system auction contract. In this case, it is `activate_bid`

The `activate_bid` entry point expects one argument:

7. `validator_public_key`: The hexadecimal public key of the validator reactivating its bid. **This key must match the secret key that signs the bid activation request**

The command will return a deploy hash, which is needed to verify the deploy's processing results. Refer to the [Deploy Status](../../resources/tutorials/beginner/querying-network.md#deploy-status) section for more details.

:::tip

Calling the `activate_bid` entry point on the auction contract has a fixed cost of 10,000 motes.

:::

**Example:**

This example uses the Casper Testnet to reactivate a bid:

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777  \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--payment-amount 10000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point activate_bid \
--session-arg "validator_public_key:public_key='$(cat /etc/casper/validator_keys/public_key_hex)'"
```

Next, [check the bid activation](#checking-the-bid-activation) status.

### Method 2: Activating the Bid with Compiled Wasm {#activating-compiled-wasm}

The second method to rejoin the network is to reactivate your bid using the `activate_bid.wasm`.


```bash
sudo -u casper casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-path "$HOME/casper-node/target/wasm32-unknown-unknown/release/activate_bid.wasm" \
--session-arg "validator_public_key:public_key='$(cat /etc/casper/validator_keys/public_key_hex)'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes
5. `session-path` - The path to the compiled Wasm on your computer

The `activate_bid.wasm` expects one argument:

6. `validator_public_key`: The hexadecimal public key of the validator reactivating its bid. **This key must match the secret key that signs the bid activation request**

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

As described above, this method is much more expensive than calling the `activate_bid` entry point.

:::

**Example:**

Here is an example that reactivates a bid using the `activate_bid.wasm`. You must modify the payment and other values in the deploy based on your environment and the network's [chainspec.toml](../../concepts/glossary/C.md#chainspec). For example, if you use the `activate_bid.wasm` on a network with node version [1.4.9](https://github.com/casper-network/casper-node/blob/release-1.4.9/resources/production/chainspec.toml), you will require a balance of at least 5 CSPR for this contract. 

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777  \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--payment-amount 5000000000 \
--session-path "$HOME/casper-node/target/wasm32-unknown-unknown/release/activate_bid.wasm" \
--session-arg "validator_public_key:public_key='$(cat /etc/casper/validator_keys/public_key_hex)'"
```

Check that the deploy was successful with the `casper-client get-deploy <deploy_hash>` or by searching for the deploy hash on [https://cspr.live/](https://cspr.live/). Also, check the bid activation status as shown below.

## Checking the Bid Activation {#checking-the-bid-activation}

Once your deploy processes, you can [check your bid](recovering.md#detecting-the-eviction-using-the-casper-client) again. You should now see `"inactive": false` in the output.

If you wait until the next Era starts, you should also see your public key as a future validator on the [Validators](https://cspr.live/validators) tab.