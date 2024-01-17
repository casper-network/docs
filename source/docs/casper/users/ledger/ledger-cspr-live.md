---
title: Ledger and CSPR.live
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Managing Casper Accounts using Ledger and CSPR.live

This guide will help you connect your Ledger device to a Casper account using the [cspr.live](https://cspr.live/) block explorer to send and receive CSPR tokens.

## Prerequisites

1. Install a Chromium-based browser, such as Chrome or Brave, for use with [cspr.live](https://cspr.live/) for the Casper Mainnet.

## Signing In {#sign-in}

To use the Ledger device with the [cspr.live](https://cspr.live/) block explorer, follow these steps:

1. Connect the Ledger device to your computer and unlock it by entering your device PIN.
2. Open the Casper app on the Ledger device as shown above.
3. While keeping the Casper app open, navigate to [cspr.live/sign-in](https://cspr.live/sign-in).

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/flow/cspr-signin.png")} alt="Sign into cspr.live" width="800" />
</p>

4. Click on the **Connect** button in the Ledger section.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/flow/cspr-connect.png")} alt="Choose to connect with Ledger" width="800" />
</p>

5. Click the **Connect to Ledger wallet** button next.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/flow/connect-ledger.png")} alt="Connect to Ledger Wallet in CSPR Live" width="800" />
</p>

6. Select an account you want to use.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/flow/connect-select-account.png")} alt="Choose an account to connect" width="800" />
</p>

7. Your Ledger device is now connected to the block explorer, displaying your account details.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/flow/account-connected.png")} alt="Account connected" width="800" />
</p>

## Viewing Account Details {#view-account-details}

1. Open [cspr.live](https://cspr.live).
2. Click on the account in the upper-right corner of the page.

<img src={useBaseUrl("/image/tutorials/ledger/flow/view-account.png")} alt="3-view-account" width="800" />

3.  Click on the **View Account** button.

<img src={useBaseUrl("/image/tutorials/ledger/flow/view-account-button.png")} alt="6-view-account-button" width="800" />

4. You are presented with a page displaying details about your account. Check your account's main purse balance in the **Liquid** row under **Total Balance**.

<img src={useBaseUrl("/image/tutorials/ledger/flow/account-details.png")} alt="4-account-details" width="800" />

## Receiving Tokens {#receive-tokens}

To receive tokens, you need to provide the sender with your account's public key. To find it, follow these steps:

1. Open the account details page as described [here](#view-account-details) and copy the public key in the **Public Key** row.
2. Alternatively, click on the drop-down menu on your account address.

<img src={useBaseUrl("/image/tutorials/ledger/flow/view-account.png")} alt="View account" width="800" />

3. Click on the **Copy Public Key** button and share it with the sender.

<img src={useBaseUrl("/image/tutorials/ledger/flow/copy-public-key.png")} alt="Copy public key" width="800" />

## Sending Tokens {#send-tokens}

1. Open [cspr.live](https://cspr.live).
2. Sign in with your Ledger device.
3.  Click on **Wallet** and then **Transfer CSPR**.

<img src={useBaseUrl("/image/tutorials/ledger/flow/transfer-wallet.png")} alt="5-transfer-wallet" width="800" />

4. Fill in the details for the transfer.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/1-transfer-details.png")} alt="1-transfer-details" width="500" />

5. Click on the **Next** button.
6. On the next page, click **Confirm and transfer**.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/2-transfer-confirm.png")} alt="2-transfer-confirm" width="500" />

7.  On the **Sign transaction** page, click on the **Sign with Ledger** button.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/3-transfer-sign.png")} alt="3-transfer-sign" width="500" />

8. Your Ledger hardware wallet will present you with transfer details. Verify the transfer details (txn hash, chain ID, source **account**, fee, target, and amount). Meanwhile, the block explorer will show this message:

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/3-transfer-submitted.png")} alt="3-transfer-sign" width="500" />

**Verify the transaction on your Ledger device**

Press the right button on your Ledger Device to review the transaction details (Amount and Address) until you see **"Approve"**.

1. Verify the **Txn hash** - ensure it matches the value displayed on [cspr.live](https://cspr.live).

<img src={useBaseUrl("/image/tutorials/ledger/device/3-txn-1.jpg")} alt="3-txn-1" width="600" />

The Txn hash value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/4-txn-2.jpg")} alt="4-txn-2" width="600" />

2.  The next page displays transaction **Type** - for CSPR transfers, that will be **Token transfer**.

<img src={useBaseUrl("/image/tutorials/ledger/device/5-type.jpg")} alt="5-type" width="600" />

3. Verify the **Chain ID**, which identifies the network to which you want to send the transaction.

<img src={useBaseUrl("/image/tutorials/ledger/device/7-chain.jpg")} alt="7-chain" width="600" />

4. Verify the **Account**, the account's public key initiating the transaction.

<img src={useBaseUrl("/image/tutorials/ledger/device/8-account-1.jpg")} alt="8-account-1" width="600" />

The Account value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/9-account-2.jpg")} alt="9-account-2" width="600" />

5. Verify the **Fee**. For CSPR token transfers, that value should be constant and equal to 100,000,000 motes = 0.1 CSPR.

<img src={useBaseUrl("/image/tutorials/ledger/device/10-fee.jpg")} alt="10-fee" width="600" />

6. Verify the **Target**, the recipient's public key. Compare this value with the one in the block explorer.

<img src={useBaseUrl("/image/tutorials/ledger/device/11-target-1.jpg")} alt="11-target-1" width="600" />

The Target value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/12-target-2.jpg")} alt="12-target-2" width="600" />

7.  Verify the **Amount** you want to transfer.

<img src={useBaseUrl("/image/tutorials/ledger/device/13-amount.jpg")} alt="13-amount" width="600" />

8. If you want to approve the transaction, click both buttons on the Ledger device while on the **APPROVE** screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/15-approve.jpg")} alt="15-approve" width="600" />

After approving the transaction with your Ledger hardware wallet, the [cspr.live](https://cspr.live) block explorer will display a "Transfer completed" page.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/4-transfer-completed.png")} alt="4-transfer-completed" width="500" />

You can now check your account to see a list of all the completed transfers.
