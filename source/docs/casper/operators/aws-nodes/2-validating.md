---
title: Validate and Monitor the Node
---

# Validating and Monitoring the Node

This section describes how to verify the AWS setup and observe the Casper node created using this infrastructure.

## Validating the AWS Instances

Run the following command to get information about the status of the AWS instances created. Remember to change the profile name and region.

```bash
aws --profile $aws_profile ec2 describe-instances --region $aws_region --filters Name=instance-state-name,Values=running | jq '.Reservations[] | .Instances[] | {Id: .InstanceId, PrivateIpAddress: .PrivateIpAddress, PublicAddress: .PublicIpAddress, State: .State.Name, Name: .Tags[]|select(.Key=="Name")|.Value}'
```

**Sample output:**

```json
{
  "Id": "i-0223ef7cedf879801",
  "PrivateIpAddress": "10.50.10.172",
  "PublicAddress": "34.224.191.55",
  "State": "running",
  "Name": "casper-aws-ro-node-mainnet"
}
{
  "Id": "i-09e4c12d8031ea7e4",
  "PrivateIpAddress": "10.50.11.76",
  "PublicAddress": "44.206.76.41",
  "State": "running",
  "Name": "casper-aws-vpn-mainnet"
}
```

## VPN Configuration

If operators find a VPN necessary, it becomes imperative to institute one that assures the confidentiality and integrity of the information while in transit. To fulfill this need, [this guide](./6-open-vpn.md) advocates for the establishment of an OpenVPN server within the IaC infrastructure.

## Connecting to the Node Instance

At this stage, it's imperative to consider the deployment method of the infrastructure, either with or without a VPN. Once the node operates functionally and, if applicable, after configuring the VPN connection, you can establish a connection to the node via SSH.

```bash
cd terragrunt/environment/{env}/
```

Navigate to the environment directory, *testnet* or *mainnet*, where you will find the PEM file to access the node with the following command:

- With a VPN server:

  ```bash
  ssh -i "{key_name}.pem" ubuntu@{Node-IPv4-Private-IP}
  ```

- Without a VPN server:

  ```bash
  ssh -i "{key_name}.pem" ubuntu@{Node-IPv4-Public-IP}
  ```

  > **Note:** You may need to change the PEM file permissions using `chmod`:

  ```bash
  chmod 400 "{key_name}.pem"
  ```

### Check the bootstrapping

To see the bootstrap script output, use the following command:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

### Check the node status

Get information about the node with the following command:

```bash
sudo /etc/casper/node_util.py watch
```

**Sample Output:**

```bash
Last Block: 1019 (Era: 11)
Peer Count: 306
Uptime:
Build: 1.0.0-31d7de47
Key: 013f1b6b20a90bd25e58cf140ebfcc9082ffb6db1843e3c3552e869450ea31b336
Next Upgrade: {'activation_point': 166, 'protocol_version': '1.1.0'}

RPC: Not Ready
casper-node-launcher.service - Casper Node Launcher
     Loaded: loaded (/lib/systemd/system/casper-node-launcher.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2022-06-03 16:42:44 UTC; 3min 25s ago
       Docs: https://docs.casperlabs.io
   Main PID: 13929 (casper-node-lau)
      Tasks: 13 (limit: 38088)
     Memory: 280.6M
     CGroup: /system.slice/casper-node-launcher.service
             ├─13929 /usr/bin/casper-node-launcher
             └─14049 /var/lib/casper/bin/1_0_0/casper-node validator /etc/casper/1_0_0/config.toml
Jun 03 16:42:44 ip-10-60-13-180 systemd[1]: Started Casper Node Launcher.
```

## Monitoring the Node

To observe the node and access metrics like CPU, Memory, Disk, Era, and Block Height, operators have a range of options.

### Monitor the node using the command-line

Check the node log using this command:

```bash
sudo tail -fn100 /var/log/casper/casper-node.log /var/log/casper/casper-node.stderr.log
```

Check the node status:

```bash
curl -s http://127.0.0.1:8888/status
```

Check if a known validator sees your node among its peers with the command below. You should see your IP address on the list returned.

```bash
curl -s http://{KNOWN_VALIDATOR_IP}:8888/status | jq .peers
```

### Dashboard monitoring

To see the node status in Grafana, enter the following URL:

```bash
http://{Node-IPv4-Public-IP}:3000
```

You can also see the node status in the AWS CloudWatch service:

<p align="center">
<img src={"/image/operators/cloudwatch-dashboard.png"} alt="Cloudwatch Dashboard"/>
</p>