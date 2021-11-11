# FAQ - General

In Progress ...

### Deploy Processing {#deploy-processing}

<details>
 <summary><b>How do I know that a deploy was finalized?</b></summary>
  
If a deploy was executed, then it has been finalized. If the deploy status comes back as null, that means the deploy has not been executed yet. Once the deploy executes, it is finalized, and no other confirmation is needed. Exchanges that are not running a read-only node must also keep track of <a href="/docs/faq/faq-developer#finality-signatures">finality signatures</a> to prevent any attacks from high-risk nodes.

</details>

### Account-hex vs. Account-hash {#account-hex-vs-account-hash}

<details>
 <summary><b>Should a customer see the account-hex or the account-hash?</b></summary>
  
Exchange customers or end-users only need to see the <em>account-hex</em>. They do not need to know the <em>account_hash</em>. The <em>account_hash</em> is needed in the backend to verify transactions. 
Store the <em>account-hash</em> to query and monitor the account. Customers do not need to know this value, so to simplify their experience, we recommend storing both values and displaying only the <em>account-hex</em> value.

</details>
