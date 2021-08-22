import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
    }
  }
`;

export const SINGIN = gql`
  mutation signIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      _id
      nickname
      profileImageURL
    }
  }
`;

export const SIGNIN_WITH_KAKAO = gql`
  mutation signInWithKakao($signInWithKakaoInput: SignInWithKakaoInput!) {
    signInWithKakao(signInWithKakaoInput: $signInWithKakaoInput) {
      _id
      nickname
      profileImageURL
    }
  }
`;

export const SIGNOUT = gql`
  mutation signOut($signOutInput: SignOutInput!) {
    signOut(signOutInput: $signOutInput) {
      _id
      nickname
      profileImageURL
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation refreshAccessToken {
    refreshAccessToken {
      _id
    }
  }
`;
