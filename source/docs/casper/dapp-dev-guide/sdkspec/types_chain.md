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

Hex-encoded Account hash.

## ActionThresholds {#actionthresholds}

Thresholds that have to be met when executing an action of a certain type.

Required Parameters:

* `deployment`

* `key_management`

## ActivationPoint {#activationpoint}

The first era to which the associated protocol version applies.

* [`era_id`](#eraid)

* [`timestamp`](#timestamp)

## Approval {#approval}

A struct containing a signature and the public key of the signer.

Required Parameters:

* [`signature`](#signature)

* [`signer`](#publickey)

## AssociatedKey {#associatedkey}

A key granted limited permissions to an Account, for purposes such as multisig.

Required Parameters:

* [`account_hash`](#accounthash)

* `weight`

## AuctionState {#auctionstate}

Data structure summarizing auction contract data.

Required Parameters:

* [`bids`](#jsonbids) All bids contained within a vector.

* `block_height` Block height.

* [`era_validators`](#jsoneravalidators) Era validators.

* [`state_root_hash`](#digest) Global state hash.

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

## BlockHash {#blockhash}

A cryptographic hash identifying a `Block`.

## BlockIdentifier {#blockidentifier}

Identifier for possible ways to retrieve a Block.

* [`Hash`](#blockhash) Identify and retrieve the Block with its hash.

* `Height` Identify and retrieve the Block with its height.

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

* [`disabled_versions`](#disabledversions)

* [`groups`](#groups)

* [`versions`](#contractversion)

## ContractPackageHash {#contractpackagehash}

The hash address of the contract package.

## ContractVersion {#contractversion}

The version of the contract.

Required Parameters:

* [`contract_hash`](#contracthash)

* `contract_version`

* `protocol_version_major`

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

* `session` Executes in the caller's context.

* `contract` Executes in the callee's context.

## EraID {#eraid}

Era ID newtype.

## EraInfo {#erainfo}

Auction metadata. Intended to be recorded at each era.

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

The result of executing a single Deploy.

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

## GlobalStateIdentifier {#globalstateidentifier}

Identifier for possible ways to query global state.

* [`BlockHash`](#blockhash) Query using a Block hash.

* [`StateRootHash`](#digest) Query using the state root hash.

## Group {#group}

A (labelled) "user group". Each entry point of a versioned contract may be associated with one or more user groups which are allowed to call it.

### Groups {#groups}

Required Parameters:

* `group`

* [`keys`](#uref)

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

## Merkle_Proof {#merkle-proof}

A merkle proof is a construction created using a merkle trie that allows verification of the associated hashes.

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

## NamedKey {#namedkey}

A named key.

Required Parameters:

* `key` The value of the entry: a casper `Key` type.

* `name` The name of the entry.

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

## Parameter {#parameter}

Parameter to an entry point.

Required Parameters:

* [`cl_type`](#cltype)

* `name`

## PeerEntry {#peerentry}

Required Parameters:

* `address`

* `node_id`

## PeersMap {#peersmap}

Map of peer IDs to network addresses.

## ProtocolVersion {#protocolversion}

Casper Platform protocol version.

## PublicKey {#publickey}

Hex-encoded cryptographic public key, including the algorithm tag prefix.

## PurseIdentifier {#purseidentifier}

The identifier to obtain the purse corresponding to a balance query. Valid identifiers include:

* `main_purse_under_public_key` The main purse under a provided [`PublicKey`](/dapp-dev-guide/sdkspec/types_chain#publickey).

* `main_purse_under_account_hash` The main purse under a provided [`AccountHash`](/dapp-dev-guide/sdkspec/types_chain#accounthash).

* `purse_uref` A specific purse identified by the associated [`URef`](/dapp-dev-guide/sdkspec/types_chain#uref).

## Reward {#reward}

Required Parameters:

* `amount`

* [`validator`](#publickey)

## RuntimeArgs {#runtimeargs}

Represents a collection of arguments passed to a smart contract.

## SeigniorageAllocation {#seigniorageallocation}

Information about a seignorage allocation.

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

## StoredValue {#storedvalue}

Representation of a value stored in global state. `Account`, `Contract` and `ContractPackage` have their own `json_compatibility` representation (see their docs for further info).

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

## TimeDiff {#timediff}

Human-readable duration.

## Timestamp {#timestamp}

Timestamp formatted as per RFC 3339.

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

* `WriteCLValue` Write the given [CLValue](#clvalue) to global state.

* `WriteAccount` Writes the given [Account](#accounthash) to global state.

* `WriteDeployInfo` Writes the given [DeployInfo](#deployinfo) to global state.

* `WriteEraInfo` Writes the given [EraInfo](#erainfo) to global state.

* `WriteTransfer` Writes the given [Transfer](#transfer) to global state.

* `WriteBid` Writes the given [Bid](#bid) to global state.

* `WriteWithdraw` Writes the given [Withdraw](#unbondingpurse) to global state.

* `AddInt32` Adds the given `i32`.

* `AddUInt64` Adds the given `u64`.

* `AddUInt128` Adds the given [`U128`](#u128).

* `AddUInt256` Adds the given [`U256`](#u256).

* `AddUInt512` Adds the given [`U512`](#u512).

* `AddKeys` Adds the given collection of [named keys](#namedkey).

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

## WithdrawPurse {#withdrawpurse}

Withdraw purse, previously known as unbonding purse prior to 1.5. Withdraw purses remain as historical data.

Required Parameters:

* [`amount`](#u512) Unbonding amount.

* [`bonding_purse`](#uref) Bonding purse.

* [`era_of_creation`](#eraid) Era in which the unbonding request was created.

* [`unbonder_public_key`](#publickey) Unbonder's public key.

* [`validator_public_key`](#publickey) The original validator's public key.
