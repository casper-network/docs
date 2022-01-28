# Calling Contracts

The most efficient way to use blockchain is to store (install) your contract on the system and then call it. This section outlines the steps to do this.

## Installing a Smart Contract {#installing-a-smart-contract}

First, set up the contract name so you can call it using the name in subsequent deploys. The following code sample uses `sample_contract` as the contract name.

```rust
let contract_hash = storage::add_contract_version(contract_package_hash,
                                                  entry_points,
                                                  Default::default());
runtime::put_key("sample_contract", contract_hash.into());

runtime::call_contract::<()>(contract_hash, "store_hello_world", {
   let mut named_args = RuntimeArgs::new();
   named_args.insert("s", s);
   named_args.insert("a", a);
   named_args
});
```

Next, deploy the smart contract using the `put-deploy` command and send in the compiled wasm as `--session code`.

## Querying Global State for the Address of a Contract {#querying-global-state-for-the-address-of-a-contract}

The `query-global-state` command is a generic query against [global state](https://docs.casperlabs.io/en/latest/glossary/G.html#global-state). Earlier, we queried global state for the account's main purse. Here, we query the state of a contract. We can do so by including the contract address rather than the account public key in the `query-global-state` command.

Here we query to get the address of an ERC20 contract from Global State.

### Step 1: Get the Latest Global State Hash {#step-1-get-the-latest-global-state-hash}

We need to obtain the global state hash after our contract has been deployed to the network.

```bash
casper-client get-state-root-hash --node-address http://NODE:PORT | jq -r
```

### Step 2: Query State {#step-2-query-global-state}

Take the global state hash from Step 1 and include it here, along with the account public key that created the contract.

```bash
casper-client query-global-state --node-address http://NODE:PORT -k <PUBLIC KEY IN  HEX> -s <STATE_ROOT_HASH>
```

### Example Result {#example-result}

If there is a contract stored in an account, it will appear under `named-keys`.

```bash
casper-client query-global-state --node-address http://localhost:7777 -k 016af0262f67aa93a225d9d57451023416e62aaa8391be8e1c09b8adbdef9ac19d -s 0c3aaf547a55dd500c6c9bbd42bae45e97218f70a45fee6bf8ab04a89ccb9adb |jq -r
{
  "api_version": "1.0.0",
  "stored_value": {
    "Account": {
      "account_hash": "804af75bc8161e1ec4189e7d4441eb1bf1047ff6fc13b1d71026f34c5f96f937",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 1
      },
      "associated_keys": [
        {
          "account_hash": "804af75bc8161e1ec4189e7d4441eb1bf1047ff6fc13b1d71026f34c5f96f937",
          "weight": 1
        }
      ],
      "main_purse": "uref-439d5326bf89bd34d3b2c924b3af2f5e233298b473d5bd8b54fab61ccef6c003-007",
      "named_keys": {
        "ERC20": "hash-d527103687bfe3188caf02f1e487bfb8f60bfc01068921f7db24db72a313cedb",
        "ERC20_hash": "uref-80d9d36d628535f0bc45ae4d28b0228f9e07f250c3e85a85176dba3fc76371ce-007",

      }
    }
  }
}
```

#### Step 3: Query the contract State {#step-3-query-the-contract-state}

Now that we have the hash of the contract, we can query the contract's internal state. To do this, we pass in the contract's hash and the global state hash. If we look at the ERC20 contract, we see a token name specified as `_name`. We can query for the value stored here.

```bash
casper-client query-global-state --node-address http://localhost:7777 -k hash-d527103687bfe3188caf02f1e487bfb8f60bfc01068921f7db24db72a313cedb -s 0c3aaf547a55dd500c6c9bbd42bae45e97218f70a45fee6bf8ab04a89ccb9adb -q _name | jq -r
```

And we should see something like this:

```bash
{
  "api_version": "1.0.0",
  "stored_value": {
    "CLValue": {
      "bytes": "0b000000e280984d65646861e28099",
      "cl_type": "String"
    }
  }
}
```

**Note**: This result is returned as bytes. These bytes need to be deserialized into the correct CLType in a smart contract or a dApp. Refer to [casper-types](https://docs.rs/casper-types/latest/casper_types/bytesrepr/index.html) to find the latest APIs for deserialization.

## Calling a Contract by Name & Entry Point {#calling-a-contract-by-name--entry-point}

To call a contract by its name, run the `put-deploy` command using the `session-name` option:

```bash
casper-client put-deploy --session-name <NAME> --session-entry-point <FUNCTION_NAME>
```

It is possible to create entry points in the contract, which you can invoke while the contract lives on the blockchain. The following code shows you an example entry point:

```rust
#[no_mangle]
pub extern "C" fn store_u64() {
   read_and_store::<u64>();
}

fn read_and_store<T: CLTyped + FromBytes + ToBytes>() {
   let name: String = runtime::get_named_arg("name");
   let value: T = runtime::get_named_arg("value");
   set_key(name.as_str(), value);
}
```

## Calling a Contract by Hash and Entry Point {#calling-a-contract-by-hash-and-entry-point}

After deploying a contract and querying the global state, you can use a contract's hash to call it in a new deploy. An entry point is required when calling a contract by its hash.

```bash
casper-client put-deploy  --session-hash <HEX STRING> --session-entry-point <FUNCTION_NAME>
```
