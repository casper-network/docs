# Installing a Node on Testnet

Ensure the requirements listed in the following sections are met before you start setting up the Testnet node.

## Network Requirements

The following ports are used by the node:

- 35000 (required to be externally visible)
- 7777 RPC endpoint for interaction with JSON-RPC API
- 8888 REST endpoint for status and metrics (having this accessible allows your node to be part of network status)
- 9999 SSE endpoint for event stream

Of these `35000` is the only port required to be open for your node to function, however, opening `8888` will allow others to know general network health.

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

The following commands will set up the CasperLabs repository for packages:

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

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols casper-test.conf
```

## Validator Keys

If you do not have keys yet, you can create them using the following command:

```bash
sudo -u casper casper-client keygen /etc/casper/validator_keys
```

For more details, see the [Node Setup](/operators/setup#create-fund-keys) page.

## Getting a Trusted Hash

To get a trusted hash, use the command below. Replace the node address with an updated address from a Testnet node.

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.14.161.135:7777 -b 20 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_0_0/config.toml
```

You can find active peers at https://testnet.cspr.live/tools/peers.

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
Last Block: 1275281 (Era: 7098)
Peer Count: 268
Uptime: 43s 246ms
Build: 1.4.8-b94c4f79a-casper-mainnet
Key: 01da0e438afc74181beb2afae798e9e6851bdf897117a306eb32caafe46c1c0bc8
Next Upgrade: None

RPC: Ready

● casper-node-launcher.service - Casper Node Launcher
     Loaded: loaded (/lib/systemd/system/casper-node-launcher.service; enabled;
vendor preset: enabled)
     Active: active (running) since Thu 2022-11-24 11:20:28 UTC; 1min 55s ago
       Docs: https://docs.casperlabs.io
   Main PID: 107917 (casper-node-lau)
      Tasks: 5 (limit: 9401)
     Memory: 1.0G
     CGroup: /system.slice/casper-node-launcher.service
             ├─107917 /usr/bin/casper-node-launcher
             └─107919 /var/lib/casper/bin/1_4_8/casper-node validator /etc/caspe
r/1_4_8/config.toml
```

If the node is not showing active (running) status, it is either stopped or in the process of restarting.

### Monitoring the Running Node

The community has created a few tools to monitor the node once it is running, such as:

- Status.py: https://github.com/RapidMark/casper-tools
- Grafana: https://github.com/matsuro-hadouken/casper-tools



