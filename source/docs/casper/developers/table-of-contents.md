import useBaseUrl from '@docusaurus/useBaseUrl';

# Table of Contents

These developer guides highlight key features and capabilities of the Casper blockchain.

- [Development Prerequisites](./prerequisites.md): setup needed for various workflows
- [Writing On-chain code](./writing-onchain-code/index.md)
- [Casper JSON-RPC API](./json-rpc/index.md)
- [Building DApps](./dapps/index.md)
- [Interacting With The Blockchain Using CLI](./cli/index.md)
   - [Transferring Tokens using the Command-line](./cli/transfers/index.md): transferring tokens from one account to another using the command-line
      - [Transferring Tokens using Direct Transfer](./cli/transfers/direct-token-transfer.md)
      - [Transferring Tokens using Multi-sig Account](./cli/transfers/multisig-deploy-transfer.md)
      - [Verifying a Transfer](./cli/transfers/verify-transfer.md)
   - [Delegating tokens](./cli/delegate.md): delegating tokens to a Validator on a Casper network
   - [Undelegating tokens](./cli/undelegate.md): undelegating tokens from a validator on a Casper network
- [Using the Casper Fungible Token Contract](https://github.com/casper-network/erc20-guide-extraction/): using the Casper fungible token contract to understand the fungible token transfer workflow