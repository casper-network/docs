# Getting Help

## Frequently Asked Questions {#frequently-asked-questions}

This section covers frequently asked questions and our recommendations.

### Deploy Processing {#deploy-processing}

**Question**: How do I know that a deploy was finalized?

**Answer**: If a deploy was executed, then it has been finalized. If the deploy status comes back as null, that means the deploy has not been executed yet. Once the deploy executes, it is finalized, and no other confirmation is needed. Exchanges that are not running a read-only node must also keep track of [finality signatures](#finality-signatures) to prevent any attacks from high-risk nodes.

### Finality Signatures {#finality-signatures}

**Question**: When are finality signatures needed?

**Answer**: Finality signatures are confirmations from validators that they have executed the transaction. Exchanges should be asserting finality by collecting the weight of two-thirds of transaction signatures. If an exchange runs a read-only node, it can collect these finality signatures from its node. Otherwise, the exchange must assert finality by collecting finality signatures and have proper monitoring infrastructure to prevent a Byzantine attack.

Suppose an exchange connects to someone else's node RPC to send transactions to the network. In this case, the node is considered high risk, and the exchange must assert finality by checking to see how many validators have run the transactions in the network.

### deploy_hash vs. transfer_hash {#deploy_hash-vs-transfer_hash}

**Question**: How is a deploy_hash different than a transfer_hash?

**Answer**: Essentially, there is no difference between a _deploy_hash_ and a _transfer_hash_ since they are both deploy transactions. However, the platform is labeling the subset of deploys which are transfers, to filter transfers from other types of deploys. In other words, a _transfer_hash_ is a native transfer, while a _deploy_hash_ is another kind of deploy.

### account-hex vs. account-hash {#account-hex-vs-account-hash}

**Question**: Should a customer see the account-hex or the account-hash?

**Answer**: Exchange customers or end-users only need to see the _account-hex_. They do not need to know the _account_hash_. The _account_hash_ is needed in the backend to verify transactions. Store the _account-hash_ to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the _account-hex_.

### Example Deploy {#example-deploy}

**Question**: Can you provide an example of a deploy?

**Answer**: You can find a _testDeploy_ reference in [GitHub](https://github.com/casper-ecosystem/casper-js-sdk/blob/next/test/lib/DeployUtil.test.ts#L5).

### Operating with Keys {#operating-with-keys}

**Question**: How should we work with the PEM keys?

**Answer**: The [Keys API](https://casper-ecosystem.github.io/casper-js-sdk/next/modules/_lib_keys_.html) provides methods for _Ed25519_ and _Secp256K1_ keys. Also, review the tests in [GitHub](https://github.com/casper-ecosystem/casper-js-sdk/blob/next/test/lib/Keys.test.ts#L39) and the [Working with Keys](https://docs.casperlabs.io/en/latest/dapp-dev-guide/keys.html) documentation.

## Useful Resources {#useful-resources}

The Casper Association makes available the following resources for you to connect and get support:

-   On our [Discord Channel](https://discordapp.com/invite/mpZ9AYD), connect live with members of our Engineering Team available to support you with the progress of your projects
-   Join the [Community Forum](https://forums.casperlabs.io/) that includes technical discussions on using Casper features, obtain support, and pose questions
-   Subscribe to the [Casper Network Official Telegram Channel](https://t.me/casperblockchain) for general information and updates about the platform

If you find issues, search the main [Casper Network repository](https://github.com/casper-network) and file the issue in the related project.

Otherwise, use our [Jira Service Desk](https://casperlabs.atlassian.net/servicedesk) for situations such as:

-   questions that are not issues
-   needing technical support
-   wanting to give feedback
-   suggesting improvements
-   participating in a bounty
