---
title: Troubleshooting
---

# Troubleshooting Tips for Operators

This section contains common topics for troubleshooting AWS Casper node instances.

## Node Restarts When Synchronizing

If the node restarts when synchronizing, usually every 30 minutes, and doesn't update the block number, you must update the `trusted_hash` variable in the `config.toml` file. Open the `config.toml` of the Casper version your node is running (e.g.: `/etc/casper/1_1_2/config.toml`) and update the trusted hash to one from a node that is already synchronized. For more information on getting a trusted hash, visit [this page](../setup/install-node.md#getting-a-trusted-hash).

1. Stop the `casper-node-launcher` service.

2. Get a `trusted hash` from the network using this command:

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://SYNCED_NODE_IP:7777/ -b BLOCK_NUMBER | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/CASPER_VERSION/config.toml
```

For example:

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.136.227.9:7777/ -b 997478 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_4_7/config.toml
```
