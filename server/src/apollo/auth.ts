import { decodeJWT, parseCookie } from 'src/lib/common';
import { gql } from 'apollo-server-express';
import { environmentError, notAuthorizedError } from 'src/error/ErrorObject';
import { logger } from 'src/middlewares/winston';
const decodeCookieToken = (cookieString: any) => {
  let decoded: any;
  let errorFields: string[] = [];
  try {
    const cookieObject = parseCookie(cookieString);
    const { accessToken } = cookieObject;

    if (accessToken) {
      decoded = decodeJWT(accessToken);
    }
  } catch (err) {
    // If token value is manipulated or counterfeited, then cookie will be deleted
    errorFields = ['accessToken'];
  }
  return { decoded, errorFields };
};

export const auth = (req: any, res: any) => {
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

  const queryWhiteList = [
    'createUser',
    'signIn',
    'signInWithKakao',
    'signInWithApple',
    'signOut',
    'getNow',
  ];

  if (queryWhiteList.includes(queryName)) {
    return {};
  }

  // Access token verification
  const { decoded, errorFields } = decodeCookieToken(req.headers.cookie);
  errorFields.forEach((field) => res.clearCookie(field));

  // If unauthorized request, then throw error
  if (!decoded?.my) {
    if (process.env.NODE_ENV === 'production') {
      throw notAuthorizedError;
    } else if (process.env.NODE_ENV === 'development') {
      throw notAuthorizedError;
    } else {
      throw environmentError;
    }
    return {};
  }

  return decoded.my;
};

export const authSocket = (headers: any, query: any) => {
  const gqlObject = gql`
    ${query}
  `;
  const queryObj: any = gqlObject.definitions[0];
  const queryName: string = queryObj.selectionSet.selections[0].name.value;

  // To ignore playground introspection polling
  if (queryName !== '__schema') {
    logger.info(`## subscription: ${queryName}`);
  }

  const queryWhiteList = [''];
  if (queryWhiteList.includes(queryName)) {
    return {};
  }

  const { decoded, errorFields } = decodeCookieToken(headers.cookie);

  // If unauthorized request, then throw error
  if (!decoded?.my) {
    if (process.env.NODE_ENV === 'production') {
      throw notAuthorizedError;
    } else if (process.env.NODE_ENV === 'development') {
      throw notAuthorizedError;
    } else {
      throw environmentError;
    }
    return {};
  }

  return decoded.my;
};
