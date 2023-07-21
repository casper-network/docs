---
title: Additional Examples
---

# Additional Examples

This section presents examples of single and multi-signature schemes, where accounts have multiple associated keys and thresholds for signing transactions.

### Example 1: An account with a single (primary) key

In this example, only one key (`account-hash-a1…`) can sign transactions in the name of this account. This key is the primary key of the account and has a `weight` equal to 1. For deployments or key management, the weight required is also 1. Therefore, the key meets the deployment and key management thresholds and can perform both actions.

**Account details in example 1:**

```json
"Account": {
   "account_address": "account-hash-a1…",
      "action_thresholds": {
         "deployment": 1,
         "key_management": 1
   },
   "associated_keys": [
      {
         "account_address": "account-hash-a1…", // primary key
         "weight": 1
      }
   ],
   "main_purse": "uref-1234…",
   "named_keys": []
}
```


### Example 2: An account with primary and associated keys

In this example, the account has a primary key with weight 2 and an associated key with a lower weight for signing deploys. The primary key can perform account updates and deploys, while the associated key can only sign deploys.

**Account details in example 2:**

```json
"Account": {
   "account_address": "account-hash-a1…",
   "action_thresholds": {
         "deployment": 1,
         "key_management": 2
   },
   "associated_keys": [
      {
         "account_address": "account-hash-a1…", // primary key for key management
         "weight": 2
      },
      {
         "account_address": "account-hash-b2…", // associated key used for deploys
         "weight": 1
      }
   ],
   "main_purse": "uref-1234…",
   "named_keys": []
}
```

### Example 3: Multi-sig setup for deploys and account updates

The following account has associated keys that can manage the account and send deploys independently of the primary key. The two associated keys have a cumulative weight of 2, which meets the deployment and key management thresholds. Both keys must sign the deploy to make updates.

**Account details in example 3:**

```json
"Account": {
   "account_address": "account-hash-a1…",
   "action_thresholds": {
      "deployment": 2,
      "key_management": 2
   },
   "associated_keys": [
      {
         "account_address": "account-hash-a1…", // primary key
         "weight": 2
      },
      {
         "account_address": "account-hash-b2…", // associated key
         "weight": 1
      },
      {
         "account_address": "account-hash-c3…", // associated key
         "weight": 1
      }
   ],
   "main_purse": "uref-1234…",
   "named_keys": []
}
```

### Example 4: Signing deploys but restricting account updates

This scenario builds on the previous example. The account has a primary key with a weight of 3, equal to the key management threshold, and two associated keys with a cumulative weight of 2, for signing deploys. The associated keys can sign deploys but not make account updates because they do not meet the key management threshold. Only the primary key can update the account. If the primary key is lost or compromised, the entire account becomes compromised because the associated keys do not have enough cumulative weight to remove the compromised key.

**Account details in example 4:**

```json
"Account": {
   "account_address": "account-hash-a1…",
   "action_thresholds": {
      "deployment": 2,
      "key_management": 3
   },
   "associated_keys": [
      {
         "account_address": "account-hash-a1…", // primary key
         "weight": 3
      },
      {
         "account_address": "account-hash-b2…", // associated key
         "weight": 1
      },
      {
         "account_address": "account-hash-c3…", // associated key
         "weight": 1
      }
   ],
   "main_purse": "uref-1234…",
   "named_keys": []
}
```

### Example 5: Recovering a lost primary key

This account has a primary key with a weight of 3, equal to the key management threshold, and three associated keys with a cumulative weight of 3. Two associated keys can combine their weight to sign deploys. All three associated keys can combine their weight to make account updates. If the primary key is lost or compromised, the associated keys can remove it and secure the account.

**Account details in example 5:**

```json
"Account": {
   "account_address": "account-hash-a1…",
   "action_thresholds": {
      "deployment": 2,
      "key_management": 3
   },
   "associated_keys": [
      {
         "account_address": "account-hash-a1…", // primary key
         "weight": 3
      },
      {
         "account_address": "account-hash-b2…", // associated key
         "weight": 1
      },
      {
         "account_address": "account-hash-c3…", // associated key
         "weight": 1
      },
      {
         "account_address": "account-hash-d4…", // associated key
         "weight": 1
      }
   ],
   "main_purse": "uref-1234…",
   "named_keys": []
}
```
