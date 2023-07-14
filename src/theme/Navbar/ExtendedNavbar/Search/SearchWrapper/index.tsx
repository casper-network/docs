import React, { useEffect, useRef, useState } from "react";
import useEventListener from "../../../../../hooks/useEventListener";
import icons from "../../../../../icons";
import SearchResult from "../SearchResult";
import useClickOutside from "../UseClickOutside";
import styles from "./styles.module.scss";

interface ISearchWrapperProps {
    searchIndexes: any[];
    locale: string;
    siteUrl: string;
    placeholder: string;
    hitsPerIndex: number;
}

export default function SearchWrapper({ searchIndexes, locale, siteUrl, placeholder, hitsPerIndex = 20 }: ISearchWrapperProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const refInput = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [hits, setHits] = useState<any[]>([]);
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
                    hitsPerPage: hitsPerIndex,
                }),
            );
        }
        Promise.allSettled(promiseArr)
            .then((results: any) => {
                let parsedHits: any[] = [];
                for (var i = 0; i < results.length; i++) {
                    const basePath = searchIndexes[i].base;
                    const result = results[i];
                    if (result.status === "fulfilled") {
                        let parsedRes = result.value.hits;

                        parsedRes = parsedRes.map((element: any) => {
                            return { ...element, basePath: basePath, path: basePath ? basePath + element.path : element.path };
                        });

                        parsedHits = [...parsedHits, ...parsedRes];
                    } else {
                        console.log(`${result.reason.name} ${result.reason.message}`);
                    }
                }
                setHits(parsedHits);
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
        setShowResults(searchTerm && hits.length > 0 ? true : false);
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
                    <SearchResult hits={hits} setHasFocus={setHasFocus} locale={locale} siteUrl={siteUrl}></SearchResult>
                </>
            )}
        </div>
    );
}
