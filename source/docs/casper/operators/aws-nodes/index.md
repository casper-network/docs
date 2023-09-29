---
title: AWS Nodes
---

# Read-Only Casper Nodes in AWS

The procedure to instantiate Casper nodes in AWS builds on the methodologies detailed in [Installing a Node](../setup/install-node.md), excluding the steps for network bonding and acquiring validator status. Bonding converts a node into a validator node, a concept outside the scope of the IaC infrastructure. Thus, Casper nodes configured with this approach operate as read-only nodes.

## Advantages of using IaC in AWS

Running a Casper node using IaC in AWS has the following advantages:

* An operator can create a node with a single command, which manages the creation of the entire infrastructure.
* Operators can add a security layer, including a VPN server, for secure access to the node.
* This architecture includes an auto-scaling mechanism, which takes care of the node lifecycle, allowing automatic recovery if the node is unresponsive, creating a new node, and replacing the unresponsive one.
* The node maintains the same public IP.
* A secure service can manage credentials.
* This infrastructure performs backups of the node’s data once the node achieves synchronization. The default schedule runs every Friday at 00:00:00.

## Architecture

This architecture aims to uphold the integrity and security of the Casper node. Should an unexpected shutdown occur, the autoscaling group will generate a new node with the identical keys and data.

<p align="center">
<img src={"/image/operators/aws-casper.png"} alt="Casper AWS Node Architecture"/>
</p>

## Table of Contents

| Topic                                                     | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| [Deploy the Infrastructure](./1-deploying.md)             | How to deploy the infrastructure in AWS.            |
| [Validate and Monitor the Node](./2-validating.md)        | Validate the AWS setup and monitor the Casper node. |
| [EC2 Instances](./3-instances.md)                         | Optimal EC2 Instance for running a Casper node.     |
| [Implemented Modules](./4-modules.md)                     | Details about the modules implemented in this IaC.  |
| [Restore and Backup](./5-backup.md)                       | Restoring and Backing up Blockchain Data.           |
| [Setup OpenVPN](./6-open-vpn.md)                          | Configure the Open VPN Server.                      |
| [Troubleshooting](./7-troubleshooting.md)                 | Troubleshooting Tips for Operators.                 |
