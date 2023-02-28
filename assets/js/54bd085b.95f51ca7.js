"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[4032],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function p(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?p(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):p(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},p=Object.keys(e);for(a=0;a<p.length;a++)t=p[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(a=0;a<p.length;a++)t=p[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=a.createContext({}),d=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=d(e.components);return a.createElement(i.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,p=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=d(t),m=r,g=u["".concat(i,".").concat(m)]||u[m]||l[m]||p;return t?a.createElement(g,o(o({ref:n},c),{},{components:t})):a.createElement(g,o({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var p=t.length,o=new Array(p);o[0]=u;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var d=2;d<p;d++)o[d]=t[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5981:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return l}});var a=t(3117),r=t(102),p=(t(7294),t(3905)),o=["components"],s={},i="Golang SDK",d={unversionedId:"dapp-dev-guide/building-dapps/sdk/go-sdk",id:"dapp-dev-guide/building-dapps/sdk/go-sdk",title:"Golang SDK",description:"Usage Examples",source:"@site/source/docs/casper/dapp-dev-guide/building-dapps/sdk/go-sdk.md",sourceDirName:"dapp-dev-guide/building-dapps/sdk",slug:"/dapp-dev-guide/building-dapps/sdk/go-sdk",permalink:"/dapp-dev-guide/building-dapps/sdk/go-sdk",editUrl:"https://github.com/casper-network/docs/tree/main/source/docs/casper/dapp-dev-guide/building-dapps/sdk/go-sdk.md",tags:[],version:"current",lastUpdatedAt:1677418767,formattedLastUpdatedAt:"2/26/2023",frontMatter:{},sidebar:"dapp-dev-guide",previous:{title:".NET SDK",permalink:"/dapp-dev-guide/building-dapps/sdk/csharp-sdk"},next:{title:"Python SDK",permalink:"/dapp-dev-guide/building-dapps/sdk/python-sdk"}},c={},l=[{value:"Usage Examples",id:"usage-examples",level:2},{value:"Generating Account Keys",id:"generating-account-keys",level:2},{value:"Deploying a contract",id:"deploying-a-contract",level:2}],u={toc:l};function m(e){var n=e.components,t=(0,r.Z)(e,o);return(0,p.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,p.kt)("h1",{id:"golang-sdk"},"Golang SDK"),(0,p.kt)("h2",{id:"usage-examples"},"Usage Examples"),(0,p.kt)("p",null,"This section includes some examples of how to use Golang SDK:"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"Sending a transfer"),(0,p.kt)("li",{parentName:"ul"},"Installing a contract via a Deploy")),(0,p.kt)("h2",{id:"generating-account-keys"},"Generating Account Keys"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-bash"},'    import (\n        "fmt"\n        "github.com/casper-ecosystem/casper-golang-sdk/keypair"\n        "github.com/casper-ecosystem/casper-golang-sdk/keypair/ed25519"\n        "github.com/casper-ecosystem/casper-golang-sdk/sdk"\n        "math/big"\n        "time"\n    )\n')),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-bash"},'    func main() {\n        nodeRpc := "http://159.65.118.250:7777"\n        nodeEvent := "http://159.65.118.250:9999"\n        privKeyPath := "/path/to/secret_key.pem"\n\n        rpcClient, _ := sdk.NewRpcClient(nodeRpc)\n        eventClient := sdk.NewEventService(nodeEvent)\n\n        pair, _ := ed25519.ParseKeyFiles(privKeyPath)\n        target, _ := keypair.FromPublicKeyHex("0172a54c123b336fb1d386bbdff450623d1b5da904f5e2523b3e347b6d7573ae80")\n\n        deployParams := sdk.DeployParams{\n            Account:   pair.PublicKey(),\n            Timestamp: time.Now(),\n            TTL:       30 * time.Minute,\n            GasPrice:  1,\n            ChainName: "casper-test",\n        }\n        payment := sdk.StandardPayment(big.NewInt(100000000))\n        session := sdk.NewTransfer(big.NewInt(25000000000), target, uint64(5589324))\n\n        deploy, _ := sdk.MakeDeploy(deployParams, payment, session)\n        _ = deploy.Sign(pair)\n        putDeploy, _ := rpcClient.PutDeploy(deploy)\n\n        processedDeploy, _ := eventClient.AwaitDeploy(putDeploy.DeployHash)\n\n        fmt.Printf("%+v\\n", processedDeploy)\n    }\n')),(0,p.kt)("h2",{id:"deploying-a-contract"},"Deploying a contract"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-bash"},'    import (\n        "fmt"\n        "github.com/casper-ecosystem/casper-golang-sdk/keypair"\n        "github.com/casper-ecosystem/casper-golang-sdk/keypair/ed25519"\n        "github.com/casper-ecosystem/casper-golang-sdk/sdk"\n        "math/big"\n        "time"\n    )\n')),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-bash"},'    func main() {\n        nodeRpc := "http://159.65.118.250:7777"\n        nodeEvent := "http://159.65.118.250:9999"\n        privKeyPath := "/path/to/secret_key.pem"\n        modulePath := "/path/to/contract.wasm"\n\n        rpcClient, _ := sdk.NewRpcClient(nodeRpc)\n        eventClient := sdk.NewEventService(nodeEvent)\n\n        pair, _ := ed25519.ParseKeyFiles(privKeyPath)\n        module, _ := ioutil.ReadFile(modulePath)\n\n        deployParams := sdk.DeployParams{\n            Account:   pair.PublicKey(),\n            Timestamp: time.Now(),\n            TTL:       30 * time.Minute,\n            GasPrice:  1,\n            ChainName: "casper-test",\n        }\n        payment := sdk.StandardPayment(big.NewInt(100000000))\n        session := sdk.NewModuleBytes(module, nil)\n\n        deploy, _ := sdk.MakeDeploy(deployParams, payment, session)\n        _ = deploy.Sign(pair)\n        putDeploy, _ := rpcClient.PutDeploy(deploy)\n\n        processedDeploy, _ := eventClient.AwaitDeploy(putDeploy.DeployHash)\n\n        fmt.Printf("%+v\\n", processedDeploy)\n    }\n')))}m.isMDXComponent=!0}}]);