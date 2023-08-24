---
title: Authorization Keys
---

# Working with Authorization Keys

:::caution

These examples should not be used in a production environment. They are intended only for teaching and must be tested and adapted for production use.

:::

This tutorial demonstrates retrieving and using the authorization keys associated with a deploy using the [list_authorization_keys](https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.list_authorization_keys.html) function.

```rust
let authorization_keys = runtime::list_authorization_keys();
```

Remember that authorization keys are listed under a Deploy's [approvals](../../concepts/serialization-standard.md#serialization-standard-deploy) section, which lists the signatures and the public keys of the signers, also called authorizing keys. Here is an example of a deploy's approvals:

```json
"approvals": [
    {
      "signer": "02021a4da3d6f32ea3ebd2519e1a37a1b811671085bf4f1cf2a36b931344a99b756a",
      "signature": "02df8cdf0bff3bd93e831d24563d5acbefa0ed13814550e910d03208d5fb3c11770dd3d918784ec84342e53666eacf59aeecbf4ce0cdd60e167c4a4b20e4b8f481"
    }
]
```

The contract code in this example retrieves the set of authorization keys for a given deploy by calling the `runtime::list_authorization_keys` function. In other words, `list_authorization_keys` returns the set of account hashes representing the keys used to sign a deploy. Upon installation, the contract code stores the authorization keys for the installer deploy into a NamedKey. The contract also contains an entry point that returns the intersection of the caller deploy's, and installer deploy's authorization keys. The tests in this repository verify different scenarios and check the resulting intersection. 

## Prerequisites

- You meet the [development prerequisites](../../developers/prerequisites.md) and are familiar with [writing and testing on-chain code](../../developers/writing-onchain-code/index.md)
- You know how to [send and verify deploys](../../developers/cli/sending-deploys.md)
- You are familiar with these concepts:
   - [Casper Accounts](../../concepts/serialization-standard.md#serialization-standard-account) 
   - [Deploys](../../concepts/serialization-standard.md#serialization-standard-deploy)
   - [Associated Keys](../../concepts/serialization-standard.md#associatedkey)
   - [Approvals](../../concepts/serialization-standard.md#approval), also known as authorization keys


## Workflow

To start, clone the [tutorials-example-wasm](https://github.com/casper-ecosystem/tutorials-example-wasm) repository. Then, open the `authorization-keys-example` directory, prepare your Rust environment, and build the tests with the following commands.

```bash
git clone https://github.com/casper-ecosystem/tutorials-example-wasm
cd tutorials-example-wasm/authorization-keys-example
make prepare
make test
```

Review the repository's structure:
- [client](https://github.com/casper-ecosystem/tutorials-example-wasm/tree/dev/authorization-keys-example/client) - A client folder containing two Wasm files
   - `add_keys.wasm` - Session code that adds an associated key to the calling account
   - `contract_call.wasm` - Session code that calls the contract's entry point and stores the result into a named key
- [contract](https://github.com/casper-ecosystem/tutorials-example-wasm/tree/dev/authorization-keys-example/contract) - A simple contract that demonstrates the usage of authorization keys and compiles into a `contract.wasm` file
- [tests](https://github.com/casper-ecosystem/tutorials-example-wasm/tree/dev/authorization-keys-example/tests) - Tests and supporting utilities to verify and demonstrate the contract's expected behavior

:::note

This tutorial highlights certain lines of code found in [GitHub](https://github.com/casper-ecosystem/tutorials-example-wasm/tree/dev/authorization-keys-example).

:::


### The example contract

Upon [installation](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/contract/src/main.rs#L75), the contract in this example stores the authorization keys that signed the installer deploy into a named key.

```rust
#[no_mangle]
pub extern "C" fn init() {
    if runtime::get_key(AUTHORIZATION_KEYS_INSTALLER).is_none() {
        let authorization_keys: Vec<AccountHash> =
            runtime::list_authorization_keys().iter().cloned().collect();

        let authorization_keys: Key = storage::new_uref(authorization_keys).into();
        runtime::put_key(AUTHORIZATION_KEYS_INSTALLER, authorization_keys);
    }
}
```

The contract contains an entry point that returns the intersection of the caller deploy's authorization keys and the installer deploy's authorization keys saved during contract installation. The following [usage](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/contract/src/main.rs#L52) of `runtime::list_authorization_keys` retrieves the set of account hashes representing the keys signing the caller deploy.

```rust
let authorization_keys_caller: Vec<AccountHash> =
    runtime::list_authorization_keys().iter().cloned().collect();
```


### Client Wasm files

#### `add_keys.wasm` 

This file contains session code that adds an associated key to the calling account. For more details and a similar example, visit the [Two-Party Multi-Signature](./two-party-multi-sig.md) tutorial.

#### `contract_call.wasm`

This session code calls the contract's entry point, which returns the intersection between two sets of keys:
- The authorization keys that signed the deploy that installed the contract (referred to in this tutorial as the installer deploy)
- The authorization keys that signed the deploy calling the entry point (referred to in this tutorial as the caller deploy).

The intersection result is a list stored under a named key of the account calling the `contract_call.wasm`.

```rust
let key_name: String = runtime::get_named_arg(ARG_KEY_NAME);
let intersection =
    runtime::call_contract::<Vec<AccountHash>>(contract_hash, ENTRY_POINT, runtime_args! {});
runtime::put_key(&key_name, storage::new_uref(intersection).into());
}
```


### Testing this example

This section highlights the tests written for this example, demonstrating the usage of authorization keys. The tests are divided into three parts:
* Testing the contract installation
* Testing the contract's unique entry point
* Testing the entry point using a client contract call

These tests focus on testing the contract installation.


#### Test 1: `should_allow_install_contract_with_default_account`

| Installer deploy authorization keys | Expected outcome |
|---|---|
| `DEFAULT_ACCOUNT_ADDR` |  Successful contract installation |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L28) signs the installer deploy with an authorization key `DEFAULT_ACCOUNT_ADDR` that belongs to the calling accounts's associated keys. In other words, since the caller is the default account, `DEFAULT_ACCOUNT_ADDR` can be used to sign the deploy.

```rust
let session_code = PathBuf::from(CONTRACT_WASM);
let session_args = RuntimeArgs::new();

let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, session_args)
    .build();

```


#### Test 2: `should_disallow_install_with_non_added_authorization_key`

| Installer deploy authorization keys | Expected outcome |
|---|---|
| `DEFAULT_ACCOUNT_ADDR`, `account_addr_1` | Failed contract installation |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L57) tries to sign the installer deploy with an authorization key that is not part of the caller's associated keys. This is not allowed because the authorization keys used to sign a deploy need to be a subset of the caller's associated keys. So, the installer deploy fails as expected.

```rust
let session_code = PathBuf::from(CONTRACT_WASM);
let session_args = RuntimeArgs::new();

let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR, account_addr_1])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, session_args)
    .build();

let execute_request = ExecuteRequestBuilder::from_deploy_item(deploy_item).build();
builder.exec(execute_request).commit().expect_failure();
let error = builder.get_error().expect("must have error");
assert_eq!(error.to_string(), "Authorization failure: not authorized.");
```


#### Test 3: `should_allow_install_with_added_authorization_key`

| Installer deploy authorization keys | Expected outcome |
|---|---|
| `DEFAULT_ACCOUNT_ADDR`, `account_addr_1` |  Successful contract installation |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L83) demonstrates a successful installer deploy using an added authorization key. After the initial test framework setup, the test calls session code to add the associated account `account_addr_1` to the default account's associated keys.

```rust
// Add account_addr_1 to the default account's associated keys
let session_code = PathBuf::from(ADD_KEYS_WASM);
let session_args = runtime_args! {
    ASSOCIATED_ACCOUNT => account_addr_1
};

let add_keys_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, session_args)
    .build();

let add_keys_execute_request =
    ExecuteRequestBuilder::from_deploy_item(add_keys_deploy_item).build();

builder
    .exec(add_keys_execute_request)
    .commit()
    .expect_success();
```

Since the deploy threshold is now 2, the installer deploy is signed with the default account hash and with `account_addr_1`. See [GitHub](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L191).

```rust
let session_code = PathBuf::from(CONTRACT_WASM);

let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR, account_addr_1])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, session_args)
    .build();

let execute_request = ExecuteRequestBuilder::from_deploy_item(deploy_item).build();
builder.exec(execute_request).commit().expect_success();
```

The next tests exercise the contract's unique entry point to calculate the intersection between the caller deploy's authorization keys and the installer deploy's authorization keys.

#### Test 4: `should_allow_entry_point_with_installer_authorization_key` 

| Installer deploy authorization keys | Caller deploy authorization keys | Intersection returned by the entry point|
|---|---|---|
| `DEFAULT_ACCOUNT_ADDR` | `account_addr_1`, `DEFAULT_ACCOUNT_ADDR` | `account_addr_1` |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L144) builds upon the previous test, which adds an associated account to the default account's associated keys and installs the contract using these two keys. Additionally, on line 201, the test invokes the contract's entry point using a deploy that runs under `ACCOUNT_USER_1` signed only with `account_addr_1`. This is possible because the deploy action threshold for `ACCOUNT_USER_1` is 1 as you can see [here](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L201).

```rust
let contract_hash = builder
    .get_expected_account(*DEFAULT_ACCOUNT_ADDR)
    .named_keys()
    .get(CONTRACT_HASH)
    .expect("must have this entry in named keys")
    .into_hash()
    .map(ContractHash::new)
    .unwrap();

let entry_point_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[account_addr_1])
    .with_address(account_addr_1)
    .with_stored_session_hash(contract_hash, ENTRYPOINT, runtime_args! {})
    .build();

let entry_point_request =
    ExecuteRequestBuilder::from_deploy_item(entry_point_deploy_item).build();

builder.exec(entry_point_request).expect_success().commit();
```

The entry point returns the intersection of the caller deploy's authorization keys and the installer deploy's authorization keys. The intersection is a list containing the key `account_addr_1`. Thus, the caller deploy is expected to succeed and return a result.


#### Test 5: `should_allow_entry_point_with_account_authorization_key`

| Installer deploy authorization keys | Caller deploy authorization keys | Intersection returned by the entry point|
|---|---|---|
| `DEFAULT_ACCOUNT_ADDR` | `account_addr_1`, `DEFAULT_ACCOUNT_ADDR` | `DEFAULT_ACCOUNT_ADDR` |

This is the [main test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L224) in this example repository. After installing the contract using the default account, the test adds the default account hash to `ACCOUNT_USER_1` as an associated key. 

```rust
let session_code = PathBuf::from(ADD_KEYS_WASM);
let session_args = runtime_args! {
    ASSOCIATED_ACCOUNT => *DEFAULT_ACCOUNT_ADDR
};

let add_keys_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[account_addr_1])
    .with_address(account_addr_1)
    .with_session_code(session_code, session_args)
    .build();
```

Then, the test creates a deploy to invoke the contract's entry point. This deploy executes under `ACCOUNT_USER_1` and has two authorization keys, `account_addr_1` and the default account hash. Note that both authorization keys must sign the deploy to meet the deploy's action threshold, which is set to 2. The deploy should be executed successfully because the resulting intersection should contain the default account hash.

```rust
let entry_point_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[account_addr_1, *DEFAULT_ACCOUNT_ADDR])
    .with_address(account_addr_1)
    .with_stored_session_hash(contract_hash, ENTRYPOINT, runtime_args! {})
    .build();

let entry_point_request =
    ExecuteRequestBuilder::from_deploy_item(entry_point_deploy_item).build();

builder.exec(entry_point_request).expect_success().commit();
```


#### Test 6: `should_disallow_entry_point_without_authorization_key`

| Installer deploy authorization keys | Caller deploy authorization keys | Intersection returned by the entry point|
|---|---|---|
| `DEFAULT_ACCOUNT_ADDR` | `account_addr_2` | None |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L304) verifies that the entry point returns an error when there is no intersection between the caller deploy's authorization keys and the installer deploy's authorization keys. 

The default account hash is used to sign the installer deploy.

```rust
let session_code = PathBuf::from(CONTRACT_WASM);

let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, runtime_args! {})
    .build();
```

In the test, a new account, `ACCOUNT_USER_2`, creates a deploy invoking the contract's entry point and signs the deploy with `account_addr_2`. When calling the entry point, an error is returned because the caller and the installer deploys do not have any authorization keys in common.

```rust
    // Here ACCOUNT_USER_2 does not have DEFAULT_ACCOUNT_ADDR (from the contract installer) in its associated keys
    // The deploy will therefore revert with PermissionDenied
    let entry_point_deploy_item = DeployItemBuilder::new()
        .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
        .with_authorization_keys(&[account_addr_2])
        .with_address(account_addr_2)
        .with_stored_session_hash(contract_hash, ENTRYPOINT, runtime_args! {})
        .build();

    let entry_point_request =
        ExecuteRequestBuilder::from_deploy_item(entry_point_deploy_item).build();

    builder.exec(entry_point_request).commit().expect_failure();
    let error = builder.get_error().expect("must have User error: 0");
    assert_expected_error(
        error,
        0,
        "should fail execution since DEFAULT_ACCOUNT_ADDR is not in ACCOUNT_USER_2 associated keys",
    );
```


The following tests exercise the entry point using a [contract call](#contract_callwasm) and verifying the result returned.

#### Test 7: `should_allow_entry_point_through_contract_call_with_authorization_key`

| Installer deploy authorization keys | Caller deploy authorization keys | Intersection returned by the entry point|
|---|---|---|
| `DEFAULT_ACCOUNT_ADDR` | `account_addr_1`, `DEFAULT_ACCOUNT_ADDR` | `DEFAULT_ACCOUNT_ADDR` |

This [test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L403) validates the contract's entry point using a client contract call. The contract is installed using the default account hash in the deploy's authorization keys.

```rust
let session_code = PathBuf::from(CONTRACT_WASM);

let deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[*DEFAULT_ACCOUNT_ADDR])
    .with_address(*DEFAULT_ACCOUNT_ADDR)
    .with_session_code(session_code, runtime_args! {})
    .build();
```

The caller deploy is signed by `account_addr_1` and `DEFAULT_ACCOUNT_ADDR`:

```rust
let entry_point_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[account_addr_1, *DEFAULT_ACCOUNT_ADDR])
    .with_address(account_addr_1)
    .with_session_code(session_code, session_args)
    .build();

let entry_point_request =
    ExecuteRequestBuilder::from_deploy_item(entry_point_deploy_item).build();
builder.exec(entry_point_request).expect_success().commit();
```

The test then verifies that the result returned was saved in the named keys for `ACCOUNT_USER_1`, containing the default account hash.

```rust
let intersection_receipt: Key = *builder
    .get_expected_account(account_addr_1)
    .named_keys()
    .get(INTERSECTION_RECEIPT)
    .expect("must have this entry in named keys");

let actual_intersection = builder
    .query(None, intersection_receipt, &[])
    .expect("must have stored_value")
    .as_cl_value()
    .map(|intersection_cl_value| {
        CLValue::into_t::<Vec<AccountHash>>(intersection_cl_value.clone())
    })
    .unwrap()
    .unwrap();

let expected_intersection = vec![*DEFAULT_ACCOUNT_ADDR];

assert_eq!(actual_intersection, expected_intersection);
```


#### Test 8: `should_disallow_entry_point_through_contract_call_without_authorization_key`

| Installer deploy authorization keys | Caller deploy authorization keys | Intersection returned by the entry point|
|---|---|---|
| `DEFAULT_ACCOUNT_ADDR` | `account_addr_1`, `account_addr_2` | None |

The [final test](https://github.com/casper-ecosystem/tutorials-example-wasm/blob/6810ac3d6d65e252770561ddac9b33bf40aadc03/authorization-keys-example/tests/src/integration_tests.rs#L509) in this tutorial checks that when there is no intersection between the caller deploy's authorization keys (`account_addr_1`, `account_addr_2`) and the installer deploy's authorization keys (`DEFAULT_ACCOUNT_ADDR`), the entry point returns an error.

```rust
 let session_code = PathBuf::from(CONTRACT_CALL_WASM);

let session_args = runtime_args! {
    ARG_CONTRACT_HASH => Key::from(contract_hash),
    ARG_KEY_NAME => INTERSECTION_RECEIPT
};

// account_addr_2 as an associated key is not among the default account's associated keys
// The deploy will therefore revert with PermissionDenied
let entry_point_deploy_item = DeployItemBuilder::new()
    .with_empty_payment_bytes(runtime_args! {ARG_AMOUNT => *DEFAULT_PAYMENT})
    .with_authorization_keys(&[account_addr_1, account_addr_2])
    .with_address(account_addr_1)
    .with_session_code(session_code, session_args)
    .build();

let entry_point_request =
    ExecuteRequestBuilder::from_deploy_item(entry_point_deploy_item).build();

builder.exec(entry_point_request).commit().expect_failure();

let error = builder.get_error().expect("must have User error: 0");
assert_expected_error(
    error,
    0,
    "should fail execution since ACCOUNT_USER_2 as associated key is not in installer (DEFAULT_ACCOUNT_ADDR) associated keys",
);
```
