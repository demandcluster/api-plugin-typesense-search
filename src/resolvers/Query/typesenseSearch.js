
export default async function typesenseSearch(_, args, context) {
  return context.queries.typesenseSearch(context, args);
}
