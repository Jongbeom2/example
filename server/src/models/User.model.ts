import mongoose, { Document, Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserDoc>('User', UserSchema);

interface User {
  nickName: string;
  email: string;
  password: string;
}

export interface UserDoc extends User, Document {}

export default User;
