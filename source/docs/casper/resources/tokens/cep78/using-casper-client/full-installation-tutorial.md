---
title: Installation Workflow
---

# Installing an NFT Contract using the Rust Casper Client

This documentation will guide you through installing and interacting with an instance of the CEP-78 enhanced NFT standard contract through Casper's Rust CLI client. The contract code installs an instance of CEP-78 given the session arguments provided. It requires a minimum Rust version of `1.63.0`. The code for this tutorial is available in [GitHub](https://github.com/casper-ecosystem/cep-78-enhanced-nft/). A portion of this tutorial reviews the [contract](https://github.com/casper-ecosystem/cep-78-enhanced-nft/tree/dev/contract).

Information on the modalities used throughout this installation process can be found in the [modalities documentation](../modalities.md).

## Table of Contents

1. [Environment Setup](#environment-setup)
    - [Prerequisites](#prerequisites)
    - [Building the Contract and Tests](#building-the-contract-and-tests)
2. [Reviewing the Contract Implementation](#reviewing-the-contract-implementation)
    - [Required Crates](#required-crates)
    - [Initialization Flow](#Initialization-flow)
    - [Contract Entrypoints](#contract-entrypoints)
3. [Installing the Contract](#installing-the-contract)
    - [Querying Global State](#querying-global-state)
    - [Sending the Installation Deploy](#sending-the-installation-deploy)
    - [Verifying the Installation](#verifying-the-installation)
4. [Next Steps](#next-steps)

## Environment Setup

### Prerequisites

Before using this guide, ensure you meet the following requirements:

- Set up the [development prerequisites](https://docs.casper.network/developers/prerequisites/), including the [Casper client](https://docs.casper.network/developers/prerequisites/#install-casper-client)
- Get a valid [node address](https://docs.casper.network/developers/prerequisites/#acquire-node-address-from-network-peers) from the network
- Know how to install a [smart contract](https://docs.casper.network/developers/cli/sending-deploys/) on a Casper network
- Hold enough CSPR tokens to pay for transactions

The [Writing Rust Contracts on Casper](https://docs.casper.network/developers/writing-onchain-code/simple-contract/) document outlines many aspects of this tutorial and should be read as a prerequisite.

### Building the Contract and Tests

First, clone the contract from GitHub:

```bash
git clone https://github.com/casper-ecosystem/cep-78-enhanced-nft/ && cd cep-78-enhanced-nft
```

Prepare your environment with the following command:

```bash
make prepare
```

If your environment is set up correctly, you will see this output:

```bash
rustup target add wasm32-unknown-unknown
info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
```

If you do not see this message, check the [Getting Started Guide](https://docs.casper.network/developers/writing-onchain-code/getting-started/).

The contract code can be compiled to Wasm by running the `make build-contract` command provided in the Makefile at the top level. The Wasm will be found in the `contract/target/wasm32-unknown-unknown/release` directory as `contract.wasm`.

You can also compile your contract and run the contract unit tests with this command:

```bash
make test
```

## Reviewing the Contract Implementation

In this repository, you will find a library and an [example NFT implementation](https://github.com/casper-ecosystem/cep-78-enhanced-nft/tree/dev/contract) for Casper networks. This section explains the example contract in more detail.

There are four steps to follow when you intend to create your implementation of the NFT contract, as follows:

1. Fork the code from the example repository listed above.
2. Perform any necessary customization changes on your fork of the example contract.
3. Compile the customized code to Wasm.
4. Send the customized Wasm as a deploy to a Casper network.

### Required Crates

This tutorial applies to the Rust implementation of the Casper NFT standard, which requires the following Casper crates:

- [casper_contract](https://docs.rs/casper-contract/latest/casper_contract/index.html) - A Rust library for writing smart contracts on Casper networks
- [casper_types](https://docs.rs/casper-types/latest/casper_types/) - Types used to allow the creation of Wasm contracts and tests for use on Casper networks

Here is the code snippet that imports those crates:

```rust
use casper_contract::{
    contract_api::{
        runtime::{self, call_contract, revert},
        storage::{self},
    },
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    contracts::NamedKeys, runtime_args, CLType, CLValue, ContractHash, ContractPackageHash,
    EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Key, KeyTag, Parameter, RuntimeArgs,
    Tagged,
};
```

**Note**: In Rust, the keyword `use` is like an include statement in C/C++.

The contract code defines additional modules in the `contract/src` folder:

```rust
mod constants;
mod error;
mod events;
mod metadata;
mod modalities;
mod utils;
```

- `constants` - Constant values required to run the contract code
- `error` - Errors related to the NFT contract
- `events` - A library for contract-emitted events
- `metadata` - Module handling the contract's metadata and corresponding dictionary
- `modalities` - Common expectations around contract usage and behavior
- `utils` - Utility and helper functions to run the contract code

### Initialization Flow

Initializing the contract happens through the `call() -> install_contract() -> init()` functions inside the [main.rs](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/contract/src/main.rs) contract file. The `init()` function reads the runtime arguments and defines parameters such as `collection_name`, `collection_symbol`, and `total_token_supply`, among the other required and optional arguments described [here](../introduction.md#required-runtime-arguments).

### Contract Entrypoints

This section briefly explains the essential entrypoints used in the Casper NFT contract. To see their full implementation, refer to the [main.rs](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/contract/src/main.rs) contract file. For further questions, contact the Casper support team via the [Discord channel](https://discord.com/invite/casperblockchain). The following entrypoints are listed as they are found in the code.

- [**approve**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1002) - Allows a spender to transfer up to an amount of the owners’s tokens
- [**balance_of**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1616) - Returns the token balance of the owner
- [**burn**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L874) - Burns tokens, reducing the total supply
- [**get_approved**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1728) - Returns the hash of the approved account for a specified token identifier
- [**init**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L81) - Sets the collection name, symbol, and total token supply; initializes the allow minting setting, minting mode, ownership mode, NFT kind, holder mode, whitelist mode and contract whitelist, JSON schema, receipt name, identifier mode, and burn mode. This entrypoint can only be called once when the contract is installed on the network
- [**metadata**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1675) - Returns the metadata associated with a token identifier
- [**mint**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L619) - Mints additional tokens if minting is allowed, increasing the total supply
- [**owner_of**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1636) - Returns the owner for a specified token identifier
- [**set_approval_for_all**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1254) - Allows a spender to transfer all of the owner's tokens
- [**set_token_metadata**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1773) - Sets the metadata associated with a token identifier
- [**set_variables**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L496) - Allows the user to set any combination of variables simultaneously, defining which variables are mutable or immutable
- [**transfer**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1359) - Transfers tokens from the token owner to a specified account.  The transfer will succeed if the caller is the token owner or an approved operator. The transfer will fail if the OwnershipMode is set to Minter or Assigned

There is also the [**migrate**](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/440bff44277ab5fd295f37229fe92278339d3753/contract/src/main.rs#L1975) entrypoint, which was needed only for migrating a 1.0 version of the NFT contract to version 1.1.

## Installing the Contract

Installing the enhanced NFT contract to global state requires using a [Deploy](../../../../developers/dapps/sending-deploys/). But before proceeding with the installation, verify the network state and the status of the account that will send the installation deploy.

### Querying Global State

This step queries information about the network state given the latest state root hash. You will also need the [IP address](../../../../developers/prerequisites/#acquire-node-address-from-network-peers) from a Testnet peer node.

```bash
casper-client get-state-root-hash --node-address http://localhost:11101/rpc/
```

### Querying the Account State

Run the following command and supply the path to your public key in hexadecimal format to get the account hash if you don't have it already.

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY_HEX]
```

Use the command below to query the state of your account.

```bash
casper-client query-global-state --node-address http://<HOST:PORT> \
--state-root-hash [STATE_ROOT_HASH] \
--key [ACCOUNT_HASH]
```

<details>
<summary><b>Expand for a sample query and response</b></summary>

```bash
casper-client query-global-state --node-address http://localhost:11101/rpc/ \
--state-root-hash 376b18e95312328f212f9966200fa40734e66118cbd34ace0a1ec14eacaea6e6 \
--key account-hash-82729ae3b368bb2c45d23c05c872c446cbcf32b694f1d9efd3d1ea46cf227a11
```

```json
{
  "jsonrpc": "2.0",
  "id": -6733022256306802125,
  "result": {
    "api_version": "1.5.6",
    "block_header": null,
    "stored_value": {
      "Account": {
        "account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
        "named_keys": [],
        "main_purse": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
        "associated_keys": [
          {
            "account_hash": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
            "weight": 1
          }
        ],
        "action_thresholds": {
          "deployment": 1,
          "key_management": 1
        }
      }
    },
    "merkle_proof": "[32706 hex chars]"
  }
}
```

</details>


### Sending the Installation Deploy

Below is an example of a `casper-client` command that provides all required session arguments to install a valid instance of the CEP-78 contract on global state. 

Use the Testnet to understand the exact gas amount required for installation. Refer to the [note about gas prices](../../../../developers/cli/sending-deploys/#a-note-about-gas-price) to understand payment amounts and gas price adjustments.

- `casper-client put-deploy -n http://localhost:11101/rpc/ --chain-name "casper-net-1" --payment-amount 500000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-2/keys/secret_key.pem --session-path contract/target/wasm32-unknown-unknown/release/contract.wasm`

1. `--session-arg "collection_name:string='CEP-78-collection'"`

   The name of the NFT collection as a string. In this instance, "CEP-78-collection".

2. `--session-arg "collection_symbol:string='CEP78'"`

   The symbol representing the NFT collection as a string. In this instance, "CEP78".

3. `--session-arg "total_token_supply:u64='100'"`

   The total supply of tokens to be minted. In this instance, 100. If the contract owner is unsure of the total number of NFTs they will require, they should err on the side of caution.

4. `--session-arg "ownership_mode:u8='2'"`

   The ownership mode for this contract. In this instance, the 2 represents "Transferable" mode. Under these conditions, users can freely transfer their NFTs between one another.

5. `--session-arg "nft_kind:u8='1'"`

   The type of commodity represented by these NFTs. In this instance, the 1 represents a digital collection.

6. `--session-arg "nft_metadata_kind:u8='0'"`

   The type of metadata used by this contract. In this instance, the 0 represents CEP-78 standard for metadata.

7. `--session-arg "json_schema:string=''"`

   An empty JSON string, as the contract has awareness of the CEP-78 JSON schema. Using the custom-validated modality would require passing through a valid JSON schema for your custom metadata.

8. `--session-arg "identifier_mode:u8='0'"`

   The mode used to identify individual NFTs. For 0, this means an ordinal identification sequence rather than by hash.

9. `--session-arg "metadata_mutability:u8='0'"`

   A setting allowing for mutability of metadata. This is only available when using the ordinal identification mode, as the hash mode depends on immutability for identification. In this instance, despite ordinal identification, the 0 represents immutable metadata.

The session arguments match the available [modalities](../modalities.md).


<details>
<summary><b>Expand for a sample query and response</b></summary>

```bash
casper-client put-deploy --node-address http://localhost:11101/rpc/ \
--chain-name "casper-net-1" \
--payment-amount 500000000000 \
--secret-key ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-path contract/target/wasm32-unknown-unknown/release/contract.wasm \
--session-arg "collection_name:string='CEP-78-collection'" \
--session-arg "collection_symbol:string='CEP78'" \
--session-arg "total_token_supply:u64='100'" \
--session-arg "ownership_mode:u8='2'" \
--session-arg "nft_kind:u8='1'" \
--session-arg "nft_metadata_kind:u8='0'" \
--session-arg "json_schema:string='nft-schema'" \
--session-arg "identifier_mode:u8='0'" \
--session-arg "metadata_mutability:u8='0'"
```

This command will output the `deploy_hash`, which can be used in the next step to verify the installation.

```bash
{
  "jsonrpc": "2.0",
  "id": 3104428017957320684,
  "result": {
    "api_version": "1.0.0",
    "deploy_hash": "2b084bdccbaaae2b9c6e4de2f5a6cdf06c72f0d02eaeb7d681a29ebdbe3c92b7"
  }
}
```

</details>


### Verifying the Installation

Verify the sent deploy using the `get-deploy` command.

```bash
casper-client get-deploy --node-address http://localhost:11101/rpc/ [DEPLOY_HASH]
```

<details>
<summary><b>Expand for sample deploy details</b></summary>

```json
{
  "jsonrpc": "2.0",
  "id": -7282936875867676694,
  "result": {
    "api_version": "1.5.6",
    "deploy": {
      "hash": "1d1f66b26eb648b5f15bc958a552036e8521b508706056817b0d41c71f6d7afe",
      "header": {
        "account": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
        "timestamp": "2024-02-29T18:28:16.104Z",
        "ttl": "30m",
        "gas_price": 1,
        "body_hash": "90866126c3dbb9a27f672307102bf651663934ee34715d46f9f02caa70226743",
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
                "bytes": "050088526a74",
                "parsed": "500000000000"
              }
            ]
          ]
        }
      },
      "session": {
        "ModuleBytes": {
          "module_bytes": "[621680 hex chars]",
          "args": [
            [
              "collection_name",
              {
                "cl_type": "String",
                "bytes": "120000004345502d37382d636f6c6c656374696f6e32",
                "parsed": "CEP-78-collection"
              }
            ],
            [
              "collection_symbol",
              {
                "cl_type": "String",
                "bytes": "050000004345503738",
                "parsed": "CEP78"
              }
            ],
            [
              "total_token_supply",
              {
                "cl_type": "U64",
                "bytes": "6400000000000000",
                "parsed": 100
              }
            ],
            [
              "ownership_mode",
              {
                "cl_type": "U8",
                "bytes": "02",
                "parsed": 2
              }
            ],
            [
              "nft_kind",
              {
                "cl_type": "U8",
                "bytes": "01",
                "parsed": 1
              }
            ],
            [
              "nft_metadata_kind",
              {
                "cl_type": "U8",
                "bytes": "00",
                "parsed": 0
              }
            ],
            [
              "json_schema",
              {
                "cl_type": "String",
                "bytes": "0a0000006e66742d736368656d61",
                "parsed": "nft-schema"
              }
            ],
            [
              "identifier_mode",
              {
                "cl_type": "U8",
                "bytes": "00",
                "parsed": 0
              }
            ],
            [
              "metadata_mutability",
              {
                "cl_type": "U8",
                "bytes": "00",
                "parsed": 0
              }
            ]
          ]
        }
      },
      "approvals": [
        {
          "signer": "0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf",
          "signature": "01f866dd88fd179fd214262d0451a92be2673e6d4095eb79beef9e5b8bbbc18862e76c3085dcb1b1ae669a185cb80d94c5084325913b8118338645952bb5ee2200"
        }
      ]
    },
    "execution_results": [
      {
        "block_hash": "dca9ff6e9ad7baeead715504dee098069f30dbb9975730be3d3926ab1c58f332",
        "result": {
          "Success": {
            "effect": {
              "operations": [],
              "transforms": [
                {
                  "key": "account-hash-6174cf2e6f8fed1715c9a3bace9c50bfe572eecb763b0ed3f644532616452008",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
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
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "05c2d627778f",
                      "parsed": "616179422914"
                    }
                  }
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "AddUInt512": "500000000000"
                  }
                },
                {
                  "key": "uref-e42cd3ae8b4bd60306a72f0f4e9faa4e114e2e2cce5db03bfdd109a8db888e14-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "cep78_contract_package_CEP-78-collection",
                        "key": "hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30"
                      }
                    ]
                  }
                },
                {
                  "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "cep78_contract_package_access_CEP-78-collection",
                        "key": "uref-e42cd3ae8b4bd60306a72f0f4e9faa4e114e2e2cce5db03bfdd109a8db888e14-007"
                      }
                    ]
                  }
                },
                {
                  "key": "hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30",
                  "transform": "Identity"
                },
                {
                  "key": "hash-845d3d08e29642afba35704bcb6e38f3c40f1469763bff7a88674c9a5be3f01b",
                  "transform": "WriteContractWasm"
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": "WriteContract"
                },
                {
                  "key": "hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30",
                  "transform": "WriteContractPackage"
                },
                {
                  "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "cep78_contract_hash_CEP-78-collection",
                        "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-0545c60c0a55e4d8a10fe0c3b2d356150b082e2243b6795b34f67643e4ca13d0-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U32",
                      "bytes": "01000000",
                      "parsed": 1
                    }
                  }
                },
                {
                  "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "cep78_contract_version_CEP-78-collection",
                        "key": "uref-0545c60c0a55e4d8a10fe0c3b2d356150b082e2243b6795b34f67643e4ca13d0-007"
                      }
                    ]
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": "Identity"
                },
                {
                  "key": "hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30",
                  "transform": "Identity"
                },
                {
                  "key": "hash-845d3d08e29642afba35704bcb6e38f3c40f1469763bff7a88674c9a5be3f01b",
                  "transform": "Identity"
                },
                {
                  "key": "uref-5aed76a73089e7e32f6fbf5d9a9597843215d4810cd5822c0f5c6e65a0bbb7a3-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "String",
                      "bytes": "120000004345502d37382d636f6c6c656374696f6e32",
                      "parsed": "CEP-78-collection"
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "collection_name",
                        "key": "uref-5aed76a73089e7e32f6fbf5d9a9597843215d4810cd5822c0f5c6e65a0bbb7a3-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-ba4247cc0354644474758d1292924c5115c61c8012cae3f094a91060d9dff779-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "String",
                      "bytes": "050000004345503738",
                      "parsed": "CEP78"
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "collection_symbol",
                        "key": "uref-ba4247cc0354644474758d1292924c5115c61c8012cae3f094a91060d9dff779-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-e5f06deadcbfe5a469e7c162346580744746bfdc0ec67002e0ecba5b11096827-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U64",
                      "bytes": "6400000000000000",
                      "parsed": 100
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "total_token_supply",
                        "key": "uref-e5f06deadcbfe5a469e7c162346580744746bfdc0ec67002e0ecba5b11096827-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-89711af74265427dc65d7c5a421cedde82de69d192cad36f34efa36504108572-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "02",
                      "parsed": 2
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "ownership_mode",
                        "key": "uref-89711af74265427dc65d7c5a421cedde82de69d192cad36f34efa36504108572-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-e02c29a6120d5da7f14fb664ca60c3ade56a3171a670c292d0a4ea0f9ae4f0c8-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "01",
                      "parsed": 1
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "nft_kind",
                        "key": "uref-e02c29a6120d5da7f14fb664ca60c3ade56a3171a670c292d0a4ea0f9ae4f0c8-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-772103052d4559fcc2f8f2c2568eb75214462d463009106938e6f20e1cc0a7c0-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "String",
                      "bytes": "0a0000006e66742d736368656d61",
                      "parsed": "nft-schema"
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "json_schema",
                        "key": "uref-772103052d4559fcc2f8f2c2568eb75214462d463009106938e6f20e1cc0a7c0-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-3b45a30c98d90de2c62812c6689aa2fac0cb4d08772fcfdee0584c5db2b1d12a-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "minting_mode",
                        "key": "uref-3b45a30c98d90de2c62812c6689aa2fac0cb4d08772fcfdee0584c5db2b1d12a-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-8443151d736bb3268815ad7848708d44ccc661799f969697c64b1cddb5ce89a7-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "02",
                      "parsed": 2
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "holder_mode",
                        "key": "uref-8443151d736bb3268815ad7848708d44ccc661799f969697c64b1cddb5ce89a7-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-a77f2ac1f5e72c6b096ca414ae2c986a5387442ddf8e89a35b787a756adc4bb4-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "whitelist_mode",
                        "key": "uref-a77f2ac1f5e72c6b096ca414ae2c986a5387442ddf8e89a35b787a756adc4bb4-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-1ec63ea6442d9b4ef40d926280f8b72704b763d3ef7cdaccd9ecb04af5562d99-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "String",
                      "bytes": "1800000063657037385f4345502d37382d636f6c6c656374696f6e32",
                      "parsed": "cep78_CEP-78-collection"
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "receipt_name",
                        "key": "uref-1ec63ea6442d9b4ef40d926280f8b72704b763d3ef7cdaccd9ecb04af5562d99-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-ac99c07d666f45ff5c86a2c1bb6cc44b612ddd5d39a9de88045b441ff6e6b327-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "String",
                      "bytes": "[170 hex chars]",
                      "parsed": "contract-package-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30"
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "cep78_CEP-78-collection",
                        "key": "uref-ac99c07d666f45ff5c86a2c1bb6cc44b612ddd5d39a9de88045b441ff6e6b327-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-45e1bc671353ae58c41a703055959da243deefc7f4c3f121f3f9828d97475bda-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "nft_metadata_kind",
                        "key": "uref-45e1bc671353ae58c41a703055959da243deefc7f4c3f121f3f9828d97475bda-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-05c0eb8e7ef4caa6f228e8ee91874dc64926b95926d839b458fdce356063a817-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": {
                        "Map": {
                          "key": "U8",
                          "value": "U8"
                        }
                      },
                      "bytes": "010000000000",
                      "parsed": [
                        {
                          "key": 0,
                          "value": 0
                        }
                      ]
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "nft_metadata_kinds",
                        "key": "uref-05c0eb8e7ef4caa6f228e8ee91874dc64926b95926d839b458fdce356063a817-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-f53ea99b60ae6d046a6fb0d996475714ef03ed33b39674a8fe016c8324116baf-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "identifier_mode",
                        "key": "uref-f53ea99b60ae6d046a6fb0d996475714ef03ed33b39674a8fe016c8324116baf-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-2ca963a70a69df2db931b8761b4de13bd22e2fc54a415b0b57d4204c9b90dde9-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "metadata_mutability",
                        "key": "uref-2ca963a70a69df2db931b8761b4de13bd22e2fc54a415b0b57d4204c9b90dde9-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-eb1a7f69592881587805fde2d53e8e5b3dcbabd81311faa7b9d19ea731f83d9b-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "burn_mode",
                        "key": "uref-eb1a7f69592881587805fde2d53e8e5b3dcbabd81311faa7b9d19ea731f83d9b-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-f226eed9d0c5fcf58e6b481d45417721e35435c2ef5eb4d26d215209149438ba-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Bool",
                      "bytes": "00",
                      "parsed": false
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "operator_burn_mode",
                        "key": "uref-f226eed9d0c5fcf58e6b481d45417721e35435c2ef5eb4d26d215209149438ba-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-51acad53fd1a6ce6a52cf83ed7f921565311ed86cd362969bacf9457b6bf5c1a-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "events_mode",
                        "key": "uref-51acad53fd1a6ce6a52cf83ed7f921565311ed86cd362969bacf9457b6bf5c1a-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-dca79aa4244d0123ad52799fc4f922b2ae9fc023c9e56f999979f535a792eef5-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Bool",
                      "bytes": "01",
                      "parsed": true
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "allow_minting",
                        "key": "uref-dca79aa4244d0123ad52799fc4f922b2ae9fc023c9e56f999979f535a792eef5-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-f86e2c4057cc17d93593fb203a923d67e5bc68e6428a6d94f6eab0c35450653d-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U64",
                      "bytes": "0000000000000000",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "number_of_minted_tokens",
                        "key": "uref-f86e2c4057cc17d93593fb203a923d67e5bc68e6428a6d94f6eab0c35450653d-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-ff53b7094bcb6659b558d31fdf63f837b05c0ee6030bfe18ad4c3fb0462b9b17-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "token_owners",
                        "key": "uref-ff53b7094bcb6659b558d31fdf63f837b05c0ee6030bfe18ad4c3fb0462b9b17-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-5700d04b36eb1f50204c0d1d05c8ed6aae77eaeaa8a425c78f5a24cbae2e4d26-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "token_issuers",
                        "key": "uref-5700d04b36eb1f50204c0d1d05c8ed6aae77eaeaa8a425c78f5a24cbae2e4d26-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-76aac8f7224c5c1624b4255fff59ecc8ee2c7a1ba460b4f70945d7548abbffd0-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "approved",
                        "key": "uref-76aac8f7224c5c1624b4255fff59ecc8ee2c7a1ba460b4f70945d7548abbffd0-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-ff8ad952307b57a051ef6cb597a55cc2007e587c575584addf6a6fc12c0efd7b-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "operators",
                        "key": "uref-ff8ad952307b57a051ef6cb597a55cc2007e587c575584addf6a6fc12c0efd7b-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-0c144d231ac070adb2668f2a9f3d0eba32c7468efa879f0f29c832c63698966b-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "burnt_tokens",
                        "key": "uref-0c144d231ac070adb2668f2a9f3d0eba32c7468efa879f0f29c832c63698966b-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-3d271bac2030ddee54bf4ea92b9b854d800a10a0df5d6e328a045be19af27538-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "balances",
                        "key": "uref-3d271bac2030ddee54bf4ea92b9b854d800a10a0df5d6e328a045be19af27538-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-575108b0258e92ebede1e50345b608d42963bdac24379022be20b76cfde15301-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "metadata_custom_validated",
                        "key": "uref-575108b0258e92ebede1e50345b608d42963bdac24379022be20b76cfde15301-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-2c2176a9efd465d2e4d5de05d75d029e03040d0a5668c4e08facb0cd3442d30a-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "metadata_cep78",
                        "key": "uref-2c2176a9efd465d2e4d5de05d75d029e03040d0a5668c4e08facb0cd3442d30a-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-eb37c0fe3b53fa5c72b02976f2840b7bf3692954fc830f8a10dc538d0c506e63-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "metadata_nft721",
                        "key": "uref-eb37c0fe3b53fa5c72b02976f2840b7bf3692954fc830f8a10dc538d0c506e63-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-cdb17062423b769a7b0bc18fe0a2202b68d2ba77786291018a24fd53f4532ab8-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "metadata_raw",
                        "key": "uref-cdb17062423b769a7b0bc18fe0a2202b68d2ba77786291018a24fd53f4532ab8-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-e280dd23c847724422543b0d70f1ed4c95c8da9e1a71927ae39add652859775c-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "hash_by_index",
                        "key": "uref-e280dd23c847724422543b0d70f1ed4c95c8da9e1a71927ae39add652859775c-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-6299c9322631f374fc1a5e20920641b23f437a3c0ba8da22cc23cba11b0fa3a5-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "index_by_hash",
                        "key": "uref-6299c9322631f374fc1a5e20920641b23f437a3c0ba8da22cc23cba11b0fa3a5-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-00efcfa874a60b5b615b3c6d781cf69c3559b5372d15457fe4a3bb6d07c66acd-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "page_table",
                        "key": "uref-00efcfa874a60b5b615b3c6d781cf69c3559b5372d15457fe4a3bb6d07c66acd-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-77b5861bdc04f3c63417dd2ed1943f659f6180603982a24587f79cbc38801cf4-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Unit",
                      "bytes": "",
                      "parsed": null
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "acl_whitelist",
                        "key": "uref-77b5861bdc04f3c63417dd2ed1943f659f6180603982a24587f79cbc38801cf4-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-5e950cdd5497633c1d03284ec6e70ce436744cc172d6e26e21e4e474d1b34312-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Bool",
                      "bytes": "00",
                      "parsed": false
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "acl_package_mode",
                        "key": "uref-5e950cdd5497633c1d03284ec6e70ce436744cc172d6e26e21e4e474d1b34312-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-05c2868f179f6b2323f1d4ea069858956c9666d14073748aae4a748d27a8a894-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Bool",
                      "bytes": "00",
                      "parsed": false
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "package_operator_mode",
                        "key": "uref-05c2868f179f6b2323f1d4ea069858956c9666d14073748aae4a748d27a8a894-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-4d851152d7b89dff805dcf6eb61a33870dab9345084a5874575476a584d71b83-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U8",
                      "bytes": "00",
                      "parsed": 0
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "reporting_mode",
                        "key": "uref-4d851152d7b89dff805dcf6eb61a33870dab9345084a5874575476a584d71b83-007"
                      }
                    ]
                  }
                },
                {
                  "key": "uref-2e3b8aafb27aae47c9b7d3728d20d8815b706e2245c23b84f0e712cd1d1e9124-000",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "Bool",
                      "bytes": "00",
                      "parsed": false
                    }
                  }
                },
                {
                  "key": "hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796",
                  "transform": {
                    "AddKeys": [
                      {
                        "name": "rlo_mflag",
                        "key": "uref-2e3b8aafb27aae47c9b7d3728d20d8815b706e2245c23b84f0e712cd1d1e9124-007"
                      }
                    ]
                  }
                },
                {
                  "key": "deploy-1d1f66b26eb648b5f15bc958a552036e8521b508706056817b0d41c71f6d7afe",
                  "transform": {
                    "WriteDeployInfo": {
                      "deploy_hash": "1d1f66b26eb648b5f15bc958a552036e8521b508706056817b0d41c71f6d7afe",
                      "transfers": [],
                      "from": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
                      "source": "uref-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1-007",
                      "gas": "443359442322"
                    }
                  }
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
                },
                {
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                  "transform": "Identity"
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
                  "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
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
                  "key": "account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655",
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
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "055bdf0a5c67",
                      "parsed": "443925847899"
                    }
                  }
                },
                {
                  "key": "balance-11e6fc5354f61a004df98482376c45964b8b1557e8f2f13fb5f3adab5faa8be1",
                  "transform": {
                    "AddUInt512": "56074152101"
                  }
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
                  "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": "Identity"
                },
                {
                  "key": "balance-dcf5abbbe00715e9a05f7449109b1d297cb1584560ec4f3f5a86401452e40d85",
                  "transform": "Identity"
                },
                {
                  "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                  "transform": {
                    "WriteCLValue": {
                      "cl_type": "U512",
                      "bytes": "00",
                      "parsed": "0"
                    }
                  }
                },
                {
                  "key": "balance-dcf5abbbe00715e9a05f7449109b1d297cb1584560ec4f3f5a86401452e40d85",
                  "transform": {
                    "AddUInt512": "443925847899"
                  }
                }
              ]
            },
            "transfers": [],
            "cost": "443359442322"
          }
        }
      }
    ]
  }
}
```

</details>

## Next Steps

- Learn to [Query](./querying-NFTs.md) the NFT contract
- Learn to [Mint, Transfer, and Burn](./interacting-with-NFTs.md) NFT tokens
