import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { useHits, useSearchBox } from "react-instantsearch-hooks-web";
import icons from "../../../../../icons";
import useEventListener from "../../../../../hooks/useEventListener";
import SearchResult from "../SearchResult";
import useClickOutside from "../UseClickOutside";
import styles from "./styles.module.scss";
import useWindow from "../../../../../hooks/useWindow";

export default function SearchBox({ placeholder, locale, siteUrl }: any) {
    const refInput = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    let delayDebounceFn: NodeJS.Timeout;

    const memoizedSearch = useCallback((query: string, search: (p: string) => void) => {
        search(query);
    }, []);

    const { refine, clear } = useSearchBox({
        queryHook: memoizedSearch,
    });

    const { hits } = useHits({ escapeHTML: false });

    function handleChangeSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
        clearTimeout(delayDebounceFn);
        delayDebounceFn = setTimeout(() => {
            setShowResults(false);
            const value = e.target.value;
            setSearchTerm(value);

            if (value) {
                refine(value);
            } else {
                clear();
            }
        }, 500);
    }

    const handleKeyClose = (e: KeyboardEvent): void => {
        if (e.keyCode === 27) resetState();
    };

    function resetState() {
        setSearchTerm("");
        clearInput();
    }

    useEffect(() => {
        // -- Only true if search term has a value
        // -- Avoid to show the empty results
        setShowResults(searchTerm ? true : false);
    }, [hits]);

    useEventListener("keydown", handleKeyClose);

    useClickOutside(refInput, (isInside: boolean) => setHasFocus(isInside));

    function clearInput() {
        if (!useWindow()) return;
        const buttons = document.getElementsByClassName(styles.container_input);
        for (const button of buttons) {
            (button as HTMLInputElement).value = "";
        }
        setSearchTerm("");
        setShowResults(false);
    }
    return (
        <div ref={refInput} tabIndex={-1} className={styles.container} onFocus={() => setHasFocus(true)}>
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
            {hasFocus && showResults && <SearchResult locale={locale} siteUrl={siteUrl} hits={hits} setHasFocus={setHasFocus}></SearchResult>}
        </div>
    );
}
