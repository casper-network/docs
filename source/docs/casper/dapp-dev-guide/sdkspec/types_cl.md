# CLType {#cltype}

Casper types, i.e. types which can be stored and manipulated by smart contracts. Provides a description of the underlying data type of a [`CLValue`](crate::CLValue).

        `Bool`
        `I32`
        `I64`
        `U8`
        `U32`
        `U64`
        `U128`
        `U256`
        `U512`
        `Unit`
        `String`
        `Key`
        `URef`
        `PublicKey`
        `Any`

* `Option` Option of a `CLType`.

* `List` Variable-length list of a single `CLType` (comparable to a `Vec`).

* `ByteArray` Fixed-length list of a single `CLType` (comparable to a Rust array).

* `Result` `Result` with `Ok` and `Err` variants of `CLType`'s.

* `Map` Map with keys of a single `CLType` and values of a single `CLType`.

* `Tuple1` 1-ary tuple of a `CLType`.

* `Tuple2` 2-ary tuple of `CLType`s.

* `Tuple3` 3-ary tuple of `CLType`s.

## CLValue {#clvalue} 

A Casper value, i.e. a value which can be stored and manipulated by smart contracts. It holds the underlying data as a type-erased, serialized `Vec<u8>` and also holds the CLType of the underlying data as a separate member. The `parsed` field, representing the original value, is a convenience only available when a CLValue is encoded to JSON, and can always be set to null if preferred.

* `bytes` A Casper serialized representation of the underlying value. For more information, reference the [Serialization Standard](../../../design/serialization-standard).

* [`cl_type`](#cltype)