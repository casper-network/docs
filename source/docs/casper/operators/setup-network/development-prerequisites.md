# Setting up a Network

It is possible to create a new network or join an existing network. This page outlines the basics for creating a new network.

## The Chain Specification {#the-chain-specification}

The Casper node software creates a genesis block from the following input files:

- chainspec.toml
- accounts.toml

### chainspec.toml {#chainspectoml}

A version of the [chainspec](../../concepts/glossary/C.md#chainspec) is downloaded by the `pull_casper_node_version.sh` script installed with the casper-node-launcher debian package. This script pulls the chainspec.toml file from the appropriate path defined in the network config file used (`casper.conf` for MainNet and `casper-test.conf` for TestNet).

The production version of the file from which this is based on can be found at `casper-node/resources/production/chainspec.toml` in the code base. To create a custom network, this file can be updated as desired. Any changes to this file will result in a different genesis hash. Refer to the file itself for detailed documentation on each of the variables in the file.

### accounts.toml {#accountstoml}

This file contains the genesis validator set information, starting accounts and associated balances and bond amounts.

If an account is not bonded at genesis, specify a `0` for the bond amount.

Similar to the chainspec.toml, this is pulled from the appropriate path defined in the network config file used.
