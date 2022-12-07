
import useBaseUrl from '@docusaurus/useBaseUrl';

# Monitoring and Consuming Events

The Casper Event Sidecar is an application running alongside the node process, allowing subscribers to monitor the event stream without querying the node, thus receiving faster responses and reducing the load on the node. Users needing access to the JSON-RPC will still need to query the node directly. 

An alternate name for this application is the SSE Sidecar because it uses the node's Event Stream API returning Server-Sent Events (SSEs) in JSON format. The SSE Sidecar uses the node's Event Stream API to achieve the following goals: 

- Build a middleware service that connects to the [Node Event Stream](/operators/node-events), replicating the SSE interface and its filters (i.e., /main, /deploys, and /sigs with support for the use of the ?start_from= query to allow clients to get previously sent events from the Sidecar's buffer.) 
- Provide a new RESTful endpoint that is discoverable on the network.

<img class="align-center" src={useBaseUrl("/image/dApp/sidecar-diagram.png")} alt="Sidecar components and architecture diagram" width="800"/>

Visit [GitHub](https://github.com/CasperLabs/event-sidecar/) for the latest source code and information on [system architecture](https://github.com/CasperLabs/event-sidecar/#system-components--architecture).

The [Node's Event Stream](/operators/node-events) page explains the various event types emitted by the node and available through the Sidecar service. Also, the section on [Monitoring the Event Stream](/operators/event-sidecar/#monitoring-the-event-stream) gives a brief example on how to monitor Sidecar events.

