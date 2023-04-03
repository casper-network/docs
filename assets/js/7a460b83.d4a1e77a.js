"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[7772],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return y}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),u=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=u(e.components);return r.createElement(c.Provider,{value:t},e.children)},l="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),l=u(n),h=a,y=l["".concat(c,".").concat(h)]||l[h]||p[h]||o;return n?r.createElement(y,i(i({ref:t},d),{},{components:n})):r.createElement(y,i({ref:t},d))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[l]="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},467:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return c},default:function(){return y},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return l}});var r=n(3117),a=n(102),o=(n(7294),n(3905)),i=["components"],s={},c="Listing Authorization Keys",u={unversionedId:"dapp-dev-guide/list-auth-keys",id:"dapp-dev-guide/list-auth-keys",title:"Listing Authorization Keys",description:"This topic explains the difference between associated keys and authorization keys, and how to access authorization keys from a smart contract.",source:"@site/source/docs/casper/dapp-dev-guide/list-auth-keys.md",sourceDirName:"dapp-dev-guide",slug:"/dapp-dev-guide/list-auth-keys",permalink:"/dapp-dev-guide/list-auth-keys",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/dapp-dev-guide/list-auth-keys.md",tags:[],version:"current",lastUpdatedAt:1680534581,formattedLastUpdatedAt:"Apr 3, 2023",frontMatter:{}},d={},l=[{value:"Associated Keys and Authorization Keys",id:"associated-keys-and-authorization-keys",level:2},{value:"Accessing of Authorization Keys from a Smart Contract",id:"accessing-of-authorization-keys-from-a-smart-contract",level:2}],p={toc:l},h="wrapper";function y(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)(h,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"listing-authorization-keys"},"Listing Authorization Keys"),(0,o.kt)("p",null,"This topic explains the difference between associated keys and authorization keys, and how to access authorization keys from a smart contract."),(0,o.kt)("h2",{id:"associated-keys-and-authorization-keys"},"Associated Keys and Authorization Keys"),(0,o.kt)("p",null,"Let's understand the relation between associated keys and authorization keys."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Associated keys are public keys which are associated with a given account. To understand more about associated keys and how they are linked to an account, see the ",(0,o.kt)("a",{parentName:"li",href:"/resources/tutorials/advanced/two-party-multi-sig"},"Two-Party Multi-Signature workflow"),"."),(0,o.kt)("li",{parentName:"ul"},"Authorization keys are public keys which are used to sign a given deploy and are used by the node to check that the deploy has permission to be executed."),(0,o.kt)("li",{parentName:"ul"},"Different executions of the same smart contract can have different authorization keys."),(0,o.kt)("li",{parentName:"ul"},"Authorization keys are always a subset of the associated keys of the account under which the deploy is executed.")),(0,o.kt)("h2",{id:"accessing-of-authorization-keys-from-a-smart-contract"},"Accessing of Authorization Keys from a Smart Contract"),(0,o.kt)("p",null,"A smart contract can retrieve the set of authorization keys for the given execution by calling the ",(0,o.kt)("inlineCode",{parentName:"p"},"runtime::list_authorization_keys")," function. This returns the set of account hashes representing all the keys used to sign the deploy under which the contract is executing."),(0,o.kt)("p",null,"This gives developers more fine-grained control within their smart contracts. For example, developers can define a hierarchy within an account's associated keys, and use that along with the current execution's authorization keys to limit access for certain operations to specific keys."))}y.isMDXComponent=!0}}]);