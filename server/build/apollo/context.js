"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const auth_1 = require("./auth");
const ErrorObject_1 = require("../error/ErrorObject");
const Room_model_1 = __importDefault(require("../models/Room.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const dataLoader_1 = require("./dataLoader");
// keyMap: 하나의 queryField에 대해서
// output이 하나 나온다면 keyMapOneToOne,
// 여러개 나온다면 keyMapOneToMany
const loaders = {
    user: {
        byId: dataLoader_1.Loader({
            model: User_model_1.default,
            queryField: '_id',
            keyMap: dataLoader_1.keyMapOneToOne,
        })(),
        byEmail: dataLoader_1.Loader({
            model: User_model_1.default,
            queryField: 'email',
            keyMap: dataLoader_1.keyMapOneToOne,
        })(),
    },
    room: {
        byId: dataLoader_1.Loader({
            model: Room_model_1.default,
            queryField: '_id',
            keyMap: dataLoader_1.keyMapOneToOne,
        })(),
    },
};
const websocketContext = (connection, payload) => {
    const { userId, refreshToken } = auth_1.authSocket(connection.context.Headers, payload.query);
    return { userId, refreshToken, loaders };
};
const graphqlContext = (req, res) => {
    const { userId, refreshToken } = auth_1.auth(req, res);
    return { req, res, userId, refreshToken, loaders };
};
exports.context = (ctx) => {
    const { req, res, connection, payload } = ctx;
    if (connection && payload) {
        return websocketContext(connection, payload);
    }
    else if (req && res) {
        return graphqlContext(req, res);
    }
    else {
        throw ErrorObject_1.invalidContextError;
    }
};
