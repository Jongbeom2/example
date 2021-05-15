import RoomModel from 'src/models/Room.model';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
const invalidRoomIdError = new ApolloError('INVALID_ROOM_ID', 'INVALID_ROOM_ID');
const resolvers: Resolvers = {
  Query: {
    getRoom: async (_, args, ctx) => {
      const room = await RoomModel.findById(args.roomId);
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
      const { user1Id, user2Id } = args.createPrivateRoomInput;
      // room 수정
      const room = await new RoomModel({
        type: 'private',
        userNum: 2,
        userIdList: [user1Id, user2Id],
      }).save();
      // user 수정
      const user1 = await UserModel.findById(user1Id);
      const user2 = await UserModel.findById(user2Id);
      if (!user1 || !user2) {
        throw invalidUserIdError;
      }
      user1.roomIdList.push(room._id);
      user2.roomIdList.push(room._id);
      await user1.save();
      await user2.save();
      return room;
    },
  },
};
export default resolvers;
