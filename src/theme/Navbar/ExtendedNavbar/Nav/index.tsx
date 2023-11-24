import React, { useState } from "react";
import styles from "./Nav.module.scss";
import NavBarDropdown from "../NavBarDropdown";
import icons from "../../../../icons";
import INavItem from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navItem";
import INavData from "../../../../plugins/docusaurus-plugin-navdata/src/interfaces/navbar/navData";
import { CSSTransition } from "react-transition-group";

interface INav {
    dropdownParentRef: React.RefObject<HTMLElement>;
    header: any;
    handleClick: (title: string) => void;
    dropdownOpen: Boolean;
    current: string;
    locale: string;
    closeNavBarHandler: () => void;
}

function Nav({ dropdownParentRef, header, handleClick, dropdownOpen, current, locale, closeNavBarHandler }: INav) {
    const [left, setLeft] = useState<{}>();
    const isCurrent = (item: any): boolean => {
        if (item && current === item?.title && dropdownOpen) {
            return true;
        }
        return false;
    };

    const getLeft = (position: string) => {
        const container = document.getElementById(position);
        return container!.offsetLeft - dropdownParentRef!.current!.scrollLeft;
    };

    return (
        <>
            <nav className={styles.navbar_list} ref={dropdownParentRef}>
                {header?.navigation_tree.items.map((item: any, i: number) => {
                    return (
                        <div className={styles.fullWidth} key={`navItem_${i}`}>
                            <div className={styles.navbar_list_container} id={`container_${i}`}>
                                <div className={styles.navbar_list_container_button}>
                                    <button
                                        id={`navItem_${i}`}
                                        onClick={() => {
                                            handleClick(item?.title || "");
                                            setLeft(getLeft(`container_${i}`));
                                        }}
                                        className={`${styles.navbar_list_item} ${item?.title === current ? styles.isActive : ""}`}
                                        tabIndex={0}
                                    >
                                        <span>{item.title}</span>
                                        {icons.chevronDown}
                                    </button>
                                </div>
                            </div>
                            <CSSTransition in={isCurrent(item!)} timeout={500} classNames="transition" unmountOnExit>
                                <NavBarDropdown left={left} content={item ?? undefined} closeNavBarHandler={closeNavBarHandler} locale={locale} />
                            </CSSTransition>
                        </div>
                    );
                })}
            </nav>
        </>
    );
}

export default Nav;
