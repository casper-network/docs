const indexName = process.env.ALGOLIA_INDEX_NAME || "25626fae796133dc1e734c6bcaaeac3c";
const apiKey = process.env.ALGOLIA_API_KEY || "docusaurus";

module.exports = {
    apiKey: apiKey,
    indexName: indexName,
};
