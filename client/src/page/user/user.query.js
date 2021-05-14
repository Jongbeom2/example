import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($_id: ID!) {
    getUser(_id: $_id) {
      _id
      nickname
      profileImageURL
      profileThumbnailImageURL
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      _id
    }
  }
`;
