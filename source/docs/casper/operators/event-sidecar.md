# The Casper Event Sidecar

The Casper Event Sidecar is an application running alongside the node process, allowing subscribers to monitor the event stream without querying the node. The application usually runs on the same machine as the node process, but it can be configured to run remotely if necessary. The load on the node process is thus drastically reduced. Users needing access to the JSON-RPC will still need to query the node directly.

An alternate name for this application is the SSE Sidecar because it uses the node's Event Stream API returning Server-Sent Events (SSEs) in JSON format. Visit GitHub for detailed information on the following:

- [Source code](https://github.com/CasperLabs/event-sidecar) 
- [System components and architecture](https://github.com/CasperLabs/event-sidecar/#system-components--architecture) 
- [Node configuration instructions](https://github.com/CasperLabs/event-sidecar/blob/dev/resources/ETC_README.md#configuration) 
   - [Default configuration file](https://github.com/CasperLabs/event-sidecar/blob/dev/resources/default_config.toml)
- [Maintenance scripts](https://github.com/CasperLabs/event-sidecar/tree/dev/resources/maintainer_scripts)


## Installing the Sidecar Service {#installing-the-sidecar}

The following command will install the Debian package for the Casper Event Sidecar service on various flavors of Linux. 

<!-- TODO Once the package is published and PR https://github.com/CasperLabs/event-sidecar/pull/50 is merged, update the command below with the new link to the casper-event-sidecar*.deb package. The link below assumes a package available locally. -->

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

<br></br>

### Monitoring the Sidecar Service {#monitoring-the-sidecar}

Check the service status:

```bash
systemctl status casper-event-sidecar
```

<details>
<summary><b>Sample output</b></summary>

```bash
casper-event-sidecar.service - Casper Event Sidecar
     Loaded: loaded (/lib/systemd/system/casper-event-sidecar.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2022-12-07 20:33:29 UTC; 1min 3s ago
       Docs: https://docs.casperlabs.io
   Main PID: 16707 (casper-event-si)
      Tasks: 5 (limit: 9401)
     Memory: 7.1M
     CGroup: /system.slice/casper-event-sidecar.service
             └─16707 /usr/bin/casper-event-sidecar /etc/casper-event-sidecar/config.toml

Dec 07 20:33:29 user systemd[1]: Started Casper Event Sidecar.
```

</details>

<br></br>

Check the logs and make sure the service is running as expected.

```bash
journalctl --no-pager -u casper-event-sidecar
```

<details>
<summary><b>Sample output</b></summary>


```bash
Dec 05 17:24:53 user systemd[1]: Started Casper Event Sidecar.
```

</details>

<br></br>

If you see any errors, you may need to [update the configuration](#configuring-the-service) and re-start the service with the commands below.

**Stopping the service:**

```bash
sudo systemctl stop casper-event-sidecar.service
```

**Starting the service:**

```bash
sudo systemctl start casper-event-sidecar.service
```

## Configuring the Sidecar Service {#configuring-the-sidecar}

Detailed node configuration instructions are available in [GitHub](https://github.com/CasperLabs/event-sidecar/blob/dev/resources/ETC_README.md#configuration).

If the service was installed on a Casper node, this file holds a default configuration: `/etc/casper-event-sidecar/config.toml`. The file is also available in [GitHub](https://github.com/CasperLabs/event-sidecar/blob/dev/resources/default_config.toml).

Operators will need to update this file according to their needs. GitHub has further details regarding each configuration option.

## Monitoring the Event Stream

It is possible to monitor the Sidecar's event stream using *cURL*, depending on how the HOST and PORT are configured.

```bash
curl -sN http://<HOST:PORT>/events/<TYPE>
```

- `HOST` - The IP address where the Sidecar is running
- `PORT` - The port number where the Sidecar emits events
- `TYPE` - The type of emitted event

Given the [default configuration](https://github.com/CasperLabs/event-sidecar/blob/b2ed0d1183aa7e5f6613fbeae80c6a06f437f0a9/resources/default_config.toml#L27-L29), the command would look like this:

```bash
curl -sN http://127.0.0.1:19999/events/deploys
```

For more information on various event types, visit the [Monitoring Node Events](/operators/node-events) page.