---
title: Moving to Casper
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Moving to Casper from another Blockchain {#moving-to-casper}

This page covers various considerations for moving to Casper from another blockchain by comparing Casper to Ethereum, Near, Aptos, and Solana in these aspects:

1. [Smart Contract Platform Overview](#contract-overview)
2. [Variable Storage and State Management](#variable-storage)
3. [Contract Functions](#contract-functions)
4. [Passing Arguments](#passing-arguments)

Since other blockchain projects use different technologies, it is essential to consider how those technologies serve your use case.

When choosing a blockchain, it is also essential to compare consensus mechanisms, tokenomics, cross-contract capabilities, contract upgradability, and software development kits (SDKs) as described [here](#additional-considerations).

## Smart Contract Platform {#contract-overview}

<Tabs>
<TabItem value="Casper" label="Casper">

Casper smart contracts are written in Rust. 

Variables defined within the smart contract can be stored as either [Named Keys](../developers/json-rpc/types_chain.md#namedkey) or [Dictionaries](../concepts/dictionaries.md) as described in [Reading and Writing Data to the Blockchain](../concepts/design/reading-and-writing-to-the-blockchain.md).

The `call` function serves as the main entry point of the [smart contract](../developers/writing-onchain-code/simple-contract.md). It automatically executes when the smart contract is installed, setting the initial state of the contract and defining all other entry points.

It's worth noting that Casper only supports public entry points for contracts. Additionally, contracts can be defined as upgradable or immutable as described [here](../developers/writing-onchain-code/upgrading-contracts.md).

</TabItem>
<TabItem value="Ethereum" label="Ethereum">

Ethereum smart contracts are primarily written in Solidity, a programming language specifically designed for this purpose. These contracts comprise a collection of global variables that persist on the blockchain and define the contract's state.

Furthermore, Ethereum smart contracts feature a constructor that specifies an initial state after deployment on the blockchain. Public functions declared within the contract can be invoked from outside the blockchain.

In terms of immutability, Ethereum smart contracts are inherently immutable once deployed. However, design patterns such as "Proxy" or "Diamond" facilitate versioning contracts on the Ethereum blockchain.

Solidity smart contracts adhere to object-oriented programming principles and support features such as inheritance and libraries.

</TabItem>
<TabItem value="Near" label="Near">

Near smart contracts can be written in JavaScript or Rust, and the Near SDK can pack the code with lightweight runtime. This can be compiled into a single WebAssembly file and deployed on the NEAR network. 

In the Near ecosystem, smart contracts function as classes. The constructor, referred to as the "init" method, can receive attributes required for initializing the contract's initial state.

All public methods defined within the contract serve as its interface, exposing its functionality. 

Near smart contracts are immutable, but their state can change as transactions are executed. Contracts can also be upgraded by deploying new versions of the contract.  The Near blockchain provides various capabilities for versioning, including state migrations, state versioning, and contract self-updates.

</TabItem>
<TabItem value="Aptos" label="Aptos">

The Aptos programming language is known as Move. Its primary concepts revolve around scripts and modules. Scripts enable developers to incorporate additional logic into transactions, while modules allow them to expand blockchain functionality or create custom smart contracts. 

A distinctive feature of Move is the concept of Resources, which are specialized structures representing assets. This design allows resources to be managed similarly to other data types in Aptos, such as vectors or structs.

A smart contract in the Aptos blockchain is called a Module. It is always connected with an account address. The modules have to be compiled to call functions in the Module.

The Module's public methods are its interface and can be invoked from code outside the blockchain.

Module code can be upgraded and changed under the account address, which does not change. The upgrade is only accepted if the code is backward compatible.

</TabItem>
<TabItem value="Solana" label="Solana">

Solana smart contracts are primarily written in Rust. 

Unlike other blockchain platforms, Solana's smart contracts are stateless and solely focus on program logic. The management of the contract state is handled at the account level, separating the state stored within the account and the contract logic defined in the programs.

Smart contracts are commonly referred to as on-chain programs. These programs expose their interface as a public entry point, allowing external interaction. 

It is worth noting that Solana programs can be updated using an authority known as the "update authority," which holds the necessary permissions for making modifications to the program.

</TabItem>
</Tabs>

## Variable Storage and State Management {#variable-storage}

<Tabs>
<TabItem value="Casper" label="Casper">

Variables can be stored as Named Keys or Dictionaries as described in [Reading and Writing Data to the Blockchain](../concepts/design/reading-and-writing-to-the-blockchain.md).

Additionally, local variables are available within the entry points and can be used to perform necessary actions or computations within the scope of each entry point.

</TabItem>
<TabItem value="Ethereum" label="Ethereum">

The variables within the contract are responsible for storing the state of the contract at a specific moment in time. However, it's important to note that local variables used within the call functions are not stored in the contract's state. Instead, they are employed solely for computational purposes within those specific functions.

State variables must be strongly typed so that the smart contract compiler can enforce type consistency and ensure the storage space aligns with the declared data types. Strong typing promotes code correctness and prevents potential data corruption or memory-related issues related to the contract's state variables.

</TabItem>
<TabItem value="Near" label="Near">

Variables in the contract can be stored as native types, SDK collections, or internal structures. SDK collections offer advantages over native types. 

Additionally, there is a distinction between class attributes and local variables. Class attributes represent the state of the contract, while local variables are specific to the invocation of a function and have no impact on the contract's overall state.

SDK Collections are typical when creating state variables because they provide convenient data structures such as lists, maps, and sets. These data structures can organize and manage complex data within the contract's storage. Using SDK Collections ensures efficient storage and facilitates easier access and data management in the smart contract.

</TabItem>
<TabItem value="Aptos" label="Aptos">

Aptos employs primitive types, such as integers, booleans, and addresses, to represent variables. These elementary types can be combined to create structures, but it's important to note that struct definitions are only permitted within Modules. 

Aptos advises developers to cluster related data into Resources for efficient data management and organization. Resources represent assets or specific data entities on the blockchain. By grouping data into Resources, you can maintain logical coherence and improve the readability and maintainability of the code.

The Aptos blockchain introduces a tree-shaped persistent global storage that allows read and write operations. Global storage consists of trees originating from an account address.

</TabItem>
<TabItem value="Solana" label="Solana">

Variables can be utilized locally within the execution context of a specific entry point. They are limited to the scope of that entry point and not accessible outside of it. These variables can be defined as elementary types such as bool, String, int, etc.

Data persists in structs within the account. The Binary Object Representation Serializer for Hashing (Borsh) facilitates the serialization and deserialization of these structs. The process involves reading the data from the account, deserializing it to obtain the values it contains, updating the values, and then serializing the modified data to save the new values back into the account.

</TabItem>
</Tabs>


## Contract Functions {#contract-functions}

<Tabs>
<TabItem value="Casper" label="Casper">

For Casper smart contracts, public functions are called entry points. To declare them, the following format is used:

```rust
#[no_mangle]
pub extern "C" fn counter_inc() {
    
    // Entry point body
}
```

It's important to note that entry points do not have input arguments in their definition, but the arguments can be accessed using the [RuntimeArgs](https://docs.rs/casper-types/latest/casper_types/struct.RuntimeArgs.html) passed to the contract. Entry points are instantiated within the `call` entry point.

If a return value is needed, it should be declared using the syntax described in the [Interacting with Runtime Return Values](../resources/advanced/return-values-tutorial.md) tutorial.

```rust
runtime::ret(value);
```

Each call to an entry point is treated as a [Deploy](../concepts/deploy-and-deploy-lifecycle.md) to the network, and therefore, each call incurs a cost paid in motes (the network's native accounting unit).

</TabItem>
<TabItem value="Ethereum" label="Ethereum">

On Ethereum, public methods serve two purposes: they can be used to execute contract logic and modify the contract's state, or they can be utilized to retrieve data stored within the contract's state.

The declaration of public methods in Ethereum follows the format:

```bash
function update_name(string value) public {
    dapp_name = value;
}
```

In cases where a public method only returns a value without modifying the state, it should be defined as follows:

```bash
function balanceOf(address _owner) public view returns (uint256 return_parameter) { }
```

It is worth noting that public view methods on Ethereum, which solely retrieve data without making state changes, do not consume gas.

</TabItem>
<TabItem value="Near" label="Near">

In the Near blockchain, there are three types of public functions:

- **Init Methods** - These are used as the class constructors to initialize the state of the contract.
- **View Methods** - These functions are used to read the state of the contract variables.
- **Call Methods** - These methods can mutate the state of the contract and perform specific actions, such as calling another contract.

The definition of public methods in Near is as follows:

```rust
pub fn add_message(&mut self, ...) { }
```

For public methods that return variables, the definition would be:

```rust
pub fn get_messages(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<PostedMessage> { }
```

The actual implementation of the functions may include the necessary parameters and logic based on the contract's specific requirements.

</TabItem>
<TabItem value="Aptos" label="Aptos">

Public functions in Aptos are similar to public methods or functions found in other blockchain networks. The definition of a public function in Aptos appears as follows:

```rust
public fun start_collection(account: &signer) {}
```

For public functions that return variables, the definition would be as follows:

```rust
public fun max(a: u8, b: u8): (u8, bool) {}
```

In the Aptos blockchain, it is possible to return one or more values from a function.

</TabItem>
<TabItem value="Solana" label="Solana">

In Solana, functions are defined as public entry points that act as interfaces visible to the network. The declaration of an entry point follows this format:

```rust
entrypoint!(process_instruction);
```

The implementation of the entry point may resemble the following:

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {}
```

Within the entry point function, the necessary parameters are specified, such as `program_id`, which represents the program's identifier, `accounts`, an array of `AccountInfo` providing account details, and `_instruction_data`, representing the instruction data received. The function returns a `ProgramResult`, which indicates the success or failure of the instruction execution.

</TabItem>
</Tabs>

## Passing Arguments {#passing-arguments}

<Tabs>
<TabItem value="Casper" label="Casper">


Named arguments are passed as strings with type specifiers. To provide session arguments to the entry point during a Deploy, you can utilize the following approach:

```bash
casper-client put-deploy \
  --node-address http://65.21.235.219:7777 \
  --chain-name casper-test \
  --secret-key [KEY_PATH]/secret_key.pem \
  --payment-amount 2500000000 \
  --session-hash hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2 \
  --session-entry-point "delegate" \
  --session-arg "validator:public_key='0145fb72c75e1b459839555d70356a5e6172e706efa204d86c86050e2f7878960f'" \
  --session-arg "amount:u512='500000000000'" \
  --session-arg "delegator:public_key='0154d828baafa6858b92919c4d78f26747430dcbecb9aa03e8b44077dc6266cabf'"
```

To understand the context of this example, refer to: [Delegating with the Casper Client](../developers/cli/delegate.md).

In the contract, you can access the session arguments as follows:

```bash
let uref: URef = runtime::get_key(Key_Name)
```

Use the `get_key` function to retrieve the desired session argument by specifying the key's name.

If you are uncertain how to use the `get_key` function to obtain a specific session argument, check how to [write a basic smart contract on Casper](../developers/writing-onchain-code/simple-contract.md).

</TabItem>
<TabItem value="Ethereum" label="Ethereum">

Ethereum uses strongly typed function arguments, and developers must explicitly define the input and return variables. The compiler checks the correctness of the arguments passed to the functions during runtime. As a result, developers must explicitly specify the argument and return types in the function signature. The compiler ensures that the provided arguments adhere to the specified types, helping to catch type-related errors and ensure type safety.

By enforcing strong typing, the compiler helps prevent potential runtime errors and enhances code reliability by verifying the compatibility of the passed arguments and expected return types.

</TabItem>
<TabItem value="Near" label="Near">

Strongly typed function arguments require explicitly defining the input and return variables. By enforcing strong typing, the programming language ensures that the arguments passed to a function match the expected types, preventing type-related errors and promoting code correctness. Strong typing provides additional clarity and safety by explicitly stating the data types of the function's inputs and outputs.

</TabItem>
<TabItem value="Aptos" label="Aptos">

Like Near, Aptos requires strongly typed function arguments, thus preventing type-related errors and promoting code correctness.

</TabItem>
<TabItem value="Solana" label="Solana">

Like Near and Aptos, Solana requires strongly typed function arguments, thus, preventing type-related errors and promoting code correctness.

</TabItem>
</Tabs>


## Additional Considerations {#additional-considerations}

When choosing a blockchain, you may also look into the network's consensus mechanism, the tokenomics or economic model, cross-contract communication, smart contract upgrades, and the available software development kits (SDKs).

1. **Consensus mechanism** refers to the algorithm the blockchain network uses to achieve agreement on the validity and ordering of transactions. Different blockchains employ various consensus mechanisms such as Proof-of-Work (PoW), Proof-of-Stake (PoS), or Delegated Proof-of-Stake (DPoS). The choice of consensus mechanism impacts factors like security, scalability, and energy efficiency.

2. **Tokenomics** relates to the economic model of the blockchain network and its native tokens, involving token distribution, inflation, utility, and governance. Understanding the tokenomics of the network is crucial for evaluating the ecosystem's long-term viability and potential value.

3. **Cross-contract capabilities** refer to the ability of smart contracts to interact and communicate within the blockchain network. This feature is essential for building complex decentralized applications (dApps) and implementing inter-contract functionality.

4. **Contract upgradability** determines whether the smart contracts installed on the network can be modified or updated after installation. It is essential to assess the flexibility of the chosen blockchain in terms of contract maintenance, bug fixes, and incorporating new features or improvements without disrupting the existing ecosystem.

5. **SDK availability** also plays a significant role in the development process. SDKs provide tools, libraries, and documentation to simplify the creation of applications and smart contracts on the blockchain. Evaluating the maturity, community support, and compatibility of the available SDKs is crucial for developers.

Considering these aspects helps when selecting a blockchain that aligns with a project or application's specific requirements and goals. 

The Casper ecosystem aims to fulfill all of these aspects, including supporting enterprise-grade projects.