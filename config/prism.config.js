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
        // Additional highlight classes.
        {
            className: "code-block-highlighted-line-red",
            line: "highlight-next-line-red",
            block: {
                start: "highlight-start-red",
                end: "highlight-end-red",
            },
        },
        {
            className: "code-block-highlighted-line-green",
            line: "highlight-next-line-green",
            block: {
                start: "highlight-start-green",
                end: "highlight-end-green",
            },
        },
    ],
};
