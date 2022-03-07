# JSON-RPC Methods

This document outlines the methods and endpoints available to developers crafting an SDK for use with Casper networks.  They are divided into a fundamental and a secondary section based upon the necessity of their use for interacting with the Casper blockchain.

For examples of completed SDKs, please refer to our [SDK Client Libraries](https://casper.network/docs/sdk) section.

## Fundamental JSON-RPC Methods {#primary-json-rpc-methods}

The following methods are fundamental to any SDK interacting with a Casper network. To gain approval, a Casper SDK must include means to interact with the these JSON-RPC methods.

### account_put_deploy {#account-put-deploy}

This is a method through which users can interact with a node on a Casper network. It takes in a [deploy](https://casper.network/docs/design/execution-semantics#execution-semantics-deploys) as an argument, which is then sent to a node on the network, gossiped and finally executed by nodes on the network.

This method allows users to send their compiled WASM as deploys to the network for execution.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](../sdkspec/components#deploy)|Object|A deploy consists of an item containing a smart contract along with the requester's signature(s).|

#### `account_put_deploy_result`

The result contains the [deploy_hash](../sdkspec/components#deployhash), which is the primary identifier of a deploy within a Casper network.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[deploy_hash](../sdkspec/components#deployhash)|String| A hex-encoded hash of the deploy as sent.|

<details>

<summary><b>Example account_put_deploy</b></summary>

```bash

{
          "name": "account_put_deploy_example",
          "params": [
            {
              "name": "deploy",
              "value": {
                "approvals": [
                  {
                    "signature": "012dbf03817a51794a8e19e0724884075e6d1fbec326b766ecfa6658b41f81290da85e23b24e88b1c8d9761185c961daee1adab0649912a6477bcd2e69bd91bd08",
                    "signer": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c"
                  }
                ],
                "hash": "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa",
                "header": {
                  "account": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                  "body_hash": "d53cf72d17278fd47d399013ca389c50d589352f1a12593c0b8e01872a641b50",
                  "chain_name": "casper-example",
                  "dependencies": [
                    "0101010101010101010101010101010101010101010101010101010101010101"
                  ],
                  "gas_price": 1,
                  "timestamp": "2020-11-17T00:39:24.072Z",
                  "ttl": "1h"
                },
                "payment": {
                  "StoredContractByName": {
                    "args": [
                      [
                        "amount",
                        {
                          "bytes": "e8030000",
                          "cl_type": "I32",
                          "parsed": 1000
                        }
                      ]
                    ],
                    "entry_point": "example-entry-point",
                    "name": "casper-example"
                  }
                },
                "session": {
                  "Transfer": {
                    "args": [
                      [
                        "amount",
                        {
                          "bytes": "e8030000",
                          "cl_type": "I32",
                          "parsed": 1000
                        }
                      ]
                    ]
                  }
                }
              }
            }
          ],
          "result": {
            "name": "account_put_deploy_example_result",
            "value": {
              "api_version": "1.4.4",
              "deploy_hash": "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa"
            }
          }
        }

```

</details>

### state_get_account_info {#state-get-account-info}

This method returns a JSON representation of an [Account](https://casper.network/docs/design/accounts) from the network. The `block_identifier` must refer to a block after the account's creation, or the method will return empty.

|Parameter|Type|Description|
|---------|----|-----------|
|[public_key](../sdkspec/components#publickey)|String| The public key of the Account.|
|[block_identifier](../sdkspec/components#blockidentifier)|Object| The block identifier.|

#### `state_get_account_info_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[account](../sdkspec/components#account)|Object|A JSON representation of the account structure.| 
|[merkle_proof](../sdkspec/components#merkleproof)|String|The merkle proof.|

<details>

<summary><b>Example state_get_account_info</b></summary>

```bash

{
          "name": "state_get_account_info_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            },
            {
              "name": "public_key",
              "value": "013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29"
            }
          ],
          "result": {
            "name": "state_get_account_info_example_result",
            "value": {
              "account": {
                "account_hash": "account-hash-e94daaff79c2ab8d9c31d9c3058d7d0a0dd31204a5638dc1451fa67b2e3fb88c",
                "action_thresholds": {
                  "deployment": 1,
                  "key_management": 1
                },
                "associated_keys": [
                  {
                    "account_hash": "account-hash-e94daaff79c2ab8d9c31d9c3058d7d0a0dd31204a5638dc1451fa67b2e3fb88c",
                    "weight": 1
                  }
                ],
                "main_purse": "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007",
                "named_keys": []
              },
              "api_version": "1.4.4",
              "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3"
            }
          }
        }

```

</details>

### chain_get_state_root_hash {#chain-get-state-root-hash} 

This method returns a state root hash at a given [Block](https://casper.network/docs/design/block-structure). If you do not specify a `block_identifier`, you will receive the highest state root hash.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](../sdkspec/components#blockidentifier)|Object|The block hash. (Optional)|

#### `chain_get_state_root_hash_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[state_root_hash](../sdkspec/components#digest)|String| Hex-encoded hash of the state root.|

<details>

<summary><b>Example chain_get_state_root_hash</b></summary>

```bash

{
          "name": "chain_get_state_root_hash_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Height": 10
              }
            }
          ],
          "result": {
            "name": "chain_get_state_root_hash_example_result",
            "value": {
              "api_version": "1.4.4",
              "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808"
            }
          }
        }

```

</details>

### state_get_balance {#state-get-balance}

This method returns a purse's balance from a network.

This method takes in the formatted representation of the account main purse, which can be found using [`state_get_account_info`](#stategetaccountinfo). It returns the associated balance in motes. One [CSPR](https://casper.network/docs/glossary/C#cspr) is made up of 1,000,000,000 motes.

This method takes in the formatted representation of a purse URef. If you wish to query for the balance of an account, you must provide the formatted representation of the account's main purse URef. It returns the balance of a purse in motes.

For the Casper Mainnet network, 1 CSPR is made up of 1,000,000,000 motes.

|Parameter|Type|Description|
|---------|----|-----------|
|[state_root_hash](../sdkspec/components#digest)|String|The hash of state root.|
|purse_uref|String|Formatted URef.|

#### `state_get_balance_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[balance_value](../sdkspec/components#u512)|String|The balance value in motes.|
|[merkle_proof](../sdkspec/components#merkle-proof)|String|The merkle proof.|

<details>
<summary><b>Example state_get_balance</b></summary>

```bash

{
          "name": "state_get_balance_example",
          "params": [
            {
              "name": "purse_uref",
              "value": "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007"
            },
            {
              "name": "state_root_hash",
              "value": "0808080808080808080808080808080808080808080808080808080808080808"
            }
          ],
          "result": {
            "name": "state_get_balance_example_result",
            "value": {
              "api_version": "1.4.4",
              "balance_value": "123456",
              "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3"
            }
          }
        }

```

</details>

### info_get_deploy {#info-get-deploy}

This method returns a [Deploy](https://casper.network/docs/design/execution-semantics#execution-semantics-deploys) from the network. It requires a `deploy_hash` to query the deploy.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy_hash](../sdkspec/components#deployhash)|String|The deploy hash.|

#### `info_get_deploy_result`

If the `execution_results` is empty, it means that the network processed the `deploy`, but has yet to execute it. If the network executed the `deploy`, it will return the results of the execution. Execution results contain the block hash which contains the deploy.

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[deploy](../sdkspec/components#deploy)|Object|The deploy.|
|[execution_results](../sdkspec/components#jsonexecutionresult)|Object|The map of block hash to execution result.|

<details>

<summary><b>Example info_get_deploy</b></summary>

```bash

{
          "name": "info_get_deploy_example",
          "params": [
            {
              "name": "deploy_hash",
              "value": "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa"
            }
          ],
          "result": {
            "name": "info_get_deploy_example_result",
            "value": {
              "api_version": "1.4.4",
              "deploy": {
                "approvals": [
                  {
                    "signature": "012dbf03817a51794a8e19e0724884075e6d1fbec326b766ecfa6658b41f81290da85e23b24e88b1c8d9761185c961daee1adab0649912a6477bcd2e69bd91bd08",
                    "signer": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c"
                  }
                ],
                "hash": "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa",
                "header": {
                  "account": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                  "body_hash": "d53cf72d17278fd47d399013ca389c50d589352f1a12593c0b8e01872a641b50",
                  "chain_name": "casper-example",
                  "dependencies": [
                    "0101010101010101010101010101010101010101010101010101010101010101"
                  ],
                  "gas_price": 1,
                  "timestamp": "2020-11-17T00:39:24.072Z",
                  "ttl": "1h"
                },
                "payment": {
                  "StoredContractByName": {
                    "args": [
                      [
                        "amount",
                        {
                          "bytes": "e8030000",
                          "cl_type": "I32",
                          "parsed": 1000
                        }
                      ]
                    ],
                    "entry_point": "example-entry-point",
                    "name": "casper-example"
                  }
                },
                "session": {
                  "Transfer": {
                    "args": [
                      [
                        "amount",
                        {
                          "bytes": "e8030000",
                          "cl_type": "I32",
                          "parsed": 1000
                        }
                      ]
                    ]
                  }
                }
              },
              "execution_results": [
                {
                  "block_hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
                  "result": {
                    "Success": {
                      "cost": "123456",
                      "effect": {
                        "operations": [
                          {
                            "key": "account-hash-2c4a11c062a8a337bfc97e27fd66291caeb2c65865dcb5d3ef3759c4c97efecb",
                            "kind": "Write"
                          },
                          {
                            "key": "deploy-af684263911154d26fa05be9963171802801a0b6aff8f199b7391eacb8edc9e1",
                            "kind": "Read"
                          }
                        ],
                        "transforms": [
                          {
                            "key": "uref-2c4a11c062a8a337bfc97e27fd66291caeb2c65865dcb5d3ef3759c4c97efecb-007",
                            "transform": {
                              "AddUInt64": 8
                            }
                          },
                          {
                            "key": "deploy-af684263911154d26fa05be9963171802801a0b6aff8f199b7391eacb8edc9e1",
                            "transform": "Identity"
                          }
                        ]
                      },
                      "transfers": [
                        "transfer-5959595959595959595959595959595959595959595959595959595959595959",
                        "transfer-8282828282828282828282828282828282828282828282828282828282828282"
                      ]
                    }
                  }
                }
              ]
            }
          }
        }

```

</details>


### query_global_state {#query-global-state}

This method allows for you to query for a value stored under certain keys in global state. You may query using either a [Block hash](https://casper.network/docs/design/block-structure#block_hash) or state root hash.

* Note: Querying a purse's balance requires the use of `state_get_balance` rather than any iteration of `query_global_state`.

|Parameter|Type|Description|
|---------|----|-----------|   
|[state_identifier](../sdkspec/components#globalstateidentifier)|Object|The identifier used for the query.|
|key|String|`casper_types::Key` as a formatted string.|
|path|Array|The path components starting from the key as base.|
    
#### `query_global_state_result`

|Parameter|Type|Description|
|---------|----|-----------|     
|api_version|String|The RPC API version.|
|[block_header](../sdkspec/components#jsonblockheader)|Object|The block header if a Block hash was provided. (Not required)|
|[stored_value](../sdkspec/components#storedvalue)|Object|The stored value.|
|[merkle_proof](../sdkspec/components#merkle-proof)|String|The merkle proof.|

<details>

<summary><b>Example query_global_state</b></summary>

```bash

{
          "name": "query_global_state_example",
          "params": [
            {
              "name": "key",
              "value": "deploy-af684263911154d26fa05be9963171802801a0b6aff8f199b7391eacb8edc9e1"
            },
            {
              "name": "path",
              "value": []
            },
            {
              "name": "state_identifier",
              "value": {
                "BlockHash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            }
          ],
          "result": {
            "name": "query_global_state_example_result",
            "value": {
              "api_version": "1.4.4",
              "block_header": {
                "accumulated_seed": "ac979f51525cfd979b14aa7dc0737c5154eabe0db9280eceaa8dc8d2905b20d5",
                "body_hash": "cd502c5393a3c8b66d6979ad7857507c9baf5a8ba16ba99c28378d3a970fff42",
                "era_end": {
                  "era_report": {
                    "equivocators": [
                      "013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29"
                    ],
                    "inactive_validators": [
                      "018139770ea87d175f56a35466c34c7ecccb8d8a91b4ee37a25df60f5b8fc9b394"
                    ],
                    "rewards": [
                      {
                        "amount": 1000,
                        "validator": "018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c"
                      }
                    ]
                  },
                  "next_era_validator_weights": [
                    {
                      "validator": "016e7a1cdd29b0b78fd13af4c5598feff4ef2a97166e3ca6f2e4fbfccd80505bf1",
                      "weight": "456"
                    },
                    {
                      "validator": "018a875fff1eb38451577acd5afee405456568dd7c89e090863a0557bc7af49f17",
                      "weight": "789"
                    },
                    {
                      "validator": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                      "weight": "123"
                    }
                  ]
                },
                "era_id": 1,
                "height": 10,
                "parent_hash": "0707070707070707070707070707070707070707070707070707070707070707",
                "protocol_version": "1.0.0",
                "random_bit": true,
                "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
                "timestamp": "2020-11-17T00:39:24.072Z"
              },
              "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3",
              "stored_value": {
                "Account": {
                  "account_hash": "account-hash-e94daaff79c2ab8d9c31d9c3058d7d0a0dd31204a5638dc1451fa67b2e3fb88c",
                  "action_thresholds": {
                    "deployment": 1,
                    "key_management": 1
                  },
                  "associated_keys": [
                    {
                      "account_hash": "account-hash-e94daaff79c2ab8d9c31d9c3058d7d0a0dd31204a5638dc1451fa67b2e3fb88c",
                      "weight": 1
                    }
                  ],
                  "main_purse": "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007",
                  "named_keys": []
                }
              }
            }
          }
        }

```

</details>

### state_get_dictionary_item {#state-get-dictionary-item}

This method returns an item from a Dictionary. Every dictionary has a seed URef, findable by using a `dictionary_identifier`. The address of a stored value is the blake2b hash of the seed URef and the byte representation of the dictionary key.
You may query a stored value directly using the dictionary address.

|Parameter|Type|Description|
|---------|----|-----------|
|[state_root_hash](../sdkspec/components#digest)|String|Hash of the state root.|
|[dictionary_identifier](../sdkspec/components#dictionaryidentifier)|Object|The Dictionary query identifier.|
    
#### `state_get_dictionary_item_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|dictionary_key|String|The key under which the value is stored.|
|[stored_value](../sdkspec/components#storedvalue)|Object|The stored value.|
|[merkle_proof](../sdkspec/components#merkle-proof)|String|The merkle proof.|

<details>

<summary><b>Example state_get_dictionary_item</b></summary>

```bash

{
          "name": "state_get_dictionary_item_example",
          "params": [
            {
              "name": "dictionary_identifier",
              "value": {
                "URef": {
                  "dictionary_item_key": "a_unique_entry_identifier",
                  "seed_uref": "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007"
                }
              }
            },
            {
              "name": "state_root_hash",
              "value": "0808080808080808080808080808080808080808080808080808080808080808"
            }
          ],
          "result": {
            "name": "state_get_dictionary_item_example_result",
            "value": {
              "api_version": "1.4.4",
              "dictionary_key": "dictionary-67518854aa916c97d4e53df8570c8217ccc259da2721b692102d76acd0ee8d1f",
              "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3",
              "stored_value": {
                "CLValue": {
                  "bytes": "0100000000000000",
                  "cl_type": "U64",
                  "parsed": 1
                }
              }
            }
          }
        }

```

</details>

## Informational or Secondary JSON-RPC Methods {#secondary-json-rpc-methods}

These methods are considered informational or secondary. Initial approval may not hinge upon the inclusion of these methods. Yet, they provide useful interactions for some clients and should be included as possible.

### info_get_peers {#info-get-peers}

This method returns a list of peers connected to the node.

#### `info_get_peers_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[peers](../sdkspec/components#peersmap)|Array|The node ID and network address of each connected peer.|

<details>

<summary><b>Example info_get_peers</b></summary>

```bash

{
          "name": "info_get_peers_example",
          "params": [],
          "result": {
            "name": "info_get_peers_example_result",
            "value": {
              "api_version": "1.4.4",
              "peers": [
                {
                  "address": "127.0.0.1:54321",
                  "node_id": "tls:0101..0101"
                }
              ]
            }
          }
        }

```

</details>

### info_get_status {#info-get-status}

This method returns the current status of the node.

#### `info_get_status_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|build_version|String|The compiled node version.|
|chainspec_name|String|The chainspec name, used to identify the currently connected network.|
|[last_added_block_info](../sdkspec/components#minimalblockinfo)|Object|The minimal info of the last block from the linear chain. (Not Required)|
|[next_upgrade](../sdkspec/components#nextupgrade)|Object|Information about the next scheduled upgrade. (Not Required)|
|[our_public_signing_key](../sdkspec/components#publickey)|String|Our public signing key. (Not required)|
|[peers](../sdkspec/components#peersmap)|Array|The node ID and network address of each connected peer.|
|[round_length](../sdkspec/components#timediff)|Integer|The next round length if this node is a validator. A round length is the amount of time it takes to reach consensus on proposing a block. (Not required)|
|[starting_state_root_hash](../sdkspec/components#digest)|String|The state root hash used at the start of the current session.|
|[uptime](../sdkspec/components#timediff)|Integer|Time that passed since the node has started.|

<details>

<summary><b>Example info_get_status</b></summary>

```bash

{
          "name": "info_get_status_example",
          "params": [],
          "result": {
            "name": "info_get_status_example_result",
            "value": {
              "api_version": "1.4.4",
              "build_version": "1.4.4-6962edb3d-casper-mainnet",
              "chainspec_name": "casper-example",
              "last_added_block_info": {
                "creator": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                "era_id": 1,
                "hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
                "height": 10,
                "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
                "timestamp": "2020-11-17T00:39:24.072Z"
              },
              "next_upgrade": {
                "activation_point": 42,
                "protocol_version": "2.0.1"
              },
              "our_public_signing_key": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
              "peers": [
                {
                  "address": "127.0.0.1:54321",
                  "node_id": "tls:0101..0101"
                }
              ],
              "round_length": "1m 5s 536ms",
              "starting_state_root_hash": "0202020202020202020202020202020202020202020202020202020202020202",
              "uptime": "13s"
            }
          }
        }

```

</details>

### info_get_validator_changes {#info-get-validator-changes}

This method returns status changes of active validators. Listed changes occurred during the `EraId` contained within the response itself. A validator may show more than one change in a single era.

Potential change types:

|Change Type|Description|
|-----------|-----------|
|Added|The validator has been added to the set.|
|Removed|The validator has been removed from the set.|
|Banned|The validator has been banned in the current era.|
|CannotPropose|The validator cannot propose a block.|
|SeenAsFaulty|The validator has performed questionable activity.|

#### `info_get_validator_changes_result`

If no changes occurred in the current era, `info_get_validator_changes` will return empty.
    
|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[changes](../sdkspec/components#jsonvalidatorchanges)|Object|The validators' status changes.|

<details>

<summary><b>Example info_get_validator_changes</b></summary>

```bash

{
          "name": "info_get_validator_changes_example",
          "params": [],
          "result": {
            "name": "info_get_validator_changes_example_result",
            "value": {
              "api_version": "1.4.4",
              "changes": [
                {
                  "public_key": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                  "status_changes": [
                    {
                      "era_id": 1,
                      "validator_change": "Added"
                    }
                  ]
                }
              ]
            }
          }
        }

```

</details>

### chain_get_block {#chain-get-block}

This method returns the JSON representation of a [Block](https://casper.network/docs/design/block-structure) from the network.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](../sdkspec/components#blockidentifier)|Object|The block hash or the block height.|

#### `chain_get_block_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block](../sdkspec/components#jsonblock)|Object|The block, if found. (Not required)|

<details>

<summary><b>Example chain_get_block</b></summary>

```bash

{
          "name": "chain_get_block_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            }
          ],
          "result": {
            "name": "chain_get_block_example_result",
            "value": {
              "api_version": "1.4.4",
              "block": {
                "body": {
                  "deploy_hashes": [],
                  "proposer": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                  "transfer_hashes": [
                    "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa"
                  ]
                },
                "hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
                "header": {
                  "accumulated_seed": "ac979f51525cfd979b14aa7dc0737c5154eabe0db9280eceaa8dc8d2905b20d5",
                  "body_hash": "cd502c5393a3c8b66d6979ad7857507c9baf5a8ba16ba99c28378d3a970fff42",
                  "era_end": {
                    "era_report": {
                      "equivocators": [
                        "013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29"
                      ],
                      "inactive_validators": [
                        "018139770ea87d175f56a35466c34c7ecccb8d8a91b4ee37a25df60f5b8fc9b394"
                      ],
                      "rewards": [
                        {
                          "amount": 1000,
                          "validator": "018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c"
                        }
                      ]
                    },
                    "next_era_validator_weights": [
                      {
                        "validator": "016e7a1cdd29b0b78fd13af4c5598feff4ef2a97166e3ca6f2e4fbfccd80505bf1",
                        "weight": "456"
                      },
                      {
                        "validator": "018a875fff1eb38451577acd5afee405456568dd7c89e090863a0557bc7af49f17",
                        "weight": "789"
                      },
                      {
                        "validator": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                        "weight": "123"
                      }
                    ]
                  },
                  "era_id": 1,
                  "height": 10,
                  "parent_hash": "0707070707070707070707070707070707070707070707070707070707070707",
                  "protocol_version": "1.0.0",
                  "random_bit": true,
                  "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
                  "timestamp": "2020-11-17T00:39:24.072Z"
                },
                "proofs": [
                  {
                    "public_key": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
                    "signature": "016291a7b2689e2edcc6e79030be50edd02f9bd7d809921ae2654012f808c7b9a0f125bc32d6aa610cbd012395a9832ccfaa9262023339f1db71ca073a13bb9707"
                  }
                ]
              }
            }
          }
        }

```

</details>

### chain_get_block_transfers {#chain-get-block-transfers}

This method returns all native transfers within a given [Block](https://casper.network/docs/design/block-structure) from a network.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](../sdkspec/components#blockidentifier)|Object|The block hash.|

#### `chain_get_block_transfers_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block_hash](../sdkspec/components#blockhash)|Object|The block hash, if found. (Not required)|
|[transfers](../sdkspec/components#transfer)|Array|The block's transfers, if found. (Not required)|

<details>

<summary><b>Example chain_get_block_transfers</b></summary>

```bash

{
          "name": "chain_get_block_transfers_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            }
          ],
          "result": {
            "name": "chain_get_block_transfers_example_result",
            "value": {
              "api_version": "1.4.4",
              "block_hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
              "transfers": [
                {
                  "amount": "0",
                  "deploy_hash": "0000000000000000000000000000000000000000000000000000000000000000",
                  "from": "account-hash-0000000000000000000000000000000000000000000000000000000000000000",
                  "gas": "0",
                  "id": null,
                  "source": "uref-0000000000000000000000000000000000000000000000000000000000000000-000",
                  "target": "uref-0000000000000000000000000000000000000000000000000000000000000000-000",
                  "to": null
                }
              ]
            }
          }
        }

```

</details>

### chain_get_era_info_by_switch_block

This method returns an EraInfo from the network. Only the last block in an `era`, known as a switch block, will contain an `era_summary`.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](../sdkspec/components#blockidentifier)|Object|The block identifier. If you do not supply a `block_identifier`, the returned information will be the most recent block. (Optional)|

#### `chain_get_era_info_by_switch_block_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[era_summary](../sdkspec/components#erasummary)|Object|The era summary (If found).|

<details>

<summary><b>Example chain_get_era_info_by_switch_block</b></summary>

```bash

{
          "name": "chain_get_era_info_by_switch_block_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            }
          ],
          "result": {
            "name": "chain_get_era_info_by_switch_block_example_result",
            "value": {
              "api_version": "1.4.4",
              "era_summary": {
                "block_hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
                "era_id": 42,
                "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3",
                "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
                "stored_value": {
                  "EraInfo": {
                    "seigniorage_allocations": [
                      {
                        "Delegator": {
                          "amount": "1000",
                          "delegator_public_key": "01e1b46a25baa8a5c28beb3c9cfb79b572effa04076f00befa57eb70b016153f18",
                          "validator_public_key": "012a1732addc639ea43a89e25d3ad912e40232156dcaa4b9edfc709f43d2fb0876"
                        }
                      },
                      {
                        "Validator": {
                          "amount": "2000",
                          "validator_public_key": "012a1732addc639ea43a89e25d3ad912e40232156dcaa4b9edfc709f43d2fb0876"
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }

```

</details>

### state_get_auction_info {#state-get-auction-info}

This method returns the [bids](https://casper.network/docs/economics/consensus#bids) and [validators](https://casper.network/docs/glossary/V#validator) as of either a specific block (by height or hash). If you do not provide a  `block_identifier`, `state_get_auction_info` will return information from the most recent block.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](../sdkspec/components#blockidentifier)|Object|The block identifier.|

#### `state_get_auction_info_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[auction_state](../sdkspec/components#auctionstate)|Object|The auction state.|

<details>

<summary><b>Example state_get_auction_info</b></summary>

```bash

{
          "name": "state_get_auction_info_example",
          "params": [
            {
              "name": "block_identifier",
              "value": {
                "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
              }
            }
          ],
          "result": {
            "name": "state_get_auction_info_example_result",
            "value": {
              "api_version": "1.4.4",
              "auction_state": {
                "bids": [
                  {
                    "bid": {
                      "bonding_purse": "uref-fafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafa-007",
                      "delegation_rate": 0,
                      "delegators": [],
                      "inactive": false,
                      "staked_amount": "10"
                    },
                    "public_key": "01197f6b23e16c8532c6abc838facd5ea789be0c76b2920334039bfa8b3d368d61"
                  }
                ],
                "block_height": 10,
                "era_validators": [
                  {
                    "era_id": 10,
                    "validator_weights": [
                      {
                        "public_key": "01197f6b23e16c8532c6abc838facd5ea789be0c76b2920334039bfa8b3d368d61",
                        "weight": "10"
                      }
                    ]
                  }
                ],
                "state_root_hash": "0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b"
              }
            }
          }
        }

```

</details>