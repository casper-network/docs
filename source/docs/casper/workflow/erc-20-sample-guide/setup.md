# Setup

Clone the ERC-20 contract repository and run the `make build-contract` command. This will create the `erc20_token.wasm` and the `erc20_test_call.wasm`. The token Wasm is the main contract. We will use the `test_call` contract wasm to query the balances and allowances of the ERC-20 token balances throughout this workflow.

## Install the Main ERC-20 Contract

```bash
casper-client put-deploy -n http://3.143.158.19:7777 \
--chain-name integration-test \
--secret-key ~/casper/demo/user_a/secret_key.pem \
--session-path ~/casper/demo/erc20_token.wasm \
--session-arg "name:string='ERC20'" \
--session-arg "symbol:string='gris'" \
--session-arg "total_supply:u256='100'" \
--session-arg "decimals:u8='1'" \
--payment-amount 90000000000
```

## Install the erc20_test_call Contract Package

```bash
casper-client put-deploy -n http://3.143.158.19:7777 \
--chain-name integration-test \
--secret-key ~/casper/demo/user_a/secret_key.pem \
--session-path ~/casper/demo/erc20_test_call.wasm \
--payment-amount 90000000000
```

At this point, the account that installed both the main contract and the helper contract will look like this.

```bash
{
	"src": {
	"Account": {
	"_accountHash": "account-hash-303c0f8208220fe9a4de40e1ada1d35fdd6c678877908f01fddb2a56502d67fd",
	"namedKeys": [
		{
		"name": "erc20_test_call",
		"key": "hash-999326ca8408dfd37da023eb6fd82f174151be64f83f9fb837632a0d69fd4c7e"
		},
		{
		"name": "erc20_token_contract",
		"key": "hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180"
		},
	],
	"mainPurse": "uref-6c062525debdee18d5cad083ca530fcb65ef8741574fba4c97673f4ed00093f7-007",
	"associatedKeys": [
		{
		"accountHash": "account-hash-303c0f8208220fe9a4de40e1ada1d35fdd6c678877908f01fddb2a56502d67fd",
		"weight": 1
		}
	],
	"actionThresholds": {
		"deployment": 1,
		"keyManagement": 1
		}
		}
	}
}
```

**_Note:_**

> 1. `erc20_token_contract` is the main contract, and is a stored contract, record its hash
> 2. `erc20_test_call` is a Contract package which contains the utility contract required to read the balances and allowances of users within the ERC-20 state.
