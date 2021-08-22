import { ApolloClient } from '@apollo/client';
import cache from 'src/apollo/cache';
import typeDefs from 'src/apollo/typeDefs';
import { from, fromPromise, split } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { REFRESH_ACCESS_TOKEN } from 'src/page/auth/auth.query';
import { isNotAuthorizedNetworkError } from 'src/lib/error';

// link 안에서 client에 접근해야하는 구조로 짜서 link를 별도의 모듈로 둘 수 없었음.
// 나중에 더 똑똑한 방법으로 수정하면 좋을 듯함.

let client;

// Error
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, extensions }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${JSON.stringify(networkError)}`);
      if (isNotAuthorizedNetworkError(networkError)) {
        // 잘못된 토큰인 경우 새로운 토큰 발급 받고 다시 시도함.
        const refresh = fromPromise(
          client.mutate({ mutation: REFRESH_ACCESS_TOKEN }).then(({ data }) => {
            return data;
          }),
        );
        return refresh
          .filter((result) => result)
          .flatMap(() => forward(operation));
      }
    }
  },
);

// http
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  credentials: 'include',
  headers: { 'X-EXAMPLE-Header': 'EXAMPLE' },
});

const composedHttpLink = from([httpLink]);

// websocket
export const websocketLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET_URL,
  options: {
    reconnect: true,
    lazy: true,
  },
});
websocketLink.subscriptionClient.on('connected', (payload) => {});

const composedWebSocketLink = from([websocketLink]);

// split
const splitedLink = split(
  (graphqlOperation) => {
    const { kind, operation } = getMainDefinition(graphqlOperation.query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  composedWebSocketLink,
  composedHttpLink,
);

// compose
const link = from([errorLink, splitedLink]);

// client
client = new ApolloClient({
  cache,
  link,
  name: 'react-web-client',
  version: process.env.VERSION,
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
