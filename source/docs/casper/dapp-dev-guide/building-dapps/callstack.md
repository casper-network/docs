# Understanding Call Stacks

Users wishing to interact with a Casper network must do so through [sending a Deploy](/dapp-dev-guide/building-dapps/sending-deploys/). All Deploys consist of [session code](/dapp-dev-guide/writing-contracts/session-code/) run in the context of the user account that sent the Deploy. The session code may [install contract code to global state](/dapp-dev-guide/writing-contracts/installing-contracts/), or interact with previously [installed contract code](/dapp-dev-guide/building-dapps/calling-contracts/).

When the session code within a Deploy interacts with one or more contracts, this is the beginning of a [`Call Stack`](https://docs.rs/casper-types/latest/casper_types/system/enum.CallStackElement.html). A call stack is the chronological order in which contracts call other contracts, initiated by an instance of session code.

## The Caller

In every instance of a call stack, the originating [caller](https://docs.rs/casper-types/latest/casper_types/system/mint/trait.RuntimeProvider.html#tymethod.get_caller) is the session code within the account's context that began the interaction. Contract code cannot spontaneously act without session code to activate it. As such, the session code represents the *zeroth* entity in each call stack.

## The Immediate Caller

The [immediate caller](https://docs.rs/casper-types/1.5.0/casper_types/system/mint/trait.RuntimeProvider.html#tymethod.get_immediate_caller) is the caller that interacted directly with the contract in question.

If session code calls a contract, which in turn calls another contract, then the session code would represent the *zeroth* entity in the stack, the contract called by the initiating session code would be the *first* and the contract called by the first contract would be the *second*.

In this example, the first contract would be the `immediate caller` of the second contract. The session code would remain the `caller`.

![Call Stack](/image/callstack.png)

## Limitations

Casper networks place a limitation on the maximum height of a call stack at `10` contracts. This does not include the initiating session code, which would still count as the *zeroth* instance within the stack.

As such, a call stack may consist of up to ten consecutive called smart contracts.

:::note

Contract code cannot call session code, only other contract code.

:::