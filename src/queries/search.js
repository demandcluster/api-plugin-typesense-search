import typesense from "typesense";
import xformArrayToConnection from "@reactioncommerce/api-utils/graphql/xformArrayToConnection.js";
import getPaginatedResponseFromAggregate from "@reactioncommerce/api-utils/graphql/getPaginatedResponseFromAggregate.js";
// import { createClient } from 'redis';
import hash from "object-hash";
 

// const env = cleanEnv(process.env, {
//   REDISHOST:        str({ default: 'redis' }),
//   REDISPWD:           str({ default: 'redis' }),
// })

// const RedisClient = redis.createClient(6379, env.REDISHOST);
// RedisClient.auth(env.REDISPWD);


const typesenseclient = new typesense.Client({
  nodes: [
    {
      host: 'typesense.demandcluster.com',
      port: '443',
      protocol: 'https',
    },
  ],
  typesenseCollectionName: process.env.typesenseApiSearchCollection,
  apiKey: process.env.typesenseApiSearchKey,
  connectionTimeoutSeconds: 20,
  numRetries: 4,
  retryIntervalSeconds: 2,
});

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

const fixComparePrice = (compEUR) => {
  if(!compEUR.compareAtPrice){
    return null;
  }
  return {
      amount:compEUR.compareAtPrice,
      currency:{code: "EUR"},
      displayAmount:compEUR.compareAtPrice,
  };
};

const searchtypeSense = async (params) => {
  return await typesenseclient.collections(process.env.typesenseApiSearchCollection).documents().search(params);
};
export default async function typesenseSearch(context, connectionArgs, currentApiAccess) {
  
  let startTime = process.hrtime();
  

  // const redisHash = hash(connectionArgs.typesenseSearchParameters)//up before 0 page
  // RedisClient.get(
  //   `${process.env.platform}:${redisHash}`,
  //   async (err, searchResponsea) => {
  //    if (searchResponsea) {
  //      return searchResponsea;
  //   }
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

    if(connectionArgs.typesenseSearchParameters.use_cache !== false){
      connectionArgs.typesenseSearchParameters.use_cache = true;
    }
    connectionArgs.typesenseSearchParameters.cache_ttl = 120;
    connectionArgs.typesenseSearchParameters.search_cutoff_ms = 10;
    // const facet_by  = connectionArgs.typesenseSearchParameters.facet_by.split(',');
    // const allPromises = [];
    // facet_by.forEach(facet => {
    //   connectionArgs.typesenseSearchParameters.facet_by = facet;
    //   allPromises.push(searchtypeSense(JSON.parse(JSON.stringify(connectionArgs.typesenseSearchParameters))));
    //   connectionArgs.typesenseSearchParameters.per_page = 0;
    // });

    // let searchData = [];
    // const result = await Promise.all(allPromises);
    // result.forEach(data => {
    //   if(data.hits.length === 0 ){
    //     searchData.facet_counts.push(...data.facet_counts);
    //   }else{
    //     searchData = data;
    //   }
    // });
    const searchData = await searchtypeSense(connectionArgs.typesenseSearchParameters);
    console.log('searchData', searchData);
    // const variantIds = searchData.hits.map(hit => (hit.document.variantId )).filter((value, index, self) => self.indexOf(value) === index);
    console.log(`process took 1 : ${process.hrtime(startTime)}`);
    startTime = process.hrtime();
    
    // const catalogProducts = searchData.hits.map(hit => {
    //   return JSON.parse(hit.document.fullDocument);
    // });

    // const catalogProducts2 = await context.collections.Catalog.find({_id: {$in:variantIds}}, { _id:1 }).toArray(); 
    const searchDataWithCatalogProducts = searchData.hits.map(hit => {
      // const catalogProduct = catalogProducts.find(catalogProduct => catalogProduct._id === hit.document.variantId);
      const catalogProduct = JSON.parse(hit.document.fullDocument);;
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
      catalogProduct.product.primaryImage.URLs.large = `${process.env.ROOT_URL}${catalogProduct.product.primaryImage.URLs.large}`;
      catalogProduct.product.primaryImage.URLs.medium = `${process.env.ROOT_URL}${catalogProduct.product.primaryImage.URLs.medium}`;
      catalogProduct.product.primaryImage.URLs.small = `${process.env.ROOT_URL}${catalogProduct.product.primaryImage.URLs.small}`;
      catalogProduct.product.primaryImage.URLs.thumbnail = `${process.env.ROOT_URL}${catalogProduct.product.primaryImage.URLs.thumbnail}`;
      
      // catalogProduct._id = '23y8dh28923f23';
      // console.log('catalogProduct',catalogProduct);
      return {highlights: {...hit.highlights}, ...catalogProduct};
    });

    console.log(`process took 2 : ${process.hrtime(startTime)}`);
    startTime = process.hrtime();
    // console.log('searchDataWithCatalogProducts',searchDataWithCatalogProducts);
    
    // console.log(searchDataWithCatalogProducts[14].product.variants[0].pricing[0]);
    const searchResponse = await xformArrayToConnection({}, searchDataWithCatalogProducts);
    // console.log('searchResponse',searchResponse);
    const hasPreviousPage=searchData.page > 1;
    const hasNextPage=searchData.page < searchData.found/perPage;
  
    // overwrite the pagination info with typesense pagination
    searchResponse.pageInfo.hasPreviousPage=hasPreviousPage;
    searchResponse.pageInfo.hasNextPage=hasNextPage;
    searchResponse.totalCount=searchData.found;
    searchResponse.searchedItems=searchData.out_of;
    searchResponse.page=searchData.page;
    searchResponse.facet_counts=searchData?.facet_counts||[];
    // console.log(searchResponse.edges[0].node.product.pricing[0]);

    console.log(`process took 3 : ${process.hrtime(startTime)}`);
    startTime = process.hrtime();




      

    // RedisClient.set(`${process.env.platform}:${redisHash}`, searchResponse, 600);
    return searchResponse;
  // });
  
}
