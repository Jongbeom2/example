"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("../../middlewares/storage"));
const resolvers = {
    Query: {
        getPresignedGetURL: async (_, args, ctx) => {
            const bucektParams = {
                Bucket: process.env.AWS_S3,
                Key: args.key,
                Expires: 60,
            };
            const presignedGetURL = storage_1.default.getSignedUrl('getObject', bucektParams);
            return { presignedURL: presignedGetURL };
        },
        getPresignedPutURL: async (_, args, ctx) => {
            const bucektParams = {
                Bucket: process.env.AWS_S3,
                Key: args.key,
                Expires: 60,
            };
            const presignedPutURL = storage_1.default.getSignedUrl('putObject', bucektParams);
            return { presignedURL: presignedPutURL };
        },
    },
};
exports.default = resolvers;
