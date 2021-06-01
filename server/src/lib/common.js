// import jwt from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt'; // 비밀번호 해싱용. hash generator.
// import sha256 from 'crypto-js/sha256'; // 토큰생성용.
// import rand from 'csprng'; // 토큰생성용.
// Cryptographically secure pseudorandom number generator. bits, radix 인풋.

export const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

export const extendToken = async (decoded) => {
  // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
  if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
    // 하루가 지나면 갱신해준다.
    // const freshToken = await generateJWT(decoded, 60 * 60 * 1000);
    // ctx.cookies.set('access_token', freshToken, {
    //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
    //     httpOnly: true,
    // });
    // ctx.request.user 에 디코딩된 값을 넣어줍니다
  }
};

/**
 * JWT 토큰 생성
 * @param {object} payload JWT 표준을 따름
 * @param {number} duration seconds 단위
 * @returns {string} token
 * @description
 * JWT 토큰 생성
 */
export const generateJWT = (payload, duration = 60 * 10) => {
  // https://www.npmjs.com/package/jsonwebtoken#usage
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
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
export const decodeJWT = (token) => {
  if (token.startsWith('Bearer ')) {
    token = token.split('Bearer ').join('');
  }
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const generatePasswordHash = async (password) => {
  const saltRounds = 10; // using blowfish making hashing slow to prevent timing attack
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};

export const encryptAES = (target) => {
  const key = process.env.AES_CIPHER;
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encryptedString = cipher.update(target, 'utf8', 'base64');
  encryptedString = encryptedString + cipher.final('base64');
  return encryptedString;
};
export const decryptAES = (target) => {
  const key = process.env.AES_CIPHER;
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decryptedString = decipher.update(target, 'base64', 'utf8');
  decryptedString = decryptedString + decipher.final('utf-8');
  return decryptedString;
};

export const parseCookie = (cookieString) =>
  cookieString.split('; ').reduce((acc, cur) => {
    let key = cur.split('=')[0];
    let value = cur.split('=')[1];
    acc[key] = value;
    return acc;
  }, {});

export const parseMobileNumber = (mobile) =>
  mobile
    .split('-')
    .join('')
    .split('.')
    .join('')
    .split(' ')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('');

export const toLocalMobile = (locale, mobile) => {
  mobile = parseMobileNumber(mobile);
  if (locale === 'US') {
    // throw new Error();
    return '+1' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
  } else if (locale === 'JP') {
    return '+81' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
  } else if (locale === 'KR') {
    return '+82' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
  } else if (locale === 'CN') {
    return '+83' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
  } else {
    throw new Error();
  }
};

export const jwtToUrl = (jwt) => encodeURIComponent(encryptAES(jwt));
export const urlToJwt = (url) => decryptAES(decodeURIComponent(url));
