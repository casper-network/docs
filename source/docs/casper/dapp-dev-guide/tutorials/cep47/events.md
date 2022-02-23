# Deploying Token Events
import useBaseUrl from '@docusaurus/useBaseUrl';

CEP-47 contract contains a set of event implementations for token management. These events occur when contract tries to communicate with dapps and other smart contracts. The developers of the smart contract will decide when these events should be emitted and with what types of parameters.

There are 7 main event implementations for the Casper CEP-47 token contract. Those are:
- Mint
- Burn
- Mint Copies
- Transfer
- Approve
- Transfer From
- Update Metadata

We will go through each one with examples in the next sections. 

**Pre-requisite**

Make sure you have [installed the CEP-47 contract](../cep47/deploy) on the Casper network, before moving to the event deployment.

## Deploying the CEP-47 Event Stream
To deploy the event stream, you have to  run the `casper-contracts-js-clients/e2e/cep47/usage.ts` file using node js. It will execute the methods related to the CEP-47 event stream.

This is the command to run the file:
```bash
npm run e2e:cep47:usage
```

You will see the output as below:

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/cep47-event-install.png")} alt="cep47-event-install" width="800"/>

This will first get the account information, next, get the event stream using EVENT_STREAM_ADDRESS and subscribe to that event stream before checking each event. Also, you can see a set of token details on the console output.


### Mint Process

Mint process converts a probable non-fungible item into an NFT. The Casper virtual machine executes the code stored in the smart contract and maps the item to a token on the blockchain which contains certain attributes known as metadata. The creator's public key serves as a certificate of authenticity for that particular NFT.

#### Executing mint() method

Mint method requires input parameters like recipient address, token id, token metadata, payment amount to generate the CEP-47 token. Below code snippet will execute when calling the [mint()](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L123-L130) method. 

```javascript
const mintDeploy = await cep47.mint(
    KEYS.publicKey,
    ["1"],
    [new Map([['number', 'one']])],
    MINT_ONE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );
```

The list of input parameters is hardcoded or taken from the .env.cep47 file. This method will execute those parameters and generate the deploy object as `mintDeploy`. Then that deploy object is sent to the Casper Testnet via the node address to get the `mintDeployHash`. The console will output the deploy hash, name of the event, CL values, and the token mint successful message.

- In this specific example token id 1 is minted with 'number' and 'one' metadata.

#### Check account balance
After minting the token id 1, you can check the balance of tokens assigned to a specific public key using the balanceOf() function. This function will return the number of tokens stored in this account.

```javascript
const balanceOf1 = await cep47.balanceOf(KEYS.publicKey);
```
#### Check owner of the token
Then you can check the owner of the token by calling the getOwnerOf() method. This method takes the token id as the input parameter and returns the prefixed (account-hash-) account hash of the account owning this specific token. 

```javascript
const ownerOfTokenOne = await cep47.getOwnerOf("1");
```

#### Check token metadata and index
You can also check the details of token metadata, index of the token and token id of certain index using below methods.

```javascript
const tokenOneMeta = await cep47.getTokenMeta("1");
```

```javascript
const indexByToken1 = await cep47.getIndexByToken(KEYS.publicKey, "1");
```

```javascript
const tokenByIndex1 = await cep47.getTokenByIndex(KEYS.publicKey, indexByToken1);
```

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/mint.png")} alt="token-minting" width="800"/>


### Burn Process
Token burning process permanently removes the tokens from circulation within the blockchain network. The tokens are sent to a wallet address called "burner" or "eater" that cannot be used for transactions other than receiving the tokens. Even though the tokens will still exist on the blockchain, there will be no way of accessing them. 

#### Executing burn() method
Below code snippet will execute when calling the [mint()](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L123-L130) method.

```javascript
const burnDeploy = await cep47.burn(
    KEYS.publicKey,
    ["1"],
    MINT_ONE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );
```

Method will execute the input parameters and generate the deploy object as `burnDeploy` object and it is sent to the Casper Testnet via the node address to get the `burndeplyHash`. The console will output the deploy hash, name of the event and CL values, and the token mint successful message.

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/burn.png")} alt="token-burning" width="800"/>

### Mint Copies Process
Mint copies will create several tokens with different ids but with the same metadata. It process is the same as minting one token but with multiple ids and metadata. The payment amount also changes accordingly.
Minting token copies 

#### Executing mintCopies() method
Below code snippet will execute when calling the [mintCopies](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L187-L195) method.

```javascript
const mintCopiesDeploy = await cep47.mintCopies(
    KEYS.publicKey,
    ["2", "3", "4", "5"],
    new Map([['number', 'from-series']]),
    4,
    MINT_COPIES_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );
```
This method takes multiple token ids and token metadata, count of the tokens, and other general input parameters to generate the `mintCopiesDeploy` object. This will output a list of minted tokens. Since it is a series of tokens, we will check the token balance, owner of tokens, token metadata, and index details of those tokens.

#### Checking the balance
This method will check the balance of tokens in master account:
```javascript
 const balanceOf2 = await cep47.balanceOf(KEYS.publicKey);
```

#### Checking the owner
This method will check the owner of token id 5:
```javascript
let ownerOfTokenFive = await cep47.getOwnerOf("5");
```

#### Checking token metadata
This method will check the metadata of token id 5,
```javascript
const tokenFiveMeta = await cep47.getTokenMeta("5");
```

#### Checking the index 
This method will check the index of token id 5,
```javascript
const indexByToken5 = await cep47.getIndexByToken(KEYS.publicKey, "5");
```

#### Checking the token id 
This method will check the id of the token 5,
```javascript
 const tokenByIndex5 = await cep47.getTokenByIndex(KEYS.publicKey, indexByToken5);
```
*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/mintCopies.png")} alt="token-mint-copies" width="800"/>

### Transfer Process
This method enables the NFT token transferring to other accounts. Transfer process will initiate from your account address and sent to the selected recipient address. The recipient address will be a randomly selected account hash for this example.

#### Executing transfer() method

Below code snippet will execute when calling the [transfer](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L234-L235) method.


Create the recipient address from random number and assign it to `transferOneRecipient`.
```javascript
const transferOneRecipient = CLPublicKey.fromHex("016e5ee177b4008a538d5c9df7f8beb392a890a06418e5b9729231b077df9d7215");
```

Use the token id 2 and `transferOneRecipient` address along with other input parameters to generate the `transferOneDeploy` object. This will completed the transfer event call.
```javascript
const transferOneDeploy = await cep47.transfer(
    transferOneRecipient, 
    ["2"], 
    TRANSFER_ONE_PAYMENT_AMOUNT!, 
    KEYS.publicKey, 
    [KEYS]);
```

Then, send the deploy to the network. At the end this, token transfer event completes successfully.
```javascript
 const transferOneHash = await transferOneDeploy.send(NODE_ADDRESS!);
```

Finally, check the owner of token id 2. Confirm that the owner has changed from your account hash to the recipient account hash.
```javascript
ownerOfTokenTwo = await cep47.getOwnerOf("2");
```

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/transfer.png")} alt="token-transferring" width="800"/>

### Approve Process
This method is used when you need to hand over the token transfer capability to some other account. In this example, the new owner's public key is created before performing the transfer. Then the new account will perform the token transfer.

#### Executing approve() method
Below code snippet will execute when calling the [approve](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L259-L267) method.

Create `allowedAccount` recipient address using the `KEYS_USER` variable from .env.cep47 file. It indicates the new spender of the token.

```javascript
const allowedAccount = KEYS_USER!.publicKey;
```

Next, execute the approve() method and create the `aaproveDeploy` object. Here, token id 5 will be used for the approval. This will completes the approve event call.

```javascript
  const approveDeploy = await cep47.approve(
    allowedAccount,
    ["5"],
    MINT_ONE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );
```

#### Checking the new account
After generating the deploy hash for the approval, you can check which account is allowed to do the approval. It will return the account-hash of the account owning this specific token.
```javascript
const allowanceOfTokenFive = await cep47.getAllowance(KEYS.publicKey, "5");
```

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/approve.png")} alt="token-approving" width="800"/>

### Transfer From Process
This will transfer the tokens on behalf of another account, You will use some randomly generated account address to check the behavior of this method.

#### Executing transferFrom() method
Below code snippet will execute when calling the [transferFrom](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L297-L302) method.

First, check the owner of token id 5.
```javascript
ownerOfTokenFive = await cep47.getOwnerOf("5");
```
Then, generate the recipient address from a random number.
```javascript
const transferFromRecipient = CLPublicKey.fromHex("019548b4f31b06d1ce81ab4fd90c9a88e4a5aee9d71cac97044280905707248da4");
```
Then, you can generate the `transferFromDeploy` deploy object using the new recipient address and the rest of the input parameters and complete the transfer from another account process. This will completes the transfer-from event call.
```javascript
const transferFromDeploy = await cep47.transferFrom(
    transferFromRecipient,
    KEYS.publicKey,
    ["5"],
    TRANSFER_ONE_PAYMENT_AMOUNT!,
    KEYS_USER.publicKey, [KEYS_USER]);
```

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/transferFrom.png")} alt="token-transfer=from" width="800"/>

#### Checking the new owner
Finally, check the owner of the token id 5 and note that it has changed to the new recipient.
```javascript
ownerOfTokenFive = await cep47.getOwnerOf("5");
```

### Update Token Metadata Process
This method will update the metadata of a selected token.

#### Executing updateTokenMeta() method
Below code snippet will execute when calling the [update metadata](https://github.com/casper-network/casper-contracts-js-clients/blob/b210261ba6b772a7cb25f62f2bdf00f0f0064ed5/e2e/cep47/usage.ts#L329-L335) method.

First, check the metadata details of token num 4.
```javascript
let tokenFourMeta = await cep47.getTokenMeta("4");
```

Then, execute the updateTokenMeta() and generate the `updateMetadataDeploy` object. This will completes the update metadata call.
```javascript
const updateMetadataDeploy = await cep47.updateTokenMeta(
    "4",
    new Map([["name", "four"]]),
    TRANSFER_ONE_PAYMENT_AMOUNT!,
    KEYS_USER.publicKey, 
    [KEYS_USER]
  );
```

Again, check the metadata details of token id 4 and confirm the data has changed.
```javascript
tokenFourMeta = await cep47.getTokenMeta("4");
```

*Console Output :*
<img src={useBaseUrl("/image/tutorials/cep-47/metadataUpdate.png")} alt="token-updating-metadata" width="800"/>


