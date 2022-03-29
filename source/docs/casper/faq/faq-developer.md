# FAQ - Developers

import useBaseUrl from '@docusaurus/useBaseUrl';

This section covers frequently asked questions and our recommendations from the developer's perspective.

### Getting Started {#getting-started}

<details>
 <summary><b>How do I fix a linking error with 'cargo build' on Windows?</b></summary>

**Question** : How can I fix this linking error while running `cargo build` on Windows?

<img src={useBaseUrl("/image/faq/q-cargo-build.png")} alt="cargo-build" width="800"/>

**Answer** : You have to install the VC+ build tools so that `rustc` can auto-detect the helper files that are part of the building process. Or you can build using Visual Studio 2013 or 2015. There are two existing Rust toolchain families provided for Windows: `msvc` and `gnu`:

-   **_msvc_** is the default, and as you realized, it depends on a recent Visual C++ installation.
-   **_gnu_**, on the other hand, depends on GNU/MinGW-w64. It can be installed and made the default toolchain using this command:

    ```bash
    $ rustup default stable-x86_64-pc-windows-gnu
    ```

</details>

<details>
 <summary><b>Why do I get an invalid toolchain name?</b></summary>

**Question** : How can I fix an error caused by an invalid toolchain name, such as: `error: caused by: invalid toolchain name:...`?

**Answer** : First, check your `rustup` version using the following commands:

```bash
rustup --version
```

```bash
rustup show
```

Then, find the appropriate remedy:

-   Set the minimal rustup profile:

```bash
rustup set profile minimal
```

-   Install the nightly Rust toolchain separately with these two commands:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y
```

```bash
rustup toolchain install nightly --allow-downgrade --profile minimal --component clippy
```

-   Update rustup with one of these commands:

```bash
rustup update
```

```bash
rustup self update
```

Refer to the [Rust toolchain installer](https://rustup.rs/) for more details.

</details>

<details>
<summary><b>What should I do if I am encountering errors installing cargo-casper?</b></summary>

Ensure that you have installed both Rust and CMake before attempting to install cargo-casper.

</details>

<details>
 <summary><b>What are missing generic arguments in 'cargo build'?</b></summary>

**Question** : The `cargo build --release` command fails due to missing generic arguments. How can I fix this?

<img src={useBaseUrl("/image/faq/q-cmake-version.png")} alt="cmake-version" width="800"/>

**Answer** : This is a library compatibility issue that occurs with CMake version 18.04. Use `cmake --version` to check your current version of CMake. If you are on this version, perform an upgrade:

```
sudo snap install cmake
```

</details>

<details>
<summary><b>Can blockchain smart contracts interact with the outside world?</b></summary>

No, smart contracts cannot interact with the world outside of the blockchain on which they live. For example, a smart contract cannot act as a REST endpoint or data source. Smart contracts can interact with other contracts in the same environment, or with compatible external libraries. When creating an external library to interact with a Casper smart contract, consider the following:

* WASM is expressed as `little-endian` by default. Check for endianness compatibility.
* As `wasm32-unknown-unknown` is a 32-bit platform, it cannot support 64-bit external code. Your library needs to be compatible with 32-bit code.
* Consider a library that supports `no_std`.
* Try to avoid native operating system calls. If the library uses the filesystem, sockets, or other native OS functionality, then it may not work with a Casper smart contract.

</details>

<details>
<summary><b>Why do I receive a 'casper-client: command not found' error?</b></summary>

Refer to the [Casper Command-line Client](https://docs.casperlabs.io/workflow/setup#the-casper-command-line-client) document for instructions on interacting with the Casper Network.

</details>

### Deploys {#deploys}

<details>
<summary><b>What determines the cost of a deploy?</b></summary>

Native system transfers have a fixed gas cost. Calling system contracts by their hashes also has a fixed cost.

If two calls with different arguments but for the same hash show different gas costs, it is a result of executed WASM code. Different arguments may lead to different code paths and executed opcodes. You cannot predict the number of executed opcodes or host functions.

If the calls use the same arguments, yet the cost is increasing, you might consider reviewing your global state usage. There is a chance that you are reading a collection from the global state, updating it and writing back with a larger size.

</details>

<details>
<summary><b>Why does my deploy get an 'Out of Gas' error?</b></summary>

If you receive this error, try specifying a higher amount of CSPR for the deployment.

</details>

<details>
 <summary><b>How do I know that a deploy was finalized?</b></summary>
  
If a deploy was executed, then it has been finalized. If the deploy status comes back as null, that means the deploy has not been executed yet. Once the deploy executes, it is finalized, and no other confirmation is needed. Exchanges that are not running a read-only node must also keep track of <a href="/faq/faq-developer/#finality-signatures">finality signatures</a> to prevent any attacks from high-risk nodes.

</details>

<details>
<summary><b>Is there a client API to query a Casper node's RPC endpoint?</b></summary>

The client API to query a node's RPC endpoint is available at [Casper RPC API](http://casper-rpc-docs.s3-website-us-east-1.amazonaws.com/). You can find specific node-addresses at cspr.live for the [Testnet](https://testnet.cspr.live/tools/peers) or [Mainnet](https://cspr.live/tools/peers).

</details>

<details>
<summary><b>How can I monitor the events a node is emitting?</b></summary>

You can monitor a node's event stream on the port specified as the event_stream_server.address in the node's config.toml, which is by default 9999 on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers. You will need the IP address of a [peer](https://casper.network/docs/workflow/setup/#acquire-node-address-from-network-peers) on the network. For more details and examples, visit the [Monitoring Events](../dapp-dev-guide/monitoring-events) page.
</details>

<details>
 <summary><b>How can I query a deploy for an account?</b></summary>

On-chain accounts are associated with an account address. Deploy data includes account address as a sub-field.

</details>

<details>
  <summary><b>When are finality signatures needed?</b></summary>
  
  Finality signatures are confirmations from validators that they have executed the deploy. Exchanges should be asserting finality by collecting the weight of two-thirds of deploy signatures. If an exchange runs a read-only node, it can collect these finality signatures from its node. Otherwise, the exchange must assert finality by collecting finality signatures and have proper monitoring infrastructure to prevent a Byzantine attack.
<br/><br/>
Suppose an exchange connects to someone else's node RPC to send deploys to the network. In this case, the node is considered high risk, and the exchange must assert finality by checking to see how many validators have run the deploys in the network.

</details>

<details>
  <summary><b>How is a deploy_hash different than a transfer_hash?</b></summary>
  
  Essentially, there is no difference between a  <i>deploy_hash</i> and a <i>transfer_hash</i> since they are both deploys. However, the platform is labeling the subset of deploys which are transfers, to filter transfers from other types of deploys. In other words, a <i>transfer_hash</i> is a native transfer, while a <i>deploy_hash</i> is another kind of deploy.

</details>

<details>
  <summary><b>Can you provide an example of a deploy?</b></summary>
  
  You can find a deploy reference in <a href="https://github.com/casper-ecosystem/casper-js-sdk/blob/next/test/lib/DeployUtil.test.ts#L5">GitHub</a>.
</details>

<details>
 <summary><b>Does the node API have a 'getTransactions' function?</b></summary>

The node API JSON-RPC is found <a href="http://casper-rpc-docs.s3-website-us-east-1.amazonaws.com/">here</a>. Also, the node emits the following events:

-   BlockAdded
-   DeployProcessed
-   ConsensusFinalitySignature

With these APIs, you can pull information from the node, such as transaction sets.

</details>

<details>
 <summary><b> When is the balance updated after a deploy?</b></summary>

 Execution occurs after consensus. As outlined [here in the dApp Development Guide]( https://docs.casperlabs.io/dapp-dev-guide/deploying-contracts#check-deploy-status), deployments are queued in the system before being listed in a block for execution.

 Balance updates should occur after contract execution and block finalization.

</details>

<details>
 <summary><b>How do I handle a deploy composed of multiple transfers?</b></summary>

 Applying a unique ID to each transfer can mitigate issues with multiple transfers in a single deploy. Once included in a block, the network finalizes the deploy containing multiple transfers.

</details>

### Operating with Keys {#operating-with-keys}

<details>
  <summary><b>How should we work with the PEM keys?</b></summary>
  
  The <a href="https://casper-ecosystem.github.io/casper-js-sdk/next/modules/_lib_keys_.html">Keys API</a> provides methods for <i>Ed25519</i> and <i>Secp256K1</i> keys. Also, review the tests in <a href="/dapp-dev-guide/keys/">GitHub</a> and the documentation. For more information on creating and working with keys, see <a href="/dapp-dev-guide/keys/">Accounts and Cryptographic Keys</a>.

</details>

<details>
<summary><b>What is the difference between key management and deployment?</b></summary>

There are two types of action that an account can perform: deployment and key management. Deployment is simply executing some code on the blockchain, while key management involves changing the associated keys. Key management cannot occur independently, but must come via a deploy. Therefore, a key management action implies that a deployment action also occurs.

You may also reference the following two documents for additional information:

- [Accounts](https://docs.casperlabs.io/design/accounts)
- [Multi-Signature Tutorial](https://docs.casperlabs.io/multi-sig)

</details>

<details>
<summary><b>How is 'Keys-manager.js' used in the Multi-Signature Tutorial?</b></summary>

In the [Multi-Signature Tutorial](https://docs.casperlabs.io/multi-sig), `scenario-*.js` accesses functions from `key-manager.js` through `const keyManager = require('./key-manager');`.

</details>

<details>
<summary><b>Is there a way to query all the '(key, value)' pairs in a 'casper dictionary'?</b></summary>

No, you need to know the keys beforehand. If you want to iterate over the dictionary list, you can list keys numerically and keep the length in another value.

</details>

### Information on nctl {#information-on-nctl}


<details>
<summary><b>Some nctl commands are working correctly, while others are causing errors.</b></summary>

This issue may be caused by an incomplete or unsuccessful install of nctl. Once it is installed, use the command `nctl-status` to see if it is running normally. It should show five running noes and five stopped.

If it does not, the nctl install did not install correctly. Usually, the failure reasons are OS and hardware specifications. If you are running Linus on Windows, we suggest switching to VirtualBox.

</details>

<details>

<summary><b>How do I fix an openssl error when compiling nctl?</b></summary>

**Question** : When I attempted to run 'nctl-compile' on MacOS, I received the following error: 'error: failed to run custom build command for openssl-sys v0.9.67'. How can I fix this?

**Answer** : If you issue the command `brew info openssl` it will return info that appears similar to the following:

```
...
For pkg-config to find openssl@3 you may need to set:
    export PKG_CONFIG_PATH="usr/local/opt/openssl@3/lib/pkgconfig"
...
```

The next step is to issue the above command. In this example, you would use `PKG_CONFIG_PATH="/usr/local/opt/openssl@3/lib/pkgconfig"`.

After this, `nctl-compile` should work correctly.

</details>

<details>
<summary><b>How do I fix connection errors with nctl?</b></summary>

**Question** : When running nctl, how do I resolve a `Failed to get RPC response: error sending request for url (http://127.0.0.1:22102/rpc): connection error: Connection reset by peer (os error 54)` error?

**Answer** : You should specify RPC ports as follows:

```

[rpc_server]
address = "0.0.0.0:11102"

```

You can find more command info [here](https://github.com/casper-network/casper-node/blob/master/utils/nctl/docs/commands-view-node.md#nctl-viewing-node-information).

</details>

### Errors {#errors}

<details>
 <summary><b>What factors cause the 'APIError::InvalidPurse' error?</b></summary>

 The three main factors that cause an InvalidPurse error are:

 1. The purse in question does not exist.
 2. The purse is not of type U512.
 3. The sending and receiving purses are identical.

</details>

<details>
 <summary><b>What causes an 'ApiError::MissingArgument [2]' error?</b></summary>

 This error occurs when there is an incorrect session argument. The session argument must be U512.

</details>

### Other Topics {#other-topics}

<details>
<summary><b>Why do I get an 'Encountered operation forbidden by gas rules' error?</b></summary>

Casper node does not natively allow floating point opcodes. 

</details>

<details>
<summary><b>How do I add ZK proofs within Casper?</b></summary>

ZK proof inclusion would require building the proof verification inside the smart contract. You would need to add either of the following to your contract:

- [GitHub - paritytech/bn: Pairing cryptography library in Rust](https://github.com/paritytech/bn)
- [GitHub - zkcrypto/pairing: Pairing-friendly elliptic curve library.](https://github.com/zkcrypto/pairing)

Verifications would then need to use the associated library.

</details>


