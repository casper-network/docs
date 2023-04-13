# Funding Testnet Accounts

import useBaseUrl from '@docusaurus/useBaseUrl';

The Casper Testnet is an alternate Casper blockchain that enables testing applications without spending CSPR on the Mainnet. The Testnet is deployed independently from the Mainnet for users to experiment with network features such as transferring, delegating, and undelegating tokens. One way to access the Casper Testnet is to use the [cspr.live](https://testnet.cspr.live/) block explorer. 

Testnet tokens are independent of the Casper token (CSPR). While test tokens do not have any monetary value, they possess the same functionality as the CSPR token within the confines of the Testnet. Users can fund Testnet accounts as outlined below. 

### Requesting Testnet Tokens 

To request test tokens, follow these steps:

1. Sign-in into the Casper Testnet with the Signer. For detailed instructions, see the [Signer Guide](https://docs.cspr.community/docs/user-guides/SignerGuide.html). 
2. Click **Tools** on the top menu bar and select **Faucet** from the drop-down menu. Or, navigate to the Faucet using this link: https://testnet.cspr.live/tools/faucet.
3. Click **Request tokens** on the Faucet page:

    <img src={useBaseUrl("/image/workflow/faucet-function.png")} width="500" />

:::caution

Tokens can be requested **only once per account**. Otherwise, the [deployment will fail](https://testnet.cspr.live/deploy/f0f6b25db767d1a6c2244324661d853ad7d4766f8489d81c36b5e2c9d982891e) with status `User error: 1`.

If you have already exhausted your test funds, you can always [create a new account](../developers/prerequisites.md#creating-an-account).

:::

4. The Testnet will credit your account with test tokens.
