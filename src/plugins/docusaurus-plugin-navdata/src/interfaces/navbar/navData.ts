import INavItem from './navItem';

export default interface INavData {
  navItems: Array<INavItem>;
  languageCode: string;
  loginText: string;
  searchPlaceholder: string;
  logoId: string;
  logo: string;
}
