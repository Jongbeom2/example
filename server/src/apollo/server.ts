import { ApolloServer, defaultPlaygroundOptions } from 'apollo-server-express';
import http from 'http';
import app from 'src/middlewares/express';
import { schema } from 'src/schema';
import { context } from 'src/apollo/context';
import colors from 'colors';
import { logger } from 'src/middlewares/winston';

const PORT: string | undefined = process.env.PORT;
const apolloServer = new ApolloServer({
  schema,
  context,
  introspection: true,
  subscriptions: {
    // path: '/subscriptions',
    // https://github.com/apollographql/subscriptions-transport-ws#constructoroptions-socketoptions--socketserver
    onConnect: (connectionParams, websocket, connectionContext) => {
      logger.info('## WebSocket Connected');
      return { Headers: connectionContext.request.headers };
    },
    onDisconnect: (webSocket, context) => {
      logger.info('## WebSocket Disconnected');
    },
    keepAlive: 3000,
  },

  formatError: (error) => {
    logger.error(`Path: ${error.path}`);
    logger.error(`Message: ${error.message}`);
    logger.error(`Code: ${error.extensions?.code}`);
    logger.error(`Original Error: ${error.originalError}`);
    return error;
  },
  // https://stackoverflow.com/questions/59021384/how-to-pass-cookie-from-apollo-server-to-apollo-clenet
  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#monitoring-resolver-performance,
  tracing: process.env.NODE_ENV === 'development',
  playground: {
    ...defaultPlaygroundOptions,
    settings: {
      ...defaultPlaygroundOptions.settings,
      'request.credentials': 'include',
      'editor.theme': 'dark', // possible values: 'dark', 'light'
      'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
      'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
      'editor.fontSize': 14,
      'editor.reuseHeaders': true, // new tab reuses headers from last tab
      'general.betaUpdates': false,
      // 'prettier.printWidth': 80,
      // 'prettier.tabWidth': 2,
      // 'prettier.useTabs': false,
      // 'request.credentials': 'same-origin', // possible values: 'omit', 'include', 'same-origin'
      // schema.polling.enable: true, // enables automatic schema polling
      // 'schema.polling.enable': false,
      // 'schema.polling.endpointFilter': '*localhost*', // endpoint filter for schema polling
      // 'schema.polling.interval': 2000, // schema polling interval in ms
      // 'schema.disableComments': false,
      // 'tracing.hideTracingResponse': true,
      // 'tracing.tracingSupported': true, // set false to remove x-apollo-tracing header from Schema fetch requests
      'queryPlan.hideQueryPlanResponse': false,
    },
    // tabs: [
    //   {
    // endpoint: '', // string
    // query: '', // string
    // name?: '',// string
    // variables?: '',// string
    // responses?: '',// string[]
    // headers?: { ['key']: 'value' }
    //   },
    // ],
  },
});

// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#applying-middleware
// /graphql path를 제외한 나머지 경로는 express가 담당함.
apolloServer.applyMiddleware({
  app,
  cors: false, // Should be false to avoid conflicts with Express CORS middleware
  path: '/graphql',
  bodyParserConfig: { limit: '1000mb' },
});

const startServer = () => {
  // Create a http server using express
  // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#subscriptions-with-additional-middleware
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  // ⚠️ Pay attention to the fact that we are calling 'listen' on the http server variable, and not on 'app'.
  // By the way, when subscription is not in use, app(the Express instance) usually calls listen method directly. e.g., app.listen(PORT, () => { });

  httpServer.listen(PORT, () => {
    logger.info(`✔ Server ready at ${apolloServer.graphqlPath}`);
    logger.info(`✔ Subscriptions ready at ${apolloServer.subscriptionsPath ?? ''}`);
  });
};

export { startServer };
