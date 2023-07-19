---
title: Hardware
---

# Recommended Hardware Specifications

## System Requirements {#system-requirements}

The following hardware specifications are recommended for the Casper [Mainnet](https://cspr.live/) and [Testnet](https://testnet.cspr.live/):

-   4 Cores
-   32 GB Ram
-   2 TB SSD or network SSD backed disk
-   Linux machine running Ubuntu 20.04


:::note Notes

- SSD is required because HDD cannot perform random writes at the performance needed to keep in sync with the full speed of the network.

- For non-archival nodes, disc usage will drop once data recovery is implemented. It is safe to slowly increase the disc space as needed while monitoring on a server capable of this.

:::

### CPU Requirements {#cpu-requirements}

Attempting to run a Casper node on older hardware can result in unexpected crashes. This is due to the CPU not supporting instructions used by our official binaries, including AVX2 and Intel SHA extensions.

To avoid these issues, we recommend a CPU running AMD Zen, Intel Ice Lake or newer architecture.

:::note

This only applies to official binaries released by Casper. If you are compiling your node from scratch, you may choose to disable the extensions in question.

:::
