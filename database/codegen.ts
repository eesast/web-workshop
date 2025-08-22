import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".local.env"),
});

const config = {
  schema: [
    {
      [process.env.HASURA_GRAPHQL_ENDPOINT!]: {
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
        },
      },
    },
  ],
  documents: ["./graphql/**/*.graphql"],
  generates: {
    "../frontend/src/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
    "../backend/src/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        gqlImport: "graphql-request#gql",
      },
    },
  },
};

export default config;
