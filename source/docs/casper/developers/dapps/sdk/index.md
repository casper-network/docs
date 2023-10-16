---
title: SDK Client Libraries
slug: /sdk
---

# SDK Client Libraries

This section covers the software development kits (SDKs) published by third parties available for interacting with the Casper blockchain. These SDKs are client-side libraries providing functions or methods (depending on the language) to interact with a Casper network. You can use them as a model to develop your application and accomplish tasks such as generating account keys, sending transfers, or other blockchain transactions.

Each of these SDKs can be used to build dApps. For browser interaction, you can use the JavaScript SDK; for desktop applications, there are C# and Java SDKs. Click the link on your preferred SDK to learn how to use it in dApp development. To delve into the source code, you may visit the SDKs' Github repositories.

Each such third party is solely responsible for the SDK it provides, any warranties (to the extent that such warranties have not been disclaimed), and for any claims you may have relating to your access or use thereof. We do not approve or endorse any such SDKs by providing a link thereto, and assume no responsibility for your access or use thereof. The SDKs may be subject to additional licenses and disclaimers as set out in the relevant GitHub repositories.

## Serialization Standard

The Casper platform uses a custom serialization format. To this end, we've established a [Serialization Standard](../../../concepts/serialization-standard.md), which must be followed when building a Casper SDK.

## JSON-RPC API

Developers can interact directly with the [Casper JSON-RPC API](../../json-rpc/index.md) instead of using an SDK.

## Table of Contents

| SDK Documentation      | GitHub Location      | Organization |
| ---------------------- | -------------------- | ---------- |
|[JavaScript/TypeScript](./script-sdk.md) | [casper-js-sdk](https://github.com/casper-ecosystem/casper-js-sdk/)| [Casper Ecosystem](https://github.com/casper-ecosystem) |
|Java SDK | [casper-java-sdk](https://github.com/casper-network/casper-java-sdk/)| [Casper Association](https://github.com/casper-network)|
|[C# SDK](./csharp-sdk.md)|[casper-net-sdk](https://github.com/make-software/casper-net-sdk)| [MAKE](https://github.com/make-software) |
|[Go SDK](./go-sdk.md) | [casper-go-sdk](https://github.com/make-software/casper-go-sdk) | [MAKE](https://github.com/make-software) |
|[Python SDK](./python-sdk.md) |[casper-python-sdk](https://github.com/casper-network/casper-python-sdk/)| [Casper Association](https://github.com/casper-network) |
|PHP SDK|[casper-php-sdk](https://github.com/make-software/casper-php-sdk)| [MAKE](https://github.com/make-software) |
| Scala SDK | [casper-scala-sdk](https://github.com/abahmanem/casper-scala-sdk) | [M. Abahmane](https://github.com/abahmanem) |
