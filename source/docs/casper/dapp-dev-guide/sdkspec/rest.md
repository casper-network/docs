# REST Information {#rest-information}

## `OpenRpcInfoField` {#openrpcinfofield}

This object provides metadata about the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`contact`|Object|Contact information for the API.|
|`description`|String|A description of the application.|
|`license`|Object|License information for the API.|
|`title`|String|The title of the application.|
|`version`|String|The version of the OpenRPC document.|

## `OpenRpcContactField` {#openrpccontactfield}

Contact information for the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The identifying name of the contact/organization.|
|`url`|String|The URL pointing to the contact information.|

## `OpenRpcLicenseField` {#openrpclicensefield}

License information for the Casper API.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The license name used for the API.|
|`url`|String|A URL to the license used for the API.|

## `OpenRpcServerEntry` {#openrpcserverentry}

An object representing a server.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|A name to be used as the canonical name for the server.|
|`url`|String|A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenRPC document is being served. Server Variables are passed into the Runtime Expression to produce a server URL.|

## `Method` {#method}

Describes the interface for a given method name. The method name is used as the `method` field of the JSON-RPC body.

|Parameter|Type|Description|
|---------|----|-----------|
|`examples`|Array|An example use case of the `method` in question.|
|`name`|String|The unique name of a method.|
|`params`|Array|A list of applicable paramters for the `method` in question.|
|`result`|Object|A description of the result returned by the `method`.|
|`summary`|String|A short summary of what the `method` does.|

## `SchemaParam` {#schemaparam}

A content descriptor for associated parameters.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|The name of the content being described.|
|`required`|Boolean|Determines if the content is a required field. Defaults to `false`|
|`schema`|Object|Schema that describes the content.|

## `Schema` {#schema}

A JSON Schema of one of two types:

* A trivial boolean JSON Schema. The schema `true` matches everything (always passes validation), whereas the schema `false` matches nothing (always fails validation).

* A JSON `Schema object`.

## `SchemaObject` {#schemaobject}

A JSON Schema Object.

|Property|Type|Description|
|--------|----|-----------|
|`type`|String/Null|The `type` keyword. See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).|
|`format`|String/Null|The `format` keyword. See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).|
|`enum`|Array/Null|The `enum` keyword. See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)|
|`const`||The `const` keyword. See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)|
|`$ref`|String/Null|The `$ref` keyword. See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).|
|`$id`|String/Null|The `$id` keyword. See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).|
|`title`|String/Null|The `title` keyword. See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).|
|`description`|String/Null|The `description` keyword. See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).|
|`default`||The `default` keyword. See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).|
|`deprecated`|Boolean|The `deprecated` keyword. See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).|
|`readOnly`|Boolean|The `readOnly` keyword. See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).|
|`writeOnly`|Boolean|The `writeOnly` keyword. See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).|
|`examples`|Array|The `examples` keyword. See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).|
|`allOf`|Array/Null|The `allOf` keyword. See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).|
|`anyOf`|Array/Null|The `anyOf` keyword. See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).|
|`oneOf`|Array/Null|The `oneOf` keyword. See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).|
|`not`|Schema/Null|The `not` keyword. See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).|
|`if`|Schema/Null|The `if` keyword. See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).|
|`then`|Schema/Null|The `then` keyword. See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).|
|`else`|Schema/Null|The `else` keyword. See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).|
|`multipleOf`|Number/Null|The `multipleOf` keyword. See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).|
|`maximum`|Number/Null|The `maximum` keyword. See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).|
|`exclusiveMaximum`|Number/Null|The `exclusiveMaximum` keyword. See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).|
|`minimum`|Number/Null|The `minimum` keyword. See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).|
|`exclusiveMinimum`|Number/Null|The `exclusiveMinimum` keyword. See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).|
|`maxLength`|Integer/Null|The `maxLength` keyword. See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).|
|`minLength`|Integer/Null|The `minLength` keyword. See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).|
|`pattern`|String/Null|The `pattern` keyword. See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).|
|`items`|Single or Vec/Null|The `items` keyword. See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).|
|`additionalItems`|Schema/Null|The `additionalItems` keyword. See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).|
|`maxItems`|Integer/Null|The `maxItems` keyword. See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).|
|`minItems`|Integer/Null|The `minItems` keyword. See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).|
|`uniqueItems`|Boolean/Null|The `uniqueItems` keyword. See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).|
|`contains`|Schema/Null|The `contains` keyword. See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).|
|`maxProperties`|Integer/Null|The `maxProperties` keyword. See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).|
|`minProperties`|Integer/Null|The `minProperties` keyword. See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).|
|`required`|Array|The `required` keyword. See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).|
|`properties`|Object|The `properties` keyword. See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).|
|`patternProperties`|Object|The `patternProperties` keyword. See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).|
|`additionalProperties`|Schema/Null|The `additionalProperties` keyword. See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).|
|`propertyNames`|Schema/Null|The `propertyNames` keyword. See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).|

## `SingleOrVec_for_InstanceType` {#singleorvec-for-instancetype}

A type which can be seralized as a single item, or multiple items. In some contexts, a `Single` may be semantically distinct from a `Vec` containing only one item.

Contains either an `InstanceType` or an array of `InstanceType`s.

## `InstanceType` {#instancetype}

The possible types of values in JSON Schema documents. See [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).

* `null`
* `boolean`
* `object`
* `array`
* `number`
* `string`
* `integer`

## `SingleOrVec_for_Schema` {#singleorvec-for-schema}

A type which can be serialized as a single item, or multiple items. In some contexts, a `Single` may be semnatically different from a `Vec` containing only one item.

Contains either a `Schema` or an array of `Schema`s.

## `ResponseResult` {#responseresult}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`schema`|Object||

## `Example` {#example}

An example pair of request params and response result.

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String|Name for the example pairing.|
|`params`|Array|Example parameters.|
|`result`|Object|Example result.|

## `ExampleParam` {#exampleparam}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`value`|||

## `ExampleResult` {#exampleresult}

|Parameter|Type|Description|
|---------|----|-----------|
|`name`|String||
|`value`|||

## `Components` {#rest-components}

|Parameter|Type|Description|
|---------|----|-----------|
|`schema`|Schema|An object to hold reusable schema objects.|