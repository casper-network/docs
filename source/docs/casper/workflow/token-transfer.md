# Transferring Tokens using a Block Explorer

import useBaseUrl from '@docusaurus/useBaseUrl';

You can transfer Casper tokens (CSPR) using any [block explorer](block-explorer) built to explore the Casper blockchain. The Wallet feature on these block explorers can be used to transfer tokens to another user, delegate stake, or undelegate stake. In this section, we will discuss the steps to transfer CSPR tokens.

## Transferring Tokens 

To transfer tokens, follow these steps:
1. Sign in to your account with the Signer. For detailed instructions, see the [Signer Guide](signer-guide.md).
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
    -   Signing key which approves the transaction
    -   Your public key
    -   Recipient's account hash
8. Click **Sign with Casper Signer** at the bottom of the window to complete the transaction. 
    You completed the transaction, and successfully transferred tokens.

    <img src={useBaseUrl("/image/workflow/transfer-confirm.png")} width="500" />

9.  Next, you can view your CSPR balance, for more information, see the [Viewing Account Details](signer-guide#6-viewing-account-details).

