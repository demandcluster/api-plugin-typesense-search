import Logger from '@reactioncommerce/logger';
import { registerPluginHandler } from "./registration.js";

/**
 * @summary Called on startup
 * @param {Object} context Startup apikeys
 * @param {Object} context.collections Map of MongoDB collections
 * @returns {undefined}
 */

export default async function typesenseStartup(context) {

    await context.app.registerPlugin({
        label: "Typsesense Search",
        name: "Typsesense Search",
        version: "0.0.1",
    });
  
}
  