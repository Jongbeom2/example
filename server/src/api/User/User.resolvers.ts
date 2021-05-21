import bcrypt from 'bcrypt';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
import RoomModel from 'src/models/Room.model';
import Axios from 'axios';
import { generateJWT } from 'src/lib/common';
import { DEFAULT_PROFILE_URL } from 'src/lib/const';
import ChatModel from 'src/models/Chat.model';
import {
  invalidUserEmailError,
  invalidUserIdError,
  invalidUserPasswordError,
  existUserEmailError,
  invalidRoomIdError,
} from 'src/error/ErrorObject';
import { processLoadMany } from 'src/apollo/dataLoader';

const resolvers: Resolvers = {
  Query: {
    getUser: async (_, args, ctx) => {
      const user = await UserModel.findById(args._id);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      return user;
    },
    getUserList: async (_, args, ctx) => {
      const userList = await UserModel.find();
      const filteredUserList = userList.filter(
        (user) => user._id.toString() !== args._id.toString(),
      );
      return filteredUserList;
    },
  },
  User: {
    roomList: async (parent, args, ctx) => {
      const roomList = processLoadMany(await ctx.loaders.room.byId.loadMany(parent.roomIdList));
      return roomList;
    },
  },
  Mutation: {
    signIn: async (_, args, ctx) => {
      const { email, password } = args.signInInput;
      const user = await UserModel.findOne({ email: email });
      // 존재하지 않는 user email임.
      if (user === null) {
        throw invalidUserEmailError;
      }
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      if (!isValidPassword) {
        throw invalidUserPasswordError;
      }
      // access token 생성함.
      const accessToken = generateJWT({
        access: true,
        my: {
          userId: user._id,
        },
      });
      // 유저 정보 쿠키에 저장함.
      ctx.res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        domain: '.jongbeom.com',
      });
      ctx.res.cookie('_id', user._id.toString(), {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
        domain: '.jongbeom.com',
      });
      return user;
    },
    signInWithKakao: async (_, args, ctx) => {
      // accessToken으로 kakao user 정보 가져옴.
      const { data } = await Axios.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: { Authorization: `Bearer ${args.signInWithKakaoInput.accessToken}` },
      });
      let user = await UserModel.findOne({ kakaoId: data.id });
      if (user === null) {
        user = await new UserModel({
          nickname: data.kakao_account.profile.nickname,
          kakaoId: data.id,
          profileImageURL: data.kakao_account.profile.profile_image_url,
          profileThumbnailImageURL: data.kakao_account.profile.thumbnail_image_url,
          loginType: 'kakao',
        }).save();
      }
      // access token 생성함.
      const accessToken = generateJWT({
        access: true,
        my: {
          userId: user._id,
        },
      });
      // 유저 정보 쿠키에 저장함.
      ctx.res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        domain: '.jongbeom.com',
      });
      ctx.res.cookie('_id', user._id.toString(), {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
        domain: '.jongbeom.com',
      });
      return user;
    },
    signOut: async (_, args, ctx) => {
      ctx.res.clearCookie('accessToken');
      ctx.res.clearCookie('_id');
      return true;
    },
    createUser: async (_, args, ctx) => {
      const { nickname, email, password } = args.createUserInput;
      const preUser = await UserModel.findOne({ email });
      // 이미 존재하는 user email
      if (preUser !== null) {
        throw existUserEmailError;
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await new UserModel({
        nickname,
        email,
        password: hash,
        loginType: 'host',
      }).save();
      return user;
    },
    updateUser: async (_, args, ctx) => {
      const { _id, nickname, profileImageURL, profileThumbnailImageURL } = args.updateUserInput;
      const user = await UserModel.findByIdAndUpdate(
        _id,
        {
          nickname,
          profileImageURL: profileImageURL || DEFAULT_PROFILE_URL,
          profileThumbnailImageURL: profileThumbnailImageURL || DEFAULT_PROFILE_URL,
        },
        { new: true },
      );
      // 존재하지 않는 user _id임.
      if (user === null) {
        throw invalidUserIdError;
      }
      ctx.res.cookie('_id', user._id.toString(), {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
        domain: '.jongbeom.com',
      });
      return user;
    },
    updateUserAddRoom: async (_, args, ctx) => {
      const { userId, roomId } = args.updateUserAddRoomInput;
      // room 수정
      const room = await RoomModel.findById(roomId);
      if (room === null) {
        throw invalidRoomIdError;
      }
      room.userIdList.push(userId);
      room.userNum++;
      await room.save();
      // user 수정
      const user = await UserModel.findById(userId);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      user.roomIdList.push(room._id);
      // chat 추가
      await new ChatModel({
        roomId,
        userId,
        isSystem: true,
        content: '님이 입장하셨습니다.',
      }).save();
      return await user.save();
    },
    updateUserRemoveRoom: async (_, args, ctx) => {
      const { userId, roomId } = args.updateUserRemoveRoomInput;
      // room 수정
      const room = await RoomModel.findById(roomId);
      if (room === null) {
        throw invalidRoomIdError;
      }
      room.userIdList = room.userIdList.filter((ele) => ele.toString() !== userId.toString());
      room.userNum--;
      await room.save();
      // user 수정
      const user = await UserModel.findById(userId);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      user.roomIdList = user.roomIdList.filter((ele) => ele.toString() !== roomId.toString());
      // chat 추가
      await new ChatModel({
        roomId,
        userId,
        isSystem: true,
        content: '님이 퇴장하셨습니다.',
      }).save();
      return await user.save();
    },
  },
};

export default resolvers;
