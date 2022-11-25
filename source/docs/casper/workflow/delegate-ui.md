import useBaseUrl from '@docusaurus/useBaseUrl';

# Delegating Tokens with a Block Explorer

## Introduction {#introduction}

This tutorial shows you how to delegate your Casper tokens to a validator on the network.

Casper and other Proof-of-Stake protocols allow token holders to earn rewards and participate in the protocol through a mechanism called **delegation** or **staking**. We will use these terms interchangeably in this guide. See the [Staking Key Concepts](/staking) page for more details about the differences.

<!-- Adding a link to the video, although it is not working yet.
## Video Tutorial {#video-tutorial}

This video guide covers the process at a high level, but we recommend following the written tutorial to go through the process step by step.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=cR3v8AthlkQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
-->

## Prerequisites

1. To stake tokens with a validator, you need access to a wallet with CSPR tokens. One option is the [Casper Signer](https://chrome.google.com/webstore/detail/casper-signer/djhndpllfiibmcdbnmaaahkhchcoijce), and you can follow [the Signer Guide](/workflow/signer-guide) for more details. 
2. You may need to [fund the account](/workflow/funding-from-exchanges) you wish to use for delegating tokens.
3. Connect to a block explorer to set up the delegation. This guide uses [cspr.live](https://cspr.live/) and the Casper Signer.
4. [Review your account](#account-review) details before starting the process.
5. Review the current [delegation fees](/staking#delegation-fees) and ensure you have extra CSPR in your account apart from the amount you are delegating. Otherwise, the delegation might fail.

### Reviewing your Account {#account-review}

Once connected to the Casper blockchain, we recommend reviewing the active account you wish to use for delegating tokens. 

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

## Delegation Process {#delegation-process}

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

1.  Click **Sign** with the Casper Signer.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.5.png")} alt="6.5" width="400"/>

2.  Once the Signer app window opens, **make sure that the Deploy hash in the Signer window matches the Deploy hash in https://cspr.live/ before continuing!**

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.6.png")} alt="6.6"/>

3.  Click **Sign** in the Signer window to sign and finalize the transaction. You have completed the delegation.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.7.png")} alt="6.7" width="400"/>

The delegation transaction initiates as soon as the corresponding deploy is signed. You can review the details and status of the deploy by clicking **Deploy Details**. Now that you have everything set up, subsequent delegation operations will be much easier.

## Monitoring {#monitoring}

We recommend that you check in on how your stake is performing. The following points are important to understand and will be helpful in maximizing your rewards.

If the validator you staked with decides to unbond, your stake will also be unbonded. Make sure that the validator you have selected is performing as per your expectations.

Validators have to win a staking auction by competing for a validator slot with prospective and current validators. This process is permissionless, meaning validators can join and leave the auction without restrictions, except for the unbonding wait period, which lasts 14 hours.

Staking rewards are delivered to your account after each era, which is currently set to 2 hours. Note that it may take up to 2 eras (4 hours) for the first reward to appear after delegation. The rewards are automatically added to your current stake on the corresponding validator. You may view them under the _Rewards_ tab on your account details page on <https://cspr.live/>.

## Undelegating Tokens {#undelegating-tokens}

If you want to undelegate your tokens, you can do so at any time. See the [Undelegation Guide](/workflow/undelegate-ui) for step-by-step instructions.
