---
title: Implemented Modules
---

# Implemented Modules

This section describes AWS modules helpful for running and monitoring the node.

## Monitoring Modules

All modules pertinent to overseeing the node. AWS offers a suite of services enabling operators to observe both the node and Casper service status. These services allow the establishment of alarms and provide a visual representation on a dashboard, displaying the node's resources and capacity in real time.

| AWS Services Used     | Description                                                         |
| --------------------  | ------------------------------------------------------------------- |
| CloudWatch Dashboard  | Customized views of metrics and alarms for AWS resources.           |
| CloudWatch Alarms     | Sends a message or performs an action when the alarm changes state. |
| CloudWatch Synthetics | Canaries are scripts that oversee endpoints and APIs.                  |
| CloudWatch Agent        | Collects metrics, logs, and traces from Amazon EC2 instances.       |
| CloudWatch Logs         | Centralized logs from all systems, applications, and AWS services.  |
| CloudWatch Canary Code Template Module | Module that initializes and configures `cw_namespace` and `aws_region`. |
| Dashboard Template Module | Module required to create the dashboard. |

### CloudWatch Dashboard

The IaC establishes a dashboard to oversee all pertinent resources. This dashboard displays connectivity status, blockchain metrics like block height, block time, and era count, along with node metrics including CPU, memory, and disk usage.

<p align="center">
<img src={"/image/operators/cloudwatch-dashboard.png"} alt="Cloudwatch Dashboard"/>
</p>

### CloudWatch Alarms

The following table shows the alarms created by the module and their respective configuration:

| Alarm      | Description                                   |
| ---------- | --------------------------------------------- |
| CPU Alarm  | CPU Alarm activates when usage is above 70%.  |
| RAM Alarm  | RAM Alarm activates when usage is above 80%.  |
| DISK Alarm | DISK Alarm activates when usage is above 90%. |

**Sample alarms:**

<p align="center">
<img src={"/image/operators/alarms-list.png"} alt="Alarms created"/>
</p>

**Sample email notification:**

<p align="center">
<img src={"/image/operators/email-notification.png"} alt="Alarm email notification"/>
</p>

#### Subscriber List

The subscriber module generates an SNS Topic using the emails listed in the root `terragrunt.hcl` file. This SNS Topic facilitates email notifications upon the activation of an alarm.

### CloudWatch Synthetics

The synthetic canary created by the CloudWatch Synthetics module checks the status of the `casper-node-launcher` service by checking this endpoint: `http://NODE_IP:8888/status`.

This is an example of the output when the canary detects whether the service is up or down:

<p align="center">
<img src={"/image/operators/canary-casper-service.png"} alt="Canary Casper service example"/>
</p>

#### Canary Log Group

A Log Group module for the **synthetic canary service** stores all logs derived from the canary tests as follows:

| Name                   | Description               |
| ---------------------- | ------------------------  |
| `casper-node.log`        | Casper node daemon and the blockchain logs |
| `casper-node.stderr.log` | Casper node daemon and the blockchain error logs|

### CloudWatch Agent

A CloudWatch Agent obtains the following metrics every 30 seconds:

| Metrics                | Description               |
| ---------------------- | ------------------------- |
| casper-node logs       | casper service logs       |
| casper-node error logs | casper service error logs |
| disk_total             | disk total capacity       |
| disk_used              | disk usage in GB          |
| disk_percent           | disk usage in percentage  |
| mem_used               | RAM usage in GB           |
| mem_used_percent       | RAM usage in percentage   |

### Cloudwatch Logs

In CloudWatch, you can locate distinct log groups that hold logs in text format, offering access to pertinent information from different services. Below is a description of the logs available within these log groups:

| Metrics                | Description               |
| ---------------------- | ------------------------- |
| /aws/codebuild/casper-poc-{env} | Logs related to running Terragrunt via CodeBuild. |
| /aws/lambda/rotateVolumeSnapshots | Logs from the script that takes snapshots of the EBS. |
| canary-lg-{env} | Logs related to running the synthetic canary in a specific environment. |
| casper-node.log | Logs from the CloudWatch agent on the node, containing information related to the Casper node daemon and the blockchain. |
| casper-node.stderr.log | Logs from the CloudWatch agent on the node, containing information related to the Casper node daemon errors. |

### CloudWatch Canary Code Template Module

The CloudWatch canary code template module, `Template_CW_CF`, uses the `cw_agent_config.json` template file to add and configure the `cw_namespace` and `aws_region` variables provided in the root file `terragrunt.hcl`.

### Dashboard Template Module

The template module `alerting/cloudwatch` creates and configures the CloudWatch dashboard.

## Processing and Storage Modules

The following modules create and manage AWS compute and storage resources and services. AWS offers a suite of services enabling operators to observe both the node and Casper service status. These services allow the establishment of alarms and provide a visual representation on a dashboard, displaying the node's resources and capacity in real time.

| AWS Services Used     | Description                                                         |
| --------------------  | ------------------------------------------------------------------- |
| S3 Bucket Modules           | Modules associated with storing information in S3. |
| Auto-Scaling Module         | Module to ensure that an instance of the node is always running in case it fails. |
| Configuration Bucket Module | Module to create a bucket with the necessary configuration scripts for the node's workflow. |

### S3 Bucket Modules

The following modules create S3 bucket resources on AWS.

#### S3 Canary

An S3 canary module creates an S3 bucket to store all the logs generated by the [synthetic canary service](#CloudWatch-Synthetics). The `alerting/iam_canary_s3` module calls this module.

#### S3 Config

The S3 config module creates an S3 bucket to store configuration files such as `.zip`, `.json`, or `.sh`.

#### Configuration Bucket Module

Terragrunt creates an S3 bucket and uploads all the configuration files needed to set up all the required services inside the node, including the Casper service and other services used for monitoring, backing up, and restoring the node. Below is a detailed description of each configuration file.

| File                      | Description |
| ------------------------- | ----------- |
| `files/genCustomMetrics.sh` | Bash file containing the configuration to get casper-node metrics from the Grafana dashboard and place them in the dashboard.sh file for the CloudWatch Dashboard. |
| `files/genSnapshot.sh`      | Bash file contains configurations to create a snapshot volume in EBS, with a cronjob performing weekly backups. |
| `files/genVolumenID.sh`     | Bash file to create a volume based on the snapshot of a previous volume, given its ID; if the snapshot does not exist, the script will create a new volume. |
| `files/dashboard.json`      | Dashboard template to generate and watch node metrics. |
| `files/deleteSm.sh`         | NOT IN USE. Deletes the Casper secret keys from the AWS Secrets Manager. |

### Auto-Scaling Module

An Auto-Scaling Group (ASG) facilitates automatic deployment should the node shut down. The ASG incorporates a launch template featuring all necessary configurations to set up the `casper-launcher` automatically upon the start of the EC2 instance. For enhanced support, the ASG spans 3 public subnets. You can find all the technical requirements for the node in the [EC2 Instance Requirements ](./3-instances.md) section.

## Data Modules

The following modules assist in data management.

| AWS Services Used     | Description                                                         |
| --------------------  | ------------------------------------------------------------------- |
| Key Pairs Module     | Module to create cryptographic keys.                        |
| Zip Creation Module  | Module to compress information related to the synthetic canary. |

### Key Pairs Module

The Key Pairs module generates a `.pem` file for creating and connecting to the `OpenVPN` and `casper-node` instances.

### ZIP Creation Module

The ZIP template module creates the ZIP file necessary for the [synthetic canary service](#CloudWatch-Synthetics) to oversee the `casper-node-launcher` on port `8888`.

## Network Modules

Modules related to configuring the diverse network elements necessary for the node's proper functioning.

| AWS Services Used     | Description                                                         |
| --------------------  | ------------------------------------------------------------------- |
| Elastic IP Module       | Module to define the Elastic IP associated with the node. |
| VPC Module | Module to create the VPC where the node resides. |
| Security Group Rules Module | Module to establish rules allowing network access to the node. |
| OpenVPN Server Module | Module to create and configure the VPN server. |

### Elastic IP Module

The Elastic IP (EIP) module creates the public IP for the Casper node.

### VPC Module

The VPC module creates the networking layer where the Casper read-only node will run. This module configures the following services:

| Services       | Description |
| -------------- | ----------- |
| Amazon VPC     | A virtual private cloud within the AWS Cloud. |
| Public subnets | Range of IP addresses in 3 availability zones. |
| Route tables   | Tables control the direction of network traffic. |

### Security Group Rules Module

The Security Group Rules module detects whether the node operator wants the `OpenVPN` instance and creates a customized SSH `Ingress-Rule` for the `casper-node` instance.

| OpenVPN Status | Ingress Rule |
| -------------- | ------------ |
| Created        | SSH is available when connected to the VPN Server. |
| Discarded      | SSH will be available to the IPs the operator listed.        |

### OpenVPN Server Module

The OpenVPN Service provides the administrators a private and secure connection to the node. This simple VPN is available for five administrators. To configure the VPN server, read the [OpenVPN guide](./6-open-vpn.md).

#### Ports

The following ports are open to run the Casper service:

| Port | Description                      |
| ---- | -------------------------------- |
| 22   | For SSH connections to the node  |
| 80   | For retrieving dashboard metrics |
