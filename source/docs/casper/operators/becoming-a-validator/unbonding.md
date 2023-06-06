# Unbonding as a Validator

Once a bid is placed, it will remain in the state of the auction contract, even if the bid fails to win a slot immediately. New slots may become available if bonded validators leave the network or reduce their bond amounts. Therefore, a bid must be explicitly withdrawn to remove it from the auction.

## Method 1: Withdrawing using a System Contract {#withdrawal-request}

Call the existing `withdraw_bid` entry point from the system auction contract to withdraw a bid. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
sudo -u casper casper-client put-deploy \
--chain-name <CHAIN_NAME> \
--node-address http://<HOST>:<PORT> \
--secret-key [PATH]/secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point withdraw_bid \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'" \
--session-arg="unbond_purse:opt_uref=null"
```

The `withdraw_bid` entry point expects three arguments:

- `public key`: The hexadecimal public key of the account's purse to withdraw. This key must match the secret key that signs the deployment and has to match the public key of a bid in the auction contract.
- `amount`: This is the amount that is being withdrawn.
- `unbond_purse` (optional): The purse to which the withdrawal amount will be remitted. Defaults to the main purse for the account if not provided.

**Example:**

This example command uses the Casper Testnet to withdraw 5 CSPR from the bid:

```bash
sudo -u casper casper-client put-deploy \
--chain-name casper-test \
--node-address http://localhost:7777/rpc \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point withdraw_bid \
--session-arg "public_key:public_key='<PUBLIC_KEY>'" \
--session-arg "amount:U512='$[5 * 1000000000]'" \
--session-arg "unbond_purse:opt_uref=null"
```

## Method 2: Withdrawing using a Compiled Wasm

There is a second way to withdraw a bid, using the compiled Wasm `withdraw_bid.wasm`. The process is the same as bonding but uses a different contract.

```bash
sudo -u casper casper-client put-deploy \
--chain-name <CHAIN_NAME> \
--node-address http://<HOST>:<PORT> \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
--payment-amount 4000000000 \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'" \
--session-arg="unbond_purse:opt_uref=null"
```

Note the following command options above: 
- The chain name for Mainnet is `casper`, and for Testnet is `casper-test`
- The default port for the node address is 7777
- The path to the contract and keys
- The session arguments need to be encased in double quotes, with the parameter values in single quotes
- The payment amount is specified in motes

The `withdraw_bid.wasm` expects the same three arguments as the entry point in Method 1 above:

- `public key`: The hexadecimal public key of the account's purse to withdraw. This key must match the secret key that signs the deployment and has to match the public key of a bid in the auction contract.
- `amount`: This is the amount that is being withdrawn.
- `unbond_purse` (optional): The purse to which the withdrawal amount will be remitted. Defaults to the main purse for the account if not provided.

**Example:**

Here is an example request to unbond stake using the `withdraw_bid.wasm`:

```bash
sudo -u casper casper-client put-deploy \
 --chain-name casper-test \
 --node-address http://65.21.235.219:7777 \
 --secret-key /etc/casper/validator_keys/secret_key.pem \
 --session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
 --payment-amount 4000000000 \
 --session-arg="public_key:public_key='01da0e438afc74181beb2afae798e9e6851bdf897117a306eb32caafe46c1c0bc8'" \
 --session-arg="amount:u512='1000000000000'" \
 --session-arg="unbond_purse:opt_uref=null"
```


## Check the Auction Contract {#check-the-auction-contract}

Check the auction contract for updates to the bid amounts.

```bash
casper-client get-auction-info --node-address http://<HOST:PORT>
```

## Unbonding Wait Period {#unbonding-wait-period}

To prevent long-range attacks, requests to unbond must go through a mandatory wait period, currently set to 7 eras lasting approximately 14-16 hours.
