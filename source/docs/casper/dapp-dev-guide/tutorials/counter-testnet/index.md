---
title: Introduction
slug: /counter-testnet
---

# A Counter on the Testnet

This tutorial installs a simple counter contract on the Casper Testnet. The contract is straightforward and simply maintains a counter variable. If you want to learn to send deploys to a local Casper Network, you can follow a [similar tutorial](/dapp-dev-guide/tutorials/counter/index.md) and work with NCTL. Once you are familiar with this process, the next step will be to write more practical smart contracts.

Before we go through the tutorial, we will give a high-level overview of this tutorial's walkthrough and briefly summarize the relevant commands (and respective arguments).

- [Tutorial Overview](overview.md)
- [Important Commands](commands.md)
- [Tutorial Walkthrough](walkthrough.md)

## Prerequisites {#prerequisites}

1.  You have completed the [Getting Started tutorial](/dapp-dev-guide/writing-contracts/getting-started.md) to set up your development environment, including tools like _cmake_ (version 3.1.4+), _cargo_, and _Rust_.
2. Follow the installation instructions for the [Casper client](/dapp-dev-guide/setup/#the-casper-command-line-client). We will use the _casper-client_ to send deploys to the chain.
3. Proceed to [setting up and funding an account](/workflow/setup#setting-up-an-account) on the Casper Testnet. Make note of two critical pieces of information that you will need in order to complete this tutorial:
   - The location of your account’s **secret_key.pem** file
   - Your account’s **account-hash** identifier
4. [Select a node](/dapp-dev-guide/setup/#acquire-node-address-from-network-peers) whose RPC port will be receiving the deploys coming from your account to the Testnet.

## Video Tutorial {#video-tutorial}

If you prefer a video walkthrough of this guide, you can check out this video.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=rWaUiFFEyaY&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
