# Listing CSPR

This document is tailored specifically for exchanges that wish to list the Casper token (CSPR). 

CSPR is listed on over 25 exchanges worldwide. As a token, CSPR is very straightforward to integrate. Developers can complete integration and testing in a matter of days.

There are several well-maintained Software Development Kits (SDKs) available to use on the Casper Network, see [SDK Libraries](dapp-dev-guide/building-dapps/sdk/index.md).

## Transaction Workflow

-   [Create an account](dapp-dev-guide/keys.md)
-   [Create a transfer transaction](../workflow/transfer-workflow.md)
-   [Query the transaction status](../workflow/querying.md)
-   [Verify a transfer](../workflow/verify-transfer.md)

## The Casper Protocol

-   Casper supports two types of keys, `secp256k1` and `ed25519`. In the global state, public keys are hashed using a one-way `blake2b` hash. When creating keys, it is strongly recommended that the account hash be stored along with the public and private keys. Keys can be created offline, and do not exist on the blockchain until CSPR is sent to an address.
-   Casper is integrated with BitGo for enterprise grade custody. If your exchange uses BitGo, support for Casper is available already.
-   Casper transactions are executed only after they are finalized through consensus. Transactions are not orphaned or uncle’d on Casper and neither does chain reorganization happen on it.
-   Exchanges can check finality signatures from validators for additional security. Finality signatures are sent by validators after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. The default configuration of the Casper node provides event streaming on the `/events` endpoint of port `9999`.


