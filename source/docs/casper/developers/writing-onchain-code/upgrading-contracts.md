
# Upgrading and Maintaining Smart Contracts
import useBaseUrl from '@docusaurus/useBaseUrl';

Our smart contract packaging tools enable you to:

-   Upgrade your contracts and specify how the state of the contract is managed
-   Specify whether a contract is upgradable or immutable
-   Version your contracts and deprecate old versions
-   Set permissions around who can perform contract upgrades

When you upgrade a contract, you add a new contract version in a contract package. The versioning process is additive rather than an in-place replacement of an existing contract. The original version of the contract is still there, and you can enable certain versions for specific clients. You can also disable a contract version if needed.

<p align="center"><img src={useBaseUrl("/image/package-representation.png")} alt="package-representation" width="400"/></p>

The contract package is like a container for different contract versions, with functionality that can differ slightly or significantly among versions. The contract package is created when you install the contract on the blockchain. 

## Videos and Tutorials

To learn more about versioning contracts, consult the following video, which builds upon the previous topics and videos in the [Writing On-Chain Code](/writing-contracts) documentation.

<p align="center">
<iframe width="400" height="225" src="https://www.youtube.com/embed?v=sUg0nh3K3iQ&list=PL8oWxbJ-csEqi5FP87EJZViE2aLz6X1Mj&index=10" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

Or, for a different perspective, consult the [Smart Contract Upgrade Tutorial](../../resources/beginner/upgrade-contract.md).

## Maintaining a Contract
The contract maintenance process is generally covered through the contract upgrade process.

Only major version changes in the Casper node software would require specific contract maintenance since a node version has a one-to-one mapping with the contract version. Otherwise, minor contract version changes can be addressed through the contract upgrade process. At the moment, we are not anticipating major contract changes in the Casper Mainnet. Therefore, the contract upgrade process can cater to any minor contract maintenance.

On instances like new node version releases, type upgrades, and bug fixes, we advise you to adhere to the same contract upgrade process.