import {ApolloClient} from '@apollo/client';
import cache from './cache';
import {link} from './link';
import typeDefs from './typeDefs';

const client = new ApolloClient({
  cache,
  link,
  name: 'react-app-client',
  typeDefs,
  queryDeduplication: false,
  defaultOptions: {
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
