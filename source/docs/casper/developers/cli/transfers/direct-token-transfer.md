# Direct Token Transfer

This workflow describes how to use the Casper command-line client to transfer tokens between purses on a Casper network.

This workflow assumes:

1.  You meet the [prerequisites](../../prerequisites.md)
2.  You are using the Casper command-line client
3.  You have a target *public key* hex the path to the source *secret key*
4.  You have a valid *node-address*
5.  You must be able to sign a deploy for the source account

## Transfer {#transfer}

The `transfer` command allows you to move CSPR from one account's purse to another as denominated in [Motes](../../../concepts/design/casper-design.md#tokens-divisibility). A _Mote_ is a denomination of the cryptocurrency CSPR, where 1 CSPR = 1,000,000,000 Motes.

For transfers of at least 2.5 CSPR (2,500,000,000 Motes) from a single sender to a single recipient on a Casper network, the most efficient option is to use the direct transfer capability.

**Direct transfer example**:

```bash
casper-client transfer \
--id 1 \
--transfer-id 123456789012345 \
--node-address http://<node-ip-address>:7777 \
--amount <amount-to-transfer> \
--secret-key <source-account-secret-key>.pem \
--chain-name casper \
--target-account <hex-encoded-target-account-public-key> \
--payment-amount <payment-in-motes>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned

-   `transfer-id` -<64-BIT INTEGER> The `transfer-id` is a memo field, providing additional information about the recipient, which is necessary when transferring tokens to some recipients. For example, if depositing tokens into an account's purse where off-chain management keeps track of individual sub-balances, it is necessary to provide a memo ID uniquely identifying the actual recipient. If this is not necessary for a given recipient, you may pass `0` or some `u64` value that is meaningful to you

-   `node-address` - Hostname or IP and port of a node on a network bound to a JSON-RPC endpoint \[default:<http://localhost:7777>\]

-   `amount` -<512-BIT INTEGER> The number of motes to transfer (1 CSPR = 1,000,000,000 `Motes`)

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for testnet is **casper-test**
    -   The _chain-name_ for mainnet is **casper**

-   `target-account` - Hex-encoded public key of the account from which the main purse will be used as the target

-   `payment-amount` - The payment for the transfer in motes. The payment amount varies based on each deploy and network [chainspec](../../concepts/glossary/C.md#chainspec). For Testnet node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml), you can specify 10^8 motes

**Important response fields:**

-   `"result"."deploy_hash"` - the address of the executed transfer, needed to look up additional information about the transfer

**Note**: Save the returned _deploy_hash_ from the output to query information about the transfer deploy later.

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "account_put_deploy",
    "params": {
        "deploy": {
            "approvals": [
                {
                    "signature": "130 chars",
                    "signer": "010f50b0116f213ef65b99d1bd54483f92bf6131de2f8aceb7e3f825a838292150"
                }
            ],
            "hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
            "header": {
                "account": "010f50b0116f213ef65b99d1bd54483f92bf6131de2f8aceb7e3f825a838292150",
                "body_hash": "da35b095640a403324306c59ac6f18a446dfcc28faf753ce58b96b635587dd8e",
                "chain_name": "casper-net-1",
                "dependencies": [],
                "gas_price": 1,
                "timestamp": "2021-04-20T18:04:40.333Z",
                "ttl": "1h"
            },
            "payment": {
                "ModuleBytes": {
                    "args": [
                        [
                            "amount",
                            {
                                "bytes": "021027",
                                "cl_type": "U512",
                                "parsed": "10000"
                            }
                        ]
                    ],
                    "module_bytes": ""
                }
            },
            "session": {
                "Transfer": {
                    "args": [
                        [
                            "amount",
                            {
                                "bytes": "0400f90295",
                                "cl_type": "U512",
                                "parsed": "2500000000"
                            }
                        ],
                        [
                            "target",
                            {
                                "bytes": "8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                                "cl_type": {
                                    "ByteArray": 32
                                },
                                "parsed": "8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668"
                            }
                        ],
                        [
                            "id",
                            {
                                "bytes": "00",
                                "cl_type": {
                                    "Option": "U64"
                                },
                                "parsed": null
                            }
                        ]
                    ]
                }
            }
        }
    }
}
```

**JSON-RPC Response**:

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "deploy_hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713"
    }
}
```

</details>

### Deploy Status {#deploy-status}

A transfer on a Casper network is only executed after it has been included in a finalized block.

Refer to the Section on [querying deploys](../../../resources/tutorials/beginner/querying-network.md#querying-deploys) within the network to check the execution status of the transfer.

**Important response fields:**

-   `"result"."execution_results"[0]."transfers[0]"` - the address of the executed transfer that the source account initiated. We will use it to look up additional information about the transfer
-   `"result"."execution_results"[0]."block_hash"` - contains the block hash of the block that included our transfer. We will require the _state_root_hash_ of this block to look up information about the accounts and their purse balances

**Note**: Transfer addresses use a `transfer-` string prefix.

<details>
<summary>Explore the JSON-RPC request and response generated.</summary>

**JSON-RPC Request**:

```json
{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "info_get_deploy",
    "params": {
        "deploy_hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713"
    }
}
```

**JSON-RPC Response**:

```json
{
  "id": 6054990863558097019,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.6",
    "deploy": {
      "approvals": [
        {
          "signature": "01c8c1704a2c921988cd546fe85d249f27bc9da198e8c2f79d91e19a40e015e59a099723b5540c20c57a1ebffef2e4d2e333d9e52f1f27fef9d6b9a4ec5080b40a",
          "signer": "01ea8ff63a2b3bcf42c3e8e057959d864043fb989082ddc54464ef9a2ea7338ba0"
        }
      ],
      "hash": "d5862af0c7d06df6cb265c2dee9a014ce570a8db75eb0689f14d819c632c305d",
      "header": {
        "account": "01ea8ff63a2b3bcf42c3e8e057959d864043fb989082ddc54464ef9a2ea7338ba0",
        "body_hash": "9ccc49a951b9b783bbb20746007e221e8326fbbb48f002aaa40d664abf35995d",
        "chain_name": "casper-test",
        "dependencies": [],
        "gas_price": 1,
        "timestamp": "2022-07-05T22:39:20.190Z",
        "ttl": "30m"
      },
      "payment": {
        "ModuleBytes": {
          "args": [
            [
              "amount",
              {
                "bytes": "0400e1f505",
                "cl_type": "U512",
                "parsed": "100000000"
              }
            ]
          ],
          "module_bytes": ""
        }
      },
      "session": {
        "Transfer": {
          "args": [
            [
              "amount",
              {
                "bytes": "0400f90295",
                "cl_type": "U512",
                "parsed": "2500000000"
              }
            ],
            [
              "target",
              {
                "bytes": "0203343d88a5dd8a67ab8c9d572c50c7f4604960d78f8a41ea48b98d3dcec6316834",
                "cl_type": "PublicKey",
                "parsed": "0203343d88a5dd8a67ab8c9d572c50c7f4604960d78f8a41ea48b98d3dcec6316834"
              }
            ],
            [
              "id",
              {
                "bytes": "01e6c6720000000000",
                "cl_type": {
                  "Option": "U64"
                },
                "parsed": 7522022
              }
            ]
          ]
        }
      }
    },
    "execution_results": [
      {
        "block_hash": "b357fc78f105e43be66f268bb8d7308f357fe37e0e55d92d26f8e255c9292529",
        "result": {
          "Success": {
            "cost": "100000000",
            "effect": {
              "operations": [],
              "transforms": [
                {
                  "key": "account-hash-aff4921ce6f73072a914f04e7327a946b72ec4562a7d99f107e9411d1592c3f6",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-aff4921ce6f73072a914f04e7327a946b72ec4562a7d99f107e9411d1592c3f6",
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
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0500a7d0dd2c",
                      "cl_type": "U512",
                      "parsed": "192700000000"
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
                  "key": "account-hash-aff4921ce6f73072a914f04e7327a946b72ec4562a7d99f107e9411d1592c3f6",
                  "transform": "Identity"
                },
                {
                  "key": "account-hash-aff4921ce6f73072a914f04e7327a946b72ec4562a7d99f107e9411d1592c3f6",
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
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0500a7d0dd2c",
                      "cl_type": "U512",
                      "parsed": "192700000000"
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
                  "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": "Identity"
                },
                {
                  "key": "balance-be85882962304905286b2b4d3602f7f287095536ef4ce3e9a5360930c729ec2c",
                  "transform": "Identity"
                },
                {
                  "key": "balance-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0500aecd482c",
                      "cl_type": "U512",
                      "parsed": "190200000000"
                    }
                  }
                },
                {
                  "key": "balance-be85882962304905286b2b4d3602f7f287095536ef4ce3e9a5360930c729ec2c",
                  "transform": {
                    "AddUInt512": "2500000000"
                  }
                },
                {
                  "key": "transfer-86760957e94a46839bcd03bee35c9db6b8a906e6fbfe87e69e93383df3d41b2a",
                  "transform": {
                    "WriteTransfer": {
                      "amount": "2500000000",
                      "deploy_hash": "d5862af0c7d06df6cb265c2dee9a014ce570a8db75eb0689f14d819c632c305d",
                      "from": "account-hash-9aed70924116013bdd5517109bea97678d9cff449640457a8a4ed3e561d864d4",
                      "gas": "0",
                      "id": 7522022,
                      "source": "uref-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4-007",
                      "target": "uref-be85882962304905286b2b4d3602f7f287095536ef4ce3e9a5360930c729ec2c-004",
                      "to": "account-hash-aff4921ce6f73072a914f04e7327a946b72ec4562a7d99f107e9411d1592c3f6"
                    }
                  }
                },
                {
                  "key": "deploy-d5862af0c7d06df6cb265c2dee9a014ce570a8db75eb0689f14d819c632c305d",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "d5862af0c7d06df6cb265c2dee9a014ce570a8db75eb0689f14d819c632c305d",
                      "from": "account-hash-9aed70924116013bdd5517109bea97678d9cff449640457a8a4ed3e561d864d4",
                      "gas": "100000000",
                      "source": "uref-20c3a137051eaa98efa048fd8f888ed4b342bcc1c8166f475e25b6a627d669a4-007",
                      "transfers": [
                        "transfer-86760957e94a46839bcd03bee35c9db6b8a906e6fbfe87e69e93383df3d41b2a"
                      ]
                    }
                  }
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
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-874289dbe721508e8d2893efd86364ea1ca67a6a2456825259efd6db8efb427c",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "00",
                      "cl_type": "U512",
                      "parsed": "0"
                    }
                  }
                },
                {
                  "key": "balance-874289dbe721508e8d2893efd86364ea1ca67a6a2456825259efd6db8efb427c",
                  "transform": {
                    "AddUInt512": "100000000"
                  }
                }
              ]
            },
            "transfers": [
              "transfer-86760957e94a46839bcd03bee35c9db6b8a906e6fbfe87e69e93383df3d41b2a"
            ]
          }
        }
      }
    ]
  }
}
```

</details>
