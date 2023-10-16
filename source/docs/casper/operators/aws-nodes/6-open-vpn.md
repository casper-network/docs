---
title: Open VPN Setup
---

# Configure the Open VPN Server

Subscribe to the [OpenVPN Access Server (5 Connected Devices)](https://aws.amazon.com/marketplace/pp/prodview-fiozs66safl5a) available in the AWS Marketplace. The authors wrote these steps with version 2.8.5 in mind.

## VPN Configuration

Follow these steps to configure the VPN Server:

1. Select the `vpn-server` instance and click **Connect**.

    <p align="center">
    <img src={"/image/operators/vpn-connect.png"} alt="VPN Connect"/>
    </p>

2. Choose the `Session Manager` option and click **Connect**.

    <p align="center">
    <img src={"/image/operators/session-manager.png"} alt="Session Manager"/>
    </p>

3. A web page should appear connected to the instance terminal.

    <p align="center">
    <img src={"/image/operators/webpage.png"} alt="Additional Webpage"/>
    </p>

4. Run the following command to configure the OpenVPN server:

    ```bash
    $ bash
    ```

    <p align="center">
    <img src={"/image/operators/agreement.png"} alt="Agreement Example"/>
    </p>

    Next, type `yes` for the agreement. Then, you need to configure the VPN following the prompts. To choose default settings, hit `return` and follow the instructions.

:::note

All default options are secure; you can select the default by pressing enter unless you wish to change any of them. We recommend changing the default setting to allow password alteration for the `openvpn` user. Please use a secure password.

:::

5. Next, open a browser window and type the following address in the URL:

    `https://{vpn-EC2-IPv4-Public-IP-address}:943/admin`

6. Log in using the username `openvpn` and the password you set.

    <p align="center">
    <img src={"/image/operators/login.png"} alt="Login Example"/>
    </p>

7. Once in the Admin dashboard of OpenVPN, click **CONFIGURATION** and go to **VPN Settings**. Scroll down and apply the following changes:

    <p align="center">
    <img src={"/image/operators/vpn-settings.png"} alt="VPN Settings"/>
    </p>

<br></br>

:::note

To run the IaC with VPN enabled, you must use the Session Manager. By default, the SSH service is not enabled.

:::

## Using the VPN

A VPN client must capture the OpenVPN tunnel traffic, encrypt it, and pass it to the OpenVPN server. To create the VPN client, follow these steps:

* In the Admin dashboard of OpenVPN, click **USER MANAGEMENT** and create a new user.
* After user creation, log in through the customer portal: `https://{vpn-EC2-IPv4-Public-IP-address}:943/`.
* Download the VPN client and corresponding configuration file.
* Verify the Amazon Machine Image (AMI) ID by checking the console. The AMI ID changes depending on the zone you have selected. Also, it can change with a new release.

## Useful Links

* [Amazon Web Services EC2 tiered appliance quick start guide](https://openvpn.net/vpn-server-resources/amazon-web-services-ec2-tiered-appliance-quick-start-guide/)
* [Launch OpenVPN Access Server BYOL on Amazon AWS](https://openvpn.net/aws-video-tutorials/byol/)
* [OpenVPN FAQs](https://openvpn.net/aws-frequently-asked-questions/)
* [OpenVPN Support](https://support.openvpn.com)
