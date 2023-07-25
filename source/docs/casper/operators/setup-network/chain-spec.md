---
title: The Chainspec
---

# The Blockchain Specification {#the-chain-specification}

The blockchain specification, or `chainspec`, is a collection of configuration settings describing the network state at genesis and upgrades to basic system functionality (including system contracts and gas costs) occurring after genesis. This page describes each field in the chainspec, based on the [version 1.5.2](https://github.com/casper-network/casper-node/blob/release-1.5.2/resources/production/chainspec.toml) of the Casper node. The chainspec can and should be customized for private networks. The chainspec attributes are divided into categories based on what they are configuring.

## protocol

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|version          | Protocol version. | '1.5.2'|
|hard_reset       | Whether or not we need to clear the latest blocks back to the switch block just before the activation point. | true|
|activation_point | This protocol version becomes active at this point. <br /><br />If it is a timestamp string, it represents the timestamp for the genesis block. This is the beginning of Era 0. By this time, a sufficient majority (> 50% + F/2 — see finality_threshold_fraction below) of validator nodes must be up and running to start the blockchain. This timestamp is also used in seeding the pseudo-random number generator used in the contract-runtime for computing genesis post-state hash. <br /><br />If it is an integer, it represents an era ID, meaning the protocol version becomes active at the start of this era. | 9100|

## network

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|name | Human readable name for convenience; the genesis_hash is the true identifier. The name influences the genesis hash by contributing to seeding the pseudo-random number generator used in the contract runtime for computing the genesis post-state hash. | 'casper'|
|maximum_net_message_size | The maximum size of an acceptable networking message in bytes. Any message larger than this will be rejected at the networking level. | 25_165_824|

## core

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|era_duration | Era duration. | '120min'|
|minimum_era_height | Minimum number of blocks per era. An era will take longer than `era_duration` if that is necessary to reach the minimum height. | 20 | 
|minimum_block_time | Minimum difference between a block's and its child's timestamp. | '32768ms'|
|validator_slots | Number of slots available in validator auction. | 100|
|finality_threshold_fraction | A number between 0 and 1 representing the fault tolerance threshold as a fraction used by the internal finalizer.<br />It is the fraction of validators that would need to equivocate to make two honest nodes see two conflicting blocks as finalized.<br />A higher value F makes it safer to rely on finalized blocks. It also makes it more difficult to finalize blocks, however, and requires strictly more than (F + 1)/2 validators to be working correctly. | [1, 3]|
|start_protocol_version_with_strict<br />_finality_signatures_required |Protocol version from which nodes are required to hold strict finality signatures.| '1.5.0'|
|legacy_required_finality|Which finality is required for legacy blocks. Options are 'Strict', 'Weak', and 'Any'. <br />Used to determine finality sufficiency for new joiners syncing blocks created in a protocol version before the start protocol version with strict finality signatures. |'Strict'|
|auction_delay | Number of eras before an auction defines the set of validators. If you bond with a sufficient bid in era N, you will be a validator in era N + auction_delay + 1. | 1|
|locked_funds_period | The period after genesis during which a genesis validator's bid is locked. | '90days'|
|vesting_schedule_period | The period in which the genesis validator's bid is released over time after it's unlocked. | '13 weeks'|
|unbonding_delay | Default number of eras that need to pass to be able to withdraw unbonded funds. | 7|
|round_seigniorage_rate | Round seigniorage rate represented as a fraction of the total supply.<br />- Annual issuance: 8%.<br />- Minimum block time: 2^15 milliseconds.<br />- Ticks per year: 31536000000.<br /><br />(1+0.08)^((2^15)/31536000000)-1 is expressed as a fractional number below in Python:<br />`Fraction((1 + 0.08)**((2**15)/31536000000) - 1).limit_denominator(1000000000)` | [7, 87535408]|
|max_associated_keys | Maximum number of associated keys for a single account. | 100|
|max_runtime_call_stack_height | Maximum height of contract runtime call stack. | 12|
|minimum_delegation_amount | Minimum allowed delegation amount in motes | 500_000_000_000|
|prune_batch_size | Global state prune batch size (0 = this feature is off) | 0|
|strict_argument_checking | Enables strict arguments checking when calling a contract; i.e., all non-optional args are provided and of the correct `CLType`. | false|
|simultaneous_peer_requests | Number of simultaneous peer requests. | 5|
|consensus_protocol | The consensus protocol to use. Options are "Zug" and "Highway". | 'Highway'|
|max_delegators_per_validator | The maximum amount of delegators per validator. if the value is 0, there is no maximum capacity. | 1200|

## highway

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|maximum_round_length | Highway dynamically chooses its round length between minimum_block_time and maximum_round_length. | '132seconds'|
|reduced_reward_multiplier | The factor by which rewards for a round are multiplied if the greatest summit has ≤50% quorum, i.e., no finality. Expressed as a fraction (1/5 by default). | [1, 5]|

## deploys

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|max_payment_cost | The maximum number of Motes allowed to be spent during payment. 0 means unlimited. | '0'|
|max_ttl | The duration after the deploy timestamp that it can be included in a block. | '18hours'|
|max_dependencies | The maximum number of other deploys a deploy can depend on (require to have been executed before it can execute). | 10|
|max_block_size | Maximum block size in bytes, including deploys contained by the block. 0 means unlimited. | 10_485_760|
|max_deploy_size | Maximum deploy size in bytes. Size is of the deploy when serialized via ToBytes. | 1_048_576|
|block_max_deploy_count | The maximum number of non-transfer deploys permitted in a single block. | 50|
|block_max_transfer_count | The maximum number of wasm-less transfer deploys permitted in a single block. | 1250|
|block_max_approval_count | The maximum number of approvals permitted in a single block. | 2600|
|block_gas_limit | The upper limit of the total gas of all deploys in a block. | 10_000_000_000_000|
|payment_args_max_length | The limit of length of serialized payment code arguments. | 1024|
|session_args_max_length | The limit of length of serialized session code arguments. | 1024|
|native_transfer_minimum_motes | The minimum amount in motes for a valid native transfer. | 2_500_000_000|

## wasm

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|max_memory | Amount of free memory (in 64kB pages) each contract can use for stack. | 64|
|max_stack_height | Max stack height (native WebAssembly stack limiter). | 500|

## wasm.storage_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|gas_per_byte | Gas charged per byte stored in the global state. | 630_000|

## wasm.opcode_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|bit | Bit operations multiplier. | 300 |
|add | Arithmetic add operations multiplier. | 210|
|mul |  Mul operations multiplier. | 240|
|div | Div operations multiplier. | 320|
|load | Memory load operation multiplier. | 2_500|
|store |Memory store operation multiplier. | 4_700|
|const | Const store operation multiplier. | 110|
|local | Local operations multiplier. | 390|
|global | Global operations multiplier. | 390|
|integer_comparison | Integer operations multiplier. | 250|
|conversion | Conversion operations multiplier. | 420|
|unreachable | Unreachable operation multiplier. | 270|
|nop | Nop operation multiplier. | 200|
|current_memory | Get the current memory operation multiplier. | 290|
|grow_memory | Grow memory cost per page (64kb). | 240_000|

## wasm.opcode_costs.control_flow

Control flow operations multiplier.

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|block | TBD | 440|
|loop | TBD | 440|
|if | TBD | 440|
|else | TBD | 440|
|end | TBD | 440|
|br | TBD | 440_000|
|br_if | TBD | 440_000|
|return | TBD | 440|
|select | TBD | 440|
|call | TBD | 140_000|
|call_indirect | TBD | 140_000|
|drop | TBD | 440|

## wasm.opcode_costs.control_flow.br_table

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|cost | Fixed cost per `br_table` opcode | 440_000|
|size_multiplier |  Size of target labels in the `br_table` opcode will be multiplied by `size_multiplier` | 100|

## wasm.host_function_costs

Host function declarations are located in smart_contracts/contract/src/ext_ffi.rs.

- add = { cost = 5_800, arguments = [0, 0, 0, 0] }
- add_associated_key = { cost = 9_000, arguments = [0, 0, 0] }
- add_contract_version = { cost = 200, arguments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
- blake2b = { cost = 200, arguments = [0, 0, 0, 0] }
- call_contract = { cost = 4_500, arguments = [0, 0, 0, 0, 0, 420, 0] }
- call_versioned_contract = { cost = 4_500, arguments = [0, 0, 0, 0, 0, 0, 0, 420, 0] }
- create_contract_package_at_hash = { cost = 200, arguments = [0, 0] }
- create_contract_user_group = { cost = 200, arguments = [0, 0, 0, 0, 0, 0, 0, 0] }
- create_purse = { cost = 2_500_000_000, arguments = [0, 0] }
- disable_contract_version = { cost = 200, arguments = [0, 0, 0, 0] }
- get_balance = { cost = 3_800, arguments = [0, 0, 0] }
- get_blocktime = { cost = 330, arguments = [0] }
- get_caller = { cost = 380, arguments = [0] }
- get_key = { cost = 2_000, arguments = [0, 440, 0, 0, 0] }
- get_main_purse = { cost = 1_300, arguments = [0] }
- get_named_arg = { cost = 200, arguments = [0, 0, 0, 0] }
- get_named_arg_size = { cost = 200, arguments = [0, 0, 0] }
- get_phase = { cost = 710, arguments = [0] }
- get_system_contract = { cost = 1_100, arguments = [0, 0, 0] }
- has_key = { cost = 1_500, arguments = [0, 840] }
- is_valid_uref = { cost = 760, arguments = [0, 0] }
- load_named_keys = { cost = 42_000, arguments = [0, 0] }
- new_uref = { cost = 17_000, arguments = [0, 0, 590] }
- random_bytes = { cost = 200, arguments = [0, 0] }
- print = { cost = 20_000, arguments = [0, 4_600] }
- provision_contract_user_group_uref = { cost = 200, arguments = [0, 0, 0, 0, 0] }
- put_key = { cost = 38_000, arguments = [0, 1_100, 0, 0] }
- read_host_buffer = { cost = 3_500, arguments = [0, 310, 0] }
- read_value = { cost = 6_000, arguments = [0, 0, 0] }
- read_value_local = { cost = 5_500, arguments = [0, 590, 0] }
- remove_associated_key = { cost = 4_200, arguments = [0, 0] }
- remove_contract_user_group = { cost = 200, arguments = [0, 0, 0, 0] }
- remove_contract_user_group_urefs = { cost = 200, arguments = [0, 0, 0, 0, 0, 0] }
- remove_key = { cost = 61_000, arguments = [0, 3_200] }
- ret = { cost = 23_000, arguments = [0, 420_000] }
- revert = { cost = 500, arguments = [0] }
- set_action_threshold = { cost = 74_000, arguments = [0, 0] }
- transfer_from_purse_to_account = { cost = 2_500_000_000, arguments = [0, 0, 0, 0, 0, 0, 0, 0, 0] }
- transfer_from_purse_to_purse = { cost = 82_000, arguments = [0, 0, 0, 0, 0, 0, 0, 0] }
- transfer_to_account = { cost = 2_500_000_000, arguments = [0, 0, 0, 0, 0, 0, 0] }
- update_associated_key = { cost = 4_200, arguments = [0, 0, 0] }
- write = { cost = 14_000, arguments = [0, 0, 0, 980] }
- write_local = { cost = 9_500, arguments = [0, 1_800, 0, 520] }

## system_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|wasmless_transfer_cost | TBD | 100_000_000|

## system_costs.auction_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|get_era_validators | TBD | 10_000|
|read_seigniorage_recipients | TBD | 10_000|
|add_bid | TBD | 2_500_000_000|
|withdraw_bid | TBD | 2_500_000_000|
|delegate | TBD | 2_500_000_000|
|undelegate | TBD | 2_500_000_000|
|run_auction | TBD | 10_000|
|slash | TBD | 10_000|
|distribute | TBD | 10_000|
|withdraw_delegator_reward | TBD | 10_000|
|withdraw_validator_reward | TBD | 10_000|
|read_era_id | TBD | 10_000|
|activate_bid | TBD | 10_000|
|redelegate | TBD | 2_500_000_000|

## system_costs.mint_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
| mint | TBD | 2_500_000_000|
|reduce_total_supply | TBD | 10_000|
|create | TBD | 2_500_000_000|
|balance | TBD | 10_000|
|transfer | TBD | 10_000|
|read_base_round_reward | TBD | 10_000|
|mint_into_existing_purse | TBD | 2_500_000_000|


## system_costs.handle_payment_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|get_payment_purse | TBD |10_000|
|set_refund_purse  | TBD |10_000|
|get_refund_purse  | TBD |10_000|
|finalize_payment  | TBD |10_000|

## system_costs.standard_payment_costs

|Attribute         |Description                                    | Mainnet Setting |
|----------------- |-----------------------------------------------|-----------------|
|pay  | TBD |10_000|
