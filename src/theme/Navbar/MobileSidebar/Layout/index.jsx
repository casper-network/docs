import React from "react";
import clsx from "clsx";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import { useThemeConfig } from "@docusaurus/theme-common";
import NavbarSearch from "@theme/Navbar/Search";
import SearchBar from "@theme/SearchBar";
import styles from "./styles.module.scss";

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }) {
    const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();
    const items = useNavbarItems();
    const searchBarItem = items.find((item) => item.type === "search");

    function useNavbarItems() {
        // TODO temporary casting until ThemeConfig type is improved
        return useThemeConfig().navbar.items;
    }

    return (
        <div className={`navbar-sidebar ${styles.sideBarWrapper}`}>
            {header}
            <div
                className={clsx("navbar-sidebar__items", {
                    "navbar-sidebar__items--show-secondary": secondaryMenuShown,
                })}
            >
                <div className={`navbar-sidebar__item menu`}>{primaryMenu}</div>
                <div className={`navbar-sidebar__item menu`}>{secondaryMenu}</div>
            </div>
            <div className={styles.docSearchContainer}>
                {!searchBarItem && (
                    <NavbarSearch>
                        <SearchBar />
                    </NavbarSearch>
                )}
            </div>
        </div>
    );
}
