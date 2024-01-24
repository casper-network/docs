---
title: Introduction
slug: /resources/tokens/cep78/introduction
---


# CEP-78 Enhanced NFT Standard Introduction

## Usage

### Building the Contract

The `main.rs` file within the contract provides the installer for the NFT contract. Users can compile the contract to Wasm using the `make build-contract` command from the Makefile provided.

The pre-built Wasm for the contract and all other utility session code can be found as part of the most current release. Users wishing to build the Wasm themselves can pull the code and use the `make build-contract` command provided in the Makefile. Please note, however, that you must install `wasm-strip` to build the contract.

The `call` method will install the contract with the necessary entrypoints and call the `init()` entrypoint, which allows the contract to self-initialize and set up the necessary state variables for operation.

### Required Runtime Arguments

The following are the required runtime arguments that must be passed to the installer session code to correctly install the NFT contract. For more information on the modalities that these arguments set, please refer to the [Modalities](./modalities.md) documentation.

- `"collection_name":` The name of the NFT collection, passed in as a `String`. This parameter is required and cannot be changed post installation.
- `"collection_symbol"`: The symbol representing a given NFT collection, passed in as a `String`. This parameter is required and cannot be changed post installation.
- `"total_token_supply"`: The total number of NFTs that a specific instance of a contract will mint passed in as a `U64` value. This parameter is required.
- `"ownership_mode"`: The [`OwnershipMode`](./modalities.md#ownership) modality that dictates the ownership behavior of the NFT contract. This argument is passed in as a `u8` value and is required at the time of installation.
- `"nft_kind"`: The [`NFTKind`](./modalities.md#nftkind) modality that specifies the off-chain items represented by the on-chain NFT data. This argument is passed in as a `u8` value and is required at the time of installation.
- `"json_schema"`: The JSON schema for the NFT tokens that will be minted by the NFT contract passed in as a `String`. This parameter is required if the metadata kind is set to `CustomValidated(3)` and cannot be changed post installation.
- `"nft_metadata_kind"`: The base metadata schema for the NFTs to be minted by the NFT contract. This argument is passed in as a `u8` value and is required at the time of installation.
- `"identifier_mode"`: The [`NFTIdentifierMode`](./modalities.md#nftidentifiermode) modality dictates the primary identifier for NFTs minted by the contract. This argument is passed in as a `u8` value and is required at the time of installation.
- `"metadata_mutability"`: The [`MetadataMutability`](./modalities.md#metadata-mutability) modality dictates whether the metadata of minted NFTs can be updated. This argument is passed in as a `u8` value and is required at the time of installation.

The following are the optional parameters that can be passed in at the time of installation.

- `"minting_mode"`: The [`MintingMode`](./modalities.md#minting) modality that dictates the access to the `mint()` entry-point in the NFT contract. This is an optional parameter that will default to restricting access to the installer of the contract. This parameter cannot be changed once the contract has been installed.
- `"allow_minting"`: The `"allow_minting"` flag allows the installer of the contract to pause the minting of new NFTs. The `allow_minting` is a boolean toggle that allows minting when `true`. If not provided at install the toggle will default to `true`. This value can be changed by the installer by calling the `set_variables()` entrypoint.

- `"whitelist_mode"`: The [`WhitelistMode`](./modalities.md#whitelistmode) modality dictates whether the contract whitelist can be updated. This optional parameter will default to an unlocked whitelist that can be updated post installation. This parameter cannot be changed once the contract has been installed.
- `"holder_mode"`: The [`NFTHolderMode`](./modalities.md#nftholdermode) modality dictates which entities can hold NFTs. This is an optional parameter and will default to a mixed mode allowing either `Accounts` or `Contracts` to hold NFTs. This parameter cannot be changed once the contract has been installed.
- `"contract_whitelist"`: The contract whitelist is a list of contract hashes that specifies which contracts can call the `mint()` entrypoint to mint NFTs. This is an optional parameter which will default to an empty whitelist. This value can be changed via the `set_variables` post installation. If the whitelist mode is set to locked, a non-empty whitelist must be passed; else, installation of the contract will fail.
- `"burn_mode"`: The [`BurnMode`](./modalities.md#burnmode) modality dictates whether minted NFTs can be burnt. This is an optional parameter and will allow tokens to be burnt by default. This parameter cannot be changed once the contract has been installed.
- `"owner_reverse_lookup_mode"`: The [`OwnerReverseLookupMode`](./modalities.md#reportingmode) modality dictates whether the lookup for owners to token identifiers is available. This is an optional parameter and will not provide the lookup by default. This parameter cannot be changed once the contract has been installed.
- `"events_mode"`: The [`EventsMode`](./modalities.md#eventsmode) modality selects the event schema used to record any changes that occur to tokens issued by the contract instance.
- `"additional_required_metdata"`: An additional metadata schema that must be included. This argument is passed in as a `u8` value.
- `"optional_metdata"`: An optional metadata schema that may be included. This argument is passed in as a `u8` value.

#### Example deploy

The following is an example of installing the NFT contract via a deploy using the Rust CLI Casper client. You can find more examples [here](./using-casper-client.md).

```bash
casper-client put-deploy -n http://65.108.0.148:7777/rpc --chain-name "casper-test" --payment-amount 500000000000 -k keys/secret_key.pem --session-path contract/target/wasm32-unknown-unknown/release/contract.wasm \
--session-arg "collection_name:string='enhanced-nft-1'" \
--session-arg "collection_symbol:string='ENFT-1'" \
--session-arg "total_token_supply:u64='10'" \
--session-arg "ownership_mode:u8='0'" \
--session-arg "nft_kind:u8='1'" \
--session-arg "json_schema:string='nft-schema'" \
--session-arg "allow_minting:bool='true'" \
--session-arg "owner_reverse_lookup_mode:u8='0'" \
--session-arg "nft_metadata_kind:u8='2'" \
--session-arg "identifier_mode:u8='0'" \
--session-arg "metadata_mutability:u8='1'"
```

### Utility Session Code

Specific entrypoints in use by the current implementation of the NFT contract require session code to accept return values passed by the contract over the Wasm boundary.
In order to help with the installation and use of the NFT contract, session code for such entrypoints has been provided. It is recommended that
users and DApp developers attempting to engage with the NFT contract do so with the help of the provided utility session code. The session code can be found in the `client`
folder within the project folder.

| Entrypoint name | Session code                  |
| --------------- | ----------------------------- |
| `"mint"`        | `client/mint_session`         |
| `"balance_of"`  | `client/balance_of_session`   |
| `"get_approved` | `client/get_approved_session` |
| `"owner_of"`    | `client/owner_of_session`     |
| `"transfer"`    | `client/transfer_session`     |

### Checking Token Ownership

[Learn to check token ownership](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/tutorials/token-ownership-tutorial.md) starting with version [v1.1.1](https://github.com/casper-ecosystem/cep-78-enhanced-nft/releases/tag/v1.1.1). The `OwnerReverseLookupMode` modality must be set to `Complete` as described [here](./reverse-lookup.md).


### Upgrading to Version 1.1.1 

Upgrade to v1.1.1 using a [Standard NamedKey Convention](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/tutorials/standard-migration-tutorial.md) or a [Custom NamedKey Convention](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/tutorials/custom-migration-tutorial.md).

## Installing and Interacting with the Contract using the Rust Casper Client

You can find instructions on installing an instance of the CEP-78 contract using the Rust CLI Casper client [here](./using-casper-client.md).

## Test Suite and Specification

The expected behavior of the NFT contract implementation is asserted by its test suite found in the `tests` folder.
The test suite and the corresponding unit tests comprise the specification around the contract and outline the expected behaviors
of the NFT contract across the entire range of possible configurations (i.e modalities and toggles like allow minting). The test suite
ensures that as new modalities are added, and current modalities are extended, no regressions and conflicting behaviors are introduced.
The test suite also asserts the correct working behavior of the utility session code provided in the client folder. The tests can be run
by using the provided `Makefile` and running the `make test` command.

## Error Codes

| Code | Error                                       |
| ---- | ------------------------------------------- |
| 1    | InvalidAccount                              |
| 2    | MissingInstaller                            |
| 3    | InvalidInstaller                            |
| 4    | UnexpectedKeyVariant                        |
| 5    | MissingTokenOwner                           |
| 6    | InvalidTokenOwner                           |
| 7    | FailedToGetArgBytes                         |
| 8    | FailedToCreateDictionary                    |
| 9    | MissingStorageUref                          |
| 10   | InvalidStorageUref                          |
| 11   | MissingOwnerUref                            |
| 12   | InvalidOwnersUref                           |
| 13   | FailedToAccessStorageDictionary             |
| 14   | FailedToAccessOwnershipDictionary           |
| 15   | DuplicateMinted                             |
| 16   | FailedToConvertCLValue                      |
| 17   | MissingCollectionName                       |
| 18   | InvalidCollectionName                       |
| 19   | FailedToSerializeMetaData                   |
| 20   | MissingAccount                              |
| 21   | MissingMintingStatus                        |
| 22   | InvalidMintingStatus                        |
| 23   | MissingCollectionSymbol                     |
| 24   | InvalidCollectionSymbol                     |
| 25   | MissingTotalTokenSupply                     |
| 26   | InvalidTotalTokenSupply                     |
| 27   | MissingTokenID                              |
| 28   | InvalidTokenIdentifier                      |
| 29   | MissingTokenOwners                          |
| 30   | MissingAccountHash                          |
| 31   | InvalidAccountHash                          |
| 32   | TokenSupplyDepleted                         |
| 33   | MissingOwnedTokensDictionary                |
| 34   | TokenAlreadyBelongsToMinterFatal            |
| 35   | FatalTokenIdDuplication                     |
| 36   | InvalidMinter                               |
| 37   | MissingMintingMode                          |
| 38   | InvalidMintingMode                          |
| 39   | MissingInstallerKey                         |
| 40   | FailedToConvertToAccountHash                |
| 41   | InvalidBurner                               |
| 42   | PreviouslyBurntToken                        |
| 43   | MissingAllowMinting                         |
| 44   | InvalidAllowMinting                         |
| 45   | MissingNumberOfMintedTokens                 |
| 46   | InvalidNumberOfMintedTokens                 |
| 47   | MissingTokenMetaData                        |
| 48   | InvalidTokenMetaData                        |
| 49   | MissingApprovedAccountHash                  |
| 50   | InvalidApprovedAccountHash                  |
| 51   | MissingApprovedTokensDictionary             |
| 52   | TokenAlreadyApproved                        |
| 53   | MissingApproveAll                           |
| 54   | InvalidApproveAll                           |
| 55   | MissingOperator                             |
| 56   | InvalidOperator                             |
| 57   | Phantom                                     |
| 58   | ContractAlreadyInitialized                  |
| 59   | MintingIsPaused                             |
| 60   | FailureToParseAccountHash                   |
| 61   | VacantValueInDictionary                     |
| 62   | MissingOwnershipMode                        |
| 63   | InvalidOwnershipMode                        |
| 64   | InvalidTokenMinter                          |
| 65   | MissingOwnedTokens                          |
| 66   | InvalidAccountKeyInDictionary               |
| 67   | MissingJsonSchema                           |
| 68   | InvalidJsonSchema                           |
| 69   | InvalidKey                                  |
| 70   | InvalidOwnedTokens                          |
| 71   | MissingTokenURI                             |
| 72   | InvalidTokenURI                             |
| 73   | MissingNftKind                              |
| 74   | InvalidNftKind                              |
| 75   | MissingHolderMode                           |
| 76   | InvalidHolderMode                           |
| 77   | MissingWhitelistMode                        |
| 78   | InvalidWhitelistMode                        |
| 79   | MissingContractWhiteList                    |
| 80   | InvalidContractWhitelist                    |
| 81   | UnlistedContractHash                        |
| 82   | InvalidContract                             |
| 83   | EmptyContractWhitelist                      |
| 84   | MissingReceiptName                          |
| 85   | InvalidReceiptName                          |
| 86   | InvalidJsonMetadata                         |
| 87   | InvalidJsonFormat                           |
| 88   | FailedToParseCep78Metadata                  |
| 89   | FailedToParse721Metadata                    |
| 90   | FailedToParseCustomMetadata                 |
| 91   | InvalidCEP78Metadata                        |
| 92   | FailedToJsonifyCEP78Metadata                |
| 93   | InvalidNFT721Metadata                       |
| 94   | FailedToJsonifyNFT721Metadata               |
| 95   | InvalidCustomMetadata                       |
| 96   | MissingNFTMetadataKind                      |
| 97   | InvalidNFTMetadataKind                      |
| 98   | MissingIdentifierMode                       |
| 99   | InvalidIdentifierMode                       |
| 100  | FailedToParseTokenId                        |
| 101  | MissingMetadataMutability                   |
| 102  | InvalidMetadataMutability                   |
| 103  | FailedToJsonifyCustomMetadata               |
| 104  | ForbiddenMetadataUpdate                     |
| 105  | MissingBurnMode                             |
| 106  | InvalidBurnMode                             |
| 107  | MissingHashByIndex                          |
| 108  | InvalidHashByIndex                          |
| 109  | MissingIndexByHash                          |
| 110  | InvalidIndexByHash                          |
| 111  | MissingPageTableURef                        |
| 112  | InvalidPageTableURef                        |
| 113  | MissingPageLimit                            |
| 114  | InvalidPageLimit                            |
| 115  | InvalidPageNumber                           |
| 116  | InvalidPageIndex                            |
| 117  | MissingUnmatchedHashCount                   |
| 118  | InvalidUnmatchedHashCount                   |
| 119  | MissingPackageHashForUpgrade                |
| 120  | MissingPageUref                             |
| 121  | InvalidPageUref                             |
| 122  | CannotUpgradeWithZeroSupply                 |
| 123  | CannotInstallWithZeroSupply                 |
| 124  | MissingMigrationFlag                        |
| 125  | InvalidMigrationFlag                        |
| 126  | ContractAlreadyMigrated                     |
| 127  | UnregisteredOwnerInMint                     |
| 128  | UnregisteredOwnerInTransfer                 |
| 129  | MissingReportingMode                        |
| 130  | InvalidReportingMode                        |
| 131  | MissingPage                                 |
| 132  | UnregisteredOwnerFromMigration              |
| 133  | ExceededMaxTotalSupply                      |
| 134  | MissingCep78PackageHash                     |
| 135  | InvalidCep78InvalidHash                     |
| 136  | InvalidPackageHashName                      |
| 137  | InvalidAccessKeyName                        |
| 138  | InvalidCheckForUpgrade                      |
| 139  | InvalidNamedKeyConvention                   |
| 140  | OwnerReverseLookupModeNotTransferable       |
| 141  | InvalidAdditionalRequiredMetadata           |
| 142  | InvalidOptionalMetadata                     |
| 143  | MissingOptionalNFTMetadataKind              |
| 144  | InvalidOptionalNFTMetadataKind              |
| 145  | MissingAdditionalNFTMetadataKind            |
| 146  | InvalidAdditionalNFTMetadataKind            |
| 147  | InvalidRequirement                          |
| 148  | MissingEventsMode                           |
| 149  | InvalidEventsMode                           |
| 150  | CannotUpgradeToMoreSupply                   |
| 151  | MissingOperatorDict                         |
| 152  | MissingApprovedDict                         |
| 153  | MissingSpenderAccountHash                   |
| 154  | InvalidSpenderAccountHash                   |
| 155  | MissingOwnerTokenIdentifierKey              |
| 156  | InvalidTransferFilterContract               |
| 157  | MissingTransferFilterContract               |
| 158  | TransferFilterContractNeedsTransferableMode |
| 159  | TransferFilterContractDenied                |
| 160  | MissingACLWhiteList                         |
| 161  | InvalidACLWhitelist                         |
| 162  | EmptyACLWhitelist                           |
