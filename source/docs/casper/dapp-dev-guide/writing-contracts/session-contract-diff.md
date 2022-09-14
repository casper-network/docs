# Difference Between Session Code and Contract Code

| Session Code | Contract Code |
| --- | --- |
| Session code always executes in the context of the account that signed the deploy that contains the session code. | Contract code  which is stored on chain logic executes within its own separate context. |
| When a `put_key` call is made within the body of the session code, the key is added to the account's named keys.| When a `put_key` call is made within the contract's context, the contract's record is modified to have a new named_key entry. |
| Session code has only one entry point, that is the `call` function, which you can use to interact with the session code.| A contract can have multiple entry points that will help you interact with the contract code.|  
| Any action taken by the session code is initiated by the `call` function within the session code. | Any action undertaken by a contract must initiate through an outside call, usually via session code.|
| For more information on how to write session code, see [Writing Session Code](../writing-contracts/session-code.md) | For more information on writing contracts, see [Writing a Basic Smart Contract in Rust](../writing-contracts/rust.md)
