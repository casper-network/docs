import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";
import ILink from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/link";
import styles from "./NavBarLink.module.scss";

interface INavBarLinkProps extends ILink {
    locale: string;
    closeNavBarHandler: () => void;
}

export default function NavBarLink({ title, url, type, openInNewTab, children, locale, closeNavBarHandler }: INavBarLinkProps) {
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;

    const getLink = (path: string) => {
        const siteUrl = customFields.siteUrl as string;
        const url = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
        const truncatedPath = path.startsWith("/") ? path.slice(1) : path;
        if (customFields.defaultExternalLocales === locale) {
            return `${url}/${truncatedPath}`;
        } else {
            return `${url}/${locale}/${truncatedPath}`;
        }
    };
    const renderLink = (type: "internal" | "external", title: string, url: string, openInNewTab: boolean) => {
        switch (type) {
            case "internal":
                return (
                    <a key={`${title}`} href={getLink(url)} onClick={() => closeNavBarHandler()}>
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

    return (
        <li className={`${styles.link} ${children?.length === 0 ? styles.onlyTitle : ""}`}>
            <span>{renderLink(type, title, url, openInNewTab)}</span>
            {children && (
                <ul className={`${styles.subLinkList} noWrap`}>
                    {children.length > 0 &&
                        children.map((subLink, i) => {
                            return (
                                <li key={`column_group_link_subLink_${subLink.title}_${i}`}>
                                    {renderLink(subLink.type, subLink.title, subLink.url, subLink.openInNewTab)}
                                </li>
                            );
                        })}
                </ul>
            )}
        </li>
    );
}
