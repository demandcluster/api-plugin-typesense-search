import config from "../config.js";
import typesense from "typesense";
const {TYPESENSE_HOST,TYPESENSE_COLLECTION,TYPESENSE_TIMEOUT,TYPESENSE_SEARCH_KEY,TYPESENSE_RETRIES,TYPESENSE_RETRY_DELAY,ROOT_URL} = config;
export const typesenseclient = new typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      // port: '443',
      protocol: 'https',
    },
  ],
  typesenseCollectionName: TYPESENSE_COLLECTION,
  apiKey: TYPESENSE_SEARCH_KEY,
  connectionTimeoutSeconds: TYPESENSE_TIMEOUT,
  numRetries: TYPESENSE_RETRIES,
  retryIntervalSeconds: TYPESENSE_RETRY_DELAY
});