const FileUtil = require("../src/utils/file");

const filePath = FileUtil.getPathAryWithKeyword("./", "footer.html");
const footerHtml = FileUtil.getFileContentFromPath(filePath[0]);

module.exports = {
    style: "light",
    copyright: footerHtml,
};
