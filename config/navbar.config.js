const docsOnlyMode = process.env.DOCS_MODE || true;
const routePrefix = !docsOnlyMode ? "docs" : "";

module.exports = {
    title: "",
    logo: {
        alt: "Casper Logo",
        src: "/icon/Casper_Wordmark_Red_RGB.png",
        srcDark: "/icon/Casper_Wordmark_White_RGB.png",
    },
    // hideOnScroll: true,
    items: [
        // {
        //     to: `${routePrefix}/api`,
        //     activeBasePath: "${routePrefix}/api",
        //     label: "Documentation",
        //     position: "left",
        // },
        {
            to: `${routePrefix}/workflow`,
            activeBasePath: `${routePrefix}/workflow`,
            label: "How To's",
            position: "left",
        },
        {
            to: `${routePrefix}/dapp-dev-guide`,
            activeBasePath: `${routePrefix}/dapp-dev-guide`,
            label: "Developers",
            position: "left",
        },
        {
            to: `${routePrefix}/operators`,
            activeBasePath: `${routePrefix}/operators`,
            label: "Operators",
            position: "left",
        },
        {
            to: `${routePrefix}/design`,
            activeBasePath: `${routePrefix}/design`,
            label: "Design",
            position: "left",
        },
        {
            to: `${routePrefix}/economics`,
            activeBasePath: `${routePrefix}/economics`,
            label: "Economics",
            position: "left",
        },
        {
            to: `${routePrefix}/staking`,
            activeBasePath: `${routePrefix}/staking`,
            label: "Staking",
            position: "left",
        },
        {
            to: `${routePrefix}/glossary`,
            activeBasePath: `${routePrefix}/glossary`,
            label: "Glossary",
            position: "left",
        },
        {
            to: `${routePrefix}/faq`,
            activeBasePath: `${routePrefix}/faq`,
            label: "FAQ",
            position: "left",
        },
        {
            href: "https://discord.com/invite/Q38s3Vh",
            label: "Chat",
        },

        // {
        //     to: `${routePrefix}/developer`,
        //     activeBasePath: `${routePrefix}/developer`,
        //     label: "Developer",
        //     position: "left",
        // },
        // {
        //     to: `${routePrefix}/sdk`,
        //     activeBasePath: `${routePrefix}/sdk`,
        //     label: "SDK",
        //     position: "left",
        // },
        // {
        //     to: `${routePrefix}/user`,
        //     activeBasePath: `${routePrefix}/user`,
        //     label: "User",
        //     position: "left",
        // },
        // {
        //     to: `${routePrefix}/crate`,
        //     activeBasePath: `${routePrefix}/crate`,
        //     label: "Crate",
        //     position: "left",
        // },
        // {
        //     to: "demo/demo",
        //     activeBasePath: "demo/demo",
        //     label: "Demo",
        //     position: "left",
        // },
        // {
        //     href: "https://github.com/casper-network/casper-integrations",
        //     label: "Integration",
        //     position: "right",
        // },
        {
            type: "localeDropdown",
            position: "right",
        },
        // Remove comment to show version control item
        // {
        //     type: "docsVersionDropdown",
        //     position: "right",
        //     dropdownActiveClassDisabled: true,
        //     dropdownItemsAfter: [
        //         {
        //             to: "/versions",
        //             label: "All versions",
        //         },
        //     ],
        // },
        {
            href: "https://github.com/casper-network/docs-app",
            label: "GitHub",
            position: "right",
        },
    ],
};
