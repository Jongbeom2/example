"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const Chat_model_1 = __importDefault(require("../../models/Chat.model"));
const Restaurant_model_1 = __importDefault(require("../../models/Restaurant.model"));
const resolvers = {
    Mutation: {
        createDummyUserList: async (_, args, ctx) => {
            faker_1.default.locale = 'ko';
            const promiseList = [];
            for (let i = 0; i < 100; i++) {
                const email = Math.floor(Math.random() * 10000) + faker_1.default.internet.email();
                const password = await bcrypt_1.default.hash('qwe123!', 10);
                const nickname = faker_1.default.internet.userName();
                const profileImageURL = faker_1.default.image.avatar();
                const loginType = 'host';
                const user = new User_model_1.default({
                    email,
                    password,
                    nickname,
                    profileImageURL,
                    loginType,
                });
                promiseList.push(user.save());
            }
            await Promise.all(promiseList);
            return true;
        },
        createDummyRoomList: async (_, args, ctx) => {
            faker_1.default.locale = 'ko';
            const promiseList1 = [];
            const promiseList2 = [];
            const userList = await User_model_1.default.find();
            const userIdList = userList.map((user) => user._id);
            for (let i = 0; i < 50; i++) {
                const name = faker_1.default.lorem.sentence();
                const userNum = 201;
                const room = new Room_model_1.default({
                    name,
                    userNum,
                    userIdList,
                });
                promiseList1.push(room.save());
            }
            await Promise.all(promiseList1);
            const roomList = await Room_model_1.default.find();
            const roomIdList = roomList.map((room) => room._id);
            for (let i = 0; i < userList.length; i++) {
                const user = userList[i];
                user.roomIdList = roomIdList;
                promiseList2.push(user.save());
            }
            await Promise.all(promiseList2);
            return true;
        },
        createDummyChatList: async (_, args, ctx) => {
            // chat은 createdAt으로 정렬하고 pagination으로 가져옴.
            // chat을 promise all로 생성하면 createdAt이 같은 chat이 많이 생김.
            // createdAt 같은 list를 pagination으로 가져올 수가 없음.
            // 그래서 chat은 promsei all로 가져오지 않음.
            faker_1.default.locale = 'ko';
            const userList = await User_model_1.default.find();
            const roomList = await Room_model_1.default.find();
            for (let i = 0; i < roomList.length; i++) {
                for (let j = 0; j < userList.length; j++) {
                    const roomId = roomList[i]._id;
                    const userId = userList[j]._id;
                    const content = faker_1.default.lorem.sentence();
                    const chat = new Chat_model_1.default({
                        roomId,
                        userId,
                        content,
                    });
                    await chat.save();
                }
            }
            return true;
        },
        createDummyRestaurantList: async (_, args, ctx) => {
            faker_1.default.locale = 'ko';
            const promiseList = [];
            const minLat = 37.395;
            const maxLat = 37.335;
            const minLng = 127.09;
            const maxLng = 127.12;
            for (let i = 0; i < 1000; i++) {
                const name = faker_1.default.address.streetName() + ' ' + faker_1.default.internet.userName();
                const lat = minLat + (maxLat - minLat) * Math.random();
                const lng = minLng + (maxLng - minLng) * Math.random();
                const profileImageURL = faker_1.default.image.avatar();
                const imageURLList = [
                    faker_1.default.image.imageUrl(),
                    faker_1.default.image.imageUrl(),
                    faker_1.default.image.imageUrl(),
                ];
                const restaurant = new Restaurant_model_1.default({
                    name,
                    lat,
                    lng,
                    profileImageURL,
                    imageURLList,
                });
                promiseList.push(restaurant.save());
            }
            await Promise.all(promiseList);
            return true;
        },
        deleteUserList: async (_, args, ctx) => {
            await User_model_1.default.deleteMany({});
            return true;
        },
        deleteRoomList: async (_, args, ctx) => {
            await Room_model_1.default.deleteMany({});
            return true;
        },
        deleteChatList: async (_, args, ctx) => {
            await Chat_model_1.default.deleteMany({});
            return true;
        },
        deleteRestaurantList: async (_, args, ctx) => {
            await Restaurant_model_1.default.deleteMany({});
            return true;
        },
    },
};
exports.default = resolvers;
