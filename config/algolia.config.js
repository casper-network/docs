const appId = process.env.ALGOLIA_APP_ID;
const indexName = process.env.ALGOLIA_INDEX_NAME;
const apiKey = process.env.ALGOLIA_API_KEY;

module.exports = {
    appId: appId,
    apiKey: apiKey,
    indexName: indexName,
};
