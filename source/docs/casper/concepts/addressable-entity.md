# Addressable Entities

## What is an Addressable Entity?

Casper 2.0 introduces the concept of an [`AddressableEntity`](../concepts/glossary/A.md#addressable-entity) that will supplant the individual `Account` and `Contract` types for any new usage.

The merger of `Account` and `Contract` functions will open some new options for `AddressableEntity` that would otherwise not be possible. Within the context for any given `AddressableEntity`, the `EntityType` will identify if it is an `Account`, a `SmartContract`, or a `System` contract.

This `EntityType` will dictate what the addressable entity can and cannot do.

## Account

An addressable entity marked as an `Account` will function in much the same way as a traditional legacy account on a Casper network. It will have an associated key pair of a `PublicKey` and a secret key, and an `AccountHash` derived from that. There is also an associated main purse.

A legacy account will automatically migrate to an addressable entity when it interacts with the network, with no action necessary on the user side. Their key pair will continue functioning as it did prior to the migration. Further, their main purse will remain the same.

## SmartContract

An addressable entity marked as a `SmartContract` will have the same functionality as a legacy contract, but with several new features. The `SmartContract` now possesses a main purse that it can use to pay for its own computation, and may have [associated keys](../concepts/design/casper-design.md#accounts-associated-keys-weights) and action thresholds in the same way as an account. More information on multi-signature management, associated keys, and action thresholds can be found [here](../resources/advanced/multi-sig/multi-sig-workflow.md).

### Contract Self-Payment

In contrast to legacy smart contracts, entrypoints on a `SmartContract` type of `AddressableEntity` will specify whether they pay for themselves or require the caller to pay for their computation.

In the past, a single minimum balance check occurred prior to execution. This balance check ensured that the account sending the deploy held a minimum of 2.5 CSPR to pay the penalty if the execution failed.

In contrast, the new method checks the balance before paying for each step along the way. Each contract involved in the process that pays for itself will reduce the overall liability of the account starting the call chain. The account will still be required to hold the initial full potential gas cost of the deploy slot it uses in its main purse.

As an example, if an account uses a slot with a hard gas cap of 1000 CSPR, it must hold 1000 CSPR when sending the deploy. If this deploy calls a contract entrypoint set to pay for itself, the potential full cost of the deploy drops by the amount that the contract will cover. If we use an example of 150 CSPR, the deploy will now have a maximum potential cost of 850 CSPR, and 150 CSPR will come from the contract's main purse.

However, the caller sending the initial deploy will still have to pay for any computation that the called contract cannot cover. If the contract's main purse runs out of gas, the caller must make up the difference for the last operation taken. Otherwise, execution will cease. The initial 1,000 CSPR liability is not a cost, but a hold, and any unused CSPR will be released to the caller upon successful execution of the deploy.

In the event that the entrypoint is not set to pay for itself, the caller will be responsible for all actions the contract takes as a result of being called.

## System

As part of the migration to Casper 2.0, system contracts (`Mint`, `Auction`, `HandlePayment`, and `StandardPayment`) will migrate to a special type of addressable entity with the `EntityType` of `System`.

### Further Reading

- [Accounts and Keys](../concepts/accounts-and-keys.md)
- [Smart Contracts](../concepts/smart-contracts.md)
- [Hash Types](../concepts/hash-types.md)
- [Multi-Signature Management](../resources/advanced/multi-sig/index.md)
