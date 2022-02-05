import useBaseUrl from '@docusaurus/useBaseUrl';

# Casper Signer Developer Guide

## Introduction

This guide aims to describe the essential functionality you need to create a deploy on the Casper Network with the [Casper JavaScript SDK](https://github.com/casper-ecosystem/casper-js-sdk/) and sign it with the [Casper Signer](https://casper.network/docs/workflow/signer-guide).

New sites integrated with the Signer need to go through an approval process. You need to [submit a request](https://github.com/casper-ecosystem/signer/issues/new?assignees=George-cl&labels=Integration&template=whitelisting_request.yml&title=%5BIntegration%5D%3A+Name+of+Your+Project) to connect to the Casper Mainnet.

## Installing the Demo Application

To demonstrate a simple deploy signed with the Signer, we provide a [Signer Demo](https://github.com/George-cl/Signer-Demo) application, which you can also [install and run](https://github.com/George-cl/Signer-Demo#get-started). Next, we will discuss the key parts of this demo that you might reuse when integrating your website with the Signer.

:::note

Always check [GitHub](https://github.com/George-cl/Signer-Demo) for the latest and full code implementation. This tutorial is a general guide and uses code samples, which may not work if copied.

:::

<img src={useBaseUrl("/image/workflow/signer-demo/signer-demo-intro.png")} width="400" />

## Connecting to the Signer

When the Signer Demo loads, it generates a [casperService](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L77) object of type *CasperServiceByJsonRPC*, which accepts a URL. We use a mock URL in the demo because we are not tying the app to the blockchain. But, in your case, you would specify the URL of your application. 

When connecting your application with the Signer, you can expect the Signer window to open and behave as described in the [Signer Guide](https://casper.network/docs/workflow/signer-guide).

```javascript

this.casperService = new CasperServiceByJsonRPC('Signer-Demo-url')

```

To connect, call the [sendConnectionRequest](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L195) method to attempt the connection.

```javascript

async connectToSigner() {
    return Signer.sendConnectionRequest();
  }

```

<img src={useBaseUrl("/image/workflow/signer-demo/signer-demo-connect.png")} />

## Creating a Deploy

The Casper JavaScript SDK provides utility functions in the *DeployUtil* library.

You can now create a [simple transfer deploy](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L198-L217) using the Casper JavaScript SDK.

```javascript

let sessionCode = DeployUtil.ExecutableDeployItem.newTransfer(
      200,
      publicKey,
      null,
      this.state.transferTag
    )

```

The demo creates a deploy using the *makeDeploy* function in *DeployUtil*. The code specifies the chain name as *Signer-Demo-Chain*; this is where you need to update it for your purpose.

```javascript

return DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        publicKey,
        "Signer-Demo-Chain"
      ),
      sessionCode,
      DeployUtil.standardPayment(100000000000)
    );

```

To demonstrate how you could work with user input, look at [the code](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L504-L511) adding a transferTag to the deploy. Below is a sample, but you can see the full implementation [here](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L504-L511).

```javascript

value={this.state.deployType === 'transfer' ? this.state.transferTag : this.state.message}
              
```

## Signing Deploys

Once you create your deploy object, you will need to [sign](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/utils.js#L48) it by accomplishing these steps:

1. [Retrieve the account information](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/utils.js#L49-L54) by specifying its public key.
2. Make sure that the account signing [matches the signing key](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L403-L415).
3. Create the deploy using the key that we get from the Signer.
4. [Sign the deploy](https://github.com/George-cl/Signer-Demo/blob/af65348895eb0827bb9025dd29a6c9e576629579/src/SignerDemo.js#L352-L367) using the *Signer.sign* method, which takes a deploy and the key with which you want to sign the deploy.
5. Validate the deploy, then sign it using the *DeployUtil.setSignature* method based on the return value from *Signer.sign*.
6. Finally, use the *casperservice* from the JS SDK to deploy the signed deploy.

Your active key can sign deploys with the Casper Signer. Once you trigger the signing functionality, you can expect the Signer to behave as described [here](https://github.com/George-cl/Signer-Demo#signing-process).

<img src={useBaseUrl("/image/workflow/signer-demo/signer-demo-signed-deploy.png")} width="600" />

### Viewing Deploy Details

The JavaScript SDK also allows you to view a deploy's full details in JSON format.

<!-- TODO update screenshot to include id and approvals. Then move it to the end of this section. -->

<img src={useBaseUrl("/image/workflow/signer-demo/signer-demo-raw-json.png")} width="600"  />

Under *session*, you will the deploy details:

1. `amount` - The number of motes to be transferred
2. `target` - The recipient purse
3. `id` - The tag we have added as user input

Bellow the *session* object, you will notice the *approvals* section, in which you will see the signature added by the Signer.


## Summary

We hope that now you have all the ingredients to create your deploys and sign them, thus integrating your application with the Casper Signer and the Casper Network.
