# Deploying the infrastructure

A containerized environment was configured using docker to have a clean, functional, immutable, and disposable development environment. Below we present the development container.

## Prerequisites

| Program | Version |
| -------- | --------|
| terraform | 1.1.9 |
| terragrunt | 0.38.9 |
| aws-cli | 2.5.1 |
| jq | 1.6 |

## Agnostic Devcontainer using Docker Compose


| Folder   | Folder Tree |
| -------- | ----------- |
| .agnostic_devcontainer/ | <br/>.agnostic_devcontainer/<br/>├── docker-compose.yml<br/>└── Dockerfile<br/>|
| docker/     | <br/>docker/<br/>├── .bashrc<br/> ├── .env<br/> ├── requirements.txt<br/> └── entrypoint.sh<br/> |

### Devcontainer Files

| File | Description |
| ---- | ----------- |
| .agnostic_devcontainer/docker-compose.yml | Docker-compose configures the setup variables and mounting points for the development container. |
| .agnostic_devcontainer/Dockerfile | Dockerfile has the instructions that are needed to install all the necessary tools needed for the proposed solution. |
| docker/.bashrc   | Custom .bashrc file that customizes the prompt |
| docker/.env      | Contains the version number of the tools needed inside variables for the set-up process. |
| docker/requirements.txt   | Contains the pip packages and their version needed for the proposed solution. |
| docker/entrypoint.sh   | Script that install pre-commit and configures the timezone inside the development container. |


### Set-up Instructions

* Create a container with the development environment using the command `docker-compose --env-file ../docker/.env up --build -d`, at the repository's `.agnostic_devcontainer/` directory. 
* All the tools and prerequisites necessary to execute the project will be installed in the devcontainer
* Please, feel free to modify the contents of the `.env` file and change the environment variables at your convenience
* You must configure your aws credentials and ssh credentials inside the `~/.aws` and `~/.ssh` folders on your devcontainer.
* To stop the development environment you must do it with the command `docker-compose down`

## Set up AWS credentials

Please follow the instructions in the [Configuration Basics Guide to Configure AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html). After that, you need to create and configure the `casper_{env}` profile. e.g., `casper_testnet`.

> *Note:* before starting, ensure you have configured access to AWS. Administrator permissions are recommended

Below is the list of AWS services that the user and/or profile must have access to.

* EC2 full access
* Cloudwatch full access
* VPC full access
* S3 full access
* Secret manager read-only
* IAM  full access
* SNS full access
* Systems Manager features full access

## Running IaC

1. Validate the main file by environment, replace the values corresponding to your environment like `ips_allows`.
   > Possible environments could be *testnet* or *mainnet*

   * `terragrunt/environment/{env}/terragrunt.hcl`

      This file contains the following local variables, which are important for each environment: These can be modified according to the operator's needs.

      | Variable             | type        | Description                                                  |
      | -------------------- | ----------- | ------------------------------------------------------------ |
      | account_id           | String      | AWS account number                                           |
      | aws_region           | String      | AWS Region where to deploy.                                  |
      | environment          | String      | name of the environment, testnet, or mainnet                  |
      | owner                | String      | Name of the owner, eg casper                                 |
      | project_name         | String      | Contains the owner + an additional short description.        |
      | vpc_cidr             | String      | The IPv4 CIDR block for the VPC e.g., **10.60.0.0/16**       |
      | cw_namespace         | String      | Contains the owner +-+ environment.                          |
      | profile_settings_aws | String      | Contains the owner +_+ environment. The configured AWS profile |
      | instance_type        | String      | Type of the Instance.                                        |
      | nodes_count          | Integer     | Number of nodes to start. For this version, this value must go to **1** |
      | ips_allows          | List     |  List of IPv4 addresses allowed for SSH connection to the node. If you want from any source, enter 0.0.0.0/0 (This variable is only valid when the node is created without VPN - NOT_VPN=true) |
      | sns_notifications    | map(object) | List of subscribers to the notifications. A new list should be added as required. |

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
      profile_settings_aws = "${local.owner}_${local.environment}" #Specifies a named profile with long-term credentials that the AWS CLI can use to assume a role that you specified with the role_arn parameter.
      instance_type        = "t3.2xlarge"                          #The T3 instances feature: 8 vCPUs y 32 Memory GiB
      nodes_count          = 1
      ips_allows            = ["100.52.0.10/32", "100.52.0.11/32"] # List of IPv4 addresses allowed for SSH connection to the node. If you want from any source, enter 0.0.0.0/0 (This variable is only valid when the node is created without VPN - NOT_VPN=true)
      sns_notifications = {
         email1 = {
            protocol               = "email" # The protocol to use. The possible values for this are: sqs, sms, lambda, and application. (http or https are partially supported, see below) (email is an option but is unsupported, see below).
            endpoint               = "example@domain.com"
            endpoint_auto_confirms = true
            raw_message_delivery   = false
         },
         email2 = {
            protocol               = "email" # The protocol to use. The possible values for this are: sqs, sms, lambda, and application. (http or https are partially supported, see below) (email is an option but is unsupported, see below).
            endpoint               = "example2@domain.com"
            endpoint_auto_confirms = true
            raw_message_delivery   = false
         }
      }
   }
   
   ```

2. Go to the directory appropriate environment, *testnet* or *mainnet*
  
* On *testnet*

    ```bash
    cd terragrunt/environment/testnet/
    ```

* On *mainnet*

    ```bash
    cd terragrunt/environment/mainnet/
    ```

## Planning IaC

```bash
terragrunt run-all plan
```

This command validates your Terragrunt configuration and will return you with the information on how many resources it is going to add. It will prepare the environment and download all the providers, modules, and dependencies. Finally, it validates that all the configuration is ready to apply.

> **Note:** This operation may take between 20 to 30 minutes, depending on your Internet connection speed and local compute resources.

The first time when executing this command, it will ask for the creation of the S3 Bucket where the terraform states files will be stored.

When that happens, it should show something similar to the following:

```md
Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) Remote state S3 bucket casper-testnet-tfg-state does not exist or you don't have permission to access it. Would you like Terragrunt to create it? (y/n) yes
```

You must answer `yes`

Then, It should display something like this:

```sh
Terraform has been successfully initialized!
```

## Applying IaC

For the infrastructure implementation, there are two options, where the operator decides which one to execute.

* Apply all the infrastructure with the VPN server
* Apply infrastructure without a VPN server

### Applying IaC With the VPN server

Run the following Terragrunt command to *terraform apply on all sub-folders*

```bash
terragrunt run-all apply --terragrunt-parallelism 1
```

The output of the previous command will look something like the following:

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

> **Note:** This operation may take between 10 to 15 minutes, depending on your Internet connection speed and local compute resources.

Finally, it should display something like this:

```sh
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.
Outputs:
```

### Applying IaC without a VPN server

Run the following Terragrunt command to *terraform apply on all sub-folders*

> **Note:** Remember to change the ***ips_allows*** variable with the list of IPs with access to the Node.

```bash
NOT_VPN=true terragrunt run-all apply --terragrunt-exclude-dir compute/vpn --terragrunt-parallelism 1
```

It should display something like this:

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

> **Note:** This operation may take between 10 to 15 minutes, depending on your Internet connection speed and local compute resources.

After, it should display something like this:

```sh
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.
Outputs:
```

## Destroy the AWS resources using - terragrunt destroy

Enter to the directory of the appropriate environment, *testnet* or *mainnet*. and destroy the desired environment. With the following commands:

```bash
cd terragrunt/environment/{env}/
terragrunt run-all destroy
```
