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
    // preserve until websocket disconnected
    // console.info(connection, payload);
    // connection.context; // this is the context which insert to onConnect triggered
    const my = auth_1.authSocket(connection.context.Headers, payload.query);
    return { my, loaders };
};
// "context", "argument" variable names are different depends on Server Framework types.
// e.g., in Express, variable names are "req" and "res" but in Koa, Lambda, names are "request" and "response".
const graphqlContext = (req, res) => {
    // test only
    if (process.env.NODE_ENV === 'development') {
        // Cookie settings
        if (res.cookie) {
            res.cookie('contextLevelCookie1', 'contextLevelCookie1', {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 30,
            });
            res.cookie('contextLevelCookie2', 'contextLevelCookie2', {
                httpOnly: false,
                secure: false,
                maxAge: 1000 * 30,
            });
        }
    }
    const my = auth_1.auth(req, res);
    return { req, res, my, loaders };
};
exports.context = async (ctx) => {
    const { req, res, connection, payload } = ctx;
    if (connection) {
        return websocketContext(connection, payload);
    }
    else if (req && res) {
        return graphqlContext(req, res);
    }
    else {
        throw ErrorObject_1.invalidContextError;
    }
};
