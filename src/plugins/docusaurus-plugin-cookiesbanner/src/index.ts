import type { LoadContext, Plugin } from '@docusaurus/types';
import {
  AddHeaderInterceptor,
  HttpClient,
  NodeFetcher,
  ContentTypeInterceptor,
} from '@miracledevs/paradigm-web-fetch';

import convertData from './convertData';

type PluginOptions = {
  directusUrl: string;
  directusGraphqlUrl: string;
  directusToken: string;
  query: string;
};

const cookiesDataLoader = (
  _: LoadContext,
  { directusUrl, directusGraphqlUrl, directusToken, query }: PluginOptions
): Plugin<any> => {
  return {
    name: 'docusaurus-plugin-cookiesbanner',

    async loadContent() {
      if (!directusToken || !directusUrl || !directusGraphqlUrl || !query) {
        return null;
      }
      const httpClient = new HttpClient();
      const nodeFetcher = new NodeFetcher();
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

      return data;
    },

    async contentLoaded({ content, actions: { setGlobalData } }) {
      setGlobalData(content);
    },
  };
};

export default cookiesDataLoader;
