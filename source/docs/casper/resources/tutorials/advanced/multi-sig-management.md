# Key Management Workflow

The purpose of this tutorial is to provide an example of how to integrate key management on Casper accounts. This guide assumes previous completion of the [Two-Party Multi-Signature Deploys](https://docs.casper.network/resources/tutorials/advanced/two-party-multi-sig/) tutorial, among other prerequisites. You will also need the Casper CLI client to interact with the network.

:::warning

The session code provided in this tutorial should not be used in a production environment.

Incorrect account configurations could render accounts defunct and unusable, thus losing access to all the corresponding CSPR.

Test any changes to an account in a test environment like Testnet before performing changes in a live environment like Mainnet.

:::


## Prerequisites

The following prerequisites are required for this workflow:

1. Set up all the prerequisites listed [here](../../../developers/prerequisites.md), including a [funded account](../../../developers/prerequisites.md#setting-up-an-account) and the [Casper CLI client](../../../developers/prerequisites.md#the-casper-command-line-client)
2. Complete the [Two-Party Multi-Signature Deploys](../../../resources/tutorials/advanced/two-party-multi-sig.md) workflow and set up the source account for multi-signature deploys
3. Learn how to use the `make-deploy`, `sign-deploy`, and `send-deploy` Casper CLI client commands
4. Understand the Casper [account-based model](../../../concepts/design/casper-design.md#accounts-head) before proceeding


## Session Code Required for Key Management

To manage the associated keys and thresholds for an account, you must run session code that executes within the account's context. Note that the session code provided in this workflow is not a general-purpose program and needs to be modified for each use case.

:::caution

Do not run these examples on Mainnet. Update the command for your environment.

:::

### Step 1: Clone the example Wasm for this workflow

This GitHub repository contains session code that can be used for learning how to configure Casper accounts using associated keys and multi-signature deploys. Clone the repository and navigate to the corresponding folder.
<!-- TODO add link to the GitHub repository.-->

```bash
git clone https://github.com/cryofracture/multi-sig && cd multi-sig
```

### Step 2: Build the sample Wasm provided

Prepare your environment and build the session code provided with the following commands.

```bash
rustup update
make clean
make prepare
make build-contracts
```

### Step 3: Increase the primary key's weight to set thresholds

This workflow starts by increasing the weight of the primary key to update the `key_management` threshold. It is recommended to have more weight on the primary account than is needed to ensure the primary account can meet the `key_management` threshold and make any account updates. Additional associated accounts will have weight 1, and they will all need to participate in signing deploys or managing keys.

First, retrieve the account hash of the primary key you are working with using a block explorer or the Casper CLI client.

```bash
casper-client account-address --public-key <INSERT_PUBLIC_KEY_HEX>
```

Update the weight of the primary key to 3 by calling the `update_associated_keys.wasm`.

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

The primary key in this account should now have weight 3.

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


### Step 4: Update the account's action thresholds

To set up a multi-signature scheme for the account, set the `deployment` and `key_management` thresholds. The `update_thresholds.wasm` included will set `deployment` threshold to 2 and the `key_management` threshold to 3. These values are hard coded in the session code example.

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

The account’s action thresholds would look like this:

```json
"action_thresholds": {
  "deployment": 2,
  "key_management": 3
},
```

This configuration requires a cumulative weight of 3 to manage keys and 2 to send deploys as part of this account context. For example, if two associated keys have weight 1, they must both sign deploys that can run as part of this account context. The cumulative weight of these two keys would need to be higher for key management.


### Step 5: Add associated keys to the primary account

To add an associated key to the primary account, use the `add_account.wasm` provided. The example below starts by adding the following account as an associated key: `account-hash-e2d00525cac31ae2756fb155f289d276c6945b6914923fe275de0cb127bffee7`.

:::caution

Do not run this example on Mainnet. Update all commands for your environment.

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

1. The `deployment` threshold must be changed before the `key_management` threshold can be updated.
2. The primary key on the account can lower its weight if it has enough weight to meet the `key_mangement` threshold.
3. All associated keys should be kept incredibly secure to ensure the security and integrity of the account.

:::


Next, add a second and third account as associated keys with weight 1.

```bash
casper-client put-deploy --node-address https://rpc.testnet.casperlabs.io/ \
--chain-name "casper-test" \
--payment-amount 50000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/add_account/target/wasm32-unknown-unknown/release/add_account.wasm \
--session-arg "new_key:account_hash='account-hash-04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f" \
--session-arg "weight:u8='1'"

casper-client put-deploy --node-address https://rpc.testnet.casperlabs.io/ \
--chain-name "casper-test" \
--payment-amount 50000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/add_account/target/wasm32-unknown-unknown/release/add_account.wasm \
--session-arg "new_key:account_hash='account-hash-1fed34baa6807a7868bb18f91b161d99ebf21763810fe4c92e39775d10bbf1f8" \
--session-arg "weight:u8='1'"
```

The account would now have one primary key with weight 3, and three associated accounts, each with weight 1.

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

### Step 6: Lower the primary key's weight after the multi-signature setup

After all associated keys and action thresholds have been set to the desired multi-signature scheme, the weight of the original primary key can be set to 0. This setup allows the primary key to originate all deploys, but the rest of the associated keys will need to sign the deploys. Remember, this multi-signature setup requires a cumulative weight of 2 for deploys and 3 for key management. To lower the primary key's weight, call the `update_associated_keys.wasm`. Since this key's weight is 3, it can lower its weight to 0 without requiring other keys to sign. Be careful with this step. Given this setup, the account will require multiple signatures for the following key management operation.

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
--session-arg "associated_key:account_hash='account-hash-d89c49f7e03f418dc285e94e254d53574db878665271f366bb3aeddded7ab757'" \
--session-arg "new_weight:u8='0'"
```

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

</details>


### Step 7: Send a multi-signature deploy from the primary account

After setting up the account with a multi-signature scheme, use the following commands to sign a deploy with multiple keys and send it to the network:

1. The `make-deploy` command creates and signs a deploy, saving the output to a file
2. The `sign-deploy` command adds additional signatures for a multi-signature deploy
3. The `send-deploy` command sends the deploy to the network

The following example sends a multi-sig deploy containing Wasm (`hello_world.wasm`) that adds a named key to the account. The deploy originates from the primary account and needs two signatures to meet the `deployment` weight set to 2. Once both keys sign the deploy, either can send it to the network.

:::caution

Do not run these examples on Mainnet. Update the commands for your environment.

:::

The first associated key creates and signs the deploy with the `make-deploy` command.

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 3000000000 \
--session-path contracts/hello_world/target/wasm32-unknown-unknown/release/hello_world.wasm \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-arg "my-key-name:string='user_1_key'" \
--session-arg "message:string='Hello, World'" \
--output hello_world_one_signature
```

The second associated key signs the deploy with `sign-deploy` to meet the deployment threshold for the account.

```bash
casper-client sign-deploy -i hello_world_one_signature -k ~/cspr_nctl/user-2.pem -o hello_world_two_signatures

```

Now the deploy can be sent to the network with the `send-deploy` command:

```bash
casper-client send-deploy --node-address https://rpc.testnet.casperlabs.io -i hello_world_two_signatures
```

The `hello_world.wasm` will run and add a named key to the account.

```json
"named_keys": [
        {
          "key": "uref-9b9ecaa9e5e235fc6955d4d528cb1b5b38f2d800f6cbbc55351131a3701b5a81-007",
          "name": "my-key-name"
        }
      ]
```

### Step 8: Send a multi-signature deploy from an associated key

To initiate a multi-sig deploy from an associated account, instead of the primary account, use the `--session-account` argument, which requires the hex-encoded public key of the account context under which the session code will be executed. The process is very similar to the previous step:

1. The `make-deploy` command creates and signs a deploy, saving the output to a file
2. The `sign-deploy` command adds additional signatures for a multi-signature deploy
3. The `send-deploy` command sends the deploy to the network

:::caution

Do not run these examples on Mainnet. Update the commands for your environment.

:::

One associated key creates and signs the deploy with the `make-deploy` command, indicating the account context under which the session code will be executed.

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 3000000000 \
--session-path contracts/hello_world/target/wasm32-unknown-unknown/release/hello_world.wasm \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-arg "my-key-name:string='user_1_key'" \
--session-arg "message:string='Hello, World'" \
--session-account 04a9691a9f8f05a0f08bd686f188b27c7dbcd644b415759fd3ca043d916ea02f \
--output hello_world_one_signature
```

The second associated key signs the deploy with `sign-deploy` to meet the deployment threshold for the account.

```bash
casper-client sign-deploy -i hello_world_one_signature -k ~/cspr_nctl/user-2.pem -o hello_world_two_signatures

```

The deploy can be sent to the network using the `send-deploy` command:

```bash
casper-client send-deploy --node-address https://rpc.testnet.casperlabs.io -i hello_world_two_signatures
```

The `hello_world.wasm` will run and add a named key to the account.


### Step 9: Remove a key from the account

This example shows how to remove a key from the account if it becomes compromised. The example adds a fourth associated key with `account-hash-77ea2e433c94c9cb8303942335da458672249d38c1fa5d1d7a7500b862ff52a4`, and then removes it using the `remove_account.wasm` session code.

If one of the existing keys were removed without adding the fourth associated key, the account would become unusable since it would not meet the required weight for key management. Thus, changing weights or adding new associated keys would be impossible.

:::caution

Remove keys with caution! Do not run this example on Mainnet.

:::

Given the current setup, three associated keys need to sign the deploy to add a fourth associated key. One associated key creates and signs the deploy with the `make-deploy` command.

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 50000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/add_account/target/wasm32-unknown-unknown/release/add_account.wasm \
--session-arg "new_key:account_hash='account-hash-77ea2e433c94c9cb8303942335da458672249d38c1fa5d1d7a7500b862ff52a4" \
--session-arg "weight:u8='1'" \
--output add_account_one_signature
```

The second and third associated keys sign the deploy with `sign-deploy` to meet the key management threshold for the account.

```bash
casper-client sign-deploy -i add_account_one_signature -k ~/cspr_nctl/user-2.pem -o add_account_two_signatures
casper-client sign-deploy -i add_account_two_signatures -k ~/cspr_nctl/user-3.pem -o add_account_three_signatures
```

The deploy containing the `add_account.wasm` will add a new associated account with weight 1.

```bash
casper-client send-deploy --node-address https://rpc.testnet.casperlabs.io -i add_account_three_signatures
```

The account should now have four associated keys with weight 1 and the primary key (from which all deploys originate) with weight 0.

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
          "account_hash": "account-hash-77ea2e433c94c9cb8303942335da458672249d38c1fa5d1d7a7500b862ff52a4",
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

</details>

The `remove_account.wasm` will remove the newly added account to demonstrate the possibility of removing associated keys that may have been compromised. This deploy needs to be signed by three associated keys to meet the key management threshold.

Given the current setup, three associated keys need to sign the deploy to add a fourth associated key. One associated key creates and signs the deploy with the `make-deploy` command.

```bash
casper-client make-deploy --chain-name casper-test \
--payment-amount 50000000000 \
--secret-key /path/to/keys_dir/secret_key.pem \
--session-path contracts/add_account/target/wasm32-unknown-unknown/release/remove_account.wasm \
--session-arg "new_key:account_hash='account-hash-77ea2e433c94c9cb8303942335da458672249d38c1fa5d1d7a7500b862ff52a4" \
--session-arg "weight:u8='1'" \
--output remove_account_one_signature
```

The second and third associated keys sign the deploy with `sign-deploy` to meet the key management threshold for the account.

```bash
casper-client sign-deploy -i remove_account_one_signature -k ~/cspr_nctl/user-2.pem -o remove_account_two_signatures
casper-client sign-deploy -i remove_account_two_signatures -k ~/cspr_nctl/user-3.pem -o remove_account_three_signatures
```

The deploy containing the `add_account.wasm` will add a new associated account with weight 1.

```bash
casper-client send-deploy --node-address https://rpc.testnet.casperlabs.io -i remove_account_three_signatures
```

The resulting account should not contain the associated key that was removed.

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

</details>
