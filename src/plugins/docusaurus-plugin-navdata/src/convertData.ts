import IColumn from './interfaces/navbar/column';
import IFooterColumn from './interfaces/navbar/footerColumn';
import IFooterData from './interfaces/navbar/footerData';
import IGroup from './interfaces/navbar/group';
import ILink from './interfaces/navbar/link';
import INavData from './interfaces/navbar/navData';
import INavItem from './interfaces/navbar/navItem';
import ISocialMedia from './interfaces/navbar/socialMedia';
const convertData = (
  source: any
): {
  socialMedia: Array<ISocialMedia>;
  navData: Array<INavData>;
  footerData: Array<IFooterData>;
  navTree: Array<any>;
  footerTree: Array<any>;
} => {
  const socialMedias: Array<ISocialMedia> = [];
  for (const socialMedia of source.data.social_media) {
    socialMedias.push(convertSocialMedia(socialMedia));
  }
  const navTreeTranslations = [];
  for (const translation of source.data.header.translations) {
    navTreeTranslations.push(translation);
  }

  const footerTreeTranslations = [];
  for (const translation of source.data.footer.translations) {
    footerTreeTranslations.push(translation);
  }
  const navDatas: Array<INavData> = [];
  for (const translation of source.data.header.translations) {
    const navData: INavData = convertNavData(translation);
    for (const sourceNavItem of translation.nav_items) {
      const navItem: INavItem = convertNavItem(
        sourceNavItem.header_nav_item_id
      );
      for (const sourceColumn of sourceNavItem.header_nav_item_id.columns) {
        const column: IColumn = convertColumn(
          sourceColumn.header_nav_column_id
        );
        for (const sourceGroup of sourceColumn.header_nav_column_id.groups) {
          const group: IGroup = convertGroup(sourceGroup.header_link_column_id);
          for (const sourceLink of sourceGroup.header_link_column_id.links) {
            const link: ILink = convertLink(sourceLink.link_id);
            for (const sourceSubLink of sourceLink.link_id.children) {
              const subLink: ILink = convertLink(sourceSubLink.related_link_id);
              link.children.push(subLink);
            }
            group.links.push(link);
          }
          column.groups.push(group);
        }
        navItem.columns.push(column);
      }
      navData.navItems.push(navItem);
    }
    navDatas.push(navData);
  }
  const footerDatas: Array<IFooterData> = [];
  for (const translation of source.data.footer.translations) {
    if (!translation.logo || !translation.title) {
      continue;
    }
    const footerData: IFooterData = convertFooterData(translation);
    for (const columnSource of translation.link_column) {
      const column: IFooterColumn = convertFooterColumn(
        columnSource.footer_link_column_id
      );
      for (const sourceLink of columnSource.footer_link_column_id.links) {
        const link: ILink = convertLink(sourceLink.link_id);
        column.links.push(link);
      }
      footerData.columns.push(column);
    }
    for (const sourceLink of translation.bottom_links) {
      const link: ILink = convertLink(sourceLink.link_id);
      footerData.bottomLinks.push(link);
    }
    footerDatas.push(footerData);
  }
  return {
    socialMedia: socialMedias,
    navData: navDatas,
    footerData: footerDatas,
    navTree: navTreeTranslations,
    footerTree: footerTreeTranslations,
  };
};
export default convertData;
const convertLink = (source: any): ILink => {
  return {
    title: source.title,
    type: source.type,
    url: source.url,
    children: [],
    openInNewTab: source.open_in_new_tab ?? false,
  };
};
const convertGroup = (source: any): IGroup => {
  return {
    title: source.title,
    links: [],
  };
};
const convertColumn = (_: any): IColumn => {
  return {
    groups: [],
  };
};
const convertNavItem = (source: any): INavItem => {
  return {
    title: source.title,
    columns: [],
  };
};
const convertSocialMedia = (source: any): ISocialMedia => {
  return {
    name: source.name,
    url: source.url,
    iconId: source.icon.id,
    icon: '',
  };
};
const convertNavData = (source: any): INavData => {
  return {
    languageCode: source.languages_code.code.toLocaleLowerCase(),
    loginText: source.login_text,
    searchPlaceholder: source.search_placeholder,
    logoId: source.logo.id,
    logo: '',
    navItems: [],
  };
};
const convertFooterData = (source: any): IFooterData => {
  return {
    languageCode: source.languages_code.code.toLocaleLowerCase(),
    logoId: source?.logo?.id,
    title: source?.title,
    description: source?.description,
    logo: '',
    bottomLinks: [],
    columns: [],
    manage_cookies_text: source?.manage_cookies_text,
  };
};
const convertFooterColumn = (source: any): IFooterColumn => {
  return {
    title: source.title,
    links: [],
  };
};
