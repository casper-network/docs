# AssemblyScript

CasperLabs maintains the [casper-contract](https://www.npmjs.com/package/casper-contract) to allow developers to create smart contracts using [AssemblyScript](https://www.npmjs.com/package/assemblyscript). The package source is hosted in the [main Casper Network repository](https://github.com/casper-network/casper-node/tree/master/smart_contracts/contract_as/assembly).

## Installation

For each smart contract, it is necessary to create a project directory and initialize it.

The `npm init` process prompts for various details about the project. Answer as you see fit, but you may safely default everything except `name`, which needs to be specified. In this guide, we will refer to the contract name as `your-contract-name`.

```sh
mkdir project
cd project
npm init
```

Then install AssemblyScript and this package in the project directory.

```sh
npm install --save-dev assemblyscript@0.9.1
npm install --save casper-contract
```

## Contract API Documentation

The Assemblyscript contract API documentation can be found at <https://www.npmjs.com/package/casper-contract>.

## Usage

Add script entries for AssemblyScript to your project's `package.json`. Note that your contract name is used for the name of the WASM file. Replace _your-contract-name_ with the name of your contract.

```json
{
  "name": "your-contract-name",
  ...
  "scripts": {
    "asbuild:optimized": "asc assembly/index.ts -b dist/your-contract-name.wasm --validate --optimize --use abort=",
    "asbuild": "npm run asbuild:optimized",
    ...
  },
  ...
}
```

In the project root, create an `index.js` file with the following contents. Replace _your-contract-name_ with the name of your contract.

```js
const fs = require("fs");

const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/dist/your-contract-name.wasm"));

const imports = {
    env: {
        abort(_msg, _file, line, column) {
            console.error("abort called at index.ts:" + line + ":" + column);
        },
    },
};

Object.defineProperty(module, "exports", {
    get: () => new WebAssembly.Instance(compiled, imports).exports,
});
```

Next, create a directory called `assembly`, and in that directory, create a file called `tsconfig.json` in the following way:

```json
{
    "extends": "../node_modules/assemblyscript/std/assembly.json",
    "include": ["./**/*.ts"]
}
```

## Sample smart contract

In the `assembly` directory, also create an `index.ts` file, where the code for the contract needs to go.

You can use the following sample snippet, which demonstrates a simple smart contract that immediately returns an error and writes a message to a block when executed on the Casper Network.

```typescript
//@ts-nocheck
import { Error, ErrorCode } from "casper-contract/error";

// simplest possible feedback loop
export function call(): void {
    Error.fromErrorCode(ErrorCode.None).revert(); // ErrorCode: 1
}
```

If you prefer a more complicated first contract, you can look at example contracts on the [Casper Ecosystem GitHub](https://github.com/casper-ecosystem) repository for inspiration.

## Compile to WASM

To compile the contract to WASM, use _npm_ to run the _asbuild_ script from the project root:

```
npm run asbuild
```

If the build is successful, there will be a `dist` folder in the `root` folder and in it should be `your-contract-name.wasm`.
