# Guidance for JSON-RPC SDK Compliance

A compliant Casper JSON-RPC SDK implementation must support all the endpoints and relevant types within the specification. The specification allows everything ranging from a minimal viable implementation to a full implementation, and a given SDK should cite which level of implementation they claim to be compliant with. For example, an SDK claiming to be an informational SDK must have implemented all entry points and relevant types described in the [informational JSON-RPC methods](../sdkspec/json-rpc-informational.md) page.

**A Casper JSON-RPC SDK claiming to be complete is expected to implement *all* endpoints and *all* types defined in the serialization standard.**

## Consistency

A Casper JSON-RPC SDK must be consistent in terminology, language, and functionality relative to the Casper platform's architecture and design. Use actual terms such as Account and Deploy, not similar terms such as wallet or transaction.
 
Care should be taken to maintain a universal language and not obscure the domain concepts of the Casper platform, which could confuse users of the SDK. The goal is to not make it difficult for users of an SDK to understand the documentation of the Casper platform. Further, they should be able to communicate effectively with technical support personnel who understand the terminology of the Casper platform and not the variant terminology of an SDK.

## Advanced Functionality

SDK developers are allowed and encouraged to add convenience methods, supporting utilities, domain specific or macro support and extended functionality using the available endpoints and possible combinations.

However, it is critical that SDK developers avoid misleading or improperly characterizing the purpose and scope of the available endpoints. Custom functionality should improve on the basic building blocks of the Casper Platform, offering added convenience.

For example, some languages have strong idiomatic opinions and programmers using those languages are comfortable with or even expect SDKs in that language to follow those idioms. This is acceptable, as long as they do not obfuscate underlying terminology or semantics of the Casper platform.