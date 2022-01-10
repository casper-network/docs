# Upgrading the Node

The `chainspec.toml` contains a section to indicate what era the given `casper-node` version should start running.

```
[protocol.activation_point]
# This protocol version becomes active at the start of this era.
era_id = 0
```

At every block finalization, the `casper-node` looks for newly configured versions. When a new version is configured, the running node will look at future era_id in the `chainspec.toml` file. This will be the era before where the current casper-node will cleanly shut down.

The `casper-node-launcher` will detect a clean exit 0 condition and start the next version `casper-node`.

You can choose to build from source on [GitHub](https://github.com/casper-network/casper-node-launcher). If you opt to do this, please ensure that the correct software version (tag) is used. 