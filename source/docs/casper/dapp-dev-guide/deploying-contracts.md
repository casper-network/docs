# Deploying Contracts

Ultimately, smart contracts are meant to run on the blockchain. Once your smart contract is complete, it's time to deploy the contract to the blockchain. There are a few pre-requisites to doing this:

-   A Client that communicates with the network
-   The private key for the account that pays for the deployment
-   Token to pay for the deployment on the network in the account associated with the private key. Each token transfer costs exactly 0.0001 CSPR (10000 motes). Also, the amount transferred needs to be a minimum of 2.5 CSPR.

This section will help you get set up with each prerequisite.

## The Casper Client {#the-casper-client}

You can find the default Casper client on [crates.io](https://crates.io/crates/casper-client). This client communicates with the network to transmit your deployments.

Run the commands below to install the client on most flavors of Linux and macOS. You will need the nightly version of the compiler.

```bash
rustup toolchain install nightly
cargo +nightly-2021-06-17 install casper-client --locked
```

Doing this, you'll see a warning, which you can ignore for now.

```bash
warning: package `aes-soft v0.5.0` in Cargo.lock is yanked in registry `crates.io`, consider running without --locked
```

The Casper client can print out _help_ information, which provides an up-to-date list of supported commands.

```bash
casper-client --help
```

### Building the Client from Source {#building-the-client-from-source}

[Instructions](https://github.com/casper-network/casper-node/tree/master/client)

### Check the Client Version {#check-the-client-version}

There is an official Rust client, that works with the Casper [Testnet](https://testnet.cspr.live/) and [Mainnet](https://cspr.live/).

To check the client version run:

```bash
$ casper-client --version
```

If you want to send your deployments to an external network, use the latest released version of the client. If you are building the client locally, check the gitHash and ensure it matches the githash of the network.

### Token to Pay for Deployments {#token-to-pay-for-deployments}

Blockchains are supported by infrastructure providers called "Validators". To use the Validator infrastructure, it's necessary to acquire token to pay for deployments (transactions). In a testnet, this is possible by using a faucet. Alternatively, accounts can be funded in Genesis, or token can be transferred from a Genesis account to a new account. In a production system, token is typically acquired by visiting an exchange.

### Target Network {#target-network}

When sending a deploy, the client needs to know which host will receive the deployment. The `node-address` and `chain-name` parameters provide this info.

### Creating Keys {#creating-keys}

Blockchains use asymmetric key encryption to secure transactions. The secret key used to sign the deployment will be the secret key of the account that is being used to pay for the transaction. The transaction will execute in this account's context unless key delegation and the `from` parameter is being used. To create keys using the rust client, execute the following command:

```bash
$ casper-client keygen <TARGET DIRECTORY>
```

This process will create 3 files:

-   secret-key.pem
-   public-key.pem
-   public_key_hex

When passing in the public key as hex, it's recommended to `$(cat public_key_hex)` in the transaction, or extract the contents of the file. Use the secret-key.pem file to sign transaction.

## Sending a Deployment to the Testnet {#sending-a-deployment-to-the-testnet}

The easiest way to deploy a contract is to use an existing public network. The Testnet is operated by external validators that can accept transactions.

### Obtain Token {#obtain-token}

To send a deploy to the network, create keys and obtain token. Token can be obtained via a faucet or by a participant that has token. Connect to our [Discord](https://discordapp.com/invite/Q38s3Vh) to get token via an existing participant.

### A Basic Deployment using the Command Line (Rust Client) {#a-basic-deployment-using-the-command-line-rust-client}

As described above, a basic deployment must provide some essential information. Here is an example deployment using the Rust client that will work with the basic contract we created using the [Contracts SDK for Rust](writing-contracts/rust.md). The default port is 7777:

```bash
$ casper-client put-deploy --chain-name <NETWORK_NAME> --node-address http://<HOST:PORT> --secret-key /home/keys/secret_key.pem --session-path /home/casper-node/target/wasm32-unknown-unknown/release/do_nothing.wasm  --payment-amount 10000000
```

If your deployment command is correct, expect to see a success message that looks like this:

```bash
{"api_version":"1.0.0","deploy_hash":"8c3068850354c2788c1664ac6a275ee575c8823676b4308851b7b3e1fe4e3dcc"}
```

Note: Each deploy gets a unique hash. This is part of the cryptographic security of blockchain technology. No two deploys will ever return the same hash.

### Check Deploy Status {#check-deploy-status}

Once the network has received the deployment, it will queue up in the system before being listed in a block for execution. Sending a transaction (deployment) to the network does not mean that the transaction processed successfully. Therefore, it's important to check to see that the contract executed properly, and that the block was finalized.

```bash
$ casper-client get-deploy --chain-name <NETWORK_NAME> --node-address http://<HOST:PORT> <DEPLOY_HASH>
```

Which will return a data structure like this:

```bash
{
  "api_version": "1.0.0",
  "deploy": {
    "approvals": [
      {
        "signature": "01350549b0e0173e8612100dc954dcb021e2c3de2161050d397cba8cad5607b2e234115c0f419aeae8ce6cef1464e54b76c857923c42015277f9dd6ae920842c00",
        "signer": "016af0262f67aa93a225d9d57451023416e62aaa8391be8e1c09b8adbdef9ac19d"
      }
    ],
    "hash": "8c3068850354c2788c1664ac6a275ee575c8823676b4308851b7b3e1fe4e3dcc",
    "header": {
      "account": "016af0262f67aa93a225d9d57451023416e62aaa8391be8e1c09b8adbdef9ac19d",
      "body_hash": "03cd3112fd235f7e3e474338ec08e2a8019789e02396cc2eb63f0006ffca6925",
      "chain_name": "casper-charlie-testnet-7",
      "dependencies": [],
      "gas_price": 10,
      "timestamp": "2020-10-21T19:30:39.601Z",
      "ttl": "1h"
    },
    "payment": {
      "ModuleBytes": {
        "args": "0100000006000000616d6f756e74040000000380969808",
        "module_bytes": ""
      }
    },
    "session": {
      "ModuleBytes": {
        "args": "00000000",
        "Module_bytes":
CONTRACT BYTECODE
 }
    }
  },
  "execution_results": [
    {
      "block_hash": "75df7506a8d150c81ddcfe8303362e22cea3b2359e845b96bccee0735b774e17",
      "result": {
        "cost": "164645",
        "effect": {
          "operations": {
LIST OF OPERATIONS
                      },
          "transforms": {
LIST OF TRANSFORMS
                          }
            },
            "hash-1e0c2b6c77bdfe707f9d452295b21b14196e74968886eecda16d68be4c298883": "WriteContract",
            "hash-3284d00f39e9ceefa93884b7c171a8f7f9efc5d32b2104c41a12c77667ff03c3": "Identity",
            "hash-439d5326bf89bd34d3b2c924b3af2f5e233298b473d5bd8b54fab61ccef6c003": "Identity",
            "hash-46aa3a71a3824ccaa35273b9fa840f31400a1403d95f0e4c1caa992b272d15fc": "WriteContractWasm",
            "hash-9f458c8e49b65a2e8cc1df2610d0639657f9b1010acfc94a08fd0be9962d3892": "Identity",
            "hash-d4e7fc49e390a5789da70ff25a45fdf7348b1a72fdb37369f6d46f6fea65deff": "WriteContractPackage",
            "hash-d74beacad19223c6f90953254b82e86d6499b0bb6824ed86a52e3c16491431d4": "Identity",
            "hash-ebe6e4ad78c5913a4bca6d132d99b12df143f5129de946efca77d8d2a15174da": "Identity",
            "uref-0994d1e6631ca447f5a324776175c8c98ffd8d46d964de3c67776804b61a7bdf-000": "Identity",
            "uref-83b591182be016e97ba6640d9947b8358fbc106f97466e60fae9f10fa23737ee-000": {
              "WriteCLValue": {
                "bytes": "",
                "cl_type": "Unit"
              }
            },
            "uref-8dedcbbabf23d395dd7cc4933a862eda6335f1b9029394bce6df3e05f73d2061-000": {
              "AddUInt512": "1646450"
            },
            "uref-a44cb28d40ac091da0c42f01d175ff10bae86e89457290e34ee7828ddbd32902-000": {
              "WriteCLValue": {
                "bytes": "",
                "cl_type": "Unit"
              }
            },
            "uref-c91b4bef8a426fff315aee6f05d6485ecf474296a9882f9bee8fa11e560e6c91-000": {
              "WriteCLValue": {
                "bytes": "1e0c2b6c77bdfe707f9d452295b21b14196e74968886eecda16d68be4c298883",
                "cl_type": {
                  "FixedList": [
                    "U8",
                    32
                  ]
                }
              }
            },
            "uref-e2054113bc3d57386b3152d38ee774cb58dee3c87886d102ece04d9f3be274bf-000": {
              "WriteCLValue": {
                "bytes": "07c76fa8687e8d03",
                "cl_type": "U512"
              }
            }
          }
        },
        "error_message": null
      }
    }
```

From this data structure we can observe some properties about the deploy (some of which can be set by the user):

-   Execution cost 164645 gas
-   No errors were returned by the contract
-   There were no dependencies for this deploy
-   The Time to Live was 1 hour

It is also possible to check the contract's state by performing a `query-state` command using the client.

### A Note about Gas Prices {#a-note-about-gas-prices}

If you notice in the put-deploy command above, we supplied a payment amount argument:

```bash
--payment-amount 10000000
```

But the actual execution cost was only `164645` when it was run on the chain!

A common question that frequently arises is: "How do I know what the payment amount (gas cost) should be?" The honest answer is that we are hard at work to create tools to help you estimate your costs. Currently, we recommend using the [NCTL](./setup-nctl.md) tool on your local machine or the testnet to deploy your contracts in a test environment. As you just saw, you can check a deploy status and roughly see how much it would actually cost when deployed.

You can estimate the costs in this way, and then add a small buffer in case the network state has changed. So in this example above, you might have chosen to set the payment to 175000 or 200000, rather than the 10000000 that was used.

Refer to the [runtime economics](https://docs.casperlabs.io/en/latest/economics/runtime.html?highlight=consensus-before-execution%20model#gas-allocation) section for more details about gas usage, fees, and refunding mechanisms.

### Advanced Deployments {#advanced-deployments}

The Casper Network supports complex deployments.

#### Using Arguments with Deployments {#using-arguments-with-deployments}

Casper contracts support arguments for deployments, which enables powerful capabilities for smart contract development. The casper client provides some examples on how to do this:

```bash
$ casper-client put-deploy --show-arg-examples
```

#### Creating, signing, and deploying contracts with multiple signatures {#creating-signing-and-deploying-contracts-with-multiple-signatures}

The `deploy` command on its own provides multiple actions strung together optimizing for the common case, with the capability to separate concerns between your key management and deploy creation. See details about generating account key pairs in the Developer Guide.

Every account can associate multiple keys with it and give each a weight. Collective weight of signing keys decides whether an action of certain type can be made. To learn more about how weights and threshholds work, please review the [Blockchain Design](https://docs.casperlabs.io/en/latest/implementation/accounts.html). In order to collect weight of different associated keys, a deploy has to be signed by corresponding private keys. The `put-deploy` command creates a deploy, signs it and deploys to the node but doesn't allow for signing with multiple keys. Therefore, we split `deploy` into separate commands:

-   `make-deploy` - creates a deploy from input parameters
-   `sign-deploy` - signs a deploy with given private key
-   `send-deploy` - sends a deploy to a Casper node

To make a deploy signed with multiple keys: first create the deploy with `make-deploy`. This generates a deploy file that can be sent to the other signers, who then sign it with their keys by calling `sign-deploy` for each key. Signatures need to be gathered on the deploy one after another, untill all requisite parties have signed the deploy. Finally the signed deploy is sent to the node with `send-deploy` for processing by the network.
