# Set Up a Private Casper Network

Casper private networks operate in a similar way to the Casper public network. The major difference in private networks is having administrator account(s) which can control normal accounts. Hence, there are specific configuration options when setting up the genesis block and administrator accounts. Besides the main configuration options provided by the Casper platform, each customer may have their own configurations when setting up their private network.

## Prerequisites
Follow these guides to set up the required environment and user accounts. 
- [Setting up the Casper client](/workflow/setup/#the-casper-command-line-client)
- [Setting up the client for interacting with the network](https://github.com/casper-network/casper-node/blob/master/client/README.md#casper-client)
- [Setting up an account](/workflow/setup/#setting-up-an-account)


## Step 1. Setting up a Validator Node
A [Casper node](/glossary/N/#node) is a physical or virtual device that is participating in the Casper network. You need to set up several [validator](/glossary/V/#validator) nodes on your private network. An [operator](/glossary/O/#operator) who has won an [auction](/glossary/A/#auction) bid will be a validator for the private network.


Use the below guides to set up and manage validator nodes.

- [Casper node setup - GitHub guide](https://github.com/casper-network/casper-node/tree/master/resources/production#casper-node-setup): A guide to configuring a system with the new Rust node to operate within a network.
- [Basic node setup tutorial](/operators/setup/) : A guide on using `casper-node-launcher`, generation of directories and files needed for running casper-node versions and performing upgrades, generating keys, and setting up the config file for nodes.
- [Set up Mainnet and Testnet validator nodes](https://docs.cspr.community/) : A set of guides for Main Net and Test Net node-operators on setting up setting up and configuring their Casper Network validator nodes.

Use these FAQ collection for tips and details for validators.
- [FAQs for basic validator node ](https://docs.casperlabs.io/faq/faq-validator/)
- [FAQs on Main Net and Test Net validator node setup](https://docs.cspr.community/docs/faq-validator.html)

## Step 2. Setting up the Directory
Use the below guides to set up your private network directories. You will find several main directories are dedicated to different purposes.

- Go through the [file location](/operators/setup/#file-locations) section to get an understanding of how the directories are created and managed in a Casper private network. 
- Refer to the [Setting up a new network](/operators/create/) guide to identify the required configuration files to set up a genesis block.

## Step 3. Configuring the Genesis Block
The [genesis block](https://en.bitcoin.it/wiki/Genesis_block) in a Casper private network contains a different set of configurations when compared to the public network. When setting up a private network, the `chainspec.toml` file will contain the required configurations for the genesis block with other network settings. 

You should add the below configuration options to `chainspec.toml` file inside the [private network directory](/#step-2-setting-up-the-directory) to achieve the unique behavior of the private network.

### Unrestricted transfers config
This option disables unrestricted transfers between normal accounts. A normal account user can not do a fund transfer when this attribute is set to false. Only administrators can transfer tokens freely between users and other administrators. 

```typescript
[core]
allow_unrestricted_transfers = false
```
In contrast, users in the public network can freely transfer funds to different accounts.

:::note
Casper private network doesn't support the minting process. Only the admin accounts can maintain funds that is achieved by configuring the below options,
```typescript
- highway.compute_rewards = false
- core.allow_auction_bids = false
- fee_handling = { type = "Accumulate" }
```
:::

### Refund handling config
This option manages refund behavior at the finalization of a Deploy execution. It changes the way the Wasm execution fees are distributed. After each Deploy execution, the network calculates the amount of gas spent for the execution and manages to refund the remaining token amount to the user.

A `refund_ratio` is specified as a proper fraction (the numerator needs to be lower or equal to the denominator).  In the below example, the `refund ratio` is 1:1. If 2.5 CSPR is paid upfront and the gas fee is 1 CSPR, 1.5 CSPR will be distributed back to the user.

```typescript
[core]
refund_handling = { type = "refund", refund_ratio = [1, 1] } 
```
The distribution of the remaining payment amount after deducing the gas fee is handled based on [fee_handling](/#fee-handling-config) configuration.

The default config for a public chain and current behavior of Casper Network’s Mainnet is as below,

```typescript
[core]
refund_handling = { type = "refund", refund_ratio = [0, 100] }
```
The refund variant with `refund_ratio` of [0, 100] means, that 0% is given back to the user after deducting gas fees. This effectively means that if a user paid 2.5 CSPR and the gas fees is 1 CSPR, the user will not get the remaining 1.5 CSPR in return.

### Fee handling config
This option defines how to distribute the fees after the refunds are handled. While refund handling defines the amount we pay back after a transaction, fee handling defines the types of fees after a refund is peformed.

Setup the options as below,
```typescript
[core]
fee_handling = { type = "pay_to_proposer" }
```

This configuration has 3 variations,
- `pay_to_proposer`: The rest of the payment amount after deducing the gas fee from a refund is paid to the block’s [proposer](/glossary/P/#proposer).
- `burn`: The tokens paid are burned and the total supply is reduced.
- `accumulate`: The fund is transferred to a special accumulation purse. The fees are paid to the purse owned by the handle payment contract, and no tokens are transferred to the proposer when this configuration is enabled. Here, the accumulation purse is owned by a handle payment system contract, and the amount is distributed among all the administrators defined at the end of a switch block.

### Auction behavior config

Another requirement of a private network is to have a fixed set of validators. You are not allowed to bid new entries into the validator set. This configuration restricts the addition of new validators to the private network.

Use the below configuration option to limit the auction validators,

```typescript
[core]
allow_auction_bids = false
```

Other related configurations,

- If chainspec.toml `allow_auction_bids` option is set to *false* then `add_bid`, `delegate` is disabled and executing those entry points leads to `AuctionBidsDisabled` error. This will disable new validators in the system.
- If chainspec.toml `core.compute_rewards` option is set to *false* then all the rewards on a switch block will be set to 0. The auction contract wouldn't process rewards distribution that will increase validator bids.

In a public network, `allow_auction_bid` is set to *true*, which allows bidding for new entries and validator nodes. 

## Step 4. Configuring the Administrator Accounts
An administrator is mandatory for a private network since it manages all the other [validator](/glossary/V/#validator) accounts. You can create new admins and [rotate validator](#step-7-rotating-validator-accounts) set in a single update. The operator needs to make sure `global_state.toml` file contains new admins first, and the validator set after that if an admin is also a validator. Also, only the admin accounts can hold and distribute the token balances.

**Configuring admin accounts**

Use the below configuration option in `chainspec.toml` to add administrator accounts to the private network. 

```typescript
[core]
administrators = ["NEW_ACCOUNT_PUBLIC_KEY"] 
```
In private network operating mode new accounts are created with the following action thresholds,

```typescript
{
  "deployment": 1,
  "key_management": 255
}
```
This disallows users to manage their own keys which could potentially lead to users removing administrator accounts from associated keys.

Action threshold means how many the cumulative weight of authorization keys you need in the deploy when you sign in to perform some auction in the system (Eg: key_management weight has to be at least 255). This option disallows users to manage their own keys which could potentially lead to users removing administrator accounts from associated keys. In public networks, the threshold is defaulted to 1, while in private networks it can be changed to control the client accounts. If users want to add new associated keys, they can have multiple accounts or multiple keys for the same keys.

:::note
Make sure that the cumulative weight of authorization keys needs to be 255 at the minimum, and not 255 authorized keys. You can fulfill the threshold with only two keys, one of weight 254 and another with 1.
:::

**Generating new admin accounts**

Use the below command to generate new admin accounts in your private network. This generates contents of `global_state.toml` with entries required to create new administrator accounts in the system at the upgrade point.

```typescript
global-state-update-gen \
  generate-admins --data-dir $DATA_DIR/global_state \
  --state-hash $STATE_ROOT_HASH \
  –admin $PUBLIC_KEY_HEX,$BALANCE
```
- `NEW_PUBLIC_KEY` - Public key of the admin in a hex format.
- `NEW_BALANCE` - Balance for admin’s main purse.
- `DATA_DIR` - Path to the global state directory.
- `STATE_ROOT_HASH` - State root hash, taken from the latest block before an upgrade.

:::note
There should be at least one admin account configured within a network to operate it as a `private network`.
:::

**Managing accounts and smart contracts**

Only the administrators have the permission to control accounts and manage smart contracts in a private network. An example implementation can be found at [Casper node's private chain control management](https://github.com/casper-network/casper-node/blob/c8023736786b2c2b0fd17250fcfd50502ff4151f/smart_contracts/contracts/private_chain/control-management/src/main.rs) file. This is not an existing contract. You can use the existing client contracts as an administrator to perform actions as a user. You have to sign a Deploy with a normal user executing a Wasm but using administrator's secret key rather than user's secret key.  

Use the below command to generate these contracts,

```bash
make build-contracts-rs
```
Only the administrator can use the related Wasm to send the Deploy to the network and then use it to manage, enable, and disable contracts. This is achieved through a set of entry points that handle enabling and disabling options for account and smart contracts. 

- ***To disable a contract***: Execute `disable_contract.wasm` with `contract_hash`and `contract_package_hash` parameters.
- ***To enable a contract***: Execute `enable_contract.wasm` with `contract_hash`and `contract_package_hash` parameters.
- ***To disable an account***: Needs to execute `set_action_thresholds.wasm` with arruments `deploy_threshold` set to 255, and `key_management_threshold` set to 255.
- ***To enable an account***: Needs to execute `set_action_thresholds.wasm` with `deploy_threshold` set to 1.

Once the contract is deployed, the contract's hash will be saved under the `contract_hash` named key. This contract uses the new `casper_control_management` function which is only callable if the caller is in the set of administrator accounts specified in `accounts.toml`. You will use the public keys defined in the genesis configuration and this configuration will be restricted to only valid peers with known IP addresses. You can only use the public keys for the validators use in the genesis block.

Set of entry points to enable and disable accounts and smart contracts.

|Entrypoint Name  | Arguments                        |Description                                                                 |
| -----------     | ---------------------------------|--------------------------------------------------------------------------- |
| disable_account | "account_hash" => ByteArray(32)  |Disables accounts deploy action                                             |
| enable_account  | "account_hash" => ByteArray(32)  |Enables accounts deploy action                                              |
| disable_contract| "contract_hash" => ByteArray(32) |Puts a contract hash in a set of disabled contracts in a contract package   |
| enable_contract | "contract_hash" => ByteArray(32) |Removes contract hash from a set of disabled contracts in a contract package|


## Step 5. Starting the Casper Node
After preparing the genesis block, admin accounts, and validator nodes, you should start and run the Casper node to see the changes. 

Use the below command to start the node,
```bash
sudo systemctl start casper-node-launcher
```
Refer to the [Casper node setup GitHub](https://github.com/casper-network/casper-node/tree/master/resources/production#casper-node-setup) guide to know more details about configuring a new node to operate within a network.

Additionally, refer to the [casper-node-launcher](https://github.com/casper-network/casper-node-launcher) to check whether the installed node binaries match the installed configs, by comparing the version numbers. 

## Step 6. Rotating the Validator Accounts
You need to go through [setting up a validator node ](/#step-1-setting-up-the-validator-nodes) guide before starting this section.

Use the below command to create content in the `global_state.toml` file to perform the rotate validator set step. This needs to specify all the current validators and their stakes, as well as new accounts. 

```rust
global-state-update-gen \
  validators  --data-dir $DATA_DIR/global_state \
  --state-hash $STATE_ROOT_HASH \
  –validator $PUBLIC_KEY_HEX,$STAKE,$OPTIONAL_DELEGATION_RATE
``` 
To rotate the validators set we need to perform a network upgrade with a `global_state.toml` with new entries generated by `global-state-update-gen` command.

You can find more general details in [joining a running network](/operators/joining/) guide on how to enable new validators to join the network and provide additional security to the system. 

## Step 7. Testing the Private Network
We will describe the testing flow using an example customer. All the configuration options are relative to that example customer.

**Sample files**
- [Chainspec template](https://github.com/casper-network/casper-node/blob/c8023736786b2c2b0fd17250fcfd50502ff4151f/resources/private/chainspec.toml.in
) that is specific to BSN private chain.
- [Accounts template](https://github.com/casper-network/casper-node/blob/feat-private-chain/resources/private/accounts.toml.in) with one administrator in `administrators` settings.

**IP Addresses**

The set of IP addresses used for the example.
```
http://18.224.190.213:7777
http://18.188.11.97:7777
http://18.188.206.170:7777
http://18.116.201.114:7777
```
**Node Setup**

Set up the node address, chain name and admin secret key.
```rust
export NODE_ADDR=http://18.224.190.213:7777
export CHAIN_NAME="private-test"
export ADMIN_SECRET_KEY="$(pwd)/admin/secret_key.pem
```
`alice/secret_key.pem` is a secret key generated through the [keys generation process](/dapp-dev-guide/keys/#creating-accounts-and-keys).

#### Deploy the control management smart contract
The following command sends the deploy to the private network. This should return success on your private network.

```bash
casper-client \
  put-deploy \
  -n $NODE_ADDR \
  --chain-name private-test \
  --secret-key admin/secret_key.pem
  --session-path control_management.wasm
  --payment-amount 5000000000
```
Deploying this contract on a public chain should return Interpreter error `host module doesn't export function with name casper_control_management`.


#### Funding Alice's account
The following command transfers token amount to Alice's account.
```bash
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
Check the account information,
```bash
casper-client get-account-info -n $NODE_ADDR 
  --public-key alice/public_key.pem
```

#### Adding a bid as Alice
The following command attempts to add an auction bid on the network. It should return `ApiError::AuctionError(AuctionBidsDisabled) [64559]`

```bash
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
This is same for the delegate entrypoint.

#### Disabling Alice's account
The following command disables the Alice's account. In this case, executing Deploys with Alice's account will not be successful.

```bash
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

#### Enabling Alice's account
The following command enables the Alice's account. In this case, executing Deploys with Alice's account will be successful.

```bash
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

#### Enabling the contract
The following command makes contract enabled by its hash.

```bash
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

#### Disabling the contract
The following command makes the contract disabled by its hash. Executing contract `CONTRACT_HASH` again should fail.

```bash
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

#### Verifying seigniorage allocations
[Seigniorage](https://www.investopedia.com/terms/s/seigniorage.asp) allocations should be zero at each switch block.

```typescript
[highway]
compute_rewards = false
```

Validator stakes should not increase on each switch block.
```bash
casper-client get-era-info -n $NODE_ADDR -b 153
```

The total supply shouldn’t increase. Validator’s stakes should remain. 

#### Unrestricted transfers
This option set the fund transferring from account A to account B should work if either A or B is an administrator account. 

#### Refund handling
This option set specifies the refund ratio for the Deploys. The current Casper’s Mainnet setting is 0%. 100% setting makes sense for a private chain.

```typescript
[core]
refund_handling = { type = "refund", refund_ratio = [1, 1] }
```

#### Fee handling
This option accumulates the fees to a mint’s reward purse rather than block’s proposer.
```typescript
[core]
fee_handling = { type = "accumulate" }
```

Each deploy validator set should have the same balance and stake, and the rewards purse balance will beThis  increased.

#### Rotate validators
The following command sets the rotate validators set you need to perform network upgrade with a `global_state.toml` with new entries generated by `global-state-update-gen` command.

```bash
global-state-update-gen validators \
  --data-dir $DATA_DIR \
  --state-hash $STATE_ROOT_HASH \
  --validator NEW_PUBLIC_KEY,NEW_STAKE \
  --validator NEW_PUBLIC_KEY2,NEW_STAKE2
```

#### Add new admins
The following command produces the administrator related contents of `global_state.toml` file. 

```bash
global-state-update-gen generate-admins --admin NEW_PUBLIC_KEY,NEW_BALANCE --data-dir $DATA_DIR --state-hash $STATE_ROOT_HASH
```
New admins can be created, and the validator set can be rotated in a single update. 

The `chainspec.toml` file should contain following entries that includes new administrators as well as existing ones for an upgrade,

```typescript
[core]

#...

[[core.administrative_accounts]]
public_key = 'NEW_PUBLIC_KEY'
balance = 'NEW_BALANCE'
weight = 255
```










 

