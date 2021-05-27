import {gql} from '@apollo/client';

export const GET_PRESIGNED_GET_URL = gql`
  query getPresignedGetURL($key: String!) {
    getPresignedGetURL(key: $key) {
      presignedURL
    }
  }
`;

export const GET_PRESIGNED_PUT_URL = gql`
  query getPresignedPutURL($key: String!) {
    getPresignedPutURL(key: $key) {
      presignedURL
    }
  }
`;
