/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const getDirPath = (dir = "") => {
    // eslint-disable-next-line no-undef
    const dirPath = `${process.cwd()}/${dir}`;
    return dirPath;
};

const getNameAndExtension = (filePath) => {
    if (!filePath) {
        return ["", ""];
    }

    const baseName = path.basename(filePath);
    const segments = baseName.split(".");
    const fileName = segments[0];

    if (segments.length > 1) {
        const extension = segments.slice(1).join(".");
        return [fileName, extension];
    } else {
        return [fileName, ""];
    }
};

const getContentFromPath = (filePath) => {
    const rawData = fs.readFileSync(path.resolve(filePath));
    const content = JSON.parse(rawData);
    return content;
};

const getFileContentFromPath = (filePath) => {
    const rawData = fs.readFileSync(path.resolve(filePath), "utf-8");
    return rawData;
};

const getPathAryWithKeyword = (startPath, filter) => {
    const result = [];

    const loop = (dir, keyword) => {
        if (!fs.existsSync(dir)) {
            return;
        }

        const files = fs.readdirSync(dir);

        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(dir, files[i]);
            const stat = fs.lstatSync(filePath);

            if (stat.isDirectory()) {
                loop(filePath, keyword);
            } else if (filePath.indexOf(keyword) >= 0) {
                result.push(filePath);
            }
        }
    };

    loop(startPath, filter);

    return result;
};

module.exports = {
    getDirPath,
    getNameAndExtension,
    getContentFromPath,
    getPathAryWithKeyword,
    getFileContentFromPath,
};
