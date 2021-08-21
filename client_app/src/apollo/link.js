import {from, fromPromise, split} from '@apollo/client';
import {HttpLink} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {REACT_APP_GRAPHQL_API_URL, REACT_APP_GRAPHQL_WEBSOCKET_URL} from '@env';
import {onError} from '@apollo/client/link/error';
import {REFRESH_ACCESS_TOKEN} from 'src/page/auth/auth.query';
import client from './client';
import {isNotAuthorizedNetworkError} from 'src/lib/error';
// Error
const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      graphQLErrors.map(({message, locations, path, extensions}) => {
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
          client.mutate({mutation: REFRESH_ACCESS_TOKEN}).then(({data}) => {
            return data;
          }),
        );
        return refresh
          .filter(result => result)
          .flatMap(() => forward(operation));
      }
    }
  },
);

// http
const httpLink = new HttpLink({
  // uri: REACT_APP_GRAPHQL_API_URL,
  uri: 'http://localhost:4200/graphql',
  credentials: 'include',
  headers: {'X-EXAMPLE-Header': 'EXAMPLE'},
});

const composedHttpLink = from([httpLink]);

// websocket
export const websocketLink = new WebSocketLink({
  // uri: REACT_APP_GRAPHQL_WEBSOCKET_URL,
  uri: 'ws://localhost:4200/graphql',
  options: {
    reconnect: true,
    lazy: true,
  },
});
websocketLink.subscriptionClient.on('connected', payload => {});

const composedWebSocketLink = from([websocketLink]);

// split
const splitedLink = split(
  graphqlOperation => {
    const {kind, operation} = getMainDefinition(graphqlOperation.query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  composedWebSocketLink,
  composedHttpLink,
);

// compose
export const link = from([errorLink, splitedLink]);
