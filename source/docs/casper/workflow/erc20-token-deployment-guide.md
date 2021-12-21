# How to Deploy Your Own ERC20 Compliant Token on the Casper Mainnet

On Casper, it is possible to create smart contracts that emulate ERC20 tokens on Ethereum. These tokens have all of the capabilities of traditional ERC20 tokens, allowing one to approve, transfer, inquire the balance of a wallet, etc. By following this guide, you'll be able to create your own ERC20 token and deploy it to the Casper blockchain.

## Prerequisites

Before following this guide ensure that you are familiar with [compiling smart contracts](https://casper.network/docs/dapp-dev-guide/getting-started) and [deploying smart contracts](https://casper.network/docs/dapp-dev-guide/deploying-contracts) on Casper. Sections will be summarized but it is recommended that you read through the documents.

For best results, it is recommended to follow this guide on Ubuntu Linux.

## Install `casper-client`

It is possible to interact with the Casper network using any viable client. The `casper-client` is the most popular and was developed by the team at Casper Labs. We will be using this client for this guide. Install it by running the following command:

`cargo install casper-client`

## Set up an Account

We will be using `casper-client` to generate a keypair that represents an account on Casper. You can also create an account with [Casper Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce), or use an account you've made previously.

To generate a keypair in your working directory, execute the command:

`casper-client keygen .`

This will generate three files:

1. `secret_key.pem` - PEM encoded secret key. Allows access to the account.

2. `public_key.pem` - PEM encoded public key.

3. `public_key_hex` - Hexadecimal-encoded string of the public key.

You'll now need to fund this account with CSPR. Do this by sending CSPR to the address in the `public_key_hex` file. Transferring funds can be done easily via Casper's [cspr.live transfer page](https://cspr.live/transfer), or if you prefer, [can also be done with `casper-client`](https://casper.network/docs/workflow/transfer-workflow). Note that deployment of contracts costs [gas](https://casper.network/docs/economics/gas-concepts) and will cost at least 50 CSPR, and likely more. Make sure to fund your account with enough funds to pay for deployment.

Learn more about accounts [here](https://casper.network/docs/design/accounts).

## Clone Example ERC20 Project

Open a new terminal window, keeping the terminal you used to start NCTL open for reference.

Navigate to the directory you'd like your ERC20 project stored. Then execute the command

`git clone https://github.com/casper-ecosystem/erc20.git`

`cd` into `erc20/`

## Build and Deploy

Execute `make prepare` to ensure `wasm32-unknown-unknown` is installed.

Run `make build-contracts` to compile the contracts into a `.wasm` file.

To deploy the contract, paste the following command and run it, replacing the placeholders with your values:

~~~bash
casper-client put-deploy \
  --node-address NODE_ADDRESS_AND_PORT \
  --chain-name CHAIN_NAME \
  --secret-key SECRET_KEY_PATH \
  --payment-amount TOTAL_GAS_IN_MOTES \
  --session-path PATH_TO_WASM \
  --session-arg "name:string='REPLACE'" \
  --session-arg "symbol:string='REPLACE'" \
  --session-arg "decimals:u64='REPLACE'" \
  --session-arg "total_supply:u64='REPLACE'"
~~~

* `--node-address`: The IP address and port of an active validator node. To get the address for one of these nodes, visit [this page](https://cspr.live/tools/peers) and choose a peer. Copy the IP address but change the port from `35000` to `7777`. 
* `--chain-name`: The chain of the network you wish to deploy to. For mainnet deployments, the chain name `casper` is used.
* `--secret-key`: This will be the path to your secret key you just created. Use an absolute path or a path relative to your current working directory.
* `--payment-amount`: This is the total amount of gas you are willing to pay, denominated in motes (1 nano CSPR). There is currently no truly effective way to estimate gas prices (although one is in the works) so your best bet is to significantly overestimate. Once deployed you will only pay the calculated cost in gas, and the difference will remain in your account. As mentioned earlier, deployment will cost at least 50 CSPR. In our case, because we dont want to incur an out-of-gas exception, we'll specify our payment amount to be 90 CSPR, or `90000000000` motes. It will not use all of this though, and will leave the difference in your wallet.
* `--session-path`: The path to your compiled erc20 contract. If you are within the `erc20` root directory, you can use the relative path: `target/wasm32-unknown-unknown/release/erc20_token.wasm`.
* `--session-arg`s: Session arguments are runtime parameters you define that are passed along to the contract when it is deployed. In our case, we'll be providing the ERC20 token's name, symbol, the number of decimal places, and the total supply of the token.

A valid installment command:

```bash
casper-client put-deploy \
	--node-address http://74.208.245.69:7777 \
	--chain-name casper \
	--secret-key ./secret_key.pem \
	--payment-amount 90000000000 \
	--session-path target/wasm32-unknown-unknown/release/erc20_token.wasm \
	--session-arg "name:string='TestCoin'" \
	--session-arg "symbol:string='TST'" \
	--session-arg "decimals:u64='8'" \
	--session-arg "total_supply:u256='100000'"  
```

This will deploy the token TestCoin (TST) on the Casper mainnet. TestCoin will have 8 decimal places of precision and a total supply of 100,000.

---

When you deploy your token, you should get a result back that looks like this:

```json
{
  "id": 6224708027668710791,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.0.0",
    "deploy_hash": "4ecff331e85cee526c87d6315d84d056fc91a8e81e720152bfebc7ad683796f8"
  }
}
```

To verify that your contract deployed successfully, run the following command:

`casper-client get-deploy --node-address NODE_ADDRESS DEPLOY_HASH`

Replacing `DEPLOY_HASH` with the deploy hash returned to you by `put-deploy` command, and `NODE_ADDRESS` with the address of the node you used for deployment.

This will return JSON data about the deployment. Look for the `"execution_results"` key, under it should be a result that says `"Success"` or `"Failure"`. If `"execution_results"` is an empty array (`[]`), the transaction has yet to be executed on the node, simply try again after a couple of minutes.

Once the installment succeeds, note down the `"body_hash"` of the contract. You can find this value under the `"header"` key in the JSON response.

## Prepare Testing Contract Package

To verify that the token works properly, we'll be deploying a testing contract package that include functions that allow us to call the ERC20 contract. Testing is not required but highly encouraged.

Execute the following command, substituting in your values, to install the test contract on the Casper mainnet:

```bash
casper-client put-deploy --node-address NODE_ADDRESS_AND_PORT \
	--chain-name CHAIN_NAME \
	--secret-key SECRET_KEY_PATH \
	--session-path PATH_TO_WASM \
	--payment-amount TOTAL_GAS_IN_MOTES
```

These parameters should be the same as earlier, except for `--session-path` in which we will change the filename of the `.wasm` being deployed.

An example of a valid installment commands goes as follows:

```bash
casper-client put-deploy --node-address http://74.208.245.69:7777 \
	--chain-name casper \
	--secret-key ./secret_key.pem \
	--session-path target/wasm32-unknown-unknown/release/erc20_test_call.wasm \
	--payment-amount 90000000000
```

The response should look like this:

```bash
{
  "id": -863197747212203124,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "deploy_hash": "7e3b34F47bc77dB285e27C543ff94736b8fe5EdDC06e5f8d7931C67DFCe2D9a3"
  }
}
```

Note down the `"deploy_hash"` and execute the following command:

`casper-client get-deploy --node-address NODE_ADDRESS DEPLOY_HASH`

Substituting the same node address you've been using, and the deploy hash you just copied.

Make sure the response has succeeded (You'll see `"Success"` under `"execution_results"` instead of an empty array or `"Failure"`). If `"execution_results"` is empty, wait a moment and try the `get-deploy` command again.

Once you get a successful result, note down the hash above the key `"WriteContractPackage"`. It's a key-value pair in the `"transforms"` array.

```json
"transforms": [
  ...
	{
  	"key": "hash-2911dB364B4E3E994eb2Da2447aA13f55EE0c55bd29052C5520774d7DB06db24",
  	"transform": "WriteContractPackage"
  },
  ...
]
```

From here, you'll make a query to the contract package in order to obtain the test contract's hash. To do that though we'll need to get the current `state-root-hash`. This value changes when interactions occur on-chain. To get the most up-to-date `state-root-hash` execute the following:

`casper-client get-state-root-hash --node-address NODE_ADDRESS`

You're response should look like this:

```bash
{
  "id": 47524863165815216,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.3",
    "state_root_hash": "Ef8dbEb52D6d37f493dBb5411F8685e05CEe3Ae0DfAA7bC0bfd6E50A7bf362A5"
  }
}
```

Next, execute the `query-state` command using the `"state_root_hash"` in the JSON response above.

```bash
casper-client query-state \
--node-address NODE_ADDRESS \
--key hash-2911dB364B4E3E994eb2Da2447aA13f55EE0c55bd29052C5520774d7DB06db24 \
--state-root-hash Ef8dbEb52D6d37f493dBb5411F8685e05CEe3Ae0DfAA7bC0bfd6E50A7bf362A5
```

Again be sure to use the proper values.

## Testing Transfers

