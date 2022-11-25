---
title: Overview
slug: /staking
tags: ["finance", "staking", "governance"]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Staking

This page describes key concepts related to the staking process.

A feature of Proof-of-Stake protocols is that token holders can actively participate in the protocol through a mechanism known as **staking** or **delegation**. They can stake their tokens with any validator on a Casper network. Alternatively, it is possible to stake tokens via an exchange or custody provider.

## Key Concepts {#key-concepts}

Here are a few common topics related to staking, but we also encourage you to do your own research.

### Staking vs. Delegating {#staking-vs-delegating}

Node operators stake their tokens to earn the eligibility to propose and approve blocks on the network. They also run and maintain servers connected to the network. If they win a validator slot, they become validators to enable the Proof-of-Stake aspect of the network, a process different from mining tokens. Validators thus earn rewards for participating and for securing the network.

Anyone can participate in the protocol to earn rewards without maintaining a Casper node (a server that stores a copy of the blockchain). One can delegate or allocate CSPR tokens to a chosen validator on the network. Validators retain a commission, a percentage of the rewards generated from staked tokens. Participating in the protocol this way, the community can help improve the network's decentralization and security and earn rewards in return. Block explorers connected to the network usually post the base annual reward rate.

Casper does not treat validator stake differently than delegator stake for security reasons.

### Slashing {#slashing}

Presently Casper does not slash if a validator equivocates or misbehaves. If a node equivocates, other validators will ignore its messages, and the node will become inactive. The node will terminate once it detects that it has equivocated. 

### Commission or Delegation Rate {#commission}

Validators define a commission (or delegation rate) that they take in exchange for providing staking services. This commission is represented as a percentage of the rewards that the validator retains for their services.

### Delegation Fees {#delegation-fees}

It is important to know that the cost of the delegation process is approximately 3 CSPR. Ensure you have extra CSPR in your account apart from the amount you are delegating; otherwise, the transaction will fail. For example, if you want to delegate 1000 CSPR, you need to have at least 1003 CSPR in your account.

### Rewards {#rewards}

Validators receive rewards proportional to their stake for securing the network and participating in consensus (by voting and finalizing blocks). Delegators receive a portion of the validator's rewards, proportional to what they delegated, minus the validator's commission (or delegation rate). The rewards earned are reduced if a validator is offline or cannot vote on many blocks. 

There is no precise reward per block. Rewards are split proportionally among stakes within an era and are distributed at the end of each era.

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

- [Creating a wallet with the Casper Signer](/workflow/signer-guide)
- [Funding an account from an exchange](/workflow/funding-from-exchanges)
- [Delegating tokens using a block explorer](/workflow/delegate-ui)
- [Staking with Ledger devices](/workflow/staking-ledger/)
- [Delegating with the Casper client](/workflow/delegate.md)
- [Re-delegating with the Casper client to a new validator](/workflow/redelegate.md)
- [Undelegating tokens using a block explorer](/workflow/undelegate-ui)

