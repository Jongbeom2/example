import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
import Axios from 'axios';
import { generateJWT } from 'src/lib/common';
const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
const invalidUserEmailError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
const invalidUserPasswordError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
const existUserEmailError = new ApolloError('EXIST_USER_EMAIL', 'EXIST_USER_EMAIL');
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
      });
      ctx.res.cookie('_id', user._id.toString(), {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      ctx.res.cookie('nickname', user.nickname, {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      ctx.res.cookie('thumbnailImageURL', user.thumbnailImageURL, {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
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
          thumbnailImageURL: data.kakao_account.profile.thumbnail_image_url,
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
      });
      ctx.res.cookie('_id', user._id.toString(), {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      ctx.res.cookie('nickname', user.nickname, {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      ctx.res.cookie('thumbnailImageURL', user.thumbnailImageURL, {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      return user;
    },
    signOut: async (_, args, ctx) => {
      ctx.res.clearCookie('accessToken');
      ctx.res.clearCookie('nickname');
      ctx.res.clearCookie('thumbnailImageURL');
      return null;
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
  },
};

export default resolvers;
