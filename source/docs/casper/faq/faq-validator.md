# FAQ - Validators

### Node Operations {#node-operations}

<details>
<summary><b>How do I check my node status?</b></summary>

Once your node is running, you can run `curl -s localhost:8888/status | jq .last_added_block_info` to query your local server's synchronization status. The output will look similar to:

```bash

curl -s http://localhost:8888/status | jq .last_added_block_info
{
  "hash": "73f398f89dfe2b980634281c0d6be8379b27aedbf4029f699219fafa1e09526c",
  "timestamp": "2021-07-09T04:56:42.240Z",
  "era_id": 1090,
  "height": 106926,
  "state_root_hash": "5e7bd420cb5d3290cf50036ada510c9c1adcf63198381c398403086f739394c8",
  "creator": "011752f095ee6d2902540ea4fafd649da4b7b0c2a6e38176fb7f661a0e463d43b4"
}

```

</details>

<details>
<summary><b>What ports are required for casper-node?</b></summary>

Casper-node requires the following ports:

* 35000 - Required for external visibility
* 7777 - RPC endpoint for interaction with casper-client
* 8888 - REST endpoint for status and metrics (This port allows your node to be part of the network status)
* 9999 - SSE endpoint for event stream

</details>

<details>
<summary><b>What '--node-address' do I use for making requests?</b></summary>

If you are running a node, you can use `localhost:7777` for RPC requests like deploys. For node-health queries, use `localhost-8888`.

</details>

<details>
<summary><b>How can I move my node to another machine?</b></summary>

**Method One**
1. Stop the node.
2. Copy all data.
3. Change the mountpoint.
4. Start the node.

**Method Two**
1. Create another node in parallel.
2. Once it is up to date, stop the nodes.
3. Swap the associated keys.
4. Restart the new node.

**Note:** Use the following command to copy your node's data:

```

rsync -av --inplace --sparse  /var/lib/casper/ /new_mount

```

</details>

### Casper Compatibility {#casper-compatibility}

<details>
<summary><b>Does Casper run on ARM?</b></summary>

Casper-node does not work with ARM type servers. You can see our hardware specifications [here](../operators/hardware).

</details>

<details>
<summary><b>What operating systems are supported for casper-node?</b></summary>

Casper is currently tested and packaged for Ubuntu 18.04 or 20.04.

</details>

<details>
<summary><b>Do I have to run a node 24/7?</b></summary>

Validators must be online 24/7. Otherwise, they face ejection and loss of rewards as a result of liveness failure. Failure to participate in consensus for one era results in ejection.

If you cannot run a node 24/7, you can delegate your tokens to a healthy validator node with good uptime.

</details>
