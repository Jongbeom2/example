"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const database_1 = require("./middlewares/database");
const server_1 = require("./apollo/server");
const ErrorObject_1 = require("./error/ErrorObject");
process.stdout.write('\x1Bc');
console.clear();
console.info(`\n\n\n`);
console.info(`✔ Root directory is ${chalk_1.default.blue.bold(app_root_path_1.default.path)}`);
console.info(`✔ Environment: ${chalk_1.default.blue.bold(process.env.NODE_ENV)}`);
// production mode에서는 데이터 베이스를 연결하고 서버를 실행함.
// develoption mode에서는 동시에 데이터 베이스를 연결하고 서버를 실행함.
// 원래는 production mode처럼 하는게 맞는데, 개발 시 리로드 시간을 줄이기 위함.
if (process.env.NODE_ENV === 'production') {
    database_1.connectDatabase().then(server_1.startServer);
}
else if (process.env.NODE_ENV === 'development') {
    server_1.startServer();
    database_1.connectDatabase();
}
else {
    throw ErrorObject_1.environmentError;
}
