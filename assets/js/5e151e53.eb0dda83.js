"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[8072],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=d(n),f=o,h=u["".concat(l,".").concat(f)]||u[f]||p[f]||r;return n?a.createElement(h,s(s({ref:t},c),{},{components:n})):a.createElement(h,s({ref:t},c))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,s=new Array(r);s[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,s[1]=i;for(var d=2;d<r;d++)s[d]=n[d];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},3570:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return p}});var a=n(3117),o=n(102),r=(n(7294),n(3905)),s=["components"],i={},l="Sending Deploys to a Casper network using the Rust Client",d={unversionedId:"dapp-dev-guide/building-dapps/sending-deploys",id:"dapp-dev-guide/building-dapps/sending-deploys",title:"Sending Deploys to a Casper network using the Rust Client",description:"Ultimately, smart contracts are meant to run on the blockchain. You can send your contract to the network via a Deploy. To do this, you will need to meet a few prerequisites:",source:"@site/source/docs/casper/dapp-dev-guide/building-dapps/sending-deploys.md",sourceDirName:"dapp-dev-guide/building-dapps",slug:"/dapp-dev-guide/building-dapps/sending-deploys",permalink:"/dapp-dev-guide/building-dapps/sending-deploys",editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/dapp-dev-guide/building-dapps/sending-deploys.md",tags:[],version:"current",lastUpdatedAt:1676046800,formattedLastUpdatedAt:"2/10/2023",frontMatter:{},sidebar:"dapp-dev-guide",previous:{title:"Signing Deploys",permalink:"/dapp-dev-guide/building-dapps/signing-a-deploy"},next:{title:"Calling Contracts",permalink:"/dapp-dev-guide/building-dapps/calling-contracts"}},c={},p=[{value:"Paying for Deploys",id:"paying-for-deploys",level:2},{value:"Monitoring the Event Stream for Deploys",id:"monitoring-the-event-stream-for-deploys",level:2},{value:"Sending a Deploy to the Network",id:"sending-the-deploy",level:2},{value:"Time-to-live",id:"ttl",level:3},{value:"Deploy Payments",id:"deploy-payments",level:3},{value:"Using Arguments with Deploys",id:"using-arguments-with-deploys",level:2},{value:"Advanced Features",id:"advanced-features",level:2},{value:"A Note about Gas Price",id:"a-note-about-gas-price",level:2}],u={toc:p};function f(e){var t=e.components,n=(0,o.Z)(e,s);return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"sending-deploys-to-a-casper-network-using-the-rust-client"},"Sending Deploys to a Casper network using the Rust Client"),(0,r.kt)("p",null,"Ultimately, smart contracts are meant to run on the blockchain. You can send your contract to the network via a ",(0,r.kt)("a",{parentName:"p",href:"/design/casper-design/#execution-semantics-deploys"},"Deploy"),". To do this, you will need to meet a few prerequisites:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"You will need a client to interact with the network, such as the ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup#the-casper-command-line-client"},"default Casper client")),(0,r.kt)("li",{parentName:"ul"},"Ensure you have an ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup#setting-up-an-account"},"Account")," and its associated ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/keys"},"keys")," This account will pay for the Deploy, and its secret key will sign the Deploy"),(0,r.kt)("li",{parentName:"ul"},"Ensure this account has enough CSPR tokens to pay for the Deploy")),(0,r.kt)("h2",{id:"paying-for-deploys"},"Paying for Deploys"),(0,r.kt)("p",null,"CSPR tokens are used to pay for transactions on the Casper Mainnet and Testnet. There are several ways to fund your account:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"You may want to ",(0,r.kt)("a",{parentName:"li",href:"/workflow/users/funding-from-exchanges"},"transfer tokens from an exchange")),(0,r.kt)("li",{parentName:"ul"},"You can use a ",(0,r.kt)("a",{parentName:"li",href:"/workflow/users/token-transfer/"},"block explorer to transfer tokens")," between accounts' purses"),(0,r.kt)("li",{parentName:"ul"},"You can also ",(0,r.kt)("a",{parentName:"li",href:"/workflow/developers/transfers/"},"transfer tokens using the default Casper client")),(0,r.kt)("li",{parentName:"ul"},"On the Testnet, you can use the ",(0,r.kt)("a",{parentName:"li",href:"/workflow/users/testnet-faucet/"},"faucet functionality")," for testing your smart contracts")),(0,r.kt)("h2",{id:"monitoring-the-event-stream-for-deploys"},"Monitoring the Event Stream for Deploys"),(0,r.kt)("p",null,"If you want to follow the ",(0,r.kt)("a",{parentName:"p",href:"/design/casper-design/#execution-semantics-phases"},"lifecycle")," of the Deploy, you can start monitoring a node's event stream. This section will focus only on DeployAccepted events, but there are other event types described ",(0,r.kt)("a",{parentName:"p",href:"/dapp-dev-guide/building-dapps/monitoring-events"},"here"),". You need the following information to proceed:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The IP address of a ",(0,r.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup/#acquire-node-address-from-network-peers"},"peer")," on the network"),(0,r.kt)("li",{parentName:"ul"},"The port specified as the ",(0,r.kt)("inlineCode",{parentName:"li"},"event_stream_server.address")," in the node's ",(0,r.kt)("em",{parentName:"li"},"config.toml"),", which is by default 9999 on Mainnet and Testnet"),(0,r.kt)("li",{parentName:"ul"},"The URL for DeployAccepted events, which is <HOST:PORT>/events/deploys")),(0,r.kt)("p",null,"With the following command, you can start watching the event stream for DeployAccepted events. Note the event ID recorded when you send the Deploy in the next section."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://65.21.235.219:9999/events/deploys\n")),(0,r.kt)("h2",{id:"sending-the-deploy"},"Sending a Deploy to the Network"),(0,r.kt)("p",null,"You can call the Casper client's ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command to put the compiled contract on the chain. In this example, the Deploy will execute in the account's context. See the ",(0,r.kt)("a",{parentName:"p",href:"#advanced-features"},"advanced features")," section for key delegation."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy \\\n    --node-address <HOST:PORT> \\\n    --chain-name casper-test \\\n    --secret-key <PATH> \\\n    --payment-amount <PAYMENT-AMOUNT> \\\n    --session-path <SESSION-PATH>\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"node-address")," - An IP address of a peer on the network. The default port of nodes' JSON-RPC servers on Mainnet and Testnet is 7777. You can find a list of trusted peers in network's configuration file, ",(0,r.kt)("inlineCode",{parentName:"li"},"config.toml"),". Here is an ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/casper-network/casper-node/blob/dev/resources/production/config-example.toml#L131"},"example"),". You may send deploys to one of the trusted nodes or use them to query other online nodes."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"secret-key")," - The file name containing the secret key of the account paying for the Deploy"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"chain-name")," - The chain-name to the network where you wish to send the Deploy. For Mainnet, use ",(0,r.kt)("em",{parentName:"li"},"casper"),". For Testnet, use ",(0,r.kt)("em",{parentName:"li"},"casper-test"),". As you can see, this example uses the Testnet"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"payment-amount")," - The payment for the Deploy in motes. This example uses 2.5 CSPR, but you need to modify this for your contract. See the ",(0,r.kt)("a",{parentName:"li",href:"#a-note-about-gas-price"},"note")," below"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"session-path")," - The path to the contract Wasm, which should point to wherever you compiled the contract (.wasm file) on your computer")),(0,r.kt)("p",null,"Once you call this command, it will return a deploy hash, which you will need to verify that the deploy was accepted by the node. Sending a deploy to the network does not mean that the transaction was processed successfully. Once the network has received the deploy and done some preliminary validation of it, it will queue up in the system before being proposed in a block for execution. Therefore, you will need to check to see that the contract was executed as expected."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Note"),": Each Deploy gets a unique hash, which is part of the cryptographic security of blockchain technology. No two deploys will ever return the same hash."),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Sample put-deploy result"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "id": -6958186952964949950,\n    "jsonrpc": "2.0",\n    "result": {\n        "api_version": "1.4.5",\n        "deploy_hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496"\n    }\n}\n'))),(0,r.kt)("p",null,"Verify the deploy details with the ",(0,r.kt)("inlineCode",{parentName:"p"},"get-deploy")," command and the ",(0,r.kt)("inlineCode",{parentName:"p"},"deploy_hash")," received above."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client get-deploy \\\n    --node-address <HOST:PORT> <DEPLOY-HASH>\n")),(0,r.kt)("p",null,"If the Deploy succeeded, the ",(0,r.kt)("inlineCode",{parentName:"p"},"get-deploy")," command would return a JSON object with the full deploy details."),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Sample get-deploy result"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "id": -3532286620275982221,\n    "jsonrpc": "2.0",\n    "result": {\n        "api_version": "1.4.5",\n        "deploy": {\n            "approvals": [\n                {\n                    "signature": "015a7b0178e144fbf5ce52147c44a3e6bd6aae898ec6bb47c97b5802f3bcb6cd26331f7db18464cd1e51764c14ceb24b7ab9c4e3595505c32465fc0702e8d5510b",\n                    "signer": "01e76e0279a08b96d9d68e6b86c618de24a0c324d7d0c1fa8c035f0bc2af1a396d"\n                }\n            ],\n            "hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",\n            "header": {\n                "account": "01e76e0279a08b96d9d68e6b86c618de24a0c324d7d0c1fa8c035f0bc2af1a396d",\n                "body_hash": "b1956600be3c11d7555ada11426ab1a8bdf36102f59838d6bf69cec321111a22",\n                "chain_name": "casper-test",\n                "dependencies": [],\n                "gas_price": 1,\n                "timestamp": "2022-03-24T12:05:57.579Z",\n                "ttl": "30m"\n            },\n            "payment": {\n                "ModuleBytes": {\n                    "args": [\n                        [\n                            "amount",\n                            {\n                                "bytes": "05000c774203",\n                                "cl_type": "U512",\n                                "parsed": "14000000000"\n                            }\n                        ]\n                    ],\n                    "module_bytes": ""\n                }\n            },\n            "session": {\n                "ModuleBytes": {\n                    "args": [],\n                    "module_bytes": "[94478 hex chars]"\n                }\n            }\n        },\n        "execution_results": [\n            {\n                "block_hash": "098b618878a2413393925e1fbf6d3cf92f1208f4f8662a904e86b49b0c4ab9f0",\n                "result": {\n                    "Success": {\n                        "cost": "13327900740",\n                        "effect": {\n                            "operations": [],\n                            "transforms": [\n                                {\n                                    "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474",\n                                    "transform": {\n                                        "WriteCLValue": {\n                                            "bytes": "0500279bd1ca",\n                                            "cl_type": "U512",\n                                            "parsed": "871100000000"\n                                        }\n                                    }\n                                },\n                                {\n                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",\n                                    "transform": {\n                                        "AddUInt512": "14000000000"\n                                    }\n                                },\n                                {\n                                    "key": "uref-82a7b5713f2b9b3f9e1b4f2d1f312a5fec7c3a0bed6fa897501913951729dbbf-000",\n                                    "transform": {\n                                        "WriteCLValue": {\n                                            "bytes": "00000000",\n                                            "cl_type": "I32",\n                                            "parsed": 0\n                                        }\n                                    }\n                                },\n                                {\n                                    "key": "uref-ea022d75ff618533baf46040cc57692fb7f7840774c979c9dec0b5c3ddcec7e9-000",\n                                    "transform": {\n                                        "WriteCLValue": {\n                                            "bytes": "",\n                                            "cl_type": "Unit",\n                                            "parsed": null\n                                        }\n                                    }\n                                },\n                                {\n                                    "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",\n                                    "transform": "WriteContractPackage"\n                                },\n                                {\n                                    "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-3b69bafcc13b4541dddd7d5492e4754feee41c636990aeb6bf78d58fdd39fc43",\n                                    "transform": "WriteContractWasm"\n                                },\n                                {\n                                    "key": "hash-c39dd923df84c637e46e46a8a3326fcf85e43c60814878f44a08efd0074cb523",\n                                    "transform": "WriteContract"\n                                },\n                                {\n                                    "key": "hash-4d0e2bfb5d243ea567e9b37aa8229d2b8b01de838c4bd7ca570a178e012d6b82",\n                                    "transform": "WriteContractPackage"\n                                },\n                                {\n                                    "key": "account-hash-f407926760b91c2ce3af8bda7448841b3aa68c6e98053331d10819ef2d0a808e",\n                                    "transform": {\n                                        "AddKeys": [\n                                            {\n                                                "key": "hash-c39dd923df84c637e46e46a8a3326fcf85e43c60814878f44a08efd0074cb523",\n                                                "name": "counter"\n                                            }\n                                        ]\n                                    }\n                                },\n                                {\n                                    "key": "deploy-34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",\n                                    "transform": {\n                                        "WriteDeployInfo": {\n                                            "deploy_hash": "34550c8b86d5e38260882466e98427c62a27a96d85c13f49041a1579ebf84496",\n                                            "from": "account-hash-f407926760b91c2ce3af8bda7448841b3aa68c6e98053331d10819ef2d0a808e",\n                                            "gas": "13327900740",\n                                            "source": "uref-3a61ed9a3b472f35f4cf1e241d674fad8a5f9509c97a56d62bb03f7bcc4b8474-007",\n                                            "transfers": []\n                                        }\n                                    }\n                                },\n                                {\n                                    "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453",\n                                    "transform": "Identity"\n                                },\n                                {\n                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",\n                                    "transform": {\n                                        "WriteCLValue": {\n                                            "bytes": "00",\n                                            "cl_type": "U512",\n                                            "parsed": "0"\n                                        }\n                                    }\n                                },\n                                {\n                                    "key": "balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453",\n                                    "transform": {\n                                        "AddUInt512": "14000000000"\n                                    }\n                                }\n                            ]\n                        },\n                        "transfers": []\n                    }\n                }\n            }\n        ]\n    }\n}\n'))),(0,r.kt)("p",null,"We want to draw your attention to a few properties in the example output:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Execution cost 13327900740 motes, yet we paid 14000000000 motes. See the ",(0,r.kt)("a",{parentName:"li",href:"#a-note-about-gas-price"},"note about gas price")),(0,r.kt)("li",{parentName:"ul"},'The contract returned no errors. If you see an "Out of gas error", you did not specify a high enough value in the ',(0,r.kt)("inlineCode",{parentName:"li"},"--payment-amount")," arg"),(0,r.kt)("li",{parentName:"ul"},"The time-to-live was 30 minutes")),(0,r.kt)("p",null,"It is also possible to get a summary of the deploy's information by performing a ",(0,r.kt)("inlineCode",{parentName:"p"},"query-global-state")," command using the Casper client and providing a state root hash or a block hash from a block at or after the one in which the deploy was executed."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client get-state-root-hash --node-address <HOST:PORT>\n\ncasper-client query-global-state --node-address <HOST:PORT> \\\n    --key deploy-<DEPLOY-HASH-HEX-STRING> \\\n    --state-root-hash <STATE-ROOT-HASH-HEX-STRING>\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client query-global-state --node-address <HOST:PORT> \\\n    --key deploy-<DEPLOY-HASH-HEX STRING>\n    --block-hash <BLOCK-HASH-HEX-STRING>\n")),(0,r.kt)("p",null,"Run the help command for ",(0,r.kt)("inlineCode",{parentName:"p"},"query-global-state")," to see its usage."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client query-global-state --help\n")),(0,r.kt)("h3",{id:"ttl"},"Time-to-live"),(0,r.kt)("p",null,"Time-to-live is the parameter that determines how long a deploy will wait for execution. The acceptable maximum ",(0,r.kt)("inlineCode",{parentName:"p"},"ttl")," is configurable by chain, with the Casper Mainnet maximum set to ",(0,r.kt)("inlineCode",{parentName:"p"},"1day"),". If you are sending a deploy to a different network, you will need to check ",(0,r.kt)("inlineCode",{parentName:"p"},"chainspec.toml")," for that network to determine the acceptable maximum. The minimum is theoretically zero, but this will result in an immediate expiration and an invalid deploy."),(0,r.kt)("p",null,"In the event of a network outage or other event that prevents execution within the ",(0,r.kt)("inlineCode",{parentName:"p"},"ttl"),", the solution is to resend the deploy in question."),(0,r.kt)("p",null,"Should the deploy's ",(0,r.kt)("inlineCode",{parentName:"p"},"ttl")," exceed the allowable limit, or if the deploy expires, the network's deploy acceptor will find the deploy invalid and return a warning."),(0,r.kt)("h3",{id:"deploy-payments"},"Deploy Payments"),(0,r.kt)("p",null,"Dependent upon the complexity and needs of the Deploy in question, several options exist to allow users to pay for smart contract execution."),(0,r.kt)("p",null,"The simplest way to pay for a Deploy on the Casper blockchain is to use the host side standard payment functionality. This can be done using an ",(0,r.kt)("strong",{parentName:"p"},"empty")," ",(0,r.kt)("inlineCode",{parentName:"p"},"ModuleBytes")," as your payment code. However, you must specify the amount within a runtime argument. ",(0,r.kt)("inlineCode",{parentName:"p"},"ModuleBytes")," can also serve as a custom payment contract if it is not empty, but any additional Wasm ran within will come at an additional cost on top of the payment. This includes invalid Wasm, which will still result in additional cost."),(0,r.kt)("p",null,"You may find the host side functionality of standard payment insufficient for your purposes. In this event, Casper provides the following options for custom payment code:"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"StoredContractByHash")),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"StoredContractByName")),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"StoredVersionContractByHash")),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"StoredVersionContractByName")),(0,r.kt)("h2",{id:"using-arguments-with-deploys"},"Using Arguments with Deploys"),(0,r.kt)("p",null,"The session Wasm (or payment Wasm if you choose to ",(0,r.kt)("em",{parentName:"p"},"not"),' use the standard payment) of a Deploy often requires arguments to be passed to it when executed. These "runtime args" should be provided by using the ',(0,r.kt)("inlineCode",{parentName:"p"},"--session-arg")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"--payment-arg")," options, once for each arg required. The Casper client provides some examples of how to do this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"casper-client put-deploy --show-arg-examples\n")),(0,r.kt)("h2",{id:"advanced-features"},"Advanced Features"),(0,r.kt)("p",null,"Casper networks support complex deploys using multiple signatures. ",(0,r.kt)("a",{parentName:"p",href:"/design/casper-design/#accounts-head"},"Casper Accounts")," use a powerful permissions model that enables a multi-signature scheme for deploys."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"put-deploy")," command performs multiple actions under the hood, optimizing the typical use case. It creates a deploy, signs it, and sends the Deploy to the network without allowing multiple signatures. However, it is possible to call the following three commands and separate key management from account creation:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"make-deploy")," - Creates a Deploy and outputs it to a file or stdout. As a file, the deploy can subsequently be signed by other parties using the ",(0,r.kt)("inlineCode",{parentName:"li"},"sign-deploy")," subcommand and then sent to the network for execution using the ",(0,r.kt)("inlineCode",{parentName:"li"},"send-deploy")," subcommand"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"sign-deploy")," - Reads a previously-saved Deploy from a file, cryptographically signs it, and outputs it to a file or stdout"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"send-deploy")," - Reads a previously-saved Deploy from a file and sends it to the network for execution")),(0,r.kt)("p",null,"To sign a Deploy with multiple keys, create the Deploy with the ",(0,r.kt)("inlineCode",{parentName:"p"},"make-deploy")," command. The generated deploy file can be sent to the other signers, who then sign it with their keys by calling the ",(0,r.kt)("inlineCode",{parentName:"p"},"sign-deploy")," for each key. Signatures need to be gathered on the Deploy one after another until all required parties have signed the Deploy. Finally, the signed Deploy is sent to the network with the ",(0,r.kt)("inlineCode",{parentName:"p"},"send-deploy")," command for processing."),(0,r.kt)("p",null,"For a step-by-step workflow, visit the ",(0,r.kt)("a",{parentName:"p",href:"/workflow/developers/deploy-transfer"},"Two-Party Multi-Signature Deploy")," guide. This workflow describes how a trivial two-party multi-signature scheme for signing and sending deploys can be enforced for an account on a Casper network."),(0,r.kt)("h2",{id:"a-note-about-gas-price"},"A Note about Gas Price"),(0,r.kt)("p",null,'A common question frequently arises: "How do I know what the payment amount (gas cost) should be?"'),(0,r.kt)("p",null,"We recommend installing your contracts in a test environment, making sure the cost tables match those of the production Casper network to which you want to send the deploy. If you plan on sending a deploy to ",(0,r.kt)("a",{parentName:"p",href:"https://cspr.live/"},"Mainnet"),", you can use the ",(0,r.kt)("a",{parentName:"p",href:"https://testnet.cspr.live/"},"Testnet")," to estimate the payment amount needed for the deploy."),(0,r.kt)("p",null,"If your test configuration matches your production ",(0,r.kt)("a",{parentName:"p",href:"/glossary/C/#chainspec"},"chainspec"),", you can check the deploy status and roughly see how much it would cost. You can estimate the costs in this way and then add a small buffer to be sure. Refer to the ",(0,r.kt)("a",{parentName:"p",href:"/runtime#gas-allocation"},"runtime economics")," section for more details about gas usage and fees."),(0,r.kt)("p",null,"Please be aware that sending a deploy always requires payment. This is true regardless of the validity of included Wasm."))}f.isMDXComponent=!0}}]);