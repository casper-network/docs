const documentationRepoUrl = "https://github.com/casper-network/docs/tree/main/source";

const getEditUrl = ({ versionDocsDirPath, docPath }) => {
    const segments = versionDocsDirPath.split("/");
    segments.splice(0, 1);
    const formattedVersionDirPath = segments.join("/");
    return `${documentationRepoUrl}/${formattedVersionDirPath}/${docPath}`;
};

module.exports = {
    getEditUrl,
};
