import { ICookieItem } from './interfaces/cookieItem';
import { ICookiesData } from './interfaces/cookieData';

function convertData(source: any) {
  const cookieTranslations: Array<ICookiesData> = [];
  for (const translation of source.data.cookie_banner.translations) {
    const cookieConvertedData: ICookiesData = convertCookiesData(translation);
    cookieTranslations.push(cookieConvertedData);
  }
  return {
    cookieData: cookieTranslations,
  };
}

export default convertData;

function convertCookiesData(source: any): ICookiesData {
  let cookiesData = [];

  for (const itemData of source.items) {
    const item: ICookieItem = convertItems(itemData);
    cookiesData.push(item);
  }

  return {
    languageCode: source.languages_code.code.toLocaleLowerCase(),
    manage_body: source.manage_body,
    manage_title: source.manage_title,
    notice_body: source.notice_body,
    notice_title: source.notice_title,
    manage_button_text: source.manage_button_text,
    accept_all_button_text: source.accept_all_button_text,
    confirm_button_text: source.confirm_button_text,
    items: cookiesData,
  };
}

function convertItems(source: any): ICookieItem {
  return {
    required: source.cookie_item_id.required,
    parameter: source.cookie_item_id.parameter,
    title: source.cookie_item_id.title,
    description: source.cookie_item_id.description,
  };
}
