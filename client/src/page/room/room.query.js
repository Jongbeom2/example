import { gql } from '@apollo/client';

export const GET_ROOM_LIST = gql`
  query getRoomList($userId: ID!) {
    getRoomList(userId: $userId) {
      _id
      name
      userNum
    }
  }
`;
