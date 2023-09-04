---
title: Restore and Backup
---

# Restoring and Backing up Blockchain Data

## Resilience (Self-Healing)

The AWS Casper node contains two attached disks. The first disk contains the operating system and binaries. The second one contains the node data, mounted in the `/var-/lib/casper/casper-node/` folder.

<p align="center">
<img src={"/image/operators/ResilienceDiag.png"} alt="Resilience Diagram"/>
</p>

## The Snapshot Creation Process

This diagram describes the workflow for the backup process using external AWS Volumes.

<p align="center">
<img src={"/image/operators/Casper_Backup.png"} alt="Casper_Backup"/>
</p>

## The Data Healing Process

The following diagram describes the workflow process when restoring data from an external AWS volume.

<p align="center">
<img src={"/image/operators/Casper_Restore.png"} alt="Casper_Restore"/>
</p>
