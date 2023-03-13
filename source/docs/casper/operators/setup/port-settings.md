# A Node's Port Settings

As specified in the [Network Requirements](./install-node.md#network-requirements), a Casper node uses specific ports to communicate with client applications and other nodes on the network. This document goes into more detail describing the default port settings and linking to related topics.

The [Network Communication](../../concepts/design/p2p.md) page explains how the nodes connect and communicate securely. Node connections are established using TLS, presenting a client certificate to encrypt peer-to-peer communication. Each node on the network has an identity linked with an IP and port pair where the node is reachable.

## Default Port Settings

Node operators can modify a node's configuration options, including the port settings, by updating the [node's configuration file (config.toml)](../setup/basic-node-configuration/#config-file). An example configuration file can be found [here](https://github.com/casper-network/casper-protocol-release/blob/main/config/config-example.toml).

The default port settings for Mainnet and Testnet are described below in more detail. If the node connects to a different network, the ports may differ depending on how the network was set up.

### Port for networking

The configuration options for networking are under the `network` section of the `config.toml` file. The `bind_address` using port 35000 is the only port required to be open for the node to function. A Casper node taking part in the network should open connections to every other node it is aware of and has not blocked. 

If the networking port is closed, the node becomes unreachable, and the node won't be discoverable in the network. If this is a validator, it will face eviction. A read-only node will be considered to be offline.

```md
# Address to bind to for listening.
# If the port is set to 0, a random port will be used.
bind_address = '0.0.0.0:35000'
```

### Port for the JSON-RPC HTTP server

The configuration options for the JSON-RPC HTTP server are under the `rpc_server` section in the `config.toml` file. The `address` using port 7777 is the listening address for JSON-RPC HTTP server. DApps would use this address to [interact with the Casper JSON-RPC API](../../developers/json-rpc). Users would use this address to [interact with the network using CLI](../../developers/cli/). Validators would use this address to [bond](../becoming-a-validator/bonding/#example-bonding-transaction) or [unbond](../becoming-a-validator/unbonding/). If this port is closed, the requests coming to this port will not be served, but the node remains unaffected.

```md
# Listening address for JSON-RPC HTTP server. If the port is set to 0, a random port will be used.
#
# If the specified port cannot be bound to, a random port will be tried instead. If binding fails, the JSON-RPC HTTP server will not run, but the node will be otherwise unaffected.
#
# The actual bound address will be reported via a log line if logging is enabled.
address = '0.0.0.0:7777'
```

### Port for the REST HTTP server

The configuration options for the JSON-RPC HTTP server are under the `rest_server` section in the `config.toml` file. The `address` listing port 8888 is the listening address for the REST HTTP server. Opening port 8888 is recommended but not required. This port allows the node to be included in the general network health metrics, thus giving a more accurate picture of overall network health. If this port is closed, the requests coming to this port will not be served, but the node remains unaffected.

```md
# Listening address for REST HTTP server. If the port is set to 0, a random port will be used.
#
# If the specified port cannot be bound to, a random port will be tried instead. If binding fails, the REST HTTP server will not run, but the node will be otherwise unaffected.
#
# The actual bound address will be reported via a log line if logging is enabled.
address = '0.0.0.0:8888'
```

You may also use this port to [get a trusted hash](https://docs.casperlabs.io/operators/setup/basic-node-configuration/#trusted-hash-for-synchronizing), [verify successful staging](https://docs.casperlabs.io/operators/setup/upgrade/#verifying-successful-staging) during an upgrade, or to [confirm that the node is synchronized](https://docs.casperlabs.io/operators/setup/joining/#step-7-confirm-the-node-is-synchronized).

For general health metrics, use this command:

```bash
curl -s http://<node_address>:8888/metrics
```

You can check the node's status using this command:

```bash
curl -s http://<node_address>:8888/status
```

To get information about the next upgrade, use:

```bash
curl -s http://<node_address>:8888/status | jq .next_upgrade
```

To get information about the last added block, use:

```bash
curl -s http://<node_address>:8888/status | jq .last_added_block_info
```

To monitor the downloading of blocks to your node:

```bash
watch -n 15 'curl -s http://<node_address>:8888/status | jq ".peers | length"; curl -s localhost:8888/status | jq .last_added_block_info'
```

To monitor local block height as well as RPC port status:

```bash
watch -n 15 'curl -s http://<node_address>:8888/status | jq ".peers | length"; curl -s localhost:8888/status | jq .last_added_block_info; casper-client get-block'
```

### Port for the SSE HTTP event stream server

The configuration options for the SSE HTTP event stream server are listed under the `event_stream_server` section of the `config.toml` file. The `address` listing port 9999 is the listening address for the SSE HTTP event stream server. If this port is closed, the requests coming to this port will not be served, but the node remains unaffected. For details and useful commands, see [Monitoring and Consuming Events](../../developers/dapps/monitor-and-consume-events/).

```md
# Listening address for SSE HTTP event stream server. If the port is set to 0, a random port will be used.
#
# If the specified port cannot be bound to, a random port will be tried instead. If binding fails, the SSE HTTP event stream server will not run, but the node will be otherwise unaffected.
#
# The actual bound address will be reported via a log line if logging is enabled.
address = '0.0.0.0:9999'
```

## Restricting Access for Private Networks

Any node can join Mainnet and Testnet since they are public Casper networks. Private networks may wish to restrict access for new nodes joining the network as described [here](https://docs.casperlabs.io/operators/setup-network/create-private/#network-access-control).


## Summary of Related Links

Here is a summary of the links mentioned on this page:

- [Network requirements](./install-node.md#network-requirements)
- [Network communication](../../concepts/design/p2p.md)
- [The node configuration file](../setup/basic-node-configuration.md#config-file)
- [Interacting with the Casper JSON-RPC API](../../developers/json-rpc)
- [Interacting with the network using CLI](../../developers/cli/)
- [Bonding](../becoming-a-validator/bonding/#example-bonding-transaction) or [unbonding](../becoming-a-validator/unbonding/) as a validator
- [Getting a trusted node hash](https://docs.casperlabs.io/operators/setup/basic-node-configuration/#trusted-hash-for-synchronizing)
- [Verifying successful staging](https://docs.casperlabs.io/operators/setup/upgrade/#verifying-successful-staging)
- [Confirming that the node is synchronized](https://docs.casperlabs.io/operators/setup/joining/#step-7-confirm-the-node-is-synchronized)
- [Monitoring and consuming events](../../developers/dapps/monitor-and-consume-events/)
- [Private network access control](../setup-network/create-private.md#network-access-control)
- [FAQs for a basic validator node ](../../faq/faq-validator.md)
- [External FAQs on Mainnet and Testnet validator node setup](https://docs.cspr.community/docs/faq-validator.html)
