//----------------------------------
//  Imports
//----------------------------------
const puppeteer = require("puppeteer");
const core = require("@actions/core");
const style = require("ansi-styles");
const glob = require("glob");
const fs = require("fs");

//----------------------------------
// Constants
//----------------------------------
const SITE_REQUEST_INTERVAL = 750; // in milliseconds
const excludedFolders = ["./source/blog/**/*", "./source/i18n/**/*"];
//----------------------------------
//  Private Vars
//----------------------------------
let browser;

/**
 * Markdown External Url Checker
 * @author Sandro Ducceschi [Ditoy GmbH, Switzerland]
 */
class MarkdownExternalUrlChecker {
    static async execute() {
        const files = glob.sync("./source/**/@(*.md|*.mdx)", {
            ignore: excludedFolders,
        });
        console.log(`Found ${files.length} markdown files. Collecting all external urls...`);

        const filesWithUrls = [];
        files.forEach((file) => {
            const result = this.retrieveAllUrls(file);
            if (result) {
                filesWithUrls.push(result);
            }
        });

        const results = await this.testUrls(filesWithUrls);
        const hasInvalidUrls = this.logResults(results);
        if (hasInvalidUrls) {
            core.setFailed("Found invalid URLs. Please check the log output for more details.");
        }
        process.exit(hasInvalidUrls ? 1 : 0);
    }

    //----------------------------------
    //  Methods
    //----------------------------------
    static async testUrls(files) {
        browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });

        let urlInc = 0;
        const numUrls = files.map((obj) => obj.urls.length).reduce((partial, sum) => partial + sum, 0);
        core.startGroup(`Found ${numUrls} urls within ${files.length} files. Validating URLs...`);

        const responseCache = {};
        for (let f = 0, flen = files.length; f < flen; f++) {
            const { urls } = files[f];

            for (let u = 0, ulen = urls.length; u < ulen; u++) {
                const url = urls[u];
                if (!responseCache[url]) {
                    responseCache[url] = await this.evaluateUrl(url);
                    await this.sleep(SITE_REQUEST_INTERVAL);
                }
                files[f].urls[u] = { url, response: responseCache[url] };
                urlInc += 1;
                const percentage = Math.round((urlInc / numUrls) * 100);
                console.log(`Progress: ${percentage}% (${urlInc}/${numUrls})`);
            }
        }
        await browser.close();
        core.endGroup();
        browser = null;
        return files;
    }

    static evaluateUrl(url, originStatus = null) {
        return new Promise(async (resolve) => {
            const page = await browser.newPage();
            page.once("response", async (response) => {
                const status = response.status();
                const headers = response.headers();
                if ([301, 307].includes(status)) {
                    const resp = await this.evaluateUrl(headers.location, status);
                    resolve(resp);
                } else if (originStatus) {
                    resolve({ status: originStatus, redirectionStatus: response.status(), redirection: response.url() });
                } else {
                    resolve({ status: response.status() });
                }
            });
            page.once("pageerror", async (err) => {
                resolve({ error: err.message });
            });

            try {
                await page.goto(url, { waitUntil: "load" });
            } catch (err) {
                resolve({ error: err.message });
            }
            await page.close();
            resolve({ error: "Unknown exception occured" });
        });
    }

    static retrieveAllUrls(path) {
        const urls = [];
        const md = fs.readFileSync(path, { encoding: "utf-8" });
        const matches = md.match(/\[(.+)]\((http[^ ]+?)( "(.+)")?\)/gm);
        if (matches) {
            matches.forEach((url) => {
                urls.push(url.replace(/\[.*]\(|\)/gm, ""));
            });
        }
        return urls.length > 0 ? { path, urls } : null;
    }

    //----------------------------------
    // Helper Methods
    //----------------------------------
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static logResults(results) {
        let hasInvalidUrls = false;
        results.forEach((file) => {
            const messages = [];
            file.urls.forEach((obj) => {
                const url = obj.url;
                const response = obj.response;
                let message = null;
                switch (response.status) {
                    case 502: {
                        hasInvalidUrls = true;
                        message = {
                            type: "error",
                            msg: `${style.red.open}${style.bold.open}Bad Gateway (502):${style.bold.close}${style.red.close} ${url}`,
                        };
                        break;
                    }
                    case 404: {
                        hasInvalidUrls = true;
                        message = {
                            type: "error",
                            msg: `${style.red.open}${style.bold.open}Not Found (404):${style.bold.close}${style.red.close} ${url}`,
                        };
                        break;
                    }
                    case 301: {
                        message = {
                            type: "warn",
                            msg: `${url} ${style.yellow.open}${style.bold.open}moved permanently (301) to:${style.bold.close}${style.yellow.close} ${response.redirection}`,
                        };
                        break;
                    }
                    case 307: {
                        message = {
                            type: "info",
                            msg: `${url} ${style.cyan.open}${style.bold.open}moved temporarily (307) to:${style.bold.close}${style.cyan.close} ${response.redirection}`,
                        };
                        break;
                    }
                    case 429: {
                        message = {
                            type: "info",
                            msg: `${style.cyan.open}${style.bold.open}Too Many Requests (429):${style.bold.close}${style.cyan.close} ${url}`,
                        };
                        break;
                    }
                    default: {
                        // nothing to see here
                    }
                }
                if (message) {
                    messages.push(message);
                }
            });

            if (messages.length > 0) {
                const hasError = messages.find((msg) => msg.type === "error");
                const hasWarning = messages.find((msg) => msg.type === "warn");
                const hasInfo = messages.find((msg) => msg.type === "info");
                if (hasError) {
                    core.startGroup(
                        style.bold.open +
                            style.red.open +
                            "━ FAIL ━ " +
                            style.red.close +
                            style.bold.close +
                            style.bgRed.open +
                            style.black.open +
                            file.path +
                            style.black.close +
                            style.bgRed.close,
                    );
                } else if (hasWarning) {
                    core.startGroup(
                        style.bold.open +
                            style.yellow.open +
                            "━ WARN ━ " +
                            style.yellow.close +
                            style.bold.close +
                            style.bgYellow.open +
                            style.black.open +
                            file.path +
                            style.black.close +
                            style.bgYellow.close,
                    );
                } else if (hasInfo) {
                    core.startGroup(
                        style.bold.open +
                            style.cyan.open +
                            "━ INFO ━ " +
                            style.cyan.close +
                            style.bold.close +
                            style.bgCyan.open +
                            style.black.open +
                            file.path +
                            style.black.close +
                            style.bgCyan.close,
                    );
                } else {
                    core.startGroup(
                        style.bold.open +
                            style.white.open +
                            "━ PASS ━ " +
                            style.white.close +
                            style.bold.close +
                            style.bgWhite.open +
                            style.black.open +
                            file.path +
                            style.black.close +
                            style.bgWhite.close,
                    );
                }

                messages.forEach((message) => {
                    if (message.type === "error") {
                        console.log(`${style.red.open}${style.bold.open} ━ ${style.bold.close}${style.red.close}${message.msg}`);
                    } else if (message.type === "warn") {
                        console.log(`${style.yellow.open}${style.bold.open} ━ ${style.bold.close}${style.yellow.close}${message.msg}`);
                    } else if (message.type === "info") {
                        console.log(`${style.cyan.open}${style.bold.open} ━ ${style.bold.close}${style.cyan.close}${message.msg}`);
                    } else {
                        console.log(` ━ ${message.msg}`);
                    }
                });

                core.endGroup();
            }
        });
        return hasInvalidUrls;
    }
}

(async function run() {
    await MarkdownExternalUrlChecker.execute();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
