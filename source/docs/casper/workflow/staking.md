import useBaseUrl from '@docusaurus/useBaseUrl';

# How to Stake your CSPR

## 1. Introduction {#1-introduction}

Casper and other Proof-of-Stake protocols allow token holders to earn rewards and participate in the protocol through a mechanism called **staking**. This tutorial shows you how to stake your Casper tokens with a validator on the network. This process is also called **delegation**. We will use these terms interchangeably in this guide, but we will explain the technical difference for clarity.

<!-- Removing the video until we have time to refresh it.
This video guide covers the process at a high level, but we recommend following the written tutorial to go through the process step by step.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4C7L5lS284c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 -->

**Staking**

Node operators stake their own tokens to earn the eligibility to propose and approve blocks on the network. For this reason, we also refer to them as validators. They also run and maintain servers connected to the Casper Network. With these actions, node operators enable the Proof-of-Stake aspect of the network. This process is different from mining tokens. Validators thus earn rewards for participating and for securing the network.

**Delegating**

You can also participate in the protocol to earn rewards without maintaining a Casper node (a server that stores a copy of the blockchain). To accomplish this, you can delegate or allocate your CSPR tokens to a chosen node operator on the network. The node operator will retain a commission, which is a percentage of the rewards generated from your staked tokens. By participating in the protocol this way, you help improve the network's decentralization and security and earn rewards in return. The base annual reward rate is currently 8% of the total supply.

This tutorial will show you how to earn rewards by delegating your Casper tokens. We will also cover the steps to undelegate your tokens at the end of the tutorial.

## 2. Staking Overview {#1-staking-overview}

Staking the process by which node operators participate in the blockchain network. It is important to understand the fundamentals of staking because when you delegate your tokens to a validator, they will be staking those tokens on your behalf. Here are a few common topics related to staking, but we encourage you to do your own research.

**Slashing**

Presently Casper does not slash if a node operator equivocates or misbehaves. If a node equivocates, other validators will ignore its messages, and the node will become inactive.

**Commission**

Node operators (also known as validators) define a commission they take to provide staking services. This commission is a percentage of the rewards node operators take for their services.

**Rewards**

Validators receive rewards, proportional to their stake, for participating in the network. Delegators receive a portion of the validator's rewards, proportional to what they staked, minus the validator's commission (or delegation rate).

**Validator Selection**

As a prospective delegator, you need to select a validating node that you can trust. Please do your due diligence before you stake your tokens with a validator.

## 3. Creating your Wallet with the CasperLabs Signer {#3-creating-your-wallet-with-the-casperlabs-signer}

To stake tokens, you need access to a wallet with CSPR tokens. At the moment, you can use the [CasperLabs Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce) tool. The Signer acts as your CSPR wallet, keeping your accounts secure and helping you perform actions like staking, un-staking, or sending tokens to another account. Please follow the [Signer Guide](signer-guide.md) for additional details on how to set up this tool.

You can create, store, and use one or more CSPR accounts with your Signer wallet. A password protects all accounts in what we call a **vault**.

### 3.1 Signing in to the CasperLabs Signer {#31-signing-in-to-the-casperlabs-signer}

If you are new or have logged out of the Signer, you can log in with these steps:

1.  Using Chrome or a Chromium-based browser like Brave, navigate to a block explorer on the Mainnet, (for this example we are using [cspr.live](https://cspr.live/)), and click on the **Sign-in** menu.
2.  Download the [CasperLabs Signer extension](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce).
3.  You will need to create a vault that will safeguard your accounts with a password. In this step, we assume that you have not used the Signer before, so click **Reset Vault**.
4.  Create a password for your new vault. Confirm the password, and then click **Create Vault**.
5.  Write down and store your password in a secure location. **If you lose it, you will lose access to this wallet!**
6.  Open the Signer extension and log into your vault.
7.  Click on the hamburger menu icon to select from a range of options. Notice that the checkmark indicates the active account.
8.  From this menu, you can perform essential management functions, such as editing accounts, deleting accounts, or viewing and downloading your keys.
9.  You can also view websites and dApps to which your accounts are connected.
10. One essential function is the ability to download your keys and store them in a secure location. If you lose access to the vault, you can create a new vault with the downloaded files. 

### 3.2 Creating a New Account {#32-creating-a-new-account}

If you are using the CasperLabs Signer for the first time, follow these steps to create an account and **download the account's secret key**:

1.  Click **CREATE ACCOUNT** in the Signer.
2.  Give your account a name. In this tutorial, we will use the name _My-CSPR_.
3.  Select an Algorithm using the dropdown menu. If you need help, review the article on [Working with Cryptographic Keys](https://docs.casperlabs.io/dapp-dev-guide/keys).
4.  Click **CREATE** to save your account.
5.  Click **DOWNLOAD** and save the secret key for this account. 

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/3.2.5.1.png")} alt="3.2.5.1" width="200" />

:::note

**If you lose the secret key file and your vault password, you will lose access to the account and the tokens stored in the account.**

If you lose the vault password you created but still have the secret key file, you can import your account into a new vault, as shown in the next section.

We recommend moving your secret key to an offline location without Wi-Fi. Also, consider backing up your secret key in multiple locations if one location becomes compromised.

:::

### 3.3 Importing an Existing Account {#33-importing-an-existing-account}

If you already have your secret key and would like to set up and use your wallet with an existing account, you can do so with the following steps.

1.  Import your existing account by clicking the **IMPORT ACCOUNT** button.
2.  Then, click on the **UPLOAD** button and select your secret key file (the file with the secret_key.cer or secret_key.pem extension).
3.  Give your account a name and click on the **IMPORT** button to complete the import operation.
4.  Repeat these steps for all the accounts you would like to import into your wallet.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/3.3.4.1.png" )}alt="3.3.4.1" width="200" />

Now that you have your CasperLabs Signer wallet, you can continue to connect to the Mainnet blockchain.

## 4. Connecting to a Block Explorer {#4-connecting-to-blockexplorer}

Using the active account in the Signer tool, connect to the Casper blockchain by clicking on the **DISCONNECTED** button to toggle the connection. For this example, we are using the [cspr.live](https://cspr.live/) block explorer.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.1.png")} alt="4.1" width="200" />

Approve the connection by clicking the **CONNECT** button.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.2.png")} alt="4.2" width="200" />

You are now in the block explorer and connected to the Casper blockchain using your active account!

Next, click on **View Account** in the top right corner.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.3.png")} alt="4.3" width="300" />

You will see the following fields:

-   The **Public Key** is the address of your Casper Mainnet account.
-   The **Account Hash** is a 32-byte identifier derived from the public key. The platform uses it to verify transactions.
-   The **Liquid Account Balance** represents the tokens you have for immediate use.
-   The **Delegated Account Balance** represents your delegated tokens staked with validators on the network.
-   You will also see **Total Rewards Received** on the account page.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.4.png")} alt="4.4" width="800" />

If you wish, you can also explore the _Transfers_, _Deploys_, _Delegations_, and _Staking Rewards_ tabs.

In this tutorial, we are interested in the _Delegations_ tab, where you can see a list of validators to which you have delegated tokens and the amount you have delegated.

You will see details about your rewards in the _Staking Rewards_ tab, such as the validator you have staked with and the amount you have received for each era.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.5.png")} alt="4.5"/>

**Delegation Fees**

It is important to know that the cost of the delegation process is approximately 3 CSPR. Ensure you have extra CSPR on your account apart from the amount you are delegating; otherwise, the transaction will fail. For example, if you want to delegate 1000 CSPR, you need to have at least 1003 CSPR in your account.

## 5. Funding your Account {#5-funding-your-account}

**IMPORTANT NOTE:** If you want to send your CSPR coins from an exchange to this account, you need to copy the **Public Key** value. Use the quick copy button to the right of the public key address to copy it. Then set up a withdrawal request from the exchange using the public key.

The transfer from an exchange takes a few minutes. After your tokens arrive in your account, you can delegate them. This section demonstrates a withdrawal from the Coinlist exchange <http://coinlist.co/> to the [Casper Mainnet on cspr.live](https://cspr.live/).

### 5.1 Transfer CSPR from an Exchange {#51-transfer-cspr-from-an-exchange}

If you need to transfer your CSPR tokens from an exchange, you will need your **public key** from the account page.

If you already have funds in your Signer wallet, you can skip this section. If you are working with a different exchange, you need to contact that exchange directly.

1.  Log into your <https://coinlist.co/> account.
2.  Go to the **Wallet** tab.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.1.2.1.png")} alt="5.1.2.1" width="200" />

3.  Click on the **CSPR** section.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.1.3.1.png")} alt="5.1.3.1" width="200" />

4.  Click on the **Withdraw** button.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.1.4.1.png")} alt="5.1.4.1"/>

5.  Copy the **Public Key**. The screenshot below shows the account page on <https://cspr.live/> and the field that you need to copy from that page.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.1.5.1.png")} alt="5.1.5.1"/>

6.  Enter the **Public Key** in the **Recipient Address** field in the withdrawal request.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.1.6.1.png")} alt="5.1.6.1" width="400"/>

7.  Enter 0 in the **Transfer ID** field or another value that is meaningful to you. **You MUST enter a value or the transfer will fail!**
8.  Enter the CSPR amount you wish to transfer. **We recommend that you try these steps with a small amount of CSPR to verify you followed the steps correctly**. After one successful transfer, you will be more comfortable transferring larger amounts.
9.  Click **Review**.
10. Submit your transfer request. Wait approximately 5 minutes, and then go to the <https://cspr.live/> site to verify your transfer. On your account page, you should see that the **Liquid Account Balance** reflects the amount you have transferred.

Now you are ready to delegate your tokens.

## 6. Delegating Tokens {#6-delegating-tokens}

You can access the delegation functionality in two ways.

**Option 1:** Click **Wallet** from the top navigation menu and then click **Delegate**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.1.png")} alt="6.1" width="200"/>

**Option 2:** Click **Validators** from the top navigation menu. From the validators table, click on any validator to access their details. Once you find the validator to which you want to delegate tokens, click the **Delegate** button.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.2.png")} alt="6.2"/>

Then follow these instructions to delegate your tokens:

**Step 1 - Delegation Details**

1.  Start by choosing the validator to which you want to delegate your tokens. You can search for one using the search box or paste their public key if you have a validator in mind.
2.  Enter the amount of CSPR you would like to delegate.
3.  Click **Next**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.3.png")} alt="6.3" width="400"/>

**Step 2 - Confirm the Transaction**

1.  Review the details of the transaction.
2.  Enter the amount you want to delegate.
3.  If everything is correct, click **Next**. If you wish to change something, you can return to the previous step by clicking **Back to step 1**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.4.png")} alt="6.4"/>

**Step 3 - Sign the Transaction**

1.  Click **Sign** with the CasperLabs Signer.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.5.png")} alt="6.5" width="400"/>

2.  Once the Signer app window opens, **make sure that the Deploy hash in the Signer window matches the Deploy hash in https://cspr.live/ before continuing!**

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.6.png")} alt="6.6"/>

3.  Click **Sign** in the Signer window to sign and finalize the transaction. You have completed the delegation.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.7.png")} alt="6.7" width="400"/>

The delegation transaction initiates as soon as the corresponding deploy is signed. You can review the details and status of the deploy by clicking **Deploy Details**. Now that you have everything set up, subsequent delegation operations will be much easier.

## 7. Monitoring {#7-monitoring}

We recommend that you check in on how your stake is performing. The following points are important to understand and will be helpful in maximizing your rewards.

If the validator you staked with decides to unbond, your stake will also be unbonded. Make sure that the validator you have selected is performing as per your expectations.

Validators have to win a staking auction by competing for a validator slot with prospective and current validators. This process is permissionless, meaning validators can join and leave the auction without restrictions, except for the unbonding wait period, which lasts 14 hours.

Staking rewards are delivered to your account after each era, which is currently set to 2 hours. Note that it may take up to 2 eras (4 hours) for the first reward to appear after delegation. The rewards are automatically added to your current stake on the corresponding validator. You may view them under the _Rewards_ tab on your account details page on <https://cspr.live/>.

## 8. Undelegating Tokens {#8-undelegating-tokens}

If you want to undelegate your tokens, you can do so at any time. Note that the cost of the undelegation process is 0.5 CSPR. You can access the undelegate functionality in three ways.

**Option 1:** Click **Wallet** from the top navigation menu and then click **Undelegate Stake**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.1.png")} alt="8.1" width="200"/>

**Option 2:** Click **Validators** from the top navigation menu. From the validators table, click on any validator to access its details. Once you find the validator you wish to undelegate from, click the **Undelegate Stake** button.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.2.png")} alt="8.2"/>

**Option 3:** Go to your account details by clicking your public key in the top navigation menu or clicking **View Account** from the expanded menu. Then click on the **Delegations** tab, and click on the **Undelegate** button next to the entry you want to undelegate.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.3.png")} alt="8.3"/>

Then follow these instructions to undelegate your tokens:

**Step 1 - Undelegation Details**

1.  Start by choosing the validator from which you want to undelegate your tokens. If a validator is not already selected, you can search for one using the search box. The search box will automatically show you validators with which you have staked.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.4.png")} alt="8.4" width="400"/>

2.  Enter the amount of Casper tokens you want to undelegate.
3.  Click **Next**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.5.png")} alt="8.5" width="400"/>

**Step 2 - Confirm the Transaction**

1.  Review your transaction details.
2.  If everything looks correct, click **Confirm** to undelegate the tokens. If you wish to change something, you can return to the previous step by clicking **Back to step 1**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.6.png")} alt="8.6"/>

**Step 3 - Sign the Transaction**

1.  Click **Sign** with the CasperLabs Signer.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.7.png")} alt="8.7" width="400"/>

2.  Once the Signer app window opens, **make sure that the Deploy hash in the Signer window matches the Deploy hash in https://cspr.live/ before continuing**!

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.8.png")} alt="8.8"/>

3.  Click **Sign** in the Signer window to sign and finalize the transaction.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.9.png")} alt="8.9" width="400"/>

The stake undelegation initiates as soon as the corresponding deploy is signed. It may take 1-2 minutes for the undelegation details to become available. Please note that your undelegated tokens will appear in your account automatically after a 7-era delay, which is approximately 14 hours.

## Conclusion {#conclusion}

By staking your tokens, you help secure the network and earn rewards in return. Thank you for your trust and participation!

You can find additional information on the [docs.cspr.community](https://docs.cspr.community/) website.
