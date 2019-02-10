import { InMemoryCache, ApolloClient, split } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

// Create URI Link
const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql"
});

// Create Auth Context
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("TOKEN_JWT");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

// Create Web Socket Link
const wslink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("TOKEN_JWT")
    }
  }
});

// Verify whether the operation is Subscription, use wsLink otherwise httpLink
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wslink,
  authLink.concat(httpLink)
);

// Create apollo client instance
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  queryDeduplication: false
});
