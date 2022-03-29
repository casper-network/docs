# Monitoring Events

You can monitor a node's event stream on the port specified as the *event_stream_server.address* in the node's *config.toml*, which is by default 9999 on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers.

The URLs for different types of events are:

- `/events/deploys` for DeployAccepted events
- `/events/sigs` for FinalitySignature events
- `/events/main` for all other event types

Each URL can have a query string added of the form `?start_from=<ID>`, where ID is an integer representing an old event ID.

To proceed, you need to acquire the IP address of a [peer](https://casper.network/docs/workflow/setup/#acquire-node-address-from-network-peers) on the network. 

With the following command, you can start watching the event stream for DeployAccepted events. Replace the <HOST> field with the peer IP address.

```bash
curl -s http://<HOST>:9999/events/deploys
```

To monitor FinalitySignature events, you can use this command:

```bash
curl -s http://<HOST>:9999/events/deploys
```

For all other event types, you can monitor this endpoint:

```bash
curl -s http://<HOST>:9999/events/main
```


