---
title: Introduction
slug: /operators
---

# Operators

Operators who wish to run node infrastructure on a Casper network, either as a standalone private network, or as part of the public network should explore this section.

Prior knowledge of Unix-based operating systems and proficiency with systemd and bash scripting are recommended. If you are unfamiliar with systemd, the [Arch Linux page on systemd](https://wiki.archlinux.org/title/systemd) is a good introduction.

## Requirements

1. Operators should know the [Hardware requirements](./setup/hardware.md) before running a node.

2. Also, the [Network requirements](./setup/install-node.md/#network-requirements) specify how to open ports and modify the network firewall to which the node is connected. This step is necessary to allow incoming connections, enabling communication among nodes.

## Table of Contents

Review the [node's configuration](./setup/basic-node-configuration.md) first.

Then, you can follow the node [installation instructions](./setup/install-node.md).

- Setting up a Node
  - [Recommended Hardware Specifications](./setup/hardware.md): system requirements for the Casper Mainnet and Testnet
  - [Basic Node Configuration](./setup/basic-node-configuration.md): processes and files involved in setting up a Casper node
  - [Installing a Node](./setup/install-node.md): step-by-step instructions to install a Casper node
  - [Upgrading the Node](./setup/upgrade.md): before joining the network, the node needs to be upgraded
  - [Joining a Running Network](./setup/joining.md): steps to join an existing Casper network
- Becoming a Validator
  - [Bonding as a Validator](./becoming-a-validator/bonding.md): a guide about the bonding process and submitting a bid
  - [Unbonding as a Validator](./becoming-a-validator/unbonding.md): the process to withdraw a bid and unbonding
- Setting up a Network
  - [The Chain Specification](./setup-network/chain-spec.md): files needed to create a genesis block
  - [Setting up a Private Casper Network](./setup-network/create-private.md): a step-by-step guide to establishing and configuring a private Casper network
  - [Staging Files for a New Network](./setup-network/staging-files-for-new-network.md): a guide to hosting protocol files for a new Casper network
