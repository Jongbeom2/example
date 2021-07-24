import {gql} from '@apollo/client';

export const GET_USER_LIST = gql`
  query getUserList($_id: ID!) {
    getUserList(_id: $_id) {
      _id
      nickname
      profileThumbnailImageURL
    }
  }
`;
