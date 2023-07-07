# Setting up a Non-Root User

Operators may log into their servers remotely using a key. The following steps explain how to create a non-root user and log in using a private key instead of the root user. Replace `<username>` in the instructions below with your username.

1. Use [ssh-keygen](https://www.ssh.com/ssh/keygen/) to generate a new SSH key. The Casper protocol supports the `ed25519` and `secp256k1` (ECDSA keys with the P-256 curve) algorithms. You can find more details [here](../../concepts/accounts-and-keys.md).

2. Create the user with no password, as the key is your password.

```
sudo adduser <username> --disabled-password
```

3. Create authorized_keys with your key to log in.

```
sudo su - <username>
mkdir .ssh
chmod 700 .ssh
touch .ssh/authorized_keys
```

4. Use the editor of your choice and paste your .ssh public key i the `.ssh/authorized_keys` file.

5. Exit out of the `<username>` account and log into the root or previous sudo-er account.

```
exit
```

6. Add your user to sudo-ers under the root account or your previous sudo-er account.

```
sudo visudo
```

7. Type `<username>  ALL=(ALL:ALL) NOPASSWD:ALL` below the row containing `root    ALL=(ALL:ALL) ALL`.

```
# User privilege specification
root    ALL=(ALL:ALL) ALL
<username>  ALL=(ALL:ALL) NOPASSWD:ALL
```

8. You should be able to log in with the key and not use the root user.

```
ssh -i <your ssh private key> <username>@<server ip>
```

Here is an example command:

```
ssh -i ~/.ssh/id_rsa casper@10.21.10.200
```