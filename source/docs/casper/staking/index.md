---
title: Overview
slug: /staking
tags: ["finance", "staking", "governance"]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Staking

This page describes key concepts regarding the staking process.

A feature of Proof-of-Stake protocols is that token holders can actively participate in the protocol through a mechanism known as **staking** or **delegation**. They can stake their tokens with any validator on a Casper network. Alternatively, it is possible to stake tokens via an exchange or custody provider.

## Key Concepts {#key-concepts}

Please read the following sections carefully before staking tokens on a Casper network.

### Slashing {#slashing}

Presently Casper does not slash for equivocations. If a node equivocates, its' messages are ignored by the rest of the validators for the balance of the era and made inactive. A node running the software provided by the Casper Association will terminate once it detects that it has equivocated. Future work includes locking an equivocating validator's stake for an extended time, effectively penalizing the validator.

Casper does not treat validator stake differently than delegator stake for security reasons.

### Delegation Rate {#delegation-rate}

Validators define a commission that they take in exchange for providing staking services. This commission is represented as a percentage of the rewards that the validator retains for their services.

### Rewards {#rewards}

Validators receive rewards for participating in consensus by voting on blocks and finalizing blocks (by sending finality signatures). There is no precise reward per block. Rewards are split proportionally among stakes within an era. 

The rewards earned are also reduced if a validator is offline or cannot vote on many blocks. Delegators can only receive a proportional amount of the validator's rewards minus the validator's commission (called Delegation Rate). Rewards are distributed at the end of each era.

### Selecting a Node for Delegating {#selecting-a-node-for-delegating}

Selecting a validating node you can trust as a prospective delegator is essential. Block explorers such as [cspr.live](https://cspr.live) provide [validator performance statistics](https://cspr.live/validators), including a performance score, total stake, number of delegators, and fees. Please do your due diligence before staking tokens with a validator.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/1.validators.png")} alt="4.3" width="500" />

### Monitoring Rewards {#monitoring-rewards}

It's recommended that you check in on how your stake is performing from time to time. If the validator you staked with decides to unbond, your stake will also be unbonded and you will not earn rewards. Ensure that the validator you selected performs as per your expectations.

Validators have to win a staking auction by competing with prospective and current validators for a slot. This process is permissionless, meaning validators can join and leave the auction without restrictions, except for the unbonding wait period.

### Unbonding Period {#unbonding-period}

For security purposes, whenever tokens are un-delegated, the protocol will continue to keep the token locked for 14 hours.

## Tutorials

Navigate to these pages for step-by-step tutorials on how to delegate tokens:

- [Creating a wallet with the Casper Signer](/workflow/staking.md#3-creating-your-wallet-with-the-casperlabs-signer)
- [Delegating CSPR to a validator](/workflow/staking.md)
- [Staking with Ledger devices](/workflow/staking-ledger/)
- [Delegating with the command-line](/workflow/delegate.md)
- [Re-delegating with the command-line to a new validator](/workflow/redelegate.md)


