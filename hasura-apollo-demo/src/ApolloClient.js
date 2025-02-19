import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: "https://gridstar-hasura-demo.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "CczDlOIxVQITSc0JyderkFk5i2a8mvC05WyDe6jQZupOc3HHDDMLkTHIO6hzJvWL",
  },
});

// WebSocket link for subscriptions (make sure your Hasura instance supports WebSocket)
const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://gridstar-hasura-demo.hasura.app/v1/graphql", // WebSocket endpoint
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": "CczDlOIxVQITSc0JyderkFk5i2a8mvC05WyDe6jQZupOc3HHDDMLkTHIO6hzJvWL",
      },
    },
  })
);

// Use the split function to read the operation type of a query
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Create Apollo Client with the split link
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;