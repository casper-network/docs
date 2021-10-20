# Delegation Details

This section provides a detailed explanation of the delegation cost mechanism, how the gas cost relates with delegations, where to find the details etc... Please note that the cost amounts are likely to change with time and you may have to check the latest release details to get the most up-to-date and accurate details.

## Delegation Cost

**How much does delegation cost?**

The delegation cost is defined in the chainspec.toml file for each Casper network. In this [example chainspec](https://github.com/casper-network/casper-node/blob/release-1.3.2/resources/production/chainspec.toml), the delegation is set to cost 2.5 CSPR. However, `when you perform the delegation, you see that it costs a little more` than what is specified in the chainspec. Let’s discuss why this happens.

When you delegate, the system automatically charges some gas to set up related data in the global state of the network to track your delegation. This cost is addition to the delegation cost defined in the chainspec file.

For example, the chainspec file in release 1.3.2 will contain the following information. This is how the delegation cost is defined in the chainspec.toml file of a Casper network.

<p align="center"><img src="../image/economic-delegationCost.png"  alt="cost" width="400" class="center"/></p>

<p align="center">

**Figure 1** : Delegation cost is defined in the chainspec.toml file of a Casper network

</p>

### Delegation Fees

Delegation fees may change over time, so, it is essential to stay up to date. To do so, select the latest release in [Github](https://github.com/casper-network/casper-node), and navigate to the chainspec.toml file.

If you are unsure about anything, please join the [Discord channel](https://discord.gg/PjAQVXRx4Y) to ask us questions.

### First-time Delegation

If you perform the delegation for the first time, the system charges some gas to create a purse to hold the delegated tokens.

_Example:_ The system can charge 0.5 CSPR in addition to the base delegation fee of 2.5 CSPR, resulting in a delegation cost of 3 CSPR on [Mainnet](https://cspr.live/)

It is essential to have enough funds in your account when you set up a delegation transaction. Otherwise, the transaction will fail, and you will lose the transfer cost. For example, if you have 200 CSPR in your account, delegate at most 197 CSPR and leave at least 3 CSPR for the delegation cost. Another option is to delegate 195 CSPR and leave some additional buffer.

**Transaction Fee**

As a result, whenWhen performing a [delegation using the command line](../workflow/delegate.md) , we recommend you specify a little more than the base transaction payment to ensure that the transaction will go through without failure.

<p align="center"><img src="../image/economic-delegationDetails.png"  alt="details" width="400" /> </p>

<p align="center">

**Figure 2** : On Testnet or Mainnet, the transaction fee for a delegation is a little bit higher than 2.5 CSPR </p>

---

**_NOTE:_**

Transaction costs depend on each Casper network and the cost tables defined in the chainspec. The examples you will find in the documentation are general

---

Lastly, we recommend that you try out delegations on the [Casper Testnet](https://testnet.cspr.live/>) before making actual transactions on the [Casper Mainnet](https://cspr.live/). This way, you will understand the costs involved in delegating tokens.
