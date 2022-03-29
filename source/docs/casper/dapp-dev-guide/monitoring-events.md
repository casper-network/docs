# Monitoring Events

The Casper node streams deploy execution effects and finality signatures through an SSE architecture. The default configuration of the Casper node provides event streaming on the `/events` endpoint and the port specified as the *event_stream_server.address* in the node's *config.toml*, which is by default 9999 on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers). The URLs for different types of events are:

- `/events/deploys` for DeployAccepted events
- `/events/sigs` for FinalitySignature events
- `/events/main` for all other event types

Each URL can have a query string added of the form `?start_from=<ID>`, where ID is an integer representing an old event ID.

To proceed, you need to acquire the IP address of a [peer](https://casper.network/docs/workflow/setup/#acquire-node-address-from-network-peers) on the network. 

With the following command, you can start watching the event stream for DeployAccepted events. Replace the HOST field with the peer IP address.

```bash
curl -s http://<HOST>:9999/events/deploys
```

To monitor FinalitySignature events, you can use this command:

```bash
curl -s http://<HOST>:9999/events/sigs
```

For all other event types, you can monitor the main endpoint:

```bash
curl -s http://<HOST>:9999/events/main
```

If you have an old event ID, you can use the following command to query it. Replace HOST, EVENT_TYPE, and ID with the values you need.

```bash
curl -s http://<HOST>:9999/events/<EVENT_TYPE>?start_from=<ID>
```

**Example:**

This example will output all the DeployAccepted events starting with event ID 29267508.

```bash
curl -s http://65.21.235.219:9999/events/main?start_from=29267508
```

