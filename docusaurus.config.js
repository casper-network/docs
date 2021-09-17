const {
    algoliaConfig,
    algoliaOfflineConfig,
    analyticsConfig,
    announcementConfig,
    colorConfig,
    dataConfig,
    footerConfig,
    i18nConfig,
    metadatasConfig,
    navbarConfig,
    pwaConfig,
    prismConfig,
    siteConfig,
} = require("./config");

const docsOnlyMode = process.env.DOCS_MODE || true;
const routePrefix = !docsOnlyMode ? "/docs" : "/";

module.exports = {
    ...siteConfig,
    i18n: i18nConfig,
    /* Optional */
    // customFields: dataConfig,
    themeConfig: {
        // algolia: algoliaConfig,
        announcementBar: announcementConfig,
        colorMode: colorConfig,
        footer: footerConfig,
        hideableSidebar: true,
        /* Optional */
        // googleAnalytics: analyticsConfig.googleAnalytics,
        // gtag: analyticsConfig.gtag,
        // metadatas: metadatasConfig,
        navbar: navbarConfig,
        prism: prismConfig,
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    path: "docs/casper",
                    routeBasePath: routePrefix, // IMPORTANT: Turn on docs-only mode
                    sidebarPath: require.resolve("./config/sidebar.config.js"),
                    editUrl: "https://github.com/scalio/scalio-mcms-docusaurus/tree/master",
                    exclude: ["./contract-dsl/archived", "./economics/archived", "./theory"],
                    /* Docs config options */
                    // showLastUpdateAuthor: false,
                    // showLastUpdateTime: true,
                    // remarkPlugins: [require("@react-native-website/remark-snackplayer")],
                    // editCurrentVersion: true,
                    // onlyIncludeVersions: process.env.PREVIEW_DEPLOY === "true" ? ["current", ...versions.slice(0, 2)] : undefined,
                },
                // IMPORTANT: disable blog feature
                blog: false,
                /* Blog config options */
                // {
                //     showReadingTime: true,
                //     editUrl: "https://github.com/scalio/scalio-mcms-docusaurus/blob/master/blog",
                //     path: "blog",
                //     blogSidebarCount: "ALL",
                //     blogSidebarTitle: "All Blog Posts",
                //     feedOptions: {
                //         type: "all",
                //         copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
                //     },
                // },
                theme: {
                    customCss: [require.resolve("./src/assets/scss/theme.scss")],
                },
            },
        ],
    ],
    plugins: [
        "docusaurus-plugin-sass",
        /* Optional */
        // ["@docusaurus/plugin-pwa", pwaConfig],
        [
            "docusaurus2-dotenv",
            {
                path: "./.env.production",
                safe: false,
                systemvars: false,
                silent: false,
            },
        ],
        [require.resolve("@cmfcmf/docusaurus-search-local"), algoliaOfflineConfig],
    ],
};
