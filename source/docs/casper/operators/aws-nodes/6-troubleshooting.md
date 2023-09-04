# Troubleshooting

## Node Restarts Every 30 Minutes When Synchronizing

If for any reason the node restarts when synchronizing and doesn't change the block number, you must change the `trusted_hash` variable inside the config file of the Casper version your node is running (e.g.: `/etc/casper/1_1_2/config.toml`) to the hash of an already synced node inside the network.

1. You must first find a node that is already synced and get the hash of the block you are currently stacked from them:

   e.g.:  `casper-client get-block --node-address http://3.136.227.9:7777 -b 41200 | jq -r .result.block.hash`

   - The `--node-address` is the address of the node that is fully synced (not ours).
   - The `-b` flag is the block number we are currently stacked on.

   The result should be something similar to this:

   `93044a6bbba07b86b202f99f5cbb4daf9041a104dfd8858390a5a9e9c30b44f0`

2. Stop the `casper-node-launcher` service

3. You will put that hash into the `trusted_hash` variable inside the `config.toml` file.

4. Start the `casper-node-launcher` service

> **Note:** You can do steps 1 and 3 with this command, but remember to stop the `casper-node-launcher` service first:
>  
>```bash
> sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://SYNCED_NODE_IP:7777/ -b BLOCK_NUMBER | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/CASPER_VERSION/config.toml
> ```

For example:

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.136.227.9:7777/ -b 997478 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_4_7/config.toml
```
