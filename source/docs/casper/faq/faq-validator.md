# FAQ - Validators

### Basic Questions

<details>
<summary><b>Is CSPR an ERC-20 token?</b></summary>

No, CSPR is a native token that resides on a layer 1 protocol. It does not rely on another token.

</details>

<details>
<summary><b>What determines the cost of a deploy?</b></summary>

Native system transfers have a fixed gas cost. Calling system contracts by their hashes also has a fixed cost.

If two calls with different arguments but for the same hash show different gas costs, it's caused by executed WASM code. Different arguments may lead to different code paths and executed opcodes. You cannot predict the number of executed opcodes or host functions.

If the calls use the same arguments, yet the cost is increasing, you might consider reviewing your global state usage. There's a chance that you are reading a collection from the global state, updating it and writing back with a larger size.

</details>

### CSPR Transactions

<details>
<summary><b>What should I do if I am encountering errors installing cargo-casper?</b></summary>

Ensure that you have installed both Rust and CMake before attempting to install cargo-casper.

</details>

<details>
<summary><b>Why does my deploy get an 'Out of Gas' error?</b></summary>

If you receive this error, try specifying a higher amount of CSPR for the deployment.

</details>

<details>
<summary><b>Is there an API available to query CSPR transactions?</b></summary>

The client API of Casper Node is available at [Casper RPC API](http://casper-rpc-docs.s3-website-us-east-1.amazonaws.com/). You can find specific node-addresses at cspr.live for the [testnet](https://testnet.cspr.live/tools/peers) or [mainnet](https://cspr.live/tools/peers)

</details>

### Node Status

<details>
<summary><b>How do I check my node status?</b></summary>

Once your node is running, you can run `curl -s localhost:8888/status | jq .last_added_block_info` to query your local server's synchronization status. The output will look similar to:

```bash

curl -s http://localhost:8888/status | jq .last_added_block_info
{
  "hash": "73f398f89dfe2b980634281c0d6be8379b27aedbf4029f699219fafa1e09526c",
  "timestamp": "2021-07-09T04:56:42.240Z",
  "era_id": 1090,
  "height": 106926,
  "state_root_hash": "5e7bd420cb5d3290cf50036ada510c9c1adcf63198381c398403086f739394c8",
  "creator": "011752f095ee6d2902540ea4fafd649da4b7b0c2a6e38176fb7f661a0e463d43b4"
}

```

</details>

<details>
<summary><b>What ports are required for casper-node?</b></summary>

Casper-node requires the following ports:

* 35000 - Required for external visibility
* 7777 - RPC endpoint for interaction with casper-client
* 8888 - REST endpoint for status and metrics (This port allows your node to be part of the network status)
* 9999 - SSE endpoint for event stream

</details>

<details>
<summary><b>What '--node-address' do I use for making requests?</b></summary>

If you are running a node, you can use `localhost:7777` for RPC requests like deploys. For node-health queries, use `localhost-8888`.

</details>

<details>

<summary><b>What are the important aspects to consider when delegating tokens to a validator?</b></summary>

Users should consider consistent uptime, prompt upgrades and commission rates when choosing a validator. Offline and out-of-date validators do not generate rewards.

Active engagement in the community is another important aspect.

</details>

<details>
<summary><b>Why is my account invalid when I can see it on the testnet?</b></summary>

You must deposit tokens to activate it. You can request tokens from [CSPR Live](https://testnet.cspr.live/tools/faucet).

</details>

<details>
<summary><b>How can I move my node to another machine?</b></summary>

**Method One**
1. Stop the node.
2. Copy all data.
3. Change the mountpoint.
4. Start the node.

**Method Two**
1. Create another node in parallel.
2. Once it's up to date, stop the nodes.
3. Swap the associated keys.
4. Restart the new node.

</details>

### Casper Compatibility

<details>
<summary><b>Does Casper run on ARM?</b></summary>

Casper-node does not wowrk with ARM type servers. You can see our hardware specifications [here](https://docs.casperlabs.io/en/latest/node-operator/hardware.html)

</details>

<details>
<summary><b>What OSes are supported for casper-node?</b></summary>

Casper is currently tested and packaged for Ubuntu 18.04 or 20.04

</details>

<details>
<summary><b>Do you have Ledger support?</b></summary>

Casper is working with Ledger to integrate wallet solutions. You can monitor the progress [here](https://github.com/Zondax/ledger-casper)

</details>

<details>
<summary><b>Do I have to run a node 24/7?</b></summary>

Validators must be online 24/7. Otherwise, they face ejection and loss of rewards as a result of liveness failure. Failure to participate in consensus for one era results in ejection.

If you cannot run a node 24/7, you can delegate your tokens to a healthy validator node with good uptime.

</details>

### Staking

<details>
<summary><b>How do I stake tokens via the command line?</b></summary>

The following command is an example of how to stake your tokens via the command line:

```bash

VALIDATOR_PUBLIC_KEY=the public key hex of your desired validator, from cspr.live, or testnet.cspr.live
VALIDATOR_PUBLIC_KEY=$(cat /etc/casper/validator_keys/public_key_hex)
NETWORK_NAME="casper-test"

sudo -u casper casper-client put-deploy \
    --chain-name casper-test \
    --node-address http://localhost:7777 \
    --secret-key /path/to/secret_key.pem \
    --session-path "$HOME/casper-node/target/wasm32-unknown-unknown/release/delegate.wasm" \
    --payment-amount 3000000000 \
    --session-arg "validator:public_key='$VALIDATOR_PUBLIC_KEY'" \
    --session-arg="amount:u512='555000000000'" \
    --session-arg "delegator:public_key='$PUBLIC_KEY_HEX'"

```

</details>

<details>
<summary><b>How do I stake tokens in a GUI?</b></summary>

Staking interfaces from various services will appear differently. The current recommended GUI staking is through the Casper Signer and cspr.live.

1. Download and install the [Signer extension](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce) in a Chrome or Chromium-based browser.
2. Set a password for your new vault of keys and `Create Vault`
3. Click `Create an Account`
4. Give your keys an alias and select an algorithm (Casper supports ed25519 and secp256k1).
5. Go to the sign-in page for [cspr.live](https://cspr.live/sign-in) and click the red `Sign In` button. This will open signer and connect to the site.
6. After linking your keys, you can go to the wallet drop-down and visit the [delegate stake page](https://cspr.live/delegate-stake).
7. Confirm the transaction details on the next screen.
8. To sign the transaction and send your delegation:
- Click `Sign with Casper Signer`
- The Signer app window will open. Make sure that the deploy hash in the Signer window matches the deploy hash in [cspr.live](https://cspr.live/) before continuing.
- Click `Sign` in the Signer window to sign and finalize the transaction.

</details>

<details>
<summary><b>What is self-stake percentage?</b></summary>

Self-stake is the amount of CSPR a validator personally staked on the network from their validating node, expressed as a percentage of the total amount of CSPR staked to that validator. Most validators choose to delegate their own tokens to their validating node as a security practice, which will show as a low self-stake percentage.

</details>

<details>
<summary><b>What is slashing?</b></summary>

Slashing is a penalty for inappropriate or malicious behavior. Ordinarily, the official node software will not act maliciously unless intentionally altered. When this happens, the validator in question gets slashed (Note: The network treats validator and delegator tokens equally).

Slashing is not currently enabled on the Casper Mainnet. If a validator behaves poorly on the network, they face eviction from the network and loss of rewards. When slashing is enabled, poor behavior will result in token removal. In this case, you will lose any rewards accrued during the eviction period.

</details>
