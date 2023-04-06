# Contributing Documentation

This is the Writing Style Guide used by Casper's documentation team.

## Contents {#contents}

* [Overview](#overview-overview)
* [General Guidelines](#general-guidelines-general-guidelines)
* [Grammar](#grammar-grammar)
    * [Voice](#voice-voice)
    * [Verb agreement](#verb-agreement-verb-agreement)
* [Headings](#headings-headings)
* [Lists](#lists-lists)
* [Tables](#tables-tables)
* [Images](#images-images)
* [Formatting](#formatting-formatting)
    * [General](#general-general-formatting)
    * [UI elements](#ui-elements-ui-elements)
        * [Bold formatting](#bold-formatting-bold-formatting)
        * [Italic formatting](#italic-formatting-italic-formatting)
        * [Quotation marks](#quotation-marks-quotation-marks)
* [Acronyms and Abbreviations](#acronyms-and-abbreviations-acronyms-and-abbreviations)

## Overview {#overview}

The Casper Writing and Editing Style Guide aims to establish a set of standards and guidelines for writing and editing documents to provide uniformity and consistency throughout. This document briefly discusses the guidelines to be followed in developing the content for each deliverable. The official language to be used in all Casper documents is American English, thus for spelling variations [Merriam Webster Dictionary](https://www.merriam-webster.com/dictionary/dictionary) will be the reference point.

---

## General Guidelines {#general-guidelines}

* Use Casper not casper.

* Use Casper Labs instead of CasperLabs, casper labs, casperLabs, casperlabs, or any other variation.

* Use Casper Network (the initial letter of both words capitalized) while referring to the Casper blockchain network.

* Use ERC-20 while referring to the ‘Ethereum request for comment’ standard.

* Avoid using ampersand (**&**) in place of ‘and’ in normal writing or as a means of shortening titles or text in figures or tables.

* Don't use ‘**etc.**’ except in situations where space is too limited for an alternative.

* Any comments within code blocks should adhere to these guidelines.

---

## Grammar {#grammar}

### Voice {#voice}

* In general, use active voice. Active voice emphasizes the person or thing preforming the action. It’s more direct than passive voice, which can be confusing or sound formal.

* It is all right to use passive voice in the following situations:

    * To avoid a wordy or awkward construction.

    * When the action, not the doer, is the focus of the sentence.

    * When the subject is unknown.

    * In error messages, to avoid giving the impression that the user is to blame.

* In general, use second person. Second person, also known as direct address, uses the personal pronoun you. Second person supports a friendly tone because it connects you with the user. It also helps avoid passive voice because it focuses the discussion on the user.

### Verb agreement {#verb-agreement}

Verbs have singular and plural forms. Use the verb form that agrees with the subject of the sentence in number.

|Subject|Verb|Examples|
|-------|----|--------|
|A group of things|Singular|A list of items is displayed.|
|Two ore more singular things connected by *and*|Plural|The secret key and public key are generated using the *keygen* command.|
|Two or more singular things connected by *or*|Singular|A public key, account hash, or deploy hash is used to search for your transaction on the Testnet or Mainnet.|
|A singular thing and a plural thing connected by *or*|Singular or plural, to match the closest subject|<li>The public key or tokens are displayed in the account info.</li><li>The tokens or the public key is displayed in the account info.</li>|

---

## Headings {#headings}

|Guidelines|Examples|
|----------|--------|
|Use gerunds to start a Level 1 heading| <li>Working with Cryptographic Keys</li><li>Writing Smart Contracts</li>|
|For Level 1 and Level 2 headings, use title style capitalization|Initial caps for all nouns and verbs, while all conjunctions, prepositions, and articles are set in lowercase.<li>Delegating with the Command-line</li><li>Setting up the Network</li><li>Basic Deployment using the Command Line (Rust Client)</li>|
|For headings at Level 3 and below, use sentence style capitalization|<li>Token to pay for deployments</li><li>Creating, signing and deploying contracts with multiple signatures</li>|

* Avoid using articles, such as 'A' and 'The' at the beginning of headings or titles.

---

## Lists {#lists}

* Begin all list items with a capital letter.

* Use no punctuation at the end unless you have complete sentences. Either way, be consistent on the page and within the list.

* Always observe parallel structure for two or more ideas that have the same level of importance. For example, when citing bulleted items, start with words parallel in structure such as:

    * Collect…   or    Collecting…

    * Perform… or    Performing…

    * Update…  or    Updating…

---

## Tables {#tables}

* Use tables for information that would be easier to scan in columnar form than in running text. Also use tables for “information matrixes,” which provide an effective way to present quick-reference instructions or descriptions.

* Capitalization: Use sentence-style capitalization for all parts of a table, including the column headings.

* Headings: Make column headings short and descriptive.

* Make entries in a table parallel. For example, make all the items within a column a noun or a phrase that starts with a verb.

* For the text in cells, use periods or other end punctuation only if the cells contain complete sentences or a mixture of fragments and sentences.

* Don’t use ellipses at the end of column headings or within the table cells.

---

## Images {#images}

* Image size (width) recommendations:

    * For full screen capture - 500 or 600

    * For cropped images - 250 or 350

    * For inline images (icons) - 25

* Add `import useBaseUrl from '@docusaurus/useBaseUrl';` at the start of each .md file that displays images.

* Within the `<img>` tag, include `src ={useBaseUrl("path_of_the_image")}` to define the path of the image.

* For inline images, use `class="inline-img"` as shown in this example tag: `<img src={useBaseUrl("/image/ext-icon.png")} class="inline-img" width="25"/>`

---

## Formatting {#formatting}

### General {#general-formatting}

* For a note, use either one of the following formatting options:

```
**Note:**

> To use this example on the Mainnet, replace *chain-name* as casper.
```

* When using `:::note`, you must include a blank line before and after the text or the formatting will not work.

```
:::note 

Alternatively, you can use this link to download the Casper Signer.  

:::
```

* For command-line code samples, use ```bash at the start of the code block.

~~~
```bash
casper-client make-transfer --amount 2500000000 \
--secret-key keys1/secret_key.pem \
--chain-name casper-test \
--target-account 019a33f123ae936ccd29d8fa5438f03a86b6e34fe4346219e571d5ac42cbff5be6 \
--transfer-id 3 \
--payment-amount 10000
```
~~~

* For Rust code samples, use ```rust at the start of the block.

~~~
```rust
use std::path::PathBuf;
const MY_ACCOUNT: [u8; 32] = [7u8; 32];
const KEY: &str = "my-key-name";
const VALUE: &str = "hello world";
const RUNTIME_ARG_NAME: &str = "message";
const CONTRACT_WASM: &str = "contract.wasm";
```
~~~

### UI elements {#ui-elements}

#### Bold formatting {#bold-formatting}

* When you refer to a button, check box, or other UI elements, use **bold** formatting for the name. 

    * Use sentence-style capitalization unless you need to match the UI. 

    * If an option label ends with a colon or an ellipsis, don’t include that end punctuation in instructions. 

    * Don’t include the type of UI element, such as button or check box, unless including it adds needed clarity.

#### Italic formatting {#italic-formatting}

* Use italic formatting for directory names (such as *nctl*, *casper-node*), key names (such as *public key*, *secret key*), and hashes (such as *account hash*, *deploy hash*).

#### Quotation marks {#quotation-marks}

* Do not use quotation marks to emphasize a word.

    * Limit quotation marks to the traditional usage, such as quoted speech.

### Templates

When adding the following types of content, use a template:

* [Overview page](.github/templates/overview-template.md)
* [Tutorial page](.github/templates/tutorial-template.md)

## Guidelines for Casper Concepts

### Major Structures

When discussing major Casper structures in the context of code, i.e., Account, Block and Deploy, they should be capitalized. When discussing the general concept of an account or block, they do not need to be capitalized.

Examples:

#### Account

•	“The `Account` creation process consists of…”

•	“…provide a browser-based block explorer that allows **account** creation.”

#### Block

•	“…this method returns the bids and validators as of either a specific `Block`”

•	“Since the system state changes with each **block** created…”

#### Deploy

•	“…and its secret key will sign the `Deploy`”

•	“…or a multiple-signature (multi-sig) **deploy** transfer.”

### Casper Components

When discussing [internal components of the Casper platform](./source/docs/casper/concepts/serialization-standard.md), formatting depends on the context with which you are discussing the component. 

As an example, if you are talking directly about the `PublicKey` [CLValue](./source/docs/casper/concepts/serialization-standard.md#publickey-clvalue-publickey) in the context of code, you would use the backtick enclosed `PublicKey` format. If you are talking about public keys in a more general context, you would follow normal sentence conventions.

Examples:

* "...cryptographically signed by the key-pair corresponding to the `PublicKey` used to create..."

* "When a signature is attached to a deploy, it is paired with the **public key** of the signer..."

## Acronyms and Abbreviations {#acronyms-and-abbreviations}

|Acronym/Abbreviation|Definition|
|--------------------|----------|
|CSPR|Casper token|
|dApp|Decentralized application|
|ERC|Ethereum request for comment|