import * as React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

interface ISearchResultProps {
    locale: string;
    siteUrl: string;
    hits: any[];
    searchTitle: string;
    setHasFocus: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchResult({ locale, siteUrl, hits, searchTitle, setHasFocus }: ISearchResultProps) {
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;
    const [hitsDisplayed, setHitsDisplayed] = useState<any>([]);

    useEffect(() => {
        if (hits) {
            setHitsDisplayed(hits.slice(0, 4));
            groupHits(hits);
        }
    }, [hits]);

    const getLink = (hit) => {
        const url = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
        if (customFields.defaultExternalLocales === locale) {
            return `${url}${hit.path}`;
        } else {
            return `${url}${locale}${hit.path}`;
        }
    };

    function groupHits(hits: any[]) {
        console.log(hits);
        const newHits = hits.map((hit) => {
            if (hit._highlightResult?.hierarchy) {
                const lastKey = Object.keys(hit._highlightResult?.hierarchy)[Object.keys(hit._highlightResult?.hierarchy).length - 1];
                hit._highlightResult.hierarchy[lastKey].url = hit.url;
                return hit._highlightResult.hierarchy;
            }
        });
        const groupedHits = [];
        let lastHit = {};
        newHits.forEach((hit) => {
            if (hit) {
                // console.log(hit);
                if (groupedHits.length === 0 || Object.keys(hit).every((key) => hit[key].value !== lastHit[key]?.value)) {
                    groupedHits.push(hit);
                    lastHit = hit;
                } else {
                    const keyFound = Object.keys(hit).find((key) => hit[key].value !== lastHit[key].value);
                    groupedHits[groupedHits.length - 1][keyFound] = [...Array.from(groupedHits[groupedHits.length - 1][keyFound]), hit[keyFound]];
                }
            }
        });
    }

    function handleContentHit(contentHit: string) {
        const previousWordsToShow = 4;
        const markOpenIndex = contentHit.indexOf("<em>");
        const previousToMatch = contentHit.substring(0, markOpenIndex);
        const previousWords = previousToMatch.split(" ");

        const subResult =
            previousWords.length <= previousWordsToShow
                ? previousWords.join(" ")
                : `... ${previousWords.slice(previousWords.length - previousWordsToShow, previousWords.length).join(" ")}`;

        const result = `${subResult} ${contentHit.substring(markOpenIndex)}`;

        return result;
    }

    function highlight(hit: any) {
        if (hit._highlightResult?.title?.matchedWords?.length > 0)
            return <span className="noWrap" dangerouslySetInnerHTML={{ __html: hit._highlightResult?.title?.value }} />;
        else if (hit._highlightResult?.internal?.content?.matchedWords?.length > 0)
            return (
                <span className={`${styles.hitContent} noWrap`}>
                    {hit._highlightResult?.title?.value}
                    <small className="noWrap" dangerouslySetInnerHTML={{ __html: handleContentHit(hit._highlightResult?.internal?.content?.value) }} />
                </span>
            );
    }

    function highlightDoc(hit: any) {
        if (hit._highlightResult?.hierarchy) {
            let elemArr = [];
            const element = hit._highlightResult?.hierarchy;
            for (const key in element) {
                elemArr.push(<div dangerouslySetInnerHTML={{ __html: element[key].value }}></div>);
            }
            return elemArr;
        }
    }
    function loadMoreHits(e: any) {
        e.stopPropagation();
        setHitsDisplayed(hits);
    }

    return (
        <>
            <p className={`${styles.results_portal_title} halfTitleEyebrow`}>{searchTitle}</p>
            <div className={styles.results_container} onClick={() => setHasFocus(false)}>
                {hits && hits.length > 0 ? (
                    hitsDisplayed.map((hit: any, i: number) => {
                        if (hit._highlightResult?.title?.matchedWords?.length > 0 || hit._highlightResult?.internal?.content?.matchedWords?.length > 0) {
                            return (
                                <a key={`${hit.objectID}-${i}`} href={getLink(hit)} className={styles.results_container_hit}>
                                    <div className={styles.results_container_hit_link}>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21.6499 19.8884L14.6937 12.9321C15.7731 11.5366 16.3571 9.83036 16.3571 8.03571C16.3571 5.8875 15.5187 3.87321 14.0026 2.35446C12.4865 0.835714 10.4669 0 8.32136 0C6.17582 0 4.15618 0.838393 2.64011 2.35446C1.12136 3.87054 0.285645 5.8875 0.285645 8.03571C0.285645 10.1812 1.12404 12.2009 2.64011 13.717C4.15618 15.2357 6.17314 16.0714 8.32136 16.0714C10.116 16.0714 11.8196 15.4875 13.2151 14.4107L20.1714 21.3643C20.1918 21.3847 20.216 21.4009 20.2426 21.4119C20.2693 21.423 20.2979 21.4287 20.3267 21.4287C20.3556 21.4287 20.3841 21.423 20.4108 21.4119C20.4375 21.4009 20.4617 21.3847 20.4821 21.3643L21.6499 20.1991C21.6703 20.1787 21.6865 20.1545 21.6976 20.1278C21.7086 20.1012 21.7143 20.0726 21.7143 20.0438C21.7143 20.0149 21.7086 19.9863 21.6976 19.9597C21.6865 19.933 21.6703 19.9088 21.6499 19.8884ZM12.5642 12.2786C11.4285 13.4116 9.92314 14.0357 8.32136 14.0357C6.71957 14.0357 5.21422 13.4116 4.0785 12.2786C2.94547 11.1429 2.32136 9.6375 2.32136 8.03571C2.32136 6.43393 2.94547 4.92589 4.0785 3.79286C5.21422 2.65982 6.71957 2.03571 8.32136 2.03571C9.92314 2.03571 11.4312 2.65714 12.5642 3.79286C13.6973 4.92857 14.3214 6.43393 14.3214 8.03571C14.3214 9.6375 13.6973 11.1455 12.5642 12.2786Z"
                                                fill="#F4F4F4"
                                            />
                                        </svg>
                                        {highlight(hit)}
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.98382 4.74747L4.77142 15.886C4.77773 15.9712 4.81404 16.0517 4.87559 16.1133L6.27244 17.5101C6.38924 17.6269 6.58812 17.5354 6.57549 17.3712L5.84629 7.04557L15.0829 16.2821C15.1523 16.3516 15.266 16.3516 15.3354 16.2821L16.2824 15.3351C16.3519 15.2657 16.3519 15.152 16.2824 15.0826L7.04742 5.84759L17.3731 6.57679C17.5388 6.58784 17.6288 6.39054 17.512 6.27375L16.0678 4.82954C16.0378 4.79955 15.9967 4.78061 15.9541 4.77904L4.74774 3.98354C4.64559 3.97641 4.54309 3.99129 4.44718 4.02716C4.35126 4.06303 4.26416 4.11906 4.19175 4.19147C4.11934 4.26388 4.06331 4.35099 4.02744 4.4469C3.99156 4.54282 3.97669 4.64531 3.98382 4.74747Z"
                                            fill="#F4F4F4"
                                        />
                                    </svg>
                                </a>
                            );
                        } else if (hit._highlightResult?.hierarchy) {
                            return (
                                <a href={hit.url} className={styles.results_container_hit} key={`${hit.objectID}-${i}`}>
                                    <div className={styles.results_container_hit_link}>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21.6499 19.8884L14.6937 12.9321C15.7731 11.5366 16.3571 9.83036 16.3571 8.03571C16.3571 5.8875 15.5187 3.87321 14.0026 2.35446C12.4865 0.835714 10.4669 0 8.32136 0C6.17582 0 4.15618 0.838393 2.64011 2.35446C1.12136 3.87054 0.285645 5.8875 0.285645 8.03571C0.285645 10.1812 1.12404 12.2009 2.64011 13.717C4.15618 15.2357 6.17314 16.0714 8.32136 16.0714C10.116 16.0714 11.8196 15.4875 13.2151 14.4107L20.1714 21.3643C20.1918 21.3847 20.216 21.4009 20.2426 21.4119C20.2693 21.423 20.2979 21.4287 20.3267 21.4287C20.3556 21.4287 20.3841 21.423 20.4108 21.4119C20.4375 21.4009 20.4617 21.3847 20.4821 21.3643L21.6499 20.1991C21.6703 20.1787 21.6865 20.1545 21.6976 20.1278C21.7086 20.1012 21.7143 20.0726 21.7143 20.0438C21.7143 20.0149 21.7086 19.9863 21.6976 19.9597C21.6865 19.933 21.6703 19.9088 21.6499 19.8884ZM12.5642 12.2786C11.4285 13.4116 9.92314 14.0357 8.32136 14.0357C6.71957 14.0357 5.21422 13.4116 4.0785 12.2786C2.94547 11.1429 2.32136 9.6375 2.32136 8.03571C2.32136 6.43393 2.94547 4.92589 4.0785 3.79286C5.21422 2.65982 6.71957 2.03571 8.32136 2.03571C9.92314 2.03571 11.4312 2.65714 12.5642 3.79286C13.6973 4.92857 14.3214 6.43393 14.3214 8.03571C14.3214 9.6375 13.6973 11.1455 12.5642 12.2786Z"
                                                fill="#F4F4F4"
                                            />
                                        </svg>
                                        <div className={styles.docElement}>{highlightDoc(hit)?.map((parsedHit) => parsedHit)}</div>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.98382 4.74747L4.77142 15.886C4.77773 15.9712 4.81404 16.0517 4.87559 16.1133L6.27244 17.5101C6.38924 17.6269 6.58812 17.5354 6.57549 17.3712L5.84629 7.04557L15.0829 16.2821C15.1523 16.3516 15.266 16.3516 15.3354 16.2821L16.2824 15.3351C16.3519 15.2657 16.3519 15.152 16.2824 15.0826L7.04742 5.84759L17.3731 6.57679C17.5388 6.58784 17.6288 6.39054 17.512 6.27375L16.0678 4.82954C16.0378 4.79955 15.9967 4.78061 15.9541 4.77904L4.74774 3.98354C4.64559 3.97641 4.54309 3.99129 4.44718 4.02716C4.35126 4.06303 4.26416 4.11906 4.19175 4.19147C4.11934 4.26388 4.06331 4.35099 4.02744 4.4469C3.99156 4.54282 3.97669 4.64531 3.98382 4.74747Z"
                                            fill="#F4F4F4"
                                        />
                                    </svg>
                                </a>
                            );
                        }
                    })
                ) : (
                    <span>No results found</span>
                )}
                {hits && hits.length > 4 && hits.length !== hitsDisplayed.length && <button onClick={loadMoreHits}>Show more</button>}
            </div>
        </>
    );
}
/* 
<>
    {hits.map((hit, i) => (
        <div key={`linkwrapper-${i}`}>
            <a href={getLink(hit)}>{hit.title as string}</a>
        </div>
    ))}
</>; */
