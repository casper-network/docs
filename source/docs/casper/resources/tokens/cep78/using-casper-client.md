---
title: Installing and Interacting with a CEP-78 Contract using the Rust Casper Client
slug: /resources/tokens/using-casper-client
---


# Installing and Interacting with a CEP-78 Contract using the Rust Casper Client

This documentation will guide you through the process of installing and interacting with an instance of the CEP-78 enhanced NFT standard contract through Casper's Rust CLI client. The contract code installs an instance of CEP-78 as per session arguments provided at the time of installation. It requires a minimum Rust version of `1.63.0`.

Information on the modalities used throughout this installation process can be found in the [modalities documentation](modalities.md).

## Table of Contents

1. [Installing the Contract](#installing-the-contract)

2. [Directly Invoking Entrypoints](#directly-invoking-entrypoints)

3. [Minting an NFT](#minting-an-nft)

4. [Transferring NFTs Between Users](#transferring-nfts-between-users)

5. [Burning an NFT](#burning-an-nft)

## Installing the Contract

Installing the enhanced NFT contract to global state requires the use of a [Deploy](../developers/dapps/sending-deploys/). In this case, the session code can be compiled to Wasm by running the `make build-contract` command provided in the Makefile at the top level. The Wasm will be found in the `contract/target/wasm32-unknown-unknown/release` directory as `contract.wasm`.

Below is an example of a `casper-client` command that provides all required session arguments to install a valid instance of the CEP-78 contract on global state.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 500000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-path ~/casper/enhanced-nft/contract/target/wasm32-unknown-unknown/release/contract.wasm`

1. `--session-arg "collection_name:string='CEP-78-collection'"`

   The name of the NFT collection as a string. In this instance, "CEP-78-collection".

2. `--session-arg "collection_symbol:string='CEP78'"`

   The symbol representing the NFT collection as a string. In this instance, "CEP78".

3. `--session-arg "total_token_supply:u64='100'"`

   The total supply of tokens to be minted. In this instance, 100. If the contract owner is unsure of the total number of NFTs they will require, they should err on the side of caution.

4. `--session-arg "ownership_mode:u8='2'"`

   The ownership mode for this contract. In this instance the 2 represents "Transferable" mode. Under these conditions, users can freely transfer their NFTs between one another.

5. `--session-arg "nft_kind:u8='1'"`

   The type of commodity represented by these NFTs. In this instance, the 1 represents a digital collection.

6. `--session-arg "nft_metadata_kind:u8='0'"`

   The type of metadata used by this contract. In this instance, the 0 represents CEP-78 standard for metadata.

7. `--session-arg "json_schema:string=''"`

   An empty JSON string, as the contract has awareness of the CEP-78 JSON schema. Using the custom validated modality would require passing through a valid JSON schema for your custom metadata.

8. `--session-arg "identifier_mode:u8='0'"`

   The mode used to identify individual NFTs. For 0, this means an ordinal identification sequence rather than by hash.

9. `--session-arg "metadata_mutability:u8='0'"`

   A setting allowing for mutability of metadata. This is only available when using the ordinal identification mode, as the hash mode depends on immutability for identification. In this instance, despite ordinal identification, the 0 represents immutable metadata.

The session arguments match the available modalities as listed [here](./modalities.md).

<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 500000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-path ~/casper/enhanced-nft/contract/target/wasm32-unknown-unknown/release/contract.wasm \
--session-arg "collection_name:string='CEP-78-collection'" \
--session-arg "collection_symbol:string='CEP78'" \
--session-arg "total_token_supply:u64='100'" \
--session-arg "ownership_mode:u8='2'" \
--session-arg "nft_kind:u8='1'" \
--session-arg "nft_metadata_kind:u8='0'" \
--session-arg "json_schema:string=''" \
--session-arg "identifier_mode:u8='0'" \
--session-arg "metadata_mutability:u8='0'"
```

</details>

## Directly Invoking Entrypoints

With the release of CEP-78 version 1.1, users that are interacting with a CEP-78 contract that does not use `ReverseLookupMode` should opt out of using the client Wasms provided as part of the release. Opting out in this situation is recommended, as directly invoking the entrypoints incurs a lower gas cost compared against using the provided client Wasm to invoke the entrypoint.

You may invoke the `mint`, `transfer` or `burn` entrypoints directly through either the contract package hash or the contract hash directly.

Specifically in the case of `mint`, there are fewer runtime arguments that must be provided, thereby reducing the total gas cost of minting an NFT.

<details>
<summary><b>Example Mint using StoredVersionByHash</b></summary>

```bash

casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \ --payment-amount 7500000000 \ -k ~/secret_key.pem \
--session-package-hash hash-b3b7a74ae9ef2ea8afc06d6a0830961259605e417e95a53c0cb1ca9737bb0ec7 \
--session-entry-point "mint" \
--session-arg "token_owner:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'" \
--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"

```

</details>

<details>
<summary><b>Example Transfer using StoredContractByHash</b></summary>

Based on the identifier mode for the given contract instance, either the `token_id` runtime argument must be passed in or in the case of the hash identifier mode, the `token_hash` runtime argument.

```bash

casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \ --payment-amount 7500000000 \ -k ~/secret_key.pem \
--session-hash hash-b3b7a74ae9ef2ea8afc06d6a0830961259605e417e95a53c0cb1ca9737bb0ec7 \
--session-entry-point "transfer" \
--session-arg "source_key:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'" \
--session-arg "target_key:key='account-hash-b4782e7c47e4deca5bd90b7adb2d6e884f2d331825d5419d6cbfb59e17642aab'" \
--session-arg "token_id:u64='0'"

```

</details>

## Minting an NFT

Below is an example of a `casper-client` command that uses the `mint` function of the contract to mint an NFT for the user associated with `node-1` in an [NCTL environment](../developers/dapps/nctl-test/).

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-path ~/casper/enhanced-nft/client/mint_session/target/wasm32-unknown-unknown/release/mint_call.wasm`

1. `--session-arg "nft_contract_hash:key='hash-206339c3deb8e6146974125bb271eb510795be6f250c21b1bd4b698956669f95'"`

   The contract hash of the previously installed CEP-78 NFT contract from which we will be minting.

2. `--session-arg "collection_name:string='cep78_<collection_name>'"`

   The collection name of the previously installed CEP-78 NFT contract from which we will be minting.

3. `--session-arg "token_owner:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"`

   The collection name of the NFT to be minted.

4. `--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"`

   Metadata describing the NFT to be minted, passed in as a `string`.

<details>
<summary><b>Casper client command without comments</b></summary>

```bash

casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \
--payment-amount 5000000000 \
-k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-path ~/casper/enhanced-nft/client/mint_session/target/wasm32-unknown-unknown/release/mint_call.wasm \
--session-arg "nft_contract_hash:key='hash-206339c3deb8e6146974125bb271eb510795be6f250c21b1bd4b698956669f95'" \
--session-arg "collection_name:string='cep78_<collection_name>'"` \
--session-arg "token_owner:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"  \
--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"

```

</details>

## Transferring NFTs Between Users

Below is an example of a `casper-client` command that uses the `transfer` function to transfer ownership of an NFT from one user to another. In this case, we are transferring the previously minted NFT from the user associated with `node-2` to the user associated with `node-3`.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-2/keys/secret_key.pem --session-path ~/casper/enhanced-nft/client/transfer_session/target/wasm32-unknown-unknown/release/transfer_call.wasm`

1. `--session-arg "nft_contract_hash:key='hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5'"`

   The contract hash of the CEP-78 NFT Contract associated with the NFT to be transferred.

2. `--session-arg "source_key:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"`

   The account hash of the user that currently owns the NFT and wishes to transfer it.

3. `--session-arg "target_key:key='account-hash-b4772e7c47e4deca5bd90b7adb2d6e884f2d331825d5419d6cbfb59e17642aab'"`

   The account hash of the user that will receive the NFT.

4. `--session-arg "is_hash_identifier_mode:bool='false'"`

   Argument that the hash identifier mode is ordinal, thereby requiring a `token_id` rather than a `token_hash`.

5. `--session-arg "token_id:u64='0'"`

   The `token_id` of the NFT to be transferred.

<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \
--payment-amount 5000000000 \
-k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-2/keys/secret_key.pem \
--session-path ~/casper/enhanced-nft/client/transfer_session/target/wasm32-unknown-unknown/release/transfer_call.wasm \
--session-arg "nft_contract_hash:key='hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5'" \
--session-arg "source_key:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'" \
--session-arg "target_key:key='account-hash-b4772e7c47e4deca5bd90b7adb2d6e884f2d331825d5419d6cbfb59e17642aab'" \
--session-arg "is_hash_identifier_mode:bool='false'" \
--session-arg "token_id:u64='0'"
```

</details>

## Burning an NFT

Below is an example of a `casper-client` command that uses the `burn` function to burn an NFT within a CEP-78 collection. If this command is used, the NFT in question will no longer be accessible by anyone.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem`

1. `--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5`

   The session hash corresponding to the NFT's contract hash.

2. `--session-entry-point "burn"`

   The entrypoint corresponding to the `burn` function.

3. `--session-arg "token_id:u64='1'"`

   The token ID for the NFT to be burned. If the `identifier_mode` is not set to `Ordinal`, you must provide the `token_hash` instead.

<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \
--payment-amount 5000000000 \
-k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5 \
--session-entry-point "burn" \
--session-arg "token_id:u64='1'"
```

</details>