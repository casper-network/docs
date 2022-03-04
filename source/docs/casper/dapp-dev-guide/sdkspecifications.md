# Casper SDK Specification

This document outlines the methods and endpoints available to developers crafting an SDK for use with Casper networks.  They are divided into a fundamental and a secondary section based upon the necessity of their use for interacting with the Casper blockchain.

For examples of completed SDKs, please refer to our [SDK Client Libraries](https://casper.network/docs/sdk) section.

## Fundamental JSON-RPC Methods {#primary-json-rpc-methods}

The following methods are fundamental to any SDK interacting with a Casper network. To gain approval, a Casper SDK must include means to interact with the these JSON-RPC methods.

### account_put_deploy {#account-put-deploy}

This is a method through which users can interact with a node on a Casper network. It takes in a [deploy](https://casper.network/docs/design/execution-semantics#execution-semantics-deploys) as an argument, which is then sent to a node on the network, gossiped and finally executed by nodes on the network.

This method allows users to send their compiled WASM as deploys to the network for execution.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](#deploy)|Object|A deploy consists of an item containing a smart contract along with the requester's signature(s).|

#### `account_put_deploy_result`

The result contains the [deploy_hash](#deployhash), which is the primary identifier of a deploy within a Casper network.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[deploy_hash](#deployhash)|String| A hex-encoded hash of the deploy as sent.|

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
|[public_key](#publickey)|String| The public key of the Account.|
|[block_identifier](#blockidentifier)|Object| The block identifier.|

#### `state_get_account_info_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[account](#account)|Object|A JSON representation of the account structure.| 
|[merkle_proof](#merkleproof)|String|The merkle proof.|

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
|[block_identifier](#blockidentifier)|Object|The block hash. (Optional)|

#### `chain_get_state_root_hash_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[state_root_hash](#digest)|String| Hex-encoded hash of the state root.|

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
|[state_root_hash](#digest)|String|The hash of state root.|
|purse_uref|String|Formatted URef.|

#### `state_get_balance_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[balance_value](#u512)|String|The balance value in motes.|
|[merkle_proof](#merkle-proof)|String|The merkle proof.|

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
|[deploy_hash](#deployhash)|String|The deploy hash.|

#### `info_get_deploy_result`

If the `execution_results` is empty, it means that the network processed the `deploy`, but has yet to execute it. If the network executed the `deploy`, it will return the results of the execution. Execution results contain the block hash which contains the deploy.

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[deploy](#deploy)|Object|The deploy.|
|[execution_results](#jsonexecutionresult)|Object|The map of block hash to execution result.|

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
|[state_identifier](#globalstateidentifier)|Object|The identifier used for the query.|
|key|String|`casper_types::Key` as a formatted string.|
|path|Array|The path components starting from the key as base.|
    
#### `query_global_state_result`

|Parameter|Type|Description|
|---------|----|-----------|     
|api_version|String|The RPC API version.|
|[block_header](#jsonblockheader)|Object|The block header if a Block hash was provided. (Not required)|
|[stored_value](#storedvalue)|Object|The stored value.|
|[merkle_proof](#merkle-proof)|String|The merkle proof.|

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
|[state_root_hash](#digest)|String|Hash of the state root.|
|[dictionary_identifier](#dictionaryidentifier)|Object|The Dictionary query identifier.|
    
#### `state_get_dictionary_item_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|dictionary_key|String|The key under which the value is stored.|
|[stored_value](#storedvalue)|Object|The stored value.|
|[merkle_proof](#merkle-proof)|String|The merkle proof.|

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
|[peers](#peersmap-peersmap)|Array|The node ID and network address of each connected peer.|

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
|[last_added_block_info](#minimalblockinfo-minimalblockinfo)|Object|The minimal info of the last block from the linear chain. (Not Required)|
|[next_upgrade](#nextupgrade-nextupgrade)|Object|Information about the next scheduled upgrade. (Not Required)|
|[our_public_signing_key](#publickey-publickey)|String|Our public signing key. (Not required)|
|[peers](#peersmap-peersmap)|Array|The node ID and network address of each connected peer.|
|[round_length](#timediff-timediff)|Integer|The next round length if this node is a validator. A round length is the amount of time it takes to reach consensus on proposing a block. (Not required)|
|[starting_state_root_hash](#digest-digest)|String|The state root hash used at the start of the current session.|
|[uptime](#timediff-timediff)|Integer|Time that passed since the node has started.|

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
|[changes](#jsonvalidatorchanges)|Object|The validators' status changes.|

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
|[block_identifier](#blockidentifier-blockidentifier)|Object|The block hash or the block height.|

#### `chain_get_block_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block](#jsonblock-jsonblock)|Object|The block, if found. (Not required)|

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
|[block_identifier](#blockidentifier-blockidentifier)|Object|The block hash.|

#### `chain_get_block_transfers_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block_hash](#blockhash-blockhash)|Object|The block hash, if found. (Not required)|
|[transfers](#transfer-transfer)|Array|The block's transfers, if found. (Not required)|

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
|[block_identifier](#blockidentifier-blockidentifier)|Object|The block identifier. If you do not supply a `block_identifier`, the returned information will be the most recent block. (Optional)|

#### `chain_get_era_info_by_switch_block_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[era_summary](#erasummary-erasummary)|Object|The era summary (If found).|

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
|[block_identifier](#blockidentifier-blockidentifier)|Object|The block identifier.|

#### `state_get_auction_info_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[auction_state](#auctionstate-auctionstate)|Object|The auction state.|

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

## Components {#components}

The following definitions expand on parameter seen elsewhere within the SDK specifications and are provided for clarity and completeness.

### Account {#account}

Structure representing a user's account, stored in global state.

Required Parameters:

* [`account_hash`](#accounthash)

* [`action_thresholds`](#actionthresholds)

* [`associated_keys`](#associatedkey)

* [`main_purse`](#uref)

* [`named_keys`](#namedkey)

### AccountHash {#accounthash}

Hex-encoded account hash.

### ActionThresholds {#actionthresholds}

Thresholds that have to be met when executing an action of a certain type.

Required Parameters:

* `deployment`

* `key_management`

### ActivationPoint {#activationpoint}

The first era to which the associated protocol version applies.

* [`era_id`](#eraid)

* [`timestamp`](#timestamp)

### Approval {#approval}

A struct containing a signature and the public key of the signer.

Required Parameters:

* [`signature`](#signature)

* [`signer`](#publickey)

### AssociatedKey {#associatedkey}

A key granted limited permissions to an account, for purposes such as multisig.

Required Parameters:

* [`account_hash`](#accounthash)

* `weight`

### AuctionState {#auctionstate}

Data structure summarizing auction contract data.

Required Parameters:

* [`bids`](#jsonbids) All bids contained within a vector.

* `block_height` Block height.

* [`era_validators`](#jsoneravalidators) Era validators.

* [`state_root_hash`](#digest) Global state hash.

### Bid {#bid}

An entry in the validator map.

Required Parameters:

* [`bonding_purse`](#uref) The purse that was used for bonding.

* `delegation_rate` The delegation rate.

* [`delegators`](#delegator) The validator's delegators, indexed by their public keys.

* `inactive` `true` if validator has been "evicted".

* [`staked_amount`](#u512) The amount of tokens staked by a validator (not including delegators).

* [`validator_public_key`](#publickey) Validator's public key.

Additional Parameters:

* [`vesting_schedule`](#vestingschedule) Vesting schedule for a genesis validator. `None` if non-genesis validator.

### BlockHash {#blockhash}

A cryptographic hash identifying a `Block`.

### BlockIdentifier {#blockidentifier}

Identifier for possible ways to retrieve a block.

* [`Hash`](#blockhash) Identify and retrieve the block with its hash.

* `Height` Identify and retrieve the block with its height.

### CLType {#cltype}

Casper types, i.e. types which can be stored and manipulated by smart contracts. Provides a description of the underlying data type of a [`CLValue`](crate::CLValue).

        `Bool`
        `I32`
        `I64`
        `U8`
        `U32`
        `U64`
        `U128`
        `U256`
        `U512`
        `Unit`
        `String`
        `Key`
        `URef`
        `PublicKey`
        `Any`

* `Option` Option of a `CLType`.

* `List` Variable-length list of a single `CLType` (comparable to a `Vec`).

* `ByteArray` Fixed-length list of a single `CLType` (comparable to a Rust array).

* `Result` `Result` with `Ok` and `Err` variants of `CLType`'s.

* `Map` Map with keys of a single `CLType` and values of a single `CLType`.

* `Tuple1` 1-ary tuple of a `CLType`.

* `Tuple2` 2-ary tuple of `CLType`s.

* `Tuple3` 3-ary tuple of `CLType`s.

### CLValue {#clvalue} 

A Casper value, i.e. a value which can be stored and manipulated by smart contracts. It holds the underlying data as a type-erased, serialized `Vec<u8>` and also holds the CLType of the underlying data as a separate member. The `parsed` field, representing the original value, is a convenience only available when a CLValue is encoded to JSON, and can always be set to null if preferred.

* `bytes` A Casper serialized representation of the underlying value. For more information, reference the [Serialization Standard](https://casper.network/docs/design/serialization-standard).

* [`cl_type`](#cltype)

### Contract {#contract} 

A contract struct that can be serialized as a JSON object.

Required Parameters:

[`contract_package_hash`](#contractpackagehash)

[`contract_wasm_hash`](#contractwasmhash)

[`entry_points`](#entrypoint)

[`named_keys`](#namedkey)

`protocol_version`

### ContractHash {#contracthash}

The hash address of the contract.

### ContractPackage {#contractpackge}

Contract definition, metadata and security container.

Required Parameters:

* [`access_key`](#uref)

* [`disabled_versions`](#disabledversions)

* [`groups`](#groups)

* [`versions`](#contractversion)

### ContractPackageHash {#contractpackagehash}

The hash address of the contract package.

### ContractVersion {#contractversion}

The version of the contract.

Required Parameters:

* [`contract_hash`](#contracthash)

* `contract_version`

* `protocol_version_major`

### ContractWasmHash {#contractwasmhash}

The hash address of the contract WASM.

### Delegator {#delegator}

Represents a party delegating their stake to a validator (or "delegatee").

Required Parameters:

* [`bonding_purse`](#uref)

* [`delegator_public_key`](#publickey)

* [`staked_amount`](#u512)

* [`validator_public_key`](#publickey)

Additional Parameters:

* [`vesting_schedule`](#vestingschedule)

### Deploy {#deploy}

A deploy; an item containing a smart contract along with the requester's signature(s).

Required properties:

* [`approvals`](#approval)

* [`hash`](#deployhash)

* [`header`](#deployheader)

* [`payment`](#executabledeployitem)

* [`sessions`](#executabledeployitem)

### DeployHash {#deployhash}

Hex-encoded deploy hash.

### DeployHeader {#deployheader}

The header portion of a deploy.

Required Parameters:

* [`account`](#publickey)

* [`body_hash`](#digest)

* `chain_name` A user defined string.

* [`dependencies`](#deployhash)

* `gas_price` Defined as an integer in UInt64 format.

* [`timestamp`](#timestamp)

* [`ttl`](#timediff)

### DeployInfo {#deployinfo}

Information relating to the given Deploy.

Required Parameters:

* [`deploy_hash`](#deployhash) The relevant Deploy.

* [`from`](#accounthash) Account identifier of the creator of the Deploy.

* [`gas`](#u512) Gas cost of executing the Deploy.

* [`source`](#uref) Source purse used for payment of the Deploy.

* [`transfers`](#transferaddr) Transfers performed by the Deploy.

### DictionaryIdentifier {#dictionaryidentifier}

Options for dictionary item lookups.

* `AccountNamedKey` Lookup a dictionary item via an Account's named keys.

    Required Parameters:

    `key` The account key as a formatted string whose named keys contain dictionary_name.

    `dictionary_name` The named key under which the dictionary seed URef is stored.

    `dictionary_item_key` The dictionary item key formatted as a string.

* `ContractNamedKey` Lookup a dictionary item via a Contract's named keys.

    `key` The contract key as a formatted string whose named keys contains dictionary_name.

    `dictionary_name` The named key under which the dictionary seed URef is stored.

    `dictionary_item_key` The dictionary item key formatted as a string.
        
* `URef` Lookup a dictionary item via its seed URef.

    `seed_uref` The dictionary's seed URef.

    `dictionary_item_key` The dictionary item key formatted as a string.

* `Dictionary` Lookup a dictionary item via its unique key.

### Digest {#digest}

Hex-encoded hash digest.

### DisabledVersions {#disabledversions}

Required Parameters:

* `contract_version`

* `protocol_version_major`

### EntryPoint {#entrypoint}

Type signature of a method. Order of arguments matter since this can be referenced by index as well as name.

Required Parameters:

* [`access`](#entrypointaccess)

* [`args`](#parameter)

* [`entry_point_type`](#entrypointtype)

* `name`

* [`ret`](#cltype)

### EntryPointAccess {#entrypointaccess}

Enum describing the possible access control options for a contract entry point (method).

* `Public`

* [`Groups`](#group) Only users from the listed groups may call this method. Note: If this list is empty then this method is not callable from outside the contract.

### EntryPointType {#entrypointype}

Context of a method execution.

* `session`

* `contract`

### EraID {#eraid}

Era ID newtype.

### EraInfo {#erainfo}

Auction metadata. Intended to be recorded at each era.

### EraSummary {#erasummary}

The summary of an era.

Required Parameters:

* [`block_hash`](#blockhash) The block hash.

* [`era_id`](#eraid) The era id.

* [`merkle_proof`](#merkle-proof) The merkle proof.

* [`state_root_hash`](#digest) Hex-encoded hash of the state root.

* [`stored_value`](#storedvalue) The StoredValue containing era information.

### ExecutableDeployItem {#executabledeployitem}

Represents possible variants of an executable deploy.

#### `ModuleBytes` {#modulebytes}

Executable specified as raw bytes that represent WASM code and an instance of `RuntimeArgs`.

Required Parameters:

* `module_bytes` Hex-encoded raw Wasm bytes. There are some special cases around passing `module_bytes` for payment code.

Additional Parameters:

* [`args`](#runtimeargs) Runtime arguments.

#### `StoredContractByHash` {#storedcontractbyhash}

Stored contract referenced by its `ContractHash`, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `hash` A hex-encoded hash.

#### `StoredContractByName` {#storedcontractbyname}

Stored contract referenced by a named key existing in the signer's account context, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `name` A named key.

#### `StoredVersionContractByHash` {#storedversioncontractbyhash}

Stored versioned contract referenced by its `ContractPackageHash`, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `hash` A hex-encoded hash.

Additional Parameters:

* `version` An optional version of the contract to call. It will default to the highest enabled version if no value is specified.

#### `StoredVersionContractByName` {#storedversioncontractbyname}

Stored versioned contract referenced by a named key existing in the signer's account context, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `name` A named key.

Additional Parameters:

* `version` An optional version of the contract to call. It will default to the highest enabled version if no value is specified.

#### `Transfer` {#transfer}

A native transfer which does not contain or reference a WASM code.

Required Parameters:

* [`args`](#runtimeargs)

### ExecutionEffect {#executioneffect} 

The journal of execution transforms from a single deploy.

Required Parameters:

* [`operations`](#oepration)

* [`transforms`](#transformentry)

### ExecutionResult {#executionresult}

The result of executing a single deploy.

* `Failure` The result of a failed execution`

    Required Parameters:

    [`effect`](#executioneffect)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

    `error_message` The error message associated with executing the deploy.

* `Success` The result of a successful execution.

    Required Parameters:

    [`effect`](#executioneffect)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

### GlobalStateIdentifier {#globalstateidentifier}

Identifier for possible ways to query global state.

* [`BlockHash`](#blockhash) Query using a block hash.

* [`StateRootHash`](#digest) Query using the state root hash.

### Group {#group}

A (labelled) "user group". Each method of a versioned contract may be associated with one or more user groups which are allowed to call it.

### Groups {#groups}

Required Parameters:

* `group`

* [`keys`](#uref)

### JsonBid {#jsonbid}

An entry in a founding validator map representing a bid.

Required Parameters:

* [`bonding_purse`](#uref) The purse that was used for bonding.

* `delegation_rate` The delegation rate.

* [`delegators`](#jsondelegator) The delegators.

* `inactive` Is this an inactive validator.

* [`staked_amount`](#u512) The amount of tokens staked by a validator (not including delegators).

### JsonBids {#jsonbids}

A Json representation of a single bid.

Required Parameters:

* [`bid`](#jsonbid)

* [`public_key`](#publickey)

### JsonBlock {#jsonblock}

A JSON-friendly representation of `Block`.

Required Parameters:

* [`body`](#jsonblockbody) JSON-friendly block body.

* [`hash`](#blockhash) BlockHash.

* [`header`](#jsonblockheader) JSON-friendly block header.

* [`proofs`](#jsonproof) JSON-friendly list of proofs for this block.

### JsonBlockBody {#jsonblockbody}

A JSON-friendly representation of `Body`.

Required Parameters:

* [`deploy_hashes`](#deployhash)

* [`proposer`](#publickey)

* [`transfer_hashes`](#deployhash)

### JsonBlockHeader {#jsonblockheader}

JSON representation of a block header.

* [`accumulated_seed`](#digest) Accumulated seed.

* [`body_hash`](#digest) The body hash.

* [`era_id`](#eraid) The block era id.

* `height` The block height.

* [`parent_hash`](#blockhash) The parent hash.

* [`protocol_version`](#protocolversion) The protocol version.

* `random_bit` Randomness bit.

* [`state_root_hash`](#digest) The state root hash.

* [`timestamp`](#timestamp) The block timestamp.

Additional Parameters:

* [`era_end`](#jsoneraend) The era end.

### JsonDelegator {#jsondelegator}

A delegator associated with the given validator.

Required Parameters:

* [`bonding_purse`](#uref)

* [`delegatee`](#publickey)

* [`public_key`](#publickey)

* [`staked_amount`](#u512)

### JsonEraEnd {#jsoneraend}

Required Parameters:

* [`era_report](#jsonerareport)

* [`next_era_validator_weight`](#validatorweight)

### JsonEraReport {#jsonerareport}

Equivocation and reward information to be included in the terminal block.

Required Parameters:

* [`equivocators`](#publickey)

* [`inactive_validators`](#publickey)

* [`rewards`](#reward)

### JsonEraValidators {#jsoneravalidators}

The validators for the given era.

Required Parameters:

* [`era_id`](#eraid)

* [`validator_weights`](#jsonvalidatorsweights)

### JsonExecutionResult {#jsonexecutionresult}

The execution result of a single deploy.

* [`block_hash`](#blockhash)

* [`result`](#executionresult)

### JsonProof {#jsonproof}

A JSON-friendly representation of a proof, i.e. a block's finality signature.

Required Parameters:

* [`public_key`](#publickey)

* [`signature`](#signature)

### JsonValidatorChanges {#jsonvalidatorchanges}

The changes in a validator's status.

Required Parameters:

* [`public_key`](#publickey) The public key of the validator.

* [`status_changes`](#jsonvalidatorstatuschange) The set of changes to the validator's status.

### JsonValidatorStatusChange {#jsonvalidatorstatuschange}

A single change to a validator's status in the given era.

Required Parameters:

* [`era_id`](#eraid) The era in which the change occurred.

* [`validator_change`](#validatorchange) The change in validator status.

### JsonValidatorsWeights {#jsonvalidatorweights}

A validator's weight.

Required Parameters:

* [`public_key`](#publickey)

* [`weight`](#u512)

### Merkle_Proof {#merkle-proof}

A merkle proof is a construction created using a merkle trie that allows verification of the associated hashes.

### MinimalBlockInfo {#minimalblockinfo}

Minimal info of a `Block`.

Required Parameters:

* [`creator`](#publickey)

* [`era_id`](#eraid)

* [`hash`](#blockhash)

* `height`

* [`state_root_hash`](#digest)

* [`timestamp`](#timestamp)

### NamedArg {#namedarg}

Named arguments to a contract.

### NamedKey {#namedkey}

A named key.

Required Parameters:

* `key` The value of the entry: a casper `Key` type.

* `name` The name of the entry.

### NextUpgrade {#nextupgrade}

Information about the next protocol upgrade.

Required Parameters:

* [`activation_point`](#activationpoint)

* `protocol_version`

### Operation {#operation}

An operation performed while executing a deploy.

Required Parameters:

* `key` The formatted string of the `Key`.

* [`kind`](#opkind)

### OpKind {#opkind}

The type of operation performed while executing a deploy.

### Parameter {#parameter}

Parameter to a method.

Required Parameters:

* [`cl_type`](#cltype)

* `name`

### PeerEntry {#peerentry}

Required Parameters:

* `address`

* `node_id`

### PeersMap {#peersmap}

Map of peer IDs to network addresses.

### ProtocolVersion {#protocolversion}

Casper Platform protocol version.

### PublicKey {#publickey}

Hex-encoded cryptographic public key, including the algorithm tag prefix.

### Reward {#reward}

Required Parameters:

* `amount`

* [`validator`](#publickey)

### RuntimeArgs {#runtimeargs}

Represents a collection of arguments passed to a smart contract.

### SeigniorageAllocation {#seigniorageallocation}

Information about a seignorage allocation.

* `Validator` Info about a seigniorage allocation for a validator.

    Required Parameters:

    [`amount`](#u512) Allocated amount.

    [`validator_public_key`](#publickey) Validator's public key.

* `Delegator` Info about a seigniorage allocation for a delegator.

    Require Parameters:

    [`amount`](#u512) Allocated amount.

    [`delegator_public_key`](#publickey) Delegator's public key.

    [`validator_public_key`](#publickey) Validator's public key.

### Signature {#signature}

Hex-encoded cryptographic signature, including the algorithm tag prefix.

### StoredValue {#storedvalue}

Representation of a value stored in global state. `Account`, `Contract` and `ContractPackage` have their own `json_compatibility` representation (see their docs for further info).

* [`CLValue`](#clvalue) A CasperLabs value.

* [`Account`](#account) An account.

* `ContractWasm` A contract's WASM.

* [`Contract`](#contract) Methods and type signatures supported by a contract`

* [`ContractPackage`](#contractpackage) A contract definition, metadata, and security container.

* [`Transfer`](#transfer) A record of a transfer.

* [`DeployInfo`](#deployinfo) A record of a deploy.

* [`EraInfo`](#erainfo) Auction metadata.

* [`Bid`](#bid-bid) A bid.

* [`Withdraw`](#unbondingpurse) A withdraw.

### TimeDiff {#timediff}

Human-readable duration.

### Timestamp {#timestamp}

Timestamp formatted as per RFC 3339.

### Transfer {#transfer}

Represents a transfer from one purse to another.

Required Parameters:

* [`amount`](#u512) Transfer amount.

* [`deploy_hash`](#deployhash) Deploy that created the transfer.

* [`from`](#accounthash) Account from which transfer was executed.

* [`gas`](#u512)

* [`source`](#uref) Source purse.

* [`target`](#uref) Target purse.

Additional Parameters:

* `id` User-defined ID.

* [`to`](#accounthash) Account to which funds are transferred.

### TransferAddr {#transferaddr}

Hex-encoded transfer address.

### Transform {#transform}

The actual transformation performed while executing a deploy.

* `WriteCLValue` Write the given [CLValue](#clvalue) to global state.

* `WriteAccount` Writes the given [Account](#accounthash) to global state.

* `WriteDeployInfo` Writes the given [DeployInfo](#deployinfo) to global state.

* `WriteEraInfo` Writes the given [EraInfo](#erainfo) to global state.

* `WriteTransfer` Writes the given [Transfer](#transfer) to global state.

* `WriteBid` Writes the given [Bid](#bid) to global state.

* `WriteWithdraw` Writes the given [Withdraw](#unbondingpurse) to global state.

* `AddInt32` Adds the given `i32`.

* `AddUInt64` Adds the given `u64`.

* `AddUInt128` Adds the given [`U128`](#u128).

* `AddUInt256` Adds the given [`U256`](#u256).

* `AddUInt512` Adds the given [`U512`](#u512).

* `AddKeys` Adds the given collection of [named keys](#namedkey).

* `Failure` A failed transformation, containing an error message.

### TransformEntry {#transformentry}

A transformation performed while executing a deploy.

Required Parameters:

* `key` The formatted string of the `Key`.

* [`transforms`](#transform) The transformation.

### U128 {#u128}

Decimal representation of a 128-bit integer.

### U256 {#u256}

Decimal representation of a 256-bit integer.

### U512 {#u512}

Decimal representation of a 512-bit integer.

### UnbondingPurse {#unbondingpurse}

Unbonding purse.

Required Parameters:

* [`amount`](#u512) Unbonding amount.

* [`bonding_purse`](#uref) Bonding purse.

* [`era_of_creation`](#eraid) Era in which the unbonding request was created.

* [`unbonder_public_key`](#publickey) Unbonder's public key.

* [`validator_public_key`](#publickey) Validator's public key.

### URef {#uref}

Hex-encoded, formatted URef.

### ValidatorChange {#validatorchange}

A change to a validator's status between two eras.

* `Added`

* `Removed`

* `Banned`

* `CannotPropose`

* `SeenAsFaulty`

### ValidatorWeight {#validatorweight}

Required Parameters:

* [`validator`](#publickey)

* [`weight`](#u512)

### VestingSchedule {#vestingschedule}

Vesting schedule for a genesis validator.

## REST Information {#rest-information}

### `OpenRpcInfoField` {#openrpcinfofield}

This object provides metadata about the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`contact`|Object|Contact information for the API.|
|`description`|String|A description of the application.|
|`license`|Object|License information for the API.|
|`title`|String|The title of the application.|
|`version`|String|The version of the OpenRPC document.|

### `OpenRpcContactField` {#openrpccontactfield}

Contact information for the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The identifying name of the contact/organization.|
|`url`|String|The URL pointing to the contact information.|

### `OpenRpcLicenseField` {#openrpclicensefield}

License information for the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The license name used for the API.|
|`url`|String|A URL to the license used for the API.|

### `OpenRpcServerEntry` {#openrpcserverentry}

An object representing a server.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|A name to be used as the canonical name for the server.|
|`url`|String|A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenRPC document is being served. Server Variables are passed into the Runtime Expression to produce a server URL.|

### `Method` {#method}

Describes the interface for a given method name. The method name is used as the `method` field of the JSON-RPC body.

|Parameter|Type|Description|
|---------|----|-----------|
|`examples`|Array|An example use case of the `method` in question.|
|`name`|String|The unique name of a method.|
|`params`|Array|A list of applicable paramters for the `method` in question.|
|`result`|Object|A description of the result returned by the `method`.|
|`summary`|String|A short summary of what the `method` does.|

### `SchemaParam` {#schemaparam}

A content descriptor for associated parameters.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The name of the content being described.|
|`required`|Boolean|Determines if the content is a required field. Defaults to `false`|
|`schema`|Object|Schema that describes the content.|

### `Schema` {#schema}

A JSON Schema of one of two types:

* A trivial boolean JSON Schema. The schema `true` matches everything (always passes validation), whereas the schema `false` matches nothing (always fails validation).

* A JSON `Schema object`.

### `SchemaObject` {#schemaobject}

A JSON Schema Object.

|Property|Type|Description|
|--------|----|-----------|
|`type`|String/Null|The `type` keyword. See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).|
|`format`|String/Null|The `format` keyword. See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).|
|`enum`|Array/Null|The `enum` keyword. See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)|
|`const`||The `const` keyword. See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)|
|`$ref`|String/Null|The `$ref` keyword. See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).|
|`$id`|String/Null|The `$id` keyword. See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).|
|`title`|String/Null|The `title` keyword. See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).|
|`description`|String/Null|The `description` keyword. See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).|
|`default`||The `default` keyword. See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).|
|`deprecated`|Boolean|The `deprecated` keyword. See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).|
|`readOnly`|Boolean|The `readOnly` keyword. See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).|
|`writeOnly`|Boolean|The `writeOnly` keyword. See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).|
|`examples`|Array|The `examples` keyword. See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).|
|`allOf`|Array/Null|The `allOf` keyword. See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).|
|`anyOf`|Array/Null|The `anyOf` keyword. See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).|
|`oneOf`|Array/Null|The `oneOf` keyword. See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).|
|`not`|Schema/Null|The `not` keyword. See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).|
|`if`|Schema/Null|The `if` keyword. See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).|
|`then`|Schema/Null|The `then` keyword. See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).|
|`else`|Schema/Null|The `else` keyword. See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).|
|`multipleOf`|Number/Null|The `multipleOf` keyword. See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).|
|`maximum`|Number/Null|The `maximum` keyword. See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).|
|`exclusiveMaximum`|Number/Null|The `exclusiveMaximum` keyword. See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).|
|`minimum`|Number/Null|The `minimum` keyword. See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).|
|`exclusiveMinimum`|Number/Null|The `exclusiveMinimum` keyword. See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).|
|`maxLength`|Integer/Null|The `maxLength` keyword. See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).|
|`minLength`|Integer/Null|The `minLength` keyword. See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).|
|`pattern`|String/Null|The `pattern` keyword. See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).|
|`items`|Single or Vec/Null|The `items` keyword. See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).|
|`additionalItems`|Schema/Null|The `additionalItems` keyword. See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).|
|`maxItems`|Integer/Null|The `maxItems` keyword. See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).|
|`minItems`|Integer/Null|The `minItems` keyword. See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).|
|`uniqueItems`|Boolean/Null|The `uniqueItems` keyword. See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).|
|`contains`|Schema/Null|The `contains` keyword. See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).|
|`maxProperties`|Integer/Null|The `maxProperties` keyword. See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).|
|`minProperties`|Integer/Null|The `minProperties` keyword. See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).|
|`required`|Array|The `required` keyword. See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).|
|`properties`|Object|The `properties` keyword. See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).|
|`patternProperties`|Object|The `patternProperties` keyword. See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).|
|`additionalProperties`|Schema/Null|The `additionalProperties` keyword. See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).|
|`propertyNames`|Schema/Null|The `propertyNames` keyword. See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).|

### `SingleOrVec_for_InstanceType` {#singleorvec-for-instancetype}

A type which can be seralized as a single item, or multiple items. In some contexts, a `Single` may be semantically distinct from a `Vec` containing only one item.

Contains either an `InstanceType` or an array of `InstanceType`s.

### `InstanceType` {#instancetype}

The possible types of values in JSON Schema documents. See [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).

* `null`
* `boolean`
* `object`
* `array`
* `number`
* `string`
* `integer`

### `SingleOrVec_for_Schema` {#singleorvec-for-schema}

A type which can be serialized as a single item, or multiple items. In some contexts, a `Single` may be semnatically different from a `Vec` containing only one item.

Contains either a `Schema` or an array of `Schema`s.

### `ResponseResult` {#responseresult}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`schema`|Object||

### `Example` {#example}

An example pair of request params and response result.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|Name for the example pairing.|
|`params`|Array|Example parameters.|
|`result`|Object|Example result.|

### `ExampleParam` {#exampleparam}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`value`|||

### `ExampleResult` {#exampleresult}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`value`|||

### `Components` {#rest-components}

|Parameter|Type|Description|
|---------|----|-----------|
|`schema`|Schema|An object to hold reusable schema objects.|

## SSE Endpoints {#sse-endpoints}

### SseData {#sse-data}

The `data` field of the events sent on the event stream to clients.

### ApiVersion {#apiversion}

The version of this node's API server. This event will always be the first sent to a new client, and will have no associated event ID provided.

|Parameter|Type|Description|
|---------|----|-----------|
|[ApiVersion](#apiversion)|String|Casper Platform protocol version.|

### BlockAdded {#blockadded}

The given block has been added to the linear chain and stored locally.

|Parameter|Type|Description|
|---------|----|-----------|
|[block](#jsonblock)|Object|A JSON-friendly representation of a `Block`.|
|[block_hash](#blockhash)|String|A cryptographic hash identifying a `Block`.|

### DeployAccepted {#deployaccepted}

The given deploy has been newly-accepted by this node.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](#deploy)|Object|A deploy; an item containing a smart contract along with the requester's signature(s).|

### DeployProcessed {#deployprocessed}

The given deploy has been executed, committed and forms part of the given block.

|Parameter|Type|Description|
|---------|----|-----------|
|[account](#account)|String|Structure representing a user's account.|
|[block_hash](#blockhash)|String|A cryptographic hash identifying a `Block`.|
|dependencies|Array||
|[deploy_hash](#deployhash)|String|Hex-encoded deploy hash.|
|[execution_result](#executionresult)|Object|The result of executing a single deploy.|
|[timestamp](#timestamp)|Integer|Timestamp formatted as per RFC 3339.|
|[ttl](#timediff)|Integer|Human-readable duration.|

### DeployExpired {#deployexpired}

The given deploy has expired.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy_hash](#deployhash)|String|Hex-encoded deploy hash.|

#### Fault {#fault}

Generic representation of validator's fault in an era.

|Parameter|Type|Description|
|---------|----|-----------|
|[era_id](#eraid)|Integer|Era ID newtype.|
|[public_key](#publickey)|String|Checksummed hex-encoded cryptographic public key, including the algorithm tag prefix.|
|[timestamp](#timestamp)|Integer|Timestamp formatted as per RFC 3339.|

### FinalitySignature {#finalitysignature}

New finality signature received.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_hash](#blockhash)|String|A cryptographic hash identifying a `Block`.|
|[era_id](#eraid)|Integer|Era ID newtype.|
|[public_key](#publickey)|String|Checksummed hex-encoded cryptographic public key, including the algorithm tag prefix.|
|[signature](#signature)|String|Checksummed hex-encoded cryptographic signature, including the algorithm tag prefix.|

### Step {#step}

|Parameter|Type|Description|
|---------|----|-----------|
|[era_id](#eraid)|Integer|Era ID newtype.|
|[execution_effect](#executioneffect)|Object|The journal of execution transforms from a single deploy.|