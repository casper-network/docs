# Execution Error Codes

This section covers smart contract execution error codes.

As mentioned in [Writing Rust Contracts](/dapp-dev-guide/writing-contracts/rust.md#using-error-codes), smart contracts can exit with an error code defined by an [ApiError](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html). Descriptions of each variant are found [here](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html#variants) and include the following sub-types:

-   [payment errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html#variant.HandlePayment)
-   [mint errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html#variant.Mint)
-   [custom user errors](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html#variant.User)

An `ApiError` of one of these sub-types maps to an exit code with an offset defined by the sub-type. For example, an `ApiError::User(2)` maps to an exit code of `65538` (i.e. `65536 + 2`). You can find a mapping from contract exit codes to `ApiError` variants [here](https://docs.rs/casper-types/latest/casper_types/enum.ApiError.html#variants).
