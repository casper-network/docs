# Required Methods for Minimal Compliance

The methods included in this document represent the most basic, fundamental endpoints for a viable and compliant Casper SDK. They allow the user to retrieve the information necessary to interact with the Casper Network, as well as the means to interact.

* [`chain_get_block`](../json-rpc-informational#chain-get-block) - This method returns the JSON representation of a Block from the network. The ongoing validity of the chain depends on block verification, which includes both a record of deploys and transfers.

* [`info_get_deploy`](../json-rpc-informational#info-get-deploy) - This method allows retrieval of a Deploy from a Casper Network. Without this method, users will be unable to verify any subsequent information relating to a sent Deploy.

* [`account_put_deploy`](../json-rpc-transactional#account-put-deploy) - This method allows users to send their compiled WASM (as part of a Deploy) to a node on a Casper Network. Deploys represent the only means by which a user can perform computation on the platform, without which their interaction with the Casper Network will be entirely passive.

* [`chain_get_state_root_hash`](../json-rpc-informational#chain-get-state-root-hash) - The state root hash is one of the several [global state identifiers](../types_chain#globalstateidentifier) used to query the network state after deployments, and the only way to do so in the context of `state_get_balance` and `state_get_dictionary_item`. A minimal SDK requires both dependent methods.

* [`state_get_account_info`](../json-rpc-informational#state-get-account-info) - This method returns a JSON representation of an Account from the network. `state_get_account_info` is required to view associated account information, including any associated keys, named keys, action thresholds and the main purse.

* [`state_get_balance`](../json-rpc-informational#state-get-balance) - This method returns a purse's balance from a network. This is the only method to return a purse's balance in a human-readable format.

* [`state_get_dictionary_item`](../json-rpc-informational#state-get-dictionary-item) - This method returns an item from a Dictionary. Dictionaries represent a more efficient means of tracking large amounts of state.

* [`query_global_state`](../json-rpc-informational#query-global-state) - This method allows for querying values stored under certain keys in global state. Aside from purse balances, this is the main means of recovering stored data from a Casper Network.

In addition to these methods, a minimally compliant Casper SDK must account for the [types](../types_chain) associated with each method. Each method above links to the expanded information available within the larger JSON RPC method pages, which includes the necessary associated types.
