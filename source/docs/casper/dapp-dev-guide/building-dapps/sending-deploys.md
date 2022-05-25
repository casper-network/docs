# Sending Deploys to the Network

Ultimately, smart contracts are meant to run on the blockchain. You can send your contract to the network via a [deploy](/design/execution-semantics#execution-semantics-deploys). To do this, you will need to meet a few prerequisites:

- You will need a client to interact with the network, such as the [default Casper client](/workflow/setup#the-casper-command-line-client)
- Ensure you have an [Account](/workflow/setup#setting-up-an-account) and its associated [keys](/dapp-dev-guide/keys.md) This account will pay for the deploy, and its secret key will sign the deploy
- Ensure this account has enough CSPR tokens to pay for the deploy

## Paying for Deploys {#paying-for-deploys}

CSPR tokens are used to pay for transactions on the Casper Network. There are several ways to fund your account:

- You may want to [transfer tokens from an exchange](/workflow/staking/#51-transfer-cspr-from-an-exchange)
- You can use a [block explorer to transfer tokens](/workflow/token-transfer/) between accounts
- You can also [transfer tokens using the default Casper client](/workflow/transfers/)
- On the Testnet, you can use the [faucet functionality](/workflow/testnet-faucet/) for testing your smart contracts

## Monitoring the Event Stream for Deploys

If you want to follow the [lifecycle](/design/execution-semantics.md/#execution-semantics-phases) of the deploy, you can start monitoring a node's event stream. This section will focus only on DeployAccepted events, but there are other event types described [here](dapp-dev-guide/building-dapps/monitoring-events). You need the following information to proceed:

- The IP address of a [peer](/workflow/setup/#acquire-node-address-from-network-peers) on the network
- The port specified as the `event_stream_server.address` in the node's *config.toml*, which is by default 9999 on Mainnet and Testnet
- The URL for DeployAccepted events, which is <HOST:PORT>/events/deploys

With the following command, you can start watching the event stream for DeployAccepted events. Note the event ID recorded when you send your deploy in the next section.

```bash
curl -s http://65.21.235.219:9999/events/deploys
```

## Sending a Deploy to the Network {#sending-the-deploy}

You can call the Casper client's `put-deploy` command to put the compiled contract on the chain. In this example, the deploy will execute in the account's context. See the [advanced features](#advanced-features) section for key delegation.

```bash
casper-client put-deploy \
    --node-address <HOST:PORT> \
    --chain-name casper-test \
    --secret-key <PATH> \
    --payment-amount <PAYMENT-AMOUNT> \
    --session-path <SESSION-PATH>
```

1. `node-address` - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777. You can find a list of trusted peers in network's configuration file, `config.toml`. Here is an [example](https://github.com/casper-network/casper-node/blob/dev/resources/production/config-example.toml#L131). You may send deploys to one of the trusted nodes or use them to query other online nodes.
2. `secret-key` - The file name containing the secret key of the account paying for the deploy
3. `chain-name` - The chain-name to the network where you wish to send the deploy. For Mainnet, use *casper*. For Testnet, use *casper-test*. As you can see, this example uses the Testnet
4. `payment-amount` - The payment for the deploy in motes. This example uses 2.5 CSPR, but you need to modify this for your contract. See the [note](#a-note-about-gas-price) below
5. `session-path` - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer

Once you call this command, it will return a deploy hash, which you will need to verify that the deploy was accepted by the node. Sending a deploy to the network does not mean that the transaction was processed successfully. Once the network has received the deploy and done some preliminary validation of it, it will queue up in the system before being proposed in a block for execution. Therefore, you will need to check to see that the contract was executed as expected.

**Note**: Each deploy gets a unique hash, which is part of the cryptographic security of blockchain technology. No two deploys will ever return the same hash.

<details>
<summary>Sample put-deploy result</summary>

```json
{
  "id": -6958186952964949950,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "deploy_hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496"
  }
}
```

</details>

Verify the deploy details with the `get-deploy` command and the deploy_hash received above.

```bash
casper-client get-deploy \
    --node-address <HOST:PORT> <DEPLOY-HASH>
```

If the deploy succeeded, the `get-deploy` command would return a JSON object with the full details of the deploy.

<details>
<summary>Sample get-deploy result</summary>

```json
{
  "id": -3532286620275982221,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.5",
    "deploy": {
      "approvals": [
        {
          "signature": "015a7b0178e144fbf5ce52147c44a3e6bd6aae898ec6bb47c97b5802f3bcb6cd26331f7db18464cd1e51764c14ceb24b7ab9c4e3595505c32465fc0702e8d5510b",
          "signer": "01e76e0279a08b96d9d68e6b86c618de24a0c324d7d0c1fa8c035f0bc2af1a396d"
        }
      ],
      "hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",
      "header": {
        "account": "01e76e0279a08b96d9d68e6b86c618de24a0c324d7d0c1fa8c035f0bc2af1a396d",
        "body_hash": "b1956600be3c11d7555ada11426ab1a8bdf36102f59838d6bf69cec321111a22",
        "chain_name": "casper-test",
        "dependencies": [],
        "gas_price": 1,
        "timestamp": "2022-03-24T12:05:57.579Z",
        "ttl": "30m"
      },
      "payment": {
        "ModuleBytes": {
          "args": [
            [
              "amount",
              {
                "bytes": "05000c774203",
                "cl_type": "U512",
                "parsed": "14000000000"
              }
            ]
          ],
          "module_bytes": ""
        }
      },
      "session": {
        "ModuleBytes": {
          "args": [],
          "module_bytes": "[94478 hex chars]"
        }
      }
    },
    "execution_results": [
      {
        "block_hash": "098b618878a2413393925e1fbf6d3cf92f1208f4f8662a904e86b49b0c4ab9f0",
        "result": {
          "Success": {
            "cost": "13327900740",
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
                  "key": "balance-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "0500279bd1ca",
                      "cl_type": "U512",
                      "parsed": "871100000000"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "14000000000"
                  }
                },
                {
                  "key": "uref-82a7b5713f2b9b3f9e1b4f2d1f312a5fec7c3a0bed6fa897501913951729dbbf-000",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "00000000",
                      "cl_type": "I32",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "uref-ea022d75ff618533baf46040cc57692fb7f7840774c979c9dec0b5c3ddcec7e9-000",
                  "transform": {
                    "WriteCLValue": {
                      "bytes": "",
                      "cl_type": "Unit",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",
                  "transform": "Identity"
                },
                {
                  "key": "hash-3b69bafcc13b4541dddd7d5492e4754feee41c636990aeb6bf78d58fdd39fc43",
                  "transform": "WriteContractWasm"
                },
                {
                  "key": "hash-c39dd923df84c637e46e46a8a3326fcf85e43c60814878f44a08efd0074cb523",
                  "transform": "WriteContract"
                },
                {
                  "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "account-hash-f407926760b91c2ce3af8bda7448841b3aa68c6e98053331d10819ef2d0a808e",
                  "transform": {
                    "AddKeys": [
                      {
                        "key": "hash-c39dd923df84c637e46e46a8a3326fcf85e43c60814878f44a08efd0074cb523",
                        "name": "counter"
                      }
                    ]
                  }
                },
                {
                  "key": "deploy-34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",
                      "from": "account-hash-f407926760b91c2ce3af8bda7448841b3aa68c6e98053331d10819ef2d0a808e",
                      "gas": "13327900740",
                      "source": "uref-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474-007",
                      "transfers": []
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
                  "key": "balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453",
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
                  "key": "balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453",
                  "transform": {
                    "AddUInt512": "14000000000"
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

```

</details>

We want to draw your attention to a few properties in the example output:

- Execution cost 13327900740 motes, yet we paid 14000000000 motes. See the [note about gas price](#a-note-about-gas-price)
- The contract returned no errors. If you see an "Out of gas error", you did not specify a high enough value in the `--payment-amount` arg
- The time-to-live was 30 minutes

It is also possible to get a summary of the deploy's information by performing a `query-global-state` command using the Casper client and providing a state root hash or a block hash from a block at or after the one in which the deploy was executed.

```bash
casper-client get-state-root-hash --node-address <HOST:PORT>

casper-client query-global-state --node-address <HOST:PORT> \
    --key deploy-<DEPLOY-HASH-HEX-STRING> \
    --state-root-hash <STATE-ROOT-HASH-HEX-STRING>
```

```bash
casper-client query-global-state --node-address <HOST:PORT> \
    --key deploy-<DEPLOY-HASH-HEX STRING>
    --block-hash <BLOCK-HASH-HEX-STRING>
```

Run the help command for `query-global-state` to see its usage.

```bash
casper-client query-global-state --help
```

### Deploy Payments {#deploy-payments}

Dependent upon the complexity and needs of the deployment in question, several options exist to allow users to pay for smart contract execution.

The simplest way to pay for a deploy on the Casper blockchain is to use the host side standard payment functionality. This can be done using an **empty** `ModuleBytes` as your payment code. However, you must specify the amount within a runtime argument. `ModuleBytes` can also serve as a custom payment contract if it is not empty, but any additional Wasm ran within will come at an additional cost on top of the payment.

You may find the host side functionality of standard payment insufficient for your purposes. In this event, Casper provides the following options for custom payment code:

•	`StoredContractByHash`

•	`StoredContractByName`

•	`StoredVersionContractByHash`

•	`StoredVersionContractByName`

## Using arguments with deploys {#using-arguments-with-deploys}

The session Wasm (or payment Wasm if you choose to _not_ use the standard payment) of a deploy often requires arguments to be passed to it when executed. These "runtime args" should be provided by using the `--session-arg` or `--payment-arg` options, once for each arg required. The Casper client provides some examples of how to do this:

```bash
casper-client put-deploy --show-arg-examples
```

## Advanced Features {#advanced-features}

The Casper Network supports complex deploys using multiple signatures. [Casper Accounts](/design/accounts.md) use a powerful permissions model that enables a multi-signature scheme for deploys.

The `put-deploy` command performs multiple actions under the hood, optimizing the typical use case. It creates a deploy, signs it, and deploys to the network without allowing multiple signatures. However, it is possible to call the following three commands and separate key management from account creation:

- `make-deploy` - Creates a deploy and outputs it to a file or stdout. As a file, the deploy can subsequently be signed by other parties using the `sign-deploy` subcommand and then sent to the network for execution using the `send-deploy` subcommand
- `sign-deploy` - Reads a previously-saved deploy from a file, cryptographically signs it, and outputs it to a file or stdout
- `send-deploy` - Reads a previously-saved deploy from a file and sends it to the network for execution

To sign a deploy with multiple keys, create the deploy with the `make-deploy` command. The generated deploy file can be sent to the other signers, who then sign it with their keys by calling the `sign-deploy` for each key. Signatures need to be gathered on the deploy one after another until all required parties have signed the deploy. Finally, the signed deploy is sent to the network with the `send-deploy` command for processing.

For a step-by-step workflow, visit the [Two-Party Multi-Signature Deploy](/workflow/two-party-multi-sig/) guide. This workflow describes how a trivial two-party multi-signature scheme for signing and sending deploys can be enforced for an account on a Casper Network.

## A Note about Gas Price {#a-note-about-gas-price}

A common question frequently arises: "How do I know what the payment amount (gas cost) should be?" 

We recommend installing your contracts in a test environment, making sure the cost tables match those of the production Casper Network to which you want to send the deploy. If you plan on sending a deploy to [Mainnet](https://cspr.live/), you can use the [Testnet](https://testnet.cspr.live/) to estimate the payment amount needed for the deploy.

If your test configuration matches your production chainspec, you can check the deploy status and roughly see how much it would cost. You can estimate the costs in this way and then add a small buffer to be sure. Refer to the [runtime economics](/economics/runtime.md#gas-allocation) section for more details about gas usage and fees.