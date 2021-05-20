"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Chat_model_1 = __importDefault(require("../../models/Chat.model"));
const pubsub_1 = require("../../apollo/pubsub");
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const ErrorObject_1 = require("../../error/ErrorObject");
const resolvers = {
    Query: {
        getChatList: async (_, args, ctx) => {
            const { roomId, skip, size } = args;
            const chatList = await Chat_model_1.default.find({ roomId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(size);
            return chatList;
        },
    },
    Chat: {
        user: async (parent, args, ctx) => {
            const user = await ctx.loaders.user.byId.load(parent.userId);
            // 존재하지 않는 user _id임.
            if (user === null) {
                throw ErrorObject_1.invalidUserIdError;
            }
            return user;
        },
        room: async (parent, args, ctx) => {
            const room = await ctx.loaders.room.byId.load(parent.roomId);
            // 존재하지 않는 room _id임.
            if (room === null) {
                throw ErrorObject_1.invalidRoomIdError;
            }
            return room;
        },
    },
    Mutation: {
        createChat: async (_, args, ctx) => {
            const { roomId, userId, content, imageURL, thumbnailImageURL, fileURL, fileName, } = args.createChatInput;
            // room 수정
            await Room_model_1.default.findByIdAndUpdate(roomId, { recentMessageContent: content || undefined });
            // chat 생성
            const chat = await new Chat_model_1.default({
                roomId,
                userId,
                isSystem: false,
                content,
                imageURL,
                thumbnailImageURL,
                fileURL,
                fileName,
            }).save();
            // publish
            pubsub_1.pubsub.publish('CHAT_CREATED', {
                chatCreated: chat,
            });
            return chat;
        },
    },
    Subscription: {
        chatCreated: {
            subscribe: apollo_server_1.withFilter(() => pubsub_1.pubsub.asyncIterator('CHAT_CREATED'), (payload, variable) => {
                const payloadRoomId = payload.chatCreated.roomId;
                const subscriptionRoomId = variable.roomId;
                return payloadRoomId.toString() === subscriptionRoomId.toString();
            }),
        },
    },
};
exports.default = resolvers;
