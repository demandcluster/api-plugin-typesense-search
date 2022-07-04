import typesense from "typesense";
import xformArrayToConnection from "@reactioncommerce/api-utils/graphql/xformArrayToConnection.js";
import getPaginatedResponseFromAggregate from "@reactioncommerce/api-utils/graphql/getPaginatedResponseFromAggregate.js";
import config from "../config.js";
import Logger from "@reactioncommerce/logger";
import flatten from "flat";
import encodeOpaqueId from "@itleadopencommerce/api-utils/encodeOpaqueId.js";

// const encodeCatalogItemOpaqueId = encodeOpaqueId("reaction/catalogItem");

import hash from "object-hash";

const {TYPESENSE_HOST,TYPESENSE_COLLECTION,TYPESENSE_TIMEOUT,TYPESENSE_SEARCH_KEY,TYPESENSE_RETRIES,TYPESENSE_RETRY_DELAY,ROOT_URL} = config;
console.log(TYPESENSE_HOST)
console.log(TYPESENSE_SEARCH_KEY)
const typesenseclient = new typesense.Client({
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

//TYPESENSE_COLLECTION

// console.log(typesenseclient)




// let catalogSchema = {
//   "name": "Catalog",
//   "fields": [
//     // {"name": "year_constructed", "type": "int32" },
//     // {"name": "size_of_lot_sqm", "type": "int32" },
//     // {"name": "number_of_bedrooms", "type": "int32" },


//     // {"name": 'features\..*\.attributes', "type": "string[]", "facet": true },
//     // {"name": 'features\..*\.location', "type": "string[]", "facet": true }
//   ],
//   "default_sorting_field ": "updatedAt",
// }





//==================================================================//

// CatalogSearch playground

await typesenseclient.collections(TYPESENSE_COLLECTION).delete();

// // // const autoSchema = {
// // //   "name": "Catalog",
// // //   "fields": [
// // //     {"name": ".*", "type": "auto" }
// // //   ],
// // // };

let catalogSchema = {
  'name': TYPESENSE_COLLECTION,
  'fields': [
    // {'name': 'updatedAt.', 'type': 'int32'},
    {'name': 'product.title', 'type': 'string'},
    {'name': 'product.updatedAt', 'type': 'string' },
    {'name': 'product.pricing.PLN.minPrice', 'type': 'float'},
    // {"name": "product.optionTitle", "type": "string[]", "facet": true },
    {"name": "tagIds", "type": "string[]", "facet": true },
    {"name": "product.originCountry", "type": "string", "facet": true },
    {"name": "product.vendor", "type": "string", "facet": true },
  ],
  'default_sorting_field': 'product.pricing.PLN.minPrice',
}


await typesenseclient.collections().create(catalogSchema)
  .then(function (data) {
    console.log(data)
})

const productCatalog = {
  "_id": "p46gEGW8XDBNYpQn5",
  "product": {
    "_id": "Li6YyCYQixi4CWtJv",
    "barcode": "",
    "createdAt": "2022-03-23T14:20:48.573Z",
    "description": "Cool small aggressive monkey",
    "height": "",
    "isDeleted": "true",
    "isVisible": "true",
    "length": "",
    "media": {
      "0": {
        "priority": 1,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "/assets/files/Media/z5z6yr598S7tXKJri/large/960x0.jpg",
          "medium": "/assets/files/Media/z5z6yr598S7tXKJri/medium/960x0.jpg",
          "original": "/assets/files/Media/z5z6yr598S7tXKJri/image/960x0.jpg",
          "small": "/assets/files/Media/z5z6yr598S7tXKJri/small/960x0.png",
          "thumbnail": "/assets/files/Media/z5z6yr598S7tXKJri/thumbnail/960x0.png"
        }
      },
      "1": {
        "priority": 2,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "2": {
        "priority": 2,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "/assets/files/Media/mdcthtihNtHW2hBA3/large/413010c716c84bb21c9479518f1751d4.jpg",
          "medium": "/assets/files/Media/mdcthtihNtHW2hBA3/medium/413010c716c84bb21c9479518f1751d4.jpg",
          "original": "/assets/files/Media/mdcthtihNtHW2hBA3/image/413010c716c84bb21c9479518f1751d4.jpg",
          "small": "/assets/files/Media/mdcthtihNtHW2hBA3/small/413010c716c84bb21c9479518f1751d4.png",
          "thumbnail": "/assets/files/Media/mdcthtihNtHW2hBA3/thumbnail/413010c716c84bb21c9479518f1751d4.png"
        }
      },
      "3": {
        "priority": 3,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "4": {
        "priority": 4,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "5": {
        "priority": 5,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "6": {
        "priority": 6,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "7": {
        "priority": 7,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "8": {
        "priority": 8,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      },
      "9": {
        "priority": 9,
        "productId": "Li6YyCYQixi4CWtJv",
        "variantId": "",
        "URLs": {
          "large": "null",
          "medium": "null",
          "original": "null",
          "small": "null",
          "thumbnail": "null"
        }
      }
    },
    "metafields": "",
    "metaDescription": "",
    "originCountry": "ZM",
    "pageTitle": "Crazy monkey page",
    "parcel": "",
    "primaryImage": {
      "priority": 1,
      "productId": "Li6YyCYQixi4CWtJv",
      "variantId": "",
      "URLs": {
        "large": "/assets/files/Media/z5z6yr598S7tXKJri/large/960x0.jpg",
        "medium": "/assets/files/Media/z5z6yr598S7tXKJri/medium/960x0.jpg",
        "original": "/assets/files/Media/z5z6yr598S7tXKJri/image/960x0.jpg",
        "small": "/assets/files/Media/z5z6yr598S7tXKJri/small/960x0.png",
        "thumbnail": "/assets/files/Media/z5z6yr598S7tXKJri/thumbnail/960x0.png"
      }
    },
    "productId": "Li6YyCYQixi4CWtJv",
    "productType": "",
    "shopId": "PQ8s7cJSFWZkuGJLF",
    "sku": "",
    "slug": "crazy-monkey",
    "socialMetadata": {
      "0": {
        "service": "twitter",
        "message": ""
      },
      "1": {
        "service": "facebook",
        "message": ""
      },
      "2": {
        "service": "googleplus",
        "message": ""
      },
      "3": {
        "service": "pinterest",
        "message": ""
      }
    },
    "supportedFulfillmentTypes": {
      "0": "shipping"
    },
    "tagIds": {
      "0": "8NGL2ftLn9GGa4j7c",
      "1": "R3YofvteqTHQwdZf4",
      "2": "HQN6yCc7KuuHnRQtf"
    },
    "title": "Crazy monkey",
    "type": "product-simple",
    "updatedAt": "2022-05-18T12:46:11.184Z",
    "variants": {
      "0": {
        "_id": "RXTehitSG8RYxbayQ",
        "attributeLabel": "Color, Size",
        "barcode": "",
        "createdAt": "2022-03-23T14:20:48.607Z",
        "height": 13,
        "index": 0,
        "length": 13,
        "media": {
          "0": {
            "priority": "",
            "productId": "",
            "variantId": "",
            "URLs": {
              "large": "",
              "medium": "",
              "original": "",
              "small": "",
              "thumbnail": ""
            }
          },
          "1": {
            "priority": "",
            "productId": "",
            "variantId": "",
            "URLs": {
              "large": "",
              "medium": "",
              "original": "",
              "small": "",
              "thumbnail": ""
            }
          },
          "2": {
            "priority": "",
            "productId": "",
            "variantId": "",
            "URLs": {
              "large": "",
              "medium": "",
              "original": "",
              "small": "",
              "thumbnail": ""
            }
          }
        },
        "metafields": "",
        "minOrderQuantity": "",
        "optionTitle": "Black, Small",
        "originCountry": "",
        "primaryImage": {
          "priority": "",
          "productId": "",
          "variantId": "",
          "URLs": {
            "large": "",
            "medium": "",
            "original": "",
            "small": "",
            "thumbnail": ""
          }
        },
        "shopId": "PQ8s7cJSFWZkuGJLF",
        "sku": "",
        "title": "Fancy Monkey",
        "updatedAt": "2022-03-23T14:35:46.042Z",
        "variantId": "RXTehitSG8RYxbayQ",
        "weight": 2,
        "width": 12,
        "pricing": {
          "PLN": {
            "compareAtPrice": "",
            "displayPrice": "12,00 zł",
            "maxPrice": 12,
            "minPrice": 12,
            "price": 12
          },
          "USD": {
            "compareAtPrice": "",
            "displayPrice": "",
            "maxPrice": "",
            "minPrice": "",
            "price": ""
          }
        },
        "isSoldOut": "true",
        "isTaxable": "true",
        "taxCode": "",
        "taxDescription": "",
        "volume": "",
        "options": {
          "0": {
            "_id": "",
            "attributeLabel": "",
            "barcode": "",
            "createdAt": "",
            "height": "",
            "index": "",
            "length": "",
            "media": {
              "0": {
                "priority": "",
                "productId": "",
                "variantId": "",
                "URLs": {
                  "large": "",
                  "medium": "",
                  "original": "",
                  "small": "",
                  "thumbnail": ""
                }
              }
            },
            "metafields": "",
            "minOrderQuantity": "",
            "optionTitle": "",
            "originCountry": "",
            "primaryImage": {
              "priority": "",
              "productId": "",
              "variantId": "",
              "URLs": {
                "large": "",
                "medium": "",
                "original": "",
                "small": "",
                "thumbnail": ""
              }
            },
            "shopId": "",
            "sku": "",
            "title": "",
            "updatedAt": "",
            "variantId": "",
            "weight": "",
            "width": "",
            "pricing": {
              "PLN": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              },
              "USD": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              }
            },
            "isSoldOut": "",
            "isTaxable": "",
            "taxCode": "",
            "taxDescription": ""
          },
          "1": {
            "_id": "",
            "attributeLabel": "",
            "barcode": "",
            "createdAt": "",
            "height": "",
            "index": "",
            "length": "",
            "media": "",
            "metafields": "",
            "minOrderQuantity": "",
            "optionTitle": "",
            "originCountry": "",
            "primaryImage": "",
            "shopId": "",
            "sku": "",
            "title": "",
            "updatedAt": "",
            "variantId": "",
            "weight": "",
            "width": "",
            "pricing": {
              "PLN": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              }
            },
            "isSoldOut": "",
            "isTaxable": "",
            "taxCode": "",
            "taxDescription": ""
          }
        }
      },
      "1": {
        "_id": "",
        "attributeLabel": "",
        "barcode": "",
        "createdAt": "",
        "height": "",
        "index": "",
        "length": "",
        "media": {
          "0": {
            "priority": "",
            "productId": "",
            "variantId": "",
            "URLs": {
              "large": "",
              "medium": "",
              "original": "",
              "small": "",
              "thumbnail": ""
            }
          }
        },
        "metafields": "",
        "minOrderQuantity": "",
        "optionTitle": "",
        "originCountry": "",
        "primaryImage": {
          "priority": "",
          "productId": "",
          "variantId": "",
          "URLs": {
            "large": "",
            "medium": "",
            "original": "",
            "small": "",
            "thumbnail": ""
          }
        },
        "shopId": "",
        "sku": "",
        "title": "",
        "updatedAt": "",
        "variantId": "",
        "weight": "",
        "width": "",
        "pricing": {
          "PLN": {
            "compareAtPrice": "",
            "displayPrice": "",
            "maxPrice": {
              "range": "",
              "min": "",
              "max": ""
            },
            "minPrice": {
              "range": "",
              "min": "",
              "max": ""
            },
            "price": ""
          },
          "USD": {
            "compareAtPrice": "",
            "displayPrice": "",
            "maxPrice": "",
            "minPrice": "",
            "price": ""
          }
        },
        "isSoldOut": "",
        "isTaxable": "",
        "taxCode": "",
        "taxDescription": "",
        "volume": "",
        "options": {
          "0": {
            "_id": "",
            "attributeLabel": "",
            "barcode": "",
            "createdAt": "",
            "height": "",
            "index": "",
            "length": "",
            "media": "",
            "metafields": "",
            "minOrderQuantity": "",
            "optionTitle": "",
            "originCountry": "",
            "primaryImage": "",
            "shopId": "",
            "sku": "",
            "title": "",
            "updatedAt": "",
            "variantId": "",
            "weight": "",
            "width": "",
            "pricing": {
              "PLN": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              },
              "USD": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              }
            },
            "isSoldOut": "",
            "isTaxable": "",
            "taxCode": "",
            "taxDescription": ""
          },
          "1": {
            "_id": "",
            "attributeLabel": "",
            "barcode": "",
            "createdAt": "",
            "height": "",
            "index": "",
            "length": "",
            "media": "",
            "metafields": "",
            "minOrderQuantity": "",
            "optionTitle": "",
            "originCountry": "",
            "primaryImage": "",
            "shopId": "",
            "sku": "",
            "title": "",
            "updatedAt": "",
            "variantId": "",
            "weight": "",
            "width": "",
            "pricing": {
              "PLN": {
                "compareAtPrice": "",
                "displayPrice": "",
                "maxPrice": "",
                "minPrice": "",
                "price": ""
              }
            },
            "isSoldOut": "",
            "isTaxable": "",
            "taxCode": "",
            "taxDescription": ""
          }
        }
      },
      "2": {
        "_id": "",
        "attributeLabel": "",
        "barcode": "",
        "createdAt": "",
        "height": "",
        "index": "",
        "length": "",
        "media": "",
        "metafields": "",
        "minOrderQuantity": "",
        "optionTitle": "",
        "originCountry": "",
        "primaryImage": "",
        "shopId": "",
        "sku": "",
        "title": "",
        "updatedAt": "",
        "variantId": "",
        "weight": "",
        "width": "",
        "pricing": {
          "PLN": {
            "compareAtPrice": "",
            "displayPrice": "",
            "maxPrice": "",
            "minPrice": "",
            "price": ""
          }
        },
        "isSoldOut": "",
        "isTaxable": "",
        "taxCode": "",
        "taxDescription": "",
        "volume": ""
      }
    },
    "vendor": "Nature",
    "weight": "",
    "width": "",
    "pricing": {
      "PLN": {
        "compareAtPrice": "",
        "displayPrice": "12,00 zł",
        "maxPrice": 12,
        "minPrice": 12,
        "price": ""
      },
      "USD": {
        "compareAtPrice": "",
        "displayPrice": "",
        "maxPrice": "",
        "minPrice": "",
        "price": ""
      }
    },
    "isBackorder": "true",
    "isLowQuantity": "true",
    "isSoldOut": "true"
  },
  "createdAt": "2022-03-23T14:24:51.951Z",
  "shopId": "PQ8s7cJSFWZkuGJLF",
  "updatedAt": "2022-05-18T12:46:13.617Z"
};


const searchProductCatalog = {fullDocument: JSON.stringify(productCatalog),  ...flatten(productCatalog)};




import fs from 'fs/promises';
import path from 'path';
const __dirname = path.dirname('Catalog.json');
// // // console.log(path.resolve(__dirname))
const catalogInJson = await fs.readFile(path.resolve(__dirname, 'CatalogTest.json'));
// console.log(path.resolve(__dirname, 'Catalog.jsonl'))
// console.log(catalogInJsonl)
try {
  // await typesenseclient.collections(TYPESENSE_COLLECTION).documents().import(catalogInJsonl);
  // console.log("IMPORT SHOULD WORK")
  for (let catalogProduct of JSON.parse(catalogInJson)) {
    catalogProduct.product.variants = Object.values(catalogProduct.product.variants)
    let SearchCatalogProduct =  {
      fullDocument: JSON.stringify(catalogProduct),
      'tagIds': Object.values(catalogProduct.product['tagIds']),
      ...flatten(catalogProduct)
    };

    console.log(SearchCatalogProduct['product.pricing.PLN.minPrice'])
    if (!SearchCatalogProduct['product.pricing.PLN.minPrice']) continue;
    await typesenseclient.collections(TYPESENSE_COLLECTION).documents().upsert(SearchCatalogProduct);
  }
} catch (error) {
  Logger.error(error);
}




console.log(await typesenseclient.collections().retrieve());

// let searchParameters = {
//   'q'         : 'Crazy',
//   'query_by'  : 'product.title',
//   'sort_by'   : 'product.pricing.PLN.minPrice:desc'
// }

// typesenseclient.collections('Catalog')
//   .documents()
//   .search(searchParameters)
//   .then(function (searchResults) {
//     console.log(searchResults)
// })

//==================================================================//

// console.log(await typesenseclient.collections().retrieve())



//Books example schema

// let booksSchema = {
//   'name': 'books',
//   'fields': [
//     {'name': 'title', 'type': 'string' },
//     {'name': 'authors', 'type': 'string[]', 'facet': true },

//     {'name': 'publication_year', 'type': 'int32', 'facet': true },
//     {'name': 'ratings_count', 'type': 'int32' },
//     {'name': 'average_rating', 'type': 'float' }
//   ],
//   'default_sorting_field': 'ratings_count'
// }

// typesenseclient.collections().create(booksSchema)
//   .then(function (data) {
//     console.log(data)
// })
// import fs from 'fs/promises';
// import path from 'path';

// const __dirname = path.dirname('books.jsonl');
// const catalogInJsonl = await fs.readFile(path.resolve(__dirname, 'books.jsonl'));
// // console.log(catalogInJsonl)
// typesenseclient.collections('books').documents().import(catalogInJsonl);


const decodeOpaqueId = (opaqueId) => {
  if (opaqueId && opaqueId.length < 2 ) return opaqueId.join(':');
  const unencoded = Buffer.from(opaqueId[1], 'base64').toString('utf8');
  const [namespace, id] = unencoded.split(':');
  if(!id){
    return opaqueId.join(':');
  }
  opaqueId[1] = id;
  return opaqueId.join(':');
};

const fixComparePrice = (compPLN) => {
  if(!compPLN.compareAtPrice){
    return null;
  }
  return {
      amount:compPLN.compareAtPrice,
      currency:{code: "PLN"},
      displayAmount:compPLN.compareAtPrice,
  };
};

const searchtypeSense = async (params) => {
  return typesenseclient.collections(TYPESENSE_COLLECTION).documents().search(params);
};
export default async function typesenseSearch(context, connectionArgs, currentApiAccess) {

  let startTime = process.hrtime();

    connectionArgs.typesenseSearchParameters.q = connectionArgs.typesenseSearchParameters.q.join(',');
    connectionArgs.typesenseSearchParameters.query_by = connectionArgs.typesenseSearchParameters.query_by.join(',');
    try {
      if(connectionArgs.typesenseSearchParameters.query_by.indexOf('tagIds') > -1) {
        const qstring = connectionArgs.typesenseSearchParameters.q.split(',');
        const qarray = qstring.map((tagId) => (Buffer.from(tagId, 'base64').toString().split(':')[1]));
        if(qarray.length > 0) {
          connectionArgs.typesenseSearchParameters.q = qarray.join(',');
        }
      }
      if(connectionArgs.typesenseSearchParameters.filter_by.indexOf('tagIds') > -1) {
        const qstring = connectionArgs.typesenseSearchParameters.filter_by.split('&&');
        const qarray = qstring.map((tagId) => decodeOpaqueId(tagId.split(':')));
        if(qarray.length > 0) {
          connectionArgs.typesenseSearchParameters.filter_by = qarray.join(' && ');
        }
      }
    } catch (error) {

    }
    const offset=connectionArgs.typesenseSearchParameters?.offset||0;
  // if none 10, max 100 results

  //  facet_by: "tags,brand,color,size,price"
  const perPage=Math.min(connectionArgs?.typesenseSearchParameters?.first||20, 100);
  const currentPage=Math.max(Math.floor(offset/perPage)+1,1);

    connectionArgs.typesenseSearchParameters.per_page=perPage;
    connectionArgs.typesenseSearchParameters.page=currentPage;

    console.log(connectionArgs.typesenseSearchParameters);

    const searchData = await searchtypeSense(connectionArgs.typesenseSearchParameters);

    console.log(searchData);
    const searchDataWithCatalogProducts = searchData.hits.map(hit => {
      
      const catalogProduct = JSON.parse(hit.document.fullDocument);



      "START COMPARE: DO NOT UNDRESTEND WHAT IS GOING ON HERE"

      "SOME HARD CODED FOR EU CURRENCY STUFF"

      catalogProduct.product.pricing.PLN.compareAtPrice = fixComparePrice(catalogProduct.product.pricing.PLN);

      // console.log(catalogProduct.product.variants, 'VARIANTS')
      catalogProduct.product.pricing =  [{code: "PLN", currency:{code: "PLN"}, ...catalogProduct.product.pricing.PLN}];
      catalogProduct.product.variants = catalogProduct.product.variants.map(va => {
        va.pricing.PLN.compareAtPrice = fixComparePrice(va.pricing.PLN);
        va.pricing =  [{code: "PLN",currency:{code: "PLN"}, ...va.pricing.PLN}];
        // va.options = va.options.map(op => {
        //   op.pricing.PLN.compareAtPrice = fixComparePrice(op.pricing.PLN);
        //   op.pricing =  [{code: "PLN",currency:{code: "PLN"}, ...op.pricing.PLN}];
        //   return op;
        // });
        return va;
      });

      "END SOME COMPARE"

      catalogProduct.product.primaryImage.URLs.large = `${ROOT_URL}${catalogProduct.product.primaryImage.URLs.large}`;
      catalogProduct.product.primaryImage.URLs.medium = `${ROOT_URL}${catalogProduct.product.primaryImage.URLs.medium}`;
      catalogProduct.product.primaryImage.URLs.small = `${ROOT_URL}${catalogProduct.product.primaryImage.URLs.small}`;
      catalogProduct.product.primaryImage.URLs.thumbnail = `${ROOT_URL}${catalogProduct.product.primaryImage.URLs.thumbnail}`;
      return {highlights: {...hit.highlights}, ...catalogProduct};
    });



    const searchResponse = await xformArrayToConnection({}, searchDataWithCatalogProducts);

    const hasPreviousPage=searchData.page > 1;
    const hasNextPage=searchData.page < searchData.found/perPage;

    // overwrite the pagination info with typesense pagination
    searchResponse.pageInfo.hasPreviousPage=hasPreviousPage;
    searchResponse.pageInfo.hasNextPage=hasNextPage;
    searchResponse.totalCount=searchData.found;
    searchResponse.searchedItems=searchData.out_of;
    searchResponse.page=searchData.page;
    searchResponse.facet_counts=searchData?.facet_counts||[];


    return searchResponse;
}
