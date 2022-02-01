# FAQ - General

### Accounts

<details>
 <summary><b>Should a customer see use the account-hex or the account-hash?</b></summary>
  
Exchange customers or end-users only need to see the <em>account-hex</em>. They do not need to know the <em>account_hash</em>. The <em>account_hash</em> is needed in the backend to verify transactions. 
Store the <em>account-hash</em> to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the <em>account-hex</em> value.

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

### Staking {#staking}

<details>

<summary><b>What are the important aspects to consider when delegating tokens to a validator?</b></summary>

Users should consider consistent uptime, prompt upgrades and commission rates when choosing a validator. Offline and out-of-date validators do not generate rewards.

Active engagement in the community is another important aspect.

</details>

<details>
<summary><b>How do I stake tokens via the command line?</b></summary>

Follow [the delegation workflow](https://casper.network/docs/workflow/delegate) to learn how to stake your tokens via the command line.

</details>

<details>
<summary><b>How do I stake tokens using cspr.live?</b></summary>

See the article on [How to Stake your CSPR](https://casper.network/docs/workflow/staking).

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