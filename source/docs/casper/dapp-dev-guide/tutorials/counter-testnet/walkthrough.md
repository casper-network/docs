# Tutorial Walkthrough

Now that we are familiar with the basic commands, we can begin the tutorial to deploy a contract application and use it on the network.

## Clone the Contracts {#clone-the-contracts}

First, we will need to clone [the counter contract repository](https://github.com/casper-ecosystem/counter) to our local machine.

```bash
git clone https://github.com/casper-ecosystem/counter
```

If you explore the source code, you will see that there are two versions of the counter contract and one file with session code that calls the contract's entry-points:

-   `contract-v1`

    -   This is a first version of the counter contract.
    -   Defines two named keys: _counter_ to reference the contract and an associated variable _count_ to store the number of times we increment the counter.
    -   Provides a function to get the current count (_count_get_).
    -   Provides a function to increment the current count (_counter_inc_).
    
-   `contract-v2`

    -   This is a another version of the counter contract. This version upgrades the contract and provides additional function to decrement the counter. 
    -   We will not be using _contract-v2_ in this tutorial, yet we will be learning about it in the _Upgrade tutorial_.

-   `counter-call`

    -   Retrieves the _contract-v1_ contract, gets the current count value, increments it, and makes sure count was incremented by 1.

## View the Network State {#view-the-network-state}

With a network up and running, you can use the `casper-client query-global-state` command to check the status of the network. However, we first need an `account hash` and the `state-root-hash` so that we can get the current snapshot. Once we have that information, we can check the status of the network.

As a summary, we need to use the following three commands:

1. Get the account-hash: `casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]`
2. Get the state-root-hash: `casper-client get-state-root-hash`
3. Query the network state: `casper-client query-state`

Let's execute the commands in order. First, we need the account-hash:

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
```

You will need to specify the location of your public-key files. If you used the block explorer to generate the keys, you will need to download them first.

Next, get the state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

We need to use the IP address of one of the [connected peers](https://testnet.cspr.live/tools/peers) on the Testnet as the node server since the network is running in a decentralized fashion. Make a note of the returned state-root-hash, but keep in mind that this hash value will need to be updated every time we modify the network state.

Finally, query the actual state:

```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH]
```

Substitute the state root hash and account hash values you just retrieved into this command and execute it. Do not be surprised if you see nothing on the network. That is because we have not sent anything to the network yet!

## Deploy the Counter {#deploy-the-counter}

Let us try installing the _contract-v1_ contract to the chain. First, we need to compile it.

The makefile included in the repository makes compilation trivial. With these two commands, we can build (in release mode) and test the contract before installing it. _make prepare_ sets the Wasm target and _make test_ builds the contracts and verifies them.

```bash
cd counter
make prepare
make test
```

With the compiled contract, we can call the `casper-client put-deploy` command to install the contract on the chain.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./contract-v1/target/wasm32-unknown-unknown/release/counter-v1.wasm
```

-   Replace the `[PATH_TO_YOUR_KEY]` field with the actual path of where your secret key is stored.
-   The _session-path_ argument should point to wherever you compiled counter-define.wasm on your computer. The code snippet shows you the default path if the counter folder is in the same directory.

Once you call this command, it will return a deploy hash. You can use this hash to verify that the deploy successfully took place.

```rust
casper-client get-deploy \
    --node-address http://[NODE_IP]:7777 [DEPLOY_HASH]
```

## View the Updated Network State {#view-the-updated-network-state}

Hopefully, the deploy was successful. Let us call the `casper-client query-global-state` command to check if the named key is visible on the chain now.

:::note

We must get the new state root hash since we just wrote a deploy to the chain.

:::

If you run these two commands, there will be a new counter named key on the chain.

Get the NEW state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Get the network state:

```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH]
```

We can actually dive further into the data stored on the chain using the query path argument or directly querying the deploy hash. Try the following commands and notice that each one gives you a different level of detail.

Retrieve the specific counter contract details:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter"
```

Retrieve the specific counter variable details:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter/count"
```

Retrieve the specific deploy details:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] --key deploy-[DEPLOY_HASH]
```

The first two commands access the counter and count named keys, respectively, using the query path argument. The third command uses the deploy hash (the return value of _put-deploy_) to query the state of that specific deploy only.

## Increment the Counter {#increment-the-counter}

We now have a counter on the chain, and we verified everything is good. Now we want to increment it. We can do that by calling the entry-point _counter_inc_, the function we defined in the _contract-v1_ contract. You can call an entry-point in an installed contract by using the _put-deploy_ command as illustrated here:

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-name "counter" \
    --session-entry-point "counter_inc"
```

Notice that this command is nearly identical to the command used to deploy the contract. However, instead of _session-path_ pointing to the Wasm binary, we have _session-name_ and _session-entry-point_ identifying the on-chain contract and its associated function to execute. There is no Wasm file needed since the contract is already on the blockchain.

## View the Updated Network State Again {#view-the-updated-network-state-again}

After calling the entry-point, theoretically, the counter value should increment by one, but how can we be sure of that? We can query the network again, however, remember that we have to get a new state root hash. Let us check if the counter was incremented by looking at the count with the query argument.

Get the NEW state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Get the network state, specifically for the count variable this time:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter/count"
```

You should be able to see the counter variable and observe its value has increased now.

## Increment the Counter Again {#increment-the-counter-again}

If you recall, we had a third session code named _counter-call_ in the repository. This time around, we can see if we can increment the count using that session code instead of the session entry-point we used above.

Keep in mind, this is another _put-deploy_ call just like when we sent the _contract-v1_ contract to the blockchain. The session-path is once again going to be different for you depending on where you compiled the contract.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./counter/target/wasm32-unknown-unknown/release/counter-call.wasm
```

## View the Final Network State {#view-the-final-network-state}

Before we wrap up this guide, let us make sure that the second contract did update the counter from the first contract. Just as before, we need a new state-root-hash, and then we can query the network.

Get the NEW state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Get the network state, specifically for the count variable this time:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH]
    --key [ACCOUNT_HASH] -q "counter/count"
```

If all went according to plan, your counter should have gone from 0 to 1 before and now from 1 to 2 as you incremented it throughout this tutorial. Congratulations on building, installing, and using a smart contract on your local test network! Now you are ready to build your own dApps and launch them onto the Casper blockchain.
