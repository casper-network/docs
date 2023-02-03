# Two-Party Multi-Signature Deploys

[Accounts](/design/casper-design.md/#accounts-head) on a Casper network can associate other accounts to allow or require a multiple-signature scheme for deploys.

This workflow describes how a trivial two-party multi-signature scheme for signing and sending deploys can be enforced for an account on a Casper network. This workflow assumes:

1. You meet the [prerequisites](/dapp-dev-guide/setup.md), including having the Casper command-line client and a valid node address
2. You have the main account's `PublicKey` hex (**MA**) and another `PublicKey` hex to associate (**AA**)
3.  You have previously [sent deploys](/dapp-dev-guide/building-dapps/sending-deploys.md) to a Casper network

## Configuring the Main Account {#configuring-the-main-account}

**CAUTION**: Incorrect account configurations could render accounts defunct and unusable. We highly recommend executing any changes to an account in a test environment like Testnet before performing them in a live environment like Mainnet.

Each Account has an `associated_keys` field, which is a list containing account hashes and their corresponding weights. Accounts can be associated by adding the account hash to the `associated_keys` field.

An Account on a Casper network assigns weights to keys associated with it. For a single key to sign a deploy, or edit the state of the account, its weight must be greater than or equal to a set threshold. The thresholds are labeled as the `action_thresholds` for the account.

Each account within a Casper network has two action thresholds that manage the permissions to send deploys or manage the account. Each threshold defines the minimum weight that a single key or a combination of keys must have to either:

1. Send a deploy to the network; determined by the `deployment` threshold
2. Edit the `associated keys` and the `action_thresholds`; determined by the `key_management` threshold

To enforce the multi-signature (multi-sig) feature for an account on a Casper network, the _main key_ and _associated key_'s combined weight must be greater than or equal to the `deployment` threshold. This can be achieved by having each key's weight equal to half of the `deployment` threshold.

### Running session code to set up associated keys

To set up the associated keys for an Account, you must run session code that executes within the account's context. You will find an example of such session code on [GitHub](https://github.com/casper-ecosystem/two-party-multi-sig/). Note that this session code is not a general-purpose program and needs to be modified for each use case.

```bash
git clone https://github.com/casper-ecosystem/two-party-multi-sig
```

The [session code](https://github.com/casper-ecosystem/two-party-multi-sig/blob/main/contract/src/main.rs) executes **3 crucial steps** to enforce the multi-sig scheme for the main account:

1. Adds an associated key to the account; we will refer to this key as **AA**
2. Raises the `action` threshold to `2`, because action thresholds for deploys cannot be greater than the action threshold for key management. By default, all action thresholds are set to `1`
3. Raises the `deployment` threshold to `2`, such that the weight required to send a deploy is split equally between the keys associated with the account

The repository contains a _Makefile_ with the build commands necessary to compile the contract and generate the necessary Wasm.

```bash
cd two-party-multi-sig
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

1. `node-address` - An IP address of a node on the network
2. `secret-key` - The file name containing the secret key of the main account
3. `chain-name` - The chain-name to the network where you wish to send the deploy (this example uses the Testnet)
4. `payment-amount` - The cost of the deploy
5. `session-path` - The path to the contract Wasm
6. `session-arg` - The contract takes the account hash of the associated account as an argument labeled `deployment-account`. You can pass this argument using the `--session-arg` flag in the command line client

**Important response fields:**

-   `"result"."deploy_hash"` - the address of the executed deploy, needed to look up additional information about the transfer

**Note**: Save the returned `deploy_hash` from the output to query information about execution status.

### Confirming Processing and Account Status {#confirming-execution-and-account-status}

Account configuration on a Casper blockchain is stored in a [Merkle Tree](../glossary/M.md#merkle-tree) and is a snapshot of the blockchain's [Global State](../design/casper-design.md/#global-state-head). The representation of global state for a given block can be computed by executing the deploys (including transfers) within the block and its ancestors. The root node of the Merkle Tree identifying a particular state is called the `state-root-hash` and is stored in every executed block.

To check that the account was configured correctly, you need the `state-root-hash` corresponding to the block that contains your deploy. To obtain the `state-root-hash`, you need to:

1.  [Confirm the execution status of the deploy](querying.md#querying-deploys) and obtain the hash of the block containing it
2.  [Query the block containing the deploy](querying.md#querying-blocks) to obtain the corresponding `state_root_hash`

Using the `state_root_hash` and the `hex-encoded-public-key` of the main account, query the network and check the account's configuration.

```bash
casper-client query-global-state \
--node-address http://<peer-ip-address>:7777 \
--state-root-hash <state-root-hash-from-block> \
--key <hex-encoded-public-key-MA>
```

<details>
<summary>Example output</summary>

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
</details>

In the example output, you can see the account hashes listed within the `associated_keys` section. Each key has weight `1`; since the action threshold for `deployment` is `2`, neither account can sign and send a deploy individually. Thus, the deploy needs to be signed by the secret keys of each account to reach the required threshold.
