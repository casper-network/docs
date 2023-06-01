/* eslint-disable import/no-extraneous-dependencies */

module.exports = {
    theme: require("prism-react-renderer/themes/github"),
    darkTheme: require("prism-react-renderer/themes/dracula"),
    /* Optional */
    additionalLanguages: ["rust"],
    magicComments: [
        // Default highlight.
        {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: {
                start: "highlight-start",
                end: "highlight-end",
            },
        },
    ],
};
