require("dotenv").config({
    path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`,
});

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
const { getEditUrl } = require("./src/utils/docs");

const docsOnlyMode = process.env.DOCS_MODE || true;
const routePrefix = !docsOnlyMode ? "/docs" : "/";

module.exports = {
    ...siteConfig,
    i18n: i18nConfig,
    baseUrl: "/",
    /* Optional */
    // customFields: dataConfig,
    themeConfig: {
        tableOfContents: {
            minHeadingLevel: 2,
            maxHeadingLevel: 6,
        },
        // algolia: algoliaConfig,
        announcementBar: announcementConfig,
        colorMode: colorConfig,
        footer: footerConfig,
        docs: {
            sidebar: {
                hideable: true,
            },
        },
        /* Optional */
        // googleAnalytics: analyticsConfig.googleAnalytics,
        // gtag: analyticsConfig.gtag,
        // metadatas: metadatasConfig,
        navbar: navbarConfig,
        prism: prismConfig,
        algolia: {
            appId: "KQNX60E7J5",
            apiKey: "42e859bcdaa94a6c412d933cbaabe2e2",
            indexName: "casperlabs",
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    // remarkPlugins: [],
                    path: "source/docs/casper",
                    routeBasePath: routePrefix, // IMPORTANT: Turn on docs-only mode
                    sidebarPath: require.resolve("./config/sidebar.config.js"),
                    editUrl: getEditUrl,
                    exclude: ["./contract-dsl/archived", "./economics/archived", "./theory"],
                    /* Docs config options */
                    // showLastUpdateAuthor: false,
                    showLastUpdateTime: true,
                    // remarkPlugins: [require("@react-native-website/remark-snackplayer")],
                    // editCurrentVersion: true,
                    // onlyIncludeVersions: process.env.PREVIEW_DEPLOY === "true" ? ["current", ...versions.slice(0, 2)] : undefined,
                },
                // IMPORTANT: disable blog feature
                blog: false,
                /* Blog config options */
                // {
                //     showReadingTime: true,
                //     editUrl: "https://github.com/casper-network/documentation/blob/master/blog",
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
    ],
};
