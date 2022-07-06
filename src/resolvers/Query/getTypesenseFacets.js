
export default async function getTypesenseFacets(_, args, context) {
    return await context.queries.getTypesenseFacets(context, args);
}