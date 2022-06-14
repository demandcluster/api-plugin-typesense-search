import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";

const decodeaApikeysOpaqueId = decodeOpaqueIdForNamespace("reaction/apikeys");

export default async function typesenseSearch(_, args, context) {
  return context.queries.typesenseSearch(context, args);
}
