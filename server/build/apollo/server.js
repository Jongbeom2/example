"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("../middlewares/express"));
const schema_1 = require("../schema");
const context_1 = require("./context");
const colors_1 = __importDefault(require("colors"));
const PORT = process.env.PORT;
const apolloServer = new apollo_server_express_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.context,
    introspection: true,
    subscriptions: {
        // path: '/subscriptions',
        // https://github.com/apollographql/subscriptions-transport-ws#constructoroptions-socketoptions--socketserver
        onConnect: (connectionParams, websocket, connectionContext) => {
            // console.info('## WebSocket Connected');
            return { Headers: connectionContext.request.headers };
            // if (connectionParams.authToken) {
            //   return validateToken(connectionParams.authToken)
            //     .then(findUser(connectionParams.authToken))
            //     .then((user) => {
            //       return {
            //         currentUser: user,
            //       };
            //     });
            // }
            // throw new Error('Missing auth token!');
        },
        onDisconnect: (webSocket, context) => {
            console.info('## WebSocket Disconnected');
        },
        keepAlive: 3000,
    },
    formatError: (error) => {
        var _a;
        console.group('\x1b[31m%s\x1b[0m', 'Server Error');
        console.error('Path: ', error.path);
        console.error('Message: ', error.message);
        console.error('Code: ', (_a = error.extensions) === null || _a === void 0 ? void 0 : _a.code);
        console.error('Original Error: ', error.originalError);
        console.groupEnd();
        return error;
    },
    // https://stackoverflow.com/questions/59021384/how-to-pass-cookie-from-apollo-server-to-apollo-clenet
    // https://www.apollographql.com/docs/apollo-server/data/resolvers/#monitoring-resolver-performance,
    tracing: process.env.NODE_ENV === 'development',
    playground: {
        ...apollo_server_express_1.defaultPlaygroundOptions,
        settings: {
            ...apollo_server_express_1.defaultPlaygroundOptions.settings,
            'request.credentials': 'include',
            'editor.theme': 'dark',
            'editor.cursorShape': 'line',
            'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
            'editor.fontSize': 14,
            'editor.reuseHeaders': true,
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
    },
});
// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#applying-middleware
// /graphql path를 제외한 나머지 경로는 express가 담당함.
apolloServer.applyMiddleware({
    app: express_1.default,
    cors: false,
    path: '/graphql',
    bodyParserConfig: { limit: '1000mb' },
});
const startServer = () => {
    // Create a http server using express
    // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#subscriptions-with-additional-middleware
    const httpServer = http_1.default.createServer(express_1.default);
    apolloServer.installSubscriptionHandlers(httpServer);
    // ⚠️ Pay attention to the fact that we are calling 'listen' on the http server variable, and not on 'app'.
    // By the way, when subscription is not in use, app(the Express instance) usually calls listen method directly. e.g., app.listen(PORT, () => { });
    httpServer.listen(PORT, () => {
        var _a, _b, _c;
        console.log(`✔ Server ready at ${colors_1.default.blue.bold((_a = process.env.SERVER_DOMAIN) !== null && _a !== void 0 ? _a : '') +
            colors_1.default.blue.bold(apolloServer.graphqlPath)}`);
        console.log(`✔ Subscriptions ready at ${colors_1.default.blue.bold((_b = process.env.WEBSOCKET_SERVER_DOMAIN) !== null && _b !== void 0 ? _b : '') +
            colors_1.default.blue.bold((_c = apolloServer.subscriptionsPath) !== null && _c !== void 0 ? _c : '')}`);
    });
};
exports.startServer = startServer;
