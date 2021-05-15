import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
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
