"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const ErrorObject_1 = require("../../error/ErrorObject");
const Chat_model_1 = __importDefault(require("../../models/Chat.model"));
const pubsub_1 = require("../../apollo/pubsub");
const mongoose_1 = require("mongoose");
const resolvers = {
    Query: {
        getRoom: async (_, args, ctx) => {
            const room = await Room_model_1.default.findById(args._id);
            // _id에 해당하는 room 없음.
            if (room === null) {
                throw ErrorObject_1.invalidRoomIdError;
            }
            return room;
        },
        getMyRoomList: async (_, args, ctx) => {
            const user = await User_model_1.default.findById(args.userId);
            // _id에 해당하는 room 없음.
            if (user === null) {
                throw ErrorObject_1.invalidUserIdError;
            }
            const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } });
            return roomList;
        },
        getRoomList: async (_, args, ctx) => {
            const user = await User_model_1.default.findById(args.userId);
            // _id에 해당하는 room 없음.
            if (user === null) {
                throw ErrorObject_1.invalidUserIdError;
            }
            const roomList = await Room_model_1.default.find();
            const filteredRoomList = roomList.filter((room) => user.roomIdList.indexOf(room._id.toString()) === -1);
            return filteredRoomList;
        },
    },
    Room: {
        userList: async (parent, args, ctx) => {
            const userList = await User_model_1.default.find({ _id: { $in: parent.userIdList } });
            return userList;
        },
    },
    Mutation: {
        createRoom: async (_, args, ctx) => {
            const { userId, name } = args.createRoomInput;
            // user 조회
            const user = await User_model_1.default.findById(userId);
            if (!user) {
                throw ErrorObject_1.invalidUserIdError;
            }
            // room 생성
            const room = await new Room_model_1.default({
                name,
                userNum: 1,
                userIdList: [userId],
                fcmTokenList: user.fcmTokenList,
            }).save();
            // user 수정
            user.roomIdList.push(room._id);
            await user.save();
            return room;
        },
        updateUserAddRoom: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let room;
            try {
                await session.withTransaction(async () => {
                    const { userId, roomId } = args.updateUserAddRoomInput;
                    // user 조회
                    const user = await User_model_1.default.findById(userId, {}, { session });
                    if (user === null) {
                        throw ErrorObject_1.invalidUserIdError;
                    }
                    // room 수정
                    room = await Room_model_1.default.findById(roomId, {}, { session });
                    if (room === null) {
                        throw ErrorObject_1.invalidRoomIdError;
                    }
                    room.userIdList.push(userId);
                    room.userNum++;
                    room.fcmTokenList = [...room.fcmTokenList, ...user.fcmTokenList];
                    await room.save({ session });
                    // user 수정
                    user.roomIdList.push(room._id);
                    await user.save({ session });
                    // chat 추가
                    const chat = await new Chat_model_1.default({
                        roomId,
                        userId,
                        isSystem: true,
                        content: '님이 입장하셨습니다.',
                    }).save({ session });
                    // publish
                    pubsub_1.pubsub.publish('CHAT_CREATED', {
                        chatCreated: chat,
                    });
                });
            }
            catch (err) {
                throw err;
            }
            finally {
                await session.endSession();
            }
            return room;
        },
        updateUserRemoveRoom: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let room;
            try {
                await session.withTransaction(async () => {
                    const { userId, roomId } = args.updateUserRemoveRoomInput;
                    // user 조회
                    const user = await User_model_1.default.findById(userId, {}, { session });
                    if (user === null) {
                        throw ErrorObject_1.invalidUserIdError;
                    }
                    // room 수정
                    room = await Room_model_1.default.findById(roomId, {}, { session });
                    if (room === null) {
                        throw ErrorObject_1.invalidRoomIdError;
                    }
                    room.userIdList = room.userIdList.filter((ele) => ele.toString() !== userId.toString());
                    room.userNum--;
                    room.fcmTokenList = room.fcmTokenList.filter((ele) => user.fcmTokenList.indexOf(ele) === -1);
                    await room.save({ session });
                    // user 수정
                    user.roomIdList = user.roomIdList.filter((ele) => ele.toString() !== roomId.toString());
                    await user.save({ session });
                    // chat 추가
                    const chat = await new Chat_model_1.default({
                        roomId,
                        userId,
                        isSystem: true,
                        content: '님이 퇴장하셨습니다.',
                    }).save({ session });
                    // publish
                    pubsub_1.pubsub.publish('CHAT_CREATED', {
                        chatCreated: chat,
                    });
                });
            }
            catch (err) {
                throw err;
            }
            finally {
                await session.endSession();
            }
            return room;
        },
    },
};
exports.default = resolvers;
