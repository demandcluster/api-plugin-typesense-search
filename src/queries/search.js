import xformArrayToConnection from "@reactioncommerce/api-utils/graphql/xformArrayToConnection.js";
import getPaginatedResponseFromAggregate from "@reactioncommerce/api-utils/graphql/getPaginatedResponseFromAggregate.js";
import config from "../config.js";


import {typesenseclient} from "../utils/getTypeSenceClient.js";
const { TYPESENSE_COLLECTION, ROOT_URL } = config;


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


    const searchData = await searchtypeSense(connectionArgs.typesenseSearchParameters);

    const searchDataWithCatalogProducts = searchData.hits.map(hit => {
      
      const catalogProduct = JSON.parse(hit.document.fullDocument);
      if (!catalogProduct.product) {
        catalogProduct.product = {...catalogProduct};
      }

      catalogProduct.product.pricing.EUR.compareAtPrice = fixComparePrice(catalogProduct.product.pricing.EUR);
      
      catalogProduct.product.pricing =  [{code: "EUR", currency:{code: "EUR"}, ...catalogProduct.product.pricing.EUR}];
      catalogProduct.product.variants = catalogProduct.product.variants.map(va => {
        va.pricing.EUR.compareAtPrice = fixComparePrice(va.pricing.EUR);
        va.pricing =  [{code: "EUR",currency:{code: "EUR"}, ...va.pricing.EUR}];
        va.options = va.options.map(op => {
          op.pricing.EUR.compareAtPrice = fixComparePrice(op.pricing.EUR);
          op.pricing =  [{code: "EUR",currency:{code: "EUR"}, ...op.pricing.EUR}];
          return op;
        });
        return va;
      });
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
