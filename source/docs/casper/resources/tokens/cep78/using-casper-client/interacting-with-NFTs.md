---
title: Interaction Workflow
---

# Interacting with the NFT Contract using the Rust Casper Client

This document describes interacting with NFTs on a Casper network using the Rust command-line client.


## Prerequisites

- Install the contract using the [Quickstart](./quickstart-guide.md) or the [Full Installation](./full-installation-tutorial.md) tutorials
- Learn to [Query NFT Contracts](./querying-NFTs.md) and save the various hashes and URefs required throughout this document


## Table of Contents

1. [Directly Invoking Entrypoints](#directly-invoking-entrypoints)

2. [Minting NFTs](#minting-nfts)

3. [Transferring NFTs](#transferring-nfts)

4. [Checking Balances](#checking-balances)

5. [Approving an Account](#approving-an-account)

6. [Burning NFTs](#burning-nfts)

7.  [Next Steps](#next-steps)


## Directly Invoking Entrypoints

With the release of CEP-78 version 1.1, users interacting with a CEP-78 contract that does not use `ReverseLookupMode` should opt out of using the client Wasm files provided as part of the release. Opting out in this situation is recommended, as directly invoking the entrypoints incurs a lower gas cost than using the provided client Wasm to invoke the entrypoint.

You may invoke the `mint`, `transfer`, or `burn` entrypoints directly through either the contract package hash or the contract hash directly.

In the case of `mint`, fewer runtime arguments must be provided, thereby reducing the total gas cost of minting an NFT.

<details>
<summary><b>Example `mint` using the stored package hash</b></summary>

```bash
casper-client put-deploy --node-address http://localhost:11101/rpc/ \
--chain-name "casper-net-1” \
--payment-amount 5000000000 \
--secret-key ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-package-hash hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30 \
--session-entry-point "mint" \
--session-arg "token_owner:key='account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655'" \
--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"
```

</details>

<details>
<summary><b>Example `transfer` using the stored contract hash</b></summary>

Based on the identifier mode for the given contract instance, either the `token_id` runtime argument must be passed in or, in the case of the hash identifier mode, the `token_hash` runtime argument.

```bash
casper-client put-deploy --node-address http://localhost:11101/rpc/ \
--chain-name "casper-net-1” \
--payment-amount 5000000000 \
--secret-key ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-hash hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796 \
--session-entry-point "transfer" \
--session-arg "source_key:key='account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655'" \
--session-arg "target_key:key='account-hash-0ea7998b2822afe5b62b08a21d54c941ad791279b089f3f7ede0d72b477eca34'" \
--session-arg "token_id:u64='0'"
```

</details>


## Minting NFTs

Below is an example of a `casper-client` command that uses the `mint` entrypoint of the contract to mint an NFT for the user associated with `node-1` in an [NCTL environment](../../../../developers/dapps/nctl-test.md).

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-entry-point "mint"`

1. `--session-package-hash hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30`

   The package hash of the previously installed CEP-78 NFT contract from which we will be minting.

2. `--session-arg "token_owner:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"`

   The collection name of the NFT to be minted.

3. `--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"`

   Metadata describing the NFT to be minted, passed in as a `string`.

<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy --node-address http://localhost:11101/rpc/ \
--chain-name "casper-net-1” \
--payment-amount 5000000000 \
--secret-key ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-entry-point "mint" \
--session-package-hash hash-2b61207cd0e94ce1b1d40801b0abb1ab55fd7dae94c9dcf670292243f3791a30 \
--session-arg "token_owner:key='account-hash-e70dbca48c2d31bc2d754e51860ceaa8a1a49dc627b20320b0ecee1b6d9ce655'" \
--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"
```

</details>

:::note

If the `identifier_mode` was set to hash (1) during installation, the `token_hash` runtime argument needs to be specified during minting. Since you already know the NFT's identifier, you can easily query the NFT's `meta_data`, which is a very useful feature. This example uses an ordinal (0) `identifier_mode`.

:::

### Minting NFTs using Wasm

This example invokes the `mint_call.wasm` session code provided in the `client` folder.

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
casper-client put-deploy --node-address http://localhost:11101/rpc/ \
--chain-name "casper-net-1” \
--payment-amount 5000000000 \
--secret-key ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-path ~/casper/enhanced-nft/client/mint_session/target/wasm32-unknown-unknown/release/mint_call.wasm \
--session-arg "nft_contract_hash:key='hash-206339c3deb8e6146974125bb271eb510795be6f250c21b1bd4b698956669f95'" \
--session-arg "collection_name:string='cep78_<collection_name>'" \
--session-arg "token_owner:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"  \
--session-arg "token_meta_data:string='{\"name\": \"John Doe\",\"token_uri\": \"https:\/\/www.barfoo.com\",\"checksum\": \"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb\"}'"
```

</details>


## Transferring NFTs

Below is an example of a `casper-client` command that uses the `transfer` entrypoint to transfer ownership of an NFT from one user to another.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-entry-point "transfer"`

1. `--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5'"`

   The contract hash of the CEP-78 NFT Contract associated with the NFT to be transferred.

2. `--session-arg "source_key:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'"`

   The account hash of the user that currently owns the NFT and wishes to transfer it.

3. `--session-arg "target_key:key='account-hash-b4772e7c47e4deca5bd90b7adb2d6e884f2d331825d5419d6cbfb59e17642aab'"`

   The account hash of the user that will receive the NFT.

4. `--session-arg "is_hash_identifier_mode:bool='false'"`

   The argument that the hash identifier mode is ordinal, thereby requiring a `token_id` rather than a `token_hash`.

5. `--session-arg "token_id:u64='0'"`

   The `token_id` of the NFT to be transferred.

<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" \
--payment-amount 5000000000 \
-k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-entry-point "transfer" \
--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5 \
--session-arg "source_key:key='account-hash-e9ff87766a1d2bab2565bfd5799054946200b51b20c3ca7e54a9269e00fe7cfb'" \
--session-arg "target_key:key='account-hash-b4772e7c47e4deca5bd90b7adb2d6e884f2d331825d5419d6cbfb59e17642aab'" \
--session-arg "is_hash_identifier_mode:bool='false'" \
--session-arg "token_id:u64='0'"
```

</details>

This command will return a deploy hash that you can query using `casper-client get-deploy`. Querying the deploy allows you to verify execution success, but you will need to use the `balance_of` entrypoint to verify the account's balance as shown [below](#checking-the-balance).


### Transferring NFTs using Wasm

This example uses the `transfer_call.wasm` session code to transfer ownership of an NFT from one user to another.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/secret_key.pem --session-path ~/casper/enhanced-nft/client/transfer_session/target/wasm32-unknown-unknown/release/transfer_call.wasm`

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


## Checking Balances

To check an account's balance, get the latest state root hash and query the `balances` dictionary given the NFT contract hash and the owner's account hash without the "account-hash-" prefix, as shown below.

- `casper-client get-dictionary-item -n http://localhost:11101/rpc`

1. `--state-root-hash f22e8ecfb3d2700d5f902c83da456c32f130b73d0d35037fe89b2d4b4933673f`

   The latest state root hash.

2. `--contract-hash hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796`

   The NFT contract hash.

3. `--dictionary-name "balances"`

   The dictionary tracking the number of tokens for each account hash.

4. `--dictionary-item-key "0ea7998b2822afe5b62b08a21d54c941ad791279b089f3f7ede0d72b477eca34"`

   The account hash of the user whose token balance we are checking without the `account-hash-` prefix.

<details>
<summary><b>Casper client commands without comments</b></summary>

```bash
casper-client get-state-root-hash --node-address https://rpc.testnet.casperlabs.io/

casper-client get-dictionary-item -n http://localhost:11101/rpc/ \
--state-root-hash f22e8ecfb3d2700d5f902c83da456c32f130b73d0d35037fe89b2d4b4933673f \
--contract-hash hash-378a43e38bc5129d8aa3bcd04f5c9a97be73f85b5be574182ac1346f04520796 \
--dictionary-name "balances" \
--dictionary-item-key "0ea7998b2822afe5b62b08a21d54c941ad791279b089f3f7ede0d72b477eca34"
```

</details>

## Approving an Account

The Casper NFT contract features an `approve` entrypoint, allowing another account to manage a specific token. During contract installation, the `ownership_mode` must be set to 2, meaning `Transferable`.

- `casper-client put-deploy -n http://localhost:11101/rpc --chain-name "casper-net-1" --payment-amount 5000000000 -k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem --session-entry-point "approve"`

1. `--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5`

   The contract hash of the previously installed CEP-78 NFT contract.

2. `--session-arg "spender:key='account-hash-17192017d32db5dc9f598bf8ac6ac35ee4b64748669b00572d88335941479513'"`

   The hash of the account receiving the approval.

3. `--session-arg "token_id:u64='1'"`

   The token ID of the approved NFT.


<details>
<summary><b>Casper client command without comments</b></summary>

```bash
casper-client put-deploy -n http://localhost:11101/rpc/ \
--chain-name "casper-net-1" \
--payment-amount 5000000000 \
-k ~/casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--session-entry-point "approve" \
--session-hash hash-52e78ae3f6c485d036a74f65ebbb8c75fcc7c33fb42eb667fb32aeba72c63fb5 \
--session-arg "spender:key='account-hash-17192017d32db5dc9f598bf8ac6ac35ee4b64748669b00572d88335941479513'" \
--session-arg "token_id:u64='1'"
```

</details>


## Burning NFTs

Below is an example of a `casper-client` command that uses the `burn` entrypoint to burn an NFT within a CEP-78 collection. If this command is used, the NFT in question will no longer be accessible by anyone.

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


## Next Steps

- [Testing Framework for CEP-78](./testing-NFTs.md)
