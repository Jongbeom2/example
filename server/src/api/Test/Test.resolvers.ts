import { Resolvers } from 'src/types/graphql';
const resolvers: Resolvers = {
  Query: {
    getTest: (_, args, ctx) => {
      return {
        content: 'Test',
        createdAt: Date.now(),
      };
    },
  },
};

export default resolvers;
