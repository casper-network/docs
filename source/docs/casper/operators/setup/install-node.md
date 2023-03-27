# Installing a Node 

Ensure the requirements listed in the following sections are met before you start setting up the node on the network, either on Mainnet or Testnet.

## Network Requirements

The following ports are used by the node:

- 35000 (required to be externally visible)
- 7777 RPC endpoint for interaction with JSON-RPC API
- 8888 REST endpoint for status and metrics (having this accessible allows your node to be part of network status)
- 9999 SSE endpoint for event stream

Of these `35000` is the only port required to be open for your node to function, however, opening `8888` will allow others to know general network health. For more details, see the additional information on [Node Endpoints](./node-endpoints.md).

## Operating System Requirements

The recommended OS version is Ubuntu 20.04.

## Specifying the Number of Open Files

Please read through [this page on nofiles configuration](https://github.com/casper-network/casper-node/wiki/Increasing-default-nofile-HARD-limit-for-a-node) to put settings in `/etc/security/limits.conf` for your node to ensure proper operation.

## Required Clean Up

If you were running a previous node on this box, this will clean up state. If packages are not installed, the `apt remove` may give errors, but this is not a problem.

```bash
sudo systemctl stop casper-node-launcher.service
sudo apt remove -y casper-client
sudo apt remove -y casper-node
sudo apt remove -y casper-node-launcher
sudo rm /etc/casper/casper-node-launcher-state.toml
sudo rm -rf /etc/casper/1_*
sudo rm -rf /var/lib/casper/*
```

## Required Packages

The following commands will set up the Casper Labs repository for packages:

```bash
echo "deb https://repo.casperlabs.io/releases" bionic main | sudo tee -a /etc/apt/sources.list.d/casper.list
curl -O https://repo.casperlabs.io/casper-repo-pubkey.asc
sudo apt-key add casper-repo-pubkey.asc
sudo apt update
```

## Required Tools

```bash
sudo apt install -y casper-client casper-node-launcher jq
```

## Installing All Protocols

On **Mainnet**, run:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols casper.conf
```

On **Testnet**, run:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols casper-test.conf
```

## Validator Keys

If you do not have keys yet, you can create them using the following command:

```bash
sudo -u casper casper-client keygen /etc/casper/validator_keys
```

For more details, see the [Node Setup](./basic-node-configuration.md#create-fund-keys) page.

## Getting a Trusted Hash

To get a trusted hash, use the command below. Replace the node address with an address from a node on the network of your choice.

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.14.161.135:7777 -b 20 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_0_0/config.toml
```

You can find active peers at https://cspr.live/tools/peers.

## Starting the Node

Start the node using the following commands:

```bash
sudo /etc/casper/node_util.py rotate_logs
sudo /etc/casper/node_util.py start
```

### Monitoring the Synchronization Process

The following command will display the node synchronization details:

```bash
/etc/casper/node_util.py watch
```

When you first run the watch command, you may see the message `RPC: Not Ready`. Once the node is synchronized, the status will change to `RPC: Ready` and a similar output:

```bash
Last Block: 630151 (Era: 4153)
Peer Count: 297
Uptime: 4days 6h 40m 18s 553ms
Build: 1.4.5-a7f6a648d-casper-mainnet
Key: 0147b4cae09d64ab6acd02dd0868722be9a9bcc355c2fdff7c2c244cbfcd30f158
Next Upgrade: None

RPC: Ready

● casper-node-launcher.service - Casper Node Launcher
   Loaded: loaded (/lib/systemd/system/casper-node-launcher.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2022-03-16 21:08:50 UTC; 4 days ago
     Docs: https://docs.casper.network
 Main PID: 2934 (casper-node-lau)
    Tasks: 12 (limit: 4915)
   CGroup: /system.slice/casper-node-launcher.service
           ├─ 2934 /usr/bin/casper-node-launcher
           └─16842 /var/lib/casper/bin/1_4_5/casper-node validator /etc/casper/1_4_5/config.toml
```

If the node is not showing active (running) status, it is either stopped or in the process of restarting.

### Monitoring the Running Node

The community has created a few tools to monitor your node once it is running, such as:

- Status.py: https://github.com/RapidMark/casper-tools
- Grafana: https://github.com/matsuro-hadouken/casper-tools



