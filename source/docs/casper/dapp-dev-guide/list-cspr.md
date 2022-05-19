# Listing CSPR on Your Exchange

This topic describes how to add Casper token (CSPR) to your cryptocurrency exchange. 

CSPR is listed on over 25 exchanges worldwide. As a token, CSPR is very straightforward to integrate. Developers can complete integration and testing in a matter of days.

## Setting up a Node

Running a full node requires considerable computational/bandwidth resources. We recommend setting up at least one node, upgrading to newer versions promptly, and keeping an eye on service operations with a bundled monitoring tool. For setup instructions, see [Basic Node Setup](../operators/setup.md).

This setup enables you to:

-   Have a self-administered gateway to the Casper Network to get data and submit transactions
-   Have full control over how much historical block data is retained
-   Maintain your service availability even if one node fails

Casper nodes demand relatively high computing power. For specific requirements, please see [Hardware Requirements](../operators/hardware.md).

## Setting up Accounts

These are the steps to set up your account on the Casper Network:

1.  Generate the cryptographic keys for your account. For more information, see [Creating Keys](../dapp-dev-guide/keys.md#creating-accounts-and-keys-creating-accounts-and-keys)
2.  Upload your keys on the Mainnet or Testnet using a block explorer. For more information, see [Importing an Account](../workflow/signer-guide.md#3-importing-an-account).
3.  Fund your account on the [Mainnet](../dapp-dev-guide/keys.md#funding-your-account) or [Testnet](../workflow/testnet-faucet.md)

## Understanding Basic Transactions

The following basic transactions are what users of your exchange would require to deposit CSPR and confirm a deposit is made on your exchange.

### Transfer CSPR

When a user wants to deposit CSPR to your exchange, request them to send a transfer transaction to the appropriate deposit account. For details about the direct transfer command, see [Direct Token Transfer](../workflow/transfer-workflow.md). The following command transfers 10 CSPR from *account A* to *account B*.

```bash
casper-client transfer \
--id 1 \
--transfer-id 123456 \
--node-address http://<node-ip-address>:7777 \
--amount 10000000000 \
--secret-key <accountA-secret-key>.pem \
--chain-name casper \
--target-account <accountB-hex-encoded-public-key> \
--payment-amount 10000
```

### Confirm a Transfer

You can confirm if a transfer was successful, by verifying the source and target account balance. For more detailed instructions, see [Verifying a Transfer](../workflow/verify-transfer.md).


## Testing the integration



## SDKs

There are several well-maintained Software Development Kits (SDKs) available to use on the Casper Network, see [SDK Libraries](../dapp-dev-guide/sdk/index.md).


## Finality Signatures

Exchanges can check finality signatures from validators for additional security. Finality signatures are sent by validators after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. The default configuration of the Casper node provides event streaming on the `/events` endpoint of port `9999`.
    -   The FinalitySignature is emitted on `/events/sigs` endpoint, whenever a new finality signature is received.  



## The Casper Protocol ( NOT WORKED ON YET! )

-   Casper supports two types of keys, `secp256k1` and `ed25519`. In the global state, public keys are hashed using a one-way `blake2b` hash. When creating keys, it is strongly recommended that the account hash be stored along with the public and private keys. Keys can be created offline, and do not exist on the blockchain until CSPR is sent to an address.
-   Casper is integrated with BitGo for enterprise grade custody. If your exchange uses BitGo, support for Casper is available already.
-   Casper transactions are executed after they are finalized by the consensus. Transactions are not orphaned or uncle’d on Casper and neither does chain reorganization happen on it.
-   Exchanges can check finality signatures from validators for additional security. Finality signatures are sent by validators after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. The default configuration of the Casper node provides event streaming on the `/events` endpoint of port `9999`.
    -   The FinalitySignature is emitted on `/events/sigs` endpoint, whenever a new finality signature is received.  
    -   The DeployAccepted events are emitted on `/events/deploys` endpoint. This means when a deploy is received by the node and it passes the first set of validity checks, it is stored locally, gossiped to peers and enqueued for inclusion in a block - at this point the DeployAccepted event is emitted. 
    -   The other events such as BlockAdded, DeployProcessed, DeployExpired, Fault and Step are emitted on the `/events/main` endpoint.
        -   BlockAdded - This event is emitted whenever a new block is added to the blockchain.
        -   DeployProcessed - This event is emitted when the deploy processing is complete.
        -   DeployExpired - This event is emitted if a deploy is not added to a block for processing by a validator before the deploy's time to live (TTL) expires. 
        -   Fault - This event is emitted if there is a validator error.
        -   Step - This event is emitted at the end of every era. 


