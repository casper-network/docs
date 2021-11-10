# Account Hash

The account-hash is a 32-byte hash of the public key and it represents the address of the user account. It is the identifier of the account inside a smart contract.

## Prerequisites

You must ensure the following prerequisites are met, before you can generate an account hash:

1.  Set up your machine as per the [prerequisites](setup.md)
2.  Get a _public key_ hex
3.  Use the Casper [command-line client](/workflow/setup#the-casper-command-line-client)

## Generating Account Hash

To generate an account-hash use the following command:

```bash
casper-client account-address --public-key <PUBLIC KEY HEX CODE>
```

**Sample Output**

```bash
account-hash-a2c2a41c282452195e5dd267272d12ed3e991467a5f881aab96306bac1cec3e8
```

In the above output, `a2c2a41c282452195e5dd267272d12ed3e991467a5f881aab96306bac1cec3e8` is the account hash and the prefix `account-hash-` is used to make it a tight key.
