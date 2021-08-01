"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseClient = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorObject_1 = require("../error/ErrorObject");
const winston_1 = require("./winston");
mongoose_1.default.set('debug', true);
mongoose_1.default.connection
    .once('open', () => {
    var _a;
    winston_1.logger.info(`✔ MongoDB ready at ${(_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : ''}`);
})
    .on('connected', () => {
    winston_1.logger.info('✔ MongoDB Connection Established');
})
    .on('reconnected', () => {
    winston_1.logger.info('✔ MongoDB Connection Reestablished');
})
    .on('disconnected', () => {
    winston_1.logger.info('✔ MongoDB Connection Disconnected');
})
    .on('close', () => {
    winston_1.logger.info('✔ MongoDB Connection Closed');
})
    .on('error', (error) => {
    winston_1.logger.info('✔ MongoDB Connection Failed');
    winston_1.logger.error(error);
});
let _db; // database client
exports.connectDatabase = async () => {
    if (!process.env.MONGO_URL) {
        throw ErrorObject_1.environmentError;
    }
    const mongooseObject = await mongoose_1.default.connect(process.env.MONGO_URL || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
    _db = mongooseObject;
    return mongooseObject;
};
exports.getDatabaseClient = () => _db;
