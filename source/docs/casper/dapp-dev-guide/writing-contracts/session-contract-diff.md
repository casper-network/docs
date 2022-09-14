# Difference Between Session Code and Contract Code

| Session Code | Contract Code |
| --- | --- |
| Session code always executes in the context of the account that signed the deploy that contains the session code. | Contract code executes within the context of its own state. |
| When a `put_key` call is made within the body of the session code, the key is added to the account's named keys.| When `put_key` call is made within the contract's execution, the key is inserted into the contract's context. So, the key will appear in the contract's named keys.|
| Session code has only one entry point, that is the `call` function, which you can use to interact with the session code.| A contract can have multiple entry points that will help you interact with the contract code.|  
| Any action taken by the session code is initiated by the `call` function within the session code. | Any action undertaken by a contract must initiate through an outside call, usually via session code.|

## Sample Session Code

This session code issues a delegation request to a pre-installed system contract. It accepts a delegator's public key, validator's public key, amount and a delegation rate and issues a delegation request to the auction contract. 

<details>
<summary>Session code calling a pre-installed system contract.</summary>

```rust

#![no_std]
#![no_main]

extern crate alloc;

use casper_contract::contract_api::{runtime, system};
use casper_types::{runtime_args, system::auction, PublicKey, RuntimeArgs, U512};

const ARG_AMOUNT: &str = "amount";

const ARG_VALIDATOR: &str = "validator";
const ARG_DELEGATOR: &str = "delegator";

fn delegate(delegator: PublicKey, validator: PublicKey, amount: U512) {
    let contract_hash = system::get_auction();
    let args = runtime_args! {
        auction::ARG_DELEGATOR => delegator,
        auction::ARG_VALIDATOR => validator,
        auction::ARG_AMOUNT => amount,
    };
    runtime::call_contract::<U512>(contract_hash, auction::METHOD_DELEGATE, args);
}

// Delegate contract.
//
// Accepts a delegator's public key, validator's public key, amount and a delegation rate.
// Issues a delegation request to the auction contract.
#[no_mangle]
pub extern "C" fn call() {
    let delegator = runtime::get_named_arg(ARG_DELEGATOR);
    let validator = runtime::get_named_arg(ARG_VALIDATOR);
    let amount = runtime::get_named_arg(ARG_AMOUNT);

    delegate(delegator, validator, amount);
}

```

</details>


## Sample Contract Code

This contract code installs an instance of the CEP-78 enhanced NFT standard as per session arguments provided at the time of installation.

<details>
<summary>Contract code to install CEP-78 NFT.</summary>

```rust

#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

mod constants;
mod error;
mod metadata;
mod modalities;
mod utils;

extern crate alloc;

use alloc::{
    boxed::Box,
    format,
    string::{String, ToString},
    vec,
    vec::Vec,
};
use core::convert::TryInto;

use casper_types::{
    contracts::NamedKeys, runtime_args, CLType, CLValue, ContractHash, ContractPackageHash,
    ContractVersion, EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Key, KeyTag,
    Parameter, RuntimeArgs, Tagged,
};

use casper_contract::{
    contract_api::{
        runtime,
        storage::{self},
    },
    unwrap_or_revert::UnwrapOrRevert,
};

use crate::{
    constants::{
        ACCESS_KEY_NAME, ALLOW_MINTING, ARG_ALLOW_MINTING, ARG_APPROVE_ALL, ARG_BURN_MODE,
        ARG_COLLECTION_NAME, ARG_COLLECTION_SYMBOL, ARG_CONTRACT_WHITELIST, ARG_HOLDER_MODE,
        ARG_IDENTIFIER_MODE, ARG_JSON_SCHEMA, ARG_METADATA_MUTABILITY, ARG_MINTING_MODE,
        ARG_NFT_KIND, ARG_NFT_METADATA_KIND, ARG_OPERATOR, ARG_OWNERSHIP_MODE, ARG_RECEIPT_NAME,
        ARG_SOURCE_KEY, ARG_TARGET_KEY, ARG_TOKEN_META_DATA, ARG_TOKEN_OWNER,
        ARG_TOTAL_TOKEN_SUPPLY, ARG_WHITELIST_MODE, BURNT_TOKENS, BURN_MODE, COLLECTION_NAME,
        COLLECTION_SYMBOL, CONTRACT_NAME, CONTRACT_VERSION, CONTRACT_WHITELIST,
        ENTRY_POINT_APPROVE, ENTRY_POINT_BALANCE_OF, ENTRY_POINT_BURN, ENTRY_POINT_GET_APPROVED,
        ENTRY_POINT_INIT, ENTRY_POINT_METADATA, ENTRY_POINT_MINT, ENTRY_POINT_OWNER_OF,
        ENTRY_POINT_SET_APPROVE_FOR_ALL, ENTRY_POINT_SET_TOKEN_METADATA, ENTRY_POINT_SET_VARIABLES,
        ENTRY_POINT_TRANSFER, HASH_KEY_NAME, HOLDER_MODE, IDENTIFIER_MODE, INSTALLER, JSON_SCHEMA,
        METADATA_CEP78, METADATA_CUSTOM_VALIDATED, METADATA_MUTABILITY, METADATA_NFT721,
        METADATA_RAW, METADATA_SCHEMA, MINTING_MODE, NFT_KIND, NFT_METADATA_KIND,
        NUMBER_OF_MINTED_TOKENS, OPERATOR, OWNED_TOKENS, OWNERSHIP_MODE, RECEIPT_NAME,
        TOKEN_COUNTS, TOKEN_ISSUERS, TOKEN_OWNERS, TOTAL_TOKEN_SUPPLY, WHITELIST_MODE,
    },
    error::NFTCoreError,
    metadata::CustomMetadataSchema,
    modalities::{
        BurnMode, MetadataMutability, MintingMode, NFTHolderMode, NFTIdentifierMode, NFTKind,
        NFTMetadataKind, OwnershipMode, TokenIdentifier, WhitelistMode,
    },
};

#[no_mangle]
pub extern "C" fn init() {
    // We only allow the init() entrypoint to be called once.
    // If COLLECTION_NAME uref already exists we revert since this implies that
    // the init() entrypoint has already been called.
    if utils::named_uref_exists(COLLECTION_NAME) {
        runtime::revert(NFTCoreError::ContractAlreadyInitialized);
    }

    // Only the installing account may call this method. All other callers are erroneous.
    let installing_account = utils::get_account_hash(
        INSTALLER,
        NFTCoreError::MissingInstaller,
        NFTCoreError::InvalidInstaller,
    );

    // We revert if caller is not the managing installing account
    if installing_account != runtime::get_caller() {
        runtime::revert(NFTCoreError::InvalidAccount)
    }

    // Start collecting the runtime arguments.
    let collection_name: String = utils::get_named_arg_with_user_errors(
        ARG_COLLECTION_NAME,
        NFTCoreError::MissingCollectionName,
        NFTCoreError::InvalidCollectionName,
    )
    .unwrap_or_revert();

    let collection_symbol: String = utils::get_named_arg_with_user_errors(
        ARG_COLLECTION_SYMBOL,
        NFTCoreError::MissingCollectionSymbol,
        NFTCoreError::InvalidCollectionSymbol,
    )
    .unwrap_or_revert();

    let total_token_supply: u64 = utils::get_named_arg_with_user_errors(
        ARG_TOTAL_TOKEN_SUPPLY,
        NFTCoreError::MissingTotalTokenSupply,
        NFTCoreError::InvalidTotalTokenSupply,
    )
    .unwrap_or_revert();

    let allow_minting: bool = utils::get_named_arg_with_user_errors(
        ARG_ALLOW_MINTING,
        NFTCoreError::MissingMintingStatus,
        NFTCoreError::InvalidMintingStatus,
    )
    .unwrap_or_revert();

    let minting_mode: MintingMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_MINTING_MODE,
        NFTCoreError::MissingMintingMode,
        NFTCoreError::InvalidMintingMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let ownership_mode: OwnershipMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_OWNERSHIP_MODE,
        NFTCoreError::MissingOwnershipMode,
        NFTCoreError::InvalidOwnershipMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let nft_kind: NFTKind = utils::get_named_arg_with_user_errors::<u8>(
        ARG_NFT_KIND,
        NFTCoreError::MissingNftKind,
        NFTCoreError::InvalidNftKind,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let holder_mode: NFTHolderMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_HOLDER_MODE,
        NFTCoreError::MissingHolderMode,
        NFTCoreError::InvalidHolderMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let whitelist_mode: WhitelistMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_WHITELIST_MODE,
        NFTCoreError::MissingWhitelistMode,
        NFTCoreError::InvalidWhitelistMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let contract_whitelist = utils::get_named_arg_with_user_errors::<Vec<ContractHash>>(
        ARG_CONTRACT_WHITELIST,
        NFTCoreError::MissingContractWhiteList,
        NFTCoreError::InvalidContractWhitelist,
    )
    .unwrap_or_revert();

    if WhitelistMode::Locked == whitelist_mode
        && contract_whitelist.is_empty()
        && NFTHolderMode::Accounts != holder_mode
    {
        runtime::revert(NFTCoreError::EmptyContractWhitelist)
    }

    let json_schema: String = utils::get_named_arg_with_user_errors(
        ARG_JSON_SCHEMA,
        NFTCoreError::MissingJsonSchema,
        NFTCoreError::InvalidJsonSchema,
    )
    .unwrap_or_revert();

    let receipt_name: String = utils::get_named_arg_with_user_errors(
        ARG_RECEIPT_NAME,
        NFTCoreError::MissingReceiptName,
        NFTCoreError::InvalidReceiptName,
    )
    .unwrap_or_revert();

    let nft_metadata_kind: NFTMetadataKind = utils::get_named_arg_with_user_errors::<u8>(
        ARG_NFT_METADATA_KIND,
        NFTCoreError::MissingNFTMetadataKind,
        NFTCoreError::InvalidNFTMetadataKind,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    // Attempt to parse the provided schema and fail installation
    // if the schema cannot be parsed.
    if let NFTMetadataKind::CustomValidated = nft_metadata_kind {
        casper_serde_json_wasm::from_str::<CustomMetadataSchema>(&json_schema)
            .map_err(|_| NFTCoreError::InvalidJsonSchema)
            .unwrap_or_revert();
    }

    let identifier_mode: NFTIdentifierMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let metadata_mutability: MetadataMutability = utils::get_named_arg_with_user_errors::<u8>(
        ARG_METADATA_MUTABILITY,
        NFTCoreError::MissingMetadataMutability,
        NFTCoreError::InvalidMetadataMutability,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    let burn_mode: BurnMode = utils::get_named_arg_with_user_errors::<u8>(
        ARG_BURN_MODE,
        NFTCoreError::MissingBurnMode,
        NFTCoreError::InvalidBurnMode,
    )
    .unwrap_or_revert()
    .try_into()
    .unwrap_or_revert();

    // Put all created URefs into the contract's context (necessary to retain access rights,
    // for future use).
    //
    // Initialize contract with URefs for all invariant values, which can never be changed.
    runtime::put_key(COLLECTION_NAME, storage::new_uref(collection_name).into());
    runtime::put_key(
        COLLECTION_SYMBOL,
        storage::new_uref(collection_symbol).into(),
    );
    runtime::put_key(
        TOTAL_TOKEN_SUPPLY,
        storage::new_uref(total_token_supply).into(),
    );
    runtime::put_key(
        OWNERSHIP_MODE,
        storage::new_uref(ownership_mode as u8).into(),
    );
    runtime::put_key(NFT_KIND, storage::new_uref(nft_kind as u8).into());
    runtime::put_key(JSON_SCHEMA, storage::new_uref(json_schema).into());
    runtime::put_key(MINTING_MODE, storage::new_uref(minting_mode as u8).into());
    runtime::put_key(HOLDER_MODE, storage::new_uref(holder_mode as u8).into());
    runtime::put_key(
        WHITELIST_MODE,
        storage::new_uref(whitelist_mode as u8).into(),
    );
    runtime::put_key(
        CONTRACT_WHITELIST,
        storage::new_uref(contract_whitelist).into(),
    );
    runtime::put_key(RECEIPT_NAME, storage::new_uref(receipt_name).into());
    runtime::put_key(
        NFT_METADATA_KIND,
        storage::new_uref(nft_metadata_kind as u8).into(),
    );
    runtime::put_key(
        IDENTIFIER_MODE,
        storage::new_uref(identifier_mode as u8).into(),
    );
    runtime::put_key(
        METADATA_MUTABILITY,
        storage::new_uref(metadata_mutability as u8).into(),
    );
    runtime::put_key(BURN_MODE, storage::new_uref(burn_mode as u8).into());

    // Initialize contract with variables which must be present but maybe set to
    // different values after initialization.
    runtime::put_key(ALLOW_MINTING, storage::new_uref(allow_minting).into());
    // This is an internal variable that the installing account cannot change
    // but is incremented by the contract itself.
    runtime::put_key(NUMBER_OF_MINTED_TOKENS, storage::new_uref(0u64).into());

    // Create the data dictionaries to store essential values, topically.
    storage::new_dictionary(TOKEN_OWNERS)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(TOKEN_ISSUERS)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(OWNED_TOKENS)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(OPERATOR).unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(BURNT_TOKENS)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(TOKEN_COUNTS)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(METADATA_CUSTOM_VALIDATED)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(METADATA_CEP78)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(METADATA_NFT721)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
    storage::new_dictionary(METADATA_RAW)
        .unwrap_or_revert_with(NFTCoreError::FailedToCreateDictionary);
}

// set_variables allows the user to set any variable or any combination of variables simultaneously.
// set variables defines what variables are mutable and immutable.
#[no_mangle]
pub extern "C" fn set_variables() {
    let installer = utils::get_account_hash(
        INSTALLER,
        NFTCoreError::MissingInstaller,
        NFTCoreError::InvalidInstaller,
    );

    // Only the installing account can change the mutable variables.
    if installer != runtime::get_caller() {
        runtime::revert(NFTCoreError::InvalidAccount);
    }

    if let Some(allow_minting) = utils::get_optional_named_arg_with_user_errors::<bool>(
        ARG_ALLOW_MINTING,
        NFTCoreError::MissingAllowMinting,
    ) {
        let allow_minting_uref = utils::get_uref(
            ALLOW_MINTING,
            NFTCoreError::MissingAllowMinting,
            NFTCoreError::MissingAllowMinting,
        );
        storage::write(allow_minting_uref, allow_minting);
    }

    if let Some(new_contract_whitelist) =
        utils::get_optional_named_arg_with_user_errors::<Vec<ContractHash>>(
            ARG_CONTRACT_WHITELIST,
            NFTCoreError::MissingContractWhiteList,
        )
    {
        let whitelist_mode: WhitelistMode = utils::get_stored_value_with_user_errors::<u8>(
            WHITELIST_MODE,
            NFTCoreError::MissingWhitelistMode,
            NFTCoreError::InvalidWhitelistMode,
        )
        .try_into()
        .unwrap_or_revert();
        match whitelist_mode {
            WhitelistMode::Unlocked => {
                let whitelist_uref = utils::get_uref(
                    CONTRACT_WHITELIST,
                    NFTCoreError::MissingContractWhiteList,
                    NFTCoreError::InvalidWhitelistMode,
                );
                storage::write(whitelist_uref, new_contract_whitelist)
            }
            WhitelistMode::Locked => runtime::revert(NFTCoreError::InvalidWhitelistMode),
        }
    }
}

// Mints a new token. Minting will fail if allow_minting is set to false.
#[no_mangle]
pub extern "C" fn mint() {
    // The contract owner can toggle the minting behavior on and off over time.
    // The contract is toggled on by default.
    let minting_status = utils::get_stored_value_with_user_errors::<bool>(
        ALLOW_MINTING,
        NFTCoreError::MissingAllowMinting,
        NFTCoreError::InvalidAllowMinting,
    );

    // If contract minting behavior is currently toggled off we revert.
    if !minting_status {
        runtime::revert(NFTCoreError::MintingIsPaused);
    }

    // if mint_pre_condition_hash.exists() { let value = runtime::call_contact(pre_condition_hash,
    // runtime_args).unwrap() } if mint_post_condition_hash.exists() { let val =
    // runtime::call_contact(post_condition_hash, runtime_args).unwrap() }

    let total_token_supply = utils::get_stored_value_with_user_errors::<u64>(
        TOTAL_TOKEN_SUPPLY,
        NFTCoreError::MissingTotalTokenSupply,
        NFTCoreError::InvalidTotalTokenSupply,
    );

    // The next_index is the number of minted tokens so far.
    let mut next_index = utils::get_stored_value_with_user_errors::<u64>(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingNumberOfMintedTokens,
        NFTCoreError::InvalidNumberOfMintedTokens,
    );

    // Revert if the token supply has been exhausted.
    if next_index >= total_token_supply {
        runtime::revert(NFTCoreError::TokenSupplyDepleted);
    }

    let minting_mode: MintingMode = utils::get_stored_value_with_user_errors::<u8>(
        MINTING_MODE,
        NFTCoreError::MissingMintingMode,
        NFTCoreError::InvalidMintingMode,
    )
    .try_into()
    .unwrap_or_revert();

    // Revert if minting is private and caller is not installer.
    if let MintingMode::Installer = minting_mode {
        let caller = utils::get_verified_caller().unwrap_or_revert();
        match caller.tag() {
            KeyTag::Hash => {
                let calling_contract = caller
                    .into_hash()
                    .map(ContractHash::new)
                    .unwrap_or_revert_with(NFTCoreError::InvalidKey);
                let contract_whitelist =
                    utils::get_stored_value_with_user_errors::<Vec<ContractHash>>(
                        CONTRACT_WHITELIST,
                        NFTCoreError::MissingWhitelistMode,
                        NFTCoreError::InvalidWhitelistMode,
                    );
                // Revert if the calling contract is not in the whitelist.
                if !contract_whitelist.contains(&calling_contract) {
                    runtime::revert(NFTCoreError::UnlistedContractHash)
                }
            }
            KeyTag::Account => {
                let installer_account = runtime::get_key(INSTALLER)
                    .unwrap_or_revert_with(NFTCoreError::MissingInstallerKey)
                    .into_account()
                    .unwrap_or_revert_with(NFTCoreError::FailedToConvertToAccountHash);

                // Revert if private minting is required and caller is not installer.
                if runtime::get_caller() != installer_account {
                    runtime::revert(NFTCoreError::InvalidMinter)
                }
            }
            _ => runtime::revert(NFTCoreError::InvalidKey),
        }
    }

    // The contract's ownership behavior (determined at installation) determines,
    // who owns the NFT we are about to mint.()
    let ownership_mode = utils::get_ownership_mode().unwrap_or_revert();
    let caller = utils::get_verified_caller().unwrap_or_revert();
    let token_owner_key: Key =
        if let OwnershipMode::Assigned | OwnershipMode::Transferable = ownership_mode {
            runtime::get_named_arg(ARG_TOKEN_OWNER)
        } else {
            caller
        };

    let metadata_kind: NFTMetadataKind = utils::get_stored_value_with_user_errors::<u8>(
        NFT_METADATA_KIND,
        NFTCoreError::MissingNFTMetadataKind,
        NFTCoreError::InvalidNFTMetadataKind,
    )
    .try_into()
    .unwrap_or_revert();

    let token_metadata = utils::get_named_arg_with_user_errors::<String>(
        ARG_TOKEN_META_DATA,
        NFTCoreError::MissingTokenMetaData,
        NFTCoreError::InvalidTokenMetaData,
    )
    .unwrap_or_revert();

    // Get token metadata if valid.
    let metadata = metadata::validate_metadata(&metadata_kind, token_metadata).unwrap_or_revert();

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    // This is the token ID.
    let token_identifier: TokenIdentifier = match identifier_mode {
        NFTIdentifierMode::Ordinal => TokenIdentifier::Index(next_index),
        NFTIdentifierMode::Hash => {
            TokenIdentifier::Hash(base16::encode_lower(&runtime::blake2b(&metadata)))
        }
    };

    utils::upsert_dictionary_value_from_key(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
        token_owner_key,
    );
    utils::upsert_dictionary_value_from_key(
        TOKEN_ISSUERS,
        &token_identifier.get_dictionary_item_key(),
        token_owner_key,
    );
    utils::upsert_dictionary_value_from_key(
        &metadata::get_metadata_dictionary_name(&metadata_kind),
        &token_identifier.get_dictionary_item_key(),
        metadata,
    );

    let owned_tokens_item_key = utils::get_owned_tokens_dictionary_item_key(token_owner_key);

    let owned_tokens_actual_key = Key::dictionary(
        utils::get_uref(
            OWNED_TOKENS,
            NFTCoreError::MissingOwnedTokens,
            NFTCoreError::InvalidOwnedTokens,
        ),
        owned_tokens_item_key.as_bytes(),
    );

    // Update owned tokens dictionary
    let maybe_owned_tokens: Option<Vec<TokenIdentifier>> = {
        match identifier_mode {
            NFTIdentifierMode::Ordinal => utils::get_dictionary_value_from_key::<Vec<u64>>(
                OWNED_TOKENS,
                &owned_tokens_item_key,
            )
            .map(|token_indices| {
                token_indices
                    .into_iter()
                    .map(TokenIdentifier::new_index)
                    .collect()
            }),
            NFTIdentifierMode::Hash => utils::get_dictionary_value_from_key::<Vec<String>>(
                OWNED_TOKENS,
                &owned_tokens_item_key,
            )
            .map(|token_hashes| {
                token_hashes
                    .into_iter()
                    .map(TokenIdentifier::new_hash)
                    .collect()
            }),
        }
    };

    // Update the value in the owned_tokens dictionary.
    match maybe_owned_tokens {
        Some(mut owned_tokens) => {
            // Check that we are not minting a duplicate token.
            if owned_tokens.contains(&token_identifier) {
                runtime::revert(NFTCoreError::FatalTokenIdDuplication);
            }

            owned_tokens.push(token_identifier.clone());
            match identifier_mode {
                NFTIdentifierMode::Ordinal => {
                    let token_indices: Vec<u64> = owned_tokens
                        .into_iter()
                        .map(|identifier| identifier.get_index().unwrap_or_revert())
                        .collect();
                    utils::upsert_dictionary_value_from_key(
                        OWNED_TOKENS,
                        &owned_tokens_item_key,
                        token_indices,
                    )
                }
                NFTIdentifierMode::Hash => {
                    let token_hashes: Vec<String> = owned_tokens
                        .into_iter()
                        .map(|identifier| identifier.get_hash().unwrap_or_revert())
                        .collect();
                    utils::upsert_dictionary_value_from_key(
                        OWNED_TOKENS,
                        &owned_tokens_item_key,
                        token_hashes,
                    )
                }
            }
        }
        None => {
            match identifier_mode {
                NFTIdentifierMode::Ordinal => utils::upsert_dictionary_value_from_key(
                    OWNED_TOKENS,
                    &owned_tokens_item_key,
                    vec![token_identifier.get_index().unwrap_or_revert()],
                ),
                NFTIdentifierMode::Hash => utils::upsert_dictionary_value_from_key(
                    OWNED_TOKENS,
                    &owned_tokens_item_key,
                    vec![token_identifier.clone().get_hash().unwrap_or_revert()],
                ),
            };
        }
    };

    //Increment the count of owned tokens.
    let updated_token_count =
        match utils::get_dictionary_value_from_key::<u64>(TOKEN_COUNTS, &owned_tokens_item_key) {
            Some(balance) => balance + 1u64,
            None => 1u64,
        };
    utils::upsert_dictionary_value_from_key(
        TOKEN_COUNTS,
        &owned_tokens_item_key,
        updated_token_count,
    );

    // Increment number_of_minted_tokens by one
    next_index += 1u64;
    let number_of_minted_tokens_uref = utils::get_uref(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingTotalTokenSupply,
        NFTCoreError::InvalidTotalTokenSupply,
    );
    storage::write(number_of_minted_tokens_uref, next_index);

    let receipt_name = utils::get_stored_value_with_user_errors::<String>(
        RECEIPT_NAME,
        NFTCoreError::MissingReceiptName,
        NFTCoreError::InvalidReceiptName,
    );

    let token_identifier_string = token_identifier.get_dictionary_item_key();

    let receipt = CLValue::from_t((
        receipt_name,
        owned_tokens_actual_key,
        token_identifier_string,
    ))
    .unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);
    runtime::ret(receipt)
}

// Marks token as burnt. This blocks any future call to transfer token.
#[no_mangle]
pub extern "C" fn burn() {
    if let BurnMode::NonBurnable = utils::get_burn_mode() {
        runtime::revert(NFTCoreError::InvalidBurnMode)
    }

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    let expected_token_owner: Key = utils::get_verified_caller().unwrap_or_revert();

    // Revert if caller is not token_owner. This seems to be the only check we need to do.
    let token_owner = match utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
    ) {
        Some(token_owner_key) => {
            if token_owner_key != expected_token_owner {
                runtime::revert(NFTCoreError::InvalidTokenOwner)
            }
            token_owner_key
        }
        None => runtime::revert(NFTCoreError::InvalidTokenIdentifier),
    };

    // It makes sense to keep this token as owned by the caller. It just happens that the caller
    // owns a burnt token. That's all. Similarly, we should probably also not change the
    // owned_tokens dictionary.
    if utils::is_token_burned(&token_identifier) {
        runtime::revert(NFTCoreError::PreviouslyBurntToken)
    }

    // Mark the token as burnt by adding the token_id to the burnt tokens dictionary.
    utils::upsert_dictionary_value_from_key::<()>(
        BURNT_TOKENS,
        &token_identifier.get_dictionary_item_key(),
        (),
    );

    let owned_tokens_item_key = utils::get_owned_tokens_dictionary_item_key(token_owner);

    let updated_balance =
        match utils::get_dictionary_value_from_key::<u64>(TOKEN_COUNTS, &owned_tokens_item_key) {
            Some(balance) => {
                if balance > 0u64 {
                    balance - 1u64
                } else {
                    // This should never happen if contract is implemented correctly.
                    runtime::revert(NFTCoreError::FatalTokenIdDuplication);
                }
            }
            None => {
                // This should never happen if contract is implemented correctly.
                runtime::revert(NFTCoreError::FatalTokenIdDuplication);
            }
        };

    utils::upsert_dictionary_value_from_key(TOKEN_COUNTS, &owned_tokens_item_key, updated_balance);
}

// approve marks a token as approved for transfer by an account
#[no_mangle]
pub extern "C" fn approve() {
    // If we are in minter or assigned mode it makes no sense to approve an operator. Hence we
    // revert.
    if let OwnershipMode::Minter | OwnershipMode::Assigned =
        utils::get_ownership_mode().unwrap_or_revert()
    {
        runtime::revert(NFTCoreError::InvalidOwnershipMode)
    }

    let caller: Key = utils::get_verified_caller().unwrap_or_revert();

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);
    let token_identifier_dictionary_key = token_identifier.get_dictionary_item_key();

    let number_of_minted_tokens = utils::get_stored_value_with_user_errors::<u64>(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingNumberOfMintedTokens,
        NFTCoreError::InvalidNumberOfMintedTokens,
    );

    if let NFTIdentifierMode::Ordinal = identifier_mode {
        // Revert if token_id is out of bounds
        if let TokenIdentifier::Index(index) = &token_identifier {
            if *index >= number_of_minted_tokens {
                runtime::revert(NFTCoreError::InvalidTokenIdentifier);
            }
        }
    }

    let token_owner_key = match utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier_dictionary_key,
    ) {
        Some(token_owner) => token_owner,
        None => runtime::revert(NFTCoreError::InvalidAccountHash),
    };

    // Revert if caller is not the token_owner. Only the token owner can approve an operator
    if token_owner_key != caller {
        runtime::revert(NFTCoreError::InvalidAccountHash);
    }

    // We assume a burnt token cannot be approved
    if utils::is_token_burned(&token_identifier) {
        runtime::revert(NFTCoreError::PreviouslyBurntToken)
    }

    let operator = utils::get_named_arg_with_user_errors::<Key>(
        ARG_OPERATOR,
        NFTCoreError::MissingApprovedAccountHash,
        NFTCoreError::InvalidApprovedAccountHash,
    )
    .unwrap_or_revert();

    // If token_owner tries to approve themselves that's probably a mistake and we revert.
    if token_owner_key == operator {
        runtime::revert(NFTCoreError::InvalidAccount);
    }

    let approved_uref = utils::get_uref(
        OPERATOR,
        NFTCoreError::MissingStorageUref,
        NFTCoreError::InvalidStorageUref,
    );

    storage::dictionary_put(
        approved_uref,
        &token_identifier_dictionary_key,
        Some(operator),
    );
}

// Approves the specified operator for transfer token_owner's tokens.
#[no_mangle]
pub extern "C" fn set_approval_for_all() {
    // If we are in minter or assigned mode it makes no sense to approve an operator. Hence we
    // revert.
    if let OwnershipMode::Minter | OwnershipMode::Assigned =
        utils::get_ownership_mode().unwrap_or_revert()
    {
        runtime::revert(NFTCoreError::InvalidOwnershipMode)
    }
    // If approve_all is true we approve operator for all caller_owned tokens.
    // If false we set operator to None for all caller_owned_tokens
    let approve_all = utils::get_named_arg_with_user_errors::<bool>(
        ARG_APPROVE_ALL,
        NFTCoreError::MissingApproveAll,
        NFTCoreError::InvalidApproveAll,
    )
    .unwrap_or_revert();

    let operator = utils::get_named_arg_with_user_errors::<Key>(
        ARG_OPERATOR,
        NFTCoreError::MissingOperator,
        NFTCoreError::InvalidOperator,
    )
    .unwrap_or_revert();

    let caller: Key = utils::get_verified_caller().unwrap_or_revert();

    let caller_dictionary_item_key = utils::get_owned_tokens_dictionary_item_key(caller);

    let approved_uref = utils::get_uref(
        OPERATOR,
        NFTCoreError::MissingStorageUref,
        NFTCoreError::InvalidStorageUref,
    );

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let maybe_owned_tokens: Option<Vec<TokenIdentifier>> = match identifier_mode {
        NFTIdentifierMode::Ordinal => utils::get_dictionary_value_from_key::<Vec<u64>>(
            OWNED_TOKENS,
            &caller_dictionary_item_key,
        )
        .map(|token_hashes| {
            token_hashes
                .into_iter()
                .map(TokenIdentifier::new_index)
                .collect()
        }),
        NFTIdentifierMode::Hash => utils::get_dictionary_value_from_key::<Vec<String>>(
            OWNED_TOKENS,
            &caller_dictionary_item_key,
        )
        .map(|token_hashes| {
            token_hashes
                .into_iter()
                .map(TokenIdentifier::new_hash)
                .collect()
        }),
    };

    if let Some(owned_tokens) = maybe_owned_tokens {
        // Depending on approve_all we either approve all or disapprove all.
        for token_id in owned_tokens {
            // We assume a burnt token cannot be approved
            if utils::is_token_burned(&token_id) {
                runtime::revert(NFTCoreError::PreviouslyBurntToken)
            }
            if approve_all {
                storage::dictionary_put(
                    approved_uref,
                    &token_id.get_dictionary_item_key(),
                    Some(operator),
                );
            } else {
                storage::dictionary_put(
                    approved_uref,
                    &token_id.get_dictionary_item_key(),
                    Option::<Key>::None,
                );
            }
        }
    };
}

// Transfers token from token_owner to specified account. Transfer will go through if caller is
// owner or an approved operator. Transfer will fail if OwnershipMode is Minter or Assigned.
#[no_mangle]
pub extern "C" fn transfer() {
    // If we are in minter or assigned mode we are not allowed to transfer ownership of token, hence
    // we revert.
    if let OwnershipMode::Minter | OwnershipMode::Assigned =
        utils::get_ownership_mode().unwrap_or_revert()
    {
        runtime::revert(NFTCoreError::InvalidOwnershipMode)
    }

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    // We assume we cannot transfer burnt tokens
    if utils::is_token_burned(&token_identifier) {
        runtime::revert(NFTCoreError::PreviouslyBurntToken)
    }

    let token_owner_key = match utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
    ) {
        Some(token_owner) => token_owner,
        None => runtime::revert(NFTCoreError::InvalidTokenIdentifier),
    };

    let source_key = utils::get_named_arg_with_user_errors::<Key>(
        ARG_SOURCE_KEY,
        NFTCoreError::MissingAccountHash,
        NFTCoreError::InvalidAccountHash,
    )
    .unwrap_or_revert();

    if source_key != token_owner_key {
        runtime::revert(NFTCoreError::InvalidAccount);
    }

    let caller = utils::get_verified_caller().unwrap_or_revert();

    // Check if caller is approved to execute transfer
    let is_approved = match utils::get_dictionary_value_from_key::<Option<Key>>(
        OPERATOR,
        &token_identifier.get_dictionary_item_key(),
    ) {
        Some(Some(approved_key)) => approved_key == caller,
        Some(None) | None => false,
    };

    // Revert if caller is not owner and not approved.
    if caller != token_owner_key && !is_approved {
        runtime::revert(NFTCoreError::InvalidTokenOwner);
    }

    let target_owner_key: Key = utils::get_named_arg_with_user_errors(
        ARG_TARGET_KEY,
        NFTCoreError::MissingAccountHash,
        NFTCoreError::InvalidAccountHash,
    )
    .unwrap_or_revert();

    let target_owner_item_key = utils::get_owned_tokens_dictionary_item_key(target_owner_key);
    let source_owner_item_key = utils::get_owned_tokens_dictionary_item_key(source_key);

    // Updated token_owners dictionary. Revert if token_owner not found.
    match utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
    ) {
        Some(token_actual_owner) => {
            if token_actual_owner != source_key {
                runtime::revert(NFTCoreError::InvalidTokenOwner)
            }
            utils::upsert_dictionary_value_from_key(
                TOKEN_OWNERS,
                &token_identifier.get_dictionary_item_key(),
                target_owner_key,
            );
        }
        None => runtime::revert(NFTCoreError::InvalidTokenIdentifier),
    }

    // Update to_account owned_tokens. Revert if owned_tokens list is not found
    match utils::get_token_identifiers_from_dictionary(&identifier_mode, &source_owner_item_key) {
        Some(mut owned_tokens) => {
            // Check that token_id is in owned tokens list. If so remove token_id from list
            // If not revert.
            if let Some(id) = owned_tokens.iter().position(|id| *id == token_identifier) {
                owned_tokens.remove(id);
            } else {
                runtime::revert(NFTCoreError::InvalidTokenOwner)
            }
            utils::upsert_token_identifiers(&identifier_mode, &source_owner_item_key, owned_tokens)
                .unwrap_or_revert();
        }
        None => runtime::revert(NFTCoreError::InvalidTokenIdentifier),
    }

    // Update the from_account balance
    let updated_from_account_balance =
        match utils::get_dictionary_value_from_key::<u64>(TOKEN_COUNTS, &source_owner_item_key) {
            Some(balance) => {
                if balance > 0u64 {
                    balance - 1u64
                } else {
                    // This should never happen...
                    runtime::revert(NFTCoreError::FatalTokenIdDuplication);
                }
            }
            None => {
                // This should never happen...
                runtime::revert(NFTCoreError::FatalTokenIdDuplication);
            }
        };
    utils::upsert_dictionary_value_from_key(
        TOKEN_COUNTS,
        &source_owner_item_key,
        updated_from_account_balance,
    );

    // Update to_account owned_tokens
    match utils::get_token_identifiers_from_dictionary(&identifier_mode, &target_owner_item_key) {
        Some(mut owned_tokens) => {
            if owned_tokens.iter().any(|id| *id == token_identifier) {
                runtime::revert(NFTCoreError::FatalTokenIdDuplication)
            } else {
                owned_tokens.push(token_identifier.clone());
            }
            utils::upsert_token_identifiers(&identifier_mode, &target_owner_item_key, owned_tokens)
                .unwrap_or_revert();
        }
        None => {
            let owned_tokens = vec![token_identifier.clone()];
            utils::upsert_token_identifiers(&identifier_mode, &target_owner_item_key, owned_tokens)
                .unwrap_or_revert();
        }
    }

    // Update the to_account balance
    let updated_to_account_balance =
        match utils::get_dictionary_value_from_key::<u64>(TOKEN_COUNTS, &target_owner_item_key) {
            Some(balance) => balance + 1u64,
            None => 1u64,
        };
    utils::upsert_dictionary_value_from_key(
        TOKEN_COUNTS,
        &target_owner_item_key,
        updated_to_account_balance,
    );

    let approved_uref = utils::get_uref(
        OPERATOR,
        NFTCoreError::MissingStorageUref,
        NFTCoreError::InvalidStorageUref,
    );

    storage::dictionary_put(
        approved_uref,
        &token_identifier.get_dictionary_item_key(),
        Option::<Key>::None,
    );

    let owned_tokens_actual_key = Key::dictionary(
        utils::get_uref(
            OWNED_TOKENS,
            NFTCoreError::MissingOwnedTokens,
            NFTCoreError::InvalidOwnedTokens,
        ),
        source_owner_item_key.as_bytes(),
    );

    let receipt_name = utils::get_stored_value_with_user_errors::<String>(
        RECEIPT_NAME,
        NFTCoreError::MissingReceiptName,
        NFTCoreError::InvalidReceiptName,
    );

    let receipt = CLValue::from_t((receipt_name, owned_tokens_actual_key))
        .unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);
    runtime::ret(receipt)
}

// Returns the length of the Vec<String> in OWNED_TOKENS dictionary. If key is not found
// it returns 0.
#[no_mangle]
pub extern "C" fn balance_of() {
    let owner_key = utils::get_named_arg_with_user_errors::<Key>(
        ARG_TOKEN_OWNER,
        NFTCoreError::MissingAccountHash,
        NFTCoreError::InvalidAccountHash,
    )
    .unwrap_or_revert();

    let owner_key_item_string = utils::get_owned_tokens_dictionary_item_key(owner_key);

    let balance = utils::get_dictionary_value_from_key::<u64>(TOKEN_COUNTS, &owner_key_item_string)
        .unwrap_or(0u64);

    let balance_cl_value =
        CLValue::from_t(balance).unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);
    runtime::ret(balance_cl_value);
}

#[no_mangle]
pub extern "C" fn owner_of() {
    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    let number_of_minted_tokens = utils::get_stored_value_with_user_errors::<u64>(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingNumberOfMintedTokens,
        NFTCoreError::InvalidNumberOfMintedTokens,
    );

    if let NFTIdentifierMode::Ordinal = identifier_mode {
        // Revert if token_id is out of bounds
        if token_identifier.get_index().unwrap_or_revert() >= number_of_minted_tokens {
            runtime::revert(NFTCoreError::InvalidTokenIdentifier);
        }
    }

    let maybe_token_owner = utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
    );

    let token_owner = match maybe_token_owner {
        Some(token_owner) => token_owner,
        None => runtime::revert(NFTCoreError::InvalidTokenIdentifier),
    };

    let token_owner_cl_value =
        CLValue::from_t(token_owner).unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);

    runtime::ret(token_owner_cl_value);
}

#[no_mangle]
pub extern "C" fn metadata() {
    let number_of_minted_tokens = utils::get_stored_value_with_user_errors::<u64>(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingNumberOfMintedTokens,
        NFTCoreError::InvalidNumberOfMintedTokens,
    );

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    if let NFTIdentifierMode::Ordinal = identifier_mode {
        // Revert if token_id is out of bounds
        if token_identifier.get_index().unwrap_or_revert() >= number_of_minted_tokens {
            runtime::revert(NFTCoreError::InvalidTokenIdentifier);
        }
    }

    let metadata_kind: NFTMetadataKind = utils::get_stored_value_with_user_errors::<u8>(
        METADATA_SCHEMA,
        NFTCoreError::MissingNFTMetadataKind,
        NFTCoreError::InvalidNFTMetadataKind,
    )
    .try_into()
    .unwrap_or_revert();

    let maybe_token_metadata = utils::get_dictionary_value_from_key::<String>(
        &metadata::get_metadata_dictionary_name(&metadata_kind),
        &token_identifier.get_dictionary_item_key(),
    );

    if let Some(metadata) = maybe_token_metadata {
        let metadata_cl_value =
            CLValue::from_t(metadata).unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);
        runtime::ret(metadata_cl_value);
    } else {
        runtime::revert(NFTCoreError::InvalidTokenIdentifier)
    }
}

// Returns approved account_hash from token_id, throws error if token id is not valid
#[no_mangle]
pub extern "C" fn get_approved() {
    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    // Revert if token_id is out of bounds.
    let number_of_minted_tokens = utils::get_stored_value_with_user_errors::<u64>(
        NUMBER_OF_MINTED_TOKENS,
        NFTCoreError::MissingNumberOfMintedTokens,
        NFTCoreError::InvalidNumberOfMintedTokens,
    );

    if let NFTIdentifierMode::Ordinal = identifier_mode {
        // Revert if token_id is out of bounds
        if token_identifier.get_index().unwrap_or_revert() >= number_of_minted_tokens {
            runtime::revert(NFTCoreError::InvalidTokenIdentifier);
        }
    }

    // Revert if already burnt
    if utils::is_token_burned(&token_identifier) {
        runtime::revert(NFTCoreError::PreviouslyBurntToken)
    }

    let maybe_approved = match utils::get_dictionary_value_from_key::<Option<Key>>(
        OPERATOR,
        &token_identifier.get_dictionary_item_key(),
    ) {
        Some(maybe_approved) => maybe_approved,
        None => None,
    };

    let approved_cl_value = CLValue::from_t(maybe_approved)
        .unwrap_or_revert_with(NFTCoreError::FailedToConvertToCLValue);

    runtime::ret(approved_cl_value);
}

#[no_mangle]
pub extern "C" fn set_token_metadata() {
    let metadata_mutability: MetadataMutability = utils::get_stored_value_with_user_errors::<u8>(
        METADATA_MUTABILITY,
        NFTCoreError::MissingMetadataMutability,
        NFTCoreError::InvalidMetadataMutability,
    )
    .try_into()
    .unwrap_or_revert();

    if let MetadataMutability::Immutable = metadata_mutability {
        runtime::revert(NFTCoreError::ForbiddenMetadataUpdate)
    }

    let identifier_mode: NFTIdentifierMode = utils::get_stored_value_with_user_errors::<u8>(
        IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .try_into()
    .unwrap_or_revert();

    let token_identifier = utils::get_token_identifier_from_runtime_args(&identifier_mode);

    let token_owner = utils::get_dictionary_value_from_key::<Key>(
        TOKEN_OWNERS,
        &token_identifier.get_dictionary_item_key(),
    );

    if let Some(token_owner_key) = token_owner {
        let caller = utils::get_verified_caller().unwrap_or_revert();
        if caller != token_owner_key {
            runtime::revert(NFTCoreError::InvalidTokenOwner)
        }
    } else {
        runtime::revert(NFTCoreError::InvalidTokenIdentifier)
    }

    let metadata_kind: NFTMetadataKind = utils::get_stored_value_with_user_errors::<u8>(
        NFT_METADATA_KIND,
        NFTCoreError::MissingNFTMetadataKind,
        NFTCoreError::InvalidNFTMetadataKind,
    )
    .try_into()
    .unwrap_or_revert();

    let updated_token_metadata: String = utils::get_named_arg_with_user_errors::<String>(
        ARG_TOKEN_META_DATA,
        NFTCoreError::MissingTokenMetaData,
        NFTCoreError::InvalidTokenMetaData,
    )
    .unwrap_or_revert();

    let updated_metadata =
        metadata::validate_metadata(&metadata_kind, updated_token_metadata).unwrap_or_revert();

    utils::upsert_dictionary_value_from_key(
        &metadata::get_metadata_dictionary_name(&metadata_kind),
        &token_identifier.get_dictionary_item_key(),
        updated_metadata,
    );
}

fn install_nft_contract() -> (ContractHash, ContractVersion) {
    let entry_points = {
        let mut entry_points = EntryPoints::new();

        // This entrypoint initializes the contract and is required to be called during the session
        // where the contract is installed; immediately after the contract has been installed but
        // before exiting session. All parameters are required.
        // This entrypoint is intended to be called exactly once and will error if called more than
        // once.
        let init_contract = EntryPoint::new(
            ENTRY_POINT_INIT,
            vec![
                Parameter::new(ARG_COLLECTION_NAME, CLType::String),
                Parameter::new(ARG_COLLECTION_SYMBOL, CLType::String),
                Parameter::new(ARG_TOTAL_TOKEN_SUPPLY, CLType::U64),
                Parameter::new(ARG_ALLOW_MINTING, CLType::Bool),
                Parameter::new(ARG_MINTING_MODE, CLType::U8),
                Parameter::new(ARG_OWNERSHIP_MODE, CLType::U8),
                Parameter::new(ARG_NFT_KIND, CLType::U8),
                Parameter::new(ARG_HOLDER_MODE, CLType::U8),
                Parameter::new(ARG_WHITELIST_MODE, CLType::U8),
                Parameter::new(
                    ARG_CONTRACT_WHITELIST,
                    CLType::List(Box::new(CLType::ByteArray(32u32))),
                ),
                Parameter::new(ARG_JSON_SCHEMA, CLType::String),
                Parameter::new(ARG_RECEIPT_NAME, CLType::String),
                Parameter::new(ARG_IDENTIFIER_MODE, CLType::U8),
                Parameter::new(ARG_BURN_MODE, CLType::U8),
            ],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint exposes all variables that can be changed by managing account post
        // installation. Meant to be called by the managing account (INSTALLER) post
        // installation if a variable needs to be changed. Each parameter of the entrypoint
        // should only be passed if that variable is changed.
        // For instance if the allow_minting variable is being changed and nothing else
        // the managing account would send the new allow_minting value as the only argument.
        // If no arguments are provided it is essentially a no-operation, however there
        // is still a gas cost.
        // By switching allow_minting to false we pause minting.
        let set_variables = EntryPoint::new(
            ENTRY_POINT_SET_VARIABLES,
            vec![
                Parameter::new(ARG_ALLOW_MINTING, CLType::Bool),
                Parameter::new(
                    ARG_CONTRACT_WHITELIST,
                    CLType::List(Box::new(CLType::ByteArray(32u32))),
                ),
            ],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint mints a new token with provided metadata.
        // Meant to be called post installation.
        // Reverts with MintingIsPaused error if allow_minting is false.
        // When a token is minted the calling account is listed as its owner and the token is
        // automatically assigned an U64 ID equal to the current number_of_minted_tokens.
        // Before minting the token the entrypoint checks if number_of_minted_tokens
        // exceed the total_token_supply. If so, it reverts the minting with an error
        // TokenSupplyDepleted. The mint entrypoint also checks whether the calling account
        // is the managing account (the installer) If not, and if public_minting is set to
        // false, it reverts with the error InvalidAccount. The newly minted token is
        // automatically assigned a U64 ID equal to the current number_of_minted_tokens. The
        // account is listed as the token owner, as well as added to the accounts list of owned
        // tokens. After minting is successful the number_of_minted_tokens is incremented by
        // one.
        let mint = EntryPoint::new(
            ENTRY_POINT_MINT,
            vec![
                Parameter::new(ARG_TOKEN_OWNER, CLType::Key),
                Parameter::new(ARG_TOKEN_META_DATA, CLType::String),
            ],
            CLType::Tuple3([
                Box::new(CLType::String),
                Box::new(CLType::Key),
                Box::new(CLType::String),
            ]),
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint burns the token with provided token_id argument, after which it is no
        // longer possible to transfer it.
        // Looks up the owner of the supplied token_id arg. If caller is not owner we revert with
        // error InvalidTokenOwner. If token id is invalid (e.g. out of bounds) it reverts
        // with error  InvalidTokenID. If token is listed as already burnt we revert with
        // error PreviouslyBurntTOken. If not the token is then registered as burnt.
        let burn = EntryPoint::new(
            ENTRY_POINT_BURN,
            vec![],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint transfers ownership of token from one account to another.
        // It looks up the owner of the supplied token_id arg. Revert if token is already burnt,
        // token_id is invalid, or if caller is not owner and not approved operator.
        // If token id is invalid it reverts with error InvalidTokenID.
        let transfer = EntryPoint::new(
            ENTRY_POINT_TRANSFER,
            vec![
                Parameter::new(ARG_SOURCE_KEY, CLType::Key),
                Parameter::new(ARG_TARGET_KEY, CLType::Key),
            ],
            CLType::Tuple2([Box::new(CLType::String), Box::new(CLType::Key)]),
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint approves another account (an operator) to transfer tokens. It reverts
        // if token_id is invalid, if caller is not the owner, if token has already
        // been burnt, or if caller tries to approve themselves as an operator.
        let approve = EntryPoint::new(
            ENTRY_POINT_APPROVE,
            vec![Parameter::new(ARG_OPERATOR, CLType::Key)],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        let set_approval_for_all = EntryPoint::new(
            ENTRY_POINT_SET_APPROVE_FOR_ALL,
            vec![
                Parameter::new(ARG_TOKEN_OWNER, CLType::Key),
                Parameter::new(ARG_APPROVE_ALL, CLType::Bool),
                Parameter::new(ARG_OPERATOR, CLType::Key),
            ],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint returns the token owner given a token_id. It reverts if token_id
        // is invalid. A burnt token still has an associated owner.
        let owner_of = EntryPoint::new(
            ENTRY_POINT_OWNER_OF,
            vec![],
            CLType::Key,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint returns the operator (if any) associated with the provided token_id
        // Reverts if token has been burnt.
        let get_approved = EntryPoint::new(
            ENTRY_POINT_GET_APPROVED,
            vec![],
            CLType::Option(Box::new(CLType::Key)),
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint returns number of owned tokens associated with the provided account
        let balance_of = EntryPoint::new(
            ENTRY_POINT_BALANCE_OF,
            vec![Parameter::new(ARG_TOKEN_OWNER, CLType::Key)],
            CLType::U64,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint returns the metadata associated with the provided token_id
        let metadata = EntryPoint::new(
            ENTRY_POINT_METADATA,
            vec![],
            CLType::String,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        // This entrypoint updates the metadata if valid.
        let set_token_metadata = EntryPoint::new(
            ENTRY_POINT_SET_TOKEN_METADATA,
            vec![Parameter::new(ARG_TOKEN_META_DATA, CLType::String)],
            CLType::Unit,
            EntryPointAccess::Public,
            EntryPointType::Contract,
        );

        entry_points.add_entry_point(init_contract);
        entry_points.add_entry_point(set_variables);
        entry_points.add_entry_point(mint);
        entry_points.add_entry_point(burn);
        entry_points.add_entry_point(transfer);
        entry_points.add_entry_point(approve);
        entry_points.add_entry_point(owner_of);
        entry_points.add_entry_point(balance_of);
        entry_points.add_entry_point(get_approved);
        entry_points.add_entry_point(metadata);
        entry_points.add_entry_point(set_approval_for_all);
        entry_points.add_entry_point(set_token_metadata);
        entry_points
    };

    let named_keys = {
        let mut named_keys = NamedKeys::new();
        named_keys.insert(INSTALLER.to_string(), runtime::get_caller().into());

        named_keys
    };

    storage::new_contract(
        entry_points,
        Some(named_keys),
        Some(HASH_KEY_NAME.to_string()),
        Some(ACCESS_KEY_NAME.to_string()),
    )
}

#[no_mangle]
pub extern "C" fn call() {
    // Represents the name of the NFT collection
    // This value cannot be changed after installation.
    let collection_name: String = utils::get_named_arg_with_user_errors(
        ARG_COLLECTION_NAME,
        NFTCoreError::MissingCollectionName,
        NFTCoreError::InvalidCollectionName,
    )
    .unwrap_or_revert();

    // TODO: figure out examples of collection_symbol
    // The symbol for the NFT collection.
    // This value cannot be changed after installation.
    let collection_symbol: String = utils::get_named_arg_with_user_errors(
        ARG_COLLECTION_SYMBOL,
        NFTCoreError::MissingCollectionSymbol,
        NFTCoreError::InvalidCollectionSymbol,
    )
    .unwrap_or_revert();

    // This represents the total number of NFTs that will
    // be minted by a specific instance of a contract.
    // This value cannot be changed after installation.
    let total_token_supply: u64 = utils::get_named_arg_with_user_errors(
        ARG_TOTAL_TOKEN_SUPPLY,
        NFTCoreError::MissingTotalTokenSupply,
        NFTCoreError::InvalidTotalTokenSupply,
    )
    .unwrap_or_revert();

    let allow_minting: bool = utils::get_optional_named_arg_with_user_errors(
        ARG_ALLOW_MINTING,
        NFTCoreError::InvalidMintingStatus,
    )
    .unwrap_or(true);

    // Represents the modes in which NFTs can be minted, i.e whether a singular known
    // entity v. users interacting with the contract. Refer to the `MintingMode`
    // enum in the `src/modalities.rs` file for details.
    // This value cannot be changed after installation.
    let minting_mode: u8 = utils::get_optional_named_arg_with_user_errors(
        ARG_MINTING_MODE,
        NFTCoreError::InvalidMintingMode,
    )
    .unwrap_or(0);

    // Represents the ownership model of the NFTs that will be minted
    // over the lifetime of the contract. Refer to the enum `OwnershipMode`
    // in the `src/modalities.rs` file for details.
    // This value cannot be changed after installation.
    let ownership_mode: u8 = utils::get_named_arg_with_user_errors(
        ARG_OWNERSHIP_MODE,
        NFTCoreError::MissingOwnershipMode,
        NFTCoreError::InvalidOwnershipMode,
    )
    .unwrap_or_revert();

    // Represents the type of NFT (i.e something physical/digital)
    // which will be minted over the lifetime of the contract.
    // Refer to the enum `NFTKind`
    // in the `src/modalities.rs` file for details.
    // This value cannot be changed after installation.
    let nft_kind: u8 = utils::get_named_arg_with_user_errors(
        ARG_NFT_KIND,
        NFTCoreError::MissingNftKind,
        NFTCoreError::InvalidNftKind,
    )
    .unwrap_or_revert();

    // Represents whether Accounts or Contracts, or both can hold NFTs for
    // a given contract instance. Refer to the enum `NFTHolderMode`
    // in the `src/modalities.rs` file for details.
    // This value cannot be changed after installation
    let holder_mode: u8 = utils::get_optional_named_arg_with_user_errors(
        ARG_HOLDER_MODE,
        NFTCoreError::InvalidHolderMode,
    )
    .unwrap_or(2u8);

    // Represents whether a given contract whitelist can be modified
    // for a given NFT contract instance. If not provided as an argument
    // it will default to unlocked.
    // This value cannot be changed after installation
    let whitelist_lock: u8 = utils::get_optional_named_arg_with_user_errors(
        ARG_WHITELIST_MODE,
        NFTCoreError::InvalidWhitelistMode,
    )
    .unwrap_or(0u8);

    // A whitelist of contract hashes specifying which contracts can mint
    // NFTs in the contract holder mode with restricted minting.
    // This value can only be modified if the whitelist lock is
    // set to be unlocked.
    let contract_white_list: Vec<ContractHash> = utils::get_optional_named_arg_with_user_errors(
        ARG_CONTRACT_WHITELIST,
        NFTCoreError::InvalidContractWhitelist,
    )
    .unwrap_or_default();

    // Represents the schema for the metadata for a given NFT contract instance.
    // Refer to the `NFTMetadataKind` enum in src/utils for details.
    // This value cannot be changed after installation.
    let nft_metadata_kind: u8 = utils::get_named_arg_with_user_errors(
        ARG_NFT_METADATA_KIND,
        NFTCoreError::MissingNFTMetadataKind,
        NFTCoreError::InvalidNFTMetadataKind,
    )
    .unwrap_or_revert();

    // The JSON schema representation of the NFT which will be minted.
    // This value cannot be changed after installation.
    let json_schema: String = utils::get_named_arg_with_user_errors(
        ARG_JSON_SCHEMA,
        NFTCoreError::MissingJsonSchema,
        NFTCoreError::InvalidJsonSchema,
    )
    .unwrap_or_revert();

    // Represents whether NFTs minted by a given contract will be identified
    // by an ordinal u64 index or a base16 encoded SHA256 hash of an NFTs metadata.
    // This value cannot be changed after installation. Refer to `NFTIdentifierMode` in
    // `src/modalities.rs` for further details.
    let identifier_mode: u8 = utils::get_named_arg_with_user_errors(
        ARG_IDENTIFIER_MODE,
        NFTCoreError::MissingIdentifierMode,
        NFTCoreError::InvalidIdentifierMode,
    )
    .unwrap_or_revert();

    // Represents whether the metadata related to NFTs can be updated.
    // This value cannot be changed after installation. Refer to `MetadataMutability` in
    // `src/modalities.rs` for further details.
    let metadata_mutability: u8 = utils::get_named_arg_with_user_errors(
        ARG_METADATA_MUTABILITY,
        NFTCoreError::MissingMetadataMutability,
        NFTCoreError::InvalidMetadataMutability,
    )
    .unwrap_or_revert();

    if identifier_mode == 1 && metadata_mutability == 1 {
        runtime::revert(NFTCoreError::InvalidMetadataMutability)
    }

    // Represents whether the minted tokens can be burnt.
    // This value cannot be changed post installation. Refer to `BurnMode` in
    // `src/modalities.rs` for further details.
    let burn_mode: u8 = utils::get_optional_named_arg_with_user_errors(
        ARG_BURN_MODE,
        NFTCoreError::InvalidBurnMode,
    )
    .unwrap_or(0u8);

    let (contract_hash, contract_version) = install_nft_contract();

    // Store contract_hash and contract_version under the keys CONTRACT_NAME and CONTRACT_VERSION
    runtime::put_key(CONTRACT_NAME, contract_hash.into());
    runtime::put_key(CONTRACT_VERSION, storage::new_uref(contract_version).into());

    let package_hash: ContractPackageHash = runtime::get_key(HASH_KEY_NAME)
        .unwrap_or_revert()
        .into_hash()
        .map(ContractPackageHash::new)
        .unwrap();

    // A sentinel string value which represents the entry for the addition
    // of a read only reference to the NFTs owned by the calling `Account` or `Contract`
    // This allows for users to look up a set of named keys and correctly identify
    // the contract package from which the NFTs were obtained.
    let receipt_name = format!(
        "nft-{}-{}",
        collection_name,
        package_hash.to_formatted_string()
    );

    // Call contract to initialize it
    runtime::call_contract::<()>(
        contract_hash,
        ENTRY_POINT_INIT,
        runtime_args! {
             ARG_COLLECTION_NAME => collection_name,
             ARG_COLLECTION_SYMBOL => collection_symbol,
             ARG_TOTAL_TOKEN_SUPPLY => total_token_supply,
             ARG_ALLOW_MINTING => allow_minting,
             ARG_OWNERSHIP_MODE => ownership_mode,
             ARG_NFT_KIND => nft_kind,
             ARG_MINTING_MODE => minting_mode,
             ARG_HOLDER_MODE => holder_mode,
             ARG_WHITELIST_MODE => whitelist_lock,
             ARG_CONTRACT_WHITELIST => contract_white_list,
             ARG_JSON_SCHEMA => json_schema,
             ARG_RECEIPT_NAME => receipt_name,
             ARG_NFT_METADATA_KIND => nft_metadata_kind,
             ARG_IDENTIFIER_MODE => identifier_mode,
             ARG_METADATA_MUTABILITY => metadata_mutability,
             ARG_BURN_MODE => burn_mode
        },
    );
}

```

</details>

