---
title: Call Stacks
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Understanding Call Stacks

Users wishing to interact with a Casper network must do so through [sending a Deploy](../developers/dapps/sending-deploys.md). All Deploys consist of [session code](../developers/writing-onchain-code/writing-session-code.md) run in the context of the user account that sent the Deploy. The session code may [install contract code to global state](../developers/cli/installing-contracts.md), or interact with previously [installed contract code](../developers/writing-onchain-code/calling-contracts.md).

When the session code within a Deploy interacts with one or more contracts, this is the beginning of a [`Call Stack`](https://docs.rs/casper-types/latest/casper_types/system/enum.CallStackElement.html). A call stack is the chronological order in which contracts call other contracts, initiated by an instance of session code.

## The Caller

In every instance of a call stack, the originating caller is the session code within the account's context that began the interaction. Contract code cannot spontaneously act without session code to activate it. As such, the session code represents the *zeroth* entity in each call stack.

## The Immediate Caller

The [immediate caller](https://docs.rs/casper-types/1.5.0/casper_types/system/mint/trait.RuntimeProvider.html#tymethod.get_immediate_caller) is the caller that interacted directly with the contract in question.

If session code calls a contract, which in turn calls another contract, then the session code would represent the *zeroth* entity in the stack, the contract called by the initiating session code would be the *first* and the contract called by the first contract would be the *second*.

In this example, the first contract would be the `immediate caller` of the second contract. The session code would remain the `caller`.

<img class="align-center" src={useBaseUrl("/image/callstack.png")} width="450" alt="Call Stack" />

## Limitations

Casper networks place a limitation on the maximum height of a call stack. This value can be set within the `chainspec` for the network in question. For the Casper Mainnet, this limit is set at `10` contracts. This does not include the initiating session code, which would still count as the *zeroth* instance within the stack.

As such, a call stack may consist of up to ten consecutive called smart contracts, assuming that the Casper network you are working with is set to the default call stack depth. Smart contract developers should consider it best practice to limit the depth of their call stack as much as practicable. If your contract calls a contract not under your direct control, it may call into any other contracts. You can avoid hitting the limitation by being efficient in your contracts and avoiding superfluous contract separation.

:::note

Contract code cannot call session code, only other contract code.

:::