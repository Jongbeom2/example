"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = exports.auth = void 0;
const common_1 = require("../lib/common");
const apollo_server_express_1 = require("apollo-server-express");
const colors_1 = __importDefault(require("colors"));
const ErrorObject_1 = require("../error/ErrorObject");
const decodeCookieToken = (cookieString) => {
    let decoded;
    let errorFields = [];
    try {
        const cookieObject = common_1.parseCookie(cookieString);
        const { accessToken } = cookieObject;
        if (accessToken) {
            decoded = common_1.decodeJWT(accessToken);
            //   console.info('## my', { ...decoded.my });
        }
    }
    catch (err) {
        // If token value is manipulated or counterfeited, then cookie will be deleted
        errorFields = ['accessToken'];
    }
    return { decoded, errorFields };
};
exports.auth = (req, res) => {
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
    const gqlObject = apollo_server_express_1.gql `
    ${req.body.query}
  `;
    const queryObj = gqlObject.definitions[0];
    const queryName = queryObj.selectionSet.selections[0].name.value;
    // To ignore playground introspection polling
    if (queryName !== '__schema') {
        console.info(`## query: ${colors_1.default.blue.bold(queryName)}`);
    }
    const queryWhiteList = ['createUser', 'signIn', 'signInWithKakao', 'signOut'];
    // Test
    // queryWhiteList.push('getChatList');
    if (queryWhiteList.includes(queryName)) {
        return {};
    }
    // Access token verification
    const { decoded, errorFields } = decodeCookieToken(req.headers.cookie);
    errorFields.forEach((field) => res.clearCookie(field));
    // If unauthorized request, then throw error
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.my)) {
        if (process.env.NODE_ENV === 'production') {
            throw ErrorObject_1.notAuthorizedError;
        }
        else if (process.env.NODE_ENV === 'development') {
            // throw notAuthorizedError;
        }
        else {
            throw ErrorObject_1.environmentError;
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
exports.authSocket = (headers, query) => {
    const gqlObject = apollo_server_express_1.gql `
    ${query}
  `;
    const queryObj = gqlObject.definitions[0];
    const queryName = queryObj.selectionSet.selections[0].name.value;
    // To ignore playground introspection polling
    if (queryName !== '__schema') {
        console.info(`## query: ${colors_1.default.blue.bold(queryName)}`);
    }
    const queryWhiteList = [''];
    if (queryWhiteList.includes(queryName)) {
        return {};
    }
    const { decoded, errorFields } = decodeCookieToken(headers.cookie);
    // If unauthorized request, then throw error
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.my)) {
        if (process.env.NODE_ENV === 'production') {
            throw ErrorObject_1.notAuthorizedError;
        }
        else if (process.env.NODE_ENV === 'development') {
            // throw notAuthorizedError;
        }
        else {
            throw ErrorObject_1.environmentError;
        }
        return {};
    }
    return decoded.my;
};
