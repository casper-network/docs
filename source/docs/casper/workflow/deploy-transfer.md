import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens using a Deploy File

This topic explores the use of a deploy file to transfer Casper tokens (CSPR) between accounts on the Casper Network. This method of transferring tokens is useful when you want to implement multi-signature deploys. To understand more about multi-signature deploys, see [Two-Party Multi-Signature Deploys](two-party-multi-sig.md). The `make-transfer` command allows you to create a transfer deploy and save the output to a file. You can then have the deploy signed by other parties using the `sign-deploy` command and send it to the network for execution using the `send-deploy` command.

## Prerequisites

You must ensure the following prerequisites are met, before you start using the deploy commands:

1.  Set up your machine as per the [prerequisites](setup.md)
2.  Set up accounts on the [Testnet](https://testnet.cspr.live/) or [Mainnet](https://cspr.live/)
3.  Fund the source account
4.  Get the source _secret key_ file path and the target _public key_ hex
5.  Get a valid _node address_ from the [Testnet peers](https://testnet.cspr.live/tools/peers) or [Mainnet peers](https://cspr.live/tools/peers)
6.  Use the Casper [command-line client](/workflow/setup#the-casper-command-line-client)

## Token Transfer Workflow

The high-level flow to transfer tokens using a deploy file is described in the following steps:

1. Use the `make-deploy` command to prepare a transfer
2. Save the output of the `make-deploy` command in a deploy file
3. Use the `send-deploy` command to send the deploy to the network through a valid node

<img src={useBaseUrl("/image/workflow/deploy-flow.png")} width="500" />

### Preparing the Transfer

This section explains the `make-transfer` command using an example you can try on the Testnet. For this example, we are transferring 2500000000 motes from the source account with the secret_key.pem stored in keys1 folder to a target account.

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key keys1/secret_key.pem \
--chain-name casper-test \
--target-account 019a33f123ae936ccd29d8fa5438f03a86b6e34fe4346219e571d5ac42cbff5be6 \
--transfer-id 3 \
--payment-amount 10000
```

:::note

To use this example on the Mainnet, replace _chain-name_ as casper instead of casper-test.

:::

| Parameter | Description |
| --- | --- |
| amount | The number of motes you wish to transfer (1 CSPR = 1,000,000,000 motes) |
| secret-key | The path of the secret key file for the source account |
| chain-name | The name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain <ul><li>For Testnet it's **casper-test**</li><li>For Mainnet it's **casper**</li></ul> |
| target-account | Hex-encoded public key of the account from which the main purse will be used as the target |
| transfer-id | A user-defined identifier, permanently associated with the transfer |
| payment-amount | The amount used to pay for executing the code on the network |

### Saving the Output

<details>
<summary>Sample output of the make-transfer command</summary>

```json
{
    "hash": "34c4adbaa5493d9485637396a1a500657765ca35845bf15527be3149e5beb008",
    "header": {
        "account": "01e07110e92f554014ffdecc2582c999fcac7a9fbfad3ed7d8ae1cb14681f18a7b",
        "timestamp": "2021-10-27T11:16:59.592Z",
        "ttl": "30m",
        "gas_price": 1,
        "body_hash": "5f3f6f7ba595b95084173dc4f1052198ed9993847337c9d8a091226798d2f42a",
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
                        "bytes": "021027",
                        "parsed": "10000"
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
                        "cl_type": {
                            "ByteArray": 32
                        },
                        "bytes": "9c4dca7bcd384a081b7d014a6593bb27007a38d922d2693fa7999abd736d09b8",
                        "parsed": "9c4dca7bcd384a081b7d014a6999bb27007a38d922d2693fa7800abd736d09b8"
                    }
                ],
                [
                    "id",
                    {
                        "cl_type": {
                            "Option": "U64"
                        },
                        "bytes": "010300000000000000",
                        "parsed": 3
                    }
                ]
            ]
        }
    },
    "approvals": [
        {
            "signer": "01e07110e92f554014ffdecc2582c999fcac7a9fbfad3ed7d8ae1cb14681f18a7b",
            "signature": "01a2f5ce9f83898145e9db7c48d2da7b3af67e26759aeaab98f4ee244546ba132931e22aca83366a7aebf9b8e3fd5b8a8f4d73af21824d0b4906"
        }
    ]
}
```

</details>

In the above example, you can view a section named **approvals**. This is where a signature of the source account is added to the deploy.

Save this output in a _transfer.deploy_ file as shown in the following command.

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key keys1/secret_key.pem \
--chain-name casper-test \
--target-account 019a33f123ae936ccd29d8fa5438f03a86b6e34fe4346219e571d5ac42cbff5be6 \
--transfer-id 3 \
--payment-amount 10000 > transfer.deploy
```

### Sending the Deploy

The next step is to send the deploy for execution on the network. As described in the [Prerequisites](deploy-transfer#prerequisites) section, you need to get an active node address from the corresponding network to complete this task. The following example uses the node http://80.92.204.108 from the Testnet, replace this with an active node before using the command. Port `7777` is the RPC endpoint for interacting with the Casper client.

```bash
casper-client send-deploy --input transfer.deploy --node-address http://80.92.204.108:7777
```

| Parameter    | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| input        | The path of the deploy file, which is used as the input              |
| node-address | The Hostname or IP and port of node on which HTTP service is running |

<details>
<summary>Sample output of the send-deploy command</summary>

```json
{
    "id": 261147078494867680,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.3.4",
        "deploy_hash": "87912f9ea859159dcf2f0554751ba0bce8b1df41f4b4339bc6de370d7734bdae"
    }
}
```

</details>

## Verifying the Transfer

The following steps can help you verify if the transfer was successful using the command-line:

1. [Query the deploy](querying#querying-deploys) to find out the status of execution
2. [Get the state root hash of the deploy](transfer-workflow#state-root-hash)
3. [Query the source account](transfer-workflow#query-the-source-account) to find the main purse `Uref` address of the source account
4. [Query the target account](transfer-workflow#query-the-target-account) to find the main purse `Uref` address of the target account
5. [Get the source account balance](transfer-workflow#get-source-account-balance) to check if the amount was deducted from the CSPR balance
6. [Get the target account balance](transfer-workflow#get-target-account-balance) to confirm that the amount was credited

:::tip 

You can also verify if the transfer was successful by logging on to the https://cspr.live/ website and checking your account balance. 

:::
