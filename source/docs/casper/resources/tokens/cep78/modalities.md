---
title: CEP-78 Modalities
slug: /resources/tokens/cep78/modalities
---


# CEP-78 Modalities

The enhanced NFT implementation supports various 'modalities' that dictate the behavior of a specific contract instance. Modalities represent the common expectations around contract usage and behavior.

## Ownership

This modality specifies the behavior regarding ownership of NFTs and whether the owner of the NFT can change over the contract's lifetime. There are three modes:

1. `Minter`: `Minter` mode is where the ownership of the newly minted NFT is attributed to the minter of the NFT and cannot be specified by the minter. In the `Minter` mode the owner of the NFT will not change and thus cannot be transferred to another entity.
2. `Assigned`: `Assigned` mode is where the owner of the newly minted NFT must be specified by the minter of the NFT. In this mode, the assigned entity can be either minter themselves or a separate entity. However, similar to the `Minter` mode, the ownership in this mode cannot be changed, and NFTs minted in this mode cannot be transferred from one entity to another.
3. `Transferable`: In the `Transferable` mode the owner of the newly minted NFT must be specified by the minter. However, in the `Transferable` mode, NFTs can be transferred from the owner to another entity.

In all the three mentioned modes, the owner entity is currently restricted to `Accounts` on the Casper network.

**Note**: In the `Transferable` mode, it is possible to transfer the NFT to an `Account` that does not exist.

This `Ownership` mode is a required installation parameter and cannot be changed once the contract has been installed.
The mode is passed in as `u8` value to the `"ownership_mode"` runtime argument.

| Ownership    | u8  |
| ------------ | --- |
| Minter       | 0   |
| Assigned     | 1   |
| Transferable | 2   |

The ownership mode of a contract can be determined by querying the `ownership_mode` entry within the contract's `NamedKeys`.

## NFTKind

The `NFTKind` modality specifies the commodity that NFTs minted by a particular contract will represent. Currently, the `NFTKind` modality does not alter or govern the behavior of the contract itself
and only exists to specify the correlation between on-chain data and off-chain items. There are three different variations of the `NFTKind` mode.

1. `Physical`: The NFT represents a real-world physical item e.g., a house.
2. `Digital`: The NFT represents a digital item, e.g., a unique JPEG or digital art.
3. `Virtual`: The NFT is the virtual representation of a physical notion, e.g., a patent or copyright.

The `NFTKind` mode is a required installation parameter and cannot be changed once the contract has been installed.
The mode is passed in as a `u8` value to `nft_kind` runtime argument.

| NFTKind  | u8  |
| -------- | --- |
| Physical | 0   |
| Digital  | 1   |
| Virtual  | 2   |

## NFTHolderMode

The `NFTHolderMode` dictates which entities on a Casper network can own and mint NFTs. There are three different options currently available:

1. `Accounts`: In this mode, only `Accounts` can own and mint NFTs.
2. `Contracts`: In this mode, only `Contracts` can own and mint NFTs.
3. `Mixed`: In this mode both `Accounts` and `Contracts` can own and mint NFTs.

If the `NFTHolderMode` is set to `Contracts` a `ContractHash` whitelist must be provided. This whitelist dictates which
`Contracts` are allowed to mint NFTs in the restricted `Installer` minting mode.

| NFTHolderMode | u8  |
| ------------- | --- |
| Accounts      | 0   |
| Contracts     | 1   |
| Mixed         | 2   |

This modality is an optional installation parameter and will default to the `Mixed` mode if not provided. However, this
mode cannot be changed once the contract has been installed.
The mode is passed in as a `u8` value to `nft_holder_mode` runtime argument.

## WhitelistMode

The `WhitelistMode` dictates if the ACL whitelist restricting access to the mint entry point can be updated. There are currently two options:

1. `Unlocked`: The ACL whitelist is unlocked and can be updated via the set variables endpoint.
2. `Locked`: The ACL whitelist is locked and cannot be updated further.

If the `WhitelistMode` is set to `Locked` an ACL whitelist of entity keys must be provided on installation. This whitelist dictates which entities can mint NFTs in the restricted `ACL` minting mode. These entities include `Accounts` and/or `Contracts`.

This `WhitelistMode` is an optional installation parameter and will be set to unlocked if not passed. However, the whitelist mode itself cannot be changed once the contract has been installed. The mode is passed in as a `u8` value to `whitelist_mode` runtime argument.

| WhitelistMode | u8  |
| ------------- | --- |
| Unlocked      | 0   |
| Locked        | 1   |

## Minting

The minting mode governs the behavior of contract when minting new tokens. The minting modality provides two options:

1. `Installer`: This mode restricts the ability to mint new NFT tokens only to the installing account of the NFT contract.
2. `Public`: This mode allows any account to mint NFT tokens.
3. `ACL`: This mode allows whitelisted accounts or contracts to mint NFT tokens.

This modality is an optional installation parameter and will default to the `Installer` mode if not provided. However, this
mode cannot be changed once the contract has been installed. The mode is set by passing a `u8` value to the `minting_mode` runtime argument.

| MintingMode | u8  |
| ----------- | --- |
| Installer   | 0   |
| Public      | 1   |
| ACL         | 2   |

## NFTMetadataKind

This modality dictates the schema for the metadata for NFTs minted by a given instance of an NFT contract. There are four supported modalities:

1. `CEP78`: This mode specifies that NFTs minted must have valid metadata conforming to the CEP-78 schema.
2. `NFT721`: This mode specifies that NFTs minted must have valid metadata conforming to the NFT-721 metadata schema.
3. `Raw`: This mode specifies that metadata validation will not occur and raw strings can be passed to `token_metadata` runtime argument as part of the call to `mint` entrypoint.
4. `CustomValidated`: This mode specifies that a custom schema provided at the time of install will be used when validating the metadata as part of the call to `mint` entrypoint.

During installation, one `NFTMetadataKind` must be chosen as the base metadata kind for the contract instance. Additional kinds may be included using either the `additional_required_metadata` or `optional_metadata` arguments.

### CEP-78 metadata example

```json
{
  "name": "John Doe",
  "token_uri": "https://www.barfoo.com",
  "checksum": "940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fb"
}
```

### NFT-721 metadata example

```json
{
  "name": "John Doe",
  "symbol": "abc",
  "token_uri": "https://www.barfoo.com"
}
```

### Custom Validated

The CEP-78 implementation allows installers of the contract to provide their custom schema at the time of installation.
The schema is passed as a String value to `json_schema` runtime argument at the time of installation. Once provided, the schema
for a given instance of the contract cannot be changed.

The custom JSON schema must contain a top-level `properties` field. An example of a [`valid JSON schema`](#example-custom-validated-schema) is provided. In this example, each property has a name, the description of the property itself, and whether the property is required to be present in the metadata.
If the metadata kind is not set to custom validated, then the value passed to the `json_schema` runtime argument will be ignored.

#### Example Custom Validated schema

```json
{
  "properties": {
    "deity_name": {
      "name": "deity_name",
      "description": "The name of deity from a particular pantheon.",
      "required": true
    },
    "mythology": {
      "name": "mythology",
      "description": "The mythology the deity belongs to.",
      "required": true
    }
  }
}
```

#### Example Custom Metadata

```json
{
  "deity_name": "Baldur",
  "mythology": "Nordic"
}
```

| NFTMetadataKind | u8  |
| --------------- | --- |
| CEP78           | 0   |
| NFT721          | 1   |
| Raw             | 2   |
| CustomValidated | 3   |

## NFTIdentifierMode

The identifier mode governs the primary identifier for NFTs minted for a given instance on an installed contract. This modality provides two options:

1. `Ordinal`: NFTs minted in this modality are identified by a `u64` value. This value is determined by the number of NFTs minted by the contract at the time the NFT is minted.
2. `Hash`: NFTs minted in this modality are identified by a base16 encoded representation of the blake2b hash of the metadata provided at the time of mint.

Since the primary identifier in the `Hash` mode is derived by hashing over the metadata, making it a content-addressed identifier, the metadata for the minted NFT cannot be updated after the mint.

Attempting to install the contract with the `MetadataMutability` modality set to `Mutable` in the `Hash` identifier mode will raise an error.

This modality is a required installation parameter and cannot be changed once the contract has been installed.

It is passed in as a `u8` value to the `identifier_mode` runtime argument.

| NFTIdentifierMode | u8  |
| ----------------- | --- |
| Ordinal           | 0   |
| Hash              | 1   |

## Metadata Mutability

The metadata mutability mode governs the behavior around updates to a given NFTs metadata. This modality provides two options:

1. `Immutable`: Metadata for NFTs minted in this mode cannot be updated once the NFT has been minted.
2. `Mutable`: Metadata for NFTs minted in this mode can update the metadata via the `set_token_metadata` entrypoint.

The `Mutable` option cannot be used in conjunction with the `Hash` modality for the NFT identifier; attempting to install the contract with this configuration raises `InvalidMetadataMutability` error.
This modality is a required installation parameter and cannot be changed once the contract has been installed.
It is passed in as a `u8` value to the `metadata_mutability` runtime argument.

| MetadataMutability | u8  |
| ------------------ | --- |
| Immutable          | 0   |
| Mutable            | 1   |

## BurnMode

The `BurnMode` modality dictates whether tokens minted by a given instance of an NFT contract can be burnt. This modality
provides two options:

1. `Burnable`: Minted tokens can be burnt.
2. `NonBurnable`: Minted tokens cannot be burnt.

| BurnMode    | u8  |
| ----------- | --- |
| Burnable    | 0   |
| NonBurnable | 1   |

This modality is an optional installation parameter and will default to the `Burnable` mode if not provided. However, this
mode cannot be changed once the contract has been installed. The mode is set by passing a `u8` value to the `burn_mode` runtime argument.

## OwnerReverseLookupMode

The `OwnerReverseLookupMode` modality is set at install and determines if a given contract instance writes necessary data to allow reverse lookup by owner in addition to by ID.

This modality provides the following options:

1. `NoLookup`: The reporting and receipt functionality is not supported. In this option, the contract instance does not maintain a reverse lookup database of ownership and therefore has more predictable gas costs and greater scaling.
2. `Complete`: The reporting and receipt functionality is supported. Token ownership will be tracked by the contract instance using the system described [here](./reverse-lookup.md).
3. `TransfersOnly`: The reporting and receipt functionality is supported like `Complete`. However, it does not begin tracking until the first transfer. This modality is for use cases where the majority of NFTs are owned by a private minter and only NFT's that have been transferred benefit from reverse lookup tracking. Token ownership will also be tracked by the contract instance using the system described [here](./reverse-lookup.md).

Additionally, when set to `Complete`, causes a receipt to be returned by the `mint` or `transfer` entrypoints, which the caller can store in their account or contract context for later reference.

Further, two special entrypoints are enabled in `Complete` mode. First, `register_owner` which when called will allocate the necessary tracking record for the imputed entity. This allows isolation of the one time gas cost to do this per owner, which is convenient for accounting purposes. Second, `updated_receipts`, which allows an owner of one or more NFTs held by the contract instance to attain up to date receipt information for the NFTs they currently own.

| OwnerReverseLookupMode | u8  |
| ---------------------- | --- |
| NoLookup               | 0   |
| Complete               | 1   |
| TransfersOnly          | 2   |

This modality is an optional installation parameter and will default to the `NoLookup` mode if not provided. The mode is set by passing a `u8` value to the `owner_reverse_lookup_mode` runtime argument. This mode cannot be changed once the contract has been installed.

**Note** : if `ownership_mode` is set to `Minter` and the `minting_mode` is set to `Installer` only, `OwnerReverseLookupMode` will be set to `NoLookup`. This is because the minter, by definition, owns all of the tokens forever. Therefore, there is no reason to do a reverse lookup for that owner. This rule applies only to newly installed contract instances.

**Note** : if `OwnerReverseLookupMode` is set to `TransfersOnly` then `ownership_mode` has to be set to `Transferable` only. This is because other ownership modes do not allow transfer.

If you are upgrading a contract from CEP-78 version 1.0 to 1.1, `OwnerReverseLookupMode` will be set to `Complete`, as this was the standard behavior of CEP-78 1.0. In addition to being set to `Complete`, existing records will be migrated into the CEP-78 1.1 format, which will impose a one-time gas cost to cover the migration.

If you have an existing CEP-78 version 1.0 contract instance, and would prefer the newer functionality with no lookup, the only option is to install a separate, new contract instance and mint all of the NFTs anew in that instance and then burn the corresponding NFTs from the old instance. If you do not own all the NFTs held by the old contract instance, you do not have this option.

## NamedKeyConventionMode

The `NamedKeyConvention` modality dictates whether the Wasm passed will attempt to install a version 1.1.1 instance of CEP-78 or attempt to migrate a version 1.0 CEP-78 instance to version 1.1.1.

This modality provides three options:

1. `DerivedFromCollectionName`: This modality will signal the contract to attempt to install a new version 1.1.1 instance of the CEP-78 contract. The contract package hash and the access URef will be saved in the installing account's `NamedKeys` as `cep78_contract_package_<collection_name>` and `cep78_contract_package_access_<collection_name>`.
2. `V_1_0_standard`: This modality will signal the contract to attempt to upgrade from version 1.0 to version 1.1.1. In this scenario, the contract will retrieve the package hash and the access URef from the `NamedKey` entries originally created during the 1.0 installation.
3. `V_1_0_custom`: This modality will signal the contract to attempt to upgrade from version 1.0 to version 1.1.1. In this scenario, the calling account must provide the `NamedKey` entries under which the package hash and the access URef are saved. Additionally, this requires the passing of the runtime arguments `access_key_name` and `hash_key_name` for the access URef and package hash, respectively. In this modality, these arguments are required and must be passed in.

| NamedKeyConvention        | u8  |
| ------------------------- | --- |
| DerivedFromCollectionName | 0   |
| V_1_0_standard            | 1   |
| V_1_0_custom              | 2   |

## EventsMode

The `EventsMode` modality determines how the installed instance of CEP-78 will handle the recording of events that occur from interacting with the contract.

The modality provides three options:

1. `NoEvents`: This modality will signal the contract to not record events at all. This is the default mode.
2. `CEP47`: This modality will signal the contract to record events using the CEP47 event schema. Further information can be found [below](#cep47-mode).
3. `CES`: This modality will signal the contract to record events using the [Casper Event Standard](#casper-event-standard).

| EventsMode | u8  |
| ---------- | --- |
| NoEvents   | 0   |
| CEP47      | 1   |
| CES        | 2   |

### Transfer Filter Hook

The transfer filter modality, if enabled, specifies a contract package hash pointing to a contract that will be called when the `transfer` method is invoked on the contract. CEP-78 will call the `can_transfer`
method on the specified callback contract, which is expected to return a value of `TransferFilterContractResult`, represented as a u8.

- `TransferFilterContractResult::DenyTransfer` will block the transfer regardless of the outcome of other checks
- `TransferFilterContractResult::ProceedTransfer` will allow the transfer to proceed if other checks also pass

The transfer filter can be enabled by passing a `ARG_TRANSFER_FILTER_CONTRACT` argument to the install method, with a value of type `Option<Key>`

### CEP47 Mode

The CEP47 `EventsMode` modality mimics the event schema previously used in the CEP47 NFT standard. Events are stored as a `BTreeMap` within a dictionary (`EVENTS`) in the contract's context. Entries consist of the `PREFIX_HASH_KEY_NAME`, followed by the `EVENT_TYPE` and then variable data as listed in the table below. The events can be retrieved directly via their dictionary entry using the JSON-RPC, with more information on this process available [here](./concepts/dictionaries).

| Event name      | Included values and type                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Mint            | `recipient (Key)`, `token_id (String)`                                          |
| Transfer        | `owner (Key)`, `operator (Option<Key>)`, `recipient (Key)`, `token_id (String)` |
| Burn            | `owner (Key)`, `token_id (String)`                                              |
| ApprovalGranted | `owner (Key)`, `spender (Key)`, `token_id (String)`                             |
| ApprovalRevoked | `owner (Key)`, `token_id (String)`                                              |
| ApprovalForAll  | `owner (Key)`, `operator (Key)`                                                 |
| RevokedForAll   | `owner (Key)`, `operator (Key)`                                                 |
| MetadataUpdate  | `token_id (String)`                                                             |
| Migration       | -                                                                               |
| VariablesSet    | -                                                                               |

### Casper Event Standard

`CES` is an option within the `EventsMode` modality that determines how changes to tokens issued by the contract instance will be recorded. Any changes are recorded in the `__events` dictionary and can be observed via a node's Server Side Events stream. They may also be viewed by querying the dictionary at any time using the JSON-RPC interface.

The emitted events are encoded according to the [Casper Event Standard](https://github.com/make-software/casper-event-standard), and the schema is visible to an observer reading the `__events_schema` contract named key.

For this CEP-78 reference implementation, the events schema is as follows:

| Event name      | Included values and type                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Mint            | `recipient (Key)`, `token_id (String)`, `data (String)`                         |
| Transfer        | `owner (Key)`, `operator (Option<Key>)`, `recipient (Key)`, `token_id (String)` |
| Burn            | `owner (Key)`, `token_id (String)`                                              |
| Approval        | `owner (Key)`, `spender (Key)`, `token_id (String)`                             |
| ApprovalRevoked | `owner (Key)`, `token_id (String)`                                              |
| ApprovalForAll  | `owner (Key)`, `operator (Key)`                                                 |
| RevokedForAll   | `owner (Key)`, `operator (Key)`                                                 |
| MetadataUpdated | `token_id (String)`, `data (String)`                                            |
| Migration       | -                                                                               |
| VariablesSet    | -                                                                               |

## Modality Conflicts

The `MetadataMutability` option set to `Mutable` cannot be used in conjunction with the `NFTIdentifierMode` modality set to `Hash`.
