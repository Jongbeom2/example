"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlToJwt = exports.jwtToUrl = exports.toLocalMobile = exports.parseMobileNumber = exports.parseCookie = exports.decryptAES = exports.encryptAES = exports.comparePassword = exports.generatePasswordHash = exports.decodeJWT = exports.generateJWT = exports.extendToken = exports.isEmptyObject = void 0;
// import jwt from 'jsonwebtoken';
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt")); // 비밀번호 해싱용. hash generator.
// import sha256 from 'crypto-js/sha256'; // 토큰생성용.
// import rand from 'csprng'; // 토큰생성용.
// Cryptographically secure pseudorandom number generator. bits, radix 인풋.
exports.isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;
exports.extendToken = async (decoded) => {
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
 * @param {number} duration milli-seconds 단위
 * @returns {string} token
 * @description
 * JWT 토큰 생성
 */
exports.generateJWT = (payload, duration = 60 * 10) => {
    // https://www.npmjs.com/package/jsonwebtoken#usage
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        // , sub(제목), aud(대상자), exp(만료시간), nbf(토큰의 활성날짜), iat(발급된시간), jti()
        algorithm: 'HS256',
        expiresIn: duration,
    });
};
exports.decodeJWT = (token) => {
    if (token.startsWith('Bearer ')) {
        token = token.split('Bearer ').join('');
    }
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
exports.generatePasswordHash = async (password) => {
    const saltRounds = 10; // using blowfish making hashing slow to prevent timing attack
    return await bcrypt_1.default.hash(password, saltRounds);
};
exports.comparePassword = (password, passwordHash) => {
    return bcrypt_1.default.compareSync(password, passwordHash);
};
exports.encryptAES = (target) => {
    const key = process.env.AES_CIPHER;
    const cipher = crypto_1.default.createCipher('aes-256-cbc', key);
    let encryptedString = cipher.update(target, 'utf8', 'base64');
    encryptedString = encryptedString + cipher.final('base64');
    return encryptedString;
};
exports.decryptAES = (target) => {
    const key = process.env.AES_CIPHER;
    const decipher = crypto_1.default.createDecipher('aes-256-cbc', key);
    let decryptedString = decipher.update(target, 'base64', 'utf8');
    decryptedString = decryptedString + decipher.final('utf-8');
    return decryptedString;
};
exports.parseCookie = (cookieString) => cookieString.split('; ').reduce((acc, cur) => {
    let key = cur.split('=')[0];
    let value = cur.split('=')[1];
    acc[key] = value;
    return acc;
}, {});
exports.parseMobileNumber = (mobile) => mobile
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
exports.toLocalMobile = (locale, mobile) => {
    mobile = exports.parseMobileNumber(mobile);
    if (locale === 'US') {
        // throw new Error();
        return '+1' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
    }
    else if (locale === 'JP') {
        return '+81' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
    }
    else if (locale === 'KR') {
        return '+82' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
    }
    else if (locale === 'CN') {
        return '+83' + (mobile.startsWith('0') ? mobile.substr(1) : mobile);
    }
    else {
        throw new Error();
    }
};
exports.jwtToUrl = (jwt) => encodeURIComponent(exports.encryptAES(jwt));
exports.urlToJwt = (url) => exports.decryptAES(decodeURIComponent(url));
