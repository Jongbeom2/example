import { decodeJWT, parseCookie } from 'src/lib/common';
import { gql } from 'apollo-server-express';
import { environmentError, notAuthorizedError } from 'src/error/ErrorObject';
import { logger } from 'src/middlewares/winston';
import express from 'express';

type DecodeCookieTokenFunction = (cookieString: string) => any;

const decodeCookieToken: DecodeCookieTokenFunction = (cookieString) => {
  let decodedAccessToken;
  let decodedRefreshToken;
  const { accessToken, refreshToken } = parseCookie(cookieString);
  try {
    if (accessToken) {
      decodedAccessToken = decodeJWT(accessToken);
    }
  } catch (err) {
    throw new Error(err);
  }
  try {
    if (refreshToken) {
      decodedRefreshToken = decodeJWT(refreshToken);
    }
  } catch (err) {
    throw new Error(err);
  }
  return { decodedAccessToken, decodedRefreshToken };
};

type AuthFunction = (req: any, res: any) => { isRefreshTokenValid: boolean; refreshToken: string };

export const auth: AuthFunction = (req, res) => {
  /**
   * case 1: 로그인 요청 쿼리일때
   * query name으로 로그인 요청 쿼리 구분
   * 로그인 요청 쿼리인 경우 컨텍스트 통과
   * 로그인 성공시 login resolver에서 res.cookie 이용해서 쿠키 세팅
   *
   * case 2: 로그인 요청 쿼리가 아닐때
   * 로그인 요청 쿼리가 아닌 경우 req.header.cookie 값으로 사용자 인증
   * 권한이 없을 경우 권한 에러 발생
   * 권한이 있는 경우 통과
   */
  const gqlObject = gql`
    ${req.body.query}
  `;
  const queryObj: any = gqlObject.definitions[0];
  const queryName: string = queryObj.selectionSet.selections[0].name.value;

  // To ignore playground introspection polling
  if (queryName !== '__schema') {
    logger.info(`## query: ${queryName}`);
  }

  // token verification
  const { decodedAccessToken, decodedRefreshToken } = decodeCookieToken(req.headers.cookie || '');

  // If unauthorized request, then throw error
  const queryWhiteList = [
    'createUser',
    'signIn',
    'signInWithKakao',
    'signInWithApple',
    'signOut',
    'refreshAccessToken',
    'getNow',
  ];
  if (!queryWhiteList.includes(queryName)) {
    if (!decodedAccessToken) {
      if (process.env.NODE_ENV === 'production') {
        throw notAuthorizedError;
      } else if (process.env.NODE_ENV === 'development') {
        throw notAuthorizedError;
      } else {
        throw environmentError;
      }
    }
  }

  return {
    isRefreshTokenValid: decodedRefreshToken?.refreshToken || false,
    refreshToken: parseCookie(req.headers.cookie || '').refreshToken || '',
  };
};

type AuthSocketFunction = (
  headers: any,
  query: any,
) => { isRefreshTokenValid: boolean; refreshToken: string };

export const authSocket: AuthSocketFunction = (headers, query) => {
  const gqlObject = gql`
    ${query}
  `;
  const queryObj: any = gqlObject.definitions[0];
  const queryName: string = queryObj.selectionSet.selections[0].name.value;

  // To ignore playground introspection polling
  if (queryName !== '__schema') {
    logger.info(`## subscription: ${queryName}`);
  }

  const { decodedAccessToken, decodedRefreshToken } = decodeCookieToken(headers.cookie || '');

  // If unauthorized request, then throw error
  const queryWhiteList = [''];
  if (!queryWhiteList.includes(queryName)) {
    if (!decodedAccessToken) {
      if (process.env.NODE_ENV === 'production') {
        throw notAuthorizedError;
      } else if (process.env.NODE_ENV === 'development') {
        throw notAuthorizedError;
      } else {
        throw environmentError;
      }
    }
  }

  return {
    isRefreshTokenValid: decodedRefreshToken?.refreshToken || false,
    refreshToken: parseCookie(headers.cookie || '').refreshToken || '',
  };
};
