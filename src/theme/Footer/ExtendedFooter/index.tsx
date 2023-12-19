import { usePluginData } from "@docusaurus/useGlobalData";
import ISocialMedia from "../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/socialMedia";
import INavData from "../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navData";
import IFooterData from "../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/footerData";
import Nav from "./Nav";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useLocaleMap from "../../../hooks/useLocaleMap";
import { useLocation } from "@docusaurus/router";
import styles from "./ExtendedFooter.module.scss";
import React, { useContext } from "react";
import Link from "@docusaurus/Link";
import SocialMedia from "../../SocialMedia";
import { ModalContext } from "../../Modals/CookieModal";

export default function ExtendedFooter() {
    const location = useLocation();
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;

    const baseUrl = customFields.baseUrl as string;
    const siteUrl = customFields.siteUrl as string;
    // -- Remove the base url from the location
    const path = location.pathname.replace(baseUrl, "");
    const { setShowCookieModal } = useContext(ModalContext);
    // -- Take the locale, if the locale isn't part of the path, the mapper is going to return the default external locale
    const internalLocale = path.split("/")[0];

    const externalLocale = useLocaleMap(internalLocale);
    const data = usePluginData("docusaurus-plugin-navdata") as {
        socialMedia: Array<ISocialMedia>;
        navData: Array<INavData>;
        footerTree: Array<any>;
        footerData: Array<IFooterData>;
    };
    const footerData =
        data?.footerData.find((x) => x.languageCode === externalLocale) || data?.footerData.find((x) => x.languageCode === customFields.defaultExternalLocales);

    const footerTree =
        data?.footerTree.find((x) => x.languages_code.code.toLowerCase() === externalLocale) ||
        data?.footerTree.find((x) => x.languages_code.code.toLowerCase() === siteConfig.customFields.defaultExternalLocales);

    const getExternalLink = (path: string) => {
        const url = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
        const truncatedPath = path.startsWith("/") ? path.slice(1) : path;
        if (siteConfig.customFields.defaultExternalLocales === externalLocale) {
            return `${url}/${truncatedPath}`;
        } else {
            return `${url}/${externalLocale}/${truncatedPath}`;
        }
    };

    const renderLink = (type: "internal" | "external", title: string, url: string, openInNewTab: boolean) => {
        switch (type) {
            case "internal":
                return (
                    <a key={`${title}`} href={getLink(url)}>
                        {title}
                    </a>
                );

            case "external":
                return (
                    <a key={`${title}`} href={url} target={openInNewTab ? "_blank" : "_self"}>
                        {title}
                    </a>
                );
            default:
                return <span key={`${title}`}>{title}</span>;
        }
    };

    const getLink = (path: string) => {
        const siteUrl = customFields.siteUrl as string;
        const url = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
        const truncatedPath = path.startsWith("/") ? path.slice(1) : path;
        if (customFields.defaultExternalLocales === externalLocale) {
            return `${url}/${truncatedPath}`;
        } else {
            return `${url}/${externalLocale}/${truncatedPath}`;
        }
    };

    return (
        <>
            {footerData && (
                <div className={`containerSite ${styles.footer_wrapper}`}>
                    <div className={`${styles.footer_container}`}>
                        <div className={styles.footer_container_upperData}>
                            <div className={styles.footer_container_upperData_social}>
                                {footerData && footerData.title && <h2>{footerData.title}</h2>}
                                <SocialMedia socialMedia={data?.socialMedia} />
                                {footerData && footerData.description && (
                                    <p className={`${styles.footer_container_upperData_social_description} primaryParagraph`}>{footerData.description}</p>
                                )}
                                {footerData && footerData.logo && (
                                    <div className={styles.logoCasper}>
                                        <Link href={getExternalLink("/")}>
                                            <div className={styles.logoCasper_logo} dangerouslySetInnerHTML={{ __html: footerData.logo }}></div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {footerTree && <Nav footer={footerData} footerTree={footerTree} getExternalLink={getExternalLink} getLink={getLink} />}
                        </div>
                        {footerData.bottomLinks && (
                            <div className={styles.footer_container_bottomData}>
                                {footerData.bottomLinks.map((link, i) => {
                                    return <span key={`${link.title}_${i}`}>{renderLink(link.type, link.title, link.url, link.openInNewTab)}</span>;
                                })}
                                <button
                                    onClick={() => {
                                        setShowCookieModal(true);
                                    }}
                                    className={`${styles.button_modal_cookie} primaryParagraph`}
                                >
                                    {footerData?.manage_cookies_text}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
