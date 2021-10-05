# Delegation Details

This section provides a detailed explanation of the delegation cost mechanism, how the gas cost relates with delegation, where to find the details etc... Please note that the cost amounts are likely to change with time and you may have to the check latest release details to get the most up-to-date and accurate details.

## Delegation Cost

The delegation cost is defined in the chainspec.toml file for each Casper network. In this example chainspec, the delegation is set to cost 2.5 CSPR. However, when you perform the delegation, you see that it costs a little more than what is specified in the chainspec. Let’s discuss why this happens.

When you delegate, the system automatically charges some gas to set up specific data in global state to track your delegation. This cost is additional to the delegation cost defined in the chainspec file.

**Figure 1**: This is how delegation cost is defined in the chainspec.toml file of a Casper network.

<img src="../image/economic-delegationCost.png"  alt="cost" width="400" class="center"/>

### First-time Delegation

If you perform the delegation for the first time, the system charges some gas to create a purse to hold the delegated tokens.

**_Example_:** The system can charge 0.5 CSPR in addition to the base delegation fee of 2.5 CSPR, resulting in a delegation cost of 3 CSPR on Mainnet.

It is essential to have enough funds in your account when you set up a delegation transaction. Otherwise, the transaction will fail, and you will lose the transfer cost. For example, if you have 200 CSPR in your account, delegate at most 197 CSPR and leave at least 3 CSPR for the delegation cost. Another option is to delegate 195 CSPR and leave some additional buffer.

### Delegation Fees

Delegation fees may change over time, so, it is essential to stay up to date. To do so, select the latest release in Github, and navigate to the chainspec.toml file. For example, in release 1.3.2, this is the corresponding chainspec. If you are unsure, please join the Discord channel to ask questions.

**Figure 2**: On Testnet or Mainnet, the transaction fee for a delegation is a little bit higher than 2.5 CSPR.

<img src="../image/economic-delegationDetails.png"  alt="details" width="400" align="center"/>

When performing a delegation using the command line, we recommend you specify a little more than the base transaction payment to ensure that the transaction will go through.

Transaction costs depend on each Casper network and the cost tables defined in the chainspec. The examples you will find in the documentation are general.

We recommend that you try out delegations on the Casper Testnet before making actual transactions on the Casper Mainnet. This way, you will understand the costs involved in delegating tokens.
