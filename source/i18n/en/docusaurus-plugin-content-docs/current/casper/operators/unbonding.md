# Unbonding

Once a bid is placed, it will remain in the state of the auction contract. Even if the bid does not win a slot right away. The reason for this is that new slots may become available if bonded validators leave the network, or reduce their bond amounts. Therefore, a bid must be explicitly withdrawn in order to remove the bid from the auction. Bonded validators also have a bid in the auction, to unbond stake, this bid must be reduced. Since tokens will be transferred out of the bid purse, it's important to compile the contract to withdraw the bid yourself, so there is confidence in the correctness of the contract. The process is essentially the same as bonding, but uses a different contract, `withdraw_bid.wasm`.

## Withdrawal Request

Note the path to files and keys. Note: the session arguments need to be encased in double quotes, with the parameter values in single quotes. Note the required payment amount. It must contain at least 12 zeros. Payment amount is specified in motes.

To withdraw a bid, compile the contract & submit a deploy:

```bash

casper-client put-deploy --chain-name <CHAIN_NAME> --node-address http://<HOST>:<PORT> --secret-key <VALIDATOR_SECRET_KEY>.pem --session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm --payment-amount 1000000000 --session-arg="public_key:public_key='<VALIDATOR_PUBLIC_KEY_HEX>'" --session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'" --session-arg="unbond_purse:opt_uref=null"
```

## Contract Arguments

The withdraw_bid contract accepts 3 arguments:

-   public key: The public key in hex of the account to withhdraw. Note: This has to be the matching key to the validator secret key that signs the deploy, and has to match the public key of a bid in the auction contract.
-   amount: This is the amount that is being withdrawn.
-   unbond_purse (optional): The purse to which the withdrawal will be remitted. Defaults to the main purse for the account if not provided.

Similar to bonding (bidding) - check the auction contract for updates to the bid amounts.

## Unbonding Wait Period

In order to prevent 'long range attacks', requests to unbond must go through a mandatory wait period. This wait period is presently set to 15 eras.
