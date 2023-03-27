import React, { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDocsSidebar } from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import DocSidebar from "../../../DocSidebar";
import ExpandButton from "./ExpandButton";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useWindow from "../../../../hooks/useWindow";
import styles from "./styles.module.scss";
// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }) {
    const sidebar = useDocsSidebar();
    return <React.Fragment key={sidebar?.name ?? "noSidebar"}>{children}</React.Fragment>;
}
export default function DocPageLayoutSidebar({ sidebar, hiddenSidebarContainer, setHiddenSidebarContainer }) {
    const { pathname } = useLocation();
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;
    const [hiddenSidebar, setHiddenSidebar] = useState(false);
    const [siteNavBarHeight, setSiteNavBarHeight] = useState(false);

    const ref = React.useRef(null);
    const toggleSidebar = useCallback(() => {
        if (hiddenSidebar) {
            setHiddenSidebar(false);
        }
        setHiddenSidebarContainer((value) => !value);
    }, [setHiddenSidebarContainer, hiddenSidebar]);

    function checkAndGetSiteNavbar() {
        if (customFields.directusUrl && customFields.directusGraphqlUrl && customFields.siteUrl) {
            if (!useWindow()) return;
            const siteNavbar = document.querySelector(".navbar_wrapper_src-theme-Navbar-ExtendedNavbar-ExtendedNavbar-module");
            if (siteNavbar) {
                ref.current = siteNavbar;
                setSiteNavBarHeight(ref.current.offsetHeight);
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        checkAndGetSiteNavbar();
    }, []);

    return (
        <aside
            className={clsx(ThemeClassNames.docs.docSidebarContainer, styles.docSidebarContainer, hiddenSidebarContainer && styles.docSidebarContainerHidden)}
            onTransitionEnd={(e) => {
                if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
                    return;
                }
                if (hiddenSidebarContainer) {
                    setHiddenSidebar(true);
                }
            }}
            style={{
                ["--dynamicNavBarSiteHeight"]: `${
                    customFields.directusUrl && customFields.directusGraphqlUrl && customFields.siteUrl ? siteNavBarHeight : 0
                }px`,
            }}
        >
            <ResetOnSidebarChange>
                <div className={clsx(styles.sidebarViewport, hiddenSidebar && styles.sidebarViewportHidden)}>
                    <DocSidebar sidebar={sidebar} path={pathname} onCollapse={toggleSidebar} isHidden={hiddenSidebar} />
                    {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
                </div>
            </ResetOnSidebarChange>
        </aside>
    );
}
