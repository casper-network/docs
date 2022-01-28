# FAQ - General

### Choosing a Validator {#choosing-a-validator}
<details>

<summary><b>What are the important aspects to consider when delegating tokens to a validator?</b></summary>

Users should consider consistent uptime, prompt upgrades and commission rates when choosing a validator. Offline and out-of-date validators do not generate rewards.

Active engagement in the community is another important aspect.

</details>

### Deploy Processing {#deploy-processing}

<details>
 <summary><b>How do I know that a deploy was finalized?</b></summary>
  
If a deploy was executed, then it has been finalized. If the deploy status comes back as null, that means the deploy has not been executed yet. Once the deploy executes, it is finalized, and no other confirmation is needed. Exchanges that are not running a read-only node must also keep track of <a href="./faq-developer#finality-signatures">finality signatures</a> to prevent any attacks from high-risk nodes.

</details>

### Account-hex vs. Account-hash {#account-hex-vs-account-hash}

<details>
 <summary><b>Should a customer see the account-hex or the account-hash?</b></summary>
  
Exchange customers or end-users only need to see the <em>account-hex</em>. They do not need to know the <em>account_hash</em>. The <em>account_hash</em> is needed in the backend to verify transactions. 
Store the <em>account-hash</em> to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the <em>account-hex</em> value.

</details>

<details>
<summary><b>Why is my account invalid when I can see it on the testnet?</b></summary>

You must deposit tokens to activate it. You can request tokens from [CSPR Live](https://testnet.cspr.live/tools/faucet).

</details>

### Staking {#staking}

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

[How to Stake your CSPR](https://casper.network/docs/workflow/staking)

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