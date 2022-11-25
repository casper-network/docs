import useBaseUrl from '@docusaurus/useBaseUrl';

# Delegating Tokens with a Block Explorer

## Introduction {#introduction}

This tutorial covers how to delegate Casper tokens to a validator on the network.

Casper and other Proof-of-Stake protocols allow token holders to earn rewards and participate in the protocol through a mechanism called **delegation** or **staking**. We will use these terms interchangeably in this guide. See the [Staking Key Concepts](/staking) page for more details about the differences.

## Prerequisites

1. To stake tokens with a validator, you need access to a wallet with CSPR tokens. One option is the [Casper Signer](https://chrome.google.com/webstore/detail/casper-signer/djhndpllfiibmcdbnmaaahkhchcoijce), and you can follow [the Signer Guide](/workflow/signer-guide) for more details. 
2. You may need to [fund the account](/workflow/funding-from-exchanges) you wish to use for delegating tokens.
3. Connect to a block explorer to set up the delegation. This guide uses [cspr.live](https://cspr.live/) and the Casper Signer.
4. [Review your account](#account-review) before starting the process.
5. Review the current [delegation fees](/staking#delegation-fees) and ensure you have extra CSPR in your account apart from the amount you are delegating. Otherwise, the delegation might fail.

### Reviewing your Account {#account-review}

Once connected to the Casper blockchain, we recommend reviewing the active account you wish to use for delegating tokens, especially these fields:

- The **Liquid Account Balance**, representing the tokens you have for immediate use
- The **Delegated Account Balance**, representing the delegated tokens already staked with validators on the network
- The **Delegations** tab, listing the validators to whom you have delegated tokens

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/2.delegations.png")} alt="Account and delegations details" width="800" />

- The **Staking Rewards** tab, showing the rewards received in each era

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/3.rewards.png")} alt="Account and rewards" width="800" />

## Accessing the Delegation Feature {#delegation-access}

You can access the delegation functionality in two ways.

**Option 1:** Click **Wallet** from the top navigation menu and then click **Delegate**. In the next screen, you will need to specify the validator's public key or search for a validator.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/4.wallet-delegate.png")} alt="Delegate from the Wallet" width="150"/>

**Option 2:** Click **Validators** from the top navigation menu. From the validators table, click on any validator to access their details. Once you find the validator to whom you want to delegate tokens, click the **Delegate** button. The next screen will have the validator's public key pre-populated.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/5.validator-delegate.png")} alt="Delegate from a Validator"/>

## Stepping through the Delegation Process

The following instructions will take you through the delegation process, starting with the "Delegation details" screen.

**Step 1 - Delegation details**

1. Specify the validator's public key if you have reached this screen using the Wallet functionality. Otherwise, verify the pre-populated key in the Validator field.
2. Enter the amount of CSPR you wish to delegate. Remember to account for the transaction fee.
3. Click **Next**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/6.delegation-details.png")} alt="Delegation details" width="400"/>

**Step 2 - Confirm the delegation**

1. Review the details of the transaction.
2. If everything is correct, click **Confirm and delegate stake**. If you wish to make changes, return to the previous screen.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/7.confirm-delegation.png")} alt="Confirm delegation details" width="400"/>

**Step 3 - Sign the delegation**

1.  Sign the transaction by clicking **Sign with Casper Signer**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.sign-delegation.png")} alt="Sign delegation" width="400"/>

2.  Once the Signer app window opens, **make sure that the deploy hash in the "Signer window" matches the deploy hash in the "Sign delegation" window before continuing**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/9.signer-window.png")} alt="Signer window"/>

3.  Click **Sign** in the Signer window to finalize the transaction. You have completed the delegation.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/10.completed-delegation.png")} alt="Completed delegation" width="400"/>

The delegation transaction initiates as soon as the corresponding deploy is signed. You can review the details and status of the deploy by clicking the **Deploy Details** highlighted above. 

Remember to [Monitor your Stake](/staking/#monitoring-rewards). Staking rewards are delivered to your account after each era, which is currently set to 2 hours. Note that it may take up to 2 eras (4 hours) for the first reward to appear after delegation. The rewards are automatically added to your current stake on the corresponding validator. You may view them under the _Rewards_ tab on your account page on <https://cspr.live/>.

If you want to undelegate your tokens, you can do so at any time. See the [Undelegation Guide](/workflow/undelegate-ui) for details.

<!-- Adding a link to the video, although it is not working yet.
## Video Tutorial {#video-tutorial}

This video guide covers the process at a high level, but we recommend following the written tutorial to go through the process step by step.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=cR3v8AthlkQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
-->
