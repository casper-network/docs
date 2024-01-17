---
title: Ledger and Ledger Live
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Managing Casper Accounts using Ledger and Ledger Live

This guide will help you connect accounts from the Ledger device to the [Ledger Live](https://www.ledger.com/ledger-live) application to send and receive CSPR tokens.

:::important

From Ledger Live version 2.73.1, Casper accounts can be added from the Ledger hardware wallet to Ledger Live.

:::

## Prerequisites

1. Configure your Ledger and the Ledger Live application as described in the [Getting Started with Ledger Live](https://support.ledger.com/hc/en-us/articles/4404389503889?docs=true) article.
2. Install the Casper app as described [here](./ledger-setup.md).

## Connecting to Ledger Live {#connect-ledge-live}

This section describes using the Ledger device with the [Ledger Live](https://www.ledger.com/ledger-live) application and your Casper accounts.

1. Connect the Ledger device to your computer and unlock it by entering your device PIN.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/0-connect.png")} alt="Connect the Ledger to your computer" width="800" />
</p>

2. Allow Ledger Manager to connect by clicking the two buttons on the Ledger device.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/1-unlock.png")} alt="Unlock the Ledger" width="800" />
</p>

3. Ledger Live will verify your Ledger device and display the following confirmation:

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/2-confirmation.png")} alt="Confirmation that the Ledger is genuine" width="800" />
</p>

4. Click **My Ledger** in the left-side navigation bar, and search for *Casper* or *CSPR* in the **App catalog**. 

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/3-app-cspr.png")} alt="Confirmation that the Ledger is genuine" width="800" />
</p>

5. To import a Casper account from the Ledger device into the Ledger Live application, click on the **Add account** link.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/4-add-account.png")} alt="Click the Add account link" width="800" />
</p>

6. Open the Casper app on your Ledger device.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/5-add-account.png")} alt="Open the Casper app" width="400" />
</p>

7. Ledger Live will import the first account listed on your Ledger device. Choose a name for the account.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/6-add-account.png")} alt="Name the account" width="400" />
</p>

8. After synchronizing the account, Ledger Live will confirm that the account was successfully added.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/7-add-account.png")} alt="Synchronizing the account" width="400" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/8-add-account.png")} alt="Confirmation that the account was added" width="400" />
</p>

9. Click on the account summary, to view more details.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/9-account-summary.png")} alt="Account summary" width="800" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/10-account-details.png")} alt="Account details" width="800" />
</p>

10. To add another account, open the **Account** option in the left-side navigation bar. Then, click on the **Add account** button.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/11-second-account.png")} alt="Add a second account" width="800" />
</p>

## Receiving Tokens {#receive-tokens}

To receive tokens, you need to provide the sender with your account's public key.

:::caution

Casper accounts only support CSPR tokens. Sending other tokens to a Casper account may result in the permanent loss of funds.

:::

1. Click on the **Receive** option in the left-side navigation bar.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/12-receive.png")} alt="Click on Receive" width="400" />
</p>


2. Choose an account from the drop-down list.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/13-receive.png")} alt="Choose an account" width="400" />
</p>

3. Copy the address displayed, or use the corresponding QR code.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/14-receive.png")} alt="Choose an account" width="400" />
</p>

4. Verify that the address displayed in Ledger Live matches the address on your Ledger screen. If it does, click **APPROVE**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/15-receive.png")} alt="Verify address part 1" width="400" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/16-receive.png")} alt="Verify address part 2" width="400" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/17-receive.png")} alt="Click APPROVE" width="400" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/18-receive.png")} alt="Confirmation displayed" width="400" />
</p>

## Sending Tokens {#send-tokens}

Ledger Live supports sending CSPR tokens from one Casper account to another.

1. Start by clicking on the **Send** option in the left-side navigation bar. Choose the account to debit:

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/19-send.png")} alt="Choose the account to debit" width="400" />
</p>

2. Enter the recipient's address and click **Continue**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/20-send.png")} alt="Enter recipient" width="400" />
</p>

3. Enter the amount and an optional transfer ID. Click **Continue**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/21-send.png")} alt="Enter amount and transfer ID" width="400" />
</p>

4. Review the summary, and if everything is correct, click **Continue**. Otherwise, click the **Back** link in the top-left corner.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/22-send.png")} alt="Review the transfer" width="400" />
</p>

5. Your Ledger hardware wallet will present you with the transfer details. Verify the transaction hash, chain ID, source **account**, fee, target, and amount. Meanwhile, Ledger Live will display this message:

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/23-send.png")} alt="Review the transaction in the Ledger" width="400" />
</p>

**Verify the transaction on your Ledger device**

Press the right button on your Ledger Device to review the transaction details until you see **"APPROVE"**.

6. Review the **Txn hash**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/3-txn-1.jpg")} alt="3-txn-1" width="400" />
</p>

The Txn hash value continues on a second screen.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/4-txn-2.jpg")} alt="4-txn-2" width="400" />
</p>

7.  The next screen displays the transaction **Type**, which will be **Token transfer**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/5-type.jpg")} alt="5-type" width="400" />
</p>

8. Verify the **chain ID**, which for Mainnet should be **casper**.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/7-chain.jpg")} alt="7-chain" width="400" />
</p>

9. Verify the **Account** initiating the token transfer.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/8-account-1.jpg")} alt="8-account-1" width="400" />
</p>

The Account value continues on a second screen.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/9-account-2.jpg")} alt="9-account-2" width="400" />
</p>

10. Verify the **Fee**. For CSPR token transfers, that value should be constant and equal to 100,000,000 motes = 0.1 CSPR.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/10-fee.jpg")} alt="10-fee" width="400" />
</p>

11. Verify the **Target**, which is the recipient's public key.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/11-target-1.jpg")} alt="11-target-1" width="400" />
</p>

The Target value continues on a second screen.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/12-target-2.jpg")} alt="12-target-2" width="400" />
</p>

12.  Verify the **Amount** you want to transfer.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/13-amount.jpg")} alt="13-amount" width="400" />
</p>

13. If you want to approve the transaction, click both buttons on the Ledger device while on the **APPROVE** screen.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/device/15-approve.jpg")} alt="15-approve" width="400" />
</p>

14. After approving the transaction with your Ledger hardware wallet, Ledger Live will display the following windows:

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/24-send.png")} alt="Broadcasting transaction" width="400" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/25-send.png")} alt="Transaction sent" width="400" />
</p>

15. To view the transaction details, click on the **View details** button. The following screen will appear:

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/26-send.png")} alt="Transaction details" width="400" />
</p>

16. You can view the transaction in the CSPR.live block explorer by clicking on the **View in explorer** link.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/27-send.png")} alt="Explorer showing transaction" width="800" />
</p>