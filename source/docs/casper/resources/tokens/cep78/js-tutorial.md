---
title: CEP-78 JavaScript Client
slug: /resources/tokens/cep78/js-tutorial
---

# CEP-78 JavaScript Client Tutorial

This tutorial outlines the usage of the JavaScript client available for the CEP-78 Enhanced NFT Standard.

Further information on the CEP-78 Enhanced NFT Standard can be found [here](https://github.com/casper-ecosystem/cep-78-enhanced-nft).

The client is available in *npm* as [casper-cep78-js-client](https://www.npmjs.com/package/casper-cep78-js-client).

## Client Installation

The client can be installed in a project you have built using TypeScript / Javascript.

To install run:

```js
npm install casper-cep78-js-client
```

## Installing a CEP-78 Contract using the JavaScript Client

The `install` method crafts a [Deploy](./deploy-and-deploy-lifecycle/) using `InstallArgs`.
As with every deploy created by the SDK, you can send it using the `.send(rpcUrl)` method providing the RPC URL that you want to use. It will return deployHash. 

```js

  const cc = new CEP78Client(process.env.NODE_URL!, process.env.NETWORK_NAME!);

  const installDeploy = await cc.install(
    {
      collectionName: "my-collection",
      collectionSymbol: "MY-NFTS",
      totalTokenSupply: "1000",
      ownershipMode: NFTOwnershipMode.Transferable,
      nftKind: NFTKind.Physical,
      jsonSchema: {
        properties: {
          color: { name: "color", description: "", required: true },
          size: { name: "size", description: "", required: true },
          material: { name: "material", description: "", required: true },
          condition: { name: "condition", description: "", required: false },
        },
      },
      nftMetadataKind: NFTMetadataKind.CustomValidated,
      identifierMode: NFTIdentifierMode.Ordinal,
      metadataMutability: MetadataMutability.Immutable,
      mintingMode: MintingMode.Installer,
      ownerReverseLookupMode: OwnerReverseLookupMode.Complete
    },
    "250000000000",
    FAUCET_KEYS.publicKey,
    [FAUCET_KEYS]
  );

  const hash = await installDeploy.send(process.env.http://localhost:11101/rpc);

```

`InstallArgs` are specified as follows:

* `collectionName` - The name of the NFT collection, passed in as a `String`. **This parameter is required and cannot be changed post installation**.

* `collectionSymbol` - The symbol representing a given NFT collection, passed in as a `String`. **This parameter is required and cannot be changed post installation**.

* `totalTokenSupply` - The total number of NFTs that a specific contract instance will mint passed in as a `U64` value. **This parameter is required and cannot be changed post installation**.

* `ownershipMode` - The `OwnershipMode` modality that dictates the ownership behavior of the NFT contract. This argument is passed in as a `u8` value and is required at the time of installation.

* `nftKind` - The `NFTKind` modality that specifies the off-chain items represented by the on-chain NFT data. This argument is passed in as a `u8` value and is required at the time of installation.

* `jsonSchema` - The JSON schema for the NFT tokens that will be minted by the NFT contract passed in as a `String`. More information on `NFTMetadataKind` can be found [here](./modalities.md#nftmetadatakind). This parameter may be left empty if metadata kind is set to `Raw(3)`. If the metadata kind is set to `CustomValidated(4)`, it will require a specifically formatted custom schema. This parameter **cannot be changed post installation**.

* `nftMetadataKind` - The metadata schema for the NFTs to be minted by the NFT contract. This argument is passed in as a `u8` value and is required at the time of installation.

* `identifierMode` - The `NFTIdentifierMode` modality dictates the primary identifier for NFTs minted by the contract. This argument is passed in as a `u8` value and is required at the time of installation.

* `metadataMutability` - The `MetadataMutability` modality dictates whether the metadata of minted NFTs can be updated. This argument is passed in as a `u8` value and is required at the time of installation.

* `mintingmode` - The `MintingMode` modality dictates the access to the `mint()` entry point in the NFT contract. This optional parameter will default to restricting access to the installer of the contract. **This parameter cannot be changed once the contract has been installed**.

* `holdermode` - The `NFTHolderMode` modality dictates which entities can hold NFTs. This optional parameter will default to a mixed mode, allowing either `Accounts` or `Contracts` to hold NFTs. **This parameter cannot be changed once the contract has been installed**.

* `burnMode` - The `BurnMode` modality dictates whether minted NFTs can be burned. This optional parameter will allow tokens to be burnt by default. **This parameter cannot be changed once the contract has been installed**.

* `ownerReverseLookupMode` - The `OwnerReverseLookupMode` dictates whether the contract will index ownership of tokens as outlined [here](./reverse-lookup.md#the-cep-78-page-system) to allow lookup of owned tokens by account. **This parameter cannot be changed once the contract has been installed**.

Further information on CEP-78 modality options can be found [here](./modalities.md).

## Minting a Token

The CEP-78 JS Client includes code to construct a deploy that will `Mint` a token, as follows:

```js

  const mintDeploy = cc.mint(
    {
      owner: FAUCET_KEYS.publicKey,
      meta: {
        color: "Blue",
        size: "Medium",
        material: "Aluminum",
        condition: "Used",
      },
    },
    { useSessionCode: true },
    "2000000000",
    FAUCET_KEYS.publicKey,
    [FAUCET_KEYS]
  );

  const mintDeployHash = await mintDeploy.send("http://localhost:11101/rpc");

```
The arguments adhere to those provided in the original installation, with the `.send()` pointing to a valid RPC URL on your target Casper network. In this instance, we are using an NCTL RPC URL.

In this example, the [`useSessionCode`](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/client-js/examples/usage.ts#L86-L88) variable decides if the user will call `mint` using session code, or not. It will be set to `true` if the `OwnerReverseLookupMode` is set to `Complete`. [It then registers the recipient with the contract](https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/client-js/examples/usage.ts#L116-L130) and mints the token.

If `OwnerReverseLookupMode` is set to `NoLookup`, `useSessionCode` will be set to `false` and it will simply mint the token as it does not need to register the recipient.

## Register Recipient 

As we used `ownerReverseLookupMode: OwnerReverseLookupMode.Complete` in this contract installation, we must register the recipient. To do this, we construct a `register` deploy:

```js

    const registerDeploy = cc.register(
      {
        tokenOwner: USER1_KEYS.publicKey,
      },
      "1000000000",
      USER1_KEYS.publicKey,
      [USER1_KEYS]
    );

    const registerDeployHash = await registerDeploy.send("http://localhost:11101/rpc");
    
```
    
## Transferring a Token

After minting one or more tokens, you can then use the following code to transfer the tokens between accounts:

```js

  const transferDeploy = cc.transfer(
    {
      tokenId: "0",
      source: FAUCET_KEYS.publicKey,
      target: USER1_KEYS.publicKey,
    },
    { useSessionCode: true },
    "13000000000",
    FAUCET_KEYS.publicKey,
    [FAUCET_KEYS]
  );

  const transferDeployHash = await transferDeploy.send("http://localhost:11101/rpc");

```

Transferring accepts the following arguments:

* `tokenId` - The sequential ID assigned to a token in mint order.

* `source` - The account sending the token in question.

* `target` - The account receiving the transferred token.

As above, the `useSessionCode` variable determines if the user will call `transfer` using session code based on the setting of `OwnerReverseLookupMode`.

## Burning a Token

The following code shows how to burn a minted NFT that you hold and have access rights to, requiring only the `tokenId` argument:

```js

  const burnDeploy = await contractClient.burn(
    { tokenId: "0" },
    "13000000000",
    USER1_KEYS.publicKey,
    [USER1_KEYS]
  );

  const burnDeployHash = await burnDeploy.send("http://localhost:11101/rpc");

```

## Example Usages

### Running an Install Example

This repository includes an example script for installing a CEP-78 contract instance.

You will need to define the following variables in the `.env` file:

* `NODE_URL` - The address of a node. If you are testing using [NCTL](./developers/dapps/setup-nctl), this will be `http://localhost:11101/rpc`.

* `NETWORK_NAME` - The name of the Casper network you are operating on, `casper-net-1` when testing using a local network with NCTL.

* `MASTER_KEY_PAIR_PATH` - The path to the key pair of the minting account.

* `USER1_KEY_PAIR_PATH` - The path to an additional account's key pair for use in testing transfer features.

You may also need to install associated dependencies using:

```js
npm i
```

This example can be run using the following command:

```js
npm run example:install
```

The example will then return the installation's `deployHash`, and inform you when the installation is successful.

The example will then provide the installing account's information, which will include the CEP-78 NFT contract's hash and package hash.


### Running a Usage Example

A usage example uses the same variables as the Install example above, but tests the basic functionality of the contract after installation.

The usage example can be run using the following command:

```js
npm run example:usage
```

This example will acquire the contract's hash and package hash, prior to sending three separate deploys to perform several function tests as follows:

* `Mint` - The example will attempt to mint an NFT using the installation account.

* `Transfer` - The example will transfer the previously minted NFT to a second account (USER1 as defined in the variables.)

* `Burn` - The example will burn the minted NFT.

The associated code for these deploys may be found in the `client-js/examples` directory.
