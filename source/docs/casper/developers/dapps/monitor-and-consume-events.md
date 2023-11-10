---
title: Monitoring Events
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Monitoring and Consuming Events

The Casper platform uses [event streaming](../../operators/setup/node-events.md) to signal state changes in smart contracts and nodes. Using Casper's [Event Sidecar](#the-event-sidecar) service and client-side SDKs, dApps actively listening for emitted events can consume these events and perform actions based on event data.

## The Event Sidecar

The Casper Event Sidecar is an application running alongside the node process, allowing subscribers to monitor the event stream without querying the node, thus receiving faster responses and reducing the load on the node. Users needing access to the JSON-RPC will still need to query the node directly. 

An alternate name for this application is the SSE Sidecar because it uses the node's Event Stream API returning Server-Sent Events (SSEs) in JSON format. The SSE Sidecar uses the node's Event Stream API to achieve the following goals:

- Build a sidecar middleware service that reads the [Event Stream](../../operators/setup/node-events.md) of all connected nodes, acting as a passthrough and replicating the SSE interface of the connected nodes and their filters (i.e., `/main`, `/deploys`, and `/sigs` with support for the use of the `?start_from=` query to allow clients to get previously sent events from the Sidecar's buffer).
- Provide a new [RESTful endpoint](#the-rest-server) that is discoverable on the network.

<img class="align-center" src={useBaseUrl("/image/operators/sidecar-diagram.png")} alt="Sidecar components and architecture diagram" width="800"/>

Visit GitHub for the latest source code and information on system architecture.
<!-- TODO Link GitHub to the event sidecar repo -->
<!-- TODO Link "system architecture" to the event sidecar repo#system-components--architecture documentation -->

## The Sidecar REST Server

The Sidecar provides a RESTful endpoint for useful queries about the state of the network. Access and test the REST API using the [Swagger Documentation](../../operators/setup/event-sidecar.md#swagger-documentation).

```bash
http://HOST:PORT/swagger-ui/
```

Replace the `HOST` with the IP address of the machine running the Sidecar application remotely; otherwise, use `localhost`. The `PORT` is usually `18888`, but it depends on how the Sidecar was configured.

An OpenAPI schema is available at the following URL: 

```bash
http://HOST:PORT/api-doc.json/
```

Replace the `HOST` with the IP address of the machine running the Sidecar application remotely; otherwise, use `localhost`. The `PORT` is usually `18888`, but it depends on how the Sidecar was configured.

<details> 
<summary><b>Expand to see a sample OpenAPI schema</b></summary>

This is only a sample OpenAPI schema for the Sidecar. Click the URL above to see the latest version.

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "casper-event-sidecar",
    "description": "App for storing and republishing sse events of a casper node",
    "contact": {
      "name": "Sidecar team",
      "url": "https://github.com/CasperLabs/event-sidecar"
    },
    "license": { "name": "" },
    "version": "1.0.0"
  },
  "paths": {
    "/block": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about the last block added to the linear chain.",
        "description": "Return information about the last block added to the linear chain.\nInput: the database with data to be filtered.\nReturn: data about the latest block.\nPath URL: block\nExample: curl http://127.0.0.1:18888/block",
        "operationId": "latest_block",
        "responses": {
          "200": {
            "description": "latest stored block",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/BlockAdded" }
              }
            }
          }
        }
      }
    },
    "/block/{block_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about a block given its block hash.",
        "description": "Return information about a block given its block hash.\nInput: the database with data to be filtered.\nReturn: data about the block specified.\nPath URL: block/<block-hash>\nExample: curl http://127.0.0.1:18888/block/c0292d8408e9d83d1aaceadfbeb25dc38cda36bcb91c3d403a0deb594dc3d63f",
        "operationId": "block_by_hash",
        "parameters": [
          {
            "name": "block_hash",
            "in": "path",
            "description": "Base64 encoded block hash of requested block",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch latest stored block",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/BlockAdded" }
              }
            }
          }
        }
      }
    },
    "/block/{height}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about a block given a specific block height.",
        "description": "Return information about a block given a specific block height.\nInput: the database with data to be filtered.\nReturn: data about the block requested.\nPath URL: block/<block-height>\nExample: curl http://127.0.0.1:18888/block/630151",
        "operationId": "block_by_height",
        "parameters": [
          {
            "name": "height",
            "in": "path",
            "description": "Height of the requested block",
            "required": true,
            "schema": { "type": "integer", "format": "int32", "minimum": 0 }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch latest stored block",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/BlockAdded" }
              }
            }
          }
        }
      }
    },
    "/deploy/accepted/{deploy_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about an accepted deploy given its deploy hash.",
        "description": "Return information about an accepted deploy given its deploy hash.\nInput: the database with data to be filtered.\nReturn: data about the accepted deploy.\nPath URL: deploy/accepted/<deploy-hash>\nExample: curl http://127.0.0.1:18888/deploy/accepted/f01544d37354c5f9b2c4956826d32f8e44198f94fb6752e87f422fe3071ab58a",
        "operationId": "deploy_accepted_by_hash",
        "parameters": [
          {
            "name": "deploy_hash",
            "in": "path",
            "description": "Base64 encoded deploy hash of requested deploy accepted",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch stored deploy",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DeployAccepted" }
              }
            }
          }
        }
      }
    },
    "/deploy/expired/{deploy_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about a deploy that expired given its deploy hash.",
        "description": "Return information about a deploy that expired given its deploy hash.\nInput: the database with data to be filtered.\nReturn: data about the expired deploy.\nPath URL: deploy/expired/<deploy-hash>\nExample: curl http://127.0.0.1:18888/deploy/expired/e03544d37354c5f9b2c4956826d32f8e44198f94fb6752e87f422fe3071ab58a",
        "operationId": "deploy_expired_by_hash",
        "parameters": [
          {
            "name": "deploy_hash",
            "in": "path",
            "description": "Base64 encoded deploy hash of requested deploy expired",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch stored deploy",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DeployExpired" }
              }
            }
          }
        }
      }
    },
    "/deploy/processed/{deploy_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return information about a deploy that was processed given its deploy hash.",
        "description": "Return information about a deploy that was processed given its deploy hash.\nInput: the database with data to be filtered.\nReturn: data about the processed deploy.\nPath URL: deploy/processed/<deploy-hash>\nExample: curl http://127.0.0.1:18888/deploy/processed/f08944d37354c5f9b2c4956826d32f8e44198f94fb6752e87f422fe3071ab77a",
        "operationId": "deploy_processed_by_hash",
        "parameters": [
          {
            "name": "deploy_hash",
            "in": "path",
            "description": "Base64 encoded deploy hash of requested deploy processed",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch stored deploy",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DeployProcessed" }
              }
            }
          }
        }
      }
    },
    "/deploy/{deploy_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return an aggregate of the different states for the given deploy. This is a synthetic JSON not emitted by the node.",
        "description": "Return an aggregate of the different states for the given deploy. This is a synthetic JSON not emitted by the node.\nThe output differs depending on the deploy's status, which changes over time as the deploy goes through its lifecycle.\nInput: the database with data to be filtered.\nReturn: data about the deploy specified.\nPath URL: deploy/<deploy-hash>\nExample: curl http://127.0.0.1:18888/deploy/f01544d37354c5f9b2c4956826d32f8e44198f94fb6752e87f422fe3071ab58a",
        "operationId": "deploy_by_hash",
        "parameters": [
          {
            "name": "deploy_hash",
            "in": "path",
            "description": "Base64 encoded deploy hash of requested deploy",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "fetch aggregate data for deploy events",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/DeployAggregate" }
              }
            }
          }
        }
      }
    },
    "/faults/{era}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return the faults associated with an era given a valid era identifier.",
        "description": "Return the faults associated with an era given a valid era identifier.\nInput: the database with data to be filtered.\nReturn: fault information for a given era.\nPath URL: faults/<era-ID>\nExample: curl http://127.0.0.1:18888/faults/2304",
        "operationId": "faults_by_era",
        "parameters": [
          {
            "name": "era",
            "in": "path",
            "description": "Era identifier",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "faults associated with an era ",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Fault" }
                }
              }
            }
          }
        }
      }
    },
    "/faults/{public_key}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return the faults associated with a validator's public key.",
        "description": "Return the faults associated with a validator's public key.\nInput: the database with data to be filtered.\nReturn: faults caused by the validator specified.\nPath URL: faults/<public-key>\nExample: curl http://127.0.0.1:18888/faults/01a601840126a0363a6048bfcbb0492ab5a313a1a19dc4c695650d8f3b51302703",
        "operationId": "faults_by_public_key",
        "parameters": [
          {
            "name": "public_key",
            "in": "path",
            "description": "Base64 encoded validator's public key",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "faults associated with a validator's public key",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Fault" }
                }
              }
            }
          }
        }
      }
    },
    "/signatures/{block_hash}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return the finality signatures in a block given its block hash.",
        "description": "Return the finality signatures in a block given its block hash.\nInput: the database with data to be filtered.\nReturn: the finality signatures for the block specified.\nPath URL: signatures/<block-hash>\nExample: curl http://127.0.0.1:18888/signatures/c0292d8408e9d83d1aaceadfbeb25dc38cda36bcb91c3d403a0deb594dc3d63f",
        "operationId": "finality_signatures_by_block",
        "parameters": [
          {
            "name": "block_hash",
            "in": "path",
            "description": "Base64 encoded block hash of requested block",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "finality signatures in a block",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/FinalitySignature" }
                }
              }
            }
          }
        }
      }
    },
    "/step/{era_id}": {
      "get": {
        "tags": ["crate::rest_server::filters"],
        "summary": "Return the step event emitted at the end of an era, given a valid era identifier.",
        "description": "Return the step event emitted at the end of an era, given a valid era identifier.\nInput: the database with data to be filtered.\nReturn: the step event for a given era.\nPath URL: step/<era-ID>\nExample: curl http://127.0.0.1:18888/step/2304",
        "operationId": "step_by_era",
        "parameters": [
          {
            "name": "era_id",
            "in": "path",
            "description": "Era id",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "step event emitted at the end of an era",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Step" }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AccountHash": {
        "type": "string",
        "description": "Hex-encoded account hash."
      },
      "Approval": {
        "type": "object",
        "description": "The signature of a deploy and the public key of the signer.",
        "required": ["signer", "signature"],
        "properties": {
          "signature": { "type": "string" },
          "signer": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          }
        }
      },
      "Bid": {
        "type": "object",
        "description": "An entry in the validator map.",
        "required": [
          "bonding_purse",
          "delegation_rate",
          "delegators",
          "inactive",
          "staked_amount",
          "validator_public_key"
        ],
        "properties": {
          "bonding_purse": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "The purse that was used for bonding."
          },
          "delegation_rate": {
            "type": "integer",
            "format": "uint8",
            "description": "Delegation rate",
            "minimum": 0
          },
          "delegators": {
            "type": "object",
            "description": "This validator's delegators, indexed by their public keys",
            "additionalProperties": { "$ref": "#/components/schemas/Delegator" }
          },
          "inactive": {
            "type": "boolean",
            "description": "`true` if validator has been \"evicted\""
          },
          "staked_amount": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "The amount of tokens staked by a validator (not including delegators)."
          },
          "validator_public_key": {
            "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
            "description": "Validator public key"
          },
          "vesting_schedule": {
            "anyOf": [
              { "$ref": "#/components/schemas/VestingSchedule" },
              {
                "type": "object",
                "additionalProperties": false,
                "nullable": true,
                "minProperties": 1
              }
            ],
            "description": "Vesting schedule for a genesis validator. `None` if non-genesis validator."
          }
        },
        "additionalProperties": false
      },
      "BlockAdded": {
        "type": "object",
        "description": "The given block has been added to the linear chain and stored locally.",
        "required": ["block_hash", "block"],
        "properties": {
          "block": { "$ref": "#/components/schemas/JsonBlock" },
          "block_hash": { "$ref": "#/components/schemas/BlockHash" }
        }
      },
      "BlockHash": { "$ref": "#/components/schemas/Digest" },
      "CLType": {
        "anyOf": [
          {
            "type": "string",
            "enum": [
              "Bool",
              "I32",
              "I64",
              "U8",
              "U32",
              "U64",
              "U128",
              "U256",
              "U512",
              "Unit",
              "String",
              "Key",
              "URef",
              "PublicKey",
              "Any"
            ]
          },
          {
            "type": "object",
            "description": "`Option` of a `CLType`.",
            "required": ["Option"],
            "properties": {
              "Option": { "$ref": "#/components/schemas/CLType" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Variable-length list of a single `CLType` (comparable to a `Vec`).",
            "required": ["List"],
            "properties": { "List": { "$ref": "#/components/schemas/CLType" } },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Fixed-length list of a single `CLType` (comparable to a Rust array).",
            "required": ["ByteArray"],
            "properties": {
              "ByteArray": {
                "type": "integer",
                "format": "uint32",
                "minimum": 0
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "`Result` with `Ok` and `Err` variants of `CLType`s.",
            "required": ["Result"],
            "properties": {
              "Result": {
                "type": "object",
                "required": ["err", "ok"],
                "properties": {
                  "err": { "$ref": "#/components/schemas/CLType" },
                  "ok": { "$ref": "#/components/schemas/CLType" }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Map with keys of a single `CLType` and values of a single `CLType`.",
            "required": ["Map"],
            "properties": {
              "Map": {
                "type": "object",
                "required": ["key", "value"],
                "properties": {
                  "key": { "$ref": "#/components/schemas/CLType" },
                  "value": { "$ref": "#/components/schemas/CLType" }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "1-ary tuple of a `CLType`.",
            "required": ["Tuple1"],
            "properties": {
              "Tuple1": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/CLType" },
                "maxItems": 1,
                "minItems": 1
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "2-ary tuple of `CLType`s.",
            "required": ["Tuple2"],
            "properties": {
              "Tuple2": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/CLType" },
                "maxItems": 2,
                "minItems": 2
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "3-ary tuple of `CLType`s.",
            "required": ["Tuple3"],
            "properties": {
              "Tuple3": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/CLType" },
                "maxItems": 3,
                "minItems": 3
              }
            },
            "additionalProperties": false
          }
        ],
        "description": "Casper types, i.e. types which can be stored and manipulated by smart contracts.\n\nProvides a description of the underlying data type of a [`CLValue`](crate::CLValue)."
      },
      "CLValue": {
        "type": "object",
        "description": "A Casper value, i.e. a value which can be stored and manipulated by smart contracts.\n\nIt holds the underlying data as a type-erased, serialized `Vec<u8>` and also holds the CLType of the underlying data as a separate member.\n\nThe `parsed` field, representing the original value, is a convenience only available when a CLValue is encoded to JSON, and can always be set to null if preferred.",
        "required": ["bytes", "cl_type"],
        "properties": {
          "bytes": { "type": "string" },
          "cl_type": { "$ref": "#/components/schemas/CLType" },
          "parsed": {}
        },
        "additionalProperties": false
      },
      "ContractHash": {
        "type": "string",
        "title": "ContractHash",
        "description": "The hash address of the contract"
      },
      "ContractPackageHash": {
        "type": "string",
        "title": "ContractPackageHash",
        "description": "The hash address of the contract package"
      },
      "ContractVersion": {
        "type": "integer",
        "title": "uint32",
        "format": "uint32",
        "minimum": 0
      },
      "Delegator": {
        "type": "object",
        "description": "Represents a party delegating their stake to a validator (or \"delegatee\")",
        "required": [
          "bonding_purse",
          "delegator_public_key",
          "staked_amount",
          "validator_public_key"
        ],
        "properties": {
          "bonding_purse": { "$ref": "#/components/schemas/URef" },
          "delegator_public_key": { "$ref": "#/components/schemas/PublicKey" },
          "staked_amount": { "$ref": "#/components/schemas/U512" },
          "validator_public_key": { "$ref": "#/components/schemas/PublicKey" },
          "vesting_schedule": {
            "anyOf": [
              { "$ref": "#/components/schemas/VestingSchedule" },
              {
                "type": "object",
                "additionalProperties": false,
                "nullable": true,
                "minProperties": 1
              }
            ]
          }
        },
        "additionalProperties": false
      },
      "Deploy": {
        "type": "object",
        "description": "A signed item sent to the network used to request execution of Wasm.",
        "required": ["hash", "header", "payment", "session", "approvals"],
        "properties": {
          "approvals": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Approval" }
          },
          "hash": { "$ref": "#/components/schemas/DeployHash" },
          "header": { "$ref": "#/components/schemas/DeployHeader" },
          "payment": { "$ref": "#/components/schemas/ExecutableDeployItem" },
          "session": { "$ref": "#/components/schemas/ExecutableDeployItem" }
        }
      },
      "DeployAccepted": {
        "type": "object",
        "description": "The given deploy has been newly-accepted by this node.",
        "required": ["deploy"],
        "properties": { "deploy": { "$ref": "#/components/schemas/Deploy" } }
      },
      "DeployAggregate": {
        "type": "object",
        "required": ["deploy_hash", "deploy_expired"],
        "properties": {
          "deploy_accepted": {
            "allOf": [{ "$ref": "#/components/schemas/DeployAccepted" }],
            "nullable": true
          },
          "deploy_expired": { "type": "boolean" },
          "deploy_hash": { "type": "string" },
          "deploy_processed": {
            "allOf": [{ "$ref": "#/components/schemas/DeployProcessed" }],
            "nullable": true
          }
        }
      },
      "DeployExpired": {
        "type": "object",
        "description": "The given deploy has expired.",
        "required": ["deploy_hash"],
        "properties": {
          "deploy_hash": { "$ref": "#/components/schemas/DeployHash" }
        }
      },
      "DeployHash": {
        "type": "string",
        "description": "Hex-encoded deploy hash."
      },
      "DeployHeader": {
        "type": "object",
        "description": "The header portion of a [`Deploy`].",
        "required": [
          "account",
          "timestamp",
          "ttl",
          "gas_price",
          "body_hash",
          "dependencies",
          "chain_name"
        ],
        "properties": {
          "account": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "body_hash": { "$ref": "#/components/schemas/Digest" },
          "chain_name": { "type": "string" },
          "dependencies": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/DeployHash" }
          },
          "gas_price": { "type": "integer", "format": "int64", "minimum": 0 },
          "timestamp": { "type": "string" },
          "ttl": { "type": "string" }
        }
      },
      "DeployInfo": {
        "type": "object",
        "description": "Information relating to the given Deploy.",
        "required": ["deploy_hash", "from", "gas", "source", "transfers"],
        "properties": {
          "deploy_hash": {
            "allOf": [{ "$ref": "#/components/schemas/DeployHash" }],
            "description": "The relevant Deploy."
          },
          "from": {
            "allOf": [{ "$ref": "#/components/schemas/AccountHash" }],
            "description": "Account identifier of the creator of the Deploy."
          },
          "gas": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "Gas cost of executing the Deploy."
          },
          "source": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "Source purse used for payment of the Deploy."
          },
          "transfers": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/TransferAddr" },
            "description": "Transfers performed by the Deploy."
          }
        },
        "additionalProperties": false
      },
      "DeployProcessed": {
        "type": "object",
        "description": "The given deploy has been executed, committed and forms part of the given block.",
        "required": [
          "deploy_hash",
          "account",
          "timestamp",
          "ttl",
          "dependencies",
          "block_hash",
          "execution_result"
        ],
        "properties": {
          "account": { "type": "string" },
          "block_hash": { "$ref": "#/components/schemas/BlockHash" },
          "dependencies": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/DeployHash" }
          },
          "deploy_hash": { "$ref": "#/components/schemas/DeployHash" },
          "execution_result": {
            "$ref": "#/components/schemas/ExecutionResult"
          },
          "timestamp": { "type": "string" },
          "ttl": { "type": "string" }
        }
      },
      "Digest": {
        "type": "string",
        "format": "binary",
        "description": "The output of the hash function."
      },
      "EraId": {
        "type": "integer",
        "format": "uint64",
        "description": "Era ID newtype.",
        "minimum": 0
      },
      "EraInfo": {
        "type": "object",
        "description": "Auction metadata.  Intended to be recorded at each era.",
        "required": ["seigniorage_allocations"],
        "properties": {
          "seigniorage_allocations": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/SeigniorageAllocation" }
          }
        },
        "additionalProperties": false
      },
      "ExecutableDeployItem": {
        "oneOf": [
          {
            "type": "object",
            "required": ["ModuleBytes"],
            "properties": {
              "ModuleBytes": {
                "type": "object",
                "description": "Raw bytes of compiled Wasm code, which must include a `call` entry point, and the arguments\nto call at runtime.",
                "required": ["module_bytes", "args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" },
                  "module_bytes": {
                    "type": "string",
                    "description": "The compiled Wasm bytes."
                  }
                }
              }
            }
          },
          {
            "type": "object",
            "required": ["StoredContractByHash"],
            "properties": {
              "StoredContractByHash": {
                "type": "object",
                "description": "A contract stored in global state, referenced by its \"hash\", along with the entry point and\narguments to call at runtime.",
                "required": ["hash", "entry_point", "args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" },
                  "entry_point": {
                    "type": "string",
                    "description": "The contract's entry point to be called at runtime."
                  },
                  "hash": { "$ref": "#/components/schemas/ContractHash" }
                }
              }
            }
          },
          {
            "type": "object",
            "required": ["StoredContractByName"],
            "properties": {
              "StoredContractByName": {
                "type": "object",
                "description": "A contract stored in global state, referenced by a named key existing in the `Deploy`'s\naccount context, along with the entry point and arguments to call at runtime.",
                "required": ["name", "entry_point", "args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" },
                  "entry_point": {
                    "type": "string",
                    "description": "The contract's entry point to be called at runtime."
                  },
                  "name": {
                    "type": "string",
                    "description": "The named of the named key under which the contract is referenced."
                  }
                }
              }
            }
          },
          {
            "type": "object",
            "required": ["StoredVersionedContractByHash"],
            "properties": {
              "StoredVersionedContractByHash": {
                "type": "object",
                "description": "A versioned contract stored in global state, referenced by its \"hash\", along with the entry\npoint and arguments to call at runtime.",
                "required": ["hash", "entry_point", "args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" },
                  "entry_point": {
                    "type": "string",
                    "description": "The contract's entry point to be called at runtime."
                  },
                  "hash": {
                    "$ref": "#/components/schemas/ContractPackageHash"
                  },
                  "version": {
                    "allOf": [
                      { "$ref": "#/components/schemas/ContractVersion" }
                    ],
                    "nullable": true
                  }
                }
              }
            }
          },
          {
            "type": "object",
            "required": ["StoredVersionedContractByName"],
            "properties": {
              "StoredVersionedContractByName": {
                "type": "object",
                "description": "A versioned contract stored in global state, referenced by a named key existing in the\n`Deploy`'s account context, along with the entry point and arguments to call at runtime.",
                "required": ["name", "entry_point", "args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" },
                  "entry_point": {
                    "type": "string",
                    "description": "The contract's entry point to be called at runtime."
                  },
                  "name": {
                    "type": "string",
                    "description": "The named of the named key under which the contract package is referenced."
                  },
                  "version": {
                    "allOf": [
                      { "$ref": "#/components/schemas/ContractVersion" }
                    ],
                    "nullable": true
                  }
                }
              }
            }
          },
          {
            "type": "object",
            "required": ["Transfer"],
            "properties": {
              "Transfer": {
                "type": "object",
                "description": "A native transfer which does not contain or reference any Wasm code.",
                "required": ["args"],
                "properties": {
                  "args": { "$ref": "#/components/schemas/RuntimeArgs" }
                }
              }
            }
          }
        ],
        "description": "The payment or session code of a [`Deploy`]."
      },
      "ExecutionEffect": {
        "type": "object",
        "title": "ExecutionEffect",
        "description": "The journal of execution transforms from a single deploy.",
        "required": ["operations", "transforms"],
        "properties": {
          "operations": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Operation" },
            "description": "The resulting operations."
          },
          "transforms": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/TransformEntry" },
            "description": "The journal of execution transforms."
          }
        },
        "additionalProperties": false
      },
      "ExecutionResult": {
        "anyOf": [
          {
            "type": "object",
            "description": "The result of a failed execution.",
            "required": ["Failure"],
            "properties": {
              "Failure": {
                "type": "object",
                "required": ["cost", "effect", "error_message", "transfers"],
                "properties": {
                  "cost": {
                    "allOf": [{ "$ref": "#/components/schemas/U512" }],
                    "description": "The cost of executing the deploy."
                  },
                  "effect": {
                    "allOf": [
                      { "$ref": "#/components/schemas/ExecutionEffect" }
                    ],
                    "description": "The effect of executing the deploy."
                  },
                  "error_message": {
                    "type": "string",
                    "description": "The error message associated with executing the deploy."
                  },
                  "transfers": {
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/TransferAddr" },
                    "description": "A record of Transfers performed while executing the deploy."
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "The result of a successful execution.",
            "required": ["Success"],
            "properties": {
              "Success": {
                "type": "object",
                "required": ["cost", "effect", "transfers"],
                "properties": {
                  "cost": {
                    "allOf": [{ "$ref": "#/components/schemas/U512" }],
                    "description": "The cost of executing the deploy."
                  },
                  "effect": {
                    "allOf": [
                      { "$ref": "#/components/schemas/ExecutionEffect" }
                    ],
                    "description": "The effect of executing the deploy."
                  },
                  "transfers": {
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/TransferAddr" },
                    "description": "A record of Transfers performed while executing the deploy."
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          }
        ],
        "description": "The result of executing a single deploy."
      },
      "Fault": {
        "type": "object",
        "description": "Generic representation of validator's fault in an era.",
        "required": ["era_id", "public_key", "timestamp"],
        "properties": {
          "era_id": { "type": "integer", "format": "int64", "minimum": 0 },
          "public_key": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "timestamp": { "type": "string" }
        }
      },
      "FinalitySignature": {
        "type": "object",
        "required": ["block_hash", "era_id", "signature", "public_key"],
        "properties": {
          "block_hash": { "$ref": "#/components/schemas/BlockHash" },
          "era_id": { "type": "integer", "format": "int64", "minimum": 0 },
          "public_key": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "signature": { "type": "string" }
        }
      },
      "JsonBlock": {
        "type": "object",
        "description": "A JSON-friendly representation of `Block`.",
        "required": ["hash", "header", "body", "proofs"],
        "properties": {
          "body": { "$ref": "#/components/schemas/JsonBlockBody" },
          "hash": { "$ref": "#/components/schemas/BlockHash" },
          "header": { "$ref": "#/components/schemas/JsonBlockHeader" },
          "proofs": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/JsonProof" },
            "description": "JSON-friendly list of proofs for this block."
          }
        }
      },
      "JsonBlockBody": {
        "type": "object",
        "description": "A JSON-friendly representation of `Body`",
        "required": ["proposer", "deploy_hashes", "transfer_hashes"],
        "properties": {
          "deploy_hashes": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/DeployHash" }
          },
          "proposer": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "transfer_hashes": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/DeployHash" }
          }
        }
      },
      "JsonBlockHeader": {
        "type": "object",
        "description": "JSON representation of a block header.",
        "required": [
          "parent_hash",
          "state_root_hash",
          "body_hash",
          "random_bit",
          "accumulated_seed",
          "timestamp",
          "era_id",
          "height",
          "protocol_version"
        ],
        "properties": {
          "accumulated_seed": { "$ref": "#/components/schemas/Digest" },
          "body_hash": { "$ref": "#/components/schemas/Digest" },
          "era_end": {
            "allOf": [{ "$ref": "#/components/schemas/JsonEraEnd" }],
            "nullable": true
          },
          "era_id": {
            "type": "integer",
            "format": "int64",
            "description": "The block era id.",
            "minimum": 0
          },
          "height": {
            "type": "integer",
            "format": "int64",
            "description": "The block height.",
            "minimum": 0
          },
          "parent_hash": { "$ref": "#/components/schemas/BlockHash" },
          "protocol_version": {
            "type": "string",
            "description": "The protocol version."
          },
          "random_bit": { "type": "boolean", "description": "Randomness bit." },
          "state_root_hash": { "$ref": "#/components/schemas/Digest" },
          "timestamp": {
            "type": "string",
            "description": "The block timestamp."
          }
        }
      },
      "JsonEraEnd": {
        "type": "object",
        "required": ["era_report", "next_era_validator_weights"],
        "properties": {
          "era_report": { "$ref": "#/components/schemas/JsonEraReport" },
          "next_era_validator_weights": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/ValidatorWeight" }
          }
        }
      },
      "JsonEraReport": {
        "type": "object",
        "description": "Equivocation and reward information to be included in the terminal block.",
        "required": ["equivocators", "rewards", "inactive_validators"],
        "properties": {
          "equivocators": { "type": "array", "items": { "type": "string" } },
          "inactive_validators": {
            "type": "array",
            "items": { "type": "string" }
          },
          "rewards": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Reward" }
          }
        }
      },
      "JsonProof": {
        "type": "object",
        "description": "A JSON-friendly representation of a proof, i.e. a block's finality signature.",
        "required": ["public_key", "signature"],
        "properties": {
          "public_key": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "signature": { "type": "string" }
        }
      },
      "NamedArg": {
        "type": "array",
        "description": "Named arguments to a contract."
      },
      "NamedKey": {
        "type": "object",
        "description": "A named key.",
        "required": ["key", "name"],
        "properties": {
          "key": {
            "type": "string",
            "description": "The value of the entry: a casper `Key` type."
          },
          "name": { "type": "string", "description": "The name of the entry." }
        },
        "additionalProperties": false
      },
      "OpKind": {
        "type": "string",
        "description": "The type of operation performed while executing a deploy.",
        "enum": ["Read", "Write", "Add", "NoOp"]
      },
      "Operation": {
        "type": "object",
        "description": "An operation performed while executing a deploy.",
        "required": ["key", "kind"],
        "properties": {
          "key": {
            "type": "string",
            "description": "The formatted string of the `Key`."
          },
          "kind": {
            "allOf": [{ "$ref": "#/components/schemas/OpKind" }],
            "description": "The type of operation."
          }
        },
        "additionalProperties": false
      },
      "PublicKey": {
        "type": "string",
        "description": "Hex-encoded cryptographic public key, including the algorithm tag prefix."
      },
      "Reward": {
        "type": "object",
        "required": ["validator", "amount"],
        "properties": {
          "amount": { "type": "string" },
          "validator": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          }
        }
      },
      "RuntimeArgs": {
        "type": "array",
        "title": "RuntimeArgs",
        "items": { "$ref": "#/components/schemas/NamedArg" },
        "description": "Represents a collection of arguments passed to a smart contract."
      },
      "SeigniorageAllocation": {
        "anyOf": [
          {
            "type": "object",
            "description": "Info about a seigniorage allocation for a validator",
            "required": ["Validator"],
            "properties": {
              "Validator": {
                "type": "object",
                "required": ["amount", "validator_public_key"],
                "properties": {
                  "amount": {
                    "allOf": [{ "$ref": "#/components/schemas/U512" }],
                    "description": "Allocated amount"
                  },
                  "validator_public_key": {
                    "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
                    "description": "Validator's public key"
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Info about a seigniorage allocation for a delegator",
            "required": ["Delegator"],
            "properties": {
              "Delegator": {
                "type": "object",
                "required": [
                  "amount",
                  "delegator_public_key",
                  "validator_public_key"
                ],
                "properties": {
                  "amount": {
                    "allOf": [{ "$ref": "#/components/schemas/U512" }],
                    "description": "Allocated amount"
                  },
                  "delegator_public_key": {
                    "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
                    "description": "Delegator's public key"
                  },
                  "validator_public_key": {
                    "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
                    "description": "Validator's public key"
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          }
        ],
        "description": "Information about a seigniorage allocation"
      },
      "Step": {
        "type": "object",
        "description": "The execution effects produced by a `StepRequest`.",
        "required": ["era_id", "execution_effect"],
        "properties": {
          "era_id": { "type": "integer", "format": "int64", "minimum": 0 },
          "execution_effect": { "$ref": "#/components/schemas/ExecutionEffect" }
        }
      },
      "Transfer": {
        "type": "object",
        "description": "Represents a transfer from one purse to another",
        "required": [
          "amount",
          "deploy_hash",
          "from",
          "gas",
          "source",
          "target"
        ],
        "properties": {
          "amount": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "Transfer amount"
          },
          "deploy_hash": {
            "allOf": [{ "$ref": "#/components/schemas/DeployHash" }],
            "description": "Deploy that created the transfer"
          },
          "from": {
            "allOf": [{ "$ref": "#/components/schemas/AccountHash" }],
            "description": "Account from which transfer was executed"
          },
          "gas": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "Gas"
          },
          "id": {
            "anyOf": [
              {
                "type": "integer",
                "format": "uint64",
                "description": "User-defined id",
                "minimum": 0
              },
              {
                "type": "object",
                "format": "uint64",
                "description": "User-defined id",
                "additionalProperties": false,
                "nullable": true,
                "minimum": 0,
                "minProperties": 1
              }
            ]
          },
          "source": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "Source purse"
          },
          "target": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "Target purse"
          },
          "to": {
            "anyOf": [
              { "$ref": "#/components/schemas/AccountHash" },
              {
                "type": "object",
                "additionalProperties": false,
                "nullable": true,
                "minProperties": 1
              }
            ],
            "description": "Account to which funds are transferred"
          }
        },
        "additionalProperties": false
      },
      "TransferAddr": {
        "type": "string",
        "description": "Hex-encoded transfer address."
      },
      "Transform": {
        "anyOf": [
          {
            "type": "string",
            "enum": [
              "Identity",
              "WriteContractWasm",
              "WriteContract",
              "WriteContractPackage"
            ]
          },
          {
            "type": "object",
            "description": "Writes the given CLValue to global state.",
            "required": ["WriteCLValue"],
            "properties": {
              "WriteCLValue": { "$ref": "#/components/schemas/CLValue" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given Account to global state.",
            "required": ["WriteAccount"],
            "properties": {
              "WriteAccount": { "$ref": "#/components/schemas/AccountHash" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given DeployInfo to global state.",
            "required": ["WriteDeployInfo"],
            "properties": {
              "WriteDeployInfo": { "$ref": "#/components/schemas/DeployInfo" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given EraInfo to global state.",
            "required": ["WriteEraInfo"],
            "properties": {
              "WriteEraInfo": { "$ref": "#/components/schemas/EraInfo" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given Transfer to global state.",
            "required": ["WriteTransfer"],
            "properties": {
              "WriteTransfer": { "$ref": "#/components/schemas/Transfer" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given Bid to global state.",
            "required": ["WriteBid"],
            "properties": {
              "WriteBid": { "$ref": "#/components/schemas/Bid" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given Withdraw to global state.",
            "required": ["WriteWithdraw"],
            "properties": {
              "WriteWithdraw": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/WithdrawPurse" }
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given `i32`.",
            "required": ["AddInt32"],
            "properties": {
              "AddInt32": { "type": "integer", "format": "int32" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given `u64`.",
            "required": ["AddUInt64"],
            "properties": {
              "AddUInt64": {
                "type": "integer",
                "format": "uint64",
                "minimum": 0
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given `U128`.",
            "required": ["AddUInt128"],
            "properties": {
              "AddUInt128": { "$ref": "#/components/schemas/U128" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given `U256`.",
            "required": ["AddUInt256"],
            "properties": {
              "AddUInt256": { "$ref": "#/components/schemas/U256" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given `U512`.",
            "required": ["AddUInt512"],
            "properties": {
              "AddUInt512": { "$ref": "#/components/schemas/U512" }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Adds the given collection of named keys.",
            "required": ["AddKeys"],
            "properties": {
              "AddKeys": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/NamedKey" }
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "A failed transformation, containing an error message.",
            "required": ["Failure"],
            "properties": { "Failure": { "type": "string" } },
            "additionalProperties": false
          },
          {
            "type": "object",
            "description": "Writes the given Unbonding to global state.",
            "required": ["WriteUnbonding"],
            "properties": {
              "WriteUnbonding": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/UnbondingPurse" }
              }
            },
            "additionalProperties": false
          }
        ],
        "description": "The actual transformation performed while executing a deploy."
      },
      "TransformEntry": {
        "type": "object",
        "description": "A transformation performed while executing a deploy.",
        "required": ["key", "transform"],
        "properties": {
          "key": {
            "type": "string",
            "description": "The formatted string of the `Key`."
          },
          "transform": {
            "allOf": [{ "$ref": "#/components/schemas/Transform" }],
            "description": "The transformation."
          }
        },
        "additionalProperties": false
      },
      "U128": {
        "type": "string",
        "description": "Decimal representation of a 128-bit integer."
      },
      "U256": {
        "type": "string",
        "description": "Decimal representation of a 256-bit integer."
      },
      "U512": {
        "type": "string",
        "description": "Decimal representation of a 512-bit integer."
      },
      "URef": {
        "type": "string",
        "description": "Hex-encoded, formatted URef."
      },
      "UnbondingPurse": {
        "type": "object",
        "description": "Unbonding purse.",
        "required": [
          "amount",
          "bonding_purse",
          "era_of_creation",
          "unbonder_public_key",
          "validator_public_key"
        ],
        "properties": {
          "amount": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "Unbonding Amount."
          },
          "bonding_purse": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "Bonding Purse"
          },
          "era_of_creation": {
            "allOf": [{ "$ref": "#/components/schemas/EraId" }],
            "description": "Era in which this unbonding request was created."
          },
          "new_validator": {
            "anyOf": [
              { "$ref": "#/components/schemas/PublicKey" },
              {
                "type": "object",
                "additionalProperties": false,
                "nullable": true,
                "minProperties": 1
              }
            ],
            "description": "The validator public key to re-delegate to."
          },
          "unbonder_public_key": {
            "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
            "description": "Unbonders public key."
          },
          "validator_public_key": {
            "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
            "description": "Validators public key."
          }
        },
        "additionalProperties": false
      },
      "ValidatorWeight": {
        "type": "object",
        "required": ["validator", "weight"],
        "properties": {
          "validator": {
            "type": "string",
            "description": "\"Hex-encoded cryptographic public key, including the algorithm tag prefix.\""
          },
          "weight": { "type": "string" }
        }
      },
      "VestingSchedule": {
        "type": "object",
        "required": ["initial_release_timestamp_millis"],
        "properties": {
          "initial_release_timestamp_millis": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "locked_amounts": {
            "anyOf": [
              {
                "type": "array",
                "items": { "$ref": "#/components/schemas/U512" },
                "maxItems": 14,
                "minItems": 14
              },
              {
                "type": "object",
                "items": { "$ref": "#/components/schemas/U512" },
                "maxItems": 14,
                "minItems": 14,
                "nullable": true
              }
            ]
          }
        },
        "additionalProperties": false
      },
      "WithdrawPurse": {
        "type": "object",
        "description": "A withdraw purse, a legacy structure.",
        "required": [
          "amount",
          "bonding_purse",
          "era_of_creation",
          "unbonder_public_key",
          "validator_public_key"
        ],
        "properties": {
          "amount": {
            "allOf": [{ "$ref": "#/components/schemas/U512" }],
            "description": "Unbonding Amount."
          },
          "bonding_purse": {
            "allOf": [{ "$ref": "#/components/schemas/URef" }],
            "description": "Bonding Purse"
          },
          "era_of_creation": {
            "allOf": [{ "$ref": "#/components/schemas/EraId" }],
            "description": "Era in which this unbonding request was created."
          },
          "unbonder_public_key": {
            "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
            "description": "Unbonders public key."
          },
          "validator_public_key": {
            "allOf": [{ "$ref": "#/components/schemas/PublicKey" }],
            "description": "Validators public key."
          }
        },
        "additionalProperties": false
      }
    }
  },
  "tags": [{ "name": "event-sidecar", "description": "Event-sidecar rest API" }]
}
```

</details>

### Latest Block

Retrieve information about the last block added to the linear chain.
The path URL is `HOST:PORT/block`.

Example:

```bash
curl -s http://127.0.0.1:18888/block
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"block_hash":"95b0d7b7e94eb79a7d2c79f66e2324474fc8f54536b9e6b447413fa6d00c2581","block":{"hash":"95b0d7b7e94eb79a7d2c79f66e2324474fc8f54536b9e6b447413fa6d00c2581","header":{"parent_hash":"48a99605ed4d1b27f9ddf8a1a0819c576bec57dd7a1b105247e48a5165b4194b","state_root_hash":"8d439b84b62e0a30f8e115047ce31c5ddeb30bd46eba3de9715412c2979be26e","body_hash":"b34c6c6ea69669597578a1912548ef823f627fe667ddcdb6bcd000acd27c7a2f","random_bit":true,"accumulated_seed":"058b14c76832b32e8cd00750e767c60f407fb13b3b0c1e63aea2d6526202924d","era_end":null,"timestamp":"2022-11-20T12:44:22.912Z","era_id":7173,"height":1277846,"protocol_version":"1.4.8"},"body":{"proposer":"0169e1552a97843ff2ef4318e8a028a9f4ed0c16b3d96f6a6eee21e6ca0d4022bc","deploy_hashes":[],"transfer_hashes":["d2193e27d6f269a6f4e0ede0cca805baa861d553df8c9f438cc7af56acf40c2b"]},"proofs":[]}}
```

</details>
<br></br>


### Block by Hash

Retrieve information about a block given its block hash.
The path URL is `HOST:PORT/block/BLOCK-HASH`. Enter a valid block hash. 

Example:

```bash
curl -s http://127.0.0.1:18888/block/96a989a7f4514909b442faba3acbf643378fb7f57f9c9e32013fdfad64e3c8a5
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"block_hash":"96a989a7f4514909b442faba3acbf643378fb7f57f9c9e32013fdfad64e3c8a5","block":{"hash":"96a989a7f4514909b442faba3acbf643378fb7f57f9c9e32013fdfad64e3c8a5","header":{"parent_hash":"8f29120995ae6942d1a48cc4ac8dc3be5de5886f1fb53140356c907f1a70d7ef","state_root_hash":"c8964dddfe3660f481f750c5acd776fe7e08c1e168a4184707d07da6bac5397c","body_hash":"31984faf50cfb2b96774e388a16407cbf362b66d22e1d55201cc0709fa3e1803","random_bit":false,"accumulated_seed":"5ce60583fc1a8b3da07900b7223636eadd97ea8eef6abec28cdbe4b3326c1d6c","era_end":null,"timestamp":"2022-11-20T18:36:05.504Z","era_id":7175,"height":1278485,"protocol_version":"1.4.8"},"body":{"proposer":"017de9688caedd0718baed968179ddbe0b0532a8ef0a9a1cb9dfabe9b0f6016fa8","deploy_hashes":[],"transfer_hashes":[]},"proofs":[]}}
```
</details>
<br></br>

### Block by Height

Retrieve information about a block, given a specific block height.
The path URL is `HOST:PORT/block/BLOCK-HEIGHT`. Enter a valid number representing the block height.

Example:

```bash
curl -s http://127.0.0.1:18888/block/1278485
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"block_hash":"96a989a7f4514909b442faba3acbf643378fb7f57f9c9e32013fdfad64e3c8a5","block":{"hash":"96a989a7f4514909b442faba3acbf643378fb7f57f9c9e32013fdfad64e3c8a5","header":{"parent_hash":"8f29120995ae6942d1a48cc4ac8dc3be5de5886f1fb53140356c907f1a70d7ef","state_root_hash":"c8964dddfe3660f481f750c5acd776fe7e08c1e168a4184707d07da6bac5397c","body_hash":"31984faf50cfb2b96774e388a16407cbf362b66d22e1d55201cc0709fa3e1803","random_bit":false,"accumulated_seed":"5ce60583fc1a8b3da07900b7223636eadd97ea8eef6abec28cdbe4b3326c1d6c","era_end":null,"timestamp":"2022-11-20T18:36:05.504Z","era_id":7175,"height":1278485,"protocol_version":"1.4.8"},"body":{"proposer":"017de9688caedd0718baed968179ddbe0b0532a8ef0a9a1cb9dfabe9b0f6016fa8","deploy_hashes":[],"transfer_hashes":[]},"proofs":[]}}
```
</details>
<br></br>

### Deploy by Hash

Retrieve information about a deploy sent to the network, given its deploy hash.
The path URL is `HOST:PORT/deploy/DEPLOY-HASH`. Enter a valid deploy hash. 

Example:

```bash
curl -s http://127.0.0.1:18888/deploy/8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","deploy_accepted":{"hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","header":{"account":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","timestamp":"2022-11-20T22:33:59.786Z","ttl":"1h","gas_price":1,"body_hash":"c0c3dedaaac4c962a966376c124cf2225df9c8efce4c2af05c4181be661f41aa","dependencies":[],"chain_name":"casper"},"payment":{"ModuleBytes":{"module_bytes":"","args":[["amount",{"cl_type":"U512","bytes":"0410200395","parsed":"2500010000"}]]}},"session":{"StoredContractByHash":{"hash":"ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea","entry_point":"add_bid","args":[["public_key",{"cl_type":"PublicKey","bytes":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","parsed":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a"}],["amount",{"cl_type":"U512","bytes":"05008aa69516","parsed":"97000000000"}],["delegation_rate",{"cl_type":"U8","bytes":"00","parsed":0}]]}},"approvals":[{"signer":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","signature":"01a7ff7affdc13fac7436acf1b6d7c2282fff0f9185ebe1ce97f2e510b20d0375ad07eaca46f8d72f342e7b9e50a39c2eaf75da0c63365abfd526bbaffa4d33f02"}]},"deploy_processed":{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","account":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","timestamp":"2022-11-20T22:33:59.786Z","ttl":"1h","dependencies":[],"block_hash":"2caea6929fe4bd615f5c7451ecddc607a99d7512c85add4fe816bd4ee88fce63","execution_result":{"Success":{"effect":{"operations":[],"transforms":[{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-d63c44078a1931b5dc4b80a7a0ec586164fd0470ce9f8b23f6d93b9e86c5944d","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"05f0c773b316","parsed":"97499990000"}}},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":{"AddUInt512":"2500010000"}},{"key":"hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea","transform":"Identity"},{"key":"hash-86f2d45f024d7bb7fb5266b2390d7c253b588a0a16ebd946a60cb4314600af74","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-000","transform":{"WriteCLValue":{"cl_type":"Unit","bytes":"","parsed":null}}},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"00","parsed":"0"}}},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":"Identity"},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"04f03dcd1d","parsed":"499990000"}}},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":{"AddUInt512":"97000000000"}},{"key":"transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d","transform":{"WriteTransfer":{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","from":"account-hash-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","to":"account-hash-6174cf2e6f8fed1715c9a3bace9c50bfe572eecb763b0ed3f644532616452008","source":"uref-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd-007","target":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-007","amount":"97000000000","gas":"0","id":null}}},{"key":"bid-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","transform":{"WriteBid":{"validator_public_key":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","bonding_purse":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-007","staked_amount":"97000000000","delegation_rate":0,"vesting_schedule":null,"delegators":{},"inactive":false}}},{"key":"deploy-8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","transform":{"WriteDeployInfo":{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","transfers":["transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d"],"from":"account-hash-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","source":"uref-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd-007","gas":"2500000000"}}},{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-d63c44078a1931b5dc4b80a7a0ec586164fd0470ce9f8b23f6d93b9e86c5944d","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"balance-8c2ffb7e82c5a323a4e50f6eea9a080feb89c71bb2db001bde7449e13328c0dc","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"00","parsed":"0"}}},{"key":"balance-8c2ffb7e82c5a323a4e50f6eea9a080feb89c71bb2db001bde7449e13328c0dc","transform":{"AddUInt512":"2500010000"}}]},"transfers":["transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d"],"cost":"2500000000"}}},"deploy_expired":false}
```
</details>
<br></br>

### Accepted Deploy by Hash

Retrieve information about an accepted deploy, given its deploy hash.
The path URL is `HOST:PORT/deploy/accepted/DEPLOY-HASH`. Enter a valid deploy hash.

Example:

```bash
curl -s http://127.0.0.1:18888/deploy/accepted/8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","header":{"account":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","timestamp":"2022-11-20T22:33:59.786Z","ttl":"1h","gas_price":1,"body_hash":"c0c3dedaaac4c962a966376c124cf2225df9c8efce4c2af05c4181be661f41aa","dependencies":[],"chain_name":"casper"},"payment":{"ModuleBytes":{"module_bytes":"","args":[["amount",{"cl_type":"U512","bytes":"0410200395","parsed":"2500010000"}]]}},"session":{"StoredContractByHash":{"hash":"ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea","entry_point":"add_bid","args":[["public_key",{"cl_type":"PublicKey","bytes":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","parsed":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a"}],["amount",{"cl_type":"U512","bytes":"05008aa69516","parsed":"97000000000"}],["delegation_rate",{"cl_type":"U8","bytes":"00","parsed":0}]]}},"approvals":[{"signer":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","signature":"01a7ff7affdc13fac7436acf1b6d7c2282fff0f9185ebe1ce97f2e510b20d0375ad07eaca46f8d72f342e7b9e50a39c2eaf75da0c63365abfd526bbaffa4d33f02"}]}
```
</details>
<br></br>


### Expired Deploy by Hash

Retrieve information about a deploy that expired, given its deploy hash.
The path URL is `HOST:PORT/deploy/expired/DEPLOY-HASH`. Enter a valid deploy hash.

Example:

```bash
curl -s http://127.0.0.1:18888/deploy/expired/e03544d37354c5f9b2c4956826d32f8e44198f94fb6752e87f422fe3071ab58a
```

### Processed Deploy by Hash

Retrieve information about a deploy that was processed, given its deploy hash.
The path URL is `HOST:PORT/deploy/processed/DEPLOY-HASH`. Enter a valid deploy hash.

Example:

```bash
curl -s http://127.0.0.1:18888/deploy/processed/8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7
```

<details> 
<summary><b>Sample output</b></summary>

```bash
{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","account":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","timestamp":"2022-11-20T22:33:59.786Z","ttl":"1h","dependencies":[],"block_hash":"2caea6929fe4bd615f5c7451ecddc607a99d7512c85add4fe816bd4ee88fce63","execution_result":{"Success":{"effect":{"operations":[],"transforms":[{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-d63c44078a1931b5dc4b80a7a0ec586164fd0470ce9f8b23f6d93b9e86c5944d","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"05f0c773b316","parsed":"97499990000"}}},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":{"AddUInt512":"2500010000"}},{"key":"hash-ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea","transform":"Identity"},{"key":"hash-86f2d45f024d7bb7fb5266b2390d7c253b588a0a16ebd946a60cb4314600af74","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-000","transform":{"WriteCLValue":{"cl_type":"Unit","bytes":"","parsed":null}}},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"00","parsed":"0"}}},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":"Identity"},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":"Identity"},{"key":"balance-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"04f03dcd1d","parsed":"499990000"}}},{"key":"balance-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915","transform":{"AddUInt512":"97000000000"}},{"key":"transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d","transform":{"WriteTransfer":{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","from":"account-hash-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","to":"account-hash-6174cf2e6f8fed1715c9a3bace9c50bfe572eecb763b0ed3f644532616452008","source":"uref-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd-007","target":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-007","amount":"97000000000","gas":"0","id":null}}},{"key":"bid-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","transform":{"WriteBid":{"validator_public_key":"01786c83c59eba29e1f4ae4ee601040970665a816ac5bf856108222b72723f782a","bonding_purse":"uref-3d52e976454512999aee042c3c298474a9d3fa98db80879052465c8a4c57c915-007","staked_amount":"97000000000","delegation_rate":0,"vesting_schedule":null,"delegators":{},"inactive":false}}},{"key":"deploy-8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","transform":{"WriteDeployInfo":{"deploy_hash":"8204af872d7d19ef8da947bce67c7a55449bc4e2aa12d2756e9ec7472b4854f7","transfers":["transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d"],"from":"account-hash-eb1dd0668899cf6b35cf99f5d4a7d3ea05acf352f75d14075982e0aebc099776","source":"uref-c182f2fafc6eb59306f971a3d3ad06e4ffa09364ca9de2fc48d123e40da243cd-007","gas":"2500000000"}}},{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-d63c44078a1931b5dc4b80a7a0ec586164fd0470ce9f8b23f6d93b9e86c5944d","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"hash-d2469afeb99130f0be7c9ce230a84149e6d756e306ef8cf5b8a49d5182e41676","transform":"Identity"},{"key":"hash-7cc1b1db4e08bbfe7bacf8e1ad828a5d9bcccbb33e55d322808c3a88da53213a","transform":"Identity"},{"key":"hash-4475016098705466254edd18d267a9dad43e341d4dafadb507d0fe3cf2d4a74b","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":"Identity"},{"key":"balance-8c2ffb7e82c5a323a4e50f6eea9a080feb89c71bb2db001bde7449e13328c0dc","transform":"Identity"},{"key":"balance-fe327f9815a1d016e1143db85e25a86341883949fd75ac1c1e7408a26c5b62ef","transform":{"WriteCLValue":{"cl_type":"U512","bytes":"00","parsed":"0"}}},{"key":"balance-8c2ffb7e82c5a323a4e50f6eea9a080feb89c71bb2db001bde7449e13328c0dc","transform":{"AddUInt512":"2500010000"}}]},"transfers":["transfer-1e75292a29d210326d8845082b302037300eac92c7d2612790ca3ab1a62e570d"],"cost":"2500000000"}}}
```

</details>
<br></br>

### Faults by Public Key

Retrieve the faults associated with a validator's public key.
The path URL is `HOST:PORT/faults/<public-key>`. Enter a valid hexadecimal representation of a validator's public key.

Example:

```bash
curl -s http://127.0.0.1:18888/faults/01a601840126a0363a6048bfcbb0492ab5a313a1a19dc4c695650d8f3b51302703
```

### Faults by Era

Return the faults associated with an era, given a valid era identifier.
The path URL is: `HOST:PORT/faults/ERA-ID`. Enter an era identifier.

Example:

```bash
curl -s http://127.0.0.1:18888/faults/2304
```

### Finality Signatures by Block

Retrieve the finality signatures in a block, given its block hash. 
The path URL is: `HOST:PORT/signatures/BLOCK-HASH`. Enter a valid block hash.

Example:

```bash
curl -s http://127.0.0.1:18888/signatures/85aa2a939bc3a4afc6d953c965bab333bb5e53185b96bb07b52c295164046da2
```

### Step by Era

Retrieve the step event emitted at the end of an era, given a valid era identifier.
The path URL is: `HOST:PORT/step/ERA-ID`. Enter a valid era identifier.

Example:

```bash
curl -s http://127.0.0.1:18888/step/7268
```

### Missing Filter

If no filter URL was specified after the root address (HOST:PORT), an error message will be returned.

Example:

```bash
curl http://127.0.0.1:18888
{"code":400,"message":"Invalid request path provided"}
```

### Invalid Filter

If an invalid filter was specified, an error message will be returned.

Example:

```bash
curl http://127.0.0.1:18888/other
{"code":400,"message":"Invalid request path provided"}
```

## The Sidecar Event Stream

The Sidecar's event stream endpoint is a passthrough for all the events emitted by the node(s) to which the Sidecar connects. This stream also includes one endpoint for Sidecar-generated events that can be useful, although the node did not emit them. Events are divided into four categories and emitted on their respective endpoints:

- **Deploy events** - Associated with Deploys on a node and emitted on the `events/deploys` endpoint. Currently, only a `DeployAccepted` event is emitted. The URL to consume these events using Sidecar on a Mainnet or Testnet node is `http://HOST:19999/events/deploys/`.
- **Finality Signature events** - Emitted on the `events/sigs` endpoint when a block has been finalized and cannot be altered. The URL to consume finality signature events using Sidecar on a Mainnet or Testnet node is `http://HOST:19999/events/sigs/`.
- **Main events** - All other events are emitted on the `events/main` endpoint, including `BlockAdded`, `DeployProcessed`, `DeployExpired`, `Fault`, and `Step` events. The URL to consume these events using Sidecar on a Mainnet or Testnet node is `http://HOST:19999/events/main/`.
- **Sidecar-generated events** - The Sidecar also emits events on the `events/sidecar` endpoint, designated for events originating solely from the Sidecar service. The URL to consume these events using Sidecar on a Mainnet or Testnet node is `http://HOST:19999/events/sidecar/`.

Learn more about each endpoint, message versioning, and different types of shutdown events on the [Monitoring the Sidecar Service](../../operators/setup/event-sidecar.md#monitoring-the-sidecars-event-stream) page. 

Moreover, the [Node's Event Stream](../../operators/setup/node-events.md) page explains the various event types emitted by the node and available through the Sidecar service.

### Listening to the Sidecar Event Stream

<!-- TODO double check that this explanation is correct and the code works as before, but with port 19999. Since the Sidecar is installed on the same machine as where the node is running, I assume we can access it using the NODE_ADDRESS. -->

Applications can listen for events during a particular era. To consume the event stream using the SSE Sidecar, set up an event listener in your dApp using the following code. The `NODE_ADDRESS` is the address of the node where the SSE Sidecar is installed. The `PORT` is the address where the Sidecar streams events. By default it is `19999`, but you can find more details [here](../../operators/setup/event-sidecar.md#configuring-the-sidecar-service-configuring-the-sidecar).

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const { EventStream, EventName } = require("casper-js-sdk")

const es = new EventStream("http://NODE_ADDRESS:PORT/events/" + CHANNEL)
es.start()
es.subscribe(EventName.EVENT_NAME, eventHandler)

const eventHandler = (event) => {
    console.log(event)
}
```

</TabItem>

<TabItem value="python" label="Python">

```python
from pycspr import NodeClient, NodeConnection, NodeEventChannel, NodeEventType

def eventHandler(event):
    print(event)

client = NodeClient(NodeConnection(host = "NODE_ADDRESS", port_rpc = "PORT"))
client.get_events(eventHandler, NodeEventChannel.CHANNEL, NodeEventType.EVENT_NAME)
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl -s http://NODE_ADDRESS:PORT/events/CHANNEL
```

</TabItem>

</Tabs>

You can find node addresses of active online peers to replace `NODE_ADDRESS`, by navigating to [cspr.live](https://cspr.live/tools/peers) for Mainnet and [testnet.cspr.live](https://testnet.cspr.live/tools/peers) for Testnet.

Replace `EVENT_NAME` with one of the event types listed [below](#event-types).

Replace `CHANNEL` with one of the following event streams:
- `main` for `ApiVersion`, `BlockAdded`, `DeployExpired`, `DeployProcessed`, `Fault`, or `Step` events.
- `deploys` for `DeployAccepted` events.
- `sigs` for `FinalitySignature` events.


### Reacting to Events

An application may parse each event needed for its use case and respond accordingly. The dApp may act on some events and not others, or it may act upon them all, depending on its use case. Each event type contains additional data that might help in deciding whether or not to take an action. For example, `DeployAccepted` events contain the account's public key that submitted the deploy, the contract address, and more. This information can help determine how to proceed or whether or not to react.

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
const eventHandler = (event) => {
  if (event.body.DeployAccepted.header.account == "012481699f9231e36ecf002675cd7186b48e6a735d10ec1b30f587ca716937752c") {
    // Perform an action
  }
}
```

</TabItem>

<TabItem value="python" label="Python">

```python
def eventHandler(event):
  if event["DeployAccepted"]["header"]["account"] == "012481699f9231e36ecf002675cd7186b48e6a735d10ec1b30f587ca716937752c":
    # Perform an action
```

</TabItem>

</Tabs>

### Unsubscribing from Events

In many cases, an application may need to unsubscribe after a certain time or may want to unsubscribe from some events but not others. The Casper SDKs provide this ability with the `unsubscribe` function:

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
es.unsubscribe(EventName.EVENT_NAME)
```

</TabItem>

</Tabs>

- `EVENT_NAME` - One of the different [event types](#event-types) emitted by a Casper node.

### Stopping the Event Stream

A dApp may cease listening to all events using the `stop` function:

<Tabs>

<TabItem value="js" label="JavaScript">

```javascript
es.stop()
```

</TabItem>

</Tabs>

### Replaying the Sidecar Event Stream

This command will replay the event stream from an old event onward using the SSE Sidecar. Replace the `NODE_ADDRESS`, `PORT`, `CHANNEL`, and `ID` fields with the values of your scenario.

<Tabs>

<TabItem value="curl" label="cURL">

```bash
curl -s http://NODE_ADDRESS:PORT/events/CHANNEL?start_from=ID
```

**Example:**

```bash
curl -sN http://65.21.235.219:19999/events/main?start_from=29267508
```

Note that certain shells like `zsh` may require an escape character before the question mark:

```bash
curl -sN http://65.21.235.219:19999/events/main\?start_from=29267508
```

</TabItem>

</Tabs>

The server will replay all the cached events if the ID is 0 or if you specify an event ID already purged from the cache. [This section](../../operators/setup/node-events.md#replaying-the-event-stream) contains more details about the number of events cached.
