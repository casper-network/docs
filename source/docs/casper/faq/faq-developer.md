# FAQ - Developers

This section covers frequently asked questions and our recommendations from the developer's perspective.

### Getting Started {#getting-started}

<details>
 <summary><b>Problem in building the contract using cargo build?</b></summary>

**Question** : This occurred in Windows machine with AWS image. The command performed is 'cargo build' ,

<img src="../image/faq/q-cargo-build.png"  alt="cargo-build" width="800"/>

**Answer** : you have to install VC+ build tools so that rustc should be able to auto-detect the helper files. Or you can go with the VS 2013 or 2015(for auto-detection). There are two existing Rust toolchain families provided for Windows: msvc and gnu

**_msvc_** is the default, and as you realized, depends on a recent Visual C++ installation.

**_gnu_** on the other hand depends on GNU/MinGW-w64. It can be installed and made the default toolchain using:

```
$ rustup default stable-x86_64-pc-windows-gnu
```

</details>

<details>
 <summary><b> Rustup toolchain - invalid toolchain name problem  </b></summary>

**Question** : Having a message like 'error: caused by: invalid toolchain name:...'

**Answer** : First, check your rustup version details using the following commands,

```
rustup --version
```

```
rustup show
```

Then, perform the following set of commands to find the appropriate remedy,

-   Set minimal rustup profile

```
rustup set profile minimal
```

-   Install nightly separately

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y
```

```
rustup toolchain install nightly --allow-downgrade --profile minimal --component clippy
```

-   Update rustup

```
rustup update / rustup self update
```

Refer [rust toolchain installer](https://reposhub.com/rust/development-tools/rust-lang-rustup.html) for more explained details.

</details>

<details>
 <summary><b> cmake installation issues </b></summary>

**Question** : This is specifically found when running an AWS image on the Windows machine. The command performed is 'cargo build --release',

<img src="../image/faq/q-cmake-version.png"  alt="cmake-version" width="800"/>

**Answer** : Use `cmake --verison` to check version. This is a library compatibility issue that occurs with cmake 18.04 version. Perform below to upgrade,

```
sudo snap install cmake
```

**Question** : Problem when the directory structure is not properly set up,

<img src="../image/faq/q-makefile.png"  alt="makeFile" width="800"/>

**Answer** : Folder (`casper-node` in this context) should have the 'Makefile'. Perform following commands to recover,

```
make setup-rs
```

```
cargo clean
```

</details>

### Deploy Processing {#deploy-processing}

<details>
  <summary><b>How do I know that a deploy was finalized?</b></summary>
  
  If a deploy was executed, then it has been finalized. If the deploy status comes back as null, that means the deploy has not been executed yet. Once the deploy executes, it is finalized, and no other confirmation is needed. Exchanges that are not running a read-only node must also keep track of [finality signatures](#finality_signatures) to prevent any attacks from high-risk nodes.
</details>

### Finality Signatures {#finality-signatures}

<details>
  <summary><b>When are finality signatures needed?</b></summary>
  
  Finality signatures are confirmations from validators that they have executed the transaction. Exchanges should be asserting finality by collecting the weight of two-thirds of transaction signatures. If an exchange runs a read-only node, it can collect these finality signatures from its node. Otherwise, the exchange must assert finality by collecting finality signatures and have proper monitoring infrastructure to prevent a Byzantine attack.

Suppose an exchange connects to someone else's node RPC to send transactions to the network. In this case, the node is considered high risk, and the exchange must assert finality by checking to see how many validators have run the transactions in the network.

</details>

### Deploy_hash vs. Transfer_hash {#deploy_hash-vs-transfer_hash}

<details>
  <summary><b>How is a deploy_hash different than a transfer_hash?</b></summary>
  
  Essentially, there is no difference between a _deploy_hash_ and a _transfer_hash_ since they are both deploy transactions. However, the platform is labeling the subset of deploys which are transfers, to filter transfers from other types of deploys. In other words, a _transfer_hash_ is a native transfer, while a _deploy_hash_ is another kind of deploy.

</details>

### Account-hex vs. Account-hash {#account-hex-vs-account-hash}

<details>
  <summary><b>Should a customer see the account-hex or the account-hash?</b></summary>
  
  Exchange customers or end-users only need to see the _account-hex_. They do not need to know the _account_hash_. The _account_hash_ is needed in the backend to verify transactions. Store the _account-hash_ to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the _account-hex_.
</details>

### Example Deploy {#example-deploy}

<details>
  <summary><b>Can you provide an example of a deploy?</b></summary>
  
  You can find a _testDeploy_ reference in <a href="https://github.com/casper-ecosystem/casper-js-sdk/blob/next/test/lib/DeployUtil.test.ts#L5">GitHub</a>
</details>

### Operating with Keys {#operating-with-keys}

<details>
  <summary><b>How should we work with the PEM keys?</b></summary>
  
  The <a href="https://casper-ecosystem.github.io/casper-js-sdk/next/modules/_lib_keys_.html">Keys API</a>
   provides methods for _Ed25519_ and _Secp256K1_ keys. Also, review the tests in <a href="../docs/dapp-dev-guide/keys">GitHub</a> and the documentation.

</details>

### Other

<details>
 <summary><b>Does the node API have a 'getTransactions' function ?</b></summary>

The node API JSON-RPC endpoints are as follows:

-   "account_put_deploy"
-   "info_get_deploy" "info_get_peers"
-   "info_get_status"
-   "chain_get_block"
-   "chain_get_block_transfers"
-   "chain_get_state_root_hash"
-   "state_get_item"
-   "state_get_balance"
-   "chain_get_era_info_by_switch_block"
-   "state_get_auction_info"

The node API SSE events are as follows:

-   BlockAdded
-   DeployProcessed
-   ConsensusFinalitySignature

Via. a combination of the above you can pull information from the chain such as transaction sets.

</details>

<details>
 <summary><b>How would be query transaction for an account?</b></summary>

On chain accounts are associated with an account address. Transaction data includes account address as a sub-field.

</details>

<details>
 <summary><b>Is there a service like infura.io that we can use now or in the future?</b></summary>

Not atm but [make services](https://make.services) are actively building out such a service. Contact Michael Steur for further information.

`To scale queries for thousands of clients, we would need to run multiple nodes or index the blockchain ourselves.`

Perhaps collaborating with make.services might fulfill your requirements and contribute to the wider eco-system at the same time.

</details>

<details>
 <summary><b>For wallet generation, can you point me to an open-source implementation or library? I see CasperLabs uses the ed25519 curve. Can you give me more specifics for seed generation?</b></summary>

The only wallet like application atm is the Casper Signer - a google chrome extension. But it is simplistic & has not been security reviewed. The CSPR chain supports ed25519 as well as secp256k1, therefore extending a current wallet implementation would not be difficult. CSPR will be registered on slip-0044 and the recommended seed derivation path documented.

</details>

## Useful Resources {#useful-resources}

<details>
  <summary><b>The Casper Association makes available the following resources for you to connect and get support:</b></summary>

-   On our <a href="https://discordapp.com/invite/mpZ9AYD">Discord Channel</a>, connect live with members of our Engineering Team available to support you with the progress of your projects
-   Join the <a href="https://forums.casperlabs.io/">Community Forum</a> that includes technical discussions on using Casper features, obtain support, and pose questions
-   Subscribe to the <a href="https://t.me/casperblockchain">Casper Network Official Telegram Channel</a> for general information and updates about the platform

If you find issues, search the main <a href="https://github.com/casper-network">Casper Network repository</a> and file the issue in the related project.

Otherwise, use our <a href="https://casperlabs.atlassian.net/servicedesk">Jira Service Desk</a> for situations such as:

-   questions that are not issues
-   needing technical support
-   wanting to give feedback
-   suggesting improvements
-   participating in a bounty

</details>
