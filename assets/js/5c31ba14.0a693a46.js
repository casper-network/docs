"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[3381],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},c="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),c=l(r),d=a,m=c["".concat(s,".").concat(d)]||c[d]||f[d]||o;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p[c]="string"==typeof e?e:a,i[1]=p;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8215:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return p},metadata:function(){return l},toc:function(){return c}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=(r(4996),["components"]),p={},s="Table of Contents",l={unversionedId:"operators/table-of-contents",id:"operators/table-of-contents",title:"Table of Contents",description:"-   Getting Set Up",source:"@site/source/docs/casper/operators/table-of-contents.md",sourceDirName:"operators",slug:"/operators/table-of-contents",permalink:"/operators/table-of-contents",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/operators/table-of-contents.md",tags:[],version:"current",lastUpdatedAt:1680534581,formattedLastUpdatedAt:"Apr 3, 2023",frontMatter:{},sidebar:"operators",previous:{title:"Introduction",permalink:"/operators"},next:{title:"Recommended Hardware Specifications",permalink:"/operators/setup/hardware"}},u={},c=[],f={toc:c},d="wrapper";function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)(d,(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"table-of-contents"},"Table of Contents"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Getting Set Up",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/hardware"},"Recommended Hardware Specifications"),": system requirements for the Casper Mainnet and Testnet"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/basic-node-configuration"},"Basic Node Configuration"),": processes and files involved in setting up a Casper node"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/install-node"},"Installing a Node"),": step-by-step instructions to install a Casper node"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/upgrade"},"Upgrading the Node"),": before joining the network, the node needs to be upgraded"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/joining"},"Joining a Running Network"),": steps to join an existing Casper network"))),(0,o.kt)("li",{parentName:"ul"},"Becoming A Validator",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/becoming-a-validator/bonding"},"Bonding as a Validator"),": a guide about the bonding process and submitting a bid"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/becoming-a-validator/unbonding"},"Unbonding as a Validator"),": the process to withdraw a bid and unbonding"))),(0,o.kt)("li",{parentName:"ul"},"Setting Up A Network",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup-network/chain-spec"},"The Chain Specification"),": files needed to create a genesis block"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup-network/create-private"},"Set Up a Private Casper Network"),": a step-by-step guide to establishing and configuring a private Casper network"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup-network/staging-files-for-new-network"},"Staging Files for a New Network"),": a guide to hosting protocol files for a new Casper network")))))}m.isMDXComponent=!0}}]);