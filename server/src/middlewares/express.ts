import express from 'express';
import corsMiddleware from 'src/middlewares/cors';
import routerMiddleware from 'src/middlewares/router';
// import cookieParser from 'cookie-parser';

const app = express().use(corsMiddleware()).use(routerMiddleware());
// .use(cookieParser());
export default app;

// <cookie options>
// secret : signing 암호. string/array 타입 가능
// signed : cookie 서명 필요
// maxAge : 만료 시간을 밀리초 단위로 설정
// expires : 만료 날짜를 GMT 시간으로 설정
// path : cookie의 경로 default "/"
// domain : 도메인 네임 default "loaded"
// secure : https에서만 cookie 사용 가능
// httpOnly : 웹서버를 통해서만 cookie 접근 가능
