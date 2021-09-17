module.exports = {
    debug: true,
    offlineModeActivationStrategies: ["appInstalled", "queryString"],
    pwaHead: [
        {
            tagName: "link",
            rel: "icon",
            href: "/img/pwa/manifest-icon-512.png",
        },
        {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.json",
        },
        {
            tagName: "meta",
            name: "theme-color",
            content: "#20232a",
        },
        {
            tagName: "meta",
            name: "apple-mobile-web-app-capable",
            content: "yes",
        },
        {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "#20232a",
        },
        {
            tagName: "link",
            rel: "apple-touch-icon",
            href: "/img/pwa/manifest-icon-512.png",
        },
        {
            tagName: "link",
            rel: "mask-icon",
            href: "/img/pwa/manifest-icon-512.png",
            color: "#06bcee",
        },
        {
            tagName: "meta",
            name: "msapplication-TileImage",
            href: "/img/pwa/manifest-icon-512.png",
        },
        {
            tagName: "meta",
            name: "msapplication-TileColor",
            content: "#20232a",
        },
    ],
};
