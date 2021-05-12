import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server';
import { Resolvers } from 'src/types/graphql';
import UserModel from 'src/models/User.model';
const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
const invalidUserEmailError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
const invalidUserPasswordError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
const existUserEmailError = new ApolloError('EXIST_USER_EMAIL', 'EXIST_USER_EMAIL');
const resolvers: Resolvers = {
  Query: {
    getUser: async (_, args, ctx) => {
      const user = await UserModel.findById(args._id);
      // _id에 해당하는 user 없음
      if (user === null) {
        throw invalidUserIdError;
      }
      return user;
    },
    login: async (_, args, ctx) => {
      const email = args.email;
      const password = args.password;
      const user = await UserModel.findOne({ email: email });
      // 존재하지 않는 user email
      if (user === null) {
        throw invalidUserEmailError;
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw invalidUserPasswordError;
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (_, args, ctx) => {
      const { nickname, email, password } = args.createUserInput;
      console.log(email);
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
      }).save();
      return user;
    },
  },
};

export default resolvers;
