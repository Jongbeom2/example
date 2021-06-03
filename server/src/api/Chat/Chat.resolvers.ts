import { withFilter } from 'apollo-server';
import ChatModel from 'src/models/Chat.model';
import UserModel from 'src/models/User.model';
import { Resolvers } from 'src/types/graphql';
import { pubsub } from 'src/apollo/pubsub';
import RoomModel from 'src/models/Room.model';
import { invalidRoomIdError, invalidUserIdError } from 'src/error/ErrorObject';
import colors from 'colors';
import Axios from 'axios';

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
      // fcm publish
      await Axios({
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `key=${process.env.FCM_SERVER_KEY}`,
        },
        data: {
          to: `/topics/roomId-${roomId}`,
          data: {
            roomId: roomId,
            type: 'chat',
          },
          notification: {
            title: '예제입니다.',
            body: content,
          },
        },
      });
      return chat;
    },
  },
  Subscription: {
    chatCreated: {
      subscribe: withFilter(
        () => {
          return withCancel(pubsub.asyncIterator('CHAT_CREATED'), () => {
            console.info(`## subscription cancel: ${colors.blue.bold('chatCreated')}`);
          });
        },
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

// https://stackoverflow.com/questions/56886412/detect-an-unsubscribe-in-apollo-graphql-server
// https://github.com/apollographql/graphql-subscriptions/issues/99
const withCancel = (asyncIterator: any, onCancel: any) => {
  const asyncReturn = asyncIterator.return;
  asyncIterator.return = () => {
    onCancel();
    return asyncReturn
      ? asyncReturn.call(asyncIterator)
      : Promise.resolve({ value: undefined, done: true });
  };
  return asyncIterator;
};
