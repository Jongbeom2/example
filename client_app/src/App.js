import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from 'src/apollo/client';
import Main from './Main';
const App = ({ ...rest }) => {
  return (
    <ApolloProvider client={client}>
      <Main {...rest} />
    </ApolloProvider>
  );
};
// 커밋 테스트
export default App;
