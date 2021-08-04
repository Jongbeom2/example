import DataLoader from 'dataloader';
import { auth, authSocket } from 'src/apollo/auth';
import { invalidContextError } from 'src/error/ErrorObject';
import RoomModel, { RoomDoc } from 'src/models/Room.model';
import UserModel, { UserDoc } from 'src/models/User.model';
import { keyMapOneToOne, Loader } from './dataLoader';

// keyMap: 하나의 queryField에 대해서
// output이 하나 나온다면 keyMapOneToOne,
// 여러개 나온다면 keyMapOneToMany
const loaders = {
  user: {
    byId: Loader<UserDoc>({
      model: UserModel,
      queryField: '_id',
      keyMap: keyMapOneToOne,
    })(),
    byEmail: Loader<UserDoc>({
      model: UserModel,
      queryField: 'email',
      keyMap: keyMapOneToOne,
    })(),
  },
  room: {
    byId: Loader<RoomDoc>({
      model: RoomModel,
      queryField: '_id',
      keyMap: keyMapOneToOne,
    })(),
  },
};

const websocketContext = (connection: any, payload: any) => {
  // preserve until websocket disconnected
  // connection.context; // this is the context which insert to onConnect triggered
  const { isRefreshTokenValid, refreshToken } = authSocket(
    connection.context.Headers,
    payload.query,
  );
  return { isRefreshTokenValid, refreshToken, loaders };
};

// "context", "argument" variable names are different depends on Server Framework types.
// e.g., in Express, variable names are "req" and "res" but in Koa, Lambda, names are "request" and "response".

const graphqlContext = (req: any, res: any) => {
  const { isRefreshTokenValid, refreshToken } = auth(req, res);
  return { req, res, isRefreshTokenValid, refreshToken, loaders };
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
  isRefreshTokenValid?: any;
  refreshToken?: any;
  loaders: {
    user: {
      byId: DataLoader<string, UserDoc>;
      byEmail: DataLoader<string, UserDoc>;
    };
    room: {
      byId: DataLoader<string, RoomDoc>;
    };
  };
  req: any;
  res: any;
  session: any;
}
