import IColumn from './column';

export default interface INavItem {
  title: string;
  columns: Array<IColumn>;
}
