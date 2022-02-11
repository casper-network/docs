import useBaseUrl from '@docusaurus/useBaseUrl';

# Ledger Setup

A Ledger Device is a hardware wallet that is considered one of the most secure ways to store your digital assets. Ledger uses an offline, or cold storage, method of generating private keys, making it a preferred method for many crypto users. This guide will help you to connect your Ledger device to a Casper Web wallet on a block explorer such as [cspr.live](https://cspr.live/). The Casper Web wallet enables you to send and receive CSPR tokens.

If you need help, contact us on the following services:

-   Twitter: <https://twitter.com/Casper_Network>
-   Discord: <https://discord.com/invite/Q38s3Vh>
-   Telegram: <https://t.me/casperblockchain>

## Requirements {#requirements}

### Before you begin {#before-you-begin}

1.  You have initialized your Ledger Nano S/X.
2.  You have installed the latest firmware on your Ledger Nano S/X.
3.  Ledger Live is ready to use.
4.  You have installed a Chromium-based browser such as Chrome or Brave.

### Install the Casper app on the Ledger device {#install-the-casper-app-on-the-ledger-device}

1.  Open the Manager in Ledger Live.
2.  Connect and unlock your Ledger device.
3.  If asked, allow the manager on your device by pressing the right button.
4.  Find Casper in the app catalog.
5.  Click the Install button of the app.
6.  An installation window appears.
7.  Your device will display **"Processing..."**
8.  The app installation is confirmed.

## Use Ledger device with your Web wallet {#use-ledger-device-with-your-web-wallet}

### Sign in {#sign-in}

You can now use the Ledger device with Web wallet. Follow these steps:

1.  Connect and unlock your Ledger device.
2.  Open the Casper app on your Ledger device.
3.  Go to [cspr.live/sign-in](https://cspr.live/sign-in).
4.  Click on the **Connect** button in the Ledger section.
5.  Click on the **Connect to Ledger wallet** button.
6.  Select an account you want to use.
7.  Now, your Ledger device is connected to the Web wallet.

### View account details {#view-account-details}

1.  Go to [cspr.live](https://cspr.live).
2.  Click on the account address in the upper-right corner of the page.

<img src={useBaseUrl("/image/tutorials/ledger/flow/3-view-account.png")} alt="3-view-account" width="750" />

3.  Click on the **View account** button.

<img src={useBaseUrl("/image/tutorials/ledger/flow/6-view-account-button.png")} alt="6-view-account-button" width="350" />

4.  You are presented with a page displaying details about your account.

<img src={useBaseUrl("/image/tutorials/ledger/flow/4-account-details.png")} alt="4-account-details" width="750" />

### View account balance {#view-account-balance}

You can check your account balance from the Web wallet:

1.  Follow the steps described in the "View account details" section above.
2.  On the **Liquid Account Balance** row, you will see your latest known account balance.

### Receive tokens {#receive-tokens}

To receive tokens, you need to provide the sender with the public key of your account. To find it:

1.  Open the account details page (see the "View account details" section).
2.  Copy the public key found on the **Public Key** row.
3.  Alternatively, click on the drop-down menu on your account address.

<img src={useBaseUrl("/image/tutorials/ledger/flow/3-view-account.png")} alt="3-view-account" width="750" />

1.  Click on the **Copy public key** button.
2.  Share the public key with the sender.

### Send tokens {#send-tokens}

1.  Go to [cspr.live](https://cspr.live).
2.  Sign in with your Ledger device.
3.  Click on **Wallet** and then **Transfer CSPR**.

<img src={useBaseUrl("/image/tutorials/ledger/flow/5-transfer-wallet.png")} alt="5-transfer-wallet" width="750" />

4.  Fill in the details for the transfer.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/1-transfer-details.png")} alt="1-transfer-details" width="500" />

5.  Click on the **Next** button.
6.  On the next page, click **Confirm and transfer**.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/2-transfer-confirm.png")} alt="2-transfer-confirm" width="500" />

1.  On the **Sign transaction** page, click on the **Sign with Ledger** button.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/3-transfer-sign.png")} alt="3-transfer-sign" width="500" />

8.  Your Ledger hardware wallet will present you with transfer details. Verify the transfer details (txn hash, chain ID, source **account**, fee, target, and amount).

**Verify the transaction on your Ledger device**

Press the right button on your Ledger Device to review the transaction details (Amount and Address) until you see **"Approve"**.

1.  Verify the **txn hash** - make sure it matches the value displayed in the Web wallet on [cspr.live](https://cspr.live).

<img src={useBaseUrl("/image/tutorials/ledger/device/3-txn-1.jpg")} alt="3-txn-1" width="600" />

The _txn hash_ value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/4-txn-2.jpg")} alt="4-txn-2" width="600" />

2.  The next page displays transaction **type** - for CSPR transfers, that will be **Token transfer**.

<img src={useBaseUrl("/image/tutorials/ledger/device/5-type.jpg")} alt="5-type" width="600" />

3.  Verify the **chain ID**, which identifies the network on which you want to send the transaction.

<img src={useBaseUrl("/image/tutorials/ledger/device/7-chain.jpg")} alt="7-chain" width="600" />

4.  Verify the **account**, which is the public key of the account that initiated the transaction.

<img src={useBaseUrl("/image/tutorials/ledger/device/8-account-1.jpg")} alt="8-account-1" width="600" />

The _account_ value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/9-account-2.jpg")} alt="9-account-2" width="600" />

5.  Verify the **fee**. For CSPR token transfers, that value should be constant and equal to 10 000 motes = 0.00001 CSPR.

<img src={useBaseUrl("/image/tutorials/ledger/device/10-fee.jpg")} alt="10-fee" width="600" />

6.  Verify **target** - **NOTE** this **IS NOT** a public key of the recipient but the hash of that key. Compare the public key with the value in the Web wallet which shows you two fields for the recipient public key and target.".

<img src={useBaseUrl("/image/tutorials/ledger/device/11-target-1.jpg")} alt="11-target-1" width="600" />

The _target_ value continues on a second screen.

<img src={useBaseUrl("/image/tutorials/ledger/device/12-target-2.jpg")} alt="12-target-2" width="600" />

7.  Verify the **amount** you want to transfer.

<img src={useBaseUrl("/image/tutorials/ledger/device/13-amount.jpg")} alt="13-amount" width="600" />

8.  If you approve the transaction, click both buttons on the Ledger device.

<img src={useBaseUrl("/image/tutorials/ledger/device/15-approve.jpg")} alt="15-approve" width="600" />

After approving the transaction with your Ledger hardware wallet, the [cspr.live](https://cspr.live) Web wallet will display a "Transfer completed" page.

<img src={useBaseUrl("/image/tutorials/ledger/cspr-live/4-transfer-completed.png")} alt="4-transfer-completed" width="500" />

You can now check your account to see a list of all the completed transfers.
