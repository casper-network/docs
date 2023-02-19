# Quickstart

import useBaseUrl from '@docusaurus/useBaseUrl';

Here is a list of commands for developers who already meet the prerequisites and want to quickly send a sample contract to the [Testnet](https://testnet.cspr.live/). Consult the [complete documentation](/writing-contracts) for context and additional help.

## Prerequisites

1. You have installed [Rust](https://www.rust-lang.org/tools/install). Verify the installation with this command: `rustup --version`. Restart the shell if needed.
2. You have installed [cmake](https://cmake.org/install/). Verify the installation with this command: `cmake --version`.
   - On Ubuntu, you can follow [this guide](https://cgold.readthedocs.io/en/latest/first-step/installation.html).
   - On MacOS, use this command: `brew install cmake`. 
3. You have an integrated development environment (IDE). On Windows, you will need to download the C++ build developer tools, without which you cannot install `cargo-casper`.
4. You have download [Git](https://git-scm.com/download/).

## Steps

5. Install Cargo Casper with this command: 

   `cargo install cargo-casper`

6. Install the [Casper client](./setup.md#the-casper-command-line-client): 

   `cargo install casper-client`

   If you have issues installing the casper-client, you may need additional libraries.

   - On MacOS:

      ```bash
      brew install pkg-config
      brew install openssl
      ```

   - On Ubuntu:

      ```bash
      sudo apt-get install pkg-config
      sudo apt-get install openssl
      sudo apt-get install libssl-dev
      ```

   **Note:** Make sure you also have the development packages of `openssl` installed. For example, `libssl-dev` on Ubuntu or `openssl-devel` on Fedora.

7. Test the `casper-client` by [querying a node](./setup.md#acquire-node-address-from-network-peers) on the network and getting the latest [state root hash](../glossary/S.md#state-root-hash).

   ```bash
   casper-client get-state-root-hash --node-address http://65.21.235.219:7777
   ```

8. Set up a [Casper Account](./setup.md#setting-up-an-account).

9. Clone a simple counter contract or download it from GitHub:

   `git clone https://github.com/casper-ecosystem/counter`

10. Navigate to the folder and prepare the dependencies to build the contract:

   ```bash
   cd counter
   make prepare
   ```

11. Build the contract and tests:

   `make test`

12. Install the contract on Testnet using the `casper-client`'s `put-deploy` command. Replace the secret key with your path. Record the deploy hash from the output.

   ```bash
   casper-client put-deploy \
   --node-address [NODE_ADDRESS] \
   --chain-name casper-test \
   --secret-key [YOUR_PATH_TO_SECRET_KEY_FILE] \
   --payment-amount 30000000000 \
   --session-path contracts/counter-v1/target/wasm32-unknown-unknown/release/counter-v1.wasm
   ```

13. Check the deploy status given the deploy hash from the previous command:

   ```bash
   casper-client get-deploy --node-address [NODE_ADDRESS] [DEPLOY_HASH]
   ```

14. Get the latest state root hash:

   ```bash
   casper-client get-state-root-hash --node-address [NODE_ADDRESS]
   ```

15. Open the deploy tab of the account on the Testnet to see the deploy details. 

   - As an alternative to step 15, check your account using the command line:

   ```bash
   casper-client query-global-state \
   --node-address [NODE_ADDRESS] \
   --state-root-hash [STATE_ROOT_HASH] \
   --key [PATH_TO_PUBLIC_KEY]
   ```

   - As another alternative, use the account hash for the `--key` argument. To get the account hash, look at the account details on the block explorer, or run this command:

   ```bash
   casper-client account-address --public-key [PATH_TO_PUBLIC_KEY]
   ```

   Then, query the blockchain using the account hash:

   ```bash
   casper-client query-global-state \
   --node-address [NODE_ADDRESS] \
   --state-root-hash [STATE_ROOT_HASH] \
   --key [ACCOUNT_HASH]
   ```

16. Now, you can play with the smart contract and increment the value it manages from 0 to 1. First, let's make sure the value is 0. Look at the "parsed" value returned in the output. An expected example output is shown below.

   ```bash
   casper-client query-global-state \
   --node-address [NODE_ADDRESS] \
   --state-root-hash [STATE_ROOT_HASH] \
   --key [ACCOUNT_HASH] \
   -q "counter/count"
   ```

   **Example output:**

   ```json
   {
   "id": 8523290678829319485,
   "jsonrpc": "2.0",
   "result": {
      "api_version": "1.4.6",
      "block_header": null,
      "merkle_proof": "[85716 hex chars]",
      "stored_value": {
         "CLValue": {
         "bytes": "01000000",
         "cl_type": "I32",
         "parsed": 0
         }
      }
     }
   }
   ```

17. Now increment the count value by calling the entry point `counter_inc`.

   ```bash
   casper-client put-deploy \
   --node-address [NODE_ADDRESS] \
   --chain-name [CHAIN_NAME] \
   --secret-key [PATH_TO_YOUR_KEY] \
   --payment-amount 100000000 \
   --session-name "counter" \
   --session-entry-point "counter_inc"
   ```

18. Get the NEW `state root hash`, to get the latest snapshot of the blockchain state – this is EXTREMELY IMPORTANT! 

   ```bash
   casper-client get-state-root-hash --node-address [NODE_ADDRESS]
   ```

19. Query the state of the network.

   ```bash
   casper-client query-state \
   --node-address [NODE_ADDRESS] \
   --state-root-hash [STATE_ROOT_HASH] \
   --key [ACCOUNT_HASH] \
   -q "counter/count"
   ```

   If everything went according to plan, the value should be 1. Look at the "parsed" value below.

   ```json
   {
   "id": 8523290678829319485,
   "jsonrpc": "2.0",
   "result": {
      "api_version": "1.4.6",
      "block_header": null,
      "merkle_proof": "[85716 hex chars]",
      "stored_value": {
         "CLValue": {
         "bytes": "01000000",
         "cl_type": "I32",
         "parsed": 1
         }
      }
     }
   }
   ```

You have successfully invoked a contract on the Casper Testnet to increment a value from 0 to 1. Now you have all the infrastructure required to work with more meaningful contracts.
