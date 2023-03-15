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

### Detection using the Casper client

The entire auction information is returned with the `casper-client get-auction-info` command. It would help if you filtered this down to your public key. 

You can replace the <public_key> with your public key manually and run this command:

```bash
casper-client get-auction-info | jq '.result.auction_state.bids[] | select( .public_key == "<public_key>")'
```

Or, if you set up the node as described in this documentation, you can run another command that will automatically put in your public key:

```bash
casper-client get-auction-info | jq --arg pk "$(cat /etc/casper/validator_keys/public_key_hex)" '.result.auction_state.bids[] | select( (.public_key | ascii_downcase) == ($pk | ascii_downcase) )'
```

You know you were evicted if the `get-auction-info` command returned your bid showing an `inactive " field. See the [Inactive vs. Faulty Validator Nodes](./inactive-vs-faulty.md) page for more information.

If you receive a `parse error: Invalid numeric literal at`, this usually means that your RPC port is not up yet. Get your node in sync, and the RPC will come up. This should be working before you try to recover. Try running the following command to check the status of your RPC port:

```bash
casper-client get-auction-info --node-address http://<peer-ip-address>:7777
```

## Correcting any Underlying Node Issues

Before fixing the eviction, you need to correct the problem that caused your node to be evicted. Stage missed upgrades, correct any node issues, and get your node in sync.

To check if your node is in sync, compare the current block height at [https://cspr.live/](https://cspr.live/) with the height from your node with:

```bash
curl -s localhost:8888/status | jq .last_added_block_info
```

If you cannot figure out the issue, ask for help in the node-tech-support channel on [Discord](https://discord.com/invite/Q38s3Vh).

## Re-building the Contracts for Bonding

Next, you need to re-build the smart contracts required for [bonding](./bonding.md) by following these steps:

1. Navigate to the `casper-node` directory 
2. Check out the current default release branch
3. Re-build the contracts required for bonding

```bash
cd casper-node
git checkout <replace with current default branch>
make setup-rs
make build-client-contracts 
```

## Activating the Bid

Once your node is in sync and ready to validate again, you must activate your invalid bid with the `activate_bid.wasm` contract. This should be part of the compiled contracts required to join the network in [Step 3: Build the Required Contracts](../setup/joining.md#step-3-build-the-required-contracts-step-3-build-contracts).

Run the following transaction to re-activate your bid and rejoin the network. You will require a balance of at least 5 CSPR for this contract. 

<!-- TODO We are seeing some variability with this gas cost as of 1.4.9 and will dive into this and try to get better docs on this. -->

```bash
casper-client put-deploy \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper \
--session-path "$HOME/casper-node/target/wasm32-unknown-unknown/release/activate_bid.wasm" \
--payment-amount 5000000000 \
--session-arg "validator_public_key:public_key='$(cat /etc/casper/validator_keys/public_key_hex)'"
```

Check that the deploy was successful with the `casper-client get-deploy <deploy_hash>` or by searching for the deploy hash on [https://cspr.live/](https://cspr.live/).

## Checking the Bid Activation

Once your deploy processes, you can [check your bid](recovering.md#detecting-the-eviction-using-the-casper-client) again. You should now see `"inactive": false` in the output.

If you wait until the next Era starts, you should also see your public key as a future validator on the [Validators](https://cspr.live/validators) tab.