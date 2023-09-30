---
title: Troubleshooting
---

# Troubleshooting Tips for Operators

This section contains common topics for troubleshooting AWS Casper node instances.

## Node Restarts When Synchronizing

If the node experiences a restart during synchronization-typically occurring every 30 minutes-and fails to update the block number, it becomes necessary to update the `trusted_hash` variable in the `config.toml` file. Access the `config.toml` of the Casper version your node operates on (e.g.: `/etc/casper/1_1_2/config.toml`) and adjust the trusted hash to match one from a node that has already synchronized. For guidance on acquiring a trusted hash, see [this page](../setup/install-node.md#getting-a-trusted-hash).

1. Stop the `casper-node-launcher` service.

2. Get a `trusted hash` from the network using this command:

    ```bash
    sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://SYNCED_NODE_IP:7777/ -b BLOCK_NUMBER | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/CASPER_VERSION/config.toml
    ```

    For example:

    ```bash
    sudo sed -i "/trusted_hash =/c\trusted_hash = '$(casper-client get-block --node-address http://3.136.227.9:7777/ -b 997478 | jq -r .result.block.hash | tr -d '\n')'" /etc/casper/1_5_2/config.toml
    ```

## Devcontainer Troubleshooting

- **Repeated container name:** A container with the same name may exist in another project. You can delete the previous container using the command docker container prune or docker container rm [containername].
- **New image is not updating:** If you are changing the `Dockerfile`
image or modifying the `entrypoint.sh` please restart VSCode or
run the following command if you are not using VSCode:

    ```bash
    docker compose down; docker rmi {containername}:latest
    ```