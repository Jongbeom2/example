import { RestLink } from 'apollo-link-rest';

// ⚠️ This library is under active development ⚠️
// https://www.npmjs.com/package/apollo-link-rest
// Must install peer dependencies not contained
// `yarn add apollo-link-rest apollo-link graphql graphql-anywhere qs`

export const restLink = new RestLink({
  uri: process.env.REACT_APP_REST_API_BASE_URL, // default one
  endpoints: {
    v1: process.env.REACT_APP_REST_API_BASE_URL,
    v2: process.env.REACT_APP_REST_API_BASE_URL,
    v3: process.env.REACT_APP_REST_API_BASE_URL,
  },
});
