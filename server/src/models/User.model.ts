import mongoose, { Document, Schema } from 'mongoose';
import { DEFAULT_PROFILE_URL } from 'src/lib/const';

export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    nickname: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: DEFAULT_PROFILE_URL,
      required: true,
    },
    profileThumbnailImageURL: {
      type: String,
      default: DEFAULT_PROFILE_URL,
      required: true,
    },
    loginType: {
      type: String,
      required: true,
    },
    kakaoId: {
      type: String,
    },
    friendList: [
      {
        userId: {
          type: String,
          required: true,
        },
        roomId: {
          type: String,
        },
      },
    ],
    roomIdList: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.model<UserDoc>('User', UserSchema);

interface User {
  email?: string;
  password?: string;
  nickname: string;
  profileImageURL?: string;
  profileThumbnailImageURL?: string;
  loginType?: string;
  kakaoId: string;
  roomIdList: string[];
  friendList: Friend[];
}

interface Friend {
  userId: string;
  roomId?: string;
}

export interface UserDoc extends User, Document {}

export default UserModel;
