# Key-Value Storage Tutorial

This tutorial covers a simple contract, which creates a key that stores a `CLType` value. This example will show you how to store a _U64_, _string_, _account hash_, or _U512_ value.

The code is available in the [Casper Ecosystem GitHub](https://github.com/casper-ecosystem/kv-storage-contract). Or, you can get started in [GitPod](https://gitpod.io/#https://github.com/casper-ecosystem/kv-storage-contract).

## The Contract

Let's start by understanding the structure of the contract itself. Here we create a contract and name it `kvstorage_contract`. The contract package will be stored under this name on the blockchain. Since the key-value contract is slightly stateless, initialization is not required.

```rust
#[no_mangle]
 pub extern "C" fn store_u64() {
     let name: String = runtime::get_named_arg("name");
     let value: u64 = runtime::get_named_arg("value");
     set_key(name.as_str(), value);
 }

 #[no_mangle]
 pub extern "C" fn store_u512() {
     let name: String = runtime::get_named_arg("name");
     let value: U512 = runtime::get_named_arg("value");
     set_key(name.as_str(), value);
 }

 #[no_mangle]
 pub extern "C" fn store_string() {
     let name: String = runtime::get_named_arg("name");
     let value: String = runtime::get_named_arg("value");
     set_key(name.as_str(), value);
 }

 #[no_mangle]
 pub extern "C" fn store_account_hash() {
     let name: String = runtime::get_named_arg("name");
     let value: AccountHash = runtime::get_named_arg("value");
     set_key(name.as_str(), value);
 }

 #[no_mangle]
 pub extern "C" fn store_bytes() {
     let name: String = runtime::get_named_arg("name");
     let value: Vec<u8> = runtime::get_named_arg("value");
     set_key(name.as_str(), value);
 }

 #[no_mangle]
 pub extern "C" fn call() {
     let (contract_package_hash, _) = storage::create_contract_package_at_hash();
     let mut entry_points = EntryPoints::new();

     entry_points.add_entry_point(EntryPoint::new(
         String::from("store_u64"),
         vec![
             Parameter::new("name", CLType::String),
             Parameter::new("value", CLType::U64),
         ],
         CLType::Unit,
         EntryPointAccess::Public,
         EntryPointType::Contract,
     ));

     entry_points.add_entry_point(EntryPoint::new(
         String::from("store_u512"),
         vec![
             Parameter::new("name", CLType::String),
             Parameter::new("value", CLType::U512),
         ],
         CLType::Unit,
         EntryPointAccess::Public,
         EntryPointType::Contract,
     ));

     entry_points.add_entry_point(EntryPoint::new(
         String::from("store_string"),
         vec![
             Parameter::new("name", CLType::String),
             Parameter::new("value", CLType::String),
         ],
         CLType::Unit,
         EntryPointAccess::Public,
         EntryPointType::Contract,
     ));

     entry_points.add_entry_point(EntryPoint::new(
         String::from("store_account_hash"),
         vec![
             Parameter::new("name", CLType::String),
             Parameter::new("value", AccountHash::cl_type()),
         ],
         CLType::Unit,
         EntryPointAccess::Public,
         EntryPointType::Contract,
     ));

     entry_points.add_entry_point(EntryPoint::new(
         String::from("store_bytes"),
         vec![
             Parameter::new("name", CLType::String),
             Parameter::new("value", CLType::List(Box::new(CLType::U8))),
         ],
         CLType::Unit,
         EntryPointAccess::Public,
         EntryPointType::Contract,
     ));

     let (contract_hash, _) =
         storage::add_contract_version(contract_package_hash, entry_points, Default::default());
     runtime::put_key("kvstorage_contract", contract_hash.into());
     let contract_hash_pack = storage::new_uref(contract_hash);
     runtime::put_key("kvstorage_contract_hash", contract_hash_pack.into())
 }

 fn set_key<T: ToBytes + CLTyped>(name: &str, value: T) {
     match runtime::get_key(name) {
         Some(key) => {
             let key_ref = key.try_into().unwrap_or_revert();
             storage::write(key_ref, value);
         }
         None => {
             let key = storage::new_uref(value).into();
             runtime::put_key(name, key);
         }
     }
 }
```

## Testing the Contract

The Casper Contracts SDK supports local testing of smart contracts. This tutorial will cover how to test the U64 key-value function, which you can adapt for other types.

To test the contract, you need to deploy the contract and store the value on chain. Here is some sample code to accomplish these steps:

```rust
impl KVstorageContract{
   pub fn deploy() -> Self {

       // build the test context with the account for the deploy

        let mut context = TestContextBuilder::new()
            .with_account(TEST_ACCOUNT, U512::from(128_000_000))
            .build();

       // specify the session code & build the deploy
        let session_code = Code::from("contract.wasm");
        let session = SessionBuilder::new(session_code, runtime_args! {})
            .with_address(TEST_ACCOUNT)
            .with_authorization_keys(&[TEST_ACCOUNT])
            .build();
        context.run(session);
        let kvstorage_hash = Self::contract_hash(&context, KV_STORAGE_HASH);
        Self {
            context,
            kvstorage_hash,
        }
    }

    // query the contract hash after the deploy is complete

    pub fn contract_hash(context: &TestContext, name: &str) -> Hash {
        context
            .query(TEST_ACCOUNT, &[name])
            .unwrap_or_else(|_| panic!("{} contract not found", name))
            .into_t()
            .unwrap_or_else(|_| panic!("{} is not a type Contract.", name))
    }

    // store the u_64 value in the global state

    pub fn call_store_u64(&mut self, name: String, value: u64) {
        let code = Code::Hash(self.kvstorage_hash, "store_u64".to_string());
        let args = runtime_args! {
            "name" => name,
            "value" => value,
        };
        let session = SessionBuilder::new(code, args)
            .with_address(TEST_ACCOUNT)
            .with_authorization_keys(&[TEST_ACCOUNT])
            .build();
        self.context.run(session);
    }
}
```

### Write Unit Tests

With these functions in place, it's possible to start writing tests for the contract.

```rust
mod tests {
    #[test]
    fn should_store_u64() {
        const KEY_NAME: &str = "test_u64";
        let mut kv_storage = KVstorageContract::deploy();
        let name = String::from("test_u64");
        let value: u64 = 1;
        kv_storage.call_store_u64(name, value);
        let check: u64 = kv_storage.query_contract(&KEY_NAME).unwrap();
        assert_eq!(value, check);
    }

   // A test to check whether the value is updated
   #[test]
    fn should_update_u64() {
        const KEY_NAME: &str = "testu64";
        let mut kv_storage = KVstorageContract::deploy();
        let original_value: u64 = 1;
        let updated_value: u64 = 2;
        kv_storage.call_store_u64(KEY_NAME.to_string(), original_value);
        kv_storage.call_store_u64(KEY_NAME.to_string(), updated_value);
        let value: u64 = kv_storage.query_contract(&KEY_NAME).unwrap();
        assert_eq!(value, 2);
    }
}
```

### Running Locally

You can run unit tests locally if you have set up the contract using _cargo-casper_ as shown in the [Getting started](https://docs.casperlabs.io/en/latest/dapp-dev-guide/setup-of-rust-contract-sdk.html) guide.

```bash
cargo test -p tests
```

## Deploying to the Testnet and Interacting with the Contract

When working with the testnet, create an account on [Testnet CSPR Live](https://testnet.cspr.live) and fund it using the faucet. Download the private key and use the key to sign the deployment. It's possible to create keys using the rust client as well.

### Deploy the Contract

After compiling the contract, you need to deploy the compiled WASM to the network. This action installs the contract in the blockchain.

The following example shows you how to use the Casper client to retrieve the contract session hash and the block hash where the contract is deployed. The paths for the _secret-key_ and _session-path_ are relative to your system. You need to specify the paths on your machine to run the command.

```bash
casper-client put-deploy
    --chain-name <CHAIN-NAME>
    --node-address http://<HOST>:<PORT>
    --secret-key <PATH>/secretkey.pem
    --session-path  $HOME/kv-storage-contract/target/wasm32-unknown-unknown/release/contract.wasm
    --payment-amount 1000000000000
```

**Query the Account & Get the Contract Hash**

The internal state of the blockchain is updated via a series of steps (blocks). All blockchain queries must include a [_global state hash_ which corresponds to the block hash or height of the blockchain. Visit [Querying the address of a contract](https://docs.casperlabs.io/en/latest/dapp-dev-guide/calling-contracts.html#querying-global-state-for-the-address-of-a-contract).

**Invoke an Entry Point & Set a value**

Once the contract is deployed, you can create another deploy, which calls one of the entry points within the contract. You must know the entry point's name or the session hash retrieved in the previous step to call an entry point. The command below shows you how to do this. The _session-path_ is relative to your system. Specify the path on your machine and then run the command.

The kv-client has four distinct commands to set key-values for U64, string, U512, and account hash. In this example, we will use a String.

```bash
casper-client put-deploy
    --session-name kvstorage_contract
    --session-entry-point store-string
    --session-arg=name:"string=`test`"
    --payment-amount 100000000000
    --chain-name <CHAIN-NAME>
    --node-address http://<HOST>:<PORT>
    --secret-key <PATH>/secretkey.pem
```

If the deploy works, a you will see a similar response:

```bash
{"api_version":"1.0.0","deploy_hash":"8c3068850354c2788c1664ac6a275ee575c8823676b4308851b7b3e1fe4e3dcc"}
```

### Query the Contract On Chain

Contracts can be executed under different contexts. In this example, when the contract is deployed, it runs in the context of a `Contract` and not a `Session`. This means that all stored keys are not stored under the account hash, but within the context of the contract. Therefore, when we query to retrieve the value under a key, we are querying `AccountHash/kvstorage_contract/<key-name>` and not just `AccountHash/<key-name>`.

It would be best if you first found the block hash for the block that contains your deploy. Once you have the requisite block hash, you can use the Casper client to retrieve the session hash.

Reading a value is simple; we obtain the block hash under which the value is stored, and then using that block hash, we use the `query-state` command to retrieve the value stored under a named key.

An example global state query looks like this:

```bash
casper-client query-state --node-address http://<HOST>:<PORT> -k <PUBLIC_KEY_AS_HEX> -g GLOBAL_STATE_HASH | jq -r
```

Please reference the [Querying Section](https://docs.casperlabs.io/en/latest/dapp-dev-guide/calling-contracts.html#querying-global-state-for-the-address-of-a-contract) for more details.
