import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens on the Casper Testnet

## 1. Introduction

The [Casper Testnet](https://testnet.cspr.live/) is an alternate Casper blockchain aimed at testing applications running on the Casper Network without spending CSPR tokens on the [Casper Mainnet](https://cspr.live/). Testnet tokens are independent and separate from the actual Casper Token (CSPR). While test tokens do not have any monetary value, they possess the same functionality as the CSPR token within the confines of the Testnet. The Testnet is deployed independently from the Casper Mainnet for users to experiment with Casper Network features such as transferring, delegating, and undelegating tokens. The Wallet may be utilized to transfer test tokens to another user, delegate stake, or undelegate stake.

**Figure 1**: Casper Testnet Home

<img src={useBaseUrl("/image/workflow/testnet-home.png")} width="500" alt="Casper Testnet Home" />

### 1.1	Logging in to the Casper Testnet 

To login to the testnet, follow these steps:
1. Navigate to the CSPR testnet https://testnet.cspr.live/, using Chrome or a Chromium-based browser like Brave. 

    Sign in with your account password. See the [Signer Guide](https://docs.casperlabs.io/en/latest/workflow/signer-guide.html) for help with logging in.

### 1.2 Viewing Account Information

You can view your account details, such as, the public key, account hash, CSPR token balance, and the transaction history including deploys, delegation, staking rewards, and transfers.

To view your account information, do the following:

1. Click the option in the top-right corner of the screen that displays a few digits of your public key. A menu with your public key is displayed.
2. To view your account details for the displayed public key, click **View Account**.

## 2. The Faucet

The faucet functionality on Testnet allows you to request test tokens, which are required to complete transactions on the network, including transferring, delegating, and undelegating tokens. In this section, we will discuss how to request test tokens.

### 2.1 Requesting Testnet Tokens 

To request test tokens, follow these steps:
1. Sign-in into the Casper Testnet with the Signer. 
2. Click **Tools** on the top menu bar and then select **Faucet** from the drop-down menu. 
3. Select the **Request tokens** option against your public key on the Faucet webpage, as shown in Figure 2. You can submit multiple requests to complete your testing.

    **Figure 2**: Casper Faucet Functionality 

    <img src={useBaseUrl("/image/workflow/faucet-function.png")} width="500" />

4. The Testnet will credit your account with test tokens. You can view your account balance as described in [Section 1.2](#12-viewing-account-information).

## 3. The Wallet

You can employ the wallet functionality on the Testnet to transfer, delegate, and undelegate test tokens. In this section, we will discuss the steps to transfer test tokens.

### 3.1 Transferring Tokens 

To transfer tokens, follow these steps:
1. Sign in to your account with the Signer. 
2. Click **Wallet** on the top menu bar and select **Transfer CSPR** from the drop-down menu. 
3. Enter the recipient’s wallet address, the amount you wish to transfer, and an optional Transfer ID for reference. 
    If you do not provide an ID, the system will auto-generate one.
4. Click **Next** to proceed. The following figure shows an example transfer of 50 CSPR.

    <img src={useBaseUrl("/image/workflow/CSPR-first-step.png")} width="500" />

5. A confirmation window appears, and you may verify the recipient’s wallet address and transaction amount. Click **Confirm and transfer** to proceed to the next step. In the following figure, you may observe the transaction details initiated in the previous step. The transaction fees is displayed in CSPR and USD.

<img src={useBaseUrl("/image/workflow/CSPR-second-step.png")} width="500" />

6. Sign the transaction by selecting the **Sign with Casper Signer** button to proceed to the next step. Here you can review the following important fields:

    -   The Deploy hash, which uniquely identifies your transfer
    -   The Recipient public key of the person receiving your transfer
    -   The Recipient account hash used by the system to track the transaction
    -   The Transfer Amount containing the value of the transfer
    
<img src={useBaseUrl("/image/workflow/CSPR-third-step.png")} width="500" />

7. Next, you will see a pop-up window with a Signature Request and all the various transaction details, including:
    -   The Signing Key which approves the transaction
    -   Your Account address
    -   The Recipient (Key), which is the recipient's address
8. Click **Sign** at the bottom of the window to complete the transaction. 
    You completed the transaction, and successfully transferred tokens.

    <img src={useBaseUrl("/image/workflow/transfer-confirm.png")} width="500" />

##  3.  Logging out of your Account

To logout from the Signer, do the following:
1. On the home page, click the option in the top-right corner of the screen that displays a few digits of your public key. A menu with your public key is displayed.
2. Click **Logout**. You will be logged out of your account.
