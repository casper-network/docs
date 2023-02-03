import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens using a Multi-sig Deploy

This topic explores using a deploy file to transfer Casper tokens (CSPR) between purses on a Casper network. This method of transferring tokens is recommended when you want to implement multi-signature deploys. The `make-transfer` command allows you to create a transfer Deploy and save the output to a file. You can then have the Deploy signed by other parties using the `sign-deploy` command and send it to the network for execution using the `send-deploy` command.

## Prerequisites

You must ensure the following prerequisites are met.

1. Set up all the prerequisites listed [here](/dapp-dev-guide/setup.md), including:
    - A funded [Account](/dapp-dev-guide/setup/#setting-up-an-account) on Testnet or Mainnet
    - A valid _node address_ from the [Testnet peers](https://testnet.cspr.live/tools/peers) or [Mainnet peers](https://cspr.live/tools/peers)
    - The Casper [command-line client](/dapp-dev-guide/setup#the-casper-command-line-client)
2. Set up the source account for multi-signature deploys, as outlined in the [Two-Party Multi-Signature Deploys](two-party-multi-sig.md) workflow
3. Get the path of the source account's _secret key_ file
4. Get the path of a target account's _public key_ hex file

## Token Transfer Workflow

The high-level flow to transfer tokens using a deploy file is described in the following steps:

1. Use the `make-deploy` command to prepare a transfer and save the output in a file
2. Use the `send-deploy` command to send the deploy to the network through a valid node

<img src={useBaseUrl("/image/workflow/deploy-flow.png")} width="600" />

### Preparing the Transfer

This section explains the `make-transfer` command using an example you can try on the Testnet. For this example, we are transferring 2500000000 motes from the source account (with the secret_key.pem file) to a target account. To use this example on the Mainnet, the _chain-name_ would be `casper` instead of `casper-test`. Note that we are saving the output of the `make-deploy` command in a `transfer.deploy` file.

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key [PATH]/secret_key.pem \
--chain-name casper-test \
--target-account [PUBLIC_KEY_HEX] \
--transfer-id 3 \
--payment-amount 10000 
--output transfer.deploy
```

The following table explains the parameters used in the `make-transfer` command.

| Parameter | Description |
| --- | --- |
| amount | The number of motes you wish to transfer (1 CSPR = 1,000,000,000 motes) |
| secret-key | The path of the secret key file for the source account |
| chain-name | The name of the chain, to avoid the deploy from being accidentally or maliciously included in a different chain <ul><li>For Testnet use **casper-test**</li><li>For Mainnet use **casper**</li></ul> |
| target-account | Hex-encoded public key of the target account from which the main purse will be used |
| transfer-id | A user-defined identifier permanently associated with the transfer |
| payment-amount | The amount used to pay for executing the code on the network |

In the output, you will see a section named **approvals**. This is where a signature from the source account is added to the Deploy.

<details>
<summary>Sample output of the make-transfer command</summary>

```json
{
  "hash": "0e17da4c7b6d12984910aa25e397fc85db53e5cd896776d47494cb4a5f2083f1",
  "header": {
    "account": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
    "timestamp": "2023-01-05T11:30:05.269Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "5d7d30965d503dba0459d5e6b3a0c923059f89e6a7179f76aec0fda1263b7819",
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
            "cl_type": "PublicKey",
            "bytes": "01f48f5b095518be188286d896921d33e97f9729f5945237d5ff6cf7b077aabf1f",
            "parsed": "01f48f5b095518be188286d896921d33e97f9729f5945237d5ff6cf7b077aabf1f"
          }
        ],
        [
          "id",
          {
            "cl_type": {
              "Option": "U64"
            },
            "bytes": "013930000000000000",
            "parsed": 3
          }
        ]
      ]
    }
  },
  "approvals": [
    {
      "signer": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
      "signature": "016853b69b98434f236ac2eacb053b244f5853f0ec2a1d86b8f8a35601353cebe160f3c57606be9f289da34b7ccd5b7285751d1e6edc9cc76a84c14fb286272702"
    }
  ]
}
```

</details>

### Signing the Deploy using the Casper Client

Once the deploy file is created, you can sign the deploy using other designated accounts. For this example, we are signing the deploy with a second secret key and saving the output in a `transfer2.deploy` file.

```bash
casper-client sign-deploy \
--input transfer.deploy \
--secret-key [PATH]/another_secret_key.pem \
--output transfer2.deploy
```

| Parameter    | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| input        | The path of the deploy file, which needs to be signed                |
| secret-key   | The path of the secret key file used to sign the deploy              |
| output       | The path of the output file used to save the deploy with multiple signatures |

Towards the end of the following output, you can observe that there is an **approvals** section, which has two signatures, one from the account initiating the transfer and the second from the account used to sign the deploy.

<details>
<summary>Sample output saved in the transfer2.deploy file</summary>

```json
{
  "hash": "959ba7154a58bf3a9ec555b38fb2c96dba81523b49f9a086630d0cf44d74cacc",
  "header": {
    "account": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
    "timestamp": "2023-01-05T11:42:23.311Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "5d7d30965d503dba0459d5e6b3a0c923059f89e6a7179f76aec0fda1263b7819",
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
            "cl_type": "PublicKey",
            "bytes": "01f48f5b095518be188286d896921d33e97f9729f5945237d5ff6cf7b077aabf1f",
            "parsed": "01f48f5b095518be188286d896921d33e97f9729f5945237d5ff6cf7b077aabf1f"
          }
        ],
        [
          "id",
          {
            "cl_type": {
              "Option": "U64"
            },
            "bytes": "013930000000000000",
            "parsed": 3
          }
        ]
      ]
    }
  },
  "approvals": [
    {
      "signer": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
      "signature": "014c2dc520a1d7f2b7cc18fe704899dd158c02448a4c575bc5214bad3384cb4fff6e32ece196768a8d21b5644c96850fea8b980bd2f6c1fe3c717c1c45a6b75508"
    },
    {
      "signer": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
      "signature": "0107b684e395879fed81d8387b0b4422301c1e4fcbd76672cf3fb7ab2ea8a2ef1429622a999fbbb56bcb79d871bfaeeb107415d67c78a57e8f67987e7f4368980c"
    }
  ]
}
```

</details>

### Sending the Deploy

The next step is to send the deploy for processing on the network. As described in the [Prerequisites](#prerequisites) section, you need to get an active node address from the corresponding network to complete this task. The following example uses the node http://80.92.204.108 from the Testnet; replace this with an active node before using the command. Port `7777` is the RPC endpoint for interacting with the Casper client.

```bash
casper-client send-deploy --input transfer2.deploy --node-address http://65.21.235.219:7777
```

| Parameter    | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| input        | The path of the deploy file, which is used as the input              |
| node-address | The Hostname or IP and port of the node                              |

Make a note of the *deploy_hash* from the `send-deploy` command output to verify the status of the deploy.

<details>
<summary>Successful output of the send-deploy command</summary>

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

If you get an account authorization error, you must set up the source account to allow multi-signature deploys using session code. The [Two-Party Multi-Signature Deploys](two-party-multi-sig.md) workflow is an example of how to accomplish this.

<details>
<summary>Example of an account authorization error</summary>

```json
{
  "code": -32008,
  "message": "deploy parameter failure: account authorization invalid at prestate_hash: 5f0392de8ac3512a48a110acfc5bc10d4a6a07109b350ae14cbec0428656c8ac"
}
```

</details>


## Verifying the Transfer

To verify the transfer status, see [Verifying a Transfer](verify-transfer.md).

:::tip 

You can also verify if the transfer was successful by checking your account balance using a [block explorer](block-explorer.md). 

:::
