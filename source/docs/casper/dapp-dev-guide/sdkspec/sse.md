# SSE Endpoints {#sse-endpoints}

## SseData {#sse-data}

The `data` field of the events sent on the event stream to clients.

### ApiVersion {#apiversion}

The version of this node's API server. This event will always be the first sent to a new client, and will have no associated event ID provided.

|Parameter|Type|Description|
|---------|----|-----------|
|[ApiVersion](../sdkspec/components#apiversion)|String|Casper Platform protocol version.|

### BlockAdded {#blockadded}

The given block has been added to the linear chain and stored locally.

|Parameter|Type|Description|
|---------|----|-----------|
|[block](../sdkspec/components#jsonblock)|Object|A JSON-friendly representation of a `Block`.|
|[block_hash](../sdkspec/components#blockhash)|String|A cryptographic hash identifying a `Block`.|

### DeployAccepted {#deployaccepted}

The given deploy has been newly-accepted by this node.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy](../sdkspec/components#deploy)|Object|A deploy; an item containing a smart contract along with the requester's signature(s).|

### DeployProcessed {#deployprocessed}

The given deploy has been executed, committed and forms part of the given block.

|Parameter|Type|Description|
|---------|----|-----------|
|[account](../sdkspec/components#account)|String|Structure representing a user's account.|
|[block_hash](../sdkspec/components#blockhash)|String|A cryptographic hash identifying a `Block`.|
|dependencies|Array||
|[deploy_hash](../sdkspec/components#deployhash)|String|Hex-encoded deploy hash.|
|[execution_result](../sdkspec/components#executionresult)|Object|The result of executing a single deploy.|
|[timestamp](../sdkspec/components#timestamp)|Integer|Timestamp formatted as per RFC 3339.|
|[ttl](../sdkspec/components#timediff)|Integer|Human-readable duration.|

### DeployExpired {#deployexpired}

The given deploy has expired.

|Parameter|Type|Description|
|---------|----|-----------|
|[deploy_hash](../sdkspec/components#deployhash)|String|Hex-encoded deploy hash.|

### Fault {#fault}

Generic representation of validator's fault in an era.

|Parameter|Type|Description|
|---------|----|-----------|
|[era_id](../sdkspec/components#eraid)|Integer|Era ID newtype.|
|[public_key](../sdkspec/components#publickey)|String|Checksummed hex-encoded cryptographic public key, including the algorithm tag prefix.|
|[timestamp](../sdkspec/components#timestamp)|Integer|Timestamp formatted as per RFC 3339.|

### FinalitySignature {#finalitysignature}

New finality signature received.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_hash](../sdkspec/components#blockhash)|String|A cryptographic hash identifying a `Block`.|
|[era_id](../sdkspec/components#eraid)|Integer|Era ID newtype.|
|[public_key](../sdkspec/components#publickey)|String|Checksummed hex-encoded cryptographic public key, including the algorithm tag prefix.|
|[signature](../sdkspec/components#signature)|String|Checksummed hex-encoded cryptographic signature, including the algorithm tag prefix.|

### Step {#step}

|Parameter|Type|Description|
|---------|----|-----------|
|[era_id](../sdkspec/components#eraid)|Integer|Era ID newtype.|
|[execution_effect](../sdkspec/components#executioneffect)|Object|The journal of execution transforms from a single deploy.|