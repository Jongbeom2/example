import { ApolloError } from 'apollo-server';
import ChatModel from 'src/models/Chat.model';
import UserModel from 'src/models/User.model';
import { Resolvers } from 'src/types/graphql';
const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
const resolvers: Resolvers = {
  Query: {
    getChatList: async (_, args, ctx) => {
      const chatList = await ChatModel.find({ roomId: args.roomId });
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
      const chat = await new ChatModel({
        roomId,
        userId,
        isSystem: false,
        content,
        fileType,
        fileURL,
      }).save();
      return chat;
    },
  },
};
export default resolvers;
