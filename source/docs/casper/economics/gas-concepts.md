# Gas and the Casper Blockchain

## What is gas?

Gas is a conceptual measure of resources utilized when executing transactions on the blockchain. Gas cost is the amount of gas consumed during the processing cycles that execute a transaction on the network. It is directly correlated with the amount of computer processing a validator needs to provide in order to execute a transaction.

Gas fees are consumed on the network irrespective of whether your transaction was successful or not. Even when a transaction fails, you have to pay the transaction fee because your deploy consumed resources and space on the block as the validator attempted to execute it on your behalf. 

## How is gas cost determined?

The amount of gas required for a transaction is determined by how much code is executed on the blockchain. Currently, gas is priced at a fixed price of 1 mote (defined as 1x10^9 CSPR tokens) per 1 unit of gas. The gas charged for a transaction on the blockchain is paid to the validators who are operating the network.

## Why do we need gas cost?

Casper is a decentralized network of individual validators supplying their computational resources to keep the network live. As such, computations must be rate-limited and priced for the following reasons:

-   Rate-limiting is used to ensure a secure and live network:
    -   It prevents  a denial-of-service (DoS) attack. In computer networks, rate-limiting is used to control the rate of requests sent or received by a network to prevent DoS attacks. Gas behaves in a similar fashion, because each block permits only a fixed amount of transactions (gas) to be included in the era.
    -   It explicitly quantifies the system load. The gas cost helps us evaluate the use of computational resources and measure the amount of computational work that validators need to perform for each transaction. With this knowledge, we can specify minimum system requirements for validators.
-   Pricing leads to more meaningful transactions:
    -   Issuers of transactions and smart contract writers will be more aware of the limited network resources because there is a cost associated with each transaction. Pricing prevents users from spamming arbitrary amounts of empty transactions because there is a price to pay for each deploy.

## Why do I see an ‘Out of gas error’?

You might encounter an ‘Out of gas error’ when the gas payment you supplied  for the transaction was insufficient to cover the actual cost of computation for the transaction. The amount of gas required for a transaction is determined by how much code is executed on the blockchain and also the storage utilized. 

Here is an [example](https://cspr.live/deploy/afeb43036c41e667af8bc34782c48a66cf4da3818defe9f761291fa515cc38b9) of a transaction resulting in an ‘Out of gas error’ on the Mainnet.


**Figure 1**: In the Deploys tab of an account on [cspr.live](https://cspr.live/), a red exclamation mark is shown. By moving the cursor over it, the tooltip displays an 'Out of gas error'.

<img src="/static/image/gas-concepts/error-deploys.png" width="550" alt="Out of gas error" />

**Figure 2**: Click the specific deploy to see more details such as the deploy hash, cost, and the status as an 'Out of gas error'. This indicates that the transaction did not have sufficient payment to cover the gas required for it to complete successfully.

<img src="/static/image/gas-concepts/error-account.png" width="550" alt="Gas error in account" />


**Figure 3**: Click the **Show raw data** button, to see more details about the deploy. Towards the end of the raw data, you can see the error message.

<img src="/static/image/gas-concepts/error-raw.png" width="550" alt="Gas error in raw data" />


How do I determine the gas cost for a transaction?
----------------------------------------------------

Currently, we are hard at work to create tools to help you estimate gas costs. Meanwhile, we recommend using the NCTL tool on your local machine or the [Testnet](https://testnet.cspr.live/) to [deploy your contracts](https://docs.casperlabs.io/en/latest/dapp-dev-guide/deploying-contracts.html?highlight=gas%20cost#deploying-contracts) in a test environment. You can check a deploy status and roughly see how much it would actually cost when deployed. You can estimate the costs in this way and then add a small buffer if the network state has changed. Note that when estimating gas cost locally or on the Testnet, the blockchain specification needs to match the specification of the Mainnet, where you will need to pay for the transaction with actual Casper (CSPR) tokens.

## Why do I see a gas limit error?

You may sometimes see an error such as *‘payment: 2.5, cost: 2.5, Error::GasLimit’*, This message seems to say that the transaction cost is 2.5 CSPR and you paid 2.5 CSPR, yet the transaction resulted in an error. Let’s explore this error message a little further.

When a smart contract hits its gas limit (the payment amount), execution stops. If your limit is 2.5 CSPR, execution stops and that is the computation cost even if the smart contract did not run to completion. So, the error message tries to communicate to you that execution stopped at 2.5 CSPR. The computation resulted in an error because there were not enough funds to run to completion. It would have cost more than 2.5 CSPR to complete execution, but since you only supplied a payment of 2.5 CSPR worth of computation, the network stopped execution there and charged you that much, even though it was a failed transaction. The execution engine does not actually know how much it would have cost if allowed to run to completion, because it did not allow the contract to finish since the contract would have run over its gas limit.

