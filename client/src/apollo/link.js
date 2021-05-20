// https://www.apollographql.com/docs/react/api/link/introduction/
// If your application only needs to send conventional HTTP-based requests to a GraphQL server, you probably don't need to use the Apollo Link API

import { from, split, ApolloLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';

const ENABLE_SUBSCRIPTION = true;
const headersForAllRequests = { 'X-IDC-Header': 'IDC' };

const errorLink = onError((context) => {
  // https://www.apollographql.com/docs/react/api/link/apollo-link-error/
  const { graphQLErrors, networkError, forward, operation, response } = context;
  // Ignore certain operations
  const operationNameListErrorIgnored = [
    'getItemQuery1',
    'getItemQuery2',
    'getItemQuery3',
    'getItemQuery4',
    'getItemQuery5',
  ];

  if (operationNameListErrorIgnored.includes(operation.operationName)) {
    response.errors = null;
  }

  if (graphQLErrors) {
    console.error(graphQLErrors);
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    if (networkError.statusCode === 401) {
      // do something
    } else if (networkError.statusCode === 402) {
      // do something
    } else if (networkError.statusCode === 403) {
      // do something
    } else if (networkError.statusCode === 404) {
      // do something
    }
  }
  return forward(operation);
});

const customLink = new ApolloLink((operation, forward) => {
  console.info('customLink');
  return forward(operation);
});

const authLink = new ApolloLink((operation, forward) => {
  // Add the authorization to the headers
  operation.setContext((request, previousContext) => {
    const { headers = {} } = request;
    const token = null;
    return { headers: { ...headers, authorization: token } };
  });

  return forward(operation);
});

const activityLink = new ApolloLink((operation, forward) => {
  // Add the recent-activity custom header to the headers
  operation.setContext((request, previousContext) => {
    const { headers = {} } = request;
    const recentActivity = localStorage.getItem('lastOnlineTime') ?? null;
    return {
      headers: {
        ...headers,
        'X-IDC-RECENT-ACTIVITY': recentActivity,
      },
    };
  });

  return forward(operation);
});

// 💥 Do not use "new HttpLink()" to upload file on graphql
const terminatingLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  credentials: 'include',
  // 1. credentials option
  // same-origin(default): If api caller and callee have same url (same origin), then User Credentials will send (cookies, basic http auth etc)
  // omit: Never send nor take User Credentials
  // include: Always send User Credentials (cookies, basic http auth 등..) even if cross-origin request
  // 2. authentication
  // https://www.apollographql.com/docs/react/networking/authentication/
  // Authentication by using authorization in req/res header or using cookie

  headers: headersForAllRequests,
});

// 💥 The sooner link, the ealier executes
const composedHttpLink = from([
  // errorLink, // 💥 Where is the right place of error link?
  // customLink,
  // authLink,
  // activityLink,
  // restLink,
  terminatingLink, // 💥 Must be at the lastest because UploadLink is terminating link
]);

const websocketLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET_URL,
  options: {
    // https://github.com/apollographql/subscriptions-transport-ws#constructorurl-options-websocketimpl
    reconnect: true,
    // timeout: 60 * 60 * 1000 - 1,
    // reconnectionAttempts: 9999,
    lazy: true,
    // connectionCallback: (error, result) => {},
    // connectionParams: {},
    // wsOptionArguments: {}
  },
});

const composedWebSocketLink = from([
  // errorLink, // 💥 Where is the right place of error link?
  // customLink,
  // authLink,
  // activityLink,
  websocketLink,
]);
export let link;

// 어플리케이션이 graphql subscription을 사용하지 않는다면 항상 composeHttpLink 사용함.
// graphql subscription을 사용한다면 operation에 따라 서로 다른 link를 사용함.
// operation이 subscription이 아니면 composeHttpLink 사용하고, 맞으면 websocketLink 사용함.
if (!ENABLE_SUBSCRIPTION) {
  link = composedHttpLink;
} else {
  websocketLink.subscriptionClient.on('connected', (payload) => {
    // console.info('## websocket connected', payload);
  });

  // console.info('## websocket client', websocketLink.subscriptionClient);

  link = split(
    // https://www.apollographql.com/docs/react/api/link/introduction/#composing-a-link-chain
    // The split function takes three parameters:
    // 1. A function that's called for each operation to execute
    // 2. The Link to use for an operation if the function returns a "truthy" value
    // 3. The Link to use for an operation if the function returns a "falsy" value
    (graphqlOperation) => {
      // console.info('## split link');
      const { kind, operation } = getMainDefinition(graphqlOperation.query);
      // console.info(graphqlOperation.getContext());
      // console.info(kind, operation);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    composedWebSocketLink,
    composedHttpLink,
  );
}
