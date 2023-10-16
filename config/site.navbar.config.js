module.exports = {
    directusUrl: process.env.DIRECTUS_URL,
    directusGraphqlUrl: process.env.DIRECTUS_GRAPHQL_URL,
    siteUrl: process.env.SITE_URL,
    baseUrl: process.env.BASE_URL ?? "/",
    siteAlgoliaAppId: process.env.ALGOLIA_SITE_APP_ID,
    siteAlgoliaApiKey: process.env.ALGOLIA_SITE_API_KEY,
    siteAlgoliaIndexName: process.env.ALGOLIA_SITE_INDEX_NAME,
    locales: [{ internal: "en", external: "en-us" }],
    defaultExternalLocales: "en-us",
};
