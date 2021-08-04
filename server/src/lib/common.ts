import * as jwt from 'jsonwebtoken';

/**
 * JWT 토큰 생성
 * @param {object} payload JWT 표준을 따름
 * @param {number} duration seconds 단위
 * @returns {string} token
 * @description
 * JWT 토큰 생성
 */

type GenerateJWTFunction = (payload: object, duration: number) => string;

export const generateJWT: GenerateJWTFunction = (payload: object, duration: number): string => {
  // https://www.npmjs.com/package/jsonwebtoken#usage
  return jwt.sign(payload, process.env.JWT_SECRET_KEY || '', {
    // , sub(제목), aud(대상자), exp(만료시간), nbf(토큰의 활성날짜), iat(발급된시간), jti()
    algorithm: 'HS256', // HMAC-SHA256
    expiresIn: duration,
    // notBefore
    // audience:'', // aud:대상자
    // 0issuer:'', // iss:발급자
    // jwtid:'', // JWT 고유식별자, 일회용 토큰에 사용
    // subject:'', // 제목
    // noTimestamp:'',
    // header:'',
    // keyid,
  });
};

type DecodeJWTFunction = (token: string) => DecodedJWT;

export interface DecodedJWT {
  refreshToken?: boolean;
  accessToken?: boolean;
}

export const decodeJWT: DecodeJWTFunction = (token) => {
  if (token.startsWith('Bearer ')) {
    token = token.split('Bearer ').join('');
  }
  // jwt.verify의 return type을 설정하는 방법이 없음
  return jwt.verify(token, process.env.JWT_SECRET_KEY || '') as DecodedJWT;
};

type ParseCookieFunction = (cookieString: string) => CookieType;

interface CookieType {
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const parseCookie: ParseCookieFunction = (cookieString) =>
  cookieString.split('; ').reduce<CookieType>((acc, cur) => {
    let key = cur.split('=')[0];
    let value = cur.split('=')[1];
    acc[key] = value;
    return acc;
  }, {});
