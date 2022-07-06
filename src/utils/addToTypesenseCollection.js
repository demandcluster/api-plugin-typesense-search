import { typesenseclient } from "./getTypeSenceClient.js";
import config from "../config.js";
import flatten from "flat";
import { catalogSchema } from "./catalogSchema.js";
import Logger from "@reactioncommerce/logger";

const { TYPESENSE_COLLECTION } = config;

export default async function addToTypesenseCollection(context) {
  try {
    typesenseclient
      .collections()
      .create(catalogSchema)
      .then(function (data) {
        console.log(data);
      });
  } catch {
    Logger.info("Collection already exists");
  }

  context.appEvents.on(
    "afterPublishProductToCatalog",
    async ({ catalogProduct }) => {
      const filters = {};
      const updateSchema = {fields:[
        {'name': 'updatedAt', 'type': 'string'},
      ]};

      function collectOptions(options) {
        if (options) {
          for (const option of options) {
            console.log(option, "OPTION");
            filters[`${option.attributeLabel}_facet`] =
              (filters[`${option.attributeLabel}_facet`] &&
                filters[`${option.attributeLabel}_facet`].add(option.optionTitle)) ||
              new Set([option.optionTitle]);
            if (option.options) {
              return collectOptions(option.options);
            }
          }
        } else {
          return filters;
        }
      }
      for (const variant of catalogProduct.variants) {
        filters[`${variant.attributeLabel}_facet`] =
          (filters[`${variant.attributeLabel}_facet`] &&
            filters[`${variant.attributeLabel}_facet`].add(variant.optionTitle)) ||
          new Set([variant.optionTitle]);
        if (variant.options) {
          collectOptions(variant.options, filters);
        }
      }

      for (const key in filters) {
        filters[`${key}`] = Array.from(filters[key]);
        updateSchema.fields.push({ name: `${key}`, type: "auto", facet: true });
      }
 
      const searchCatalogProduct = {
        id: catalogProduct._id,
        fullDocument: JSON.stringify(catalogProduct),
        ...flatten(catalogProduct),
        tagIds: catalogProduct["tagIds"],
        ...filters,
      };
    
      if (!catalogProduct.isVisible || catalogProduct.isDeleted) {
        try {
          await typesenseclient
            .collections(TYPESENSE_COLLECTION)
            .documents(searchCatalogProduct._id)
            .delete();
          Logger.info("Deleting the document");
        } catch (err) {
          Logger.info(
            "There is no such document in typesense collection for delete"
          );
        }
      } else {
       
        try {
          await typesenseclient.collections(TYPESENSE_COLLECTION).documents(searchCatalogProduct._id).update(searchCatalogProduct)
          Logger.info("Updating the document");
        } catch {
          Logger.info(
            "There is no such document in typesense collection, adding new one"
          );
          await typesenseclient
            .collections(TYPESENSE_COLLECTION)
            .documents()
            .upsert(searchCatalogProduct);
        }
      }
    }
  );
}
