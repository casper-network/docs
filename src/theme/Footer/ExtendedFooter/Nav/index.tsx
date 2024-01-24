import React from "react";
import IFooterData from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/footerData";
import styles from "./Nav.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";

interface INavProps {
    footer: IFooterData;
    footerTree: any;
    getExternalLink: (path: string) => string;
    getLink: (path: string) => string;
}

function Nav({ footer, footerTree, getExternalLink, getLink }: INavProps) {
    const renderLink = ({ title, open_in_new_tab, link_type, url }) => {
        if (link_type === "internal") {
            return (
                <a key={`${title}`} href={getLink(url)}>
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
        <nav className={`${styles.nav}`}>
            {footerTree.footer_tree.items.map((column, i) => {
                return (
                    <div key={`footer_column_${i}`} className={styles.nav_category}>
                        <p className={`primaryParagraph ${styles.nav_category_title}`}>{column.title}</p>
                        <div className={styles.nav_category_links}>
                            {column.children.map((link, i) => {
                                return renderLink(link);
                            })}
                        </div>
                    </div>
                );
            })}
            {footer && footer.logo && (
                <div className={styles.logoCasper}>
                    <Link href={getExternalLink("/")}>
                        <div className={styles.logoCasper_logo} dangerouslySetInnerHTML={{ __html: footer.logo }}></div>
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Nav;
