---
title: Local Network Testing
---

# Testing Smart Contracts with NCTL

NCTL effectively simulates a live Casper network. The process for sending a `Deploy` to an NCTL-based network is therefore similar to doing so on a live network.

Testing `Deploys` prior to sending them to a Casper network ensures that they operate as intended. When working in an environment that requires payment for execution, errors and inefficiencies quickly add up. To this end, Casper provides several layers of testing to identify and rectify any errors. After [writing your smart contract](../../developers/writing-onchain-code/simple-contract.md) and testing it [using the provided framework](../../developers/writing-onchain-code/testing-contracts.md), NCTL serves as the next step in the process. While testing is entirely optional, it should be considered a best practice to avoid paying for the execution of faulty code.

## Getting Started with NCTL

Prior to testing a `Deploy` through NCTL, you should have the following steps accomplished:

1) [Completed writing a Deploy](../../developers/writing-onchain-code/simple-contract.md)

2) [Tested the Deploy](../../developers/writing-onchain-code/testing-contracts.md) using the Casper testing framework

3) [Setup NCTL](./setup-nctl.md) on your system

## NCTL Verification Prior to Testing

Prior to attempting an NCTL test, you must verify that your local NCTL instance started correctly. Run the following command to view your current node status:

```
nctl-status
```

You should see five nodes `RUNNING` and five `STOPPED`. Further, verify that the node and user information propagated within the *casper-node/utils/assets* directory. Each node and user should have the associated `Keys` necessary to interact with the network. Run the following command to view first user details:

```
nctl-view-user-account user=1
```

## Installing the Smart Contract

This document assumes that you setup your NCTL network using the standard settings in a directory called */casper/*.

You will need the following information to use the `put-deploy` command:

* The **chain name**, in this case `casper-net-1`. This will appear in our example put-deploy as `--chain-name "casper-net-1"`

* The **secret key** of the account sending the `Deploy`. For this example, we are using node-1 as the sender. The secret key file can be found at *casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem*. In our example put-deploy, this will appear as `--secret-key /casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem`. If your Deploy is more complex and requires multiple accounts, NCTL also establishes multiple users for testing.

* The **payment amount** in motes, which should be sufficient to avoid an 'Out of Gas' error. The payment amount will appear in our example put-deploy as `--payment-amount 2500000000`. **NCTL tests are not an accurate representation of potential gas costs on a live network. Please see our [note about gas prices](../../developers/dapps/sending-deploys.md#a-note-about-gas-price).**

* The **path** to your `Deploy` that you wish to send to the NCTL network. This will appear in our example put-deploy as `--session-path <PATH>` and will require you to define the path to your specific `Deploy` Wasm.

* The **node address** for a node on your NCTL network. In this example, we are using the node at `http://localhost:11101`. On the Casper Mainnet or Testnet, nodes will use port `7777`. This will appear in our example put-deploy as `--node-address http://<HOST>:7777`.

The command to send your `Deploy` should look similar to the following code snippet:

:::note

Use of the `$(get_path_to_client)` command assumes that you are operating in an activated NCTL envrionment.

:::

```
$(get_path_to_client) put-deploy \
--chain-name "casper-net-1" \
--secret-key /casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/secret_key.pem \
--payment-amount 2500000000 \
--session-path <PATH> \
--node-address http://localhost:11101
```

The response will return something similar to the following information. Note the `deploy_hash`:

```
{
    "id": 4824893960188648146,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "deploy_hash": "8e6309cc37bc58d8fedc1094ee1bd264a636d39fc0e05b5e1d72d98f7b6faf13"
    }
}
```

## Verifying Deploy Execution

The previous command sent the `Deploy` to the NCTL network, but we recommend verifying deploy execution before continuing. The `deploy_hash` received in the response allows you to query the `Deploy`'s status. 

To query the `Deploy`'s status, you will pass both the `deploy_hash` and the same `node-address` from above using the following command. This will return either an error message in the event of failure or the `Deploy` details if it succeeds.
```
$(get_path_to_client) get-deploy 8e6309cc37bc58d8fedc1094ee1bd264a636d39fc0e05b5e1d72d98f7b6faf13 -n http://localhost:11101
```

## Interacting with the Installed Contract

Once your NCTL network executes your `Deploy`, you can test the functionality of the installed contract. To do so, you will first need to identify any arguments to pass to the contract, starting with the `ContractHash` itself. This hash identifies the contract and allows you to target the included entry points. As we used the pre-established node-1 account to [send the `Deploy`](../../developers/dapps/sending-deploys.md), we can retrieve the `ContractHash` from the node-1 account information. To do so, we will use the following command with a node address and the `PublicKey` of the node in question. 


```
$(get_path_to_client) get-account-info \
--node-address http://localhost:11101 \
--public-key /casper/casper-node/utils/nctl/assets/net-1/nodes/node-1/keys/public_key.pem
```

This command will return information pertaining to the account, including the `NamedKeys`. The `ContractHash` of the contract to be tested will appear here. The process of calling the contract is similar to that of installing it, as they are both accomplished through sending a `Deploy`. In this instance, you will need the following information:

* The **node address**, entered in this instance using `--node-address http://localhost:11101`

* The **chain name**, entered in this instance using `--chain-name "casper-net-1"`

* The **payment amount** for this `Deploy` in motes, which may need to be adjusted depending on cost and network [chainspec](../../concepts/glossary/C.md#chainspec). In this instance, we will use `--payment-amount 500000000`

* The **session path**, defining the location of the Wasm bearing file for the `Deploy`. It appears in our example as `--session-path <PATH>` but you must define the path to your specific file.

* Any **session arguments** specific to the contract that you are testing. Multiple instances of `--session-arg` may be used as necessary to provide values to the contract, including the `ContractHash` you acquired above. In the example below, you will see a demonstration of the `ContractHash` as a session argument as `--session-arg "contract_key:key='hash-8c13aaeef50ae7f447ee21276965c31cfa45c4ea3abb03d35d078cdd6a40e4a'"`

```
$(get_path_to_client) put-deploy \
--node-address http://localhost:11101 \
--chain-name "casper-net-1" \
--payment-amount 500000000 \
--session-path <PATH> \
--session-arg "contract_key:key='hash-8c13aaeef50ae7f447ee21276965c31cfa45c4ea3abb03d35d078cdd6a40e4a'"
```

## Verifying Correct Contract Behavior

After calling your installed contract, you can verify that the contract behaved as expected by observing the associated change in [global state](../../developers/cli/installing-contracts.md#querying-global-state). Depending on how your contract functions, this can have different meanings and results. If we use our donation contract from the [basic smart contract tutorial](../../developers/writing-onchain-code/simple-contract.md), the NCTL process would have the following flow:

1) Send a `Deploy` to install the "Donation" smart contract.

2) Verify the execution of the `Deploy`.

3) Interact with the installed contract using an additional `Deploy` that calls one or several of the entry points. For example, calling the `donate` entry point to donate an amount to the fundraising purse.

4) Verify the associated change in global state. Namely, an increase in the balance of the fundraising purse.
