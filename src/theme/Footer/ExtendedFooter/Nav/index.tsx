import React from "react";
import IFooterData from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/footerData";
import styles from "./Nav.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";

interface INavProps {
    footer: IFooterData;
    renderLink: (type: string, title: string, url: string) => any;
    getExternalLink: (path: string) => string;
}

function Nav({ footer, renderLink, getExternalLink }: INavProps) {
    return (
        <nav className={`${styles.nav}`}>
            {footer.columns.map((column, i) => {
                return (
                    <div key={`footer_column_${i}`} className={styles.nav_category}>
                        <p className={`primaryParagraph ${styles.nav_category_title}`}>{column.title}</p>
                        <div className={styles.nav_category_links}>
                            {column.links.map((link, i) => {
                                return renderLink(link.type, link.title, link.url);
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
