import React, { useMemo } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import SearchWrapper from "./SearchWrapper";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";
import SearchBox from "./SearchBox";

interface ISearchProps {
    index: {
        name: string;
        title: string;
    };
    locale: string;
    placeholder: string;
    siteUrl: string;
}

export default function Search({ index, placeholder, locale, siteUrl }: ISearchProps) {
    const { siteConfig } = useDocusaurusContext();
    let indexesArray: any[] = [];

    if (siteConfig.themeConfig.algolia?.indexName && siteConfig.themeConfig.algolia?.appId && siteConfig.themeConfig.algolia?.apiKey) {
        const algoliaDocClient = useMemo(
            () => algoliasearch(siteConfig.themeConfig.algolia?.appId as string, siteConfig.themeConfig.algolia?.apiKey as string),
            [],
        );

        const searchDocClient: SearchClient = {
            ...algoliaDocClient,
            search(requests) {
                // -- Return default response in case that the query is empty
                if (requests.every(({ params }) => !params || !params.query)) {
                    return Promise.resolve({
                        results: requests.map(() => ({
                            hits: [],
                            nbHits: 0,
                            nbPages: 0,
                            page: 0,
                            processingTimeMS: 0,
                            hitsPerPage: 0,
                            exhaustiveNbHits: false,
                            query: "",
                            params: "",
                        })),
                    });
                }

                return algoliaDocClient.search(requests);
            },
        };

        const docIndex = {
            base: null,
            client: searchDocClient.initIndex((siteConfig.themeConfig.algolia?.indexName as string) ?? "casperlabs"),
        };
        indexesArray.push(docIndex);
    }
    let searchAppClient: SearchClient;
    if (siteConfig.customFields.siteAlgoliaIndexName && siteConfig.customFields.siteAlgoliaAppId && siteConfig.customFields.siteAlgoliaApiKey) {
        const algoliaAppClient = useMemo(
            () => algoliasearch(siteConfig.customFields.siteAlgoliaAppId as string, siteConfig.customFields.siteAlgoliaApiKey as string),
            [],
        );
        searchAppClient = {
            ...algoliaAppClient,
            search(requests) {
                // -- Return default response in case that the query is empty
                if (requests.every(({ params }) => !params || !params.query)) {
                    return Promise.resolve({
                        results: requests.map(() => ({
                            hits: [],
                            nbHits: 0,
                            nbPages: 0,
                            page: 0,
                            processingTimeMS: 0,
                            hitsPerPage: 0,
                            exhaustiveNbHits: false,
                            query: "",
                            params: "",
                        })),
                    });
                }

                return algoliaAppClient.search(requests);
            },
        };
        const appIndex = {
            base: null,
            client: searchAppClient.initIndex((siteConfig.customFields.siteAlgoliaIndexName as string) ?? "casper"),
        };

        indexesArray.push(appIndex);
    }

    return (
        <>
            <SearchWrapper searchIndexes={indexesArray} locale={locale.toLocaleLowerCase()} placeholder={placeholder} hitsPerIndex={20} siteUrl={siteUrl} />
        </>
    );
}
