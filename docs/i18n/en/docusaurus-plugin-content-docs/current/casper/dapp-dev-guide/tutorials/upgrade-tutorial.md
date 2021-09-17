# Smart Contract Upgrade Tutorial

This tutorial shows you how to upgrade smart contracts. Casper contracts are upgradeable, making it easy for contract authors to add features and fix bugs in smart contracts.

The process of upgrading a smart contract is simple. All you need is to deploy a new version of the contract and overwrite the old functions with new ones.

These are the essential steps you need to follow:

1.  Deploy the contract with an _upgrade_ function
2.  Add an entry point in the _call_ function for the _upgrade_ function
3.  Add the new features you desire

Here are specific examples of how to implement the upgrade functionality.

## Step 1. Deploy the contract with an 'upgrade' function

When you first deploy the contract, you must include an _upgrade_ function. Since the contract is immutable, you cannot add the _upgrade_ function after deployment. Without the this function, you cannot upgrade the contract. In other words, you must include the _upgrade_ function when you first deploy the contract.

Start by creating an _upgrade_ function in your contract similar to the following example.

```rust
#[no_mangle]
pub extern "C" fn upgrade_me() {
    let installer_package: ContractPackageHash = runtime::get_named_arg("installer_package");
    let contract_package: ContractPackageHash = get_key(CONTRACT_PACKAGE);

    runtime::call_versioned_contract(installer_package, None, "install", runtime_args! {
    "contract_package" => contract_package,
    })
}
```

## Step 2. Add an entry point in the 'call' function

Next, you need to add an entry point to the _upgrade_ function in the _call_ function. This enables the contract execution to invoke the _upgrade_ function in the future.

```rust
#[no_mangle]
pub extern "C" fn call() {
    let (contract_package, access_token) = storage::create_contract_package_at_hash();

    let entry_points = {
    let mut entry_points = EntryPoints::new();
    let upgradefunction = EntryPoint::new(
        "upgrade_me",
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    );
    entry_points.add_entry_point(upgradefunction);
...
    let mut named_keys = NamedKeys::new();
    named_keys.insert(ACCESS_TOKEN.to_string(), access_token.into());
    named_keys.insert(CONTRACT_PACKAGE.to_string(), storage::new_uref(contract_package).into());
    let (new_contract_hash, _) = storage::add_contract_version(contract_package, entry_points, named_keys);

    runtime::put_key(CONTRACT_NAME, new_contract_hash.into());
    set_key(CONTRACT_PACKAGE, contract_package); // stores contract package hash under account's named key
    set_key(CONTRACT_HASH, new_contract_hash);
}
```

## Step 3. Add new features

Now you are ready to upgrade your contract and add the new features and functions you desire.

```rust
// Using the package hash and our access token, we're able to
// upgrade our contract with new features and new functions
let contract_package: ContractPackageHash = runtime::get_named_arg(ARG_CONTRACT_PACKAGE); // Get the package hash of the first contract
let _access_token: URef = runtime::get_named_arg("accesstoken"); // Our secret access token, defined in the first version

let entry_points = {
let mut entry_points = EntryPoints::new();
let gettext = EntryPoint::new(
    METHOD_SET_TEXT,
    vec![],
    CLType::Unit,
    EntryPointAccess::Public,
    EntryPointType::Contract,
);
entry_points.add_entry_point(gettext);
entry_points
};

// Deploy the new version of the contract and replace the old functions with new one.
let (_, _) = storage::add_contract_version(contract_package.into(), entry_points, Default::deault());
```

The [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html) API will allow you to deploy a new version of your contract.

Remember, it is essential to include the _upgrade_ function and safeguard the access token when you first deploy the contract. You will need the access token for future upgrades.

## External links

-   For more sample code, check out this [contract upgrade example](https://github.com/casper-ecosystem/contract-upgrade-example)
-   The API details for adding a version are in [add_contract_version](https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.add_contract_version.html)
-   Other examples of smart contracts can be found [here](https://github.com/casper-network/casper-node/tree/master/smart_contracts)
