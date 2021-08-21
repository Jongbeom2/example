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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookie = exports.decodeJWT = exports.generateJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
exports.generateJWT = (payload, duration) => {
    // https://www.npmjs.com/package/jsonwebtoken#usage
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || '', {
        // , sub(제목), aud(대상자), exp(만료시간), nbf(토큰의 활성날짜), iat(발급된시간), jti()
        algorithm: 'HS256',
        expiresIn: duration,
    });
};
exports.decodeJWT = (token) => {
    if (token.startsWith('Bearer ')) {
        token = token.split('Bearer ').join('');
    }
    // jwt.verify의 return type을 설정하는 방법이 없음
    return jwt.verify(token, process.env.JWT_SECRET_KEY || '');
};
exports.parseCookie = (cookieString) => cookieString.split('; ').reduce((acc, cur) => {
    let key = cur.split('=')[0];
    let value = cur.split('=')[1];
    acc[key] = value;
    return acc;
}, {});
