# Safely Transferring Tokens to a Contract

This tutorial covers two methods through which you can handle tokens via a contract. There are a variety of potential applications that necessitate such a configuration. However, this is not a native process to the Casper network and will require the use of custom code. As such, the following two scenarios provide a framework for developers, as well as the pros and cons of each example. Developers should choose the option that best suits their individual needs.

## Scenario 1 - Creating a Throw-Away Purse {#scenario1}

The first scenario involves the use of a single-use, throw-away purse. The caller creates and funds a purse independent of their main purse, before passing the URef to the callee.

In this example, the smart contract retains full access to the purse, creating security concerns over its reuse by the caller. Further, it is possible for the caller to also retain full access to the disposable purse, although this is not demonstrated in the example. As such, the contract should remove any tokens from the purse and transfer them to another purse under their control to avoid issues.

This scenario is less complex, but more wasteful than the second scenario. Any purses created in this fashion remain permanent, but unused after the initial operation.

* Please note that the creation of a purse costs 2.5 CSPR on the Casper mainnet.

```

#[no_mangle]
pub extern "C" fn call() {
    let amount: U512 = runtime::get_named_arg("amount");
    // This is demonstrating the most direct case, wherein you pass in the contract_hash and
    // the entry_point_name of the target contract as args.
    // With prior setup having been done, this can also be simplified.
    let contract_hash = runtime::get_named_arg("contract_hash");
    let entry_point_name = runtime::get_named_arg("entry_point_name");

    // This creates a new empty purse that the caller will use just this one time.
    let new_purse = system::create_purse();
    
    // Transfer from the caller's main purse to the new purse that was just created.
    // Note that transfer is done safely by the host logic.
    system::transfer_from_purse_to_purse(account::get_main_purse(), new_purse, amount, None)
        .unwrap_or_revert();
        
    // Pass the newly created purse to the smart contract with full access rights;    
    // the called contract should receive the new purse, extract the token from it, and then do
    // whatever else it is meant to do if a valid amount was transferred to it. Note that the
    // caller's main purse is never exposed to the called contract; the newly created purse
    // is provided instead.
    runtime::call_contract(contract_hash, entry_point_name, runtime_args! {
        // The arg names are defined by the contract that you are calling,
        // there is no canonical name. The contract you are calling may have other
        // runtime args that it requires.
        "????" => new_purse
    });
}

```

### Scenario 1 - Advanced Variation {#scenario1-advanced}

Advanced versions of this scenario can mitigate the wastefulness inherent in the example. If the caller creates a named purse independent of their main purse, they can integrate it with the contract in question. In this way, the same purse can be used to fund a contract repeatedly.

[This example](https://github.com/casper-network/casper-node/blob/release-1.4.4/smart_contracts/contracts/client/named-purse-payment/src/main.rs) provides a framework for the idea, but will require modification to suit developer needs.

## Scenario 2 - Maintaining a Reusable Purse within Contract Logic {#scenario2}

The second scenario involves more complex internal logic to allow for a purse's reuse. The contract itself keeps track of a purse, associated with the caller, as a means of internal bookkeeping.

In [Scenario 1](#scenario1), the newly created purse serves as a pure means of transferring tokens from the caller to the callee. In contrast, Scenario 2 maintains an internal purse associated with the caller's address. This purse serves as token storage for actions the caller wishes the contract to undertake on their behalf. It differs from [Scenario 1's Advanced Variation](#scenario1-advanced) in that the purse in question is under the control of the contract rather than the caller.

Scenario 2 offers a less wasteful means of transferring tokens to a contract, but comes with the added burden of internal complexity. When choosing between the two scenarios, you must evaluate the scope and needs of your project and choose accordingly.

```

// Scenario 2: with this style, the contract being called has some internal accounting
// to keep track of a reusable purse associated to the calling account; this avoids
// wasteful creation of one time purses but requires the smart contract being called
// to have more sophisticated internal logic. 
#[no_mangle]
pub extern "C" fn call() {
    let amount: U512 = runtime::get_named_arg("amount");

    // This is demonstrating the most direct case, wherein you pass in the contract_hash and
    // the entry_point_names of the target contract as args.
    // With prior setup having been done, this can also be simplified.
    let contract_hash = runtime::get_named_arg("contract_hash");
    // the name of the entry point on the contract that returns a purse uref to receive token at
    // the actual name of the entry point is up to the smart contract authors
    let deposit_point_name = runtime::get_named_arg("deposit_point_name");
    // whatever entry point on the smart contract does the actual work if token has been transferred
    // the actual name of which is up to the smart contract authors.
    let other_entry_point_name = runtime::get_named_arg("other_entry_point_name");

    // The smart contract returns a purse URef of a deposit purse (with ADD access rights only)
    // for the caller to transfer to.
    let deposit_purse: URef  = runtime::call_contract(contract_hash, deposit_point_name, runtime_args! {});

    // transfer from the caller's purse to the purse provided by the contract; the transfer is handled
    // safely by the host and the caller's purse is never exposed to the called smart contract.
    system::transfer_from_purse_to_purse(account::get_main_purse(), deposit_purse, amount, None)
        .unwrap_or_revert();

    // The contract being interacted with looks up the associated purse, checks its balance, etc.
    // within its logic. That side of it is entirely up to the smart contract authors to code; the caller
    // merely calls the logic. Also, the entry point might require one or more runtime arguments. 
    // In all cases some discovery of the API of the contract you are calling is necessary.
    runtime::call_contract(contract_hash, other_entry_point_name, runtime_args! {});
}

```

### Scenario 2 - Advanced Variation {#scenario2-advanced}

In Scenario 2, the contract in question maintains a purse for each associated caller. The advanced variation establishes an internal ledger that records the balance of each caller. In this fashion, a single purse can store the motes of all callers accessing the contract. The contract can record the information for each caller as a dictionary item and respond accordingly.

This streamlines the internal accounting process of the contract, but does require a greater degree of complexity during initial setup.