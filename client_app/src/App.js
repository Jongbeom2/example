import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from 'src/apollo/client';
import Main from './Main';
import {
  REACT_APP_GRAPHQL_API_URL,
  REACT_APP_GRAPHQL_WEBSOCKET_URL,
  REACT_APP_STORAGE_URL,
  REACT_APP_STORAGE_RESIZED_URL,
} from '@env';
console.log('REACT_APP_GRAPHQL_API_URL: ', REACT_APP_GRAPHQL_API_URL);
console.log(
  'REACT_APP_GRAPHQL_WEBSOCKET_URL: ',
  REACT_APP_GRAPHQL_WEBSOCKET_URL,
);
console.log('REACT_APP_STORAGE_URL', REACT_APP_STORAGE_URL);
console.log('REACT_APP_STORAGE_RESIZED_URL', REACT_APP_STORAGE_RESIZED_URL);

const App = ({...rest}) => {
  return (
    <ApolloProvider client={client}>
      <Main {...rest} />
    </ApolloProvider>
  );
};
export default App;
