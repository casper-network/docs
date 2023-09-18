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

The following ports are open to run the Casper service successfully:

| PORT  | Description                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| 22    | SSH connectivity                                                                                            |
| 3000  | Grafana dashboard                                                                                           |
| 7777  | RPC endpoint for interaction with the node's JSON-RPC API                                                   |
| 8888  | REST endpoint for status and metrics. Having this accessible allows the node to be part of the network status|
| 9999  | SSE endpoint for the event stream                                                                           |
| 35000 | Required to be part of the network                                                                          |

## EC2 Instance Configuration

The `casper-node-install-configure.sh.tftpl` is a template that converts to a bash file when Terragrunt runs. It contains all the installation and configuration commands the `casper-service` and monitoring services (e.g., CloudWatch Agent and Grafana) need. This bash file calls other bash files to finish the configuration for backup and CloudWatch.

To see more configuration files, go to the config module. You will see a detailed explanation of the other configuration files referenced inside the code of the `casper-node-install-configure.sh.tftpl` file. This file needs to be separated because there is a character limit for script templates in AWS.

## EC2 Instance Creation

This is the workflow of creating the EC2 instance for a Casper node in AWS:

<p align="center">
<img src={"/image/operators/instance-creation.png"} alt="EC2 Creation Workflow"/>
</p>
