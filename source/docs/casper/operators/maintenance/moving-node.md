---
title: Move a Node
---

#  Moving a Validating Node

This guide is for active validators who want to move their node to another machine.

:::note

Starting with node version 1.5, operators need to move the unit files at the database level. This step allows moving the node with nearly zero rewards loss.

:::

## Swapping Keys with a Hot Backup

This method limits downtime and enables a smooth transition from the old to the new node. It keeps the node in sync with the tip of the chain.

1. Once a node is running (`current_node`), create a second node (`backup_node`) on another machine. These two nodes will run in parallel.
2. When the `backup_node` is up to date, stop the `current_node`.
3. Move the unit files at the DB level using `rsync`. This step allows moving the node with nearly zero rewards loss.
4. Stop the `backup_node`.
5. Swap keys on the `backup_node`, now the new validator.
6. Restart the `backup_node`.
7. Swap keys on the `current_node`, now the new backup.
8. Restart the `current_node`.

### Preparation for swapping

1. Let both nodes synchronize to the tip of the blockchain. Keep the current validating node running with the original validator keyset.

2. Bond the `backup_node` and wait until rewards are issued.

3. Prepare to swap keys by following these steps:

    - Create the following folder structure on both nodes under the `/etc/casper/validator_keys/` directory.
    - Create subdirectories for the `current_node` and `backup_node`.
    - Copy each node's keyset under the corresponding directories.

```bash
    /etc/casper/validator_keys/
    ├── public_key.pem
    ├── public_key_hex
    ├── secret_key.pem
    ├── current_node
    │   ├── public_key.pem
    │   ├── public_key_hex
    │   └── secret_key.pem
    └── backup_node
    |   ├── public_key.pem
    |   ├── public_key_hex
    |   └── secret_key.pem
```

This setup allows key swapping by running the `sudo -u casper cp * ../` command, as shown below.

### Swapping the nodes

1. When the `backup_node` is up to date, stop the `current_node`.

2. On the `backup_node` (the future validator), use `rsync` to move the unit files from the `current_node`, located in `/var/lib/casper/casper-node/[NETWORK_NAME]/unit_files`.

3. On the `backup_node`, run these commands to stop the node, swap keys, and restart the node:

    ```bash
    sudo systemctl stop casper-node-launcher
    cd /etc/casper/validator_keys/current_node
    sudo -u casper cp * ../
    sudo systemctl start casper-node-launcher
    ```

4. On the `current_node`, run these commands to stop the node and swap keys:

    ```bash
    sudo systemctl stop casper-node-launcher
    cd /etc/casper/validator_keys/backup_node
    sudo -u casper cp * ../
    ```

5. Restart the original validator node (`current_node`), which is now the new backup:

    ```bash
    sudo systemctl start casper-node-launcher 
    ```

### Understanding rewards impact

After swapping, the new validator node shows no round length until an era transition occurs and will lose all rewards from the point of the switch until the end of that era. The validator is not ejected but will receive rewards starting with the next era. 

:::tip

You could time the swap right before the era ends to minimize reward losses.

:::

### Checking file permissions

After the swap, check and fix file permissions by running the `/etc/casper/node_util.py` utility.
