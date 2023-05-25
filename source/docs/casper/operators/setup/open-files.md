# Setting the Open Files Limit

When the `casper-node` launches, it tries to set the maximum open files limit (`nofile`) for the process to `64000`. With some systems, this limit will be larger than the default hard limit of `4096`. 

The node software uses file handles for both files and network connections. Since network connections are unpredictable, running out of file handles can stop critical file writes from occurring. Therefore, the default `nofile` limit needs to be increased.

With the `casper-node-launcher` running, you can see what the system allocated by finding the process ID (PID) for the `casper-node` with the following command.

```bash
pgrep "casper-node$"
```

<details>
<summary>Sample output</summary>

```bash
$ pgrep "casper-node$"
275928
```

:::note

This PID will change, so you need to run the above command to get the current version with your system. Also, it will not be `275928` each time.

:::

</details>

If you do not get a value in return, you do not have the `casper-node-launcher` running correctly.

To find the current `nofile` (number of open files) hard limit, run `prlimit` with the PID from the previous command:

```bash
sudo prlimit -n -p <PID>
```

<details>
<summary>Sample output</summary>

```bash
$ sudo prlimit -n -p 275928
RESOURCE DESCRIPTION              SOFT HARD UNITS
NOFILE   max number of open files 1024 4096 files
```
</details>

You can also embed both commands as shown here:

```bash
sudo prlimit -n -p $(pgrep "casper-node$")
```

<details>
<summary>Sample output</summary>

```bash
$ sudo prlimit -n -p $(pgrep "casper-node$")
RESOURCE DESCRIPTION              SOFT HARD UNITS
NOFILE   max number of open files 1024 4096 files
```

</details>

If you receive `prlimit: option requires an argument -- 'p'`, then `pgrep "casper-node$"` is not returning anything because the `casper-node-launcher` is no longer running.

## Setting the Limit Manually {#updating-manually}

Run the command below to set the `nofile` limit for an active process without restarting the `casper-node-launcher` and `casper-node` processes. Note that this setting is active only while the `casper-node` process runs. To make this setting permanent, [update the `limits.conf`](#updating-limits-conf) file instead.

```bash
sudo prlimit --nofile=64000 --pid=$(pgrep "casper-node$")`
```

Next, check that the `prlimit` has changed:

```bash
sudo prlimit -n -p $(pgrep "casper-node$")
```

<details>
<summary>Sample output</summary>

```bash
$ sudo prlimit -n -p $(pgrep "casper-node$")
RESOURCE DESCRIPTION               SOFT  HARD UNITS
NOFILE   max number of open files 64000 64000 files
```

</details>

## Updating the `limits.conf` File {#updating-limits-conf}

It is possible to persist the `nofile` limit across server reboots, `casper-node-launcher` restarts, and protocol upgrades, by adding the `nofile` setting for the `casper` user in `/etc/security/limits.conf`.

Add the following row to the bottom of the `/etc/security/limits.conf` file:

```bash
casper          hard    nofile          64000
```

Afterward, log out of any shells to enable this change. Restarting the node should maintain the correct `nofile` setting.