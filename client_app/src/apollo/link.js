import {from, split} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

const ENABLE_SUBSCRIPTION = true;
const headersForAllRequests = {'X-EXAMPLE-Header': 'EXAMPLE'};

const terminatingLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  credentials: 'include',
  headers: headersForAllRequests,
});

const composedHttpLink = from([terminatingLink]);

const websocketLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET_URL,
  options: {
    reconnect: true,
    lazy: true,
  },
});

const composedWebSocketLink = from([websocketLink]);
export let link;

if (!ENABLE_SUBSCRIPTION) {
  link = composedHttpLink;
} else {
  websocketLink.subscriptionClient.on('connected', payload => {});

  link = split(
    graphqlOperation => {
      const {kind, operation} = getMainDefinition(graphqlOperation.query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    composedWebSocketLink,
    composedHttpLink,
  );
}
