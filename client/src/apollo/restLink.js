import { RestLink } from 'apollo-link-rest';

// ⚠️ This library is under active development ⚠️
// https://www.npmjs.com/package/apollo-link-rest
// Must install peer dependencies not contained
// `yarn add apollo-link-rest apollo-link graphql graphql-anywhere qs`

export const restLink = new RestLink({
  uri: 'http://localhost:4200', // default one
  endpoints: {
    v1: 'http://localhost:4200',
    v2: 'http://localhost:4200',
    v3: 'http://localhost:4200',
  },
});
