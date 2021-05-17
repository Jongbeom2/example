import mongoose, { Document, Schema } from 'mongoose';

export const ChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      required: true,
    },
    content: {
      type: String,
    },
    fileType: {
      type: String,
    },
    fileURL: {
      type: String,
    },
  },
  { timestamps: true },
);

const ChatModel = mongoose.model<ChatDoc>('Chat', ChatSchema);

interface Chat {
  roomId: string;
  userId: string;
  isSystem: boolean;
  content?: string;
  fileType?: string;
  fileURL?: string;
}

export interface ChatDoc extends Chat, Document {}

export default ChatModel;
