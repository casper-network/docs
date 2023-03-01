# Transactional JSON-RPC Method {#transactional}

---

## account_put_deploy {#account-put-deploy}

This is the only means by which users can send their compiled Wasm (as part of a Deploy) to a node on a Casper network. The request takes in the [Deploy](../../concepts/design/casper-design.md#execution-semantics-deploys) as a parameter, prior to sending it to a node on a network for execution.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](./types_chain.md#deploy)|Object|A Deploy consists of an item containing a smart contract along with the requester's signature(s).|

> **Note**: You can find a list of [trusted peers](../../operators/setup/joining.md#known-addresses) in the network's configuration file, `config.toml`. Here is an [example config.toml](https://github.com/casper-network/casper-node/blob/dev/resources/production/config-example.toml#L131). You may send deploys to one of the trusted nodes or use them to query other online nodes.

### `account_put_deploy_result`

The result contains the [deploy_hash](./types_chain.md#deployhash), which is the primary identifier of a Deploy within a Casper network.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[deploy_hash](./types_chain.md#deployhash)|String| A hex-encoded hash of the Deploy as sent.|

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

## speculative_exec {#speculative_exec}

The `speculative_exec` endpoint provides a method to execute a `Deploy` without committing its execution effects to global state. By default, `speculative_exec` is disabled on a node. Sending a request to a node with the endpoint disabled will result in an error message. If enabled, `speculative_exec` operates on a separate port from the primary JSON-RPC, using 7778.

`speculative_exec` executes a Deploy at a specified block. In the case of this endpoint, the execution effects are not committed to global state. As such, it can be used for observing the execution effects of a Deploy without paying for the execution of the Deploy.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](../../sdkspec/types_chain.md#blockidentifier)|Object|The block hash or height on top of which to execute the deploy. If not supplied,the most recent block will be used.|
|[deploy](../../sdkspec/types_chain.md#deploy)|Object|A Deploy consists of an item containing a smart contract along with the requester's signature(s).|

### `speculative_exec_result`

The result contains the hash of the targeted block and the results of the execution.

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[block_hash](../../sdkspec/types_chain.md#blockhash)|Object|The Block hash on top of which the deploy was executed.|
|[execution_results](../../sdkspec/types_chain.md#executionresult)|Object|The map of Block hash to execution result.|