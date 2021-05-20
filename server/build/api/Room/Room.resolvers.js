"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const ErrorObject_1 = require("../../error/ErrorObject");
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
            // room 생성
            const room = await new Room_model_1.default({
                name,
                userNum: 1,
                userIdList: [userId],
            }).save();
            // user 수정
            const user = await User_model_1.default.findById(userId);
            if (!user) {
                throw ErrorObject_1.invalidUserIdError;
            }
            user.roomIdList.push(room._id);
            await user.save();
            return room;
        },
    },
};
exports.default = resolvers;
