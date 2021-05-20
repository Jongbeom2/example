"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const path_1 = __importDefault(require("path"));
const graphql_tools_1 = require("graphql-tools");
const allTypeDefs = graphql_tools_1.loadFilesSync(path_1.default.join(__dirname, 'api/**/*.graphql'), {
    extensions: ['graphql'],
});
const allResolvers = graphql_tools_1.loadFilesSync(path_1.default.join(__dirname, 'api/**/*.resolvers.*'), {
    extensions: ['js', 'ts'],
});
const typeDefs = graphql_tools_1.mergeTypeDefs(allTypeDefs);
const resolvers = graphql_tools_1.mergeResolvers(allResolvers);
const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers });
exports.schema = schema;
