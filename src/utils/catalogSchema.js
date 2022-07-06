import config from "../config.js";

const { TYPESENSE_COLLECTION } = config;
 
export const catalogSchema = {
    'name': TYPESENSE_COLLECTION,
    'fields': [
      {'name': 'title', 'type': 'string'},
      {'name': 'pricing.PLN.minPrice', 'type': 'float'},
      {"name": "tagIds", "type": "string[]", "facet": true },
      {"name": "originCountry", "type": "string", "facet": true },
      {"name": "vendor", "type": "string", "facet": true },
      {"name": ".*_facet", "type": "auto", "facet": true },
  
    ],
    'default_sorting_field': 'pricing.PLN.minPrice',
  }