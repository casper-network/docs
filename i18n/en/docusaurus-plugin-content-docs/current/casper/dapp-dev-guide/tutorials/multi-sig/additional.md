# Additional Scenarios

This section walks you through additional scenarios where accounts have multiple associated keys for signing transactions at various thresholds.

## Scenario 1: signing transactions with a single key

In this example, only one key can sign transactions in the name of this account. The key is "account-hash-a1..." under the _associated_keys_. If you sign the transaction using "account-hash-a1...", the signed transaction will have a _weight_ equal to 1. For deployments or key management, the weight required is also 1. Therefore, the associated key meets the deployment and key management thresholds and can perform both actions.

**Faucet account in scenario 1:**

```sh
{
    "api_version": "1.0.0",
    "merkle_proof": "01000…..11",
    "stored_value": {
       "Account": {
          "account_address": "account-address-a1…",
             "action_thresholds": {
                "deployment": 1,
                "key_management": 1
          },
          "associated_keys": [
             {
                "account_address": "account-address-a1…",
                "weight": 1
             }
          ],
          "main_purse": "uref-1234…",
          "named_keys": []
       }
    }
}
```

## Scenario 2: deploying with special keys

In this example, you have two keys. One key can only perform deployments, while the second key can perform key management and deployments. The key with account address _a1_ can deploy and make account changes, but the second key with account address _b2_ can only deploy.

**Faucet account in scenario 2:**

```sh
{
   "api_version": "1.0.0",
   "merkle_proof": "01000…..11",
   "stored_value": {
       "Account": {
           "account_address": "account-address-a1…",
           "action_thresholds": {
               "deployment": 1,
               "key_management": 2
           },
           "associated_keys": [
               {
                   "account_address": "account-address-a1…",
                   "weight": 2
               },
               {
                   "account_address": "account-address-b2…", // a deployment key
                   "weight": 1
               }
           ],
           "main_purse": "uref-1234…",
           "named_keys": []
       }
   }
}
```

## Scenario 3: signing transactions with multiple keys

Sometimes you will require multiple associated keys to execute a transaction. In this example, we have two associated keys with a weight equal to 1. To make changes to the account, you need to use both keys to sign the transaction. However, for deployment, each key can sign separately and perform deployments independently.

**Faucet account in scenario 3:**

```sh
{
  "api_version": "1.0.0",
  "merkle_proof": "01000…..11",
  "stored_value": {
     "Account": {
        "account_address": "account-address-a1…",
        "action_thresholds": {
           "deployment": 1,
           "key_management": 2
        },
        "associated_keys": [
           {
              "account_address": "account-address-a1…",
              "weight": 1   // can deploy, but needs to sign with b2 to manage account
           },
           {
              "account_address": "account-address-b2…",
              "weight": 1   // can deploy, but needs to sign with a1 to manage account
           }
        ],
        "main_purse": "uref-1234…",
        "named_keys": []
     }
  }
}
```

## Scenario 4: managing lost or stolen keys

In this example, you need two out of three associated keys to sign a transaction. Consider a transaction where you have one key in your browser, one key on your mobile phone, and one key in your safe. To do a transaction, first, you sign it with your browser extension (for example, Metamask). Afterward, a notification appears on your mobile phone requesting you to approve the transaction. With these two keys, you can complete the transaction. However, what if you lose the two keys on your browser and phone? Or, what if someone steals your browser and phone? In this case, you can use the safe key to remove the lost or stolen keys from the account. Notice that the safe key's weight is 3, which gives you the option to manage your account and add or remove keys. Also, the stolen or lost keys can only enable deployments, and in this case, no one can use them to change your account.

**Faucet account in scenario 4:**

```sh
{
  "api_version": "1.0.0",
  "merkle_proof": "01000…..11",
  "stored_value": {
     "Account": {
        "account_address": "account-address-a1…",
        "action_thresholds": {
           "deployment": 2,
           "key_management": 3
        },
        "associated_keys": [
           {
              "account_address": "account-address-a1…",  // a browser key
              "weight": 1
           },
           {
              "account_address": "account-address-b2…",  // a mobile key
              "weight": 1
           },
           {
              "account_address": "account-address-c3…",  // a safe key
              "weight": 3
           }
        ],
        "main_purse": "uref-1234…",
        "named_keys": []
     }
  }
}
```

## Scenario 5: managing accounts with multiple keys

This example builds upon the previous example, where you can set up multiple safe keys for account management. In this scenario, the safe keys have the weight required to manage your keys and account.

**Faucet account in scenario 5:**

```sh
{
  "api_version": "1.0.0",
  "merkle_proof": "01000…..11",
  "stored_value": {
     "Account": {
        "account_address": "account-address-a1…",
        "action_thresholds": {
           "deployment": 2,
           "key_management": 3
        },
        "associated_keys": [
           {
              "account_address": "account-address-a1…",  // a browser key
              "weight": 1
           },
           {
              "account_address": "account-address-b2…",  // a mobile key
              "weight": 1
           },
           {
              "account_address": "account-address-c3…",  // a safe key 1
              "weight": 3
           },
           {
              "account_address": "account-address-d4…",  // a safe key 2
              "weight": 3
           },
           {
              "account_address": "account-address-e5…",  // a safe key 3
              "weight": 3
           }
        ],
        "main_purse": "uref-1234…",
        "named_keys": []
     }
  }
}
```

## Scenario 6: losing your primary account key

Suppose you lose your account key; in this case, "account-hash-00...", you can set up other keys to execute transactions. Although not recommended, you can throw away the private key of your account or set its weight to zero, and you would still be able to execute transactions if your faucet account has backup keys that can perform key management.

**Faucet account in scenario 6:**

```sh
{
  "api_version": "1.0.0",
  "merkle_proof": "01000…..11",
  "stored_value": {
     "Account": {
        "account_address": "account-address-00…",
        "action_thresholds": {
           "deployment": 2,
           "key_management": 3
        },
        "associated_keys": [
           {
              "account_address": "account-address-00…", // the account key
              "weight": 0
           },
           {
              "account_address": "account-address-a1…", // a browser key
              "weight": 1
           },
           {
              "account_address": "account-address-b2…", // a mobile key
              "weight": 1
           },
           {
              "account_address": "account-address-c3…", // a safe key 1
              "weight": 3
           },
           {
              "account_address": "account-address-d4…", // a safe key 2
              "weight": 3
           },
           {
              "account_address": "account-address-e5…", // a safe key 3
              "weight": 3
           }
        ],
        "main_purse": "uref-1234…",
        "named_keys": []
     }
  }
}
```
