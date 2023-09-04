# Connecting to and Monitoring

## VPN configuration

> **Note:** This section only applies if the infrastructure needs to be implemented with a VPN.

In order to be able to access all the computing infrastructure, it is important to establish a VPN that guarantees the confidentiality and integrity of the information in transit. For this purpose, we have defined the creation of an OpenVPN server within the IaC, which will be configured on the following [guide](./Configure-the-Open-VPN-Server)

## Validate created instances

To obtain information about the status of the created instances, the following command should be executed:

```bash
aws --profile $aws_profile ec2 describe-instances --region $aws_region --filters Name=instance-state-name,Values=running | jq '.Reservations[] | .Instances[] | {Id: .InstanceId, PrivateIpAddress: .PrivateIpAddress, PublicAddress: .PublicIpAddress, State: .State.Name, Name: .Tags[]|select(.Key=="Name")|.Value}'
```

> **Note:** Remember to change profile name and region.

The output of this command will show something like this:

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

## Connecting to the Node instance

At this point, it is necessary to consider how the infrastructure was applied, with VPN or without VPN.

Once it has been established that the node is up and running and the VPN connection is configured, proceed to connect to the node via the ssh protocol.

```bash
cd terragrunt/environment/{env}/
```

* Enter to the directory of the appropriate environment, *testnet* or *mainnet*. In this directory you will find the PEM file to access the node with the following command:
  * With the VPN server
    * `ssh -i "{key_name}.pem" ubuntu@{Node-IPv4-Private-IP}`
  * Without a VPN server
    * `ssh -i "{key_name}.pem" ubuntu@{Node-IPv4-Public-IP}`
> **Note:** You may need to change keys permission using chmod 400 "{key_name}.pem".

### Check bootstrapping

In order to see the bootstrap script output use the following command:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

### Check node status

With the following command can be obtained information about the node

```bash
sudo /etc/casper/node_util.py watch
```

It should display something like this:

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

## Monitoring

To watch the monitoring system and the node status through metrics such as CPU, Memory, Disk, Era, and Block Height, among others, you can use the following options:

* Monitor the node status from the command line:
  * Check the node log

    ```bash
    sudo tail -fn100 /var/log/casper/casper-node.log /var/log/casper/casper-node.stderr.log
    ```

  * Check if a known validator sees your node among peers, you should see your IP address on the list

    ```bash
    curl -s http://{KNOWN_VALIDATOR_IP}:8888/status | jq .peers
    ```

  * Check the node status

    ```bash
    curl -s http://127.0.0.1:8888/status
    ```

* Dashboard monitoring
  * To see the node status in Grafana, enter to the following URL

    ```bash
    http://{Node-IPv4-Public-IP}:3000
    ```

  * To see the node status in the AWS CloudWatch service
    <img src="files/img/dashboardcw.png" alt="Dashboard Cloudwatch" style="width:600px;"/>
