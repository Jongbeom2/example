"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const database_1 = require("./middlewares/database");
const server_1 = require("./apollo/server");
const ErrorObject_1 = require("./error/ErrorObject");
const firebase_1 = require("./middlewares/firebase");
const winston_1 = require("./middlewares/winston");
process.stdout.write('\x1Bc');
winston_1.logger.info(`Server Start`);
winston_1.logger.info(`✔ Root directory is ${app_root_path_1.default.path}`);
winston_1.logger.info(`✔ Environment: ${process.env.NODE_ENV}`);
// production mode에서는 데이터 베이스를 연결하고 서버를 실행함.
// develoption mode에서는 동시에 데이터 베이스를 연결하고 서버를 실행함.
// 원래는 production mode처럼 하는게 맞는데, 개발 시 리로드 시간을 줄이기 위함.
if (process.env.NODE_ENV === 'production') {
    (async () => {
        await database_1.connectDatabase();
        firebase_1.initFirebase();
        server_1.startServer();
    })();
}
else if (process.env.NODE_ENV === 'development') {
    database_1.connectDatabase();
    firebase_1.initFirebase();
    server_1.startServer();
}
else {
    throw ErrorObject_1.environmentError;
}
