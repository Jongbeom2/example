"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers = {
    Query: {
        getTest: (_, args, ctx) => {
            return {
                content: 'Test',
                createdAt: Date.now(),
            };
        },
        getNow: (_, args, ctx) => Date.now(),
    },
};
exports.default = resolvers;
