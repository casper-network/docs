import React from "react";
import styles from "./Nav.module.scss";
import NavBarDropdown from "../NavBarDropdown";
import icons from "../../../../icons";
import INavItem from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navItem";
import INavData from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navData";
import { CSSTransition } from "react-transition-group";

interface INav {
    dropdownParentRef: React.RefObject<HTMLElement>;
    header: INavData;
    handleClick: (title: string) => void;
    dropdownOpen: Boolean;
    current: string;
    locale: string;
    closeNavBarHandler: () => void;
}

function Nav({ dropdownParentRef, header, handleClick, dropdownOpen, current, locale, closeNavBarHandler }: INav) {
    const isCurrent = (item): boolean => {
        if (item && current === item.title && dropdownOpen) {
            return true;
        }
        return false;
    };

    return (
        <nav className={styles.navbar_list} ref={dropdownParentRef}>
            <div className={styles.navbar_list_container}>
                {header.navItems.map((item, i: number) => {
                    return (
                        <div className={styles.navbar_list_container_button} key={`navItem_${i}`}>
                            <button
                                key={`navItem_${i}`}
                                id={`navItem_${i}`}
                                className={`${styles.navbar_list_item} ${item?.title === current ? styles.isActive : ""}`}
                                tabIndex={0}
                                onClick={() => {
                                    handleClick(item.title || "");
                                }}
                            >
                                <span>{item.title}</span>
                                {icons.chevronDown}
                            </button>
                            <CSSTransition in={isCurrent(item!)} timeout={500} classNames="transition" unmountOnExit>
                                <NavBarDropdown content={item ?? undefined} locale={locale} closeNavBarHandler={closeNavBarHandler} />
                            </CSSTransition>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}

export default Nav;
