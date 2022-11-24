# Unbonding as a Validator

Once a bid is placed, it will remain in the state of the auction contract, even if the bid fails to win a slot right away. This is because new slots may become available if bonded validators leave the network or reduce their bond amounts. Therefore, a bid must be explicitly withdrawn to remove it from the auction. Bonded validators also have a bid in the auction; to unbond stake, this bid must be reduced. Since tokens will be transferred out of the bid purse, it's essential to compile the contract to withdraw the bid yourself so there is confidence in the correctness of the contract. The process is essentially the same as bonding but uses a different contract, `withdraw_bid.wasm`.

## Withdrawal Request {#withdrawal-request}

To withdraw a bid, compile the contract and submit a deploy:

```bash
sudo casper-client put-deploy \
--chain-name <CHAIN_NAME> \
--node-address http://<HOST>:<PORT> \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
--payment-amount 300000000 \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'" \
--session-arg="unbond_purse:opt_uref=null"
```

Note the following command options: 
- The chain name for Mainnet is `casper` and for Testnet is `casper-test`
- The default port for node address is 7777
- The path to the contract and keys
- The session arguments need to be encased in double-quotes, with the parameter values in single quotes
- The payment amount is specified in motes

### Contract Arguments {#contract-arguments}

The withdraw_bid contract accepts 3 arguments:

- `public key`: The hexadecimal public key of the account to withdraw. This key must match the secret key that signs the deployment and has to match the public key of a bid in the auction contract.
- `amount`: This is the amount that is being withdrawn.
- `unbond_purse` (optional): The purse to which the withdrawal amount will be remitted. Defaults to the main purse for the account if not provided.

### Example Request

Here is an example request to unbond stake:

```bash
sudo -u casper casper-client put-deploy \
 --chain-name casper-test \
 --node-address http://65.21.235.219:7777 \
 --secret-key /etc/casper/validator_keys/secret_key.pem \
 --session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
 --payment-amount 3000000000 \
 --session-arg="public_key:public_key='01da0e438afc74181beb2afae798e9e6851bdf897117a306eb32caafe46c1c0bc8'" \
 --session-arg="amount:u512='5000000000000'" \
 --session-arg="unbond_purse:opt_uref=null"
```


## Check the Auction Contract {#check-the-auction-contract}

Check the auction contract for updates to the bid amounts.

```bash
casper-client get-auction-info --node-address http://<HOST:PORT>
```

## Unbonding Wait Period {#unbonding-wait-period}

In order to prevent 'long range attacks', requests to unbond must go through a mandatory wait period. This wait period is presently set to 15 eras.
