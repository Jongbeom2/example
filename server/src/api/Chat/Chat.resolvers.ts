import { withFilter } from 'apollo-server';
import ChatModel from 'src/models/Chat.model';
import { Resolvers } from 'src/types/graphql';
import { pubsub } from 'src/apollo/pubsub';
import RoomModel from 'src/models/Room.model';
import { invalidChatIdError, invalidRoomIdError, invalidUserIdError } from 'src/error/ErrorObject';
import admin from 'firebase-admin';
import { logger } from 'src/middlewares/winston';

const resolvers: Resolvers = {
  Query: {
    getChatList: async (_, args, ctx) => {
      const { roomId, lastId, size } = args;
      const chatList = await ChatModel.find(lastId ? { roomId, _id: { $lt: lastId } } : { roomId })
        .sort({ _id: -1 })
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
      const { roomId, userId, content, imageURL, fileURL, fileName } = args.createChatInput;
      // room 수정
      const room = await RoomModel.findByIdAndUpdate(roomId, {
        recentMessageContent: content || undefined,
      });
      // 존재하지 않는 room _id임.
      if (room === null) {
        throw invalidRoomIdError;
      }
      // chat 생성
      const chat = await new ChatModel({
        roomId,
        userId,
        isSystem: false,
        content,
        imageURL,
        fileURL,
        fileName,
      }).save();
      // publish
      pubsub.publish('CHAT_CREATED', {
        chatCreated: chat,
      });
      // fcm publish
      if (room.fcmTokenList.length !== 0) {
        await admin.messaging().sendToDevice(
          room.fcmTokenList,
          {
            data: {
              roomId: roomId,
              type: 'chat',
            },
            notification: {
              title: room.name,
              body: content,
            },
          },
          {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
          },
        );
      }
      return chat;
    },
    archiveChat: async (_, args, ctx) => {
      const { _id } = args.archiveChatInput;
      const chat = await ChatModel.findById(_id);
      // 존재하지 않는 chat _id임.
      if (chat === null) {
        throw invalidChatIdError;
      }
      chat.isArchived = true;
      return await chat.save();
    },
  },
  Subscription: {
    chatCreated: {
      subscribe: withFilter(
        () => {
          return withCancel(pubsub.asyncIterator('CHAT_CREATED'), () => {
            logger.info(`## subscription cancel: chatCreated`);
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
