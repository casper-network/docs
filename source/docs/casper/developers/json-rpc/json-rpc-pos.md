# Proof-of-Stake JSON-RPC Methods {#proof-of-stake}

The following methods pertain to the Proof-of-Stake functionality of a Casper network. They return information related to auctions, bids and validators. This information is necessary for users involved with node operations and validation.

---

## state_get_auction_info {#state-get-auction-info}

This method returns the [bids](../../concepts/economics/consensus.md#bids) and [validators](../../concepts/glossary/V.md#validator) as of either a specific Block (by height or hash). If you do not provide a  `block_identifier`, `state_get_auction_info` will return information from the most recent Block.

|Parameter|Type|Description|
|---------|----|-----------|
|[block_identifier](./types_chain.md#blockidentifier)|Object|The Block identifier.|

<details>

<summary><b>Example state_get_auction_info request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_get_auction_info",
  "params": [
    {
      "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    }
  ]
}

```

</details>

### `state_get_auction_info_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[auction_state](./types_chain.md#auctionstate)|Object|The auction state.|

<details>

<summary><b>Example state_get_auction_info result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "auction_state": {
      "bids": [
        {
          "bid": {
            "bonding_purse": "uref-fafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafa-007",
            "delegation_rate": 0,
            "delegators": [],
            "inactive": false,
            "staked_amount": "10"
          },
          "public_key": "01197f6b23e16c8532c6abc838facd5ea789be0c76b2920334039bfa8b3d368d61"
        }
      ],
      "block_height": 10,
      "era_validators": [
        {
          "era_id": 10,
          "validator_weights": [
            {
              "public_key": "01197f6b23e16c8532c6abc838facd5ea789be0c76b2920334039bfa8b3d368d61",
              "weight": "10"
            }
          ]
        }
      ],
      "state_root_hash": "0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b"
    }
  }
}

```

</details>


## info_get_validator_changes {#info-get-validator-changes}

This method returns status changes of active validators. Listed changes occurred during the `EraId` contained within the response itself. A validator may show more than one change in a single era.

Potential change types:

|Change Type|Description|
|-----------|-----------|
|Added|The validator has been added to the set.|
|Removed|The validator has been removed from the set.|
|Banned|The validator has been banned in the current era.|
|CannotPropose|The validator cannot propose a Block.|
|SeenAsFaulty|The validator has performed questionable activity.|

<details>

<summary><b>Example info_get_validator_changes request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "info_get_validator_changes",
  "params": []
}

```

</details>

### `info_get_validator_changes_result`

If no changes occurred in the current era, `info_get_validator_changes` will return empty.
    
|Parameter|Type|Description|
|---------|----|-----------| 
|api_version|String|The RPC API version.|
|[changes](./types_chain.md#jsonvalidatorchanges)|Object|The validators' status changes.|

<details>

<summary><b>Example info_get_validator_changes result</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "changes": [
      {
        "public_key": "01d9bf2148748a85c89da5aad8ee0b0fc2d105fd39d41a4c796536354f0ae2900c",
        "status_changes": [
          {
            "era_id": 1,
            "validator_change": "Added"
          }
        ]
      }
    ]
  }
}

```

</details>

## chain_get_era_info_by_switch_block

This method returns an EraInfo from the network. Only the last Block in an `era`, known as a switch block, will contain an `era_summary`.

|Parameter|Type|Description|
|---------|----|-----------| 
|[block_identifier](./types_chain.md#blockidentifier)|Object|The Block identifier. If you do not supply a `block_identifier`, the returned information will be the most recent Block. (Optional)|

<details>

<summary><b>Example chain_get_era_info_by_switch_block request</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "chain_get_era_info_by_switch_block",
  "params": [
    {
      "Hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb"
    }
  ]
}

```

</details>

### `chain_get_era_info_by_switch_block_result`

|Parameter|Type|Description|
|---------|----|-----------|
|api_version|String|The RPC API version.|
|[era_summary](./types_chain.md#erasummary)|Object|The era summary (If found).|

<details>

<summary><b>Example chain_get_era_info_by_switch_block</b></summary>

```bash

{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "api_version": "1.4.13",
    "era_summary": {
      "block_hash": "13c2d7a68ecdd4b74bf4393c88915c836c863fc4bf11d7f2bd930a1bbccacdcb",
      "era_id": 42,
      "merkle_proof": "01000000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625016ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a72536147614625000000003529cde5c621f857f75f3810611eb4af3f998caaa9d4a3413cf799f99c67db0307010000006ef2e0949ac76e55812421f755abe129b6244fe7168b77f47a7253614761462501010102000000006e06000000000074769d28aac597a36a03a932d4b43e4f10bf0403ee5c41dd035102553f5773631200b9e173e8f05361b681513c14e25e3138639eb03232581db7557c9e8dbbc83ce94500226a9a7fe4f2b7b88d5103a4fc7400f02bf89c860c9ccdd56951a2afe9be0e0267006d820fb5676eb2960e15722f7725f3f8f41030078f8b2e44bf0dc03f71b176d6e800dc5ae9805068c5be6da1a90b2528ee85db0609cc0fb4bd60bbd559f497a98b67f500e1e3e846592f4918234647fca39830b7e1e6ad6f5b7a99b39af823d82ba1873d000003000000010186ff500f287e9b53f823ae1582b1fa429dfede28015125fd233a31ca04d5012002015cc42669a55467a1fdf49750772bfc1aed59b9b085558eb81510e9b015a7c83b0301e3cf4a34b1db6bfa58808b686cb8fe21ebe0c1bcbcee522649d2b135fe510fe3",
      "state_root_hash": "0808080808080808080808080808080808080808080808080808080808080808",
      "stored_value": {
        "EraInfo": {
          "seigniorage_allocations": [
            {
              "Delegator": {
                "amount": "1000",
                "delegator_public_key": "01e1b46a25baa8a5c28beb3c9cfb79b572effa04076f00befa57eb70b016153f18",
                "validator_public_key": "012a1732addc639ea43a89e25d3ad912e40232156dcaa4b9edfc709f43d2fb0876"
              }
            },
            {
              "Validator": {
                "amount": "2000",
                "validator_public_key": "012a1732addc639ea43a89e25d3ad912e40232156dcaa4b9edfc709f43d2fb0876"
              }
            }
          ]
        }
      }
    }
  }
}

```

</details>