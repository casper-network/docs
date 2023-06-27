import IFooterColumn from './footerColumn';
import ILink from './link';

export default interface IFooterData {
  columns: Array<IFooterColumn>;
  bottomLinks: Array<ILink>;
  languageCode: string;
  logoId: string;
  logo: string;
  title: string;
  description: string;
  manage_cookies_text: string;
}
