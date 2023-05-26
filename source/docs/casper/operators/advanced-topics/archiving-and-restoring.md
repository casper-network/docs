# Archiving and Restoring a Database

This documentation describes processes for the compression and decompression of a Casper node database and streaming from a backup location.

[Zstandard](http://facebook.github.io/zstd/) is the best method for compression speed and space for the current LMDB-based database system that the `casper-node` uses. 

:::note

The values presented in this document assume that the `trie-compact` tool was run on a Mainnet database for compression. Contact the [support team](https://support.casperlabs.io/hc/en-gb) if you have questions.

:::

## Zstandard Limitations

The current DB implementation uses sparse files, which can be partially empty, thus not being processed efficiently. You can use `tar` as a pre-filter for stripping sparse data, as shown [here](#compression), thus eliminating the need to read the full DB size and improving processing.

## Zstandard Installation

To install Zstandard, run the following command:

```bash
sudo apt install zstd
```

Note that Zstandard version 1.4.4 is distributed with Ubuntu 20.04, while version 1.3.3 is distributed with Ubuntu 18.04. Later versions have more documentation. 

## Initial Warnings

You need to stop the `casper-node-launcher` process of the node (and, therefore, the `casper-node` process using the DB) before any compression or decompression into a location. Otherwise, strange things can and will occur.

## Compression

Run the following basic `tar` command from the DB directory. For Mainnet, the directory would be `/var/lib/casper/casper-node/casper`, and for Testnet it would be `/var/lib/casper/casper-node/casper-test`.

```bash
tar -cv --sparse .
```

On some systems, you may get better performance if you specify the block number as an argument:

```bash
tar -b 4096 -cv --sparse .
```

You can then stream the result into `zstd`. The sections below discuss the [level](#compression-level), [thread count](#thread-count), and [long](#long-distance-matching) arguments.

```bash
tar -b 4096 -cv --sparse . | zstd -[level] -cv -T[thread count] --long=31 > [path_to]/file.tar.zst
```

### Compression level 

The `-[level]` argument is the compression level from 1 to 19 (and 20-22 with expansion). In testing, we found 15 to be the sweet spot in compression time vs. size. We recommend lower compression if you plan to transfer the archive only once. If you are creating an archive to be downloaded by many, then the extra time for higher compression may be helpful.

Here are some examples of a Mainnet DB compression at block 741160:

| Level   | Time (min:sec)  | Size    |
|---------|-----------------|---------|
| 12      | 29:20           | 15.8 GB |
| 15      | 46:15           | 13.0 GB |
| 17      | 87:42           | 13.0 GB |
| 19      | 197:08          | 12.9 GB |

For local backups, using 1-5 is a great compression speed-to-size trade-off.  

### Thread count

The `-T[thread count]` is the number of threads that `zstd` should use for compression. If running a script or command on varying machines, use `T0` to allow `zstd` to detect the number of cores and run with the same number of threads as the detected cores. A speed-up can be obtained for machines with multiple threads per core by configuring a thread count near the number of threads. It is advisable to stay within the number of CPU threads. The recommendations in this article will use `-T0`.

### Long-distance matching

The `--long=31` argument is where we see the most space gained by the algorithm because it controls the size of the matching window in powers of 2 (2**31 is 2 GB). The downside is that it requires 2.0 GB memory during compression and decompression as it looks ahead and rebuilds ahead. The default is 27 or 128 MB.

At compression 19, we see a 30 GB file using the default 128 MB look ahead, and a 13 GB file using 2 GB look ahead. Since all validators should have 16-32 GB of memory, we keep this at `--long=31`.

An important note is that decompression requires a compatible argument. Trying with a different long-distance matching value will throw an error, but the value to be used will be given.

### Summary of commands

The general command for compression is:

```bash
tar -b 4096 -cv --sparse . | zstd -15 -cv -T0 --long=31 > [path_to]/file.tar.zst
```

For local backups, use a lower compression level:

```bash
tar -b 4096 -cv --sparse . | zstd -5 -cv -T0 --long=31 > [path_to]/file.tar.zst
```

## Decompression

`zstd -d` is the command for decompression; however, the same `--long` value used for compression must be specified. For all `casper-node` DB-related decompression, you will likely use this command:

```bash
zstd -cd --long=31 <.tar.zst file>
```

If `--long=31` is omitted, you might see an error such as this, which also gives you the solution:

```bash
./casper.tar.zst : Decoding error (36) : Frame requires too much memory for decoding 
./casper.tar.zst : Window size larger than maximum : 2147483648 > 134217728
./casper.tar.zst : Use --long=31 or --memory=2048MB
```

Pipe the `zstd` result into a `tar -xv` command. Also, create the decompressed files using `sudo -u casper`, because the files will be used by the `casper-node`. Run the following command inside an empty DB location:

```bash
zstd -cd --long=31 <.tar.zst file> | sudo -u casper tar -xv
```

To fix ownership, use this command:

```bash
sudo /etc/casper/node_util.py fix_permissions
```

## Streamed Decompression

If a `.tar.zst` archive is hosted on a website and you will not need the file after decompressing, you can stream it into the process using `curl`, which can output to stdout with `--output` and stream binary to your terminal.

```bash
curl -s --output - <URL for tar.zstd file>
```

If you pipe the output into the previous process, you can decompress the files from `curl` directly into a local directory:

```bash
curl -s --output - <tar.zst URL> | zstd -d --long=31 | sudo -u casper tar -xv
```

## Starting a New Node with a Decompressed DB

If you are starting a node with a decompressed DB, you must tell the node to run at the protocol version of the tip of your DB. You can do this most efficiently with the `node_util.py` script included in the `casper-node-launcher` installation.

For example, if you are using a DB archive from node version 1.4.5, you would run this command:

```bash
sudo /etc/casper/node_util.py force_run_version 1_4_5
```