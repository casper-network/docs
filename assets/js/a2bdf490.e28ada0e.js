"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[4613],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return r?n.createElement(f,i(i({ref:t},s),{},{components:r})):n.createElement(f,i({ref:t},s))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:o,i[1]=u;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2666:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return p}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),i=["components"],u={title:"Introduction",slug:"/counter-testnet"},l="A Counter on the Testnet",c={unversionedId:"dapp-dev-guide/tutorials/counter-testnet/index",id:"dapp-dev-guide/tutorials/counter-testnet/index",title:"Introduction",description:"This tutorial installs a simple counter contract on the Casper Testnet. The contract is straightforward and simply maintains a counter variable. If you want to learn to send deploys to a local Casper Network, you can follow a similar tutorial and work with NCTL. Once you are familiar with this process, the next step would be to write more practical smart contracts.",source:"@site/source/docs/casper/dapp-dev-guide/tutorials/counter-testnet/index.md",sourceDirName:"dapp-dev-guide/tutorials/counter-testnet",slug:"/counter-testnet",permalink:"/counter-testnet",editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/dapp-dev-guide/tutorials/counter-testnet/index.md",tags:[],version:"current",lastUpdatedAt:1677418767,formattedLastUpdatedAt:"2/26/2023",frontMatter:{title:"Introduction",slug:"/counter-testnet"},sidebar:"dapp-dev-guide",previous:{title:"Tutorial Walkthrough",permalink:"/dapp-dev-guide/tutorials/counter/walkthrough"},next:{title:"Overview",permalink:"/dapp-dev-guide/tutorials/counter-testnet/overview"}},s={},p=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Video Tutorial",id:"video-tutorial",level:2}],d={toc:p};function m(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"a-counter-on-the-testnet"},"A Counter on the Testnet"),(0,a.kt)("p",null,"This tutorial installs a simple counter contract on the Casper Testnet. The contract is straightforward and simply maintains a counter variable. If you want to learn to send deploys to a local Casper Network, you can follow a ",(0,a.kt)("a",{parentName:"p",href:"/counter"},"similar tutorial")," and work with NCTL. Once you are familiar with this process, the next step would be to write more practical smart contracts."),(0,a.kt)("p",null,"Here is how the tutorial is structured:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/tutorials/counter-testnet/overview"},"Tutorial Overview")," - Introduction to the process and what will be covered"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/tutorials/counter-testnet/commands"},"Important Commands")," - A summary of all relevant commands and respective arguments"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/tutorials/counter-testnet/walkthrough"},"Tutorial Walkthrough")," - Step-by-step tutorial instructions")),(0,a.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"You have completed the ",(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/writing-contracts/getting-started"},"Getting Started tutorial")," to set up your development environment, including tools like ",(0,a.kt)("em",{parentName:"li"},"cmake")," (version 3.1.4+), ",(0,a.kt)("em",{parentName:"li"},"cargo"),", and ",(0,a.kt)("em",{parentName:"li"},"Rust"),"."),(0,a.kt)("li",{parentName:"ol"},"You have installed the ",(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup#the-casper-command-line-client"},"Casper client")," to send deploys to the chain."),(0,a.kt)("li",{parentName:"ol"},"You were able to ",(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup#setting-up-an-account"},"set up and fund an account")," on the Casper Testnet. Make note of two critical pieces of information that you will need to complete this tutorial:",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"The location of your account\u2019s ",(0,a.kt)("strong",{parentName:"li"},"secret_key.pem")," file"),(0,a.kt)("li",{parentName:"ul"},"Your ",(0,a.kt)("strong",{parentName:"li"},"account hash")," identifier"))),(0,a.kt)("li",{parentName:"ol"},"You ",(0,a.kt)("a",{parentName:"li",href:"/dapp-dev-guide/setup#acquire-node-address-from-network-peers"},"selected a node")," whose RPC port will be receiving the deploys coming from your account.")),(0,a.kt)("h2",{id:"video-tutorial"},"Video Tutorial"),(0,a.kt)("p",null,"If you prefer a video walkthrough of this guide, you can check out this video."),(0,a.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed?v=rWaUiFFEyaY&list=PL8oWxbJ-csEogSV-M0IPiofWP5I_dLji6&index=3",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0}))}m.isMDXComponent=!0}}]);