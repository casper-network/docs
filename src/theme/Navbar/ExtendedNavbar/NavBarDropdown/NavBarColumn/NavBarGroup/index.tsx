import IGroup from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/group";
import React from "react";
import styles from "./NavBarGroup.module.scss";
import NavBarLink from "./NavBarLink";

interface INavBarGroupProps extends IGroup {
    locale: string;
    closeNavBarHandler: () => void;
}
export default function NavBarGroup({ links, title, locale, closeNavBarHandler }: INavBarGroupProps) {
    return (
        <div className={styles.linkGroup}>
            <span className="halfTitleEyebrow noWrap">{title}</span>
            <ul className={`primaryParagraph noWrap ${styles.linkList}`}>
                {links &&
                    links.map((link, i) => {
                        return <NavBarLink key={`column_group_link_${i}`} {...{ locale, ...link }} closeNavBarHandler={closeNavBarHandler} />;
                    })}
            </ul>
        </div>
    );
}
