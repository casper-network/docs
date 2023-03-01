# Tutorial Walkthrough

Now that you are familiar with the basic commands, you can begin the tutorial walkthrough.

## Clone the Repository {#clone-the-repository}

First, you will need to clone [the counter contract repository](https://github.com/casper-ecosystem/counter) on our local machine.

```bash
git clone https://github.com/casper-ecosystem/counter
```

If you explore the source code, you will see that there are two versions of the counter contract and one file with session code that calls the contract's entry-points:

- `contract-v1`

    - This is the first version of the counter contract.
    - Defines two named keys: _counter_ to reference the contract and an associated variable _count_ to store a value.
    - Provides a function to get the current count (_count_get_).
    - Provides a function to increment the current count (_counter_inc_).
    
- `contract-v2`

    - This is a second version of the counter contract, which will not be used in this tutorial. 
    - This version provides an additional function to decrement the counter and to demonstrate contract upgrades in another tutorial.

- `counter-call`

 - This is session code that retrieves the _contract-v1_ contract, gets the current count value, increments it, and ensures the count was incremented by 1.

## View the Network State {#view-the-network-state}

With a network up and running, you can use the `casper-client query-global-state` command to check the status of the network. However, you first need an `account hash` and the `state-root-hash` so that you can get the current snapshot. Once you have that information, you can check the status of the network.

You will need to use the following three commands:

1. `casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]` - Get the account-hash
2. `casper-client get-state-root-hash` - Get the state-root-hash
3. `casper-client query-state` - Query the network state

Run through these commands in order.

```bash
casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
```

You will need to specify the location of your public-key files. If you used the block explorer to generate the keys, you will need to download them first.

Next, get the state-root-hash:

```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

You need to use the IP address of one of the [connected peers](https://testnet.cspr.live/tools/peers) on the Testnet as the node server since the network is running in a decentralized fashion. Make a note of the returned state root hash, but keep in mind that this hash value will need to be updated every time you modify the network state.

Finally, query the actual state:

```bash
casper-client query-global-state \
    --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH]
```

Substitute the state root hash and account hash values you just retrieved into this command and execute it. Do not be surprised if you see nothing on the network. That is because you have not sent anything to the network yet.

## Install the Contract {#install-the-contract}

Before installing the contract on the chain, you will need to compile it to Wasm.

The Makefile included in the repository makes compilation trivial. With these two commands, you can build (in release mode) and test the contract before installing it. _make prepare_ sets the Wasm target and _make test_ builds the contracts and verifies them.

```bash
cd counter
make prepare
make test
```

With the compiled contract, you can call the `casper-client put-deploy` command to install the contract on the chain.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./contract-v1/target/wasm32-unknown-unknown/release/counter-v1.wasm
```

-   Replace the `[PATH_TO_YOUR_KEY]` field with the actual path of where your secret key is stored.
-   The _session-path_ argument should point to wherever you compiled the counter-v1.wasm on your computer. The code snippet shows you the default path if the counter folder is in the same directory.

Once you call this command, it will return a deploy hash. You can use this hash to verify that the deploy successfully took place.

```rust
casper-client get-deploy \
    --node-address http://[NODE_IP]:7777 [DEPLOY_HASH]
```

## View the Updated Network State {#view-the-updated-network-state}

Hopefully, the deploy was successful. Call the `casper-client query-global-state` command to check if the named key is visible on the chain.

:::note

You must get the new state root hash since you just wrote a deploy to the chain.

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

You can actually dive further into the data stored on the chain using the query path argument or directly querying the deploy hash. Try the following commands and notice that each one gives you a different level of detail.

Retrieve the specific counter contract details:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH] \
    --key [ACCOUNT_HASH] -q "counter"
```

Retrieve the specific count value:

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

The first two commands access the `counter` and `count` named keys, respectively, using the query path argument. The third command uses the deploy hash (the return value of _put-deploy_) to query the state of that specific deploy only.

## Increment the Counter {#increment-the-counter}

You now have a counter on the chain, and you can increment it by calling the entry-point _counter_inc_, the function defined in the contract. You can call an entry-point in an installed contract by using the _put-deploy_ command as illustrated here:

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-name "counter" \
    --session-entry-point "counter_inc"
```

Notice that this command is nearly identical to the command used to deploy the contract. However, instead of _session-path_ pointing to the Wasm binary, you have _session-name_ and _session-entry-point_ identifying the on-chain contract and its associated entry-point to execute.

## View the Updated Network State Again {#view-the-updated-network-state-again}

After calling the entry-point, theoretically, the count value should increment by one, but how can you be sure of that? You can query the network again, however, remember that you have to get a new state root hash. Check if the count was incremented by looking at it with the query argument.

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

You should be able to see the count value and observe that it has increased.

## Increment the Counter Again {#increment-the-counter-again}

If you recall, in the repository there is session code called _counter-call_. Try to increment the count using that session code instead of the session entry-point used above.

Keep in mind, this is another _put-deploy_ call just like when you installed the contract. The session-path is once again going to be different for you depending on where you compiled the contract.

```bash
casper-client put-deploy \
    --node-address http://[NODE_IP]:7777 \
    --chain-name casper-test \
    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \
    --payment-amount 5000000000000 \
    --session-path ./counter/target/wasm32-unknown-unknown/release/counter-call.wasm
```

## View the Final Network State {#view-the-final-network-state}

To make sure that the session code ran successfully, get the new state root hash and query the network.


```bash
casper-client get-state-root-hash --node-address http://[NODE_IP]:7777
```

Get the network state, specifically for the count variable this time:

```bash
casper-client query-global-state --node-address http://[NODE_IP]:7777 \
    --state-root-hash [STATE_ROOT_HASH]
    --key [ACCOUNT_HASH] -q "counter/count"
```

If all went according to plan, your count value should be 2 at this point. 

Congratulations on building, installing, and using a smart contract on the Testnet!
