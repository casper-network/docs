---
title: Contract-Level Events
---

# Enabling Contracts to Emit Events 

Smart contracts can be programmed to emit messages while executing. Under certain conditions, an off-chain dApp may listen to these events and react as described in [Monitoring and Consuming Events](../dapps/monitor-and-consume-events.md).

Messages produced by smart contracts are visible on a node's SSE event stream in human-readable format, and they contain the following information:

- The address of the entity that produced the message
- The message topic used to categorize the message
- The human-readable message string
- The index identifying the message in a message array

A checksum of the message is permanently stored in global state to protect against message spoofing and repudiation. For more details regarding the design and implementation of this feature, read the corresponding [CEP-88 documentation](https://github.com/casper-network/ceps/pull/88).

The [Casper External FFI](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/index.html) provides the following two runtime functions to manage and emit messages:

- `manage_message_topic` - Creates a topic to help categorize messages. When used for the first time, this function registers the contract's intent to emit messages. The maximum number of topics is specified in the chainspec. <!-- TODO add link to chainspec -->
- `emit_message` - Emits a human-readable string message under a pre-registered topic.

The following sections contain more details about using these functions.

## Creating a Topic

To create a new topic, call the `manage_message_topic` runtime function. <!-- TODO add a link to docs.rs -->

<!-- TODO add a link to the CEP-78 contract when it becomes available -->

This sample code <!--"from a CEP-78 contract"--> adds a new message topic called `EVENTS_TOPIC`, on which the contract can emit messages:

```rust
runtime::manage_message_topic(EVENTS_TOPIC, MessageTopicOperation::Add).unwrap_or_revert();
```


## Verifying a Topic

No SSE event is emitted when a contract creates a new message topic. However, some applications need to determine which message topics are available to listen to messages on those topics. In global state, each contract entity contains a field called `message_topics`, which stores a map of registered topic names by topic name hash:

```json
"message_topics": [
    {
    "topic_name": "events",
    "topic_name_hash": "topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1"
    }
]
```

Here is a sample query to view the contract details:

```bash
casper-client query-global-state \
--node-address http://127.0.0.1:11101 \
--key "addressable-entity-contract-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5" \
--block-identifier 58d26bf0eeeefb698d76b319014efd2eaa2198ad754a489a23131948ef41fdd2
```

<details>
<summary>Expand to view the sample contract</summary>

```json
{
  "jsonrpc": "2.0",
  "id": -4994937296370433409,
  "result": {
    "api_version": "1.0.0",
    "block_header": {
      "Version2": {
        "parent_hash": "deafd8e5c1aff47ae8528fa2d343b711c2f5cb18ee29527961b37d4d173ad42a",
        "state_root_hash": "96d8962c03899277f9a4bd667c0510c0eab490dd6253ae0b8cee4ebfbcd52be6",
        "body_hash": "28812ec460ab82f94f3c658e946bb4779c6b76dea9c55d18beaf1e47fe8dd9c9",
        "random_bit": false,
        "accumulated_seed": "96a09ea136bb7e4e99b039ee0f1f6d9dd88d663927faffc7eb5c60804056354c",
        "era_end": null,
        "timestamp": "2023-11-28T23:59:53.856Z",
        "era_id": 112,
        "height": 1066,
        "protocol_version": "1.0.0"
      }
    },
    "stored_value": {
      "AddressableEntity": {
        "package_hash": "contract-package-66cf48b3ccf32269ccc5d93059eef461bcf2c8b2460309ff3a442190688d5275",
        "byte_code_hash": "contract-wasm-23e042b941e45ea7fe4f81496fd778349f2002b2f786f9fddbdd1298450b60ad",
        "named_keys": [
          {
            "name": "acl_package_mode",
            "key": "uref-2a088bc6c30d1499cd9348d388a03c8162ab26d09b0484f634e6f4022581fe99-007"
          },
          {
            "name": "acl_whitelist",
            "key": "uref-d17ecf3fe6e46f9a6063cfb31cdb03cdd6b99d095b71d2247319c293f864c4d1-007"
          },
          {
            "name": "allow_minting",
            "key": "uref-c737324d1caa1885ad0f22f628933cfce91400ea259147186d330cf167eb6843-007"
          },
          {
            "name": "approved",
            "key": "uref-87a0de173fd6a56fb867bab46d8a508a43259a244ffdd8b0d98e5c286261f9af-007"
          },
          {
            "name": "balances",
            "key": "uref-0c08f3df6e05e509000cd57646b98983481b8bcd46b98f0aae1a5abccc1e114f-007"
          },
          {
            "name": "burn_mode",
            "key": "uref-e507551382a6217b9165dd222854e6c877d33eab9845c4b7e8444559303e5b8a-007"
          },
          {
            "name": "burnt_tokens",
            "key": "uref-4711c3ee36ac9639af509f45164fdb5a88692b109c3b2360e57d09fcdd702f63-007"
          },
          {
            "name": "cep78_CEP-78",
            "key": "uref-a02fc32366a7187448afb8263a8f3716e933d28d84db6c6403893d94917cf98d-007"
          },
          {
            "name": "collection_name",
            "key": "uref-89e904724d79a9f6d41958a3621b437c9e220ad081805f39040ff51c79a8d67c-007"
          },
          {
            "name": "collection_symbol",
            "key": "uref-d41a40789a84cc8e0314135695acc279875d6c7455daafe517cc4ae5329d95de-007"
          },
          {
            "name": "events_mode",
            "key": "uref-d950666b546fe7afcf123f833ba4166b395c03bdbfd5de86dab051af3c1cdac0-007"
          },
          {
            "name": "hash_by_index",
            "key": "uref-7c9751097762ad778a6a11151780d377cbc57e0807e289d278831ca9263aa844-007"
          },
          {
            "name": "holder_mode",
            "key": "uref-e7acd748f4f82e609aa49f577e78e1ce6b1ab1dad5b5b1b59c8ff965598a6f34-007"
          },
          {
            "name": "identifier_mode",
            "key": "uref-bf32824dddf12dd16668581211ed22bef4b36c22db0165bde4986508f363940e-007"
          },
          {
            "name": "index_by_hash",
            "key": "uref-e67fecb85654def8b1440907728491f4f1ae125a97f3fed93872c075e6fb4ad5-007"
          },
          {
            "name": "installer",
            "key": "account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c"
          },
          {
            "name": "json_schema",
            "key": "uref-f8b2f63a4c69a84c795908e9abd0f66b857790b8df627a21336d6d1e07bf7103-007"
          },
          {
            "name": "metadata_cep78",
            "key": "uref-5cf8084639c2b7b8f54ab78700e0a82107c0bb28966cdc3ffdd4bd0877a47f64-007"
          },
          {
            "name": "metadata_custom_validated",
            "key": "uref-f5ce01c02a1942a4833159d72414c014b0838b607b4f419af9e19cd2fb123658-007"
          },
          {
            "name": "metadata_mutability",
            "key": "uref-c11c8e99c52477efaae636890a49625f54e32b832e23e288e00952c8bf34610a-007"
          },
          {
            "name": "metadata_nft721",
            "key": "uref-d39ee0c77f9864b05297ac504ee5919d60dddb6c8c0d6ccce8225801885f8972-007"
          },
          {
            "name": "metadata_raw",
            "key": "uref-dc660363cb2b4dfea2c01d8c3bf2258a3700fb6c830d13972ff206e330fd791a-007"
          },
          {
            "name": "minting_mode",
            "key": "uref-962f6e020971031eb1bdd37f705df498cd4ee90c15aae901df9654a10461184d-007"
          },
          {
            "name": "nft_kind",
            "key": "uref-001ffa305e021b5d411a3e04707b3c17f0d31ee400e6c5faa9b8f66e0ebfdc99-007"
          },
          {
            "name": "nft_metadata_kind",
            "key": "uref-8dfb98ccdd030aae1e0dcda03dc728dd4332eb18c945fd25a55b43f9e487141e-007"
          },
          {
            "name": "nft_metadata_kinds",
            "key": "uref-cb9799861587032b55d391604c8a9f016d1237b0b600413d6c050da3e0fc81d1-007"
          },
          {
            "name": "number_of_minted_tokens",
            "key": "uref-cd0871a7e69b91a05dbf81068115e45380de3a35bd2258369e3a24b7958cd77f-007"
          },
          {
            "name": "operator_burn_mode",
            "key": "uref-40977d32bbfb85454c9e7b5ca03192efcd406f228d5c2e593210b3960e05604e-007"
          },
          {
            "name": "operators",
            "key": "uref-cbcb06403fbd8cb9f397029718f1f7e66bf5ec4e33aa58315dd3d5ecf5d078a7-007"
          },
          {
            "name": "ownership_mode",
            "key": "uref-bba9996be36b1526113a0aaa030db658edd3c8719a60d55b35b7312f01f2e6da-007"
          },
          {
            "name": "package_operator_mode",
            "key": "uref-c05e3e87f5a64fbc20615afffaa6e4c81d98431b698f681322f5d8730ff40590-007"
          },
          {
            "name": "page_table",
            "key": "uref-4c545e6e4860629fd138fcb91f24d21498e69b076d472660ff769dfc2a994301-007"
          },
          {
            "name": "receipt_name",
            "key": "uref-6ddba59f56a5d52df5b8f85d03d19003feec3307a9d9ac6b420486d1a440a586-007"
          },
          {
            "name": "reporting_mode",
            "key": "uref-b6c48cfa2fa090b71912b209638b33bbf8b670a8d8a1065d73b54c70f5cc414c-007"
          },
          {
            "name": "rlo_mflag",
            "key": "uref-d520d8cbca2b28a42f0db9493e94bdbb93f74702e20eac1a77b48dda39367afe-007"
          },
          {
            "name": "token_issuers",
            "key": "uref-c1993c045f9e656b4bcb40639705d232cb6ecb4a2c6a04aeb33baffe9869cb9a-007"
          },
          {
            "name": "token_owners",
            "key": "uref-1cabd90eac707493056418a62d8b82057af0d7c1e1b90d6139a46120fff4187d-007"
          },
          {
            "name": "total_token_supply",
            "key": "uref-09b6f0901eb8cd9c6272be8199aeff4c6f5d2e3989980b548dbd595b40c033bf-007"
          },
          {
            "name": "whitelist_mode",
            "key": "uref-af7ba884bbddf91530279c0ea005c56a4951f5330ebe5395528471302b791b3e-007"
          }
        ],
        "entry_points": [
          {
            "name": "approve",
            "entry_point": {
              "name": "approve",
              "args": [
                {
                  "name": "spender",
                  "cl_type": "Key"
                }
              ],
              "ret": "Unit",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "balance_of",
            "entry_point": {
              "name": "balance_of",
              "args": [
                {
                  "name": "token_owner",
                  "cl_type": "Key"
                }
              ],
              "ret": "U64",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "burn",
            "entry_point": {
              "name": "burn",
              "args": [],
              "ret": "Unit",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "get_approved",
            "entry_point": {
              "name": "get_approved",
              "args": [],
              "ret": {
                "Option": "Key"
              },
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "init",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "is_approved_for_all",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "metadata",
            "entry_point": {
              "name": "metadata",
              "args": [],
              "ret": "String",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "migrate",
            "entry_point": {
              "name": "migrate",
              "args": [
                {
                  "name": "cep78_package_key",
                  "cl_type": "Any"
                }
              ],
              "ret": "Unit",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "mint",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "owner_of",
            "entry_point": {
              "name": "owner_of",
              "args": [],
              "ret": "Key",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "register_owner",
            "entry_point": {
              "name": "register_owner",
              "args": [],
              "ret": {
                "Tuple2": [
                  "String",
                  "URef"
                ]
              },
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "revoke",
            "entry_point": {
              "name": "revoke",
              "args": [],
              "ret": "Unit",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "set_approval_for_all",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "set_token_metadata",
            "entry_point": {
              "name": "set_token_metadata",
              "args": [
                {
                  "name": "token_meta_data",
                  "cl_type": "String"
                }
              ],
              "ret": "Unit",
              "access": "Public",
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "set_variables",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "transfer",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          },
          {
            "name": "updated_receipts",
            "entry_point": {
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
              "entry_point_type": "AddressableEntity"
            }
          }
        ],
        "protocol_version": "1.0.0",
        "main_purse": "uref-596d134ad1078315a5e0cd2f40802b65cf53b6c789f0a38ba04157d04e15ab2b-007",
        "associated_keys": [
          {
            "account_hash": "account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c",
            "weight": 1
          }
        ],
        "action_thresholds": {
          "deployment": 1,
          "upgrade_management": 1,
          "key_management": 1
        },
        "message_topics": [
          {
            "topic_name": "events",
            "topic_name_hash": "topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1"
          }
        ]
      }
    },
    "merkle_proof": "[8288 hex chars]"
  }
}
```

</details>
<br></br>

<!-- TODO is EE = host in this context? -->
When the host registers a topic, it creates a control record for that topic under a composite key derived from the caller's entity address and the hash of the topic name:

```json
{
    "key": "message-topic-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
    "kind": "Identity"
},
```

## Emitting a Message

To emit a message on a previously-created topic, call the `emit_message` runtime function. <!-- TODO add a link to docs.rs -->

<!-- TODO add a link to the contract when it becomes available -->

This sample code <!--"from a CEP-78 contract"--> sends a new message on the message topic `EVENTS_TOPIC`. 

```rust
runtime::emit_message(EVENTS_TOPIC, &message.try_into().unwrap()).unwrap_or_revert();
```

## Verifying a Message

The SSE endpoint of a node streams the messages emitted in a human-readable format. Messages are visible as part of the `TransactionProcessed` event after the corresponding block is processed and added to the blockchain. The messages sent out on the event stream contain the following:

- The identity of the entity that produced the message
- The payload of the message
- The name of the topic on which the message was emitted
- The BLAKE2b hash of the topic name
- The message index in the topic

The following is sample message logged inside a `TransactionProcessed` event:

```json
"messages": [
    {
        "entity_addr": "addressable-entity-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5",
        "message": {
            "String": "{\"Mint\":{\"recipient\":\"account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c\",\"token_id\":{\"Index\":0}}}"
        },
        "topic_name": "events",
        "topic_name_hash": "topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
        "index": 0
    }
]
```

<details>
<summary>Expand to view the full TransactionProcessed message</summary>

```json
data: {
    "TransactionProcessed": {
        "transaction_hash": {
            "Deploy": "09b90ada8b456e342f3209b3330c1d3bba0452d453c7f37106fed9799b280e26"
        },
        "account": "0130a16c8b0918cbfa8da00b6c0910ae0f2799dfd5ef7f092d0c4c1688031d60ac",
        "timestamp": "2023-11-29T01:35:41.522Z",
        "ttl": "30m",
        "block_hash": "b90c61cd1e3bc3be36110f04a7aec97b22bcfe9f36291cb011a14c4a663753bd",
        "execution_result": {
            "Version2": {
                "Success": {
                    "effects": [
                        {
                            "key": "account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-c092060112b445d1706f6962d7ad2da72a2e8312000e99d2b58f6a3e1624649a",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-42c6bbc82e3fc9dc4f890f507812a49c19aa998ed09b9d97996d9257e3c8c1c1",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-aabcd5869e1e47a6e66ca2430fcabbe9687241e55e0a070204b150771f7aef74",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-cfe2039aa5f3eca8a00d3444c4421e2034b77330d614b0c47c47d6af09113861",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-cfe2039aa5f3eca8a00d3444c4421e2034b77330d614b0c47c47d6af09113861",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "U512",
                                        "bytes": "0e9a6a8aff995ac138938d44c64d31",
                                        "parsed": "999999999999999999999518955956890"
                                    }
                                }
                            }
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": {
                                "AddUInt512": "7500000000"
                            }
                        },
                        {
                            "key": "addressable-entity-contract-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-66cf48b3ccf32269ccc5d93059eef461bcf2c8b2460309ff3a442190688d5275",
                            "kind": "Identity"
                        },
                        {
                            "key": "byte-code-v1-wasm-23e042b941e45ea7fe4f81496fd778349f2002b2f786f9fddbdd1298450b60ad",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-c737324d1caa1885ad0f22f628933cfce91400ea259147186d330cf167eb6843-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-09b6f0901eb8cd9c6272be8199aeff4c6f5d2e3989980b548dbd595b40c033bf-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-cd0871a7e69b91a05dbf81068115e45380de3a35bd2258369e3a24b7958cd77f-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-962f6e020971031eb1bdd37f705df498cd4ee90c15aae901df9654a10461184d-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-e7acd748f4f82e609aa49f577e78e1ce6b1ab1dad5b5b1b59c8ff965598a6f34-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-cb9799861587032b55d391604c8a9f016d1237b0b600413d6c050da3e0fc81d1-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "uref-bf32824dddf12dd16668581211ed22bef4b36c22db0165bde4986508f363940e-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "dictionary-79bb2f90d7ab9cef266efe53e70722dc6e4fa56372ce8cd859b89cec3ff05307",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "Any",
                                        "bytes": "8f0000008b0000007b226e616d65223a20224a6f686e20446f65222c22746f6b656e5f757269223a202268747470733a5c2f5c2f7777772e626172666f6f2e636f6d222c22636865636b73756d223a202239343062666662336632626261333566383433313361613236646130396563653361643437303435633661313239326332626264326466346162316135356662227d0a20000000dc660363cb2b4dfea2c01d8c3bf2258a3700fb6c830d13972ff206e330fd791a0100000030",
                                        "parsed": null
                                    }
                                }
                            }
                        },
                        {
                            "key": "uref-bba9996be36b1526113a0aaa030db658edd3c8719a60d55b35b7312f01f2e6da-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "dictionary-203953bdea81a8373a987786d74eb94d8626c401a28625bb66c006079fd2bde7",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "Any",
                                        "bytes": "2100000000212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c0b200000001cabd90eac707493056418a62d8b82057af0d7c1e1b90d6139a46120fff4187d0100000030",
                                        "parsed": null
                                    }
                                }
                            }
                        },
                        {
                            "key": "dictionary-453603548bb0d677edaa9bbc014bff6e30801a8d86eb85f884ad08e874fdc0f1",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "Any",
                                        "bytes": "2100000000212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c0b20000000c1993c045f9e656b4bcb40639705d232cb6ecb4a2c6a04aeb33baffe9869cb9a0100000030",
                                        "parsed": null
                                    }
                                }
                            }
                        },
                        {
                            "key": "dictionary-3344eae47d44ef595de8219a32c69e9ac51ee14f020bd5da24f899fd49d12abf",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "Any",
                                        "bytes": "08000000010000000000000005200000000c08f3df6e05e509000cd57646b98983481b8bcd46b98f0aae1a5abccc1e114f4000000032313266666464303430623635343935343139663430353763383339323933306534313066376266323462616565633864653539613631313762363365343563",
                                        "parsed": null
                                    }
                                }
                            }
                        },
                        {
                            "key": "uref-cd0871a7e69b91a05dbf81068115e45380de3a35bd2258369e3a24b7958cd77f-000",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "U64",
                                        "bytes": "0100000000000000",
                                        "parsed": 1
                                    }
                                }
                            }
                        },
                        {
                            "key": "uref-d950666b546fe7afcf123f833ba4166b395c03bdbfd5de86dab051af3c1cdac0-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "message-topic-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
                            "kind": "Identity"
                        },
                        {
                            "key": "message-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1-0",
                            "kind": {
                                "Write": {
                                    "Message": "message-checksum-d4854042c69aac1bc64e6f9cb2e41f306fc106f79951429d1dfef56d638be3c0"
                                }
                            }
                        },
                        {
                            "key": "message-topic-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
                            "kind": {
                                "Write": {
                                    "MessageTopic": {
                                        "message_count": 1,
                                        "blocktime": 1701221761024
                                    }
                                }
                            }
                        },
                        {
                            "key": "uref-b6c48cfa2fa090b71912b209638b33bbf8b670a8d8a1065d73b54c70f5cc414c-000",
                            "kind": "Identity"
                        },
                        {
                            "key": "deploy-09b90ada8b456e342f3209b3330c1d3bba0452d453c7f37106fed9799b280e26",
                            "kind": {
                                "Write": {
                                    "DeployInfo": {
                                        "deploy_hash": "09b90ada8b456e342f3209b3330c1d3bba0452d453c7f37106fed9799b280e26",
                                        "transfers": [],
                                        "from": "account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c",
                                        "source": "uref-cfe2039aa5f3eca8a00d3444c4421e2034b77330d614b0c47c47d6af09113861-007",
                                        "gas": "610139570"
                                    }
                                }
                            }
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-42c6bbc82e3fc9dc4f890f507812a49c19aa998ed09b9d97996d9257e3c8c1c1",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f4952351cd81d38e205cd31a938b802241b70ac539d0fba5c5d2e0dc825f8944",
                            "kind": "Identity"
                        },
                        {
                            "key": "account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-account-a4cb74407b8da22b5dbf8cec4b2280fd2f2276bfeaa34ec64753071adf8960f5",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-aabcd5869e1e47a6e66ca2430fcabbe9687241e55e0a070204b150771f7aef74",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-cfe2039aa5f3eca8a00d3444c4421e2034b77330d614b0c47c47d6af09113861",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "U512",
                                        "bytes": "04df4c7928",
                                        "parsed": "679038175"
                                    }
                                }
                            }
                        },
                        {
                            "key": "balance-cfe2039aa5f3eca8a00d3444c4421e2034b77330d614b0c47c47d6af09113861",
                            "kind": {
                                "AddUInt512": "6820961825"
                            }
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "package-aabcd5869e1e47a6e66ca2430fcabbe9687241e55e0a070204b150771f7aef74",
                            "kind": "Identity"
                        },
                        {
                            "key": "addressable-entity-system-f5a58fd26fb2200445eb04363affcc1240cb9e1882c6a86612de41e06e1082d1",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-a3fceeee68671ef97338bbe16a31782a8e262b23c52116e0c73f02a1f25d14ac",
                            "kind": "Identity"
                        },
                        {
                            "key": "balance-278862691b1d6698c02c82b302aa391f1cd10a3637e4a8c633b4560917bc607b",
                            "kind": {
                                "Write": {
                                    "CLValue": {
                                        "cl_type": "U512",
                                        "bytes": "00",
                                        "parsed": "0"
                                    }
                                }
                            }
                        },
                        {
                            "key": "balance-a3fceeee68671ef97338bbe16a31782a8e262b23c52116e0c73f02a1f25d14ac",
                            "kind": {
                                "AddUInt512": "679038175"
                            }
                        }
                    ],
                    "transfers": [],
                    "cost": "610139570"
                }
            }
        },
        "messages": [
            {
                "entity_addr": "addressable-entity-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5",
                "message": {
                    "String": "{\"Mint\":{\"recipient\":\"account-hash-212ffdd040b65495419f4057c8392930e410f7bf24baeec8de59a6117b63e45c\",\"token_id\":{\"Index\":0}}}"
                },
                "topic_name": "events",
                "topic_name_hash": "topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
                "index": 0
            }
        ]
    }
}
```

</details>
<br></br>

Emitted messages are not stored in global state. However, global state stores a checksum of each message, allowing users to verify the origin and integrity of the message. The checksums in global state are unique and can be identified by the hash of the entity that emitted the message, the hash of the topic name, and the index of the message.

Here is how you can query global state to get the message checksum, given the block identifier and the composite key that includes the message hash, the topic name hash, and the message index:

```bash
casper-client query-global-state --node-address http://127.0.0.1:11101 \
--key "message-803c759a466a84a0ab12147857f49e269369796a66ad37e94ab8343ddddb7823-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1-0" \
--block-identifier d9642c5d90c7fc05a23d83a3abcf56d63cb71316402ecefe0962fdeccad2c99c
```

<details>
<summary>Expand to view the sample response</summary>

```json
{
  "jsonrpc": "2.0",
  "id": 3085511981091403408,
  "result": {
    "api_version": "1.0.0",
    "block_header": {
      "Version2": {
        "parent_hash": "e55e5127ec6ed5ac03767f9d8b0d0dbd434df81c03658dcc5d9f17b780de980a",
        "state_root_hash": "e033c27db66a4542b53477c97c4f9176ffce72ab6edebd6fdb25b2fe0aa70fe8",
        "body_hash": "ba26e345470f6322f39810e8408fff666026276dee72cbb9fa85ec55657070fb",
        "random_bit": false,
        "accumulated_seed": "caf392ee00d60d9729c8e042acbd851ff70be47b0e8a317cc728b3be47a815ce",
        "era_end": null,
        "timestamp": "2023-12-02T01:19:12.384Z",
        "era_id": 84,
        "height": 890,
        "protocol_version": "1.0.0"
      }
    },
    "stored_value": {
      "Message": "message-checksum-56098444c4f0dff8f321cfa3769d400f4b5bfa9e01e6ad6b147d81b87130bfb9"
    },
    "merkle_proof": "[1336 hex chars]"
  }
}
```

</details>
<br></br>

<!-- TODO Reference the tool Alex wrote when it becomes available. -->

You will find two types of stored values under the key that identifies the topic control record:

- The checksum of the message payload, as a 32-byte BLAKE2b hash of the serialized `MessagePayload`
- The topic control record containing the number of messages sent on the topic, and the timestamp of the block in which the messages were emitted

```json
{
    "key": "message-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1-0",
    "kind": {
        "Write": {
            "Message": "message-checksum-d4854042c69aac1bc64e6f9cb2e41f306fc106f79951429d1dfef56d638be3c0"
        }
    }
},
{
    "key": "message-topic-b51b0f9d94e5744af4dce6b4a9990c5f3e652c1a0a946e680e83f97d8846eff5-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1",
    "kind": {
        "Write": {
            "MessageTopic": {
                "message_count": 1,
                "blocktime": 1701221761024
            }
        }
    }
},
```

Emitted messages are temporary by design. The message count is reset with every new block, and the block time is updated. Old message checksums are pruned from global state to manage storage, but dApps can query old checksums using the state root hash of the block that contains them.

Here is how you can determine the number of messages emitted in a particular block using the composite key identifying the topic:

```bash
casper-client query-global-state --node-address http://127.0.0.1:11101 \
--key "message-topic-803c759a466a84a0ab12147857f49e269369796a66ad37e94ab8343ddddb7823-topic-name-5721a6d9d7a9afe5dfdb35276fb823bed0f825350e4d865a5ec0110c380de4e1" \
--block-identifier d9642c5d90c7fc05a23d83a3abcf56d63cb71316402ecefe0962fdeccad2c99c
```

<details>
<summary>Expand to view the sample response</summary>

```json
{
  "jsonrpc": "2.0",
  "id": 1227453659579324378,
  "result": {
    "api_version": "1.0.0",
    "block_header": {
      "Version2": {
        "parent_hash": "e55e5127ec6ed5ac03767f9d8b0d0dbd434df81c03658dcc5d9f17b780de980a",
        "state_root_hash": "e033c27db66a4542b53477c97c4f9176ffce72ab6edebd6fdb25b2fe0aa70fe8",
        "body_hash": "ba26e345470f6322f39810e8408fff666026276dee72cbb9fa85ec55657070fb",
        "random_bit": false,
        "accumulated_seed": "caf392ee00d60d9729c8e042acbd851ff70be47b0e8a317cc728b3be47a815ce",
        "era_end": null,
        "timestamp": "2023-12-02T01:19:12.384Z",
        "era_id": 84,
        "height": 890,
        "protocol_version": "1.0.0"
      }
    },
    "stored_value": {
      "MessageTopic": {
        "message_count": 1,
        "blocktime": 1701479952384
      }
    },
    "merkle_proof": "[1288 hex chars]"
  }
}
```
</details>
<br></br>



:::note

The message payload cannot be reconstructed by reading the entry from global state since that entry contains only the checksum of the messages sent.

:::


## Costs and Chainspec Settings

The following chainspec settings manage the cost of contract-level messages. These limits are bundled into the Wasm configuration settings under the `wasm.messages_limits`. Consult the chainspec of the network you are working with, as the following are only examples.

```json
[wasm.messages_limits]
# Maximum size of the topic name.
max_topic_name_size = 256
# Maximum number of topics that can be added for each contract.
max_topics_per_contract = 128
# Maximum size in bytes of the serialized message payload.
max_message_size = 1_024
```

Since contract-level messages are handled through FFIs, the gas cost related to using the new interface is captured in the `wasm.host_function_costs` chainspec settings:

```json
[wasm.host_function_costs]
manage_message_topic = { cost = 200, arguments = [0, 0, 0, 0] }
emit_message = { cost = 200, arguments = [0, 0, 0, 0] }
cost_increase_per_message = 50
```

The `cost_increase_per_message` setting increases the gas cost for each subsequent message when emitting multiple messages within a single execution. In the example above, within a single execution, the first message will cost 200 motes, the second will cost 250 motes, and so on. Each subsequent call will increase the gas cost by the value specified under the `cost_increase_per_message` setting. The subsequent execution will start from the base cost specified in the `emit_message` setting; in this case, the following execution will start at 200 motes.

Storage is charged based on the `wasm.storage_costs.gas_per_byte` chainspec parameter. 
When a new topic is added, two records are written in global state: the topic control record and the addressable entity record extended with the new topic name and topic name hash. Because the topic name is variable, the cost depends on the length of the topic name.
When a message is emitted, two records are written in global state: the topic control record and the message checksum. Writing these records incurs a fixed cost based on `gas_per_byte`.


## Topic Management during Contract Upgrades

When a new contract version is added to the contract package, the message topics registered from the previous version are automatically carried over to the new contract. A new control record will be written for each topic for the new contract version.


## What's Next? {#whats-next}

- Learn to [install a contract and query global state](../cli/installing-contracts.md).
- Learn to [monitor and consume the event stream](../dapps/monitor-and-consume-events.md).