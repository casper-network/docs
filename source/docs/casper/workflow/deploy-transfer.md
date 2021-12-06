import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens using a Multi-sig Deploy

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

<img src={useBaseUrl("/image/workflow/deploy-flow.png")} width="600" />

### Preparing the Transfer

This section explains the `make-transfer` command using an example you can try on the Testnet. For this example, we are transferring 2500000000 motes from the source account with the secret_key.pem stored in keys1 folder to a target account.

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key keys1/secret_key.pem \
--chain-name casper-test \
--target-account [PRIMARY KEY HEX] \
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
  "hash": "2bf18a14c652b2c12668df3c58d4cbb54930b372f25119f620694fa319b7db3e",
  "header": {
    "account": "013ad94f8932e3d14a715225a4088971c9d551a3d1281cdd5f726063762d932b0e",
    "timestamp": "2021-11-25T14:30:00.210Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "77a86730a7defd16d30361ef67204dbb302dfd905a98fc094425ac97645978fd",
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
            "bytes": "3039c4b9b7379cedbd666f3a6e08012da0608707cc33c380119485c22e8280f1",
            "parsed": "3039c4b9b7379cedbd666f3a6e08012da0608707cc33c380119485c22e8280f1"
          }
        ],
        [
          "id",
          {
            "cl_type": {
              "Option": "U64"
            },
            "bytes": "010100000000000000",
            "parsed": 1
          }
        ]
      ]
    }
  },
  "approvals": [
    {
      "signer": "013ad94f8932e3d14a715225a4088971c9d551a3d1281cdd5f726063762d932b0e",
      "signature": "016b185d5b424f36c0a0d995067a25fb50a7efef73a23ba070c55a66911ddc9b1e1b2c8964b5253368ca4992b8d856c84844036bc74de344ba23834043714a110a"
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
--target-account [PRIMARY KEY HEX] \
--transfer-id 3 \
--payment-amount 10000 > transfer.deploy
```

### Signing the Deploy

Once the deploy file is created, you can sign the deploy using the other designated accounts. For this example, we are signing the deploy with the secret_key.pem stored in keys2 folder and saving the output in a transfer2.deploy file.

```bash
casper-client sign-deploy \
--input transfer.deploy \
--secret-key keys2/secret_key.pem \
--output transfer2.deploy
```

| Parameter    | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| input        | The path of the deploy file, which needs to be signed                |
| secret-key   | The path of the secret key file used to sign the deploy              |
| output       | The path of the output file used to the save the deploy with multiple signatures |

You can observe towards the end of the following output there is an **approvals** section, which has two signatures, one from the account initiating the transfer and second from the account used to sign the deploy.

<details>
<summary>Sample output saved in the transfer2.deploy file</summary>

```json
{
  "hash": "6c584812f844e56b6a133e205a03e1eef039e78f93b9dca1f429301f3e17806b",
  "header": {
    "account": "013ad94f8732e3d14a715225a4088971c9d551a3d1281cdd5f726063762d932b0e",
    "timestamp": "2021-11-25T14:30:26.592Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "77a86730a7defd16d30361ef67204dbb302dfd905a98fc094425ac97645978fd",
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
            "bytes": "3039c4b9b7379cedbd666f3a6e08012da0608707cc33c380119485c22e8280f1",
            "parsed": "3039c4b9b7379cedbd666f3a6e08012da0608707cc33c380119485c22e8280f1"
          }
        ],
        [
          "id",
          {
            "cl_type": {
              "Option": "U64"
            },
            "bytes": "010100000000000000",
            "parsed": 1
          }
        ]
      ]
    }
  },
  "approvals": [
    {
      "signer": "013ad94f8732e3d14a715225a4088971c9d551a3d1281cdd5f726063762d932b0e",
      "signature": "0102680af44588d79d30c3403edd22a715fd988fea00fd1bafbb1e67cc48c07752645861df440d74f7a6a19949019b63f776d7d00b2867db3f1b4a6ffb5551870d"
    },
    {
      "signer": "019a33f123ae936ccd29d8fa5438f03a86b6e34fe4346219e571d5ac42cbff5be6",
      "signature": "01553d9c8ffb1b499b6ca7c79a9c1a0f8044030aadec4228c4f18a971c57632e001b3c94051af9667c99bc369f71afde4042ff5857cb965048c40230d53571ad0a"
    }
  ]
}
```

</details>

### Sending the Deploy

The next step is to send the deploy for execution on the network. As described in the [Prerequisites](deploy-transfer#prerequisites) section, you need to get an active node address from the corresponding network to complete this task. The following example uses the node http://80.92.204.108 from the Testnet, replace this with an active node before using the command. Port `7777` is the RPC endpoint for interacting with the Casper client.

```bash
casper-client send-deploy --input transfer2.deploy --node-address http://80.92.204.108:7777
```

| Parameter    | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| input        | The path of the deploy file, which is used as the input              |
| node-address | The Hostname or IP and port of node on which HTTP service is running |

Make a note of the *deploy_hash* from the send-deploy command output. This will be required to verify the status of the deploy.

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

To verify the status of your transfer, see [Verifying a Transfer](verify-transfer.md).

:::tip 

You can also verify if the transfer was successful by logging on to the https://cspr.live/ website and checking your account balance. 

:::
