import { withFilter } from 'apollo-server';
import ChatModel from 'src/models/Chat.model';
import UserModel from 'src/models/User.model';
import { Resolvers } from 'src/types/graphql';
import { pubsub } from 'src/apollo/pubsub';
import RoomModel from 'src/models/Room.model';
import { invalidRoomIdError, invalidUserIdError } from 'src/error/ErrorObject';

const resolvers: Resolvers = {
  Query: {
    getChatList: async (_, args, ctx) => {
      const { roomId, skip, size } = args;
      const chatList = await ChatModel.find({ roomId })
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
        throw invalidUserIdError;
      }
      return user;
    },
    room: async (parent, args, ctx) => {
      const room = await ctx.loaders.room.byId.load(parent.roomId);
      // 존재하지 않는 room _id임.
      if (room === null) {
        throw invalidRoomIdError;
      }
      return room;
    },
  },
  Mutation: {
    createChat: async (_, args, ctx) => {
      const {
        roomId,
        userId,
        content,
        imageURL,
        thumbnailImageURL,
        fileURL,
        fileName,
      } = args.createChatInput;
      // room 수정
      await RoomModel.findByIdAndUpdate(roomId, { recentMessageContent: content || undefined });
      // chat 생성
      const chat = await new ChatModel({
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
      pubsub.publish('CHAT_CREATED', {
        chatCreated: chat,
      });
      return chat;
    },
  },
  Subscription: {
    chatCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('CHAT_CREATED'),
        (payload, variable) => {
          const payloadRoomId = payload.chatCreated.roomId;
          const subscriptionRoomId = variable.roomId;
          return payloadRoomId.toString() === subscriptionRoomId.toString();
        },
      ),
    },
  },
};
export default resolvers;
