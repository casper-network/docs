"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[9514,4972],{4972:function(e,t,n){n.r(t),n.d(t,{default:function(){return o}});var a=n(7294),r=n(5999),l=n(833),i=n(7873);function o(){return a.createElement(a.Fragment,null,a.createElement(l.d,{title:(0,r.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(i.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(r.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},4477:function(e,t,n){n.d(t,{E:function(){return o},q:function(){return i}});var a=n(7294),r=n(4700),l=a.createContext(null);function i(e){var t=e.children,n=e.version;return a.createElement(l.Provider,{value:n},t)}function o(){var e=(0,a.useContext)(l);if(null===e)throw new r.i6("DocsVersionProvider");return e}},4471:function(e,t,n){n.r(t),n.d(t,{default:function(){return Ce}});var a=n(7294),r=n(6010),l=n(833),i=n(5281),o=n(3320),c=n(2802),d=n(4477),s=n(1116),u=n(7873),m=n(4334),b=n(5999),p=n(2466),v=n(5936);var h={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"};function f(){var e=function(e){var t=e.threshold,n=(0,a.useState)(!1),r=n[0],l=n[1],i=(0,a.useRef)(!1),o=(0,p.Ct)(),c=o.startScroll,d=o.cancelScroll;return(0,p.RF)((function(e,n){var a=e.scrollY,r=null==n?void 0:n.scrollY;r&&(i.current?i.current=!1:a>=r?(d(),l(!1)):a<t?l(!1):a+window.innerHeight<document.documentElement.scrollHeight&&l(!0))})),(0,v.S)((function(e){e.location.hash&&(i.current=!0,l(!1))})),{shown:r,scrollToTop:function(){return c(0)}}}({threshold:300}),t=e.shown,n=e.scrollToTop;return a.createElement("button",{"aria-label":(0,b.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,m.Z)("clean-btn",i.k.common.backToTopButton,h.backToTopButton,t&&h.backToTopButtonShow),type:"button",onClick:n})}var E=n(6550),g=n(7524),k=n(6668),_=n(1327),C=n(3117);function I(e){return a.createElement("svg",(0,C.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}var S={collapseSidebarButton:"collapseSidebarButton_JQG6",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_Iseg"};function N(e){var t=e.onClick;return a.createElement("button",{type:"button",tabIndex:0,title:(0,b.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,b.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,r.Z)("button button--secondary button--outline",S.collapseSidebarButton),onClick:t},a.createElement(I,{className:S.collapseSidebarButtonIcon}))}var Z=n(9689),x=n(102),T=n(4700),y=Symbol("EmptyContext"),B=a.createContext(y);function w(e){var t=e.children,n=(0,a.useState)(null),r=n[0],l=n[1],i=(0,a.useMemo)((function(){return{expandedItem:r,setExpandedItem:l}}),[r]);return a.createElement(B.Provider,{value:i},t)}var L=n(6043),A=n(8596),H=n(9960),P=n(2389),M=["item","onItemClick","activePath","level","index"];function F(e){var t=e.categoryLabel,n=e.onClick;return a.createElement("button",{"aria-label":(0,b.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function W(e){var t=e.item,n=e.onItemClick,r=e.activePath,l=e.level,o=e.index,d=(0,x.Z)(e,M),s=t.items,u=t.label,b=t.collapsible,p=t.className,v=t.href,h=(0,k.L)().docs.sidebar.autoCollapseCategories,f=function(e){var t=(0,P.Z)();return(0,a.useMemo)((function(){return e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0}),[e,t])}(t),E=(0,c._F)(t,r),g=(0,A.Mg)(v,r),_=(0,L.u)({initialState:function(){return!!b&&(!E&&t.collapsed)}}),I=_.collapsed,S=_.setCollapsed,N=function(){var e=(0,a.useContext)(B);if(e===y)throw new T.i6("DocSidebarItemsExpandedStateProvider");return e}(),Z=N.expandedItem,w=N.setExpandedItem,W=function(e){void 0===e&&(e=!I),w(e?null:o),S(e)};return function(e){var t=e.isActive,n=e.collapsed,r=e.updateCollapsed,l=(0,T.D9)(t);(0,a.useEffect)((function(){t&&!l&&n&&r(!1)}),[t,l,n,r])}({isActive:E,collapsed:I,updateCollapsed:W}),(0,a.useEffect)((function(){b&&null!=Z&&Z!==o&&h&&S(!0)}),[b,Z,o,S,h]),a.createElement("li",{className:(0,m.Z)(i.k.docs.docSidebarItemCategory,i.k.docs.docSidebarItemCategoryLevel(l),"menu__list-item",{"menu__list-item--collapsed":I},p)},a.createElement("div",{className:(0,m.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":g})},a.createElement(H.Z,(0,C.Z)({className:(0,m.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!v&&b,"menu__link--active":E}),onClick:b?function(e){null==n||n(t),v?W(!1):(e.preventDefault(),W())}:function(){null==n||n(t)},"aria-current":g?"page":void 0,"aria-expanded":b?!I:void 0,href:b?null!=f?f:"#":f},d),u),v&&b&&a.createElement(F,{categoryLabel:u,onClick:function(e){e.preventDefault(),W()}})),a.createElement(L.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:I},a.createElement(Q,{items:s,tabIndex:I?-1:0,onItemClick:n,activePath:r,level:l+1})))}var U=n(3919),R=n(9471),V={menuExternalLink:"menuExternalLink_NmtK"},D=["item","onItemClick","activePath","level","index"];function q(e){var t=e.item,n=e.onItemClick,r=e.activePath,l=e.level,o=(e.index,(0,x.Z)(e,D)),d=t.href,s=t.label,u=t.className,b=t.autoAddBaseUrl,p=(0,c._F)(t,r),v=(0,U.Z)(d);return a.createElement("li",{className:(0,m.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(l),"menu__list-item",u),key:s},a.createElement(H.Z,(0,C.Z)({className:(0,m.Z)("menu__link",!v&&V.menuExternalLink,{"menu__link--active":p}),autoAddBaseUrl:b,"aria-current":p?"page":void 0,to:d},v&&{onClick:n?function(){return n(t)}:void 0},o),s,!v&&a.createElement(R.Z,null)))}var z={menuHtmlItem:"menuHtmlItem_M9Kj"};function G(e){var t=e.item,n=e.level,r=e.index,l=t.value,o=t.defaultStyle,c=t.className;return a.createElement("li",{className:(0,m.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(n),o&&[z.menuHtmlItem,"menu__list-item"],c),key:r,dangerouslySetInnerHTML:{__html:l}})}var Y=["item"];function j(e){var t=e.item,n=(0,x.Z)(e,Y);switch(t.type){case"category":return a.createElement(W,(0,C.Z)({item:t},n));case"html":return a.createElement(G,(0,C.Z)({item:t},n));default:return a.createElement(q,(0,C.Z)({item:t},n))}}var K=["items"];function O(e){var t=e.items,n=(0,x.Z)(e,K);return a.createElement(w,null,t.map((function(e,t){return a.createElement(j,(0,C.Z)({key:t,item:e,index:t},n))})))}var Q=(0,a.memo)(O),J={menu:"menu_Y1UP",menuWithAnnouncementBar:"menuWithAnnouncementBar_fPny"};function X(e){var t=e.path,n=e.sidebar,l=e.className,o=function(){var e=(0,Z.nT)().isActive,t=(0,a.useState)(e),n=t[0],r=t[1];return(0,p.RF)((function(t){var n=t.scrollY;e&&r(0===n)}),[e]),e&&n}();return a.createElement("nav",{"aria-label":(0,b.I)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,r.Z)("menu thin-scrollbar",J.menu,o&&J.menuWithAnnouncementBar,l)},a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(Q,{items:n,activePath:t,level:1})))}var $={sidebar:"sidebar_mhZE",sidebarWithHideableNavbar:"sidebarWithHideableNavbar__6UL",sidebarHidden:"sidebarHidden__LRd",sidebarLogo:"sidebarLogo_F_0z"};function ee(e){var t=e.path,n=e.sidebar,l=e.onCollapse,i=e.isHidden,o=(0,k.L)(),c=o.navbar.hideOnScroll,d=o.docs.sidebar.hideable;return a.createElement("div",{className:(0,r.Z)($.sidebar,c&&$.sidebarWithHideableNavbar,i&&$.sidebarHidden)},c&&a.createElement(_.Z,{tabIndex:-1,className:$.sidebarLogo}),a.createElement(X,{path:t,sidebar:n}),d&&a.createElement(N,{onClick:l}))}var te=a.memo(ee),ne=n(3102),ae=n(2961),re=function(e){var t=e.sidebar,n=e.path,l=(0,ae.e)();return a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(Q,{items:t,activePath:n,onItemClick:function(e){"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function le(e){return a.createElement(ne.Zo,{component:re,props:e})}var ie=a.memo(le);function oe(e){var t=(0,g.i)(),n="desktop"===t||"ssr"===t,r="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(te,e),r&&a.createElement(ie,e))}var ce={expandButton:"expandButton_pI3x",expandButtonIcon:"expandButtonIcon_Vtwu"};function de(e){var t=e.toggleSidebar;return a.createElement("div",{className:ce.expandButton,title:(0,b.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,b.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(I,{className:ce.expandButtonIcon}))}var se=n(2263),ue=n(1931),me={docSidebarContainer:"docSidebarContainer_NXUq",docSidebarContainerHidden:"docSidebarContainerHidden_fULV",sidebarViewport:"sidebarViewport_P4AQ"};function be(e){var t,n=e.children,r=(0,s.V)();return a.createElement(a.Fragment,{key:null!=(t=null==r?void 0:r.name)?t:"noSidebar"},n)}function pe(e){var t,n=e.sidebar,l=e.hiddenSidebarContainer,o=e.setHiddenSidebarContainer,c=(0,E.TH)().pathname,d=(0,se.Z)().siteConfig.customFields,s=(0,a.useState)(!1),u=s[0],m=s[1],b=(0,a.useState)(0),p=b[0],v=b[1],h=a.useRef(null),f=(0,a.useCallback)((function(){u&&m(!1),o((function(e){return!e}))}),[o,u]);return(0,a.useEffect)((function(){!function(){if(d.directusUrl&&d.directusGraphqlUrl&&d.siteUrl){if(!(0,ue.Z)())return;var e=ue.Z?document.querySelectorAll('*[class^="navbar_wrapper"]')[0]:null;e&&(h.current=e,v(h.current.offsetHeight))}}()}),[]),a.createElement("aside",{className:(0,r.Z)(i.k.docs.docSidebarContainer,me.docSidebarContainer,l&&me.docSidebarContainerHidden),onTransitionEnd:function(e){e.currentTarget.classList.contains(me.docSidebarContainer)&&l&&m(!0)},style:(t={},t["--dynamicNavBarSiteHeight"]=(d.directusUrl&&d.directusGraphqlUrl&&d.siteUrl?p:0)+"px",t)},a.createElement(be,null,a.createElement("div",{className:(0,r.Z)(me.sidebarViewport,u&&me.sidebarViewportHidden)},a.createElement(oe,{sidebar:n,path:c,onCollapse:f,isHidden:u}),u&&a.createElement(de,{toggleSidebar:f}))))}var ve={docMainContainer:"docMainContainer_RiV8",docMainContainerEnhanced:"docMainContainerEnhanced_u7bj",docItemWrapperEnhanced:"docItemWrapperEnhanced_mUgT"};function he(e){var t=e.hiddenSidebarContainer,n=e.children,l=(0,s.V)();return a.createElement("main",{className:(0,r.Z)(ve.docMainContainer,(t||!l)&&ve.docMainContainerEnhanced)},a.createElement("div",{className:(0,r.Z)("container padding-top--md padding-bottom--lg",ve.docItemWrapper,t&&ve.docItemWrapperEnhanced)},n))}var fe={docPage:"docPage_qMb8",docsWrapper:"docsWrapper_W2AM"};function Ee(e){var t=e.children,n=(0,s.V)(),r=(0,a.useState)(!1),l=r[0],i=r[1];return a.createElement(u.Z,{wrapperClassName:fe.docsWrapper},a.createElement(f,null),a.createElement("div",{className:fe.docPage},n&&a.createElement(pe,{sidebar:n.items,hiddenSidebarContainer:l,setHiddenSidebarContainer:i}),a.createElement(he,{hiddenSidebarContainer:l},t)))}var ge=n(4972),ke=n(197);function _e(e){var t=e.versionMetadata;return a.createElement(a.Fragment,null,a.createElement(ke.Z,{version:t.version,tag:(0,o.os)(t.pluginId,t.version)}),a.createElement(l.d,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function Ce(e){var t=e.versionMetadata,n=(0,c.hI)(e);if(!n)return a.createElement(ge.default,null);var o=n.docElement,u=n.sidebarName,m=n.sidebarItems;return a.createElement(a.Fragment,null,a.createElement(_e,e),a.createElement(l.FG,{className:(0,r.Z)(i.k.wrapper.docsPages,i.k.page.docsDocPage,e.versionMetadata.className)},a.createElement(d.q,{version:t},a.createElement(s.b,{name:u,items:m},a.createElement(Ee,null,o)))))}}}]);