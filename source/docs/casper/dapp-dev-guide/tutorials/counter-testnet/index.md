---
title: Introduction
slug: /counter-testnet
---

# A Counter on the Testnet

This tutorial installs a simple counter contract on the Casper Testnet. The contract is straightforward and simply maintains a counter variable. If you want to learn to send deploys to a local Casper Network, you can follow a [similar tutorial](../counter/index.md) and work with NCTL. Once you are familiar with this process, the next step would be to write more practical smart contracts.

Here is how the tutorial is structured:

- [Tutorial Overview](./overview.md) - Introduction to the process and what will be covered
- [Important Commands](./commands.md) - A summary of all relevant commands and respective arguments
- [Tutorial Walkthrough](./walkthrough.md) - Step-by-step tutorial instructions 

## Prerequisites {#prerequisites}

1.  You have completed the [Getting Started tutorial](../../writing-contracts/getting-started.md) to set up your development environment, including tools like _cmake_ (version 3.1.4+), _cargo_, and _Rust_.
2. You have installed the [Casper client](../../setup.md#the-casper-command-line-client) to send deploys to the chain.
3. You were able to [set up and fund an account](../../setup.md#setting-up-an-account) on the Casper Testnet. Make note of two critical pieces of information that you will need to complete this tutorial:
   - The location of your account’s **secret_key.pem** file
   - Your **account hash** identifier
4. You [selected a node](../../setup.md#acquire-node-address-from-network-peers) whose RPC port will be receiving the deploys coming from your account.

## Video Tutorial {#video-tutorial}

If you prefer a video walkthrough of this guide, you can check out this video.

<iframe width="560" height="315" src="https://www.youtube.com/embed?v=rWaUiFFEyaY&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
