import bcrypt from 'bcrypt';
import { Resolvers } from 'src/types/graphql';
import UserModel, { UserDoc } from 'src/models/User.model';
import Axios from 'axios';
import { generateJWT } from 'src/lib/common';
import appleSigninAuth from 'apple-signin-auth';
import {
  COOKIE_DURATION_MILLISECONDS,
  COOKIE_REFRESH_TOKEN_DURATION_MILLISECONDS,
} from 'src/lib/const';
import {
  invalidUserEmailError,
  invalidUserIdError,
  invalidUserPasswordError,
  existUserEmailError,
} from 'src/error/ErrorObject';
import { processLoadMany } from 'src/apollo/dataLoader';
import RoomModel, { RoomDoc } from 'src/models/Room.model';
import { startSession } from 'mongoose';
import { GraphqlContext } from 'src/apollo/context';
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
      const session = await startSession();
      let user: UserDoc | null;
      try {
        await session.withTransaction(async () => {
          const { email, password, fcmToken } = args.signInInput;
          user = await UserModel.findOne({ email: email }, {}, { session });
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
            const roomList = await RoomModel.find(
              { _id: { $in: user.roomIdList } },
              {},
              { session },
            );
            roomList.forEach((room) => {
              if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                room.fcmTokenList.push(fcmToken);
                promiseList.push(room.save({ session }));
              }
            });
            await Promise.all(promiseList);
          }
          // 유저 정보 저장함.
          await user.save({ session });
          // 유저 정보 쿠키에 저장함.
          saveCookie(process.env.NODE_ENV === 'development', ctx, user._id.toString());
        });
        return user!;
      } catch (err) {
        throw err;
      } finally {
        await session.endSession();
      }
    },
    signInWithKakao: async (_, args, ctx) => {
      const session = await startSession();
      let user: UserDoc | null;
      try {
        await session.withTransaction(async () => {
          const { accessToken: kakaoAccessToken, fcmToken } = args.signInWithKakaoInput;
          // accessToken으로 kakao user 정보 가져옴.
          const { data } = await Axios.get(`https://kapi.kakao.com/v2/user/me`, {
            headers: { Authorization: `Bearer ${kakaoAccessToken}` },
          });
          user = await UserModel.findOne({ kakaoId: data.id }, {}, { session });
          if (user === null) {
            user = await new UserModel({
              // data.kakao_account를 이용하면 다양한 정보를 가져올 수 있음
              // ex) data.kakao_account.profile.nickname
              //     data.kakao_account.profile.profile_image_url
              //     data.kakao_account.profile.thumbnail_image_url
              kakaoId: data.id,
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
            const roomList = await RoomModel.find(
              { _id: { $in: user.roomIdList } },
              {},
              { session },
            );
            roomList.forEach((room) => {
              if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                room.fcmTokenList.push(fcmToken);
                promiseList.push(room.save({ session }));
              }
            });
            await Promise.all(promiseList);
          }
          await user.save({ session });
          // 쿠키에 유저 정보 저장함.
          saveCookie(process.env.NODE_ENV === 'development', ctx, user._id.toString());
        });
        return user!;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    },
    signInWithApple: async (_, args, ctx) => {
      const session = await startSession();
      let user: UserDoc | null;
      try {
        await session.withTransaction(async () => {
          const { identityToken, fcmToken } = args.signInWithAppleInput;
          // identityToken apple user 정보 가져옴.
          const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(identityToken);
          user = await UserModel.findOne({ appleId: appleIdTokenClaims.sub }, {}, { session });
          if (user === null) {
            user = await new UserModel({
              // appleIdTokenClaims을 이용하면 다양한 정보를 가져올 수 있음
              // ex) appleIdTokenClaims.email
              appleId: appleIdTokenClaims.sub,
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
            const roomList = await RoomModel.find(
              { _id: { $in: user.roomIdList } },
              {},
              { session },
            );
            roomList.forEach((room) => {
              if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                room.fcmTokenList.push(fcmToken);
                promiseList.push(room.save({ session }));
              }
            });
            await Promise.all(promiseList);
          }
          await user.save({ session });
          // 쿠키에 유저 정보 저장함.
          saveCookie(process.env.NODE_ENV === 'development', ctx, user._id.toString());
        });
        return user!;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    },
    signOut: async (_, args, ctx) => {
      const session = await startSession();
      let user: UserDoc | null;
      try {
        await session.withTransaction(async () => {
          const { _id, fcmToken } = args.signOutInput;
          user = await UserModel.findById(_id, {}, { session });
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
            const roomList = await RoomModel.find(
              { _id: { $in: user.roomIdList } },
              {},
              { session },
            );
            roomList.forEach((room) => {
              room.fcmTokenList = room.fcmTokenList.filter((ele) => ele !== fcmToken);
              promiseList.push(room.save({ session }));
            });
            await Promise.all(promiseList);
          }
          await user.save({ session });
          // 유저 정보 쿠키에서 삭제함.
          ctx.res.clearCookie('accessToken');
          ctx.res.clearCookie('refreshToken');
          ctx.res.clearCookie('_id');
        });
        return user!;
      } catch (err) {
        throw err;
      } finally {
        await session.endSession();
      }
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
      const session = await startSession();
      let user: UserDoc | null;
      try {
        await session.withTransaction(async () => {
          const ranNum = Math.floor(Math.random() * 6);
          const DEFAULT_PROFILE_URL = `https://example-jb-dummy.s3.ap-northeast-2.amazonaws.com/profiles/${ranNum}.png`;
          const { _id, nickname, profileImageURL, profileThumbnailImageURL } = args.updateUserInput;
          user = await UserModel.findByIdAndUpdate(
            _id,
            {
              nickname,
              profileImageURL: profileImageURL || DEFAULT_PROFILE_URL,
              profileThumbnailImageURL: profileThumbnailImageURL || DEFAULT_PROFILE_URL,
            },
            { new: true, session },
          );
          // 존재하지 않는 user _id임.
          if (user === null) {
            throw invalidUserIdError;
          }
        });
        return user!;
      } catch (err) {
        throw err;
      } finally {
        await session.endSession();
      }
    },
    refreshAccessToken: async (_, args, ctx) => {
      // refreshToken 유효하고, db refreshToken과 같으면 accessToken 발급
      console.log(ctx.isRefreshTokenValid);
      console.log(ctx.refreshToken);
      return null;
    },
  },
};

export default resolvers;

const saveCookie = (isNodeEnvDevelopment: boolean, ctx: GraphqlContext, userId: string) => {
  const accessToken = generateJWT(
    {
      accessToken: true,
    },
    COOKIE_DURATION_MILLISECONDS,
  );
  const refreshToken = generateJWT(
    {
      refreshToken: true,
    },
    COOKIE_DURATION_MILLISECONDS,
  );
  ctx.res.cookie('accessToken', accessToken, {
    maxAge: COOKIE_DURATION_MILLISECONDS,
    httpOnly: true,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  ctx.res.cookie('refreshToken', refreshToken, {
    maxAge: COOKIE_REFRESH_TOKEN_DURATION_MILLISECONDS,
    httpOnly: true,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  ctx.res.cookie('_id', userId, {
    maxAge: COOKIE_DURATION_MILLISECONDS,
    httpOnly: false,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
};
