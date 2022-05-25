# Interacting with Runtime Return Values

Users interacting with a Casper Network must keep in mind the differences between session and contract code. Session code executes entirely within the context of the initiating account, while contract code executes within the context of its own state. Any action undertaken by a contract must initiate through an outside call, usually via session code.

Developers should note the difference between a caller and an immediate caller. The immediate caller represents the session or contract code that directly accessed the entry point. The caller is the original, initiating session code that started the entire process. There are many cases where contract code may call additional contract code. In this case, the immediate caller may be another instance of contract code. Even in this event, the overall caller will be the initiating session code, while there may be several layers of stacked contract code acting as immediate callers.

Contract code can optionally return a value to their immediate caller via `runtime::ret()`, whether that immediate caller is another contract code or session code. The returned value may be used within the context of the session or contract code, stored for later use, or discarded if not needed. Use of return values depends entirely on what the developer needs in that instance.

Session code initiates actions on behalf of an account which is considered to be the caller. Therefore, it cannot return anything.

## Contract Code {#return-contract-code}

For example, if we create a contract to accept and keep a record of donations, we would use `runtime::ret()` to define the results that should be passed to the caller as per the following:

```rust

#[no_mangle]
pub extern "C" fn donate() {
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);
    if let Key::Account(donating_account_hash) = donating_account_key {
        update_ledger_record(donating_account_hash.to_string())
    } else {
        runtime::revert(FundRaisingError::InvalidKeyVariant)
    }
    let donation_purse = *runtime::get_key(FUNDRAISING_PURSE)
        .unwrap_or_revert_with(FundRaisingError::MissingFundRaisingPurseURef)
        .as_uref()
        .unwrap_or_revert();
    let value = CLValue::from_t(donation_purse.into_add()).unwrap_or_revert();
    runtime::ret(value)
}

```

In this example, the return value is the URef corresponding to the purse used to raise funds, with `add` permission only. Using this information, the calling code will be able to then transfer funds into the purse, after calling the `donate` entry point.

Without the addition of the `runtime::ret`, the purse would not be returned to the caller.

## Session Code {#return-session-code}

The following is an example of session code calling the [specified entry point](#return-contract-code). Keep in mind that the immediate caller does not need to be session code, and the immediate caller could be another instance of contract code.

```rust

#[no_mangle]
pub extern "C" fn call() {
    let fundraiser_contract_hash: ContractHash = runtime::get_named_arg(FUNDRAISER_CONTRACT_HASH);
    let donating_account_key: Key = runtime::get_named_arg(DONATING_ACCOUNT_KEY);
    let donation_amount: U512 = runtime::get_named_arg(DONATION_AMOUNT);

    let donating_purse_uref: URef = runtime::call_contract(
        fundraiser_contract_hash,
        ENTRY_POINT_DONATE,
        runtime_args! {
            DONATING_ACCOUNT_KEY => donating_account_key
        },
    );
    system::transfer_from_purse_to_purse(
        account::get_main_purse(),
        donating_purse_uref,
        donation_amount,
        None
    )
        .unwrap_or_revert()
}

```

This session code calls into a contract's entry point by using `runtime::call_contract`, supplying the `contract_hash` to identify the contract to be called, and the name of the entry point to be invoked, in this case `donate`. It supplies the `donating_account_key`, which in this case is the account key of the caller. The contract will then provide a return value, in this case `donating_purse_uref`. To call an entry point, you will need to know the [CLType](dapp-dev-guide/sdkspec/types_cl.md) of the return value and identify it within the code.

You can determine the type of the return value by [querying the contract object](workflow/querying/#querying-an-account) in global state. To query a contract rather than an account, replace the key parameter with the formatted string representation of the contract hash.

This example code takes that returned value and transfers a `donation_amount` from the calling account's main purse to the established donation purse. It is not necessary for the code to store, or even use, the returned value. Use of the returned value depends on the needs of the developer.
