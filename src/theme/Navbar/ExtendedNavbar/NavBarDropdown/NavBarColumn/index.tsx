import IColumn from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/column";
import React from "react";
import styles from "./NavBarColumn.module.scss";
import NavBarGroup from "./NavBarGroup";

interface INavBarColumnProps extends IColumn {
    locale: string;
    closeNavBarHandler: () => void;
}
export default function NavBarColumn({ groups, locale, closeNavBarHandler }: INavBarColumnProps) {
    return (
        <div className={styles.dropdown_column}>
            {groups &&
                groups.map((group, i) => {
                    return <NavBarGroup key={`column_group_${i}`} {...{ locale, ...group }} closeNavBarHandler={closeNavBarHandler} />;
                })}
        </div>
    );
}
