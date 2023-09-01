"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[1942],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return h}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,h=u["".concat(l,".").concat(m)]||u[m]||c[m]||o;return n?a.createElement(h,s(s({ref:t},d),{},{components:n})):a.createElement(h,s({ref:t},d))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2658:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return i},metadata:function(){return p},toc:function(){return u}});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),s=["components"],i={title:"Endpoints"},l="Node Endpoints",p={unversionedId:"operators/setup/node-endpoints",id:"operators/setup/node-endpoints",title:"Endpoints",description:"As specified in the Network Requirements, a Casper node uses specific ports to communicate with client applications and other nodes on the network. Each node has an identity linked with an IP and port pair where the node is reachable. This address is also called an endpoint. The Network Communication page explains how the nodes connect and communicate securely. Node connections are established using TLS, presenting a client certificate to encrypt peer-to-peer communication.",source:"@site/source/docs/casper/operators/setup/node-endpoints.md",sourceDirName:"operators/setup",slug:"/operators/setup/node-endpoints",permalink:"/operators/setup/node-endpoints",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/dev/source/docs/casper/operators/setup/node-endpoints.md",tags:[],version:"current",lastUpdatedAt:1693580435,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{title:"Endpoints"},sidebar:"operators",previous:{title:"Configuration",permalink:"/operators/setup/basic-node-configuration"},next:{title:"Installation",permalink:"/operators/setup/install-node"}},d={},u=[{value:"Default Networking Port: 35000",id:"35000",level:2},{value:"Default JSON-RPC HTTP Server Port: 7777",id:"7777",level:2},{value:"Default REST HTTP Server Port: 8888",id:"8888",level:2},{value:"Example usage",id:"example-usage",level:3},{value:"Default SSE HTTP Event Stream Server Port: 9999",id:"9999",level:2},{value:"Setting up Firewall Rules",id:"setting-up-firewall-rules",level:2},{value:"Restricting Access for Private Networks",id:"restricting-access-for-private-networks",level:2},{value:"Summary of Related Links",id:"summary-of-related-links",level:2}],c={toc:u},m="wrapper";function h(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)(m,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"node-endpoints"},"Node Endpoints"),(0,o.kt)("p",null,"As specified in the ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup/install-node#network-requirements"},"Network Requirements"),", a Casper node uses specific ports to communicate with client applications and other nodes on the network. Each node has an identity linked with an IP and port pair where the node is reachable. This address is also called an endpoint. The ",(0,o.kt)("a",{parentName:"p",href:"/concepts/design/p2p"},"Network Communication")," page explains how the nodes connect and communicate securely. Node connections are established using TLS, presenting a client certificate to encrypt peer-to-peer communication."),(0,o.kt)("p",null,"This document describes in more detail a Casper node's default endpoints:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#35000"},"Networking port: 35000")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#7777"},"JSON-RPC HTTP server port: 7777")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#8888"},"REST HTTP server port: 8888")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#9999"},"SSE HTTP event stream server port: 9999"))),(0,o.kt)("p",null,"Node operators can modify a node's configuration options, including the port settings, by updating the ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup/basic-node-configuration#config-file"},"node's config.toml")," file. An example configuration file can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/casper-network/casper-protocol-release/blob/main/config/config-example.toml"},"here"),"."),(0,o.kt)("p",null,"The default endpoints for Mainnet and Testnet are open by default and are described below in more detail. If the node connects to a different network, the ports may differ depending on how the network was set up."),(0,o.kt)("h2",{id:"35000"},"Default Networking Port: 35000"),(0,o.kt)("p",null,"The configuration options for networking are under the ",(0,o.kt)("inlineCode",{parentName:"p"},"network")," section of the ",(0,o.kt)("inlineCode",{parentName:"p"},"config.toml")," file. The ",(0,o.kt)("inlineCode",{parentName:"p"},"bind_address")," using port 35000 is the only port required to be open for the node to function. A Casper node taking part in the network should open connections to every other node it is aware of and has not blocked. In the ",(0,o.kt)("inlineCode",{parentName:"p"},"config.toml")," file, the setting is:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-md"},"bind_address = '0.0.0.0:35000'\n")),(0,o.kt)("p",null,"If the networking port is closed, the node becomes unreachable, and the node won't be discoverable in the network. If this is a validator, it will face eviction. A read-only node will be considered to be offline."),(0,o.kt)("h2",{id:"7777"},"Default JSON-RPC HTTP Server Port: 7777"),(0,o.kt)("p",null,"The configuration options for the JSON-RPC HTTP server are under the ",(0,o.kt)("inlineCode",{parentName:"p"},"rpc_server")," section in the ",(0,o.kt)("inlineCode",{parentName:"p"},"config.toml")," file. The ",(0,o.kt)("inlineCode",{parentName:"p"},"address")," using port 7777 is the listening address for JSON-RPC HTTP server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-md"},"address = '0.0.0.0:7777'\n")),(0,o.kt)("p",null,"DApps would use this address to ",(0,o.kt)("a",{parentName:"p",href:"/developers/json-rpc/"},"interact with the Casper JSON-RPC API"),". Users would use this address to ",(0,o.kt)("a",{parentName:"p",href:"/developers/cli/"},"interact with the network using CLI"),". Validators would use this address to ",(0,o.kt)("a",{parentName:"p",href:"/operators/becoming-a-validator/bonding#example-bonding-transaction"},"bond")," or ",(0,o.kt)("a",{parentName:"p",href:"/operators/becoming-a-validator/unbonding"},"unbond"),". If this port is closed, the requests coming to this port will not be served, but the node remains unaffected."),(0,o.kt)("h2",{id:"8888"},"Default REST HTTP Server Port: 8888"),(0,o.kt)("p",null,"The configuration options for the JSON-RPC HTTP server are under the ",(0,o.kt)("inlineCode",{parentName:"p"},"rest_server")," section in the ",(0,o.kt)("inlineCode",{parentName:"p"},"config.toml")," file. The ",(0,o.kt)("inlineCode",{parentName:"p"},"address")," listing port 8888 is the listening address for the REST HTTP server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-md"},"address = '0.0.0.0:8888'\n")),(0,o.kt)("p",null,"Opening port 8888 is recommended but not required. This port allows the node to be included in the general network health metrics, thus giving a more accurate picture of overall network health. If this port is closed, the requests coming to this port will not be served, but the node remains unaffected."),(0,o.kt)("p",null,"One may use this port to ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup/basic-node-configuration#trusted-hash-for-synchronizing"},"get a trusted hash"),", ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup/upgrade#verifying-successful-staging"},"verify successful staging")," during an upgrade, or to ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup/joining#step-7-confirm-the-node-is-synchronized"},"confirm that the node is synchronized"),"."),(0,o.kt)("h3",{id:"example-usage"},"Example usage"),(0,o.kt)("p",null,"For general health metrics, use this command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/metrics\n")),(0,o.kt)("p",null,"You can check the node's status using this command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/status\n")),(0,o.kt)("p",null,"The status endpoint provides a JSON response that can be parsed with ",(0,o.kt)("inlineCode",{parentName:"p"},"jq"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/status | jq\n")),(0,o.kt)("details",null,(0,o.kt)("summary",null,(0,o.kt)("b",null,"Sample response")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "api_version": "1.4.15",\n    "chainspec_name": "casper-test",\n    "starting_state_root_hash": "4c3856bd6a95b566301b9da61aaf84589a51ee2980f3cc7bbef78e7745386955",\n    "peers": [\n        {\n            "node_id": "tls:007e..e14b",\n            "address": "89.58.52.245:35000"\n        },\n        {\n            "node_id": "tls:00eb..ac11",\n            "address": "65.109.17.120:35000"\n        },\n        ...{\n            "node_id": "tls:ffc0..555b",\n            "address": "95.217.228.224:35000"\n        }\n    ],\n    "last_added_block_info": {\n        "hash": "7acd2f48b573704e96eab54322f7e91a0624252baca3583ad2aae38229fe1715",\n        "timestamp": "2023-05-10T09:20:10.752Z",\n        "era_id": 9085,\n        "height": 1711254,\n        "state_root_hash": "1ac74071c1e76937c372c8d2ae22ea036a77578aad03821ec98021fdc1c5d06b",\n        "creator": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca"\n    },\n    "our_public_signing_key": "0107cba5b4826a87ddbe0ba8cda8064881b75882f05094c1a5f95e957512a3450e",\n    "round_length": "32s 768ms",\n    "next_upgrade": null,\n    "build_version": "1.4.15-039d438f2-casper-mainnet",\n    "uptime": "5days 13h 46m 54s 520ms"\n}\n'))),(0,o.kt)("p",null,"You can filter the result with dot notation, specifying one of the following parameters:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"api_version")," - The RPC API version"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"chainspec_name")," - The chainspec name, used to identify the currently connected network"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"starting_state_root_hash")," - The state root hash used at the start of the current session"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"peers")," - The node ID and network address of each connected peer"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"last_added_block_info")," - The minimal info of the last Block from the linear chain"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"our_public_signing_key")," - Our public signing key"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"round_length")," - The next round length if this node is a validator."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"next_upgrade")," - Information about the next scheduled upgrade"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"build_version")," - The compiled node version"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"uptime")," - Time that has passed since the node has started.")),(0,o.kt)("p",null,"Here is an example command for retrieving general network information:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/status | jq -r '.api_version, .last_added_block_info, .build_version, .uptime'\n")),(0,o.kt)("details",null,(0,o.kt)("summary",null,(0,o.kt)("b",null,"Sample response")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"1.4.15"\n{\n  "hash": "dca9959b21df52633f85cd373a8117fe8e89629dd2a0455781484a439f7d9f62",\n  "timestamp": "2023-05-10T09:26:43.968Z",\n  "era_id": 9085,\n  "height": 1711266,\n  "state_root_hash": "5f374529e747a06ec825e07a030df7b9d80d1f7ffac9156779b4466620721872",\n  "creator": "0107cba5b4826a87ddbe0ba8cda8064881b75882f05094c1a5f95e957512a3450e"\n}\n"1.4.15-039d438f2-casper-mainnet"\n"5days 13h 53m 10s 763ms"\n'))),(0,o.kt)("p",null,"To get information about the next upgrade, use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/status | jq .next_upgrade\n")),(0,o.kt)("p",null,"To get information about the last added block, use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl -s http://<node_address>:8888/status | jq .last_added_block_info\n")),(0,o.kt)("p",null,"To monitor the downloading of blocks to your node:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"watch -n 15 'curl -s http://<node_address>:8888/status | jq \".peers | length\"; curl -s http://<node_address>:8888/status | jq .last_added_block_info'\n")),(0,o.kt)("p",null,"To monitor local block height as well as RPC port status:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"watch -n 15 'curl -s http://<node_address>:8888/status | jq \".peers | length\"; curl -s http://<node_address>:8888/status | jq .last_added_block_info; casper-client get-block -n http://<node_address>:8888/status'\n")),(0,o.kt)("h2",{id:"9999"},"Default SSE HTTP Event Stream Server Port: 9999"),(0,o.kt)("p",null,"The configuration options for the SSE HTTP event stream server are listed under the ",(0,o.kt)("inlineCode",{parentName:"p"},"event_stream_server")," section of the ",(0,o.kt)("inlineCode",{parentName:"p"},"config.toml")," file. The ",(0,o.kt)("inlineCode",{parentName:"p"},"address")," listing port 9999 is the listening address for the SSE HTTP event stream server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-md"},"address = '0.0.0.0:9999'\n")),(0,o.kt)("p",null,"If this port is closed, the requests coming to this port will not be served, but the node remains unaffected. For details and useful commands, see ",(0,o.kt)("a",{parentName:"p",href:"/developers/dapps/monitor-and-consume-events"},"Monitoring and Consuming Events"),"."),(0,o.kt)("h2",{id:"setting-up-firewall-rules"},"Setting up Firewall Rules"),(0,o.kt)("p",null,"To limit inbound traffic to the node\u2019s endpoints, you can set firewall rules similar to the ",(0,o.kt)("inlineCode",{parentName:"p"},"ufw")," commands below:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt install ufw -y\nsudo ufw disable\nsudo ufw reset\nsudo ufw default allow outgoing\nsudo ufw default deny incoming\nsudo ufw limit ssh\nsudo ufw limit 7777/tcp\nsudo ufw limit 8888/tcp\nsudo ufw limit 35000/tcp\nsudo ufw enable\n")),(0,o.kt)("p",null,"These commands will limit requests to the available ports of your node. Port 35000 should be left open, although you can limit traffic, as it is crucial for node-to-node communication."),(0,o.kt)("p",null,"If you have any concerns, questions, or issues, please ",(0,o.kt)("a",{parentName:"p",href:"https://support.casperlabs.io/hc/en-gb/requests/new"},"submit a request")," to the Casper support team."),(0,o.kt)("h2",{id:"restricting-access-for-private-networks"},"Restricting Access for Private Networks"),(0,o.kt)("p",null,"Any node can join Mainnet and Testnet and communicate with the nodes in the network. Private networks may wish to restrict access for new nodes joining the network as described ",(0,o.kt)("a",{parentName:"p",href:"/operators/setup-network/create-private#network-access-control"},"here"),"."),(0,o.kt)("h2",{id:"summary-of-related-links"},"Summary of Related Links"),(0,o.kt)("p",null,"Here is a summary of the links mentioned on this page:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/install-node#network-requirements"},"Network requirements")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/concepts/design/p2p"},"Network communication")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/basic-node-configuration#config-file"},"The node configuration file")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/developers/json-rpc/"},"Interacting with the Casper JSON-RPC API")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/developers/cli/"},"Interacting with the network using CLI")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/becoming-a-validator/bonding#example-bonding-transaction"},"Bonding")," or ",(0,o.kt)("a",{parentName:"li",href:"/operators/becoming-a-validator/unbonding"},"unbonding")," as a validator"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/basic-node-configuration#trusted-hash-for-synchronizing"},"Getting a trusted node hash")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/upgrade#verifying-successful-staging"},"Verifying successful staging")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup/joining#step-7-confirm-the-node-is-synchronized"},"Confirming that the node is synchronized")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/developers/dapps/monitor-and-consume-events"},"Monitoring and consuming events")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/operators/setup-network/create-private#network-access-control"},"Private network access control")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://support.casperlabs.io/hc/en-gb/sections/6960448246683-Node-Operation-FAQ"},"FAQs for a basic validator node ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.cspr.community/docs/faq-validator.html"},"External FAQs on Mainnet and Testnet validator node setup"))))}h.isMDXComponent=!0}}]);