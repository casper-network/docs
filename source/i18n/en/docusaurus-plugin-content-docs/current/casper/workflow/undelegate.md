# Undelegating Tokens

This document details a workflow where tokens delegated to a validator on a Casper network can be undelegated.

This workflow assumes:

1.  You meet the [prerequisites](setup.md)
2.  You are using the Casper command-line client
3.  You have an undelegation contract or WASM to execute on the network
4.  You have a valid `node-address`
5.  You have previously [deployed a smart contract](https://docs.casperlabs.io/en/latest/dapp-dev-guide/on-chain-contracts.md) to a Casper Network
6.  You have delegated tokens to a validator

## Building The Undelegation WASM {#building-the-undelegation-wasm}

Obtain the `undelegate.wasm` by cloning the [casper-node](https://github.com/casper-network/casper-node) repository and building the contracts.

To build contracts, set up Rust, and install all dependencies. Visit [Setting up Rust](https://docs.casperlabs.io/en/latest/dapp-dev-guide/setup-of-rust-contract-sdk.md) in the Developer Guide for step-by-step instructions.

Once you build the contracts, you can use the `undelegate.wasm` to create a deploy that will initiate the undelegation process. The WASM can be found in:

    target/wasm32-unknown-unknown/release

## Sending the Undelegation Deploy {#sending-the-undelegation-deploy}

Send a deploy containing the `undelegate.wasm` to the network to initiate the undelegation process.

Below is an example of an undelegation request using the Casper command-line client:

```bash
casper-client put-deploy \
--node-address http://<peer-ip-addres>:7777/rpc \
--chain-name casper \
--session-path <path-to-wasm>/undelegate.wasm \
--payment-amount 2500000000 \
--session-arg "validator:public_key='<hex-encoded-validator-public-key>'" \
--session-arg "amount:u512='<amount-to-delegate>'"
--session-arg "delegator:public_key='<hex-encoded-public-key>'" \
--secret-key <delegator-secret-key>.pem
```

**Note** The delegator's public key and the secret key that signs the deploy must be part of the same key pair.

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned

-   `node-address` -<HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for testnet is **casper-test**
    -   The _chain-name_ for mainnet is **casper**

-   `session-path` - The path to where the `delegate.wasm` is located

-   `session-arg` - The arguments to the `delegate` execution

    -   The argument `validator` is the public key of the validator from whom the tokens will be undelegated
    -   The argument `amount` is the number of tokens to be undelegated
    -   The argument `delegator` is the public key of the account undelegating tokens from a validator

## Asserting the Undelegation {#asserting-the-undelegation}

You can use the Casper command-line client to generate an RPC request to query the auction state. The subsequent RPC response will confirm that the undelegation request was successfully executed.

Here is how you can check the status of the auction to confirm that your bid was withdrawn:

```bash
casper-client get-auction-info \
--node-address http://<peer-ip-address>:7777/rpc
```

**Request fields**:

-   `node-address` -<HOST:PORT> Hostname or IP and port of node on which HTTP service is running \[default:<http://localhost:7777>\]

If the public key and the amount are absent from the `bids` structure, we can safely assert that we have indeed undelegated from the validator.

If your account is on the official Testnet or Mainnet, you can use the block explorer to look up your account balance and see that the tokens have been added to your balance:

1.  [Testnet explorer](https://testnet.cspr.live/)
2.  [Mainnet explorer](https://cspr.live/)

**Important Note**: After undelegating tokens from a validator, you must wait for the unbonding period to lapse before re-delegating tokens to either the same validator or a different validator.
