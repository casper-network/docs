# Deploying an ERC-20 Compliant Token on Casper

On the Casper Network, it is possible to create smart contracts that emulate ERC-20 tokens on Ethereum. These tokens have all of the capabilities of traditional ERC-20 tokens, allowing one to approve, transfer, inquire the balance of, etc. By following this guide, you'll be able to create your own ERC-20 token and deploy it to the Casper Network.

## Prerequisites

Before following this guide ensure that you are familiar with [compiling smart contracts](https://casper.network/docs/dapp-dev-guide/getting-started) and [deploying smart contracts](https://casper.network/docs/dapp-dev-guide/deploying-contracts) on the Casper Network. You will also need to be familiar with the [Casper Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce?hl=en) browser extension.

You will also need to have [Node.js](https://nodejs.org/en/) installed. Follow the [instructions](https://nodejs.org/en/download) to install it on your system.

Lastly, you'll need at least a basic understanding of the [bash command line](https://www.gnu.org/software/bash/manual/bash.html). *`zsh` and other related shells should work as well.*

## Cloning the JavaScript Interface

For this tutorial, we'll be starting in the home (`~`) directory. Navigate here first:

`cd ~`

Now clone the prewritten JavaScript deployer project, so you don't have to reinvent the wheel. This project includes a precompiled ERC-20 contract with only basic functionality. If you'd like to write your own ERC-20 contract with custom logic, please follow the instructions [here](https://casper.network/docs/writing-contracts). Execute this command in your home directory:

`git clone https://github.com/casper-ecosystem/casper-erc20-js-interface.git`

Change your working directory to the project directory:

`cd casper-erc20-js-interface`

Install the required dependencies

`npm install`

## Set up an Account

### Install Rust

To interact with the necessary Rust packages we will first need to install Rust. To do so, execute the following command:

`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

You can also [install Rust using Homebrew](https://formulae.brew.sh/formula/rust) on macOS or `apt` on Debian based linux systems.

### Install `casper-client`

We will be using `casper-client` to generate a keypair that represents an account on Casper.

To install the `casper-client` execute the command

`cargo install casper-client`

*`cargo` is a Rust package manager and is installed alongside Rust. Executing the above command installs `casper-client` globally on your system.*

### Generate Account Keys

In the working directory of your project, generate a keypair by running:

`casper-client keygen keys/`

This will generate keys and write them to the `keys` directory. If `keys` does not exist, `casper-client` will create the directory.

**Note:**

You can also create an account with [Casper Signer](https://chrome.google.com/webstore/detail/casperlabs-signer/djhndpllfiibmcdbnmaaahkhchcoijce), or use an account you've made previously. (Note that new versions of Casper Signer do not download the necessary public key when exporting accounts to files).

## Fund the Account with Test CSPR

To fund the test account, you'll first need to import your account in the Casper Signer.

To do this, open the Signer in your browser, unlock your vault with your password ([or set up a new vault](https://casper.network/docs/workflow/signer-guide#12-logging-in-to-the-casper-signer)).

Click **Import Account**. Name the imported account and click **Upload**. Select the *secret_key.pem* file in the aforementioned *keys* directory.

Import the account and select it as your current active account.

Visit the [testnet faucet](https://testnet.cspr.live/tools/faucet), sign in with Casper Signer, complete the captcha, and request your tokens.

After a moment, you're account will be credited 1000 CSPR.

**Note:**

*You can only request tokens once per account.*

## Edit the Deployment Script

Start by opening the file `index.js` in your preferred text editor or IDE.

We'll start by redefining our constants. These start on line `5` and should look like the following.

```javascript
const NAME = "Test Token";
const SYMBOL = "TST";
const PRECISION = 8;
const TOTAL_SUPPLY = 1_000_000_000;
const GAS_LIMIT = 60_000_000_000; //motes
const WASM_PATH = "./erc20_token.wasm";
const NODE_ADDRESS = "http://162.55.132.188:7777/rpc";
const NETWORK_NAME = "casper-test";
```

Let's take a look at what these constants refer to.

* `NAME`: The name of the ERC-20 contract.
* `SYMBOL`: The symbol of the ERC-20 contract.
* `PRECISION`: The number of decimal places the token can be fractionalized to.
* `TOTAL_SUPPLY`: The total supply of your ERC-20 token.
* `GAS_LIMIT`: The gas limit in motes that will be used to pay for the deployment
* `WASM_PATH`: The path to the compiled contract.
* `NODE_ADDRESS`: The address of the validator node to submit the deployment to. The address listed directs to a valid, online node, but this may change in the future. If this node does not respond, you can select another online peer from the list [here](https://testnet.cspr.live/tools/peers). Note that you'll need to replace the port with `7777` for most nodes, as well as will need to add `/rpc` to the end of the address.
* `NETWORK_NAME`: The name of the network to which you'll be deploying. By default, we have the Casper Testnet specified as `"casper-test"`. To deploy on the Mainnet, you may change this to `"casper"`.

As long as you generated the keys with the aforementioned command within your project's root folder, the paths to your keys should be the same as already written in the code. Otherwise you'll need to put in the alternate path to your keys here, on line `14`.

```javascript
const KEYS = Keys.Ed25519.parseKeyFiles(
  "./keys/public_key.pem",
  "./keys/secret_key.pem"
);
```

## Install the Contract

To install the contract, execute the following command:

`npm run erc20iface deploy`

If deployment succeeds, your last log line will tell you the name of the installed token.

`... Contract name: Test Token`

Your ERC-20 token contract is now successfully installed. Next we'll go about transferring tokens.

**Note:**

*For help, run `npm run erc20iface help`*

## Transfer Tokens

You can send ERC-20 compliant tokens on the Casper Network as per the ERC specification. We'll use the same  `erc20iface` script to execute the transfer deployments.

You will need an amount and a destination to execute a transferral. The amount corresponds to the number of tokens you want transferred, and the destination is the hexadecimal public key of the receiving account. Your command should look like this

`npm run erc20iface transfer 200 0166795bb8895dcec5631690fa3d5dd3daacde7efeefb1e79176e9d879fd669b47`

To send tokens from the address you just funded, just change the `KEYS` constant to use the path of that accounts public and secret keys (in this case account `0166795bb8895dcec5631690fa3d5dd3daacde7efeefb1e79176e9d879fd669b47`).

