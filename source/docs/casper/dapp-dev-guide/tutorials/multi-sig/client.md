# Client Example

This section covers an example client that invokes a smart contract for key management. In addition to the main account, the client code will add two additional accounts to perform deployments. The two deployment accounts will perform deployments but will not be able to add another account.

You will test your client using [nctl](https://github.com/casper-network/casper-node/tree/master/utils/nctl), and you will interact with your local blockchain.

## Prerequisites {#prerequisites}

-   You have compiled the [example contract](https://github.com/casper-ecosystem/keys-manager) for key management
-   You have set up the [NCTL](https://github.com/casper-network/casper-node/tree/master/utils/nctl) tool according to the [NCTL guide](../dapp-dev-guide/setup-nctl.html)

## Setting up a local Casper Network {#setting-up-a-local-casper-network}

Navigate to your `casper-node` folder and run the following NCTL commands.

```bash
nctl-compile
nctl-assets-setup && nctl-start
```

The network you created with the NCTL tool has a special account called a faucet account, which holds your tokens. You will need these tokens to interact with the network. If the network is up and running, you can see your faucet account details with the command below.

```bash
nctl-view-faucet-account
```

## Setting up the Client {#setting-up-the-client}

This client code expects a compiled WASM file in the `contract` folder and a local network called `casper-net-1`.

Now you need to specify the configuration needed for your client to communicate with the network:

-   The `BASE_KEY_PATH` for the absolute path to your faucet account
-   The `NODE_URL` for the first node in your local network

Navigate to your `keys-manager/client/` folder and create an `.env` file to specify the required configurations.

```bash
cd keys-manager/client/
touch .env
open -e .env
```

Your `.env` file will look like this (\<ENTER_YOUR_PATH> stores your local path):

>     BASE_KEY_PATH=<ENTER_YOUR_PATH>/casper-node/utils/nctl/assets/net-1/faucet/
>     NODE_URL=http://localhost:11101/rpc

If you would like to customize your setup further, you can set other optional environment variables described in the table below.

Variable Description Default value

| Variable        | Description                                                  | Default value                                                         |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| WASM_PATH       | The path of the compiled WASM contract.                      | `../contract/target/wasm32-unknown-unknown/release/keys-manager.wasm` |
| NETWORK_NAME    | The name of your local network set up by NCTL.               | `casper-net-1`                                                        |
| FUND_AMOUNT     | Number of motes that accounts will be funded.                | `10000000000000`                                                      |
| PAYMENT_AMOUNT  | Number of motes that will be used as payment for deploys.    | `100000000000`                                                        |
| TRANSFER_AMOUNT | Number of motes that will be used for native test transfers. | `2500000000`                                                          |

Next, close the `.env` file and install the JavaScript packages in the `keys-manager/client` folder with the following command.

```bash
npm install
```

## Testing the Client {#testing-the-client}

Navigate to your `/keys-manager/client` folder and run the _keys-manager_ using _npm_. Your WASM file's path is relative to the `client` folder, so you need to run the file from here.

```bash
npm run start:atomic
```

**Note**: You may have to wait some time after entering the above command until you see a result.

If the code works, the beginning of the output will look like this:

![An image of the beginning of the keys-manager output.](/image/tutorials/multisig/output_begin.png)

You can match the rest of the output against the expected output described in the next section while exploring the client code.

### Exploring the Client Code {#exploring-the-client-code}

If you would like to explore the client output and how the client code implements key management, open the client output and the `keys-manager.js` file side by side.

In the code, we set the weight for the primary account to 3.

```javascript
deploy = utils.keys.setKeyWeightDeploy(mainAccount, mainAccount, 3);
```

At this point, we expect an account structure similar to the following, with real account addresses replacing the sample addresses:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 1,
      "key_management": 1
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

Next, we set the key management threshold for the main account to 3. With this threshold, you can manage other keys and have control over the entire account.

```javascript
deploy = utils.keys.setKeyManagementThresholdDeploy(mainAccount, 3);
```

We expect an account structure similar to this:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 1,
      "key_management": 3
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

Next, the client code sets the deployment threshold to 2 for this account.

```javascript
deploy = utils.keys.setDeploymentThresholdDeploy(mainAccount, 2);
```

We expect an account structure similar to this:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 2,
      "key_management": 3
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

The next step is to add a new key with weight 1. You cannot do anything with this key alone since all the action thresholds are higher than 1.

```javascript
deploy = utils.keys.setKeyWeightDeploy(mainAccount, firstAccount, 1);
```

We expect this account structure, with a new associated key and account address:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 1,
      "key_management": 3
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   },
   {
      "account_address": "account-address-456…",
      "weight": 1
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

We will add another key with weight 1. If you use this key with the second key, you can deploy, since the weights add up to 2.

```javascript
deploy = utils.keys.setKeyWeightDeploy(mainAccount, secondAccount, 1);
```

We expect an account structure similar to the following:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 1,
      "key_management": 3
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   },
   {
      "account_address": "account-address-456…",
      "weight": 1
   },
   {
      "account_address": "account-address-789…",
      "weight": 1
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

Next, we will transfer tokens from the main account and perform a deployment. When the deployment accounts sign the transaction, they can transfer funds from the faucet account since their combined weight is 2, which meets the deployment threshold.

```javascript
deploy = utils.transferDeploy(mainAccount, firstAccount, 1);
await utils.sendDeploy(deploy, [firstAccount, secondAccount]);
```

![Image showing the output of the funds transfer.](/image/tutorials/multisig/step_6.png)

If you dive into the _transferDeploy_ function, you will see the transfer of funds.

```javascript
function transferDeploy(fromAccount, toAccount, amount) {
    let deployParams = new DeployUtil.DeployParams(fromAccount.publicKey, networkName);
    let transferParams = DeployUtil.ExecutableDeployItem.newTransfer(amount, toAccount.publicKey);
    let payment = DeployUtil.standardPayment(100000000000);
    return DeployUtil.makeDeploy(deployParams, transferParams, payment);
}
```

After the above transfer of funds, the client code removes both deployment accounts.

```javascript
...
deploy = utils.keys.setKeyWeightDeploy(mainAccount, firstAccount, 0);
...
deploy = utils.keys.setKeyWeightDeploy(mainAccount, secondAccount, 0);
...
```

At this point, we expect the following account structure:

```sh
"Account": {
"account_address": "account-address-123…",
   "action_thresholds": {
      "deployment": 1,
      "key_management": 3
},
"associated_keys": [
   {
      "account_address": "account-address-123…",
      "weight": 3
   }
],
"main_purse": "uref-…",
"named_keys": []
}
```

Congratulations! You have completed this tutorial.

You can now employ a similar strategy to set up your account using multiple keys.

We offer some additional examples of account management in the next section.
