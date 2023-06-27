import React from "react";
import clsx from "clsx";
import { HtmlClassNameProvider, ThemeClassNames, PageMetadata } from "@docusaurus/theme-common";
import { docVersionSearchTag, DocsSidebarProvider, DocsVersionProvider, useDocRouteMetadata } from "@docusaurus/theme-common/internal";
import DocPageLayout from "@theme/DocPage/Layout";
import NotFound from "@theme/NotFound";
import SearchMetadata from "@theme/SearchMetadata";
import Head from "@docusaurus/Head";
import { useLocation } from "@docusaurus/router";
import useLocaleMap from "../../hooks/useLocaleMap";
import { usePluginData } from "@docusaurus/useGlobalData";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Cookies from "js-cookie";
function DocPageMetadata(props) {
    const { versionMetadata } = props;
    const location = useLocation();
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;
    const baseUrl = customFields.baseUrl;
    const path = location.pathname.replace(baseUrl, "");
    const internalLocale = path.split("/")[0];
    const externalLocale = useLocaleMap(internalLocale);
    const data = usePluginData("docusaurus-plugin-cookiesbanner");

    const cookiesData =
        data?.cookieData.find((x) => x.languageCode === externalLocale) ||
        data?.cookieData.find((x) => x.languageCode === siteConfig.customFields.defaultExternalLocales);
    const items = cookiesData?.items;
    const prefs = Cookies.get("cookie-prefs") || JSON.stringify([]);
    return (
        <>
            {cookiesData && (
                <Head>
                    <script type="application/javascript">{`
                    if(!window.gtmConfigured) {
                        const items = ${JSON.stringify(items)}

                        const selections = ${prefs}

                        const layer = 'dataLayer';
                        window[layer] = window[layer] || [];
                        /**
                         * Iterate through the items and check (based on the selections)
                         * which ones have been selected by the user and add them as
                         * events to the Google Tag Manager DataLayer
                         */
                        items.forEach((item) => {
                        const { parameter } = item;
                        const accepted = selections.find(x => x.name== parameter && x.value);
                        const state = accepted ? 'active' : 'inactive';
                        const obj = { event: parameter };
                        obj[parameter] = state;
                        window[layer].push(obj);
                        });

                        window.gtmConfigured = true;
                    }
                `}</script>
                </Head>
            )}
            <SearchMetadata version={versionMetadata.version} tag={docVersionSearchTag(versionMetadata.pluginId, versionMetadata.version)} />
            <PageMetadata>{versionMetadata.noIndex && <meta name="robots" content="noindex, nofollow" />}</PageMetadata>
        </>
    );
}

export default function DocPage(props) {
    const { versionMetadata } = props;
    const currentDocRouteMetadata = useDocRouteMetadata(props);
    if (!currentDocRouteMetadata) {
        return <NotFound />;
    }
    const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;
    return (
        <>
            <DocPageMetadata {...props} />
            <HtmlClassNameProvider
                className={clsx(
                    // TODO: it should be removed from here
                    ThemeClassNames.wrapper.docsPages,
                    ThemeClassNames.page.docsDocPage,
                    props.versionMetadata.className,
                )}
            >
                <DocsVersionProvider version={versionMetadata}>
                    <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
                        <DocPageLayout>{docElement}</DocPageLayout>
                    </DocsSidebarProvider>
                </DocsVersionProvider>
            </HtmlClassNameProvider>
        </>
    );
}
