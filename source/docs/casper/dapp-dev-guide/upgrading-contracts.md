# Upgrading Contracts

Our smart contract packaging tools enable you to:

-   Upgrade your contracts and specify how the state of the contract is managed
-   Specify whether a contract is upgradable or immutable
-   Version your contracts and deprecate old versions
-   Set permissions around who can perform contract upgrades

The upgrade workflow is essentially adding new versions to the contract package. Upgrading a contract is not an in-place replacement but an additive process. When you upgrade the contract, you simply add a new version of the contract in the contract package. The original version of the contract is still there. The developer can enable specific versions of the contract. You can disable a contract version if needed.


To learn more about how to upgrade your smart contracts, see the [Smart Contract Upgrade Tutorial](/dapp-dev-guide/tutorials/upgrade-contract/).
