
import queries from "./queries/index.js";
import resolvers from "./resolvers/index.js";
import schemas from "./schemas/index.js";
import pkg from "../package.json";
import addToTypesenseCollection from "./utils/addToTypesenseCollection.js";



/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  /**
   * @summary Add GraphQL schemas and resolvers for this plugin
   * @param {Object} context
   */
  await app.registerPlugin({
    label: "Typesense Search",
    name: "typesense-search",
    version: pkg.version,
    graphQL: {
      resolvers,
      schemas
    },
    queries,
    functionsByType: {
      startup: [addToTypesenseCollection],
    }
  });
}