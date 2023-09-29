---
title: EC2 Instance
---

# EC2 Instance Requirements

The following requirements describe the optimal EC2 Instance for running a Casper node.

| Requirements | Description          |
| ------------ | ---------------------|
| O.S.         | Ubuntu 20.04 LTS     |
| RAM          | 32 GB                |
| Disk Space   | 2 TB                 |
| CPU Cores    | 8                    |
| AMI          | ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20211129 |
| AMI_Type     | t3.2xlarge           |

## EC2 Instance Ports

The following ports are open to ensure the Casper service operates as intended:

| PORT  | Description                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| 22    | SSH connectivity                                                                                            |
| 3000  | Grafana dashboard                                                                                           |
| 7777  | RPC endpoint for interaction with the node's JSON-RPC API                                                   |
| 8888  | REST endpoint for status and metrics. Having this accessible allows the node to be part of the network status|
| 9999  | SSE endpoint for the event stream                                                                           |
| 35000 | Required to be part of the network                                                                          |

## EC2 Instance Configuration

The `casper-node-install-configure.sh.tftpl` serves as a template, transforming into a bash file when Terragrunt runs. It encompasses all essential commands for installing and configuring `casper-service` and monitoring services such as CloudWatch Agent and Grafana. This bash file initiates other bash files to complete the setup for backup and CloudWatch.

For more information on configuration files, please see the config module. It offers insights into other files mentioned within the casper-node-install-configure.sh.tftpl file. A separate file is necessary as AWS imposes a character limit for script templates.

## EC2 Instance Creation

This is the workflow of creating the EC2 instance for a Casper node in AWS:

<p align="center">
<img src={"/image/operators/instance-creation.png"} alt="EC2 Creation Workflow"/>
</p>
