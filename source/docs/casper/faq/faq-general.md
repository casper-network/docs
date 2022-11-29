# FAQ - General

### Accounts

<details>
 <summary><b>Should a customer see use the account-hex or the account-hash?</b></summary>
  
Exchange customers or end-users only need to see the <em>account-hex</em>. They do not need to know the <em>account_hash</em>. The <em>account_hash</em> is needed in the backend to verify transactions. 
Store the <em>account-hash</em> to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the <em>account-hex</em> value.

</details>

<details>
<summary><b>Is it possible to convert an account-hash back to an account-hex?</b></summary>

An <em>account-hash</em> is a one-way hashed value of the <em>account-hex</em>. We refer to the <em>account-hex</em> as `public_key` and the <em>account-hash</em> as the `account_address`.

The <em>account-hex</em> originates with JS-SDK naming conventions. We store it and convert it to an <em>account-hash</em>. Using `account-address` within the Rust client generates an account hash from a given public key.

</details>

<details>
<summary><b>Why is my account invalid when I can see it on the testnet?</b></summary>

You must deposit tokens to activate it. You can request tokens from [CSPR Live](https://testnet.cspr.live/tools/faucet).

</details>

### Minimum CSPR Balance {#minimum-cspr-balance}

<details>
<summary><b>What is the minimum CSPR balance required to transfer?</b></summary>

An account cannot transfer less than 2.5 CSPR.

</details>

### Ledger Support {#ledger-support}

<details>

<summary><b>Does Casper offer Ledger support?</b></summary>

Yes. Follow [this guide](https://support.ledger.com/hc/en-us/articles/4416379141009-Casper-CSPR-?docs=true) to install the Casper app on your Ledger device to manage CSPR.

</details>

### Staking {#staking}

<details>

<summary><b>What are the important aspects to consider when delegating tokens to a validator?</b></summary>

Users should consider consistent uptime, prompt upgrades and commission rates when choosing a validator. Offline and out-of-date validators do not generate rewards.

Active engagement in the community is another important aspect.

</details>

<details>
<summary><b>How do I stake tokens via the command line?</b></summary>

Follow [the delegation workflow](/workflow/delegate/) to learn how to stake your tokens via the command line.

</details>

<details>
<summary><b>How do I stake tokens using cspr.live?</b></summary>

See [this article](/workflow/delegate-ui/).

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