"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[5870],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var a=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=a.createContext({}),d=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},p=function(e){var n=d(e.components);return a.createElement(l.Provider,{value:n},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},h=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(t),h=i,m=c["".concat(l,".").concat(h)]||c[h]||u[h]||o;return t?a.createElement(m,r(r({ref:n},p),{},{components:t})):a.createElement(m,r({ref:n},p))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,r=new Array(o);r[0]=h;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[c]="string"==typeof e?e:i,r[1]=s;for(var d=2;d<o;d++)r[d]=t[d];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}h.displayName="MDXCreateElement"},8319:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return c}});var a=t(7462),i=t(3366),o=(t(7294),t(3905)),r=["components"],s={},l="Casper Node Networking Protocol",d={unversionedId:"concepts/design/networking-protocol",id:"concepts/design/networking-protocol",title:"Casper Node Networking Protocol",description:"Casper Node Networking Protocol (Mainnet Protocol Version 1.5.0)",source:"@site/source/docs/casper/concepts/design/networking-protocol.md",sourceDirName:"concepts/design",slug:"/concepts/design/networking-protocol",permalink:"/concepts/design/networking-protocol",draft:!1,editUrl:"https://github.com/casper-network/docs/tree/dev/source/docs/casper/concepts/design/networking-protocol.md",tags:[],version:"current",lastUpdatedAt:1693580435,formattedLastUpdatedAt:"Sep 1, 2023",frontMatter:{}},p={},c=[{value:"Casper Node Networking Protocol (Mainnet Protocol Version 1.5.0)",id:"casper-node-networking-protocol-mainnet-protocol-version-150",level:2},{value:"Connection Level",id:"connection-level",level:2},{value:"Reciprocity, retries and data direction",id:"reciprocity-retries-and-data-direction",level:3},{value:"TLS parameters",id:"tls-parameters",level:3},{value:"Discovery",id:"discovery",level:3},{value:"Framing",id:"framing",level:2},{value:"Encoding",id:"encoding",level:2},{value:"The <code>Message</code> Type",id:"the-message-type",level:2},{value:"Handshake Behavior",id:"handshake-behavior",level:2},{value:"Blocking Nodes",id:"blocking-nodes",level:2},{value:"The <code>Payload</code> Type",id:"the-payload-type",level:2},{value:"Consensus",id:"consensus",level:3},{value:"Gossiping",id:"gossiping",level:3},{value:"Unsafe-for-syncing",id:"unsafe-for-syncing",level:3},{value:"Gossiping",id:"gossiping-1",level:2},{value:"GetRequests",id:"getrequests",level:2},{value:"Finality Signatures",id:"finality-signatures",level:2},{value:"Trie Chunking",id:"trie-chunking",level:2}],u={toc:c},h="wrapper";function m(e){var n=e.components,t=(0,i.Z)(e,r);return(0,o.kt)(h,(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"casper-node-networking-protocol"},"Casper Node Networking Protocol"),(0,o.kt)("h2",{id:"casper-node-networking-protocol-mainnet-protocol-version-150"},"Casper Node Networking Protocol (Mainnet Protocol Version 1.5.0)"),(0,o.kt)("p",null,"This is a description of the ",(0,o.kt)("inlineCode",{parentName:"p"},"casper-node"),"'s networking protocol. This document follows the conventions laid out in ",(0,o.kt)("a",{parentName:"p",href:"https://datatracker.ietf.org/doc/html/rfc2119"},"RFC2119"),"."),(0,o.kt)("h2",{id:"connection-level"},"Connection Level"),(0,o.kt)("p",null,"Any ",(0,o.kt)("inlineCode",{parentName:"p"},"casper-node")," taking part in the Casper network SHOULD open connections to every other casper-node it is aware of and has not blocked. These connections are established using TLS, presenting a client certificate."),(0,o.kt)("h3",{id:"reciprocity-retries-and-data-direction"},"Reciprocity, retries and data direction"),(0,o.kt)("p",null,"A connection that was initiated by a node is considered an ",(0,o.kt)("em",{parentName:"p"},"outgoing")," connection by the node itself, but an ",(0,o.kt)("em",{parentName:"p"},"incoming")," connection by all other peers."),(0,o.kt)("p",null,"A node that created an outgoing connection SHOULD terminate the connection if it does not detect an incoming connection from the connected-to node within a short amount of time."),(0,o.kt)("p",null,"A node that receives an incoming connection MUST eventually establish an outgoing connection to the node."),(0,o.kt)("p",null,"A node SHOULD retry any failed outgoing connection periodically with exponential backoff. A node MUST NOT attempt to reconnect more than once per second."),(0,o.kt)("p",null,"Nodes MUST NOT send data through incoming connections, other than handshakes. Nodes MUST NOT accept any data coming through outgoing connections, other than handshakes."),(0,o.kt)("h3",{id:"tls-parameters"},"TLS parameters"),(0,o.kt)("p",null,"Any node creating a connection to a node MUST present a client certificate with the following properties:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Signature algorithm: ",(0,o.kt)("inlineCode",{parentName:"li"},"ECDSA_WITH_SHA512")),(0,o.kt)("li",{parentName:"ul"},"Subject name: Same as issuer name (self-signed certificate!)"),(0,o.kt)("li",{parentName:"ul"},"Serial number: 1"),(0,o.kt)("li",{parentName:"ul"},'Expiration ("not before"): Must be earlier than current time.'),(0,o.kt)("li",{parentName:"ul"},'Expiration ("not after"): Must be later than current time.'),(0,o.kt)("li",{parentName:"ul"},"Signature: Must be using ",(0,o.kt)("inlineCode",{parentName:"li"},"SECP521R1")," with ",(0,o.kt)("inlineCode",{parentName:"li"},"SHA512")," and valid.")),(0,o.kt)("p",null,"The SHA512 fingerprint of the ",(0,o.kt)("em",{parentName:"p"},"public key")," is considered the ",(0,o.kt)("strong",{parentName:"p"},"NodeID")," of the node."),(0,o.kt)("p",null,"Any node MUST immediately terminate a connection if it does not match the given parameters. The same certificate MUST be used as a server certificate for other clients connecting to this node."),(0,o.kt)("p",null,"An incoming connection with a valid TLS certificate SHOULD be accepted. As all certificates are self-signed, no further checking is done."),(0,o.kt)("h3",{id:"discovery"},"Discovery"),(0,o.kt)("p",null,"A node address is defined as an IPv4 address and a port. A node's address is the publicly reachable IP address and port that it is listening on for node-to-node-communication."),(0,o.kt)("p",null,"Every node SHOULD have one or more so-called ",(0,o.kt)("em",{parentName:"p"},"known node addresses")," of other nodes configured."),(0,o.kt)("p",null,"On start-up, a node SHOULD attempt to connect to all known nodes. A node SHOULD never forget a known node address."),(0,o.kt)("p",null,"Every node MUST periodically gossip its own node address to the network (see gossiping below)."),(0,o.kt)("p",null,"A node ",(0,o.kt)("em",{parentName:"p"},"learns")," new node addresses through receiving a gossiped node address, or being told of an address through the handshake."),(0,o.kt)("p",null,"Upon learning of a previously unknown node address, a node SHOULD attempt to connect to it."),(0,o.kt)("p",null,"After failing to connect to a node address, a node MAY forget it after a certain amount of retries, this process is called ",(0,o.kt)("em",{parentName:"p"},"forgetting")," a node. An address that has been forgotten will be considered new the next time it is learned."),(0,o.kt)("p",null,"A node MUST NOT forget the known addresses it was configured with initially."),(0,o.kt)("h2",{id:"framing"},"Framing"),(0,o.kt)("p",null,"To send a message to a peer across an established TLS connection, a node MUST send a message length header consisting of a 32 byte big endian integer with the message length first."),(0,o.kt)("p",null,"A node receiving a message length header that exceeds the maximum message size specified in the chainspec MUST immediately terminate the connection."),(0,o.kt)("h2",{id:"encoding"},"Encoding"),(0,o.kt)("p",null,"The node uses three encoding schemes: Handshakes (see below) are encoded using ",(0,o.kt)("a",{parentName:"p",href:"https://msgpack.org"},"MessagePack"),", while regular messages are encoded using ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/bincode"},"bincode"),". Many (but not all) data objects use ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/casper-types/latest/casper_types/bytesrepr/index.html"},(0,o.kt)("inlineCode",{parentName:"a"},"bytesrepr"))," for serialization."),(0,o.kt)("p",null,"The node uses the ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/rmp-serde/0.14.4/rmp_serde/index.html"},(0,o.kt)("inlineCode",{parentName:"a"},"rmp-serde"))," crate, version ",(0,o.kt)("inlineCode",{parentName:"p"},"0.14.4"),", which is kept fixed to ensure handshake compatibility with protocol version 1.0 of the node."),(0,o.kt)("p",null,"All nodes MUST use the following settings for ",(0,o.kt)("inlineCode",{parentName:"p"},"bincode")," encoding of network messages:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Byte limit: Unlimited"),(0,o.kt)("li",{parentName:"ul"},"Endianness: Little Endian"),(0,o.kt)("li",{parentName:"ul"},"Integer Encoding: Varint"),(0,o.kt)("li",{parentName:"ul"},"Trailing Bytes: Not allowed")),(0,o.kt)("p",null,"Any other use of ",(0,o.kt)("inlineCode",{parentName:"p"},"bincode")," encoding (e.g. for GetRequest payloads, see below) MUST use the following ",(0,o.kt)("inlineCode",{parentName:"p"},"bincode")," encoding settings:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Byte limit: Unlimited"),(0,o.kt)("li",{parentName:"ul"},"Endianness: Little Endian"),(0,o.kt)("li",{parentName:"ul"},"Integer Encoding: Fixint"),(0,o.kt)("li",{parentName:"ul"},"Trailing Bytes: Allowed")),(0,o.kt)("p",null,"Unless noted otherwise, any structure encoded as MessagePack or bincode is serialized using the standard ",(0,o.kt)("a",{parentName:"p",href:"https://serde.rs"},(0,o.kt)("inlineCode",{parentName:"a"},"serde")),"-derived encoding. For ",(0,o.kt)("inlineCode",{parentName:"p"},"bytesrepr")," serialization refer to the specific implementations in the ",(0,o.kt)("inlineCode",{parentName:"p"},"bytesrepr")," crate."),(0,o.kt)("p",null,"Any data types given from here on out are described using simplified ",(0,o.kt)("a",{parentName:"p",href:"https://www.rust-lang.org/"},"Rust")," structure definitions."),(0,o.kt)("h2",{id:"the-message-type"},"The ",(0,o.kt)("inlineCode",{parentName:"h2"},"Message")," Type"),(0,o.kt)("p",null,"The following data types make up the networking protocol:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"enum Message {\n    Handshake {\n        network_name: String,\n        public_addr: SocketAddr,\n        // default: 1.0\n        protocol_version: ProtocolVersion,\n        // default: `None`\n        consensus_certificate: Option<ConsensusCertificate>,\n        // default: false\n        is_syncing: bool,\n        // default: `None`\n        chainspec_hash: Option<Digest>,\n    },\n    Payload(Payload),\n}\n\nstruct ConsensusCertificate {\n    public_key: PublicKey,\n    signature: Signature,\n}\n\nstruct Digest([u8; 32]);\n")),(0,o.kt)("p",null,"For ",(0,o.kt)("a",{parentName:"p",href:"https://doc.rust-lang.org/std/string/struct.String.html"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),", ",(0,o.kt)("a",{parentName:"p",href:"https://doc.rust-lang.org/std/net/enum.SocketAddr.html"},(0,o.kt)("inlineCode",{parentName:"a"},"SocketAddr")),", ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/casper-types/latest/casper_types/struct.ProtocolVersion.html"},(0,o.kt)("inlineCode",{parentName:"a"},"ProtocolVersion")),", ",(0,o.kt)("a",{parentName:"p",href:"https://doc.rust-lang.org/std/option/enum.Option.html"},(0,o.kt)("inlineCode",{parentName:"a"},"Option")),", ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/casper-types/latest/casper_types/crypto/enum.PublicKey.html"},(0,o.kt)("inlineCode",{parentName:"a"},"PublicKey")),", ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/casper-types/latest/casper_types/crypto/enum.Signature.html"},(0,o.kt)("inlineCode",{parentName:"a"},"Signature"))," see the respective docs and details below."),(0,o.kt)("h2",{id:"handshake-behavior"},"Handshake Behavior"),(0,o.kt)("p",null,"A node establishing a new connection MUST immediately send a handshake through said connection to the peer, regardless of whether an incoming or outgoing connection was established (this is an exception to the restriction of only sending data through outgoing connections)."),(0,o.kt)("p",null,"A handshake MUST be encoded using the ",(0,o.kt)("inlineCode",{parentName:"p"},"Message::Handshake")," structure. A node running version 1.5 SHOULD NOT omit any of the fields for which default values are available (",(0,o.kt)("inlineCode",{parentName:"p"},"protocol_version"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"consensus_certificate"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"is_syncing"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"chainspec_hash"),"). A node MUST accept any handshake that omits one or more of these fields and fill them with defaults."),(0,o.kt)("p",null,"After receiving a handshake, a node MUST compare the ",(0,o.kt)("inlineCode",{parentName:"p"},"network_name"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"protocol_version")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"chainspec_hash")," fields against its own configuration: If any of these do not match, it MUST disconnect from the node and SHOULD block it."),(0,o.kt)("p",null,"A node MUST mark any peer that connects to it (thus is an incoming connection from the perspective of the node) with a value of ",(0,o.kt)("inlineCode",{parentName:"p"},"is_syncing")," set to ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),' as "syncing" and MUST NOT allow any of its own messages that are marked unsafe-for-syncing to be sent to that node, by silently dropping them instead.'),(0,o.kt)("p",null,"A node MAY compare peers that provide a ",(0,o.kt)("inlineCode",{parentName:"p"},"consensus_certificate")," to the currently active set of validators and mark it as an active validator to give it preferential treatment when outgoing bandwidth is limited."),(0,o.kt)("p",null,"Upon handshake completion, the node SHOULD learn the provided ",(0,o.kt)("inlineCode",{parentName:"p"},"public_addr"),"."),(0,o.kt)("h2",{id:"blocking-nodes"},"Blocking Nodes"),(0,o.kt)("p",null,"If a node blocks a peer, it MUST sever all incoming and outgoing connections to said node. It MUST take note of the NodeId of the node, marking it as blocked and MUST not allow any new connection to proceed past the handshake."),(0,o.kt)("p",null,"A node MUST NOT block peers based on IP address or port. Nodes MUST NOT block peers for more than an hour."),(0,o.kt)("p",null,"After a block on a node is expired, the node SHOULD ",(0,o.kt)("em",{parentName:"p"},"forget")," the nodes IP address, allowing a later ",(0,o.kt)("em",{parentName:"p"},"learning")," of said address again."),(0,o.kt)("h2",{id:"the-payload-type"},"The ",(0,o.kt)("inlineCode",{parentName:"h2"},"Payload")," Type"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"Payload")," (found in the node sources as ",(0,o.kt)("inlineCode",{parentName:"p"},"Message")," in ",(0,o.kt)("inlineCode",{parentName:"p"},"payload.rs"),") contains variants for all node-to-node communicating subsystems of a running node, which are described below. Note that some of the variants have been renamed for clarity in this specification. Since field names are not used in ",(0,o.kt)("inlineCode",{parentName:"p"},"bincode")," encoding, this should have no effect on implementations."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"enum Payload {\n    Consensus(ConsensusMessage),\n    DeployGossiper(DeployGossiperMessage),\n    AddressGossiper(AddressGossiperMessage),\n    GetRequest {\n        tag: Tag,\n        serialized_id: Vec<u8>,\n    },\n    GetResponse {\n        tag: Tag,\n        serialized_item: Vec<[u8]>,\n    },\n    FinalitySignature(FinalitySignature),\n}\n\nenum DeployGossiperMessage {\n    Gossip(DeployHash),\n    GossipResponse {\n        item_id: DeployHash,\n        is_already_held: bool,\n    },\n}\n\nenum AddressGossiperMessage {\n    Gossip(GossippedAddress),\n    GossipResponse {\n        item_id: GossippedAddress,\n        is_already_held: bool,\n    },\n}\n\nstruct DeployHash(Digest);\nstruct GossipedAddress(SocketAddr);\n")),(0,o.kt)("h3",{id:"consensus"},"Consensus"),(0,o.kt)("p",null,"A consensus message is sent exclusively between instances of the consensus component, from one peer to another. A precise description of the Highway consensus protocol is out of scope of this document, see the ",(0,o.kt)("inlineCode",{parentName:"p"},"consensus::Message")," type or an appropriate description of the underlying protocol for details."),(0,o.kt)("h3",{id:"gossiping"},"Gossiping"),(0,o.kt)("p",null,"Gossiping messages are sent by a node to a subset of its peers to announce the availability of new data items. Peers MUST be distinguished by NodeID, not by listening address."),(0,o.kt)("p",null,"A node must support a gossiper for deploys and one for ",(0,o.kt)("inlineCode",{parentName:"p"},"GossippedAddress"),", which is an alias for the regular Rust standard library's ",(0,o.kt)("inlineCode",{parentName:"p"},"SocketAddr"),"."),(0,o.kt)("p",null,"A node SHOULD begin a gossiping process for all deploys previously unknown to it. A node MUST periodically send an ",(0,o.kt)("inlineCode",{parentName:"p"},"AddressGossiperMessage::Gossip")," message to a random subset selected in a similar manner as the one for deploy gossip to make its own address known, see the gossiping process section below for details."),(0,o.kt)("h3",{id:"unsafe-for-syncing"},"Unsafe-for-syncing"),(0,o.kt)("p",null,"A node that is syncing MUST indicate this by setting ",(0,o.kt)("inlineCode",{parentName:"p"},"is_syncing")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),"."),(0,o.kt)("p",null,"A node MAY implement a scheme for request throttling/backpressure for GetRequests (see below) of ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieNode"),"s that can cause issues with peers that are also sending GetRequests."),(0,o.kt)("p",null,"A node that succeeds in a handshake with a peer that has set ",(0,o.kt)("inlineCode",{parentName:"p"},"is_syncing")," MUST make note of this flag. If the node itself is implementing the feature described above, it MUST NOT make any GetRequests directed at this peer for ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieNode"),"s."),(0,o.kt)("h2",{id:"gossiping-1"},"Gossiping"),(0,o.kt)("p",null,"Gossiping is distributing items across the network by sending it to a subset of known peers that do not have the item already, and having them repeat this process until a certain degree of saturation is observed."),(0,o.kt)("p",null,"Any item has an associated ID type which denotes what is used to uniquely identify it when gossiping. If an item is small enough, the ID may just be the item itself."),(0,o.kt)("p",null,"Gossiper messages have the following structure:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"enum GossiperMessage {\n    Gossip(Id),\n    GossipResponse {\n        item_id: Id,\n        is_already_held: bool,\n    },\n}\n")),(0,o.kt)("p",null,"To gossip, a node MAY send a ",(0,o.kt)("inlineCode",{parentName:"p"},"GossiperMessage::Gossip")," message to a random subset of configurable size of peers to announce that it has received and validated a new item. Any peer receiving such a message SHOULD answer with a ",(0,o.kt)("inlineCode",{parentName:"p"},"GossiperMessage:GossipResponse"),", citing the given id and using ",(0,o.kt)("inlineCode",{parentName:"p"},"is_already_held")," to indicate whether it already possessed the given item."),(0,o.kt)("p",null,"The node SHOULD attempt to continue to find peers with a negative response, up to a configurable limit of attempts and/or success rate, or until running out of valid peers."),(0,o.kt)("p",null,"The node that initiated the gossip MUST keep track of which peer replied with a positive (",(0,o.kt)("inlineCode",{parentName:"p"},"is_already_held")," being ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),") response and MUST NOT send another ",(0,o.kt)("inlineCode",{parentName:"p"},"Gossip")," message for same ID to any of these peers during this gossip process. However, it MAY restart gossiping the same item at a later time, considering these peers again."),(0,o.kt)("p",null,"If a node receives a negative ",(0,o.kt)("inlineCode",{parentName:"p"},"GossiperMessage::GossipResponse")," (i.e. ",(0,o.kt)("inlineCode",{parentName:"p"},"is_already_held")," being ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),"), and the item's ID is not the item itself, it MUST handle that repsponse as if the peer had sent a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetRequest")," for the item (see GetRequests section below)."),(0,o.kt)("h2",{id:"getrequests"},"GetRequests"),(0,o.kt)("p",null,'The "GetRequests" mechanism allows retrieving various items through primary or derived keys from peers.'),(0,o.kt)("p",null,"A peer MAY send a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetRequest")," (see ",(0,o.kt)("inlineCode",{parentName:"p"},"Payload::GetRequest"),") with a ",(0,o.kt)("inlineCode",{parentName:"p"},"Tag")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"serialized_id")," payload. Both ",(0,o.kt)("inlineCode",{parentName:"p"},"serialized_id")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"serialized_item")," MUST be encoded using ",(0,o.kt)("inlineCode",{parentName:"p"},"bincode"),' (see "Encoding" section for details).'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"pub enum Tag {\n    Deploy,\n    FinalizedApprovals,\n    Block,\n    GossipedAddress,\n    BlockAndMetadataByHeight,\n    BlockHeaderByHash,\n    BlockHeaderAndFinalitySignaturesByHeight,\n    TrieOrChunk,\n    BlockAndDeploysByHash,\n    BlockHeaderBatch,\n    FinalitySignaturesByHash,\n}\n")),(0,o.kt)("p",null,"The tag dictates which item is being retrieved, and which key (ID type) is being used."),(0,o.kt)("p",null,"A node that receives a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetRequest")," from a peer SHOULD return a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetResponse")," (see ",(0,o.kt)("inlineCode",{parentName:"p"},"Payload::GetResponse"),"). The ",(0,o.kt)("inlineCode",{parentName:"p"},"GetResponse")," MUST use the same ",(0,o.kt)("inlineCode",{parentName:"p"},"Tag"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"pub enum FetchedOrNotFound<T, Id> {\n    Fetched(T),\n    NotFound(Id),\n}\n")),(0,o.kt)("p",null,"If the item was found, ",(0,o.kt)("inlineCode",{parentName:"p"},"serialized_item")," MUST contain a serialized ",(0,o.kt)("inlineCode",{parentName:"p"},"FetchedOrNotFound::Fetched")," instance, with the inner value ",(0,o.kt)("inlineCode",{parentName:"p"},"T")," being the item."),(0,o.kt)("p",null,"If the item was not found, ",(0,o.kt)("inlineCode",{parentName:"p"},"serialized_item")," MUST contain a ",(0,o.kt)("inlineCode",{parentName:"p"},"FetchedOrNotFound::NotFound")," instance, with the inner value ",(0,o.kt)("inlineCode",{parentName:"p"},"Id")," being the ID found in the originating ",(0,o.kt)("inlineCode",{parentName:"p"},"GetRequest"),"."),(0,o.kt)("p",null,"A node MUST not send any items to a peer that it itself has not verified."),(0,o.kt)("p",null,"The following table shows which tag corresponds to which ID and item type. Type definitions for ",(0,o.kt)("inlineCode",{parentName:"p"},"DeployHash")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"GossippedAddress")," can be found earlier in this document, other types are described following this section. Further details of many of these types can be found in the ",(0,o.kt)("a",{parentName:"p",href:"/concepts/serialization-standard"},"Serialization Standard"),", but be aware that those docs describe serializing using bytesrepr rather than bincode."),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Tag"),(0,o.kt)("th",{parentName:"tr",align:null},"ID type"),(0,o.kt)("th",{parentName:"tr",align:null},"Payload (item) type"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"Deploy"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"DeployHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"Deploy"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"FinalizedApprovals"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"DeployHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"FinalizedApprovalsWithId"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"Block"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"Block"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"GossipedAddress"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"GossipedAddress")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"GossipedAddress"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"BlockAndMetadataByHeight"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"u64")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockWithMetadata"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"BlockHeaderByHash"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHeader"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"BlockHeaderAndFinalitySignaturesByHeight"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"u64")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHeaderWithMetadata"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"TrieOrChunk"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"TrieOrChunkId")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"TrieOrChunk"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"BlockAndDeploysByHash"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockAndDeploys"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"BlockHeaderBatch"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHeadersBatchId")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHeadersBatch"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"FinalitySignaturesByHash"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockHash")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"BlockSignatures"))))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"pub struct Deploy {\n    hash: DeployHash,\n    header: DeployHeader,\n    payment: ExecutableDeployItem,\n    session: ExecutableDeployItem,\n    approvals: BTreeSet<Approval>,\n}\n\nstruct DeployHeader {\n    account: PublicKey,\n    timestamp: u64,\n    ttl: u64,\n    gas_price: u64,\n    body_hash: Digest,\n    dependencies: Vec<DeployHash>,\n    chain_name: String,\n}\n\nenum PublicKey {\n    System,\n    Ed25519(Vec<u8>),\n    Secp256k1(Vec<u8>),\n}\n\nenum ExecutableDeployItem {\n    ModuleBytes {\n        module_bytes: Vec<u8>,\n        args: RuntimeArgs,\n    },\n    StoredContractByHash {\n        hash: [u8; 32],\n        entry_point: String,\n        args: RuntimeArgs,\n    },\n    StoredContractByName {\n        name: String,\n        entry_point: String,\n        args: RuntimeArgs,\n    },\n    StoredVersionedContractByHash {\n        hash: [u8; 32],\n        version: Option<u32>,\n        entry_point: String,\n        args: RuntimeArgs,\n    },\n    StoredVersionedContractByName {\n        name: String,\n        version: Option<u32>,\n        entry_point: String,\n        args: RuntimeArgs,\n    },\n    Transfer { args: RuntimeArgs },\n}\n\nstruct RuntimeArgs(Vec<NamedArg>);\n\nstruct NamedArg(String, CLValue);\n\nstruct CLValue(CLType, Vec<u8>);\n\nenum CLType {\n    Bool,\n    I32,\n    I64,\n    U8,\n    U32,\n    U64,\n    U128,\n    U256,\n    U512,\n    Unit,\n    String,\n    Key,\n    URef,\n    PublicKey,\n    Option(Box<CLType>),\n    List(Box<CLType>),\n    ByteArray(u32),\n    Result { ok: Box<CLType>, err: Box<CLType> },\n    Map { key: Box<CLType>, value: Box<CLType> },\n    Tuple1([Box<CLType>; 1]),\n    Tuple2([Box<CLType>; 2]),\n    Tuple3([Box<CLType>; 3]),\n    Any,\n}\n\nstruct Approval {\n    signer: PublicKey,\n    signature: Signature,\n}\n\nenum Signature {\n    System,\n    Ed25519(Vec<u8>),\n    Secp256k1(Vec<u8>),\n}\n\nstruct FinalizedApprovalsWithId {\n    id: DeployHash,\n    approvals: FinalizedApprovals,\n}\n\nstruct FinalizedApprovals(BTreeSet<Approval>);\n\nstruct Block {\n    hash: BlockHash,\n    header: BlockHeader,\n    body: BlockBody,\n}\n\nstruct BlockHash(Digest);\n\nstruct BlockHeader {\n    parent_hash: BlockHash,\n    state_root_hash: Digest,\n    body_hash: Digest,\n    random_bit: bool,\n    accumulated_seed: Digest,\n    era_end: Option<EraEnd>,\n    timestamp: u64,\n    era_id: u64,\n    height: u64,\n    protocol_version: ProtocolVersion,\n}\n\nstruct EraEnd {\n    era_report: EraReport,\n    next_era_validator_weights: BTreeMap<PublicKey, U512>,\n}\n\nstruct EraReport<VID> {\n    equivocators: Vec<PublicKey>,\n    rewards: BTreeMap<PublicKey, u64>,\n    inactive_validators: Vec<PublicKey>,\n}\n\nstruct ProtocolVersion {\n    major: u32,\n    minor: u32,\n    patch: u32,\n}\n\nstruct BlockBody {\n    proposer: PublicKey,\n    deploy_hashes: Vec<DeployHash>,\n    transfer_hashes: Vec<DeployHash>,\n}\n")),(0,o.kt)("p",null,"Custom variable length encoding is used when serializing ",(0,o.kt)("inlineCode",{parentName:"p"},"U512"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"U256")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"U128")," types. They are encoded in a way equivalent to encoding the following pseudo struct:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"struct Bigint {\n    serialized_length: u8,\n    little_endian_unpadded_bytes: [u8, serialized_length - 1],\n}\n")),(0,o.kt)("p",null,"In other words, the following steps are taken:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"convert the bigint to an array of bytes in little-endian form"),(0,o.kt)("li",{parentName:"ul"},"strip the contiguous range of irrelevant padding ",(0,o.kt)("inlineCode",{parentName:"li"},"0")," bytes from the right hand end, if any"),(0,o.kt)("li",{parentName:"ul"},"prefix this remaining array with a byte holding the number of remaining bytes + 1, to indicate the length of the final byte array including the length byte itself")),(0,o.kt)("p",null,"For a description explaining the use of ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieOrChunk"),' and related types, see the "Trie chunking" section. The relevant types are:'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"struct TrieOrChunkId(u64, Digest);\n\nenum TrieOrChunk {\n    Trie(Bytes),\n    ChunkWithProof(ChunkWithProof),\n}\n\nstruct ChunkWithProof {\n    proof: IndexedMerkleProof,\n    chunk: Bytes,\n}\n\nstruct IndexedMerkleProof {\n    index: u64,\n    count: u64,\n    merkle_proof: Vec<Digest>,\n}\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"BlockHeadersBatchId")," is used to request multiple ",(0,o.kt)("inlineCode",{parentName:"p"},"BlockHeader"),"s with a single request."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"struct BlockHeadersBatchId {\n    highest: u64,\n    lowest: u64,\n}\n\nstruct BlockWithMetadata {\n    block: Block,\n    finality_signatures: BlockSignatures,\n}\n\nstruct BlockHeaderWithMetadata {\n    block_header: BlockHeader,\n    block_signatures: BlockSignatures,\n}\n\nstruct BlockSignatures {\n    block_hash: BlockHash,\n    era_id: u64,\n    proofs: BTreeMap<PublicKey, Signature>,\n}\n\nstruct BlockAndDeploys {\n    block: Block,\n    deploys: Vec<Deploy>,\n}\n\nstruct BlockHeadersBatch(Vec<BlockHeader>);\n")),(0,o.kt)("h2",{id:"finality-signatures"},"Finality Signatures"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"Payload::FinalitySignature")," variant is used when broadcasting finality signatures."),(0,o.kt)("p",null,"A node that is an active validator MUST create and broadcast, i.e. send to all connected peers, a finality signature for every valid block it receives or creates."),(0,o.kt)("h2",{id:"trie-chunking"},"Trie Chunking"),(0,o.kt)("p",null,"Large trie nodes are split when transferred across the network, according to ",(0,o.kt)("inlineCode",{parentName:"p"},"CHUNK_SIZE_BYTES"),", which is set to 8388608 bytes (8 megabytes). Any trie node that is less than 8388608 in size will be represented by a ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieOrChunk::Trie")," instance."),(0,o.kt)("p",null,"Should a trie node be larger than this, a Merkle tree is constructed with ",(0,o.kt)("inlineCode",{parentName:"p"},"CHUNK_SIZE_BYTES")," sized chunks and is identified by the root hash of the resulting tree instead."),(0,o.kt)("p",null,"Peers MUST only request chunks. The ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieOrChunkId")," type allows for requesting the n-th chunk of a given trie node. See the ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/casper-hashing"},"casper-hashing")," crate for details."),(0,o.kt)("p",null,"A node receiving a ",(0,o.kt)("inlineCode",{parentName:"p"},"TrieOrChunk")," item from a peer MUST validate it by checking the given Merkle proof against the item hash (which is the tree's root hash), before accepting it."))}m.isMDXComponent=!0}}]);