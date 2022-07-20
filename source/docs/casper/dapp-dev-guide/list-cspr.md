# Listing CSPR on Your Exchange

This topic describes how to list Casper token (CSPR) on a cryptocurrency exchange. 

CSPR is listed on [many exchanges](https://tokenmarketcaps.com/coins/casper/market) worldwide. It usually takes 1 to 3 days to list CSPR on an exchange.


## Setting up a Node

While it is not necessary for an exchange to operate their own node on the Casper Network, we recommend that exchanges handling moderate to high volume of transaction activity, do run their own node. A node operated by an exchange does not have to be a validating node, it can be a read-only node. For setup instructions, see [Basic Node Setup](../operators/setup.md).

This setup enables you to have a self-administered gateway to the Casper Network to get data and submit transactions.

## Casper Account

You will need a Casper Account to handle the transactions on an exchange. Casper has an [Account model](../design/accounts.md) and instructions on how to [create an Account](../design/accounts.md/#accounts-creating). 

For your exchange, you would need at least one Account. Casper Network uses an Account model that holds on to general resources as well as token and provides an on-chain identity. As an exchange if you are dealing with high-volume of transaction activity, you might need a main account for the exchange platform and handle sub-accounts for other users. 

## Understanding Basic Transactions

We have a token and transaction model with different levels of support that ranges from convenience to robustness. Usually, when you are transferring Casper tokens between two parties, the native two-party transfer will suffice.

Casper supports native two-party transfers as well as bulk transfer using custom Wasm. The native transfer is ideal when you need to perform a one-to-one transfer between two accounts. Whereas, the custom Wasm transfer can be used when you are making bulk transfers. A custom Wasm transfer allows you to do multiple transfers in a single deploy, which makes it a more cost effective method. 

### Native transfer

Native transfer can be used to transfer tokens between two accounts. For details about the native transfer command, see [Direct Token Transfer](../workflow/transfer-workflow.md). The following command transfers 10 CSPR from *account A* to *account B*.

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

### Bulk or custom Wasm transfer

Bulk or custom Wasm transfers can be used when you need to apply some logic before or after the transfer or if the transfer is conditional, also if you are doing a series of transfers between multiple accounts. You can use the following five functions for transferring tokens in bulk using custom Wasm transfer:

-   `transfer_to_account`: Transfers amount of motes from the default purse of the account to target account. If the target does not exist it is created. Can be called from session code only and not a contract as a contract doesn't have a main purse.
-   `transfer_to_public_key`: Transfers amount of motes from the main purse of the caller’s account to the main purse of the target. If the account referenced by target does not exist, it is created. Can be called from session code only and not from a contract as a contract doesn't have a main purse.
-   `transfer_from_purse_to_purse`: Transfers amount of motes from source purse to target purse. If the target does not exist the transfer fails.
-   `transfer_from_purse_to_public_key`: Transfers amount of motes from source to the main purse of target. If the account referenced by target does not exist, it is created.
-   `transfer_from_purse_to_account`: Transfers amount of motes from source purse to target account. If the target does not exist it is created.

## Integrating CSPR

You can integrate with the [JSON-RPC API](../dapp-dev-guide/sdkspec/introduction.md) of a node on the Casper Network. 
You can programme directly against the RPC or if you prefer you can choose from the variety of SDK libraries that are available to use on the Casper Network see [SDK Libraries](../dapp-dev-guide/building-dapps/sdk/index.md). 
Casper also provides a stream server that gives you real-time information about a variety of events occurring on a node, you can use this, however, it is not required. You might want to use this feature as you will be notified of events instead of asking periodically. For more information about various events, see [Monitoring and Consuming Events](../dapp-dev-guide/building-dapps/monitoring-events.md).

## Testing the Integration

Our recommended testing mechanism is to have a test environment that points at the official Casper [Testnet](https://testnet.cspr.live/) and run production like operations of your test exchange against the test environment. However, if you are not doing this and you just want to integrate with the [Mainnet](https://cspr.live/), then you can do so with your own test accounts. 

If you are not going to do a Testnet integration, then we suggest you create some additional test accounts and test the transactions on the Mainnet through your software prior to moving to the general public.

## The Casper Protocol

-   Casper is integrated with BitGo for enterprise grade custody. If your exchange uses BitGo, support for Casper is available already.
-   Casper has a execution after consensus model, which means that transactions are executed after they are finalized. Transactions are not orphaned or uncle’d on Casper and neither does chain reorganization happen on it. For more information on the execution process, see [Execution Semantics](../design/execution-semantics.md).
-   Exchanges can check finality signatures. Finality signatures are sent by validators after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. For more information about various events, see [Monitoring and Consuming Events](../dapp-dev-guide/building-dapps/monitoring-events.md).


