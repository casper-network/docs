# Monitoring and Consuming Events

Casper platform uses event streaming to notify state changes in smart contracts and nodes. A node on a Casper network streams events through the SSE (Server Sent Event) server. The default configuration of the Casper node provides event streaming via the port specified as the `event_stream_server.address` in the node's *config.toml*, which is by default `9999` for nodes on [Testnet](https://testnet.cspr.live/tools/peers) and [Mainnet](https://cspr.live/tools/peers). 


## Event Types

There are three types of event streams in our platform categorized based on the emitting endpoint of the nodes. Those are:

**Deploy events**

These are associated with Deploys on a node. Currently, only `DeployAccepted` event is emitted . Refer to the [Deploys](../../concepts/design/casper-design.md#execution-semantics-deploys) section to discover more about Deploys and their life cycles.

**Finality Signature event**

This event indicates that the final approvals from validators are signed and further alterations to the block will not be allowed. Refer to the [consensus reached](../../concepts/design/casper-design.md#consensus-reached) section and [block finality](../../concepts/glossary/B.md#block-finality) 
section to learn more about finality signatures.

**Main events**

All the events other than `DeployAccepted` and `FinalitySignature` fall under this type. Those are ApiVersion, BlockAdded, DeployProcessed, DeployExpired, Fault, Step, and Shutdown events.

### How to monitor the event stream?
You can start watching the event stream details using a simple Curl call as in the below format:

```bash
curl -s http://<HOST:PORT>/events/<ENDPOINT>
```

- `HOST` - The IP address of a peer on the network
- `PORT` - The port 9999 (The default port number for nodes on Mainnet or Testnet)
- `ENDPOINT` - The specific endpoint of the node which the event will be emitted

Refer to the [serialization standard](../../concepts/serialization-standard.md) page to get details on required custom serializations and the [types](../json-rpc/types_chain.md) page to find definitions of the terms used in the event stream output.

## Monitoring DeployAccepted Event

You can start watching the event stream for the `DeployAccepted` event or any other events being emitted on this endpoint using the following command. Replace the `HOST` field with the `peer IP address`.

```bash
curl -sN http://<HOST>:9999/events/deploys
```
**DeployAccepted event details**

The URL to consume the Deploy-related events is `http://<HOST>:9999/events/deploys`.

The event stream server of the node emits this event when a Deploy has been received by the node. 

The following example contains the JSON representation of the `DeployAccepted` event structure.

<details>
<summary>Expand the below section to view the DeployAccepted event details:</summary>

```bash
data: {
"DeployAccepted":
    {
      "hash":"99483863a391510b8d3447dd5cfc446b42d65e598672d569abc4cdded85b81e6", 
      "header":
        {"account":"01e35e1904034db6c0bb48c6d88826a2bcf27f29f67a13d844b82aab04614f83f4", 
        "timestamp":"2022-06-22T13:41:41.581Z",
        "ttl":"30m",
        "gas_price":1,
        "body_hash":"eb53a7db7c29f9b6101797167302e5977dbe53cb5ee9b9ae961e3418d95aeb1c",
        "dependencies":[],
        "chain_name":"casper-net-1"
        },
      "payment":
        {"ModuleBytes":
          {"module_bytes":"",
          "args":[["amount",{"cl_type":"U512","bytes":"0400f90295","parsed":"2500000000"}]]
          }
        },
      "session":
        {"Transfer":
          {
            "args":[["amount",{"cl_type":"U512","bytes":"0400f90295","parsed":"2500000000"}],
                ["target",{"cl_type":{"ByteArray":32},"bytes":"b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334","parsed":"b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334"}],
                ["id",{"cl_type":{"Option":"U64"},"bytes":"010100000000000000","parsed":1}]]
          }
        },
      "approvals":
        [{"signer":"01e35e1904034db6c0bb48c6d88826a2bcf27f29f67a13d844b82aab04614f83f4","signature":"0105aa48ff49e0202d0b4c17ca449ccd6ba30ae80fed5e60503eb34eab7a8aab11893502b7856946cdafcc1966dcbe656b3cab06f0396829484edd14b6ffb94f08"}
        ]
    } 
}
id:506

```
</details>

You can find the definitions of the terms in the above `DeployAccepted` JSON representation by referring to the following links:
- [Deploy](../../concepts/serialization-standard.md#serialization-standard-deploy) - Contains the serialization details of a Deploy with other related details like Deploy- Hash, Deploy-Header, Payment and Session, Approval.
- [Types](../json-rpc/types_chain.md) - Contains the definitions of the terms in the event stream output.

## Monitoring FinalitySignature Event

You can start watching the event stream for the `FinalitySignature` event or any other events being emitted on this endpoint using the following command. Replace the `HOST` field with the `peer IP address`.

```bash
curl -sN http://<HOST>:9999/events/sigs
```
**FinalitySignatures event details**

The URL to consume the `FinalitySignature` event is `http://<HOST>:9999/events/sigs`.

The `FinalitySignature` event is emitted whenever a new [finality](../../concepts/glossary/B.md#block-finality) signature is received.

The following example contains the JSON representation of the `FinalitySignature` event structure.

<details>
<summary>Expand the below section to view the FinalitySignature event details:</summary>

```bash
data:
 {
   "FinalitySignature":
    {
     "block_hash":"abbcdc782a18a9ba31826b07c838a69a6b790c8b36a0fd5f0818f757834d82f5",
     "era_id":11,
     "signature":"01d45c16e488c3e16bb1e1134f9a92fb42492498ab2233a643a159281ea8a2a497edd19b6ae56f70c32c12f0341a9ded719033285db17c614337e363fdd8e41f05",
     "public_key":"01601bda04ea125e2ca1881e817c46403b32862eb053370e0b93adad220378578a"
     }
 }
id:696
```
</details>

- [block_hash](../../concepts/serialization-standard.md#block-hash) - A cryptographic hash that is used to identify a Block.
- [era_id](../../concepts/serialization-standard.md#eraid) - The period of time used to specify when specific events in a blockchain network occur.
- [signature](../../concepts/serialization-standard.md#signature) - A serialized byte representation of a cryptographic signature.
- [public_key](../../concepts/serialization-standard.md#publickey) - A hexadecimal-encoded cryptographic public key.

## Monitoring Other Events
All the events apart from `DeployAccepted` and `FinalitySignature` are emitted on the endpoint `main` with the URL `http://<HOST>:9999/events/main`.
Use the below command to monitor those event streams:

```bash
curl -sN http://<HOST>:9999/events/main
```
Further details of each event are presented in the following sections. 

### ApiVersion event

`ApiVersion` is always the first event emitted when a new client connects to the SSE server. It specifies the API version of the server. The ApiVersion is the protocol version of a node on the Casper platform. 

The following example contains the JSON representation of the `ApiVersion` event structure.

<details>
<summary>Expand the below section to view the ApiVersion event details:</summary>

```bash
data:{"ApiVersion":"1.0.0"}
```
</details>

### BlockAdded event
`BlockAdded` event is emitted whenever a new block is added to the blockchain and stored locally in the node. 

The following example contains the JSON representation of the `BlockAdded` event structure.

<details>
<summary>Expand the below section to view the BlockAdded event details:</summary>

```bash
data:
{
   "BlockAdded":
    {
       "block_hash":"5809c6aacc3ac0573a67677743f4cb93cd487ade1c5132c1f806f75b6248f35f",
       "block":
        {
          "hash":"5809c6aacc3ac0573a67677743f4cb93cd487ade1c5132c1f806f75b6248f35f",
          "header":
           {
            "parent_hash":"997d2f23c0a70ecca18043eab2f2f4fdef47fceba96519145b8e5d44609c4f80",
            "state_root_hash":"48ec6b9cc41ec36f7424b3b1d24fcc4dfe96d7e01e2196c9f45879a1a8d4b996",
            "body_hash":"03a5a5e40042f904fd2f307085c07f9774d17f9ee17fc3ef23ed5485dfff972d",
            "random_bit":true,
            "accumulated_seed":"9200c4ac43deda1dd5a8ca91ec37ce33df0ef06bd82d94314bbb961e9e6501f7",
            "era_end":null,
            "timestamp":"2022-06-22T13:42:37.824Z",
            "era_id":9,
            "height":97,
            "protocol_version":"1.0.0"
           },
          "body":
            {
               "proposer":"01601bda04ea125e2ca1881e817c46403b32862eb053370e0b93adad220378578a",
               "deploy_hashes":[],
               "transfer_hashes":[]
            },
          "proofs":[]
        }
     }
  }
id:594
```
</details>

- [block_hash](../../concepts/serialization-standard.md#block-hash) - A cryptographic hash that is used to identify a Block.
- [block](../../concepts/serialization-standard.md#serialization-standard-block) - The JSON representation of the Block.

### DeployProcessed event

`DeployProcessed` event is emitted when a given Deploy has been executed. 

The following example contains the JSON representation of the `DeployProcessed` event structure.

<details>
<summary>Expand the below section to view the DeployProcessed event details:</summary>

```bash
data:
{
  "DeployProcessed":
  {
    "deploy_hash":"99483863a391510b8d3447dd5cfc446b42d65e598672d569abc4cdded85b81e6",
    "account":"01e35e1904034db6c0bb48c6d88826a2bcf27f29f67a13d844b82aab04614f83f4",
    "timestamp":"2022-06-22T13:41:41.581Z",
    "ttl":"30m",
    "dependencies":[],
    "block_hash":"f19e3b63678ca5aa9fa8b30377275c83f8c1a041902b38ce7f4de50f02dbf396",
    "execution_result":
     {
      "Success":\
      {
       "effect":
        {
         "operations":[],
         "transforms":
        [
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"account-hash-b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334","transform":"Identity"},
          {"key":"account-hash-b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-d7173acc018f9330f28ded58e4bf5e955239e87b55d2b1709ff39c300b7fe602","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-c805d90bb64f02a3a530f951a85bc8cacd586da8abee586f790e9d6037ebbb1b","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8","transform":"Identity"},
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8",
            "transform":
              {
                "WriteCLValue":
                {
                  "cl_type":"U512",
                  "bytes":"0e001f0afa095bc138938d44c64d31",
                  "parsed":"999999999999999999999999900000000"
                }
              }
          },
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":
           {"AddUInt512":"100000000"}
          },
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"account-hash-b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334","transform":"Identity"},
          {"key":"account-hash-b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},{"key":"hash-d7173acc018f9330f28ded58e4bf5e955239e87b55d2b1709ff39c300b7fe602","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-c805d90bb64f02a3a530f951a85bc8cacd586da8abee586f790e9d6037ebbb1b","transform":"Identity"},{"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8","transform":"Identity"},
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8","transform":
           {"WriteCLValue":
            {"cl_type":"U512",
            "bytes":"0e001f0afa095bc138938d44c64d31",
            "parsed":"999999999999999999999999900000000"
            }
           }
          },
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":
           {"AddUInt512":"100000000"
           }
          },
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-c805d90bb64f02a3a530f951a85bc8cacd586da8abee586f790e9d6037ebbb1b","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8","transform":"Identity"},
          {"key":"balance-1aa4fb6dd0b0c11cf2f7881e5260d38691f37e6049cb6b9c22d5de5663feac9d","transform":"Identity"},
          {"key":"balance-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8","transform":
           {"WriteCLValue":
            {"cl_type":"U512",
             "bytes":"0e00260765095bc138938d44c64d31",
             "parsed":"999999999999999999999997400000000"
            }
           }
          },
          {"key":"balance-1aa4fb6dd0b0c11cf2f7881e5260d38691f37e6049cb6b9c22d5de5663feac9d","transform":
           {"AddUInt512":"2500000000"
           }
          },
          {"key":"transfer-dc0fa2fefc399e2e0b3256d6c3fda78cd459e3f55cd07e7ebad1d785613f6a7c","transform":
           {"WriteTransfer":
            {"deploy_hash":"99483863a391510b8d3447dd5cfc446b42d65e598672d569abc4cdded85b81e6",
             "from":"account-hash-3bcdf5f3ed95e9d617ae8f864590acf992f97fcf7135d79cf050d8ff983d59d3",
             "to":"account-hash-b33d857b45a2280d846c50cb3ad76850e2125012c2ba6a814957f48d68052334",
             "source":"uref-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8-007",
             "target":"uref-1aa4fb6dd0b0c11cf2f7881e5260d38691f37e6049cb6b9c22d5de5663feac9d-004",
             "amount":"2500000000",
             "gas":"0",
             "id":1
            }
           }
          },
          {"key":"deploy-99483863a391510b8d3447dd5cfc446b42d65e598672d569abc4cdded85b81e6","transform":
           {"WriteDeployInfo":
             {"deploy_hash":"99483863a391510b8d3447dd5cfc446b42d65e598672d569abc4cdded85b81e6",
              "transfers":["transfer-dc0fa2fefc399e2e0b3256d6c3fda78cd459e3f55cd07e7ebad1d785613f6a7c"],
              "from":"account-hash-3bcdf5f3ed95e9d617ae8f864590acf992f97fcf7135d79cf050d8ff983d59d3",
              "source":"uref-f615b98575d7f728efadaa8e2326ecf8a11303856178378033cc3ca7f7ba83c8-007",
              "gas":"100000000"
             }
            }
          },
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-d7173acc018f9330f28ded58e4bf5e955239e87b55d2b1709ff39c300b7fe602","transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6",
          "transform":"Identity"},
          {"key":"hash-f2aaa28affc32affd0fb9d23e6b525ed786f934fdb58bf1d3f45edf28f244ec9","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"hash-c805d90bb64f02a3a530f951a85bc8cacd586da8abee586f790e9d6037ebbb1b","transform":"Identity"},
          {"key":"hash-eef70c80ed9bc625d4bc0106f2c21f3445cdb9e8bbacffb1f6d18b49b7e646ca","transform":"Identity"},
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":"Identity"},
          {"key":"balance-fca9f7cb7cf68cd4fe6969bf089f56341ff5c35dbec649d9353c3989e5a91ade","transform":"Identity"},
          {"key":"balance-389c8be6728248c03b39a316b40e4d5202c01bdb4db969c1c6839a7772ec1ed6","transform":
            {"WriteCLValue":
             {"cl_type":"U512",
              "bytes":"00",
              "parsed":"0"
             }
            }
          },
          {"key":"balance-fca9f7cb7cf68cd4fe6969bf089f56341ff5c35dbec649d9353c3989e5a91ade","transform":
            {"AddUInt512":"100000000"
            }
          }
        ]
      },
    "transfers":
     ["transfer-dc0fa2fefc399e2e0b3256d6c3fda78cd459e3f55cd07e7ebad1d785613f6a7c"],
      "cost":"100000000"
    }
   }
  }
}
id:598
```
</details>

- [deploy_hash](../../concepts/serialization-standard.md#deploy-hash) - The cryptographic hash of a Deploy.
- [account](../../concepts/serialization-standard.md#serialization-standard-account) - A structure that represents a user on a Casper network.
- [timestamp](../../concepts/serialization-standard.md#timestamp) - A timestamp type, representing a concrete moment in time.
- [ttl](../../concepts/serialization-standard.md#timediff) - A time difference between two timestamps.
- [dependencies](../../concepts/serialization-standard.md#deploy-header) - A list of Deploy hashes. 
- [block_hash](../../concepts/serialization-standard.md#block-hash) - A cryptographic hash that is used to identify a Block.
- [execution_result](../../concepts/serialization-standard.md#executionresult) - The result of executing a single deploy.

### DeployExpired event

`DeployExpired` event is emitted when a Deploy becomes no longer valid to be executed or added to a block due to their times to live (TTLs) expiring.

The following example contains the JSON representation of the `DeployExpired` event structure.

<details>
<summary>Expand the below section to view the DeployExpired event details:</summary>

```bash
data:
{
  "DeployExpired":
   {
    "deploy_hash":"7ecf22fc284526c6db16fb6455f489e0a9cbf782834131c010cf3078fb9be353"
   }
}
id:887

```
</details>

- [deploy_hash](../../concepts/serialization-standard.md#deploy-hash) - The cryptographic hash of a Deploy.

### Fault event

The `Fault` event is emitted if there is a validator error. 

The following example contains the JSON representation of the `Fault` event structure.

<details>
<summary>Expand the below section to view the Fault event details:</summary>

```bash
data:
{
  "Fault":
    {
      "era_id":4591448806312642506,
      "public_key":"012fa85eb06279da42e68530e1116be04bfd2aaa5ed8d63401ebff4d9153a609a9",
      "timestamp":"2020-08-07T01:26:58.364Z"
    }
}
```
</details>

- [era_id](../../concepts/serialization-standard.md#eraid) - The period of time used to specify when specific events in a blockchain network occur.
- [public_key](../../concepts/serialization-standard.md#publickey) - A hexadecimal-encoded cryptographic public key.
- [timestamp](../../concepts/serialization-standard.md#timestamp) - A timestamp type, representing a concrete moment in time.

### Step event

`Step` event is emitted at the end of every era and contains the execution effects produced by running the auction contract's `step` function. 

The following example contains the JSON representation of the `Step` event structure.

<details>
<summary>Expand the below section to view the Step event details:</summary>

```bash
data:
 {"Step":
  {
    "era_id":1,
    "execution_effect":
     {"operations":[],
     "transforms":
      [
        {"key":"hash-044a0f52a3e5aa4496bff42382484f9b520831b80443ef89a322c26ae6774603","transform":"Identity"},
        {"key":"hash-044a0f52a3e5aa4496bff42382484f9b520831b80443ef89a322c26ae6774603","transform":"Identity"},
        {"key":"hash-6689f9e923d385f5dfbdc10c82d2423f36d31f8ae41ac33e28b46660f8d756a1","transform":"Identity"},
        {"key":"hash-044a0f52a3e5aa4496bff42382484f9b520831b80443ef89a322c26ae6774603","transform":"Identity"},
        {"key":"uref-f268de37fcea55f8fb1abeba8536a1cc041b2aed2691f1cf34aeaaf0ae379aa5-000","transform":"Identity"}
        ,
        {"key":"uref-cd76df3a576309a282541b62f9fe6d106e6abc1bfa75eaa74b1b63da5f505195-000","transform":"Identity"}
        ,{"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"hash-f7826252f74e69ccb17f6a1ca08e5bd5b04ffb6e3de204881b21b91b75578f1c","transform":"Identity"},
        {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"uref-b8c0eae40513588ff2832cc9aec3949736482e95575ec132817e43e758772293-000","transform":"Identity"}
        ,{"key":"uref-53df18bf01396fbd1ef3a8757c7bdffc684c407d90f2cfeebff166db1d923613-000","transform":"Identity"},
        {"key":"uref-f268de37fcea55f8fb1abeba8536a1cc041b2aed2691f1cf34aeaaf0ae379aa5-000","transform":"Identity"}
        ,
        {"key":"bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e","transform":"Identity"},
        {"key":"bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e","transform":
         {"WriteBid":
          {"validator_public_key":"0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
          "bonding_purse":"uref-136552c255d4d737bf7e43d2be250f9f38691b9fe5d9e34446bff18d6d1cf984-007",
          "staked_amount":"1000000000000005",
          "delegation_rate":5,
          "vesting_schedule":
           {"initial_release_timestamp_millis":1664475057182,
            "locked_amounts":null
           },
           "delegators":
            {"012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d":
             {"delegator_public_key":"012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d",
             "staked_amount":"51312014671568117976319379",
             "bonding_purse":"uref-c5ad00f9e6b2f2631ca647ad188187e63799a278a0a46ca25f6b4da64d556662-007",
             "validator_public_key":"0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
             "vesting_schedule":
              {"initial_release_timestamp_millis":1664475057182,
              "locked_amounts":null
              }
             }
            },
            "inactive":false
           }
          }
        },
        {"key":"bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e","transform":"Identity"},
        {"key":"bid-278e5af1ca6cddf5d5438999cb072b47f0d65e1484799f692c3c9c40304be30e","transform":
         {
          "WriteBid":
          {
            "validator_public_key":"0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
            "bonding_purse":"uref-136552c255d4d737bf7e43d2be250f9f38691b9fe5d9e34446bff18d6d1cf984-007",
            "staked_amount":"56713279373733183026458261",
            "delegation_rate":5,
            "vesting_schedule":
             {"initial_release_timestamp_millis":1664475057182,
              "locked_amounts":null
             },
             "delegators":
             {"012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d":
              {
              "delegator_public_key":"012a241eaa9fa3bd6ccb0e0aaaf4658538f3540e04e2f58973614a168f2f2f813d",
              "staked_amount":"51312014671568117976319379",
              "bonding_purse":"uref-c5ad00f9e6b2f2631ca647ad188187e63799a278a0a46ca25f6b4da64d556662-007",
              "validator_public_key":"0133eaae2821f090ac3ba0eadc0a897742094c0604df72b465c41d4b773298a7b9",
              "vesting_schedule":
               {"initial_release_timestamp_millis":1664475057182,
                "locked_amounts":null
               }
              }
             },
             "inactive":false
          }
         }
        },
        {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"hash-f7826252f74e69ccb17f6a1ca08e5bd5b04ffb6e3de204881b21b91b75578f1c","transform":"Identity"},
        {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"balance-136552c255d4d737bf7e43d2be250f9f38691b9fe5d9e34446bff18d6d1cf984","transform":"Identity"},
        {"key":"balance-136552c255d4d737bf7e43d2be250f9f38691b9fe5d9e34446bff18d6d1cf984","transform":
         {"AddUInt512":"56713279372733183026458256"}
        },
        {"key":"uref-b8c0eae40513588ff2832cc9aec3949736482e95575ec132817e43e758772293-000","transform":
         {"AddUInt512":"56713279372733183026458256"}
        },
        {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"hash-f7826252f74e69ccb17f6a1ca08e5bd5b04ffb6e3de204881b21b91b75578f1c","transform":"Identity"},
        {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"},
        {"key":"balance-c5ad00f9e6b2f2631ca647ad188187e63799a278a0a46ca25f6b4da64d556662","transform":"Identity"},
        {"key":"balance-c5ad00f9e6b2f2631ca647ad188187e63799a278a0a46ca25f6b4da64d556662","transform":
        {"AddUInt512":"51312014670568117976319374"}
        },
        {"key":"uref-b8c0eae40513588ff2832cc9aec3949736482e95575ec132817e43e758772293-000","transform":
         {"AddUInt512":"51312014670568117976319374"}
        },
        {"key":"bid-d46667cb14c87f508064a87577e5687c97f1a09292a2f9fa7d2af8db2aca79cd","transform":"Identity"},
        {"key":"bid-d46667cb14c87f508064a87577e5687c97f1a09292a2f9fa7d2af8db2aca79cd","transform":
         {"WriteBid":
          {"validator_public_key":"01383e13ca5587745b54bade75e947cfe81293d5477d659708dd1d6fb744882931",
          "bonding_purse":"uref-3f92eb17ebd3503ffe1c642ae078b3397710dae0b4050ab369315032427d0281-007",
          "staked_amount":"1000000000000001",
          "delegation_rate":1,
          "vesting_schedule":
           {"initial_release_timestamp_millis":1664475057182,
           "locked_amounts":null
           },
          "delegators":
           {"0134811b4d572d84f289a576f110ad49aa8bb984235b2bf1cb47a0c2f7e4391bef":
            {"delegator_public_key":"0134811b4d572d84f289a576f110ad49aa8bb984235b2bf1cb47a0c2f7e4391bef",
            "staked_amount":"53472520552166781393617757",
            "bonding_purse":"uref-5918746f209867d13c2ddb73b04b8ffc0f7d788445571978ef198d3a9b985c7b-007",
            "validator_public_key":"01383e13ca5587745b54bade75e947cfe81293d5477d659708dd1d6fb744882931",
            "vesting_schedule":
             {"initial_release_timestamp_millis":1664475057182,
             "locked_amounts":null
             }
            }
           },
           "inactive":false
           }
          }},
          {"key":"bid-d46667cb14c87f508064a87577e5687c97f1a09292a2f9fa7d2af8db2aca79cd","transform":"Identity"},
          {"key":"bid-d46667cb14c87f508064a87577e5687c97f1a09292a2f9fa7d2af8db2aca79cd","transform":
           {"WriteBid":
           {"validator_public_key":"01383e13ca5587745b54bade75e947cfe81293d5477d659708dd1d6fb744882931",
           "bonding_purse":"uref-3f92eb17ebd3503ffe1c642ae078b3397710dae0b4050ab369315032427d0281-007",
           "staked_amount":"54552773492594393138943368",
           "delegation_rate":1,
           "vesting_schedule":
            {"initial_release_timestamp_millis":1664475057182,
            "locked_amounts":null
            },
            "delegators":
             {"0134811b4d572d84f289a576f110ad49aa8bb984235b2bf1cb47a0c2f7e4391bef":
              {"delegator_public_key":"0134811b4d572d84f289a576f110ad49aa8bb984235b2bf1cb47a0c2f7e4391bef",
               "staked_amount":"53472520552166781393617757",
               "bonding_purse":"uref-5918746f209867d13c2ddb73b04b8ffc0f7d788445571978ef198d3a9b985c7b-007",
               "validator_public_key":"01383e13ca5587745b54bade75e947cfe81293d5477d659708dd1d6fb744882931",
               "vesting_schedule":
               {"initial_release_timestamp_millis":1664475057182,"locked_amounts":null}
              },
              "inactive":false
             }
            }},
            {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"}
            ,{"key":"hash-f7826252f74e69ccb17f6a1ca08e5bd5b04ffb6e3de204881b21b91b75578f1c","transform":"Identity"},
            {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"}
            ,{"key":"balance-3f92eb17ebd3503ffe1c642ae078b3397710dae0b4050ab369315032427d0281","transform":"Identity"},
            {"key":"balance-3f92eb17ebd3503ffe1c642ae078b3397710dae0b4050ab369315032427d0281","transform":{"AddUInt512":"54552773491594393138943367"}},
            {"key":"uref-b8c0eae40513588ff2832cc9aec3949736482e95575ec132817e43e758772293-000","transform":{"AddUInt512":"54552773491594393138943367"}},
            {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"}
            ,
            {"key":"hash-f7826252f74e69ccb17f6a1ca08e5bd5b04ffb6e3de204881b21b91b75578f1c","transform":"Identity"}
            ,
            {"key":"hash-e629178843b4ed182d51db1fa07f43fb5d21fc43c95d547dfd84b82c8b517d1b","transform":"Identity"}
            ,
            {"key":"balance-5918746f209867d13c2ddb73b04b8ffc0f7d788445571978ef198d3a9b985c7b","transform":"Identity"},
            {"key":"balance-5918746f209867d13c2ddb73b04b8ffc0f7d788445571978ef198d3a9b985c7b","transform":{"AddUInt512":"53472520551166781393617756"}},
            {"key":"uref-b8c0eae40513588ff2832cc9aec3949736482e95575ec132817e43e758772293-000","transform":{"AddUInt512":"53472520551166781393617756"}},
            {"key":"bid-2cf608f36591a31d31190f87e994c93a60078a401d34bb938f26d407d159ddfa","transform":"Identity"},
            {"key":"bid-2cf608f36591a31d31190f87e994c93a60078a401d34bb938f26d407d159ddfa","transform":
             {"WriteBid":
              {
               "validator_public_key":"013d3fb7e3ceac62a900d7e868db0a4c3c8bde6dce873c3f06bf50638d91422857",
              "bonding_purse":"uref-ba36249da22aedc3850ce0bb8839ef850d916b816560160cfe7b64d32dad3870-007",
              "staked_amount":"1000000000000004",
              "delegation_rate":4,
              "vesting_schedule":
               {
                "initial_release_timestamp_millis":1664475057182,
                "locked_amounts":null},
                "delegators":
                 {"01bd050d6229789059571b51df753bb8beb883fde2fd727183574291d938187016":
                  {"delegator_public_key":"01bd050d6229789059571b51df753bb8beb883fde2fd727183574291d938187016",
                  "staked_amount":"51852141141784624481333266",
                  "bonding_purse":"uref-ab81a8a4823cbb1d3214e6eaaa5db1cd80d3a47c0d5c2297aa57f65e338f1646-007",
                  "validator_public_key":"013d3fb7e3ceac62a900d7e868db0a4c3c8bde6dce873c3f06bf50638d91422857",
                  "vesting_schedule":
                   {"initial_release_timestamp_millis":1664475057182,
                   "locked_amounts":null
                   }
                  }
                 },
                 "inactive":false
               }
              }
            },
            {"key":"bid-2cf608f36591a31d31190f87e994c93a60078a401d34bb938f26d407d159ddfa","transform":"Identity"},{"key":"bid-2cf608f36591a31d31190f87e994c93a60078a401d34bb938f26d407d...
```
</details>

- [era_id](../../concepts/serialization-standard.md#eraid) - The period of time is used to specify when specific events in a blockchain network will occur.
- [execution_effect](../../concepts/serialization-standard.md#executioneffect) - The journal of execution transforms from a single Deploy.
- [operations](../../concepts/serialization-standard.md#operation) - Operations performed while executing a deploy.
- [transform](../../concepts/serialization-standard.md#transform) - The actual transformation performed while executing a deploy.

### Shutdown event

The `Shutdown` event is emitted when the node is about to shut down, usually for an upgrade. This causes a termination of the event stream since the server is shutting down. 

The following example contains the JSON representation of the `Shutdown` event structure.

<details>
<summary>Expand the below section to view the Shutdown event details:</summary>

```bash
data:"Shutdown"
id:1107
```
</details>

## Replay Event Stream

This command will replay the event stream from an old event onwards. Replace HOST, EVENT_TYPE, and ID fields with the values of your scenario.

```bash
curl -sN http://<HOST>:9999/events/<EVENT_TYPE>?start_from=<ID>
```
*Example:*

```bash
curl -sN http://65.21.235.219:9999/events/main?start_from=29267508
```

Each URL can have a query string added to the form `?start_from=<ID>`, where ID is an integer representing an old event ID. With this query, you can replay the event stream from that old event onwards. If you specify an event ID that has already been purged from the cache, the server will replay all the cached events.

:::note

The server keeps only a limited number of events cached to allow replaying the stream to clients using the `?start_from=` query string. The cache size can be set differently on each node using the `event_stream_buffer_length` value in the *config.toml*. By default, it is only 5000. 
The intended use case is to allow a client consuming the event stream that loses its connection to reconnect and hopefully catch up with events that were emitted while it was disconnected.

:::