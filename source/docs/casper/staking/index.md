---
title: Overview
slug: /staking
---

# Staking

A feature of Proof-of-Stake protocols is that token holders can actively participate in the protocol through a mechanism known as **staking**.

Persons that hold their private keys can choose to stake their tokens with any validator in the Casper Network. Alternatively, it is possible to stake tokens via an exchange or custody provider as well.

This guide will outline the steps required to stake the CSPR token on the Casper Network.

## What you need to know before staking {#what-you-need-to-know-before-staking}

Please read the following sections carefully before staking tokens on the Casper Network.

## Slashing {#slashing}

Presently Casper does not slash for equivocations. If a node equivocates, its' messages are ignored by the rest of the validators for the balance of the era and made inactive. A node running the software provided by the Casper Association will terminate once it detects that it has equivocated. Future work includes locking an equivocating validator's stake for an extended duration of time, effectively penalizing the validator.

Casper does not treat validator stake differently than delegator stake for security reasons.

## Delegation Rate {#delegation-rate}

Node operators (Validators) define a commission that they take in exchange for providing staking services. This commission is represented as a percentage of the rewards that the node operator retains for their services.

## Rewards {#rewards}

Validators receive rewards for participating in consensus by voting on blocks sending finality signatures (finalizing blocks). There is no precise _per-block_ reward. Rewards are split proportionally among stakes within an era. If a validator is offline or cannot vote on many blocks, the rewards earned are also reduced. Delegators can only receive a proportional amount of the validator's rewards minus the validator's commission (Delegation Rate).

Rewards are distributed at the end of each era.

## Selecting a node for Staking {#selecting-a-node-for-staking}

As a prospective delegator, it is important to select a validating node that you can trust. Please do your due diligence before you stake your tokens with a validator.

## Check in on your Stake {#check-in-on-your-stake}

It's recommended that you check in on how your stake is performing from time to time. If the validator you staked with decides to unbond, your stake will also be unbonded. Make sure that the validator you have selected is performing as per your expectations.

Validators have to win a staking auction by competing with prospective and current validators for a slot. This process is permissionless, meaning validators can join and leave the auction without restrictions, except the unbonding wait period.

## Unbonding Period {#unbonding-period}

For security purposes, whenever a token is un-staked or un-delegated, the protocol will continue to keep the token locked for 14 hours.

# Next Steps

-   [How to Stake your CSPR](../workflow/staking.md)
    -   [1. Introduction](../workflow/staking.md#1-introduction)
    -   [2. Staking Overview](../workflow/staking.md#1-staking-overview)
    -   [3. Creating your Wallet with the CasperLabs Signer](../workflow/staking.md#3-creating-your-wallet-with-the-casperlabs-signer)
    -   [4. Connecting to a Block Explorer](../workflow/staking.md#4-connecting-to-blockexplorer)
    -   [5. Funding your Account](../workflow/staking.md#5-funding-your-account)
    -   [6. Delegating Tokens](../workflow/staking.md#6-delegating-tokens)
    -   [7. Monitoring](../workflow/staking.md#7-monitoring)
    -   [8. Undelegating Tokens](../workflow/staking.md#8-undelegating-tokens)
    -   [ Conclusion](../workflow/staking.md#conclusion)
-   [Delegating with the Command-line](../workflow/delegate.md)
    -   [Building The Delegation WASM](../workflow/delegate.md#building-the-delegation-wasm)
    -   [Acquiring a Validator’s Public Key](../workflow/delegate.md#acquiring-a-validators-public-key)
    -   [Executing the Delegation Request](../workflow/delegate.md#executing-the-delegation-request)
