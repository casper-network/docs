import useBaseUrl from '@docusaurus/useBaseUrl';

# FAQ - Developers

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

Refer to the [Rust toolchain installer](https://reposhub.com/rust/development-tools/rust-lang-rustup.html) for more details.

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
<summary><b>Where can I begin learning about deploying NFTs on the Casper Network?</b></summary>

The following link contains the current standard and an example implementation:

[Enhancing the Casper NFT Standard](https://gitcoin.co/issue/casper-network/gitcoin-hackathon/8/100026584)

</details>

### Finality Signatures {#finality-signatures}

<details>
  <summary><b>When are finality signatures needed?</b></summary>
  
  Finality signatures are confirmations from validators that they have executed the transaction. Exchanges should be asserting finality by collecting the weight of two-thirds of transaction signatures. If an exchange runs a read-only node, it can collect these finality signatures from its node. Otherwise, the exchange must assert finality by collecting finality signatures and have proper monitoring infrastructure to prevent a Byzantine attack.
<br/><br/>
Suppose an exchange connects to someone else's node RPC to send transactions to the network. In this case, the node is considered high risk, and the exchange must assert finality by checking to see how many validators have run the transactions in the network.

</details>

### Deploy_hash vs. Transfer_hash {#deploy_hash-vs-transfer_hash}

<details>
  <summary><b>How is a deploy_hash different than a transfer_hash?</b></summary>
  
  Essentially, there is no difference between a  <i>deploy_hash</i> and a <i>transfer_hash</i> since they are both deploy transactions. However, the platform is labeling the subset of deploys which are transfers, to filter transfers from other types of deploys. In other words, a <i>transfer_hash</i> is a native transfer, while a <i>deploy_hash</i> is another kind of deploy.

</details>

### Example Deploy {#example-deploy}

<details>
  <summary><b>Can you provide an example of a deploy?</b></summary>
  
  You can find a deploy reference in <a href="https://github.com/casper-ecosystem/casper-js-sdk/blob/next/test/lib/DeployUtil.test.ts#L5">GitHub</a>.
</details>

### Operating with Keys {#operating-with-keys}

<details>
  <summary><b>How should we work with the PEM keys?</b></summary>
  
  The <a href="https://casper-ecosystem.github.io/casper-js-sdk/next/modules/_lib_keys_.html">Keys API</a> provides methods for <i>Ed25519</i> and <i>Secp256K1</i> keys. Also, review the tests in <a href="../dapp-dev-guide/keys">GitHub</a> and the documentation. For more information on creating and working with keys, see <a href="../dapp-dev-guide/keys">Working with Cryptographic Keys</a>.

</details>

### Other

<details>
 <summary><b>Does the node API have a 'getTransactions' function?</b></summary>

The node API JSON-RPC is found <a href="http://casper-rpc-docs.s3-website-us-east-1.amazonaws.com/ ">here</a>. Also, the node emits the following events:

-   BlockAdded
-   DeployProcessed
-   ConsensusFinalitySignature

With these APIs, you can pull information from the node, such as transaction sets.

</details>

<details>
 <summary><b>How can I query a transaction for an account?</b></summary>

On-chain accounts are associated with an account address. Transaction data includes account address as a sub-field.

</details>

<details>
 <summary><b>Do you have an example wallet or library?</b></summary>

**Question**: For wallet generation, can you point me to an open-source implementation or library? I see that Casper uses the ed25519 curve cryptography. Can you give me more details for seed generation?

**Answer**: The <a href="https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce">CasperLabs Signer</a> is a wallet-like application. But, it is simplistic and has not been security reviewed. The Casper Network supports ed25519 as well as secp256k1 keys; therefore, extending a current wallet implementation would not be difficult.

</details>

### Hackathon Questions

<details>
<summary><b>Why do I get an 'Encountered operation forbidden by gas rules' error?</b></summary>

Casper node does not natively allow floating point opcodes. 

</details>

<details>
<summary><b>How do I update my status in the Hackathon list?</b></summary>

To update your status on the [Hackathon list](https://github.com/casper-network/gitcoin-hackathon/issues/29), you must update or submit your work on the [Gitcoin UI](https://gitcoin.co/issue/casper-network/gitcoin-hackathon/29).

</details>

<details>
<summary><b>Do I need to use the `stop work` button after a project submission on Gitcoin?</b></summary>

Yes, you will need to `stop work` to flag the submission as ready for review.

</details>

[//]: # "Is this still relevant?"

<details>
<summary><b>When installing casper-node, I receive a compilation error due to failing to select a version for snow.</b></summary>

Use the following command:

```
cargo +nightly-2021-06-17 install casper-client --locked

```

</details>

<details>
<summary><b>When using the command ntcl-assets-setup && nctl-start, I receive a 'path too long' error.</b></summary>

Choose a short path for your working directory. Otherwise, the NCTL tool will report that the path is too long.

</details>

<details>
<summary><b>Why do I receive a 'casper-client: command not found' error when I run 'casper-client get-state-root-hash --node-address http://localhost:11101/`?</b></summary>

1. Open this link: [https://repo.casperlabs.io/](https://repo.casperlabs.io/)
2. Use the instructions to add our repo to your apt dependencies (Assuming you use Ubuntu).
3. Use the command `sudo apt install casper-client`

</details>

<details>
<summary><b>How do I resolve a `Failed to get RPC response: error sending request for url (http://127.0.0.1:22102/rpc): connection error: Connection reset by peer (os error 54)` error?</b></summary>

You should specify RPC ports as follows:

```

[rpc_server]
address = "0.0.0.0:11102"

```

You can find more command info [here](https://github.com/casper-network/casper-node/blob/master/utils/nctl/docs/commands-view-node.md#nctl-viewing-node-information)

</details>

<details>
<summary><b>What is the '--chain-name' for NCTL?</b></summary>

The chain name is Casper-net-1.

</details>

<details>
<summary><b>Is there a way to query all the '(key, value)' pairs in a 'casper dictionary'?</b></summary>

No, you need to know the keys before hand. If you want to iterate over the dictionary list, you can list keys numerically and keep the length in another value.

</details>

<details>
<summary><b>How do I add ZK proofs within Casper?</b></summary>

ZK proof inclusion would require building the proof verification inside the smart contract. You would need to add either of the following to your contract:

[GitHub - paritytech/bn: Pairing cryptography library in Rust](https://github.com/paritytech/bn)

or

[GitHub - zkcrypto/pairing: Pairing-friendly elliptic curve library.](https://github.com/zkcrypto/pairing)

Verifications would then need to use the associated library.

</details>

<details>
<summary><b>How do I rectify an 'Invalid context' error caused by the 'mint_one' function from a CEP47 contract?</b></summary>

Deploying a CEP47 contract sets the deploying account as admin by default. Only this account can execute burn and mint functions.

</details>

<details>
<summary><b>Some NCTL commands are working correctly, while others are causing errors.</b></summary>

This issue may be caused by an incomplete or unsuccessful install of NCTL. Once it is installed, use the command `nctl-status` to see if it is running normally. It should show five running noes and five stopped.

If it does not, the NCTL install did not install correctly. Usually, the failure reasons are OS and hardware specifications. If you are running Linus on Windows, we suggest switching to VirtualBox.

</details>

<details>
<summary><b>When running 'nctl-assets-setup && nctl-start' I receive a 'Command 'supervisord' not found' error.</b></summary>

You need to install supervisor in your Python virtual environment using `pip install supervisor`

</details>

<details>
<summary><b>Can you explain 'get-account-key', 'get-key-pair', 'get-key-pair-from-*', 'get-signature' and 'get-hash'?</b></summary>

These are cryptography related functions. Casper Node supports two ECC curves, secp256k1 and ed25519. Additionally, it supports blake2b as a hashing algorithm by default. The Python implementations are as follows:

[casper-python-sdk/pycspr/crypto at main - casper-network/casper-python-sdk](https://github.com/casper-network/casper-python-sdk/tree/main/pycspr/crypto)

[casper-python-sdk/ecc.py at main - casper-network/casper-python-sdk](https://github.com/casper-network/casper-python-sdk/blob/main/pycspr/crypto/ecc.py)

[casper-python-sdk-hashifier.py at main - casper-network/casper-python-sdk](https://github.com/casper-network/casper-python-sdk/blob/main/pycspr/crypto/hashifier.py)

[casper-python-sdk/hashifier_blake2b.py at main - casper-network/casper-python-sdk](https://github.com/casper-network/casper-python-sdk/blob/main/pycspr/crypto/hashifier_blake2b.py)

The following are Java implementations:

[https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/CasperSdk.java](https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/CasperSdk.java)

[https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/SigningService.java](https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/SigningService.java)

[https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/HashService.java](https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/HashService.java)

Both `get-account-key` and `get-account-hash` are higher level CL specific cryptographic functions. `get-account-key` returns the underlying key pair's public key, prefixed with a single byte indicating the ECC curve type. `get-account-hash` returns the on-chain address of hte account associated with an account key. Here are the Python implementations:

[casper-python-sdk/cl_operations.py at main - casper-network/casper-python-sdk](https://github.com/casper-network/casper-python-sdk/blob/main/pycspr/crypto/cl_operations.py)

Here are the Java implementations:

[https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/HashService.java](https://github.com/casper-network/casper-java-sdk/blob/main/src/main/java/com/casper/sdk/service/HashService.java)

The `get-account-hash` function is specific and needs to be implemented correctly. Otherwise, the derived on-chain account addresses will be incorrect and funds may be lost.

</details>

<details>
<summary><b>'Keys-manager.js' does not appear in client code. How is it used?</b></summary>

`scenario-*.js` accesses functions from `key-manager.js` through `const keyManager = require('./key-manager');`

</details>

<details>
<summary><b>Libs.rs and api.rs are not present in contract/src within keys-manager as per the video tutorial. I only see main.rs and errors.rs.</b></summary>

This is a correctly compiled and deployed. All important functions fall under main.rs after a recent update.

</details>

<details>
<summary><b>What is the difference between key management and deployment?</b></summary>

There are two types of action that an account can perform: deployment and key management. Deployment is simply executing some code on the blockchain, while key management involves changing the associated keys. Key management cannot be performed independently, but must come via a deploy. Therefore, a key management action implies that a deployment action also occurs.

</details>

<details>

<summary><b>When I attempted to run 'nctl-compile' on MacOS, I received the following error: 'error: failed to run custom build command for 'openssl-sys v0.9.67'</b></summary>

If you issue the command `brew info openssl` it will return info that appears similar to the following:

```
...
For pkg-config to find openssl@3 you may need to set:
    export PKG_CONFIG_PATH="usr/local/opt/openssl@3/lib/pkgconfig"
...
```

The next step is to issue the above command. In this example, you would use `PKG_CONFIG_PATH="/usr/local/opt/openssl@3/lib/pkgconfig"`

After this, `nctl-compile` should work correctly.

</details>