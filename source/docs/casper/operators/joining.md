# Joining a Running Network

The Casper network is permissionless, enabling new validators to join the network and provide additional security to the system. This page outlines the sequence of recommended steps to spin up a validating node and successfully join an existing network.

## Step 1: Provision Hardware {#step-1-provision-hardware}

Visit the [Hardware Specifications](hardware.md) section and provision your node hardware.

## Step 2: Set Up the Node and Build Contracts {#step-2-build-contracts--set-up-the-node}

Follow the instructions in the [Basic Node Setup](setup.md) section to configure the software on your node. Build all necessary contracts for bonding, retrieving rewards and unbonding.

### Building Contracts {#building-contracts}
1. Clone the casper-node repository. 

```bash
git clone https://github.com/casper-network/casper-node
```
2. To build contracts, set up Rust and install all dependencies, see [Installing Rust](../dapp-dev-guide/getting-started.md#installing-rust) in the Developer Guide.

3. Use the following commands to build the contracts in release mode:

```bash
cd casper-node
make setup-rs
make build-client-contracts
```

These commands will build all the necessary WASM files. You can use these contracts for bonding, retrieving rewards and unbonding:
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

# if jq is installed we can pull it from the JSON return directly with
casper-client get-block --node-address http://<NODE_IP_ADDRESS>:7777 -b 20 | jq -r .result.block.hash
```

A good IP to use above are those listed in your `config.toml` as `known_addresses`. For more information on trusted hash, see [Trusted Hash for Synchronizing](setup#trusted-hash-for-synchronizing).

### Updating `config.toml` file {#updating-config-file}

At the top of a `config.toml` file as shown here, enter the trusted block hash to replace the `'HEX-FORMATTED BLOCK HASH'`. For more information and the path to the `config.toml` file, see [Config File](setup#config-file).

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
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 26619  100 26619    0     0  74772      0 --:--:-- --:--:-- --:--:-- 74772
{
  "api_version": "1.4.3",
  "chainspec_name": "casper-test",
  "starting_state_root_hash": "E2218B6BdB8137A178f242E9DE24ef5Db06af7925E8E4C65Fa82D41Df38F4576",
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
    "hash": "8280dE05cB34071f276fBE7c69a07Cb325ddd373f685877911238b614BdCC5b1",
    "timestamp": "2022-01-04T15:33:08.224Z",
    "era_id": 3240,
    "height": 430162,
    "state_root_hash": "EC4ff5c4D0a9021984b56e2b6DE4A57188101C24E09b765c3FEe740353690076",
    "creator": "01ACe6578907Bfe6EbA3a618e863bBE7274284C88e405E2857BE80DD094726a223"
  },
  "our_public_signing_key": "01Cb41eE07d1827e243588711D45040Fe46402Bf3901fb550AbfD08D1341700270",
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
