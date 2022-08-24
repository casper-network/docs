# Upgrading the Node

The `chainspec.toml` contains a section to indicate from which era the given `casper-node` version should start running.

```
[protocol]
# This protocol version becomes active at the start of this era.
activation_point = 100
```

At every block finalization, the `casper-node` looks for newly configured versions. When a new version is configured, the running node will look at future era_id in the `chainspec.toml` file. This will be the era before where the current casper-node will cleanly shut down.

The `casper-node-launcher` will detect a clean exit 0 condition and start the next version of the `casper-node`.

## Upgrading Protocol Versions

All Casper Mainnet participants are requested to stage the upgrade of their nodes to a new version of `casper-node` immediately. Staging an upgrade is a process in which you tell your node to download the upgrade files and prepare them so that they can automatically be applied at the pre-defined activation point.

Do not restart the node, only run the commands provided. The upgrade will automatically occur at the activation point.

### Upgrade Staging Instructions

The process to upgrade your node is very straightforward. Log in to your node, and execute the following command:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols casper.conf
```

>**Note**: To only view the list of staged and unstaged protocols, use this command: `sudo -u casper /etc/casper/node_util.py check_protocols casper.conf`

### Verifying Successful Staging

After you have successfully executed the above commands, wait a few minutes for a new block to be issued before checking that your node is correctly staged with the upgrade. After a few minutes, take a look at your status end-point, as follows:

```bash
curl -s http://127.0.0.1:8888/status | jq .next_upgrade
```

You should expect this output if properly staged, prior to upgrading:

```bash
$ curl -s localhost:8888/status | jq .next_upgrade
{
  "activation_point": 4968,
  "protocol_version": "1.4.6"
}
```

>**Note**: The protocol version in the above output will change as per the next upgrade available.

If you see null after waiting for a few minutes, then your upgrade staging was not executed successfully.


