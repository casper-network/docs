# Joining a Running Network

The Casper network is permissionless, enabling new validators to join the network and provide additional security to the system. This page outlines the sequence of recommended steps to spin up a validating node and join an existing network.

## Step 1: Provision Hardware {#step-1-provision-hardware}

Visit the [Hardware Specifications](hardware.md) section and provision your node hardware.

## Step 2: Set Up the Node and Build Contracts {#step-2-build-contracts--set-up-the-node}

Follow the instructions in the [Basic Node Setup](setup.md) section to configure the software on your node. Build all necessary contracts for bonding, retrieving rewards and unbonding.

### Building Contracts {#building-contracts}
1. Clone the casper-node repository. 

```bash
git clone https://github.com/casper-network/casper-node
```
2. To build contracts, set up Rust and install all dependencies, see [Installing Rust](../dapp-dev-guide/writing-contracts/getting-started.md#installing-rust) in the Developer Guide.

3. Use the following commands to build the contracts in release mode:

```bash
cd casper-node
make setup-rs
make build-client-contracts
```

These commands will build all the necessary Wasm files. You can use these contracts for bonding, retrieving rewards and unbonding:
- activate_bid.wasm - reactivates an ejected validator
- add_bid.wasm - enables bonding for validator stake
- delegate.wasm - delegates stake
- undelegate.wasm - undelegates stake
- withdraw_bid.wasm - enables unbonding for validator stake

## Step 3: Create and Fund Keys for Bonding {#step-3-create--fund-keys-for-bonding}

To create keys and fund your account, you must setup the casper command line client. For instructions on setting up the command line client, creating keys and funding your accounts, see [Prerequisites](../workflow/setup.md). The tokens acquired from funding your account are needed to bond your node on to the network and to pay for the bonding transaction.

Generate the keys in the `/etc/casper/validator_keys` folder using the following command:

```bash
sudo casper-client keygen /etc/casper/validator_keys
```

## Step 4: Update the Trusted Hash {#step-4-update-the-trusted-hash}

The node's `config.toml` needs to be updated with a recent trusted hash. 

### Retrieving a Trusted Hash {#retrieving-trusted-hash}

Visit a `/status` endpoint of a validating node to obtain a fresh trusted block hash. The default port is usually `8888`. Retrieve the `last_added_block_info:` hash. 

```bash
# This will return JSON and we want result.block.hash
casper-client get-block --node-address http://<NODE_IP_ADDRESS>:7777 -b 20

# If jq is installed we can pull it from the JSON return directly with
casper-client get-block --node-address http://<NODE_IP_ADDRESS>:7777 -b 20 | jq -r .result.block.hash
```

For more information on trusted hash, see [Trusted Hash for Synchronizing](../setup/#trusted-hash-for-synchronizing).

### Known Addresses {#known-addresses}

For the node to connect to a network, the node needs a set of trusted peers for that network. For [Mainnet](https://cspr.live/), these are listed in the `config.toml` as `known_addresses`. For other networks, locate and update the list to include at least two trusted IP addresses for peers in that network. Here is an [example configuration](https://github.com/casper-network/casper-protocol-release/blob/main/config/config-example.toml). The [casper-protocol-release](https://github.com/casper-network/casper-protocol-release) repository stores configurations for various environments, which you can also use as examples.

### Updating `config.toml` file {#updating-config-file}

At the top of a `config.toml` file as shown here, enter the trusted block hash to replace the `'HEX-FORMATTED BLOCK HASH'` and uncomment the line by deleting the leading '#'. For more information and the path to the `config.toml` file, see [Config File](../setup/#config-file).

```
# ================================
# Configuration options for a node
# ================================
[node]

# If set, use this hash as a trust anchor when joining an existing network.
#trusted_hash = 'HEX-FORMATTED BLOCK HASH'
```

## Step 5: Start the Node {#step-5-start-the-node}

The Debian package installs a casper-node service for systemd. Start the node with:

```bash
sudo systemctl start casper-node-launcher
```

For more information, visit [GitHub](https://github.com/casper-network/casper-node/tree/master/resources/production).

## Step 6: Confirm the Node is Synchronized {#step-6-confirm-the-node-is-synchronized}

While the node is synchronizing, the `/status` endpoint is available. You will be able to compare this to another node's status endpoint `era_id` and `height` to determine if you are caught up. You will not be able to perform any `casper-client` calls to your `7777` RPC port until your node is fully caught up.

Towards the end of the following output, notice the `era_id` and `height` that you can use to determine if your node has completed synchronizing.

<details>
<summary>Sample output of the <code>/status</code> endpoint</summary>

```json
{
  "api_version": "1.4.3",
  "chainspec_name": "casper-test",
  "starting_state_root_hash": "e2218b6bdb8137a178f242e9de24ef5db06af7925e8e4c65fa82d41df38f4576",
  "peers": [
    {
      "node_id": "tls:0097..b253",
      "address": "18.163.249.168:35000"
    },
    ...
    ...
    ...
    {
      "node_id": "tls:ff95..c014",
      "address": "93.186.201.14:35000"
    }
  ],
  "last_added_block_info": {
    "hash": "8280de05cb34071f276fbe7c69a07cb325ddd373f685877911238b614bdcc5b1",
    "timestamp": "2022-01-04T15:33:08.224Z",
    "era_id": 3240,
    "height": 430162,
    "state_root_hash": "ec4ff5c4d0a9021984b56e2b6de4a57188101c24e09b765c3fee740353690076",
    "creator": "01ace6578907bfe6eba3a618e863bbe7274284c88e405e2857be80dd094726a223"
  },
  "our_public_signing_key": "01cb41ee07d1827e243588711d45040fe46402bf3901fb550abfd08d1341700270",
  "round_length": null,
  "next_upgrade": null,
  "build_version": "1.4.3-a44bed1fd-casper-mainnet",
  "uptime": "25days 1h 48m 22s 47ms"
}
```
</details>

## Step 7: Send the Bonding Request {#step-7-send-the-bonding-request}

To avoid being ejected for liveness failures, it is critical that the bonding request be sent to the local node only after it has synchronized the protocol state and linear blockchain.

For this reason, it is recommended that you use `casper-client` with the default `--node-address` which will talk to localhost.

You can submit a bonding request to change your synchronized node to a validating node, see [Bonding](bonding.md) for detailed instructions.
