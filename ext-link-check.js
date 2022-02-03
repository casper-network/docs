//----------------------------------
//  Imports
//----------------------------------
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const glob = require("glob");
const fs = require("fs");

//----------------------------------
// Constants
//----------------------------------
const SLEEP_MS = 1500;
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
        const files = await this.retrieveFiles("./source/**/@(*.md|*.mdx)");
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
        console.log(`Found ${numUrls} urls within ${files.length} files. Starting validation...`);

        const responseCache = {};
        for (let f = 0, flen = files.length; f < flen; f++) {
            const { urls } = files[f];

            for (let u = 0, ulen = urls.length; u < ulen; u++) {
                const url = urls[u];
                if (!responseCache[url]) {
                    responseCache[url] = await this.evaluateUrl(url);
                    await this.sleep(SLEEP_MS);
                }
                files[f].urls[u] = { url, response: responseCache[url] };
                urlInc += 1;
                const percentage = Math.round((urlInc / numUrls) * 100);
                this.logProgress(`Validation Progress: ${percentage}% (${urlInc}/${numUrls})`);
            }
        }
        await browser.close();
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

    static async retrieveFiles(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
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

    static logProgress(msg) {
        process.stdout.cursorTo(0);
        process.stdout.write(msg);
    }

    static logResults(results) {
        let hasInvalidUrls = false;
        console.log("\n--------------------------------");
        results.forEach((file) => {
            const messages = [];
            file.urls.forEach((obj) => {
                const url = obj.url;
                const response = obj.response;
                let message = null;
                switch (response.status) {
                    case 502: {
                        hasInvalidUrls = true;
                        message = { type: "error", msg: `${chalk.red.bold("Bad Gateway (502)")} ${url}` };
                        break;
                    }
                    case 404: {
                        hasInvalidUrls = true;
                        message = { type: "error", msg: `${chalk.red.bold("Not Found (404):")} ${url}` };
                        break;
                    }
                    case 301: {
                        message = { type: "warn", msg: `${url} ${chalk.yellow.bold("moved permanently (301) to:")} ${response.redirection}` };
                        break;
                    }
                    case 307: {
                        message = { type: "info", msg: `${url} ${chalk.cyan.bold("moved temporarily (307) to:")} ${response.redirection}` };
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
                const bgColor = hasError ? "bgRed" : "bgWhite";
                const fgColor = hasError ? "red" : "white";
                const status = hasError ? "FAILED" : "PASSED";
                console.log("\n" + chalk[bgColor].black(` ${file.path} `) + chalk[fgColor].bold(` :: ${status} \n┃`));
                for (let i = 0, n = messages.length; i < n; i++) {
                    const message = messages[i];
                    const char = i < n - 1 ? "┣━ " : "┗━ ";
                    if (message.type === "error") {
                        console.log(chalk.red.bold(char), message.msg);
                    } else if (message.type === "warn") {
                        console.log(chalk.yellow.bold(char), message.msg);
                    } else if (message.type === "info") {
                        console.log(chalk.cyan.bold(char), message.msg);
                    } else {
                        console.log(char, message.msg);
                    }
                }
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
