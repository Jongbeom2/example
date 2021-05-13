import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($_id: ID!) {
    getUser(_id: $_id) {
      _id
      nickname
      profileImageURL
    }
  }
`;
