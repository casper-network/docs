import React from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useHideableNavbar, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";
import styles from "./styles.module.css";

export default function NavbarLayout({ children }) {
    const {
        navbar: { hideOnScroll, style },
    } = useThemeConfig();
    const mobileSidebar = useNavbarMobileSidebar();
    const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
    return (
        <nav
            ref={navbarRef}
            aria-label={translate({
                id: "theme.NavBar.navAriaLabel",
                message: "Main",
                description: "The ARIA label for the main navigation",
            })}
            className={`${clsx(
                "navbar",
                "navbar--fixed-top",
                hideOnScroll && [styles.navbarHideable, !isNavbarVisible && styles.navbarHidden],
                {
                    "navbar--dark": style === "dark",
                    "navbar--primary": style === "primary",
                    "navbar-sidebar--show": mobileSidebar.shown,
                },
                styles.navBarWrapper,
            )}`}
        >
            {children}
        </nav>
    );
}
