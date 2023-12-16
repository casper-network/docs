import INavItem from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navItem";
import React from "react";
import NavBarColumn from "./NavBarColumn";
import styles from "./NavBarDropdown.module.scss";

interface INavBarDropdownProps {
    content: any;
    locale: string;
    closeNavBarHandler: () => void;
    left: any;
}
export default function NavBarDropdown({ content, locale, closeNavBarHandler, left }: INavBarDropdownProps) {
    return (
        <div className={`${styles.wrapper}`} style={{ ["--left" as string]: `${left}px` }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dropdown_container}>
                {content &&
                    content.children.map((column: any, i: number) => {
                        return <NavBarColumn key={`column_${i}`} column={column} closeNavBarHandler={closeNavBarHandler} locale={locale} groups={[]} />;
                    })}
            </div>
        </div>
    );
}
