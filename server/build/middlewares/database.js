"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseClient = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const ErrorObject_1 = require("../error/ErrorObject");
mongoose_1.default.set('debug', true);
mongoose_1.default.connection
    .once('open', () => {
    var _a;
    console.log(`✔ MongoDB ready at ${colors_1.default.blue.bold((_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : '')}`);
})
    .on('connected', () => {
    console.log('✔ MongoDB Connection Established');
})
    .on('reconnected', () => {
    console.log('✔ MongoDB Connection Reestablished');
})
    .on('disconnected', () => {
    console.log('✔ MongoDB Connection Disconnected');
})
    .on('close', () => {
    console.log('✔ MongoDB Connection Closed');
})
    .on('error', (error) => {
    console.log('✔ MongoDB Connection Failed');
    console.error(error);
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
