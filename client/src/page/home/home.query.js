import { gql } from '@apollo/client';

export const GET_FRIEND_LIST = gql`
  query getFriendList($userId: ID!) {
    getFriendList(userId: $userId) {
      nickname
      roomId
    }
  }
`;
