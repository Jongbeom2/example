import RoomModel from 'src/models/Room.model';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
import { invalidRoomIdError, invalidUserIdError } from 'src/error/ErrorObject';
import ChatModel from 'src/models/Chat.model';
import { pubsub } from 'src/apollo/pubsub';
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
    updateUserAddRoom: async (_, args, ctx) => {
      const { userId, roomId } = args.updateUserAddRoomInput;
      // room 수정
      const room = await RoomModel.findById(roomId);
      if (room === null) {
        throw invalidRoomIdError;
      }
      room.userIdList.push(userId);
      room.userNum++;
      await room.save();
      // user 수정
      const user = await UserModel.findById(userId);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      user.roomIdList.push(room._id);
      await user.save();
      // chat 추가
      const chat = await new ChatModel({
        roomId,
        userId,
        isSystem: true,
        content: '님이 입장하셨습니다.',
      }).save();
      // publish
      pubsub.publish('CHAT_CREATED', {
        chatCreated: chat,
      });
      return room;
    },
    updateUserRemoveRoom: async (_, args, ctx) => {
      const { userId, roomId } = args.updateUserRemoveRoomInput;
      // room 수정
      const room = await RoomModel.findById(roomId);
      if (room === null) {
        throw invalidRoomIdError;
      }
      room.userIdList = room.userIdList.filter((ele) => ele.toString() !== userId.toString());
      room.userNum--;
      await room.save();
      // user 수정
      const user = await UserModel.findById(userId);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      user.roomIdList = user.roomIdList.filter((ele) => ele.toString() !== roomId.toString());
      await user.save();
      // chat 추가
      const chat = await new ChatModel({
        roomId,
        userId,
        isSystem: true,
        content: '님이 퇴장하셨습니다.',
      }).save();
      // publish
      pubsub.publish('CHAT_CREATED', {
        chatCreated: chat,
      });
      return room;
    },
  },
};
export default resolvers;
