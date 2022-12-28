# Two-Party Multi-Signature Deploys

[Accounts](/design/casper-design.md/#accounts-head) on a Casper Network can associate other accounts to allow or require a multiple signature scheme for deploys.

This workflow describes how a trivial two-party multi-signature scheme for signing and sending deploys can be enforced for an account on a Casper Network.

This workflow assumes:

1.  You meet the [prerequisites](setup.md)
2.  You are using the Casper command-line client
3.  You have a main `PublicKey` hex (**MA**) and a `PublicKey` hex to associate (**AA**)
4.  You have a valid `node-address`
5.  You have previously [deployed a smart contract](/dapp-dev-guide/building-dapps/sending-deploys.md) to a Casper Network

## Configuring the Main Account {#configuring-the-main-account}

**CAUTION**: Incorrect account configurations could render accounts defunct and unusable. It is highly recommended to first execute any changes to an account in a test environment like Testnet, before performing them in a live environment like Mainnet.

Each account has an `associated_keys` field which is a list containing the account address and its weight for every associated account. Accounts can be associated by adding the account address to the `associated_keys` field.

An account on a Casper Network assigns weights to keys associated with it. For a single key to sign a deploy or edit the state of the account, its weight must be greater than or equal to a set threshold. The thresholds are labeled as the `action_thresholds` for the account.

Each account within a Casper Network has two action thresholds that manage the permissions to send deploys or manage the account. Each threshold defines the minimum weight that a single key or a combination of keys must have, to either:

1.  Send a deploy to the network; determined by the `deployment` threshold
2.  Edit the `associated keys` and the `action_thresholds`; determined by the `key_management` threshold

To enforce the multi-signature (multi-sig) feature for an account on a Casper Network, the _main key_ and _associated key_'s combined weight must be greater than or equal to the `deployment` threshold. This can be achieved by having each key's weight equal to half of the `deployment` threshold.

## Code Description {#code-description}

You can run session code that will execute within the context of your main account. Below is the code that will be compiled to Wasm and then sent to the network as part of a deploy.

**Note**: The following contract example will set up a specific account configuration and is not a general-purpose contract.

```rust
#![no_main]
use casper_contract::{
    contract_api::{account, runtime},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::account::{AccountHash, ActionType, Weight};

const ASSOCIATED_ACCOUNT: &str = "deployment-account";

#[no_mangle]
pub extern "C" fn call() {
    // Account hash for the account to be associated.
    let deployment_account: AccountHash = runtime::get_named_arg(ASSOCIATED_ACCOUNT);

    // Add the CA key to half the deployment threshold (i.e 1)
    account::add_associated_key(deployment_account, Weight::new(1)).unwrap_or_revert();

    // Deployment threshold <= Key management threshold.
    // Therefore update the key management threshold value.
    account::set_action_threshold(ActionType::KeyManagement, Weight::new(2)).unwrap_or_revert();

    // Set the deployment threshold to 2, enforcing multi-sig to send deploys.
    account::set_action_threshold(ActionType::Deployment, Weight::new(2)).unwrap_or_revert();
}
```

The contract will execute **2 crucial steps** to enforce the multi-sig scheme for your main account:

1.  Add the associated key **AA** to the account
2.  Raise the `deployment` threshold to `2`, such that the weight required to send a deploy is split equally between the keys associated with the account

The action thresholds for deploys cannot be greater than the action threshold for key management. By default, action thresholds are set to `1`.

## Code Execution {#code-execution}

The state of the account can be altered by sending a deploy which executes the Wasm that will associate the **AA** account address.

For this guide, a smart contract has been written and is stored in its [Github Repository](https://github.com/casper-ecosystem/two-party-multi-sig). The repository contains a _Makefile_ with the build commands necessary to compile the contract to generate the necessary Wasm.

```bash
git clone https://github.com/casper-ecosystem/two-party-multi-sig
cd two-party-multi-sig
```

To build the contract, run the following command:

```bash
make build-contract
```

The compiled Wasm will be saved on this path:

    target/wasm32-unknown-unknown/release/contract.wasm

The Casper command-line client can be used to send the compiled Wasm to the network for execution.

```bash
casper-client put-deploy \
--node-address http://<peer-ip-address>:7777 \
--secret-key <secret-key-MA>.pem \
--chain-name casper-test \
--payment-amount 2500000000 \
--session-path <path-to-contract-wasm> \
--session-arg "deployment-account:account_hash='account-hash-<hash-AA>'"
```

1.  `node-address` - An IP address of a node on the network
2.  `secret-key` - The file name containing the secret key of the Main Account
3.  `chain-name` - The chain-name to the network where you wish to send the deploy (this example uses the Testnet)
4.  `payment-amount` - The cost of the deploy
5.  `session-path` - The path to the contract Wasm
6.  `session-arg` - The contract takes the account hash of the Associated account as an argument labeled `deployment-account`. You can pass this argument using the `--session-arg` flag in the command line client

**Important response fields:**

-   `"result"."deploy_hash"` - the address of the executed deploy, needed to look up additional information about the transfer

**Note**: Save the returned `deploy_hash` from the output to query information about execution status.

### Confirming Execution and Account Status {#confirming-execution-and-account-status}

Account configuration on a Casper blockchain is stored in a [Merkle Tree](../glossary/M.md#merkle-tree) and is a snapshot of the blockchain's [Global State](../design/casper-design.md/#global-state-head). The representation of global state for a given block can be computed by executing the deploys (including transfers) within the block and its ancestors. The root node of the Merkle Tree identifying a particular state is called the `state-root-hash` and is stored in every executed block.

To check that your account was configured correctly, you need the `state-root-hash` corresponding to the block that contains your deploy. To obtain the `state-root-hash`, you need to:

1.  [Confirm the execution status of the deploy](querying.md#querying-deploys) and obtain the hash of the block containing it
2.  [Query the block containing the deploy](querying.md#querying-blocks) to obtain the corresponding `state_root_hash`

Use the `state_root_hash` and the `hex-encoded-public-key` of the main account to query the network for the account and check its configuration.

```bash
casper-client query-global-state \
--node-address http://<peer-ip-address>:7777 \
--state-root-hash <state-root-hash-from-block> \
--key <hex-encoded-public-key-MA>
```

**Example Output**

```json
{
    "id": 1126043166167626077,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "merkle_proof": "2226 chars",
        "stored_value": {
            "Account": {
                "account_hash": "account-hash-dc88a1819381c5ebbc3432e5c1d94df18cdcd7253b85259eeebe0ec8661bb84a",
                "action_thresholds": {
                    "deployment": 2,
                    "key_management": 2
                },
                "associated_keys": [
                    {
                        "account_hash": "account-hash-12dee9fe535bfd8fd335fce1ba1f972f26bb60029a303b310d85419357d18f51",
                        "weight": 1
                    },
                    {
                        "account_hash": "account-hash-dc88a1819381c5ebbc3432e5c1d94df18cdcd7253b85259eeebe0ec8661bb84a",
                        "weight": 1
                    }
                ],
                "main_purse": "uref-74b20e9722d3f087f9dc431e9f0fcc6a803c256e005fa45b64a101512001cb78-007",
                "named_keys": []
            }
        }
    }
}
```

In the above example, you can see the account addresses listed within the `associated_keys` section. Each key has a weight of `1`, since the action threshold for `deployment` is set to `2`, neither account is able to sign and send a deploy individually. Thus to send the deploy from the Main account, the deploy needs to be signed by the secret keys of each account to reach the required threshold.

Details about various scenarios in which multiple associated keys can be setup is discussed in [the examples section of the Multi-Signature Tutorial](/dapp-dev-guide/tutorials/multi-sig/additional.md).
