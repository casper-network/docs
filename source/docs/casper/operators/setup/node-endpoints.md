# Node Endpoints

As specified in the [Network Requirements](./install-node.md#network-requirements), a Casper node uses specific ports to communicate with client applications and other nodes on the network. Each node has an identity linked with an IP and port pair where the node is reachable. This address is also called an endpoint. The [Network Communication](../../concepts/design/p2p.md) page explains how the nodes connect and communicate securely. Node connections are established using TLS, presenting a client certificate to encrypt peer-to-peer communication.

This document describes in more detail a Casper node's default endpoints:

- [Networking port: 35000](#35000)
- [JSON-RPC HTTP server port: 7777](#7777)
- [REST HTTP server port: 8888](#8888)
- [SSE HTTP event stream server port: 9999](#9999)

Node operators can modify a node's configuration options, including the port settings, by updating the [node's config.toml](./basic-node-configuration.md#config-file) file. An example configuration file can be found [here](https://github.com/casper-network/casper-protocol-release/blob/main/config/config-example.toml).

The default endpoints for Mainnet and Testnet are open by default and are described below in more detail. If the node connects to a different network, the ports may differ depending on how the network was set up.


## Default Networking Port: 35000 {#35000}

The configuration options for networking are under the `network` section of the `config.toml` file. The `bind_address` using port 35000 is the only port required to be open for the node to function. A Casper node taking part in the network should open connections to every other node it is aware of and has not blocked. In the `config.toml` file, the setting is:

```md
bind_address = '0.0.0.0:35000'
```

If the networking port is closed, the node becomes unreachable, and the node won't be discoverable in the network. If this is a validator, it will face eviction. A read-only node will be considered to be offline.


## Default JSON-RPC HTTP Server Port: 7777 {#7777}

The configuration options for the JSON-RPC HTTP server are under the `rpc_server` section in the `config.toml` file. The `address` using port 7777 is the listening address for JSON-RPC HTTP server. 

```md
address = '0.0.0.0:7777'
```

DApps would use this address to [interact with the Casper JSON-RPC API](../../developers/json-rpc/index.md). Users would use this address to [interact with the network using CLI](../../developers/cli/index.md). Validators would use this address to [bond](../becoming-a-validator/bonding.md#example-bonding-transaction) or [unbond](../becoming-a-validator/unbonding.md). If this port is closed, the requests coming to this port will not be served, but the node remains unaffected.


## Default REST HTTP Server Port: 8888 {#8888}

The configuration options for the JSON-RPC HTTP server are under the `rest_server` section in the `config.toml` file. The `address` listing port 8888 is the listening address for the REST HTTP server. 

```md
address = '0.0.0.0:8888'
```

Opening port 8888 is recommended but not required. This port allows the node to be included in the general network health metrics, thus giving a more accurate picture of overall network health. If this port is closed, the requests coming to this port will not be served, but the node remains unaffected.

One may use this port to [get a trusted hash](./basic-node-configuration.md#trusted-hash-for-synchronizing), [verify successful staging](./upgrade.md#verifying-successful-staging) during an upgrade, or to [confirm that the node is synchronized](./joining.md#step-7-confirm-the-node-is-synchronized).


### Example usage

For general health metrics, use this command:

```bash
curl -s http://<node_address>:8888/metrics
```

You can check the node's status using this command:

```bash
curl -s http://<node_address>:8888/status
```

The status endpoint provides a JSON response that can be parsed with `jq`.

```bash
curl -s http://<node_address>:8888/status | jq
```

<details>
<summary><b>Sample response</b></summary>

```json
{
  "api_version": "1.4.15",
  "chainspec_name": "casper-test",
  "starting_state_root_hash": "4c3856bd6a95b566301b9da61aaf84589a51ee2980f3cc7bbef78e7745386955",
  "peers": [
    {
      "node_id": "tls:007e..e14b",
      "address": "89.58.52.245:35000"
    },
    {
      "node_id": "tls:00eb..ac11",
      "address": "65.109.17.120:35000"
    },
    ...
    {
      "node_id": "tls:ffc0..555b",
      "address": "95.217.228.224:35000"
    }
  ],
  "last_added_block_info": {
    "hash": "7acd2f48b573704e96eab54322f7e91a0624252baca3583ad2aae38229fe1715",
    "timestamp": "2023-05-10T09:20:10.752Z",
    "era_id": 9085,
    "height": 1711254,
    "state_root_hash": "1ac74071c1e76937c372c8d2ae22ea036a77578aad03821ec98021fdc1c5d06b",
    "creator": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca"
  },
  "our_public_signing_key": "0107cba5b4826a87ddbe0ba8cda8064881b75882f05094c1a5f95e957512a3450e",
  "round_length": "32s 768ms",
  "next_upgrade": null,
  "build_version": "1.4.15-039d438f2-casper-mainnet",
  "uptime": "5days 13h 46m 54s 520ms"
}
```

</details>

You can filter the result with dot notation, specifying one of the following parameters:

- `api_version` - The RPC API version
- `chainspec_name` - The chainspec name, used to identify the currently connected network
- `starting_state_root_hash` - The state root hash used at the start of the current session
- `peers` - The node ID and network address of each connected peer
- `last_added_block_info` - The minimal info of the last Block from the linear chain
- `our_public_signing_key` - Our public signing key
- `round_length` - The next round length if this node is a validator.
- `next_upgrade` - Information about the next scheduled upgrade
- `build_version` - The compiled node version
- `uptime` - Time that has passed since the node has started.

Here is an example command for retrieving general network information:

```bash
curl -s http://<node_address>:8888/status | jq -r '.api_version, .last_added_block_info, .build_version, .uptime'
```

<details>
<summary><b>Sample response</b></summary>

```json
"1.4.15"
{
  "hash": "dca9959b21df52633f85cd373a8117fe8e89629dd2a0455781484a439f7d9f62",
  "timestamp": "2023-05-10T09:26:43.968Z",
  "era_id": 9085,
  "height": 1711266,
  "state_root_hash": "5f374529e747a06ec825e07a030df7b9d80d1f7ffac9156779b4466620721872",
  "creator": "0107cba5b4826a87ddbe0ba8cda8064881b75882f05094c1a5f95e957512a3450e"
}
"1.4.15-039d438f2-casper-mainnet"
"5days 13h 53m 10s 763ms"
```

</details>

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
watch -n 15 'curl -s http://<node_address>:8888/status | jq ".peers | length"; curl -s http://<node_address>:8888/status | jq .last_added_block_info'
```

To monitor local block height as well as RPC port status:

```bash
watch -n 15 'curl -s http://<node_address>:8888/status | jq ".peers | length"; curl -s http://<node_address>:8888/status | jq .last_added_block_info; casper-client get-block -n http://<node_address>:8888/status'
```

## Default SSE HTTP Event Stream Server Port: 9999 {#9999}

The configuration options for the SSE HTTP event stream server are listed under the `event_stream_server` section of the `config.toml` file. The `address` listing port 9999 is the listening address for the SSE HTTP event stream server. 

```md
address = '0.0.0.0:9999'
```

If this port is closed, the requests coming to this port will not be served, but the node remains unaffected. For details and useful commands, see [Monitoring and Consuming Events](../../developers/dapps/monitor-and-consume-events.md).


## Restricting Access for Private Networks

Any node can join Mainnet and Testnet and communicate with the nodes in the network. Private networks may wish to restrict access for new nodes joining the network as described [here](../setup-network/create-private.md#network-access-control).


## Summary of Related Links

Here is a summary of the links mentioned on this page:

- [Network requirements](./install-node.md#network-requirements)
- [Network communication](../../concepts/design/p2p.md)
- [The node configuration file](./basic-node-configuration.md#config-file)
- [Interacting with the Casper JSON-RPC API](../../developers/json-rpc/index.md)
- [Interacting with the network using CLI](../../developers/cli/index.md)
- [Bonding](../becoming-a-validator/bonding.md#example-bonding-transaction) or [unbonding](../becoming-a-validator/unbonding.md) as a validator
- [Getting a trusted node hash](./basic-node-configuration.md#trusted-hash-for-synchronizing)
- [Verifying successful staging](./upgrade.md#verifying-successful-staging)
- [Confirming that the node is synchronized](./joining.md#step-7-confirm-the-node-is-synchronized)
- [Monitoring and consuming events](../../developers/dapps/monitor-and-consume-events.md)
- [Private network access control](../setup-network/create-private.md#network-access-control)
- [FAQs for a basic validator node ](https://support.casperlabs.io/hc/en-gb/sections/6960448246683-Node-Operation-FAQ)
- [External FAQs on Mainnet and Testnet validator node setup](https://docs.cspr.community/docs/faq-validator.html)
