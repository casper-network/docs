# Set Up a Private Casper Network

Casper private networks operate in a similar way to the Casper public network. The major difference in private networks is having administrator account(s) which can control normal accounts. Hence, there are specific configuration options in the genesis setup and administrator account setup. Besides the main configuration options provided by the Casper platform, each customer may have their own configurations when setting up their private network.

## Prerequisites

- [Setting up the Casper client](/workflow/setup/#the-casper-command-line-client)
- [Setting up the client for interacting with the network](https://github.com/casper-network/casper-node/blob/master/client/README.md#casper-client)
- [Setting up an account](/workflow/setup/#setting-up-an-account)

## Step 1. Setting up a Validator Node
A [Casper node](/glossary/N/#node) is a physical or virtual device that is participating in the Casper network. You need to set up several [validator nodes](/glossary/V/#validator) on your private network. An [operator](/glossary/O/#operator) who has won an [auction](/glossary/A/#auction) bid will be a validator node for the private network.

Use the below guides to set up and manage validator nodes.
- [Introduction to operators/validators](/operators/)
- [Basic node setup tutorial](https://docs.casperlabs.io/operators/setup/#etccasper)
- [Casper node setup - GitHub guide](https://github.com/casper-network/casper-node/tree/master/resources/production)
- [Set up Main Net and Test Net validator nodes](https://docs.cspr.community/)
- [FAQs for basic validator node ](https://docs.casperlabs.io/faq/faq-validator/)
- [FAQs on Main Net and Test Net validator node setup](https://docs.cspr.community/docs/faq-validator.html)

## Step 2. Configuring the Genesis Block
The [genesis block](https://en.bitcoin.it/wiki/Genesis_block) in a Casper private network contains a different set of configurations when compared to the public network. 

- Go through the [file location](/operators/setup/#file-locations) section to get an understanding of how the directories are created and managed in a Casper private network. 
- Refer to the [Setting up a new network](https://docs.casperlabs.io/operators/create/) guide to identify the required configuration files to set up a genesis block.

You should add the below configuration options to `chainspec.toml` file inside the private network directory.

#### Unrestricted transfers config
This option disables unrestricted transfers between normal accounts. A normal account user can not do a fund transfer when this attribute is set to false. Only administrators can transfer tokens freely between users and other administrators. 

```rust
[core]
allow_unrestricted_transfers = false
```
In contrast, users in the public network can freely transfer funds to different accounts.

#### Refund handling config

This is to manage the refunds for the finalization of an execution. It changes the way Wasm execution fees are distributed. After each deploy execution, the network calculates the amount of gas spent for the execution and manages to refund the remaining amount to the user.

A refund_ratio is specified as a proper fraction (the numerator needs to be lower or equal to the denominator).  In the below example, the refund ratio is 1:1. That is if 2.5 CSPR is paid upfront and the gas fee is 1 CSPR, 1.5 CSPR will be distributed back to the user.

```rust
refund_handling = { type = "Refund", refund_ratio = [1, 1] } 
```

The rest of the payment amount after deducing the fee is paid to the block’s proposer. This configuration is enabled by the `fee_handling` option.

```rust
[core]
fee_handling = { type = “Accumulate” }
```
The `Accumulate mode` is very similar to the refund but implies a refund ratio of 100%. The fund is transferred in an accumulation mode using a special rewards purse. The gas fees are paid to the purse owned by the mint contract, and no tokens are transferred to the  proposer when this configuration is enabled.

:::note
The proposer is also one of the validators. A validator becomes a proposer by executing a deploy for the block and the appropriate reward for the execution task will be paid accordingly.
:::

The default config for a public chain and current behavior of Casper Network’s mainnet is as below,

```rust
[core]
refund_handling = { type = “Refund”, refund_ratio = [0, 100] }
```
The refund variant with refund_ratio of [0, 100] means, that 0% is given back to the user after deducting gas fees. This effectively means that if a user paid 2.5 CSPR and the gas fees is 1 CSPR, the user will not get his 1.5 CSPR back which he paid upfront.

:::note
Casper private network doesn't support the minting process. Only admin accounts can maintain funds. It is achieved by configuring the below options,
```rust
- compute_reward=false
- allow_auction_bids=false
- fee_elimination = accumulate mode
```
:::

#### Auction behavior config

Another requirement of a private network is to have a fixed set of validators. You are not allowed to bid new entries into the validator set. This configuration will restrict the addition of new validators to the private network.

Use the below configuration option to limit the auction validators,

```rust
[core]
allow_auction_bids = false
```

Other related configurations,

- If chainspec.toml `allow_auction_bids` flag is set to false then `add_bid delegate` and `re-delegate` is disabled and executing those entry points leads to `AuctionBidsDisabled` error. This will disable new validators in the system.
- If chainspec.toml `highway.compute_rewards` is set to false then all rewards on a switch block will be set to 0. The auction contract wouldn't process rewards distribution that will increase validator bids.

In a public network, `allow_auction_bid` is set to true, which allows bidding for new entries and validator nodes. 

## Step 3. Configuring the Admin Accounts
An administrator is mandatory for a private network since it manages all the other [validator](/glossary/V/#validator) accounts. You can create new admins and [rotate validators](#step-7-rotating-validator-accounts) set in a single update. The operator needs to make sure `global_state.toml` file contains new admins first, and the validator set after that if an admin is also a validator. Also, only admin accounts can hold the token balances.

**Configuring admin accounts**
Use the below configuration option in `chainspec.toml` to add administrator accounts to the private network. 

```rust
[[core.administrative_accounts]]
public_key = 'NEW_PUBLIC_KEY'
balance = 'NEW_BALANCE'
weight = 255
``` 

**Generating new admin accounts**
Use the below command to generate new admin accounts in your private network. This generates contents of `global_state.toml` with entries required to create new administrator accounts in the system at the upgrade point.

```rust
global-state-update-gen \
  generate-admins --data-dir $DATA_DIR/global_state \
  --state-hash $STATE_ROOT_HASH \
  –admin $PUBLIC_KEY_HEX,$BALANCE
```
- `NEW_PUBLIC_KEY` - Public key of the admin in a hex format.
- `NEW_BALANCE` - Balance for admin’s main purse.
- `DATA_DIR` - Path to the global state directory.
- `STATE_ROOT_HASH` - State root hash, taken from the latest block before an upgrade.

```note
There should be at least one admin account configured within a network to operate it as a `private network`.
```

**Controlling Accounts and Smart Contracts**

Only the administrator accounts have the permission to control accounts and smart contract management in a private network. This is achieved through a set of entry points that handle enabling and disabling options for account and smart contracts. 
An example implementation can be found at [Casper node's private chain control management](https://github.com/casper-network/casper-node/blob/c8023736786b2c2b0fd17250fcfd50502ff4151f/smart_contracts/contracts/private_chain/control-management/src/main.rs). This is not an existing contract. Only the administrators can use Wasm to deploy it and then use it to manage, enable, and disable contracts. 

Use the below command to generate these contracts,

```bash
make build-contracts-rs
```
Once the contract is deployed, the contract's hash will be saved under the `contract_hash` named key. This contract uses the new `casper_control_management` function which is only callable if the caller is in the set of administrator accounts specified in `accounts.toml`. You will use the public keys defined in the genesis configuration and this configuration will be restricted to only valid peers with known IP addresses. You can only use the public keys for the validators users in the genesis.

Set of entry points to enable and disable accounts and smart contracts.

|Entrypoint Name  | Arguments                        |Description                                                                 |
| -----------     | ---------------------------------|--------------------------------------------------------------------------- |
| disable_account | "account_hash" => ByteArray(32)  |Disables accounts deploy action                                             |
| enable_account  | "account_hash" => ByteArray(32)  |Enables accounts deploy action                                              |
| disable_contract| "contract_hash" => ByteArray(32) |Puts a contract hash in a set of disabled contracts in a contract package   |
| enable_contract | "contract_hash" => ByteArray(32) |Removes contract hash from a set of disabled contracts in a contract package|


## Step 4. Starting the Casper Node
After preparing the genesis block, admin accounts, and validator nodes, you should start and run the Casper node to see the changes. 

Use the below command to start the node,
```bash
sudo systemctl start casper-node-launcher
```
Refer to the [Casper node setup GitHub](https://github.com/casper-network/casper-node/tree/master/resources/production#casper-node-setup) guide to know more details about configuring a new node to operate within a network.

Additionally, refer to the [casper-node-launcher](https://github.com/casper-network/casper-node-launcher) to check whether the installed node binaries match the installed configs, by comparing the version numbers. 

## Step 5. Rotating the Validator Accounts
You need to go through [setting up a validator node ](/#step-1-setting-up-the-validator-nodes) guide before starting this section.

Use the below command to create content in the `global_state.toml` file to perform the rotate validator set step. This needs to specify all the current validators and their stakes, as well as new accounts. 

```rust
global-state-update-gen \
  validators  --data-dir $DATA_DIR/global_state \
  --state-hash $STATE_ROOT_HASH \
  –validator $PUBLIC_KEY_HEX,$STAKE,$OPTIONAL_DELEGATION_RATE
``` 
To rotate the validators set we need to perform a network upgrade with a `global_state.toml` with new entries generated by `global-state-update-gen` command.

In private network operating mode the new accounts are created with the following action thresholds:
```rust
{
  "deployment": 1,
  "key_management": 255
}
```
There must be separate action thresholds for any newly created validator accounts. Action threshold means how many authorization keys you have to use in the deploy when you sign in to perform some auction in the system (Eg: key_management weight has to be at least 255). This option disallows users to manage their own keys which could potentially lead to users removing administrator accounts from associated keys. In public networks, the threshold is defaulted to 1, while in private networks it can be changed to control the client accounts. If users want to add new associated keys, they can have multiple accounts or multiple keys for the same keys.

:::note
For operational purposes output of the `generate-admins` and output of `validator needs to be combined to create new administrators and also make them active validators.
:::

You can find more general details in [joining a running network](/operators/joining/) guide on how to enable new validators to join the network and provide additional security to the system. 

## Step 6. Testing the private network
We will describe the testing flow using an example customer called BSN. All the configuration options are relative to that example customer.

**Sample files**
- [Chainspec template](https://github.com/casper-network/casper-node/blob/c8023736786b2c2b0fd17250fcfd50502ff4151f/resources/private/chainspec.toml.in
) specific to BSN private chain.
- [Accounts template](https://github.com/casper-network/casper-node/blob/feat-private-chain/resources/private/accounts.toml.in) with one administrator in `administrators` settings.

**IP Addresses**
```
http://18.224.190.213:7777
http://18.188.11.97:7777
http://18.188.206.170:7777
http://18.116.201.114:7777
```
**Node Setup**
```rust
export NODE_ADDR=http://18.224.190.213:7777
export CHAIN_NAME="private-test"
export ADMIN_SECRET_KEY="$(pwd)/admin/secret_key.pem
```
`alice/secret_key.pem` is a secret key generated through keygen.

#### Deploy control management smart contract
Deploying this contract on a public chain should return Interpreter error `host module doesn't export function with name casper_control_management`.

```rust
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name private-test \
  --secret-key admin/secret_key.pem
  --session-path control_management.wasm
  --payment-amount 5000000000
```
This should return success on private chain.

#### Fund Alice
Funding command,
```rust
casper-client \
  transfer \
  -n $NODE_ADDR \
  --chain-name casper-net-1 \
  --secret-key ~/Dev/casperlabs-node/utils/nctl/assets/net-1/faucet/secret_key.pem \
  --session-account=$(<~/Dev/casperlabs-node/utils/nctl/assets/net-1/faucet/public_key_hex) \
  --target-account=$(<alice/public_key_hex) \
  --amount=100000000000 \
  --payment-amount=3000000000 \
  --transfer-id=123
```
Check account information.
```rust
casper-client get-account-info -n $NODE_ADDR --public-key alice/public_key.pem
```

#### Try to add a bid as Alice
Should return `ApiError::AuctionError(AuctionBidsDisabled) [64559]`

```rust
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name private-test \
  --secret-key alice/secret_key.pem \
  --session-path ~/Dev/casperlabs-node/target/wasm32-unknown-unknown/release/add_bid.wasm \
  --payment-amount 5000000000 \
  --session-arg "public_key:public_key='$(<alice/public_key_hex)'" \
  --session-arg "amount:u512='10000'" \
  --session-arg "delegation_rate:u8='5'"
 
# Error: ApiError::AuctionError(AuctionBidsDisabled) [64559]"
```
This is same for delegate entrypoint.

#### Disable Alice
Running deploys with Alice shouldn’t work.

```rust
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name $CHAIN_NAME \
  --secret-key $ADMIN_SECRET_KEY \
  --payment-amount=2500000000 \
  --session-name contract_hash \
  --session-entry-point disable_account \
  --session-arg "account_hash:account_hash='"$(casper-client account-address --public-key $(<alice/public_key_hex))"'"
```

#### Enable Alice
Running deploys with Alice account should work.

```rust
casper-client \
put-deploy \
-n $NODE_ADDR \
--chain-name $CHAIN_NAME \
--secret-key $ADMIN_SECRET_KEY \
--payment-amount=2500000000 \
--session-name contract_hash \
--session-entry-point enable_account \
--session-arg "account_hash:account_hash='"$(casper-client account-address --public-key $(<alice/public_key_hex))"'"
```

#### Enable contract
Makes contract enabled by its hash.

```rust
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name $CHAIN_NAME \
  --secret-key $ADMIN_SECRET_KEY \
  --payment-amount=2500000000 \
  --session-name contract_hash \
  --session-entry-point enable_contract \
  --session-arg "contract_hash:account_hash='CONTRACT_HASH'"
```

#### Disable contract
Makes contract disabled by its hash.  Executing contract “CONTRACT_HASH” again should fail.

```rust
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name $CHAIN_NAME \
  --secret-key $ADMIN_SECRET_KEY \
  --payment-amount=2500000000 \
  --session-name contract_hash \
  --session-entry-point disable_contract \
  --session-arg "contract_hash:account_hash='CONTRACT_HASH'"
```

#### Verify seigniorage allocations
Seigniorage allocations should be zero at each switch block

```rust
[highway]
compute_rewards = false
```

Validator stakes should not increase on each switch block.
```rust
casper-client get-era-info -n $NODE_ADDR -b 153
```

The total supply shouldn’t increase. Validator’s stakes should remain 

#### Unrestricted transfers
Transferring from account A to account B should work if either A or B is an administrator account. 

#### Refund handling
Specifies refund ratio for deploys. The current Casper’s main net setting is 0%. 100% setting makes sense for a private chain.
Fee handling.
```rust
[core]
refund_handling = { type = "Refund", refund_ratio = [1, 1] }
```
Accumulates fees to a mint’s reward purse rather than block’s proposer.
```rust
[core]
fee_handling = { type = “Accumulate” }
```

Each deploy validator set should have the same balance and stake, and the rewards purse balance is increased.

#### Rotate validators
To rotate validators set we need to perform network upgrade with a global_state.toml with new entries generated by global-state-update-gen

```bash
global-state-update-gen validators \
  --data-dir $DATA_DIR \
  --state-hash $STATE_ROOT_HASH \
  --validator NEW_PUBLIC_KEY,NEW_STAKE \
  --validator NEW_PUBLIC_KEY2,NEW_STAKE2
```

#### Add new admins
Produces contents of global_state.toml. 
```rust
global-state-update-gen generate-admins --admin NEW_PUBLIC_KEY,NEW_BALANCE --data-dir $DATA_DIR --state-hash $STATE_ROOT_HASH
```
New admins can be created, and the validator set can be rotated in a single update. The operator needs to make sure global_state.toml contains new admins FIRST, and the validator set last if an admin is also a validator.

Chainspec.toml for an upgrade should contain following entries that includes new administrators as well as existing ones:

```rust
[core]

#...

[[core.administrative_accounts]]
public_key = 'NEW_PUBLIC_KEY'
balance = 'NEW_BALANCE'
weight = 255
```










 

