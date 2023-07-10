# Estimating Gas Costs with Speculative Execution

Version 1.5 of the Casper Node includes a new JSON RPC endpoint called [`speculative_exec`](../json-rpc/json-rpc-transactional.md#speculative_exec-speculative_exec). This endpoint allows developers to send a [Deploy](../../concepts/glossary/D.md#deploy-deploy) to a single node, which will execute the Deploy without committing the results to global state and, therefore, not incurring the associated costs. Observing the execution results of the Deploy gives a rough estimate of the potential cost for sending the Deploy without speculative execution.

In addition to the Deploy in question, `speculative_exec` also accepts a [`block_identifier`] for a specific block height or hash to speculate on. If you do not provide a block identifier, the Deploy will be executed on the most recent block.

## Sending a Speculative Execution Deploy using the Rust CLI Casper Client

The [Rust CLI Casper client](../dapps/sending-deploys.md) includes a `speculative-exec` option that will flag a normal `put-deploy` for execution but not commitment to global state. The following command shows an example:

```bash

casper client put-deploy /
--node-address <HOST:PORT> /
--chain-name <CHAIN_NAME> /
--secret-key <PATH> /
--session-path <PATH>  /
--payment-amount <PAYMENT_AMOUNT_IN_MOTES>
--speculative-exec <BLOCK HEIGHT OR HASH>

```

You should receive `execution_result`s that show a `cost`.

```bash

{
  "jsonrpc": "2.0",
  "id": -4571113357017152230,
  "result": {
    "api_version": "1.0.0",
    "block_hash": "6ca035b08de092e7f5e8fff771b880c5b4d7463a8f7a9b108888aaad958e5b0f",
    "execution_result": {
      "Success": {
        "effect": {
          <Deploy effects removed for conciseness.>
        },
        "transfers": [],
        "cost": "87300473670"
      }
    }
  }
}

```

:::note

Cost estimates acquired through `speculative_exec` may vary from the cost of sending the same Deploy to a Casper network. Speculative execution is a tool to help narrow down the potential cost of sending a Deploy, but many factors can cause the actual cost to vary.

:::
