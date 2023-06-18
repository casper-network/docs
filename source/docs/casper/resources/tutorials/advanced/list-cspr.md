# Listing CSPR on Your Exchange

This topic describes how to list Casper token (CSPR) on a cryptocurrency exchange. 

:::caution

The Casper Signer has been deprecated and replaced with the [Casper Wallet](https://www.casperwallet.io). We are in the process of updating this page. Meanwhile, visit the guide on [Building with the Casper Wallet](https://www.casperwallet.io/develop).

:::

CSPR is listed on [many exchanges](https://tokenmarketcaps.com/coins/casper/market) worldwide. It usually takes 1 to 3 days to list CSPR on an exchange.

## Setting up a Node

While it is not necessary for an exchange to operate their own node on the Casper Mainnet, we recommend that they do so if they expect to handle moderate to high volumes of transaction activity. A node operated by an exchange does not have to be a validating node, it can be read-only. For setup instructions, see [Basic Node Setup](../../../operators/setup/basic-node-configuration.md).

This setup enables you to have a self-administered gateway to the Casper Mainnet to get data and submit transactions.

## Casper Account

You will need a Casper Account to handle the transactions on an exchange. Casper has an [Account model](../../../concepts/design/casper-design.md#accounts-head) and instructions on how to [create an Account](../../../concepts/design/casper-design.md#accounts-creating). 

For your exchange, you need at least one Account. Each Casper network uses an Account model that holds onto general resources and purses with tokens and provides an on-chain identity. As an exchange, if you are dealing with high volumes of transaction activity, you might need a main account for the exchange platform and sub-accounts for other users.

## Understanding Basic Transactions

We have a token and transaction model that features different levels of support that range from convenient to robust. Usually, when you are transferring Casper tokens between two parties, the native two-party transfer will suffice.

Casper supports native two-party transfers as well as bulk transfers using custom Wasm. The native transfer is ideal when you need to perform a one-to-one transfer between two purses. Whereas the batched Wasm transfer is better suited for making bulk transfers. A batched Wasm transfer allows you to do multiple transfers in a single deploy, making it more cost-effective when sending tokens from one purse to several others.

### Native transfer

You can accomplish a native transfer by sending a native transfer deploy, without any Wasm. Included below is an example of this type of deploy. The included `payment` field describes how we are paying for the deploy, in this case a native transfer, while the `session` field describes the actual transfer.

<details>
<summary><b>Native Transfer Deploy</b></summary>

```json

"id": 1,
    "jsonrpc": "2.0",
    "method": "account_put_deploy",
    "params": {
        "deploy": {
            "approvals": [
                {
                    "signature": "130 chars",
                    "signer": "010f50b0116f213ef65b99d1bd54483f92bf6131de2f8aceb7e3f825a838292150"
                }
            ],
            "hash": "ec2d477a532e00b08cfa9447b7841a645a27d34ee12ec55318263617e5740713",
            "header": {
                "account": "010f50b0116f213ef65b99d1bd54483f92bf6131de2f8aceb7e3f825a838292150",
                "body_hash": "da35b095640a403324306c59ac6f18a446dfcc28faf753ce58b96b635587dd8e",
                "chain_name": "casper-net-1",
                "dependencies": [],
                "gas_price": 1,
                "timestamp": "2021-04-20T18:04:40.333Z",
                "ttl": "1h"
            },
            "payment": {
                "ModuleBytes": {
                    "args": [
                        [
                            "amount",
                            {
                                "bytes": "021027",
                                "cl_type": "U512",
                                "parsed": "10000"
                            }
                        ]
                    ],
                    "module_bytes": ""
                }
            },
            "session": {
                "Transfer": {
                    "args": [
                        [
                            "amount",
                            {
                                "bytes": "0400f90295",
                                "cl_type": "U512",
                                "parsed": "2500000000"
                            }
                        ],
                        [
                            "target",
                            {
                                "bytes": "8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668",
                                "cl_type": {
                                    "ByteArray": 32
                                },
                                "parsed": "8ae68a6902ff3c029cea32bb67ae76b25d26329219e4c9ceb676745981fd3668"
                            }
                        ],
                        [
                            "id",
                            {
                                "bytes": "00",
                                "cl_type": {
                                    "Option": "U64"
                                },
                                "parsed": null
                            }
                        ]
                    ]
                }
            }
        }
    }
}

```

</details>


Native transfers are the simplest method to transfer tokens between two purses. For details about the native transfer command, see [Direct Token Transfer](../../../developers/cli/transfers/direct-token-transfer.md). The following command transfers 10 CSPR from *account A's main purse* to *account B's main purse*.

```bash
casper-client transfer \
--id 1 \
--transfer-id 123456 \
--node-address http://<node-ip-address>:7777 \
--amount 10000000000 \
--secret-key <accountA-secret-key>.pem \
--chain-name casper \
--target-account <accountB-hex-encoded-public-key> \
--payment-amount <payment-in-motes>
```

The payment amount varies based on the deploy and network [chainspec](../../concepts/glossary/C.md#chainspec). For node version [1.5.1](https://github.com/casper-network/casper-node/blob/release-1.5.1/resources/production/chainspec.toml), wasmless transfers cost 10^8 motes.

### Bulk or batched Wasm transfer

Bulk or batched Wasm transfers allow you to apply some logic before or after the transfer. They also allow for conditional transfers. You may also use them if you are doing a series of transfers between multiple purses. Listed below are five methods for the [Rust contract API](https://docs.rs/casper-contract/1.4.4/casper_contract/contract_api/system/index.html), which can be used in session code to achieve batched Wasm transfer:

-   `transfer_to_account`: Transfers amount of motes from the main purse of the account to the purse of a target account. If the target purse does not exist, the transfer process will create one. Can be called from session code only and not a contract as a contract doesn't have a main purse.
-   `transfer_to_public_key`: Transfers amount of motes from the main purse of the caller’s account to the main purse of the target. If the account referenced by the target does not exist, the transfer will create a new account. Can be called from session code only and not from a contract as a contract doesn't have a main purse.
-   `transfer_from_purse_to_purse`: Transfers amount of motes from source purse to target purse. If the target does not exist, the transfer fails.
-   `transfer_from_purse_to_public_key`: Transfers amount of motes from source to the main purse of target. If the account referenced by the target does not exist, the transfer will create it.
-   `transfer_from_purse_to_account`: Transfers amount of motes from source purse to target account's purse. If the target account does not exist, the transfer creates a new account.

For more information on how to write session code, see [Writing Session Code](../../../developers/writing-onchain-code/writing-session-code.md). There are equivalent [assembly script](https://github.com/casper-network/casper-node/blob/e01b528db64f96fc1d3eac8b3b8e58e1337b398d/smart_contracts/contract_as/assembly/purse.ts#L135-L305) methods available. Alternatively, you can program directly against the [ext-FFI](https://github.com/casper-network/casper-node/blob/e01b528db64f96fc1d3eac8b3b8e58e1337b398d/smart_contracts/contract/src/ext_ffi.rs#L283-L370) methods. 

## Integrating CSPR

You can integrate with the [JSON-RPC API](../../../developers/json-rpc/index.md) of a node on the Casper Mainnet. 
You can program directly against the RPC or if you prefer you can choose from the variety of SDK libraries that are available to use on a Casper network see [SDK Libraries](../../../developers/dapps/sdk/index.md). 
Casper also provides a stream server that gives you real-time information about a variety of events occurring on a node. Use of the stream is optional. You might want to use this feature as it notifies you of events instead of requiring you to ask periodically. For more information about various events, see [Monitoring and Consuming Events](../../../developers/dapps/monitor-and-consume-events.md).

## Testing the Integration

Our recommended testing mechanism is to have a test environment that points at the official Casper [Testnet](https://testnet.cspr.live/). Through this, you may run production like operations of your test exchange against the test environment. However, if you are not doing this and you just want to integrate with the [Mainnet](https://cspr.live/), then you can do so with your own test accounts. 

If you are not going to do a Testnet integration, then we suggest you create some additional test accounts and test the transactions on the Mainnet through your software prior to moving to the general public.

## The Casper Protocol

-   Casper is integrated with BitGo for enterprise grade custody. If your exchange uses BitGo, support for Casper is available already.
-   Casper has an execution after consensus model, which means that transactions are executed after they are finalized. Transactions are not orphaned or uncle’d on Casper and neither does chain reorganization happen on it. For more information on the execution process, see [Execution Semantics](../../../concepts/design/casper-design.md#execution-semantics-head).
-   Exchanges can check finality signatures. Validators send finality signatures after the finalized block is executed and global state is updated. The Casper node streams execution effects and finality signatures through an SSE architecture. For more information about various events, see [Monitoring and Consuming Events](../../../developers/dapps/monitor-and-consume-events.md).


## Staking Integration for Exchanges

Exchanges seeking to integrate CSPR staking mechanisms will need to understand the processes of delegation, undelegation and redelegation through deploys on a Casper network. The following outlines the use of the [JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk/) to perform these actions, as well as parameters relating to staking. Further information about staking on a Casper network can be found [here](/staking/).

### Deploy Structures and Parameters

Staking operations consists of two parts:

1) [Creating a deploy object](../../../developers/dapps/sending-deploys.md)
    
2) [Signing the deploy](../../../developers/dapps/signing-a-deploy.md)

The staking deploy requires the following information:
- The delegator's public key
- The validator's public key
- The new validator's public key (For re-delegation only)
- The amount to be delegated
- The gas cost
- The auction manager contract's hash
- The appropriate entry point

Casper provides a series of prebuilt Wasm files for use in these operations. They are provided for convenience, and you are free to create your own custom deploys. You can find them in our [casper-node](https://github.com/casper-network/casper-node) repository, in the following locations:

- [Delegate](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/client/delegate)
- [Undelegate](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/client/undelegate)
- [Redelegate](https://github.com/casper-network/casper-node/tree/dev/smart_contracts/contracts/client/redelegate)


#### 1. Creating a deploy object

To create a deploy using the JavaScript SDK, we will need `deployParams`, `session` and a `payment`.

Deploy params is a `DeployUtil.DeployParams` object created from the delegator's `publicKey` and the network name as shown in the following:

```
import { DeployUtil, CLPublicKey } from 'casper-js-sdk';

const deployParams = new DeployUtil.DeployParams(
  CLPublicKey.fromHex(publicKeyHex),
  network_name // 'testnet' | 'mainnet'
);
```

For creating a `session` object, which is `DeployUtil.ExecutableDeployItem`, we need

- The **delegator** and **validator's public keys**
- The **amount** of tokens to delegate/undelegate/redelgate
- The **auction manager contract's hash**
- The **entry point**

First, create a variable `RuntimeArgs` from the public keys and the amount. We will need to use it below in `session`:

```
import { RuntimeArgs, CLValueBuilder, CLPublicKey } from 'casper-js-sdk';

const args = RuntimeArgs.fromMap({
  delegator: CLPublicKey.fromHex(delegatorPublicKeyHex),
  validator: CLPublicKey.fromHex(validatorPublicKeyHex),
  amount: CLValueBuilder.u512(amountMotes) // in motes
});
```

Second, create a `session` parameter. It is a `Uint8Array` consisting of the `auction manager contract's hash`, the `entry points` and `runtime arguments`, which we previously created.

The `auction manager contract's hash` will depend on the network you are using. For Casper's Mainnet and Testnet, the hashes are as follows:

- Mainnet

    `ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea`

- Testnet

    `93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2`

Your `entry point` will depend on which action you are performing, with the following three available:

- `delegate` - Initial delegation to a validator
- `undelegate` - Undelegating tokens from a validator back to the delegator
- `redelegate` - Redelegating tokens to a new validator

```
import { decodeBase16, DeployUtil } from 'casper-js-sdk';

const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
  decodeBase16(auction_manager_contract_hash), // auction manager contract hash
  contractEntryPoint, // auction manager entry point
  args
);
```

To create the `payment` parameter for the deploy, we need a deploy cost. The actual costs can be pulled from the network chainspec. Here is the [`chainspec for version 1.4.8`](https://github.com/casper-network/casper-node/blob/release-1.4.8/resources/production/chainspec.toml). You will need the chainspec for the network version you are using.

Use the `DeployUtil.standardPayment` method for creating `payment`.

```
import { DeployUtil } from 'casper-js-sdk';

const payment = DeployUtil.standardPayment(deployCost);
```

The last operation is creating the deploy:

```
import { DeployUtil } from 'casper-js-sdk';

DeployUtil.makeDeploy(deployParams, session, payment);
```

**Redelegation**, occurs the same way as delegation, but with the introduction of a third public_key.

```
import { RuntimeArgs, CLPublicKey, CLValueBuilder } from 'casper-js-sdk';

const args = RuntimeArgs.fromMap({
    delegator: CLPublicKey.fromHex(delegatorPublicKeyHex),
    validator: CLPublicKey.fromHex(validatorPublicKeyHex),
    new_validator: CLPublicKey.fromHex(redelegateValidatorPublicKeyHex),
    amount: CLValueBuilder.u512(amountMotes)
})
```
  
#### 2a. Sign the deploy (Casper Signer)

To get the signature, you will need to use `Signer.sign` from the [JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk/). It will return `Promise<{ deploy }>`, which is the signed object.

Use `DeployUtil.deployFromJson` to convert the result and sent it to network with:

```
import { Signer, CasperServiceByJsonRPC, DeployUtil } from 'casper-js-sdk';

const casperService = new CasperServiceByJsonRPC(GRPC_URL);
const deployJson = DeployUtil.deployToJson(deploy);
Signer.sign(
    deployJson,
    accountPublicKey,
    recipientPublicKey
).then((signedDeployJson) => {
    const signedDeploy = DeployUtil.deployFromJson(signedDeployJson);
    if (signedDeploy.ok) {
      casperService.deploy(signedDeploy.val! as DeployUtil.Deploy); // sent deploy
    }
}
```

#### 2b. Sign the deploy (Ledger)

You will need to connect with your `Ledger` first to get the signature. 

```
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import LedgerApp, { ResponseBase } from '@zondax/ledger-casper';
import { DeployUtil } from 'casper-js-sdk';

const getBipPath = (index: number) => {
  const idx = index.toString();
  return `m/44'/506'/0'/0/${idx}`;
};

const deployBytes = DeployUtil.deployToBytes(deploy) as Buffer;
const transport = await TransportWebUSB.create();
const ledgerApp = new LedgerApp(transport);
const res = await ledgerApp.sign(
    getBipPath(selectedAccountIndex),
    deployBytes
);
```

The Signature will be in a property called `res.signatureRS`.

After that, we can create a signed deploy, 

```
import { DeployUtil, CLPublicKey } from 'casper-js-sdk';

const signedDeploy = DeployUtil.setSignature(
  deploy,
  signatureRS,
  CLPublicKey.fromHex(accountPublicKey)
);
```

We can then send it to a network.

```
casperService.deploy(signedDeploy)
```

### Costs and Minimums

The following are costs and minimum amounts for version 1.5.1, but up-to-date values should be pulled from the network [chainspec](../../../concepts/glossary/C.md#chainspec).

Transfer Cost: 100,000,000 motes or 0.1 **CSPR**

Delegation Cost: 2,500,000,000 motes or 2.5 **CSPR**

Minimum transfer amount: 2,500,000,000 motes, or 2.5 **CSPR**

Minimum amount required for delegation: 500,000,000,000 motes, or 500 **CSPR**.

### The Delegation Cap

Casper includes a delegator limit rule, which limits the number of delegators that a single validator may have at `953`. This is a temporary solution to prevent complications with Casper’s fast sync mechanism - in which high bond counts could break fast sync.

Validators with a delegator count at or above `953` at the time of the **1.4.5** upgrade were grandfathered in, however new delegators will not be able to delegate to any validator until the delegator count for that validator falls below `953`. 

Existing delegators may continue to delegate additional CSPR, regardless of the current number of delegators staking their **CSPR** to that validator. However, no new delegators may join the validator until it drops below the `953` limit.
