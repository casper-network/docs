# Direct Token Transfer

This workflow describes how to use the Casper command-line client to transfer tokens between accounts on a Casper Network.

This workflow assumes:

1.  You meet the [prerequisites](setup.md)
2.  You are using the Casper command-line client
3.  You have a target `PublicKey` hex the path to the source `SecretKey`
4.  You have a valid `node-address`
5.  You must be able to sign a deploy for the source account

## Transfer {#transfer}

The `transfer` command allows you to move CSPR from one account to another as denominated in [Motes](../design/tokens.md#divisibility-of-tokens). A _Mote_ is a denomination of the cryptocurrency CSPR, where 1 CSPR = 1,000,000,000 Motes.

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
--target-account <hex-encoded-target-account-public-key>
```

**Request fields:**

-   `id` - Optional JSON-RPC identifier applied to the request and returned in the response. If not provided, a random integer will be assigned

-   `transfer-id` -<64-BIT INTEGER> The `transfer-id` is a memo field, providing additional information about the recipient, which is necessary when transferring tokens to some recipients. For example, if depositing tokens into an account where off-chain management keeps track of individual sub-balances, it is necessary to provide a memo id uniquely identifying the actual recipient. If this is not necessary for a given recipient, you may pass `0` or some `u64` value that is meaningful to you

-   `node-address` - Hostname or IP and port of a node on a network bound to a JSON-RPC endpoint \[default:<http://localhost:7777>\]

-   `amount` -<512-BIT INTEGER> The number of motes to transfer (1 CSPR = 1,000,000,000 `Motes`)

-   `secret-key` - Path to secret key file

-   `chain-name` - Name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain

    -   The _chain-name_ for testnet is **casper-test**
    -   The _chain-name_ for mainnet is **casper**

-   `target-account` - Hex-encoded public key of the account from which the main purse will be used as the target

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

A transfer on a Casper Network is only executed after it has been included in a finalized block.

Refer to the Section on [querying deploys](querying.md#deploy-status) within the network to check the execution status of the transfer.

**Important response fields:**

-   `"result"."execution_results"[0]."transfers[0]"` - the address of the executed transfer that the source account initiated. We will use it to look up additional information about the transfer
-   `"result"."execution_results"[0]."block_hash"` - contains the block hash of the block that included our transfer. We will require the _state_root_hash_ of this block to look up information about the accounts and their balances

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
    "id": 2,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
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
        },
        "execution_results": [
            {
                "block_hash": "7c7e9b0f087bba5ce6fc4bd067b57f69ea3c8109157a3ad7f6d98b8da77d97f9",
                "result": {
                    "Success": {
                        "cost": "10000",
                        "effect": {
                            "operations": [
                                {
                                    "key": "hash-d13610d5930fdab36fc25838bc8b4b77fdb4859755dd628c2d30e2a6dfc86a8c",
                                    "kind": "Read"
                                },
                                {
                                    "key": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                                    "kind": "Read"
                                },
                                {
                                    "key": "balance-39b6cc617efddbcc5e989c9eb73ddb5d825bb1070309e7429c029826074e038a",
                                    "kind": "Read"
                                },
                                {
                                    "key": "balance-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527",
                                    "kind": "Write"
                                },
                                {
                                    "key": "deploy-ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
                                    "kind": "Write"
                                },
                                {
                                    "key": "balance-34ec8bcae2675d16bad7e8ba10fada1e50dacf3935ce3b12c25a5bf000fefc76",
                                    "kind": "Write"
                                },
                                {
                                    "key": "transfer-8d81f4a1411d9481aed9c68cd700c39d870757b0236987bb6b7c2a7d72049c0e",
                                    "kind": "Write"
                                },
                                {
                                    "key": "hash-1e13f06cb64bcbf46348dc53c35444da5afc956cfd764cbc3399dc71692e0bd8",
                                    "kind": "Read"
                                },
                                {
                                    "key": "balance-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e",
                                    "kind": "Write"
                                }
                            ],
                            "transforms": [
                                {
                                    "key": "balance-39b6cc617efddbcc5e989c9eb73ddb5d825bb1070309e7429c029826074e038a",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "deploy-ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
                                    "transform": {
                                        "WriteDeployInfo": {
                                            "deploy_hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
                                            "from": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
                                            "gas": "10000",
                                            "source": "uref-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527-007",
                                            "transfers": ["transfer-8d81f4a1411d9481aed9c68cd700c39d870757b0236987bb6b7c2a7d72049c0e"]
                                        }
                                    }
                                },
                                {
                                    "key": "hash-1e13f06cb64bcbf46348dc53c35444da5afc956cfd764cbc3399dc71692e0bd8",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "transfer-8d81f4a1411d9481aed9c68cd700c39d870757b0236987bb6b7c2a7d72049c0e",
                                    "transform": {
                                        "WriteTransfer": {
                                            "amount": "2500000000",
                                            "deploy_hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
                                            "from": "account-hash-b0049301811f23aab30260da66927f96bfae7b99a66eb2727da23bf1427a38f5",
                                            "gas": "0",
                                            "id": null,
                                            "source": "uref-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527-007",
                                            "target": "uref-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e-004",
                                            "to": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668"
                                        }
                                    }
                                },
                                {
                                    "key": "balance-34ec8bcae2675d16bad7e8ba10fada1e50dacf3935ce3b12c25a5bf000fefc76",
                                    "transform": {
                                        "AddUInt512": "10000"
                                    }
                                },
                                {
                                    "key": "hash-d13610d5930fdab36fc25838bc8b4b77fdb4859755dd628c2d30e2a6dfc86a8c",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "balance-6f4026262a505d5e1b0e03b1e3b7ab74a927f8f2868120cf1463813c19acb71e",
                                    "transform": {
                                        "AddUInt512": "2500000000"
                                    }
                                },
                                {
                                    "key": "account-hash-8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "balance-9e90f4bbd8f581816e305eb7ea2250ca84c96e43e8735e6aca133e7563c6f527",
                                    "transform": {
                                        "WriteCLValue": {
                                            "bytes": "0ee0bff9d5085bc138938d44c64d31",
                                            "cl_type": "U512",
                                            "parsed": "999999999999999999999994999980000"
                                        }
                                    }
                                }
                            ]
                        },
                        "transfers": ["transfer-8d81f4a1411d9481aed9c68cd700c39d870757b0236987bb6b7c2a7d72049c0e"]
                    }
                }
            }
        ]
    }
}
```

</details>


