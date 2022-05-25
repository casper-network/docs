# Client Example

This section covers an example client that invokes a smart contract for key management. In addition to the main account, the client code will add two additional associated accounts to perform deployments. These associated accounts will perform deployments but will not be able to add another account.

You will test the client example using [NCTL](https://github.com/casper-network/casper-node/tree/master/utils/nctl), and interact with your local network.

## Prerequisites {#prerequisites}

-   You have compiled the [example contract](https://github.com/casper-ecosystem/keys-manager) for key management
-   You have set up the [NCTL](https://github.com/casper-network/casper-node/tree/master/utils/nctl) tool according to the [NCTL guide](dapp-dev-guide/building-dapps/setup-nctl)

## Setting up a Local Casper Network {#setting-up-a-local-casper-network}

Use the following commands to activate an NCTL environment and run a local network:

```bash
source casper-node/utils/nctl/activate
nctl-assets-setup && nctl-start
```

The network you created with the NCTL tool has a special account called a faucet account, which holds your tokens. You will need these tokens to interact with the network. If the network is up and running, you can see your faucet account details with the following command.

```bash
nctl-view-faucet-account
```

## Setting up the Client {#setting-up-the-client}

This client code expects a compiled Wasm file in the `contract` folder and a local network called `casper-net-1`.

Now you need to specify the configuration needed for your client to communicate with the network:

-   The `BASE_KEY_PATH` for the absolute path to your faucet account
-   The `NODE_URL` for the first node in your local network

Navigate to your `keys-manager/client/` folder and create a `.env` file to specify the required configurations.

```bash
cd keys-manager/client/
touch .env
open -e .env
```

Your `.env` file will look like this:

>     BASE_KEY_PATH=<ENTER_YOUR_PATH>/casper-node/utils/nctl/assets/net-1/faucet/
>     NODE_URL=http://localhost:11101/rpc

:::note

Replace <ENTER_YOUR_PATH> with the absolute path of your local drive, because the relative path does not work in this context.

:::

If you would like to customize your setup further, you can set other optional environment variables described in the table below.

| Variable        | Description                                                  | Default Value                                                         |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| WASM_PATH       | The path of the compiled Wasm contract.                      | `../contract/target/wasm32-unknown-unknown/release/keys-manager.wasm` |
| NETWORK_NAME    | The name of your local network set up by NCTL.               | `casper-net-1`                                                        |
| FUND_AMOUNT     | Number of motes that accounts will be funded.                | `10000000000000`                                                      |
| PAYMENT_AMOUNT  | Number of motes that will be used as payment for deploys.    | `100000000000`                                                        |
| TRANSFER_AMOUNT | Number of motes that will be used for native test transfers. | `2500000000`                                                          |

Next, close the `.env` file and install the JavaScript packages in the `keys-manager/client` folder with the following command.

```bash
npm install
```

## Testing the Client {#testing-the-client}

Navigate to your `/keys-manager/client` folder and run the _keys-manager_ using _npm_. Your Wasm file's path is relative to the `client` folder, so you need to run the file from here.

```bash
npm run start:atomic
```

**Note**: You may have to wait some time after entering the above command until you see a result.

You can match the output against the expected output described in the next section.

### Exploring the Client Output {#exploring-the-client-output}

We will explore the client example with the help of its output. The client example executes the following steps:

1. Set the main account's weight to 3
2. Set the key management threshold to 3
3. Set the deploy threshold to 2
4. Add first account new key with weight 1
5. Add second account new key with weight 1 
6. Transfer tokens from the main account using the associated accounts
7. Remove the first account
8. Remove the second account

In Step 1, the weight for the main account is set to 3. This ensures the main account has permissions to manage the account thresholds even after the new keys are added.

<details>
<summary>Partial sample output for Step 1</summary>

```sh
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    }
  ],
  actionThresholds: { deployment: 1, keyManagement: 1 }
```
</details>

In Step 2, the key management threshold for the main account is set to 3. With this threshold, the main account can manage other associated keys and have control over the entire account.

<details>
<summary>Partial sample output for Step 2</summary>

```sh
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    }
  ],
  actionThresholds: { deployment: 1, keyManagement: 3 }
```
</details>

In Step 3, the deployment threshold is set to 2. This means that the key used to deploy must have a weight of 2 or higher, or else you would have to sign the deploy with multiple keys to meet the deployment threshold.

<details>
<summary>Partial sample output for Step 3</summary>

```sh
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    }
  ],
  actionThresholds: { deployment: 2, keyManagement: 3 }
```
</details>

In Step 4, a new key with weight 1 is added to the account. You cannot do anything with this key alone since all the action thresholds are higher than 1.

<details>
<summary>Partial sample output for Step 4</summary>

```sh
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    },
    {
      accountHash: 'account-hash-5795d2d6d858a22ddd6192092a31e2f16c28df53ddbe2c98d1bd632d10065de9',
      weight: 1
    }
  ],
  actionThresholds: { deployment: 2, keyManagement: 3 }
```
</details>

In Step 5, a second key with weight 1 is added. If you use this key with the first key, you can deploy, since the weights add up to 2.

<details>
<summary>Partial sample output for Step 5</summary>

```sh
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    },
    {
      accountHash: 'account-hash-5795d2d6d858a22ddd6192092a31e2f16c28df53ddbe2c98d1bd632d10065de9',
      weight: 1
    },
    {
      accountHash: 'account-hash-d0bc795436850e7d66e72f7bf3ac2b08ca75270aaaf212849a4ffe7de7f74b21',
      weight: 1
    }
  ],
  actionThresholds: { deployment: 2, keyManagement: 3 }
```
</details>

In Step 6, a deploy is made to transfer tokens from the main account. When the associated accounts sign the transaction, they can transfer funds from the faucet account since their combined weight is 2, which meets the deployment threshold. In the sample output, you can observe that the deploy is signed by both the associated accounts.

<details>
<summary>Partial sample output for Step 6</summary>

```sh
Signed by: account-hash-5795d2d6d858a22ddd6192092a31e2f16c28df53ddbe2c98d1bd632d10065de9
Signed by: account-hash-d0bc795436850e7d66e72f7bf3ac2b08ca75270aaaf212849a4ffe7de7f74b21
Deploy hash: 8d1688ae4e3d40f89ace5402972121710b109f51198501512e0b267bbefe8be9
Deploy result:
{
  deploy: {
    hash: '8d1688ae4e3d40f89ace5402972121710b109f51198501512e0b267bbefe8be9',
    header: {
      account: '0203bd1ddbd9224dd0c8199076e4da8c0ed701b79b6f3bd08af498f05eb3e47cf8a8',
      timestamp: '2022-01-24T14:43:54.086Z',
      ttl: '30m',
      gas_price: 1,
      body_hash: '1f2e7efbb3f2f8694582984a608e9ff08a3607b2f484d5992e4c57f2b677b001',
      dependencies: [],
      chain_name: 'casper-net-1'
    },
    payment: { ModuleBytes: [Object] },
    session: { Transfer: [Object] },
    approvals: [ [Object], [Object] ]
  }
}
```
</details>

After the transfer of funds, the client code removes both deployment accounts in step 7 and 8, and only the main account is left.

<details>
<summary>Sample account structure after the client code execution is complete</summary>

```sh
{
  _accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
  namedKeys: [
    {
      name: 'keys_manager',
      key: 'hash-3ae881f0874bb220179715a66b7ccb588d2a016c632a873646dc6835b8d829b3'
    },
    {
      name: 'keys_manager_hash',
      key: 'uref-a67f68ff2d176be69723bb9b735ebfb8b76b313863e30fb7387077c632fc977b-007'
    }
  ],
  mainPurse: 'uref-939bab468f222fc5ae5ff4dbfc2b6c280e311c7a6fb7fcf21370ff6b63bf9d73-007',
  associatedKeys: [
    {
      accountHash: 'account-hash-1b9352869f5e3d9569e4ad4cc97a2a62e34555958c7f70caac56bbb107af8d7f',
      weight: 3
    }
  ],
  actionThresholds: { deployment: 2, keyManagement: 3 }
}
```
</details>

You can now employ a similar strategy to set up your account using multiple keys, see [Setting up a Multi-sig Account](example.md).  


