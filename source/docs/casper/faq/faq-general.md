# FAQ - General

### Accounts

<details>
 <summary><b>Should customers see their public key or the account hash while on an exchange website?</b></summary>
  
Exchange customers or end-users only need to see the public key. They do not need to know the account hash. The account hash is only needed in the backend to verify transactions. 

Exchanges should store the account hash to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the public key.

</details>

<details>
<summary><b>How do I generate an account hash?</b></summary>

You must ensure the following prerequisites are met before you can generate an account hash:

1.  [Set up your machine](../dapp-dev-guide/setup.md)
2.  Have a Casper Account and its _public key_
3.  Install the Casper [command-line client](../dapp-dev-guide/setup.md#the-casper-command-line-client)

**Generating an Account Hash**

To generate an account hash use the following command:

```bash
casper-client account-address --public-key <PUBLIC KEY HEX CODE>
```

**Sample Output**

```bash
account-hash-a2c2a41c282452195e5dd267272d12ed3e991467a5f881aab96306bac1cec3e8
```

In the above output, `a2c2a41c282452195e5dd267272d12ed3e991467a5f881aab96306bac1cec3e8` is the account hash and the prefix `account-hash-` is used to make it a tight key.

</details>

<details>
<summary><b>What is an `account-hex`?</b></summary>

The <em>account-hex</em> term originates from the JS-SDK naming convention and refers to a public key. We store it and convert it to an account hash. 
</details>

<details>
<summary><b>Is it possible to convert an account hash back to a public key?</b></summary>

No. An account hash is a one-way hashed value of the public key.
</details>

<details>
<summary><b>Why is my account invalid when I can see it on the Testnet?</b></summary>

You must deposit tokens to activate an account. You can request tokens from [the faucet on Testnet](https://testnet.cspr.live/tools/faucet).

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

Users should consider consistent uptime, prompt upgrades and delegation rates when choosing a validator. Offline and out-of-date validators do not generate rewards.

Active engagement in the community is another important aspect.

</details>

<details>
<summary><b>How do I stake tokens via the command line?</b></summary>

Follow [the delegation workflow](../workflow/developers/delegate.md) to learn how to stake your tokens via the command line.

</details>

<details>
<summary><b>How do I stake tokens using cspr.live?</b></summary>

See [this article](../workflow/users/delegate-ui.md).

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
