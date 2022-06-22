# Staging files for a new network

THIS IS NOT NEEDED FOR RUNNING ESTABLISHED NETWORKS.  
You should only use this if you are creating a new Caster network and hosting protocol files for this network.

## Hosting server

Scripts included with `casper-node-launcher` have network configs for MainNet and TestNet.  
These point to the server hosting files and network name.  Protocol files exist on a typical HTTP(S) 
server and are hosted by CasperLabs for MainNet and Make Services for TestNet. 

Because multiple networks could be staged from a given server, the root directory is the network name.  
This is a description of MainNet protocol version hosting.

`genesis.casperlab.io` is the web server url with the following directory structure:

 - `casper`
    - `protocol_versions`  (file listing active protocol versions so scripts know what directories to use.)
    - `1_0_0`  (genesis protocol version)
      - `config.tar.gz`  (configuration files to be expanded into `/etc/casper/1_0_0`)
      - `bin.tar.gz`  (binary files to be expanded into `/var/lib/casper/bin/1_0_0`)
    - `1_1_0`  (first upgrade)
      - `config.tar.gz`  (configuration files to be expanded into `/etc/casper/1_1_0`)
      - `bin.tar.gz`  (binary files to be expanded into `/var/lib/casper/bin/1_1_0`)
    - ...  (skipping many protocol versions)
    - `1_4_6`  (later upgrade)
      - `config.tar.gz`  (configuration files to be expanded into `/etc/casper/1_4_6`)
      - `bin.tar.gz`  (binary files to be expanded into `/var/lib/casper/bin/1_4_6`)

When scripts look for protocol versions, they look at the `protocol_versions` file.  We can do that manually
on MainNet using curl.  As of writing this, `1.4.6` is the latest version.  Contents of this file will change.

```
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

This shows that we would find `bin.tar.gz` and `config.tar.gz` at those directories under `casper`.

## Protocol Version

The protocol version of a network is not related to the `casper-node` version.  In MainNet, these have
often been the same. However, with a new network, you would use the latest `casper-node` version for your 
1.0.0 protocol.

## Network Configuration File

When `casper-node-launcher` package is installed, both `casper.conf` and `casper-test.conf` are installed
in `/etc/casper/network_configs`.  Once a valid config file for a new network is copied to this location,
all commands with node_util.py will work as they do on existing networks.

By convention, we name the config file the same as the network.  So MainNet has a network name of `casper` and we use 
`casper.conf` for the config file.  

For a new network using server: `casper.mydomain.com` to host files for `our-network` network, we would have a 
`our-network.conf` file that looks like this:

```
SOURCE_URL=casper.mydomain.com
NETWORK_NAME=our-network
```

Host this `our-network.conf` in the root of `casper.mydomain.com/our-network` at the same level as `protocol_versions`.

This allows any node which wants to use the new network to run the following to install this config:

```bash
cd /etc/casper/network_configs
sudo -u casper curl -JLO casper.mydomain.com/our-network/our-network.conf
```

Now any command needing a network config from `node_util.py` can use `our-network.conf`. 

Staging protocol versions for new node with this network or staging an upcoming upgrade would just need:

```
sudo -u casper /etc/casper/node_util.py stage_protocols our-network.conf
```

## Staging a Protocol Version

For the initial genesis protocol version or future upgrade protocol versions, you will typically use
prebuilt and tested `bin.tar.gz` that have been tested and staged for existing networks.  The `config.tar.gz`
file must be customized for the specific network with at the very least a network name, protocol version and activation point.

These archives should be created with no directory information stored.  This is done by using `tar` in the same
directory as the files.  

```
mkdir config
cd config
mv [source of chainspec.toml] ./chainspec.toml
mv [source of config-example.toml] ./config-example.toml
tar -czvf ../config.tar.gz .
```

You can test what was compressed with untar'ing the file.

```
mkdir conftest
cd conftest
tar -xzvf ../config.tar.gz .
```

This will expand files for verification.

For custom `casper-node` builds, the minimun contents of `bin.tar.gz` is the `casper-node` executable. 

``` 
mkdir bin
cd bin
cp [source of casper-node] ./casper-node
tar -czvf ../bin.tar.gz .
```

A directory for the protocol_version will be created on the server.  For example: `1_1_0`

We will copy `bin.tar.gz` and `config.tar.gz` into `1_1_0`.  Once this is done, we are safe to update
`protocol_versions` by appending `1_1_0` to the end of the file and uploading into the root of the network
directory.

Now any node that runs `sudo -u casper /etc/casper/node_util.py stage_protocols <network.conf>` will get this new upgrade.

