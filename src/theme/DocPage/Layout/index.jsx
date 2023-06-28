import React, { useState } from "react";
import { useDocsSidebar } from "@docusaurus/theme-common/internal";
import Layout from "@theme/Layout";
import BackToTopButton from "@theme/BackToTopButton";
import DocPageLayoutSidebar from "./Sidebar";
import DocPageLayoutMain from "../../DocPage/Layout/Main";
import styles from "./styles.module.css";
import CookieModal, { ModalContextContextProvider } from "../../Modals/CookieModal";
export default function DocPageLayout({ children }) {
    const sidebar = useDocsSidebar();
    const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
    return (
        <ModalContextContextProvider>
            <Layout wrapperClassName={styles.docsWrapper}>
                <CookieModal />
                <BackToTopButton />
                <div className={styles.docPage}>
                    {sidebar && (
                        <DocPageLayoutSidebar
                            sidebar={sidebar.items}
                            hiddenSidebarContainer={hiddenSidebarContainer}
                            setHiddenSidebarContainer={setHiddenSidebarContainer}
                        />
                    )}
                    <DocPageLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>{children}</DocPageLayoutMain>
                </div>
            </Layout>
        </ModalContextContextProvider>
    );
}
