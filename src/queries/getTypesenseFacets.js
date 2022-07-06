import {typesenseclient} from "../utils/getTypeSenceClient.js";
import config from "../config.js";

const { TYPESENSE_COLLECTION, ROOT_URL } = config;

export default async function getTypesenseFacets(_, args, context) {
    const collectionSchema = await typesenseclient.collections(TYPESENSE_COLLECTION).retrieve();
    const facets = collectionSchema.fields
        .filter((el) => el.facet === true)
        .map((el) => el.name);
    return JSON.stringify(facets);
}