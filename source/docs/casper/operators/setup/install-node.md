---
title: Installation
---

# Installing a Node

Ensure the requirements listed in the following sections are met before you start setting up the node on the network, either on Mainnet or Testnet.

## Network Requirements {#network-requirements}

The following ports are used by the node:

- 35000 (required to be externally visible)
- 7777 RPC endpoint for interaction with JSON-RPC API
- 8888 REST endpoint for status and metrics (having this accessible allows your node to be part of network status)
- 9999 SSE endpoint for event stream

Of these `35000` is the only port required to be open for your node to function, however, opening `8888` will allow others to know general network health. For more details, see the additional information on [Node Endpoints](./node-endpoints.md).

## Operating System Requirements
The recommended OS version is Ubuntu 20.04.

### Using Ubuntu 22.04

Installing using Ubuntu 22.04 follows the same instructions as 20.04 with one exception:

If you try to install packages, you will receive:

```
casper-client : Depends: libssl1.1 (>= 1.1.0) but it is not installable
```

This is due to the default openssl moving to 3.x with Ubuntu 22.04.  We need to install OpenSSL 1.x for prior versions of Ubuntu to use our binaries. We can use 20.04 libraries for this by downloading and install them:

```
curl -JLO http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.19_amd64.deb
sudo apt install ./libssl1.1_1.1.1f-1ubuntu2.19_amd64.deb
```

## Required Number of Open Files

Before beginning, [update the maximum open files limit](./open-files.md) for your system. Specifically, update the node's `/etc/security/limits.conf` file as described [here](./open-files.md#updating-limits-conf), to ensure proper node operation.

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
echo "deb [arch=amd64] https://repo.casperlabs.io/releases focal main" | sudo tee -a /etc/apt/sources.list.d/casper.list
curl -O https://repo.casperlabs.io/casper-repo-pubkey.asc
sudo apt-key add casper-repo-pubkey.asc
sudo apt update
```

## Required Tools

```bash
sudo apt install -y casper-client casper-node-launcher jq
```

## Enable Bash Auto-Completion for `casper-client` (Optional)

```bash
sudo casper-client generate-completion
```

It defaults to `bash` but can be changed with the `--shell` argument:
```bash
--shell <STRING>    The type of shell to generate the completion script for [default: bash]  [possible values:
                            zsh, bash, fish, powershell, elvish]

sudo casper-client generate-completion --shell powershell
```

You need to source the new auto completion script or log out and log in again to activate it for the current shell:
```bash
source /usr/share/bash-completion/completions/casper-client
```

Now you can use `casper-client` and press the `tab` key to get auto completion for your commands.

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

You can find active peers at https://cspr.live/tools/peers or you can use Casper Labs' public nodes:

* Testnet - NODE_ADDR=https://rpc.testnet.casperlabs.io

* Mainnet - NODE_ADDR=https://rpc.mainnet.casperlabs.io

## Protocol Version

Protocol version should be set to the largest available protocol version you see in `ls /etc/casper` Currently, it should be:

```bash
PROTOCOL=1_5_2
```

## Syncing to Genesis

In the latest protocol version's *Config.toml*, you will find the option `sync_to_genesis`. by default, this value will be set to `true`.

If you are planning to run a validator node, it is better to not sync your node to genesis. This will increase node performance. In this case, the option should be changed to:

```bash
sync_to_genesis = false
```
If you are using the node for historical data and want to query back to genesis, you can leave the default value in place.

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

The reactor state will be in CatchUp mode until it acquires the full tip state, at which point it will shift to KeepUp mode. If you left `sync_to_genesis` as `true`, it will begin syncing back history at this time.

Seeing available block range - Low: 0 High: 0 is normal until the fill tip is downloaded. You can see download progress with a look at metrics:

```bash
$ curl -s 127.0.0.1:8888/metrics | grep trie_or_chunk
# HELP trie_or_chunk_fetch_total number of trie_or_chunk all fetch requests made
# TYPE trie_or_chunk_fetch_total counter
trie_or_chunk_fetch_total 102647
# HELP trie_or_chunk_found_in_storage number of fetch requests that found trie_or_chunk in local storage
# TYPE trie_or_chunk_found_in_storage counter
trie_or_chunk_found_in_storage 0
# HELP trie_or_chunk_found_on_peer number of fetch requests that fetched trie_or_chunk from peer
# TYPE trie_or_chunk_found_on_peer counter
trie_or_chunk_found_on_peer 102263
# HELP trie_or_chunk_timeouts number of trie_or_chunk fetch requests that timed out
# TYPE trie_or_chunk_timeouts counter
trie_or_chunk_timeouts 0
```

If the node is not showing active (running) status, it is either stopped or in the process of restarting.

### Monitoring the Running Node

The community has created a few tools to monitor your node once it is running, such as:

- Status.py: https://github.com/RapidMark/casper-tools
- Grafana: https://github.com/matsuro-hadouken/casper-tools

## A Note on Speculative Execution

The `speculative_exec_server` defaults to off and can be enabled in your *Config.toml* file.

While this is a useful tool, understand that it is also an attack vector for a node.  The intent is for someone to run on their node as a tool. You ***should not*** use this if you are an active validator, as requests into this port can block execution_engine processing for legitimate network traffic.