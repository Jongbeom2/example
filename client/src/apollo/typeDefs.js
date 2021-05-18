import { gql } from '@apollo/client';

const typeDefs = gql`
  #   extend type Launch {
  #     isInCart: Boolean!
  #   }
  extend type Query {
    # isLoggedIn: Boolean!
    cartItems: [Launch]!
  }
  #   extend type Mutation {
  #     addOrRemoveFromCart(id: ID!): [Launch]
  #   }
`;

export default typeDefs;
