import { ApolloError } from 'apollo-server';
import ChatModel from 'src/models/Chat.model';
import UserModel from 'src/models/User.model';
import { Resolvers } from 'src/types/graphql';
import { pubsub } from 'src/apollo/pubsub';
import RoomModel from 'src/models/Room.model';
import { invalidUserIdError } from 'src/error/ErrorObject';

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
      const user = await UserModel.findById(parent.userId);
      // 존재하지 않는 user _id임.
      if (user === null) {
        throw invalidUserIdError;
      }
      return user;
    },
  },
  Mutation: {
    createChat: async (_, args, ctx) => {
      const { roomId, userId, content, fileType, fileURL } = args.createChatInput;
      // room 수정
      await RoomModel.findByIdAndUpdate(roomId, { recentMessageContent: content || undefined });
      // chat 생성
      const chat = await new ChatModel({
        roomId,
        userId,
        isSystem: false,
        content,
        fileType,
        fileURL,
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
      subscribe: () => pubsub.asyncIterator('CHAT_CREATED'),
    },
  },
};
export default resolvers;
