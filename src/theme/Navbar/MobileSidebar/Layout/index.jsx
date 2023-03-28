import React from "react";
import clsx from "clsx";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import { useThemeConfig } from "@docusaurus/theme-common";
import NavbarSearch from "@theme/Navbar/Search";
import SearchBar from "@theme/SearchBar";
import useOnScreen from "../../../../hooks/useOnScreen";
import useWindow from "../../../../hooks/useWindow";
import styles from "./styles.module.scss";

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }) {
    const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();
    const items = useNavbarItems();
    const searchBarItem = items.find((item) => item.type === "search");
    const ref = React.useRef(null);

    const announcer = useWindow
        ? document.getElementsByClassName("announcementBar_node_modules-@docusaurus-theme-classic-lib-theme-AnnouncementBar-styles-module")[0]
        : null;
    let announcerHeight, onScreen;

    if (announcer) {
        ref.current = announcer;
        onScreen = useOnScreen(ref, "0px");
        announcerHeight = ref.current.offsetHeight;
    }

    function useNavbarItems() {
        // TODO temporary casting until ThemeConfig type is improved
        return useThemeConfig().navbar.items;
    }

    return (
        <div
            className={`navbar-sidebar ${styles.sideBarWrapper} ${onScreen ? styles.showingAnnouncer : ""}`}
            style={{
                ["--announcerHeight"]: `${announcerHeight}px`,
            }}
        >
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
