# Unbonding as a Validator

Once a bid is placed, it will remain in the state of the auction contract, even if the bid fails to win a slot immediately. New slots may become available if bonded validators leave the network or reduce their bond amounts. Therefore, a bid must be explicitly withdrawn to remove it from the auction.

## Method 1: Unbonding with the System Auction Contract {#withdraw-system-auction}

This method withdraws a bid using the system auction contract. Call the existing `withdraw_bid` entry point from the system auction contract. Using this method, you do not need to build any contracts, reducing costs and complexity.

```bash
sudo -u casper casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT_IN_MOTES> \
--session-hash <SESSION_HASH> \
--session-entry-point withdraw_bid \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes. This entry point call needs 2.5 CSPR for node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml)
5. `session-hash` - Hex-encoded hash of the stored auction contract, which depends on the network you are using. For Casper's Mainnet and Testnet, the hashes are as follows:

- **Testnet**: `hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`
- **Mainnet**: `hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

6. `session-entry-point` - Name of the entrypoint that will be used when calling the contract

The `withdraw_bid` entry point expects two arguments, while the third one is optional:

7. `public key`: The hexadecimal public key of the account's purse to withdraw. This key must match the secret key that signs the deploy and has to match the public key of a bid in the auction contract
8. `amount`: The amount being withdrawn

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

Calling the `withdraw_bid` entry point on the auction contract has a fixed cost of 2.5 CSPR.

:::

**Example:**

This example command uses the Casper Testnet to withdraw 5 CSPR from the bid:

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777 \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point withdraw_bid \
--session-arg "public_key:public_key='01c297d2931fec7e22b2fb1ae3ca5afdfacc2c82ba501e8ed158eecef82b4dcdee'" \
--session-arg "amount:U512='$[5 * 1000000000]'"
```

Below is the same command with the optional purse set to a different purse where the amount will be returned. **Adjust all the values to your use case.**

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777 \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--payment-amount 2500000000 \
--session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
--session-entry-point withdraw_bid \
--session-arg "public_key:public_key='01c297d2931fec7e22b2fb1ae3ca5afdfacc2c82ba501e8ed158eecef82b4dcdee'" \
--session-arg "amount:U512='$[5 * 1000000000]'"
```

## Method 2: Unbonding with Compiled Wasm {#withdraw-compiled-wasm}

There is a second way to withdraw a bid, using the compiled Wasm `withdraw_bid.wasm`. The process is the same as bonding but uses a different contract.

```bash
sudo -u casper casper-client put-deploy \
--node-address <HOST:PORT> \
--secret-key <PATH> \
--chain-name <CHAIN_NAME> \
--payment-amount <PAYMENT_AMOUNT> \
--session-path <PATH>/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
--session-arg="public_key:public_key='<PUBLIC_KEY_HEX>'" \
--session-arg="amount:u512='<AMOUNT_TO_WITHDRAW>'"
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777
2. `secret-key` - The file name containing the secret key of the account paying for the Deploy
3. `chain-name` - The chain-name to the network where you wish to send the Deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*
4. `payment-amount` - The payment for the Deploy in motes estimated
5. `session-path` - The path to the compiled Wasm on your computer

The `withdraw_bid.wasm` expects two arguments, while the third one is optional:

6. `public key`: The hexadecimal public key of the account's purse to withdraw. This key must match the secret key that signs the deploy and has to match the public key of a bid in the auction contract
7. `amount`: The amount being withdrawn

The command will return a deploy hash, which is needed to verify the deploy's processing results.

:::note

This method is more expensive than calling the `withdraw_bid` entrypoint in the system auction contract, which has a fixed cost of 2.5 CSPR.

:::

**Example:**

Here is an example request to unbond stake using the `withdraw_bid.wasm`. The payment amount specified is 4 CSPR. You must modify the payment and other values in the deploy based on the network's [chainspec.toml](../../concepts/glossary/C.md#chainspec).

```bash
sudo -u casper casper-client put-deploy \
--node-address http://65.21.75.254:7777 \
--secret-key /etc/casper/validator_keys/secret_key.pem \
--chain-name casper-test \
--session-path $HOME/casper-node/target/wasm32-unknown-unknown/release/withdraw_bid.wasm \
--payment-amount 4000000000 \
--session-arg="public_key:public_key='01c297d2931fec7e22b2fb1ae3ca5afdfacc2c82ba501e8ed158eecef82b4dcdee'" \
--session-arg="amount:u512='1000000000000'"
```


## Check the Auction Contract {#check-the-auction-contract}

Check the auction contract for updates to the bid amounts.

```bash
casper-client get-auction-info --node-address http://<HOST:PORT>
```

## Unbonding Wait Period {#unbonding-wait-period}

To prevent long-range attacks, requests to unbond must go through a mandatory wait period, currently set to 7 eras lasting approximately 14-16 hours.
