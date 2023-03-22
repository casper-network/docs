import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { splitNavbarItems, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import SearchBar from "@theme/SearchBar";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import NavbarLogo from "@theme/Navbar/Logo";
import NavbarSearch from "@theme/Navbar/Search";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";

function useNavbarItems() {
    // TODO temporary casting until ThemeConfig type is improved
    return useThemeConfig().navbar.items;
}
function NavbarItems({ items }) {
    return (
        <>
            {items.map((item, i) => (
                <NavbarItem {...item} key={i} />
            ))}
        </>
    );
}
function NavbarContentLayout({ left, right }) {
    return (
        <div className={`containerSite ${styles.fullNavBarHeight}`}>
            <div className="navbar__inner">
                <div className="navbar__items">{left}</div>
                <div className="navbar__items navbar__items--right">{right}</div>
            </div>
        </div>
    );
}
export default function NavbarContent() {
    const mobileSidebar = useNavbarMobileSidebar();
    const items = useNavbarItems();
    const [leftItems, rightItems] = splitNavbarItems(items);
    const searchBarItem = items.find((item) => item.type === "search");
    const isDesktop = useWindowWidth(997);
    return (
        <NavbarContentLayout
            left={
                // TODO stop hardcoding items?
                <>
                    {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
                    {/* Doc NavBar logo hidden */}
                    {/* <NavbarLogo /> */}
                    <NavbarItems items={leftItems} />
                </>
            }
            right={
                // TODO stop hardcoding items?
                // Ask the user to add the respective navbar items => more flexible
                <>
                    <NavbarItems items={rightItems} />
                    {/* Doc NavBar theme color toggle disabled */}
                    {/* <NavbarColorModeToggle className={styles.colorModeToggle} /> */}
                    {!searchBarItem && isDesktop && (
                        <NavbarSearch>
                            <SearchBar />
                        </NavbarSearch>
                    )}
                </>
            }
        />
    );
}
