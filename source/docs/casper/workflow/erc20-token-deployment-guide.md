# Deploy an ERC20 Compliant Token on the Casper Mainnet

On Casper, it is possible to create smart contracts that emulate ERC20 tokens on Ethereum. These tokens have all of the capabilities of traditional ERC20 tokens, allowing one to approve, transfer, inquire the balance of, etc. By following this guide, you'll be able to create your own ERC20 token and deploy it to the Casper blockchain.

## Prerequisites

Before following this guide ensure that you are familiar with [compiling smart contracts](https://casper.network/docs/dapp-dev-guide/getting-started) and [deploying smart contracts](https://casper.network/docs/dapp-dev-guide/deploying-contracts) on Casper. You will also need to be familiar with the [Casper Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce?hl=en) browser extension.

## Clone the Example ERC20 Project

Navigate to the directory you'd like your project to reside. For this tutorial, we'll be starting in our home (`~`) folder. Execute the following:

`cd ~ && git clone https://github.com/casper-ecosystem/erc20.git && cd erc20`

This will clone the example ERC20 project to `~/erc20`, and will change your working directory to this folder.

## Compile ERC20 Contract

### Install `CMake`

`CMake` is required to compile the contracts to web-assembly. Install it by following the instructions at [CMake](https://cmake.org/install/).

### Prepare your Build Environment

Still in your `erc20` directory, ensure that the necessary `wasm32-unknown-unknown` compilation target is specified by running

`make prepare`

### Compile the Contract

To compile the ERC20 contract run

`make build-contracts`

## Creating a Node Project

### Install Node and npm

For this tutorial we'll be using the `casper-erc20-js-client`, `casper-js-sdk`, and `casper-js-client-helper` JavaScript libraries with a Node.js backend in order to execute our commands as a script.

Install node [here](https://nodejs.org/en/download/). It will include npm.

### Initialize Node Project

Navigate home by running `cd ~`  then create a new directory for your project. This will be a different directory than the `erc20` example, and will host the script that will deploy our token.

For this example, we'll name the directory `erc20_deployment`

`mkdir erc20_deployment`

Navigate into this directory

`cd erc20_deployment`

Install the required Node modules:

`npm install casper-erc20-js-client casper-js-client-helper casper-js-sdk`

### Copy the Compiled `.wasm` File to the `erc20_deployment` Folder

Assuming you've followed this tutorial exactly, both your `erc20` and `erc20_deployment` folders will be in the same (home) directory.

While still inside `erc20_deployment`, run the following command to copy your compiled contract to the Node project directory:

`cp ../erc20/target/wasm32-unknown-unknown/release/erc20_token.wasm ./`

## Set up an Account

### Install Rust

To interact with the necessary Rust packages we will first need to install Rust. To do so, execute the following command:

`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

You can also install Rust using Homebrew on macOS or `apt` on Debian based linux systems.

### Install `casper-client`

We will be using `casper-client` to generate a keypair that represents an account on Casper.

To install the `casper-client` execute the command

`cargo install casper-client`

### Generate Account Keys

In the working directory of your project, generate a keypair by running:

`casper-client keygen keys/`

This will generate keys and write them to the `keys` directory. If `keys` does not exist, `casper-client` will create the directory.

You can also create an account with [Casper Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce), or use an account you've made previously. (Note that new versions of Casper Signer do not download the necessary public key when exporting accounts to files).

## Fund the Account with Test CSPR

To fund the test account, you'll first need to import your account in the Casper Signer.

To do this, open the Signer in your browser, unlock your vault with your password ([or set up a new vault](https://casper.network/docs/workflow/signer-guide#12-logging-in-to-the-casper-signer)).

Click "Import Account". Name the imported account and click "Upload". Navigate to the `secret_key.pem` file in the aforementioned `keys/` directory.

Import the account and select it as your current active account.

Visit the [testnet faucet](https://testnet.cspr.live/tools/faucet), sign in with Casper Signer, complete the captcha, and request your tokens.

After a moment, you're account will be credited 1000 CSPR.

*Note: You can only request tokens once per account.*

## Write the Deployment Script

Start by creating the file `index.js` and opening it in your preferred text editor or IDE.

Begin by requiring the modules in JavaScript. Paste the following at the top of the file:

```javascript
const { ERC20Client } = require("casper-erc20-js-client");
const { utils } = require("casper-js-client-helper");
const { CLValueBuilder, CasperClient, Keys, CLPublicKey, CLPublicKeyType } = require("casper-js-sdk");
```

Next, reference your account keys with the following code:

```javascript
const KEYS = Keys.Ed25519.parseKeyFiles(
  "./keys/public_key.pem",
  "./keys/secret_key.pem"
);
```

As long as you generated the keys with the afore mentioned command within your project's root folder, the paths to your keys should be the same as above. Otherwise you'll need to put in the alternate path to your keys.

Initialize an ERC20 client object by inserting the code below:

```javascript
const erc20 = new ERC20Client(
  "http://162.55.132.188:7777/rpc", // RPC address
  "casper-test", // Network name
);
```

As of the time of writing, the Casper RPC Node address above is valid and will work as is. If in the future this endpoint is unavailable you can select another online peer from the list [here](https://testnet.cspr.live/tools/peers). Note that you'll need to replace the port with `7777` for most nodes, as well as will need to add `/rpc` to the end of the address.







