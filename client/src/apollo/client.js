import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
} from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
import { cache } from 'src/apollo/cache';
// import { currentUserVar } from 'src/apollo/cache';
import { GRAPHQL_API_URL } from 'src/config';
import { createUploadLink } from 'apollo-upload-client';
import cookie from 'js-cookie';
// // Authenticate using HTTP header
// const contextSetter = (_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const { token } = currentUserVar();
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? token : '',
//     },
//   };
// };

// <credentials>
// omit: 절대로 cookie 들을 전송하거나 받지 않는다.
// same-origin: URL이 호출 script 와 동일 출처(same origin)에 있다면, user credentials (cookies, basic http auth 등..)을 전송한다. 이것은 default 값이다.
// include: cross-origin 호출이라 할지라도 언제나 user credentials (cookies, basic http auth 등..)을 전송한다.

const httpLinkOptions = {
  uri: GRAPHQL_API_URL,
  credentials: 'include',
  // uri: '/',
  // credentials: 'include', // 'omit','same-origin','include',
};

// const link = setContext(contextSetter).concat(createHttpLink(httpLinkOptions));

// const link = createHttpLink(httpLinkOptions);
const link = createUploadLink({
  uri: GRAPHQL_API_URL,
  credentials: 'include',
});

//콜 하기전에 쿠키 검사해서 login 안돼있음 로컬 스토리지 비움.
const authMiddleware = new ApolloLink((operation, forward) => {
  console.log('Im the authMiddleWare 1');
  if (!cookie.get().isLoggedIn) {
    localStorage.removeItem('loginResponse');
    localStorage.removeItem('isLoggedIn');
  }
  return forward(operation);
});

// ApolloClient is an encapsulation of ApolloLink, ApolloCache... instances
const client = new ApolloClient({
  // Provide required constructor fields
  cache,
  link: link, //concat(authMiddleware, link), //logoutLink.concat(link),
  headers: {
    authorization: localStorage.getItem('token'),
  },
  // Provide some optional constructor fields
  name: 'react-web-client',
  version: process.env.VERSION || '0.0.1',
  queryDeduplication: false,
  defaultOptions: {
    // <useQuery> hook uses watchQuery function
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
