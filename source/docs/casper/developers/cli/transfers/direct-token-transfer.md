# Direct Token Transfer

This workflow describes how to use the Casper command-line client to transfer tokens between purses on a Casper network.

## Prerequisites

This workflow assumes:

1.  You meet the general [development prerequisites](../../prerequisites.md)
2.  You are using the Casper command-line client
3.  You have a target *public key*
4.  You have a valid *node address*
5.  You must be able to sign a deploy for the source account using the source *secret key*

## Direct Transfer Example {#transfer}

The following `transfer` command allows you to move CSPR from one account's purse to another as denominated in [Motes](../../../concepts/design/casper-design.md#tokens-divisibility). A _Mote_ is a denomination of the cryptocurrency CSPR, where 1 CSPR = 1,000,000,000 Motes.

For transfers of at least 2.5 CSPR (2,500,000,000 Motes) from a single sender to a single recipient on a Casper network, the most efficient option is to use the direct transfer capability.

```bash
casper-client transfer \
--id <ID> \
--transfer-id <TRANSFER_ID> \
--node-address [NODE_SERVER_ADDRESS]  \
--amount [AMOUNT_TO_TRANSFER] \
--secret-key [KEY_PATH]/secret_key.pem \
--chain-name [CHAIN_NAME] \
--target-account [TARGET_PUBLIC_KEY_HEX] \
--payment-amount [PAYMENT_AMOUNT_IN_MOTES]
```

**Request fields:**
```
-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned
-   `transfer-id` -<64-BIT INTEGER> The `transfer-id` is a memo field, providing additional information about the recipient, which is necessary when transferring tokens to some recipients. For example, if depositing tokens into an account's purse where off-chain management keeps track of individual sub-balances, it is necessary to provide a memo ID uniquely identifying the actual recipient. If this is not necessary for a given recipient, you may pass `0` or some `u64` value that is meaningful to you
-   `node-address` - Hostname or IP and port of a node on a network bound to a JSON-RPC endpoint \[default:<http://localhost:7777>\]
-   `amount` -<512-BIT INTEGER> The number of motes to transfer (1 CSPR = 1,000,000,000 `Motes`)
-   `secret-key` - Path to secret key file
-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for Testnet is **casper-test**
    -   The _chain-name_ for Mainnet is **casper**

-   `target-account` - Hex-encoded public key of the account that will receive the funds in its main purse
-   `payment-amount` - The payment for the transfer in motes. The payment amount varies based on each deploy and network [chainspec](../../../concepts/glossary/C.md#chainspec). For Testnet node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml), you can specify 10^8 motes
```
**Important response fields:**

-   `"result"."deploy_hash"` - The address of the deploy, needed to look up additional information about the transfer

:::note

Save the returned _deploy_hash_ from the output to query information about the transfer deploy later.

:::

**Example Transfer:**

```bash
casper-client transfer -v \
--id 3 \
--transfer-id 11102023 \
--node-address https://rpc.testnet.casperlabs.io/  \
--amount 5000000000 \
--secret-key ~/KEYS/secret_key.pem \
--chain-name casper-test \
--target-account 01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986 \
--payment-amount 100000000
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "account_put_deploy",
  "params": {
    "deploy": {
      "hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
      "header": {
        "account": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
        "timestamp": "2023-10-12T14:59:40.760Z",
        "ttl": "30m",
        "gas_price": 1,
        "body_hash": "ea7e6a6cbdd4d761827cb627e162896bee3e771beda000550615c9b4fafa3a2d",
        "dependencies": [],
        "chain_name": "casper-test"
      },
      "payment": {
        "ModuleBytes": {
          "module_bytes": "",
          "args": [
            [
              "amount",
              {
                "cl_type": "U512",
                "bytes": "0400e1f505",
                "parsed": "100000000"
              }
            ]
          ]
        }
      },
      "session": {
        "Transfer": {
          "args": [
            [
              "amount",
              {
                "cl_type": "U512",
                "bytes": "0500f2052a01",
                "parsed": "5000000000"
              }
            ],
            [
              "target",
              {
                "cl_type": "PublicKey",
                "bytes": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
                "parsed": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986"
              }
            ],
            [
              "id",
              {
                "cl_type": {
                  "Option": "U64"
                },
                "bytes": "014767a90000000000",
                "parsed": 11102023
              }
            ]
          ]
        }
      },
      "approvals": [
        {
          "signer": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
          "signature": "01e53cb742ed13ff4f0584a3da0f22f5942a33e010965adf640c91204ae4bc7436f1e5534d338ffa117d193295214816445439781229d24a372085c316eac5e305"
        }
      ]
    }
  },
  "id": 3
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "api_version": "1.5.3",
    "deploy_hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c"
  }
}
```

</details>

## Verifying the Deploy {#verify-deploy}

A transfer on a Casper network is only executed after it has been included in a finalized block.

```bash
casper-client get-deploy 
--node-address [NODE_SERVER_ADDRESS] [DEPLOY_HASH]
```

**Important response fields:**

-   `"result"."execution_results"[0]."transfers[0]"` - the address of the executed transfer that the source account initiated. We will use it to look up additional information about the transfer
-   `"result"."execution_results"[0]."block_hash"` - contains the block hash of the block that included the transfer. We will require the _state_root_hash_ of this block to look up information about the accounts and their purse balances

:::note

Transfer addresses use a `transfer-` string prefix.

:::

**Example Query:**

```bash
casper-client get-deploy 
--node-address https://rpc.testnet.casperlabs.io 
1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c
```

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "info_get_deploy",
  "params": {
    "deploy_hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
    "finalized_approvals": false
  },
  "id": -3447643973713335073
}
```

**JSON-RPC Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.5.3",
    "deploy": {
      "hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
      "header": {
        "account": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
        "timestamp": "2023-10-12T14:59:40.760Z",
        "ttl": "30m",
        "gas_price": 1,
        "body_hash": "ea7e6a6cbdd4d761827cb627e162896bee3e771beda000550615c9b4fafa3a2d",
        "dependencies": [],
        "chain_name": "casper-test"
      },
      "payment": {
        "ModuleBytes": {
          "module_bytes": "",
          "args": [
            [
              "amount",
              {
                "cl_type": "U512",
                "bytes": "0400e1f505",
                "parsed": "100000000"
              }
            ]
          ]
        }
      },
      "session": {
        "Transfer": {
          "args": [
            [
              "amount",
              {
                "cl_type": "U512",
                "bytes": "0500f2052a01",
                "parsed": "5000000000"
              }
            ],
            [
              "target",
              {
                "cl_type": "PublicKey",
                "bytes": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
                "parsed": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986"
              }
            ],
            [
              "id",
              {
                "cl_type": {
                  "Option": "U64"
                },
                "bytes": "014767a90000000000",
                "parsed": 11102023
              }
            ]
          ]
        }
      },
      "approvals": [
        {
          "signer": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
          "signature": "01e53cb742ed13ff4f0584a3da0f22f5942a33e010965adf640c91204ae4bc7436f1e5534d338ffa117d193295214816445439781229d24a372085c316eac5e305"
        }
      ]
    },
    "execution_results": [
      {
        "block_hash": "aac51dad028ba8b3d6fec86a39252bbc4285d513fd57a8af4696ab5390ac5c2b",
        "result": {
          "Success": {
            "effect": {
              "operations": [],
              "transforms": [
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "06621c3e660301",
                      "parsed": "1114111876194"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "100000000"
                  }
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "06621c3e660301",
                      "parsed": "1114111876194"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "100000000"
                  }
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "06622a383c0201",
                      "parsed": "1109111876194"
                    }
                  }
                },
                {
                  "key": "balance-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c",
                  "transform": {
                    "AddUInt512": "5000000000"
                  }
                },
                {
                  "key": "transfer-0de7250864e67aa76626a844dcc931e615284a13a110df3f97cec9e3e97af405",
                  "transform": {
                    "WriteTransfer": {
                      "deploy_hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
                      "from": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                      "to": "account-hash-1ed5a1c39bea93c105f2d22c965a84b205b36734a377d05dbb103b6bfaa595a7",
                      "source": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
                      "target": "uref-8294864177c2c1ec887a11dae095e487b5256ce6bd2a1f2740d0e4f28bd3251c-004",
                      "amount": "5000000000",
                      "gas": "0",
                      "id": 11102023
                    }
                  }
                },
                {
                  "key": "deploy-1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "1f17a0bdeaaf71abd03492c854cdf97f746432751721ce555e95b9cefe641e3c",
                      "transfers": [
                        "transfer-0de7250864e67aa76626a844dcc931e615284a13a110df3f97cec9e3e97af405"
                      ],
                      "from": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                      "source": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
                      "gas": "100000000"
                    }
                  }
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-da632bfba17f4a7882581de2a37219be71628600ccd0df83f1d42465bd018537",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "00",
                      "parsed": "0"
                    }
                  }
                },
                {
                  "key": "balance-da632bfba17f4a7882581de2a37219be71628600ccd0df83f1d42465bd018537",
                  "transform": {
                    "AddUInt512": "100000000"
                  }
                }
              ]
            },
            "transfers": [
              "transfer-0de7250864e67aa76626a844dcc931e615284a13a110df3f97cec9e3e97af405"
            ],
            "cost": "100000000"
          }
        }
      }
    ]
  },
  "id": -3447643973713335073
}
```

</details>

Refer to the Section on [querying deploys](../../../resources/beginner/querying-network.md#querying-deploys) for more information.

## Verifying the Transfer

In addition to verifying the deploy, you also need to [verify the transfer details](./verify-transfer.md). The deploy may have been successful, but you also need to ensure the source and target accounts were updated correctly.