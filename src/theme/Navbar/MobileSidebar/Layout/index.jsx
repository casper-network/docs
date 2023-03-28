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
    const announcerRef = React.useRef(null);
    const siteNavBarRef = React.useRef(null);

    const announcer = useWindow ? document.querySelectorAll('*[class^="announcementBar_"]')[0] : null;
    const siteNavBar = useWindow ? document.querySelectorAll('*[class^="navbar_wrapper"]')[0] : null;

    let announcerHeight, siteNavBarHeight, onScreen;

    if (announcer) {
        announcerRef.current = announcer;
        onScreen = useOnScreen(announcerRef, "0px");
        announcerHeight = announcerRef.current.offsetHeight;
    }

    if (siteNavBar) {
        siteNavBarRef.current = siteNavBar;
        siteNavBarHeight = siteNavBarRef.current.offsetHeight;
    }

    function useNavbarItems() {
        // TODO temporary casting until ThemeConfig type is improved
        return useThemeConfig().navbar.items;
    }

    return (
        <div
            className={`navbar-sidebar ${styles.sideBarWrapper} ${onScreen ? styles.showingAnnouncer : ""}`}
            style={{
                ["--announcerHeight"]: `${announcerHeight ? announcerHeight : 0}px`,
                ["--siteNavbarMobileHeight"]: `${siteNavBarHeight ? siteNavBarHeight : 0}px`,
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
