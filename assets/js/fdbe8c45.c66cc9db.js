"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[9527],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),c=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),f=c(n),h=o,d=f["".concat(u,".").concat(h)]||f[h]||l[h]||a;return n?r.createElement(d,s(s({ref:t},p),{},{components:n})):r.createElement(d,s({ref:t},p))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,s=new Array(a);s[0]=f;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:o,s[1]=i;for(var c=2;c<a;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},4878:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return f}});var r=n(3117),o=n(102),a=(n(7294),n(3905)),s=n(4996),i=["components"],u={},c="Funding Testnet Accounts",p={unversionedId:"workflow/testnet-faucet",id:"workflow/testnet-faucet",title:"Funding Testnet Accounts",description:"The Casper Testnet is an alternate Casper blockchain aimed at testing applications running on the Casper Network without spending CSPR tokens on the Casper Mainnet. Testnet tokens are independent and separate from the actual Casper Token (CSPR). While test tokens do not have any monetary value, they possess the same functionality as the CSPR token within the confines of the Testnet. The Testnet is deployed independently from the Casper Mainnet for users to experiment with Casper Network features such as transferring, delegating, and undelegating tokens. You can access the Casper Testnet using https://testnet.cspr.live/.",source:"@site/source/docs/casper/workflow/testnet-faucet.md",sourceDirName:"workflow",slug:"/workflow/testnet-faucet",permalink:"/workflow/testnet-faucet",editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/workflow/testnet-faucet.md",tags:[],version:"current",frontMatter:{},sidebar:"workflow",previous:{title:"Funding Mainnet Accounts from an Exchange",permalink:"/workflow/funding-from-exchanges"},next:{title:"Set Up a Private Casper Network",permalink:"/workflow/setup-private-network"}},l={},f=[{value:"The Faucet",id:"the-faucet",level:2},{value:"Requesting Testnet Tokens",id:"requesting-testnet-tokens",level:3}],h={toc:f};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"funding-testnet-accounts"},"Funding Testnet Accounts"),(0,a.kt)("p",null,"The Casper Testnet is an alternate Casper blockchain aimed at testing applications running on the Casper Network without spending CSPR tokens on the Casper Mainnet. Testnet tokens are independent and separate from the actual Casper Token (CSPR). While test tokens do not have any monetary value, they possess the same functionality as the CSPR token within the confines of the Testnet. The Testnet is deployed independently from the Casper Mainnet for users to experiment with Casper Network features such as transferring, delegating, and undelegating tokens. You can access the Casper Testnet using ",(0,a.kt)("a",{parentName:"p",href:"https://testnet.cspr.live/"},"https://testnet.cspr.live/"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Figure 1"),": Casper Testnet Home"),(0,a.kt)("img",{src:(0,s.Z)("/image/workflow/testnet-home.png"),width:"500",alt:"Casper Testnet Home"}),(0,a.kt)("h2",{id:"the-faucet"},"The Faucet"),(0,a.kt)("p",null,"The faucet functionality on Testnet allows you to request test tokens, which are required to complete transactions on the network, including transferring, delegating, and undelegating tokens. In this section, we will discuss how to request test tokens."),(0,a.kt)("h3",{id:"requesting-testnet-tokens"},"Requesting Testnet Tokens"),(0,a.kt)("p",null,"To request test tokens, follow these steps:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Sign-in into the Casper Testnet with the Signer. For detailed instructions, see the ",(0,a.kt)("a",{parentName:"p",href:"/workflow/signer-guide"},"Signer Guide"),".")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Click ",(0,a.kt)("strong",{parentName:"p"},"Tools")," on the top menu bar and then select ",(0,a.kt)("strong",{parentName:"p"},"Faucet")," from the drop-down menu.")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Click ",(0,a.kt)("strong",{parentName:"p"},"Request tokens")," on the Faucet page, as shown in Figure 2."),(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Figure 2"),": Casper Faucet Functionality"),(0,a.kt)("img",{src:(0,s.Z)("/image/workflow/faucet-function.png"),width:"500"})),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"The Testnet will credit your account with test tokens. For instructions on how to view your CSPR balance, see ",(0,a.kt)("a",{parentName:"p",href:"../signer-guide/#6-viewing-account-details"},"Viewing Account Details"),"."))))}d.isMDXComponent=!0}}]);