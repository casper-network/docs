---
title: Set up Ledger
slug: /workflow/ledger-setup/
---

# Ledger Setup with Casper

import useBaseUrl from '@docusaurus/useBaseUrl';

A Ledger device is a hardware wallet considered one of the most secure ways to store your digital assets. Ledger uses an offline, or cold storage, method of generating private keys, making it a preferred method for many crypto users. 

## Prerequisites {#prerequisites}

1. Configure your Ledger and the Ledger Live application as described in the [Getting Started with Ledger Live](https://support.ledger.com/hc/en-us/articles/4404389503889?docs=true) article.
2. **<span style={{color:"#ee5945"}}>CRITICAL</span>**: Write down and hide your recovery codes! These are necessary to be able to restore your account if you lose or damage the hardware key.
3. Make sure the Ledger Live application version is at least at `2.73.1`, which is the version that includes Casper accounts.

:::note

If you need help, contact us on [Twitter](https://twitter.com/Casper_Network), [Discord](https://discord.com/invite/Q38s3Vh), or [Telegram](https://t.me/casperblockchain).

:::

## Installing the Casper App on a Ledger Device {#install-the-casper-app-on-the-ledger-device}

Install the Casper app on the Ledger device by following the steps below. You can find similar instructions on the official [Ledger support site](https://support.ledger.com/hc/en-us/articles/4416379141009-Casper-CSPR-?docs=true).

1. In Ledger Live, open My Ledger at the bottom of the left-hand menu.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/open-my-ledger.png")} alt="Open My Ledger" width="800" />
</p>

2. Connect the Ledger device to your computer and unlock it by entering your device PIN.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/casper-unlock.png")} alt="Unlock your Ledger device" width="350" />
</p>

3. If asked, allow Ledger manager on your device.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/allow-ledger.png")} alt="Allow Ledger" width="800" />
</p>

4.  Find **Casper** in the app catalog.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/find-casper.png")} alt="Find the Casper app" width="800" />
</p>

:::important

Having trouble finding the Casper app?
Please search "Casper," not "CSPR" when searching for the app in the "My Ledger" tab in Ledger Live.

:::

5.  Click the **Install** button of the app.

   - An installation window appears.
   - Your device will display **"Processing..."**
   - The app installation is confirmed.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/casper-installed.png")} alt="Casper installation confirmed" width="800" />
</p>

6. Open the Casper App on your Ledger device by clicking both buttons on the device, and keep it open while doing the next steps.

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/select-casper.png")} alt="Select Casper on Ledger" width="350" />
</p>

<p align="center">
<img src={useBaseUrl("/image/tutorials/ledger/ledger-live/casper-ready.png")} alt="Casper app is ready" width="350" />
</p>


## Sending and Receiving Tokens

To send and receive CSPR tokens using the accounts on your Ledger device, you have two options:

1. [Manage Casper Accounts using Ledger and Ledger Live](./ledger-live.md)
2. [Manage Casper Accounts using Ledger and CSPR.live](./ledger-cspr-live.md)

To stake CSPR tokens with a validator on the Casper Mainnet, you need to use the CSPR.live block explorer, as described in [Delegating with Ledger Devices](./staking-ledger.md).

Buying, selling, or swapping CSPR are not currently supported in Ledger Live. For these operations, you need to visit an exchange.
