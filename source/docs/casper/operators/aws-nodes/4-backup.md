# Restore & Backup Blockchain data

## Resilience (Self-Healing)

The node contains two attached disks. The first one, as root (operating system and binaries), and the second one containing the node data, this will be mounted in the folder where the node data is stored, in `/var-/lib/casper/casper-node/`.

<p align="center">
<img src={"/image/operators/ResilienceDiag.png"} alt="Resilience Diagram" width="600"/>
</p>

## Blockchain Snapshot Creation Process

This is the workflow for the Backup Process using external AWS Volumes

<p align="center">
<img src={"/image/operators/Casper_Backup.png"} alt="Casper_Backup" width="600"/>
</p>

## Blockchain Data Healing Process

This is the Workflow process when restoring from an External AWS Volume

<p align="center">
<img src={"/image/operators/Casper_Restore.png"} alt="Casper_Restore" width="600"/>
</p>
