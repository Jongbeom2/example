import {ApolloClient} from '@apollo/client';
import cache from 'src/apollo/cache';
import {link} from 'src/apollo/link';
import typeDefs from 'src/apollo/typeDefs';

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
