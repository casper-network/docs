# Guidance for Minimum SDK Compliance

Developers should view the SDK Standard as the minimum required implementation for a complete Casper SDK. A compliant informational Casper SDK must include all the methods and associated types within the [Informational JSON-RPC Methods](../json-rpc-informational) specification. This is also true for a minimal compliant SDK, a transactional SDK, or a Proof-of-Stake SDK.

**A fully featured, complete Caper SDK will be expected to include all possible methods.**

Users seeking official compliance status must adhere to the expectations in this document and include the associated methods to ensure a consistent development experience across various SDKs and aid in ease of technical support.

## Advanced Functionality

SDK developers are allowed and encouraged to add their advanced functionality using the available methods and possible combinations. Casper’s platform allows for a wide range of possibilities.

However, it is critical that SDK developers avoid misleading or improperly characterizing the purpose and scope of the available methods. Custom functionality should improve on the basic building blocks of the Casper Platform, offering added convenience.

For example, an SDK developer could create an advanced function that automated the combination of `chain_get_state_root_hash` and `state_get_balance`. The state root hash is necessary for the `state_get_balance` method and combining the two is convenient and logical for an end-user.

## Consistency

When developing an SDK for the Casper platform, consistency in terminology, language and functionality will be necessary for compliance. Method and type names should be consistent across various SDKs, regardless of how they are incorporated into any given SDK. Endpoints built on top of JSON RPC methods should follow the underlying language to avoid confusion for developers, users and support personnel.