import bcrypt from 'bcrypt';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
import Axios from 'axios';
import { generateJWT } from 'src/lib/common';
import appleSigninAuth from 'apple-signin-auth';
import { COOKIE_DURATION_MILLISECONDS } from 'src/lib/const';
import {
  invalidUserEmailError,
  invalidUserIdError,
  invalidUserPasswordError,
  existUserEmailError,
} from 'src/error/ErrorObject';
import { processLoadMany } from 'src/apollo/dataLoader';
import RoomModel, { RoomDoc } from 'src/models/Room.model';
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
      const { email, password, fcmToken } = args.signInInput;
      const user = await UserModel.findOne({ email: email });
      // 존재하지 않는 user email임.
      if (user === null) {
        throw invalidUserEmailError;
      }
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      if (!isValidPassword) {
        throw invalidUserPasswordError;
      }
      // notification을 위해 fcmToken 저장함.
      if (fcmToken) {
        // user fcmToken
        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
          user.fcmTokenList.push(fcmToken);
        }
        // room fcmToken
        const promiseList: Promise<RoomDoc>[] = [];
        const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
        roomList.forEach((room) => {
          if (room.fcmTokenList.indexOf(fcmToken) === -1) {
            room.fcmTokenList.push(fcmToken);
            promiseList.push(room.save());
          }
        });
        Promise.all(promiseList);
      }
      await user.save();
      // access token 생성함.
      const accessToken = generateJWT({
        access: true,
        my: {
          userId: user._id,
        },
      });
      // 유저 정보 쿠키에 저장함.
      const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';
      if (isNodeEnvDevelopment) {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
        });
      } else {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
          domain: '.jongbeom.com',
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
          domain: '.jongbeom.com',
        });
      }
      return user;
    },
    signInWithKakao: async (_, args, ctx) => {
      const { accessToken: kakaoAccessToken, fcmToken } = args.signInWithKakaoInput;
      // accessToken으로 kakao user 정보 가져옴.
      const { data } = await Axios.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: { Authorization: `Bearer ${kakaoAccessToken}` },
      });
      let user = await UserModel.findOne({ kakaoId: data.id });
      if (user === null) {
        user = await new UserModel({
          // nickname: data.kakao_account.profile.nickname,
          kakaoId: data.id,
          // profileImageURL: data.kakao_account.profile.profile_image_url,
          // profileThumbnailImageURL: data.kakao_account.profile.thumbnail_image_url,
          loginType: 'kakao',
        });
      }
      // notification을 위해 fcmToken 저장함.
      if (fcmToken) {
        // user fcmToken
        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
          user.fcmTokenList.push(fcmToken);
        }
        // room fcmToken
        const promiseList: Promise<RoomDoc>[] = [];
        const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
        roomList.forEach((room) => {
          if (room.fcmTokenList.indexOf(fcmToken) === -1) {
            room.fcmTokenList.push(fcmToken);
            promiseList.push(room.save());
          }
        });
        await Promise.all(promiseList);
      }
      await user.save();
      // access token 생성함.
      const accessToken = generateJWT({
        access: true,
        my: {
          userId: user._id,
        },
      });

      // 유저 정보 쿠키에 저장함.
      const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';
      if (isNodeEnvDevelopment) {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
        });
      } else {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
          domain: '.jongbeom.com',
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
          domain: '.jongbeom.com',
        });
      }
      return user;
    },
    signInWithApple: async (_, args, ctx) => {
      const { identityToken, fcmToken } = args.signInWithAppleInput;
      // identityToken apple user 정보 가져옴.
      const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(identityToken);
      let user = await UserModel.findOne({ appleId: appleIdTokenClaims.sub });
      if (user === null) {
        user = await new UserModel({
          appleId: appleIdTokenClaims.sub,
          // nickname: appleIdTokenClaims.email,
          loginType: 'apple',
        });
      }
      // notification을 위해 fcmToken 저장함.
      if (fcmToken) {
        // user fcmToken
        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
          user.fcmTokenList.push(fcmToken);
        }
        // room fcmToken
        const promiseList: Promise<RoomDoc>[] = [];
        const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
        roomList.forEach((room) => {
          if (room.fcmTokenList.indexOf(fcmToken) === -1) {
            room.fcmTokenList.push(fcmToken);
            promiseList.push(room.save());
          }
        });
        await Promise.all(promiseList);
      }
      await user.save();
      // access token 생성함.
      const accessToken = generateJWT({
        access: true,
        my: {
          userId: user._id,
        },
      });

      // 유저 정보 쿠키에 저장함.
      const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';
      if (isNodeEnvDevelopment) {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
        });
      } else {
        ctx.res.cookie('accessToken', accessToken, {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: true,
          domain: '.jongbeom.com',
        });
        ctx.res.cookie('_id', user._id.toString(), {
          maxAge: COOKIE_DURATION_MILLISECONDS,
          httpOnly: false,
          domain: '.jongbeom.com',
        });
      }
      return user;
    },
    signOut: async (_, args, ctx) => {
      const { _id, fcmToken } = args.signOutInput;
      ctx.res.clearCookie('accessToken');
      ctx.res.clearCookie('_id');
      const user = await UserModel.findById(_id);
      // _id에 해당하는 user 없음.
      if (user === null) {
        throw invalidUserIdError;
      }
      // notification 끄기 위해 fcmToken 삭제함.
      if (fcmToken) {
        // user fcmToken
        user.fcmTokenList = user.fcmTokenList.filter((ele) => ele !== fcmToken);
        // room fcmToken
        const promiseList: Promise<RoomDoc>[] = [];
        const roomList = await RoomModel.find({ _id: { $in: user.roomIdList } });
        roomList.forEach((room) => {
          room.fcmTokenList = room.fcmTokenList.filter((ele) => ele !== fcmToken);
          promiseList.push(room.save());
        });
        Promise.all(promiseList);
      }
      await user.save();
      return user;
    },
    createUser: async (_, args, ctx) => {
      const { email, password } = args.createUserInput;
      const preUser = await UserModel.findOne({ email });
      // 이미 존재하는 user email
      if (preUser !== null) {
        throw existUserEmailError;
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await new UserModel({
        email,
        password: hash,
        loginType: 'host',
      }).save();
      return user;
    },
    updateUser: async (_, args, ctx) => {
      const ranNum = Math.floor(Math.random() * 6);
      const DEFAULT_PROFILE_URL = `https://example-jb-dummy.s3.ap-northeast-2.amazonaws.com/profiles/${ranNum}.png`;
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
      return user;
    },
  },
};

export default resolvers;
