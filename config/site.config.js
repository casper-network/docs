const { cdns, customScripts } = require("./script.config");

module.exports = {
    title: "Casper",
    tagline: "The best search experience for docs, integrated in minutes, for free",
    url: "https://operators.casper.network/",
    baseUrl: "/docs/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "image/favicon.ico",
    organizationName: "scalio",
    projectName: "Casper",
    /* Optional */
    // clientModules: customScripts,
    // scripts: cdns,
};
