import mongoose, { Document, Schema } from 'mongoose';
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
    },
    profileImageURL: {
      type: String,
    },
    profileThumbnailImageURL: {
      type: String,
    },
    loginType: {
      type: String,
      required: true,
    },
    kakaoId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    roomIdList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
      },
    ],
    fcmTokenList: [
      {
        type: String,
      },
    ],
    refreshToken: {
      type: String,
    },
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
  kakaoId?: string;
  appleId?: string;
  roomIdList: string[];
  fcmTokenList: string[];
  refreshToken?: string;
}

export interface UserDoc extends User, Document {}

export default UserModel;
