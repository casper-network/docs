---
title: CEP-78 Contract Details
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Querying NFT Contracts

This document covers different commands to query and interact with an NFT (CEP-78) contract instance.

## Prerequisites

- Install the contract using the [Quickstart](./quickstart-guide.md) or the [Full Installation](./full-installation-tutorial.md) tutorials

## Querying the Contract

First, identify the contract hash by looking at the account that installed the contract. Under the account's named keys, you will see a named key for the contract hash, representing the stored contract. Copy this value and save it for future queries.

<img class="align-center" src={useBaseUrl("/image/tutorials/cep-78/the-nft-contract-hash.png")} alt="The NFT contract hash"/>

Next, query the contract details.

- `casper-client query-global-state -n http://localhost:11101/rpc/`

1. `--key [CONTRACT_HASH]`

   The contract hash, found within the `NamedKeys` of the account that sent the installing deploy.

2. `--state-root-hash [STATE_ROOT_HASH]`

   The most up-to-date state root hash, which can be found by using the `get-state-root-hash` command in the Casper client.

<details>
<summary><b>Expand to see the query and sample contract</b></summary>


```bash
casper-client query-global-state -n http://localhost:11101/rpc/ \
--key hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796 \
--state-root-hash 2a8cfc20d24b4bc629ea6d26cc820560a1baf3d4275079d5382242c9fa1e86fe
```

```json
{
  "jsonrpc": "2.0",
  "id": -5355991397545050403,
  "result": {
    "api_version": "1.5.6",
    "block_header": null,
    "stored_value": {
      "Contract": {
        "contract_package_hash": "contract-package-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30",
        "contract_wasm_hash": "contract-wasm-845d3d08e29642afba35704bcb6e38f3c40f1469763bff7a88674c9a5be3f01b",
        "named_keys": [
          {
            "name": "acl_package_mode",
            "key": "uref-5e950cdd5497633c1d03284ec6e70ce436744cc172d6e26e21e4e474d1b34312-007"
          },
          {
            "name": "acl_whitelist",
            "key": "uref-77b5861bdc04f3c63417dd2ed1943f659f6180603982a24587f79cbc38801cf4-007"
          },
          {
            "name": "allow_minting",
            "key": "uref-dca79aa4244d0123ad52799fc4f922b2ae9fc023c9e56f999979f535a792eef5-007"
          },
          {
            "name": "approved",
            "key": "uref-76aac8f7224c5c1624b4255fff59ecc8ee2c7a1ba460b4f70945d7548abbffd0-007"
          },
          {
            "name": "balances",
            "key": "uref-3d271bac2030ddee54bf4ea92b9b854d800a10a0df5d6e328a045be19af27538-007"
          },
          {
            "name": "burn_mode",
            "key": "uref-eb1a7f69592881587805fde2d53e8e5b3dcbabd81311faa7b9d19ea731f83d9b-007"
          },
          {
            "name": "burnt_tokens",
            "key": "uref-0c144d231ac070adb2668f2a9f3d0eba32c7468efa879f0f29c832c63698966b-007"
          },
          {
            "name": "cep78_CEP-78-collection2",
            "key": "uref-ac99c07d666f45ff5c86a2c1bb6cc44b612ddd5d39a9de88045b441ff6e6b327-007"
          },
          {
            "name": "collection_name",
            "key": "uref-5aed76a73089e7e32f6fbf5d9a9597843215d4810cd5822c0f5c6e65a0bbb7a3-007"
          },
          {
            "name": "collection_symbol",
            "key": "uref-ba4247cc0354644474758d1292924c5115c61c8012cae3f094a91060d9dff779-007"
          },
          {
            "name": "events_mode",
            "key": "uref-51acad53fd1a6ce6a52cf83ed7f921565311ed86cd362969bacf9457b6bf5c1a-007"
          },
          {
            "name": "hash_by_index",
            "key": "uref-e280dd23c847724422543b0d70f1ed4c95c8da9e1a71927ae39add652859775c-007"
          },
          {
            "name": "holder_mode",
            "key": "uref-8443151d736bb3268815ad7848708d44ccc661799f969697c64b1cddb5ce89a7-007"
          },
          {
            "name": "identifier_mode",
            "key": "uref-f53ea99b60ae6d046a6fb0d996475714ef03ed33b39674a8fe016c8324116baf-007"
          },
          {
            "name": "index_by_hash",
            "key": "uref-6299c9322631f374fc1a5e20920641b23f437a3c0ba8da22cc23cba11b0fa3a5-007"
          },
          {
            "name": "installer",
            "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655"
          },
          {
            "name": "json_schema",
            "key": "uref-772103052d4559fcc2f8f2c2568eb75214462d463009106938e6f20e1cc0a7c0-007"
          },
          {
            "name": "metadata_cep78",
            "key": "uref-2c2176a9efd465d2e4d5de05d75d029e03040d0a5668c4e08facb0cd3442d30a-007"
          },
          {
            "name": "metadata_custom_validated",
            "key": "uref-575108b0258e92ebede1e50345b608d42963bdac24379022be20b76cfde15301-007"
          },
          {
            "name": "metadata_mutability",
            "key": "uref-2ca963a70a69df2db931b8761b4de13bd22e2fc54a415b0b57d4204c9b90dde9-007"
          },
          {
            "name": "metadata_nft721",
            "key": "uref-eb37c0fe3b53fa5c72b02976f2840b7bf3692954fc830f8a10dc538d0c506e63-007"
          },
          {
            "name": "metadata_raw",
            "key": "uref-cdb17062423b769a7b0bc18fe0a2202b68d2ba77786291018a24fd53f4532ab8-007"
          },
          {
            "name": "minting_mode",
            "key": "uref-3b45a30c98d90de2c62812c6689aa2fac0cb4d08772fcfdee0584c5db2b1d12a-007"
          },
          {
            "name": "nft_kind",
            "key": "uref-e02c29a6120d5da7f14fb664ca60c3ade56a3171a670c292d0a4ea0f9ae4f0c8-007"
          },
          {
            "name": "nft_metadata_kind",
            "key": "uref-45e1bc671353ae58c41a703055959da243deefc7f4c3f121f3f9828d97475bda-007"
          },
          {
            "name": "nft_metadata_kinds",
            "key": "uref-05c0eb8e7ef4caa6f228e8ee91874dc64926b95926d839b458fdce356063a817-007"
          },
          {
            "name": "number_of_minted_tokens",
            "key": "uref-f86e2c4057cc17d93593fb203a923d67e5bc68e6428a6d94f6eab0c35450653d-007"
          },
          {
            "name": "operator_burn_mode",
            "key": "uref-f226eed9d0c5fcf58e6b481d45417721e35435c2ef5eb4d26d215209149438ba-007"
          },
          {
            "name": "operators",
            "key": "uref-ff8ad952307b57a051ef6cb597a55cc2007e587c575584addf6a6fc12c0efd7b-007"
          },
          {
            "name": "ownership_mode",
            "key": "uref-89711af74265427dc65d7c5a421cedde82de69d192cad36f34efa36504108572-007"
          },
          {
            "name": "package_operator_mode",
            "key": "uref-05c2868f179f6b2323f1d4ea069858956c9666d14073748aae4a748d27a8a894-007"
          },
          {
            "name": "page_table",
            "key": "uref-00efcfa874a60b5b615b3c6d781cf69c3559b5372d15457fe4a3bb6d07c66acd-007"
          },
          {
            "name": "receipt_name",
            "key": "uref-1ec63ea6442d9b4ef40d926280f8b72704b763d3ef7cdaccd9ecb04af5562d99-007"
          },
          {
            "name": "reporting_mode",
            "key": "uref-4d851152d7b89dff805dcf6eb61a33870dab9345084a5874575476a584d71b83-007"
          },
          {
            "name": "rlo_mflag",
            "key": "uref-2e3b8aafb27aae47c9b7d3728d20d8815b706e2245c23b84f0e712cd1d1e9124-007"
          },
          {
            "name": "token_issuers",
            "key": "uref-5700d04b36eb1f50204c0d1d05c8ed6aae77eaeaa8a425c78f5a24cbae2e4d26-007"
          },
          {
            "name": "token_owners",
            "key": "uref-ff53b7094bcb6659b558d31fdf63f837b05c0ee6030bfe18ad4c3fb0462b9b17-007"
          },
          {
            "name": "total_token_supply",
            "key": "uref-e5f06deadcbfe5a469e7c162346580744746bfdc0ec67002e0ecba5b11096827-007"
          },
          {
            "name": "whitelist_mode",
            "key": "uref-a77f2ac1f5e72c6b096ca414ae2c986a5387442ddf8e89a35b787a756adc4bb4-007"
          }
        ],
        "entry_points": [
          {
            "name": "approve",
            "args": [
              {
                "name": "spender",
                "cl_type": "Key"
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "balance_of",
            "args": [
              {
                "name": "token_owner",
                "cl_type": "Key"
              }
            ],
            "ret": "U64",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "burn",
            "args": [],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "get_approved",
            "args": [],
            "ret": {
              "Option": "Key"
            },
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "init",
            "args": [
              {
                "name": "collection_name",
                "cl_type": "String"
              },
              {
                "name": "collection_symbol",
                "cl_type": "String"
              },
              {
                "name": "total_token_supply",
                "cl_type": "U64"
              },
              {
                "name": "allow_minting",
                "cl_type": "Bool"
              },
              {
                "name": "minting_mode",
                "cl_type": "U8"
              },
              {
                "name": "ownership_mode",
                "cl_type": "U8"
              },
              {
                "name": "nft_kind",
                "cl_type": "U8"
              },
              {
                "name": "holder_mode",
                "cl_type": "U8"
              },
              {
                "name": "whitelist_mode",
                "cl_type": "U8"
              },
              {
                "name": "acl_whitelist",
                "cl_type": {
                  "List": "Key"
                }
              },
              {
                "name": "acl_package_mode",
                "cl_type": "Bool"
              },
              {
                "name": "package_operator_mode",
                "cl_type": "Bool"
              },
              {
                "name": "json_schema",
                "cl_type": "String"
              },
              {
                "name": "receipt_name",
                "cl_type": "String"
              },
              {
                "name": "identifier_mode",
                "cl_type": "U8"
              },
              {
                "name": "burn_mode",
                "cl_type": "U8"
              },
              {
                "name": "operator_burn_mode",
                "cl_type": "Bool"
              },
              {
                "name": "nft_metadata_kind",
                "cl_type": "U8"
              },
              {
                "name": "metadata_mutability",
                "cl_type": "U8"
              },
              {
                "name": "owner_reverse_lookup_mode",
                "cl_type": "U8"
              },
              {
                "name": "events_mode",
                "cl_type": "U8"
              },
              {
                "name": "transfer_filter_contract",
                "cl_type": {
                  "Option": "Key"
                }
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "is_approved_for_all",
            "args": [
              {
                "name": "token_owner",
                "cl_type": "Key"
              },
              {
                "name": "operator",
                "cl_type": "Key"
              }
            ],
            "ret": "Bool",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "metadata",
            "args": [],
            "ret": "String",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "migrate",
            "args": [
              {
                "name": "cep78_package_key",
                "cl_type": "Any"
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "mint",
            "args": [
              {
                "name": "token_owner",
                "cl_type": "Key"
              },
              {
                "name": "token_meta_data",
                "cl_type": "String"
              }
            ],
            "ret": {
              "Tuple3": [
                "String",
                "Key",
                "String"
              ]
            },
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "owner_of",
            "args": [],
            "ret": "Key",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "register_owner",
            "args": [],
            "ret": {
              "Tuple2": [
                "String",
                "URef"
              ]
            },
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "revoke",
            "args": [],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "set_approval_for_all",
            "args": [
              {
                "name": "approve_all",
                "cl_type": "Bool"
              },
              {
                "name": "operator",
                "cl_type": "Key"
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "set_token_metadata",
            "args": [
              {
                "name": "token_meta_data",
                "cl_type": "String"
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "set_variables",
            "args": [
              {
                "name": "allow_minting",
                "cl_type": "Bool"
              },
              {
                "name": "contract_whitelist",
                "cl_type": {
                  "List": {
                    "ByteArray": 32
                  }
                }
              },
              {
                "name": "acl_whitelist",
                "cl_type": {
                  "List": "Key"
                }
              },
              {
                "name": "acl_package_mode",
                "cl_type": "Bool"
              },
              {
                "name": "package_operator_mode",
                "cl_type": "Bool"
              },
              {
                "name": "operator_burn_mode",
                "cl_type": "Bool"
              }
            ],
            "ret": "Unit",
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "transfer",
            "args": [
              {
                "name": "source_key",
                "cl_type": "Key"
              },
              {
                "name": "target_key",
                "cl_type": "Key"
              }
            ],
            "ret": {
              "Tuple2": [
                "String",
                "Key"
              ]
            },
            "access": "Public",
            "entry_point_type": "Contract"
          },
          {
            "name": "updated_receipts",
            "args": [],
            "ret": {
              "List": {
                "Tuple2": [
                  "String",
                  "Key"
                ]
              }
            },
            "access": "Public",
            "entry_point_type": "Contract"
          }
        ],
        "protocol_version": "1.5.6"
      }
    },
    "merkle_proof": "[33244 hex chars]"
  }
}
```

</details>

## Next Steps

- Learn to [Mint, Transfer, and Burn](./interacting-with-NFTs.md) NFT tokens