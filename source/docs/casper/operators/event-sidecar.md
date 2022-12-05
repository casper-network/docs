# The Casper Event Sidecar

The Casper Event Sidecar is an application running alongside the node process, allowing subscribers to monitor the event stream without querying the node. The application usually runs on the same machine as the node process, but it can be configured to run remotely if necessary. The load on the node process is thus drastically reduced. Users needing access to the JSON-RPC will still need to query the node directly.

An alternate name for this application is the SSE Sidecar because it uses the node's Event Stream API returning Server-Sent Events (SSEs) in JSON format. Visit GitHub for detailed information on the following:

- [Source code](https://github.com/CasperLabs/event-sidecar) 
- [System components and architecture](https://github.com/CasperLabs/event-sidecar/#system-components--architecture) 
- Sample configuration  														<!-- resources/default_config.toml -->
- Service information														<!-- resources/maintainer_scripts/casper_event_sidecar/casper-event-sidecar.service -->
- Maintenance scripts 								<!-- resources/maintainer_scripts/debian/postinst -->

<!-- Add links to each bullet point above once PR 50 merges. -->

## Installing the Sidecar {#installing-the-sidecar}

The following command will install the Debian package for the Casper Event Sidecar service on various flavors of Linux. 

<!-- Once the package is published and PR https://github.com/CasperLabs/event-sidecar/pull/50 is merged, update the command below with the new link to the casper-event-sidecar*.deb package. The link below assumes a package available locally. -->

```bash
sudo apt install ./casper-event-sidecar_0.1.0-0_amd64.deb
```

<details>
<summary><b>Sample output</b></summary>

```bash
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Note, selecting 'casper-event-sidecar' instead of './casper-event-sidecar_0.1.0-0_amd64.deb'
The following NEW packages will be installed:
  casper-event-sidecar
0 upgraded, 1 newly installed, 0 to remove and 18 not upgraded.
Need to get 0 B/4162 kB of archives.
After this operation, 20.2 MB of additional disk space will be used.
Get:1 /home/ubuntu/casper-event-sidecar_0.1.0-0_amd64.deb casper-event-sidecar amd64 0.1.0-0 [4162 kB]
Selecting previously unselected package casper-event-sidecar.
(Reading database ... 102241 files and directories currently installed.)
Preparing to unpack .../casper-event-sidecar_0.1.0-0_amd64.deb ...
Unpacking casper-event-sidecar (0.1.0-0) ...
Setting up casper-event-sidecar (0.1.0-0) ...
Adding system user `csidecar' (UID 114) ...
Adding new group `csidecar' (GID 120) ...
Adding new user `csidecar' (UID 114) with group `csidecar' ...
Not creating home directory `/home/csidecar'.
Created symlink /etc/systemd/system/multi-user.target.wants/casper-event-sidecar.service → /lib/systemd/system/casper-event-sidecar.service.
```

</details>

### Monitoring the Sidecar {#monitoring-the-sidecar}

Check the service status:

```bash
systemctl status casper-event-sidecar
```

Check the logs and make sure the service is running as expected.

```bash
journalctl --no-pager -u casper-event-sidecar
```

<details>
<summary><b>Successful sample output</b></summary>


```
Dec 05 17:24:53 user systemd[1]: Started Casper Event Sidecar.
```

</details>


If you see any errors, you may need to [update the configuration](#configuring-the-service) and re-start the service with the commands below.

**Stopping the service:**

```
sudo systemctl stop casper-event-sidecar.service
```

**Starting the service:**

```
sudo systemctl start casper-event-sidecar.service
```

## Configuring the Sidecar {#configuring-the-sidecar}

If the service was installed on a Casper node, this file holds a default configuration: `/etc/casper-event-sidecar/config.toml`. Operators will need to update this file according to their needs. GitHub has further details regarding each configuration option.
<!-- Add a proper link to resources/ETC_README.md above. -->
