import React, { useMemo } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import algoliasearch from "algoliasearch/lite";
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

    const searchClient = useMemo(
        () => algoliasearch(siteConfig.customFields.siteAlgoliaAppId as string, siteConfig.customFields.siteAlgoliaApiKey as string),
        [],
    );

    return (
        <InstantSearch searchClient={searchClient} indexName={index.name}>
            <Configure hitsPerPage={20} filters={`locale:'${locale.toLocaleLowerCase()}'`}></Configure>
            <SearchBox placeholder={placeholder} locale={locale} siteUrl={siteUrl}></SearchBox>
        </InstantSearch>
    );
}
