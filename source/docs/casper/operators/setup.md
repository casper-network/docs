# Basic Node Setup

A node is setup using the `casper-node-launcher` package, which sets up the directory structure and installs all the necessary files.  

## Casper Node Launcher {#casper-node-launcher}

The node software is run from the `casper-node-launcher` package. This can be installed with a Debian package, which also creates the `casper` user, creates directory structures, and sets up a _systemd_ unit and _logging_.

The casper-node-launcher Debian package can be obtained from <https://repo.casperlabs.io/>. You only need to run these steps once.

Then, proceed to install the casper-node-launcher by running these commands:

```bash
sudo apt update
sudo apt install casper-node-launcher
```

You can also build from source on [GitHub](https://github.com/casper-network/casper-node-launcher). However, all of the setup and pull of casper-node releases will be manual.

## File Locations {#file-locations}

The `casper-node-launcher` Debian install creates the directories and files needed for running `casper-node` versions and performing upgrades. A _casper_ user and _casper_ group is created during install and used to run the software. Two main folders are relevant for our software: `/etc/casper` and `/var/lib/casper`.

**The casper-node install version**

Each version of the `casper-node` install is located based on the semantic version with underscores. For example, version _1.0.3_ is represented by a directory named `1_0_3`. This convention applies to both binary and configuration file locations. Versioning with `[m_n_p]` represents the major, minor, and patch of a semantic version.

:::note

Multiple versioned folders will exist on a system when upgrades are setup.

:::

The following is the state of the filesystem after installing the `casper-client` and `casper-node-launcher` Debian packages, and also after running the script _/etc/casper/pull_casper_node_version.sh_:

### `/usr/bin` {#usrbin}

The default location for executables from the Debian package install is `/usr/bin`.

-   `casper-client` - A client for interacting with the Casper network
-   `casper-node-launcher` - The launcher application which starts the `casper-node` as a child process

### `/etc/casper` {#etccasper}

This is the default location for configuration files. It can be overwritten with the `CASPER_CONFIG_DIR` environment variable. The paths in this document assume the default configuration file location of `/etc/casper`. The data is organized as follows:

-   **delete_local_db.sh** - Removes _*.lmdb*_ from `/var/lib/casper/casper-node`

-   **pull_casper_node_version.sh** \<protocol*version> \<network_name> - Pulls `bin.tar.gz` and `config.tar.gz` from [genesis.casperlabs.io](http://genesis.casperlabs.io/) for a protocol package; decompresses them into `/var/lib/bin/<protocol_version>` and `/etc/casper/<protocol_version>`, and removes the *\*.tar.gz\_ files

-   **config_from_example.sh** \<protocol*version> - Gets external IP to replace and create the \_config.toml* from _config-example.toml_ 

-   **node_util.py** - A script that will be replacing other scripts and is the preferred method of performing the actions of `pull_casper_node_version.sh`, `config_from_example.sh`, and `delete_local_db.sh`.  Other scripts will be deprecated in future releases of `casper-node-launcher`.

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

### `/var/lib/casper` {#varlibcasper}

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

## Node Version Installation {#node-version-installation}

Included with `casper-node-launcher` is `node_util.py` to installing `casper-node` versions.
To stage all current `casper-node` versions we would run:

`sudo -u casper /etc/casper/node_util.py stage_protocols <NETWORK_CONFIG>`

We use `casper.conf` for MainNet and `casper-test.conf` for TestNet.  This will install all currently released protocols in one step.
`/etc/casper/pull_casper_node_version.sh` will pull `bin.tar.gz` and `config.tar.gz` from genesis.casperlabs.io.

This is invoked with the release version in underscore format such as:

```bash
sudo -u casper /etc/casper/pull_casper_node_version.sh 1_0_2
```

This command will do the following:
- Create `/var/lib/casper/bin/1_0_2/` and expand the `bin.tar.gz` containing at a minimum `casper-node`
- Create `/etc/casper/1_0_2/` and expand the `config.tar.gz` containing `chainspec.toml`, `config-example.toml`, and possibly `accounts.csv` and other files
- Remove the archive files and run `/etc/casper/config_from_example.sh 1_0_2` to create a `config.toml` from the `config-example.toml`

## Create and Fund Keys {#create-fund-keys}

To create keys, you must setup the casper command line client. For instructions on setting up the command line client, creating keys and funding your accounts, see [Prerequisites](../workflow/setup.md). The Rust client generates keys via the `keygen` command. The process generates 2 _pem_ files and 1 _text_ file. To learn about options for generating keys, include `--help` when running the `keygen` command. The following command will create the keys in the `/etc/casper/validator_keys` folder. 

```bash
sudo casper-client keygen /etc/casper/validator_keys
```

More about keys and key generation can be found in `/etc/casper/validator_keys/README.md` if `casper-node-launcher` was installed from the Debian package. You can also find for more information on keys, in the [Working with Cryptographic Keys](../dapp-dev-guide/keys.md) section.

## Config File {#config-file}

One `config.toml` file exists for each `casper-node` version installed. It is located in the `/etc/casper/[m_n_p]/` directory, where `m_n_p` is the current semantic version. This can be created from `config-example.toml` by using `/etc/casper/config_from_example.sh [m_n_p]` where `[m_n_p]` is replaced current version with underscores.

Below are some fields in the `config.toml` that you may need to adjust.

### Trusted Hash for Synchronizing {#trusted-hash-for-synchronizing}

The Casper network is a permissionless, proof of stake network - which implies that validators can come and go from the network. The implication is that, after a point in time, historical data could have less security if it is retrieved from 'any node' on the network. Therefore, joining the network has to be from a trusted source, a bonded validator. The system will start from the hash from a recent block and then work backward from that block to obtain the deploys and finalized blocks from the linear block store. Here is the process to get the trusted hash:

-   Find a list of trusted validators.
-   Query the status endpoint of a trusted validator ( <http://%5Bvalidator_id%5D:8888/status> )
-   Obtain the hash of a block from the status endpoint.
-   Update the `config.toml` for the node to include the trusted hash. There is a field dedicated to this near the top of the file.

### Secret Keys {#secret-keys}

Provide the path to the secret keys for the node. This is set to `etc/casper/validator_keys/` by default.

### Networking and Gossiping {#networking--gossiping}

The node requires a publicly accessible IP address. We do not recommend NAT at this time. Specify the public IP address of the node. If you use the `config_from_example.sh` external services are called to find your IP and this is inserted into the created `config.toml`.

Default values are specified in the file if you want to change them:

-   Specify the port that will be used for status & deploys
-   Specify the port used for networking
-   Known_addresses - these are the bootstrap nodes. No need to change these.
