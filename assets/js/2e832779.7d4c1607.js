"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[3032],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),l=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=l(n),m=i,h=u["".concat(s,".").concat(m)]||u[m]||d[m]||r;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[u]="string"==typeof e?e:i,o[1]=c;for(var l=2;l<r;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6945:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return b},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return d}});var a=n(7462),i=n(3366),r=(n(7294),n(3905)),o=n(4996),c=["components"],s={},l="Using the JavaScript SDK",p={unversionedId:"resources/beginner/use-javascript-sdk",id:"resources/beginner/use-javascript-sdk",title:"Using the JavaScript SDK",description:"This tutorial shows you how to use the JavaScript SDK by connecting the Casper Signer to a website, get the balance of an account's main purse and send a Deploy.",source:"@site/source/docs/casper/resources/beginner/use-javascript-sdk.md",sourceDirName:"resources/beginner",slug:"/resources/beginner/use-javascript-sdk",permalink:"/resources/beginner/use-javascript-sdk",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/dev/source/docs/casper/resources/beginner/use-javascript-sdk.md",tags:[],version:"current",lastUpdatedAt:1693580435,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{}},u={},d=[{value:"Step 1. Run a Mini Webserver",id:"step-1-run-a-mini-webserver",level:2},{value:"Step 2. Create a Simple User Interface",id:"step-2-create-a-simple-user-interface",level:2},{value:"Step 3. Implement Some Functionality",id:"step-3-implement-some-functionality",level:2},{value:"Step 4. Get the Account Balance",id:"step-4-get-the-account-balance",level:2},{value:"Step 5. Sign and Send a Transaction",id:"step-5-sign-and-send-a-transaction",level:2},{value:"External links",id:"external-links",level:2}],m={toc:d},h="wrapper";function b(e){var t=e.components,n=(0,i.Z)(e,c);return(0,r.kt)(h,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"using-the-javascript-sdk"},"Using the JavaScript SDK"),(0,r.kt)("p",null,"This tutorial shows you how to use the JavaScript SDK by connecting the ",(0,r.kt)("a",{parentName:"p",href:"https://chrome.google.com/webstore/detail/casper-signer/djhndpllfiibmcdbnmaaahkhchcoijce"},"Casper Signer")," to a website, get the balance of an account's main purse and send a Deploy."),(0,r.kt)("h2",{id:"step-1-run-a-mini-webserver"},"Step 1. Run a Mini Webserver"),(0,r.kt)("p",null,"First, install the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/casper-ecosystem/casper-js-sdk"},"Casper JavaScript SDK")," and ",(0,r.kt)("a",{parentName:"p",href:"https://vitejs.dev/guide/"},"ViteJS")," to run a mini webserver. You will need the Casper JavaScript SDK to connect to a Casper node, retrieve information from the blockchain, and send transactions. ViteJS is a front-end build tool that helps bundle a JavaScript library and start a webserver."),(0,r.kt)("p",null,"Run this npm command to initialize a local server and configure it to use JavaScript:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"   npm init vite@latest\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Choose a project name"),(0,r.kt)("li",{parentName:"ul"},"Select the default framework"),(0,r.kt)("li",{parentName:"ul"},"Select the default variant")),(0,r.kt)("p",null,"Go to the project folder and install the necessary dependencies and the Casper JavaScript SDK:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"    cd <project>\n    npm install\n    npm install casper-js-sdk\n    npm run dev\n")),(0,r.kt)("h2",{id:"step-2-create-a-simple-user-interface"},"Step 2. Create a Simple User Interface"),(0,r.kt)("p",null,"Next, create a minimal user interface (UI) to interact with the Casper Signer. Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"index.html")," in the main folder and write the HTML code to create your UI elements. You can add buttons, fields for the user inputs needed to send transactions, and other elements. Here is the sample code:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<div id="app">\n    \x3c!-- The button to connect your website to the Casper Signer. --\x3e\n    <button id="btnConnect">Connect</button>\n\n    \x3c!-- The button to disconnect your website from the Casper Signer. --\x3e\n    <button id="btnDisconnect">Disconnect</button>\n\n    \x3c!-- The place where the public key will display. --\x3e\n    <h1 id="textAddress">PublicKeyHex</h1>\n\n    \x3c!-- The place where Balance will display. --\x3e\n    <h1 id="textBalance">Balance</h1>\n    <h1>Transer</h1>\n\n    \x3c!-- The amount to send in the transaction. --\x3e\n    \x3c!-- Minimal amount is 2.5 CSPR (1 CSPR = 1,000,000,000 motes)  --\x3e\n    <label for="Amount">Amount - min amount 25000000000</label>\n    <input id="Amount" type="number" />\n\n    \x3c!-- The public key that will receive the coins. --\x3e\n    <label for="Recipient">Recipient</label>\n    <input id="Recipient" type="text" />\n\n    \x3c!--The button that when clicked will send the transaction. --\x3e\n    <button id="btnSend">Send</button>\n\n    \x3c!--The ID of your transaction. --\x3e\n    <h1 id="tx"></h1>\n</div>\n')),(0,r.kt)("p",null,"Below is the UI created with the sample code above."),(0,r.kt)("img",{src:(0,o.Z)("/image/tutorials/signer/simple-app.png"),alt:"Image showing the web app UI",width:"500"}),(0,r.kt)("p",null,"After writing the HTML code, open the ",(0,r.kt)("inlineCode",{parentName:"p"},"main.js")," file. Import the ",(0,r.kt)("inlineCode",{parentName:"p"},"casper-js-sdk")," to create the client and the services necessary to get account information and send Deploys."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'import { CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil } from "casper-js-sdk";\n\n//Create Casper client and service to interact with Casper node.\nconst apiUrl = "<your casper node>";\nconst casperService = new CasperServiceByJsonRPC(apiUrl);\nconst casperClient = new CasperClient(apiUrl);\n')),(0,r.kt)("h2",{id:"step-3-implement-some-functionality"},"Step 3. Implement Some Functionality"),(0,r.kt)("p",null,"Now that we have the UI and the JS SDK, it's time to implement some functionality. In this example, we will interact with the Casper Signer."),(0,r.kt)("p",null,"First, we'll implement the functionality for the ",(0,r.kt)("inlineCode",{parentName:"p"},"Connect")," button:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'const btnConnect = document.getElementById("btnConnect");\nbtnConnect.addEventListener("click", async () => {\n    window.casperlabsHelper.requestConnection();\n});\n')),(0,r.kt)("p",null,"When clicking on the ",(0,r.kt)("inlineCode",{parentName:"p"},"Connect")," button, the Signer will open a pop-up window."),(0,r.kt)("img",{src:(0,o.Z)("/image/tutorials/signer/casper-connect.png"),alt:"Image showing the connect button",width:"500"}),(0,r.kt)("p",null,"Follow the UI prompts to connect the website to the Signer."),(0,r.kt)("p",null,"Next, implement the functionality for the ",(0,r.kt)("inlineCode",{parentName:"p"},"Disconnect")," button:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'const btnDisconnect = document.getElementById("btnDisconnect");\nbtnDisconnect.addEventListener("click", () => {\n    window.casperlabsHelper.disconnectFromSite();\n});\n')),(0,r.kt)("h2",{id:"step-4-get-the-account-balance"},"Step 4. Get the Account Balance"),(0,r.kt)("p",null,"In this section, we will retrieve account information using the public key of an account. Let's write the function to get basic account information, like the account's public key and balance."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"async function AccountInformation() {\n    const isConnected = await window.casperlabsHelper.isConnected();\n    if (isConnected) {\n        const publicKey = await window.casperlabsHelper.getActivePublicKey();\n        textAddress.textContent = `PublicKeyHex ${publicKey}`;\n\n        const root = await casperService.getStateRootHash();\n\n        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(root, CLPublicKey.fromHex(publicKey));\n\n        // Account purse balance from the last block\n        const balance = await casperService.getAccountBalance(root, balanceUref);\n        textBalance.textContent = `Balance ${balance.toString()}`;\n    }\n}\n")),(0,r.kt)("p",null,"Add the ",(0,r.kt)("inlineCode",{parentName:"p"},"AccountInformation")," function inside the ",(0,r.kt)("inlineCode",{parentName:"p"},"btnConnect")," to display the information when connecting into an account:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'const btnConnect = document.getElementById("btnConnect");\nbtnConnect.addEventListener("click", async () => {\n    window.casperlabsHelper.requestConnection();\n    await AccountInformation();\n});\n')),(0,r.kt)("p",null,"Using the Signer window, select the account you wish to display in the web app. Once selected, the account public key and balance should be displayed like this:"),(0,r.kt)("img",{src:(0,o.Z)("/image/tutorials/signer/casper-signer-balance.png"),alt:"Image showing account balance",width:"800"}),(0,r.kt)("h2",{id:"step-5-sign-and-send-a-transaction"},"Step 5. Sign and Send a Transaction"),(0,r.kt)("p",null,"With the Signer connected to the website, it is possible to sign a transaction. The Casper Signer will not send the transaction but only sign the transaction using your account keys. Your application will need to send the transaction after the Signer signs it with the following code:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'async function sendTransaction() {\n    // get the recipient\'s public key from input.\n    const to = document.getElementById("Recipient").value;\n    // get amount to send from input.\n    const amount = document.getElementById("Amount").value;\n    // For native-transfers the payment price is fixed.\n    const paymentAmount = 100000000;\n\n    // transfer_id field in the request to tag the transaction and to correlate it to your back-end storage.\n    const id = 287821;\n\n    // gasPrice for native transfers can be set to 1.\n    const gasPrice = 1;\n\n    // Time that the deploy will remain valid for, in milliseconds\n    // The default value is 1800000 ms (30 minutes).\n    const ttl = 1800000;\n    const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();\n    const publicKey = CLPublicKey.fromHex(publicKeyHex);\n\n    let deployParams = new DeployUtil.DeployParams(publicKey, "casper-test", gasPrice, ttl);\n\n    // We create a hex representation of the public key with an added prefix.\n    const toPublicKey = CLPublicKey.fromHex(to);\n\n    const session = DeployUtil.ExecutableDeployItem.newTransfer(amount, toPublicKey, null, id);\n\n    const payment = DeployUtil.standardPayment(paymentAmount);\n    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);\n\n    // Turn your transaction data to format JSON\n    const json = DeployUtil.deployToJson(deploy);\n\n    // Sign transcation using casper-signer.\n    const signature = await window.casperlabsHelper.sign(json, publicKeyHex, to);\n    const deployObject = DeployUtil.deployFromJson(signature);\n\n    // Here we are sending the signed deploy.\n    const signed = await casperClient.putDeploy(deployObject.val);\n\n    // Display transaction address\n    const tx = document.getElementById("tx");\n    tx.textContent = `tx: ${signed}`;\n}\n\nconst btnSend = document.getElementById("btnSend");\nbtnSend.addEventListener("click", async () => await sendTransaction());\n')),(0,r.kt)("h2",{id:"external-links"},"External links"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The ",(0,r.kt)("a",{parentName:"li",href:"https://vitejs.dev/guide/"},"Vite JavaScript guide")),(0,r.kt)("li",{parentName:"ul"},"The ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/casper-ecosystem/casper-js-sdk"},"Casper Java SDK")," source code"),(0,r.kt)("li",{parentName:"ul"},"The ",(0,r.kt)("a",{parentName:"li",href:"https://docs.cspr.community/docs/user-guides/SignerGuide.html"},"Casper Signer user guide"))))}b.isMDXComponent=!0}}]);