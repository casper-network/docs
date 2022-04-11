import useBaseUrl from '@docusaurus/useBaseUrl';

# Upgrading Contracts

Our smart contract packaging tools enable you to:

-   [Upgrade your contracts](/dapp-dev-guide/tutorials/upgrade-contract/) and specify how the state of the contract is managed
-   Specify whether a contract is upgradable or immutable
-   Version your contracts and deprecate old versions
-   Set permissions around who can perform contract upgrades

When you upgrade a contract, you add a new contract version in a contract package. The versioning process is additive rather than an in-place replacement of an existing contract. The original version of the contract is still there, and you can enable certain versions for specific clients. You can also disable a contract version if needed.

<p align="center"><img src={useBaseUrl("/image/contract-representation.png")} alt="contract-representation" width="400"/></p>

The contract package is like a container for different contract versions, with functionality that can differ slightly or significantly among versions. The contract package is created when you install the contract on the blockchain. 

To learn more about how to upgrade your smart contracts, see the [Smart Contract Upgrade Tutorial](/dapp-dev-guide/tutorials/upgrade-contract/).
