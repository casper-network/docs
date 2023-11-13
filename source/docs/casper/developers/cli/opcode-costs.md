---
title: OpCode Costs Tables
---

# OpCode Costs Tables

The following tables outline the cost, in motes, for a given operation on Casper's Mainnet. If you are building for a private network or other instance of Casper, you will need to verify these costs in the associated `chainspec.toml`.

More information on `chainspec`s for private networks can be found [here](/operators/setup-network/chain-spec.md)

:::note

All costs in this table are in [motes](/concepts/glossary/M/#motes), not CSPR, and the corresponding chainspec is [here](https://github.com/casper-network/casper-node/blob/53dd33865c2707c29284ccc0e8485f22ddd6fbe3/resources/production/chainspec.toml#L129).

:::

## Storage Costs

|Attribute         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|gas_per_byte | Gas charged per byte stored in global state. | 630,000|

## OpCode Costs

|Attribute         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|bit | Bit operations multiplier. | 300 |
|add | Arithmetic add operations multiplier. | 210|
|mul |  Mul operations multiplier. | 240|
|div | Div operations multiplier. | 320|
|load | Memory load operation multiplier. | 2_500|
|store |Memory store operation multiplier. | 4,700|
|const | Const store operation multiplier. | 110|
|local | Local operations multiplier. | 390|
|global | Global operations multiplier. | 390|
|integer_comparison | Integer operations multiplier. | 250|
|conversion | Conversion operations multiplier. | 420|
|unreachable | Unreachable operation multiplier. | 270|
|nop | Nop operation multiplier. | 200|
|current_memory | Get the current memory operation multiplier. | 290|
|grow_memory | Grow memory cost per page (64 kB). | 240,000|

## Control Flow Operation Costs

|Attribute         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|block | Cost for `block` opcode. | 440|
|loop | Cost for `loop` opcode. | 440|
|if | Cost for `if` opcode. | 440|
|else | Cost for `else` opcode. | 440|
|end | Cost for `end` opcode. | 440|
|br | Cost for `br` opcode. | 35_000|
|br_if | Cost for `br_if` opcode. | 35,000|
|return | Cost for `return` opcode. | 440|
|select | Cost for `select` opcode. | 440|
|call | Cost for `call` opcode. | 68_000|
|call_indirect | Cost for `call_indirect` opcode. | 68,000|
|drop | Cost for `drop` opcode. | 440|

## `Br_Table` OpCode Costs

|Attribute         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|cost | Fixed cost per `br_table` opcode. | 35,000|
|size_multiplier |  Size of target labels in the `br_table` opcode will be multiplied by `size_multiplier`. | 100|

## External Function Costs

The following costs are for low-level bindings for host-side ("external") functions. More information on the Casper external FFI can be found [here](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/index.html).

|Host-Side Function| Cost | Arguments |
| ---------------- | ---- | --------- |
| add | 5,800 | [0, 0, 0, 0] |
| add_associated_key | 9,000 | [0, 0, 0] |
| add_contract_version | 200 | [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] |
| blake2b | 200 | [0, 0, 0, 0] |
| call_contract | 4,500 | [0, 0, 0, 0, 0, 420, 0] |
| call_versioned_contract | 4,500 | [0, 0, 0, 0, 0, 0, 0, 420, 0] |
| create_contract_package_at_hash | 200 | [0, 0] |
| create_contract_user_group | 200 | [0, 0, 0, 0, 0, 0, 0, 0] |
| create_purse | 2,500,000,000 | [0, 0] |
| disable_contract_version | 200 | [0, 0, 0, 0] |
| get_balance | 3,800 | [0, 0, 0] |
| get_blocktime | 330 | [0] |
| get_caller | 380 | [0] |
| get_key | 2,000 | [0, 440, 0, 0, 0] |
| get_main_purse | 1,300 | [0] |
| get_named_arg | 200 | [0, 0, 0, 0] |
| get_named_arg_size | 200 | [0, 0, 0] |
| get_phase | 710 | [0] |
| get_system_contract | 1,100 | [0, 0, 0] |
| has_key | 1,500 | [0, 840] |
| is_valid_uref | 760 | [0, 0] |
| load_named_keys | 42,000 | [0, 0] |
| new_uref | 17,000 | [0, 0, 590] |
| random_bytes | 200 | [0, 0] |
| print | 20,000 | [0, 4,600] |
| provision_contract_user_group_uref | 200 | [0, 0, 0, 0, 0] |
| put_key | 38,000 | [0, 1,100, 0, 0] |
| read_host_buffer | 3,500 | [0, 310, 0] |
| read_value | 6,000 | [0, 0, 0] |
| read_value_local | 5,500 | [0, 590, 0] |
| remove_associated_key | 4,200 | [0, 0] |
| remove_contract_user_group | 200 | [0, 0, 0, 0] |
| remove_contract_user_group_urefs | 200 | [0, 0, 0, 0, 0, 0] |
| remove_key | 61,000 | [0, 3,200] |
| ret | 23,000 | [0, 420,000] |
| revert | 500 | [0] |
| set_action_threshold | 74,000 | [0, 0] |
| transfer_from_purse_to_account | 2,500,000,000 | [0, 0, 0, 0, 0, 0, 0, 0, 0] |
| transfer_from_purse_to_purse | 82,000 | [0, 0, 0, 0, 0, 0, 0, 0] |
| transfer_to_account | 2,500,000,000 | [0, 0, 0, 0, 0, 0, 0] |
| update_associated_key | 4,200 | [0, 0, 0] |
| write | 14,000 | [0, 0, 0, 980] |
| write_local | 9,500 | [0, 1,800, 0, 520] |

## Protocol Operating Costs

|Attribute         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|wasmless_transfer_cost | Default gas cost for a wasmless transfer. | 100,000,000|

### `Auction` System Contract Costs

These are the costs of calling `auction` system contract entrypoints.

|Entrypoint         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|get_era_validators | Cost of calling the `get_era_validators` entrypoint. | 10,000|
|read_seigniorage_recipients | Cost of calling the `read_seigniorage_recipients` entrypoint. | 10,000|
|add_bid | Cost of calling the `add_bid` entrypoint. | 2,500,000,000|
|withdraw_bid | Cost of calling the `withdraw_bid` entrypoint. | 2,500,000,000|
|delegate | Cost of calling the `delegate` entrypoint. | 2,500,000,000|
|undelegate | Cost of calling the `undelegate` entrypoint. | 2,500,000,000|
|run_auction | Cost of calling the `run_auction` entrypoint. | 10,000|
|slash | Cost of calling the `slash` entrypoint. | 10,000|
|distribute | Cost of calling the `distribute` entrypoint. | 10,000|
|withdraw_delegator_reward | Cost of calling the `withdraw_delegator_reward` entrypoint. | 10,000|
|withdraw_validator_reward | Cost of calling the `withdraw_validator_reward` entrypoint. | 10,000|
|read_era_id | Cost of calling the `read_era_id` entrypoint. | 10,000|
|activate_bid | Cost of calling the `activate_bid` entrypoint. | 10,000|
|redelegate | Cost of calling the `redelegate` entrypoint. | 2,500,000,000|

### `Mint` System Contract Costs

These are the costs of calling `mint` system contract entrypoints.

|Entrypoint         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|mint | Cost of calling the `mint` entrypoint. | 2,500,000,000|
|reduce_total_supply | Cost of calling the `reduce_total_supply` entrypoint. | 10,000|
|create | Cost of calling the `create` entrypoint. | 2,500,000,000|
|balance | Cost of calling the `balance` entrypoint. | 10,000|
|transfer | Cost of calling the `transfer` entrypoint. | 10,000|
|read_base_round_reward | Cost of calling the `read_base_round_reward` entrypoint. | 10,000|
|mint_into_existing_purse | Cost of calling the `mint_into_existing_purse` entrypoint. | 2,500,000,000|


### `Handle_Payment` System Contract Costs

These are the costs of calling entrypoints on the `handle_payment` system contract.

|Entrypoint         |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|get_payment_purse | Cost of calling the `get_payment_purse` entrypoint. |10,000|
|set_refund_purse  | Cost of calling the `set_refund_purse` entrypoint. |10,000|
|get_refund_purse  | Cost of calling the `get_refund_purse` entrypoint. |10,000|
|finalize_payment  | Cost of calling the `finalize_payment` entrypoint. |10,000|

### `Standard_Payment` System Contract Costs

These settings manage the costs of calling entrypoints on the `standard_payment` system contract.

|Entrypoint        |Description                                    | Cost |
|----------------- |-----------------------------------------------|-----------------|
|pay| Cost of calling the `pay` entrypoint and sending an amount to a payment purse. |10,000|