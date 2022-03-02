# Listing CSPR

The Casper Network [whitepaper](../../../docs/casper/index.md) describes the capabilities of the network in detail. This document is tailored specifically for exchanges that wish to list the Casper token (CSPR). 

CSPR is listed on over 25 exchanges worldwide. As a token, CSPR is very straightforward to integrate. Developers can complete integration and testing in a matter of days.

There are several well-maintained Software Development Kits (SDKs) available to use on the Casper Network, see [SDK Libraries](../dapp-dev-guide/sdk/index.md).

## Transaction Workflow

-   [Create an account](../dapp-dev-guide/keys.md)
-   [Create a transfer transaction](../workflow/transfer-workflow.md)
-   [Query the transaction status](../workflow/querying.md)
-   [Verify a transfer](../workflow/verify-transfer.md)

## The Casper Protocol

-   Casper supports two types of keys, `secp256k1` and `ed25519`. In the global state, public keys are hashed using a one-way `blake2b` hash. When creating keys, it is strongly recommended that the account hash be stored along with the public and private keys. Keys can be created offline, and do not exist on the blockchain until CSPR is sent to an address.
-   Casper is integrated with BitGo for enterprise grade custody. If your exchange uses BitGo, support for Casper is available already.
-   Casper transactions are executed only after they are finalized through consensus. Transactions are not orphaned or uncle’d on Casper and neither does chain reorganization happen on it.
-   Exchanges can check finality signatures from validators for additional security. Finality signatures are sent by validators after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. The default configuration of the Casper node provides event streaming on the `/events` endpoint of port `9999`.
    -   The FinalitySignature is emitted on `/events/sigs` endpoint, whenever a new finality signature is received.  
    -   The DeployAccepted events are emitted on `/events/deploys` endpoint. This means when a deploy is received by the node and it passes the first set of validity checks, it is stored locally, gossiped to peers and enqueued for inclusion in a block - at this point the DeployAccepted event is emitted. 
    -   The other events such as BlockAdded, DeployProcessed, DeployExpired, Fault and Step are emitted on the `/events/main` endpoint.
        -   BlockAdded - This event is emitted whenever a new block is added to the blockchain.
        -   DeployProcessed - This event is emitted when the deploy processing is complete.
        -   DeployExpired - This event is emitted if a deploy is not added to a block for processing by a validator before the deploy's time to live (TTL) expires. 
        -   Fault - This event is emitted if there is a validator error.
        -   Step - This event is emitted at the end of every era.


