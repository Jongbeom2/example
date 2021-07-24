import mongoose, { Document, Schema } from 'mongoose';

export const ChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
    },
    thumbnailImageURL: {
      type: String,
    },
    fileURL: {
      type: String,
    },
    fileName: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

const ChatModel = mongoose.model<ChatDoc>('Chat', ChatSchema);

interface Chat {
  roomId: string;
  userId: string;
  isSystem: boolean;
  content: string;
  imageURL?: string;
  thumbnailImageURL?: string;
  fileURL?: string;
  fileName?: string;
  isArchived: boolean;
}

export interface ChatDoc extends Chat, Document {}

export default ChatModel;
