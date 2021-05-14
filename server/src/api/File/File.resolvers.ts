import createStorageConnection from 'src/middlewares/storage';
import { Resolvers } from 'src/types/graphql';
const resolvers: Resolvers = {
  Query: {
    getPresignedGetURL: async (_, args, ctx) => {
      const bucektParams = {
        Bucket: process.env.AWS_S3,
        Key: args.key,
        Expires: 60,
      };
      const presignedGetURL = createStorageConnection.getSignedUrl('getObject', bucektParams);
      return { presignedURL: presignedGetURL };
    },
    getPresignedPutURL: async (_, args, ctx) => {
      const bucektParams = {
        Bucket: process.env.AWS_S3,
        Key: args.key,
        Expires: 60,
      };
      const presignedPutURL = createStorageConnection.getSignedUrl('putObject', bucektParams);
      return { presignedURL: presignedPutURL };
    },
  },
};

export default resolvers;
