import React, { useEffect, useRef, useState } from "react";
import useEventListener from "../../../../../hooks/useEventListener";
import icons from "../../../../../icons";
import SearchResult from "../SearchResult";
import useClickOutside from "../UseClickOutside";
import styles from "./styles.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
interface ISearchWrapperProps {
    searchIndexes: any[];
    locale: string;
    siteUrl: string;
    placeholder: string;
    hitsPerIndex: number;
}

export default function SearchWrapper({ searchIndexes, locale, siteUrl, placeholder, hitsPerIndex = 20 }: ISearchWrapperProps) {
    const { siteConfig } = useDocusaurusContext();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const refInput = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [hits, setHits] = useState<any>({});
    const docsIndexName = (siteConfig.themeConfig.algolia?.indexName as string) ?? "casperlabs";
    const siteIndexName = (siteConfig.customFields.siteAlgoliaIndexName as string) ?? "casper";

    let delayDebounceFn: NodeJS.Timeout;

    const handleKeyClose = (e: KeyboardEvent): void => {
        if (e.key === "Escape") resetState();
    };

    function resetState() {
        setSearchTerm("");
        clearInput();
    }

    function triggerSearchIndexes(val: string) {
        let promiseArr = [];

        for (let index of searchIndexes) {
            promiseArr.push(
                index.client.search(val, {
                    hitsPerPage: index.client.indexName === docsIndexName ? 4 : hitsPerIndex,
                }),
            );
        }

        Promise.allSettled(promiseArr)
            .then((results: any) => {
                const hits = {};
                for (let i = 0; i < results.length; i++) {
                    let parsedHits: any[] = [];
                    const basePath = searchIndexes[i].base;
                    const result = results[i];
                    if (result.status === "fulfilled") {
                        let parsedRes = result.value.hits;

                        parsedRes = parsedRes.map((element: any) => {
                            return { ...element, basePath: basePath, path: basePath ? basePath + element.path : element.path };
                        });

                        parsedHits = [...parsedHits, ...parsedRes];
                        hits[`${searchIndexes[i].client.indexName}`] = parsedHits;
                    } else {
                        console.log(`${result.reason.name} ${result.reason.message}`);
                    }
                }
                setHits(hits);
            })
            .catch((err) => console.log(err));
    }

    function clearSearch() {
        setHits([]);
    }

    function handleChangeSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimeout(delayDebounceFn);
        delayDebounceFn = setTimeout(() => {
            setShowResults(false);
            const value = e.target.value;
            setSearchTerm(value);
            if (value) {
                triggerSearchIndexes(value);
            } else {
                clearSearch();
            }
        }, 500);
    }

    useEffect(() => {
        // -- Only true if search term has a value
        // -- Avoid to show the empty results
        setShowResults(searchTerm || hits.length > 0 ? true : false);
    }, [searchTerm, hits]);

    useEventListener("keydown", handleKeyClose);

    useClickOutside(refInput, (isInside: boolean) => setHasFocus(isInside));

    function clearInput() {
        const buttons = document.getElementsByClassName(styles.container_input);
        for (const button of buttons) {
            (button as HTMLInputElement).value = "";
        }
        setSearchTerm("");
        setShowResults(false);
    }

    return (
        <div ref={refInput} tabIndex={-1} className={styles.container} onFocus={() => setHasFocus(true)}>
            <>
                <input
                    id="inputSearch"
                    tabIndex={0}
                    className={styles.container_input}
                    onChange={handleChangeSearchTerm}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <span className={styles.container_icon_search}>{icons.search}</span>
                {searchTerm && (
                    <button className={styles.container_icon_cancel} onClick={() => clearInput()}>
                        {icons.cancel}
                    </button>
                )}
            </>
            {hasFocus && showResults && (
                <>
                    <div className={styles.results_wrapper}>
                        <SearchResult
                            hits={hits[siteIndexName]}
                            searchTitle={"Portal Results"}
                            setHasFocus={setHasFocus}
                            locale={locale}
                            siteUrl={siteUrl}
                        ></SearchResult>
                        <SearchResult
                            hits={hits[docsIndexName]}
                            searchTitle={"Documents Results"}
                            setHasFocus={setHasFocus}
                            locale={locale}
                            siteUrl={siteUrl}
                        ></SearchResult>
                        <div className={`${styles.search_link} halfTitleEyebrow`}>
                            <a href={`https://docs.casper.network/search?q=${searchTerm}`}>Show all documentation results</a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
