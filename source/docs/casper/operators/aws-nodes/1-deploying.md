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

Using Docker Compose, create the following folder structure for the agnostic Docker container.

| Folder   | Folder Tree |
| -------- | ----------- |
| .agnostic_devcontainer/ | <br/>.agnostic_devcontainer/<br/>├── docker-compose.yml<br/>└── Dockerfile<br/>|
| docker/     | <br/>docker/<br/>├── .bashrc<br/> ├── .env<br/> ├── requirements.txt<br/> └── entrypoint.sh<br/> |


### Container Files

| File | Description |
| ---- | ----------- |
| .agnostic_devcontainer/docker-compose.yml | Docker Compose configures the development container's setup variables and mounting points. |
| .agnostic_devcontainer/Dockerfile         | A text document with instructions for installing the necessary tools. |
| docker/.bashrc                            | A custom `.bashrc` file that customizes the prompt. |
| docker/.env                               | Contains version numbers for the tools needed in the setup process. |
| docker/requirements.txt                   | Contains the `pip` packages and their version for the proposed solution. |
| docker/entrypoint.sh                      | A script that installs the `pre-commit` tool and configures the timezone inside the development container. |


### Container Setup Instructions

1. In the repository's `.agnostic_devcontainer/` directory, create a container using the following command:

   ```bash
   docker-compose --env-file ../docker/.env up --build -d
   ```

   This command installs the tools and prerequisites necessary to execute the project in the container.

2. Modify the contents of the `.env` file and change the environment variables at your convenience.

3. Configure your AWS and SSH credentials inside the `~/.aws` and `~/.ssh` folders.

4. To stop the development environment, use the following command:

   ```bash
   docker-compose down
   ```

## AWS Credentials

Please follow the instructions in the [Configuration Basics Guide to Configure AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html). After that, you must create and configure the `casper_{env}` profile, e.g., `casper_testnet`.

> *Note:* Before starting, ensure you have configured access to AWS. Administrator permissions would be helpful for this step.

Below is a list of AWS services that the user and profile must access:

| Service    | Access Requirement |
| ---------- | ------------------ |
| EC2        | Full access        |
| Cloudwatch | Full access        |
| VPC        | Full access        |
| S3         | Full access        |
| Secret manager | Read-only access |
| IAM        | Full access |
| SNS        | Full access |
| Systems Manager features | Full access |


## Running the IaC

To run the infrastructure as code (IaC), follow these steps.

1. Configure the `terragrunt/environment/{env}/terragrunt.hcl` file based on the environment, replacing values that change per environment, such as `ips_allows`. Possible environments could be *testnet* or *mainnet*.

   This file contains the following local variables, which can be modified according to the operator's needs.

   | Variable             | type        | Description                                                  |
   | -------------------- | ----------- | ------------------------------------------------------------ |
   | account_id           | String      | AWS account number.                                           |
   | aws_region           | String      | AWS region where to deploy.                                  |
   | environment          | String      | Name of the environment, e.g., `testnet` or `mainnet`                |
   | owner                | String      | Name of the owner, e.g., `casper`              |
   | project_name         | String      | Contains the owner and a short description.        |
   | vpc_cidr             | String      | The IPv4 CIDR block for the VPC, e.g., **10.60.0.0/16**       |
   | cw_namespace         | String      | Contains the owner and environment separated with a dash, e.g.,  `casper-testnet`                          |
   | profile_settings_aws | String      | The configured AWS profile containing the owner and environment separated with an underscore, e.g., `casper_testnet`. |
   | instance_type        | String      | Instance type. |
   | nodes_count          | Integer     | Number of nodes to start. For this version, this value must be **1**. |
   | ips_allows          | List     |  List of IPv4 addresses allowed to connect to the node via SSH. `0.0.0.0/0` represents any source. This variable is valid only when the node is created without VPN using the setting `NOT_VPN=true`. |
   | sns_notifications    | map(object) | List of notification subscribers, which should be added as required. |

   
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

3. Run the following command to validate the Terragrunt configuration. This command prepares the environment, downloads all providers, modules, and dependencies, and returns the number of resources to be provisioned. Finally, it validates all the configurations specified. Depending on your Internet connection and local environment, this operation may take around 30 minutes.

   ```bash
   terragrunt run-all plan
   ```

   When running this command for the first time, answer `yes` to create the S3 bucket where Terraform files will be stored. Here is an example output:

   ```bash
   Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) yes
   ```

   The command should display the following message:

   ```bash
   Terraform has been successfully initialized!
   ```

4. In this step, implement the planned infrastructure using the `terragrunt run-all apply` command, with or without a VPN server. This operation may take around 15 minutes, depending on the operator's Internet speed and local compute resources.

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
NOT_VPN=true terragrunt run-all apply --terragrunt-exclude-dir compute/vpn --terragrunt-parallelism 1
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
