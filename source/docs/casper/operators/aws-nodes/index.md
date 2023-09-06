---
title: AWS Nodes
---

# Read-Only Casper Nodes in AWS

The Casper ecosystem includes the [casper-node-on-cloud](https://github.com/casper-ecosystem/casper-node-on-cloud/) repository for creating Casper nodes using Amazon Web Services (AWS). The project uses an Infrastructure as code (IaC) approach with **Terraform**, **Terragrunt**, and **Bash**.

The procedure for creating Casper nodes in AWS is based on the steps for [Installing a Node](../setup/install-node.md) and does not include the steps for bonding to the network and becoming a validator. Bonding makes the node a validator node, which is outside the scope of the IaC infrastructure. Therefore, the Casper nodes created with this approach are read-only nodes.

## Advantages of using IaC in AWS

Running a Casper node using IaC in AWS has the following advantages:

* An operator can create a node quickly with a single command that takes care of creating the entire infrastructure.
* Operators can add a security layer, including a VPN server, for secure access to the node.
* This architecture includes an auto-scaling mechanism, which takes care of the node lifecycle, allowing automatic recovery if the node is unresponsive, creating a new node, and replacing the unresponsive one.
* The node maintains the same public IP.
* A secure service can manage credentials.
* This infrastructure allows for weekly backups of the node's data when the node is synchronized. The default schedule is every Friday at 00:00:00.

## Architecture

The purpose of this architecture is to maintain the integrity and security of the Casper node. In case of an unexpected shutdown, the autoscaling group will create a new node with the same keys and data.

<p align="center">
<img src={"/image/operators/aws-casper.png"} alt="Casper AWS Node Architecture"/>
</p>

## Table of Contents

| Topic                                                     | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| [Deploy the Infrastructure](./1-deploying.md)             | How to deploy the infrastructure in AWS.            |
| [Validate and Monitor the Node](./2-connecting.md)        | Validate the AWS setup and monitor the Casper node. |
| [Implemented Modules](./3-modules.md)                     | Details about the modules implemented in this IaC.  |
| [Restore and Backup](./4-backup.md)                       | Restoring and Backing up Blockchain Data.           |
| [Setup OpenVPN](./5-open-vpn.md)                          | Configure the Open VPN Server.                      |
| [Troubleshooting](./6-troubleshooting.md)                 | Troubleshooting Tips for Operators.                 |
