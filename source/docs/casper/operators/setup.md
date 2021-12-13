# Basic Node Setup

## Casper Node Launcher {#casper-node-launcher}

The node software is run from the `casper-node-launcher` package. This can be installed with a Debian package which also creates the Casper user, creates directory structures and sets up a _systemd_ unit and _logrotate_.

The casper-node-launcher Debian package can be obtained from <https://repo.casperlabs.io/>. You only need to run these steps once.

Then, proceed to install the casper-node-launcher by running these commands:

```bash
sudo apt update
sudo apt install casper-node-launcher
```

You can also build from source: <https://github.com/casper-network/casper-node-launcher>. However, all of the setup and pull of casper-node releases will be manual.

### File Locations {#file-locations}

This section describes the directories and files the `casper-node-launcher` Debian install creates, needed for running `casper-node` versions and performing upgrades.

A _casper_ user and _casper_ group is created during install and used to run the software.

Each version of the `casper-node` install is located based on the semantic version with underscores. For example, version _1.0.3_ would be represented by a directory named `1_0_3`. This convention applies to both binary and configuration file locations. We will represent versioning with `[m_n_p]` below, representing the major, minor, patch of a semantic version.

**Note**: multiple versioned folders will exist on a system when upgrades are setup.

The installation of `casper-node-launcher`, `casper-node`, and `casper-client` software is relatively simple, but the process accomplishes many things behind the scenes. This section describes the installation process and where the files are stored.

Two main folders are relevant for our software: `/etc/casper` and `/var/lib/casper`.

The following is the state of the filesystem after installing the `casper-client` and `casper-node-launcher` Debian packages, and also after running the script _/etc/casper/pull_casper_node_version.sh_.

#### `/usr/bin` {#usrbin}

The default location for executables from the Debian package install is `/usr/bin`.

-   `casper-client` - A client for interacting with the Casper network
-   `casper-node-launcher` - The launcher application which starts the `casper-node` as a child process

#### `/etc/casper` {#etccasper}

This is the default location for configuration files. It can be overwritten with the `CASPER_CONFIG_DIR` environment variable. The paths in this document assume the default configuration file location of `/etc/casper`. The data is organized as follows:

-   **delete_local_db.sh** - Removes _*.lmdb*_ from `/var/lib/casper/casper-node`

-   **pull_casper_node_version.sh** \<protocol*version> \<network_name> - Pulls `bin.tar.gz` and `config.tar.gz` from [genesis.casperlabs.io](http://genesis.casperlabs.io/) for a protocol package; decompresses them into `/var/lib/bin/<protocol_version>` and `/etc/casper/<protocol_version>`, and removes the *\*.tar.gz\_ files

-   **config_from_example.sh** \<protocol*version> - Gets external an IP to replace and create the \_config.toml* from _config-example.toml_

-   **casper-node-launcher-state.toml** - This is the local state for the `casper-node-launcher` and it is created during the first run

-   `validator_keys` - The default location for node keys.

    -   **README.md** - Instructions on how to create validator keys using the `casper-client`
    -   **secret_key.pem** - `casper-client keygen` creates this file or it is manually copied here
    -   **public_key.pem** - `casper-client keygen` creates this file or it is manually copied here
    -   **public_key_hex** - `casper-client keygen` creates this file or it is manually copied here

-   `1_0_0` - created with _pull_casper_node_version.sh 1_0_0 \<network_name>_ for genesis files

    -   **accounts.toml** - Contains the genesis validators and delegators
    -   **chainspec.toml** - Contains the genesis state with the _activation_point_ as a timestamp
    -   **config-example.toml** - Example for creating a _config.toml_ file
    -   **config.toml** - Created by a node operator manually or by running _config_from_example.sh 1_0_0_

-   `m_n_p` - _0_ to _N_ upgrade packages

    -   **chainspec.toml** - Contains the _activation_point_ as the Era ID int
    -   **config-example.toml** - Example for creating a _config.toml_ file
    -   **config.toml** - Created by a node operator manually or by running _config_from_example.sh \<protocol_version>_

#### `/var/lib/casper` {#varlibcasper}

This is the location for larger and variable data for the `casper-node`, organized in the following directories and files:

-   `bin` - The location for storing the versions of `casper-node` executables. This location can be overwritten with the `CASPER_BIN_DIR` environment variable. The paths in this document assume the default of `/var/lib/casper/bin`.

    -   `1_0_0` - Created with _pull_casper_node_version.sh 1_0_0 \<network_name>_ for binaries

        -   `casper-node` - Defaults to the Ubuntu 18.04 compatible binary
        -   **README.md** - Information about the repository location and the Git hash used for compilation to allow a rebuild on other platforms

    -   `m_n_p` - _0_ to _N_ upgrade packages for binaries using _pull_casper_node_version.sh 1_0_0 \<network_name>_

        -   `casper-node` - This is where the given version of the `casper-node` executable lives and is run from the `casper-node-launcher`.
        -   **README.md**

-   `casper-node` - Local data store and the largest user of disc space

    -   **data.lmdb** - Global state of the chain
    -   **data.lmbd-lock**
    -   **storage.lmdb** - Blocks, deploys, and everything else
    -   **storage.lmdb-lock**
    -   **unit\_\*** - The node creates one of these files per era

### Upgrade Operation {#upgrade-operation}

The `chainspec.toml` contains a section to indicate what era the given `casper-node` version should start running.

```
[protocol.activation_point]
# This protocol version becomes active at the start of this era.
era_id = 0
```

At every block finalization, the `casper-node` looks for newly configured versions. When a new version is configured, the running node will look at future era_id in the `chainspec.toml` file. This will be the era before where the current casper-node will cleanly shut down.

The `casper-node-launcher` will detect a clean exit 0 condition and start the next version `casper-node`.

You can choose to build from source. If you opt to do this, please ensure that the correct software version (tag) is used.

### Node Version Installation {#node-version-installation}

Included with `casper-node-launcher` debian package are two scripts to help with installing `casper-node` versions.

`/etc/casper/pull_casper_node_version.sh` will pull `bin.tar.gz` and `config.tar.gz` from genesis.casperlabs.io.

This is invoked with the release version in underscore format such as:

```bash
sudo -u casper /etc/casper/pull_casper_node_version.sh 1_0_2
```

This will create `/var/lib/casper/bin/1_0_2/` and expand the `bin.tar.gz` containing at a minimum `casper-node`.

This will create `/etc/casper/1_0_2/` and expand the `config.tar.gz` containing `chainspec.toml`, `config-example.toml`, and possibly `accounts.csv` and other files.

This will remove the archive files and run `/etc/casper/config_from_example.sh 1_0_2` to create a `config.toml` from the `config-example.toml`.

### Client Installation {#client-installation}

The `casper-client` can be installed from <https://crates.io/crates/casper-client>.

Run the commands below to install the Casper client on most flavors of Linux and macOS. 

```bash
cargo install casper-client
```

The Casper client can print out _help_ information, which provides an up-to-date list of supported commands.

```bash
casper-client --help
```

For each command, you can use _help_ to get the up-to-date arguments and descriptions:

```bash
casper-client <command> --help
```

### Create Keys {#create-keys}

The Rust client generates keys via the `keygen` command. The process generates 2 _pem_ files and 1 _text_ file. To learn about options for generating keys, include `--help` when running the `keygen` command.

```bash
sudo casper-client keygen /etc/casper/validator_keys
```

More about keys and key generation can be found in `/etc/casper/validator_keys/README.md` if `casper-node-launcher` was installed from the Debian package.

## Config File {#config-file}

One `config.toml` file will need to exist for each `casper-node` version installed. It should be located in the `/etc/casper/[m_n_p]/` directory where `m_n_p` is the current semantic version. This can be created from `config-example.toml` by using `/etc/casper/config_from_example.sh [m_n_p]` where `[m_n_p]` is replaced current version with underscores.

Below are some fields you may find in the `config.toml` that you may want or need to adjust.

### Trusted Hash for Synchronizing {#trusted-hash-for-synchronizing}

The Casper network is a permissionless, proof of stake network - which implies that validators can come and go from the network. The implication is that, after a point in time, historical data could have less security if it is retrieved from 'any node' on the network. Therefore, joining the network has to be from a trusted source, a bonded validator. The system will start from the hash from a recent block and then work backward from that block to obtain the deploys and finalized blocks from the linear block store. Here is the process to get the trusted hash:

-   Find a list of trusted validators.
-   Query the status endpoint of a trusted validator ( <http://%5Bvalidator_id%5D:8888/status> )
-   Obtain the hash of a block from the status endpoint.
-   Update the `config.toml` for the node to include the trusted hash. There is a field dedicated to this near the top of the file.

### Secret Keys {#secret-keys}

Provide the path to the secret keys for the node. This is set to `etc/casper/validator_keys/` by default.

### Networking & Gossiping {#networking--gossiping}

The node requires a publicly accessible IP address. We do not recommend NAT at this time. Specify the public IP address of the node. If you use the `config_from_example.sh` external services are called to find your IP and this is inserted into the created `config.toml`.

Default values are specified in the file if you want to change them:

-   Specify the port that will be used for status & deploys
-   Specify the port used for networking
-   Known_addresses - these are the bootstrap nodes. No need to change these.
