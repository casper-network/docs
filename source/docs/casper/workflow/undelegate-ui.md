import useBaseUrl from '@docusaurus/useBaseUrl';

# Undelegating CSPR from a Validator

If you want to undelegate tokens from a validator, you can do so at any time. Note that undelegation costs approximately 0.5 CSPR when writing this article. 

## Prerequisites 

This guide assumes that you have previously delegated tokens] to a validator using a [block explorer](/workflow/delegate-ui) or the [Casper client](/workflow/delegate).

## The Undelegating Process

You can access the undelegate functionality in three ways.

**Option 1:** Click **Wallet** from the top navigation menu and then click **Undelegate Stake**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.1.png")} alt="8.1" width="200"/>

**Option 2:** Click **Validators** from the top navigation menu. From the validators table, click on any validator to access its details. Once you find the validator you wish to undelegate from, click the **Undelegate Stake** button.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.2.png")} alt="8.2"/>

**Option 3:** Go to your account details by clicking your public key in the top navigation menu or clicking **View Account** from the expanded menu. Then click on the **Delegations** tab, and click on the **Undelegate** button next to the entry you want to undelegate.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.3.png")} alt="8.3"/>

Then follow these instructions to undelegate your tokens:

**Step 1 - Undelegation Details**

1.  Start by choosing the validator from which you want to undelegate your tokens. If a validator is not already selected, you can search for one using the search box. The search box will automatically show you validators with which you have staked.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.4.png")} alt="8.4" width="400"/>

2.  Enter the amount of Casper tokens you want to undelegate.
3.  Click **Next**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.5.png")} alt="8.5" width="400"/>

**Step 2 - Confirm the Transaction**

1.  Review your transaction details.
2.  If everything looks correct, click **Confirm** to undelegate the tokens. If you wish to change something, you can return to the previous step by clicking **Back to step 1**.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.6.png")} alt="8.6"/>

**Step 3 - Sign the Transaction**

1.  Click **Sign** with the Casper Signer.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.7.png")} alt="8.7" width="400"/>

2.  Once the Signer app window opens, **make sure that the Deploy hash in the Signer window matches the Deploy hash in https://cspr.live/ before continuing**!

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.8.png")} alt="8.8"/>

3.  Click **Sign** in the Signer window to sign and finalize the transaction.

<img class="align-center" src={useBaseUrl("/image/tutorials/staking/8.9.png")} alt="8.9" width="400"/>

The stake undelegation initiates as soon as the corresponding deploy is signed. It may take 1-2 minutes for the undelegation details to become available. Please note that your undelegated tokens will appear in your account automatically after a 7-era delay, which is approximately 14 hours.

## Conclusion {#conclusion}

By staking your tokens, you help secure the network and earn rewards in return. Thank you for your trust and participation!

You can find additional information on the [docs.cspr.community](https://docs.cspr.community/) website.
