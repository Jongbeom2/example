import { gql } from '@apollo/client';

export const GET_USER_LIST = gql`
  query getUserList($userId: ID!) {
    getUserList(userId: $userId) {
      _id
      nickname
      profileThumbnailImageURL
    }
  }
`;
