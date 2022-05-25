"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[84],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var a=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,s=function(e,t){if(null==e)return{};var n,a,s={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,s=e.mdxType,r=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(n),h=s,m=u["".concat(l,".").concat(h)]||u[h]||d[h]||r;return n?a.createElement(m,o(o({ref:t},p),{},{components:n})):a.createElement(m,o({ref:t},p))}));function h(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var r=n.length,o=new Array(r);o[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:s,o[1]=i;for(var c=2;c<r;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9304:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return d}});var a=n(3117),s=n(102),r=(n(7294),n(3905)),o=(n(4996),["components"]),i={tags:["smart contract developers","rust","put-deploy"]},l="Calling Contracts with the Rust Client",c={unversionedId:"dapp-dev-guide/writing-contracts/calling-contracts",id:"dapp-dev-guide/writing-contracts/calling-contracts",title:"Calling Contracts with the Rust Client",description:"Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts with the Casper command-line client and the put-deploy command.",source:"@site/source/docs/casper/dapp-dev-guide/writing-contracts/calling-contracts.md",sourceDirName:"dapp-dev-guide/writing-contracts",slug:"/dapp-dev-guide/writing-contracts/calling-contracts",permalink:"/dapp-dev-guide/writing-contracts/calling-contracts",editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/dapp-dev-guide/writing-contracts/calling-contracts.md",tags:[{label:"smart contract developers",permalink:"/tags/smart-contract-developers"},{label:"rust",permalink:"/tags/rust"},{label:"put-deploy",permalink:"/tags/put-deploy"}],version:"current",frontMatter:{tags:["smart contract developers","rust","put-deploy"]},sidebar:"dapp-dev-guide",previous:{title:"Installing Contracts and Querying Global State",permalink:"/dapp-dev-guide/writing-contracts/installing-contracts"},next:{title:"Upgrading and Maintaining Contracts",permalink:"/dapp-dev-guide/writing-contracts/upgrading-contracts"}},p={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Calling Contracts by Contract Hash",id:"calling-contracts-by-hash",level:2},{value:"Calling Contracts with Session Arguments",id:"calling-contracts-with-session-args",level:2},{value:"Calling Contracts by Package Hash",id:"calling-contracts-by-package-hash",level:2},{value:"Calling Contracts by Contract Name",id:"calling-contracts-by-name",level:2},{value:"Calling Contracts by Package Name",id:"calling-contracts-by-package-name",level:2},{value:"Calling a Contract using Wasm",id:"calling-a-contract-using-wasm",level:2},{value:"Calling Contracts that Return a Value",id:"calling-contracts-that-return-a-value",level:2},{value:"What&#39;s Next?",id:"whats-next",level:2}],u={toc:d};function h(e){var t=e.components,n=(0,s.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"calling-contracts-with-the-rust-client"},"Calling Contracts with the Rust Client"),(0,r.kt)("p",null,"Smart contracts exist as stored on-chain logic, allowing disparate users to call the included entry points. This tutorial covers different ways to call Casper contracts with the ",(0,r.kt)("a",{parentName:"p",href:"/workflow/setup/#the-casper-command-line-client"},"Casper command-line client")," and the ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command."),(0,r.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"You know how to ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/building-dapps/sending-deploys"},"send and verify deploys")),(0,r.kt)("li",{parentName:"ul"},"You know how to ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/writing-contracts/installing-contracts"},"install contracts and query global state")," using the ",(0,r.kt)("a",{parentName:"li",href:"/workflow/setup#the-casper-command-line-client"},"default Casper client"))),(0,r.kt)("h2",{id:"calling-contracts-by-hash"},"Calling Contracts by Contract Hash"),(0,r.kt)("p",null,"After ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/installing-contracts"},"installing a contract")," in global state, you can use the contract's hash to call one of its entry points. The following usage of ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," allows you to call an entry point, and you will receive a deploy hash. You need this hash to verify that the deploy executed successfully."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-hash [HEX_STRING] \\\n    --session-entry-point [ENTRY_POINT_FUNCTION]\n")),(0,r.kt)("p",null,"The arguments used above are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"node-address")," - An IP address of a peer on the network. The default port for JSON-RPC servers on Mainnet and Testnet is 7777"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"chain-name")," - The chain name to the network where you wish to send the deploy. For Mainnet, use ",(0,r.kt)("em",{parentName:"li"},"casper"),". For Testnet, use ",(0,r.kt)("em",{parentName:"li"},"casper-test")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"secret-key")," - The file name containing the secret key of the account paying for the deploy"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"payment-amount")," - The payment for the deploy in motes"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-hash")," - Hex-encoded hash of the stored contract to be called as the session"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-entry-point")," - Name of the method that will be used when calling the session contract")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Call a contract by hash:")),(0,r.kt)("p",null,"In this example from the ",(0,r.kt)("a",{parentName:"p",href:"/counter"},"Counter Contract Tutorial"),', a hash identifies a stored contract called "counter" with an entry-point called "counter-inc".'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-hash hash-22228188b85b6ee4a4a41c7e98225c3918139e9a5eb4b865711f2e409d85e88e \\\n    --session-entry-point "counter-inc"\n')),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"This ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command is nearly identical to the command used to ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/installing-contracts#installing-contract-code"},"install the contract"),". Here, instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"session-path")," pointing to the Wasm binary, we have ",(0,r.kt)("inlineCode",{parentName:"p"},"session-hash")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"session-entry-point")," identifying the on-chain contract and its associated function to execute. No Wasm file is needed in this example, since the contract is already on the blockchain and the entry point doesn\u2019t return a value. If an entry point returns a value, use code to ",(0,r.kt)("a",{parentName:"p",href:"dapp-dev-guide/tutorials/return-values-tutorial/"},"interact with runtime return values"),"."))),(0,r.kt)("p",null,"The sample response will contain a ",(0,r.kt)("inlineCode",{parentName:"p"},"deploy_hash"),", which you need to use as described ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/installing-contracts#querying-global-state"},"here"),", to verify the changes in global state."),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Sample put-deploy response")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'{\n  "id": 1197172763279676268,\n  "jsonrpc": "2.0",\n  "result": {\n    "api_version": "1.4.5",\n    "deploy_hash": "24b58fbc0cbbfa3be978e7b78b9b37fc1d17c887b1abed2b2e2e704f7ee5427c"\n  }\n}\n'))),(0,r.kt)("br",null),(0,r.kt)("h2",{id:"calling-contracts-with-session-args"},"Calling Contracts with Session Arguments"),(0,r.kt)("p",null,"You may need to pass in information using session arguments when calling contract entry points. The ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," allows you to do this with the ",(0,r.kt)("inlineCode",{parentName:"p"},"--session-arg")," option:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-hash [HEX_STRING] \\\n    --session-entry-point [ENTRY_POINT_FUNCTION] \\\n    --session-arg ["NAME:TYPE=\'VALUE\'" OR "NAME:TYPE=null"]...\n')),(0,r.kt)("p",null,"The arguments of interest are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-hash")," - Hex-encoded hash of the stored contract to be called as the session"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-entry-point")," - Name of the method that will be used when calling the session contract"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-arg")," - For simple CLTypes, a named and typed arg is passed to the Wasm code. To see an example for each type, run the casper-client with '--show-arg-examples'")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Use session arguments:")),(0,r.kt)("p",null,'This example demonstrates how to call a contract entry point "transfer" with two arguments; one argument specifies the recipient, and the other specifies the amount to be transferred.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy\n    --node-address http://3.143.158.19:7777 \\\n    --chain-name integration-test \\\n    --secret-key ~/casper/demo/user_b/secret_key.pem \\\n    --payment-amount "10000000000" \\\n    --session-hash hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180 \\\n    --session-entry-point "transfer" \\\n    --session-arg "recipient:key=\'account-hash-89422a0f291a83496e644cf02d2e3f9d6cbc5f7c877b6ba9f4ddfab8a84c2670\'" \\\n    --session-arg "amount:u256=\'20\'"\n')),(0,r.kt)("h2",{id:"calling-contracts-by-package-hash"},"Calling Contracts by Package Hash"),(0,r.kt)("p",null,"You can also call an entry point in a contract that is part of a contract package (see ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/upgrading-contracts"},"contract upgrades"),"). Call ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," using the stored package hash, the entry point you wish to access, the contract version number, and any runtime arguments. The call defaults to the highest enabled version if no version was specified."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-package-hash [HEX_STRING] \\\n    --session-entry-point [ENTRY_POINT_FUNCTION] \\\n    --session-version [INTEGER]\n")),(0,r.kt)("p",null,"The arguments of interest are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-package-hash")," - Hex-encoded hash of the stored package to be called as the session"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-entry-point")," - Name of the method that will be used when calling the session contract"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-version")," - Version of the called session contract. The latest will be used by default")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Call a contract using the package hash and version:")),(0,r.kt)("p",null,'In this example, we call a contract by its package hash and version number. The entry point invoked is "counter-inc", also from the ',(0,r.kt)("a",{parentName:"p",href:"/counter"},"Counter Contract Tutorial"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-package-hash hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e \\\n    --session-entry-point "counter-inc" \\\n    --session-version 1\n')),(0,r.kt)("p",null,"To find the contract package hash, look at the named keys associated with your contract. Here is an example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'{\n    "key": "hash-76a8c3daa6d6ac799ce9f46d82ac98efb271d2d64b517861ec89a06051ef019e",\n    "name": "counter_package_name"\n}\n')),(0,r.kt)("h2",{id:"calling-contracts-by-name"},"Calling Contracts by Contract Name"),(0,r.kt)("p",null,"We can also reference a contract using a key as the contract name. When you write the contract, use the ",(0,r.kt)("inlineCode",{parentName:"p"},"put_key")," function to add the ContractHash under the contract's ",(0,r.kt)("a",{parentName:"p",href:"https://docs.rs/casper-types/latest/casper_types/contracts/type.NamedKeys.html#"},"NamedKeys"),". The key you specify will enable you to reference the contract when calling it using ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'runtime::put_key("counter", contract_hash.into());\n')),(0,r.kt)("p",null,'This example code stores the ContractHash into a URef, which you can reference once you install the contract in global state. In this case, the ContractHash will be stored under the "counter" NamedKey.'),(0,r.kt)("p",null,"Having a key enables you to call a contract's entry-point in global state by using the ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command as illustrated here:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-name [NAMED_KEY_FOR_SMART_CONTRACT] \\\n    --session-entry-point [ENTRY_POINT_FUNCTION]\n")),(0,r.kt)("p",null,"The arguments of interest are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-name")," - Name of the stored contract (associated with the executing account) to be called as the session"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-entry-point")," - Name of the method that will be used when calling the session contract")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Call a contract using a named key:")),(0,r.kt)("p",null,'This example uses a counter contract stored in global state under the "counter" key defined in the code snippet above and an entry-point called "counter_inc" that increments the counter.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy \\\n    --node-address http://[NODE_IP]:7777 \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \\\n    --payment-amount 100000000 \\\n    --session-name "counter" \\\n    --session-entry-point "counter_inc"\n')),(0,r.kt)("p",null,"The sample response will contain a ",(0,r.kt)("inlineCode",{parentName:"p"},"deploy_hash"),", which you need to use as described ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/installing-contracts#querying-global-state"},"here"),", to verify the changes in global state."),(0,r.kt)("h2",{id:"calling-contracts-by-package-name"},"Calling Contracts by Package Name"),(0,r.kt)("p",null,"To call an entry point in a contract by referencing the contract package name, you can use the ",(0,r.kt)("inlineCode",{parentName:"p"},"session-package-name"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"session-entry-point"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"session-version")," arguments. This will enable you to access the entry-point in global state by using the ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command as illustrated here:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-package-name [NAMED_KEY_FOR_PACKAGE] \\\n    --session-entry-point [ENTRY_POINT_FUNCTION] \\\n    --session-version [INTEGER]\n")),(0,r.kt)("p",null,"The arguments of interest are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-package-name")," - Name of the stored package to be called as the session"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-entry-point")," - Name of the method that will be used when calling the session contract"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-version")," - Version of the called session contract. The latest will be used by default")),(0,r.kt)("p",null,"You should have previously created the contract by using ",(0,r.kt)("a",{parentName:"p",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_contract.html"},"new_contract"),", and provided the contract package name as the ",(0,r.kt)("inlineCode",{parentName:"p"},"hash_name")," argument of ",(0,r.kt)("inlineCode",{parentName:"p"},"new_contract"),"."),(0,r.kt)("p",null,'This example code stores the "contract_package_name" into a NamedKey, which you can reference once you install the contract in global state.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'\n    let (stored_contract_hash, contract_version) =\n        storage::new_contract(counter_entry_points,\n            Some(counter_named_keys),\n            Some("counter_package_name".to_string()),\n            Some("counter_access_uref".to_string())\n    );\n\n')),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Specify the package name and version number:")),(0,r.kt)("p",null,'This example calls the entry point "counter-inc" as part of the contract package name "counter_package_name", version 1, without any runtime arguments.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-package-name "counter_package_name" \\\n    --session-entry-point "counter-inc" \\\n    --session-version 1\n')),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Use the package name without specifying the version:")),(0,r.kt)("p",null,"This example demonstrates how to call a contract that is part of the ",(0,r.kt)("inlineCode",{parentName:"p"},"erc20_test_call")," package using runtime arguments. The call defaults to the highest enabled version since no version was specified."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'    casper-client put-deploy \\\n    --node-address http://3.143.158.19:7777 \\\n    --chain-name integration-test \\\n    --secret-key ~/casper/demo/user_a/secret_key.pem \\\n    --payment-amount 1000000000 \\\n    --session-package-name "erc20_test_call" \\\n    --session-entry-point "check_balance_of" \\\n    --session-arg "token_contract:account_hash=\'account-hash-b568f50a64acc8bbe43462ffe243849a88111060b228dacb8f08d42e26985180\'" \\\n    --session-arg "address:key=\'account-hash-303c0f8208220fe9a4de40e1ada1d35fdd6c678877908f01fddb2a56502d67fd\'"\n')),(0,r.kt)("h2",{id:"calling-a-contract-using-wasm"},"Calling a Contract using Wasm"),(0,r.kt)("p",null,"Session code or contract code (compiled to Wasm) can act on a contract and change its state. In this case, you would use the ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command as when ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/writing-contracts/installing-contracts"},"installing a contract"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address [NODE_SERVER_ADDRESS] \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [KEY_PATH]/secret_key.pem \\\n    --payment-amount [PAYMENT_AMOUNT_IN_MOTES] \\\n    --session-path [PATH]/[FILE_NAME].wasm\n")),(0,r.kt)("p",null,"The argument of interest is:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"session-path")," - The path to the compiled Wasm on your computer")),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"You will be charged ",(0,r.kt)("a",{parentName:"p",href:"/economics/gas-concepts/"},"gas fees")," for running session code or contract code on the network. However, you will not be charged for making ",(0,r.kt)("a",{parentName:"p",href:"dapp-dev-guide/sdkspec/json-rpc-informational/"},"RPC calls"),"."))),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Example - Session code acting on a contract:")),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/counter"},"Counter Contract Tutorial")," shows you how to change the state of a contract (counter-define.wasm) using session code (counter-call.wasm)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\ncasper-client put-deploy \\\n    --node-address http://[NODE_IP]:7777 \\\n    --chain-name [CHAIN_NAME] \\\n    --secret-key [PATH_TO_YOUR_KEY]/secret_key.pem \\\n    --payment-amount 25000000000 \\\n    --session-path [PATH_TO_YOUR_COMPILED_WASM]/counter-call.wasm\n\n")),(0,r.kt)("h2",{id:"calling-contracts-that-return-a-value"},"Calling Contracts that Return a Value"),(0,r.kt)("p",null,"Visit the ",(0,r.kt)("a",{parentName:"p",href:"dapp-dev-guide/tutorials/return-values-tutorial/"},"Interacting with Runtime Return Values")," tutorial to learn how to call a contract that returns a value using session code or contract code."),(0,r.kt)("h2",{id:"whats-next"},"What's Next?"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The ",(0,r.kt)("a",{parentName:"li",href:"/counter"},"Counter Contract Tutorial")," takes you through a detailed walkthrough on how to query global state to verify a contract's state"),(0,r.kt)("li",{parentName:"ul"},"Also, look into the ",(0,r.kt)("a",{parentName:"li",href:"/tutorials/"},"Tutorials for Smart Contract Authors")),(0,r.kt)("li",{parentName:"ul"},"See the rest of the ",(0,r.kt)("a",{parentName:"li",href:"/workflow/#developer-guides"},"Developer How To Guides"))))}h.isMDXComponent=!0}}]);