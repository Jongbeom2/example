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
const colors_1 = __importDefault(require("colors"));
const axios_1 = __importDefault(require("axios"));
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
            // fcm publish
            await axios_1.default({
                method: 'post',
                url: 'https://fcm.googleapis.com/fcm/send',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: `key=${process.env.FCM_SERVER_KEY}`,
                },
                data: {
                    to: `/topics/roomId-${roomId}`,
                    data: {
                        roomId: roomId,
                        type: 'chat',
                    },
                    notification: {
                        title: '예제입니다.',
                        body: content,
                    },
                },
            });
            return chat;
        },
    },
    Subscription: {
        chatCreated: {
            subscribe: apollo_server_1.withFilter(() => {
                return withCancel(pubsub_1.pubsub.asyncIterator('CHAT_CREATED'), () => {
                    console.info(`## subscription cancel: ${colors_1.default.blue.bold('chatCreated')}`);
                });
            }, (payload, variable) => {
                const payloadRoomId = payload.chatCreated.roomId;
                const subscriptionRoomId = variable.roomId;
                return payloadRoomId.toString() === subscriptionRoomId.toString();
            }),
        },
    },
};
exports.default = resolvers;
// https://stackoverflow.com/questions/56886412/detect-an-unsubscribe-in-apollo-graphql-server
// https://github.com/apollographql/graphql-subscriptions/issues/99
const withCancel = (asyncIterator, onCancel) => {
    const asyncReturn = asyncIterator.return;
    asyncIterator.return = () => {
        onCancel();
        return asyncReturn
            ? asyncReturn.call(asyncIterator)
            : Promise.resolve({ value: undefined, done: true });
    };
    return asyncIterator;
};
