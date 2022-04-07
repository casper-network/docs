# Interacting with Runtime Return Values

Users interacting with the Casper Network must keep in mind the differences between session and contract code. Session code executes entirely within the context of the initiating account, where contract code executes on global state through a smart contract. Any action undertaken by a contract must initiate through an outside call, usually via session code.

As session code executes directly from the account, the [runtime::ret()](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.ret.html) function allows for a contract to return information to the session code that called it. The session code can then store the returned information in a local [NamedKey](https://docs.rs/casper-types/latest/casper_types/struct.NamedKey.html) under the calling account.

## Contract Code {#return-contract-code}

For example, if we create a contract that adds two numbers, we would use `runtime::ret()` to define the results that should be passed to the calling session code as per the following:

```rust

#[no_mangle]

// This function serves as a potential entry point for users executing session code
// to add numbers as per the contract deploy.

pub extern "C" fn add() {

    // The contract accepts the first argument as a number to be added.

    let number_1: u32 = runtime::get_named_arg("number_1");

    // The contract accepts the second argument as a number to be added.

    let number_2: u32 = runtime::get_named_arg("number_2");

    // The contract adds the two arguments together to create 'result' in the form of a CLValue.

    let result_as_cl_value = ClValue::from_t( t: number_1 + number_2)
        .unwrap_or_revert();

    // The contract returns the added value to the calling session code. It must be returned 
    // as a CLValue. More complex information can be returned, as long as it conforms to CLType, 
    // ToBytes and FromBytes. If you wish to send your own type of object across the WASM 
    // boundary, this can be done through the `Any` CLType, but will require custom adherence 
    // to the serialization standard. 

    runtime::ret(result_as_cl_value)
}

```

The above code takes in two runtime arguments, `number_1` and `number_2` provided by session code. It then adds these two values to create `result_as_cl_value`, which it passes back to the caller via `runtime::ret(result_as_cl_value)`. 

Without the addition of the `runtime::ret`, this information would not return to the caller. In addition to the code above, the developer would need to define the `call` function and appropriate entry point as per the following:

<details>

<summary><b>Additional Example Code</b></summary>

```rust
#[no_mangle]
pub extern "C" fn call() {
    // Creating a parameter from the value supplied by number_1
    let parameter_1 = Parameter::new(
        name: "number_1",
        cl_type: CLType::u32,
    );
    // Creating a parameter from the value supplied by number_2
    let parameter_2 = Parameter::new(
        name: "number_2",
        cl_type: CLType::u32,
    );
    //Creating an entry point for the 'Adder' 
    let adder_entry_point = EntryPoint::new(
        // The name of the entry point.
        name: "add",
        // How the arguments will be provided to the entry point.
        args: vec![parameter_1, parameter_2],
        // Information on the returned information.
        ret: CLType::u32,
        // Access permission for the entry point - i.e. This entry point may be used by
        // anyone due to it being 'Public'
        EntryPointAccess::Public
        // The type of entry point
        entry_point_type: EntryPointType::Contract
    );

    // Defining the adder entry point as an entry point.
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(adder_entry_point);

    // This creates a new contract stored under a Key::Hash at version 1.
    let (contract_hash,:ContractHash , contract_version :ContractVersion ) = storage::new_contract(
        entry_points,
        // This contract does not use named keys.
        named_keys: None,
        // These create named keys ON THE ACCOUNT that store the package hash associated with
        // the contract and the access URef that allows adding/disabling contract versions.
        hash_name: Some("adder_package_hash".to_string()),
        uref_name: Some("adder_access_uref".tostring()),
    );

    // Creates another named key with the contract hash under the calling account.
    runtime::put_key("adder_contract_hash", contract_hash.into());
}
```

</details>


## Session Code {#return-session-code}

On the other end of this interaction, the session code needs to store the value it receives in a NamedKey for future access. The following code outlines this process:

```rust

// Establishes a named argument for Contract Hash, as session code rather than 
// contract code. This is more efficient.
const CONTRACT_HASH: ContractHash = ContractHash::default();

#[no_mangle]
// The Call function serves as a main function - it will execute automatically on 
// launch. Casper searches for the 'call' function rather than main - for both session
// and smart contract.
pub extern "C" fn call(){
    // This defines the variables included within the function.
    let contract_hash = runtime::get_named_arg("contract_hash");
    let number_1 = runtime::get_named_arg("number_1");
    let number_2 = runtime::get_named_arg("number_2");

    let runtime_args = runtime_args! {
        "number_1" => number_1,
        "number_2" => number_2,
    };

    // This calls the contract using the arguments listed within.
    let result: u32 = runtime::call_contract::<u32>(
        // The contract hash, used as a means of identifying the contract in question
        // that we are attempting to access.
        contract_hash: CONTRACT_HASH,
        // The entry point within the contract. Contract hash identifies the contract
        // to target, entry point targets the action within the contract that we are 
        // looking to use.
        entry_point_name: "add",
        // The runtime arguments are the variables we are providing to the entry point.
        // In the case of this example, they represent the two numbers to be added.
        runtime_args
    );

    // Option 1, which creates a new URef for each use of the adder.
    runtime::put_key(name: "result", storage::new_uref(init: result).into()) 
    
    // Option 2, which reuses the same Uref if one already exists. Otherwise, it will create a new URef.
    match runtime::get_key("result") {
        None => {
            runtime::put_key("result", storage::new_uref(init: result).into())
        }
        Some(result_key :Key) => {
            let result_uref = result_key.into_uref().unwrap_or_revert();
            storage::write(result_uref, result)
        }
    }
}

```

This session code calls the previously listed contract code by using the `contract_hash`, supplying it with two arguments: `number_1` and `number_2`. It does so through the defined entry point named `add`.

When the session code receives the return value, it stores it in `result`, which is a NamedKey associated with the calling account. The first option creates a new `result` every time it calls the contract. Option 2 only creates a new `result` if there is no previous associated storage, otherwise, it overwrites the stored value.

The user can then view the stored information by accessing their NamedKey.