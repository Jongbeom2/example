import {gql} from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
    }
  }
`;

export const SIGNIN = gql`
  mutation signIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      _id
      nickname
      profileImageURL
      roomIdList
    }
  }
`;

export const SIGNIN_WITH_KAKAO = gql`
  mutation signInWithKakao($signInWithKakaoInput: SignInWithKakaoInput!) {
    signInWithKakao(signInWithKakaoInput: $signInWithKakaoInput) {
      _id
      nickname
      profileImageURL
      roomIdList
    }
  }
`;

export const SIGNIN_WITH_APPLE = gql`
  mutation signInWithApple($signInWithAppleInput: SignInWithAppleInput!) {
    signInWithApple(signInWithAppleInput: $signInWithAppleInput) {
      _id
      nickname
      profileImageURL
      roomIdList
    }
  }
`;

export const SIGNOUT = gql`
  mutation signOut($signOutInput: SignOutInput!) {
    signOut(signOutInput: $signOutInput) {
      _id
      nickname
      profileImageURL
      roomIdList
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
