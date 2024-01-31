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
            to: `${routePrefix}/concepts`,
            activeBasePath: `${routePrefix}/concepts`,
            label: "Concepts",
            position: "left",
        },
        {
            to: `${routePrefix}/developers`,
            activeBasePath: `${routePrefix}/developers`,
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
            to: `${routePrefix}/users`,
            activeBasePath: `${routePrefix}/users`,
            label: "Users",
            position: "left",
        },
        {
            to: `${routePrefix}/resources`,
            activeBasePath: `${routePrefix}/resources`,
            label: "Resources",
            position: "left",
        },
        {
            href: "https://support.casperlabs.io/",
            label: "Support",
        },
        // TODO re-enable when ready
        //{
        //    label: "Chat",
        //},

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
            href: "https://github.com/casper-network/docs/blob/dev/README.md",
            label: "GitHub",
            position: "right",
        },
    ],
};
