---
title: AWS Nodes
---

# Read-Only Casper Nodes in AWS

This project comprises the implementation of the Infrastructure as Code (IaC) to deploy a *read-only* [Casper node](https://github.com/casper-network/casper-node) on AWS. The procedure for the creation of this node is strongly based on the document *"[Setup Main Net validator node from scratch on Ubuntu 20.04 on AWS](https://docs.cspr.community/docs/aws/setup-mainnet-validator-from-scratch.html)"* until before *bonding*. Bonding makes the node a validator node, which is outside of the scope of the infrastructure as code developed in this project at the moment. The project is developed using **Terraform**, **Terragrunt** and **Bash** mainly.

## Advantages to use IaC to deploy a Read-only Node in a Cloud Service

There are numerous advantages when it comes to running a Casper node on cloud using IaC, for this solution you will find:

* Through this project, the operator can create a node between in less time than by doing it manually with just the execution of a command that will take care of creating the entire infrastructure.
* You will have the option to add a security layer, including a VPN server for secure access to the node.
* This architecture will include an Auto-Scaling mechanism, which is a cloud service that takes care of the lifecycle of the instance, in this case, the node. This allows for the addition of mechanisms to automatically recover the node from any problem that leaves it unresponsive, creating a new node and replacing the broken one.
  * Maintain the same public IP
  * Keep the keys in a secure service
  * Backup of the node's data every week *(by default is every Friday at 00:00:00)*, when it is synchronized

## Architecture

The purpose of this architecture is to maintain the integrity and security of the node. In case of an unexpected shutdown, the autoscaling group will recreate a new node with the same keys and data so the node maintains the same information as the latter one.

<p align="center">
<img src={"/image/operators/aws-casper.png"} alt="Casper AWS Node Architecture" width="500"/>
</p>

## Table of Contents

| Topic    | Description                                                     |
| ----------- | ------------------------------------------------------------ |
| [How to deploy the infrastructure](./1-deploying.md) |  |
| [Monitoring Node](./2-connecting.md)     |  |
| [About the modules implementations](./3-modules.md) |   |
| [Restore & Backup Blockchain data process](./4-backup.md) |  |
| [Setup OpenVPN](./5-open-vpn.md)      |          |
| [Troubleshooting](./6-troubleshooting.md)  |  |


<!--
Content from:

Directory with the code: https://github.com/casper-ecosystem/casper-node-on-cloud/

https://github.com/casper-ecosystem/casper-node-on-cloud/wiki

https://docs.cspr.community/docs/aws/setup-testnet-validator-from-scratch.html
-->