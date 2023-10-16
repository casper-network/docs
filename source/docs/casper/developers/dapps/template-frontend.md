---
title: Front-end in React
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Front-end Template with React

For building web applications, it is most common to use the Casper JS SDK with React. This is a popular solution among developers, but you may use any front-end library or framework, including none at all, to interact with a Casper network via the [Casper JS SDK](https://github.com/casper-ecosystem/casper-js-sdk).

This guide will walk you through setting up and developing a React application with [Vite](https://vitejs.dev/) that communicates with a Casper network. Experience with Vite is not required; however, if you have never built a React app, you should begin by [reading the React documentation](https://reactjs.org/docs/getting-started.html).

## Get Started

Begin by opening a terminal and running:

```bash
node -v
```

To get your Node.js version.

To ensure compatibility, you should be running Node.js version 18 or above. Upgrade to version 18 using the [Node Version Manager](https://github.com/nvm-sh/nvm) or another tool if you are running an earlier version.

Using [npm](https://www.npmjs.com/), create a new Vite project by running:

```bash
npm install -g vite
npm create vite@latest
```

Name your project, select "React", then choose your preferred language. In this example, we will use JavaScript.

Head into your new project directory, replacing `vite-project` with your project name:

```bash
cd vite-project/
```


Run the following command to test the server:

```bash
npm install
vite dev
```


Quit the server by pressing `q`. Install the Casper JS SDK by running the following:

```bash
npm install casper-js-sdk
```

This guide will use [axios](https://axios-http.com/) to communicate with the backend; install it by running:

```bash
npm install axios
```

## Casper Wallet Integration

The Casper Wallet extension content script injects the SDK into your website's global scope. Provider class and event types can be accessed with `window.CasperWalletProvider` and `window.CasperWalletEventTypes`. If the value of these variables is `undefined` the Casper Wallet is not installed.


Start with a helper for getting the provider instance:

```bash
touch src/casper-wallet.js
```

Fill the file with the following content:

```js
// Timeout (in ms) for requests to the extension [DEFAULT: 30 min]
const REQUESTS_TIMEOUT_MS = 30 * 60 * 1000;

export const getProvider = () => {
    let providerConstructor = window.CasperWalletProvider;
    if (providerConstructor === undefined) {
        alert("Casper Wallet extension is not installed!");
        return;
    }
    let provider = providerConstructor({
        timeout: REQUESTS_TIMEOUT_MS
    });
    return provider;
}

```

:::tip

For complete integration details, refer to [README of Casper Wallet SDK](https://github.com/make-software/casper-wallet-sdk/#readme).

:::

To ensure that a user's public key will be available to all necessary components, create a React state variable in *src/App.jsx* or another parent component that encapsulates the components that should have access to this public key:

```jsx
import React from "react";
import Connect from "./Connect";
import './App.css'

function App() {
    const [publicKey, setPublicKey] = React.useState(null);
    return (
        <>
            <Connect setPublicKey={ setPublicKey } />
            <div>
                {publicKey !== null && (<>
                    Wallet connected: {publicKey}<br/>
                </>)}
            </div>
        </>
    );
}

export default App;
```

This is an example of *src/App.jsx* that imports and displays the `Connect` component that is described next. The `setPublicKey` function is passed to the `Connect` component as a [prop](https://legacy.reactjs.org/docs/components-and-props.html) so that it may set the public key and make it available to all of *src/App.jsx*. This way, when more components are added to *src/App.jsx*, they may utilize the `publicKey` variable.

To connect to the Casper Wallet within your React app, create the `Connect` component and import the `getProvider` helper.

```bash
touch src/Connect.jsx
```

Open the file and write:

```jsx
import { getProvider } from "./casper-wallet";

const provider = getProvider();

const Connect = (props) => {
    return (
        <>
            <button onClick={ () => connectToWallet(props) }>Connect Wallet</button>
            {/* Place for disconnect button */}
        </>
    );
}

export default Connect;
```

Notice that `Connect` accepts props, and forwards them to the `connectToWallet` function described below. This function is called when the button is clicked, allowing it to set the public key within *src/App.jsx* using `props.setPublicKey()`.

Write the `connectToWallet` function under the `Connect` function component:

```javascript
const connectToWallet = (props) => {
    provider.requestConnection().then(connected => {
        if (!connected) {
            alert("Couldn't connect to wallet");
        } else {
            provider.getActivePublicKey().then(publicKey => {
                props.setPublicKey(publicKey);
            }).catch(error => {
                alert(error.message);
            });
        }
    })
    .catch(error => {
        alert(error.message);
    });
}
```

The `connectToWallet()` function calls `provider.isConnected()` to check if the Casper Wallet is already connected. If it is, it gets the public key of the selected account; if it's not, it opens up a connection request within the Wallet. `provider.isConnected()` will throw an error if the Wallet is not installed as an extension or if it is locked.

### Disconnect the Casper Wallet

To request that the Casper Wallet disconnect from a website, add the following function call to *src/Connect.jsx*:

```javascript
const disconnect = (props) => {
    provider.disconnectFromSite().then(disconnected => {
        if (disconnected) {
            props.setPublicKey(null);
            alert("Disconnected");
        } 
    }).catch(error => {
        alert(error.message);
    });
}
```

Then connect it to a button:

```jsx
const Connect = (props) => {
    return (
        <>
            <button onClick={ () => connectToWallet(props) }>Connect Wallet</button>
            // highlight-next-line-green
            <button onClick={ () => disconnect(props) }>Disconnect</button>
        </>
    );
}
```

## Call a Smart Contract

For this example, we'll call a hypothetical "hello world" contract containing a single entrypoint "update_message". We'll call the "update_message" entrypoint with text entered by the user in an HTML `input` field.

When calling smart contracts from React, you'll need to implement the logic within a function accessible from a React component. You can obtain user-entered data from the DOM using elements like `input`, then grab the value within the smart-contract-calling function.

Create a new component:

```bash
touch src/UpdateMessage.jsx
```

Open the file and write:

```jsx
import { useState } from 'react';
import { Contracts, CasperClient, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil } from "casper-js-sdk";
import axios from "axios";
import { getProvider } from "./casper-wallet";

const provider = getProvider();

const UpdateMessage = (props) => {
    const [message, setMessage] = useState("");

    return (
        <>
            <input id="message" type="text" value={message} onChange={(e) => {setMessage(e.target.value)}} />
            <button onClick={ () => updateMessage(props, message) }>Update Message</button>
        </>
    );
}

export default UpdateMessage;
```

On the front-end you'll need to build the deploy and forward it to the Casper Wallet to be signed. In most cases, you will be calling smart contract entrypoints. This example deploy shows the calling of entrypoint "update_message" which will update the chain's global state to reflect the new data. You'll need the user's active public key to prepare the deploy, and you may retrieve this from the `publicKey` variable passed in as a prop from `src/App.jsx`. Write this function under your `UpdateMessage` component function.

```javascript
const NODE_URL = "http://65.108.127.242:7777/rpc";
const NETWORK_NAME = "casper-test"; // "casper" for mainnet
const CONTRACT_HASH = "hash-75143aa708275b7dead20ac2cc06c1c3eccff4ffcf1eb9aebb8cce7c35cea041";

const updateMessage = (props, message) => {
    const casperClient = new CasperClient(NODE_URL);
    const contract = new Contracts.Contract(casperClient);
    contract.setContractHash(CONTRACT_HASH);
    const runtimeArguments = RuntimeArgs.fromMap({
        "message": CLValueBuilder.string(message)
    });
    const deploy = contract.callEntrypoint(
        "update_message",
        runtimeArguments,
        CLPublicKey.fromHex(props.publicKey),
        NETWORK_NAME,
        "1000000000", // 1 CSPR (10^9 Motes)
    );
    const deployJSON = DeployUtil.deployToJson(deploy);
    provider.sign(JSON.stringify(deployJSON), props.publicKey).then((signedDeploy) => { // Initiates sign request
        axios.post("/sendDeploy", signedDeploy, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            alert(response.data);
        }).catch((error) => {
            console.error(error.message);
        });
    }).catch((error) => {
        console.error(error.message);
    });
}
```

In this example, `updateMessage` builds a deploy and forwards it to the Casper Wallet to be signed by the user. Once it's been signed, `signedDeploy` is forwarded to the backend at the `/sendDeploy` endpoint using `axios.post` before being sent off to a Casper node. If an error occurs, or the user rejects the signature request, it will be logged to `stderr`. In this particular example, the result of this deployment will be presented to the user in the form of a JavaScript [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert); however, you may do with the response data as you wish.

:::info

The backend endpoint `/sendDeploy` should handle signed deployment by simply passing it to a Casper node.

In Casper node `v1.5.0`, which sets up appropriate CORS headers, it will also be possible to send deployments directly from the browser, without relying on a backend server. This is useful for prototyping, however it is advised that you operate your own node.

:::

Now that this component is created, render it to the user interface in *src/App.jsx*, passing along the `publicKey` as a prop:

```jsx
import React from "react";
import Connect from "./Connect";
// highlight-next-line-green
import UpdateMessage from "./UpdateMessage";
import './App.css'

function App() {
    const [publicKey, setPublicKey] = React.useState(null);
    return (
        <>
            <Connect setPublicKey={ setPublicKey } />
            <div>
                {publicKey !== null && (<>
                    Wallet connected: {publicKey}<br/>
                    // highlight-next-line-green
                    <UpdateMessage publicKey={ publicKey } />
                </>)}
            </div>
        </>
    );
}
```

## Query a Smart Contract

Consider that the message written to the chain during the `update_message` entrypoint invocation is stored in the [dictionary](../../concepts/glossary/D.md#dictionary) `messages` in the contract. Further consider that each account may write its own message and that the messages are stored under the account's [account hash](../../concepts/glossary/A.md#account-hash) as the dictionary key. Querying this kind of data is essential in any dApp; here is how to communicate contract data to and from the front-end.

Create a new component:

```bash
touch src/Query.jsx
```

Open the file and write:

```jsx
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";

const Query = (props) => {
  return <button onClick={ () => query(props) }>Query</button>;
}

const query = (props) => {
  const accountHash = CLPublicKey.fromHex(props.publicKey).toAccountHashStr().substring(13);
  axios.get("/queryMessage?accountHash=" + accountHash).then((response) => {
    alert(response.data)
  }).catch((error) => {
    console.error(error.message);
  });
}

export default Query;
```

All this component does is render an HTML `button` element that, when pressed, performs a `GET` request to the backend that includes the user's active account hash. The account hash is derived from the active public key, and is used to look up the message stored by the current user.

:::tip

The `toAccountHashStr` method produces a string that is prepended by the text "account-hash-". In this case, this text is not needed, so it is discarded by chaining on the `substring(13)` method.

:::

:::info

This functionality relies on the `/queryMessage` endpoint, which should be implemented in your backend.

:::

Now add this component to *src/App.jsx*, making available the `publicKey` state variable via a prop:

```jsx
import React from "react";
import Connect from "./Connect";
import UpdateMessage from "./UpdateMessage";
// highlight-next-line-green
import Query from "./Query";
import './App.css'

function App() {
    const [publicKey, setPublicKey] = React.useState(null);
    return (
        <>
            <Connect setPublicKey={ setPublicKey } />
            <div>
                {publicKey !== null && (<>
                    Wallet connected: {publicKey}<br/>
                    <UpdateMessage publicKey={ publicKey } />
                    // highlight-next-line-green
                    <Query publicKey={ publicKey } />
                </>)}
            </div>
        </>
    );
}
```

## Test Application

Test your application by running the following:

```bash
vite dev
```

Your application will start locally, and a URL will be shown where you can visit your application. Alternatively, press `h`, then `o` to open the app in a browser.

## Build for Production

When you're ready to release your application, you'll want to compile it to pure JavaScript and serve it from a web server. Do so by running:

```bash
vite build
```

Once this is complete, you can preview your production build by running:

```bash
vite preview
```
