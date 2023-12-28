# Types {#types}

The following definitions expand on parameters seen elsewhere within the SDK standard and are provided for clarity and completeness.

## Account {#account}

Structure representing a user's Account, stored in global state.

Required Parameters:

* [`account_hash`](#accounthash)

* [`action_thresholds`](#actionthresholds)

* [`associated_keys`](#associatedkey)

* [`main_purse`](#uref)

* [`named_keys`](#namedkey)

## AccountHash {#accounthash}

The AccountHash is a 32-byte hash derived from a supported PublicKey. Its role is to standardize keys that can vary in length.

## AccountIdentifier {#accountidentifier}

Identifier of an account.

Contains one of:

* [`PublicKey`](#publickey)

* [`AccountHash`](#accounthash)

## ActionThresholds {#actionthresholds}

Thresholds that have to be met when executing an action of a certain type.

Required Parameters:

* `deployment`

* `upgrade_management`

* `key_management`

## ActivationPoint {#activationpoint}

The first era to which the associated protocol version applies.

* [`era_id`](#eraid)

* [`timestamp`](#timestamp)

## AddressableEntity {#addressableentity}

* [`package_hash`](#packagehash)

* [`byte_code_hash`](#bytecodehash)

* [`named_keys`](#namedkeys)

* [`entry_points`](#array_of_namedentrypoint)

* [`protocol_version`](#protocolversion)

* [`main_purse`](#uref)

* [`associated_keys`](#associatedkeys)

* [`action_thresholds`](#actionthresholds)

* [`message_topics`](#array_of_messagetopic)

## AddressableEntityHash {#addressableentityhash}

The hex-encoded address of the addressable entity.

## Approval {#approval}

A struct containing a signature and the public key of the signer.

Required Parameters:

* [`signature`](#signature)

* [`signer`](#publickey)

## Array_of_AssociatedKey {#array-of-associatedkey}

An array of [AssociatedKeys](#associatedkey).

## Array_of_BlockProof {#array-of-blockproof}

An array of [`BlockProofs`](#blockproof).

## Array_of_EntityVersionAndHash {#array-of-entityversionandhash}

An array of [EntityVersionAndHashes](#entityversionandhash).

## Array_of_EraReward {#array-of-erareward}

An array of [EraRewards](#erareward).

## Array_of_MessageTopic {#array-of-messagetopic}

An array of [MessageTopics](#messagetopic).

## Array_of_NamedEntryPoint {#array-of-namedentrypoint}

An array of [named entry points](#namedentrypoint).

## Array_of_NamedKey {#array-of-namedkey}

An array of [NamedKeys](#namedkey).

## Array_of_NamedUserGroup {#array-of-namedusergroup}

An array of [NamedUserGroups](#namedusergroup).

## Array_of_PublicKeyAndBid {#array-of-publickeyandbid}

An array of [bids associated with give public keys](#publickeyandbid).

## Array_of_PublicKeyAndDelegator {#array-of-publickeyanddelegator}

An array consisting of [PublicKeyAndDelegators](#publickeyanddelegator).

## Array_of_ValidatorWeight {#array-of-validatorweight}

An array of [`ValidatorWeights`](#validatorweight).

## AssociatedKey {#associatedkey}

A key granted limited permissions to an Account, for purposes such as multisig.

Required Parameters:

* [`account_hash`](#accounthash)

* [`weight`](#weight)

## AssociatedKeys {#associatedkeys}

A [collection of weighted public keys](#array-of-associatedkey) (represented as account hashes) associated with an account.

## AuctionState {#auctionstate}

Data structure summarizing auction contract data.

Required Parameters:

* [`bids`](#jsonbids) All bids contained within a vector.

* `block_height` Block height.

* [`era_validators`](#jsoneravalidators) Era validators.

* [`state_root_hash`](#digest) Global state hash.

## AvailableBlockRange {#availableblockrange}

* `low` The inclusive lower bound of the range.

* `high` The inclusive upper bound of the range.

## Bid {#bid}

An entry in the validator map.

Required Parameters:

* [`bonding_purse`](#uref) The purse that was used for bonding.

* `delegation_rate` The delegation rate.

* [`delegators`](#delegator) The validator's delegators, indexed by their public keys.

* `inactive` `true` if validator has been "evicted".

* [`staked_amount`](#u512) The amount of tokens staked by a validator (not including delegators).

* [`validator_public_key`](#publickey) Validator's public key.

Additional Parameters:

* [`vesting_schedule`](#vestingschedule) Vesting schedule for a genesis validator. `None` if non-genesis validator.

## BidKind {#bidkind}

Auction bid variants.

One of:

* `Unified` A unified record indexed on validator data, with an embedded collection of all delegator bids assigned to that validator. The `Unified`` variant is for legacy retrograde support, new instances will not be created going forward.

* `Validator` A bid record containing only validator data.

* `Delegator` A bid record containing only delegator data.

## Block {#block}

A block after execution.

One of:

* [`Version1`](#blockv1)

* [`Version2`](#blockv2)

## BlockBodyV1 {#blockbodyv1}

The body portion of a block.

Required Parameters:

* [`deploy_hashes`](#deployhash)

* [`proposer`](#publickey)

* [`transfer_hashes`](#deployhash)

## BlockBodyV2 {#blockbodyv2}

The body portion of a block.

Required Parameters:

* [`install_upgrade`](#transactionhash) The hashes of the installer/upgrader transactions within the block.

* [`proposer`](#publickey)

* [`rewarded_signatures`](#rewardedsignatures)

* [`staking`](#transactionhash) The hashes for non-transfer, native transactions within the block.

* [`standard`](#transactionhash) The hashes of all other transactions within the block.

* [`transfer`](#transactionhash) The hashes of the transfer transactions within the block.

## BlockHash {#blockhash}

A cryptographic hash identifying a `Block`.

## BlockHeader {#blockheader}

The versioned header portion of a block. It encapsulates different variants of the `BlockHeader` struct.

One of:

* [`Version1`](#blockheaderv1)

* [`Version2`](#blockheaderv2)

## BlockHeaderV1 {#blockheaderv1}

The header portion of a block.

Required Parameters:

* [`accumulated_seed`](#digest)

* [`body_hash`](#digest)

* [`era_id`](#eraid)

* `height` The height of this block.

* [`parent_hash`](#blockhash)

* [`protocol_version`](#protocolversion)

* `random_bit` A random bit needed for initializing a future era.

* [`state_root_hash`](#digest)

* [`timestamp`](#timestamp)

Additional Parameters:

* [`era_end`](#eraendv1)

## BlockHeaderV2 {#blockheaderv1}

The header portion of a block.

Required Parameters:

* [`accumulated_seed`](#digest)

* [`body_hash`](#digest)

* [`era_id`](#eraid)

* `height` The height of this block.

* [`parent_hash`](#blockhash)

* [`protocol_version`](#protocolversion)

* `random_bit` A random bit needed for initializing a future era.

* [`state_root_hash`](#digest)

* [`timestamp`](#timestamp)

Additional Parameters:

* [`era_end`](#eraendv2)

## BlockIdentifier {#blockidentifier}

Identifier for possible ways to retrieve a Block.

* [`Hash`](#blockhash) Identify and retrieve the Block with its hash.

* `Height` Identify and retrieve the Block with its height.

## BlockProof {#blockproof}

A validator's public key paired with a corresponding signature of a given block hash.

Required Parameters:

* [`public_key`](#publickey)

* [`signature`](#signature)

## BlockSynchronizerStatus {#blocksynchronizerstatus}

The status of the block synchronizer.

* [`Historical`](#blocksyncstatus) The status of syncing a historical block, if any.

* [`Forward`](#blocksyncstatus) The status of syncing a forward block, if any.

## BlockSyncStatus {#blocksyncstatus}

The status of syncing an individual block.

Required Parameters:

* `acquisition_state` The state of acquisition of the data associated with the block as a string.

* [`block_hash`](#blockhash)

Additional Parameters:

* `block_height` The height of the block, if known.

## BlockTime {#blocktime}

A newtype wrapping a `u64` which represents the block time.

## BlockV1 {#blockv1}

A block after execution with the resulting global state root hash. This is the core component of the Casper linear blockchain.

Required Parameters:

* [`body`](#blockbodyv1)

* [`hash`](#blockhash)

* [`header`](#blockheaderv1)

## BlockV2 {#blockv2}

A block after execution, with the resulting global state root hash. This is the core component of the Casper linear blockchain.

Required Parameters:

* [`body`](#blockbodyv2)

* [`hash`](#blockhash)

* [`header`](#blockheaderv2)

## Bytes {#bytes}

Hex-encoded bytes.

## ByteCode {#bytecode}

A container for contract's Wasm bytes.

Required Parameters:

* [`bytes`](#bytes)

* [`kind`](#ByteCodeKind)

## ByteCodeHash {#bytecodehash}

The hex-encoded address of a smart contract [`AddressableEntity`](#addressableentity)

## ByteCodeKind {#bytecodekind}

The type of byte code.

One of:

* `Empty` Empty byte code.

* `V1CasperWasm` Byte code to be executed with the version 1 Casper execution engine.

## ChainspecRawBytes {#chainspecrawbytes}

The raw bytes of the chainspec.toml, genesis accounts.toml, and global_state.toml files.

* `chainspec_bytes` Hex-encoded raw bytes of the current chainspec.toml file.

* `maybe_genesis_accounts_bytes` Hex-encoded raw bytes of the current genesis accounts.toml file.

* `maybe_global_state_bytes` Hex-encoded raw bytes of the current global_state.toml file.

## Contract {#contract} 

A contract struct that can be serialized as a JSON object.

Required Parameters:

[`contract_package_hash`](#contractpackagehash)

[`contract_wasm_hash`](#contractwasmhash)

[`entry_points`](#entrypoint)

[`named_keys`](#namedkey)

`protocol_version`

## ContractHash {#contracthash}

The hash address of the contract.

## ContractPackage {#contractpackge}

Contract definition, metadata and security container.

Required Parameters:

* [`access_key`](#uref)

* [`disabled_versions`](#contractversionkey)

* [`groups`](#array_of_namedusergroup)

* [`versions`](#contracthash)

* [`lock_status`](#contractpackagestatus)

## ContractPackageHash {#contractpackagehash}

The hash address of the contract package.

## ContractPackageStatus {#contractpackagestatus}

An enum to determine the lock status of the contract package.

One of:

* `Locked` The package is locked and cannot be versioned.

* `Unlocked` The package is unlocked and can be versioned.

## ContractVersion {#contractversion}

The version of the contract.

Required Parameters:

* [`contract_hash`](#contracthash)

* `contract_version`

* `protocol_version_major`

## ContractVersionKey {#contractversionkey}

Major element of `ProtocolVersion` combined with `ContractVersion`.

## ContractWasm {#contractwasm}

A container for a contract's Wasm bytes.

Required Parameter:

* [`bytes`](#bytes)

## ContractWasmHash {#contractwasmhash}

The hash address of the contract Wasm.

## Delegator {#delegator}

Represents a party delegating their stake to a validator (or "delegatee").

Required Parameters:

* [`bonding_purse`](#uref)

* [`delegator_public_key`](#publickey)

* [`staked_amount`](#u512)

* [`validator_public_key`](#publickey)

Additional Parameters:

* [`vesting_schedule`](#vestingschedule)

## Deploy {#deploy}

A Deploy; an item containing a smart contract along with the requester's signature(s).

Required properties:

* [`approvals`](#approval)

* [`hash`](#deployhash)

* [`header`](#deployheader)

* [`payment`](#executabledeployitem)

* [`sessions`](#executabledeployitem)

## DeployApproval {#deployapproval}

A struct containing a signature of a deploy hash and the public key of the signer.

Required parameters:

* [`signature`](#signature)

* [`signer`](#publickey)

## DeployHash {#deployhash}

Hex-encoded Deploy hash.

## DeployHeader {#deployheader}

The header portion of a Deploy.

Required Parameters:

* [`account`](#publickey)

* [`body_hash`](#digest)

* `chain_name` A user defined string.

* [`dependencies`](#deployhash)

* `gas_price` Defined as an integer in UInt64 format.

* [`timestamp`](#timestamp)

* [`ttl`](#timediff)

## DeployInfo {#deployinfo}

Information relating to the given Deploy.

Required Parameters:

* [`deploy_hash`](#deployhash) The relevant Deploy.

* [`from`](#accounthash) Account identifier of the creator of the Deploy.

* [`gas`](#u512) Gas cost of executing the Deploy.

* [`source`](#uref) Source purse used for payment of the Deploy.

* [`transfers`](#transferaddr) Transfers performed by the Deploy.

## DictionaryIdentifier {#dictionaryidentifier}

Options for dictionary item lookups.

* `AccountNamedKey` Lookup a dictionary item via an Account's named keys.

    Required Parameters:

    `key` The Account key as a formatted string whose named keys contain dictionary_name.

    `dictionary_name` The named key under which the dictionary seed URef is stored.

    `dictionary_item_key` The dictionary item key formatted as a string.

* `ContractNamedKey` Lookup a dictionary item via a Contract's named keys.

    `key` The contract key as a formatted string whose named keys contains dictionary_name.

    `dictionary_name` The named key under which the dictionary seed URef is stored.

    `dictionary_item_key` The dictionary item key formatted as a string.

* `URef` Lookup a dictionary item via its seed URef.

    `seed_uref` The dictionary's seed URef.

    `dictionary_item_key` The dictionary item key formatted as a string.

* `Dictionary` Lookup a dictionary item via its unique key.

## Digest {#digest}

Hex-encoded hash digest.

## DisabledVersions {#disabledversions}

Required Parameters:

* `contract_version`

* `protocol_version_major`

## Effects {#effects}

A log of all [transforms](#tranform) produced during execution.

## EntityVersionAndHash {#entityversionandhash}

An entity version associated with the given hash.

Required Parameters:

* [`addressable_entity_hash`](#addressableenetityhash)

* [`entity_version_key`](#entityversionkey)

## EntityVersionKey {#entityversionkey}

Major element of `ProtocolVersion` combined with `EntityVersion`.

Required Parameters:

* `entity_version`

* `protocol_version_major`

## EntryPoint {#entrypoint}

Metadata describing a callable entry point and its return value, if any. All required parameters should be declared, whereas all non-required parameters should not be declared. Non-required parameters should not be confused with optional parameters.

Required Parameters:

* [`access`](#entrypointaccess)

* [`args`](#parameter)

* [`entry_point_type`](#entrypointtype)

* `name`

* [`ret`](#cltype)

## EntryPointAccess {#entrypointaccess}

Enum describing the possible access control options for a contract entry point.

* `Public` A public entry point is callable by any caller.

* [`Groups`](#group) Only callers from the authorized, listed groups may call this entry point. Note: If this list is empty then this entry point is not callable from outside the contract.

## EntryPointType {#entrypointype}

Context of an entry point execution.

* `Session` Runs as session code in the context of the caller. Deprecated and retained to allow read back of legacy stored session.

* `AddressableEntity` Runs within called entity's context.

* `Factory` This entry point is intended to extract a subset of bytecode. Runs within called entity's context.

## EraEndV1 {#eraendv1}

Information related to the end of an era and validator weights for the following era.

Required Parameters:

* [`era_report`](#erareport_for_publickey)

* [`next_era_validator_weights`](#array_of_validatorweight)

## EraEndV2 {#eraendv2}

Information related to the end of an era and validator weights for the following era.

Required Parameters:

* [`equivocators`](#publickey)

* [`inactive_validators`](#publickey)

* [`next_era_validator_weights`](#array-of-validatorweight)

* [`rewards`](#U512)

## EraID {#eraid}

Era ID newtype.

## EraInfo {#erainfo}

Auction metadata. Intended to be recorded at each era.

Required Parameters:

* [`seigniorage_allocation`](#seigniorageallocation-seigniorageallocation) Information about a seigniorage allocation.

## EraReport_for_PublicKey {#erareport-for-publickey}

Equivocation, reward and validator inactivity information.

Required Parameters:

* [`equivocators`](#publickey)

* [`rewards`](#array_of_erareward)

* [`inactive_validators`](#publickey)

## EraReward {#erareward}

A validator's public key paired with a measure of the value of its contribution to consensus, as a fraction of the configured maximum block reward.

Required Parameters:

* `amount`

* [`validator`](#publickey)

## EraSummary {#erasummary}

The summary of an era.

Required Parameters:

* [`block_hash`](#blockhash) The Block hash.

* [`era_id`](#eraid) The era id.

* [`merkle_proof`](#merkle-proof) The merkle proof.

* [`state_root_hash`](#digest) Hex-encoded hash of the state root.

* [`stored_value`](#storedvalue) The StoredValue containing era information.

## ExecutableDeployItem {#executabledeployitem}

Represents possible variants of an executable Deploy.

### `ModuleBytes` {#modulebytes}

Executable specified as raw bytes that represent Wasm code and an instance of `RuntimeArgs`.

Required Parameters:

* `module_bytes` Hex-encoded raw Wasm bytes. There are some special cases around passing `module_bytes` for payment code.

Additional Parameters:

* [`args`](#runtimeargs) Runtime arguments.

### `StoredContractByHash` {#storedcontractbyhash}

Stored contract referenced by its `ContractHash`, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `hash` A hex-encoded hash.

### `StoredContractByName` {#storedcontractbyname}

Stored contract referenced by a named key existing in the signer's Account context, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `name` A named key.

### `StoredVersionContractByHash` {#storedversioncontractbyhash}

Stored versioned contract referenced by its `ContractPackageHash`, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `hash` A hex-encoded hash.

Additional Parameters:

* `version` An optional version of the contract to call. It will default to the highest enabled version if no value is specified.

### `StoredVersionContractByName` {#storedversioncontractbyname}

Stored versioned contract referenced by a named key existing in the signer's Account context, entry point and an instance of `RuntimeArgs`.

Required Parameters:

* [`args`](#runtimeargs) Runtime arguments.

* `entry_point` The name of an entry point.

* `name` A named key.

Additional Parameters:

* `version` An optional version of the contract to call. It will default to the highest enabled version if no value is specified.

### `Transfer` {#transfer}

A native transfer which does not contain or reference a Wasm code.

Required Parameters:

* [`args`](#runtimeargs)

## ExecutionEffect {#executioneffect}

The journal of execution transforms from a single Deploy.

Required Parameters:

* [`operations`](#oepration)

* [`transforms`](#transformentry)

## ExecutionResult {#executionresult}

The versioned result of executing a single Deploy.

One of:

* [`Version1`](#executionresultv1) Version 1 of execution result type.

* [`Version2`](#executionresultv2) VErsion 2 of execution result type.

## ExecutionResultV1 {#executionresultV1}

The result of executing a single deploy.

One of:

* `Failure` The result of a failed execution`

    Required Parameters:

    [`effect`](#executioneffect)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

    `error_message` The error message associated with executing the Deploy.

* `Success` The result of a successful execution.

    Required Parameters:

    [`effect`](#executioneffect)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

## ExecutionResultV2 {#executionresultv2}

The result of executing a single deploy.

One of:

* `Failure` The result of a failed execution.

    Required Parameters:

    [`effects`](#effects)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

    `error_message` The error message associated with executing the Deploy.

* `Success` The result of a successful execution.

    Required Parameters:

    [`effects`](#effects)

    [`transfers`](#transferaddr)

    [`cost`](#u512)

## FinalizedApprovals {#finalizedapprovals}

A boolean value that determines whether to return the deploy with the finalized approvals substituted. If `false` or omitted, returns the deploy with the approvals that were originally received by the node.

## GlobalStateIdentifier {#globalstateidentifier}

Identifier for possible ways to query global state.

* [`BlockHash`](#blockhash) Query using a Block hash.

* `BlockHeight` Query using a block height.

* [`StateRootHash`](#digest) Query using the state root hash.

## Group {#group}

A (labelled) "user group". Each entry point of a versioned contract may be associated with one or more user groups which are allowed to call it.

### Groups {#groups}

Required Parameters:

* `group`

* [`keys`](#uref)

## InitiatorAddr {#initiatoraddr}

The address of the initiator of a TransactionV1.

Contains one of:

* [`publickey`](#publickey) The public key of the initiator.

* [`accounthash`](#accounthash) The account hash derived from the public key of the initiator.

* [`entityaddr`](#entityaddr) The hex-encoded entity address of the initiator.

## JsonBid {#jsonbid}

An entry in a founding validator map representing a bid.

Required Parameters:

* [`bonding_purse`](#uref) The purse that was used for bonding.

* `delegation_rate` The delegation rate.

* [`delegators`](#jsondelegator) The delegators.

* `inactive` Is this an inactive validator.

* [`staked_amount`](#u512) The amount of tokens staked by a validator (not including delegators).

## JsonBids {#jsonbids}

A Json representation of a single bid.

Required Parameters:

* [`bid`](#jsonbid)

* [`public_key`](#publickey)

## JsonBlock {#jsonblock}

A JSON-friendly representation of `Block`.

Required Parameters:

* [`body`](#jsonblockbody) JSON-friendly Block body.

* [`hash`](#blockhash) BlockHash.

* [`header`](#jsonblockheader) JSON-friendly Block header.

* [`proofs`](#jsonproof) JSON-friendly list of proofs for this Block.

## JsonBlockBody {#jsonblockbody}

A JSON-friendly representation of `Body`.

Required Parameters:

* [`deploy_hashes`](#deployhash)

* [`proposer`](#publickey)

* [`transfer_hashes`](#deployhash)

## JsonBlockHeader {#jsonblockheader}

JSON representation of a Block header.

* [`accumulated_seed`](#digest) Accumulated seed.

* [`body_hash`](#digest) The body hash.

* [`era_id`](#eraid) The Block era id.

* `height` The Block height.

* [`parent_hash`](#blockhash) The parent hash.

* [`protocol_version`](#protocolversion) The protocol version.

* `random_bit` Randomness bit.

* [`state_root_hash`](#digest) The state root hash.

* [`timestamp`](#timestamp) The Block timestamp.

Additional Parameters:

* [`era_end`](#jsoneraend) The era end.

## JsonBlockWithSignatures {#jsonblockwithsignatures}

A JSON-friendly representation of a block and the signatures for that block.

Required Parameters:

* [`block`](#block)

* [`proofs`](#array-of-blockproof)

## JsonDelegator {#jsondelegator}

A delegator associated with the given validator.

Required Parameters:

* [`bonding_purse`](#uref)

* [`delegatee`](#publickey)

* [`public_key`](#publickey)

* [`staked_amount`](#u512)

## JsonEraEnd {#jsoneraend}

Required Parameters:

* [`era_report](#jsonerareport)

* [`next_era_validator_weight`](#validatorweight)

## JsonEraReport {#jsonerareport}

Equivocation and reward information to be included in the terminal Block.

Required Parameters:

* [`equivocators`](#publickey)

* [`inactive_validators`](#publickey)

* [`rewards`](#reward)

## JsonEraValidators {#jsoneravalidators}

The validators for the given era.

Required Parameters:

* [`era_id`](#eraid)

* [`validator_weights`](#jsonvalidatorsweights)

## JsonExecutionResult {#jsonexecutionresult}

The execution result of a single Deploy.

* [`block_hash`](#blockhash)

* [`result`](#executionresult)

## JsonProof {#jsonproof}

A JSON-friendly representation of a proof, i.e. a Block's finality signature.

Required Parameters:

* [`public_key`](#publickey)

* [`signature`](#signature)

## JsonValidatorChanges {#jsonvalidatorchanges}

The changes in a validator's status.

Required Parameters:

* [`public_key`](#publickey) The public key of the validator.

* [`status_changes`](#jsonvalidatorstatuschange) The set of changes to the validator's status.

## JsonValidatorStatusChange {#jsonvalidatorstatuschange}

A single change to a validator's status in the given era.

Required Parameters:

* [`era_id`](#eraid) The era in which the change occurred.

* [`validator_change`](#validatorchange) The change in validator status.

## JsonValidatorsWeights {#jsonvalidatorweights}

A validator's weight.

Required Parameters:

* [`public_key`](#publickey)

* [`weight`](#u512)

## Key {#key}

The key as a formatted string, under which data can be stored in global state.

## Merkle_Proof {#merkle-proof}

A merkle proof is a construction created using a merkle trie that allows verification of the associated hashes.

## MessageChecksum {#messagechecksum}

Message checksum as a formatted string.

## MessageTopic {#messagetopic}

A topic for contract level messages.

Required Parameters:

* `topic_name` A string used to identify the message topic.

* [`topic_name_hash`](#topicnamehash)

## MessageTopicSummary {#messagetopicsummary}

Summary of a message topic that will be stored in global state.

Required Parameters:

* [`blocktime`](#blocktime)

* `message_count` The number of messages in this topic.

## MinimalBlockInfo {#minimalblockinfo}

Minimal info of a `Block`.

Required Parameters:

* [`creator`](#publickey)

* [`era_id`](#eraid)

* [`hash`](#blockhash)

* `height`

* [`state_root_hash`](#digest)

* [`timestamp`](#timestamp)

## NamedArg {#namedarg}

Named arguments to a contract.

## NamedEntryPoint {#namedentrypoint}

A named [entry point](#entrypoint).

Required Parameters:

* [`entry_point`](#entrypoint)

* `name` A string identifying the entry point.

## NamedKey {#namedkey}

A named key.

Required Parameters:

* `key` The value of the entry: a casper `Key` type.

* `name` The name of the entry.

## NamedKeys {#namedkeys}

A [collection of named keys](#array-of-namedkey).

## NamedUserGroup {#namedusergroup}

A named [`group`](#group).

Required Parameters:

* [`group_name`](#group)

* [`group_users`](#uref)

## NextUpgrade {#nextupgrade}

Information about the next protocol upgrade.

Required Parameters:

* [`activation_point`](#activationpoint)

* `protocol_version`

## NewValidator {#newvalidator}

The public key for the new validator in a redelegation using [UnbondingPurse](#unbondingpurse).

## Operation {#operation}

An operation performed while executing a Deploy.

Required Parameters:

* `key` The formatted string of the `Key`.

* [`kind`](#opkind)

## OpKind {#opkind}

The type of operation performed while executing a Deploy.

One of:

* `Read` A read operation.

* `Write` A write operation.

* `Add` An addition.

* `NoOp` An operation which has no effect.

* `Prune` A prune operation.

## Package {#package}

Entity definition, metadata and security container.

Required Parameters:

* [`access_key`](#uref)

* [`disabled_versions`](#EntityVersionKey)

* [`groups`](#array_of_namedusergroup)

* [`lock_status`](#packagestatus)

* [`package_kind`](#packagekind)

* [`versions`](#array-of-entityversionandhash)

## Parameter {#parameter}

Parameter to an entry point.

Required Parameters:

* [`cl_type`](#cltype)

* `name`

## PackageHash {#packagehash}

The hex-encoded address of a package associated with an [`AddressableEntity`](#addressableentity).

## PackageKind {#packagekind}

The type of `Package`.

One of:

* `System` Package associated with a native contract implementation.

* `Account` Package associated with an Account hash.

* `SmartContract` Packages associated with Wasm stored on chain.

## PackageStatus {#packagestatus}

An enum to determine the lock status of the package.

One of:

* `Locked` The package is locked and cannot be versioned.

* `Unlocked` The package is unlocked and can be versioned.

## PeerEntry {#peerentry}

Required Parameters:

* `address`

* `node_id`

## PeersMap {#peersmap}

Map of peer IDs to network addresses.

## PricingMode {#pricingmode}

The pricing mode of a transaction.

One of:

* `GasPriceMultiplier` Multiplies the gas used by the given amount.

* `Fixed` First-in-first-out handling of transactions.

* `Reserved` The payment for this transaction was previously reserved.

## ProtocolVersion {#protocolversion}

Casper Platform protocol version.

## PublicKey {#publickey}

Hex-encoded cryptographic public key, including the algorithm tag prefix.

## PublicKeyAndBid {#publickeyandbid}

A bid associated with the given public key.

Required Parameters:

* [`bid`](#bid)

* [`public_key`](#publickey)

## PublicKeyAndDelegator {#publickeyanddelegator}

A delegator associated with the given validator.

Required Parameters:

* [`delegator_public_key`](#publickey)

* [`delegator`](#delegator)

## PurseIdentifier {#purseidentifier}

The identifier to obtain the purse corresponding to a balance query. Valid identifiers include:

* `main_purse_under_public_key` The main purse under a provided [`PublicKey`](./types_chain.md#publickey).

* `main_purse_under_account_hash` The main purse under a provided [`AccountHash`](./types_chain.md#accounthash).

* `purse_uref` A specific purse identified by the associated [`URef`](./types_chain.md#uref).

## ReactorState {#reactorstate}

The state of the reactor, which will return one of the following:

* `Initialize` Get all components and reactor state set up on start.

* `CatchUp` Orient to the network and attempt to catch up to tip.

* `Upgrading` Running commit upgrade and creating immediate switch block.

* `KeepUp` Stay caught up with tip.

* `Validate` Node is currently caught up and is an active validator.

* `ShutdownForUpgrade` Node should be shut down for upgrade.

## Reward {#reward}

Required Parameters:

* `amount`

* [`validator`](#publickey)

## RewardedSigantures {#rewardedsignatures}

Describes finality signatures that will be rewarded in a block. Consists of a vector of [`SingleBlockRewardedSignatures`](#singleblockrewardedsignatures), each of which describes signatures for a single ancestor block. The first entry represents the signatures for the parent block, the second for the parent of the parent, and so on.

## RuntimeArgs {#runtimeargs}

Represents a collection of arguments passed to a smart contract.

## SeigniorageAllocation {#seigniorageallocation}

Information about a seigniorage allocation.

One of:

* `Validator` Info about a seigniorage allocation for a validator.

    Required Parameters:

    [`amount`](#u512) Allocated amount.

    [`validator_public_key`](#publickey) Validator's public key.

* `Delegator` Info about a seigniorage allocation for a delegator.

    Require Parameters:

    [`amount`](#u512) Allocated amount.

    [`delegator_public_key`](#publickey) Delegator's public key.

    [`validator_public_key`](#publickey) Validator's public key.

## Signature {#signature}

Hex-encoded cryptographic signature, including the algorithm tag prefix.

## SingleBlockRewardedSignatures {#singleblockrewardedsignatures}

List of identifiers for finality signatures for a particular past block. That past block height is equal to `current_height` minus `signature_rewards_max_delay`, the latter being defined in the chainspec.

## StoredValue {#storedvalue}

Representation of a value stored in global state.

* [`CLValue`](#clvalue) A Casper-specific value.

* [`Account`](#account) An Account.

* `ContractWasm` A contract's Wasm.

* [`Contract`](#contract) Entry points supported by a contract.

* [`ContractPackage`](#contractpackage) A contract definition, metadata, and security container.

* [`Transfer`](#transfer) A record of a transfer.

* [`DeployInfo`](#deployinfo) A record of a Deploy.

* [`EraInfo`](#erainfo) Auction metadata.

* [`Bid`](#bid-bid) A bid.

* [`Withdraw`](#unbondingpurse) A withdraw.

* [`Unbonding`](#unbondingpurse) Unbonding information.

* [`AddressableEntity`](#addressableentity) An AddressableEntity.

* [`BidKind`](#bidkind) A variant that stored `BidKind`.

* [`Package`] A `Package`.

* [`ByteCode`] A record of byte code.

* [`MessageTopic`](#messagetopics) A variant that stores a message topic.

* [`Message`](#messagechecksum) A variant that stores a message digest.

## SystemEntityType {#systementitytype}

System contract types.

* `Mint`

* `HandlePayment`

* `StandardPayment`

* `Auction`

## TimeDiff {#timediff}

Human-readable duration.

## Timestamp {#timestamp}

Timestamp formatted as per RFC 3339.

## TopicNameHash {#topicnamehash}

The hash of the name of the [message topic](#messagetopics).

## Transaction {#transaction}

A versioned wrapper for a transaction or deploy.

Contains one of:

* [`deploy`](#deploy)

or

* [`Version1`](#TransactionV1)

## TransactionEntryPoint {#transactionentrypoint}

An entry point of a transaction.

One of:

* `Custom` A non-native, arbitrary entry point.

* `Transfer` The `transfer` native entry point, used to reference motes from a source purse to a target purse.

* `AddBid` The `add_bid` native entry point, used to create or top off a bid purse.

* `WithdrawBid` The `withdraw_bid` native entry point, used to decrease a stake.

* `Delegate` The `delegate` native entry point, used to add a new delegator or increase an existing delegator's stake.

* `Undelegate` The `undelegate` native entry point, used to reduce a delegator's stake or remove the delegator if the remaining stake is zero.

* `Redelegate` the `redelegate` native entry point, used to reduce a delegator's stake or remove the delegator if the remaining stake is zero. After the unbonding delay, it will automatically delegate to a new validator.

## TransactionHash {#transactionhash}

A versioned wrapper for a transaction hash or deploy hash.

One of:

* [`Deploy`](#deployhash)

* [`Version`](#transactionv1hash)

## TransactionInvocationTarget {#transactioninvocationtarget}

The identifier of a `stored` transaction target.

One of:

* `InvocableEntity` The hex-encoded entity address indetifying the invocable entity.

* `InvocableEntityAlias` The alias identifying the invocable entity.

* `Package` The address and optional version identifying the package.

    Required parameters for `package`

    * `addr` The hex-encoded address of the package.

    Optional parameters:

    * `version` The package version. If `None`, the latest enabled version is implied.

* `PackageAlias` The alias and optional version identifying the package.

    Required parameters for `packagealias`

    * `alias` The package alias.

    Optional parameters:

    * `version` The package version. If `None`, the latest enabled version is implied.

## TransactionRuntime {#transactionruntime}

Runtime used to execute a transaction.

Parameters:

* `VmCasperV1` The Casper Version 1 Virtual Machine.

## TransactionScheduling {#transactionscheduling}

The scheduling mode of a transaction.

One of:

* `Standard` No special scheduling applied.

* `FutureEra` Execution should be scheduled fro the specific era.

    Required parameters for `FutureEra`:

    * [`FutureEra`](#eraid)

* `FutureTimestamp` Execution should be scheduled for the specific timestamp or later.

    Required parameters for `FutureTimestamp`:

    * [`FutureTimestamp`](#timestamp)

## TransactionSessionKind {#transactionsessionkind}

Session kind of a transaction.

One of:

* `standard` A standard (non-special-case) session. This kind of session is not allowed to install or upgrade a stored contract, but can call stored contracts.

* `installer` A session which installs a stored contract.

* `upgrader` A session which upgrades a previously-installed stored contract. `Upgrader` sessions must have the `package_id: PackageIdentifier` runtime arg present.

* `isolated` A session which doesn't call any stored contracts. This kind of session is not allowed to install or upgrade a stored contract.

## TransactionTarget {#transactiontarget}

The execution target of a Transaction.

One of:

* `native` The execution target is a native operation.

* `stored` The execution target is a stored entity or package.

    Required parameters for a `stored` target:

    * [`id`](#transactioninvocationtarget)

    * [`runtime`](#transactionruntime)

* `session` The exectuion target is the included module bytes.

    Required parameters for a `session` target:

    * [`kind`](#transactionsessionkind)

    * [`module_bytes`](#bytes)

    * [`runtime`](#transactionruntime)

## TransactionV1 {#transactionV1}

A unit of work sent by a client to the network, which when executed can cause global state to be altered.

Required Parameters:

* [`approvals`](#transactionV1approval)

* [`body`](#transactionV1body)

* [`hash`](#transactionV1hash)

* [`header`](##transactionV1header)

## TransactionV1Approval {#transactionV1Approval}

A struct containing a signature of a transaction hash and the public key of the signer.

Required Parameters:

* [`signer`](#publickey)

* [`signature`](#signature)

## TransactionV1Body {#transactionV1body}

The body of a TransactionV1.

Required Parameters:

* [`args`](#runtimeargs)

* [`entry_point`](#entrypoint)

* [`scheduling`](#transactionscheduling)

* [`target`](#transactiontarget)

## TransactionV1Hash {#transactionV1hash}

A hex-encoded TransactionV1 hash.

## TransactionV1Header {#transactionV1header}

The header portion of a TransactionV1.

Required Parameters:

* [`body_hash`](#digest)

* `chain_name`

* [`initiator_addr`](#initiator_addr)

* [`pricing_mode`](#pricingmode)

* [`timestamp`](#timestamp)

* [`ttl`](#timediff)

## Transfer {#transfer}

Represents a transfer from one purse to another.

Required Parameters:

* [`amount`](#u512) Transfer amount.

* [`deploy_hash`](#deployhash) Deploy that created the transfer.

* [`from`](#accounthash) Account from which transfer was executed.

* [`gas`](#u512)

* [`source`](#uref) Source purse.

* [`target`](#uref) Target purse.

Additional Parameters:

* `id` User-defined ID.

* [`to`](#accounthash) Account to which funds are transferred.

## TransferAddr {#transferaddr}

Hex-encoded transfer address.

## Transform {#transform}

The actual transformation performed while executing a Deploy.

One of:

* `Identity` A transform having no effect.

* `WriteCLValue` Writes the given CLValue to global state.

* `WriteAccount` Writes the given Account to global state.

* `WriteContractWasm` Writes a smart contract as Wasm to global state.

* `WriteContract` Writes a smart contract to global state.

* `WriteContractPackage` Writes a smart contract package to global state.

* `WriteDeployInfo` Writes the given DeployInfo to global state.

* `WriteEraInfo` Writes the given EraInfo to global state.

* `WriteTransfer` Writes the given Transfer to global state.

* `WriteBid` Writes the given Bid to global state.

* `WriteWithdraw` Writes the given Withdraw to global state.

* `WriteUnbonding` Writes the given Unbonding to global state.

* `WriteAddressableEntity` Writes the addressable entity to global state.

* `WriteBidKind` Writes the given BidKind to global state.

* `AddInt32` Adds the given `i32`.

* `AddUInt64` Adds the given `u64`.

* `AddUInt128` Adds the given [`U128`](#u128).

* `AddUInt256` Adds the given [`U256`](#u256).

* `AddUInt512` Adds the given [`U512`](#u512).

* `AddKeys` Adds the given collection of [named keys](#namedkey).

* `Prune` Removes the pathing to the global state entry of the specified key. The pruned element remains reachable from previously generated global state root hashes, but will not be included in the next generated global state root hash and subsequent states.

* `Failure` A failed transformation, containing an error message.

## TransformEntry {#transformentry}

A transformation performed while executing a Deploy.

Required Parameters:

* `key` The formatted string of the `Key`.

* [`transforms`](#transform) The transformation.

## U128 {#u128}

Decimal representation of a 128-bit integer.

## U256 {#u256}

Decimal representation of a 256-bit integer.

## U512 {#u512}

Decimal representation of a 512-bit integer.

## UnbondingPurse {#unbondingpurse}

Unbonding purse.

Required Parameters:

* [`amount`](#u512) Unbonding amount.

* [`bonding_purse`](#uref) Bonding purse.

* [`era_of_creation`](#eraid) Era in which the unbonding request was created.

* [`unbonder_public_key`](#publickey) Unbonder's public key.

* [`validator_public_key`](#publickey) The original validator's public key.

* [`new_validator`](#newvalidator) The redelegated validator's public key.

## URef {#uref}

Hex-encoded, formatted URef.

## ValidatorBid {#validatorbid}

An entry in the validator map.

* [`bonding_purse`](#uref) Bonding purse.

* `delegation_rate` The delegation rate.

* `inactive` `true` if the validator has been "evicted".

* [`staked_amount`](#u512) The amount of tokens staked by a validator.

* [`validator_public_key`](#publickey) The validator's public key.

* [`vesting_schedule`](#vestingschedule) 

## ValidatorChange {#validatorchange}

A change to a validator's status between two eras.

* `Added`

* `Removed`

* `Banned`

* `CannotPropose`

* `SeenAsFaulty`

## ValidatorWeight {#validatorweight}

Required Parameters:

* [`validator`](#publickey)

* [`weight`](#u512)

## VestingSchedule {#vestingschedule}

Vesting schedule for a genesis validator.

## Weight {#weight}

The weight associated with public keys in an account's associated keys.

## WithdrawPurse {#withdrawpurse}

Withdraw purse, previously known as unbonding purse prior to 1.5. Withdraw purses remain as historical data.

Required Parameters:

* [`amount`](#u512) Unbonding amount.

* [`bonding_purse`](#uref) Bonding purse.

* [`era_of_creation`](#eraid) Era in which the unbonding request was created.

* [`unbonder_public_key`](#publickey) Unbonder's public key.

* [`validator_public_key`](#publickey) The original validator's public key.