"use strict";
// https://www.npmjs.com/package/graphql-scalars
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_scalars_1 = require("graphql-scalars");
const resolvers = {
    // // ******************************
    // ObjectID: ObjectIDResolver,
    // Date: DateResolver,
    // Time: TimeResolver,
    DateTime: graphql_scalars_1.DateTimeResolver,
};
exports.default = resolvers;
