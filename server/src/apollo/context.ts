import shortid from 'shortid';
import { auth, authSocket } from 'src/apollo/auth';
import { invalidContextError } from 'src/error/ErrorObject';

const websocketContext = (connection: any, payload: any) => {
  // preserve until websocket disconnected
  // console.info(connection, payload);
  // connection.context; // this is the context which insert to onConnect triggered
  const my = authSocket(connection.context.Headers, payload.query);
  return { my };
};

// "context", "argument" variable names are different depends on Server Framework types.
// e.g., in Express, variable names are "req" and "res" but in Koa, Lambda, names are "request" and "response".

const graphqlContext = (req: any, res: any) => {
  // test only
  if (process.env.NODE_ENV === 'development') {
    // Cookie settings
    if (res.cookie) {
      res.cookie('contextLevelCookie1', 'contextLevelCookie1', {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 30,
      });
      res.cookie('contextLevelCookie2', 'contextLevelCookie2', {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 30,
      });
    }
  }
  const my = auth(req, res);

  return { req, res, my };
};

export const context = async (ctx: any) => {
  const { req, res, connection, payload } = ctx;
  if (connection) {
    return websocketContext(connection, payload);
  } else if (req && res) {
    return graphqlContext(req, res);
  } else {
    throw invalidContextError;
  }
};

export interface GraphqlContext {
  token?: any;
  my?: any;
  req: any;
  res: any;
  session: any;
}
