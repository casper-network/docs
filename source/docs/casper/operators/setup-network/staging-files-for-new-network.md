---
title: Staging Files
---

# Staging Files for a New Network

:::important

Staging files is not needed for already established running networks.

Only use these instructions if you are creating a new Casper network and hosting protocol files for this network.

:::


## Hosting Server

Files for staging protocol versions are hosted on a typical HTTP(S) server.

Scripts included with the `casper-node-launcher` have network configurations for Mainnet and Testnet.  These scripts point to the server hosting files and network name.

Since a given server can be used for multiple networks, a network named directory is used to
hold files for that network.

This is a description of Mainnet protocol version hosting (with network name: `casper`).

`genesis.casperlab.io` is the web server URL with the following directory structure:

 - `casper`
    - `protocol_versions` - File listing active protocol versions so scripts know what directories to use
    - `1_0_0` - Genesis protocol version
      - `config.tar.gz` - Configuration files to be expanded into `/etc/casper/1_0_0`
      - `bin.tar.gz` - Binary files to be expanded into `/var/lib/casper/bin/1_0_0`
    - `1_1_0` - First upgrade
      - `config.tar.gz` - Configuration files to be expanded into `/etc/casper/1_1_0`
      - `bin.tar.gz` - Binary files to be expanded into `/var/lib/casper/bin/1_1_0`
    - ...  (skipping many other protocol versions)
    - `1_4_6` - A later upgrade
      - `config.tar.gz` - Configuration files to be expanded into `/etc/casper/1_4_6`
      - `bin.tar.gz` - Binary files to be expanded into `/var/lib/casper/bin/1_4_6`

### More on `protocol_versions`

At the root of the hosting server directory for a given network, a `protocol_versions` file exists.  This holds the valid protocol versions for a network.

We can look at this manually on Mainnet using *curl*.  As of writing this, `1.4.6` is the latest version and the contents of this file will change.

```bash

$ curl -s genesis.casperlabs.io/casper/protocol_versions
1_0_0
1_1_0
1_1_2
1_2_0
1_2_1
1_3_2
1_3_4
1_4_1
1_4_3
1_4_4
1_4_5
1_4_6

```

We should find `bin.tar.gz` and `config.tar.gz` in those directories under `casper`.

## Protocol Version

The protocol version of a network is not related to the `casper-node` version.  In Mainnet, these have often been the same. However, with a new network, you would use the latest `casper-node` version for your 
`1.0.0` protocol.

## Network Configuration File

When the `casper-node-launcher` package is installed, both `casper.conf` and `casper-test.conf` are installed
in `/etc/casper/network_configs`.  Once a valid config file for a new network is copied to this location,
all commands with *node_util.py* will work as they do on existing networks.

By convention, we name the config file the same as the network.  So Mainnet has a network name of `casper` and we use 
`casper.conf` for the config file.  

For a new network using server `casper.mydomain.com` to host files for `our-network` network, we would have a 
`our-network.conf` file that looks like this:

```bash
SOURCE_URL=casper.mydomain.com
NETWORK_NAME=our-network
```

Host this `our-network.conf` in the root of `casper.mydomain.com/our-network` at the same level as `protocol_versions`.

This allows any node which wants to use the new network to run the following to install this configuration:

```bash
cd /etc/casper/network_configs
sudo -u casper curl -JLO casper.mydomain.com/our-network/our-network.conf
```

Any command needing a network config from `node_util.py` can use `our-network.conf`. 

Staging protocol versions for a new node with this network or staging an upcoming upgrade would just need this command:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols our-network.conf
```

## Setup Configuration Files

For a network to be started, we to build the configuration files for a certain genesis time and with nodes that will be running.  These files need to be configured in advanced, so a genesis time should be selected that allows packaging the files, loading onto nodes and starting nodes prior to the genesis time.

### chainspec.toml

The [chainspec.toml](../../concepts/glossary/C.md#chainspec) file is configuration for the network and must be exactly the same on all nodes.  

The name for a network is specified `network.name`.  

Each protocol will have a `version` and `activation_point`.  At genesis this is a date and time in format shown below. For future upgrades it would be an integer of the `era_id` for activation of the upgrade.

```
[protocol]
version = '1.0.0'
activation_point = '2022-08-01T10:00:00Z'

[network]
name = 'mynetwork'
```

### config-example.toml

The config-example.toml is used to generate config.toml for a protocol after the node's IP is inserted.  The `public_address` is auto-detected with `node_util.py stage_protocols`. If using a NAT environment, the public IP can be specified with the `--ip` argument.

This file should have `known_addresses` added that are relevant to the network.   Nodes that will be genesis validators are added to this list in the form:

```
[network]
known_addresses = ['<ip 1>:35000','<ip 2>:35000','<ip 3>:35000']
```

The `config.toml` can be setup to customized fields for a given node.  `config-example.toml` is a default configuration.

## Staging a Protocol Version

For the initial genesis protocol version or future upgrade protocol versions, you will typically use
prebuilt and tested `bin.tar.gz` that have been tested and staged for existing networks.  The `config.tar.gz`
file must be customized for the specific network with a network name, protocol version and activation point at the very least.

These archives should be created with no directory information stored.  This is done by using `tar` in the same directory as the files.  

```bash
mkdir config
cd config
mv [source of chainspec.toml] ./chainspec.toml
mv [source of config-example.toml] ./config-example.toml
tar -czvf ../config.tar.gz .
```

You can test what was compressed with untar'ing the file.

```bash
mkdir conftest
cd conftest
tar -xzvf ../config.tar.gz .
```

This will expand files for verification.

For custom `casper-node` builds, the minimum contents of `bin.tar.gz` is the `casper-node` executable. 

```bash
mkdir bin
cd bin
cp [source of casper-node] ./casper-node
tar -czvf ../bin.tar.gz .
```

A directory for the protocol_version will be created on the server.  For example: `1_1_0`.

We will copy `bin.tar.gz` and `config.tar.gz` into `1_1_0`.  Once this is done, we are safe to update
`protocol_versions` by appending `1_1_0` to the end of the file and uploading it into the root of the network directory.

Any node that runs the following command will get this new upgrade:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols <network.conf>
```

