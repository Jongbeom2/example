"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res, next) => {
    res.send('<h1>Example App</h1>');
    next();
});
router.get('/hello', async (req, res) => {
    res.send('Hello');
});
const routerMiddleware = () => router;
exports.default = routerMiddleware;
