/* eslint-disable import/no-commonjs */
const textlintMode = process.env.TEXTLINT_MODE;

const allRules = {
    alex: {
        allow: ["color", "hook", "host-hostess", "itch"],
    },
    "common-misspellings": true,
    "en-capitalization": true,
    "stop-words": {
        exclude: ["relative to", "pick out", "encounter"],
    },
    terminology: {
        defaultTerms: false,
        terms: `${__dirname}/.textlint.terms.json`,
    },
    "write-good": {
        passive: true,
        severity: "warning",
    },
};

const fixableRules = {
    "common-misspellings": allRules["common-misspellings"],
    "en-capitalization": allRules["en-capitalization"],
    terminology: allRules["terminology"],
};

module.exports = {
    rules: textlintMode === "fix" ? fixableRules : allRules,
};
