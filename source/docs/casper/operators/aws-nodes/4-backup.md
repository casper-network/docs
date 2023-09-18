---
title: Restore and Backup
---

# Restoring and Backing up Blockchain Data

## Resilience (Self-Healing)

The AWS Casper node contains two attached disks. The first disk contains the operating system and binaries. The second one contains the node data, mounted in the `/var/lib/casper/casper-node/` folder.

<p align="center">
<img src={"/image/operators/resilience-flow.png"} alt="Resilience Diagram"/>
</p>

## The Snapshot Creation Process

This diagram describes the workflow for the backup process using external AWS Volumes.

<p align="center">
<img src={"/image/operators/casper-backup.png"} alt="Backing up a Casper Node"/>
</p>

## The Data Healing Process

The following diagram describes the workflow process when restoring data from an external AWS volume.

<p align="center">
<img src={"/image/operators/casper-restore.png"} alt="Restoring a Casper Node"/>
</p>
