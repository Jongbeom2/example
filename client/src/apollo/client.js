import { ApolloClient } from '@apollo/client';
import cache from 'src/apollo/cache';
import { link } from 'src/apollo/link';
import typeDefs from 'src/apollo/typeDefs';

// ApolloClient is an encapsulation of ApolloLink, ApolloCache... instances
const client = new ApolloClient({
  // Provide required constructor fields
  cache,
  link,
  // Provide some optional constructor fields
  name: 'react-web-client',
  version: process.env.VERSION,
  typeDefs,
  queryDeduplication: false,
  defaultOptions: {
    // 공식문서
    // https://www.apollographql.com/docs/react/api/core/ApolloClient/#example-defaultoptions-object
    // <useQuery> hook uses watchQuery function

    // fetchPolicy 설명글
    // https://medium.com/@galen.corey/understanding-apollo-fetch-policies-705b5ad71980

    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
