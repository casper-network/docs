# Transactional JSON-RPC Methods {#transactional}

---

## account_put_deploy {#account-put-deploy}

This is the only means by which users can send their compiled Wasm (as part of a Deploy) to a node on a Casper network. The request takes in the [Deploy](../../concepts/design/casper-design.md/#execution-semantics-deploys) as a parameter, prior to sending it to a node on a network for execution.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](./types_chain.md#deploy)|Object|A Deploy consists of an item containing a smart contract along with the requester's signature(s).|

> **Note**: You can find a list of [trusted peers](../../operators/setup/joining.md/#known-addresses) in the network's configuration file, `config.toml`. Here is an [example config.toml](https://github.com/casper-network/casper-node/blob/dev/resources/production/config-example.toml#L131). You may send deploys to one of the trusted nodes or use them to query other online nodes.

<details>

<summary>Example account_put_deploy request</summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "account_put_deploy",
  "params": [
    {
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
    }
  ]
}

```

</details>

### `account_put_deploy_result`

The result contains the [deploy_hash](./types_chain.md#deployhash), which is the primary identifier of a Deploy within a Casper network.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[deploy_hash](./types_chain.md#deployhash)|String| A hex-encoded hash of the Deploy as sent.|

<details>

<summary>Example account_put_deploy result</summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "deploy_hash": "5c9b3b099c1378aa8e4a5f07f59ff1fcdc69a83179427c7e67ae0377d94d93fa"
  }
}

```

</details>

## speculative_exec {#speculative_exec}

The `speculative_exec` endpoint provides a method to execute a `Deploy` without committing its execution effects to global state. By default, `speculative_exec` is disabled on a node. Sending a request to a node with the endpoint disabled will result in an error message. If enabled, `speculative_exec` operates on a separate port from the primary JSON-RPC, using 7778.

`speculative_exec` executes a Deploy at a specified block. In the case of this endpoint, the execution effects are not committed to global state. As such, it can be used for observing the execution effects of a Deploy without paying for the execution of the Deploy.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](./types_chain.md#blockidentifier)|Object|The block hash or height on top of which to execute the deploy. If not supplied,the most recent block will be used.|
|[deploy](./types_chain.md#deploy)|Object|A Deploy consists of an item containing a smart contract along with the requester's signature(s).|

<details>

<summary>Example speculative_exec request</summary>

```bash

{
  "jsonrpc": "2.0",
  "method": "speculative_exec",
  "params": {
    "block_identifier": null,
    "deploy": {
      "hash": "b6aa46333fb858deee7f259a5bca581251c6200a5d902aeb1244c3a7169b5971",
      "header": {
        "account": "01a2905e4680aa49e0b44100d9dfc861b9605bb35f9956b1e99eb43863363d80aa",
        "timestamp": "2023-05-23T13:32:45.554Z",
        "ttl": "30m",
        "gas_price": 1,
        "body_hash": "74db109805bb20de43ef89a5b084544a858908b236601519d5827cd9b7fbb925",
        "dependencies": [],
        "chain_name": "integration-test"
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
                "bytes": "0400f90295",
                "parsed": "2500000000"
              }
            ],
            [
              "target",
              {
                "cl_type": "PublicKey",
                "bytes": "01265ea737411b349ad3d0fc724c2c588acd2765c057e5c690cd5e3dade401782b",
                "parsed": "01265ea737411b349ad3d0fc724c2c588acd2765c057e5c690cd5e3dade401782b"
              }
            ],
            [
              "id",
              {
                "cl_type": {
                  "Option": "U64"
                },
                "bytes": "010000000000000000",
                "parsed": 0
              }
            ]
          ]
        }
      },
      "approvals": [
        {
          "signer": "01a2905e4680aa49e0b44100d9dfc861b9605bb35f9956b1e99eb43863363d80aa",
          "signature": "01c94d517d5bbc8d5c74e0e68b8cb308561ff979a1c91907b56d427cc90156c437726c0b736d17f7303f2db66e405c7e5c8175b8b863703938eff1659766dff808"
        }
      ]
    }
  },
  "id": 6889533540839698701
}

```

</details>

### `speculative_exec_result`

The result contains the hash of the targeted block and the results of the execution.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[block_hash](./types_chain.md#blockhash)|Object|The Block hash on top of which the deploy was executed.|
|[execution_results](./types_chain.md#executionresult)|Object|The map of Block hash to execution result.|

<details>

<summary>Example speculative_exec result</summary>

```bash

{
  "jsonrpc": "2.0",
  "id": -8801853076373554652,
  "result": {
    "api_version": "1.5.0",
    "block_hash": "ff862326b08702a5089d64e32100537b7ff984cac4c0ba6d1c561f7c47125f76",
    "execution_result": {
      "Success": {
        "effect": {
          "operations": [],
          "transforms": [
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "account-hash-f466e7f5f9240fb577d1d4c650c4063752553406dff7aa24b4822ba2b72e5b65",
              "transform": "Identity"
            },
            {
              "key": "account-hash-f466e7f5f9240fb577d1d4c650c4063752553406dff7aa24b4822ba2b72e5b65",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-0a300922655180354a9ee92b808c7b45b08e5b01d9da0bac9a9b3415bcebbf8d",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-59c6451dd58463708fa0b122e97114f07fa5f609229c9d67ac9426935416fbeb",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": "Identity"
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": {
                "WriteCLValue": {
                  "cl_type": "U512",
                  "bytes": "05f0e630ed87",
                  "parsed": "583799990000"
                }
              }
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": {
                "AddUInt512": "100000000"
              }
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "account-hash-f466e7f5f9240fb577d1d4c650c4063752553406dff7aa24b4822ba2b72e5b65",
              "transform": "Identity"
            },
            {
              "key": "account-hash-f466e7f5f9240fb577d1d4c650c4063752553406dff7aa24b4822ba2b72e5b65",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-0a300922655180354a9ee92b808c7b45b08e5b01d9da0bac9a9b3415bcebbf8d",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-59c6451dd58463708fa0b122e97114f07fa5f609229c9d67ac9426935416fbeb",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": "Identity"
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": {
                "WriteCLValue": {
                  "cl_type": "U512",
                  "bytes": "05f0e630ed87",
                  "parsed": "583799990000"
                }
              }
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": {
                "AddUInt512": "100000000"
              }
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-59c6451dd58463708fa0b122e97114f07fa5f609229c9d67ac9426935416fbeb",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": "Identity"
            },
            {
              "key": "balance-92ec6dfbdf151e20b55c89e0a327959cf6e5b091c5f2b39201c1858e2943f3bd",
              "transform": "Identity"
            },
            {
              "key": "balance-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678",
              "transform": {
                "WriteCLValue": {
                  "cl_type": "U512",
                  "bytes": "05f0ed2d5887",
                  "parsed": "581299990000"
                }
              }
            },
            {
              "key": "balance-92ec6dfbdf151e20b55c89e0a327959cf6e5b091c5f2b39201c1858e2943f3bd",
              "transform": {
                "AddUInt512": "2500000000"
              }
            },
            {
              "key": "transfer-97426c848475dae98446f2c2fd00ec7901cd8ddfe250171ff4ed25d78412a612",
              "transform": {
                "WriteTransfer": {
                  "deploy_hash": "d898910011b1f2f8797a442740e69cd5de41b9f796e658e962a24663e6199e5a",
                  "from": "account-hash-0a9b33af5108c5a6e1067b0ddec6853ce1745d591375d767ac5db680d21845e7",
                  "to": "account-hash-f466e7f5f9240fb577d1d4c650c4063752553406dff7aa24b4822ba2b72e5b65",
                  "source": "uref-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678-007",
                  "target": "uref-92ec6dfbdf151e20b55c89e0a327959cf6e5b091c5f2b39201c1858e2943f3bd-004",
                  "amount": "2500000000",
                  "gas": "0",
                  "id": 0
                }
              }
            },
            {
              "key": "deploy-d898910011b1f2f8797a442740e69cd5de41b9f796e658e962a24663e6199e5a",
              "transform": {
                "WriteDeployInfo": {
                  "deploy_hash": "d898910011b1f2f8797a442740e69cd5de41b9f796e658e962a24663e6199e5a",
                  "transfers": [
                    "transfer-97426c848475dae98446f2c2fd00ec7901cd8ddfe250171ff4ed25d78412a612"
                  ],
                  "from": "account-hash-0a9b33af5108c5a6e1067b0ddec6853ce1745d591375d767ac5db680d21845e7",
                  "source": "uref-7c25ef9382fcae902b922866434f7111a1b34534323e93ff5bf22f1a401c2678-007",
                  "gas": "100000000"
                }
              }
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-0a300922655180354a9ee92b808c7b45b08e5b01d9da0bac9a9b3415bcebbf8d",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": "Identity"
            },
            {
              "key": "hash-d2dfc9409965993f9e186db762b585274dcafe439fa1321cfca08017262c8e46",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "hash-59c6451dd58463708fa0b122e97114f07fa5f609229c9d67ac9426935416fbeb",
              "transform": "Identity"
            },
            {
              "key": "hash-f8df015ba26860a7ec8cab4ee99f079325b0bbb9ef0e7810b63d85df39da95fe",
              "transform": "Identity"
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": "Identity"
            },
            {
              "key": "balance-ecc530e74cf2185936a334aa1e0f07539aa3b33c4b547e71fc4109151755652f",
              "transform": "Identity"
            },
            {
              "key": "balance-ea3c9bdcbe57f067a29609d397981b2d0fb39853a0a9f06e444b06404eadcb1a",
              "transform": {
                "WriteCLValue": {
                  "cl_type": "U512",
                  "bytes": "00",
                  "parsed": "0"
                }
              }
            },
            {
              "key": "balance-ecc530e74cf2185936a334aa1e0f07539aa3b33c4b547e71fc4109151755652f",
              "transform": {
                "AddUInt512": "100000000"
              }
            }
          ]
        },
        "transfers": [
          "transfer-97426c848475dae98446f2c2fd00ec7901cd8ddfe250171ff4ed25d78412a612"
        ],
        "cost": "100000000"
      }
    }
  }
}

```


</details>