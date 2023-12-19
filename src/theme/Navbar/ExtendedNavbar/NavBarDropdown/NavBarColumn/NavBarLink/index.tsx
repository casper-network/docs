import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";
import ILink from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/link";
import styles from "./NavBarLink.module.scss";

interface INavBarLinkProps {
    locale: string;
    closeNavBarHandler: () => void;
    link: any;
}

export default function NavBarLink({ locale, closeNavBarHandler, link }: INavBarLinkProps) {
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

    const renderLink = ({ title, open_in_new_tab, link_type, url }) => {
        if (link_type === "internal") {
            return (
                <a key={`${title}`} href={getLink(url)} onClick={() => closeNavBarHandler()}>
                    {title}
                </a>
            );
        } else {
            return (
                <a key={`${title}`} href={url} target={open_in_new_tab ? "_blank" : "_self"}>
                    {title}
                </a>
            );
        }
    };

    return (
        <li className={`${styles.link} ${link && link.id && link.children?.length === 0 ? styles.onlyTitle : ""}`}>
            <span>{renderLink(link)}</span>

            {link && link.id && link.children && (
                <ul className={`${styles.asd} noWrap`}>
                    {link.children.map((subLink: any, i: number) => {
                        return <NavBarLink key={`column_group_link_${i}`} link={subLink} closeNavBarHandler={closeNavBarHandler} locale={locale}></NavBarLink>;
                    })}
                </ul>
            )}
        </li>
    );
}
