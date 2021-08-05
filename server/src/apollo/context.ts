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

// Websocket Context
type WebsocketContextFunction = (connection: any, payload: any) => GraphqlContext;
const websocketContext: WebsocketContextFunction = (connection, payload) => {
  const { isRefreshTokenValid, refreshToken } = authSocket(
    connection.context.Headers,
    payload.query,
  );
  return { isRefreshTokenValid, refreshToken, loaders };
};

// Graphql Context
type GrahpqlContextFunction = (req: any, res: any) => GraphqlContext;
const graphqlContext: GrahpqlContextFunction = (req, res) => {
  const { isRefreshTokenValid, refreshToken } = auth(req, res);
  return { req, res, isRefreshTokenValid, refreshToken, loaders };
};

// Context
type ContextFunction = (context: ContextFunctionParams) => GraphqlContext;
type ContextFunctionParams = {
  req?: any;
  res?: any;
  connection?: any;
  payload?: any;
};
export const context: ContextFunction = (ctx) => {
  const { req, res, connection, payload } = ctx;
  if (connection && payload) {
    return websocketContext(connection, payload);
  } else if (req && res) {
    return graphqlContext(req, res);
  } else {
    throw invalidContextError;
  }
};

export interface GraphqlContext {
  req?: any;
  res?: any;
  isRefreshTokenValid?: boolean;
  refreshToken?: string;
  loaders: {
    user: {
      byId: DataLoader<string, UserDoc>;
      byEmail: DataLoader<string, UserDoc>;
    };
    room: {
      byId: DataLoader<string, RoomDoc>;
    };
  };
}
