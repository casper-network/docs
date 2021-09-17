# Execution Error Codes

This section covers smart contract execution error codes.

As mentioned in Writing Rust Contracts, smart contracts can exit with an error code defined by an [ApiError](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md). Descriptions of each variant are found [here](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md#variants) and include the following sub-types:

-   [payment errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md#variant.HandlePayment)
-   [mint errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md#variant.Mint)
-   [custom user errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md#variant.User)

An `ApiError` of one of these sub-types maps to an exit code with an offset defined by the sub-type. For example, an `ApiError::User(2)` maps to an exit code of `65538` (i.e. `65536 + 2`). You can find a mapping from contract exit codes to `ApiError` variants [here](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.md#mappings).
