import IColumn from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/column";
import React from "react";
import styles from "./NavBarColumn.module.scss";
import NavBarLink from "../../../ExtendedNavbar/NavBarDropdown/NavBarColumn/NavBarLink";

interface INavBarColumnProps extends IColumn {
    column: any;
    locale: string;
    closeNavBarHandler: () => void;
}
export default function NavBarColumn({ column, locale, closeNavBarHandler }: INavBarColumnProps) {
    return (
        <div className={styles.dropdown_column}>
            <div className={styles.linkGroup}>
                <span className="halfTitleEyebrow noWrap">{column.title}</span>

                <ul className={`primaryParagraph noWrap ${styles.linkList}`}>
                    {column &&
                        column.children.map((link: any, i: number) => {
                            return <NavBarLink locale={locale} key={`column_group_link_${i}`} link={link} closeNavBarHandler={closeNavBarHandler} />;
                        })}
                </ul>
            </div>
        </div>
    );
}
