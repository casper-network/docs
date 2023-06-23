# Key Management Workflow

The purpose of this tutorial is to provide an example of how to integrate key management on Casper accounts. This guide assumes previous completion of the [Two-Party Multi-Signature Deploys](https://docs.casper.network/resources/tutorials/advanced/two-party-multi-sig/) tutorial, among other prerequisites. You will also need the Casper CLI client to interact with the network.

:::warning

The session code provided in this tutorial should not be used in a production environment.

Incorrect account configurations could render accounts defunct and unusable, thus losing access to all the corresponding CSPR.

Test any changes to an account in a test environment like Testnet before performing changes in a live environment like Mainnet.

:::


## Prerequisites

You must meet the following prerequisites before starting this tutorial:

1. Set up all the prerequisites listed [here](../../../developers/prerequisites.md), including a funded [Account](../../../developers/prerequisites.md#setting-up-an-account) and the [Casper CLI client](../../../developers/prerequisites.md#the-casper-command-line-client)
2. Complete the [Two-Party Multi-Signature Deploys](../../../resources/tutorials/advanced/two-party-multi-sig.md) workflow and set up the source account for multi-signature deploys
3. Learn how to use the `make-deploy` and `send-deploy` Casper CLI client commands as outlined in [Transferring Tokens using a Multi-Sig Deploy](../../../developers/cli/transfers/multisig-deploy-transfer.md)
4. Understand the Casper [account-based model](../../../concepts/design/casper-design.md#accounts-head) before proceeding


## Session Code Required for Key Management

To manage the associated keys and thresholds for an Account, you must run session code that executes within the account's context. Note that the session code provided in this workflow is not a general-purpose program and needs to be modified for each use case.

:::caution

Do not run these examples on Mainnet. Update the command for your environment.

:::

### Step 1: Clone the example Wasm for this workflow

This GitHub repository contains session code that can be used for learning how to configure Casper accounts using associated keys and multi-signature deploys. Clone the repository and navigate to the corresponding folder.
<!-- TODO add link to the GitHub repository.-->

```bash
git clone https://github.com/cryofracture/multi-sig && cd multi-sig
```

### Step 2: Build the samples provided

Prepare your environment and build the session code provided with the following commands.

```bash
rustup update
make clean
make prepare
make build-contracts
```

### Step 3: Update primary key weight to set thresholds

The included Wasm will set account weights to 1, requiring all accounts to multi-sign for deploys or key management controls. Initially, we have to set the weight of the primary key high enough to increase the key_management threshold.

First, retrieve the account-hash of the key you are working with, via cspr.live or `casper-client account-address –public-key XXX`

```bash
casper-client account-address --public-key <INSERT_PUBLIC_KEY_HEX>
```

Once the account-hash is obtained, you can update the weight of the primary key by calling the update_keys session code:

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client put-deploy --node-address https://rpc.testnet.casperlabs.io/ \
--chain-name "casper-test" \
--payment-amount 2000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/update_keys/target/wasm32-unknown-unknown/release/update_associated_keys.wasm \
--session-arg "associated_key:account_hash='account-hash-<ACCOUNT_HASH_HEX_HERE>'" \
--session-arg "new_weight:u8='3'"
```

Which results in the main key now showing weight “3”:

```json
"Account": {
      "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 1
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
          "weight": 3
        }
      ],
      "main_purse": "uref-b4532f30031b9deb8b2879a91ac185577dcba763de9d48753385e0ef41235dfa-007",
      "named_keys": []
    }
  }
```


### Step 4: Update the thresholds

After the primary key has had its weight increased, you can set the `deployment` and `key_management` thresholds for the account to set up a multi-sign environment. To add a new key to the account, call the `add_account.wasm`. The session code included will set `deployment` threshold to 2 (hard coded), and key_management to 3. It is recommended to have more weight on the account than is needed, by a small amount, to ensure the primary account can meet the `key_management` needs.

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client put-deploy \
--node-address https://rpc.testnet.casperlabs.io \
--chain-name casper-test \
--payment-amount 5000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/update_thresholds/target/wasm32-unknown-unknown/release/update_thresholds.wasm
```

### Step 5: Add a new associated key to the primary account

To add `account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7`, for example, to the account to set up multi-signature, you would issue a deploy command like:

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client put-deploy --node-address https://rpc.testnet.casperlabs.io/ \
--chain-name "casper-test" \
--payment-amount 50000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/add_account/target/wasm32-unknown-unknown/release/add_account.wasm \
--session-arg "new_key:account_hash='account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7" \
--session-arg "weight:u8='1'"
```

:::note

1. The `key_management` threshold cannot be changed before the `deployment` threshold can be changed. 
2. The primary key on the account can lower its weight if it has enough weight to meet the `key_mangement` threshold.
3. All associated keys should be be kept incredibly secure to ensure robustness of the integrity of the account.

:::


The above configuration assumes 3 keys to an account to manage keys, but only 2 to deploy using the account. This will result in the account’s action_thresholds now looking like:

```json
"action_thresholds": {
  "deployment": 2,
  "key_management": 3
},
```

### Step 6: Add and remove a “compromised” key to the Account

In this scenario, `account-hash-04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f` has become compromised and should no longer have write access to the account.

<details>
<summary>Account details</summary>


```json
"Account": {
      "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
      "action_thresholds": {
        "deployment": 2,
        "key_management": 3
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f",
          "weight": 1
        },
        {
          "account_hash": "account-hash-1fed34baa6807a7868bb18f91b161d99ebf21763810fe4c92e39775d10bbf1f8",
          "weight": 1
        },
        {
          "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
          "weight": 3
        },
        {
          "account_hash": "account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7",
          "weight": 1
        }
      ],
      "main_purse": "uref-b4532f30031b9deb8b2879a91ac185577dcba763de9d48753385e0ef41235dfa-007",
      "named_keys": []
    }
```

</details>

To remove this account, call the `remove_account.wasm` as shown below.

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client put-deploy \
--node-address https://rpc.testnet.casperlabs.io \
--chain-name casper-test \
payment-amount 5000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/remove_account/target/wasm32-unknown-unknown/release/remove_account.wasm \
--session-arg "remove_key:account_hash='account-hash-04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f'"
```

The resulting account should not contain the associated key that was just removed, i.e. `account-hash-04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f`.

<details>
<summary>New account details</summary>

```json
"Account": {
      "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
      "action_thresholds": {
        "deployment": 2,
        "key_management": 3
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-1fed34baa6807a7868bb18f91b161d99ebf21763810fe4c92e39775d10bbf1f8",
          "weight": 1
        },
        {
          "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
          "weight": 3
        },
        {
          "account_hash": "account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7",
          "weight": 1
        }
      ],
      "main_purse": "uref-b4532f30031b9deb8b2879a91ac185577dcba763de9d48753385e0ef41235dfa-007",
      "named_keys": []
    }
```

</details>

### Step 7: Lower the primary key weight after set-up

After all associated keys and action_thresholds have been set on the account to the desired points, you can lower the weight of the original key and set it to 0, allowing proper multi-signature setup (again requiring 2 signatures to deploy, 3 weight for key_management). To lower the key’s weight, call the `update_associated_keys.wasm`:

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client put-deploy \
--node-address https://rpc.testnet.casperlabs.io \
--chain-name "casper-net-1" \
--payment-amount 5000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/update_keys/target/wasm32-unknown-unknown/release/update_associated_keys.wasm \
--session-arg "associated_key:account_hash='account-hash-<PRIMARY_ACCOUNT_HASH_HEX_HERE>'" \
--session-arg "new_weight:u8='0'"
```

The account will now look like this:

```json
"Account": {
      "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
      "action_thresholds": {
        "deployment": 2,
        "key_management": 3
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-1fed34baa6807a7868bb18f91b161d99ebf21763810fe4c92e39775d10bbf1f8",
          "weight": 1
        },
        {
          "account_hash": "account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757",
          "weight": 0
        },
        {
          "account_hash": "account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7",
          "weight": 1
        }
      ],
      "main_purse": "uref-b4532f30031b9deb8b2879a91ac185577dcba763de9d48753385e0ef41235dfa-007",
      "named_keys": []
    }
```

### Step 8: Set up a multi-sign deploy from the primary account

After the action thresholds are set and keys are on the account in a way that will allow multi-signature deploys, you can easily sign deploys for sending to the network using the “casper-client make-deploy” command. Enough weight against the account must sign the deploy to meet the `deployment` threshold, in this case 2 signatures. Either party can then send the deploy to the network when ready.

To start signing a deploy, we will start with a simple “hello, world” named key contract.

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 3000000000 \
--session-path contracts/hello_world/target/wasm32-unknown-unknown/release/hello_world.wasm \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-arg "my-key-name:string='user_1_key'" \
--session-arg "message:string='Hello, World'" \
--output hello_world_one_signature
```

And then any associated key can sign the deploy to meet the action threshold for the account:

:::caution

Do not run this example on Mainnet. Update the command for your environment.

:::

```bash
casper-client sign-deploy -i hello_world_one_signature -k ~/cspr_nctl/user-2.pem -o hello_world_ready
```

And you can now send the deploy to the network:

```bash
casper-client send-deploy --node-address https://rpc.testnet.casperlabs.io -i hello_world_ready
```

Which will deploy to the account and create a named_key:

```json
"named_keys": [
        {
          "key": "uref-9b9ecaa9e5e235fc6955d4d528cb1b5b38f2d800f6cbbc55351131a3701b5a81-007",
          "name": "my-key-name"
        }
      ]
```

### Step 9: Set-up a multi-sign deploy from an associated key

To initiate a deploy signature from the primary account, the same steps for signing can be followed. However, on the `make-deploy` command you must add the `–session-account` argument to tell the execution engine the account context in which to run the contract. The `--session-account` parameter requires a public key in hexadecimal format.

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 3000000000 \
--session-path contracts/hello_world/target/wasm32-unknown-unknown/release/hello_world.wasm \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-arg "my-key-name:string='user_1_key'" \
--session-arg "message:string='Hello, World'" \
--session-account 017fac40914593d00bc7e6a8f4a0d758d6a12e4e036f1473ae50d124ffd91b103b
--output hello_world_one_signature
```
