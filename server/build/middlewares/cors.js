"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const ErrorObject_1 = require("../error/ErrorObject");
const allowedOrigins = ['https://example.jongbeom.com'];
const corsMiddleware = () => cors_1.default({
    origin: (origin, callback) => {
        if (process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else if (process.env.NODE_ENV === 'production') {
            if (!origin || (origin && allowedOrigins.includes(origin))) {
                callback(null, true);
            }
            else {
                console.error('origin:', colors_1.default.blue.bold(origin !== null && origin !== void 0 ? origin : ''));
                callback(ErrorObject_1.corsError);
                // ⛔ 배포 테스트 너무 불편해서 항상 cros에러 안나도록 설정하고 싶은 경우
                // callback(null, true);
            }
        }
        else {
            throw ErrorObject_1.environmentError;
        }
    },
    credentials: true,
});
exports.default = corsMiddleware;
