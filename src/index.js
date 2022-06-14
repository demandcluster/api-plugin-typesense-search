import debug from "./debug.js";
import queries from "./queries/index.js";
import resolvers from "./resolvers/index.js";
import schemas from "./schemas/index.js";
import pkg from "../package.json";


/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  /**
   * Simple Inventory plugin
   * Isolates the get/set of inventory data to this plugin.
   */
  await app.registerPlugin({
    label: "Plugin Typesense Search",
    name: "plugin-typesense-search",
    version: pkg.version,
    graphQL: {
      resolvers,
      schemas
    },
    queries
  });
}