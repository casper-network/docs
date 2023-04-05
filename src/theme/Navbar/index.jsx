import React from "react";
import NavbarLayout from "@theme/Navbar/Layout";
import NavbarContent from "@theme/Navbar/Content";
import ExtendedNavbar from "./ExtendedNavbar";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import clsx from "clsx";
import styles from "./Navbar.module.scss";

export default function Navbar() {
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;
    const { toggle, shown } = useNavbarMobileSidebar();

    function NavbarBackdrop(props) {
        return <div role="presentation" {...props} className={clsx("navbar-sidebar__backdrop", props.className)} />;
    }

    return (
        <>
            <NavbarLayout>
                {customFields.directusUrl && customFields.directusGraphqlUrl && customFields.siteUrl && <ExtendedNavbar />}
                <NavbarContent />
            </NavbarLayout>
            <NavbarBackdrop onClick={toggle} className={shown ? styles.backdropToggle : ""} />
        </>
    );
}
