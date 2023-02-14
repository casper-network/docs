# Joining a Running Network

Each Casper network is permissionless, enabling new validators to join the network and provide additional security to the system. This page outlines the sequence of recommended steps to spin up a validating node and join an existing network.

## Step 1: Provision Hardware {#step-1-provision-hardware}

Visit the [Hardware Specifications](hardware.md) section and provision your node hardware.

## Step 2: Set Up the Node {#step-2-set-up-the-node}

Follow the instructions on the [Node Setup](/operators/install-node/) page. 

## Step 3: Build the Required Contracts {#step-3-build-contracts}

Use the commands below to build all the necessary contracts for bonding, retrieving rewards, and unbonding.

1. Clone the casper-node repository. 

```bash
git clone https://github.com/casper-network/casper-node
```

2. Use the following commands to build the contracts in release mode. Make sure you have [installed Rust](/dapp-dev-guide/writing-contracts/getting-started.md#installing-rust).

```bash
cd casper-node
make setup-rs
make build-client-contracts
```

These commands will build all the necessary Wasm contracts for operating as a validator:
- `activate_bid.wasm` - Reactivates an ejected validator
- `add_bid.wasm` - Enables bonding for validator stake
- `delegate.wasm` - Delegates stake
- `undelegate.wasm` - Undelegates stake
- `withdraw_bid.wasm` - Enables unbonding for validator stake

## Step 4: Create and Fund Keys for Bonding {#step-4-create--fund-keys-for-bonding}

See the [Node Setup](/operators/setup#create-fund-keys) instructions if you have not generated and funded your validator keys.

## Step 5: Update the Trusted Hash {#step-5-update-the-trusted-hash}

The node's `config.toml` needs to be updated with a recent trusted hash. 

See the [Trusted Hash for Synchronizing](/operators/setup/#trusted-hash-for-synchronizing) instructions if you have not set up a trusted hash during node installation.

## Step 6: Start the Node {#step-6-start-the-node}

Start the node with the `casper-node-launcher`:

```bash
sudo systemctl start casper-node-launcher
```

The above Debian package installs a casper-node service for systemd. 

For more information, visit [GitHub](https://github.com/casper-network/casper-node/wiki#node-operators).

## Step 7: Confirm the Node is Synchronized {#step-7-confirm-the-node-is-synchronized}

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

## Step 8: Send the Bonding Request {#step-7-send-the-bonding-request}

You can submit a [bonding request](bonding.md) to change your synchronized node to a validating node.

The bonding request must be sent after the node has synchronized the protocol state and linear blockchain to avoid being ejected for liveness failures.


