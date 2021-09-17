# Joining a Running Network

The Casper network is permissionless, enabling new validators to join the network and provide additional security to the system. This page will outline the sequence of recommended steps to spin up a validating node and successfully join an existing network.

## Step 1: Provision Hardware

Visit the Hardware section and provision your node hardware.

## Step 2: Build Contracts & Set Up the Node

Visit the Setup section in this guide and configure the software on your node. Build all necessary contracts for bonding, retrieving rewards and unbonding.

## Step 3: Create & Fund your Keys for Bonding

Obtain token to bond your node on to the network & to pay for the bonding transaction.

## Step 4: Update the Trusted Hash

The node's `config.toml` needs to be updated with a recent trusted hash. Visit a `/status` endpoint of a validating node to obtain a fresh trusted block hash.

```bash
curl http://<IP_ADDRESS>:<PORT>/status
```

Default port is usually `8888` Retrieve the `last_added_block_info:` hash.

A good IP to use above are those listed in your `config.toml` as `known_addresses`.

## Step 5: Start the Node

Once the node has been added to the list of validators for an upcoming era, it's time to start the node. The deb package installs a casper-node service for systemd. Start the node with:

```bash
sudo systemctl start casper-node-launcher
```

For more information visit [Github](https://github.com/casper-network/casper-node/tree/master/resources/production)

## Step 6: Confirm the Node is Syncronized

While the node is synchronizing, the `/status` endpoint is available. You will be able to compare this to other node's status endpoint `era_id` and `height` to determine if you are caught up. You will not be able to perform any `casper-client` calls to your `7777` RPC port until your node is fully caught up.

## Step 7: Send the Bonding Request

To avoid being ejected for liveness failures, it is critical that the bonding request be sent to the local node only after it has synchronized the protocol state and linear blockchain.

For this reason it is recommended that you use `casper-client` with the default `--node-address` which will talk to localhost.

Please see the bonding page to submit a bonding request to change from a synchronized node to a validating node.
