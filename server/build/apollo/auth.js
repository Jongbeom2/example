"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = exports.auth = void 0;
const common_1 = require("../lib/common");
const apollo_server_express_1 = require("apollo-server-express");
const ErrorObject_1 = require("../error/ErrorObject");
const winston_1 = require("../middlewares/winston");
const decodeCookieToken = (cookieString) => {
    let decodedAccessToken;
    let decodedRefreshToken;
    const { accessToken, refreshToken } = common_1.parseCookie(cookieString);
    try {
        if (accessToken) {
            decodedAccessToken = common_1.decodeJWT(accessToken);
        }
    }
    catch (err) {
        throw new Error(err);
    }
    try {
        if (refreshToken) {
            decodedRefreshToken = common_1.decodeJWT(refreshToken);
        }
    }
    catch (err) {
        throw new Error(err);
    }
    return { decodedAccessToken, decodedRefreshToken };
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
        winston_1.logger.info(`## query: ${queryName}`);
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
                throw ErrorObject_1.notAuthorizedError;
            }
            else if (process.env.NODE_ENV === 'development') {
                // throw notAuthorizedError;
            }
            else {
                throw ErrorObject_1.environmentError;
            }
        }
    }
    const isRefreshTokenValid = Boolean(decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.userId);
    return {
        userId: isRefreshTokenValid ? decodedRefreshToken.userId : '',
        refreshToken: isRefreshTokenValid
            ? common_1.parseCookie(req.headers.cookie || '').refreshToken || ''
            : '',
    };
};
exports.authSocket = (headers, query) => {
    const gqlObject = apollo_server_express_1.gql `
    ${query}
  `;
    const queryObj = gqlObject.definitions[0];
    const queryName = queryObj.selectionSet.selections[0].name.value;
    // To ignore playground introspection polling
    if (queryName !== '__schema') {
        winston_1.logger.info(`## subscription: ${queryName}`);
    }
    const { decodedAccessToken, decodedRefreshToken } = decodeCookieToken(headers.cookie || '');
    // If unauthorized request, then throw error
    const queryWhiteList = [''];
    if (!queryWhiteList.includes(queryName)) {
        if (!decodedAccessToken) {
            if (process.env.NODE_ENV === 'production') {
                throw ErrorObject_1.notAuthorizedError;
            }
            else if (process.env.NODE_ENV === 'development') {
                // throw notAuthorizedError;
            }
            else {
                throw ErrorObject_1.environmentError;
            }
        }
    }
    const isRefreshTokenValid = Boolean(decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.userId);
    return {
        userId: isRefreshTokenValid ? decodedRefreshToken.userId : '',
        refreshToken: isRefreshTokenValid ? common_1.parseCookie(headers.cookie || '').refreshToken || '' : '',
    };
};
