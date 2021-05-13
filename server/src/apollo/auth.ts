import { generateJWT, decodeJWT, parseCookie } from 'src/lib/common';
import { gql } from 'apollo-server-express';
import colors from 'colors';
import { environmentError } from 'src/error/ErrorObject';

const decodeCookieToken = (cookieString: any) => {
  let decoded: any;
  let errorFields: string[] = [];
  try {
    const cookieObject = parseCookie(cookieString);
    const { accessToken } = cookieObject;

    if (accessToken) {
      decoded = decodeJWT(accessToken);
      //   console.info('## my', { ...decoded.my });
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
  // console.info('## graphql query object', queryObj);

  // To ignore playground introspection polling
  if (queryName !== '__schema') {
    console.info(`## query: ${colors.blue.bold(queryName)}`);
  }

  const queryWhiteList = ['createUser'];
  if (queryWhiteList.includes(queryName)) {
    return {};
  }

  // Access token verification
  const { decoded, errorFields } = decodeCookieToken(req.headers.cookie);
  errorFields.forEach((field) => res.clearCookie(field));

  // If unauthorized request, then throw error
  if (!decoded?.my) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Not Authorized');
    } else if (process.env.NODE_ENV === 'development') {
      // throw new Error('Not Authorized');
    } else {
      throw environmentError;
    }
    return {};
  }

  //   // Re-issue token if token will be expired soon.
  //   const now = Math.floor(Date.now() / 1000);
  //   const REFRESH_TIME_LIMIT = 5 * 60;
  //   const timeLeft = decoded.exp - now;
  //   //   console.info(now);
  //   //   console.info(decoded.exp);
  //   //   console.info(decoded.iat);
  //   //   console.info(timeLeft);
  //   if (decoded?.exp && timeLeft < REFRESH_TIME_LIMIT) {
  //     const accessToken = generateJWT({ my: decoded.my });
  //     res.cookie('accessToken', accessToken, { httpOnly: true });
  //   }

  return decoded.my;
};