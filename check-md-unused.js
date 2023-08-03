//----------------------------------
//  Imports
//----------------------------------
const glob = require("glob");
const path = require("path");
const style = require("ansi-styles");
const fs = require("fs");

//----------------------------------
// Constants
//----------------------------------
const excludedFolders = ["./source/blog/**/*", "./source/i18n/**/*"];
const excludedFiles = ["./source/docs/casper/concepts/about.md"];

//----------------------------------
//  Private Vars
//----------------------------------
const slugMapping = {};
const fileMapping = {};

/**
 * Unused Markdown Checker
 * @author Sandro Ducceschi [Ditoy GmbH, Switzerland]
 */
class UnusedMarkdownChecker {
    static async execute() {
        console.log("Attempting to determine unused markdown files...");
        console.log(`\n${style.cyanBright.open}Files are assumed unused based on the following criteria:`);
        console.log("  - No other markdown file points to it");
        console.log(`  - The file is not present in the sidebar${style.cyanBright.close}`);

        let filepaths = glob.sync("./source/**/@(*.md|*.mdx)", {
            ignore: excludedFolders,
        });

        filepaths.forEach((filepath) => {
            fileMapping[filepath] = 0;
            const slug = this.retrieveInternalMapping(filepath);
            if (slug && !slugMapping[slug]) {
                slugMapping[slug] = path.dirname(filepath);
            }
        });

        filepaths.forEach((filepath) => {
            const urls = this.retrieveInternalUrls(filepath);
            if (urls.length > 0) {
                this.updateOccurrences(filepath, urls);
            }
        });
        const sidebarMapping = require("./config/sidebar.config");
        const keys = Object.keys(sidebarMapping);
        const sidebarUrls = [];
        keys.forEach((key) => {
            const map = sidebarMapping[key];
            map.forEach((entry) => {
                if (entry.constructor === String) {
                    sidebarUrls.push(entry);
                } else {
                    const items = entry.items;
                    items.forEach((item) => {
                        if (item.constructor === String) {
                            sidebarUrls.push(item);
                        } else {
                            sidebarUrls.push(...item.items);
                        }
                    });
                }
            });
        });

        sidebarUrls.forEach((url) => {
            const slug = url.split("/")[0];
            const path = slugMapping[`/${slug}`];
            if (path) {
                url = path + url.replace(slug, "");
            }
            if (fs.existsSync(url + ".md")) {
                fileMapping[url + ".md"] += 1;
            } else if (fs.existsSync(url + ".mdx")) {
                fileMapping[url + ".mdx"] += 1;
            } else if (fs.existsSync(url)) {
                fileMapping[url] += 1;
            }
        });

        let assumedUnused = [];
        const paths = Object.keys(fileMapping);
        paths.forEach((path) => {
            if (fileMapping[path] === 0) {
                assumedUnused.push(path);
            }
        });
        assumedUnused = assumedUnused.filter((file) => !excludedFiles.includes(file));

        if (assumedUnused.length > 0) {
            console.log(
                `\nThe following ${style.bold.open + assumedUnused.length + style.bold.close} files are ${style.bold.open}assumed${
                    style.bold.close
                } to be unused:\n`,
            );

            assumedUnused.forEach((file) => {
                console.log("━", file);
            });
        }

        console.log(`\n${style.yellow.open}This test ${style.bold.open}may or may not${style.bold.close} have false-positives.${style.yellow.close}`);
        console.log(
            `${style.yellow.open}It is ${style.bold.open}adviced to review these findings${style.bold.close}, before deleting any of these files.${style.yellow.close}\n`,
        );
        process.exit(0);
    }

    //----------------------------------
    //  Methods
    //----------------------------------

    static retrieveInternalUrls(path) {
        const urls = [];
        const md = fs.readFileSync(path, { encoding: "utf-8" });
        const urlMatches = md.match(/\[(.+)]\(((?!https?|mailto)[^ ]+?)( "(.+)")?\)/gm);
        if (urlMatches) {
            urlMatches.forEach((url) => {
                const transformedUrl = url.replace(/\[.*]\(|\)|(#.*)/gm, "");
                if (transformedUrl !== "") {
                    urls.push(transformedUrl);
                }
            });
        }
        return urls;
    }

    static retrieveInternalMapping(path) {
        const md = fs.readFileSync(path, { encoding: "utf-8" });
        const slugMatches = /^slug:\s+(?<slug>.+)$/gm.exec(md);
        const slug = ((slugMatches || {}).groups || {}).slug;
        if (slug && slug !== "/") {
            return slug;
        }
        return null;
    }

    static updateOccurrences(originPath, urls) {
        urls.forEach((url) => {
            let targetPath;
            let testUrl = url;
            if (path.extname(url) === "") {
                testUrl = `${url}.md`;
            }

            const extension = path.extname(testUrl);
            const isMarkdown = extension === ".md" || extension === ".mdx";
            const isAbsolute = testUrl[0] === "/";

            if (isAbsolute && !isMarkdown) {
                targetPath = `/static${testUrl}`;
            } else if (isAbsolute && isMarkdown) {
                targetPath = this.urlToDiskpath(testUrl);
            } else {
                targetPath = "./" + path.join(path.dirname(originPath), `/${testUrl}`);
            }

            if (fs.existsSync(targetPath) && isMarkdown) {
                fileMapping[targetPath] += 1;
            } else if (isMarkdown) {
                testUrl = url.replace(/\/docs|\.{1,2}/, "");
                const retryPath = this.urlToDiskpath(testUrl);
                if (path.extname(retryPath) === "") {
                    if (fs.existsSync(retryPath + ".md")) {
                        fileMapping[retryPath + ".md"] += 1;
                    } else if (fs.existsSync(retryPath + ".mdx")) {
                        fileMapping[retryPath + ".mdx"] += 1;
                    }
                } else if (fs.existsSync(retryPath)) {
                    fileMapping[retryPath] += 1;
                }
            }
        });
    }

    //----------------------------------
    // Helper Methods
    //----------------------------------
    static urlToDiskpath(url) {
        if (url.indexOf("/docs") === 0) {
            url = url.replace("/docs", "");
        }
        const slugs = Object.keys(slugMapping);
        const slug = slugs.find((slug) => url.indexOf(slug) === 0);
        const path = slugMapping[slug];
        return path + url.replace(slug, "");
    }
}

(async function run() {
    await UnusedMarkdownChecker.execute();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
