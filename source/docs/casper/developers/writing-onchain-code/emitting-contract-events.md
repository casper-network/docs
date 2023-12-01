---
title: Contract-Level Events
---

# Enabling Contracts to Emit Events 

Smart contracts can be programmed to emit messages while executing. Under certain conditions, an off-chain dApp may listen to these events and react as described in [Monitoring and Consuming Events](../dapps/monitor-and-consume-events.md).

Messages produced by smart contracts are visible on a node's SSE event stream in human-readable format, and they contain the following information:

- The address of the entity that produced the message
- The message topic used to categorize the message
- The human-readable message string
- The index identifying the message in a message array

A checksum of the message is permanently stored in global state to protect against message spoofing and repudiation. For more details regarding the design and implementation of this feature, read the corresponding [CEP-88 documentation](https://github.com/casper-network/ceps/pull/88).

The [Casper External FFI](https://docs.rs/casper-contract/latest/casper_contract/ext_ffi/index.html) provides the following functions to manage and emit messages: <!-- TODO add links to docs.rs for these 2 functions -->

- `manage_message_topic` - Creates a topic to help categorize messages. When used for the first time, this function registers the contract's intent to emit messages. The maximum number of topics is specified in the chainspec. <!-- TODO add link to chainspec setting -->
- `runtime::emit_message` - Emits a human-readable string message under a pre-registered topic.

The following sections contain more details about using these functions.

## Creating a Topic

<!-- TODO add a link to the contract when it becomes available -->

This example code <!--"from a CEP-78 contract"--> adds a new message topic called `EVENTS_TOPIC`, on which the contract can emit messages:

```rust
runtime::manage_message_topic(EVENTS_TOPIC, MessageTopicOperation::Add).unwrap_or_revert();
```

The cost of creating a topic is specified in the network chainspec under the following setting. Consult the chainspec of the network you are working with, as this is only an example:

```js
manage_message_topic = { cost = 200, arguments = [0, 0, 0, 0] }
```

## Verifying a Topic

<!-- TODO is EE = host in this context? -->
When the host registers a topic, it creates a control record for that topic under a composite key, which is derived from the caller's entity address and the hash of the topic name:

```rust
pub struct MessageAddr {
    /// The entity addr.
    entity_addr: AddressableEntityHash,
    /// A 32 byte BLAKE2b hash of the name of the message topic.
    topic_hash: TopicNameHash,
    /// The message index. If the message index is `None`, the `MessageAddr` points to the topic control record.
    message_index: Option<u32>,
}
```

Understanding this setup will help you verify messages by querying global state using the composite key:

<!-- Query global state using composite key -->

Here is how you can determine the number of messages emitted in a particular block:

<!-- Query global state and show messages emitted in a block -->


## Emitting a Message

<!-- TODO add a link to the contract when it becomes available -->

This example code <!--"from a CEP-78 contract"--> sends a new message on the message topic `EVENTS_TOPIC`. 

```rust
runtime::emit_message(EVENTS_TOPIC, &message.try_into().unwrap()).unwrap_or_revert();
```

The cost of emitting messages is specified in the network chainspec under the following settings:

```js
emit_message = { cost = 200, arguments = [0, 0, 0, 0] }
cost_increase_per_message = 50
```

Consult the chainspec of the network you are working with, as the above is only an example. For emitting messages, the cost of the arguments is added to the base cost specified with the `emit_message` setting. The base cost increases for each message emitted, and the increase is specified with the `cost_increase_per_message` setting.

## Verifying a Message

The SSE endpoint of a node streams the messages emitted in a human-readable format. Messages are visible after the corresponding block is processed and added to the blockchain. The messages sent out on the event stream contain the identity of the entity that emitted the message, the topic on which the message was emitted, the index of the message within the topic, and the actual message payload.

<!-- Show an example of a message emitted on the SSE stream -->

Emitted messages are not stored in global state. However, global state stores a checksum of each message, allowing users to verify the origin and integrity of the message. The checksums in global state are unique and can be identified by the hash of the entity that emitted the message, the hash of the topic name, and the index of the message.

<!-- Query global state to get the checksum. Reference the tool Alex wrote if it is available. -->


:::note

The message payload cannot be reconstructed by reading the entry from global state since that entry contains only the checksum of the messages sent.

:::


## What's Next? {#whats-next}

- Learn to [install a contract and query global state](../cli/installing-contracts.md).
- Learn to [monitor and consume the event stream](../dapps/monitor-and-consume-events.md).
- If you are a node operator, learn to [configure message costs](TBD). <!-- add a link -->

<!-- TODO update the operators' pages with these values: 

## Chainspec Settings

```
manage_message_topic = { cost = 200, arguments = [0, 0, 0, 0] }
emit_message = { cost = 200, arguments = [0, 0, 0, 0] }
cost_increase_per_message = 50
```

-->
