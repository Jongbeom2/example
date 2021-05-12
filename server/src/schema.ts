import path from 'path';
import { makeExecutableSchema, mergeTypeDefs, mergeResolvers, loadFilesSync } from 'graphql-tools';

const allTypeDefs = loadFilesSync(path.join(__dirname, 'api/**/*.graphql'), {
  extensions: ['graphql'],
});
const allResolvers = loadFilesSync(path.join(__dirname, 'api/**/*.resolvers.*'), {
  extensions: ['js', 'ts'],
});
const typeDefs = mergeTypeDefs(allTypeDefs);
const resolvers = mergeResolvers(allResolvers);
const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
