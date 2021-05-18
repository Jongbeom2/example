import RoomModel from 'src/models/Room.model';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
import { invalidRoomIdError, invalidUserIdError } from 'src/error/ErrorObject';
const resolvers: Resolvers = {
  Query: {
    getRoom: async (_, args, ctx) => {
      const room = await RoomModel.findById(args._id);
      // _id에 해당하는 room 없음.
      if (room === null) {
        throw invalidRoomIdError;
      }
      return room;
    },
    getMyRoomList: async (_, args, ctx) => {
      const user = await UserModel.findById(args.userId);
      // _id에 해당하는 room 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
      return roomList;
    },
    getRoomList: async (_, args, ctx) => {
      const user = await UserModel.findById(args.userId);
      // _id에 해당하는 room 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      const roomList = await RoomModel.find();
      const filteredRoomList = roomList.filter(
        (room) => user.roomIdList.indexOf(room._id.toString()) === -1,
      );
      return filteredRoomList;
    },
  },
  Room: {
    userList: async (parent, args, ctx) => {
      const userList = await UserModel.find({ _id: { $in: parent.userIdList } });
      return userList;
    },
  },
  Mutation: {
    createRoom: async (_, args, ctx) => {
      const { userId, name } = args.createRoomInput;
      // room 생성
      const room = await new RoomModel({
        name,
        userNum: 1,
        userIdList: [userId],
      }).save();
      // user 수정
      const user = await UserModel.findById(userId);
      if (!user) {
        throw invalidUserIdError;
      }
      user.roomIdList.push(room._id);
      await user.save();
      return room;
    },
  },
};
export default resolvers;
