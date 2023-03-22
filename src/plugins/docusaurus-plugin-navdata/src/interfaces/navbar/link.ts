export default interface ILink {
  title: string;
  type: 'internal' | 'external';
  url: string;
  children: Array<ILink>;
}
