# Setting up a Multi-sig Account

In this section, we will explore the commands to setup an account with associated keys and restrict access for deployment and key management to specific keys within the account. 

In this example, we will set up an account with the following weights and thresholds:
- Three associated keys (Manager, Supervisor, and Clerk)
- Weights of the associated keys:
    - Manager - 4
    - Supervisor - 2
    - Clerk - 1
- Weights of the thresholds:
    - Key management - 4
    - Deploy - 3


:::note

For all the commands used in this tutorial, here are a few pointers:
- The `node-address` attribute is a combination of a peer node IP address from the Mainnet or Testnet prefixed with `7777`, which is the RPC port. 
- The `chain-name` attribute, is `casper-test` for Testnet and `casper` for Mainnet.
- The `amount` attribute is the cost of the transaction in motes.
- Hexadecimal public key is found in the `public_key_hex` file. Copy the contents of this file and paste it in the command that calls for it.

:::

## Creating Accounts

Create three sets of keys one each for the Manager, Supervisor and Clerk. 

To create accounts on the Casper blockchain, you need to generate keys and fund your accounts. For more information see [Account and Cryptographic Keys](../../keys.md). 

To fund your Testnet account, see [Funding Testnet Accounts](../../../workflow/testnet-faucet.md).

## Deploying the Keys Manager Contract

Before you deploy the keys manager contract, you must clone the keys-manager repository and build the [contract](contract.md).

You can deploy the keys manager contract using the `put-deploy` command as illustrated below.

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--secret-key <path to secret_key.pem> \
--session-path <path to keys-manager.wasm> \
--payment-amount 10000000000
```

<details>
<summary>Sample output with deploy hash</summary>

{
  "id": -4915929071409710835,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.4",
    "deploy_hash": "3d55c71ae0892c9f5b63be56c8ca3e107e39e812ebc925383881cfa003aaced7"
  }
}

</details>

### Check deploy status {#check-deploy-status}

The deploy hash from the previous output is used to find the deploy status. The deploy usually takes a few minutes to execute, so please be patient.

```bash
casper-client get-deploy <deploy hash> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

<details>
<summary>Sample output showing deploy status</summary>

{
  "id": -470146583313425542,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.4",
    "deploy": {
      "approvals": [
        {
          "signature": "015fa28d6a68000a05c323cf9933c3a93f1b0126a8c769048342b2059cab51b00232e6454abd31dfc2405887e8b4                                        8c38e38412a04290311883ba9f8f51bde5b0c",
          "signer": "01b00d1991357e1db95a52101ad7050d552c75a54ac6724c11756f514a181d520a"
        }
      ],
      "hash": "3d55c71ae0892c9f5b63be56c8ca3e107e39e812ebc925383881cfa003aaced7",
      "header": {
        "account": "01b00d1991357e1db95a52101ad7050d552c75a54ac6724c11756f514a181d520a",
        "body_hash": "21ae03fecc7491959bba4d290e2fc494163b5f29dd044143514d568eab7e9cab",
        "chain_name": "casper-test",
        "dependencies": [],
        "gas_price": 1,
        "timestamp": "2022-02-18T11:26:12.240Z",
        "ttl": "30m"
      },
      "payment": {
        "ModuleBytes": {
          "args": [
            [
              "amount",
              {
                "bytes": "0500e8764817",
                "cl_type": "U512",
                "parsed": "100000000000"
              }
            ]
          ],
          "module_bytes": ""
        }
      },
      "session": {
        "ModuleBytes": {
          "args": [],
          "module_bytes": "[381268 hex chars]"
        }
      }
    },
    "execution_results": [
      {
        "block_hash": "ed652d9cc06e5cd24429c67eb977e17e710fd57863c883c08efcdb88f0749607",
        "result": {
          "Success": {
            "cost": "74678904670",
            "effect": {
              "operations": [],
              "transforms": [
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
                  "key": "balance-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0500282e8cd1",
                      "cl_type": "U512",
                      "parsed": "900000000000"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "100000000000"
                  }
                },
                {
                  "key": "uref-39e68561186ebe397246cc3e8da6b09edfa33ff8b114ca7f66b65a62b73f40df-000",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "",
                      "cl_type": "Unit",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-1096cb5a529e1eebeb3522cb5e3e7b60f3dd47de68b70ccc8a83560cd3a216db",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "hash-1096cb5a529e1eebeb3522cb5e3e7b60f3dd47de68b70ccc8a83560cd3a216db",
                  "transform": "Identity"
                },
                {
                  "key": "hash-0d90baf0b1e6b7a8bd45d172896a6d24616b457f1e1ee28081d821a00ffe62b3",
                  "transform": "WriteContractWasm"
                },
                {
                  "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
                  "transform": "WriteContract"
                },
                {
                  "key": "hash-1096cb5a529e1eebeb3522cb5e3e7b60f3dd47de68b70ccc8a83560cd3a216db",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
                  "transform": {
                    "AddKeys": [
                      {
                        "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
                        "name": "keys_manager"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-000",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
                      "cl_type": {
                        "ByteArray": 32
                      },
                      "parsed": "fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476"
                    }
                  }
                },
                {
                  "key": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
                  "transform": {
                    "AddKeys": [
                      {
                        "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
                        "name": "keys_manager_hash"
                      }
                    ]
                  }
                },
                {
                  "key": "deploy-3d55c71ae0892c9f5b63be56c8ca3e107e39e812ebc925383881cfa003aaced7",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "3d55c71ae0892c9f5b63be56c8ca3e107e39e812ebc925383881cfa003aaced7",
                      "from": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
                      "gas": "74678904670",
                      "source": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
                      "transfers": []
                    }
                  }
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
                  "key": "balance-34b99d631b7545a56af663801f8b86c0f38cc014b002e9f7e0c0b2a19e789f14",
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
                  "key": "balance-34b99d631b7545a56af663801f8b86c0f38cc014b002e9f7e0c0b2a19e789f14",
                  "transform": {
                    "AddUInt512": "100000000000"
                  }
                }
              ]
            },
            "transfers": []
          }
        }
      }
    ]
  }
}

</details>

### View account details {#view-account-details}

The following command gets the account details after the deploy is successful:

```
casper-client get-account-info \
--public-key <hexadecimal public key> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

In the output of this command, you can see the key weight, key management threshold, and deploy threshold. Also, observe the main purse structure, which has the `keys_manager_hash` uref address. In the next steps, this uref address is used to find the smart contract's [session hash](#find-session-hash).

<details>
<summary>Sample output with named keys for the keys manager contract</summary>

{
  "id": 3805776763924596530,
  "jsonrpc": "2.0",
  "result": {
    "account": {
      "account_hash": "account-hash-694c000a8282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 1
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-694c000a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
          "weight": 1
        }
      ],
      "main_purse": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
      "named_keys": [
        {
          "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
          "name": "keys_manager"
        },
        {
          "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
          "name": "keys_manager_hash"
        }
      ]
    },
    "api_version": "1.4.4",
    "merkle_proof": "[26588 hex chars]"
  }
}

</details>

In the above output, you can see the named keys for the contract and the uref for keys_manager_hash. This uref hash will be used to find the session hash of the contract.

### Find session hash

To find the session hash, we need the state root hash and the uref hash of the keys manager contract. 

**State root hash**

Use the following command to find the state root hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP_ADDRESS]:7777
```

<details>
<summary>Sample output with state root hash</summary>

{
  "id": -1255673544684673900,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.4",
    "state_root_hash": "61743f2d702a36bae49faa57f221caf10725e0bff5481c2ec568ea4f0a28f69b"
  }
}

You can use this state root hash in the next section to find the session hash of the smart contract. 

</details>

**Uref hash of the keys manager contract**

You can find the uref hash in the account information of the account used to deploy the keys manager contract, see [View Account Details](#view-account-details-view-account-details). 

**Session hash for keys manager contract**

Use the following command to get the session hash of the smart contract: 

```bash
casper-client query-state \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--key <uref of keys_manager_hash> \
--state-root-hash <network state root hash>
```

In the following output, the parsed value is the session hash `fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476`.

<details>
<summary>Sample output with session hash</summary>

{
  "id": -3744898570362638107,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.4",
    "block_header": null,
    "merkle_proof": "[34692 hex chars]",
    "stored_value": {
      "CLValue": {
        "bytes": "fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
        "cl_type": {
          "ByteArray": 32
        },
        "parsed": "fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476"
      }
    }
  }
}

</details>


## Setting the Manager's Key Weight to 4

Let's setup the main account (Manager) with a key weight of 4.  

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--secret-key <local path of secret_key.pem file> \
--session-hash <session hash of keys manager contract>\
--payment-amount 1000000000 \
--session-entry-point set_key_weight \
--session-arg "account:public_key='01b2200091357e1db95a52101ad7050d552c75a54ac6724c11756f514a181d520a'" \
--session-arg "weight:u8='4'"
```

In the above command, observe the following:
- The `secret-key` attribute should point to the `secret_key.pem` file 
- The `session-entry-point` attribute value is `set_key_weight`, which remains the same for setting keys weights for all the keys.
- The `session-arg` for `set_key_weight` are the hexadecimal public key of the key pair that you want to set the weight for and the new weight for the key. In this example, the hex public key is of the Manager's account.

<details>
<summary>Sample output with deploy hash</summary>

{
  "id": -8205577127765151372,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.4",
    "deploy_hash": "70f8f95afdcf5729b58a5000f1b566448305890c99c21ded1a2bdc70773fdbc1"
  }
}

</details>

You can use the deploy hash from the above output to find the deploy status.

### Viewing the Account Structure with an Associated Account

You view the updated account structure using the following command:

```bash
casper-client get-account-info \
--public-key <hex public key of Manager account> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

<details>
<summary>Sample output with one associated key</summary>

{
  "id": -244324861334765287,
  "jsonrpc": "2.0",
  "result": {
    "account": {
      "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 1
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
          "weight": 4
        },
        {
          "account_hash": "account-hash-f19e3269ae27a44d5debfcd2df0a5b5dd6c31961d335a09dcd5f782ddebb3683",
          "weight": 2
        }
      ],
      "main_purse": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
      "named_keys": [
        {
          "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
          "name": "keys_manager"
        },
        {
          "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
          "name": "keys_manager_hash"
        }
      ]
    },
    "api_version": "1.4.4",
    "merkle_proof": "[26654 hex chars]"
  }
}

</details>

## Linking the Other Accounts and Setting Key Weights 

You can link an account and set the key weight for that account in one command. To do this, use the secret_key.pem file of the main account and the hexadecimal primary key of the account to link. An example of how the `put-deploy` command is used to link accounts and set weights, is shown here:

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--secret-key <path to Manager secret_key.pem> \
--session-hash <session hash of keys manager contract> \
--payment-amount 1000000000 \
--session-entry-point set_key_weight \
--session-arg "account:public_key='01e6c6000a88f122d463ed083e81f77da2c58cb92529eb422274641e4b3b2126a'" \
--session-arg "weight:u8='2'"
```

In the above command, observe the following:
- The `secret-key` should point to the `secret_key.pem` file of the main account (Manager). The amount for the transaction will be deducted from the main purse of this account.
- The hexadecimal public key should be of the account you wish to associate with the main account. In this case, it is the Supervisor's account.

:::note

You can use this command to set the weight for the Clerk's account as well. To do so, replace the hexadecimal public key with that of the Clerk's account and keep the weight as 1.

:::

### Viewing Account Structure with All Associated Keys

You can view the updated account structure using the following command:

```bash
casper-client get-account-info \
--public-key <hex public key of Manager account> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

<details>
<summary>Sample output showing the account structure with all associated keys</summary>

{
  "id": 2242895416442018609,
  "jsonrpc": "2.0",
  "result": {
    "account": {
      "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 1
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
          "weight": 4
        },
        {
          "account_hash": "account-hash-b3ff5309f983f2b30c70fc5fdf36eecab8460759e3465cccb1f7718704ebba27",
          "weight": 1
        },
        {
          "account_hash": "account-hash-f19e3269ae27a44d5debfcd2df0a5b5dd6c31961d335a09dcd5f782ddebb3683",
          "weight": 2
        }
      ],
      "main_purse": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
      "named_keys": [
        {
          "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
          "name": "keys_manager"
        },
        {
          "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
          "name": "keys_manager_hash"
        }
      ]
    },
    "api_version": "1.4.4",
    "merkle_proof": "[26720 hex chars]"
  }
}

</details>

## Setting Key Management Threshold to 4

To set the key management threshold we will use the `set_key_management_threshold` entry point. Also, keep in mind these [restrictions](#key-management-restrictions) while setting the thresholds for account management. You can use the following command to set the key management threshold:

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--secret-key <path to Manager secret_key.pem> \
--session-hash <session hash of keys manager contract> \
--payment-amount 5000000000 \
--session-entry-point set_key_management_threshold \
--session-arg "weight:u8='4'"
```

Use the following command to see the updated account structure:

```bash
casper-client get-account-info \
--public-key <hex public key of Manager account> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

<details>
<summary>Sample output with the updated key management threshold</summary>

{
  "id": 2760750489916445167,
  "jsonrpc": "2.0",
  "result": {
    "account": {
      "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
      "action_thresholds": {
        "deployment": 1,
        "key_management": 4
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
          "weight": 4
        },
        {
          "account_hash": "account-hash-b3ff5309f983f2b30c70fc5fdf36eecab8460759e3465cccb1f7718704ebba27",
          "weight": 1
        },
        {
          "account_hash": "account-hash-f19e3269ae27a44d5debfcd2df0a5b5dd6c31961d335a09dcd5f782ddebb3683",
          "weight": 2
        }
      ],
      "main_purse": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
      "named_keys": [
        {
          "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
          "name": "keys_manager"
        },
        {
          "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
          "name": "keys_manager_hash"
        }
      ]
    },
    "api_version": "1.4.4",
    "merkle_proof": "[26720 hex chars]"
  }
}

</details>

## Setting Deploy Threshold to 3

You can use the following command to set the deploy threshold to 3.

```bash
casper-client put-deploy \
--chain-name casper-test \
--node-address http://[NODE_IP_ADDRESS]:7777 \
--secret-key <path to Manager secret_key.pem> \
--session-hash <session hash of keys manager contract> \
--payment-amount 5000000000 \
--session-entry-point set_deployment_threshold \
--session-arg "weight:u8='3'"
```

## Viewing Final Account Structure

Once again we will use the `get-account-info` command to view the main account structure.

```bash
casper-client get-account-info \
--public-key <hex public key of Manager account> \
--node-address http://[NODE_IP_ADDRESS]:7777
```

The following account structure will be visible after all the key weights and thresholds are set.

<details>
<summary>Sample final account structure</summary>

{
  "id": -1053187261000032037,
  "jsonrpc": "2.0",
  "result": {
    "account": {
      "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
      "action_thresholds": {
        "deployment": 3,
        "key_management": 4
      },
      "associated_keys": [
        {
          "account_hash": "account-hash-694c109a08282d039ace20fbad7a692f4d800a7fd6db08848bc95f8a9f7e4273",
          "weight": 4
        },
        {
          "account_hash": "account-hash-b3ff5309f983f2b30c70fc5fdf36eecab8460759e3465cccb1f7718704ebba27",
          "weight": 1
        },
        {
          "account_hash": "account-hash-f19e3269ae27a44d5debfcd2df0a5b5dd6c31961d335a09dcd5f782ddebb3683",
          "weight": 2
        }
      ],
      "main_purse": "uref-250554daef44c5274f726f2556b62da7dbd6d997d6a93dea925104529db12e6a-007",
      "named_keys": [
        {
          "key": "hash-fc8eaf47329d45c76c4f80ec4e6fdb08e74dbe4ae0391447c5ebd15f1c962476",
          "name": "keys_manager"
        },
        {
          "key": "uref-3141039f23ae092028da3b8222ebb5ae5d8409e745b507903e5f7600fa42aada-007",
          "name": "keys_manager_hash"
        }
      ]
    },
    "api_version": "1.4.4",
    "merkle_proof": "[26720 hex chars]"
  }
}

</details>


## Key Management Restrictions

This section explains a few rules that apply to key management:

- Set the deployment threshold lower than or equal to the key-management threshold
- Set the deployment threshold lower than or equal to all other thresholds
- Ensure the account used to set the thresholds has sufficient permissions
- Set the thresholds to a value lower than the total weight of associated keys 

We offer some additional examples of account management in the next section.

:::tip

To make a transfer using your multisig account, see [Transferring Tokens using a Multisig Account](../../../workflow/deploy-transfer.md).

:::

