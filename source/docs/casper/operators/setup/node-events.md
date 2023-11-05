---
title: Node Events
---

# The Node's Event Stream

Each Casper node streams events through the SSE (Server Sent Event) server via the port specified as the `event_stream_server.address` in the node's *config.toml*. This port is by default `9999` for nodes on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers).

Events are divided into three categories and streamed on their respective endpoints:

- **Deploy events** - Associated with [Deploys](../../concepts/design/casper-design.md#execution-semantics-deploys) on a node. Currently, only a `DeployAccepted` event is emitted. The URL to consume deploy-related events on Mainnet and Testnet is `http://HOST:9999/events/deploys/`.
- **Finality Signature events** - Emitted when a block has been finalized and cannot be altered. The URL to consume finality signature events on Mainnet and Testnet is `http://HOST:9999/events/sigs/`.
- **Main events** - All other events fall under this type, including: `BlockAdded`, `DeployProcessed`, `DeployExpired`, `Fault`, `Step`, and `Shutdown` events. The URL to consume these events on Mainnet and Testnet is `http://HOST:9999/events/main/`.

:::note

An `ApiVersion` event is always emitted when a new client connects to a node's SSE server, informing the client of the node's software version.

:::

## Monitoring a Node's Event Stream

cURL is a helpful tool to monitor the event stream on a node.

```bash
curl -s http://HOST:PORT/events/CHANNEL
```

- `HOST` - The IP address of a node on the network.
- `PORT` - The port specified as the `event_stream_server.address` in the node's *config.toml*.
- `CHANNEL` - The type of emitted event described above.


### DeployAccepted Events

`DeployAccepted` events are emitted when a node on the network receives a [Deploy](../../concepts/serialization-standard.md#serialization-standard-deploy).

The URL emitting `DeployAccepted` events is `http://HOST:9999/events/deploys` and can be accessed using the following command. Replace the `HOST` field with the IP address of a node on the network.

```bash
curl -sN http://HOST:9999/events/deploys
```

<details>
<summary>Expand to view the `DeployAccepted` event structure.</summary>

```json
{
  "DeployAccepted": {
    "hash": "db84ba229ea37716230ac9874f66c0f12b9731d8d42f28060e481ef3d7263ead",
    "header": {
      "account": "012481699f9231e36ecf002675cd7186b48e6a735d10ec1b30f587ca716937752c",
      "timestamp": "2023-01-01T20:22:45.383Z",
      "ttl": "30m",
      "gas_price": 1,
      "body_hash": "8a377b07a01ac23905b2e416ff388508301feffbb9bdf275c59f87be1e9d0de5",
      "dependencies": [],
      "chain_name": "casper-test"
    },
    "payment": {
      "ModuleBytes": {
        "module_bytes": "",
        "args": [
          [
            "amount",
            {
              "cl_type": "U512",
              "bytes": "040008af2f",
              "parsed": "800000000"
            }
          ]
        ]
      }
    },
    "session": {
      "StoredContractByHash": {
        "hash": "1040f40d06f0355a80149befc4b5d1f203231231d66c4903688e178c36066539",
        "entry_point": "test_entry_point",
        "args": [
          [
            "cost",
            {
              "cl_type": "U512",
              "bytes": "0500c817a804",
              "parsed": "20000000000"
            }
          ]
        ]
      }
    },
    "approvals": [
      {
        "signer": "012481699f9231e36ecf002675cd7186b48e6a735d10ec1b30f587ca716937752c",
        "signature": "01d81d4dc9504a356c23d3c161b87b39b1708cd282b59d3e44d9b999e787643ab495f168475bed8dc48d1056605e06c8ba74d96c69ae5b506c4312be8871c0c701"
      }
    ]
  }
}
```

* [hash](../../concepts/hash-types.md) - The blake2b hash of the Deploy.
* [account](../../concepts/serialization-standard.md#serialization-standard-account) - The hexadecimal-encoded public key of the account submitting the Deploy.
* [body_hash](../../concepts/hash-types.md) - The blake2b hash of the Deploy body.
* [payment](../../concepts/glossary/P.md#payment-code) - Gas payment information.
* [session](../../developers//writing-onchain-code/contract-vs-session.md#what-is-session-code) - The session logic defining the Deploy's functionality.
* [approvals](../../developers/json-rpc/types_chain.md#approval) - The signer's hexadecimal-encoded public key and signature.

</details>

For details on custom serializations, check the [Serialization Standard](../../concepts/serialization-standard.md). Also, the [Types](../../developers/json-rpc/types_chain.md) page defines the terms used in the event stream output.


### FinalitySignature Events

This event indicates validators have signed the final approvals and further alterations to the block will not be allowed. Refer to the [consensus reached](../../concepts/deploy-and-deploy-lifecycle.md#consensus-reached) and [block finality](../../concepts/glossary/B.md#block-finality) sections to learn more about finality signatures. 

The URL emitting `FinalitySignature` events is `http://HOST:9999/events/sigs`.

```bash
curl -sN http://HOST:9999/events/sigs
```

<details>
<summary>Expand to view the `FinalitySignature` event structure.</summary>

```json
{
  "FinalitySignature": {
    "block_hash": "eceed827e11f7969a7d3fe91d6fa4ce9749dd79d9f3ea26474fe2014db90e98d",
    "era_id": 8419,
    "signature": "0117087ef4b9a786e5a0ea8f198050e9de93dd94f87469b8124c346aeae5f36ad9adf80f670ee9c5887263267ed32cf932dce9b370353c596d59f91fbd57a1a205",
    "public_key": "01c375b425a36de25dc325c9182861679db2f634abcacd9ae2ee27b84ba62ac1f7"
  }
}
```

- [block_hash](../../concepts/serialization-standard.md#block-hash) - A cryptographic hash identifying a Block.
- [era_id](../../concepts/serialization-standard.md#eraid) - A period of time during which the validator set does not change.
- [signature](../../concepts/serialization-standard.md#signature) - Serialized bytes representing the validator's signature.
- [public_key](../../concepts/serialization-standard.md#publickey) - The hexadecimal-encoded public key of the validator.

</details>

### Main Events

All other events apart from `DeployAccepted` and `FinalitySignature` events are emitted on the endpoint `main` with the URL `http://HOST:9999/events/main`.

```bash
curl -sN http://HOST:9999/events/main
```

Below are the different types of events streamed on the `main` endpoint.

#### ApiVersion Events

The `ApiVersion` event is always the first event emitted when a new client connects to a node's SSE server. It specifies the protocol version of a node on the Casper platform. The following example contains the JSON representation of the `ApiVersion` event structure.

```bash
data:{"ApiVersion":"1.0.0"}
```

#### BlockAdded Events

A `BlockAdded` event is emitted when a new block is added to the blockchain and stored locally on the node.

<details>
<summary>Expand to view the `BlockAdded` event structure.</summary>

```json
{
  "BlockAdded": {
    "block_hash": "62ddf902e9b6988b978413e2a9a2c6c95f8e1ddf452afd8e8a68f0ac22bf391a",
    "block": {
      "hash": "62ddf105e9b6988b378413e2a9a2c6c95f8e1ddf458afd8e8268f0ac72bfe91a",
      "header": {
        "parent_hash": "ed11ac2117edb9c5b26cf0cde318a807fd68e76206855a70429012ef16b557f5",
        "state_root_hash": "3c1ad31757ae40f934de4825a818274e0c246d304c661daf656e22b65174ad66",
        "body_hash": "eb2344f37193395bbc83587e498bc12ad5f0019055abcfa4c3b989d382a7969a",
        "random_bit": true,
        "accumulated_seed": "b8b671530f2221c8fdf201083f43c51e215e2f6ffcbe2d63238a2779eb177922",
        "era_end": null,
        "timestamp": "2023-01-01T09:55:25.312Z",
        "era_id": 8426,
        "height": 1566677,
        "protocol_version": "1.4.13"
      },
      "body": {
        "proposer": "010e5669b0f0545e2b32bc66363b9d3d4390fca56bf52305f1411b7fa12ca311c7",
        "deploy_hashes": [],
        "transfer_hashes": []
      },
      "proofs": []
    }
  }
}
```

- [block_hash](../../concepts/serialization-standard.md#block-hash) - The cryptographic hash that identifies a block.
- [block](../../concepts/serialization-standard.md#serialization-standard-block) - The JSON representation of the block.
- [proposer](../../concepts/serialization-standard.md#body) - The validator selected to propose the block.

</details>


#### DeployProcessed Events

A `DeployProcessed` event is emitted when a given Deploy has been executed.

<details>
<summary>Expand to view the `DeployProcessed` event structure.</summary>

```json
{
  "DeployProcessed": {
    "deploy_hash": "0f33be8f56ff23d7d503a9804675472e043830a6c17e6141dce717b4f0973c7d",
    "account": "0201cbff12155b6ae1e99d571c01d56e9e1ba0def6719a6f06bc3e4a08f30a887444",
    "timestamp": "2023-01-01T10:07:00.401Z",
    "ttl": "30m",
    "dependencies": [],
    "block_hash": "509b754648168a73e6ab67e64d4a783cf580d6fc0c7c0ec560c6650f717841e0",
    "execution_result": {
      "Success": {
        "effect": {
          "operations": [],
          "transforms": [
            {
              "key": "account-hash-a8261377ef9cf8e7411d6858801c71e28c9322e66355586549c75ab24cdd73f2",
              "transform": "Identity"
            },
          ]
        },
        "transfers": [
          "transfer-3389144d15238240f48f5966f2dc299b6b20eb19c13d834409b4d28fc50fa909"
        ],
        "cost": "100000000"
      }
    }
  }
}
```

* [deploy_hash](../../concepts/serialization-standard.md#deploy-hash) - The cryptographic hash of a Deploy.
* [account](../../concepts/serialization-standard.md#serialization-standard-account) - The hexadecimal-encoded public key of the account submitting the Deploy.
* [timestamp](../../concepts/serialization-standard.md#timestamp) - A timestamp type representing a concrete moment in time.
- [ttl](../../developers/cli/sending-deploys.md#time-to-live-ttl) - The parameter that determines how long a deploy will wait for execution.
* [dependencies](../../concepts/serialization-standard.md#deploy-header) - A list of Deploy hashes. 
* [block_hash](../../concepts/serialization-standard.md#block-hash) - A cryptographic hash identifying a Block.
* [execution_result](../../concepts/serialization-standard.md#executionresult) - The execution status of the Deploy, which is either `Success` or `Failure`.

</details>

#### DeployExpired Events

A `DeployExpired` event is emitted when the Deploy is no longer valid for processing or being added to a block due to its time to live (TTL) having expired.

<details>
<summary>Expand to view the `DeployExpired` event structure.</summary>

```json
{
  "DeployExpired": {
    "deploy_hash": "7ecf22fc284526d6db16fbf455f489e0a9cbf782234131c010cf3078fb9be353"
  }
}
```

* [deploy_hash](../../concepts/serialization-standard.md#deploy-hash) - The cryptographic hash of a Deploy.

</details>

#### Fault Events

The `Fault` event is emitted if there is a validator error.

<details>
<summary>Expand to view the `Fault` event structure.</summary>

```json
{
  "Fault": {
    "era_id": 4591448806312642600,
    "public_key": "013da85eb06279da42e28530e1116be04bfd2aa25ed8d63401ebff4d9153a609a9",
    "timestamp": "2023-01-01T01:26:58.364Z"
  }
}
```

* [era_id](../../concepts/serialization-standard.md#eraid) - A period of time during which the validator set does not change.
* [public_key](../../concepts/serialization-standard.md#publickey) - The hexadecimal-encoded public key of the validator that caused the fault.
* [timestamp](../../concepts/serialization-standard.md#timestamp) - A timestamp representing the moment the validator faulted.

</details>

#### Step Events

The `Step` event is emitted at the end of every era and contains the execution effects produced by running the auction contract's `step` function.

<details>
<summary>Expand to view the `Step` event structure.</summary>

```json 
{
  "Step": {
    "era_id": 1,
    "execution_effect": {
      "operations": [],
      "transforms": [
        {
          "key": "uref-53df18bf01396fbd1ef3a8757c7bdffc684c407d90f2cfeebff166db1d923613-000",
          "transform": "Identity"
        },
        {
          "key": "uref-f268de37fcea55f8fb1abeba8536a1cc041b2aed2691f1cf34aeaaf0ae379aa5-000",
          "transform": "Identity"
        },
        {
          "key": "bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e",
          "transform": "Identity"
        },
        {
          "key": "bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e",
          "transform": {
            "WriteBid": {
              "validator_public_key": "0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
              "bonding_purse": "uref-136552c255d4d737bf7e43d2be250f9f38691b9fe5d9e34446bff18d6d1cf984-007",
              "staked_amount": "1000000000000005",
              "delegation_rate": 5,
              "vesting_schedule": {
                "initial_release_timestamp_millis": 1664475057182,
                "locked_amounts": null
              },
              "delegators": {
                "012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d": {
                  "delegator_public_key": "012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d",
                  "staked_amount": "51312014671568117976319379",
                  "bonding_purse": "uref-c5ad00f9e6b2f2631ca647ad188187e63799a278a0a46ca25f6b4da64d556662-007",
                  "validator_public_key": "0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
                  "vesting_schedule": {
                    "initial_release_timestamp_millis": 1664475057182,
                    "locked_amounts": null
                  }
                }
              },
              "inactive": false
            }
          }
        }
      ]
    }
  }
}
```

* [era_id](../../concepts/serialization-standard.md#eraid) - A period of time during which the validator set does not change.
* [execution_effect](../../concepts/serialization-standard.md#executioneffect) - The journal of execution transforms from a single Deploy.
* [operations](../../concepts/serialization-standard.md#operation) - Operations performed while executing a Deploy.
* [transform](../../concepts/serialization-standard.md#transform) - The actual transformation performed while executing a Deploy.

</details>

#### Shutdown Events

The `Shutdown` event is emitted when the node is about to shut down, usually for an upgrade, causing a termination of the event stream.

<details>
<summary>Expand to view the `Shutdown` event structure.</summary>

```bash
"Shutdown"
```
* Shutdown - The "Shutdown" text notifies the event listener that a shutdown will occur.

</details>


## Replaying the Event Stream

This command will replay the event stream from an old event onward. Replace the `HOST`, `PORT`, `CHANNEL`, and `ID` fields with the values needed.

```bash
curl -sN http://HOST:PORT/events/CHANNEL?start_from=ID
```

**Example:**

```bash
curl -sN http://65.21.235.219:9999/events/main?start_from=29267508
```

Each URL can have a query string added, such as `?start_from=<ID>`, where ID is an integer representing an old event ID. With this query, you can replay the event stream from that old event onward. The server will replay all the cached events if you specify an event ID that has already been purged from the cache.

:::note

The server keeps only a limited number of events cached to allow replaying the stream to clients using the `?start_from=` query string. The cache size can be set differently on each node using the `event_stream_buffer_length` value in the *config.toml*. By default, it is only 5000. 
The intended use case is to allow a client consuming the event stream to reconnect (if it loses its connection) and catch up with the events emitted while it was disconnected.

:::