# Archiving and Restoring a Database

This article describes processes for the compression and decompression of a Casper node database (DB) and streaming from a backup location.

After testing a few methods of compressing and decompressing the current LMDB-based DB system used by the `casper-node`, the best method in both compression speed and space is using [Zstd](http://facebook.github.io/zstd/).  

:::note

The values presented in this document assume that the `trie-compact` tool was run on a Mainnet database for compression. [Reach out](https://support.casperlabs.io/hc/en-gb) to the support team if you have questions about this tool.

:::

## Zstd Limitations

The current DB uses sparse files, which can contain partially nothing and not be processed efficiently. It is possible to use `tar` as a prefilter for stripping sparse data, eliminating the need to do a full read for the full size and processing.

## Zstd Installation

This is available with `sudo apt install zstd`. Note that 1.4.4 is distributed with 20.04, and 1.3.3 is with 18.04. There is much more information when compressing with later versions.

## Initial Warnings

It should go without saying that the `casper-node-launcher` process of the node (and therefore the `casper-node` process using the DB) should be stopped with any compression or before decompression into a location. Otherwise, strange things can and will occur.

## Compression

The most basic `tar` commands needed are:

```base
tar -cv --sparse .
```

This would be from within the DB directory. For Mainnet, the directory would be `/var/lib/casper/casper-node/casper`, and for Testnet it would be `/var/lib/casper/casper-node/casper-test`.

To get a little better performance on some systems, you may specify the block number arguments to `tar`, which results in:

```base
tar -b 4096 -cv --sparse .
```

Stream this into `zstd` by piping:

```base
tar -b 4096 -cv --sparse . | zstd -[level] -cv -T[thread count] --long=31 > [path_to]/file.tar.zst
```

### Compression level 

The `-[level]` argument is the compression level from 1 to 19 (and 20-22 with expansion).   In testing, we found 15 to be the sweet spot in compression time vs. size. Lower compression makes sense if you are creating an archive to transfer once and use. If you are creating an archive to be downloaded by many, then the extra time for higher compression may be helpful.

Here are some examples of a Mainnet DB compression at block 741160:

| Level   | Time (min:sec)  | Size    |
|---------|-----------------|---------|
| 12      | 29:20           | 15.8 GB |
| 15      | 46:15           | 13.0 GB |
| 17      | 87:42           | 13.0 GB |
| 19      | 197:08          | 12.9 GB |

For local backups, using 1-5 is a great compression speed to size trade-off.  

### Thread count

The `-T[thread count]` is the number of threads that `zstd` should use for compression. This parallels well. If running a script or command on varying machines, use `T0` to auto-detect. This will run the same number of threads as the detected cores. For machines with multiple threads per core, a speed-up can be further obtained by configuring an actual # near the number of threads. It is advisable to stay within the number of CPU threads. I will use `-T0` in most of my recommendations.

### Long-distance matching

The `--long=31` argument is what we see the most space gained by the algorithm. This controls the size of the matching window in powers of 2.  2**31 is 2 GB. The downside is that it requires 2.0 GB memory during compression and decompression as it looks ahead and rebuilds ahead. The default is 27 or 128 MB.  

At compression 19, we see a 30 GB file using the default 128 MB look ahead, and a 13 GB file using 2 GB look ahead. Since all validators should have 16-32 GB of memory, we keep this at `-long=31`.   

The important thing here is that decompression requires a compatible argument. If you try with a different long-distance matching value, it will error, and the value to be used will be given.

### TLDR

General:
`tar -b 4096 -cv --sparse . | zstd -15 -cv -T0 --long=31 > [path_to]/file.tar.zst`

For local backups:
`tar -b 4096 -cv --sparse . | zstd -5 -cv -T0 --long=31 > [path_to]/file.tar.zst`

## Decompression

`zstd -d` is the command for decompression; however, the same `--long` value must be passed. So for all `casper-node` related decompression, you will likely always use `zstd -cd --long=31 <.tar.zst file>`.  

If `--long=31` is omitted, you might see an error such as this, which also gives you the solution:

```bash
./casper.tar.zst : Decoding error (36) : Frame requires too much memory for decoding 
./casper.tar.zst : Window size larger than maximum : 2147483648 > 134217728
./casper.tar.zst : Use --long=31 or --memory=2048MB
```

This will be piped into a `tar xv` command. With decompressing files to be used by the casper-node, we would want these created using `sudo -u casper`.

So `zstd -cd -long=31 <.tar.zst file> | sudo -u casper tar -xv` inside the empty DB location.

To fix ownership, use `sudo /etc/casper/node_util.py fix_permissions`.

## Streamed Decompression

If a `.tar.zst` archive is hosted on a website and you will not need the file after decompressing, you can stream it into the process. This uses the ability for `curl` to output to stdout with `--output`.

```base
curl -s --output - <URL for tar.zstd file>
```

This will stream a bunch of binary to your terminal. If we pipe that into the previous process, we get the following command that decompresses the files from `curl` directly into the local directory:

```bash
curl -s --output - <tar.zst URL> | zstd -d --long=31 | sudo -u casper tar xv
```

## Starting a New Node with a Decompressed DB

If you are not syncing normally, you will want to tell the node to run at the protocol version of the tip of your DB. This is most easily done with the `node_util.py` script included in `casper-node-launcher` install.

If you are using an archive from 1.4.5, you will run `sudo /etc/casper/node_util.py force_run_version 1_4_5`.