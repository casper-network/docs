# Configure the Open VPN Server

## Installation Steps

By default the SSH service is disabled, therefore it is necessary to use session manager if you decided to run the IaC with VPN enabled.

Follow the steps to configure the VPN Server:

1. Select the `vpn-server` instance and click *Connect*

    <p align="center">
    <img src={"/image/operators/vpn-connect.png"} alt="VPN Connect" width="600"/>
    </p>

2. Choose the `Session Manager` option and click *Connect*

    <p align="center">
    <img src={"/image/operators/session-manager.png"} alt="Session Manager" width="600"/>
    </p>

3. Another webpage should appear connected to the instance terminal

    <p align="center">
    <img src={"/image/operators/webpage.png"} alt="Additional Webpage" width="600"/>
    </p>

4. Execute the following command to configure the OpenVPN Server:

    ```bash
    ssh -i "{keyname}.pem" openvpn@{Your-IPv4-Public-IP}
    ```

    Next, type `yes` for the agreement, then you’ll be prompted with how you want to configure your VPN.

    <p align="center">
    <img src={"/image/operators/agreement.png"} alt="Agreement Example" width="600"/>
    </p>

    * Just hit `enter` for the rest to have all the defaults confirmed.

    * Once you reached the end, change the password for the user. Enter a new password twice and you’re all set.

    ```bash
    sudo passwd openvpn
    ```

5. Next, open a browser window and type:

    `https://{vpn-EC2-IPv4-Public-IP-address}:943/admin`

6. Login with `openvpn` and the password you just set.

    <p align="center">
    <img src={"/image/operators/login.png"} alt="Login Example" width="600"/>
    </p>

    * Once in the Admin dashboard of OpenVPN, click configuration and go to “VPN Settings”

    * Scroll down and then apply the following changes:

    <p align="center">
    <img src={"/image/operators/vpn-settings.png"} alt="VPN Settings" width="600"/>
    </p>

## Using the VPN

A VPN Client is required that can handle capturing the traffic you wish to send through the OpenVPN tunnel, encrypting it, and passing it to the OpenVPN server.

* Create a new user for start login:
* once the user is created, log in with the customer portal
  * ​   `https://{vpn-EC2-IPv4-Public-IP-address}:943/`
* Download the client and configuration file

## References

* Ami ID: `ami-06e31403ada2e8ff4Ami` aws-marketplace/OpenVPN Access Server Community Image - For 5 user - OpenVPN Access Server 2.8.5 (us-east-1)
* The AMI ID changes depending on the zone you have selected, and they can also change if a new release is launched. We suggest getting into the console and verifying the ID.
* [Amazon Web Services EC2 tiered appliance quick start guide](https://openvpn.net/vpn-server-resources/amazon-web-services-ec2-tiered-appliance-quick-start-guide/)
* [Launch OpenVPN Access Server BYOL on Amazon AWS](https://openvpn.net/aws-video-tutorials/byol/)

OpenVPN Access Server (5 Connected Devices) For product activation to succeed your firewall and/or security group settings must allow connections to our online activation servers - details can be found in our FAQ section here: <https://openvpn.net/aws-frequently-asked-questions/>. If you experience any problems, you can register for a free account on our website here: <https://openvpn.net/support-for-aws/> and then open a support ticket so our technical team can assist you. <http://support.openvpn.net>
