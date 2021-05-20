"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./cors"));
const router_1 = __importDefault(require("./router"));
// import cookieParser from 'cookie-parser';
const app = express_1.default().use(cors_1.default()).use(router_1.default());
// .use(cookieParser());
exports.default = app;
// console.log('Cookies: ', req.cookies); // Cookies that have not been signed
// console.log('Signed Cookies: ', req.signedCookies); // Cookies that have been signed
// <cookie options>
// secret : signing 암호. string/array 타입 가능
// signed : cookie 서명 필요
// maxAge : 만료 시간을 밀리초 단위로 설정
// expires : 만료 날짜를 GMT 시간으로 설정
// path : cookie의 경로 default "/"
// domain : 도메인 네임 default "loaded"
// secure : https에서만 cookie 사용 가능
// httpOnly : 웹서버를 통해서만 cookie 접근 가능
