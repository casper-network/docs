# Basic Node Configuration

This page outlines the processes and files involved in setting up a Casper node. For step-by-step node installation instructions, follow the [Node Setup](./install-node.md) guide. 

## The Casper Node Launcher {#casper-node-launcher}

A node is usually run by executing the `casper-node-launcher`, which executes the `casper-node` as a child process and also handles upgrades to bring the node to the latest version released. 

The `casper-node-launcher` can be installed via a Debian package, which also creates the `casper` user and directory structures and sets up a `systemd` unit and logging.

The `casper-node-launcher` Debian package can be obtained from <https://repo.casperlabs.io>. You only need to run the steps detailed there once.

Then, proceed to install the `casper-node-launcher` by running these commands:

```bash
sudo apt update
sudo apt install casper-node-launcher
```

You can also build [from source](https://github.com/casper-network/casper-node-launcher). However, all the setup and pull of casper-node releases will be manual.

## File Locations {#file-locations}

The `casper-node-launcher` Debian installation creates the directories and files needed to run `casper-node` versions and perform upgrades. A `casper` user and `casper` group are created during installation and used to run the software. Two main folders are relevant for our software: `/etc/casper` and `/var/lib/casper`.

**The casper-node install version**

Each version of the `casper-node` install is located based on the semantic version with underscores. For example, version 1.0.3 is represented by a directory named `1_0_3`. This convention applies to both binary and configuration file locations. Versioning with `[m_n_p]` represents the major, minor, and patch of a semantic version.

:::note

Multiple versioned folders will exist on a system when upgrades are set up.

:::

The following is the filesystem's state after installing the `casper-client` and `casper-node-launcher` Debian packages, and after running the command `sudo -u casper /etc/casper/node_util.py stage_protocols casper.conf` (Use casper-test.conf if on Testnet).

### `/usr/bin/` {#usrbin}

The default location for executables from the Debian package install is `/usr/bin`.

- `casper-client` - A client for interacting with a Casper network
- `casper-node-launcher` - The launcher application which starts the `casper-node` as a child process

### `/etc/casper/` {#etccasper}

This is the default location for configuration files. It can be overwritten with the `CASPER_CONFIG_DIR` environment variable. The paths in this document assume the default configuration file location of `/etc/casper`. The data is organized as follows:

- `delete_local_db.sh` - Removes `*.lmdb*` files from `/var/lib/casper/casper-node`
- `pull_casper_node_version.sh` - Pulls `bin.tar.gz` and `config.tar.gz` from [genesis.casperlabs.io](https://genesis.casperlabs.io/) for a specified protocol version and extracts them into `/var/lib/bin/<protocol_version>` and `/etc/casper/<protocol_version>`
- `config_from_example.sh` - Gets external IP to replace and create the `config.toml` from `config-example.toml`
- `node_util.py` - A script that will be replacing other scripts and is the preferred method of performing the actions of `pull_casper_node_version.sh`, `config_from_example.sh`, and `delete_local_db.sh`.  Other scripts will be deprecated in future releases of `casper-node-launcher`.
- `casper-node-launcher-state.toml` - The local state for the `casper-node-launcher` which is created during the first run
- `validator_keys/` - The default folder for node keys, containing:
    - `README.md` - Instructions on how to create validator keys using the `casper-client`
    - `secret_key.pem` - Secret key used by the validator node to sign blocks and peer-to-peer messages
    - `public_key.pem` - Public key associated with the secret key above, stored in PEM format
    - `public_key_hex` - Public key associated with the secret key above, stored in hex format
- `1_0_0/` - Folder for genesis configuration files, containing:
    - `accounts.toml` - Contains the genesis validators and delegators
    - `chainspec.toml` - Contains invariant network settings, with the `activation_point` (network start time) as a timestamp
    - `config-example.toml` - Example for creating a `config.toml` file
    - `config.toml` - Contains variable node configuration settings, created by a node operator manually or by running `config_from_example.sh 1_0_0`
- `m_n_p/` - Folder for each installed upgrade package's configuration files, containing:
    - `chainspec.toml` - Contains invariant network settings, with the `activation_point` as an era ID (the era at which this protocol version of the node became or will become active) 
    - `config-example.toml` - As per `1_0_0/config-example.toml`, but compatible with the `m.n.p` version of the node
    - `config.toml` - As per `1_0_0/config.toml`, but compatible with the `m.n.p` version of the node

### `/var/lib/casper/` {#varlibcasper}

This is the location for larger and variable data for the `casper-node`, organized in the following folders and files:
- `bin/` - The parent folder storing the versions of `casper-node` executables. This location can be overwritten with the `CASPER_BIN_DIR` environment variable. The paths in this document assume the default of `/var/lib/casper/bin/`.
    - `1_0_0/` - Folder for genesis binary files, containing:
        - `casper-node` - The node executable - defaults to the Ubuntu 20.04 compatible binary
        - `README.md` - Information about the repository location and the Git hash used for compilation to allow a rebuild on other platforms
    - `m_n_p/` - Folder for each installed upgrade package, containing:
        - `casper-node` - As per `1_0_0/casper-node`, but the `m.n.p` version of the node
        - `README.md` - As per `1_0_0/README.md`, but compatible with the `m.n.p` version of the node

- `casper-node/<NETWORK NAME>` - Folder containing databases and related files produced by the node binary. For Mainnet, the network name is `casper` and for Testnet it is `casper-test`.
    - `data.lmdb` - Persistent global state store of the network
    - `data.lmbd-lock` - Lockfile for the `data.lmdb` database
    - `storage.lmdb` - Persistent store of all other network data, primarily Blocks and Deploys
    - `storage.lmdb-lock` - Lockfile for the `storage.lmdb` database
    - `unit_files/` - Folder containing transient caches of consensus information

## Node Version Installation {#node-version-installation}

Included with the `casper-node-launcher` is `node_util.py` for installing `casper-node` versions. This command will stage all current `casper-node` versions:

```bash
sudo -u casper /etc/casper/node_util.py stage_protocols <NETWORK_CONFIG>
```

For `<NETWORK_CONFIG>`, we use `casper.conf` for Mainnet and `casper-test.conf` for Testnet.  This will install all currently released protocols in one step.

This command will do the following:
- Create `/var/lib/casper/bin/1_0_2/` and expand the `bin.tar.gz` containing at a minimum `casper-node`
- Create `/etc/casper/1_0_2/` and expand the `config.tar.gz` containing `chainspec.toml`, `config-example.toml`, and possibly `accounts.csv` and other files
- Remove the archive files and run `/etc/casper/config_from_example.sh 1_0_2` to create a `config.toml` from the `config-example.toml`

Release versions are invoked using the underscore format, such as:

```bash
sudo -u casper /etc/casper/pull_casper_node_version.sh 1_0_2
```

## The Node Configuration File {#config-file}

One `config.toml` file exists for each `casper-node` version installed. It is located in the `/etc/casper/[m_n_p]/` directory, where `m_n_p` is the current semantic version. This can be created from the `config-example.toml` by using `/etc/casper/config_from_example.sh [m_n_p]` where `[m_n_p]` is replaced with the current version, using underscores.

Below are some fields in the `config.toml` that you may need to adjust.

### The Trusted Hash for Synchronizing {#trusted-hash-for-synchronizing}

Each Casper network is a permissionless, Proof-of-Stake network, implying that nodes can join and leave the network. As a result, some nodes may not be synchronized or as secure as bonded validators. Ideally, all nodes will join the network using a trusted source, such as a bonded validator. 

When joining the network, the system will start from the hash of a recent block and then work backward to obtain the finalized blocks from the linear block store. Here is the process to get the trusted hash of a bonded validator:

- Find a list of trusted validators
- Query the status endpoint of a trusted validator (`http://<NODE_IP_ADDRESS>:8888/status`)
- Obtain the hash of a block from the status endpoint
- Update the `config.toml` for the node to include the trusted hash. There is a field dedicated to this near the top of the file

Here is an example command for obtaining a trusted hash. Replace the node address with an updated address from a node on the network.

```bash
sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.14.161.135:7777 -b 20 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_0_0/config.toml
```

### Known Addresses {#known-addresses}

For the node to connect to a network, the node needs a set of trusted peers for that network. For [Mainnet](https://cspr.live/), these are listed in the `config.toml` as `known_addresses`. For other networks, locate and update the list to include at least two trusted IP addresses for peers in that network. Here is an [example configuration](https://github.com/casper-network/casper-protocol-release/blob/main/config/config-example.toml). The [casper-protocol-release](https://github.com/casper-network/casper-protocol-release) repository stores configurations for various environments, which you can also use as examples.

### Updating the `config.toml` file {#updating-config-file}

At the top of a `config.toml` file as shown here, enter the trusted block hash to replace the `'HEX-FORMATTED BLOCK HASH'` and uncomment the line by deleting the leading '#'. See the [Configuration File](./basic-node-configuration.md#config-file) for more details.

```
# ================================
# Configuration options for a node
# ================================
[node]

# If set, use this hash as a trust anchor when joining an existing network.
#trusted_hash = 'HEX-FORMATTED BLOCK HASH'
```

### Secret Keys {#secret-keys}

Provide the path to the secret keys for the node. This path is set to `etc/casper/validator_keys/` by default. See [Creating Keys and Funding Accounts](#create-fund-keys) for more details.

### Networking and Gossiping {#networking--gossiping}

The node requires a publicly accessible IP address. The `config_from_example.sh` and `node_util.py` both allow IP for network address translation (NAT) setup. Specify the public IP address of the node. If you use the `config_from_example.sh` external services are called to find your IP and this is inserted into the `config.toml` created.

The following default values are specified in the file if you want to change them:

- The port that will be used for status and deploys
- The port used for networking
- Known_addresses - these are the bootstrap nodes (there is no need to change these)

### Enabling Speculative Execution

The `speculative_exec` endpoint provides a method to execute a Deploy without committing its execution effects to global state. This can be used by developers to roughly estimate the gas costs of sending the Deploy in question. By default, `speculative_exec` is disabled on a node.

`speculative_exec` can be enabled within *config.toml* by changing `enable_server` to `true` under the configuration options for the speculative execution JSON-RPC HTTP server.

Node operators may also change the incoming request port for speculative execution, which defaults to `7778`. Further, you can choose to alter the `qps_limit` and `max_body_bytes`, which limit the amount and size of requests to the speculative execution server.

<details>
<summary><b>Example Config.toml configuration with speculative execution enabled</b>b></summary>
    
```
# ========================================================================
# Configuration options for the speculative execution JSON-RPC HTTP server
# ========================================================================
[speculative_exec_server]

# Flag which enables the speculative execution JSON-RPC HTTP server.
enable_server = true

# Listening address for speculative execution JSON-RPC HTTP server.  If the port
# is set to 0, a random port will be used.
#
# If the specified port cannot be bound to, a random port will be tried instead.
# If binding fails, the speculative execution JSON-RPC HTTP server will not run,
# but the node will be otherwise unaffected.
#
# The actual bound address will be reported via a log line if logging is enabled.
address = '0.0.0.0:7778'

# The global max rate of requests (per second) before they are limited.
# Request will be delayed to the next 1 second bucket once limited.
qps_limit = 1

# Maximum number of bytes to accept in a single request body.
max_body_bytes = 2_621_440

# Specifies which origin will be reported as allowed by speculative execution server.
#
# If left empty, CORS will be disabled.
# If set to '*', any origin is allowed.
# Otherwise, only a specified origin is allowed. The given string must conform to the [origin scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin).
cors_origin = ''
```

</details>

## Rust Client Installation {#client-installation}

The [Prerequisites](../../developers/prerequisites.md#the-casper-command-line-client) page lists installation instructions for the Casper client, which is useful for generating keys and retrieving information from the network.

## Creating Keys and Funding Accounts {#create-fund-keys}

The following command will create keys in the `/etc/casper/validator_keys` folder.

```bash
sudo -u casper casper-client keygen /etc/casper/validator_keys
```

To learn about other options for generating keys, see [Accounts and Cryptographic Keys](../../concepts/accounts-and-keys.md) or run the Rust client `keygen` command with the `--help` option. 

```bash
sudo -u casper casper-client keygen --help
```

More about keys and key generation can also be found in `/etc/casper/validator_keys/README.md` if the `casper-node-launcher` was installed from the Debian package.

:::note

Save your keys in a secure location, preferably offline.

:::

To submit a bonding request, you will need to [fund your account](../../developers/prerequisites.md#fund-your-account) as well.

