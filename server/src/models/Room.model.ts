import mongoose, { Document, Schema } from 'mongoose';

export const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userNum: {
      type: Number,
      required: true,
    },
    userIdList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    recentMessageContent: {
      type: String,
    },
    recentMessageCreatedAt: {
      type: String,
    },
  },
  { timestamps: true },
);

const RoomModel = mongoose.model<RoomDoc>('Room', RoomSchema);

interface Room {
  name?: string;
  type: string;
  userNum: number;
  userIdList: string[];
  recentMessageContent?: string;
  recentMessageCreatedAt?: string;
}

export interface RoomDoc extends Room, Document {}

export default RoomModel;
