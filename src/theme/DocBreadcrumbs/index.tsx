/**
 * Content is based on https://github.com/facebook/docusaurus/blob/v2.4.1/packages/docusaurus-theme-classic/src/theme/DocBreadcrumbs/index.tsx.
 * For details see https://github.com/casper-network/docs/issues/1216.
 /
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useSidebarBreadcrumbs, useHomePageRoute, useDoc, useDocsSidebar } from "@docusaurus/theme-common/internal";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import HomeBreadcrumbItem from "@theme/DocBreadcrumbs/Items/Home";
import { PropSidebarBreadcrumbsItem } from "@docusaurus/plugin-content-docs";

import styles from "./styles.module.css";

// TODO move to design system folder
function BreadcrumbsItemLink({ children, href, isLast }: { children: ReactNode; href: string | undefined; isLast: boolean }): JSX.Element {
    const className = "breadcrumbs__link";
    if (isLast) {
        return (
            <span className={className} itemProp="name">
                {children}
            </span>
        );
    }
    return href ? (
        <Link className={className} href={href} itemProp="item">
            <span itemProp="name">{children}</span>
        </Link>
    ) : (
        // TODO Google search console doesn't like breadcrumb items without href.
        // The schema doesn't seem to require `id` for each `item`, although Google
        // insist to infer one, even if it's invalid. Removing `itemProp="item
        // name"` for now, since I don't know how to properly fix it.
        // See https://github.com/facebook/docusaurus/issues/7241
        <span className={className}>{children}</span>
    );
}

// TODO move to design system folder
function BreadcrumbsItem({
    children,
    active,
    index,
    addMicrodata,
}: {
    children: ReactNode;
    active?: boolean;
    index: number;
    addMicrodata: boolean;
}): JSX.Element {
    return (
        <li
            {...(addMicrodata && {
                itemScope: true,
                itemProp: "itemListElement",
                itemType: "https://schema.org/ListItem",
            })}
            className={clsx("breadcrumbs__item", {
                "breadcrumbs__item--active": active,
            })}
        >
            {children}
            <meta itemProp="position" content={String(index + 1)} />
        </li>
    );
}

export default function DocBreadcrumbs(): JSX.Element | null {
    const breadcrumbs = useEnhancedSidebarBreadcrumbs();
    const homePageRoute = useHomePageRoute();

    if (!breadcrumbs) {
        return null;
    }

    return (
        <nav
            className={clsx(ThemeClassNames.docs.docBreadcrumbs, styles.breadcrumbsContainer)}
            aria-label={translate({
                id: "theme.docs.breadcrumbs.navAriaLabel",
                message: "Breadcrumbs",
                description: "The ARIA label for the breadcrumbs",
            })}
        >
            <ul className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
                {homePageRoute && <HomeBreadcrumbItem />}
                {breadcrumbs.map((item, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;
                    return (
                        <BreadcrumbsItem key={idx} active={isLast} index={idx} addMicrodata={!!item.href}>
                            <BreadcrumbsItemLink href={item.href} isLast={isLast}>
                                {item.label}
                            </BreadcrumbsItemLink>
                        </BreadcrumbsItem>
                    );
                })}
            </ul>
        </nav>
    );
}

// Workaround for https://github.com/facebook/docusaurus/issues/6953.
//
function useEnhancedSidebarBreadcrumbs(): PropSidebarBreadcrumbsItem[] | null {
    let breadcrumbs = useSidebarBreadcrumbs();
    const sidebar = useDocsSidebar();

    if (breadcrumbs === null) {
        return null;
    }

    if (sidebar === null || sidebar.items.length === 0) {
        return breadcrumbs;
    }

    // Add breadcrumb with top-level section.
    //
    // NOTE: Sidebar is not connected directly with navbar items, so we make simple assumption that for sidebar named "foo_bar" we get:
    // - Label: "Foo_bar"
    // - URL: "/foo_bar"
    // We hope it points to the correct navbar item.
    const sidebarName = sidebar.name;
    const label = sidebarName.charAt(0).toUpperCase() + sidebarName.slice(1);
    const href = "/" + sidebarName;
    const topLevelBreadcrumb: PropSidebarBreadcrumbsItem = {
        collapsed: true,
        collapsible: true,
        href,
        items: [],
        label,
        type: "category",
    };
    breadcrumbs.unshift(topLevelBreadcrumb);

    // Remove last breadcrumb if we detect index-like page.
    //
    // NOTE: Detection is based on assumption that index page will be a first link in the sidebar.
    const firstSidebarItem = sidebar.items[0];
    const lastBreadcrumb = breadcrumbs.at(-1);
    if (firstSidebarItem.type === "link" && lastBreadcrumb.type === "link" && firstSidebarItem.docId === lastBreadcrumb.docId) {
        breadcrumbs.pop();
    }

    return breadcrumbs;
}
