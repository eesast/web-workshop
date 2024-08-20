import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const auth = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
};

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HASURA_HTTPLINK!,
});

const authLink = setContext(auth).concat(httpLink);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink,
});
