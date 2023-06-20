# Informational JSON-RPC Methods {#informational}


The following methods return information from a node on a Casper network. The response should be identical, regardless of the node queried, as the information in question is objective and common to all nodes within a network.

---

## chain_get_block {#chain-get-block}

This method returns the JSON representation of a [Block](../../concepts/design/casper-design.md#block-structure-head) from the network.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](types_chain.md#blockidentifier)|Object|The Block hash or the Block height.|

<details>

<summary><b>Example chain_get_block request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "chain_get_block",
  "params": [
    {
      "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    }
  ]
}

```

</details>

### `chain_get_block_result`

The result from `chain_get_block` depends on block availability from a given node. If `chain_get_block` returns an error message that the node does not have information on the given block, you may attempt to get the information from a different node.

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block](types_chain.md#jsonblock)|Object|The Block, if found. (Not required)|

<details>

<summary><b>Example chain_get_block result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
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

```

</details>

## chain_get_block_transfers {#chain-get-block-transfers}

This method returns all native transfers within a given [Block](../../concepts/design/casper-design.md#block-structure-head) from a network.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](types_chain.md#blockidentifier)|Object|The Block hash.|

<details>

<summary><b>Example chain_get_block_transfers request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "chain_get_block_transfers",
  "params": [
    {
      "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    }
  ]
}

```
</details>

### `chain_get_block_transfers_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[block_hash](types_chain.md#blockhash)|Object|The Block hash, if found.|
|[transfers](types_chain.md#transfer)|Array|The Block's transfers, if found.|

<details>

<summary><b>Example chain_get_block_transfers result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
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

```

</details>

## chain_get_era_summary {#chain-get-era-summary}

This method returns the era summary at a given [Block](../../concepts/design/casper-design.md#block-structure-head). If you do not specify a `block_identifier`, you will receive the era summary at the highest state root hash.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](types_chain.md#blockidentifier)|Object|The Block hash. (Optional)|

<details>

<summary><b>Example chain_get_era_summary request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc":"2.0",
  "method":"chain_get_era_summary",
  "params": [
    {
      "Hash":"9bfa58709058935882a095ca6adf844b72a2ddf0f49b8575ef1ceda987452fb8"
    }
  ]
}

```

</details>

### `chain_get_era_summary_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[era_summary](types_chain.md#erasummary)|Object|The era summary (if found).|

<details>

<summary><b>Example chain_get_era_summary result</b></summary>

```bash

{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "api_version": "1.0.0",
    "era_summary": {
      "block_hash": "9bfa58709058935882a095ca6adf844b72a2ddf0f49b8575ef1ceda987452fb8",
      "era_id": 1,
      "stored_value": {
        "EraInfo": {
          "seigniorage_allocations": [
            {
              "Delegator": {
                "delegator_public_key": "01c08939bf1ecd1139448d435989a761c975466d30b96c2dd74e9d23c7b12bc9ff",
                "validator_public_key": "01039c258651e04597d786142d9749922245cf44b6cc0c93c58bd6c1783ac3be9b",
                "amount": "53472520551166781393617756"
              }
            },
            {
              "Validator": {
                "validator_public_key": "01039c258651e04597d786142d9749922245cf44b6cc0c93c58bd6c1783ac3be9b",
                "amount": "54552773491594393138943367"
              }
            },
            {
              "Delegator": {
                "delegator_public_key": "01264689a5b4c57dac1088cd0aae8074de105f2269f6041e2c120e80df7a95e6b5",
                "validator_public_key": "013e193dec433a73a0b41b924243c62311689648a10b4468f9c609c75674c18726",
                "amount": "51312014670568117976319374"
              }
            },
            {
              "Validator": {
                "validator_public_key": "013e193dec433a73a0b41b924243c62311689648a10b4468f9c609c75674c18726",
                "amount": "56713279372733183026458256"
              }
            },
            {
              "Delegator": {
                "delegator_public_key": "016f571eaf1d3a442e684ecdb31d00a51448dcbaa06d00b340983311f0ba3e76db",
                "validator_public_key": "0186d12379939682ae9669b354f7a637ec106369074d567b969cc0e2127c904f12",
                "amount": "51852141140784624481333262"
              }
            },
            {
              "Validator": {
                "validator_public_key": "0186d12379939682ae9669b354f7a637ec106369074d567b969cc0e2127c904f12",
                "amount": "56173152902516676521444368"
              }
            },
            {
              "Delegator": {
                "delegator_public_key": "0161e7ed5c592f16b507b9dd196662b530f9bde6c5b2cfd957fe8d0700ecfbe20b",
                "validator_public_key": "01d4cbef55ed9968171102aa136c9564286211ee46c5ab65b6fd68fab5b14d4c4b",
                "amount": "52392267611001130986347150"
              }
            },
            {
              "Validator": {
                "validator_public_key": "01d4cbef55ed9968171102aa136c9564286211ee46c5ab65b6fd68fab5b14d4c4b",
                "amount": "55633026432300170016430480"
              }
            },
            {
              "Delegator": {
                "delegator_public_key": "01b1339a1d114036d84d7b65c804669166d38456114657abbb0e53e67bf1667c60",
                "validator_public_key": "01dbce10c8418c21daf16bc1052a486cdb557ba66b09a84605bc1f4b3df364960f",
                "amount": "52932394080952975520954950"
              }
            },
            {
              "Validator": {
                "validator_public_key": "01dbce10c8418c21daf16bc1052a486cdb557ba66b09a84605bc1f4b3df364960f",
                "amount": "55092899961808199011606173"
              }
            }
          ]
        }
      },
      "state_root_hash": "918abd1973171867e03c1e6e56fd7dd9da35c92461784f9a15c0df23e437d850",
      "merkle_proof": "010000000e0000000000000000000000000000000000000000000000000000000000000000070a0000000101c08939bf1ecd1139448d435989a761c975466d30b96c2dd74e9d23c7b12bc9ff01039c258651e04597d786142d9749922245cf44b6cc0c93c58bd6c1783ac3be9b0b5c4316483512c2253f3b2c0001039c258651e04597d786142d9749922245cf44b6cc0c93c58bd6c1783ac3be9b0b87d59268bf17d8c6ff1f2d0101264689a5b4c57dac1088cd0aae8074de105f2269f6041e2c120e80df7a95e6b5013e193dec433a73a0b41b924243c62311689648a10b4468f9c609c75674c187260b8e45261378f096e3bd712a00013e193dec433a73a0b41b924243c62311689648a10b4468f9c609c75674c187260b90eee69bba24050981e92e01016f571eaf1d3a442e684ecdb31d00a51448dcbaa06d00b340983311f0ba3e76db0186d12379939682ae9669b354f7a637ec106369074d567b969cc0e2127c904f120b0ef09fedb1f521341ee42a000186d12379939682ae9669b354f7a637ec106369074d567b969cc0e2127c904f120b10446dc1801f7ab820772e010161e7ed5c592f16b507b9dd196662b530f9bde6c5b2cfd957fe8d0700ecfbe20b01d4cbef55ed9968171102aa136c9564286211ee46c5ab65b6fd68fab5b14d4c4b0b8e9a19c8ebfaac847e562b0001d4cbef55ed9968171102aa136c9564286211ee46c5ab65b6fd68fab5b14d4c4b0b9099f3e6461aef67c0042e0101b1339a1d114036d84d7b65c804669166d38456114657abbb0e53e67bf1667c6001dbce10c8418c21daf16bc1052a486cdb557ba66b09a84605bc1f4b3df364960f0b46fad737700f37d5dec82b0001dbce10c8418c21daf16bc1052a486cdb557ba66b09a84605bc1f4b3df364960f0b9d1ed178841a631760922d01000000000e060000000001fb7043fe388fef916937aa899a0dda9b042168149e600fb068ecb16839d545d60101a0676758b903440b28c8f4a1d46404e9879fcfc0b90dad20962536de493aecc302013584bc9d5c00ac639fe14410b4cfa480b12eddd8f3dce08d7b76ae47977c1c680601664224aca1272e2a5632da4a56399dee6c585318ebbb7bb4040039792d3ad33c07013b48237cd26eb35ec3c864e1ae250ca656d00893de1dfc4c951e0d779adeda1d0a002c722cac61792676eb19d773fd3c41e37a63f54f78bdf7712ca96a5c5e5c4986"
    }
  }
}

```

</details>

## chain_get_state_root_hash {#chain-get-state-root-hash} 

This method returns a state root hash at a given [Block](../../concepts/design/casper-design.md#block-structure-head). If you do not specify a `block_identifier`, you will receive the highest state root hash.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](types_chain.md#blockidentifier)|Object|The Block hash. (Optional)|

<details>

<summary><b>Example chain_get_state_root_hash request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "chain_get_state_root_hash",
  "params": [
    {
      "Height": 10
    }
  ]
}

```

</details>

### `chain_get_state_root_hash_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[state_root_hash](types_chain.md#digest)|String| Hex-encoded hash of the state root.|

<details>

<summary><b>Example chain_get_state_root_hash result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808"
  }
}

```

</details>

## info_get_chainspec {#info-get-chainspec}

This method returns raw bytes for chainspec files.

<details>

<summary><b>Example info_get_chainspec request</b></summary>

```bash

{
  "jsonrpc": "2.0",
  "method": "info_get_chainspec",
  "id": 5510244237763930243
}

```

</details>

### `info_get_chainspec_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[chainspec_bytes](types_chain.md#ChainspecRawBytes)|Object|The raw bytes of the chainspec.toml, genesis accounts.toml, and global_state.toml files.|

<details>

<summary><b>Example info_get_chainspec result</b></summary>

Please note that adding a `--vv` flag will return the full chainspec bytes.

```bash

{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.0",
    "chainspec_bytes": {
      "chainspec_bytes": "[22040 hex chars]",
      "maybe_genesis_accounts_bytes": null,
      "maybe_global_state_bytes": null
    }
  },
  "id": 5510244237763930243
}

```

</details>

## info_get_deploy {#info-get-deploy}

This method retrieves a [Deploy](../../concepts/design/casper-design.md#execution-semantics-deploys) from a network. It requires a `deploy_hash` to query the Deploy.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy_hash](types_chain.md#deployhash)|String|The Deploy hash.|
|[finalized_approvals](types_chain.md#finalizedapprovals)|Boolean|Determines whether to return the Deploy with the finalized approvals substituted. (Optional)|

<details>

<summary><b>Example info_get_deploy request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "info_get_deploy",
  "params": [
    "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa",
    true
  ]
}

```

</details>

### `info_get_deploy_result`

The response contains the Deploy and the results of executing the Deploy.

If the `execution_results` field is empty, it means that the network processed the `Deploy`, but has yet to execute it. If the network executed the `Deploy`, it will return the results of the execution. The execution results contain the Block hash which contains the Deploy.

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[deploy](types_chain.md#deploy)|Object|The Deploy.|
|[execution_results](types_chain.md#jsonexecutionresult)|Object|The map of Block hash to execution result.|

<details>

<summary><b>Example info_get_deploy result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy": {
      "approvals": [
        {
          "signature": "014c1a89f92e29dd74fc648f741137d9caf4edba97c5f9799ce0c9aa6b0c9b58db368c64098603dbecef645774c05dff057cb1f91f2cf390bbacce78aa6f084007",
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

```

</details>

## query_balance {#query-balance}

This method allows you to query for the balance of a purse using a `PurseIdentifier` and `StateIdentifier`.

|Parameter|Type|Description|
|---------|----|-----------|
|[purse_identifier](types_chain.md#purseidentifier)|Object|The identifier to obtain the purse corresponding to balance query.|
|[state_identifier](types_chain#globalstateidentifier)|Object|The state identifier used for the query; if none is passed the tip of the chain will be used.|

<details>

<summary><b>Example query_balance request</b></summary>

```bash
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "query_balance",
  "params": [
      {
        "name": "state_identifier",
        "value": {
          "BlockHash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
        }
    },
      {
        "name": "purse_identifier",
        "value": {
          "main_purse_under_account_hash": "account-hash-0909090909090909090909090909090909090909090909090909090909090909"
        }
      }
    ]
}

```

</details>


### `query_balance_result`

|Parameter|Type|Description|
|---------|----|-----------|     
|api_version|String|The RPC API version.|
|[balance](types_chain#u512)|Object|The balance represented in motes.|

<details>

<summary><b>Example query_balance result</b></summary>

```bash

{
  "jsonrpc": "2.0",
  "id": -6143675785141640608,
  "result": {
    "api_version": "1.0.0",
    "balance": "1000000000000000000000000000000000"
  }
}

```

</details>

## query_global_state {#query-global-state}

This method allows for you to query for a value stored under certain keys in global state. You may query using either a [Block hash](../../concepts/design/casper-design.md#block_hash) or state root hash.

* Note: Querying a purse's balance requires the use of `state_get_balance` or `query_balance`, rather than any iteration of `query_global_state`.

|Parameter|Type|Description|
|---------|----|-----------|   
|[state_identifier](types_chain.md#globalstateidentifier)|Object|The identifier used for the query.|
|key|String|`casper_types::Key` as a formatted string.|
|path|Array|The path components starting from the key as base.|

<details>

<summary><b>Example query_global_state request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "query_global_state",
  "params": [
    "deploy-af684263911154d26fa05be9963171802801a0b6aff8f199b7391eacb8edc9e1",
    [],
    {
      "BlockHash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    }
  ]
}

```

</details>

### `query_global_state_result`

|Parameter|Type|Description|
|---------|----|-----------|     
|api_version|String|The RPC API version.|
|[block_header](types_chain.md#jsonblockheader)|Object|The Block header if a Block hash was provided. (Not required)|
|[stored_value](types_chain.md#storedvalue)|Object|The stored value.|
|[merkle_proof](types_chain.md#merkle-proof)|String|The merkle proof.|

<details>

<summary><b>Example query_global_state result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
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

```

</details>

## state_get_account_info {#state-get-account-info}

This method returns a JSON representation of an [Account](../../concepts/design/casper-design.md#accounts-head) from the network. The `block_identifier` must refer to a Block after the Account's creation, or the method will return an empty response.

|Parameter|Type|Description|
|---------|----|-----------|
|[public_key](types_chain.md#publickey)|String|The public key of the Account.|
|[block_identifier](types_chain.md#blockidentifier)|Object|The Block identifier.|

<details>

<summary><b>Example state_get_account_info request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_get_account_info",
  "params": [
    {
      "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    },
    "013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29"
  ]
}

```

</details>

### `state_get_account_info_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|[account](types_chain.md#account)|Object|A JSON representation of the Account structure.| 
|[merkle_proof](types_chain.md#merkleproof)|String|The merkle proof.|

<details>

<summary><b>Example state_get_account_info result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
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
    "api_version": "1.4.13",
    "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3"
  }
}

```

</details>

## state_get_balance {#state-get-balance}

This method returns a purse's balance from a network. The request takes in the formatted representation of a purse URef as a parameter.

To query for the balance of an Account, you must provide the formatted representation of the Account's main purse URef, which can be obtained from the  [`state_get_account_info`](#stategetaccountinfo-state-get-account-info) response. The response contains the balance of a purse in motes.

For instance, one native layer-1 token of the Casper Mainnet [CSPR](../../concepts/glossary/C.md#cspr) is comprised of 1,000,000,000 motes. On a different Casper network, the representation of token-to-motes may differ.

|Parameter|Type|Description|
|---------|----|-----------|
|[state_root_hash](types_chain.md#digest)|String|The hash of state root.|
|purse_uref|String|Formatted URef.|

<details>
<summary><b>Example state_get_balance request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_get_balance",
  "params": [
    "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007",
    "0808080808080808080808080808080808080808080808080808080808080808"
  ]
}

```

</details>

### `state_get_balance_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[balance_value](types_chain.md#u512)|String|The balance value in motes.|
|[merkle_proof](types_chain.md#merkle-proof)|String|The merkle proof.|

<details>
<summary><b>Example state_get_balance result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "balance_value": "123456",
    "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3"
  }
}

```

</details>

## state_get_dictionary_item {#state-get-dictionary-item}

This method returns an item from a Dictionary. Every dictionary has a seed URef, findable by using a `dictionary_identifier`. The address of a stored value is the blake2b hash of the seed URef and the byte representation of the dictionary key.

You may query a stored value directly using the dictionary address.

|Parameter|Type|Description|
|---------|----|-----------|
|[state_root_hash](types_chain.md#digest)|String|Hash of the state root.|
|[dictionary_identifier](types_chain.md#dictionaryidentifier)|Object|The Dictionary query identifier.|

<details>

<summary><b>Example state_get_dictionary_item request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_get_dictionary_item",
  "params": [
    {
      "URef": {
        "dictionary_item_key": "a_unique_entry_identifier",
        "seed_uref": "uref-09480c3248ef76b603d386f3f4f8a5f87f597d4eaffd475433f861af187ab5db-007"
      }
    },
    "0808080808080808080808080808080808080808080808080808080808080808"
  ]
}

```

</details>
    
### `state_get_dictionary_item_result`

|Parameter|Type|Description|
|---------|----|-----------|    
|api_version|String|The RPC API version.|
|dictionary_key|String|The key under which the value is stored.|
|[stored_value](types_chain.md#storedvalue)|Object|The stored value.|
|[merkle_proof](types_chain.md#merkle-proof)|String|The merkle proof.|

<details>

<summary><b>Example state_get_dictionary_item result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
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

```

</details>

------


# Node Informational JSON-RPC Methods {#node-informational}

The following methods return information from a node on a Casper network. The responses return information specific to the queried node, and as such, will vary.

---

## info_get_peers {#info-get-peers}

This method returns a list of peers connected to the node.

<details>

<summary><b>Example info_get_peers request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "info_get_peers",
  "params": []
}

```

</details>

### `info_get_peers_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[peers](types_chain.md#peersmap)|Array|The node ID and network address of each connected peer.|

<details>

<summary><b>Example info_get_peers result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "peers": [
      {
        "address": "127.0.0.1:54321",
        "node_id": "tls:0101..0101"
      }
    ]
  }
}

```

</details>

## info_get_status {#info-get-status}

This method returns the current status of a node.

<details>

<summary><b>Example info_get_status request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "info_get_status",
  "params": []
}

```

</details>

### `info_get_status_result`

|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[available_block_range](types_chain.md#AvailableBlockRange)|Object|The available block range in storage.|
|[block_sync](types_chain.md#BlockSynchronizerStatus)|Object|The status of the block synchronizer builders.|
|build_version|String|The compiled node version.|
|chainspec_name|String|The chainspec name, used to identify the currently connected network.|
|[last_added_block_info](types_chain.md#minimalblockinfo)|Object|The minimal info of the last Block from the linear chain.|
|[last_progress](types_chain.md#timestamp)|String|Timestamp of the last recorded progress in the reactor.|
|[next_upgrade](types_chain.md#nextupgrade)|Object|Information about the next scheduled upgrade.|
|[our_public_signing_key](types_chain.md#publickey)|String|Our public signing key.|
|[peers](types_chain.md#peersmap)|Array|The node ID and network address of each connected peer.|
|[reactor_state](types_chain.md#reactorstate)|String|The current state of the node reactor.|
|[round_length](types_chain.md#timediff)|Integer|The next round length if this node is a validator. A round length is the amount of time it takes to reach consensus on proposing a Block.|
|[starting_state_root_hash](types_chain.md#digest)|String|The state root hash used at the start of the current session.|
|[uptime](types_chain.md#timediff)|Integer|Time that passed since the node has started.|

<details>

<summary><b>Example info_get_status result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "name": "info_get_status_result",
    "value": {
      "peers": [
      {
        "node_id": "tls:0101..0101",
        "address": "127.0.0.1:54321"
      }
    ],
    "api_version": "1.4.8",
    "build_version": "1.0.0-xxxxxxxxx@DEBUG",
    "chainspec_name": "casper-example",
    "starting_state_root_hash": null,
    "last_added_block_info": {
      "hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
      "timestamp": "2020-11-17T00:39:24.072Z",
      "era_id": 1,
      "height": 10,
      "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
      "creator": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c"
    },
    "our_public_signing_key": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
    "round_length": "1m 5s 536ms",
    "next_upgrade": {
      "activation_point": 42,
      "protocol_version": "2.0.1"
    },
    "uptime": "13s",
    "reactor_state": "Initialize",
    "last_progress": "1970-01-01T00:00:00.000Z",
    "available_block_range": {
      "low": 0,
      "high": 0
    },
    "block_sync": {
      "historical": {
        "block_hash": "16ddf28e2b3d2e17f4cef36f8b58827eca917af225d139b0c77df3b4a67dc55e",
        "block_height": 40,
        "acquisition_state": "have strict finality(40) for: block hash 16dd..c55e"
      },
      "forward": {
        "block_hash": "59907b1e32a9158169c4d89d9ce5ac9164fc31240bfcfb0969227ece06d74983",
        "block_height": 6701,
        "acquisition_state": "have block body(6701) for: block hash 5990..4983"
      }
    }
  }
}

```

</details>