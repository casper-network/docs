
# Loading Authorization Keys

import useBaseUrl from '@docusaurus/useBaseUrl';

In an account with multiple associated keys (multisig account), the key weights and thresholds define the hierarchy of the keys. You can extend this hierarchy using the list_authorization_keys API. This API lets you access the account hashes of the keys that sign a deploy.

When you deploy a smart contract using a multisig account, the hierarchy of keys within the account is verified before the deploy is signed. Once the authorized keys sign the deploy, the WASM code is executed. During the execution of the WASM code, the list_authorization_keys API returns the account hashes of the keys used to sign the deploy. You can use these account hashes to further role-based security.

The following diagram depicts a high-level flow of a multisig account deploying a smart contact that uses the list_authorization_keys API:

<img src={useBaseUrl("/image/dev-guide/load-auth-keys.png")} alt="load-authorization-keys" width="500"/>

## Understanding a Sample Use Case

This use case demonstrates an implementation of the load authorization keys feature. Let’s consider the following account structure:

-   Three associated keys (Key1, Key2, and Key3)
-   The associated keys have the following weights:
    -	Key1 is 2
    -	Key2 is 2
    -	Key3 is 1
-   The thresholds have the following weights:
    -	Key management is 4
    -	Deploy is 3

This account structure imposes a hierarchy with the key weights and thresholds. With the above account structure, either two of the three accounts can sign a deploy, as the sum of their key weights meets the deploy threshold.

Key1 + Key2 = 4

Key1 + Key3 = 3

Key2 + Key3 = 3

To expand on this hierarchy and limit access for certain operations to a specific key, you can use the list_authorization_keys API. 
For example, to impose that Key1 is the Manager for the above account and Key1 must sign each deploy, you can use the list_authorization_keys API to find the account hashes of the keys that signed the deploy. Verify if they contain the account hash for Key1. If not, return an error to the user, else if Key1 has signed the deploy, then execute the deploy.


