import { Resolvers } from 'src/types/graphql';
import faker from 'faker';
import bcrypt from 'bcrypt';
import UserModel from 'src/models/User.model';
import RoomModel from 'src/models/Room.model';
import ChatModel from 'src/models/Chat.model';
import RestaurantModel from 'src/models/Restaurant.model';
const resolvers: Resolvers = {
  Mutation: {
    createDummyUserList: async (_, args, ctx) => {
      faker.locale = 'ko';
      const promiseList = [];
      for (let i = 0; i < 100; i++) {
        const email = Math.floor(Math.random() * 10000) + faker.internet.email();
        const password = await bcrypt.hash('qwe123!', 10);
        const nickname = faker.internet.userName();
        const profileImageURL = faker.image.avatar();
        const profileThumbnailImageURL = profileImageURL;
        const loginType = 'host';
        const user = new UserModel({
          email,
          password,
          nickname,
          profileImageURL,
          profileThumbnailImageURL,
          loginType,
        });
        promiseList.push(user.save());
      }
      await Promise.all(promiseList);
      return true;
    },
    createDummyRoomList: async (_, args, ctx) => {
      faker.locale = 'ko';
      const promiseList1 = [];
      const promiseList2 = [];
      const userList = await UserModel.find();
      const userIdList = userList.map((user) => user._id);
      for (let i = 0; i < 50; i++) {
        const name = faker.lorem.sentence();
        const userNum = 201;
        const room = new RoomModel({
          name,
          userNum,
          userIdList,
        });
        promiseList1.push(room.save());
      }
      await Promise.all(promiseList1);
      const roomList = await RoomModel.find();
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
      faker.locale = 'ko';
      const userList = await UserModel.find();
      const roomList = await RoomModel.find();
      for (let i = 0; i < roomList.length; i++) {
        for (let j = 0; j < userList.length; j++) {
          const roomId = roomList[i]._id;
          const userId = userList[j]._id;
          const content = faker.lorem.sentence();
          const chat = new ChatModel({
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
      faker.locale = 'ko';
      const promiseList = [];
      const minLat = 37.395;
      const maxLat = 37.335;
      const minLng = 127.09;
      const maxLng = 127.12;
      for (let i = 0; i < 1000; i++) {
        const name = faker.address.streetName() + ' ' + faker.internet.userName();
        const lat = minLat + (maxLat - minLat) * Math.random();
        const lng = minLng + (maxLng - minLng) * Math.random();
        const profileImageURL = faker.image.avatar();
        const imageURLList = [
          faker.image.imageUrl(),
          faker.image.imageUrl(),
          faker.image.imageUrl(),
        ];
        const restaurant = new RestaurantModel({
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
      await UserModel.deleteMany({});
      return true;
    },
    deleteRoomList: async (_, args, ctx) => {
      await RoomModel.deleteMany({});
      return true;
    },
    deleteChatList: async (_, args, ctx) => {
      await ChatModel.deleteMany({});
      return true;
    },
    deleteRestaurantList: async (_, args, ctx) => {
      await RestaurantModel.deleteMany({});
      return true;
    },
  },
};

export default resolvers;
