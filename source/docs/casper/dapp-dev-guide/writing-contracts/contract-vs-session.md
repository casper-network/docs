# Contracts and Session Code

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is Session Code? {#what-is-session-code}

Session code is the simplest logic one can execute on a Casper network. It is essential because it is often used to trigger contract logic stored on the chain. Session code requires only one entry point, the `call` function, and it runs within the context of the account executing the session code. As a result, the session code runs with the account's permissions, such as having access to the account's main purse. For example, the session code could transfer tokens from the account's main purse. 

Session code is required when interacting and accepting values returned across the Wasm boundary. The best use of session code is when the situation calls for [stateless](/glossary/S.md/#stateless) execution, and very little or no internal data needs to be tracked.

## Comparing Session and Contract Code {#comparing-session-and-contract}

The following table summarizes the key differences between session code and contract code on a Casper network.

| Session Code | Contract Code |
| --- | --- |
| Session code always executes in the context of the account that signed the deploy containing the session code. | A smart contract,  which is stored on-chain logic, executes within its own context. |
| Session code has only one entry point, `call`, which can be used to interact with the session code. | A smart contract can have multiple entry points that can be invoked.|  
| The `call` entry point initiates any action the session code takes. | Any action undertaken by a contract must initiate through an outside call, usually via session code.|
| When a `put_key` call is made within the body of the session code, the key is added to the account's named keys. | When a `put_key` call is made within the smart contract's context, the contract's record is modified to have a new named_key entry. |
| For more information on how to write session code, see [Writing Session Code](/dapp-dev-guide/writing-contracts/session-code). | For more information on writing contracts, see [Writing a Basic Smart Contract in Rust](/dapp-dev-guide/writing-contracts/rust-contracts). |

The following image depicts the comparison presented in the table.

<p align="center"><img src={useBaseUrl("/image/dApp/contract-vs-session.png")} alt="Comparing Session and Contract Code" /></p>

## What's Next? {#whats-next}

- Learn to [write session code](/dapp-dev-guide/writing-contracts/session-code)
- Learn to [test session code](/dapp-dev-guide/writing-contracts/testing-session-code)
