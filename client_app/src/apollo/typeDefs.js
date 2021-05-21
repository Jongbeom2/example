import {gql} from '@apollo/client';

const typeDefs = gql`
  extend type Query {
    cartItems: [Launch]!
  }
`;

export default typeDefs;
