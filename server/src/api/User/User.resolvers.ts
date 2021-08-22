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
          // 쿠키값 저장함.
          const { refreshToken } = saveCookie(
            process.env.NODE_ENV === 'development',
            ctx,
            user._id.toString(),
          );
          // token refresh를 위해 refresh token 저장함.
          user.refreshToken = refreshToken;
          // 유저 정보 저장함.
          await user.save({ session });
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
          // 쿠키값 저장함.
          const { refreshToken } = saveCookie(
            process.env.NODE_ENV === 'development',
            ctx,
            user._id.toString(),
          );
          // token refresh를 위해 refresh token 저장함.
          user.refreshToken = refreshToken;
          // 유저 정보 저장함.
          await user.save({ session });
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
          // 쿠키값 저장함.
          const { refreshToken } = saveCookie(
            process.env.NODE_ENV === 'development',
            ctx,
            user._id.toString(),
          );
          // token refresh를 위해 refresh token 저장함.
          user.refreshToken = refreshToken;
          // 유저 정보 저장함.
          await user.save({ session });
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
      let user: UserDoc | null = null;
      try {
        await session.withTransaction(async () => {
          const { _id, fcmToken } = args.signOutInput;
          user = await UserModel.findById(_id, {}, { session });
          // 로그아웃은 제약조건 없이 항상 처리할 수 있도록 함.
          // 로그인 상태인데, 유저가 삭제된 경우 로그아웃 할 수 있어야함.
          if (user !== null) {
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
            // 유저 정보 저장함.
            await user.save({ session });
          }

          // 쿠키 삭제함.
          ctx.res?.clearCookie('accessToken');
          ctx.res?.clearCookie('refreshToken');
          ctx.res?.clearCookie('_id');
        });
        return user;
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
          const DEFAULT_PROFILE_URL = `/profile/${ranNum}.png`;
          const { _id, nickname, profileImageURL } = args.updateUserInput;
          user = await UserModel.findByIdAndUpdate(
            _id,
            {
              nickname,
              profileImageURL: profileImageURL || DEFAULT_PROFILE_URL,
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
      if (ctx.userId) {
        // 토큰을 재발급하기 위해서는 refreshToken이 유효해야하고 user의 refreshToken과 일치해야함.
        // 조건을 만족하는 경우만 accessToken을 발급함.
        const user = await UserModel.findById(ctx.userId);
        // _id에 해당하는 user 없음.
        if (user === null) {
          throw invalidUserIdError;
        }
        if (user.refreshToken === ctx.refreshToken) {
          refreshCookie(process.env.NODE_ENV === 'development', ctx, user._id.toString());
        }
        return user;
      } else {
        return null;
      }
    },
  },
};

export default resolvers;

const saveCookie = (
  isNodeEnvDevelopment: boolean,
  ctx: GraphqlContext,
  userId: string,
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateJWT(
    {
      userId,
    },
    COOKIE_DURATION_MILLISECONDS,
  );
  const refreshToken = generateJWT(
    {
      userId,
    },
    COOKIE_DURATION_MILLISECONDS,
  );
  ctx.res?.cookie('accessToken', accessToken, {
    maxAge: COOKIE_DURATION_MILLISECONDS,
    httpOnly: true,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  ctx.res?.cookie('refreshToken', refreshToken, {
    maxAge: COOKIE_REFRESH_TOKEN_DURATION_MILLISECONDS,
    httpOnly: true,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  ctx.res?.cookie('_id', userId, {
    maxAge: COOKIE_REFRESH_TOKEN_DURATION_MILLISECONDS,
    httpOnly: false,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  return {
    accessToken,
    refreshToken,
  };
};

const refreshCookie = (
  isNodeEnvDevelopment: boolean,
  ctx: GraphqlContext,
  userId: string,
): { accessToken: string } => {
  const accessToken = generateJWT(
    {
      userId,
    },
    COOKIE_DURATION_MILLISECONDS,
  );
  ctx.res?.cookie('accessToken', accessToken, {
    maxAge: COOKIE_DURATION_MILLISECONDS,
    httpOnly: true,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  ctx.res?.cookie('_id', userId, {
    maxAge: COOKIE_DURATION_MILLISECONDS,
    httpOnly: false,
    domain: isNodeEnvDevelopment ? undefined : '.jongbeom.com',
  });
  return {
    accessToken,
  };
};
