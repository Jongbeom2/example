import RoomModel from 'src/models/Room.model';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
const invalidRoomIdError = new ApolloError('INVALID_ROOM_ID', 'INVALID_ROOM_ID');
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
    getRoomList: async (_, args, ctx) => {
      const user = await UserModel.findById(args.userId);
      // _id에 해당하는 room 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
      return roomList;
    },
  },
  Room: {
    userList: async (parent, args, ctx) => {
      const userList = await UserModel.find({ _id: { $in: parent.userIdList } });
      return userList;
    },
  },
  Mutation: {
    createPrivateRoom: async (_, args, ctx) => {
      const { userIdList } = args.createPrivateRoomInput;
      // room 수정
      const room = await new RoomModel({
        type: 'private',
        userNum: 2,
        userIdList,
      }).save();
      // user 수정
      const userList = await UserModel.find({ _id: { $in: userIdList } });
      for (let i = 0; i < userList.length; i++) {
        userList[i].roomIdList.push(room._id);
        await userList[i].save();
      }
      return room;
    },
  },
};
export default resolvers;
