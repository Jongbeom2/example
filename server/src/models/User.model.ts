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
      required: true,
    },
    profileImageURL: {
      type: String,
    },
    thumbnailImageURL: {
      type: String,
    },
    loginType: {
      type: String,
      required: true,
    },
    kakaoId: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserDoc>('User', UserSchema);

interface User {
  email?: string;
  password?: string;
  nickname: string;
  profileImageURL?: string;
  thumbnailImageURL?: string;
  loginType?: string;
  kakaoId: string;
}

export interface UserDoc extends User, Document {}

export default User;
