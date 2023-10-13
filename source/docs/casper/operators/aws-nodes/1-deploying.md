---
title: Deploy the Infrastructure
---

# Deploying the AWS Infrastructure

This section presents the development environment configured using Docker to have a clean, functional, immutable, and disposable development container.

## Prerequisites

The following programs are prerequisites.

| Program      | Version |
| ------------ | --------|
| `terraform`  | 1.1.9  |
| `terragrunt` | 0.38.9 |
| `aws-cli`    | 2.5.1  |
| `jq`         | 1.6    |


## Docker Container Structure

The code includes a development container (or dev container for short) for all the preinstalled requirements. Using Docker Compose or VSCode, developers construct this container, which encompasses the following file structure:

| Folder   | Folder Tree |
| -------- | ----------- |
| .devcontainer/ | <br/>.devcontainer/<br/>├── .bashrc<br/>├── .env<br/>├── Dockerfile<br/>├── cmd.sh<br/>├── devcontainer.json<br/>├── docker-compose.yml<br/>├── entrypoint.sh<br/>└── requirements.txt<br/>|

### Container Files

| File | Description |
| ---- | ----------- |
| `.devcontainer/devcontainer.json`  | Specification file designed for interpreting and executing the dev container within VSCode. |
| `.devcontainer/.env`               | File containing version numbers and flags essential for enabling the requisite tools within the dev container. |
| `.devcontainer/docker-compose.yml` | Docker Compose file that orchestrates the configuration and launch of the setup variables and mounting points for the development container. |
| `.devcontainer/Dockerfile`         | Dockerfile that details the operating system configuration and outlines the tools to install. |
| `.devcontainer/requirements.txt`   | Holds the `pip` packages along with their versions for the proposed solution. |
| `.devcontainer/.bashrc`            | A custom `.bashrc` file that customizes the prompt and aliases inside the container. |
| `.devcontainer/entrypoint.sh`      | A script that performs the installation and configuration of tools such as `pre-commit`, `localstack`, among others, and modifies Docker outside of Docker (DooD) and the timezone within the development container. |
| `.devcontainer/cmd.sh`             | Script that keeps the dev container running and configures the termination of `localstack` when necessary. |
| `.precommit-commit-config.yaml`    | Configuration file for pre-commit. |

### Container Setup Instructions

The first step requires adjusting the contents of the `.devcontainer/.env` file and modifying the environment variables as necessary. Ensure that the `PROJ_NAME` variable matches the name of the repository root folder. To deploy the dev container, establish your AWS and SSH credentials within the `~/.aws` and `~/.ssh` directories; both directories **must** exist in your home folder.

This dev container is agnostic and doesn't depend on a specific IDE or editor; it can run automatically from a terminal, with no particular editor required. When using VSCode, open the repository folder within it, and VSCode will prompt you to reopen the folder, initializing the dev container. Below, the guide outlines the steps to operate the dev container from a command terminal.

1. In the repository's `.devcontainer/` directory, create a container using the following command:

   ```bash
   docker-compose up --build -d
   ```

2. To access the dev container, use the following command:

   ```bash
   docker exec -ti casper-node-on-cloud-cont bash
   ```

3. To stop the development environment, use the following command:

   ```bash
   docker-compose down
   ```

## AWS Credentials

Please follow the instructions in the [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) guide. Subsequently, create and configure the `casper_{env}` profile, for instance, `casper_testnet` or `casper_mainnet`.

> **Note:** Prior to beginning, verify that access to AWS is configured. Having administrator permissions on your account will be beneficial for this step.

Below is a list of AWS services that the user and profile must access:

| Service    | Access Requirements |
| ---------- | ------------------ |
| EC2        | Full access        |
| CloudWatch | Full access        |
| VPC        | Full access        |
| S3         | Full access        |
| Secret manager | Read-only access |
| IAM        | Full access |
| SNS        | Full access |
| Systems Manager features | Full access |


## Running the IaC

To run the infrastructure as code (IaC), follow these steps.

1. Configure the `terragrunt/environment/{env}/terragrunt.hcl` file based on the environment, replacing values that change per environment, such as `ips_allows`. Possible environments could be *testnet* or *mainnet*. This file holds the following local variables, adjustable based on the operator's requirements.

   | Variable             | type        | Description                                                    |
   | -------------------- | ----------- | ------------------------------------------------------------   |
   | account_id           | String      | AWS account number.                                            |
   | aws_region           | String      | AWS region where to deploy.                                    |
   | environment          | String      | Name of the environment, e.g., `testnet` or `mainnet`.         |
   | owner                | String      | Name of the owner, e.g., `casper`.                             |
   | project_name         | String      | Contains the owner and a short description.                    |
   | vpc_cidr             | String      | The IPv4 CIDR block for the VPC, e.g., **10.60.0.0/16**.       |
   | cw_namespace         | String      | Contains the owner and environment separated with a dash, e.g.,  `casper-testnet`. |
   | profile_settings_aws | String      | The configured AWS profile containing the owner and environment separated with an underscore, e.g., `casper_testnet`. |
   | instance_type        | String      | Instance type.                                                 |
   | nodes_count          | Integer     | Number of nodes to start. For this version, this value must be **1**. |
   | ips_allows           | List        | List of IPv4 addresses permitted to connect to the node via SSH, where `0.0.0.0/0` denotes any source. This variable holds relevance when establishing the node without a VPN, utilizing the `VPN_USE=false` environment variable. |
    | sns_notifications    | map(object) | List of notification subscribers, which you should add as required. |

   **Sample Configuration:**

   ```bash
   locals {
      account_id           = "000000000"
      aws_region           = "us-west-1"
      environment          = "testnet"
      owner                = "casper"
      project_name         = "${local.owner}-aws"
      vpc_cidr             = "10.20.0.0/16"
      on_codebuild         = get_env("ON_CODEBUILD", false)
      cw_namespace         = "${local.owner}-${local.environment}" #Namespace to create specific metrics and global resource names.
      profile_settings_aws = "${local.owner}_${local.environment}" #Specifies a named profile with long-term credentials that the AWS CLI can use to assume a role you specified with the role_arn parameter.
      instance_type        = "t3.2xlarge"                          #The T3 instances feature: 8 vCPUs y 32 Memory GiB
      nodes_count          = 1
      ips_allows            = ["100.52.0.10/32", "100.52.0.11/32"] # List of IPv4 addresses allowed for SSH connection to the node. If you want from any source, enter 0.0.0.0/0. This variable is only valid when the node is created without VPN - NOT_VPN=true.
      sns_notifications = {
         email1 = {
            protocol               = "email" # The protocol to use. The possible values are sqs, sms, lambda, and application. HTTP or HTTPS are partially supported; see below. Email is an option but is unsupported.
            endpoint               = "example@domain.com"
            endpoint_auto_confirms = true
            raw_message_delivery   = false
         },
         email2 = {
            protocol               = "email" # The protocol to use. The possible values are sqs, sms, lambda, and application. HTTP or HTTPS are partially supported; see below. Email is an option but is unsupported.
            endpoint               = "example2@domain.com"
            endpoint_auto_confirms = true
            raw_message_delivery   = false
         }
      }
   }
   ```

2. Navigate to the directory that matches your environment.

   * For Testnet, use:

      ```bash
      cd terragrunt/environment/testnet/
      ```

   * For Mainnet, use:

      ```bash
      cd terragrunt/environment/mainnet/
      ```

3. Use the command below to check the Terragrunt configuration. It prepares the environment, downloads all providers, modules, and dependencies, and indicates the number of resources that will undergo provisioning. It also confirms all specified configurations. Depending on your internet connection and local environment, this operation might take around 30 minutes.

   ```bash
   terragrunt run-all plan
   ```

   When executing the command, respond `yes` to generate the S3 bucket for storing Terraform files. Below is an example output:

<details>
<summary>Sample output</summary>

   ```bash
   Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) yes
   ```

</details>
<br></br>

   The command should display the following message:

   ```bash
   Terraform has been successfully initialized!
   ```

4. In this step, deploy the planned infrastructure using the `terragrunt run-all apply` command, with or without a VPN server. Depending on the operator's Internet speed and local compute resources, this operation may take around 15 minutes.

### Applying the IaC with the VPN server

Run the following Terragrunt command on all sub-folders.

```bash
terragrunt run-all apply --terragrunt-parallelism 1
```

<details>
<summary>Sample output</summary>

```bash
Group 1
- Module /workspaces/casper-poc/terragrunt/environment/testnet
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/log_group
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/sns
- Module /workspaces/casper-poc/terragrunt/environment/testnet/bucket/s3_canary
- Module /workspaces/casper-poc/terragrunt/environment/testnet/bucket/s3_config
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/key
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template_cw_cf
- Module /workspaces/casper-poc/terragrunt/environment/testnet/networking/eip
- Module /workspaces/casper-poc/terragrunt/environment/testnet/networking/vpc

Group 2
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/iam_canary_s3
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/ssm
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/vpn
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template_zip

Group 3
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/config

Group 4
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/asg

Group 5
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/sg_rules
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template

Group 6
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/cloudwatch

Are you sure you want to run 'terragrunt apply' in each folder of the stack described above? (y/n)  Yes
```

</details>
<br></br>

If the command is successful, the result would look like this:

```sh
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.
```

### Applying the IaC without a VPN server

Run the following Terragrunt command on all sub-folders. Remember to change the ***ips_allows*** variable to use the list of IPs that can access the node.

```bash
VPN_USE=false terragrunt run-all apply --terragrunt-exclude-dir compute/vpn --terragrunt-parallelism 1
```

<details>
<summary>Sample output</summary>

```bash
Group 1
- Module /workspaces/casper-poc/terragrunt/environment/testnet
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/log_group
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/sns
- Module /workspaces/casper-poc/terragrunt/environment/testnet/bucket/s3_canary
- Module /workspaces/casper-poc/terragrunt/environment/testnet/bucket/s3_config
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/key
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template_cw_cf
- Module /workspaces/casper-poc/terragrunt/environment/testnet/networking/eip
- Module /workspaces/casper-poc/terragrunt/environment/testnet/networking/vpc

Group 2
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/iam_canary_s3
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/ssm
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template_zip

Group 3
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/config

Group 4
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/asg

Group 5
- Module /workspaces/casper-poc/terragrunt/environment/testnet/compute/sg_rules
- Module /workspaces/casper-poc/terragrunt/environment/testnet/data/template

Group 6
- Module /workspaces/casper-poc/terragrunt/environment/testnet/alerting/cloudwatch

Are you sure you want to run 'terragrunt apply' in each folder of the stack described above? (y/n)  Yes
```

</details>
<br></br>

If the command is successful, the result would look like this:

```sh
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.
```

## Destroying the AWS Resources

To remove the AWS resources created, navigate to the appropriate directory and invoke the following `terragrunt run-all destroy` command:


```bash
cd terragrunt/environment/{env}/
terragrunt run-all destroy
```
