import useBaseUrl from '@docusaurus/useBaseUrl';

# Transferring Tokens using a Multi-Sig Deploy

This page presents a method of transferring tokens via a deploy file using multiple signatures. This method is recommended when implementing multi-signature transfers between purses on a Casper network.

The `make-transfer` command allows you to create a transfer and save the output to a file. You can then have the transfer signed by other parties using the `sign-deploy` command and send it to the network for execution using the `send-deploy` command.

## Prerequisites

You must ensure the following prerequisites are met.

1. Set up all the prerequisites listed [here](../../prerequisites.md), including:
    - A funded [Account](../../prerequisites.md#setting-up-an-account) on Testnet or Mainnet
    - A valid _node address_ from the [Testnet peers](https://testnet.cspr.live/tools/peers) or [Mainnet peers](https://cspr.live/tools/peers)
    - The Casper [command-line client](../../prerequisites.md#the-casper-command-line-client)
2. Set up the source account for multi-signature deploys, as outlined in the [Two-Party Multi-Signature Deploys](../../../resources/advanced/two-party-multi-sig.md) workflow
3. Get the path of the source account's _secret key_ file
4. Get the target account's _public key_ in hex format

## Token Transfer Workflow {#token-transfer-workflow}

The high-level flow to transfer tokens using the Casper CLI client and a deploy file is described in the following steps:

1. The `make-transfer` command creates and signs a transfer, saving the output to a file
2. The `sign-deploy` command adds additional signatures for a multi-signature transfer
3. The `send-deploy` command sends the deploy containing the transfer to the network

<img src={useBaseUrl("/image/deploy-flow.png")} alt="Deployment flow" style={{backgroundColor:"#e6e6e6", padding:"0.25em"}} />

### Creating the transfer {#creating-the-transfer}

This section explains the `make-transfer` command using an example you can try on the Testnet. For this example, we are transferring 2,500,000,000 motes from the source account (with the `secret_key.pem` file) to a target account. To use this example on the Mainnet, the _chain-name_ would be `casper` instead of `casper-test`. Note that we are saving the output of the `make-transfer` command in a `transfer.deploy` file.

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key [PATH]/secret_key.pem \
--chain-name casper-test \
--target-account [PUBLIC_KEY_HEX] \
--transfer-id [ID] \
--payment-amount 100000000 \
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
| payment-amount | The payment for the transfer in motes. The payment amount varies based on the deploy and network [chainspec](../../../concepts/glossary/C.md#chainspec). For Testnet node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml), wasmless transfers cost 10^8 motes |

In the output, you will see a section named **approvals**. This is where a signature from the source account is added to the deploy.

**Example:**

```bash
casper-client make-transfer --amount 2500000000 \
--secret-key ~/KEYS/multi-sig/keys/default_secret_key.pem \
--chain-name casper-test \
--target-account 0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf \
--transfer-id 1 \
--payment-amount 100000000 \
--output transfer.deploy
```

<details>
<summary>Sample output of the make-transfer command</summary>

```json
{
  "hash": "88c49fa9108485397a330f294914a6c2d614c581fbe0a31de1a954baad6d709b",
  "header": {
    "account": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
    "timestamp": "2023-10-12T19:14:22.080Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "1bb7436d4703816b5cbeef245dd83c0520f1c7173cdf609c664a29487cc5de1c",
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
            "bytes": "0400f90295",
            "parsed": "2500000000"
          }
        ],
        [
          "target",
          {
            "cl_type": "PublicKey",
            "bytes": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
            "parsed": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf"
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
      "signer": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
      "signature": "015e0db50b174f3627e0e27cb503f0836b30bd0e0f2c4b989366b0df57500a1cb2b0945408c938bc3c33c40dab59a9c6af6f4e01e474330cd27262bfc87680030e"
    }
  ]
}
```

</details>

### Signing the transfer {#signing-the-transfer}

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

**Example:**

```bash
casper-client sign-deploy \
--input transfer.deploy \
--secret-key ~/KEYS/multi-sig/keys/user_1_secret_key.pem \
--output transfer2.deploy
```

Towards the end of the following output, you can observe that there is an **approvals** section, which has two signatures, one from the account initiating the transfer and the second from the account used to sign the deploy.

<details>
<summary>Sample output saved in the transfer2.deploy file</summary>

```json
{
  "hash": "88c49fa9108485397a330f294914a6c2d614c581fbe0a31de1a954baad6d709b",
  "header": {
    "account": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
    "timestamp": "2023-10-12T19:14:22.080Z",
    "ttl": "30m",
    "gas_price": 1,
    "body_hash": "1bb7436d4703816b5cbeef245dd83c0520f1c7173cdf609c664a29487cc5de1c",
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
            "bytes": "0400f90295",
            "parsed": "2500000000"
          }
        ],
        [
          "target",
          {
            "cl_type": "PublicKey",
            "bytes": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
            "parsed": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf"
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
      "signer": "01360af61b50cdcb7b92cffe2c99315d413d34ef77fadee0c105cc4f1d4120f986",
      "signature": "015e0db50b174f3627e0e27cb503f0836b30bd0e0f2c4b989366b0df57500a1cb2b0945408c938bc3c33c40dab59a9c6af6f4e01e474330cd27262bfc87680030e"
    },
    {
      "signer": "01e3d3392c2e0b943abe709b25de5c353e5e1e9d95c7a76e3dd343d8aa1aa08d51",
      "signature": "017793ad52d27393b1aa8ff5bb9bdbcb48708910d6cdabd9a89b44690ca174edf8924aad340bf901ac343391cb4cba7cf4db07390372f28ecf471fd522e0b63803"
    }
  ]
}
```

</details>

### Sending the deploy {#sending-the-deploy}

The next step is to send the deploy for processing on the network. As described in the [Prerequisites](#prerequisites) section, you need to get an active node address from the corresponding network to complete this task. The following example uses the node `https://rpc.testnet.casperlabs.io/` from the Testnet.

```bash
casper-client send-deploy \
--input transfer2.deploy \
--node-address https://rpc.testnet.casperlabs.io/ 
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
  "jsonrpc": "2.0",
  "id": -818883417884028030,
  "result": {
    "api_version": "1.5.3",
    "deploy_hash": "88c49fa9108485397a330f294914a6c2d614c581fbe0a31de1a954baad6d709b"
  }
}
```

</details>

:::note

If you encounter an account authorization error, you **must set up the source account to allow multi-signature deploys** using session code. The [Two-Party Multi-Signature Deploys](../../../resources/advanced/two-party-multi-sig.md) workflow is an example of how to accomplish this.

:::

<details>
<summary>Example of an account authorization error</summary>

```json
{
  "code": -32008,
  "message": "deploy parameter failure: account authorization invalid at prestate_hash: 5f0392de8ac3512a48a110acfc5bc10d4a6a07109b350ae14cbec0428656c8ac"
}
```

</details>


###  Verifying the transfer {#verifying-the-transfer}

To verify the transfer status, see [Verifying a Transfer](./verify-transfer.md).

:::tip 

You can also verify if the transfer was successful by checking your account balance using a [block explorer](../../../users/block-explorer.md). 

:::
