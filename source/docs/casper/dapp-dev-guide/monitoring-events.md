# Monitoring and Consuming Events

The Casper node streams deploy execution effects and finality signatures through an SSE server. The default configuration of the Casper node provides event streaming on the `/events` endpoint and the port specified as the `event_stream_server.address` in the node's *config.toml*, which is by default 9999 on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers). The URLs for different types of events are:

- `/events/deploys` for DeployAccepted events
- `/events/sigs` for FinalitySignature events
- `/events/main` for all other event types

Each URL can have a query string added of the form `?start_from=<ID>`, where ID is an integer representing an old event ID. With this query, you can replay the event stream from that old event onwards. If you specify an event ID that has already been purged from the cache, the server will replay all the cached events.

:::note

The server keeps only a limited number of events cached to allow replaying the stream to clients using the `?start_from=` query string. The cache size can be set differently on each node using the `event_stream_buffer_length` value in the *config.toml*. By default, it is only 5000. 
The intended use case is to allow a client consuming the event stream that loses its connection to reconnect and hopefully catch up with events that were emitted while it was disconnected.

:::

## Usage

To proceed, you need to acquire the IP address of a [peer](/workflow/setup/#acquire-node-address-from-network-peers) on the network. 

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

Replay the event stream from an old event onwards. Replace HOST, EVENT_TYPE, and ID with the values you need in this command:

```bash
curl -s http://<HOST>:9999/events/<EVENT_TYPE>?start_from=<ID>
```

**Example:**

```bash
curl -s http://65.21.235.219:9999/events/main?start_from=29267508
```

