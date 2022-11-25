import useBaseUrl from '@docusaurus/useBaseUrl';

# Funding Accounts from an Exchange

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

