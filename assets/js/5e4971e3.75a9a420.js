"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[3550],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),l=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=l(e.components);return a.createElement(c.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=l(n),g=r,m=d["".concat(c,".").concat(g)]||d[g]||u[g]||i;return n?a.createElement(m,o(o({ref:t},p),{},{components:n})):a.createElement(m,o({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[d]="string"==typeof e?e:r,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},7541:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return d}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=["components"],s={title:"Reading and Writing Data"},c="Reading and Writing Data to Global State",l={unversionedId:"concepts/design/reading-and-writing-to-the-blockchain",id:"concepts/design/reading-and-writing-to-the-blockchain",title:"Reading and Writing Data",description:"Casper features several means of reading and writing data to global state, depending on user needs and complexity. Reading data from global state can be done by dApps off-chain or by smart contracts on-chain. Writing data requires on-chain interactions due to the nature of the system. Storage in global state can be accomplished using Dictionaries or NamedKeys.",source:"@site/source/docs/casper/concepts/design/reading-and-writing-to-the-blockchain.md",sourceDirName:"concepts/design",slug:"/concepts/design/reading-and-writing-to-the-blockchain",permalink:"/concepts/design/reading-and-writing-to-the-blockchain",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/dev/source/docs/casper/concepts/design/reading-and-writing-to-the-blockchain.md",tags:[],version:"current",lastUpdatedAt:1693580435,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{title:"Reading and Writing Data"},sidebar:"concepts",previous:{title:"Highway Consensus",permalink:"/concepts/design/highway"},next:{title:"Overview",permalink:"/economics"}},p={},d=[{value:"Using the Casper JSON-RPC",id:"using-the-casper-json-rpc",level:2},{value:"Using the Casper Rust API",id:"using-the-casper-rust-api",level:2}],u={toc:d},g="wrapper";function m(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)(g,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"reading-and-writing-data-to-global-state"},"Reading and Writing Data to Global State"),(0,i.kt)("p",null,"Casper features several means of reading and writing data to global state, depending on user needs and complexity. Reading data from global state can be done by dApps off-chain or by smart contracts on-chain. Writing data requires on-chain interactions due to the nature of the system. Storage in global state can be accomplished using ",(0,i.kt)("a",{parentName:"p",href:"/concepts/dictionaries"},"Dictionaries")," or ",(0,i.kt)("a",{parentName:"p",href:"/developers/json-rpc/types_chain#namedkey"},(0,i.kt)("inlineCode",{parentName:"a"},"NamedKeys")),"."),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"Due to the nature of Casper's serialization standard, ",(0,i.kt)("inlineCode",{parentName:"p"},"NamedKeys")," should be used sparingly and only for small data sets. Developers should use dictionaries for larger mapped structures.")),(0,i.kt)("h2",{id:"using-the-casper-json-rpc"},"Using the Casper JSON-RPC"),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"/developers/json-rpc/json-rpc-informational#query-global-state"},(0,i.kt)("inlineCode",{parentName:"a"},"query_global_state"))," method available through the JSON-RPC allows users to read data from global state without performing on-chain actions. For more details, see the ",(0,i.kt)("a",{parentName:"p",href:"/resources/tutorials/beginner/querying-network"},"Querying a Casper Network")," tutorial."),(0,i.kt)("h2",{id:"using-the-casper-rust-api"},"Using the Casper Rust API"),(0,i.kt)("p",null,"The Casper API includes the following functions for reading and writing to global state:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.put_key.html"},"put_key")," - Stores the given ",(0,i.kt)("inlineCode",{parentName:"li"},"Key")," under the given ",(0,i.kt)("inlineCode",{parentName:"li"},"name")," in the current context's named keys"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/runtime/fn.get_key.html"},"get_key")," - Returns the requested ",(0,i.kt)("inlineCode",{parentName:"li"},"NamedKey")," from the current context"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.new_uref.html"},"storage::new_uref")," - Creates a new URef in the current context"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.write.html"},"storage::write")," - Writes a given value under a previously created URef"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.read.html"},"storage::read")," - Reads the value from a URef in global state"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_put.html"},"dictionary_put")," - Writes the given value under the given ",(0,i.kt)("inlineCode",{parentName:"li"},"dictionary_item_key")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.rs/casper-contract/latest/casper_contract/contract_api/storage/fn.dictionary_get.html"},"dictionary_get")," - Retrieves the value stored under a ",(0,i.kt)("inlineCode",{parentName:"li"},"dictionary_item_key"))),(0,i.kt)("p",null,"For more details, see the ",(0,i.kt)("a",{parentName:"p",href:"/resources/tutorials/advanced/storage-workflow"},"Reading and Writing to Global State using Rust")," tutorial."))}m.isMDXComponent=!0}}]);