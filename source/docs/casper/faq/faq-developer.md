# FAQ - Developers

This section covers frequently asked questions and our recommendations from the developer's perspective.

### Getting Started {#getting-started}

<details>
 <summary><b>How do I fix a linking error with 'cargo build' on Windows?</b></summary>

**Question** : How can I fix this linking error while running `cargo build` on Windows?

<img src="../image/faq/q-cargo-build.png"  alt="cargo-build" width="800"/>

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

<img src="../image/faq/q-cmake-version.png"  alt="cmake-version" width="800"/>

**Answer** : This is a library compatibility issue that occurs with CMake version 18.04. Use `cmake --version` to check your current version of CMake. If you are on this version, perform an upgrade:

```
sudo snap install cmake
```

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
  
  The <a href="https://casper-ecosystem.github.io/casper-js-sdk/next/modules/_lib_keys_.html">Keys API</a>
   provides methods for <i>Ed25519</i> and <i>Secp256K1</i> keys. Also, review the tests in <a href="../docs/dapp-dev-guide/keys">GitHub</a> and the documentation.

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
