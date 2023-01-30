# Using the JavaScript SDK

import useBaseUrl from '@docusaurus/useBaseUrl';

This tutorial shows you how to use the JavaScript SDK by connecting the [Casper Signer](https://chrome.google.com/webstore/detail/casper-signer/djhndpllfiibmcdbnmaaahkhchcoijce) to a website, get the balance of an account and send a transaction.

## Step 1. Run a Mini Webserver

First, install the [Casper JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk) and [ViteJS](https://vitejs.dev/guide/) to run a mini webserver. You will need the Casper JavaScript SDK to connect to a Casper node, retrieve information from the blockchain, and send transactions. ViteJS is a front-end build tool that helps bundle a JavaScript library and start a webserver. 

Run this npm command to initialize a local server and configure it to use JavaScript:

```bash
   npm init vite@latest
```

- Choose a project name
- Select the default framework
- Select the default variant

Go to the project folder and install the necessary dependencies and the Casper JavaScript SDK:

```bash
	cd <project>
	npm install
	npm install casper-js-sdk
	npm run dev
```

## Step 2. Create a Simple User Interface 

Next, create a minimal user interface (UI) to interact with the Casper Signer. Open the `index.html` in the main folder and write the HTML code to create your UI elements. You can add buttons, fields for the user inputs needed to send transactions, and other elements. Here is the sample code:

```html
	<div id="app">

	<!-- The button to connect your website to the Casper Signer. -->
	<button id="btnConnect" >Connect</button>

	<!-- The button to disconnect your website from the Casper Signer. -->
	<button id="btnDisconnect" >Disconnect</button>

	<!-- The place where the public key will display. -->
	<h1 id="textAddress">PublicKeyHex </h1>

	<!-- The place where Balance will display. -->
	<h1 id="textBalance">Balance </h1>
	<h1>Transer</h1>

	<!-- The amount to send in the transaction. -->
	<!-- Minimal amount is 2.5CSPR so 2.5 * 10000 (1CSPR = 10.000 motes)  -->
	<label for="Amount">Amount - min amount 25000000000</label>
	<input id="Amount" type="number">

	<!-- The address that will receive the coins. -->
	<label for="Recipient">Recipient</label>
	<input id="Recipient" type="text">

	<!--The button that when clicked will send the transaction. -->
	<button id="btnSend" >Send</button>

	<!--The address of your transaction. -->
	<h1 id="tx"></h1>
	</div>
```

Below is the UI created with the sample code above.

<img src={useBaseUrl("/image/tutorials/signer/simple-app.png")} alt="Image showing the web app UI" width="500"/>

After writing the HTML code, open the `main.js` file. Import the `casper-js-sdk` to create the client and the services necessary to get account information and send transactions.

```javascript
	import {CasperClient,CasperServiceByJsonRPC, CLPublicKey,DeployUtil } from "casper-js-sdk";

	//Create Casper client and service to interact with Casper node.
	const apiUrl = '<your casper node>';
	const casperService = new CasperServiceByJsonRPC(apiUrl);
	const casperClient = new CasperClient(apiUrl);
```

## Step 3. Implement Some Functionality

Now that we have the UI and the JS SDK, it's time to implement some functionality. In this example, we will interact with the Casper Signer.

First, we'll implement the functionality for the `Connect` button:

```javascript
	const btnConnect = document.getElementById("btnConnect");
	btnConnect.addEventListener("click", async () => {
		window.casperlabsHelper.requestConnection();
	})
```

When clicking on the `Connect` button, the Signer will open a pop-up window. 

<img src={useBaseUrl("/image/tutorials/signer/casper-connect.png")} alt="Image showing the connect button" width="500"/> 

Follow the UI prompts to connect the website to the Signer.

Next, implement the functionality for the `Disconnect` button:

```javascript
	const btnDisconnect = document.getElementById("btnDisconnect");
	btnDisconnect.addEventListener("click", () => {
		window.casperlabsHelper.disconnectFromSite();
	})
```

## Step 4. Get the Account Balance

In this section, we will retrieve account information using the public key of an account. Let's write the function to get basic account information, like the account's public key and balance.

```javascript
	async function AccountInformation(){
		const isConnected = await window.casperlabsHelper.isConnected()
		if(isConnected){
			const publicKey = await window.casperlabsHelper.getActivePublicKey();
			textAddress.textContent = `PublicKeyHex ${publicKey}`;

			const root = await casperService.getStateRootHash();

			const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
				root, 
				CLPublicKey.fromHex(publicKey)
				)

			//account balance from the last block
			const balance = await casperService.getAccountBalance(
				root,
				balanceUref
			);
			textBalance.textContent = `Balance ${balance.toString()}`;
		}
	}
```

Add the `AccountInformation` function inside the `btnConnect` to display the information when connecting into an account:

```javascript
	const btnConnect = document.getElementById("btnConnect");
	btnConnect.addEventListener("click", async () => {
	window.casperlabsHelper.requestConnection();
		await AccountInformation();
	})
``` 

Using the Signer window, select the account you wish to display in the web app. Once selected, the account public key hex and balance should be displayed like this:

<img src={useBaseUrl("/image/tutorials/signer/casper-signer-balance.png")} alt="Image showing account balance" width="800"/>

## Step 5. Sign and Send a Transaction

With the Signer connected to the website, it is possible to sign a transaction. The Casper Signer will not send the transaction but only sign the transaction using your account keys. Your application will need to send the transaction after the Signer signs it with the following code:

```javascript
	async function sendTransaction(){
	// get address to send from input.
	const to = document.getElementById("Recipient").value;
	// get amount to send from input.
	const amount = document.getElementById("Amount").value
	// For native-transfers the payment price is fixed.
	const paymentAmount = 100000000;

	// transfer_id field in the request to tag the transaction and to correlate it to your back-end storage.
	const id = 287821;

	// gasPrice for native transfers can be set to 1.
	const gasPrice = 1;

	// Time that the deploy will remain valid for, in milliseconds
	// The default value is 1800000 ms (30 minutes).
	const ttl = 1800000;
	const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
	const publicKey = CLPublicKey.fromHex(publicKeyHex)

	let deployParams = new DeployUtil.DeployParams(publicKey,"casper-test",gasPrice,ttl );
	
	// We create a public key from account-address (it is the hex representation of the public-key with an added prefix).
	const toPublicKey = CLPublicKey.fromHex(to);

	const session = DeployUtil.ExecutableDeployItem.newTransfer( amount,toPublicKey,null,id);
	
	const payment = DeployUtil.standardPayment(paymentAmount);
	const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
	
	// Turn your transaction data to format JSON
	const json = DeployUtil.deployToJson(deploy)
	
	// Sign transcation using casper-signer.
	const signature = await window.casperlabsHelper.sign(json,publicKeyHex,to)
	const deployObject = DeployUtil.deployFromJson(signature)
	
	// Here we are sending the signed deploy.
	const signed = await casperClient.putDeploy(deployObject.val);
	
	// Display transaction address
	const tx = document.getElementById("tx")
	tx.textContent = `tx: ${signed}`
	}

	const btnSend = document.getElementById("btnSend")
	btnSend.addEventListener("click",async () => await sendTransaction())
```

## External links

* The [Vite JavaScript guide](https://vitejs.dev/guide/)
* The [Casper Java SDK](https://github.com/casper-ecosystem/casper-js-sdk)  source code
* The [Casper Signer user guide](https://docs.cspr.community/docs/user-guides/SignerGuide.html)
