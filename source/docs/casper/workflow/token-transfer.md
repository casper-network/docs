import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens on the Casper Testnet

## 1. Introduction

The [Casper Testnet](https://testnet.cspr.live/) is an alternate Casper blockchain aimed at testing applications running on a Casper network without spending CSPR cryptocurrency on the [Casper Mainnet](https://cspr.live/). Testnet tokens are independent and separate from the actual Casper Token (CSPR). While test tokens do not have any monetary value, they possess the same functionality as the CSPR token within the confines of the Testnet, which is deployed independently from the Casper Mainnet for users to experiment with Casper Network features such as transferring, delegating, and undelegating tokens. The Wallet may be utilized to transfer test tokens to another user, delegate stake, or undelegate stake.

**Figure 1**: Casper Testnet Home

<img src={useBaseUrl("/image/workflow/testnet-home.png")} width="500" />

### 1.1	Signing in the Casper Testnet 

To login to the testnet, follow these steps:
1. Navigate to the CSPR testnet https://testnet.cspr.live/, using Chrome or a Chromium-based browser like Brave. 

    Sign in with your account password. Follow the [Signer Guide](https://docs.casperlabs.io/en/latest/workflow/signer-guide.html) for help with logging in.

**Figure 2**: Casper Testnet Unlock Vault

<img src={useBaseUrl("/image/workflow/unlock-vault.png")} width="250" />

2. Click on the Wallet menu followed by View Account as shown in Figure 3 to get an overview of your Casper Testnet account, including your Public Key, Account Hash, Liquid Account Balance, and so on. 

**Figure 3**: Casper Wallet Menu Icon on Testnet

<img src={useBaseUrl("/image/workflow/wallet-menu.png")} width="250" />

Deploys, Delegation, Staking Rewards, and Transfers may also be reviewed on this screen as presented in Figure 4.

**Figure 4**: Casper Testnet Account Overview

<img src={useBaseUrl("/image/workflow/account-overview.png")} width="500" />

## 2. The Faucet

The faucet functionality on Testnet allows you to request test tokens, which are required to complete transactions on the network, including transferring, delegating, and undelegating tokens. In this section, we will discuss how to request test tokens.

### 2.1 Requesting Testnet Tokens 

To request test tokens, follow these steps:
1. Sign-in into the Casper Testnet with the Signer. 
2. Click **Tools** on the top menu bar and then select **Faucet** from the drop-down menu. 
3. Select the **Request tokens** option against your public key on the Faucet webpage, as shown in Figure 5. You can submit multiple requests to complete your testing.

    **Figure 5**: Casper Faucet Functionality 

    <img src={useBaseUrl("/image/workflow/faucet-function.png")} width="500" />

4. The Testnet will credit your Testnet wallet with test tokens. You can verify your account details as specified in Section 1.1.

## 3. The Wallet

You can employ the wallet functionality on the Testnet to transfer, delegate, and undelegate test tokens. In this section, we will discuss the steps to transfer test tokens.

### 3.1 Transferring Tokens 

To transfer tokens, follow these steps:
1. Sign in to your account with the Signer. 
2. Click **Wallet** on the top menu bar and select **Transfer CSPR** from the drop-down menu. 
3. Enter the recipient’s wallet address.
4. Enter the amount you wish to transfer.
5. Enter an optional Transfer ID for reference. If you do not provide an ID, the system will auto-generate one.
6. Click **Next** to proceed. Figure 6 shows you an example transfer of 50 CSPR.

    **Figure 6**: Casper Testnet CSPR Transfer Functionality First Step

    <img src={useBaseUrl("/image/workflow/CSPR-first-step.png")} width="500" />

7. A confirmation window appears, and you may verify the recipient’s wallet address and transaction amount. Click **Confirm and transfer** to proceed to the next step. In Figure 7, you may observe the transaction details initiated in the previous step. Notice the transaction fees in CSPR and also in USD.

<img src={useBaseUrl("/image/workflow/CSPR-second-step.png")} width="500" />

8. Sign the transaction by selecting the **Sign with Casper Signer** button to proceed to the next step. Here you can review the following important fields:

    1. The Deploy hash, which uniquely identifies your transfer
    2. The Recipient public key of the person receiving your transfer
    3. The Recipient account hash used by the system to track the transaction
    4. The Transfer Amount containing the value of the transfer
    Figure 8 shows an example of this step.

<img src={useBaseUrl("/image/workflow/CSPR-third-step.png")} width="500" />

9. Next, you will see a pop-up window with a Signature Request and all the various transaction details, including:
    1. The Signing Key which approves the transaction
    2. Your Account address
    3. The Recipient (Key), which is the recipient's address
10. Click **Sign** at the bottom of the window to complete the transaction, as shown in Figure 9. 

**Figure 9**: Casper Testnet CSPR Transfer Functionality Fourth Step

<img src={useBaseUrl("/image/workflow/CSPR-fourth-step.png")} width="250" />

Congratulations! You completed the transaction, and you have successfully transferred tokens.

**Figure 10**: Casper Testnet CSPR Transfer Functionality Confirmation 

<img src={useBaseUrl("/image/workflow/transfer-confirm.png")} width="500" />

##  3.  Logging out of your Account

To logout from the Signer, do the following:
1. On the home page, click the option in the top-right corner of the screen that displays a few digits of your public key. A menu with your public key is displayed.
2. Click **Logout**. You will be logged out of your account.


