# Casper JSON-RPC Error Codes

The following document expands on custom error codes available on the `casper-json-rpc` implementation.

## Error Codes {#codes}

|Code    |Error                        |Description                                            |
|--------|-----------------------------|-------------------------------------------------------|
|   -1   | NoSuchDeploy                | The requested Deploy was not found.                   |
|   -2   | NoSuchBlock                 | The requested Block was not found.                    |
|   -3   | FailedToParseQueryKey       | Parsing the Key from a query failed.                  |
|   -4   | QueryFailed                 | The query failed to find a result.                    |
|   -5   | QueryFailedToExecute        | Executing the query failed.                           |
|   -6   | FailedToParseGetBalanceURef | Parsing the URef while getting a balance failed.      |
|   -7   | FailedToGetBalance          | Failed to get the requested balance.                  |
|   -8   | GetBalanceFailedToExecute   | Executing the query to retrieve the balance failed.   |
|   -9   | InvalidDeploy               | The given Deploy cannot be executed as it is invalid. |
|  -10   | NoSuchAccount               | The given account was not found.                      |
|  -11   | FailedToGetDictionaryURef   | Failed to get the requested dictionary URef.          |
|  -12   | FailedToGetTrie             | Failed to get the requested dictionary trie.          |
|  -13   | NoSuchStateRoot             | The requested state root hash was not found.          |
| -32600 | InvalidRequest              | The JSON sent is not a valid Request object.          |
| -32601 | MethodNotFound              | The method does not exist or is not available.        |
| -32602 | InvalidParams               | Invalid method parameter(s)                           |
| -32603 | InternalError               | Internal JSON-RPC error.                              |
| -32700 | ParseError                  | Invalid JSON was received by the server.              |

## Invalid `Params` {#invalid-params}

The `casper-json-rpc` no longer ignores invalid `params` fields. `Params` fields to be omitted should be an empty Array '[]', an empty Object '{}' or absent.

Failing to adhere to this will result in an `InvalidParams` error.