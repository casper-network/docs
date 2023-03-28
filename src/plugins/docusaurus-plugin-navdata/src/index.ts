import type { LoadContext, Plugin } from '@docusaurus/types';
import {
  AddHeaderInterceptor,
  HttpClient,
  NodeFetcher,
  ContentTypeInterceptor,
} from '@miracledevs/paradigm-web-fetch';
import convertData from './convertData';
import IFooterData from './interfaces/navbar/footerData';
import INavData from './interfaces/navbar/navData';
import ISocialMedia from './interfaces/navbar/socialMedia';
// import imageToBase64 from 'image-to-base64';

type PluginOptions = {
  directusUrl: string;
  directusGraphqlUrl: string;
  directusToken: string;
  query: string;
};

const navDataLoader = (
  _: LoadContext,
  { directusUrl, directusGraphqlUrl, directusToken, query }: PluginOptions
): Plugin<any> => {
  return {
    name: 'docusaurus-plugin-navdata',

    async loadContent() {
      if (!directusToken || !directusUrl || !directusGraphqlUrl || !query) {
        return null;
      }
      const httpClient = new HttpClient();
      var nodeFetcher = new NodeFetcher();
      httpClient.setFetcher(nodeFetcher);
      httpClient.registerInterceptor(
        new ContentTypeInterceptor('application/json')
      );
      httpClient.registerInterceptor(
        new AddHeaderInterceptor('Authorization', `Bearer ${directusToken}`)
      );

      const response = await httpClient.post(
        directusGraphqlUrl,
        undefined,
        JSON.stringify({ query })
      );

      const json = await response.json();

      const data = convertData(json);

      const promises = [];

      for (const media of data.socialMedia) {
        promises.push(loadSocialMediaImages(media, httpClient, directusUrl));
      }

      for (const navData of data.navData) {
        promises.push(loadLogos(navData, httpClient, directusUrl));
      }

      for (const footerData of data.footerData) {
        promises.push(loadFooterLogos(footerData, httpClient, directusUrl));
      }

      await Promise.all(promises);

      return data;
    },

    async contentLoaded({ content, actions: { setGlobalData } }) {
      setGlobalData(content);
    },
  };
};

const loadSocialMediaImages = async (
  media: ISocialMedia,
  httpClient: HttpClient,
  url: string
) => {
  const response = await httpClient.get(`${url}assets/${media.iconId}`);
  const text = await response.text();
  media.icon = text;
};

const loadLogos = async (
  navData: INavData,
  httpClient: HttpClient,
  url: string
) => {
  const response = await httpClient.get(`${url}assets/${navData.logoId}`);
  const text = await response.text();
  navData.logo = text;
};

const loadFooterLogos = async (
  footerData: IFooterData,
  httpClient: HttpClient,
  url: string
) => {
  const response = await httpClient.get(`${url}assets/${footerData.logoId}`);
  const text = await response.text();
  footerData.logo = text;
};

export default navDataLoader;
