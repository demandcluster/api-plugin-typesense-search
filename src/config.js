import envalid from "envalid";

const { num, str, bool } = envalid;

export default envalid.cleanEnv(process.env, {

  ROOT_URL: str(),
  TYPESENSE_COLLECTION: str({
    desc: "The name of the collection to store the data in."
  }),
  TYPESENSE_SEARCH_KEY: str({
    desc: "The api key for the typesense search engine.",
    example: "http://localhost:3000/graphql"
  }),
  TYPESENSE_HOST: str({
    desc: "The hostname of the typesense server.",
    example: "typesense.mydomain.com"
  }),
  TYPESENSE_TIMEOUT: num({
    desc: "The timeout for the typesense server.",
    example: "20",
    default: 20
  }),
  TYPESENSE_RETRIES: num({
    desc: "The number of retries for the typesense server.",
    example: "3",
    default: 4
  }),
  TYPESENSE_RETRY_DELAY: num({
    desc: "The delay between retries for the typesense server.",
    example: "2",
    default: 2
  }),
});