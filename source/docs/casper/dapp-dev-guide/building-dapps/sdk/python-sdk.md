# Python SDK

The [Python SDK](https://github.com/casper-network/casper-python-sdk) allows developers to interact with the Casper Node using Python 3.9+. This page covers various examples of using this SDK.

## Installation

Before installing the library, you need to install dependencies from [requirements.txt](https://github.com/casper-network/casper-python-sdk/blob/main/requirements.txt), which you can perform by running the following command:

```bash

    pip install -r requirements.txt
```

Finally, to install the library, run:

```bash

    pip install pycspr
```

## Tests

You can find examples of testing this library with python scripts in the `test` directory. To run the tests, we recommend the *pytest* library:

```bash
    pytest ./tests
``` 

## Usage Examples

In this section, we outline a couple of essential tasks you can accomplish with the Python SDK:

* [Sending a transfer](#sending-a-transfer) between two accounts
* [Staking](#staking) tokens with a validator

For further examples, take a look at the [How-tos](https://github.com/casper-network/casper-python-sdk/tree/main/how_tos).

### Sending a transfer

This example shows you how to define and transfer funds between accounts on a Casper network. Replace the *path_to_cp2_account_key* in the code below with the receiver's account address.

```python
    import os
    import pathlib
    import random
    import typing

    import pycspr
    from pycspr.client import NodeClient
    from pycspr.client import NodeConnectionInfo
    from pycspr.crypto import KeyAlgorithm
    from pycspr.types import PrivateKey
    from pycspr.types import Deploy
    from pycspr.types import PublicKey

    # path to cp1 secret key - defaults to NCTL user 1.
    path_to_cp1_secret_key = pathlib.Path(os.getenv("NCTL")) / "assets" / "net-1" / "users" / "user-1" / "secret_key.pem"

    # type of cp1 secret key - defaults to ED25519.
    type_of_cp1_secret_key = KeyAlgorithm.ED25519.name,

    # path to cp2 account key - defaults to NCTL user 2.
    path_to_cp2_account_key = pathlib.Path(os.getenv("NCTL")) / "assets" / "net-1" / "users" / "user-2" / "public_key_hex"

    # name of target chain - defaults to NCTL chain.
    chain_name = "casper-net-1"

    # host address of target node - defaults to NCTL node 1.
    node_host = "localhost"

    # Node API JSON-RPC port - defaults to 11101 @ NCTL node 1.
    node_port_rpc = 11101

    def _main(node_host, node_port_rpc, path_to_cp1_secret_key, type_of_cp1_secret_key,path_to_cp2_account_key, chain_name):
        """Main entry point.
        :param args: Parsed command line arguments.
        """
        # Set node client.
        client = _get_client(node_host, node_port_rpc)

        # Set counter-parties.
        cp1, cp2 = _get_counter_parties(path_to_cp1_secret_key, type_of_cp1_secret_key,path_to_cp2_account_key)

        # Set deploy.
        deploy: Deploy = _get_deploy(chain_name, cp1, cp2)

        # Approve deploy.
        deploy.approve(cp1)

        # Dispatch deploy to a node.
        client.deploys.send(deploy)

        #If deploy is successful send the indication
        print(f"Deploy dispatched to node [{node_host}]: {deploy.hash.hex()}")


    def _get_client(node_host, node_port_rpc) -> NodeClient:
        """Returns a pycspr client instance.
        """
        return NodeClient(NodeConnectionInfo(
            host=node_host,
            port_rpc=node_port_rpc,
        ))


    def _get_counter_parties(path_to_cp1_secret_key, type_of_cp1_secret_key,path_to_cp2_account_key) -> typing.Tuple[PrivateKey, PublicKey]:
        """Returns the 2 counter-parties participating in the transfer.
        """
        cp1 = pycspr.parse_private_key(
            path_to_cp1_secret_key,
            type_of_cp1_secret_key,
            )
        cp2 = pycspr.parse_public_key(
            path_to_cp2_account_key
            )    

        return cp1, cp2


    def _get_deploy(chain_name, cp1: PrivateKey, cp2: PublicKey) -> Deploy:
        """Returns transfer deploy to be dispatched to a node.
        """
        # Set standard deploy parameters.
        deploy_params = pycspr.create_deploy_parameters(
            account = cp1,
            chain_name = chain_name
            )

        # Set deploy.
        deploy = pycspr.create_native_transfer(
            params = deploy_params,
            amount = int(2.5e9),
            target = cp2.account_hash,
            correlation_id = random.randint(1, 1e6)
            )

        return deploy


    # Entry point.
    if __name__ == '__main__':
        _main(node_host, node_port_rpc, path_to_cp1_secret_key, type_of_cp1_secret_key, path_to_cp2_account_key, chain_name)
```

### Staking

This example shows you how to define and stake funds with a validator.

```python

    import os
    import pathlib

    import pycspr
    from pycspr.client import NodeClient
    from pycspr.client import NodeConnectionInfo
    from pycspr.crypto import KeyAlgorithm
    from pycspr.types import Deploy
    from pycspr.types import PrivateKey

    # path to cp1 secret key - defaults to NCTL user 1.
    path_to_validator_secret_key = pathlib.Path(os.getenv("NCTL")) / "assets" / "net-1" / "users" / "user-1" / "secret_key.pem"

    # type of cp1 secret key - defaults to ED25519.
    type_of_validator_secret_key = KeyAlgorithm.ED25519.name

    # path to session code wasm binary - defaults to NCTL bin/eco/add_bid.wasm.
    path_to_wasm = pathlib.Path(os.getenv("NCTL")) / "assets" / "net-1" / "bin" / "auction" / "add_bid.wasm"

    # amount to stake, i.e. bond, into the network.
    amount = int(2.5e9)

    # amount to charge delegators for service provision.
    delegation_rate = 2

    # name of target chain - defaults to NCTL chain.
    chain_name = "casper-net-1"

    # host address of target node - defaults to NCTL node 1.
    node_host = "localhost"

    # Node API JSON-RPC port - defaults to 11101 @ NCTL node 1.
    node_port_rpc = 11101

    def _main(node_host, node_port_rpc, path_to_validator_secret_key, type_of_validator_secret_key, chain_name, amount, delegation_rate, path_to_wasm):
        """Main entry point.
        :param args: Parsed command line arguments.
        """
        # Set node client.
        client: NodeClient = _get_client(node_host, node_port_rpc)

        # Set validator key.
        validator: PrivateKey = pycspr.parse_private_key(
            path_to_validator_secret_key,
            type_of_validator_secret_key,
            )

        # Set deploy.
        deploy: Deploy = _get_deploy(validator, chain_name, amount, delegation_rate, path_to_wasm)

        # Approve deploy.
        deploy.approve(validator)

        # Dispatch deploy to a node.
        client.deploys.send(deploy)

        print(f"Deploy dispatched to node [{node_host}]: {deploy.hash.hex()}")


    def _get_client(node_host, node_port_rpc) -> NodeClient:
        """Returns a pycspr client instance.
        """
        return NodeClient(NodeConnectionInfo(
            host = node_host,
            port_rpc = node_port_rpc,
        ))


    def _get_deploy(validator: PrivateKey, chain_name, amount, delegation_rate, path_to_wasm) -> Deploy:
        """Returns delegation deploy to be dispatched to a node.
        """
        # Set standard deploy parameters.
        deploy_params = pycspr.create_deploy_parameters(
            account = validator,
            chain_name = chain_name
            )

        # Set deploy.
        deploy = pycspr.create_validator_auction_bid(
            params = deploy_params,
            amount = amount,
            delegation_rate = delegation_rate,
            public_key = validator.as_public_key(),
            path_to_wasm = path_to_wasm
            )

        return deploy


    # Entry point.
    if __name__ == '__main__':
        _main(node_host, node_port_rpc, path_to_validator_secret_key, type_of_validator_secret_key, chain_name, amount, delegation_rate, path_to_wasm)
```
