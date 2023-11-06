---
title: SSE Sidecar
---

# The Casper Event Sidecar

The Casper Event Sidecar is an application running alongside the node process, allowing subscribers to monitor the event stream without querying the node. The application usually runs on the same machine as the node process, but it can be configured to run remotely if necessary. The load on the node process is thus drastically reduced. Users needing access to the JSON-RPC will still need to query the node directly.

An alternate name for this application is the SSE Sidecar because it uses the node's Event Stream API returning Server-Sent Events (SSEs) in JSON format. Visit GitHub for detailed information on the following:

<!-- TODO add links when the private sidecar repository is available 
- Source code - link to the main repository 
- System components and architecture - link to the architecture section
- Node configuration instructions - link to resources/ETC_README.md#configuration
   - Default configuration file - link to resources/default_config.toml
- Maintenance scripts - link to resources/maintainer_scripts
-->

## Installing the Sidecar Service {#installing-the-sidecar}

The following command will install the Debian package for the Casper Event Sidecar service on various flavors of Linux. 

<!-- TODO Once the package is published, update the command below with the new link to the casper-event-sidecar*.deb package. The link below assumes a package available locally. -->

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

If you see any errors, you may need to [update the configuration](#configuring-the-service) and restart the service with the commands below.

**Stopping the service:**

```bash
sudo systemctl stop casper-event-sidecar.service
```

**Starting the service:**

```bash
sudo systemctl start casper-event-sidecar.service
```

## Configuring the Sidecar Service {#configuring-the-sidecar}

Detailed node configuration instructions are available in GitHub.
<!-- TODO link GitHub to ETC_README.md#configuration from the sidecar repo -->

If the service was installed on a Casper node, this file holds a default configuration: `/etc/casper-event-sidecar/config.toml`. The file is also available in GitHub.
<!-- TODO link GitHub to resources/default_config.toml from the sidecar repo -->

Operators will need to update this file according to their needs. GitHub has further details regarding each configuration option.

## Monitoring the Sidecar's Event Stream

It is possible to monitor the Sidecar's event stream using *cURL*, depending on how the HOST and PORT are configured.

```bash
curl -s http://HOST:PORT/events/CHANNEL
```

- `HOST` - The IP address where the Sidecar is running
- `PORT` - The port number where the Sidecar emits events
- `CHANNEL` - The type of emitted event

Given the default configuration, here are the commands for each endpoint:
<!-- TODO link "default configuration" to the default_config.toml#L27-L29 -->

- **Deploy events:** 

    ```bash
    curl -sN http://127.0.0.1:19999/events/deploys
    ```

- **Finality Signature events:** 

    ```bash
    curl -sN http://127.0.0.1:19999/events/sigs
    ```

- **Main events:** 

    ```bash
    curl -sN http://127.0.0.1:19999/events/main
    ```

- **Sidecar-generated events:** 

    ```bash
    curl -sN http://127.0.0.1:19999/events/sidecar
    ```

### The API Version of Node Events

An `ApiVersion` event is always emitted when a new client connects to a node's SSE server, informing the client of the node's software version.

When a client connects to the Sidecar, the Sidecar displays the node’s `ApiVersion`, which it receives from the node. Then, it starts streaming the events coming from the node. The `ApiVersion` may differ from the node’s build version.

If the node goes offline, the `ApiVersion` may differ when it restarts (i.e., in the case of an upgrade). In this case, the Sidecar will report the new `ApiVersion` to its client. If the node’s `ApiVersion` has not changed, the Sidecar will not report the version again and will continue to stream messages that use the previous version.

Here is an example of what the API version would look like while listening on the Sidecar’s `DeployAccepted` event stream:

```bash
curl -sN http://127.0.0.1:19999/events/deploys

data:{"ApiVersion”:”1.4.8”}

data:{"DeployAccepted":{"hash":"00eea4fb9baa37af401cba8ffb96a1b96d594234908cb5f9de50effcb5b1c5aa","header":{"account":"0202ed20f3a93b5386bc41b6945722b2bd4250c48f5fa0632adf546e2f3ff6f4ddee","timestamp":"2023-02-28T12:21:14.604Z","ttl":"30m","gas_price":1,"body_hash":"f06261b964600caf712a3ea0dc54448c3fcc008638368580eb4de6832dce8698","dependencies":[],"chain_name":"casper"},"payment":{"ModuleBytes":{"module_bytes":"","args":[["amount",{"cl_type":"U512","bytes":"0400e1f505","parsed":"100000000"}]]}},"session":{"Transfer":{"args":[["amount",{"cl_type":"U512","bytes":"05205d59d832","parsed":"218378100000"}],["target",{"cl_type":{"ByteArray":32},"bytes":"6fbe4634d42aa1ae7820eed35bcbd5c687de5c464e5348650b49a21a17c8dcb5","parsed":"6fbe4634d42aa1ae7820eed35bcbd5c687de5c464e5348650b49a21a17c8dcb5"}],["id",{"cl_type":{"Option":"U64"},"bytes":"00","parsed":null}]]}},"approvals":[{"signer":"0202ed20f3a93b5386bc41b6945722b2bd4250c48f5fa0632adf546e2f3ff6f4ddee","signature":"02b519ecb34f954aeb7afede122c6f999b2124022f6b653304b2891c5428b074795ad9232a409aa0d3e601471331ea50143ca4c378306ffcd0f8ff7a60e13f19db"}]}}
id:21821471

:

:

:
```

### The Version of Sidecar Events

When a client connects to the `events/sidecar` endpoint, it will receive a message containing the version of the Sidecar software. Release version `1.1.0` would look like this:

```bash
curl -sN http://127.0.0.1:19999/events/sidecar

data:{"SidecarVersion":"1.1.0"}

:

:

```

Note that the `SidecarVersion` differs from the `APIVersion` emitted by the node event streams. You will also see the keep-alive messages as colons, ensuring the connection is active.

### The Node Shutdown Event

When the node sends a [Shutdown event](./node-events.md#shutdown-events) and disconnects from the Sidecar, the Sidecar will report it as part of the event stream and on the `/events/deploys` endpoint. The Sidecar will continue to operate and attempt to reconnect to the node according to the `max_attempts` and `delay_between_retries_in_seconds` settings specified in its configuration.

The Sidecar does not expose `Shutdown` events via its REST API. 

Here is an example of how the stream might look like if the node went offline for an upgrade and came back online after a `Shutdown` event with a new `ApiVersion`:

```bash
curl -sN http://127.0.0.1:19999/events/deploys

data:{"ApiVersion":"1.5.2"}

data:{"BlockAdded":{"block_hash":"b487aae22b406e303d96fc44b092f993df6f3b43ceee7b7f5b1f361f676492d6","block":{"hash":"b487aae22b406e303d96fc44b092f993df6f3b43ceee7b7f5b1f361f676492d6","header":{"parent_hash":"4a28718301a83a43563ec42a184294725b8dd188aad7a9fceb8a2fa1400c680e","state_root_hash":"63274671f2a860e39bb029d289e688526e4828b70c79c678649748e5e376cb07","body_hash":"6da90c09f3fc4559d27b9fff59ab2453be5752260b07aec65e0e3a61734f656a","random_bit":true,"accumulated_seed":"c8b4f30a3e3e082f4f206f972e423ffb23d152ca34241ff94ba76189716b61da","era_end":{"era_report":{"equivocators":[],"rewards":{"01026ca707c348ed8012ac6a1f28db031fadd6eb67203501a353b867a08c8b9a80":1559401400039,"010427c1d1227c9d2aafe8c06c6e6b276da8dcd8fd170ca848b8e3e8e1038a6dc8":25895190891},"inactive_validators":[]},"next_era_validator_weights":{"01026ca707c348ed8012ac6a1f28db031fadd6eb67203501a353b867a08c8b9a80":"50538244651768072","010427c1d1227c9d2aafe8c06c6e6b276da8dcd8fd170ca848b8e3e8e1038a6dc8":"839230678448335"}},"timestamp":"2021-04-08T05:14:14.912Z","era_id":90,"height":1679394427512,"protocol_version":"1.0.0"},"body":{"proposer":"012bac1d0ff9240ff0b7b06d555815640497861619ca12583ddef434885416e69b","deploy_hashes":[],"transfer_hashes":[]}}}}
id:1

:

data:"Shutdown"
id:2

:

:

:

data:{"ApiVersion":"1.5.2"}

data:{"BlockAdded":{"block_hash":"1c76e7abf5780b49d3a66beef7b75bbf261834f494dededb8f2e349735659c03","block":{"hash":"1c76e7abf5780b49d3a66beef7b75bbf261834f494dededb8f2e349735659c03","header":{"parent_hash":"4a28718301a83a43563ec42a184294725b8dd188aad7a9fceb8a2fa1400c680e","state_root_hash":"63274671f2a860e39bb029d289e688526e4828b70c79c678649748e5e376cb07","body_hash":"6da90c09f3fc4559d27b9fff59ab2453be5752260b07aec65e0e3a61734f656a","random_bit":true,"accumulated_seed":"c8b4f30a3e3e082f4f206f972e423ffb23d152ca34241ff94ba76189716b61da","era_end":{"era_report":{"equivocators":[],"rewards":[{"validator":"01026ca707c348ed8012ac6a1f28db031fadd6eb67203501a353b867a08c8b9a80","amount":1559401400039},{"validator":"010427c1d1227c9d2aafe8c06c6e6b276da8dcd8fd170ca848b8e3e8e1038a6dc8","amount":25895190891}],"inactive_validators":[]},"next_era_validator_weights":[{"validator":"01026ca707c348ed8012ac6a1f28db031fadd6eb67203501a353b867a08c8b9a80","weight":"50538244651768072"},{"validator":"010427c1d1227c9d2aafe8c06c6e6b276da8dcd8fd170ca848b8e3e8e1038a6dc8","weight":"839230678448335"}]},"timestamp":"2021-04-08T05:14:14.912Z","era_id":90,"height":1679394457791,"protocol_version":"1.0.0"},"body":{"proposer":"012bac1d0ff9240ff0b7b06d555815640497861619ca12583ddef434885416e69b","deploy_hashes":[],"transfer_hashes":[]},"proofs":[]}}}
id:3

:

:

```

Note that the Sidecar can emit another type of shutdown event on the `events/sidecar` endpoint, as described below.

### The Sidecar Shutdown Event

If the Sidecar attempts to connect to a node that does not come back online within the maximum number of reconnection attempts, the Sidecar will start a controlled shutdown process. It will emit a *Sidecar-specific Shutdown* event on the [events/sidecar](#the-sidecar-shutdown-event) endpoint, designated for events originating solely from the Sidecar service. The other event streams do not get this message because they only emit messages from the node.

The message structure of the Sidecar shutdown event is the same as the [node shutdown event](#the-node-shutdown-event). The sidecar event stream would look like this:

```bash
curl -sN http://127.0.0.1:19999/events/sidecar

data:{"SidecarVersion":"1.1.0"}

:

:

:

data:"Shutdown"
id:8
```

## Swagger Documentation

Once the Sidecar is running, operators and developers can access the Swagger documentation to test the Sidecar's REST API.

```bash
http://HOST:PORT/swagger-ui/
```

Replace the `HOST` with the IP address of the machine running the Sidecar application remotely; otherwise, use `localhost`. The `PORT` is usually `18888`, but it depends on how the Sidecar was configured. 

For example, if you are an operator running the Sidecar service on your node, you would access the Swagger documentation like this:

```bash
http://localhost:18888/swagger-ui/
```

## Additional Links

For more information on various node-emitted event types, visit the [Node's Event Stream](./node-events.md) page. 

DApp developers may also wish to [Monitor and Consume Events](../../developers/dapps/monitor-and-consume-events.md) in their applications.