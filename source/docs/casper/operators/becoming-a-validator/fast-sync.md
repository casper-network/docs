---
title: Fast-Sync
---

# Introducing Fast-Sync

import useBaseUrl from '@docusaurus/useBaseUrl';

The Casper Network is a smart contract platform. It requires new nodes to download and execute each and every block to join the network. Starting from genesis (start of the Mainnet), the node executes each deploy in every block. This process continues until the node has arrived at the current state of the blockchain. This process to sync a node with the blockchain can take a very long time.

To provide an alternative and faster approach to joining a Casper network, we have introduced fast‑sync. Fast-sync does not start syncing at the genesis block; instead, the user verifies a recent block, e.g. using block explorers, and provides its hash to the node software. The network [global state](../../concepts/design/casper-design.md#global-state-head) — smart contract data, account balances and all other on-chain information — is the storage layer of the blockchain and is massive in size, so fast-sync downloads the global state of only the most recent block. The following section briefly describes the fast-sync process.

## How Fast-sync Works

<img src={useBaseUrl("/image/fast-sync-process.png")} class="Fast-sync process" width="500"/>

For fast-sync, you need to provide the trusted hash of a block on a Casper network in the config.toml file. Fast-sync uses this trusted block as part of the cryptographic verification for the later blocks. This trusted block is downloaded, as are all newer blocks up to and including the most recent block from the current era. For example, if the trusted block hash is 5 hours old, it will first download that block, then newer blocks until it arrives at one that is only a few minutes old. It then downloads the newer block's global state. Finally, it executes all blocks the network created while the download was in progress, until it is fully in sync.

