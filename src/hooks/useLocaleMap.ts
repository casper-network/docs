import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface LocalesMap {
    external: string;
    internal: string;
}

const useLocaleMap = (internalLocale: string): string => {
    const { siteConfig } = useDocusaurusContext();

    const locales: Array<LocalesMap> = siteConfig.customFields.locales as Array<LocalesMap>;

    const locale = locales.find((x) => x.internal === internalLocale);

    if (locale) {
        return locale.external;
    }

    return siteConfig.customFields.defaultExternalLocales as string;
};

export default useLocaleMap;
