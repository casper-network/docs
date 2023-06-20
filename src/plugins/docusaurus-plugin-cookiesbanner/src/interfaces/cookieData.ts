import { ICookieItem } from './cookieItem';
export interface ICookiesData {
  languageCode: string;
  manage_body: string;
  manage_title: string;
  notice_body: string;
  notice_title: string;
  manage_button_text: string;
  accept_all_button_text: string;
  confirm_button_text: string;
  items: Array<ICookieItem>;
}
